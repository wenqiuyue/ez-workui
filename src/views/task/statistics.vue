<template>
  <div class="statistics">
    <div class="statistics_content">
      <proChart :eid="this.$route.params.eid"></proChart>
    </div>
  </div>
</template>
<script>
export default {
  components:{
    proChart:()=>import("../pro/projectChart")
  },
}
</script>
<style lang="less" scoped>
.statistics{
  padding: 1rem;
  .statistics_content{
    background: #ffffff;
    padding: 1px;
    margin-bottom: 6rem;
  }
}
</style>