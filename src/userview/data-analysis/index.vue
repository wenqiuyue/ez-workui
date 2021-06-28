<template>
  <div class="data-analysis">
    <XHeader title="数据分析" titleEnglish="Data Analysis" class="baseHeader">
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
    </XHeader>
    <!-- 成员数据 -->
    <MemberData v-if="tabType == 1"></MemberData>
    <!-- 成员周况 -->
    <MemberOverview v-else-if="tabType == 2"></MemberOverview>
    <!-- 成员实况 -->
    <MemberProccess v-else></MemberProccess>
  </div>
</template>
<script>
export default {
  components: {
    XHeader: () => import("@/components/Header"),
    MemberOverview: () => import("../member-overview"),
    MemberProccess: () => import("../member-proccess"),
    MemberData: () => import("./member-data"),
  },
  data() {
    return {
      tabType: 1,
      tabList: [
        {
          value: 1,
          label: "成员数据",
        },
        {
          value: 2,
          label: "成员周况",
        },
        {
          value: 3,
          label: "成员实况",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    tabChange(val) {
      this.tabType = val;
    },
  },
};
</script>
<style lang="less" scoped>
.data-analysis {
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
