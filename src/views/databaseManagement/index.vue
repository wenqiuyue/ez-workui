<template>
  <div id="databaseManagement" v-loading="loading">
    <Header
      title="数据库管理"
      titleEnglish="Database Management"
      class="baseHeader"
    />
    <CContent>
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
          <el-table-column label="未完成更新" prop="num"
            ><template slot-scope="scope"> 200人 </template>
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
    loading: false,
    cellStyle: {
      textAlign: "center",
    },
    tableData: [
      {
        date: "2016-05-02",
        name: "王小虎",
        jurisdiction: "管理员",
        num: "20",
      },
      {
        date: "2016-05-04",
        name: "王小虎",
        jurisdiction: "管理员",
        num: "23",
      },
      {
        date: "2016-05-01",
        name: "王小虎",
        jurisdiction: "成员",
        num: "20",
      },
      {
        date: "2016-05-03",
        name: "王小虎",
        jurisdiction: "成员",
        num: "20",
      },
    ],
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
  }),
  methods: {
    /**
     * 搜索
     */
    searchClick(val) {
      console.log(val);
    },
    async handlePaginationChange(...a) {
      console.log(a);
    },
    /**
     * 查看
     */
    handleView(...a) {
      this.$modal.show("databaseM");
      console.log(a);
    },
  },
};
</script>

<style lang="less" scoped>
#databaseManagement {
  height: 100%;
}
</style>
