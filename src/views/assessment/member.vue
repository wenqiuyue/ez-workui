<template>
  <!-- 菜单 -->
  <div id="my-assessment">
    <!-- 头部 -->
    <Header title="成员考核" titleEnglish="Member Assessment" class="baseHeader">
      <!--XBB: PC按钮组的插槽 -->
      <div slot="btnGroup">
        <a
          v-for="item in options.tab"
          :class="{ 'is-active': tabType == item.value }"
          @click.prevent="changeDispaly(item.value)"
        >
          <span>{{ item.label }}</span>
        </a>
        <a
          :href="$url + '/Work/Performance/PerformanceExport.ashx?Token=' + Token"
          v-show="tabType == 3"
        >
          <span>导出报表</span>
        </a>
      </div>
      <!--XBB: 移动端按钮组的插槽 -->
      <el-dropdown @command="changeDispaly" trigger="click" slot="dropdown">
        <el-button type="primary" size="small" style="margin-right: .5rem;">{{ headerTitle }}</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in options.tab"
            :command="item.value"
            :class="{ 'link-active': tabType == item.value }"
          >{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </Header>
    <c-content>
      <!-- 选项卡 搜索部分 -->
      <div class="search" slot="search">
        <div class="search-item">
		  <div class="t">
			  <span>开始日期</span>
			  <el-date-picker v-model="st" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :clearable="false"></el-date-picker>
			  <span>结束日期</span>
			  <el-date-picker v-model="et" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :clearable="false"></el-date-picker>
		  </div>
		  <el-button type="primary" size="medium" @click="searchBtn">搜 索</el-button>
        </div>
        <div class="search-item">
          <span>人员</span>
          <!-- <h6>筛选人员</h6> -->
          <SM :showLength="9" @Confirm="getMS" size="small" :showActiveImg="false">
            <template slot="button">
              <span class="btn-custom">
                <i class="el-icon-plus"></i>
              </span>
            </template>
          </SM>
        </div>
        <div class="search-item">
          <span>项目</span>
          <!-- <h6>筛选项目</h6> -->
          <SD @getResult="getSD">
            <template slot="button">
              <span class="btn-custom">
                <i class="el-icon-plus"></i>
              </span>
            </template>
          </SD>
        </div>
      </div>
      <!-- 主体表格部分 slot="main" -->
      <el-table
        v-if="tabType != 3"
        slot="main"
        border
        class="table"
        :data="tableData"
        v-loading="loading"
      >
        <template slot="empty" style="font-size: 0;">
          <div style="height:100%;">
            <img
              src="@/assets/img/emptyData.png"
              style="display: inline-block;width:50%;margin-top:100px;"
            />
          </div>
        </template>
        <el-table-column min-width="110" label="成员">
          <template slot-scope="scope">{{ scope.row.UserName }}</template>
        </el-table-column>
        <el-table-column min-width="110" label="部门" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.DeptName[0] }}</template>
        </el-table-column>
        <el-table-column v-if="tabType == 1" min-width="110" label="KPI项" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Name }}</template>
        </el-table-column>
        <el-table-column v-if="tabType == 2" min-width="110" label="投诉人" show-overflow-tooltip>
          <template
            slot-scope="scope"
          >{{ scope.row.ComplaintOr }}{{ scope.row.Type == 2 ? '(半匿名)' : '' }}</template>
        </el-table-column>
        <el-table-column min-width="110" label="描述">
          <template slot-scope="scope">{{ scope.row.Describe?scope.row.Describe:'无' }}</template>
        </el-table-column>
        <el-table-column min-width="110" label="时间">
          <template
            slot-scope="scope"
          >{{ scope.row.Times && scope.row.Times.timeFormat('yyyy-MM-dd HH:mm') }}</template>
        </el-table-column>
        <el-table-column min-width="110" label="状态">
          <template slot-scope="scope">{{ scope.row.StatusName }}</template>
        </el-table-column>
        <el-table-column min-width="110" label="操作">
          <template slot-scope="scope">
            <div class="cell">
              <el-button
                class="el-button--text"
                size="medium"
                @click="handleDetail(scope.$index, scope.row)"
              >详细</el-button>
              <!-- <el-button v-if="scope.row.Status == 3" class="el-button--text cel-over" size="medium">已撤销</el-button> -->
              <el-button
                v-if="scope.row.permissions"
                class="el-button--text"
                size="medium"
                @click="toExamine(scope.$index, scope.row)"
              >审核</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 主体表格部分 效绩报表 -->
      <!-- 统计所有选择人员（按部门，按成员选） 在某个时间段的KPI考核数据：
			成员（头像+名字）|绩效分数|4星以上的任务数|2-3星的|2星以下的|任务质量均分|任务效率均分|被投诉（通过的投诉/投诉总数）|举报次数（通过的投诉/投诉总数）
      详细可查看某人的每个考核项的一个列表-->
      <el-table v-else slot="main" border class="table" :data="tableData" v-loading="loading">
        <template slot="empty" style="font-size: 0;">
          <div style="height:100%;">
            <img
              src="@/assets/img/emptyData.png"
              style="display: inline-block;width:50%;margin-top:100px;"
            />
          </div>
        </template>
        <el-table-column min-width="100" label="成员">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center;">
              <img
                v-lazy="$url + scope.row.Picture"
                style="width: 3rem;height: 3rem;border-radius: 50%;margin-right: 0.5rem;"
              />
              {{ scope.row.Name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="部门" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              v-for="(name, index) in scope.row.DeptName"
            >{{ name }}{{ index == scope.row.DeptName.length - 1 ? '' : ',' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="绩效">
          <template slot-scope="scope">
            <p>分数：{{ scope.row.TotalScore }}</p>
            <p>现金：{{ scope.row.TotalMoney }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="120" label="4星以上的任务">
          <template slot-scope="scope">
            <p>效率：{{ scope.row.FourStar }}个</p>
            <p>质量：{{ scope.row.QualityFourStar }}个</p>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="2-3星的任务">
          <template slot-scope="scope">
            <p>效率：{{ scope.row.ThreeStar }}个</p>
            <p>质量：{{ scope.row.QualityThreeStar }}个</p>
          </template>
        </el-table-column>
        <el-table-column min-width="120" label="2星以下的任务">
          <template slot-scope="scope">
            <p>效率：{{ scope.row.OneStar }}个</p>
            <p>质量：{{ scope.row.QualityOneStar }}个</p>
          </template>
        </el-table-column>
        <el-table-column min-width="110" label="任务质量均分">
          <template
            slot-scope="scope"
          >{{ scope.row.QualityScore && scope.row.QualityScore.toFixed(2) }}分</template>
        </el-table-column>
        <el-table-column min-width="110" label="任务效率均分">
          <template
            slot-scope="scope"
          >{{ scope.row.EfficiencyScore && scope.row.EfficiencyScore.toFixed(2) }}分</template>
        </el-table-column>
        <el-table-column min-width="100" label="被投诉次数">
          <template slot-scope="scope">
            <p>通过：{{ scope.row.PassComplaints }}次</p>
            <p>总数：{{ scope.row.TotalComplaints }}次</p>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="投诉次数">
          <template slot-scope="scope">
            <p>通过：{{ scope.row.PassReport }}次</p>
            <p>总数：{{ scope.row.TotalReport }}次</p>
          </template>
        </el-table-column>
        <el-table-column min-width="60" label="操作">
          <template slot-scope="scope">
            <div class="cell">
              <el-button
                class="el-button--text"
                size="medium"
                @click="handleDetail(scope.$index, scope.row)"
              >详细</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <c-pages slot="pages" v-model="pageData" @childEvent="getData(tabType)"></c-pages>
    </c-content>
    <!-- 成员考核或投诉详情弹框 -->
    <XM id="dialogDetail" :title="tabType == 1 ? '考核详情' : '投诉详情'" name="dialogDetail" showCrossBtn>
      <div class="detail-tr">
        <div class="detail-td-title">成&nbsp;&nbsp;&nbsp;&nbsp;员：</div>
        <div class="detail-td-info">{{ dialogData.UserName }}</div>
      </div>
      <div class="detail-tr" v-show="tabType == 2">
        <div class="detail-td-title">投诉人：</div>
        <div class="detail-td-info">{{ dialogData.ComplaintOr }}</div>
      </div>
      <div class="detail-tr">
        <div class="detail-td-title">部&nbsp;&nbsp;&nbsp;&nbsp;门：</div>
        <div class="detail-td-info">
          <span
            style="margin:0 0.5rem 0.5rem 0;"
            v-for="(name, index) in dialogData.DeptName"
          >{{ name }}{{ index == dialogData.DeptName.length - 1 ? '' : '，' }}</span>
        </div>
      </div>
      <div class="detail-tr" v-show="tabType == 1">
        <div class="detail-td-title">KPI&nbsp;&nbsp;&nbsp;项：</div>
        <div class="detail-td-info">{{ dialogData.Name }}</div>
      </div>
      <div class="detail-tr">
        <div class="detail-td-title">时&nbsp;&nbsp;&nbsp;&nbsp;间：</div>
        <div class="detail-td-info">{{ dialogData.Times.timeFormat('yyyy-MM-dd HH:mm') }}</div>
      </div>
      <div class="detail-tr">
        <div class="detail-td-title">状&nbsp;&nbsp;&nbsp;&nbsp;态：</div>
        <div class="detail-td-info">{{ dialogData.StatusName }}</div>
      </div>
      <div class="detail-tr" v-show="tabType == 1">
        <div class="detail-td-title">KPI描述：</div>
        <div class="detail-td-info">{{ dialogData.Describe }}</div>
      </div>
      <div class="detail-tr">
        <div class="detail-td-title">{{ dialogData.Type == 1 ? '考核' : '投诉' }}原因：</div>
        <FroalaView :html="dialogData.Content"></FroalaView>
      </div>
    </XM>
    <!-- 成员考核或投诉详情弹框 -->
    <XM
      isFixed
      height="80%"
      id="dialogDetail"
      :title="tabType == 1 ? '申诉审核' : '投诉审核'"
      name="examine"
      showCrossBtn
    >
      <div v-loading="examineLoading">
        <div class="detail-tr">
          <div class="detail-td-title">{{ tabType == 1 ? '考 核 人' : '投 诉 人' }}：</div>
          <div class="detail-td-info">{{ dialogDetail.AssessedName }}</div>
        </div>
        <div class="detail-tr">
          <div class="detail-td-title">{{ tabType == 1 ? '被考核人' : '被投诉人' }}：</div>
          <div class="detail-td-info">{{ dialogDetail.BeAssessedName }}</div>
        </div>
        <div class="detail-tr" v-show="tabType == 1">
          <div class="detail-td-title">KPI项：</div>
          <div class="detail-td-info">{{ dialogDetail.KPIName }}</div>
        </div>
        <div class="detail-tr" v-show="tabType == 1">
          <div class="detail-td-title">类型：</div>
          <div class="detail-td-info">{{ dialogDetail.TypeName }}</div>
        </div>
        <div class="detail-tr">
          <div class="detail-td-title">{{ tabType == 1 ? '申诉' : '投诉' }}理由：</div>
          <div class="detail-td-info">
            <FroalaView :html="dialogDetail.Reason"></FroalaView>
          </div>
        </div>
        <!-- 审批操作 -->
        <div v-if="dialogDetail.Status == 2">
          <div class="detail-tr">
            <div class="detail-td-title">审核结果：</div>
            <div class="detail-td-info">
              <el-switch
                v-model="formData.Status"
                active-color="#448EF5"
                inactive-color="#fc4c4d"
                :active-value="1"
                :inactive-value="2"
              ></el-switch>
              <span style="margin-left: 0.5rem;">{{ formData.Status == 1 ? '通过' : '未通过' }}</span>
              <div class="tr" v-if="tabType == 2 && formData.Status == 1">
                <div class="td-title">对被投诉人添加考核：</div>
                <div class="td-info">
                  <el-select v-model="formData.KId" ref="kpiSelect">
                    <el-option v-for="item in KPIList" :value="item.Id" :label="item.Name"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-tr">
            <div class="detail-td-title">审核理由：</div>
            <div class="detail-td-info">
              <el-input v-model="formData.AuditRemark" type="textarea" placeholder="请输入评语或留言"></el-input>
            </div>
          </div>
          <div class="detail-tr">
            <div class="detail-td-title">操&nbsp;&nbsp;&nbsp;&nbsp;作：</div>
            <div class="detail-td-info">
              <el-button
                :loading="btndisabled"
                type="primary"
                size="small"
                plain
                @click="approval()"
              >确认审核</el-button>
            </div>
          </div>
        </div>
        <!-- 记录 -->
        <div class="records" v-for="r in dialogDetail.Data">
          <div class="detail-tr">
            <div class="detail-td-title">时&nbsp;&nbsp;&nbsp;&nbsp;间：</div>
            <div class="detail-td-info">{{ r.Times.timeFormat('yyyy-MM-dd HH:mm') }}</div>
          </div>
          <div class="detail-tr">
            <div class="detail-td-title">结&nbsp;&nbsp;&nbsp;&nbsp;果：</div>
            <div class="detail-td-info">
              <span v-if="r.Status == 1" class="success">通过</span>
              <span v-else class="err">未通过</span>
            </div>
          </div>
          <div class="detail-tr">
            <div class="detail-td-title">理&nbsp;&nbsp;&nbsp;&nbsp;由：</div>
            <div class="detail-td-info">{{ r.AuditRemark }}</div>
          </div>
        </div>
      </div>
    </XM>

    <!-- 报表成员正常的考核列表 -->
    <XM id="memberDetail" title="考核列表" name="memberDetail" showCrossBtn>
      <el-table border :data="memberData" v-loading="modalLoading">
        <el-table-column min-width="60" label="KPI项" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Name }}</template>
        </el-table-column>
        <el-table-column min-width="60" label="KPI描述" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Describe }}</template>
        </el-table-column>
        <el-table-column min-width="50" label="类型">
          <template slot-scope="scope">{{ scope.row.TypeName }}</template>
        </el-table-column>
        <el-table-column min-width="50" label="分值" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.IsAdd == 1" style="color: #67C23A;">+{{ scope.row.Score }}</p>
            <p v-if="scope.row.IsAdd == 2" style="color: #F56C6C;">-{{ scope.row.Score }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="50" label="现金奖惩" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.IsAdd == 3" style="color: #67C23A;">+{{ scope.row.Score }}</p>
            <p v-if="scope.row.IsAdd == 4" style="color: #F56C6C;">-{{ scope.row.Score }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Times.timeFormat('yyyy-MM-dd HH:mm') }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        :hide-on-single-page="memberPageData.total / memberPageData.PageSize < 1"
        :total="memberPageData.total"
        :page-size="memberPageData.PageSize"
        @current-change="getMemberList"
        layout="prev, pager, next"
      ></el-pagination>
    </XM>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/manager/com/CContent"),
    CPages: () => import("@/manager/com/CPages"),
    FroalaView: () => import("@/components/XFroalaView"),
    XM: () => import("@/components/XModal"),
    SM: () => import("@/components/Selectors/MemberSelect"),
    SD: () => import("@/components/Selectors/DepartmentSelector"),
  },
  data() {
    return {
      loading: false,
      btndisabled: false,
      modalLoading: false,
      examineLoading: false,
      options: {
        tab: [
          {
            value: 1,
            label: "成员考核",
          },
          {
            value: 2,
            label: "成员投诉",
          },
          {
            value: 3,
            label: "效绩报表",
          },
        ],
      },
      tableData: [],
      memberData: [],
      st:'',
	  et:'',
      tabType: 1,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
        STime: dayjs().startOf("month").format("YYYY-MM-DD"),
        ETime: dayjs().endOf("month").format("YYYY-MM-DD"),
        UserName: null,
        DeptName: null,
      },
      dialogData: {
        //详情数据
        Times: "x",
      },
      dialogDetail: {
        //审核数据
      },
      //当前操作的行对象
      nowObj: {
        index: -1,
        data: {},
      },
      memberPageData: {
        total: 0,
        PageIndex: 1,
        PageSize: 6,
      },
      formData: {
        AuditRemark: null,
        Status: 1,
        Id: null,
        KId: null,
        KPIRemark: null,
      },
      KPIList: [],
      headerTitle: "成员考核",
      Token: null,
    };
  },
  methods: {
    //部门选择器
    getSD(val) {
      if (val.length) {
        this.pageData.DeptName = val.map((i) => {
          return i.RId;
        });
      } else {
        this.pageData.DeptName = null;
      }
      // this.pageData.pageIndex = 1;
      // this.getData(this.tabType);
    },
    //成员选择器
    getMS(val) {
      if (val.length) {
        this.pageData.UserName = val.map((i) => {
          return i.UId;
        });
      } else {
        this.pageData.UserName = null;
      }
      // this.pageData.pageIndex = 1;
      // this.getData(this.tabType);
    },
    //查询
    searchBtn(value) {
      // if (value) {
      //   this.pageData.STime = value[0];
      //   this.pageData.ETime = value[1];
      // } else {
      //   this.pageData.STime = this.pageData.ETime = null;
      // }
	   this.pageData.pageIndex = 1;
      this.getData(this.tabType);
    },
    //选项卡
    changeDispaly(val) {
      // Object.assign(this.$data.pageData, this.$options.data().pageData);
      // this.value1 = [];
      // this.value1.push(
      // 	dayjs()
      // 		.startOf('month')
      // 		.format('YYYY-MM-DD')
      // );
      // this.value1.push(
      // 	dayjs()
      // 		.endOf('month')
      // 		.format('YYYY-MM-DD')
      // );
      this.pageData.pageIndex = 1;
      this.headerTitle = this.options.tab[val - 1].label;
      this.getData(val);
    },
    //审核
    toExamine(index, data) {
      this.nowObj.index = index;
      this.nowObj.data = data;
      this.$modal.show("examine");
      Object.assign(this.$data.formData, this.$options.data().formData);
      this.getList(data.Status);
    },
    //更新审核列表
    async getList(statu) {
      this.examineLoading = true;
      let resp = {};
      if (this.tabType == 1) {
        resp = await this.$http.post("/Work/Performance/getAssessRecord.ashx", {
          Id: this.nowObj.data.UId,
        });
      } else if (this.tabType == 2) {
        resp = await this.$http.post(
          "/Work/Performance/getcomplaintsRecord.ashx",
          {
            Id: this.nowObj.data.UId,
          }
        );
      }
      if (resp.res == 0) {
        if (this.tabType == 2) {
          this.$http
            .post("/Work/Performance/userKPISelect.ashx", {
              UsId: [resp.data.BeAssessedId],
              Type: 2,
            })
            .then((res) => {
              if (res.res == 0) {
                this.KPIList = res.data;
              }
            });
        }
        this.examineLoading = false;
        this.dialogDetail = resp.data;
        this.formData.Id = resp.data.AId;
        this.dialogDetail["Status"] = statu;
      }
    },
    //详细
    handleDetail(index, data) {
      this.nowObj.index = index;
      this.nowObj.data = data;
      if (this.tabType == 3) {
        this.memberPageData["UsId"] = data.UsId;
        this.$modal.show("memberDetail");
        this.getMemberList();
      } else {
        this.dialogData = data;
        this.$modal.show("dialogDetail");
      }
    },
    //获取数据
    getData(type) {
      this.loading = true;
      let params = {
        PageIndex: this.pageData.pageIndex,
        PageSize: this.pageData.pageSize,
        STime: this.st,
        ETime: this.et,
        DeptName: this.pageData.DeptName,
        UserName: this.pageData.UserName,
        Type: type,
      };
      this.$http
        .post("/Work/Performance/queryUserAssess.ashx", params)
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.Data;
            this.tabType = type;
            this.pageData.totalNum = resp.data.TotalCount;
            this.loading = false;
          }
        });
    },
    async approval() {
      this.btndisabled = true;
      let resp = {};
      if (this.tabType == 2 && this.formData.Status == 1) {
        if (!this.formData.KId) {
          //没有选KPI
          this.$notify({
            type: "info",
            message: "请对被投诉人添加考核",
          });
          this.$refs.kpiSelect.focus();
          this.btndisabled = false;
          return;
        } else {
          this.formData.KPIRemark = this.dialogDetail.Reason;
        }
      }
      if (this.tabType == 1) {
        resp = await this.$http.post(
          "/Work/Performance/auditAppealAssess.ashx",
          this.formData
        );
      } else {
        resp = await this.$http.post(
          "/Work/Performance/auditComplaints.ashx",
          this.formData
        );
      }
      this.btndisabled = false;
      if (resp.res == 0) {
        this.$notify({
          message: "审批成功",
          type: "success",
        });
        this.tableData[this.nowObj.index].Flag = false;
        if (this.formData.Status == 1) {
          this.tableData[
            this.nowObj.index
          ].Status = this.dialogDetail.Status = 4;
          this.tableData[
            this.nowObj.index
          ].StatusName = this.dialogDetail.StatusName = "审核通过";
        } else {
          this.tableData[
            this.nowObj.index
          ].Status = this.dialogDetail.Status = 5;
          this.tableData[
            this.nowObj.index
          ].StatusName = this.dialogDetail.StatusName = "审核驳回";
        }
        this.getList();
      }
    },
    getMemberList(page) {
      this.memberPageData.PageIndex = page ? page : 1;
      this.modalLoading = true;
      this.$http
        .post("/Work/Performance/userKPIDetail.ashx", this.memberPageData)
        .then((resp) => {
          if (resp.res == 0) {
            this.memberData = resp.data.Data;
            this.memberPageData.total = resp.data.TotalCount;
            this.modalLoading = false;
          }
        });
    },
  },
  created() {
    // this.value1 = [];
    // this.value1.push(dayjs().startOf("month").format("YYYY-MM-DD"));
    // this.value1.push(dayjs().endOf("month").format("YYYY-MM-DD"));
	this.st=dayjs().startOf("month").format("YYYY-MM-DD")
	this.et=dayjs().endOf("month").format("YYYY-MM-DD")
    this.getData(this.tabType);
    this.Token = this.$xStorage.getItem("token");
  },
};
</script>
<style lang="less" scoped>
@import "./comm.less";
#memberDetail {
  /deep/.ctn {
    border-top: 1px solid #eee;
    padding: 20px 10px 20px 10px;
  }

  .el-pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
}

#my-assessment {
  margin-top: 2rem;
  width: 100%;
  height: calc(100% - 2rem);
  .is-active {
    color: #409eff;
    border-top-color: #448ef5;
  }
  /deep/.cx-content {
    margin: 0 1rem 0 1rem;

    /deep/.title-box {
      border-bottom: none;
      padding-bottom: 0;

      .search {
        background-color: #ffffff;
        padding: 0 1rem;
        .search-item + .search-item {
          border-top: 1px solid #eee;
        }
		.search-item:nth-of-type(1){
			display: flex;
			justify-content: space-between;
		}
        .search-item {
          display: flex;
          align-items: center;
          padding: 1rem 0;
          &>span,.t>span {
            color: #333;
            font-size: 1.4rem;
            font-weight: bold;
            margin-right: 1.5rem;
            white-space: nowrap;
           }
          .el-date-editor {
			width: 14rem;
			margin-right: 2rem;
			/deep/ .el-input__inner{
				border:1px solid #DCDFE6 !important;
				
			}
           }
          .mem-add {
            display: none;
          }
          .location {
            align-items: center;
          }
          .btn-custom {
            width: 35px;
            height: 20px;
            display: block;
            border: 1px solid #ccc;
            border-radius: 0.6rem;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s;
            i {
              font-size: 1.4rem;
              color: #6d6d6d;
            }
            &:hover {
              border-color: #409eff;
            }
          }
        }
      }
    }
  }

  .el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    padding-left: 0 !important;
    padding-right: 10px;

    .cel-over {
      cursor: initial;
      color: #909399;
    }
  }
}
@media screen and (max-width: 1440px) {
  #my-assessment {
    /deep/.cx-content {
      /deep/.title-box {
      }
    }
  }
}
@media screen and (max-width: 991px) {
  #my-assessment {
    /deep/.cx-content {
      .title-box {
        // min-height: 0;
      }
    }
  }
}
</style>
