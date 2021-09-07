<template>
  <div class="makeup-card">
    <XModal
      id="makeup_modal"
      isFixed
      ref="xmodal"
      name="makeup"
      title="补交任务"
      cancelBtnText="取消"
      confirmBtnText="确定"
      @onConfirm="handleConfirm"
      :showCrossBtn="true"
      @opened="opened"
      @closed="closed"
      width="660"
      ><el-form
        class="form"
        :model="formData"
        :rules="rules"
        ref="formData"
        v-if="selTask"
      >
        <el-form-item class="form_item" label="任 务：" prop="task">
          <el-input placeholder="任务名" v-model="formData.taskName">
            <template slot="append"
              ><span @click="handleSelTask">选择任务</span></template
            >
          </el-input>
        </el-form-item>
        <el-form-item class="form_item" label="时间段：" prop="date">
          <el-time-picker
            placeholder="起始时间"
            v-model="formData.sdate"
            :picker-options="{
              selectableRange: `${selTask.CreateTime.timeFormat(
                'HH:mm:ss'
              )} - ${
                selTask.UpdateTime
                  ? selTask.UpdateTime.timeFormat('HH:mm:ss')
                  : new Date().timeFormat('HH:mm:ss')
              }`,
            }"
          >
          </el-time-picker>
          <span style="margin: 0 20px">至</span>
          <el-time-picker
            placeholder="结束时间"
            v-model="formData.edate"
            :picker-options="{
              selectableRange: `${selTask.CreateTime.timeFormat(
                'HH:mm:ss'
              )} - ${
                selTask.UpdateTime
                  ? selTask.UpdateTime.timeFormat('HH:mm:ss')
                  : new Date().timeFormat('HH:mm:ss')
              }`,
            }"
          >
          </el-time-picker>
        </el-form-item>

        <el-form-item class="form_item" label="任务描述：" prop="Describe">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 7 }"
            placeholder="请输入任务描述"
            v-model="formData.Describe"
          ></el-input>
        </el-form-item> </el-form
    ></XModal>
    <TaskList
      :teamValue="teamValue"
      @getTask="getTask"
      :selMem="selMem"
    ></TaskList>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    TaskList: () => import("./task-list"),
  },
  props: {
    selTask: {
      type: Object,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
    teamValue: {
      type: Number,
      default: null,
    },
    selMem: {
      type: Array,
      default: null,
    },
  },
  data() {
    var checkDate = (rule, value, callback) => {
      if (!this.formData.sdate) {
        return callback(new Error("请选择开始时间"));
      } else if (!this.formData.edate) {
        return callback(new Error("请选择结束时间"));
      } else {
        callback();
      }
    };
    var checkTask = (rule, value, callback) => {
      if (!this.formData.taskId || !this.formData.taskName) {
        return callback(new Error("请选择任务"));
      } else {
        callback();
      }
    };
    return {
      teamOptions: [],
      formData: {
        Describe: "", //消息内容
        sdate: null,
        edate: null,
        taskName: null,
        taskId: null,
      },

      users: [],
      rules: {
        date: [{ validator: checkDate, trigger: "blur", required: true }],
        Describe: [
          { required: true, message: "请输入任务描述", trigger: "blur" },
        ],
        task: [{ validator: checkTask, trigger: "blur", required: true }],
      },
    };
  },
  methods: {
    closed() {
      this.formData.Describe = ""; //消息内容
      this.formData.sdate = null;
      this.formData.edate = null;
      this.formData.taskName = null;
      this.formData.taskId = null;
    },
    /**
     * 获取任务
     */
    getTask(val) {
      this.formData.taskName = val.Title;
      this.formData.taskId = val.Id;
    },
    opened() {
      this.$nextTick(() => {
        this.formData.sdate = this.selTask.CreateTime.timeFormat(
          "yyyy-MM-dd HH:mm:ss"
        );
        if (this.selTask.UpdateTime) {
          this.formData.edate = this.selTask.UpdateTime.timeFormat(
            "yyyy-MM-dd HH:mm:ss"
          );
        } else {
          this.formData.edate = new Date().timeFormat("yyyy-MM-dd HH:mm:ss");
        }
      });
    },
    /**
     * 选择任务列表
     */
    handleSelTask() {
      this.$modal.show("tasklist");
    },
    handleConfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.$refs.xmodal.loadBtn(true);
          const data = {
            teamId: this.teamValue,
            taskId: this.formData.taskId,
            Describe: this.formData.Describe,
            sdate: this.formData.sdate,
            edate: this.formData.edate,
          };
          this.$http.post("/Task/RepairTaskHistory.ashx", data).then((resp) => {
            if (resp.res == 0) {
              this.$refs.xmodal.loadBtn(false);
              this.$message({
                showClose: true,
                message: "任务补交成功！",
                type: "success",
              });
              this.$modal.hide("makeup");
              //刷新任务卡片
              this.$emit("loadData");
            } else {
              this.$refs.xmodal.loadBtn(false);
            }
          });
        } else {
          return;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.makeup-card {
  .form {
    padding: 0 2rem 0 2rem;
    .form_item {
      display: flex;

      /deep/.el-form-item__label {
        padding-right: 10px;
        width: 95px;
      }

      /deep/.el-form-item__content {
        flex: auto;
        display: flex;
        align-items: center;

        .el-select {
          width: 100%;
        }
      }
      /deep/.el-input-group__append {
        background-color: #409eff;
        color: #ffffff;
        cursor: pointer;
        padding: 0;
        span {
          padding: 0 20px;
        }
      }
    }
  }
}
</style>
