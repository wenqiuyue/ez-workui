<template>
  <div class="join-team">
    <XModal
      name="joinTeam"
      title="通过团队号加入"
      confirmBtnText="加入团队"
      height="40%"
      width="420px"
      showCrossBtn
    >
      <div class="content">
        <p>
          团队号是团队的唯一标识，请向管理员或者已经在团队中的成员索要团队号
        </p>
        <el-input v-model="input" placeholder="请输入团队号"></el-input>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
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
