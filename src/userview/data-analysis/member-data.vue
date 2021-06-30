<template>
  <div class="memberdata">
    <!-- 员工周期数据详情 -->
    <staffData
      v-if="!isListPage"
      @pageChange="pageChange"
      :selDate="selDate"
      :dateType="listdateType"
      :uid="clickUser"
      :clickUserName="clickUserName"
      :stime="stime"
      :etime="etime"
    ></staffData>
    <div
      class="content"
      v-else
      v-infinite-scroll="scrollLoad"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="30"
    >
      <div class="select-conditions">
        <div class="sel">
          <span>员工</span>
          <selMember
            size="small"
            @Confirm="getSelMember"
            :selRange="1"
            :arrays="selMem"
            :showLength="10"
          >
            <span slot="button" class="btn-custom">
              <i class="el-icon-plus"></i>
            </span>
          </selMember>
        </div>
        <div class="sel_inline">
          <div class="sel" v-if="isShowTeam">
            <span>团队</span>
            <div>
              <el-select
                v-model="teamValue"
                filterable
                placeholder="请选择团队"
              >
                <el-option
                  v-for="item in teamOptions"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="sel">
            <span>日期</span>
            <div class="sel-date">
              <el-select v-model="dateType">
                <el-option
                  v-for="(item, index) in $D.LIST('member_overview_date_type')"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                ></el-option>
              </el-select>
              <el-date-picker
                v-model="selDate"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                value-format="yyyy-MM-dd"
                v-if="dateType == 1"
                :clearable="false"
                @change="dateChange"
                :picker-options="{ firstDayOfWeek: 1 }"
              >
              </el-date-picker>
              <el-date-picker
                v-model="selDate"
                type="month"
                format="yyyy 年 MM 月"
                placeholder="选择月"
                value-format="yyyy-MM-dd"
                :clearable="false"
                :picker-options="pickOption"
                @change="dateChange"
                v-else
              >
              </el-date-picker>
            </div>
          </div>
          <el-button
            type="primary"
            class="btn"
            @click="handleGetData"
            :loading="loading"
            >搜 索</el-button
          >
        </div>
      </div>
      <div class="people_list" v-if="memberData && memberData.length">
        <div class="list_card" v-for="(item, index) in memberData" :key="index">
          <div class="people_info">
            <div class="name_pic">
              <el-avatar size="large" :src="$url + item.User.head"></el-avatar>
              <span class="name">{{ item.User.name }}</span>
            </div>
            <p>职位: {{ item.User.post }}</p>
            <el-button
              type="primary"
              size="mini"
              class="view_btn"
              @click="handleDataInfo(item)"
              >高级视图</el-button
            >
          </div>
          <div class="work_status">
            <div class="card_title"><span class="title">工作状态</span></div>
            <div class="work-calc">
              <MemWorkProgress
                :paramsobj="item"
                v-if="item.ComputerUsageRecord.workRat.length > 0"
                @getBar="getBarData"
              ></MemWorkProgress>
              <div v-else>
                <div class="progress-bar"></div>
                <div class="spans">
                  <span>工作</span><span>空闲</span><span>未知</span
                  ><span>离线</span>
                </div>
              </div>
            </div>
          </div>
          <div class="work_application">
            <div class="card_title">
              <span class="title">常用应用</span
              ><el-button
                type="text"
                size="small"
                @click.stop="handleAllSoftware(item)"
                v-if="item.CommonApps.length"
                >查看全部</el-button
              >
            </div>

            <div class="work_appl_list" v-if="item.CommonApps.length">
              <div
                class="w_a_l_card"
                v-for="(appitem, ind) in item.CommonApps"
                :key="ind"
              >
                <p class="time">{{ appitem.StayTime }}H</p>
                <div class="card_proportion">
                  <div
                    class="proportion"
                    :style="`height:${
                      item.WorkTime > 0
                        ? (appitem.StayTime / item.WorkTime) * 100 >= 100
                          ? 100
                          : (appitem.StayTime / item.WorkTime) * 100
                        : (5 - ind) * 20
                    }%`"
                  ></div>
                </div>
                <p class="card_name">
                  <tooltip
                    :content="`${appitem.AppName}`"
                    :ref="`memprop-${index}-${ind}`"
                    width="98%"
                  ></tooltip>
                </p>
              </div>
            </div>
            <div class="work_appl_list_empty" v-else>暂无数据</div>
          </div>
          <div class="work_keyword">
            <div class="card_title"><span class="title">高频关键词</span></div>
            <div class="keyword_list" v-if="item.KeyWordFreqs.length">
              <tooltip
                class="word_item"
                v-for="(worditem, wordind) in item.KeyWordFreqs"
                :key="wordind"
                @handleClick="handleKeyWord(worditem, item)"
                :content="`${worditem.Key}`"
                :ref="`memprop-${index}-${wordind}`"
                width="20%"
              ></tooltip>
            </div>
            <div class="work_appl_list_empty" v-else>暂无数据</div>
          </div>
        </div>
        <p v-if="loading" class="loading">
          <i class="el-icon-loading"></i>
          <span>加载中...</span>
        </p>
      </div>
      <div v-else>
        <p class="tip_text">暂无数据</p>
      </div>
    </div>
    <!-- 所有软件弹窗 -->
    <allsoftware :stime="stime" :etime="etime" :uid="clickUser"></allsoftware>
    <!-- 进程截图弹窗 -->
    <progresscom
      :activeBar="selWorkItem"
      :stime="stime"
      :etime="etime"
      :uid="clickUser"
    ></progresscom>
    <!-- 关键词使用频率 -->
    <keywordfrequency
      v-if="isListPage"
      :searchType="1"
      :datestart="stime"
      :dateend="etime"
      :uid="clickUser"
      :word="clickKeyWord"
      :pname="pname"
      :name="'meData'"
      :dateType="dateType"
    ></keywordfrequency>
  </div>
</template>
<script>
export default {
  components: {
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    tooltip: () => import("@/components/textTooltip"),
    progresscom: () => import("./progressCom"),
    allsoftware: () => import("./allsoftware"),
    MemWorkProgress: () => import("./memworkprogress"),
    keywordfrequency: () => import("./keywordfrequency"),
    staffData: () => import("./staffData"),
  },
  data() {
    return {
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
      selMem: [], //选择的成员
      pickOption: this.pickDate(),
      isListPage: true, //是否在列表页
      inputSearch: null, //搜索员工
      dateType: 1, //时间查询类型
      listdateType: 1, //卡片列表显示月、周类型
      selDate: new Date(),
      selDepart: [], //选择的部门
      selWorkItem: null, //点击工作状态5个分类的某一个分类
      loading: false, //加载
      busy: true,
      memberData: [], //成员数据
      pageData: {
        pageIndex: 1,
        pageSize: 20,
        pageNum: 0,
      }, //分页
      clickUser: null, //点击的用户
      clickUserName: null, //点击的用户名
      etime: null,
      stime: null,
      clickKeyWord: null, //要查看的关键词
      pname: null, //选择的关键词的窗口名
      isShowTeam: false, // 是否显示团队选择
    };
  },
  mounted() {
    const role = this.$xStorage.getItem("user-role");
    if (role.team) {
      this.isShowTeam = false;
    } else {
      this.isShowTeam = true;
    }
    this.getTeams();
  },
  methods: {
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/MembersTeamList.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
    /**
     * 获取列表数据
     */
    handleGetData() {
      this.memberData = [];
      this.getMemberData();
    },
    /**
     * 时间选择
     */
    dateChange(val) {
      // console.log(this.selDate);
      // console.log(val);
    },
    /**
     * 查看数据详情
     */
    handleDataInfo(val) {
      this.etime = val.etime;
      this.stime = val.stime;
      this.clickUserName = val.User.name;
      this.clickUser = val.User.id;
      this.pageChange(false);
    },
    /**
     * 视图切花
     */
    pageChange(val) {
      this.isListPage = val;
    },
    /**
     * 查看某个关键词
     */
    handleKeyWord(val, item) {
      console.log(val);
      this.etime = item.etime;
      this.stime = item.stime;
      this.clickUser = item.User.id;
      this.clickKeyWord = val.Key;
      this.pname = val.FocusFormName;
      this.$modal.show("meData");
    },
    /**
     * 查看全部软件
     */
    handleAllSoftware(item) {
      this.etime = item.etime;
      this.stime = item.stime;
      this.clickUser = item.User.id;
      this.$modal.show("allsoftware");
    },
    scrollLoad() {
      this.busy = true;
      this.pageData.pageIndex++;
      this.getMemberData();
    },
    /**
     *获取数据
     */
    getMemberData() {
      this.loading = true;
      let wk = null;
      //如果是按周查询，则wk获取组件传回的天数的前一天，按月查询，wk为组件传回的日期
      if (this.dateType == 1) {
        const seldate = new Date(this.selDate);
        wk = new Date(seldate.setDate(seldate.getDate() - 1)).timeFormat(
          "yyyy-MM-dd"
        );
      } else {
        wk = this.selDate;
      }
      const data = {
        p: this.pageData.pageIndex,
        c: this.pageData.pageSize,
        wk: wk,
        dt: this.dateType,
        u: JSON.stringify(this.selDepart),
        us: JSON.stringify(this.selMem.map((m) => m.UId)),
      };
      this.$http
        .get("/Company/MemberJob/MemberPeriod.ashx", {
          params: data,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.listdateType = this.dateType;
            if (resp.data.items.length) {
              resp.data.items.forEach((element) => {
                element.KeyWordFreqs = element.KeyWordFreqs.filter(
                  (s, index) => index <= 20
                );
                element.ComputerUsageRecord.workRat =
                  element.ComputerUsageRecord.workRat.map((m) => {
                    return {
                      name: m.name,
                      width: m.value.toFixed(2),
                      time: ((m.value * element.WorkTime) / 100).toFixed(1),
                    };
                  });
              });
            }
            this.memberData.push(...resp.data.items);
            if (resp.data.items.length < this.pageData.pageSize) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 选择成员
     */
    getSelMember(arr) {
      this.selMem = arr;
    },
    /**
    /**
     * 选择部门
     */
    getDepart(arr) {
      this.selDepart = arr.map((m) => m.RId);
    },
    pickDate() {
      let _this = this;
      return {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
      };
    },
    /**
     * 点击工作状态进度
     */
    getBarData(item, data) {
      if (item.name == "离线") {
        this.$message({
          type: "warning",
          message: "无法查看离线状态的详情",
        });
        return;
      }
      this.etime = data.etime;
      this.stime = data.stime;
      this.clickUser = data.clickUser;
      this.selWorkItem = item;
      this.$modal.show("memberDatatimeAxisPhoto");
    },
  },
};
</script>
<style lang="less" scoped>
.memberdata {
  height: 100%;
  /deep/.tooltip_text {
    font-size: 1.3rem;
  }
  .content {
    padding: 0px;
    height: calc(100% - 24px);
    overflow-y: auto;
    .select-conditions {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      background: #ffffff;
      padding: 5px 14px 0 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 5%);
      .sel_inline {
        display: flex;
        flex-direction: row;
        align-items: center;
        .btn {
          margin-left: 2rem;
        }
      }
      .sel {
        display: flex;
        border-bottom: 1px solid #eee;
        align-items: center;
        height: 5rem;
        box-sizing: border-box;
        padding-left: 1rem;
        // height: 5rem;padding-left: 1rem;

        span {
          color: #333;
          font-size: 1.4rem;
          font-weight: bold;
          margin-right: 1rem;
        }

        .el-tag {
          font-weight: normal;
          color: #409eff;
          font-size: 1.3rem;
        }
        /deep/#mem-public {
          border: none !important;

          .mem-add {
            display: none;
          }

          .c_button {
            display: flex;
            align-items: center;
            // margin-left: 1rem;
          }

          .avatar_small {
            img {
              width: 2.2rem;
              height: 2.2rem;
            }
          }
        }

        /deep/.main-box {
          border: none;

          .list {
            .el-tag {
              margin-bottom: 0;
            }
          }
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
          // margin-left: 1rem;

          i {
            font-size: 1.4rem;
            color: #6d6d6d;
          }

          &:hover {
            border-color: #409eff;

            i {
              color: #409eff;
            }
          }
        }
        .btn {
          margin-left: 2rem;
        }
        .sel-date {
          display: flex;

          /deep/.el-select {
            width: 10rem;

            /deep/.el-input__inner {
              border-radius: 4px 0 0 4px;
            }
          }

          /deep/.el-date-editor {
            /deep/.el-input__inner {
              border-radius: 0px 4px 4px 0px;
            }
          }
        }
      }
    }
    .people_list {
      // overflow-y: auto;
      // height: calc(100% - 105px);
      .list_card {
        background: #ffffff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 8px 12px;
        margin-bottom: 10px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 5%);
        // justify-content: space-around;
        // cursor: pointer;
        .card_title {
          font-weight: bold;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 8px;
          justify-content: space-between;
          .title {
            color: #333333;
            font-size: 1.3rem;
          }
          .el-button {
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        .people_info {
          width: 10%;
          padding-top: 5px;
          .name_pic {
            display: flex;
            flex-direction: row;
            align-items: center;
            .name {
              color: #333333;
              font-size: 1.6rem;
              margin-left: 8px;
              font-weight: bold;
            }
          }
          p {
            color: #666666;
            margin-top: 8px;
            font-size: 1.3rem;
            font-weight: bold;
          }
          /deep/.view_btn {
            margin-top: 6px;
            padding: 6px 11px;
          }
        }
        .work_time {
          width: 17%;
          padding-top: 8px;
          p {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 1.3rem;
            span:first-child {
              color: #666666;
            }
            span:last-child {
              color: #333333;
              margin-left: 3px;
            }
          }
        }
        .work_status {
          width: 27%;
        }
        .work_application {
          width: 22%;
          padding: 0 25px;
          .work_appl_list {
            display: flex;
            flex-direction: row;
            .w_a_l_card {
              width: 20%;
              display: flex;
              flex-direction: column;
              align-items: center;
              .time {
                color: #666666;
                font-weight: bold;
                font-size: 1.3rem;
              }
              .card_proportion {
                height: 47px;
                position: relative;
                width: 8px;
                .proportion {
                  background: #448ef5;
                  width: 8px;
                  position: absolute;
                  bottom: 0;
                }
              }
              .card_name {
                color: #333333;
                font-weight: bold;
                width: 100%;
                text-align: center;
                font-size: 1.3rem;
              }
            }
          }
        }
        .work_appl_list_empty {
          margin-top: 10px;
          // text-align: center;
        }
        .work_keyword {
          width: 20%;
          .keyword_list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            height: 80px;
            overflow-y: hidden;
            // padding-left: 8px;
            .word_item {
              margin-right: 8px;
              margin-bottom: 4px;
              cursor: pointer;
              &:hover {
                color: #448ef5;
              }
            }
          }
        }
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 1.4rem;
          margin-left: 5px;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
}
</style>
