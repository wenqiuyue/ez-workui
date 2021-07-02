<template>
  <div id="databaseManagement">
    <Header
      title="数据库管理"
      titleEnglish="Database Management"
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
    <CContent v-loading="loading">
      <template #search>
        <el-button type="primary" size="medium">提交更新</el-button>
      </template>
      <template #main>
        <el-table
          :data="tableData"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <el-table-column label="版本名称" prop="jurisdiction">
          </el-table-column>
          <el-table-column label="提交人" prop="name"> </el-table-column>
          <el-table-column label="提交时间" prop="date"> </el-table-column>
          <el-table-column label="已完成更新" prop="num">
            <template slot-scope="scope"> 200人 </template>
          </el-table-column>
          <el-table-column label="更新内容" prop="num" show-overflow-tooltip>
            <template slot-scope="scope">
              更新内容更新内容更新内容更新内容更新内容更新内容更新内容
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <c-btn>
                <span @click="handleView(scope.row)">详情</span>
              </c-btn>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @eventComfirm="handlePaginationChange" />
      </template>
    </CContent>
    <DatabaseM></DatabaseM>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    CBtn: () => import("@/components/CBtn"),
    DatabaseM: () => import("./databaseM"),
  },
  data: () => ({
    tabType: 1,
    tabList: [
      {
        value: 1,
        label: "创建数据库",
      },
      {
        value: 2,
        label: "更新数据库",
      },
    ],
    loading: false,
    cellStyle: {
      textAlign: "center",
    },
    tableData: [],
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
  }),
  methods: {
    /**
     * 获取数据库列表
     */
    getDataList() {
      this.loading = true;
    },
    /**
     * 创建和更新的切换
     */
    tabChange(value) {
      this.tabType = value;
    },
    /**
     * 分页
     */
    async handlePaginationChange(a) {
      this.pageData = a;
    },
    /**
     * 查看
     */
    handleView(a) {
      this.$modal.show("databaseM");
      console.log(a);
    },
  },
};
</script>

<style lang="less" scoped>
#databaseManagement {
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
