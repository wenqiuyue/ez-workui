<template>
  <div>
    <div ref="myChart" :style="{ width: `${width}px`, height: '180px' }"></div>
  </div>
</template>

<script>
export default {
  props: {
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
          formatter: function(params) {
            let p = ((params.value * that.workTime) / 100).toFixed(2);
            return `${params.name}：${p}小时　(${params.value}%)`;
          },
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          left: 170,
          top: 20,
          bottom: 20,
          tooltip: {
            show: true,
          },
          formatter: function(name) {
            let tarValue = 0;
            const data = that.echartData;
            for (let i = 0; i < data.length; i++) {
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }
            let p = ((tarValue * that.workTime) / 100).toFixed(2);
            return `${name}：${p}小时　(${tarValue}%)`;
          },
        },

        series: [
          {
            name: "工作状态",
            type: "pie",
            radius: "50%",
            radius: ["0%", "70%"],
            center: ["25%", "50%"], // 图表的位置 x,y方向
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
    },
  },
  mounted() {
    this.drawLine();
  },
};
</script>

<style lang="scss" scoped></style>
