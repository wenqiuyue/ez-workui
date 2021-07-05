<template>
  <div id="rule-setting">
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
    <ProgressGroup
      v-if="tabType == 1"
      :teamValue="teamValue"
      :selRow="selRow"
    ></ProgressGroup>
    <processRule v-else :teamValue="teamValue" :selRow="selRow"></processRule>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    ProgressGroup: () => import("./progressGroup"),
    processRule: () => import("./processRule"),
  },
  props: {
    //规则版本信息
    selRow: {
      type: Object,
      default: null,
    },
    teamValue: {
      type: Number,
      default: 0,
    },
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
