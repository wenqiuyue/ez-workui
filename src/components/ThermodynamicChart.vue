<template>
  <div class="therm_charts">
    <div
      class="left_page"
      @click="changePage(1)"
      :style="`${pageData.page <= 1 ? 'cursor: no-drop;' : ''}`"
    >
      <i class="el-icon-arrow-left"></i>
    </div>
    <transition name="slide-fade">
      <div
        id="thermodynamic"
        :style="{ width: width, height: height }"
        v-if="show"
      ></div>
    </transition>
    <div
      class="right_page"
      @click="changePage(2)"
      :style="`${
        pageData.page >= pageData.totalPageCount ? 'cursor: no-drop;' : ''
      }`"
    >
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    datestart: {
      type: String,
      default: null,
    },
    dateend: {
      type: String,
      default: null,
    },
    UsId: {
      type: Number,
      default: null,
    },
    teamId: {
      type: Number,
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
      show: false,
      pageData: {
        page: 1,
        totalPageCount: 0,
      },
      thermodynamicData: [],
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
        type: "continuous",
        min: 1,
        max: 3,
        calculable: true,
        orient: "horizontal",
        right: "center",
        bottom: "1%",
        color: ["#f2f6fc", "#F56C6C", "#67C23A"],
        showLabel: false,
        itemHeight: "310",
      },
      gridVertical: {
        left: "1%",
        height: "80%",
        width: "94%",
        top: "10%",
      },
      gridHorizontal: {
        left: "center",
        height: "75%",
        width: "88%",
        top: "6%",
      },
    };
  },
  watch: {
    dateend() {
      if (this.dateend) {
        this.getData();
      }
    },
  },
  computed: {
    cmurl() {
      return process.env.VUE_APP_CMURL;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    /**
     * 分页
     */
    changePage(type) {
      if (type == 1 && this.pageData.page > 1) {
        this.pageData.page--;
        this.getData();
      } else if (
        type == 2 &&
        this.pageData.page < this.pageData.totalPageCount
      ) {
        this.pageData.page++;
        this.getData();
      }
    },
    getData() {
      const data = {
        UsId: this.UsId,
        datestart: this.datestart,
        dateend: this.dateend,
        teamId: this.teamId,
        page: this.pageData.page,
        pageCount: this.column * this.row,
      };
      this.show = false;
      this.$http
        .post("/User/Work/GetBehaviorThermodynamicChart.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.pageData.totalPageCount = Math.ceil(
              resp.data.TotalCount / (this.column * this.row)
            );
            this.thermodynamicData = resp.data.Behavior;
            this.thermodynamicArray = this.thermodynamicData.map((m) => {
              if (m.BehavoirType == "积极") {
                return 1;
              } else if (m.BehavoirType == "消极") {
                return 2;
              } else if (m.BehavoirType == "未知") {
                return 3;
              }
            });
            this.show = true;
            this.getAxisData();
          }
        });
    },
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
      const that = this;
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
          extraCssText: "z-index:99999999",
          confine: true,
          formatter: function (p) {
            const val = p.value[0] + p.value[1] * 12;
            const item = that.thermodynamicData[val].CompterInfos[0];
            let html = `
                    <span>行为：${that.thermodynamicData[val].Behavoir} </span>
                    <span style="margin-left:10px">行为状态：${that.thermodynamicData[val].BehavoirType} </span>
                    <br>
                    <span>进程名：${item.Pname}</span>
                    <span style="margin-left:10px">窗口名：${item.FocusFormName}</span>
                    <br>
                    <image
                      style="max-width: 200px"
                      src="${that.cmurl}${item.ImageName}"
                      alt=""
                    >
                    </image>
                  `;
            return html;
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
              show: false,
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
<style lang="less" scoped>
.therm_charts {
  position: relative;
  .left_page,
  .right_page {
    display: none;
    position: absolute;
    top: 38%;
    background: rgba(192, 196, 204, 0.5);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    text-align: center;
    line-height: 36px;
    z-index: 999;
    cursor: pointer;
    i {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .left_page {
    left: 0;
  }
  .right_page {
    right: 0;
  }
  &:hover {
    .left_page,
    .right_page {
      display: block;
    }
  }
  .slide-fade-enter-active {
    transition: all 0.8s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(20px);
    opacity: 0;
  }
}
#thermodynamic {
  margin: 0 auto;
}
</style>
