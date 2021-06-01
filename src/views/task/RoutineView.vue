<template>
  <div id="pro">
    <div class="pro-header">
      <div class="header-container">
        <div class="title">
          <el-tooltip :content="projectData.evName"
            ><div>项目：{{ projectData.evName }}</div></el-tooltip
          >
        </div>
        <ul class="h-tabs clear_fix">
          <li
            v-for="item in tabENUM"
            :key="item.id"
            :class="{ active: item.id == activeTab }"
            @click="changeTab(item)"
          >
            {{ item.title }}
          </li>
          <li class="add">+</li>
        </ul>
        <div class="btns">
          <div class="members">
            <div class="avatars" @click="drawer = !drawer">
              <el-avatar
                v-for="item of projectMemberAvatarsList"
                :key="item.ParticipantID"
                class="members-item"
                :src="item.PictureParticipant"
                :size="32"
              >
                {{ item.ParticipantName ? item.ParticipantName[0] : "" }}
              </el-avatar>
            </div>
            <!-- v-if="ROLE('主要人员')" :arrays="[crtTask.tester]" -->
            <MemberSelect
              @Confirm="handleInvitationEvent"
              :showActive="false"
              :arrays="invMembers"
            >
              <button slot="button">邀请</button>
            </MemberSelect>
          </div>
          <div class="manage">
            <button @click.prevent="openHeadMenu('proDetail')">
              <i class="el-icon-s-operation"></i>
              管理
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-container">
      <el-drawer
        :modal="false"
        :visible.sync="drawer"
        size="240px"
        :withHeader="false"
        :style="{ top: 65 }"
      >
        <div v-loading="drawerLoading">
          <h6 class="title">全部成员</h6>
          <MemberSelect
            @Confirm="handleInvitationEvent"
            :showActive="false"
            :arrays="invMembers"
          >
            <template #button>
              <div class="addMember">搜索成员以添加</div>
            </template>
          </MemberSelect>
          <ul class="members-list">
            <li
              v-for="item of projectMemberList"
              :key="item.ParticipantID"
              class="members-item"
            >
              <el-popover
                placement="left"
                trigger="click"
                @after-enter="handleShowMemberPopover(item.ParticipantID)"
                @after-leave="handleHideMemberPopover"
              >
                <template #reference>
                  <div
                    :class="[
                      'members-item--div',
                      {
                        'members-item--div--active':
                          drawerActiveMemberID === item.ParticipantID,
                      },
                    ]"
                  >
                    <div class="members-item-primary">
                      <el-avatar :src="item.PictureParticipant" :size="32">{{
                        item.ParticipantName ? item.ParticipantName[0] : ""
                      }}</el-avatar>
                      <span>{{ item.ParticipantName }}</span>
                    </div>
                    <div class="members-item-actions">
                      <span>{{ item.PName }}</span>
                    </div>
                  </div>
                </template>
                <div
                  class="members-item-popover--root"
                  v-loading="drawerLoading"
                >
                  <div class="members-item-primary">
                    <el-avatar :src="item.PictureParticipant" :size="32">{{
                      item.ParticipantName ? item.ParticipantName[0] : ""
                    }}</el-avatar>
                    <span>{{ item.ParticipantName }}</span>
                  </div>
                  <el-dropdown
                    trigger="click"
                    size="small"
                    @command="handleChangeCommand"
                  >
                    <div class="members-item" data-action>
                      <div>
                        <i class="hiFont hi-scheduling"></i>
                        <span>项目角色</span>
                      </div>
                      <div class="members-item-actions">
                        <span>{{ item.PName }}</span>
                      </div>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="_item of roleList"
                        :key="_item.Id"
                        :data-active="_item.Id === item.PID"
                        :command="[[item.ParticipantID], _item.Id]"
                      >
                        {{ _item.Name }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <div
                    class="members-item"
                    data-danger
                    @click="handleDeleteMember(item.ParticipantID)"
                  >
                    <i class="el-icon-delete"></i>
                    <span>删除此成员</span>
                  </div>
                </div>
              </el-popover>
            </li>
          </ul>
        </div>
      </el-drawer>
      <transition><component :is="activeComponent"/></transition>
    </div>
    <!-- 组件 -->
    <pro-detail @upData="upEvName" ref="detail"></pro-detail>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  components: {
    MemberSelect: () => import("@/components/Selectors/MemberSelect"),
    ProDetail: () => import("@/views/pro/proDetail"),
    taskType: () => import("./taskType"),
    proOverview: () => import("../pro/overview"),
    ProDocument: () => import("../pro/document"),
    update: () => import("../pro/update"),
    approve: () => import("../pro/approve"),
    statistics: () => import("./statistics"),
    taskDefect: () => import("./taskDefect"),
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      drawerActiveMemberID: null,
      tabENUM: [
        {
          id: 0,
          title: "项目概览",
          component: "proOverview",
        },
        {
          id: 1,
          title: "任务",
          component: "taskType",
        },
        // {
        //   id: 2,
        //   title: "缺陷",
        //   component: "taskDefect",
        // },
        // {
        //   id: 3,
        //   title: "迭代",
        //   component: "update",
        // },
        {
          id: 4,
          title: "文档",
          component: "ProDocument",
        },
        {
          id: 5,
          title: "审核",
          component: "approve",
        },
        {
          id: 6,
          title: "统计",
          component: "statistics",
        },
      ],
      activeTab: 0,
      formData: {
        eventeID: "",
      },
      loading: false,
      activeComponent: "proOverview",
      projectData: {},
      roleList: [],
    };
  },
  computed: {
    eid() {
      return this.$route.params.eid;
    },
    user() {
      return this.$store.state.user.id;
    },
    projectMemberList() {
      if (!Array.isArray(this.projectData.jobParticipantRole)) return [];

      const result = [];
      this.projectData.jobParticipantRole.forEach(({ Id, Name, UserData }) => {
        if (Array.isArray(UserData)) {
          UserData.forEach((item) => {
            result.push({
              ...item,
              PID: Id,
              PName: Name,
            });
          });
        }
      });

      return result;
    },
    projectMemberAvatarsList() {
      const {
        projectMemberList: [_1, _2],
      } = this;

      if (_1 === void 0) return [];
      if (_2 === void 0) return [_1];

      return [_1, _2];
    },
    invMembers() {
      return this.projectMemberList.map((item) => ({
        ...item,
        UId: item.ParticipantID,
      }));
    },
  },
  created() {
    const acView = this.$route.query.activeView;
    console.log(acView);
    if (acView == "taskType") {
      this.activeTab = 1;
      this.activeComponent = acView;
    } else if (acView == "approve") {
      this.activeTab = 5;
      this.activeComponent = acView;
    }
  },
  mounted() {
    this.getInitData();
    this.getRoleList();
    this.$E.$on("updateProjectInfo", () => {
      this.getInitData();
      this.getRoleList();
    });
  },
  methods: {
    ...mapActions(["is_ProLeader"]),
    async getInitData() {
      this.drawerLoading = true;
      try {
        const { res, data } = await this.$http.post(
          "/Project/projectDetailsInquire.ashx",
          {
            EventeId: this.eid,
            type: 1,
          }
        );

        if (res === 0) this.projectData = data;
      } catch {}
      this.drawerLoading = false;
    },
    /**
     * 查询当前用户是否是管理员
     */
    getLeader() {
      this.$http
        .post("/Work/Project/ReviewNode/IsDealer.ashx", {
          eId: this.$route.params.eid,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.is_ProLeader(resp.data);
          }
        });
    },
    changeTab(item) {
      this.activeTab = item.id;
      this.activeComponent = item.component;
    },
    // 邀请成员
    async handleInvitationEvent(e) {
      this.drawerLoading = true;
      try {
        const { res, msg } = await this.$http.post(
          "/Project/ProjectRole/SetProjectRole.ashx",
          {
            Ids: e.map(({ UId }) => UId),
            PId: this.eid,
            Prop: 0,
            RId: 0,
          }
        );

        if (res === 0) {
          this.$message({
            message: msg,
            type: "success",
          });
          await this.getInitData();
        }
      } catch {}
      this.drawerLoading = false;
    },
    async handleDeleteMember(RId) {
      try {
        await this.$confirm("确认是否删除此成员?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        this.drawerLoading = true;
        try {
          const { res, msg } = await this.$http.post(
            "/Project/ProjectRole/SetProjectRole.ashx",
            {
              Ids: [],
              PId: Number.parseInt(this.eid),
              Prop: 0,
              RId,
            }
          );

          if (res === 0) {
            this.$message({
              message: msg,
              type: "success",
            });
            await this.getInitData();
          }
        } catch {}
        this.drawerLoading = false;
      } catch {}
    },
    //更新项目名称
    upEvName() {},
    // 菜单点击事件
    openHeadMenu(item) {
      switch (item) {
        case "proDetail":
          this.$modal.show("projectDetail");
          break;
      }
    },
    handleShowMemberPopover(id) {
      this.drawerActiveMemberID = id;
    },
    handleHideMemberPopover() {
      this.drawerActiveMemberID = null;
    },
    async getRoleList() {
      try {
        const { res, data: { data = [] } = {} } = await this.$http.get(
          "/Project/ProjectRole/QueryRole.ashx",
          {
            params: {
              PId: this.eid,
            },
          }
        );

        if (res === 0) this.roleList = data;
      } catch {}
    },
    async handleChangeCommand([Ids, RId]) {
      this.drawerLoading = true;
      try {
        const { res, msg } = await this.$http.post(
          "/Project/ProjectRole/SetProjectRole.ashx",
          {
            Ids,
            PId: this.eid,
            Prop: 0,
            RId,
          }
        );

        if (res === 0) {
          this.$message({
            message: msg,
            type: "success",
          });
          await this.getInitData();
        }
      } catch {}
      this.drawerLoading = false;
    },
  },
  watch: {
    user() {
      if (this.user) {
        this.getLeader();
      }
    },
    $route: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        //初始化数据
        Object.assign(this.$data, this.$options.data());
        this.formData.eventeID = newval.params.eid;
        this.loading = true;
        if (this.user) {
          this.getLeader();
        }
      },
    },
    eid(crt, prev) {
      if (crt !== prev) this.getInitData();
      this.getRoleList();
    },
  },
};
</script>
<style lang="less">
@import "../../assets/variable.less";
@menu_place_width: 26rem;

li.el-dropdown-menu__item[data-active] {
  background-color: #ecf5ff;
  color: #66b1ff;
}
.members-item-popover--root {
  > div {
    width: 200px;
  }
  > .members-item-primary {
    margin-bottom: 12px;
    display: flex;
    align-items: center;

    > span:last-child {
      margin-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
  }
  .members-item {
    margin: 0 -12px 0;
    padding: 8px 12px;
    cursor: pointer;
    transition: 250ms all;

    &[data-action] {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      width: 100%;

      & > div:first-child {
        display: flex;
        align-items: center;
        max-width: 65%;

        & > i:first-child {
          width: 20px;
        }

        & > span:last-child {
          margin-left: 8px;
        }
      }

      & > .members-item-actions {
        > span {
          font-size: 13px;
        }
      }
      // members-item-actions
    }

    &[data-danger] {
      color: #f03e3e;

      &:hover {
        background-color: #ffe1e2;
      }
    }

    &:hover {
      background-color: #f2f2f2;
    }

    > i:first-child {
      width: 20px;
    }

    > span:last-child {
      margin-left: 8px;
    }
  }
}
#pro {
  height: 100%;

  .members-item--div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
    margin: 0 -16px;
    padding: 4px 16px;
    transition: all 250ms;

    &--active {
      background-color: #f2f2f2;
    }
  }

  .pro-header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 90;
    width: 100%;
    box-sizing: border-box;
    padding-left: @menu_place_width;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

    .header-container {
      padding: 1.5rem 2.2rem;
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > .title {
        font-size: 2rem;
        font-weight: bold;
        flex: 2;
        overflow: hidden;

        > div {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .h-tabs {
        margin-left: 16px;
        line-height: 32px;
        flex: 3;
        li {
          float: left;
          color: #aaaaaa;
          font-size: 16px;
          cursor: pointer;
          position: relative;
          user-select: none;
          &::after {
            content: "";
            display: block;
            width: 100%;
            height: 4px;
            background-color: #448ef5;
            position: absolute;
            bottom: -17px;
            transform: scale(0);
            transition: 0.5s;
          }
          &:hover::after {
            transform: scale(1);
          }
        }
        .active::after {
          transform: scale(1);
        }
        li + li {
          margin-left: 24px;
        }
        .add {
          color: rgba(68, 142, 245, 0.7);
          font-size: 2.8rem;
          &:hover::after {
            transform: scale(0);
          }
        }
      }
      .btns {
        .members {
          display: inline-block;
          // display: none;

          > .avatars {
            display: inline-block;
            cursor: pointer;

            & > .members-item + .members-item {
              margin-left: -16px;
            }
          }
          #mem-public {
            display: inline-block;
            vertical-align: top;
            margin-top: 5px;
            margin-left: 8px;
          }
          button {
            font-size: 12px;
            color: #448ef5;
            background-color: transparent;
            border: 1px solid #448ef5;
            padding: 3px 8px;
            cursor: pointer;
          }
        }
        .manage {
          display: inline-block;
          margin-left: 24px;
          vertical-align: top;
          margin-top: 5px;
          button {
            color: #aaaaaa;
            border: none;
            background-color: transparent;
            font-size: 16px;
            i {
              margin-right: 4px;
            }
            transition: color 0.6s;
            cursor: pointer;
            &:hover {
              color: #448ef5;
            }
          }
        }
      }
    }
  }
  .content-container {
    padding-top: 20px;
    height: calc(100% - 20px);

    .el-drawer {
      top: 65px;

      .el-drawer__body {
        margin-bottom: 65px;
        padding: 16px;
        overflow-y: auto;
      }

      .title {
        font-size: 14px;
        color: #333;
        text-align: center;
      }

      #mem-public {
        display: block;
        margin: 16px 0 0;

        .location {
          display: block;
        }
      }

      .addMember {
        padding: 4px 8px;
        color: #aaa;
        border: 1px solid #aaa;
        font-size: 12px;
      }

      .members {
        &-list {
          margin-top: 16px;
        }
        &-item {
          width: 100%;

          &:hover {
            background-color: rgba(255, 255, 255, 0.25);
          }
          &-primary {
            display: flex;
            align-items: center;
            max-width: 65%;

            & > span:last-child {
              margin-left: 8px;
              font-size: 16px;
              color: #333;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              flex: 1;
            }
          }
          &-actions {
            max-width: 35%;

            & > span {
              border: 1px solid @color_blue;
              color: @color_blue;
              font-size: 12px;
              border-radius: 2px;
              padding: 2px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: block;
            }
          }
          & + .members-item {
            margin-top: 8px;
          }
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  #pro {
    .pro-header {
      padding-left: 0;
      .header-container {
        display: block;
        .h-tabs {
          margin: 10px 0;
          li + li {
            margin-left: 12px;
          }
          li::after {
            bottom: 0px;
          }
          .add {
            display: none;
          }
        }
      }
    }
  }
}
</style>
