<template>
  <div class="apply">
    <el-row :gutter="10">
      <el-col :span="24" :md="9">
        <el-card class="custom-card audit-form" shadow="never">
          <el-row class="audit-form-body" v-loading="loadingForm">
            <!--  考勤申诉-->
            <el-form
              label-width="auto"
              class="custom-form"
              :model="customForm"
              ref="customForm"
              :rules="customRules"
            >
              <el-form-item label="申诉日期：">
                <el-date-picker
                  style="width: 70%"
                  v-model="customForm.AnomalyTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                ></el-date-picker>
                <div class="el-form-item__error" v-show="showError">
                  当天暂无考勤记录
                </div>
              </el-form-item>
              <el-form-item label="申述类型：">
                <el-checkbox-group v-model="customForm.AnomalyType">
                  <el-checkbox :label="1">上班</el-checkbox>
                  <el-checkbox :label="2">下班</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                label="上班时间："
                v-if="customForm.AnomalyType.includes(1)"
              >
                <el-date-picker
                  v-model="customForm.ClockInTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width: 70%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="上班状态："
                v-if="customForm.AnomalyType.includes(1)"
              >
                <el-select
                  v-model="customForm.ClockInStatus"
                  style="width: 70%"
                >
                  <el-option
                    v-for="item in $D.LIST('at_state')"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                    :disabled="filterOption(item)"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="下班时间："
                v-if="customForm.AnomalyType.includes(2)"
              >
                <el-date-picker
                  v-model="customForm.ClockOutTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width: 70%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="下班状态："
                v-if="customForm.AnomalyType.includes(2)"
              >
                <el-select
                  v-model="customForm.ClockOutStatus"
                  style="width: 70%"
                >
                  <el-option
                    v-for="item in $D.LIST('at_state')"
                    :key="item.value"
                    :label="item.custom"
                    :value="item.value"
                    :disabled="filterOption(item)"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="申诉原因：" prop="Reason">
                <el-input
                  type="textarea"
                  style="width: 70%"
                  v-model="customForm.Reason"
                ></el-input>
              </el-form-item>
              <el-form-item style="margin-top: 3rem">
                <el-button @click="resetForm('customForm')">重置</el-button>
                <el-button
                  type="primary"
                  @click="submitForm('customForm')"
                  :loading="subLoading"
                  :disabled="showError"
                  >提交</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="24" :md="15"
        ><audit-table
          title="我的申请记录"
          tableType="apply"
          ref="table"
          :isApply="true"
          :teamId="selRow.Id"
        ></audit-table
      ></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {
    AuditTable: () => import("@/userview/apply-audit"),
  },
  props: {
    //团队
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      subLoading: false,
      showError: false,
      // 考勤
      customForm: {
        AnomalyTime: new Date().timeFormat("yyyy-MM-dd"), //异常日期
        AnomalyType: [], //1上班/2下班
        ClockInTime: null, //上班时间
        ClockInStatus: null, //上班状态
        ClockOutTime: null, //下班时间
        ClockOutStatus: null, //下班状态
        Reason: null, //原因
      },
      customRules: {
        Reason: [{ required: true, message: "请输入申诉理由" }],
      },
      type: 1,
      loadingForm: false,
    };
  },
  watch: {
    // "customForm.AnomalyTime": {
    //   handler(newval) {
    //     this.$http
    //       .get("/Work/Attendance/GetAttendanceByDate.ashx", {
    //         params: { date: newval },
    //       })
    //       .then((resp) => {
    //         if (resp.data && resp.data.ArId) {
    //           this.showError = false;
    //           this.customForm.fromRecordID = resp.data.ArId;
    //         } else {
    //           this.showError = true;
    //         }
    //       });
    //   },
    //   immediate: true,
    // },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.subLoading = true;
          this.customForm.teamId = this.selRow.Id;
          this.$http
            .post(
              "/Attendance/AnomalyAppeals/SaveAnomalyAppeal.ashx",
              this.customForm
            )
            .then((resp) => {
              if (resp.res == 0) {
                this.$notify({
                  message: resp.msg,
                  type: "success",
                });
                Object.keys(this.customForm).forEach((m) => {
                  if (m == "AnomalyTime") {
                    this.customForm[m] = new Date().timeFormat("yyyy-MM-dd");
                  } else if (m == "AnomalyType") {
                    this.customForm[m] = [];
                  } else {
                    this.customForm[m] = null;
                  }
                });
                this.$refs.table.initData();
              }
            })
            .finally(() => (this.subLoading = false));
        } else {
          return false;
        }
      });
    },
    filterOption(item) {
      return item.value == -1 || item.value == 3;
    },
    upTable() {
      this.$refs.table.loadData();
    },
  },
};
</script>

<style lang="less" scoped>
.apply {
  width: 100%;
  box-sizing: border-box;
  height: calc(100% - 46px);
  /deep/.el-row {
    .el-col:first-child {
      padding-left: 0 !important;
    }
    .el-col:last-child {
      padding-right: 0 !important;
    }
  }
  .audit-form {
    width: 100%;
    height: 100%;
    .el-card__body {
      height: calc(100% - 106px);
      overflow-y: auto;
    }
    &-body {
      header {
        padding: 0 0 1rem 0;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: rgba(68, 142, 245, 1);
        border-bottom: 1px solid rgba(221, 221, 221, 1);
      }
      .custom-form {
        padding: 20px 0 0 20px;
        width: 100%;
      }
      .fieds-form {
        padding: 20px;
        text-align: left;
      }
    }
  }
  /deep/.el-row {
    margin: 0 !important;
    height: 100%;
    @media all and (max-width: 1024px) {
      height: auto;
    }
    .el-col {
      height: 100%;
    }
  }

  /deep/.audit-table .el-card__body {
    @media all and (max-width: 1024px) {
      height: 400px;
      padding-bottom: 30px;
    }
  }
}
</style>
