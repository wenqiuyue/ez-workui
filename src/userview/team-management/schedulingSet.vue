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
          <el-button
            type="success"
            size="small"
            @click="handleSave"
            :loading="saveBtnLoading"
            >保 存</el-button
          >
        </div>
      </div>
      <div class="set_form" v-loading="loading">
        <el-form ref="form" :model="currencyForm" label-width="140px">
          <el-form-item label="每周工作日：">
            <div>
              <el-button type="text" @click="handleSelAllWeek">全选</el-button>
              <span style="margin: 0 10px">/</span>
              <el-button type="text" @click="currencyForm.weekDay = []"
                >取消全选</el-button
              >
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
            <el-select
              v-model="currencyForm.timeZone"
              filterable
              placeholder="请选择时区"
            >
              <el-option
                v-for="item in timeZonesOptions"
                :key="item.Id"
                :label="item.StandardName"
                :value="item.Id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="一天内的时间区间：">
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
          </el-form-item> -->
          <div class="row_form_item">
            <el-form-item label="上班：">
              <el-time-picker
                v-model="currencyForm.startWork"
                placeholder="选择上班时间"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item label="下班：">
              <el-time-picker
                v-model="currencyForm.endWork"
                placeholder="选择下班时间"
              >
              </el-time-picker>
            </el-form-item>
          </div>
          <div class="row_form_item">
            <el-form-item label="时薪：">
              <el-select
                v-model="currencyForm.hourlyWage"
                placeholder="请选择时薪"
              >
                <el-option
                  v-for="item in wageOptions"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="加班时薪：">
              <el-select
                v-model="currencyForm.hourlyWageOver"
                placeholder="请选择加班时薪"
              >
                <el-option
                  v-for="item in wageOptions"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="休息时间：">
            <ul>
              <li
                v-for="(interval, intervalInd) in currencyForm.timeInterval"
                :key="intervalInd"
              >
                <el-time-picker
                  v-model="interval.start"
                  placeholder="开始休息时间"
                >
                </el-time-picker>
                <span style="margin: 0 10px">-</span>
                <el-time-picker
                  v-model="interval.end"
                  placeholder="结束休息时间"
                >
                </el-time-picker>
                <el-button type="text" @click="cancleInterval(intervalInd)"
                  >清除</el-button
                >
              </li>
            </ul>
            <el-button type="text" @click="addTimeInterval"
              >添加休息时间区间</el-button
            >
          </el-form-item>
          <div class="form_item_group">
            <h3>
              弹性打卡
              <el-button type="text" @click="cancleElastic">清除设置</el-button>
            </h3>
            <el-form-item label="上班最多可晚到：">
              <el-input
                placeholder="请输入内容"
                v-model="currencyForm.lateWork"
                type="number"
              >
                <template slot="append">
                  <div>
                    <span style="margin-right: 12px">分钟</span>
                    <el-radio-group v-model="currencyForm.lateWorkRadio">
                      <el-radio :label="1"
                        >上班晚到几分钟，下班须晚走几分钟</el-radio
                      >
                      <el-radio :label="2"
                        >晚到{{
                          currencyForm.lateWork ? currencyForm.lateWork : "几"
                        }}钟内不算迟到</el-radio
                      >
                    </el-radio-group>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="下班最多可早走：">
              <el-input
                placeholder="请输入内容"
                v-model="currencyForm.leaveEarly"
                type="number"
              >
                <template slot="append">
                  <div>
                    <span style="margin-right: 12px">分钟</span>
                    <el-radio-group v-model="currencyForm.leaveEarlyRadio">
                      <el-radio :label="1"
                        >上班早到几分钟，下班可早走几分钟</el-radio
                      >
                      <el-radio :label="2"
                        >早走{{
                          currencyForm.leaveEarly
                            ? currencyForm.leaveEarly
                            : "几"
                        }}分钟内不算早退</el-radio
                      >
                    </el-radio-group>
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <!-- <el-form-item label="班次工时：">
            <ul>
              <li>
                <el-input
                  placeholder="请输入内容"
                  v-model="input2"
                  type="number"
                >
                  <template slot="prepend">合作工作时长</template>
                  <template slot="append">分钟</template>
                </el-input>
                <el-input
                  placeholder="请输入内容"
                  v-model="input2"
                  type="number"
                >
                  <template slot="prepend">计为</template>
                  <template slot="append">天出勤</template>
                </el-input>
              </li>
            </ul>
          </el-form-item> -->
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
        <div class="s_item">
          <span class="title">月份：</span>
          <el-date-picker
            size="medium"
            v-model="screenMonth"
            type="month"
            placeholder="选择月"
            format="yyyy年MM月"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="set_form" v-loading="loadingSpecial">
        <el-calendar v-model="month" v-if="specialData && specialData.length">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div
              v-if="
                data.type === 'current-month' &&
                specialData[parseInt(data.day.split('-').slice(2)) - 1]
              "
              style="height: 100%"
              @click="
                setSpecial(
                  data.day,
                  specialData[parseInt(data.day.split('-').slice(2)) - 1]
                )
              "
            >
              <div class="day_p">
                <span>{{ data.day.split("-").slice(1).join("-") }}</span>
                <div
                  v-if="
                    specialData[parseInt(data.day.split('-').slice(2)) - 1].Id
                  "
                >
                  <el-tag
                    type="success"
                    v-if="
                      specialData[parseInt(data.day.split('-').slice(2)) - 1]
                        .IsWork
                    "
                    size="small"
                    >班</el-tag
                  >
                  <el-tag type="warning" v-else size="small">假</el-tag>
                </div>
              </div>
            </div>
          </template></el-calendar
        >
      </div>
    </div>
    <SpecialSchedulingSet
      :selSpecialDay="selSpecialDay"
      :selSpecialDayData="selSpecialDayData"
      :timeZonesOptions="timeZonesOptions"
      :wageOptions="wageOptions"
      :generaId="generaId"
      :selMem="selMem"
      :teamValue="teamValue"
      @success="getSpecialData"
    ></SpecialSchedulingSet>
  </div>
</template>
<script>
export default {
  components: {
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    SpecialSchedulingSet: () => import("./specialSchedulingSet"),
  },
  props: {
    //时薪选项
    wageOptions: {
      type: Array,
      default: null,
    },
    //成员id
    generaId: {
      type: Number,
      default: null,
    },
    timeZonesOptions: {
      type: Array,
      default: null,
    },
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
  },
  data() {
    return {
      loadingSpecial: false,
      specialData: [], //特殊排班日历的数据
      loading: false,
      saveBtnLoading: false,
      screenMonth: new Date(),
      month: null,
      selSpecialDay: null, //选择的特殊日期
      selSpecialDayData: null, //选择的特殊日期的数据
      selMem: [], //选择的成员
      //时区选项
      currencyForm: {
        hourlyWage: null, //时薪
        hourlyWageOver: null, //加班时薪
        weekDay: [],
        timeZone: "China Standard Time", //时区
        startWork: null, //上班
        endWork: null, //下班
        lateWork: null, //上班晚到
        lateWorkRadio: null, //上班晚到条件选择
        leaveEarly: null, //下班早走
        leaveEarlyRadio: null, //下班早走条件选择
        timeInterval: [
          {
            start: null,
            end: null,
          },
        ],
      },
    };
  },
  watch: {
    screenMonth(val, oval) {
      if (val != oval) {
        this.month = this.screenMonth;
        this.getSpecialData();
      }
    },
    generaId(val, oval) {
      if (val != oval) {
        this.getPlanBCDetail();
        this.getSpecialData();
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.month = this.screenMonth;
      this.getPlanBCDetail();
      this.getSpecialData();
    });
  },
  methods: {
    /**
     * 清除弹性打卡
     */
    cancleElastic() {
      this.currencyForm.lateWork = null; //上班晚到
      this.currencyForm.lateWorkRadio = null; //上班晚到条件选择
      this.currencyForm.leaveEarly = null; //下班早走
      this.currencyForm.leaveEarlyRadio = null; //下班早走条件选择
    },
    /**
     * 获取通用排班详情
     */
    getPlanBCDetail() {
      this.loading = true;
      this.$http
        .post("/Attendance/PlanBC/GetGeneralPlanBCDetail.ashx", {
          UserId: this.generaId,
          teamId: this.teamValue,
        })
        .then((resp) => {
          if (resp.res == 0) {
            const data = resp.data.Data;
            if (data) {
              this.currencyForm.weekDay = data.PlanWeekWorkDays;
              this.currencyForm.hourlyWage = data.WageTypeId;
              this.currencyForm.hourlyWageOver = data.WageTypeOverId;
              this.currencyForm.timeZone = data.TimeZone;
              this.currencyForm.startWork = data.CheckInTime;
              this.currencyForm.endWork = data.CheckOutTime;

              this.currencyForm.timeInterval = data.FreeTimes.map((m) => {
                return {
                  start: m.StartTime,
                  end: m.EndTime,
                };
              });
              this.currencyForm.lateWork = data.CheckInDuration;
              this.currencyForm.leaveEarly = data.CheckOutDuration;
              if (data.IsSetCheckInElasticity) {
                this.currencyForm.lateWorkRadio = 1;
              } else if (data.IsSetCheckInHumanization) {
                this.currencyForm.lateWorkRadio = 2;
              }
              if (data.IsSetCheckOutElasticity) {
                this.currencyForm.leaveEarlyRadio = 1;
              } else if (data.IsSetCheckOutHumanization) {
                this.currencyForm.leaveEarlyRadio = 2;
              }
            } else {
              Object.keys(this.currencyForm).forEach((m) => {
                if (m == "timeZone") {
                  this.currencyForm[m] = "China Standard Time";
                } else if (m == "weekDay") {
                  this.currencyForm[m] = [];
                } else if (m == "timeInterval") {
                  this.currencyForm[m] = [
                    {
                      start: null,
                      end: null,
                    },
                  ];
                } else {
                  this.currencyForm[m] = null;
                }
              });
            }
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 特殊排班
     */
    getSpecialData() {
      this.loadingSpecial = true;
      this.$http
        .post("/Attendance/PlanBC/GetSpecialPlanBc.ashx", {
          UserId: this.generaId,
          teamId: this.teamValue,
          date: this.screenMonth.timeFormat("yyyy-MM-dd"),
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.specialData = resp.data.Data;
          }
        })
        .finally(() => (this.loadingSpecial = false));
    },

    /**
     * 全选
     */
    handleSelAllWeek() {
      this.$D.LIST("week").forEach((e) => {
        this.currencyForm.weekDay.push(e.value);
      });
    },
    /**
     * 通用排班保存
     */
    handleSave() {
      this.saveBtnLoading = true;
      const data = {
        PlanType: this.generaId || this.selMem.length ? 2 : 1,
        UserId:
          this.selMem && this.selMem.length
            ? this.selMem.map((m) => m.UsId)
            : this.generaId
            ? this.generaId
            : null,
        TimeZone: this.currencyForm.timeZone,
        PlanWeekWorkDay: this.currencyForm.weekDay,
        CheckInTime: this.currencyForm.startWork
          ? this.currencyForm.startWork.timeFormat("yyyy-MM-dd HH:mm:ss")
          : null,
        CheckOutTime: this.currencyForm.endWork
          ? this.currencyForm.endWork.timeFormat("yyyy-MM-dd HH:mm:ss")
          : null,
        CheckInDuration: this.currencyForm.lateWork,
        CheckOutDuration: this.currencyForm.leaveEarly,
        IsSetCheckInElasticity: !this.currencyForm.lateWorkRadio
          ? null
          : this.currencyForm.lateWorkRadio == 1
          ? true
          : false,
        IsSetCheckInHumanization: !this.currencyForm.lateWorkRadio
          ? null
          : this.currencyForm.lateWorkRadio == 2
          ? true
          : false,
        IsSetCheckOutElasticity: !this.currencyForm.leaveEarlyRadio
          ? null
          : this.currencyForm.leaveEarlyRadio == 1
          ? true
          : false,
        IsSetCheckOutHumanization: !this.currencyForm.leaveEarlyRadio
          ? null
          : this.currencyForm.leaveEarlyRadio == 2
          ? true
          : false,
        FreeTime: this.currencyForm.timeInterval.map((m) => {
          return {
            StartTime: m.start
              ? m.start.timeFormat("yyyy-MM-dd HH:mm:ss")
              : null,
            EndTime: m.end ? m.end.timeFormat("yyyy-MM-dd HH:mm:ss") : null,
          };
        }),
        teamId: this.teamValue,
        WageTypeId: this.currencyForm.hourlyWage,
        WageTypeOverId: this.currencyForm.hourlyWageOver,
      };
      this.$http
        .post("/Attendance/PlanBC/SavePlanBC.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              showClose: true,
              message: "设置成功",
              type: "success",
            });
          }
        })
        .finally(() => (this.saveBtnLoading = false));
    },
    /**
     * 设置某一天特殊的排班
     */
    setSpecial(day, obj) {
      this.selSpecialDay = day;
      this.selSpecialDayData = obj;
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
      .s_item {
        margin-right: 6px;
        position: absolute;
        right: 0;
        top: -5px;
        .title {
          font-size: 13px;
          font-weight: bold;
          color: #606266;
        }
        .el-date-editor {
          border: 1px solid #ebeef5;
          border-radius: 4px;
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
      .row_form_item {
        display: flex;
        flex-direction: row;
      }
      .form_item_group {
        margin-top: -10px;
        width: 80%;
        h3 {
          width: 200px;
          text-align: right;
          padding-right: 18px;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 14px;
        }
      }
      .el-form-item {
        ul {
          li {
            margin-bottom: 10px;
            display: flex;
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
        // margin-bottom: 10px;
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
