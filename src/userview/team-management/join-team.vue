<template>
  <div class="join-team">
    <XModal
      name="joinTeam"
      ref="modal"
      title="通过团队号加入"
      confirmBtnText="加入团队"
      height="40%"
      width="420px"
      showCrossBtn
      @closed="closed"
      @onConfirm="onConfirm"
    >
      <div class="content">
        <p>
          团队号是团队的唯一标识，请向管理员或者已经在团队中的成员索要团队号
        </p>
        <el-input v-model="teamNum" placeholder="请输入团队号"></el-input>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  data() {
    return {
      teamNum: null,
    };
  },
  methods: {
    /**
     * 确认
     */
    onConfirm() {
      if (!this.teamNum) {
        this.$message({
          showClose: true,
          message: "请输入团队号",
          type: "warning",
        });
        return;
      }
      this.$refs.modal.loadBtn(true);
      const data = {
        teamCode: this.teamNum,
      };
      this.$http
        .post("/Teams/InvitedOrApply/ApplyTeam.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              showClose: true,
              message: "申请发送成功！",
              type: "success",
            });
            this.$modal.hide("joinTeam");
            this.$emit("success", resp.data.teamId);
          }
        })
        .finally(() => this.$refs.modal.loadBtn(false));
    },
    /**
     * 初始化数据
     */
    closed() {
      Object.assign(this.$data, this.$options.data());
    },
  },
};
</script>
<style lang="less" scoped>
.join-team {
  .content {
    p {
      font-size: 14px;
      color: #409eff;
      margin-bottom: 12px;
      margin-bottom: 16px;
    }
  }
}
</style>
