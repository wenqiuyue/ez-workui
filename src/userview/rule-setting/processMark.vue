<template>
  <div id="process-mark">
    <div class="container">
      <div class="header">
        <div class="header_screen">
          <el-select placeholder="标记类型" v-model="requestParams.t" clearable>
            <el-option
              v-for="t in options.t"
              :key="t.value"
              :value="t.value"
              :label="t.label"
            ></el-option>
          </el-select>
          <el-select
            placeholder="进程组"
            v-model="requestParams.g"
            :loading="groupLoading"
            clearable
          >
            <el-option
              v-for="g in options.g"
              :key="g.Id"
              :value="g.Id"
              :label="g.Name"
            ></el-option>
          </el-select>
          <el-select
            placeholder="所属进程名"
            v-model="requestParams.pn"
            clearable
            filterable
          >
            <el-option-group
              v-for="group in options.pn"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
          <el-select placeholder="排序方式" v-model="requestParams.od">
            <el-option
              v-for="od in options.od"
              :key="od.value"
              :value="od.value"
              :label="od.label"
            ></el-option>
          </el-select>
          <el-input
            style="width: 17rem"
            v-model="requestParams.word"
            placeholder="关键词"
            clearable
          ></el-input>
          <el-button type="primary" :loading="searchBtn" @click="getData(true)"
            >搜索</el-button
          >
        </div>
        <el-button type="primary" plain @click="$modal.show('ruleXmodal')"
          >添加规则</el-button
        >
        <el-button type="primary" plain @click="editProgress('all')"
          >标记所有</el-button
        >
        <el-button type="primary" plain @click="editProgress('selection')"
          >标记选中</el-button
        >
      </div>
      <div class="table" v-loading="tableLoading">
        <el-table
          class="list_table"
          ref="elTable"
          border
          :data="table"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="ID"
            prop="ID"
            width="80"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="进程组"
            prop="ProgressGroupId"
            width="80"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="状态"
            prop="IsGNameStatus"
            width="80"
            align="center"
            header-align="center"
            ><template slot-scope="scope">
              {{ scope.row.IsGNameStatus ? "可用" : "不可用" }}
            </template></el-table-column
          >
          <el-table-column
            label="进程名"
            prop="Pname"
            show-overflow-tooltip
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="窗口名"
            prop="FormName"
            show-overflow-tooltip
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="标记名"
            prop="State"
            width="80"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="截图类型"
            prop="ImageType"
            width="80"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="清晰度"
            width="90"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              {{ showPixelRatio(scope.row.PixelRatio) }}
            </template>
          </el-table-column>
        </el-table>
        <c-pages
          slot="pages"
          v-model="pageData"
          @changeEvent="handlePaginationChange"
        ></c-pages>
      </div>
    </div>
    <!-- 弹框 -->
    <XModel
      isFixed
      showCrossBtn
      class="myXmodal"
      ref="xmodal"
      name="editProgressModal"
      title="标记进程"
    >
      <el-form
        v-show="xmodalTip.activeStep == 1"
        ref="editForm"
        :model="editParams"
        :rules="RULES"
        label-width="130px"
      >
        <el-form-item label="当前选择数量："
          >{{ xmodalTip.editCount }}条</el-form-item
        >
        <el-form-item label="配置的进程组：" prop="progressgroupId">
          <el-select
            placeholder="请选择配置的进程组"
            v-model="editParams.progressgroupId"
          >
            <el-option
              v-for="g in options.g"
              :key="g.Id"
              :value="g.Id"
              :label="g.Name"
              v-if="g.Id !== null"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="标记类型：" prop="t">
          <el-select
            v-model="editParams.t"
            placeholder="请选择"
            @change="editParams.g = null"
          >
            <el-option
              v-for="t in checkOptions.t"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item
          label="标记的进程组："
          prop="g"
          v-show="editParams.t === '进程组'"
        >
          <el-select
            placeholder="请选择标记的进程组（可多选）"
            multiple
            v-model="editParams.g"
          >
            <el-option
              v-for="g in options.g"
              :key="g.Id"
              :value="g.Id"
              :label="g.Name"
              v-if="g.Id !== null"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="成员(多选)："
          prop="g"
          v-show="editParams.t === '成员'"
        >
          <mb @Confirm="getUsers" :showActive="false" :teamId="teamValue">
            <div slot="button">
              <div v-if="editParams.g == null" class="mem-add">
                <i class="el-icon-plus"></i>
              </div>
              <p class="ttr-name">{{ showUsers }}</p>
            </div>
          </mb>
        </el-form-item>
        <el-form-item label="标记结果：" prop="mk">
          <el-select v-model="editParams.mk" placeholder="请选择">
            <el-option
              v-for="mk in checkOptions.mk"
              :key="mk.value"
              :label="mk.label"
              :value="mk.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：">
          <el-input v-model="editParams.word"></el-input>
        </el-form-item>
        <el-form-item label="所属进程名：">
          <el-select placeholder="请选择" v-model="editParams.pn" filterable>
            <el-option-group
              v-for="group in options.pn"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="截图类型：" v-show="editParams.t === '进程组'">
          <el-select v-model="editParams.pt" placeholder="请选择">
            <el-option
              v-for="pt in checkOptions.pt"
              :key="pt.value"
              :label="pt.label"
              :value="pt.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截图质量：" v-show="editParams.t === '进程组'">
          <el-select v-model="editParams.px" placeholder="请选择">
            <el-option
              v-for="px in checkOptions.px"
              :key="px.value"
              :label="px.label"
              :value="px.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" :loading="submitLoading"
            >立即标记</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 标记 -->
      <el-form
        v-show="xmodalTip.activeStep == 2"
        ref="form"
        :model="editParams"
        label-width="100px"
      >
        <el-form-item
          >本次操作将会覆盖工作记录{{ xmodalTip.work }}条，娱乐记录{{
            xmodalTip.entertain
          }}条，是否要覆盖</el-form-item
        >
        <el-form-item label="工作记录：" v-show="xmodalTip.work > 0">
          <el-switch v-model="editParams.setWk"></el-switch>
        </el-form-item>
        <el-form-item label="娱乐记录：" v-show="xmodalTip.entertain > 0">
          <el-switch v-model="editParams.setEt"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit">覆盖</el-button>
        </el-form-item>
      </el-form>
    </XModel>
    <ProRuleW :teamValue="teamValue" :selRow="selRow"></ProRuleW>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {
    CPages: () => import("@/components/CPages"),
    XModel: () => import("@/components/XModal"),
    mb: () => import("@/components/Selectors/MemberSelectCopy"),
    ProRuleW: () => import("./proRuleW.vue"),
  },
  props: {
    //规则版本信息
    selRow: {
      type: Object,
      default: null,
    },
    teamValue: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      table: [],
      requestParams: {
        p: 1, //当前页数
        c: 50, //单页数量
        word: null, //关键词
        g: null, //进程组ID
        t: null, //标记类型（工作，娱乐，未知）
        pn: null, //所属进程名
        od: "默认", //排序方式（默认，标记，进程名称，窗体名称，活跃度）
      },
      pagination: {
        totalCount: 0,
      },
      searchBtn: false, //搜索加载
      tableLoading: false, //表格加载
      submitLoading: false, //标记加载
      editSelection: [], //选择数据
      options: {
        t: [
          //标记类型
          {
            label: "娱乐",
            value: "娱乐",
          },
          {
            label: "未知",
            value: "未知",
          },
          {
            label: "工作",
            value: "工作",
          },
        ],
        od: [
          //排序方式
          {
            label: "默认",
            value: "默认",
          },
          {
            label: "标记",
            value: "标记",
          },
          {
            label: "进程名称",
            value: "进程名称",
          },
          {
            label: "窗体名称",
            value: "窗体名称",
          },
          {
            label: "活跃度",
            value: "活跃度",
          },
        ],
        pn: [
          //所属进程名
        ],
        g: [
          //进程组ID
        ],
      },
      checkOptions: {
        t: [
          {
            label: "进程组",
            value: "进程组",
          },
        ],
        mk: [
          //标记结果
          {
            label: "娱乐",
            value: "娱乐",
          },
          {
            label: "未知",
            value: "未知",
          },
          {
            label: "工作",
            value: "工作",
          },
        ],
        pt: [
          //截图类型
          {
            label: "黑白",
            value: "黑白",
          },
          {
            label: "彩色",
            value: "彩色",
          },
        ],
        px: [
          //清晰度
          {
            label: "原图",
            value: 1,
          },
          {
            label: "很高",
            value: 2,
          },
          {
            label: "高(推荐)",
            value: 3,
          },
          {
            label: "中",
            value: 4,
          },
          {
            label: "较低",
            value: 5,
          },
          {
            label: "低",
            value: 6,
          },
        ],
      },
      //标记
      editParams: {
        t: "进程组", //标记类型（进程组，成员）
        mk: null, //标记结果（工作，娱乐，未知）
        g: null, //	进程组ID数组 或 成员姓名数组（全部就传空数组）
        word: null, //关键词
        pn: null, //所属进程名
        cs: null, //进程记录ID数组
        pt: null, //截图类型（黑白，彩色）（类型为成员时不能设置此项）
        px: null, //截图质量（1-6）越小越清晰（类型为成员时不能设置此项）
        setWk: null, //是否覆盖工作进程（默认false）
        setEt: null, //是否覆盖娱乐进程（默认false）
        progressgroupId: null, //配置的进程组
      },
      xmodalTip: {
        editCount: 0, //修改总数
        activeStep: 1,
        work: 0,
        entertain: 0,
      },
      poxy: "", //代理
      showUsers: "",
      RULES: {
        mk: [
          {
            required: true,
            message: "请选择",
          },
        ],
        // progressgroupId: [
        //   {
        //     required: true,
        //     message: "请选择配置的进程组",
        //   },
        // ],
        // g: [
        //   {
        //     required: true,
        //     message: "请选择标记的进程组",
        //   },
        // ],
        t: [
          {
            required: true,
            message: "请选择",
          },
        ],
      },
      groupLoading: false,
    };
  },
  methods: {
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getData();
    },
    getUsers(users) {
      if (users.length) {
        this.editParams.g = [];
        this.showUsers = users
          .map((item) => {
            this.editParams.g.push(item.UName);
            return item.UName;
          })
          .join(",");
      } else {
        this.editParams.g = this.showUsers = null;
      }
    },
    filterParam(params) {
      let copy = { ...params };
      for (let o in copy) {
        if (copy[o] == null) delete copy[o];
        if (typeof copy[o] === "object") {
          copy[o] = JSON.stringify(copy[o]);
        }
      }
      return copy;
    },
    //获取进程组ID
    GetProgressGroup() {
      this.$http
        .post("/User/GetProgressGroupSelected.ashx", {
          teamId: this.teamValue,
          configId: this.selRow.Id,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.groupLoading = false;
            this.options.g = resp.data;
            this.options.g.unshift({
              Name: "全部进程组",
              Id: null,
            });
            this.requestParams.g = null;
          }
        });
    },
    //获取进程名
    async getProgress() {
      const resp = await this.$http.post("/Progress/GetProgress.ashx", {
        teamId: this.teamValue,
      });
      if (resp.res == 0) {
        this.options.pn = resp.data;
      }
    },
    //获取表格数据
    async getData(flag) {
      if (flag) {
        this.searchBtn = true;
        this.requestParams.p = 1;
      } else {
        this.requestParams.p = this.pageData.pageIndex;
      }
      this.requestParams.c = this.pageData.pageSize;
      this.tableLoading = true;
      axios.defaults.withCredentials = false;
      this.requestParams.teamId = this.teamValue;
      const resp = await axios.post(
        "/Progress/GetCsList.ashx",
        this.requestParams
      );
      if (resp.res == 0) {
        this.table = resp.data.items;
        if (this.requestParams.p == 1) {
          this.pagination.totalCount = resp.data.totalCount;
          this.pageData.totalNum = resp.data.totalCount;
        }
      }
      this.searchBtn = false;
      this.tableLoading = false;
    },
    //单页数量改变
    handleSizeChange(size) {
      this.tableLoading = true;
      this.requestParams.c = size;
      this.requestParams.p = 1;
      this.getData();
    },
    //页数
    handleCurrentChange(current) {
      this.tableLoading = true;
      this.requestParams.p = current;
      this.getData();
    },
    //多选
    handleSelectionChange(val) {
      this.editSelection = val;
    },
    //标记
    editProgress(type) {
      Object.assign(this.$data.editParams, this.$options.data().editParams);
      this.xmodalTip.activeStep = 1;
      this.submitLoading = false;
      this.showUsers = null;
      if (type === "all") {
        this.xmodalTip.editCount = this.pagination.totalCount;
        this.editParams.cs = [];
      } else if (type === "selection") {
        if (this.editSelection.length == 0) {
          this.$notify({
            type: "info",
            message: "未选中进程",
          });
          return;
        } else {
          this.editParams.cs = this.editSelection.map((item) => {
            return item.ID;
          });
          this.xmodalTip.editCount = this.editSelection.length;
        }
      }
      this.$modal.show("editProgressModal");
    },
    //标记前的检查
    async checkBeforeMark() {
      this.editParams.teamId = this.teamValue;
      const resp = await this.$http.post(
        "/Progress/CheckBeforeMark.ashx",
        this.editParams
      );
      this.submitLoading = false;
      if (resp.res == 0) {
        this.editParams.setEt = false;
        this.editParams.setWk = false;
        if (resp.data.pass) {
          //通过验证
          this.markProgress();
        } else {
          this.xmodalTip.activeStep = 2;
          this.xmodalTip.work = resp.data.work;
          this.xmodalTip.entertain = resp.data.entertain;
        }
      }
    },
    //提交标记
    async markProgress() {
      this.editParams.teamId = this.teamValue;
      const resp = await this.$http.post(
        "/Progress/MarkProgress.ashx",
        this.editParams
      );
      if (resp.res == 0) {
        this.$notify({
          type: "success",
          message: "标记成功",
        });
        this.getData();
        this.$modal.hide("editProgressModal");
      }
    },
    //提交标记
    onSubmit() {
      if (this.xmodalTip.activeStep == 1) {
        this.$refs["editForm"].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            this.checkBeforeMark();
          }
        });
      } else {
        this.submitLoading = true;
        this.markProgress();
      }
    },
    //清晰度
    showPixelRatio(value) {
      switch (value) {
        case "1":
          return "原图";
        case "2":
          return "很高";
        case "3":
          return "高";
        case "4":
          return "中";
        case "5":
          return "较低";
        case "6":
          return "低";
      }
    },
  },
  created() {
    this.poxy = process.env.VUE_APP_CMURL;
    this.getData();
    setTimeout(() => {
      this.GetProgressGroup();
      this.getProgress();
    }, 1000);
  },
};
</script>

<style lang="less" scoped>
.myXmodal {
  .tit {
    border-bottom: 1px solid #eee;
  }

  .el-select {
    width: 100%;
  }

  /deep/.el-input {
    width: 90%;
  }
}

#process-mark {
  box-sizing: border-box;
  height: 100%;
  .container {
    height: 100%;
    .header {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      margin-bottom: 1rem;
    }
    .header_screen {
      padding-right: 1rem;
      display: flex;
      /deep/.el-select {
        width: 17rem;
        margin-right: 1rem;
      }
      /deep/.el-input {
        width: initial;
        border: 1px solid #dcdfe6;
        .el-input__inner {
          background: #ffffff;

          border-radius: 0;

          &:focus {
            border-color: #ffffff !important;
          }
        }
      }

      .el-button {
        border-radius: 0 4px 4px 0;
      }
    }
    .table {
      height: calc(100% - 5rem);
      background: #ffffff;
      .list_table {
        width: 100%;
        height: calc(100% - 32px);
        overflow: auto;
      }
    }
    .pagination {
      height: 7rem;

      /deep/.el-input {
        .el-input__inner {
          background: #ffffff;
          border-color: #ffffff !important;

          &:focus {
            border-color: #ffffff !important;
          }
        }
      }
    }
  }
}
</style>
