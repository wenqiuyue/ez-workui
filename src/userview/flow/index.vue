<template>
  <div class="flow">
    <Header title="流量监控" titleEnglish="Flow Monitoring" class="baseHeader">
      <div slot="btnGroup">
        <a
          v-for="item in tabList"
          :key="item.value"
          :class="{ 'router-link-active': tabType == item.value }"
        >
          <span @click="tabChange(item.value)" class="el-dropdown-link">
            <label>{{ item.label }}</label>
          </span>
        </a>
      </div>
    </Header>
    <div class="flow_content">
      <div class="select-conditions">
        <div class="sel_inline">
          <div class="sel">
            <span>团队</span>
            <div class="team">
              <el-select
                v-model="teamValue"
                filterable
                placeholder="请选择团队"
                @change="handleTeamChange"
              >
                <el-option
                  v-for="item in teamOptions"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="sel" v-if="teamValue" style="margin-left: 8px">
            <span>员工</span>
            <selMember
              :teamId="teamValue"
              size="small"
              @Confirm="getSelMember"
              :selRange="1"
              :arrays="selMem"
              :showLength="5"
            >
              <span slot="button" class="btn-custom">
                <i class="el-icon-plus"></i>
              </span>
            </selMember>
          </div>
        </div>
        <el-button
          type="primary"
          class="search_btn"
          size="medium"
          @click="handleGetData"
          >搜 索</el-button
        >
      </div>
      <div v-if="selRow" class="chart_car" v-loading="chartLoad">
        <div id="chart"></div>
        <i class="el-icon-circle-close" @click="closeChart"></i>
      </div>
      <div
        class="flow_list"
        v-loading="loading"
        :style="`height: calc(100% - ${selRow ? 225 : 55}px)`"
      >
        <div class="flow_table" v-if="tableData && tableData.length">
          <el-table
            :data="tableData"
            border
            style="width: 100%; margin-bottom: 5px"
            :header-cell-style="attenceHeaderStyle"
            @row-click="rowClick"
          >
            <el-table-column
              label="用户名"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope"> 陈晓雅 </template>
            </el-table-column>
            <el-table-column
              label="占用（KB/S）"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope"> 462.64 </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope"> 活动 </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.pageIndex"
            :page-sizes="[20, 30, 40, 50]"
            :page-size="pageData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.totalNum"
          >
          </el-pagination>
        </div>
        <div class="empty-wrapper" v-else>
          <img src="../../assets/img/emptyMem.png" alt="" />
          <p class="empty-taskList">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  data() {
    return {
      chartLoad: false,
      xAxisData: [2, 4, 6, 8, 10, 12, 14],
      seriesData: [120, 132, 101, 134, 90, 230, 210],
      timer: null,
      selRow: null, // 选择的某一行
      tabType: 1,
      tabList: [
        {
          value: 1,
          label: "实时上传",
        },
        {
          value: 2,
          label: "实时下载",
        },
      ],
      tableData: [{}, {}],
      pageData: {
        pageIndex: 1,
        pageSize: 15,
        totalNum: 0,
      }, //分页
      loading: false,
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
      selMem: [], //选择的成员
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeChart() {
      this.selRow = null;
      clearInterval(this.timer);
      this.timer = null;
    },
    /**
     * 点击某一个人
     */
    rowClick(row, column, event) {
      console.log(row, column, event);
      this.selRow = 1;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.setTimer();
    },
    /**
     * 流量折线图
     */
    drawLine() {
      var echarts = require("echarts");
      var chartDom = document.getElementById("chart");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: "40%",
          right: "10px",
          data: ["陈晓雅"],
        },
        grid: {
          left: "60px",
          bottom: "28px",
          top: "20px",
        },
        xAxis: {
          type: "category",
          data: this.xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "陈晓雅",
            type: "line",
            stack: "总量",
            data: this.seriesData,
            color: ["#409EFF"],
          },
        ],
      };
      option && myChart.setOption(option);
    },
    /**
     * 定时器发送websocket返回实时流量
     */
    setTimer() {
      if (this.timer == null) {
        this.chartLoad = true;
        this.timer = setInterval(() => {
          this.xAxisData.push(this.xAxisData[this.xAxisData.length - 1] + 2);
          this.seriesData.push(100);
          this.drawLine();
          this.chartLoad = false;
        }, 2000);
      }
    },
    /**
     * tab视图切换
     */
    tabChange(val) {
      this.tabType = val;
    },
    /**
     * 获取列表数据
     */
    handleGetData() {
      if (!this.teamValue) {
        this.$message({
          message: "请先选择团队",
          type: "warning",
        });
        return;
      }
      this.pageData.pageIndex = 1;
      this.tableData = [];
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
    /**
     * 选择成员
     */
    getSelMember(arr) {
      this.selMem = arr;
    },
    /**
     * 团队切换
     */
    handleTeamChange() {
      this.selMem = [];
    },
    attenceHeaderStyle() {
      return {
        color: "#909399",
      };
    },
  },
};
</script>
<style lang="less" scoped>
.flow {
  height: 100%;
  /deep/header.baseHeader .right {
    & > div > a.router-link-active {
      color: #448ef5 !important;
      border-top-color: #448ef5;
    }
  }
  .el-dropdown-link {
    padding: 0.5rem 1rem;
  }
  .flow_content {
    height: 100%;
    .select-conditions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      background: #ffffff;
      padding: 5px 14px 0 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 5%);
      .search_btn {
      }
      .sel_inline {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .sel {
        display: flex;
        border-bottom: 1px solid #eee;
        align-items: center;
        height: 5rem;
        box-sizing: border-box;
        margin-right: 1rem;
        // height: 5rem;padding-left: 1rem;

        span {
          color: #333;
          font-size: 1.4rem;
          font-weight: bold;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        /deep/#mem-public {
          border: none !important;
          .location,
          .mem-imgs {
            flex-wrap: nowrap;
          }
          .mem-add {
            display: none;
          }

          .c_button {
            display: flex;
            align-items: center;
            // margin-left: 1rem;
          }

          .avatar_small {
            margin-left: 0;
            img {
              width: 2.3rem;
              height: 2.3rem;
            }
          }
        }
        .btn-custom {
          width: 35px;
          height: 20px;
          display: block;
          border: 1px solid #ccc;
          border-radius: 0.6rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s;
          // margin-left: 1rem;

          i {
            font-size: 1.4rem;
            color: #6d6d6d;
          }

          &:hover {
            border-color: #409eff;

            i {
              color: #409eff;
            }
          }
        }
        .btn {
          margin-left: 2rem;
        }
        .team {
          .el-select {
            border: 1px solid #dcdfe6;
            border-radius: 4px;
          }
        }
      }
    }
    .chart_car {
      height: 160px;
      width: 100%;
      position: relative;
      margin-bottom: 5px;
      background: #ffffff;
      #chart {
        height: 100%;
        width: 100%;
      }
      .el-icon-circle-close {
        position: absolute;
        top: -6px;
        right: -3px;
        color: #f56c6c;
        font-size: 24px;
        cursor: pointer;
      }
    }

    .flow_list {
      .flow_table {
        height: 100%;
        /deep/.el-table {
          font-size: 13px;
          height: calc(100% - 52px);
          overflow: auto;
          thead {
            tr {
              th {
                background: #f2f6fc !important;
              }
            }
          }

          th,
          td {
            padding: 8px 0;
          }
          .window_key {
            cursor: pointer;
          }
          &::before {
            background-color: transparent;
          }
        }
        .el-pagination {
          padding: 5px 8px;
          background: #fff;
        }
      }
      .empty-wrapper {
        background: #fff;
        height: 100%;

        img {
          display: block;
          margin: 5rem auto;
          margin-top: 0;
          padding-top: 5rem;
          width: 245px;
          height: 245px;
        }

        p {
          color: #6d6d6d;
          font-size: 1.6rem;
          text-align: center;
        }
      }
    }
  }
}
</style>
