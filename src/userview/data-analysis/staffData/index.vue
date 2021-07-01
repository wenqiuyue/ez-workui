<template>
  <!--
	 LMK 2021-05-10
 -->
  <div class="baseViewPage">
    <div class="name_title">
      <span @click="$emit('pageChange', true)"
        ><i class="el-icon-arrow-left"></i>{{ clickUserName }}</span
      >
    </div>
    <BaseView :title_name="'时间'" class="staff">
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
      <div class="staffbox" slot="content" v-loading="loading">
        <div class="state">
          <div class="state_one">
            <h3>本日工作状态占比</h3>
            <div class="info">
              <Staechart
                :echartData="echartWorkData"
                :width="350"
                :workTime="workTime"
              ></Staechart>
            </div>
          </div>
          <div class="state_two">
            <h3>本日使用软件占比</h3>
            <div class="info">
              <Staechart
                :echartData="echartSoftWearData"
                :width="400"
                :workTime="workTime"
              ></Staechart>
            </div>
          </div>
          <div class="state_three">
            <h3>高频关键词</h3>
            <div class="info">
              <tooltip
                class="i_text"
                v-for="(item, wordindex) in ThreeTexts"
                :key="wordindex"
                @handleClick="handleKeyWord(item, item)"
                :content="item.Key"
                :ref="`demandLeftMenu-${wordindex}`"
                width="62px"
              ></tooltip>
            </div>
          </div>
        </div>
        <div class="soft">
          <div class="title">时间轴与使用软件</div>
          <div class="softbox">
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
        </div>
        <div class="scree">
          <div class="scree_title">定期截图</div>
          <div class="screephot">
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
        </div>
      </div>
    </BaseView>
    <!-- 关键词使用频率 -->
    <keywordfrequency
      :searchType="selActiveTime ? 2 : 1"
      :datestart="selActiveTime ? selActiveTime : stime"
      :dateend="etime"
      :uid="uid"
      :word="clickKeyWord"
      :pname="pname"
      :name="'staffDataWord'"
    ></keywordfrequency>
    <progresscom
      :name="'staffDataPic'"
      :activeBar="selRow"
      :stime="selActiveTime"
      :etime="selActiveTime"
      :uid="uid"
    ></progresscom>
  </div>
</template>

<script>
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    Header: () => import("@/components/Header"),
    Staechart: () => import("./satechart.vue"),
    tooltip: () => import("@/components/textTooltip"),
    keywordfrequency: () => import("../keywordfrequency"),
    progresscom: () => import("../progressCom"),
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
    /**
     * 某个软件截图
     */
    handleAppPic(app) {
      this.selRow = {
        name: app.PName,
        fromList: app.fromList,
      };
      this.$modal.show("staffDataPic");
    },
    /**
     * 获取详情数据
     */
    getDataInfo() {
      this.loading = true;
      let data = null;
      let api = null;
      if (this.selActiveTime) {
        data = {
          u: this.uid,
          date: this.selActiveTime,
        };
        api = "/Company/MemberJob/MemberDataDetails.ashx#";
      } else {
        data = {
          u: this.uid,
          st: this.stime,
          et: this.etime,
          teamId: this.teamId,
        };
        api = "/User/MemberDataDetailsSummary.ashx";
      }
      this.$http.get(api, { params: data }).then((resp) => {
        if (resp.res == 0) {
          //本日工作状态占比图表数据
          this.echartWorkData = resp.data.ComputerUsageRecord.workRat.map(
            (m) => {
              return {
                name: m.name,
                value: m.value.toFixed(1),
              };
            }
          );
          //本日使用软件占比
          this.echartSoftWearData = resp.data.AppDetails.map((m) => {
            return {
              name: m.AppName,
              value: m.ratio,
            };
          });
          //高频关键词
          this.ThreeTexts = resp.data.KeyWordFreqs.filter(
            (m, index) => index < 30
          );
          //时间轴与使用软件、定期截图数据
          this.softData = resp.data.TimeLine;
          this.workTime = resp.data.WorkTime;
          this.loading = false;
        }
      });
    },
    /**
     * 查看某个关键词
     */
    handleKeyWord(val, item) {
      this.clickKeyWord = val.Key;
      this.pname = val.FocusFormName;
      this.$modal.show("staffDataWord");
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
      console.log(time);
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
      } else {
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
    console.log(this.odd);
  },
};
</script>

<style lang="less" scoped>
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
    .state_one {
      padding: 5px;
      flex: 1;
      background: #fff;
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
      .info {
      }
    }
    .state_two {
      padding: 5px;
      margin: 0 10px;
      flex: 2;
      background: #fff;
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
    }
    .state_three {
      padding: 5px;
      width: 335px;
      flex-shrink: 0;
      background: #fff;
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
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
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
    margin: 15px 0;

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
