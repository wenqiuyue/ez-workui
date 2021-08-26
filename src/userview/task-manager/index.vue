<template>
  <div class="task-manager">
    <Header title="任务管理" titleEnglish="Task Management" class="baseHeader">
      <div slot="btnGroup">
        <a
          v-for="item in tabList"
          :key="item.value"
          :class="{ 'router-link-active': tabType == item.value }"
        >
          <span @click="tabChange(item.value)" class="el-dropdown-link">
            <label>{{ item.label }}</label>
          </span>
        </a>
      </div>
    </Header>
    <TaskList v-if="tabType == 1" :teamOptions="teamOptions"></TaskList>
    <MemberTask
      v-else-if="tabType == 2"
      :teamOptions="teamOptions"
    ></MemberTask>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    TaskList: () => import("./task-list"),
    MemberTask: () => import("./member-task"),
  },
  data() {
    return {
      teamOptions: [],
      tabType: 1,
      tabList: [
        {
          value: 1,
          label: "我的任务",
        },
        {
          value: 2,
          label: "成员任务",
        },
      ],
    };
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    /**
     * tab视图切换
     */
    tabChange(val) {
      this.tabType = val;
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.task-manager {
  height: 100%;
  box-sizing: border-box;
  /deep/header.baseHeader .right {
    & > div > a.router-link-active {
      color: #448ef5 !important;
      border-top-color: #448ef5;
    }
  }
  .el-dropdown-link {
    padding: 0.5rem 1rem;
  }
}
</style>
