<template>
  <div id="teaminfo-user">
    <!-- 列表页 -->
    <div class="info_header">
      <div class="h_left">
        <span @click="$emit('viewChange')"
          ><i class="el-icon-d-arrow-left"></i>XXX团队</span
        >
      </div>
      <div class="h_right">
        <el-button-group>
          <el-button
            :type="viewType == 1 ? 'primary' : 'info'"
            icon="el-icon-arrow-left"
            size="small"
            @click="handleViewChange(1)"
            >团队信息</el-button
          >
          <el-button
            :type="viewType == 2 ? 'primary' : 'info'"
            size="small"
            @click="handleViewChange(2)"
            >团队成员<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </el-button-group>
      </div>
    </div>
    <UserList v-if="viewType == 2"></UserList>
    <TeamInfo v-else></TeamInfo>
  </div>
</template>

<script>
export default {
  components: {
    UserList: () => import("./user-list"),
    TeamInfo: () => import("./team-info"),
  },
  data() {
    return {
      viewType: 1,
    };
  },
  created() {},
  methods: {
    /**
     * 视图切换
     */
    handleViewChange(val) {
      this.viewType = val;
    },
  },
};
</script>

<style lang="less" scoped>
#teaminfo-user {
  height: 100%;
  .info_header {
    background: #ffffff;
    line-height: 4rem;
    padding: 0 0 0 12px;
    display: flex;
    justify-content: space-between;
    .h_left {
      color: #303133;
      i {
        margin-right: 10px;
        font-size: 16px;
      }
      span {
        font-size: 16px;
        font-weight: bold;
      }
      span:first-child {
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
