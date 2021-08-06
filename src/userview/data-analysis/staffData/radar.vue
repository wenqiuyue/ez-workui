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
    efficiencyData: {
      type: Object,
      default: null,
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
  },
  watch: {
    efficiencyData() {
      if (this.efficiencyData) {
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
          indicator: that.$D.LIST("Efficiency_Standard").map((m) => {
            return { text: m.key, max: m.custom };
          }),
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
