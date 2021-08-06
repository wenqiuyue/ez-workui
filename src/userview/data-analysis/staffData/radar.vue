<template>
  <div>
    <div
      id="radar"
      :style="{ width: `${width}px`, height: `${height}px` }"
    ></div>
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
        return 350;
      },
    },
    height: {
      type: Number,
      default: () => {
        return 250;
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
      var chartDom = document.getElementById("radar");
      var myChart = echarts.init(chartDom);
      // 绘制图表
      myChart.setOption({
        color: ["#64AFE9"],

        legend: {
          data: ["效率"],
          show: false,
        },
        radar: {
          indicator: [
            { text: "团队鼠标效率", max: 150 },
            { text: "团队键盘效率", max: 150 },
            { text: "部门鼠标效率", max: 150 },
            { text: "部门键盘效率", max: 120 },
            { text: "个人鼠标效率", max: 150 },
            { text: "个人键盘效率", max: 120 },
          ],
          center: ["50%", "50%"],
          radius: 90,
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#666",
              borderRadius: 3,
              padding: [3, 5],
            },
          },
        },
        series: [
          {
            name: "效率雷达图",
            type: "radar",
            data: [
              {
                value: [120, 118, 130, 100, 99, 70],
                name: "效率",
                symbol: "rect",
                symbolSize: 12,
                areaStyle: {
                  color: "rgba(100, 175, 233, 0.6)",
                },
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value;
                  },
                },
              },
            ],
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
