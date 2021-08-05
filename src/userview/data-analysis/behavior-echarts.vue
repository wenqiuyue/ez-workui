<template>
  <div class="behavior-echarts">
    <XModal
      width="60%"
      height="80%"
      name="behaviorecharts"
      :showCrossBtn="true"
      :title="`${behavior}行为发生次数`"
      @opened="opened"
    >
      <div class="content" v-loading="loading">
        <div class="behaviorPic" v-if="!loading">
          <el-button type="primary" size="small" @click="handleKeyWordInfo"
            >行为详情</el-button
          >
        </div>
        <div id="behaviorChart"></div>
      </div>
    </XModal>
    <progresscom
      :name="'behaviorPicList'"
      :activeBar="{ name: behavior }"
      :stime="datestart"
      :etime="searchType == 1 ? datestart : dateend"
      :teamValue="teamId"
    ></progresscom>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    progresscom: () => import("./progressCom"),
  },
  props: {
    teamId: {
      type: Number,
      default: null,
    },

    //查询 1:按小时段，2 日期时间段
    searchType: {
      type: String | Number,
      default: null,
    },
    //(开始时间/当天日期）
    datestart: {
      type: String | Date,
      default: null,
    },
    //结束时间
    dateend: {
      type: String | Date,
      default: null,
    },
    //行为
    behavior: {
      type: String,
      default: null,
    },
    //列表页按周查或按月查
    dateType: {
      type: Number | String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      eacharData: null,
      activeBar: null,
    };
  },
  methods: {
    /**
     * 行为详情
     */
    handleKeyWordInfo() {
      this.$modal.show("behaviorPicList");
    },
    opened() {
      this.$nextTick(() => {
        this.getData();
      });
    },
    /**
     * 获取数据
     */
    getData() {
      let etime = null;
      if (this.dateType == 1) {
        const date = new Date(this.dateend);
        etime = new Date(date.setDate(date.getDate() - 1)).timeFormat(
          "yyyy-MM-dd"
        );
      } else {
        etime = this.dateend;
      }
      const data = {
        datestart: this.datestart,
        dateend: etime,
        behavior: this.behavior,
        type: this.searchType,
        teamId: this.teamId,
      };
      this.loading = true;
      this.$http
        .post("/User/Work/GetBehaviorAnalyseWordChart.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            if (resp.data && resp.data.Behavior && resp.data.Behavior.length) {
              this.eacharData = resp.data.Behavior[0];
              this.initEcharts();
            }
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 图表
     */
    initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(
        document.getElementById("behaviorChart")
      );
      let option = {
        tooltip: {
          show: true,
          formatter: "{b0} : {c0}次",
        },
        xAxis: {
          type: "category",
          data: this.eacharData.Date,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.eacharData.result,
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped>
.behavior-echarts {
  .behaviorPic {
    padding: 0 16px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      z-index: 999999;
    }
  }
  #behaviorChart {
    width: 100%;
    height: 100%;
    /deep/canvas {
      top: -30px !important;
    }
  }
}
</style>
