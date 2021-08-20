<template>
  <div class="timeline-modal">
    <XModal
      name="timeline"
      :title="`${
        selDateTimeLine ? selDateTimeLine.Date.timeFormat('yyyy-MM-dd') : ''
      } ${selDateTimeLine ? selDateTimeLine.userName : ''}的打卡详情`"
      width="85%"
      height="90%"
      :showCrossBtn="true"
      @opened="opened"
    >
      <div v-loading="loading">
        <div class="soft">
          <div class="title"><span class="title">时间轴与使用软件</span></div>
          <div class="softbox" v-if="selDateTime && selDateTime.length">
            <div
              v-for="(item, softind) in selDateTime"
              :key="softind"
              :class="{
                speed_footer: softind % 2 == 0,
                speed_header: softind % 2 !== 0,
              }"
            >
              <div
                :class="[
                  'left',
                  item.CheckStatus == '签到' ? 'sign_in' : '',
                  item.CheckStatus == '签退' ? 'sign_out' : '',
                ]"
              >
                <span class="time"
                  ><label v-if="item.CheckStatus">{{ item.CheckStatus }}:</label
                  >{{ item.LineTime }}</span
                >
                <ul class="s_l_ul" v-if="item.Process && item.Process.length">
                  <li
                    class="s_l_li"
                    v-for="(citem, csoftind) in item.Process"
                    :key="csoftind"
                    @click="handleAppPic(citem)"
                  >
                    <tooltip
                      class="i_text"
                      :content="citem.PName"
                      :ref="`process-${csoftind}`"
                      maxWidth="70%"
                    ></tooltip>
                    <span>({{ (citem.PNamePercent * 100).toFixed(0) }}%)</span>
                  </li>
                </ul>
              </div>
              <div class="right"></div>
            </div>
          </div>
          <div class="nodata" v-else>
            <i class="hiFont hi-wushuju"></i>
            <p>暂无数据</p>
          </div>
        </div>
        <div class="scree">
          <div class="scree_title">
            <span class="title">行为热力图</span>
            <ul class="status">
              <li>
                <span style="background: #67c23a"></span><span>积极</span>
              </li>
              <li>
                <span style="background: #f56c6c"></span><span>消极</span>
              </li>
              <li>
                <span style="background: #f2f6fc"></span><span>无状态</span>
              </li>
            </ul>
          </div>
          <div class="scree_echarts">
            <ThermodynamicChart
              v-if="selDateTimeLine"
              :datestart="
                selDateTimeLine.Date.timeFormat('yyyy-MM-dd 00:00:01')
              "
              :dateend="selDateTimeLine.Date.timeFormat('yyyy-MM-dd 23:59:59')"
              :UsId="selDateTimeLine.UsId"
              :teamId="selDateTimeLine.teamId"
            ></ThermodynamicChart>
          </div>
        </div>
        <div class="scree">
          <div class="scree_title"><span class="title">定期截图</span></div>
          <div v-if="selDateTime && selDateTime.filter((m) => m.Img).length">
            <viewer
              :images="selDateTime.filter((m) => m.Img)"
              class="screephot"
            >
              <div
                class="screen"
                v-for="(itempic, picindex) in selDateTime.filter((m) => m.Img)"
                :key="picindex"
              >
                <img
                  style="width: 157px; height: 88px"
                  :src="cmurl + itempic.Img"
                  :alt="itempic.FocusFromName"
                />
                <p class="time">{{ itempic.LineTime }}</p>
              </div>
            </viewer>
          </div>
          <div class="nodata" v-else>
            <i class="hiFont hi-wushuju"></i>
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </XModal>
    <progresscom :name="'staffDataPic'" :activeBar="selRow"></progresscom>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    ThermodynamicChart: () => import("@/components/ThermodynamicChart"),
    progresscom: () => import("@/userview/data-analysis/progressCom"),
    tooltip: () => import("@/components/textTooltip"),
  },
  props: {
    selDateTimeLine: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selRow: null, //选择的软件
      selDateTime: null,
      loading: false,
    };
  },
  computed: {
    cmurl() {
      return process.env.VUE_APP_CMURL;
    },
  },
  methods: {
    /**
     * 弹窗打开
     */
    opened() {
      this.$nextTick(() => {
        this.loading = true;
        this.$http
          .post(
            "/Attendance/GetMyWorkStatusInHalfHour.ashx",
            this.selDateTimeLine
          )
          .then((resp) => {
            if (resp.res == 0) {
              this.selDateTime = resp.data;
            }
          })
          .finally(() => (this.loading = false));
      });
    },
    /**
     * 某个软件截图
     */
    handleAppPic(app) {
      this.selRow = {
        name: app.PName,
        fromList: app.fromList,
      };
      this.$nextTick(() => {
        this.$modal.show("staffDataPic");
      });
    },
  },
};
</script>
<style lang="less" scoped>
.timeline-modal {
  /deep/.modal {
    .ctn {
      overflow-y: auto;
    }
  }
  .soft {
    padding: 5px;
    height: 300px;
    background-color: #fff;
    margin: 15px 0;

    .title {
      font-size: 14px;
      color: #333;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .softbox::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px #d8d8d8;
      background: #535353;
    }
    .softbox::-webkit-scrollbar {
      width: 200px;
      height: 6px;
    }
    .softbox::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px #d8d8d8;
      border-radius: 10px;
      background: #ededed;
    }
    .softbox {
      overflow-x: scroll;
      overflow-y: hidden;
      display: flex;
      align-items: center;
      height: calc(100% - 20px);
      padding: 0 28px;
      .speed_footer {
        display: flex;
        align-items: center;
        .left {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid #448ef5;
          position: relative;
          .time {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            color: #666666;
            font-size: 12px;
            width: 60px;
            text-align: center;
          }
          .s_l_ul {
            padding-left: 5px;
            border-left: 1px solid #ccc;
            position: absolute;
            top: 30px;
            left: 50%;
            // width: 65px;
            // overflow: hidden;
            height: 108px;
            overflow-y: auto;
            padding-right: 10px;
            .s_l_li {
              font-size: 12px;
              color: #666;
              line-height: 18px;
              cursor: pointer;
              display: flex;
              flex-direction: row;
              align-items: center;
              &:hover {
                color: #448ef5;
              }
            }
          }
        }
        .sign_in {
          border: 2px solid #67c23a;
          .time {
            color: #67c23a;
          }
        }
        .sign_out {
          border: 2px solid #f56c6c;
          .time {
            color: #f56c6c;
          }
        }
        .right {
          width: 70px;
          height: 4px;
          background-color: #448ef5;
        }
      }
      .speed_header {
        display: flex;
        align-items: center;
        .left {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid #448ef5;
          position: relative;
          .time {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            color: #666666;
            font-size: 12px;
            width: 60px;
            text-align: center;
          }
          .s_l_ul {
            padding-left: 5px;
            border-left: 1px solid #ccc;
            position: absolute;
            bottom: 30px;
            left: 50%;
            height: 108px;
            overflow-y: auto;
            padding-right: 10px;
            .s_l_li {
              font-size: 12px;
              color: #666;
              line-height: 18px;
              cursor: pointer;
              display: flex;
              flex-direction: row;
              align-items: center;
              &:hover {
                color: #448ef5;
              }
            }
          }
        }
        .sign_in {
          border: 2px solid #67c23a;
          .time {
            color: #67c23a;
          }
        }
        .sign_out {
          border: 2px solid #f56c6c;
          .time {
            color: #f56c6c;
          }
        }
        .right {
          width: 70px;
          height: 4px;
          background-color: #448ef5;
        }
      }
    }
  }
  .scree {
    width: calc(100% - 16px);
    padding: 8px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .scree_title {
      margin-bottom: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .title {
        font-size: 14px;
        font-weight: 700;
        color: #333333;
      }
      .status {
        display: flex;
        flex-direction: row;
        align-items: center;
        li {
          margin-left: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          span:first-child {
            width: 1.2rem;
            height: 1.2rem;
            border-radius: 50%;
            margin-right: 5px;
          }
        }
      }
    }
    .screephot {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      .screen {
        margin: 5px 8px 5px 0;
        .time {
          text-align: center;
          color: #666666;
        }
      }
    }
  }
  .nodata {
    font-size: 14px;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .hiFont {
      font-size: 5rem;
      color: #c0c4cc;
    }
    p {
      margin-top: 8px;
      color: #909399;
    }
  }
}
</style>
