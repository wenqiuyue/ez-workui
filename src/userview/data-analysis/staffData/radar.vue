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
  data() {
    return {
      radarData: [],
    };
  },
  watch: {
    efficiencyData() {
      if (this.efficiencyData) {
        let { UserName, ...data } = this.efficiencyData;
        this.radarData = Object.values(data);
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
            {
              text: "团队鼠标效率",
              max: that.$D.ITEM("Efficiency_Standard", 4).custom,
            },
            {
              text: "团队键盘效率",
              max: that.$D.ITEM("Efficiency_Standard", 4).custom,
            },
            {
              text: "部门鼠标效率",
              max: that.$D.ITEM("Efficiency_Standard", 5).custom,
            },
            {
              text: "部门键盘效率",
              max: that.$D.ITEM("Efficiency_Standard", 5).custom,
            },
            {
              text: "个人鼠标效率",
              max: that.$D.ITEM("Efficiency_Standard", 6).custom,
            },
            {
              text: "个人键盘效率",
              max: that.$D.ITEM("Efficiency_Standard", 6).custom,
            },
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
                value: that.radarData,
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
};
</script>

<style lang="scss" scoped></style>
