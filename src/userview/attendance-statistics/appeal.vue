<template>
  <div>
    <XModal
      name="appeal"
      :title="Type == 1 ? '考勤申诉' : Type == 2 ? '考勤修改' : '考勤审批'"
      width="40%"
      cancelBtnText="取消"
      :confirmBtnText="Type == 3 ? '审批' : '确定'"
      @onConfirm="onConfirm"
      ref="myXModal"
      :isFixed="true"
      :showCrossBtn="true"
      @opened="opened"
      @closed="closed"
    >
      <div class="appeal" v-loading="loading">
        <!-- <h3
          @click="
            () => {
              $modal.show('askLeave');
              $modal.hide('appeal');
            }
          "
        >
          去请假
        </h3> -->
        <el-form
          label-width="auto"
          class="fieds-form"
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
        >
          <el-form-item label="成员姓名" v-if="Type == 2 || Type == 3">
            <span>{{ popData.UserName }}</span>
          </el-form-item>
          <el-form-item :label="Type == 2 ? '考勤日期' : '申诉日期'">
            <span>{{
              popData.Date ? popData.Date.timeFormat("yyyy-MM-dd") : "无"
            }}</span>
          </el-form-item>
          <el-form-item :label="Type == 2 ? '考勤类型' : '申述类型'">
            <el-checkbox-group v-model="ruleForm.DateType">
              <el-checkbox label="1">上班</el-checkbox>
              <el-checkbox label="2">下班</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上班时间" v-if="ruleForm.DateType.includes('1')">
            <el-date-picker
              v-model="ruleForm.StartTime"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 70%"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickOption"
            ></el-date-picker>
            <p class="info">请选择要修改后的上班时间</p>
          </el-form-item>
          <el-form-item label="上班状态" v-if="ruleForm.DateType.includes('1')">
            <el-select v-model="ruleForm.StartStatus" style="width: 70%">
              <el-option
                v-for="item in $D.LIST('at_state')"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                :disabled="filterOption(item)"
              ></el-option>
            </el-select>
            <p class="info">请选择要修改后的上班状态</p>
          </el-form-item>
          <el-form-item label="下班时间" v-if="ruleForm.DateType.includes('2')">
            <el-date-picker
              v-model="ruleForm.EndTime"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 70%"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickOption"
            ></el-date-picker>
            <p class="info">请选择要修改后的下班时间</p>
          </el-form-item>
          <el-form-item label="下班状态" v-if="ruleForm.DateType.includes('2')">
            <el-select v-model="ruleForm.EndStatus" style="width: 70%">
              <el-option
                v-for="item in $D.LIST('at_state')"
                :key="item.value"
                :label="item.custom"
                :value="item.value"
                :disabled="filterOption(item)"
              ></el-option>
            </el-select>
            <p class="info">请选择要修改后的下班状态</p>
          </el-form-item>
          <el-form-item
            label="申诉原因"
            prop="Reason"
            :required="Type == 1 ? true : false"
            v-if="Type !== 2"
          >
            <el-input
              type="textarea"
              style="width: 90%"
              v-model="ruleForm.Reason"
              :readOnly="Type == 3 ? true : false"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否通过" v-if="Type == 3">
            <el-radio v-model="isPass" :label="1">是</el-radio>
            <el-radio v-model="isPass" :label="2">否</el-radio>
          </el-form-item>
          <el-form-item
            label="反驳原因"
            v-if="Type == 3 && isPass == 2"
            :required="true"
            prop="ComReason"
          >
            <el-input
              type="textarea"
              v-model="ruleForm.ComReason"
              style="width: 90%"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </XModal>
    <!-- 请假表单	 -->
    <!-- <askLeave></askLeave> -->
    <!-- <XModal name="askLeave" title="请假申请" :showCrossBtn="true">
      <div style="padding: 1.5rem">
        <askLeave @success="success"></askLeave>
      </div>
    </XModal> -->
  </div>
</template>

<script>
export default {
  props: {
    popData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isApply: {
      type: Boolean,
      default: false,
    },
    Type: {
      type: Number,
      default: 1,
    },
  },
  components: {
    XModal: () => import("@/components/XModal"),
    // askLeave: () => import("@/views/leaveApplication/common"),
  },
  data() {
    return {
      ruleForm: {
        DateType: ["1", "2"],
        StartTime: null,
        EndStatus: null,
        Date: null,
        ComReason: null,
        Reason: null,
      },
      formLoad: {},
      loading: false,
      isPass: 1,
      rules: {
        ComReason: [
          {
            required: true,
            message: "请输入反驳原因",
            trigger: "blur",
          },
          {
            required: true,
            message: "请输入反驳原因",
            trigger: "change",
          },
        ],
        Reason: [
          {
            required: true,
            message: "请输入申诉原因",
            trigger: "change",
          },
          {
            required: true,
            message: "请输入申诉原因",
            trigger: "blur",
          },
        ],
      },
      pickOption: this.pickTime(),
      isCalendarModal: 0, //0不是modal 1是modal
    };
  },
  methods: {
    filterOption(item) {
      if (item.value == -1 || item.value == 3 || item.value == 5) {
        return true;
      } else {
        return false;
      }
    },
    pickTime() {
      let _this = this;
      return {
        disabledDate(time) {
          let nextDay = new Date(_this.ruleForm.Date).setDate(
            new Date(_this.ruleForm.Date).getDate() + 1
          );
          return (
            time.getTime() < new Date(_this.ruleForm.Date).getTime() ||
            time.getTime() > new Date(nextDay).getTime()
          );
        },
      };
    },
    onConfirm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$refs.myXModal.loadBtn(true);
          if (this.Type == 3) {
            //提交审核
            let params = {};
            params.DateType = this.ruleForm.DateType;
            params.DateType = params.DateType.map((item) => {
              return Number(item);
            });
            params.Date = this.ruleForm.Date;
            if (this.ruleForm.StartTime) {
              this.ruleForm.StartTime = new Date(this.ruleForm.StartTime)
                .toString()
                .timeFormat("yyyy-MM-dd HH:mm:ss");
            } else {
              this.ruleForm.StartTime = null;
            }
            params.StartTime = this.ruleForm.StartTime;
            if (this.ruleForm.EndTime) {
              this.ruleForm.EndTime = new Date(this.ruleForm.EndTime)
                .toString()
                .timeFormat("yyyy-MM-dd HH:mm:ss");
            } else {
              this.ruleForm.EndTime = null;
            }
            params.EndTime = this.ruleForm.EndTime;
            params.StartStatus = this.ruleForm.StartStatus;
            params.EndStatus = this.ruleForm.EndStatus;
            params.Reason = this.ruleForm.Reason;
            this.$http
              .post("/Work/TransactionAudit/AuditAttendanceComplaint.ashx", {
                auditID: this.ruleForm.AuditId,
                isPass: this.isPass == 1 ? true : false,
                data: params,
                remark: this.ruleForm.ComReason,
              })
              .then((res) => {
                this.$refs.myXModal.loadBtn(false);
                if (res.res == 0) {
                  this.$notify({
                    type: "success",
                    message: "审核完成",
                  });
                  this.$modal.hide("appeal");
                  this.$emit("appealSubmit");
                }
              });
          } else if (this.Type == 1) {
            //提交申述
            let params = {};
            params.DateType = this.ruleForm.DateType;
            params.DateType = params.DateType.map((item) => {
              return Number(item);
            });
            params.Date = this.ruleForm.Date;
            params.Reason = this.ruleForm.Reason;
            if (params.DateType.includes(1)) {
              //勾选了上午的内容
              if (this.ruleForm.StartTime) {
                this.ruleForm.StartTime = new Date(this.ruleForm.StartTime)
                  .toString()
                  .timeFormat("yyyy-MM-dd HH:mm:ss");
              } else {
                this.ruleForm.StartTime = null;
              }
              params.StartTime = this.ruleForm.StartTime;
              params.StartStatus = this.ruleForm.StartStatus;
            }
            if (params.DateType.includes(2)) {
              if (this.ruleForm.EndTime) {
                this.ruleForm.EndTime = new Date(this.ruleForm.EndTime)
                  .toString()
                  .timeFormat("yyyy-MM-dd HH:mm:ss");
              } else {
                this.ruleForm.EndTime = null;
              }
              params.EndTime = this.ruleForm.EndTime;
              params.EndStatus = this.ruleForm.EndStatus;
            } //勾选下午内容
            if (!params.DateType.length) {
              this.$message({
                type: "warning",
                message: "至少申述一种类型",
              });
              return;
            }
            this.$http
              .post("/Work/TransactionAudit/AddAttendanceComplaint.ashx", {
                customFormID: 35,
                fromRecordID: this.popData.ArId,
                data: params,
                fromRecordType: 1,
              })
              .then((res) => {
                this.$refs.myXModal.loadBtn(false);
                if (res.res == 0) {
                  this.$modal.hide("appeal");
                  this.$notify({
                    type: "success",
                    message: "提交成功",
                  });
                  this.$emit("appealSubmit");
                }
              });
          } else {
            //修改考勤
            let params = {};
            params.DateType = this.ruleForm.DateType;
            params.DateType = params.DateType.map((item) => {
              return Number(item);
            });
            params.Date = this.ruleForm.Date;
            params.Reason = this.ruleForm.Reason;
            if (params.DateType.includes(1)) {
              //勾选了上午的内容
              if (this.ruleForm.StartTime) {
                this.ruleForm.StartTime = new Date(this.ruleForm.StartTime)
                  .toString()
                  .timeFormat("yyyy-MM-dd HH:mm:ss");
              } else {
                this.ruleForm.StartTime = null;
              }
              params.StartTime = this.ruleForm.StartTime;
              params.StartStatus = this.ruleForm.StartStatus;
            }
            if (params.DateType.includes(2)) {
              if (this.ruleForm.EndTime) {
                this.ruleForm.EndTime = new Date(this.ruleForm.EndTime)
                  .toString()
                  .timeFormat("yyyy-MM-dd HH:mm:ss");
              } else {
                this.ruleForm.EndTime = null;
              }
              params.EndTime = this.ruleForm.EndTime;
              params.EndStatus = this.ruleForm.EndStatus;
            }
            this.$http
              .post("/MGT/Personnel/Work/ManagerEditAttendanceComplaint.ashx", {
                data: params,
                RecoreId: this.popData.ArId,
              })
              .then((res) => {
                this.$refs.myXModal.loadBtn(false);
                if (res.res == 0) {
                  this.$notify({
                    type: "success",
                    message: "修改成功",
                  });
                  this.$modal.hide("appeal");
                  this.$emit("appealChange");
                }
              });
          }
        }
      });
    },
    closed() {
      this.ruleForm = {
        DateType: ["1", "2"],
        StartTime: null,
        EndStatus: null,
        Date: null,
        ComReason: null,
        Reason: null,
      };
      this.isPass = 1;
    },
    opened() {
      // console.log(this.Type);
      if (this.Type == 1) {
        //申述
        let form = {};
        form = JSON.stringify(this.ruleForm);
        form = JSON.parse(form);
        Object.assign(form, this.popData);
        this.ruleForm = form;
        this.ruleForm.DateType = [];
        this.ruleForm.StartTime = this.ruleForm.StartTime
          ? new Date(this.ruleForm.StartTime)
          : "";
        this.ruleForm.EndTime = this.ruleForm.EndTime
          ? new Date(this.ruleForm.EndTime)
          : "";
      } else if (this.Type == 3) {
        //审批
        let form = {};
        this.ruleForm = {};
        form = JSON.stringify(this.ruleForm);
        form = JSON.parse(form);
        this.popData.DateType = this.popData.DateType.map((item) => {
          return item.toString();
        });
        Object.assign(form, this.popData);
        if (form.AuditResult == 3) {
          //驳回
          this.isPass = 2;
        } else if (form.AuditResult == 4) {
          //通过
          this.isPass = 1;
        } else {
          this.isPass = 1; //默认通过
        }
        this.ruleForm = form;
        this.ruleForm.StartTime = this.ruleForm.StartTime
          ? new Date(this.ruleForm.StartTime)
          : "";
        this.ruleForm.EndTime = this.ruleForm.EndTime
          ? new Date(this.ruleForm.EndTime)
          : "";
        // console.log(this.ruleForm)
      } else {
        //修改
        let form = {};
        form = JSON.stringify(this.ruleForm);
        form = JSON.parse(form);
        Object.assign(form, this.popData);
        this.ruleForm = form;
        this.ruleForm.DateType = ["1", "2"];
        this.ruleForm.StartTime = this.ruleForm.StartTime
          ? new Date(this.ruleForm.StartTime)
          : "";
        this.ruleForm.EndTime = this.ruleForm.EndTime
          ? new Date(this.ruleForm.EndTime)
          : "";
      }
    },
    success() {
      this.$modal.hide("askLeave");
    },
  },
};
</script>
<style lang="less" scoped>
.appeal {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  padding: 1rem 0;
  padding-bottom: 2rem;
  box-sizing: border-box;

  /deep/.el-textarea {
    /deep/.el-textarea__inner {
      min-height: 100px !important;
    }
  }
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  h3 {
    text-align: right;
    font-size: 1.6rem;
    color: #409eff;
    cursor: pointer;
  }
}
.info {
  font-size: 1.2rem;
  color: #6d6d6d;
}

.fieds-form {
  height: 100%;
}

/deep/.el-checkbox__input {
  position: relative;
  top: -1px;
}

.appeal span {
  margin: 0 1rem;
  line-height: 3rem;
  color: gray;
  white-space: nowrap;
}

#modifyTime {
  display: none;
}

#modifyTime /deep/ .el-input--suffix .el-input__inner {
  padding-left: 3rem !important;
}
</style>
