<template>
  <div class="attendance-statistics">
    <Header
      title="考勤统计"
      titleEnglish="Attendance Statistics"
      class="baseHeader"
    >
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
      </div></Header
    >
    <MyAttendance v-if="tabType == 1"></MyAttendance>
    <MemberAttendance v-else></MemberAttendance>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    MyAttendance: () => import("./my-attendance"),
    MemberAttendance: () => import("./member-attendance"),
  },
  data() {
    return {
      tabType: 1,
      tabList: [
        {
          value: 1,
          label: "我的考勤",
        },
        {
          value: 2,
          label: "成员考勤",
        },
      ],
    };
  },
  methods: {
    /**
     * tab视图切换
     */
    tabChange(val) {
      this.tabType = val;
    },
  },
};
</script>
<style lang="less" scoped>
.attendance-statistics {
  height: 100%;
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
