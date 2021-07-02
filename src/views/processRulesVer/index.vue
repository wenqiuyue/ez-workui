<template>
  <div id="processRulesVer">
    <div class="ver" v-if="!isInfoView">
      <Header
        title="进程规则管理"
        titleEnglish="Process Rules Management"
        class="baseHeader"
      >
      </Header>
      <c-content v-loading="loading">
        <!-- 搜索部分 -->
        <c-title
          slot="search"
          :TInfo="titleInfo"
          @addClick="addClick"
          @searchClick="searchClick"
        >
        </c-title>
        <!-- 主体表格部分 -->
        <el-table
          slot="main"
          :data="tableData"
          ref="multipleTable"
          style="width: 100%"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <template slot="empty" style="font-size: 0">
            <!-- <p>暂无内容</p> -->
            <div style="height: 100%">
              <img
                src="@/assets/img/emptyData.png"
                style="display: inline-block; width: 50%; margin-top: 100px"
              />
            </div>
          </template>
          <el-table-column
            label="进程规则版本"
            :show-overflow-tooltip="true"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            label="创建时间"
            :show-overflow-tooltip="true"
            prop="name"
          >
            <template slot-scope="scope"> 2021-02-03 12:21 </template>
          </el-table-column>
          <el-table-column label="操作" min-width="110">
            <!-- fixed  -->
            <template slot-scope="scope">
              <el-button
                type="success"
                size="mini"
                @click="handleInfo(scope.row)"
                >详情</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleDelt(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <c-pages
          slot="pages"
          v-model="pageData"
          @changeEvent="handlePaginationChange"
        ></c-pages>
      </c-content>
    </div>
    <processRulesManager
      v-else
      @handleVerList="handleVerList"
    ></processRulesManager>
    <VerModal
      :indexData="indexData"
      ref="VerModal"
      @eventComfirm="getDataList"
    ></VerModal>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CTitle: () => import("@/components/CTitle"),
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    processRulesManager: () => import("../processRulesManager"),
    VerModal: () => import("./verModal"),
  },
  data: () => ({
    isInfoView: false,
    loading: false,
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
    // CX Title组件
    titleInfo: {
      // 控制左侧：按钮组四个
      btnShow: [
        { type: "addBtn", ishow: true },
        { type: "startBtn", ishow: false, disabled: true },
        { type: "closeBtn", ishow: false, disabled: true },
        { type: "delBtn", ishow: false, disabled: true },
      ],
      // 控制右侧：下拉细节 搜索框
      dropDown: {
        // Input组件们的：右侧共同属性
        searchInput: {
          placeholder: "进程组版本名称",
        },
      },
    },

    tableData: [
      {
        name: 123,
      },
    ],
    searchKW: "",
    indexData: {
      type: "", // Add Edit
      name: "",
      departmentCode: "",
    },
    cellStyle: {
      textAlign: "center",
    },
  }),
  created() {
    // this.getDataList();
  },
  methods: {
    /**
     * 返回到版本列表
     */
    handleVerList() {
      this.isInfoView = false;
    },
    /**
     * 详情
     */
    handleInfo(row) {
      this.isInfoView = true;
    },
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此进程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: [row.ID],
          };
          this.comDelete(params);
        })
        .catch(() => {});
    },
    comDelete(params) {
      this.$http
        .post("/ProgressGroup/DelProgressGroup.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success",
            });
            this.getDataList();
          }
        });
    },

    // 新增
    addClick() {
      this.openWin("ad");
    },
    // 编辑
    handleEdit(row) {
      this.openWin("ed", row.ID, row.Name);
    },
    // 打开窗口
    openWin(ty, code, proName) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加进程版本" : "编辑进程版本",
        departmentCode: code,
        proName: proName,
        xModalName: "verModal",
      };
      this.$modal.show("verModal");
      this.$nextTick(() => {
        this.$refs.VerModal.changeEditState();
      });
    },

    // 查询
    searchClick(val) {
      this.searchKW = val;
      this.pageData.pageIndex = 1;
      this.getDataList();
    },
    // 获取列表
    getDataList() {
      let params = {
        name: this.searchKW,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
      };
      this.loading = true;
      this.$http
        .get("/Management/ProgressManagement/ProgressGroupAllList.ashx", {
          params: params,
        })
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
            this.loading = false;
          }
        });
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getDataList();
    },
  },
};
</script>

<style lang="less" scoped>
#processRulesVer {
  height: 100%;
  .ver {
    height: 100%;
  }
}
</style>
