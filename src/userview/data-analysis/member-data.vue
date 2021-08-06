<template>
  <div class="memberdata">
    <XHeader title="数据分析" titleEnglish="Data Analysis" class="baseHeader">
    </XHeader>
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
      :teamId="teamValue"
    ></staffData>
    <div
      class="mem_content"
      v-else
      v-infinite-scroll="scrollLoad"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="30"
    >
      <div class="select-conditions">
        <div class="sel_inline">
          <div class="sel" v-if="isShowTeam">
            <span>团队</span>
            <div>
              <el-select
                v-model="teamValue"
                filterable
                placeholder="请选择团队"
                @change="handleTeamChange"
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
          <div class="sel" v-if="teamValue" style="margin-left: 8px">
            <span>员工</span>
            <selMember
              :teamId="teamValue"
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
        </div>
        <div class="sel_inline" style="justify-content: space-between">
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
                v-show="dateType == 1"
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
                v-show="dateType == 2"
              >
              </el-date-picker>
              <el-date-picker
                v-model="DateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-show="dateType == 3"
              >
              </el-date-picker>
            </div>
            <el-button
              type="primary"
              class="btn"
              @click="handleGetData"
              :loading="loading"
              >搜 索</el-button
            >
          </div>
          <el-button
            type="text"
            style="float: right"
            @click="$modal.show('ranking')"
            ><i class="hiFont hi-jiangpaipaiming"></i> 效率排名</el-button
          >
        </div>
      </div>
      <div class="people_list" v-if="memberData && memberData.length">
        <div class="list_card" v-for="(item, index) in memberData" :key="index">
          <div class="tag_item_list" @click="handleDataInfo(item)">
            <div class="tag_item t_i_bg1" style="width: 13rem"></div>
            <div class="tag_item t_i_bg2" style="width: 12rem"></div>
            <div class="tag_item t_i_bg3" style="width: 11rem">
              <div>高级视图</div>
            </div>
          </div>
          <div class="people_info">
            <div class="name_pic">
              <el-avatar
                size="small"
                :src="imgChange(item.User.head, true)"
              ></el-avatar>
              <span class="name">{{ item.User.name }}</span>
            </div>
            <p>
              客户端状态：<span
                :style="`color:${
                  item.ClientStatus == 1 ? '#67C23A' : '#666666'
                }`"
                >{{ $D.ITEM("client_status", item.ClientStatus).name }}</span
              >
            </p>
            <p>
              鼠标点击效率：<span
                :style="`color:${getEfficiencyColor(item.EfficiencyMStatus)}`"
                >{{
                  item.EfficiencyMStatus ? item.EfficiencyMStatus : "无"
                }}</span
              >
            </p>
            <p>
              键盘输入效率：<span
                :style="`color:${getEfficiencyColor(item.EfficiencyKStatus)}`"
                >{{
                  item.EfficiencyKStatus ? item.EfficiencyKStatus : "无"
                }}</span
              >
            </p>
            <p>
              行为状态：<span
                :style="`color:${getbehaviorColor(item.BehaviorStatus)}`"
                >{{ item.BehaviorStatus ? item.BehaviorStatus : "无" }}</span
              >
            </p>
            <!-- <el-button
              type="primary"
              size="mini"
              class="view_btn"
              @click="handleDataInfo(item)"
              >高级视图</el-button
            > -->
          </div>
          <div class="work_time">
            <p>
              <span>当前进程：</span>
              <tooltip
                :content="`${item.ProcessName ? item.ProcessName : '无'}`"
                :ref="`memdata-${index}`"
                width="70%"
              ></tooltip>
            </p>
            <p v-if="item.ClientStatus == 1">
              <span class="screen_check">
                <el-checkbox-group v-model="screenCheck">
                  <el-checkbox label="屏幕"></el-checkbox>
                  <el-checkbox
                    label="摄像头"
                    :disabled="!item.IsStartCamera"
                  ></el-checkbox>
                </el-checkbox-group>
                <el-button
                  plain
                  size="small"
                  style="padding: 6px"
                  @click="shotScreenPhoto(item.User.id)"
                  :icon="
                    imgload && item.User.id == userID ? 'el-icon-loading' : ''
                  "
                  >{{
                    imgload && item.User.id == userID ? "截图中..." : "立即截图"
                  }}</el-button
                ></span
              >
            </p>
            <p v-else>
              <span>当前截图：</span>
              <el-tag type="info" effect="plain" size="medium">
                该用户已离线
              </el-tag>
            </p>
            <template v-if="item.loadPic && item.loadPic.length">
              <div class="receive-img">
                <!-- <span>{{ pic.Times.timeFormat("yyyy-MM-dd HH:mm") }}</span> -->
                <el-carousel trigger="click" height="46px">
                  <el-carousel-item
                    v-for="(pic, imgIndex) in item.loadPic"
                    :key="imgIndex"
                  >
                    <el-image
                      :src="$url + pic.ImgUrl"
                      :preview-src-list="[$url + pic.ImgUrl]"
                    >
                    </el-image>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </template>
          </div>
          <div class="work_status">
            <div class="card_title"><span class="title">工作状态</span></div>
            <div class="work-calc">
              <Staechart
                :paramsobj="item"
                :echartData="item.ComputerUsageRecord.workRat"
                :height="90"
                :workTime="item.WorkTime"
                @getBarData="getBarData"
              ></Staechart>
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
            <div class="card_title">
              <span class="title">高频关键词</span
              ><el-button
                type="text"
                size="small"
                @click.stop="handleAllWords(item)"
                v-if="item.KeyWordFreqs.length"
                >查看全部</el-button
              >
            </div>
            <div class="keyword_list" v-if="item.KeyWordFreqs.length">
              <tooltip
                class="word_item"
                v-for="(worditem, wordind) in item.KeyWordFreqs.filter(
                  (m, index) => index < 16
                )"
                :key="wordind"
                @handleClick="handleKeyWord(worditem, item)"
                :content="`${worditem.Key}`"
                :ref="`memprop-${index}-${wordind}`"
                width="28%"
              ></tooltip>
            </div>
            <div class="work_appl_list_empty" v-else>暂无数据</div>
          </div>
          <div class="work_action">
            <div class="card_title">
              <span class="title"
                >行为分析<el-tooltip placement="top" effect="light"
                  ><div slot="content">
                    <ul class="status_tooltip">
                      <li><span style="background: #67c23a"></span>积极</li>
                      <li><span style="background: #f56c6c"></span>消极</li>
                      <li><span style="background: #f2f6fc"></span>无状态</li>
                    </ul>
                  </div>
                  <i class="el-icon-question"></i> </el-tooltip></span
              ><el-button
                type="text"
                size="small"
                @click.stop="handleAllBehavior(item)"
                v-if="item.Behaviors.length"
                >查看全部</el-button
              >
            </div>
            <div class="keyword_list" v-if="item.Behaviors.length">
              <el-tag
                size="mini"
                class="word_item"
                v-for="(bitem, bindx) in item.Behaviors.filter(
                  (m, index) => index < 9
                )"
                :key="bindx"
                style="width: 28%"
                :type="getTagType(bitem.BehavoirType)"
                @click="handleBehavior(bitem, item)"
                ><tooltip
                  @handleClick="handleBehavior(bitem, item)"
                  :content="`${bitem.Behavoir}`"
                  :ref="`behavoir-${index}-${bindx}`"
                  width="100%"
                ></tooltip
              ></el-tag>
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
    <!-- 所有行为分析 -->
    <AllBehavior
      :selUser="selUser"
      :teamValue="teamValue"
      @handleBehavior="handleBehavior"
    ></AllBehavior>
    <!-- 所有软件弹窗 -->
    <allsoftware
      :stime="stime"
      :etime="etime"
      :uid="clickUser"
      :teamValue="teamValue"
    ></allsoftware>
    <!-- 所有关键词 -->
    <AllWords :selUser="selUser" @handleKeyWord="handleKeyWord"></AllWords>
    <!-- 行为折线图弹窗 -->
    <BehaviorEcharts
      :teamId="teamValue"
      :searchType="2"
      :behavior="clickKeyWord"
      :datestart="stime"
      :dateend="etime"
      :dateType="dateType"
    ></BehaviorEcharts>
    <!-- 进程截图弹窗 -->
    <progresscom
      :activeBar="selWorkItem"
      :stime="stime"
      :etime="etime"
      :uid="clickUser"
      :teamValue="teamValue"
      :gid="gid"
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
      :teamId="teamValue"
    ></keywordfrequency>
    <!-- 排名 -->
    <Ranking></Ranking>
  </div>
</template>
<script>
import { imgChange, getEfficiencyColor, getbehaviorColor } from "@/commons";
export default {
  components: {
    XHeader: () => import("@/components/Header"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    tooltip: () => import("@/components/textTooltip"),
    progresscom: () => import("./progressCom"),
    allsoftware: () => import("./allsoftware"),
    keywordfrequency: () => import("./keywordfrequency"),
    staffData: () => import("./staffData"),
    Staechart: () => import("./workstatus-pieecharts"),
    AllWords: () => import("./allwords"),
    Ranking: () => import("./ranking"),
    AllBehavior: () => import("./allbehavior"),
    BehaviorEcharts: () => import("./behavior-echarts"),
  },
  data() {
    return {
      selUser: null, //选择的成员数据列表成员
      screenCheck: [], //截图类型
      DateRange: [
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 7
        ),
        new Date(),
      ],
      imgload: false,
      userID: "",
      timer: null,
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
      selMem: [], //选择的成员
      pickOption: this.pickDate(),
      isListPage: true, //是否在列表页
      inputSearch: null, //搜索员工
      dateType: 1, //时间查询类型
      listdateType: 1, //卡片列表显示月、周类型
      selDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      ),
      selDepart: [], //选择的部门
      selWorkItem: null, //点击工作状态5个分类的某一个分类
      loading: false, //加载
      busy: true,
      memberData: [], //成员数据
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        pageNum: 0,
      }, //分页
      clickUser: null, //点击的用户
      clickUserName: null, //点击的用户名
      etime: null,
      stime: null,
      clickKeyWord: null, //要查看的关键词
      pname: null, //选择的关键词的窗口名
      isShowTeam: false, // 是否显示团队选择
      gid: null, //进程组id
    };
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
    this.$E.$off("loadpic");
    this.$E.$off("loadingpic");
  },
  mounted() {
    const role = this.$xStorage.getItem("user-role");
    if (role.team) {
      this.teamValue = role.team;
      this.isShowTeam = false;
    } else {
      this.isShowTeam = true;
    }
    this.getTeams();

    this.$E.$on("loadpic", (res) => {
      console.log("开始截图");
    });
    this.$E.$on("loadingpic", (res) => {
      if (res.teamId != this.teamValue) {
        return;
      }
      console.log("收到截图");
      this.imgload = false;
      this.memberData.forEach((m) => {
        if (m.User.id == res.UserId) {
          m.loadPic = JSON.parse(res.imgUrl);
          if (!m.loadPic || !m.loadPic.length) {
            this.$message({
              showClose: true,
              message: "没有接收到截图",
              type: "warning",
            });
          }
          console.log(m.loadPic);
        }
      });
    });
  },
  methods: {
    imgChange,
    getEfficiencyColor,
    getbehaviorColor,
    /**
     * 行为分析标签颜色
     * 积极：绿  消极：红  无：白色
     */
    getTagType(val) {
      if (val == "积极") {
        return "success";
      } else if (val == "消极") {
        return "danger";
      } else {
        return "info";
      }
    },
    /**
     * 团队切换
     */
    handleTeamChange() {
      this.selMem = [];
    },
    /**
     * 截图
     */
    shotScreenPhoto(id) {
      if (!this.screenCheck.length) {
        this.$message({
          showClose: true,
          message: "请选择截图类型",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      this.userID = id;
      //截图
      this.imgload = true;
      if (this.screenCheck.includes("屏幕")) {
        this.screenShot();
      }
      if (this.screenCheck.includes("摄像头")) {
        this.screenShotCamera();
      }
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.setTimer();
    },
    /**
     * 屏幕截图
     */
    screenShot() {
      this.$http
        .get("/User/Work/NoticeUserScreenshots.ashx", {
          params: { Id: this.userID, teamId: this.teamValue },
        })
        .then((res) => {});
    },
    /**
     * 摄像头截图
     */
    screenShotCamera() {
      this.$http
        .get("/User/Work/NoticeUserPhotographs.ashx", {
          params: { Id: this.userID, teamId: this.teamValue },
        })
        .then((res) => {});
    },
    setTimer() {
      if (this.timer == null) {
        let num = 0;
        this.timer = setInterval(() => {
          num += 1;
          if (num == 30 && this.imgload == true) {
            clearInterval(this.timer);
            this.timer = null;
            this.imgload = false;
            this.$notify({
              type: "error",
              message: "请求超时",
            });
          }
        }, 1000);
      }
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
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
      if (!this.teamValue) {
        this.$message({
          message: "请先选择团队",
          type: "warning",
        });
        return;
      }
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
      this.etime = item.etime;
      this.stime = item.stime;
      this.clickUser = item.User.id;
      this.clickKeyWord = val.Key;
      this.pname = val.FocusFormName;
      this.$modal.show("meData");
    },
    /**
     * 查看某个行为
     */
    handleBehavior(val, item) {
      console.log(val, item);
      this.etime = item.etime;
      this.stime = item.stime;
      this.clickKeyWord = val.Behavoir;
      this.$modal.show("behaviorecharts");
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
    /**
     * 查看全部行为分析
     */
    handleAllBehavior(item) {
      this.selUser = item;
      this.$modal.show("allbehavior");
    },
    /**
     * 查看全部关键词
     */
    handleAllWords(item) {
      this.selUser = item;
      this.$modal.show("allwords");
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
      } else if (this.dateType == 2) {
        wk = this.selDate;
      } else {
        wk =
          this.DateRange && this.DateRange.length
            ? this.DateRange[0].timeFormat("yyyy-MM-dd")
            : null;
      }
      const data = {
        p: this.pageData.pageIndex,
        c: this.pageData.pageSize,
        wk: wk,
        dt: this.dateType,
        us: this.selMem.map((m) => m.UsId),
        teamId: this.teamValue,
        edate:
          this.dateType == 3 && this.DateRange && this.DateRange.length
            ? this.DateRange[1].timeFormat("yyyy-MM-dd")
            : null,
      };
      this.$http
        .post("/User/MemberPeriod.ashx#", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.listdateType = this.dateType;
            if (resp.data.items.length) {
              resp.data.items.forEach((element) => {
                element.loadPic = null;
                element.ComputerUsageRecord.workRat =
                  element.ComputerUsageRecord.workRat.map((m) => {
                    return {
                      name: m.name,
                      value: m.value.toFixed(1),
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
      this.gid = data.gid;
      this.$nextTick(() => {
        this.$modal.show("memberDatatimeAxisPhoto");
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.status_tooltip {
  li {
    span {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;

      display: inline-block;
      margin-right: 5px;
    }
  }
}
.memberdata {
  height: 100%;
  /deep/.tooltip_text {
    font-size: 1.2rem;
  }
  .mem_content {
    padding: 0px;
    height: 100%;
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
            width: 13rem;

            /deep/.el-input__inner {
              border-radius: 4px 0 0 4px;
            }
          }

          /deep/.el-date-editor {
            /deep/.el-input__inner {
              border-radius: 0px 4px 4px 0px;
            }
          }
          /deep/ .el-date-editor--daterange {
            background-color: #f8f8f8;
            border: none;
            .el-range-input {
              background-color: #f8f8f8;
            }
            .el-range-separator {
              width: 7%;
            }
          }
        }
      }
    }
    .people_list {
      // overflow-y: auto;
      // height: calc(100% - 105px);
      .list_card {
        position: relative;
        background: #ffffff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 12px 0 8px;
        margin-bottom: 10px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 5%);
        // justify-content: space-around;
        // cursor: pointer;
        .tag_item_list {
          cursor: pointer;
          .tag_item {
            width: 11rem;
            height: 2.7rem;
            line-height: 2.8rem;
            transform: skew(25deg);
            -webkit-transform: skew(30deg);
            -moz-transform: skew(30deg);
            position: absolute;
            left: -3rem;
            div {
              transform: skew(-25deg);
              -webkit-transform: skew(-30deg);
              -moz-transform: skew(-30deg);
              width: calc(100% - 3rem);
              text-align: center;
              color: #ffffff;
              font-size: 1.3rem;
              float: right;
            }
          }
          .t_i_bg1 {
            background: rgb(198, 226, 255);
          }
          .t_i_bg2 {
            background: rgb(140, 197, 255);
          }
          .t_i_bg3 {
            background: rgb(83, 168, 255);
          }
          &:hover {
            .t_i_bg1 {
              background: rgb(228, 248, 217);
            }
            .t_i_bg2 {
              background: rgb(195, 235, 176);
            }
            .t_i_bg3 {
              background: rgb(103, 194, 58);
            }
          }
        }

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
            i {
              margin-left: 3px;
              font-size: 16px;
              color: #e6a23c;
            }
          }
          .el-button {
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        .people_info {
          width: 10%;
          padding-top: 33px;
          .name_pic {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 4px;
            .name {
              color: #333333;
              font-size: 1.6rem;
              margin-left: 8px;
              font-weight: bold;
            }
          }
          p {
            color: #666666;
            margin-top: 2px;
            font-size: 1.2rem;
            font-weight: bold;
          }
          /deep/.view_btn {
            margin-top: 6px;
            padding: 6px 11px;
          }
        }
        .work_time {
          width: 15%;
          display: flex;
          flex-direction: column;
          padding-top: 33px;
          justify-content: center;
          p {
            display: flex;
            flex-direction: row;
            align-items: center;
            span {
              font-weight: bold;
              flex-shrink: 0;
            }
            margin-bottom: 8px;
            font-size: 1.3rem;
          }
          .receive-img {
            width: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            .el-carousel {
              width: 100%;
              .el-carousel__item {
                text-align: center;
              }
              /deep/.el-carousel__button {
                background-color: #c0c4cc;
              }
            }
            .el-image {
              width: 80%;
              height: 46px;
              margin-right: 0.3rem;
            }
          }
          .screen_check {
            display: flex;
            flex-direction: row;
            align-items: center;
            /deep/.el-checkbox-group {
              .el-checkbox {
                margin-right: 9px;
                .el-checkbox__label {
                  padding-left: 5px;
                  font-size: 13px;
                }
              }
            }
          }
        }
        .work_status {
          width: 22%;
          padding-top: 33px;
          .card_title {
            margin-bottom: 0;
          }
        }
        .work_application {
          width: 18%;
          padding: 33px 10px 0 0;
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
          width: 16%;
          padding: 33px 10px 0 0;
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
        .work_action {
          width: 16%;
          padding: 33px 10px 0 0;
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
              width: 28%;
              height: 22px;
              line-height: 20px;
              padding: 0 4px;
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
