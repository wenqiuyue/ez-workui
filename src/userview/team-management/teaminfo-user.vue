<template>
  <div id="teaminfo-user">
    <!-- 列表页 -->
    <div class="info_header" v-if="viewType != 3">
      <div class="h_left">
        <span @click="$emit('viewChange')"
          ><i class="el-icon-d-arrow-left"></i>返回</span
        >
        <el-divider direction="vertical"></el-divider>
        <span
          @click="handleViewChange(1)"
          :class="viewType == 1 ? ' active_span' : ''"
          >团队信息</span
        >
        <el-divider direction="vertical"></el-divider>
        <span
          @click="handleViewChange(2)"
          :class="viewType == 2 ? ' active_span' : ''"
          >团队成员</span
        >
      </div>
    </div>
    <!-- 团队成员列表 -->
    <UserList v-if="viewType == 2" :selRow="selRow"></UserList>
    <!-- 团队详情 -->
    <TeamInfo
      v-else-if="viewType == 1"
      :selRow="selRow"
      @handleViewChange="handleViewChange"
    ></TeamInfo>
    <!-- 规则设置 -->
    <RuleSetting
      v-else
      :teamValue="selRow.Id"
      :team="selRow"
      @handleViewChange="handleViewChange(1)"
    ></RuleSetting>
  </div>
</template>

<script>
export default {
  components: {
    UserList: () => import("./user-list"),
    TeamInfo: () => import("./team-info"),
    RuleSetting: () => import("@/userview/process-rulesver"),
  },
  props: {
    //选择的团队
    selRow: {
      type: Object,
      default: null,
    },
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
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
      .active_span {
        color: #409eff;
      }
    }
  }
}
</style>
