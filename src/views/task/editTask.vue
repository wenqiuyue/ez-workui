<template>
  <XModal
    ref="edit"
    id="edit-task"
    name="editTask"
    title="编辑任务"
    cancelBtnText="取消"
    confirmBtnText="确认"
    @onConfirm="confirm"
    @beforeOpen="init"
  >
    <el-form v-if="editData">
      <el-form-item class="form_item" label="任务名称：">
        <el-input placeholder="输入新的任务名称（必填）" v-model="editData.jobName"></el-input>
      </el-form-item>
      <el-form-item class="form-line-item" label="任务状态：">
        <el-select v-model="editData.jobSchedules" placeholder="选择任务任务状态">
          <el-option
            v-for="sta in $D.LIST('task_status')"
            :key="sta.key"
            :value="sta.value"
            :label="sta.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-line-item" label="开始时间：">
        <el-date-picker
          :disabled="form.jobStartTime?true:false"
          v-model="editData.jobStartTime"
          value-format="yyyy-MM-dd"
          placeholder="开始时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="form-line-item" label="结束时间：">
        <el-date-picker
          :disabled="form.jobPridictionTime?true:false"
          v-model="editData.jobPridictionTime"
          value-format="yyyy-MM-dd"
          placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预估耗时：" class="form-line-item" v-if="!form.jobChild.length">
        <el-input
          type="number"
          placeholder="请设置预估时间"
          v-model="editData.jobEstimatedTime"
          :disabled="form.jobEstimatedTime?true:false"
        >
          <p slot="suffix" style="color: #575757;">小时</p>
        </el-input>
      </el-form-item>
    </el-form>
  </XModal>
</template>

<script>
export default {
  props: {
    editForm: {
      type: Object,
      default: null,
    },
    editId: {
      type: Number,
      default: null,
    },
  },
  components: {
    XModal: () => import("@/components/XModal"),
  },
  data() {
    return {
      editData: null, //编辑的数据
      form: null,
    };
  },
  watch: {
    // editId() {
    //   if (this.editId) {
    //     this.init();
    //   }
    // },
  },
  methods: {
    //数据初始化
    init() {
      this.$nextTick(() => {
        this.$http
          .post("/Project/taskDetailsInquire.ashx", {
            id: this.editId,
            type: 1,
          })
          .then((res) => {
            if (res.res == 0) {
              this.editData = res.data;
              this.form = JSON.parse(JSON.stringify(this.editData));
            }
          });
      });
    },
    //提交编辑
    confirm() {
      this.$http
        .post("/Project/Job/EditJob.ashx", {
          Id: this.editId,
          Name: this.editData.jobName,
          StartTime: this.editData.jobStartTime,
          PridictionTime: this.editData.jobPridictionTime,
          EstimatedTime:
            this.form.jobChild.length > 0
              ? null
              : this.editData.jobEstimatedTime,
          Schedule: this.editData.jobSchedules,
        })
        .then((res) => {
          if (res.res == 0) {
            this.$emit("updated");
            this.$notify({
              type: "success",
              message: "编辑成功!",
            });
            this.$modal.hide("editTask");
          } else {
            this.init();
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
#edit-task {
  /deep/.ctn {
    .el-form {
      padding: 0 1.6rem;
      .el-form-item {
        display: flex;
        align-items: center;
        .el-form-item__content {
          flex: 1;
          .el-select {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
