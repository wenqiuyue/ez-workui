<template>
  <div class="keywordfrequency">
    <XModal
      width="60%"
      height="80%"
      :name="name"
      :showCrossBtn="true"
      :title="`${word}使用频率`"
      @opened="opened"
    >
      <div class="content" v-loading="loading">
        <div class="keyWordPic" v-if="!loading">
          <el-button type="primary" size="small" @click="handleKeyWordInfo"
            >高频词详情</el-button
          >
        </div>
        <div id="keyWordChart"></div>
      </div>
    </XModal>
    <progresscom
      :IsRealTimeScreenshot="IsRealTimeScreenshot"
      :name="'keywordfrequency'"
      :activeBar="{ name: word, pname: pname }"
      :stime="datestart"
      :etime="searchType == 2 ? datestart : dateend"
      :uid="uid"
      :teamValue="teamId"
      :selActiveTime="selActiveTime"
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
    //是否显示截图
    IsRealTimeScreenshot: {
      type: Boolean,
      default: true,
    },
    selActiveTime: {
      type: String,
      default: null,
    },
    teamId: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    //查询 1:按天分组；2：按小时分组
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
    //关键词
    word: {
      type: String,
      default: null,
    },
    //用户id
    uid: {
      type: Number,
      default: null,
    },
    //列表页按周查或按月查
    dateType: {
      type: Number | String,
      default: null,
    },
    pname: {
      type: Array,
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
     * 高频词详情
     */
    handleKeyWordInfo() {
      this.$modal.show("keywordfrequency");
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
      const data = {
        usId: this.uid,
        datestart: this.selActiveTime
          ? this.selActiveTime.timeFormat("yyyy-MM-dd 00:00:01")
          : this.datestart,
        dateend: this.selActiveTime
          ? this.selActiveTime.timeFormat("yyyy-MM-dd 23:59:59")
          : this.dateend,
        word: this.word,
        type: this.searchType,
        teamId: this.teamId,
      };
      this.loading = true;
      this.$http
        .get("/User/Work/ProcessStatisticsChart.ashx", {
          params: data,
        })
        .then((resp) => {
          if (resp.res == 0) {
            if (resp.data && resp.data.length) {
              this.eacharData = resp.data[0];
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
      let myChart = this.$echarts.init(document.getElementById("keyWordChart"));
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
            color: ["#409EFF"],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped>
.keywordfrequency {
  .keyWordPic {
    padding: 0 16px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      z-index: 999999;
    }
  }
  #keyWordChart {
    width: 100%;
    height: 100%;
    /deep/canvas {
      top: -30px !important;
    }
  }
}
</style>
