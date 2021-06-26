<template>
  <div id="rule-setting">
    <Header
      title="进程规则设置"
      titleEnglish="Process Rules Setting"
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
      </div>
    </Header>
    <ProgressGroup v-if="tabType == 1"></ProgressGroup>
    <processRule v-else></processRule>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    ProgressGroup: () => import("./progressGroup"),
    processRule: () => import("./processRule"),
  },
  data: () => ({
    tabType: 1,
    tabList: [
      {
        value: 1,
        label: "进程组设置",
      },
      {
        value: 2,
        label: "进程规则设置",
      },
    ],
  }),
  methods: {
    tabChange(value) {
      this.tabType = value;
    },
  },
};
</script>

<style lang="less" scoped>
#rule-setting {
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
