<template>
  <XModal
    class="special_modal"
    ref="modal"
    name="special"
    :title="`${selSpecialDay}的排班`"
    width="70%"
    height="95%"
    showCrossBtn
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
            <el-button type="success" size="small">保 存</el-button>
            <el-button type="warning" size="small">清 除</el-button>
          </div>
        </div>
        <div class="set_form">
          <el-form ref="form" :model="specialForm" label-width="140px">
            <el-divider content-position="left">上班</el-divider>
            <el-form-item label="时区：">
              <el-select
                v-model="specialForm.work.timeZone"
                placeholder="请选择时区"
              >
                <el-option
                  v-for="item in timeZoneOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="row_form_item">
              <el-form-item label="上班：">
                <el-time-picker
                  v-model="specialForm.work.startWork"
                  placeholder="选择上班时间"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item label="下班：">
                <el-time-picker
                  v-model="specialForm.work.endWork"
                  placeholder="选择下班时间"
                >
                </el-time-picker>
              </el-form-item>
            </div>
            <el-form-item label="休息时间：">
              <ul>
                <li
                  v-for="(interval, intervalInd) in specialForm.work
                    .timeInterval"
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
                  <el-button type="text" @click="cancleInterval(1, intervalInd)"
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
                  v-model="specialForm.work.lateWork"
                  type="number"
                >
                  <template slot="append">
                    <div>
                      <span style="margin-right: 12px">分钟</span>
                      <el-radio-group v-model="specialForm.work.lateWorkRadio">
                        <el-radio :label="1"
                          >上班晚到几分钟，下班须晚走几分钟</el-radio
                        >
                        <el-radio :label="2"
                          >晚到{{
                            specialForm.work.lateWork
                              ? specialForm.work.lateWork
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
                  v-model="specialForm.work.leaveEarly"
                  type="number"
                >
                  <template slot="append">
                    <div>
                      <span style="margin-right: 12px">分钟</span>
                      <el-radio-group
                        v-model="specialForm.work.leaveEarlyRadio"
                      >
                        <el-radio :label="1"
                          >上班早到几分钟，下班可早走几分钟</el-radio
                        >
                        <el-radio :label="2"
                          >早走{{
                            specialForm.work.leaveEarly
                              ? specialForm.work.leaveEarly
                              : "几"
                          }}分钟内不算早退</el-radio
                        >
                      </el-radio-group>
                    </div>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <el-divider content-position="left">假期</el-divider>
            <el-form-item label="时区：">
              <el-select
                v-model="specialForm.vacation.timeZone"
                placeholder="请选择时区"
              >
                <el-option
                  v-for="item in timeZoneOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="row_form_item">
              <el-form-item label="上班：">
                <el-time-picker
                  v-model="specialForm.vacation.startWork"
                  placeholder="选择上班时间"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item label="下班：">
                <el-time-picker
                  v-model="specialForm.vacation.endWork"
                  placeholder="选择下班时间"
                >
                </el-time-picker>
              </el-form-item>
            </div>
            <el-form-item label="休息时间：">
              <ul>
                <li
                  v-for="(interval, intervalInd) in specialForm.vacation
                    .timeInterval"
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
                  <el-button type="text" @click="cancleInterval(2, intervalInd)"
                    >清除</el-button
                  >
                </li>
              </ul>
              <el-button type="text" @click="addTimeInterval(2)"
                >添加休息时间区间</el-button
              >
            </el-form-item>
            <div class="form_item_group">
              <h3>弹性打卡</h3>
              <el-form-item label="上班最多可晚到：">
                <el-input
                  placeholder="请输入内容"
                  v-model="specialForm.vacation.lateWork"
                  type="number"
                >
                  <template slot="append">
                    <div>
                      <span style="margin-right: 12px">分钟</span>
                      <el-radio-group
                        v-model="specialForm.vacation.lateWorkRadio"
                      >
                        <el-radio :label="1"
                          >上班晚到几分钟，下班须晚走几分钟</el-radio
                        >
                        <el-radio :label="2"
                          >晚到{{
                            specialForm.vacation.lateWork
                              ? specialForm.vacation.lateWork
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
                  v-model="specialForm.vacation.leaveEarly"
                  type="number"
                >
                  <template slot="append">
                    <div>
                      <span style="margin-right: 12px">分钟</span>
                      <el-radio-group
                        v-model="specialForm.vacation.leaveEarlyRadio"
                      >
                        <el-radio :label="1"
                          >上班早到几分钟，下班可早走几分钟</el-radio
                        >
                        <el-radio :label="2"
                          >早走{{
                            specialForm.vacation.leaveEarly
                              ? specialForm.vacation.leaveEarly
                              : "几"
                          }}分钟内不算早退</el-radio
                        >
                      </el-radio-group>
                    </div>
                  </template>
                </el-input>
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
    //要设置的天
    selSpecialDay: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      timeZoneOptions: [
        {
          value: 1,
          name: "GMT+8",
        },
      ], //时区选项
      specialForm: {
        work: {
          timeZone: 1, //时区
          timeInterval: [],
          startWork: null, //上班
          endWork: null, //下班
          lateWork: null, //上班晚到
          lateWorkRadio: null, //上班晚到条件选择
          leaveEarly: null, //下班早走
          leaveEarlyRadio: null, //下班早走条件选择
        },
        vacation: {
          timeZone: 1, //时区
          timeInterval: [],
          startWork: null, //上班
          endWork: null, //下班
          lateWork: null, //上班晚到
          lateWorkRadio: null, //上班晚到条件选择
          leaveEarly: null, //下班早走
          leaveEarlyRadio: null, //下班早走条件选择
        },
      },
    };
  },
  methods: {
    /**
     * 清除时间区间
     */
    cancleInterval(type, ind) {
      if (type == 1) {
        this.specialForm.work.timeInterval =
          this.specialForm.work.timeInterval.filter((m, index) => ind != index);
      } else {
        this.specialForm.vacation.timeInterval =
          this.specialForm.vacation.timeInterval.filter(
            (m, index) => ind != index
          );
      }
    },
    /**
     * 添加时间区间
     */
    addTimeInterval(type) {
      if (type == 1) {
        this.specialForm.work.timeInterval.push({
          start: null,
          end: null,
        });
      } else {
        this.specialForm.vacation.timeInterval.push({
          start: null,
          end: null,
        });
      }
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
