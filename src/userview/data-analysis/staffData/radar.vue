<template>
  <div id="radar" :style="{ width: `${width}px`, height: `${height}px` }"></div>
</template>

<script>
import { getEfficiencyColor } from "@/commons";
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
        this.radarData = [
          this.efficiencyData.TeamHistryAverage,
          this.efficiencyData.TeamAverage,
          this.efficiencyData.PGHistryAverage,
          this.efficiencyData.PGroupAverage,
          this.efficiencyData.MemberHistryAverage,
          this.efficiencyData.MemberAverage,
        ];
        this.drawLine();
      }
    },
  },
  methods: {
    getEfficiencyColor,
    drawLine() {
      let that = this;
      // 基于准备好的dom，初始化echarts实例
      var echarts = require("echarts");
      var chartDom = document.getElementById("radar");
      var myChart = echarts.init(chartDom);
      var n1 = [this.radarData[0], "", "", "", "", ""];
      var n2 = ["", this.radarData[1], "", "", "", ""];
      var n3 = ["", "", this.radarData[2], "", "", ""];
      var n4 = ["", "", "", this.radarData[3], "", ""];
      var n5 = ["", "", "", "", this.radarData[4], ""];
      var n6 = ["", "", "", "", "", this.radarData[5]];
      var n7 = ["", "", "", "", "", ""];
      var labelArr = [
        "团队历史效率",
        "团队当前效率",
        "部门历史效率",
        "部门当前效率",
        "个人历史效率",
        "个人当前效率",
      ]; //显示图例用
      // 绘制图表
      myChart.setOption({
        color: ["#64AFE9"],

        legend: {
          data: ["效率"],
          show: false,
        },
        radar: [
          {
            splitLine: {
              lineStyle: {
                color: "#000",
              },
            },
          },
          {
            indicator: [
              {
                text: "团队历史效率",
                max: that.$D.ITEM("Efficiency_Standard", 4).custom,
              },
              {
                text: "团队当前效率",
                max: that.$D.ITEM("Efficiency_Standard", 4).custom,
              },
              {
                text: "部门历史效率",
                max: that.$D.ITEM("Efficiency_Standard", 5).custom,
              },
              {
                text: "部门当前效率",
                max: that.$D.ITEM("Efficiency_Standard", 5).custom,
              },
              {
                text: "个人历史效率",
                max: that.$D.ITEM("Efficiency_Standard", 6).custom,
              },
              {
                text: "个人当前效率",
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
                padding: [3, 3],
              },
            },
            splitArea: {
              areaStyle: {
                color: ["none", "none", "none", "none", "none"],
              },
            },
            axisLine: {
              lineStyle: {
                color: "#cde6f5",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#cde6f5", //网格的颜色
              },
            },
          },
        ],
        series: [
          {
            name: "效率雷达图",
            type: "radar",
            radarIndex: 1,
            data: [
              {
                value: that.radarData,
                symbol: "rect",
                symbolSize: 6,
                lineStyle: {
                  width: 2,
                  color: "rgb(100, 175, 233)",
                },
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
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: "#000",
                // show:false
              },
            },
            silent: true,
            z: 1, //图层是一层一层叠加，所以这个也是一级一级递增
          },
          {
            type: "radar", //绘制第一个点
            radarIndex: 1,
            name: labelArr[0],
            silent: true,
            z: 2, //图层是一层一层叠加，所以这个也是一级一级递增
            data: [
              {
                value: n1,
                symbolSize: 7,
              },
            ],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: that.getEfficiencyColor(
                  that.efficiencyData.TeamHistoryStatus
                ),
              },
            },
            lineStyle: {
              width: 0,
              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },
          {
            type: "radar",
            radarIndex: 1, //绘制第二个点
            name: labelArr[1],
            silent: true,
            z: 3, //图层是一层一层叠加，所以这个也是一级一级递增
            data: [
              {
                value: n2,
                symbolSize: 7,
              },
            ],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: that.getEfficiencyColor(that.efficiencyData.TeamStatus),
              },
            },
            lineStyle: {
              width: 0,
              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },
          {
            type: "radar", //绘制第三个点
            radarIndex: 1,
            name: labelArr[2],
            silent: true,
            z: 4, //图层是一层一层叠加，所以这个也是一级一级递增
            data: [
              {
                value: n3,
                symbolSize: 7,
              },
            ],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: that.getEfficiencyColor(
                  that.efficiencyData.PGHistoryStatus
                ),
              },
            },
            lineStyle: {
              width: 0,
              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },
          {
            type: "radar", //绘制第四个点
            radarIndex: 1,
            name: labelArr[3],
            silent: true,
            z: 5, //图层是一层一层叠加，所以这个也是一级一级递增
            data: [
              {
                value: n4,
                symbolSize: 7,
              },
            ],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: that.getEfficiencyColor(that.efficiencyData.PGStatus),
              },
            },
            lineStyle: {
              width: 0,
              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },
          {
            type: "radar", //绘制第五个点
            radarIndex: 1,
            name: labelArr[4],
            silent: true,
            z: 6, //图层是一层一层叠加，所以这个也是一级一级递增
            data: [
              {
                value: n5,
                symbolSize: 7,
              },
            ],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: that.getEfficiencyColor(
                  that.efficiencyData.MemberHistoryStatus
                ),
              },
            },
            lineStyle: {
              width: 0,
              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },
          {
            type: "radar", //绘制第六个点
            radarIndex: 1,
            name: labelArr[5],
            silent: true,
            z: 7, //图层是一层一层叠加，所以这个也是一级一级递增
            data: [
              {
                value: n6,
                symbolSize: 7,
              },
            ],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: that.getEfficiencyColor(
                  that.efficiencyData.MemberStatus
                ),
              },
            },
            lineStyle: {
              width: 0,
              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },
          {
            type: "radar", //这个图层是为了盖住圆心，如果去掉，圆心的颜色为最后一个图层的颜色
            radarIndex: 1,
            name: "",
            silent: true,
            z: 8, //图层是一层一层叠加，所以这个也是一级一级递增
            data: [
              {
                value: n7,
                symbolSize: 7,
              },
            ],
            itemStyle: {
              normal: {
                borderWidth: 2,
                color: "#f8f7f7",
              },
            },
            lineStyle: {
              width: 0,
              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="less" scoped>
#radar {
  margin: 0 auto;
}
</style>
