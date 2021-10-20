<template>
  <div class="schedulingSet">
    <div class="set_card" v-if="typePage == 'batch'">
      <div class="tag_item_list">
        <div class="tag_item t_i_bg1" style="width: 18rem"></div>
        <div class="tag_item t_i_bg2" style="width: 17rem"></div>
        <div class="tag_item t_i_bg3" style="width: 16rem">
          <div>成员选择</div>
        </div>
      </div>
      <div class="set_mem">
        <selMember
          :teamId="teamValue"
          size="small"
          @Confirm="getSelMember"
          :selRange="1"
          :arrays="selMem"
        >
        </selMember>
      </div>
    </div>
    <div class="set_card">
      <div class="tag_item_list">
        <div class="tag_item t_i_bg1" style="width: 18rem"></div>
        <div class="tag_item t_i_bg2" style="width: 17rem"></div>
        <div class="tag_item t_i_bg3" style="width: 16rem">
          <div>通用排班设置</div>
        </div>
        <div class="save_btn">
          <el-button type="success" size="small">保 存</el-button>
        </div>
      </div>
      <div class="set_form">
        <el-form ref="form" :model="currencyForm" label-width="140px">
          <el-form-item label="每周工作日：">
            <div>
              <el-button type="text">全选</el-button>
              <span style="margin: 0 10px">/</span>
              <el-button type="text">取消全选</el-button>
            </div>
            <el-checkbox-group
              v-model="currencyForm.weekDay"
              style="line-height: 22px"
            >
              <el-checkbox
                v-for="witem in $D.LIST('week')"
                :label="witem.value"
                :key="witem.value"
                >{{ witem.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="时区：">
            <el-select v-model="currencyForm.timeZone" placeholder="请选择时区">
              <el-option
                v-for="item in timeZoneOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一天内的时间区间：">
            <ul>
              <li
                v-for="(interval, intervalInd) in currencyForm.timeInterval"
                :key="intervalInd"
              >
                <el-time-picker v-model="interval.start" placeholder="开始时间">
                </el-time-picker>
                -
                <el-time-picker v-model="interval.end" placeholder="结束时间">
                </el-time-picker>
                <el-button type="text" @click="cancleInterval(intervalInd)"
                  >清除</el-button
                >
              </li>
            </ul>
            <el-button type="text" @click="addTimeInterval"
              >添加时间区间</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="set_card">
      <div class="tag_item_list">
        <div class="tag_item t_i_bg1" style="width: 18rem"></div>
        <div class="tag_item t_i_bg2" style="width: 17rem"></div>
        <div class="tag_item t_i_bg3" style="width: 16rem">
          <div>特殊排班设置</div>
        </div>
      </div>
      <div class="set_form">
        <el-calendar v-model="month">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div style="height: 100%" @click="setSpecial(data.day)">
              <div class="day_p">
                <span>{{ data.day.split("-").slice(1).join("-") }}</span>
                <div>
                  <el-tag
                    type="success"
                    v-if="data.day == '2021-10-07' || data.day == '2021-10-03'"
                    size="small"
                    >班</el-tag
                  >
                  <el-tag
                    type="warning"
                    v-if="data.day == '2021-10-10' || data.day == '2021-10-03'"
                    size="small"
                    >假</el-tag
                  >
                </div>
              </div>
            </div>
          </template></el-calendar
        >
      </div>
    </div>
    <SpecialSchedulingSet :selSpecialDay="selSpecialDay"></SpecialSchedulingSet>
  </div>
</template>
<script>
export default {
  components: {
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    SpecialSchedulingSet: () => import("./specialSchedulingSet"),
  },
  props: {
    //团队
    teamValue: {
      type: Number,
      default: null,
    },
    //类型
    typePage: {
      type: String,
      default: null,
    },
    //月份
    screenMonth: {
      type: Date,
      default: null,
    },
  },
  data() {
    return {
      month: null,
      selSpecialDay: null,
      selMem: [], //选择的成员
      timeZoneOptions: [
        {
          value: 1,
          name: "GMT+8",
        },
      ], //时区选项
      currencyForm: {
        weekDay: [],
        timeZone: 1, //时区
        timeInterval: [],
      },
    };
  },
  watch: {
    screenMonth(val, oval) {
      if (val != oval) {
        this.month = this.screenMonth;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.month = this.screenMonth;
    });
  },
  methods: {
    /**
     * 设置某一天特殊的排班
     */
    setSpecial(day) {
      this.selSpecialDay = day;
      this.$modal.show("special");
    },
    /**
     * 获取成员
     */
    getSelMember(val) {
      this.selMem = val;
    },
    /**
     * 清除时间区间
     */
    cancleInterval(ind) {
      this.currencyForm.timeInterval = this.currencyForm.timeInterval.filter(
        (m, index) => ind != index
      );
    },
    /**
     * 添加时间区间
     */
    addTimeInterval() {
      this.currencyForm.timeInterval.push({
        start: null,
        end: null,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.schedulingSet {
  height: 100%;
  background: #ffffff;
  overflow: auto;
  .set_card {
    position: relative;

    // margin-bottom: 6px;
    .tag_item_list {
      border-bottom: 2px dashed rgb(83, 168, 255);
      height: 3.5rem;
      .save_btn {
        position: absolute;
        right: 0;
        .el-button {
          padding: 5px 15px;
          font-size: 20px;
        }
      }
      .tag_item {
        width: 11rem;
        height: 3.3rem;
        line-height: 3.4rem;
        transform: skew(25deg);
        -webkit-transform: skew(30deg);
        -moz-transform: skew(30deg);
        position: absolute;
        left: -3rem;
        div {
          transform: skew(-25deg);
          -webkit-transform: skew(-30deg);
          -moz-transform: skew(-30deg);
          width: calc(100% - 3rem);
          text-align: center;
          color: #ffffff;
          font-size: 1.4rem;
          float: right;
        }
      }
      .t_i_bg1 {
        background: rgb(198, 226, 255);
      }
      .t_i_bg2 {
        background: rgb(140, 197, 255);
      }
      .t_i_bg3 {
        background: rgb(83, 168, 255);
      }
    }
    .set_mem {
      padding: 18px 6px;
    }
    .set_form {
      padding: 3px 6px;
      .el-form-item {
        ul {
          li {
            margin-bottom: 10px;
            .el-button {
              margin-left: 10px;
            }
          }
          li:last-child {
            margin-bottom: 0px;
          }
        }
      }
      .el-form-item:last-child {
        margin-bottom: 10px;
      }
      /deep/.el-calendar {
        .el-calendar__header {
          display: none;
        }
        .el-calendar-day {
          .day_p {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            span {
              flex-shrink: 0;
            }
            .el-tag {
              margin: 0 3px;
            }
          }
        }
      }
    }
  }
}
</style>
