<template>
  <div id="processRulesManager" v-if="selRow">
    <Header :title="selRow.ConfigName" titleEnglish="" class="baseHeader">
      <div slot="btnGroup">
        <span class="go_ver" @click="$emit('handleVerList')"
          ><i class="el-icon-d-arrow-left"></i>返回版本列表</span
        >
        <el-divider direction="vertical"></el-divider>
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
    <ProgressGroup v-if="tabType == 1" :selRow="selRow"></ProgressGroup>
    <processRule v-else-if="tabType == 2" :selRow="selRow"></processRule>
    <processMarkManager
      v-else-if="tabType == 3"
      :selRow="selRow"
    ></processMarkManager>
    <windowAliasManager
      v-else-if="tabType == 4"
      :selRow="selRow"
    ></windowAliasManager>
    <ActionRule v-else-if="tabType == 5" :selRow="selRow"></ActionRule>
    <SensitiveWords v-else-if="tabType == 6" :selRow="selRow"></SensitiveWords>
    <ShieldingSoftware
      v-else-if="tabType == 7"
      :selRow="selRow"
    ></ShieldingSoftware>
    <UrlSet v-else-if="tabType == 8" :selRow="selRow"></UrlSet>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    ProgressGroup: () => import("./progressGroup"),
    processRule: () => import("./processRule"),
    processMarkManager: () => import("./processMarkManager"),
    windowAliasManager: () => import("./windowAliasManager"),
    ActionRule: () => import("./actionRule"),
    SensitiveWords: () => import("./sensitiveWords"),
    ShieldingSoftware: () => import("./shieldingSoftware"),
    UrlSet: () => import("./urlSet"),
  },
  props: {
    selRow: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    tabType: 6,
    tabList: [
      {
        value: 6,
        label: "敏感词",
      },
      {
        value: 7,
        label: "屏蔽的软件",
      },
      {
        value: 1,
        label: "部门设置",
      },
      {
        value: 5,
        label: "行为规则设置",
      },
      {
        value: 2,
        label: "进程规则设置",
      },
      {
        value: 8,
        label: "网络请求分类",
      },
      {
        value: 3,
        label: "进程标记",
      },
      {
        value: 4,
        label: "窗口别名",
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
#processRulesManager {
  height: 100%;

  /deep/header.baseHeader .right {
    .go_ver {
      font-size: 1.5rem;
      cursor: pointer;
      font-weight: 700;
      padding-top: 0.3rem;
      margin-right: 8px;
      color: #303133;
      i {
        margin-right: 8px;
      }
      &:hover {
        color: #448ef5;
      }
    }
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
