<template>
  <div id="teaminfo-user">
    <!-- 列表页 -->
    <!-- <div class="info_header" v-if="viewType != 3">
      <div class="h_left">
        <span @click="$emit('viewChange')"
          ><i class="el-icon-d-arrow-left"></i>返回</span
        >
      </div>
    </div> -->
    <div class="info_header" v-if="viewType != 3" style="margin-top: 5px">
      <div class="h_left">
        <span @click="$emit('viewChange')"
          ><i class="el-icon-d-arrow-left"></i>返回</span
        >
        <span
          @click="handleViewChange(1)"
          :class="viewType == 1 ? ' active_span' : ''"
          >团队信息</span
        >
        <!-- <el-divider direction="vertical"></el-divider> -->
        <span
          @click="handleViewChange(2)"
          :class="viewType == 2 ? ' active_span' : ''"
          >申请列表</span
        >
        <!-- <el-divider direction="vertical"></el-divider> -->
        <span
          @click="handleViewChange(4)"
          :class="viewType == 4 ? ' active_span' : ''"
          >考勤异常申诉</span
        >
        <!-- <el-divider direction="vertical"></el-divider> -->
        <span
          @click="handleViewChange(5)"
          :class="viewType == 5 ? ' active_span' : ''"
          >排班设置</span
        >
      </div>
      <div
        class="screen_left"
        v-if="
          viewType == 1 && infoData && infoData.Teamdata.UserMemberMType != 1
        "
      >
        <el-button type="primary" size="small" @click="handleAddUser"
          >添加成员</el-button
        >
      </div>
      <div
        class="screen_left"
        v-if="
          viewType == 2 && infoData && infoData.Teamdata.UserMemberMType != 1
        "
      >
        <el-button type="success" size="small" @click="invitationBtn(1)"
          >全部同意</el-button
        >
        <el-button type="danger" size="small" @click="invitationBtn(-1)"
          >全部拒绝</el-button
        >
        <el-button type="info" size="small" @click="handleInvitationDel"
          >清空记录</el-button
        >
      </div>
    </div>
    <!-- 团队申请列表 -->
    <InvitationList
      v-if="viewType == 2"
      :teamId="selRow.Id"
      :UserMemberMType="infoData ? infoData.Teamdata.UserMemberMType : null"
      ref="InvitationList"
    ></InvitationList>

    <!-- 团队详情 -->
    <TeamInfo
      v-else-if="viewType == 1"
      :selRow="selRow"
      @handleViewChange="handleViewChange"
      :infoData="infoData"
      @getData="getData"
    ></TeamInfo>
    <!-- 考勤申诉 -->
    <Apply v-else-if="viewType == 4" :selRow="selRow"></Apply>
    <!-- 排班设置 -->
    <Scheduling v-else-if="viewType == 5" :selRow="selRow"></Scheduling>
    <!-- 规则设置 -->
    <RuleSetting
      v-else
      :teamValue="selRow.Id"
      :team="selRow"
      @handleViewChange="handleViewChange(1)"
    ></RuleSetting>
    <!-- 管理员创建成员 -->
    <CreateUser :teamValue="selRow.Id" @success="getData"></CreateUser>
  </div>
</template>

<script>
export default {
  components: {
    InvitationList: () => import("./invitation-list"),
    TeamInfo: () => import("./team-info"),
    Apply: () => import("./apply"),
    Scheduling: () => import("./scheduling"),
    RuleSetting: () => import("@/userview/process-rulesver"),
    CreateUser: () => import("./create-user"),
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
      infoData: null, //详细信息
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    /**
     * 管理员添加成员
     */
    handleAddUser() {
      this.$modal.show("createUser");
    },
    /**
     * 邀请列表清空按钮
     */
    handleInvitationDel() {
      this.$refs.InvitationList.handleDel();
    },
    /**
     * 邀请列表的按钮
     */
    invitationBtn(val) {
      this.$refs.InvitationList.handleInv(null, val);
    },
    /**
     * 视图切换
     */
    handleViewChange(val) {
      this.viewType = val;
      if (this.viewType == 1) {
        this.getData();
      }
    },
    /**
     * 获取团队信息
     */
    getData() {
      this.$http
        .get("/Teams/TeamManagementDetail.ashx", {
          params: { teamId: this.selRow.Id },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.infoData = resp.data;
          }
        });
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
        margin-right: 22px;
        &:hover {
          color: #409eff;
        }
      }
      .active_span {
        color: #409eff;
      }
      .el-divider {
        margin: 0 12px;
        height: 2rem;
      }
    }
  }
}
</style>
