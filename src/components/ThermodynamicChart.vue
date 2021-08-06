<template>
  <div id="thermodynamic" :style="{ width: `100%`, height: `200px` }"></div>
</template>
<script>
export default {
  props: {
    thermodynamicData: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      xAxisData: [],
      yAxisData: [],
      thermodynamicArray: [],
      coordinate: [],
    };
  },
  watch: {
    thermodynamicData() {
      if (this.thermodynamicData) {
        this.thermodynamicArray = this.thermodynamicData.map((m) => {
          if (m == "积极") {
            return 1;
          } else if (m == "消极") {
            return 2;
          } else if (m == "未知") {
            return 3;
          }
        });
        this.getAxisData();
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.thermodynamicArray = this.thermodynamicData.map((m) => {
        if (m == "积极") {
          return 1;
        } else if (m == "消极") {
          return 2;
        } else if (m == "未知") {
          return 3;
        }
      });
      this.getAxisData();
    });
  },
  methods: {
    getAxisData() {
      this.xAxisData = [];
      this.yAxisData = [];
      this.coordinate = [];
      for (let i = 0; i <= 24; i++) {
        this.xAxisData.push(i);
      }
      const row =
        Math.ceil(this.thermodynamicArray.length / 24) < 7
          ? 7
          : Math.ceil(this.thermodynamicArray.length / 24);
      for (let i = 0; i <= row; i++) {
        this.yAxisData.push(i);
      }
      this.thermodynamicArray.forEach((m, index) => {
        let y = index % 24;
        let x = Math.floor(index / 24);
        let array = [x, y, m];
        this.coordinate.push(array);
      });
      this.$nextTick(() => {
        this.initCharts();
      });
    },
    initCharts() {
      // 基于准备好的dom，初始化echarts实例
      var echarts = require("echarts");
      var chartDom = document.getElementById("thermodynamic");
      var myChart = echarts.init(chartDom);
      var option;
      this.coordinate = this.coordinate.map(function (item) {
        return [item[1], item[0], item[2] || "-"];
      });

      option = {
        tooltip: {
          position: "top",
          formatter: function (p) {
            if (p.value[2] == 1) {
              return "积极";
            } else if (p.value[2] == 2) {
              return "消极";
            } else if (p.value[2] == 3) {
              return "未知";
            }
          },
        },
        grid: {
          left: "1%",
          height: "65%",
          width: "94%",
          top: "10%",
        },
        xAxis: {
          type: "category",
          data: this.xAxisData,
          splitArea: {
            show: true,
          },

          axisTick: {
            show: false, //不显示坐标轴刻度线
          },
          axisLine: {
            show: false, //不显示坐标轴线
          },
          axisLabel: {
            show: false, //不显示坐标轴上的文字
          },
        },
        yAxis: {
          type: "category",
          data: this.yAxisData,
          splitArea: {
            show: true,
          },
          yAxisIndex: 2,
          axisTick: {
            show: false, //不显示坐标轴刻度线
          },
          axisLine: {
            show: false, //不显示坐标轴线
          },
          axisLabel: {
            show: false, //不显示坐标轴上的文字
          },
        },
        visualMap: {
          min: 1,
          max: 3,
          calculable: true,
          orient: "vertical",
          right: "0",
          bottom: "14%",
          color: ["#f2f6fc", "#F56C6C", "#67C23A"],
          showLabel: false,
        },
        series: [
          {
            name: "Punch Card",
            type: "heatmap",
            data: this.coordinate,

            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped></style>
