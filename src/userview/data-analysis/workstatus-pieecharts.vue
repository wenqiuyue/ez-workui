<template>
  <div>
    <div ref="myChart" :style="{ width: `100%`, height: `${height}px` }"></div>
  </div>
</template>

<script>
export default {
  props: {
    paramsobj: {
      type: Object,
      default: null,
    },
    echartData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    Title: {
      type: String,
      default: () => {
        return "";
      },
    },
    width: {
      type: Number,
      default: () => {
        return 300;
      },
    },
    height: {
      type: Number,
      default: () => {
        return 180;
      },
    },
    workTime: {
      type: String | Number,
      default: null,
    },
  },
  watch: {
    echartData() {
      if (this.echartData) {
        this.drawLine();
      }
    },
  },
  methods: {
    drawLine() {
      let that = this;
      // 基于准备好的dom，初始化echarts实例
      var echarts = require("echarts");
      var myChart = echarts.init(this.$refs.myChart);
      // 绘制图表
      myChart.setOption({
        title: {
          text: this.Title,
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let p = ((params.value * that.workTime) / 100).toFixed(2);
            return `${params.name}：${p}小时　(${params.value}%)`;
          },
        },
        legend: {
          orient: "vertical",
          left: 83,
          bottom: 10,
          formatter: function (name) {
            let tarValue = 0;
            const data = that.echartData;
            for (let i = 0; i < data.length; i++) {
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }

            return `${name}:${tarValue}%`;
          },
        },

        series: [
          {
            name: "工作状态",
            type: "pie",
            radius: ["0%", "73%"],
            center: ["15%", "50%"], // 图表的位置 x,y方向
            data: this.echartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },

            color: [
              "#5470c6",
              "#91cc75",
              "#fac858",
              "#ee6666",
              "#73c0de",
              "#3ba272",
              "#fc8452",
              "#9a60b4",
              "#ea7ccc",
              "#F7D9C4",
              "#F2C6DE",
            ],
            label: {
              normal: {
                show: false,
                position: "inside",
                formatter: `{b}:{d}%`,
              },
            },
          },
        ],
      });
      myChart.on("click", function (params) {
        const data = {
          stime: that.paramsobj.stime,
          etime: that.paramsobj.etime,
          clickUser: that.paramsobj.User.id,
          gid: that.paramsobj.User.ProgressGroupId,
        };
        that.$emit("getBarData", params.data, data);
      });
    },
  },
  mounted() {
    this.drawLine();
  },
};
</script>

<style lang="scss" scoped></style>
