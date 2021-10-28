<template>
  <div>
    <XModal
      name="appeal"
      title="考勤申诉"
      width="40%"
      cancelBtnText="取消"
      confirmBtnText="确定"
      @onConfirm="onConfirm"
      ref="myXModal"
      :isFixed="true"
      :showCrossBtn="true"
      @opened="opened"
      @closed="closed"
    >
      <div class="appeal">
        <el-form
          label-width="auto"
          class="fieds-form"
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
        >
          <el-form-item label="申诉日期">
            <span>{{
              popData.Date ? popData.Date.timeFormat("yyyy-MM-dd") : "无"
            }}</span>
          </el-form-item>
          <el-form-item label="申述类型">
            <el-checkbox-group v-model="ruleForm.AnomalyType">
              <el-checkbox :label="1">上班</el-checkbox>
              <el-checkbox :label="2">下班</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="上班时间"
            v-if="ruleForm.AnomalyType.includes(1)"
          >
            <el-date-picker
              v-model="ruleForm.ClockInTime"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 70%"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickOption"
            ></el-date-picker>
            <p class="info">请选择要修改后的上班时间</p>
          </el-form-item>
          <el-form-item
            label="上班状态"
            v-if="ruleForm.AnomalyType.includes(1)"
          >
            <el-select v-model="ruleForm.ClockInStatus" style="width: 70%">
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
          <el-form-item
            label="下班时间"
            v-if="ruleForm.AnomalyType.includes(2)"
          >
            <el-date-picker
              v-model="ruleForm.ClockOutTime"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 70%"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickOption"
            ></el-date-picker>
            <p class="info">请选择要修改后的下班时间</p>
          </el-form-item>
          <el-form-item
            label="下班状态"
            v-if="ruleForm.AnomalyType.includes(2)"
          >
            <el-select v-model="ruleForm.ClockOutStatus" style="width: 70%">
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
          <el-form-item label="申诉原因" prop="Reason" :required="true">
            <el-input
              type="textarea"
              style="width: 90%"
              v-model="ruleForm.Reason"
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
    teamValue: {
      type: Number,
      default: null,
    },
  },
  components: {
    XModal: () => import("@/components/XModal"),
    // askLeave: () => import("@/views/leaveApplication/common"),
  },
  data() {
    return {
      ruleForm: {
        AnomalyTime: null,
        AnomalyType: [1, 2],
        ClockInTime: null, //上班时间
        ClockInStatus: null, //上班状态
        ClockOutTime: null, //下班时间
        ClockOutStatus: null, //下班状态
        Reason: null,
      },
      rules: {
        Reason: [
          {
            required: true,
            message: "请输入申诉原因",
            trigger: "blur",
          },
        ],
      },
      pickOption: this.pickTime(),
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
          let nextDay = new Date(_this.popData.Date).setDate(
            new Date(_this.ruleForm.Date).getDate() + 1
          );
          return (
            time.getTime() < new Date(_this.popData.Date).getTime() ||
            time.getTime() > new Date(nextDay).getTime()
          );
        },
      };
    },
    onConfirm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$refs.myXModal.loadBtn(true);
          this.ruleForm.teamId = this.teamValue;
          this.ruleForm.AnomalyTime = this.popData.Date;
          this.$http
            .post(
              "/Attendance/AnomalyAppeals/SaveAnomalyAppeal.ashx",
              this.ruleForm
            )
            .then((resp) => {
              if (resp.res == 0) {
                this.$notify({
                  message: resp.msg,
                  type: "success",
                });
                this.$modal.hide("appeal");
                this.$emit("appealSubmit");
              }
            })
            .finally(() => this.$refs.myXModal.loadBtn(false));
        }
      });
    },
    closed() {
      this.ruleForm = {
        AnomalyTime: null,
        AnomalyType: [1, 2],
        ClockInTime: null, //上班时间
        ClockInStatus: null, //上班状态
        ClockOutTime: null, //下班时间
        ClockOutStatus: null, //下班状态
        Reason: null,
      };
    },
    opened() {},
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
