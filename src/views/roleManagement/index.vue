<template>
  <div id="roleManagement">
    <Header
      title="角色管理"
      titleEnglish="Role Management"
      class="baseHeader"
    />
    <CContent v-loading="loading">
      <template #search>
        <CTitle
          :TInfo="titleInfo"
          @addClick="handleAdd"
          @searchClick="searchClick"
        />
      </template>
      <template #main>
        <el-table
          :data="tableData"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
          v-loading="loading"
        >
          <el-table-column label="角色名称" prop="Name" />
          <el-table-column label="创建时间" prop="CreatTime"
            ><template slot-scope="scope">
              {{
                scope.row.CreatTime
                  ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
                  : "--"
              }}
            </template></el-table-column
          >
          <el-table-column fixed="right" label="操作" width="170">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.IsSystem"
                type="primary"
                size="mini"
                @click="handleView(scope.row)"
                >编辑</el-button
              >
              <el-button type="danger" size="mini" @click="handleDel(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </CContent>
    <RoleModal
      :isAdd="isAdd"
      :selRow="selRow"
      @success="getTableData"
    ></RoleModal>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CBtn: () => import("@/components/CBtn"),
    RoleModal: () => import("./roleModal"),
  },
  data: () => ({
    searchVal: null, //搜索的内容
    loading: false,
    selRow: null, //操作的角色
    cellStyle: {
      textAlign: "center",
    },
    tableData: [],
    titleInfo: {
      btnShow: [
        { type: "addBtn", ishow: true },
        { type: "startBtn", ishow: false, disabled: true },
        { type: "closeBtn", ishow: false, disabled: true },
        { type: "delBtn", ishow: false, disabled: true },
      ],
      dropDown: {
        searchInput: {
          placeholder: "请输入角色名称",
        },
      },
    },
    isAdd: true, //是否是添加类型
  }),
  mounted() {
    this.getTableData();
  },
  methods: {
    /**
     * 获取列表
     */
    getTableData() {
      this.loading = true;
      this.$http
        .get("/Management/RoleManagement/RoleList.ashx", {
          params: { name: this.searchVal },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 添加
     */
    handleAdd() {
      this.isAdd = true;
      this.$modal.show("roleModal");
    },
    /**
     * 删除
     */
    handleDel(row) {
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/Management/RoleManagement/DelRole.ashx", { id: [row.Id] })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getTableData();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 搜索
     */
    searchClick(val) {
      this.searchVal = val;
      this.getTableData();
    },
    /**
     * 编辑
     */
    handleView(a) {
      this.selRow = a;
      this.isAdd = false;
      this.$modal.show("roleModal");
    },
  },
};
</script>

<style lang="less" scoped>
#roleManagement {
  height: 100%;
  /deep/.el-table__row {
    td:last-child {
      text-align: left !important;
    }
  }
}
</style>
