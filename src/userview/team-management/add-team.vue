<template>
  <div class="add-team">
    <XModal
      name="addTeam"
      title="开始创建团队"
      confirmBtnText="立即创建团队"
      width="420px"
      showCrossBtn
    >
      <div class="content">
        <p>创建团队，开启高效工作方式</p>
        <el-input v-model="input" placeholder="请输入团队名称"></el-input>
        <p>提交即视为同意</p>
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
.add-team {
  .content {
    p:first-child {
      font-size: 14px;
      color: #409eff;
      margin-bottom: 12px;
    }
    p:last-child {
      font-size: 14px;
      color: #606266;
      margin-top: 46px;
    }
  }
}
</style>
