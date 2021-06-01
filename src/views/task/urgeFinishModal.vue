<template>
  <div class="urgeFinishModal">
    <XModal
      :name="modalName"
      cancelBtnText="取消"
      confirmBtnText="确认"
      title="催促完成任务提醒"
      @onConfirm="confrim"
      ref="urmodal"
    >
      <div class="content">
        <el-form
          label-position="top"
          label-width="80px"
          :model="form"
          :rules="rules"
        >
          <el-form-item
            :label="
              `提醒消息 ${
                noticeCount > 0 ? '(已提醒' + noticeCount + '次)' : ''
              }`
            "
            prop="message"
          >
            <el-input
              v-model="form.message"
              type="textarea"
              :rows="5"
              placeholder="请输入提醒消息"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  props: {
    jid: {
      type: Number | String,
      default: null,
    },
    modalName: {
      type: String,
      default: null,
    },
    //提醒次数
    noticeCount: {
      type: Number,
      default: null,
    },
  },
  components: {
    XModal: () => import("@/components/XModal"),
  },
  data() {
    return {
      form: {
        message: null,
      },
      rules: {
        message: [
          { required: true, message: "请输入提醒消息", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    confrim() {
      this.$refs.urmodal.loadBtn(true);
      const data = {
        jId: this.jid,
        message: this.form.message,
      };
      this.$http
        .post("/Work/Project/JobNotice.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              showClose: true,
              message: "提醒成功",
              type: "success",
            });
            this.$modal.hide(this.modalName);
          }
        })
        .finally(() => {
          this.$refs.urmodal.loadBtn(false);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.urgeFinishModal {
  .content {
    padding: 0 12px;
    /deep/.el-form {
      .el-form-item__label {
        padding: 0;
        font-weight: bold;
      }
    }
  }
}
</style>
