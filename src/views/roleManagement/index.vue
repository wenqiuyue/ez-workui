<template>
  <div id="roleManagement" v-loading="loading">
    <Header
      title="角色管理"
      titleEnglish="Role Management"
      class="baseHeader"
    />
    <CContent>
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
        >
          <el-table-column label="角色名称" prop="role" />
          <el-table-column label="创建时间" prop="date" />
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <c-btn>
                <span @click="handleView(scope.row)">编辑</span>
                <span @click="handleDel(scope.row)">删除</span>
              </c-btn>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @eventComfirm="handlePaginationChange" />
      </template>
    </CContent>
    <RoleModal :isAdd="isAdd"></RoleModal>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
    RoleModal: () => import("./roleModal"),
  },
  data: () => ({
    loading: false,
    cellStyle: {
      textAlign: "center",
    },
    tableData: [
      {
        date: "2016-05-03",
        role: "管理员",
      },
      {
        date: "2016-05-03",
        role: "用户",
      },
      {
        date: "2016-05-03",
        role: "用户",
      },
      {
        date: "2016-05-03",
        role: "超级管理员",
      },
    ],
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
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
    isAdd: true, //是否是添加类型
  }),
  methods: {
    /**
     * 添加
     */
    handleAdd() {
      this.isAdd = true;
      this.$modal.show("roleModal");
    },
    async handlePaginationChange(...a) {
      console.log(a);
    },
    /**
     * 删除
     */
    handleDel(row) {
      console.log(row);
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
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
      console.log(val);
    },
    /**
     * 编辑
     */
    handleView(...a) {
      this.isAdd = false;
      this.$modal.show("roleModal");
      console.log(a);
    },
  },
};
</script>

<style lang="less" scoped>
#roleManagement {
  height: 100%;
}
</style>
