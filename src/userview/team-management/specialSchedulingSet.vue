<template>
  <XModal
    class="special_modal"
    ref="modal"
    name="special"
    :title="`${selSpecialDay}的排班`"
    width="70%"
    height="95%"
    showCrossBtn
    @opened="opened"
    @closed="closed"
  >
    <div class="specialSchedulingSet">
      <div class="set_card">
        <div class="tag_item_list">
          <div class="tag_item t_i_bg1" style="width: 18rem"></div>
          <div class="tag_item t_i_bg2" style="width: 17rem"></div>
          <div class="tag_item t_i_bg3" style="width: 16rem">
            <div>特殊排班设置</div>
          </div>
          <div class="save_btn">
            <el-button
              type="success"
              size="small"
              @click="handleSave"
              :loading="saveBtnLoading"
              >保 存</el-button
            >
            <el-button
              type="warning"
              size="small"
              @click="handleCancle"
              :loading="cancleLoading"
              >清 除</el-button
            >
          </div>
        </div>
        <div class="set_form">
          <el-form ref="form" :model="specialForm" label-width="140px">
            <el-form-item label="排班类型：">
              <el-radio-group v-model="specialForm.specialType">
                <el-radio :label="true">上班</el-radio>
                <el-radio :label="false">假期</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="specialForm.specialType == 1">
              <el-form-item label="时区：">
                <el-select
                  v-model="specialForm.timeZone"
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
              <div class="row_form_item">
                <el-form-item label="上班：">
                  <el-time-picker
                    v-model="specialForm.startWork"
                    placeholder="选择上班时间"
                  >
                  </el-time-picker>
                </el-form-item>
                <el-form-item label="下班：">
                  <el-time-picker
                    v-model="specialForm.endWork"
                    placeholder="选择下班时间"
                  >
                  </el-time-picker>
                </el-form-item>
              </div>
              <div class="row_form_item">
                <el-form-item label="时薪：">
                  <el-select
                    v-model="specialForm.hourlyWage"
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
                    v-model="specialForm.hourlyWageOver"
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
                    v-for="(interval, intervalInd) in specialForm.timeInterval"
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
                    <el-button
                      type="text"
                      @click="cancleInterval(1, intervalInd)"
                      >清除</el-button
                    >
                  </li>
                </ul>
                <el-button type="text" @click="addTimeInterval(1)"
                  >添加休息时间区间</el-button
                >
              </el-form-item>
              <div class="form_item_group">
                <h3>弹性打卡</h3>
                <el-form-item label="上班最多可晚到：">
                  <el-input
                    placeholder="请输入内容"
                    v-model="specialForm.lateWork"
                    type="number"
                  >
                    <template slot="append">
                      <div>
                        <span style="margin-right: 12px">分钟</span>
                        <el-radio-group v-model="specialForm.lateWorkRadio">
                          <el-radio :label="1"
                            >上班晚到几分钟，下班须晚走几分钟</el-radio
                          >
                          <el-radio :label="2"
                            >晚到{{
                              specialForm.lateWork
                                ? specialForm.lateWork
                                : "几"
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
                    v-model="specialForm.leaveEarly"
                    type="number"
                  >
                    <template slot="append">
                      <div>
                        <span style="margin-right: 12px">分钟</span>
                        <el-radio-group v-model="specialForm.leaveEarlyRadio">
                          <el-radio :label="1"
                            >上班早到几分钟，下班可早走几分钟</el-radio
                          >
                          <el-radio :label="2"
                            >早走{{
                              specialForm.leaveEarly
                                ? specialForm.leaveEarly
                                : "几"
                            }}分钟内不算早退</el-radio
                          >
                        </el-radio-group>
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div v-else>
              <el-form-item label="时薪：">
                <el-select
                  v-model="specialForm.hourlyWage"
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
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </XModal>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  props: {
    //团队
    teamValue: {
      type: Number,
      default: null,
    },
    selMem: {
      type: Array,
      default: null,
    },
    generaId: {
      type: Number,
      default: null,
    },
    //特殊的日期数据
    selSpecialDayData: {
      type: Object,
      default: null,
    },
    //时薪选项
    wageOptions: {
      type: Array,
      default: null,
    },
    //要设置的天
    selSpecialDay: {
      type: String,
      default: null,
    },
    timeZonesOptions: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      saveBtnLoading: false,
      cancleLoading: false,
      specialForm: {
        specialType: true, //假期、上班选项
        timeZone: "China Standard Time", //时区
        timeInterval: [{}],
        startWork: null, //上班
        endWork: null, //下班
        lateWork: null, //上班晚到
        lateWorkRadio: null, //上班晚到条件选择
        leaveEarly: null, //下班早走
        leaveEarlyRadio: null, //下班早走条件选择
        hourlyWage: null,
        hourlyWageOver: null,
      },
    };
  },
  methods: {
    /**
     * 清除设置
     */
    handleCancle() {
      this.$confirm("此操作将清除该设置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.cancleLoading = true;
          this.$http
            .post("/Attendance/PlanBC/DelSpecialPlanBC.ashx", {
              teamId: this.teamValue,
              UserId:
                this.selMem && this.selMem.length
                  ? this.selMem.map((m) => m.UsId)
                  : this.generaId
                  ? this.generaId
                  : null,
              date: this.selSpecialDay,
            })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  showClose: true,
                  message: "清除成功",
                  type: "success",
                });
                this.$emit("success");
                this.$modal.hide("special");
              }
            })
            .finally(() => (this.cancleLoading = false));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 排班保存
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
        TimeZone: this.specialForm.timeZone,
        PlanDay: this.selSpecialDay,
        CheckInTime: this.specialForm.startWork
          ? this.specialForm.startWork.timeFormat("yyyy-MM-dd HH:mm:ss")
          : null,
        CheckOutTime: this.specialForm.endWork
          ? this.specialForm.endWork.timeFormat("yyyy-MM-dd HH:mm:ss")
          : null,
        CheckInDuration: this.specialForm.lateWork,
        CheckOutDuration: this.specialForm.leaveEarly,
        IsSetCheckInElasticity: !this.specialForm.lateWorkRadio
          ? null
          : this.specialForm.lateWorkRadio == 1
          ? true
          : false,
        IsSetCheckInHumanization: !this.specialForm.lateWorkRadio
          ? null
          : this.specialForm.lateWorkRadio == 2
          ? true
          : false,
        IsSetCheckOutElasticity: !this.specialForm.leaveEarlyRadio
          ? null
          : this.specialForm.leaveEarlyRadio == 1
          ? true
          : false,
        IsSetCheckOutHumanization: !this.specialForm.leaveEarlyRadio
          ? null
          : this.specialForm.leaveEarlyRadio == 2
          ? true
          : false,
        FreeTime: this.specialForm.timeInterval.map((m) => {
          return {
            StartTime: m.start
              ? m.start.timeFormat("yyyy-MM-dd HH:mm:ss")
              : null,
            EndTime: m.end ? m.end.timeFormat("yyyy-MM-dd HH:mm:ss") : null,
          };
        }),
        teamId: this.teamValue,
        WageTypeId: this.specialForm.hourlyWage,
        WageTypeOverId: this.specialForm.hourlyWageOver,
        IsWork: this.specialForm.specialType,
      };
      this.$http
        .post("/Attendance/PlanBC/SaveSpecialPlanBC.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              showClose: true,
              message: "设置成功",
              type: "success",
            });
            this.$emit("success");
            this.$modal.hide("special");
          }
        })
        .finally(() => (this.saveBtnLoading = false));
    },
    /**
     * 关闭弹窗
     */
    closed() {
      Object.keys(this.specialForm).forEach((m) => {
        if (m == "timeZone") {
          this.specialForm[m] = "China Standard Time";
        } else if (m == "specialType") {
          this.specialForm[m] = true;
        } else {
          this.specialForm[m] = null;
        }
      });
    },
    /**
     * 打开弹窗回调
     */
    opened() {
      this.$nextTick(() => {
        if (!this.selSpecialDayData.Id) {
          return;
        }
        this.specialForm.hourlyWage = this.selSpecialDayData.WageTypeId;
        this.specialForm.hourlyWageOver = this.selSpecialDayData.WageTypeOverId;
        this.specialForm.specialType = this.selSpecialDayData.IsWork;
        this.specialForm.timeZone = this.selSpecialDayData.TimeZone;
        this.specialForm.startWork = this.selSpecialDayData.CheckInTime;
        this.specialForm.endWork = this.selSpecialDayData.CheckOutTime;
        this.specialForm.timeInterval =
          this.selSpecialDayData.FreeTimes &&
          this.selSpecialDayData.FreeTimes.length
            ? this.selSpecialDayData.FreeTimes.map((m) => {
                return {
                  start: m.StartTime,
                  end: m.EndTime,
                };
              })
            : [];
        this.specialForm.lateWork = this.selSpecialDayData.CheckInDuration;
        this.specialForm.leaveEarly = this.selSpecialDayData.CheckOutDuration;
        if (this.selSpecialDayData.IsSetCheckInElasticity) {
          this.specialForm.lateWorkRadio = 1;
        } else if (this.selSpecialDayData.IsSetCheckInHumanization) {
          this.specialForm.lateWorkRadio = 2;
        }
        if (this.selSpecialDayData.IsSetCheckOutElasticity) {
          this.specialForm.leaveEarlyRadio = 1;
        } else if (this.selSpecialDayData.IsSetCheckOutHumanization) {
          this.specialForm.leaveEarlyRadio = 2;
        }
      });
    },
    /**
     * 清除时间区间
     */
    cancleInterval(ind) {
      this.specialForm.timeInterval = this.specialForm.timeInterval.filter(
        (m, index) => ind != index
      );
    },
    /**
     * 添加时间区间
     */
    addTimeInterval() {
      this.specialForm.timeInterval.push({
        start: null,
        end: null,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.special_modal {
  /deep/.modal {
    .ctn {
      height: calc(100% - 60px);
    }
  }
}
.specialSchedulingSet {
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
      .row_form_item {
        display: flex;
        flex-direction: row;
      }
      .form_item_group {
        margin-top: -10px;
        width: 80%;
        h3 {
          width: 140px;
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
    }
  }
}
</style>
