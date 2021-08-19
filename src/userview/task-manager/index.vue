<template>
  <div class="task-manager">
    <Header title="任务管理" titleEnglish="Task Management" class="baseHeader">
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
          label="任务"
          :show-overflow-tooltip="true"
          fixed
          prop="task"
        >
        </el-table-column>
        <el-table-column
          label="描述"
          :show-overflow-tooltip="true"
          fixed
          prop="describe"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          :show-overflow-tooltip="true"
          fixed
          prop="status"
        >
          <template slot-scope="scope">
            <el-tag type="success" size="medium">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          :show-overflow-tooltip="true"
          fixed
          prop="CreatTime"
        >
          <template slot-scope="scope">
            {{
              scope.row.CreatTime
                ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- fixed  -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >详情</el-button
            >
            <el-button type="danger" size="mini" @click="handleDelt(scope.row)"
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
    <TaskModal
      ref="taskM"
      :indexData="indexData"
      @eventComfirm="getDataList"
    ></TaskModal>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CPages: () => import("@/components/CPages"),
    TaskModal: () => import("./task-modal"),
  },
  data() {
    return {
      loading: false,
      indexData: {
        type: "", // Add Edit
        name: "",
        departmentCode: "",
      },
      tableData: [
        {
          task: "任务管理页面",
          status: "启用",
          describe: "完成任务管理列表功能",
          CreatTime: "2021-02-01 12:12:11",
        },
        {
          task: "任务详情",
          status: "启用",
          describe: "完成任务管理列表功能",
          CreatTime: "2021-02-01 12:12:11",
        },
      ],
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
            placeholder: "请输入任务",
          },
        },
      },
      cellStyle: {
        textAlign: "center",
      },
    };
  },
  methods: {
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {})
        .catch(() => {});
    },

    // 新增
    addClick() {
      this.openWin("ad");
    },
    // 编辑
    handleEdit(row) {
      this.openWin("ed", row.Id, row);
    },
    // 打开窗口
    openWin(ty, code, row) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加项目" : "编辑项目",
        departmentCode: code,
        row: row,
        xModalName: "taskM",
      };
      this.$modal.show("taskM");
      this.$nextTick(() => {
        this.$refs.taskM.changeEditState();
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
        configId: this.selRow.Id,
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
.task-manager {
  height: 100%;
  box-sizing: border-box;
}
</style>
