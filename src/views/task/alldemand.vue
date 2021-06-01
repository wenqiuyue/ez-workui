<template>
  <div
    class="alldemand"
    v-loading="loading"
    v-infinite-scroll="scrollLoad"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="30"
  >
    <div class="demand_table" v-if="demandData && demandData.length">
      <div
        class="demand_table_row"
        v-for="(ditem, index) in demandData"
        :key="index"
      >
        <div class="demand_table_cell">
          <div class="demand_card">
            <div class="c_title">
              <tooltip
                :content="ditem.Name"
                :ref="`demand-${index}`"
                width="92px"
              ></tooltip>
              <h6>当前累计耗时</h6>
              <h4>{{ ditem.CostTime ? ditem.CostTime : 0 }}H</h4>
              <h6>累计预计耗时</h6>
              <h4>{{ ditem.EstimatedTime ? ditem.EstimatedTime : 0 }}H</h4>
              <h6>当前任务数量</h6>
              <h4>{{ ditem.TaskTotalCount }}</h4>
            </div>
            <div
              class="c_main"
              v-if="
                ditem.StepData &&
                  ditem.StepData.Data &&
                  ditem.StepData.Data.length
              "
            >
              <el-progress
                :percentage="(ditem.starNum / ditem.StepData.Data.length) * 100"
                :show-text="false"
                :stroke-width="14"
                color="#448EF5"
                class="all_pro"
              />
              <div class="demand_card_list">
                <div v-for="(item, index) in ditem.StepData.Data" :key="index">
                  <div
                    :class="
                      `demand ${
                        item.IsExcuting || item.IsFinished ? '' : ' not_started'
                      }`
                    "
                  >
                    <div class="d_title">
                      <div class="d_t_left">
                        <span class="demand_name">
                          <tooltip
                            :content="item.Name"
                            :ref="`demand-name-${item.Name}`"
                            maxWidth="96px"
                          ></tooltip
                        ></span>
                        <el-tag
                          class="left_tag success_tag"
                          v-if="item.IsFinished"
                        >
                          已完成
                        </el-tag>
                        <el-tag
                          class="left_tag blue_tag"
                          v-else-if="
                            item.IsExcuting &&
                              !item.IsFinished &&
                              item.TaskCount > 0
                          "
                        >
                          进行中
                        </el-tag>
                        <el-tag
                          class="left_tag"
                          v-else-if="
                            !item.IsExcuting ||
                              (!item.IsFinished && item.TaskCount == 0)
                          "
                        >
                          未开始
                        </el-tag>
                        <el-tag
                          class="left_tag blue_tag"
                          v-if="
                            item.IsExcuting &&
                              !item.IsFinished &&
                              item.TaskCount == 0
                          "
                        >
                          现阶段
                        </el-tag>
                      </div>
                      <span class="d_t_time" v-if="item.EstimatedTime"
                        >预计耗时：{{ item.EstimatedTime }}H</span
                      >
                    </div>
                    <div
                      :class="
                        `member_row ${
                          item.isExcutersMore ? ' member_row_more' : ''
                        }`
                      "
                    >
                      <div class="member_list">
                        <div
                          class="member"
                          v-for="(itemExc, index) in item.Excuters"
                          :key="itemExc.UsId"
                        >
                          <el-avatar
                            size="small"
                            :src="$url + itemExc.Picture"
                            @error="errorHandler"
                            ><img
                              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                          /></el-avatar>
                          <div class="mem_info">
                            <p>
                              {{ itemExc.Name
                              }}<span class="task_num" v-if="itemExc.TaskCount">
                                ({{ itemExc.TaskCount }}个)</span
                              >
                            </p>
                            <p>
                              <span
                                >耗时：{{
                                  itemExc.CostTime ? itemExc.CostTime : 0
                                }}小时</span
                              >
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="mem_more" v-if="item.Excuters.length > 2">
                        <i
                          class="el-icon-caret-bottom"
                          v-if="!item.isExcutersMore"
                          @click="item.isExcutersMore = !item.isExcutersMore"
                        ></i
                        ><i
                          class="el-icon-caret-top"
                          @click="item.isExcutersMore = !item.isExcutersMore"
                          v-else
                        ></i>
                      </div>
                    </div>
                    <el-progress
                      class="progress"
                      :text-inside="true"
                      :stroke-width="16"
                      :percentage="item.completion"
                      :format="formatCompletion"
                    ></el-progress>
                    <el-progress
                      class="progress"
                      :text-inside="true"
                      :stroke-width="16"
                      :percentage="item.timeConsumingRatio"
                      :format="formatTime"
                      color="#13C2C2"
                    ></el-progress>
                    <div class="tim_consuming">
                      <span
                        >{{ item.timeConsumingRatio }}实际耗时：{{
                          item.CostTime ? `${item.CostTime}` : 0
                        }}H</span
                      >
                      <span
                        >进度：<label
                          :style="
                            `color:${
                              getSpeed(item.CostTime, item.EstimatedTime).color
                            }`
                          "
                          >{{
                            getSpeed(item.CostTime, item.EstimatedTime).text
                          }}</label
                        ></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty_demand">
      <div>
        <img src="../../assets/img/emptyTask.png" />
        <p class="tip_text">
          暂无数据
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: { tooltip: () => import("@/components/textTooltip") },
  props: {
    isProLeader: {
      type: Boolean,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    isProLeader(newVal, oldVal) {
      console.log("监听", newVal);
      this.isProLeader2 = newVal;
    },
  },
  data() {
    return {
      loading: false,
      demandData: [],
      busy: true,
      pageData: {
        pageIndex: 1,
        pageSize: 20,
        pageNum: 0,
      }, //分页
      isProLeader2: null,
      dcId: null,
      userView: null,
      version: null,
    };
  },
  filters: {
    status(val) {
      switch (val) {
        case 0:
          return "未开始";
        case 1:
          return "已完成";
        case 2:
          return "进行中";
        default:
          return "未知";
      }
    },
  },
  mounted() {
    this.getAllDemand();
  },
  methods: {
    errorHandler() {
      return true;
    },
    /**
     * 进度快慢
     * costTime:实际耗时；estTime：预估耗时
     */
    getSpeed(costTime, estTime) {
      const timeDiff = estTime - costTime;
      const percentage = Math.round((Math.abs(timeDiff) / estTime) * 100);
      if (estTime > 0 && costTime > 0 && estTime == costTime) {
        return {
          color: "#448EF5",
          text: `一般（快0%）`,
        };
      } else if (estTime > 0 && costTime > 0 && timeDiff < 0) {
        if (percentage > 0 && percentage <= 5) {
          return {
            color: "#448EF5",
            text: `一般（慢${percentage}%）`,
          };
        } else if (percentage > 5 && percentage <= 25) {
          return {
            color: "#F59F00",
            text: `较慢（慢${percentage}%）`,
          };
        } else {
          return {
            color: "#F03E3E",
            text: `慢（慢${percentage}%）`,
          };
        }
      } else if (estTime > 0 && costTime > 0 && timeDiff > 0) {
        if (percentage > 0 && percentage <= 15) {
          return {
            color: "#448EF5",
            text: `一般（快${percentage}%）`,
          };
        } else {
          return {
            color: "#37B24D",
            text: `快（快${percentage}%）`,
          };
        }
      } else {
        return "";
      }
    },
    formatCompletion(per) {
      if (per) {
        return `完成度${per}%`;
      } else {
        return `完成度`;
      }
    },
    formatTime(per) {
      if (per) {
        return `耗时比例${per}%`;
      } else {
        return `耗时比例`;
      }
    },
    scrollLoad() {
      this.busy = true;
      this.pageData.pageIndex++;
      this.getAllDemand();
    },
    refreshAllDeMandData(val, admin, version) {
      this.demandData = [];
      this.pageData.pageIndex = 1;
      this.dcId = val;
      this.userView = admin;
      this.version = version;
      this.getAllDemand();
    },
    /**
     * 数据获取
     */
    getAllDemand() {
      this.loading = true;
      const data = {
        eid: this.$route.params.eid,
        page: this.pageData.pageIndex,
        limit: this.pageData.pageSize,
        dcId: this.dcId,
        userView: this.userView,
        version: this.version,
      };
      this.$http
        .post("/Work/Project/Demand/GetAll.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            resp.data.Datas.forEach((ele, index) => {
              //阶段进度
              ele.starNum = 0;
              //循环阶段
              if (ele.StepData) {
                ele.StepData.Data.forEach((step, inds) => {
                  //阶段执行人是否查看更多
                  step.isExcutersMore = false;
                  //完成度
                  step.completion = 0;
                  if (step.TaskCount > 0) {
                    step.completion = parseFloat(
                      ((step.TaskFinished / step.TaskCount) * 100).toFixed(2)
                    );
                  }
                  //耗时比例
                  step.timeConsumingRatio = 0;
                  if (step.CostTime && step.EstimatedTime) {
                    step.timeConsumingRatio = parseFloat(
                      ((step.CostTime / step.EstimatedTime) * 100).toFixed(2)
                    );
                  }
                  //已完成和正在进行的阶段数量合计
                  if (step.IsFinished || step.IsExcuting) {
                    ele.starNum++;
                  } else if (step.TaskCount > 0 && step.IsExcuting) {
                    ele.starNum++;
                  }
                });
              }
            });
            console.log(resp.data.Datas);
            this.demandData.push(...resp.data.Datas);
            if (resp.data.Datas.length < this.pageData.pageSize) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../assets/variable.less";
.alldemand {
  padding: 0 10px;
  height: calc(100% + 12px);
  overflow-y: scroll;
  margin-top: -12px;
  .demand_table {
    display: table;
    border-collapse: separate;
    border-spacing: 10px 12px;
    .demand_table_row {
      display: table-row;
      .demand_table_cell {
        display: table-cell;
        background: #fbfbfb;
        padding: 15px 15px 6px 15px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 5%);
      }
    }
  }
  .demand_card {
    width: max-content;
    display: flex;
    flex-direction: row;
    .c_title {
      flex-shrink: 0;
      color: #333333;
      h4,
      h6,
      /deep/.over-flow {
        margin-bottom: 8px;
        text-align: center;
      }
      /deep/.tooltip_text {
        font-weight: bold;
        font-size: 20px;
      }
      h4 {
        font-weight: bold;
        font-size: 18px;
      }
      h6 {
        font-weight: bold;
        font-size: 12px;
        color: #666666;
      }
    }
    .c_main {
      // width: calc(100% - 288px);
      margin-left: 22px;
      .all_pro {
        /deep/.el-progress-bar__outer {
          background-color: rgba(68, 142, 245, 0.5);
        }
      }
      .demand_card_list {
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
        margin-top: 12px;
        width: 100%;
        .demand {
          width: 250px;
          flex-shrink: 0;
          background-color: #ffffff;
          padding: 10px 8px;
          margin-right: 8px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 5%);
          .d_title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .d_t_left {
              display: flex;
              align-items: center;
              span {
                font-size: 14px;
                color: #333333;
                font-weight: 600;
              }
              .left_tag {
                padding: 0 4px;
                color: #ffffff;
                height: 16px;
                line-height: 16px;
                margin-left: 5px;
                font-size: 12px;
                background-color: #aaaaaa;
                border-color: #aaaaaa;
              }
              .blue_tag {
                background-color: #448ef5;
                border-color: #448ef5;
              }
              .success_tag {
                background-color: #37b24d;
                border-color: #37b24d;
              }
            }
            .d_t_time {
              font-size: 12px;
              color: #666666;
              font-weight: bold;
            }
          }
          .member_row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            height: 45px;
            overflow-y: hidden;
            .mem_more {
              padding-top: 16px;
              font-weight: bold;
              i {
                font-size: 16px;
                cursor: pointer;
              }
            }
          }
          .member_row_more {
            height: auto !important;
          }
          .member_list {
            margin-top: 8px;
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
            .member {
              display: flex;
              flex-direction: row;
              align-items: center;
              flex-wrap: wrap;
              margin: 0 6px 9px 0;
              .mem_info {
                margin-left: 5px;
                p {
                  color: #666666;
                  font-size: 12px;
                  font-weight: bold;
                  span {
                    margin-right: 5px;
                  }
                  .task_num {
                    cursor: pointer;
                    color: #448ef5;
                  }
                }
              }
            }
          }
          .progress {
            margin-top: 8px;
          }
          .tim_consuming {
            margin-top: 8px;
            span {
              color: #666666;
              font-weight: bold;
            }
            span:last-child {
              margin-left: 15px;
            }
          }
        }
        .not_started {
          background: #efefef;
          .demand_name,
          .task_num {
            color: #666666 !important;
          }
          /deep/.el-progress-bar__outer {
            background: #ffffff;
            .el-progress-bar__innerText {
              color: #aaaaaa;
            }
          }
        }
      }
    }
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #d8d8d8;
    }
  }
}
.alldemand::-webkit-scrollbar-track-piece,
.alldemand::-webkit-scrollbar-thumb,
.alldemand::-webkit-scrollbar-corner,
.demand_card_list::-webkit-scrollbar-track-piece,
.demand_card_list::-webkit-scrollbar-thumb {
  background-color: transparent;
}
.empty_demand {
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0 10px;
  div {
    background: rgba(255, 255, 255, 1);
    height: 100%;
    display: table-cell;
    vertical-align: middle;
    width: 100%;
    img {
      max-width: 100%;
      max-height: 82%;
      display: block;
      margin: auto;
    }
  }
}
</style>
