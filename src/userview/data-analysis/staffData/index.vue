<template>
  <!--
	 LMK 2021-05-10
 -->
  <div class="baseViewPage">
    <div class="name_title">
      <span @click="handleBackPage"
        ><i class="el-icon-arrow-left"></i>{{ clickUserName }}</span
      >
    </div>
    <BaseView :title_name="'时间'" class="staff" v-loading="loading">
      <ul class="infinite-list" slot="panes">
        <li
          :class="{ activeList: selActiveTime === null }"
          @click="liClick(null)"
        >
          <span>查看所有</span>
        </li>
        <li
          v-for="item in ulTimeArr"
          :key="item"
          :class="{ activeList: selActiveTime === item }"
          @click="liClick(item)"
        >
          <span>{{ item }}</span>
        </li>
      </ul>
      <!-- 
			状态 
			软件
			截图
			-->
      <div class="staffbox" slot="content">
        <div class="state">
          <div class="state_one">
            <h3>效率雷达图</h3>
            <div class="info">
              <Radar :efficiencyData="efficiencyData"></Radar>
            </div>
          </div>
          <div class="state_one">
            <div class="card_title_one">
              <h3>行为热力图</h3>
              <ul class="status">
                <li><span style="background: #67c23a"></span>积极</li>
                <li><span style="background: #f56c6c"></span>消极</li>
                <li><span style="background: #f2f6fc"></span>无状态</li>
              </ul>
            </div>
            <div class="info">
              <ThermodynamicChart
                :thermodynamicData="thermodynamicData"
                :isColumn="true"
                :height="'260px'"
                :column="12"
                :row="10"
              ></ThermodynamicChart>
            </div>
          </div>
          <div class="state_one state_one_three">
            <div>
              <h3>常用应用占比图</h3>
              <div class="info">
                <Staechart
                  :echartData="echartWorkData"
                  :width="350"
                  :height="120"
                  :workTime="workTime"
                ></Staechart>
              </div>
            </div>
            <div>
              <h3>
                本<span v-if="selActiveTime">日</span
                ><span v-else-if="dateType == 1">周</span
                ><span v-else-if="dateType == 2">月</span
                ><span v-else>时间段</span>使用软件占比
              </h3>
              <div
                class="info"
                v-if="echartSoftWearData && echartSoftWearData.length"
              >
                <Staechart
                  :echartData="echartSoftWearData"
                  :width="350"
                  :height="120"
                  :workTime="workTime"
                ></Staechart>
              </div>
              <div class="work_appl_list_empty" v-else>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="state">
          <div class="state_two">
            <div class="card_title">
              <h3>常用应用</h3>
              <el-button
                type="text"
                size="small"
                @click.stop="handleAllSoftware"
                v-if="AppDetails.length"
                >查看全部</el-button
              >
            </div>
            <div class="work_appl_list" v-if="AppDetails.length">
              <div
                class="w_a_l_card"
                v-for="(appitem, ind) in AppDetails"
                :key="ind"
              >
                <p class="time">{{ appitem.StayTime }}H</p>
                <div class="card_proportion">
                  <div
                    class="proportion"
                    :style="`height:${
                      workTime > 0
                        ? (appitem.StayTime / workTime) * 100 >= 100
                          ? 100
                          : (appitem.StayTime / workTime) * 100
                        : (5 - ind) * 20
                    }%`"
                  ></div>
                </div>
                <p class="card_name">
                  <tooltip
                    :content="`${appitem.AppName}`"
                    :ref="`memprop-${ind}`"
                    width="98%"
                  ></tooltip>
                </p>
              </div>
            </div>
            <div class="work_appl_list_empty" v-else>暂无数据</div>
          </div>
          <div class="state_two">
            <div class="card_title">
              <h3>高频关键词</h3>
              <el-button
                type="text"
                size="small"
                @click.stop="handleAllWords"
                v-if="ThreeTexts.length"
                >查看全部</el-button
              >
            </div>
            <div class="info" v-if="ThreeTexts && ThreeTexts.length">
              <tooltip
                class="i_text"
                v-for="(item, wordindex) in ThreeTexts"
                :key="wordindex"
                @handleClick="handleKeyWord(item)"
                :content="item.Key"
                :ref="`demandLeftMenu-${wordindex}`"
                width="62px"
              ></tooltip>
            </div>
            <div class="work_appl_list_empty" v-else>暂无数据</div>
          </div>
          <div class="state_two">
            <div class="card_title">
              <h3>
                行为分析<el-tooltip placement="top" effect="light"
                  ><div slot="content">
                    <ul class="status_tooltip">
                      <li><span style="background: #67c23a"></span>积极</li>
                      <li><span style="background: #f56c6c"></span>消极</li>
                      <li><span style="background: #f2f6fc"></span>无状态</li>
                    </ul>
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </h3>
              <el-button
                type="text"
                size="small"
                @click.stop="handleAllBehavior"
                v-if="behaviorArray.length"
                >查看全部</el-button
              >
            </div>
            <div class="keyword_list" v-if="behaviorArray.length">
              <el-tag
                size="mini"
                class="word_item"
                v-for="(bitem, bindx) in behaviorArray.filter(
                  (m, index) => index < 16
                )"
                :key="bindx"
                style="width: 22%"
                :type="getTagType(bitem.BehavoirType)"
                @click="handleBehavior(bitem)"
                ><tooltip
                  @handleClick="handleBehavior(bitem)"
                  :content="`${bitem.Behavoir}`"
                  :ref="`behavoir-${bindx}`"
                  width="100%"
                ></tooltip
              ></el-tag>
            </div>
            <div class="work_appl_list_empty" v-else>暂无数据</div>
          </div>
        </div>
        <div class="soft">
          <div class="title">时间轴与使用软件</div>
          <div class="softbox" v-if="softData && softData.length">
            <div
              v-for="(item, softind) in softData"
              :key="item.Line"
              :class="{
                speed_footer: softind % 2 == 0,
                speed_header: softind % 2 !== 0,
              }"
            >
              <div class="left">
                <span
                  class="time"
                  :style="`${!selActiveTime ? 'width:65px' : ''}`"
                  >{{ item.Line }}</span
                >
                <ul class="s_l_ul">
                  <li
                    class="s_l_li"
                    v-for="(citem, csoftind) in item.Process"
                    :key="csoftind"
                    @click="handleAppPic(citem)"
                  >
                    {{ citem.PName }}
                  </li>
                </ul>
              </div>
              <div class="right"></div>
            </div>
          </div>
          <div class="nodata" v-else>
            <i class="hiFont hi-wushuju"></i>
            <p>暂无数据</p>
          </div>
        </div>
        <div class="scree">
          <div class="scree_title">定期截图</div>
          <div class="screephot" v-if="softData && softData.length">
            <div
              class="screen"
              v-for="(itempic, picindex) in softData"
              :key="picindex"
            >
              <el-image
                style="width: 157px; height: 88px"
                :src="cmurl + itempic.Img"
                :preview-src-list="[`${cmurl}${itempic.Img}`]"
              >
              </el-image>
              <p class="time">{{ itempic.Line }}</p>
            </div>
          </div>
          <div class="nodata" v-else>
            <i class="hiFont hi-wushuju"></i>
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </BaseView>
    <!-- 关键词使用频率 -->
    <!-- <keywordfrequency
      :searchType="selActiveTime ? 2 : 1"
      :datestart="selActiveTime ? selActiveTime : stime"
      :dateend="etime"
      :uid="uid"
      :word="clickKeyWord"
      :pname="pname"
      :name="'staffDataWord'"
      :teamId="teamId"
    ></keywordfrequency> -->
    <progresscom
      :name="'staffDataPic'"
      :activeBar="selRow"
      :stime="selActiveTime"
      :etime="selActiveTime"
      :uid="uid"
      :teamValue="teamId"
    ></progresscom>
  </div>
</template>

<script>
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    Staechart: () => import("./satechart.vue"),
    Radar: () => import("./radar"),
    tooltip: () => import("@/components/textTooltip"),
    keywordfrequency: () => import("../keywordfrequency"),
    progresscom: () => import("../progressCom"),
    ThermodynamicChart: () => import("@/components/ThermodynamicChart"),
  },
  props: {
    //团队id
    teamId: {
      type: Number,
      default: null,
    },
    //开始的日期
    stime: {
      type: String,
      default: null,
    },
    //结束的日期
    etime: {
      type: String | Date,
      default: null,
    },
    //列表页选择的日期
    selDate: {
      type: Date | String,
      default: null,
    },
    //列表页按周查或按月查
    dateType: {
      type: Number | String,
      default: null,
    },
    //用户id
    uid: {
      type: Number,
      default: null,
    },
    //用户名
    clickUserName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dataDetails: null,
      behaviorArray: [],
      AppDetails: [],
      thermodynamicData: null, //热力图
      efficiencyData: null, //雷达图
      loading: false,
      workTime: null,
      // 高频词
      ThreeTexts: [],
      // 本日工作状态占比
      echartWorkData: [],
      // 本日使用软件占比
      echartSoftWearData: [],
      /*
       * 右侧时间
       */
      ulTimeArr: [],
      activeNames: ["1"],
      selActiveTime: null,
      /*
       *时间轴与使用软件
       */
      softData: [],
      odd: [],
      noodd: [],
      clickKeyWord: null,
      selRow: null, //选择的软件
      pname: null, //选择的关键词的窗口名
    };
  },
  watch: {
    selActiveTime() {
      this.getDataInfo();
    },
  },
  computed: {
    cmurl() {
      return process.env.VUE_APP_CMURL;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getDateList();
      this.getDataInfo();
    });
  },
  methods: {
    handleBackPage() {
      this.selActiveTime = null;
      this.$emit("pageChange", true);
    },
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
     * 查看某个行为
     */
    handleBehavior(val) {
      this.dataDetails.Behaviors = this.behaviorArray;
      this.$emit("handleBehavior", val, this.dataDetails);
    },
    /**
     * 查看全部行为
     */
    handleAllBehavior() {
      this.dataDetails.Behaviors = this.behaviorArray;
      this.$emit("handleAllBehavior", this.dataDetails);
    },
    /**
     * 查看全部关键词
     */
    handleAllWords() {
      this.$emit("handleAllWords", this.dataDetails);
    },
    /**
     * 查看全部软件
     */
    handleAllSoftware() {
      console.log(this.selActiveTime);
      const data = {
        User: {
          id: this.uid,
        },
        selActiveTime: this.selActiveTime,
      };
      this.$emit("handleAllSoftware", data);
      // this.$modal.show("allsoftware");
    },
    /**
     * 某个软件截图
     */
    handleAppPic(app) {
      this.selRow = {
        name: app.PName,
        fromList: app.fromList,
      };
      this.$nextTick(() => {
        this.$modal.show("staffDataPic");
      });
    },
    /**
     * 获取详情数据
     */
    getDataInfo() {
      this.loading = true;
      if (this.selActiveTime) {
        this.MemberDataDetails();
      } else {
        this.DataDetailsSummary();
      }
    },
    /**
     * 具体某一天
     */
    MemberDataDetails() {
      const data1 = {
        u: this.uid,
        date: this.selActiveTime,
        teamId: this.teamId,
      };
      const data2 = {
        UsId: this.uid,
        datestart: this.selActiveTime.timeFormat("yyyy-MM-dd 00:00:01"),
        dateend: this.selActiveTime.timeFormat("yyyy-MM-dd 23:59:59"),
        teamId: this.teamId,
      };
      const data3 = {
        uid: this.uid,
        datestart: this.selActiveTime.timeFormat("yyyy-MM-dd 00:00:01"),
        dateend: this.selActiveTime.timeFormat("yyyy-MM-dd 23:59:59"),
        teamId: this.teamId,
      };
      const data4 = {
        Ids: JSON.stringify([this.uid]),
        datestart: this.selActiveTime.timeFormat("yyyy-MM-dd 00:00:01"),
        dateend: this.selActiveTime.timeFormat("yyyy-MM-dd 23:59:59"),
        teamId: this.teamId,
        type: 1,
      };
      Promise.all([
        this.$http.get("/Teams/MemberJob/MemberDataDetails.ashx#", {
          params: data1,
        }),
        this.$http.post("/User/Work/GetBehaviorThermodynamicChart.ashx", data2),
        this.$http.post("/User/Work/WorkEfficiencyAnalysis.ashx", data3),
        this.$http.get("/User/Work/GetBehaviorAnalyse.ashx", { params: data4 }),
      ]).then((resp) => {
        if (resp[0].res == 0) {
          this.dataDetails = resp[0].data;
          this.dataDetails.User = {
            id: this.uid,
          };
          this.dataDetails.selActiveTime = this.selActiveTime;
          //本日工作状态占比图表数据
          this.echartWorkData = resp[0].data.ComputerUsageRecord.workRat.map(
            (m) => {
              return {
                name: m.name,
                value: m.value.toFixed(1),
              };
            }
          );
          //本日使用软件占比
          this.AppDetails = resp[0].data.AppDetails.filter(
            (m, index) => index < 5
          );
          this.echartSoftWearData = resp[0].data.AppDetails.map((m) => {
            return {
              name: m.AppName,
              value: m.ratio,
            };
          });
          //高频关键词
          this.ThreeTexts = resp[0].data.KeyWordFreqs.filter(
            (m, index) => index < 20
          );
          //时间轴与使用软件、定期截图数据
          this.softData = resp[0].data.TimeLine;
          this.workTime = resp[0].data.WorkTime;
        }
        if (resp[1].res == 0) {
          this.thermodynamicData = resp[1].data.Behavior;
        }
        if (resp[2].res == 0) {
          this.efficiencyData = resp[2].data;
        }
        if (resp[3].res == 0) {
          this.behaviorArray = resp[3].data.Behavior;
        }
        this.loading = false;
      });
    },
    /**
     * 所有时间
     */
    DataDetailsSummary() {
      const data1 = {
        u: this.uid,
        st: this.stime,
        et: this.etime,
        teamId: this.teamId,
      };
      const data2 = {
        UsId: this.uid,
        datestart: this.stime.timeFormat("yyyy-MM-dd 00:00:01"),
        dateend: this.etime.timeFormat("yyyy-MM-dd 23:59:59"),
        teamId: this.teamId,
      };
      const data3 = {
        uid: this.uid,
        datestart: this.stime.timeFormat("yyyy-MM-dd 00:00:01"),
        dateend: this.etime.timeFormat("yyyy-MM-dd 23:59:59"),
        teamId: this.teamId,
      };
      const data4 = {
        Ids: JSON.stringify([this.uid]),
        datestart: this.stime.timeFormat("yyyy-MM-dd 00:00:01"),
        dateend: this.etime.timeFormat("yyyy-MM-dd 23:59:59"),
        teamId: this.teamId,
        type: 1,
      };
      Promise.all([
        this.$http.post("/User/MemberDataDetailsSummary.ashx#", data1),
        this.$http.post("/User/Work/GetBehaviorThermodynamicChart.ashx", data2),
        this.$http.post("/User/Work/WorkEfficiencyAnalysis.ashx", data3),
        this.$http.get("/User/Work/GetBehaviorAnalyse.ashx", { params: data4 }),
      ]).then((resp) => {
        console.log(resp);
        if (resp[0].res == 0) {
          this.dataDetails = resp[0].data;
          this.dataDetails.User = {
            id: this.uid,
          };
          this.dataDetails.selActiveTime = this.selActiveTime;
          //本周/月工作状态占比图表数据
          this.echartWorkData = resp[0].data.ComputerUsageRecord.workRat.map(
            (m) => {
              return {
                name: m.name,
                value: m.value.toFixed(1),
              };
            }
          );
          //本周/月使用软件占比
          this.AppDetails = resp[0].data.AppDetails.filter(
            (m, index) => index < 5
          );
          this.echartSoftWearData = resp[0].data.AppDetails.map((m) => {
            return {
              name: m.AppName,
              value: m.ratio,
            };
          });
          //高频关键词
          this.ThreeTexts = resp[0].data.KeyWordFreqs.filter(
            (m, index) => index < 20
          );
          //时间轴与使用软件、定期截图数据
          this.softData = resp[0].data.TimeLine;
          this.workTime = resp[0].data.WorkTime;
        }
        if (resp[1].res == 0) {
          this.thermodynamicData = resp[1].data.Behavior;
        }
        if (resp[2].res == 0) {
          this.efficiencyData = resp[2].data;
        }
        if (resp[3].res == 0) {
          this.behaviorArray = resp[3].data.Behavior;
        }
        this.loading = false;
      });
    },
    /**
     * 查看某个关键词
     */
    handleKeyWord(val) {
      this.$emit("handleKeyWord", val, this.dataDetails);
      // this.clickKeyWord = val.Key;
      // this.pname = val.FocusFormName;
      // this.$modal.show("staffDataWord");
    },
    endSoftData() {
      this.softData.forEach((item) => {
        if (item.num % 2 == 0) {
          this.odd.push(item);
        } else {
          this.noodd.push(item);
        }
      });
    },
    liClick(time) {
      if (time) {
        this.selActiveTime = time;
      } else {
        this.selActiveTime = null;
      }
    },
    /**
     * 获取日期
     */
    getDateList() {
      //按周获取日期
      let arr = [];
      if (this.dateType == 1) {
        //获取周一至周六日期
        for (let i = 0; i < 7; i++) {
          let date = new Date(this.stime);
          date.setDate(date.getDate() + i);
          arr.push(date.timeFormat("yyyy-MM-dd"));
        }
        this.ulTimeArr = arr;
      } else if (this.dateType == 2) {
        //获取当月日期
        const curDate = new Date(this.selDate);
        //该月的天数
        const dayNum = new Date(
          curDate.getFullYear(),
          curDate.getMonth() + 1,
          0
        );
        //是否是本月
        const nowM = new Date().getMonth() + 1;
        const nowd = new Date().getDate();
        const isNowM = nowM == curDate.getMonth() + 1 ? true : false;
        for (let i = 1; i <= dayNum.getDate(); i++) {
          if (isNowM && nowd < i) {
            break;
          }
          let date = new Date(this.selDate);
          date.setDate(i);
          arr.push(date.timeFormat("yyyy-MM-dd"));
        }
        this.ulTimeArr = arr;
      } else {
        //按时间段
        const time = Date.parse(new Date(this.stime));
        const lasttime = Date.parse(new Date(this.etime));
        const day = parseInt((lasttime - time) / (1000 * 60 * 60 * 24));
        for (let i = 0; i <= day; i++) {
          let date = new Date(this.stime);
          date.setDate(date.getDate() + i);
          arr.push(date.timeFormat("yyyy-MM-dd"));
        }
        this.ulTimeArr = arr;
      }
    },
  },
  /*
   *初始化页面数据
   */
  created() {
    this.softData.forEach((e, index) => {
      this.$set(e, "num", index);
    });
    // 过滤奇数偶数
    this.endSoftData();
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
.baseViewPage {
  height: calc(100% - 1rem) !important;
  .name_title {
    background: #ffffff;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333333;
    span {
      cursor: pointer;
      &:hover {
        color: #448ef5;
      }
      i {
        font-weight: bold;
      }
    }
  }
  .staff {
    padding: 0 !important;
    height: calc(100% - 45px) !important;
  }
}
.staffbox {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: #f3f3f3;
  .state {
    display: flex;
    height: 100%;
    overflow-x: scroll;
    margin-bottom: 10px;
    .work_appl_list_empty {
      margin-top: 10px;
      // text-align: center;
    }
    .state_one {
      padding: 5px;
      flex: 1;
      background: #fff;
      margin-right: 8px;
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
      .card_title_one {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .status {
          display: flex;
          flex-direction: row;
          align-items: center;
          li {
            margin-right: 8px;
            span {
              width: 1.2rem;
              height: 1.2rem;
              border-radius: 50%;
              display: inline-block;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .state_one:last-child {
      margin-right: 0px;
    }
    // .state_one_three{
    //   display: flex;

    // }
    .state_two {
      padding: 5px;
      // padding: 5px 0;
      margin-right: 8px;
      background: #fff;
      height: 160px;
      width: 34%;
      .card_title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        h3 {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          i {
            margin-left: 3px;
            font-size: 16px;
            color: #e6a23c;
          }
        }
        .el-button {
          padding: 0;
        }
      }
      .info {
        display: flex;
        flex-wrap: wrap;
        .i_text {
          cursor: pointer;
          margin: 5px 5px 5px 0;
          &:hover {
            color: #448ef5;
          }
        }
      }
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
            height: 75px;
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
    .state_two:last-child {
      margin-right: 0px;
    }
  }
  .state::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px #d8d8d8;
    background: #535353;
  }
  .state::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .state::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px #d8d8d8;
    border-radius: 10px;
    background: #ededed;
  }
  .soft {
    padding: 5px;
    height: 300px;
    background-color: #fff;
    margin-bottom: 15px;

    .title {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .softbox::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px #d8d8d8;
      background: #535353;
    }
    .softbox::-webkit-scrollbar {
      width: 200px;
      height: 6px;
    }
    .softbox::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px #d8d8d8;
      border-radius: 10px;
      background: #ededed;
    }
    .softbox {
      overflow-x: scroll;
      overflow-y: hidden;
      display: flex;
      align-items: center;
      height: calc(100% - 20px);
      padding: 0 20px;
      .speed_footer {
        display: flex;
        align-items: center;
        .left {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1px solid #448ef5;
          position: relative;
          .time {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            color: #666666;
            font-size: 12px;
          }
          .s_l_ul {
            padding-left: 5px;
            border-left: 1px solid #ccc;
            position: absolute;
            top: 30px;
            left: 50%;
            // width: 65px;
            // overflow: hidden;
            height: 108px;
            overflow-y: auto;
            padding-right: 10px;
            .s_l_li {
              font-size: 12px;
              color: #666;
              line-height: 18px;
              cursor: pointer;
              &:hover {
                color: #448ef5;
              }
            }
          }
        }
        .right {
          width: 70px;
          height: 4px;
          background-color: #448ef5;
        }
      }
      .speed_header {
        display: flex;
        align-items: center;
        .left {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1px solid #448ef5;
          position: relative;
          .time {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            color: #666666;
            font-size: 12px;
          }
          .s_l_ul {
            padding-left: 5px;
            border-left: 1px solid #ccc;
            position: absolute;
            bottom: 30px;
            left: 50%;
            height: 108px;
            overflow-y: auto;
            padding-right: 10px;
            .s_l_li {
              font-size: 12px;
              color: #666;
              line-height: 18px;
              cursor: pointer;
              &:hover {
                color: #448ef5;
              }
            }
          }
        }
        .right {
          width: 70px;
          height: 4px;
          background-color: #448ef5;
        }
      }
    }
  }
  .scree {
    width: calc(100% - 16px);
    padding: 8px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .scree_title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #333333;
    }
    .screephot {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      .screen {
        margin: 5px 8px 5px 0;
        .time {
          text-align: center;
          color: #666666;
        }
      }
    }
  }
  .nodata {
    font-size: 14px;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .hiFont {
      font-size: 5rem;
      color: #c0c4cc;
    }
    p {
      margin-top: 8px;
      color: #909399;
    }
  }
}
/deep/.bv_left {
  flex: 0 0 22rem;
}
/deep/.bv_left_ctn .el-tabs .el-tabs__content {
  padding: 0;
}
/deep/.el-collapse {
  border-top: none;
}
</style>
