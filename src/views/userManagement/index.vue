<template>
  <div id="UserManagement">
    <Header
      title="用户管理"
      titleEnglish="User Management"
      class="baseHeader"
    />
    <CContent v-loading="loading">
      <template #search>
        <CTitle :TInfo="titleInfo" @searchClick="searchClick" />
      </template>
      <template #main>
        <el-table
          :data="tableData"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <el-table-column label="成员账户" prop="UseName"> </el-table-column>
          <el-table-column label="昵称" prop="UseName"
            ><template slot-scope="scope">
              {{ scope.row.Name ? scope.row.Name : "无" }}
            </template>
          </el-table-column>
          <el-table-column label="成员角色" prop="RoleName"> </el-table-column>
          <el-table-column label="团队数量" prop="TeamCount"> </el-table-column>
          <el-table-column label="加入时间" prop="SignTime"> <template slot-scope="scope">
              {{
                scope.row.SignTime
                  ? scope.row.SignTime.timeFormat("yyyy-MM-dd HH:mm")
                  : "--"
              }}
            </template></el-table-column
          ></el-table-column>
          <el-table-column label="最后登录时间" prop="LastClientOnline">
            <template slot-scope="scope">
              {{
                scope.row.LastClientOnline
                  ? scope.row.LastClientOnline.timeFormat("yyyy-MM-dd HH:mm")
                  : "--"
              }}
            </template></el-table-column
          >
          <el-table-column fixed="right" label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleView(scope.row)"
                >详情</el-button
              >
              <el-button
                v-if="scope.row.Shape == 0"
                type="success"
                size="mini"
                @click="handleDel(scope.row, 1)"
                >启用</el-button
              >
              <el-button
                v-if="scope.row.Shape == 1"
                type="warning"
                size="mini"
                @click="handleDel(scope.row, 0)"
                >禁用</el-button
              >
              <el-button
                v-if="scope.row.Shape == 1"
                type="danger"
                size="mini"
                @click="handleDel(scope.row, -1)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @eventComfirm="handlePaginationChange" />
      </template>
    </CContent>
    <UserInfo :selRow="selRow" @success="getTableList"></UserInfo>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CPages: () => import("@/components/CPages"),
    UserInfo: () => import("./userInfo"),
  },
  data: () => ({
    loading: false,
    selRow: null, //操作的用户
    searchVal: null, //搜索内容
    cellStyle: {
      textAlign: "center",
    },
    tableData: [],
    titleInfo: {
      btnShow: [
        { type: "addBtn", ishow: false, disabled: true },
        { type: "startBtn", ishow: false, disabled: true },
        { type: "closeBtn", ishow: false, disabled: true },
        { type: "delBtn", ishow: false, disabled: true },
      ],
      dropDown: {
        searchInput: {
          placeholder: "请输入用户名称",
        },
      },
    },
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
  }),
  mounted() {
    this.getTableList();
  },
  methods: {
    /**
     * 获取团队列表
     */
    getTableList() {
      this.loading = true;
      const data = {
        seachtext: this.searchVal,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
      };
      this.$http
        .get("/Management/UserManagement/UserList.ashx", { params: data })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.ListUsers;
            this.pageData.totalNum = resp.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 搜索
     */
    searchClick(val) {
      this.searchVal = val;
      this.getTableList();
    },
    /**
     * 分页
     */
    handlePaginationChange(a) {
      this.pageData = a;
      this.getTableList();
    },
    /**
     * 查看
     */
    handleView(a) {
      this.selRow = a;
      this.$modal.show("userInfo");
    },
    /**
     * 删除
     */
    handleDel(row, type) {
      let name = null;
      if (type == 1) {
        name = "启用";
      } else if (type == 0) {
        name = "禁用";
      } else {
        name = "删除";
      }
      this.$confirm(`此操作将${name}该用户, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/Management/UserManagement/OperationUser.ashx", {
              usIds: [row.UsId],
              operation: type,
            })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: `${name}成功!`,
                });
                this.getTableList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消${name}`,
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
#UserManagement {
  height: 100%;
}
</style>
