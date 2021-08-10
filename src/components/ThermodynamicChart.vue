<template>
  <div id="thermodynamic" :style="{ width: width, height: height }"></div>
</template>
<script>
export default {
  props: {
    thermodynamicData: {
      type: Array,
      default: null,
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "200px",
    },
    isColumn: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Number,
      default: 26,
    },
    row: {
      type: Number,
      default: 8,
    },
  },
  data() {
    return {
      xAxisData: [],
      yAxisData: [],
      thermodynamicArray: [],
      coordinate: [],
      visualMapVertical: {
        min: 1,
        max: 3,
        calculable: true,
        orient: "vertical",
        right: "0",
        bottom: "7%",
        color: ["#f2f6fc", "#F56C6C", "#67C23A"],
        showLabel: false,
      },
      visualMaphorizontal: {
        min: 1,
        max: 3,
        calculable: true,
        orient: "horizontal",
        right: "center",
        bottom: "1%",
        color: ["#f2f6fc", "#F56C6C", "#67C23A"],
        showLabel: false,
        itemHeight: "298",
      },
      gridVertical: {
        left: "1%",
        height: "80%",
        width: "94%",
        top: "10%",
      },
      gridHorizontal: {
        left: "1%",
        height: "75%",
        width: "97%",
        top: "6%",
      },
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
    });
  },
  methods: {
    getAxisData() {
      this.xAxisData = [];
      this.yAxisData = [];
      this.coordinate = [];
      for (let i = 0; i < this.column; i++) {
        this.xAxisData.push(i);
      }
      const row =
        Math.ceil(this.thermodynamicArray.length / this.column) < this.row
          ? this.row
          : Math.ceil(this.thermodynamicArray.length / this.column);
      for (let i = 0; i < row; i++) {
        this.yAxisData.push(i);
      }
      this.thermodynamicArray.forEach((m, index) => {
        let y = index % this.column;
        let x = Math.floor(index / this.column);
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
        grid: this.isColumn ? this.gridHorizontal : this.gridVertical,
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
        visualMap: this.isColumn
          ? this.visualMaphorizontal
          : this.visualMapVertical,
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
