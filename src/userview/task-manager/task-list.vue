<template>
  <div class="task-list">
    <c-content v-loading="loading">
      <template #search>
        <div class="screen">
          <div class="search">
            <el-select
              v-model="teamValue"
              filterable
              placeholder="请选择团队"
              v-if="!isMember"
              @change="handleSearch"
            >
              <el-option
                v-for="item in teamOptions"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              >
              </el-option>
            </el-select>
            <el-input v-model="searchVal" placeholder="输入任务名"></el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-button type="primary" @click="addClick" v-if="!isMember"
            >添加任务</el-button
          >
        </div>
      </template>
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
          prop="Title"
        >
        </el-table-column>
        <el-table-column label="执行人" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="user">
              <el-avatar
                size="small"
                :src="imgChange(scope.row.Picture)"
              ></el-avatar>
              <span>{{ scope.row.UserName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          :show-overflow-tooltip="true"
          prop="Describe"
        >
          <template slot-scope="scope">
            {{ scope.row.Describe ? scope.row.Describe : "无" }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          :show-overflow-tooltip="true"
          prop="Enable"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Enable ? 'success' : 'danger'"
              size="medium"
              >{{ scope.row.Enable ? "启用" : "禁用" }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          :show-overflow-tooltip="true"
          prop="CreateTime"
        >
          <template slot-scope="scope">
            {{
              scope.row.CreateTime
                ? scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:mm")
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <!-- fixed  -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >详情</el-button
            >
            <el-button
              type="success"
              size="mini"
              @click="handleEnable(scope.row, true)"
              v-if="!isMember && !scope.row.Enable"
              >启用</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="handleEnable(scope.row, false)"
              v-if="!isMember && scope.row.Enable"
              >禁用</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelt(scope.row)"
              v-if="!isMember"
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
      @loadSuccess="xmodalLoaded"
      ref="taskM"
      :indexData="indexData"
      @eventComfirm="getDataList"
      :teamValue="teamValue"
    ></TaskModal>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    TaskModal: () => import("./task-modal"),
  },
  props: {
    teamOptions: {
      type: Array,
      default: null,
    },
    //是否是成员任务
    isMember: {
      type: Boolean,
      default: false,
    },
    //团队id
    teamId: {
      type: Number,
      default: null,
    },
    //成员任务时候的用户id
    userId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      searchVal: null, //搜索的任务
      teamValue: null, //选择的团队
      loading: false,
      indexData: {
        type: "", // Add Edit
        name: "",
        departmentCode: "",
      },
      tableData: [],
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      cellStyle: {
        textAlign: "center",
      },
    };
  },
  watch: {
    //成员任务的团队切换
    teamId(val, ovl) {
      if (val && val != ovl && this.isMember) {
        this.teamValue = val;
        this.handleSearch();
      }
    },
    //成员任务的成员切换
    userId(val, ovl) {
      if (val != ovl && this.isMember) {
        this.handleSearch();
      }
    },
  },

  mounted() {
    if (this.$route.query.isInfo && this.$route.query.teamValue) {
      this.teamValue = JSON.parse(this.$route.query.teamValue);
      this.getDataList();
    }
  },
  methods: {
    imgChange,
    xmodalLoaded() {
      if (
        this.$route.query.isInfo &&
        this.$route.query.teamValue &&
        this.$route.query.task
      ) {
        this.$http
          .post("/Task/GetTaskDetail.ashx", {
            teamId: JSON.parse(this.$route.query.teamValue),
            Id: JSON.parse(this.$route.query.task),
          })
          .then((resp) => {
            if (resp.res == 0) {
              this.handleEdit(resp.data);
            }
          });
      }
    },
    /**
     * 启用、禁用任务
     */
    handleEnable(val, type) {
      const data = {
        teamId: this.teamValue,
        Id: val.Id,
        operation: type,
      };
      this.$http.post("/Task/EnableTask.ashx", data).then((resp) => {
        if (resp.res == 0) {
          this.$message({
            showClose: true,
            message: `${type ? "启用" : "禁用"}任务成功！`,
            type: "success",
          });
          this.getDataList();
        }
      });
    },
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            teamId: this.teamValue,
            Ids: [row.Id],
          };
          this.comDelete(data);
        })
        .catch(() => {});
    },
    comDelete(params) {
      this.$http.post("/Task/DelTask.ashx", params).then((result) => {
        if (result.res == 0) {
          this.$message({
            showClose: true,
            message: "删除任务成功！",
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
      this.openWin("ed", row.Id, row);
    },
    // 打开窗口
    openWin(ty, code, row) {
      this.indexData = {
        type: ty === "ad" ? "Add" : `${this.isMember ? "" : "Edit"}`,
        name:
          ty === "ad"
            ? "添加任务"
            : `${this.isMember ? "任务详情" : "编辑任务"}`,
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
    handleSearch() {
      this.pageData.pageIndex = 1;
      this.getDataList();
    },
    // 获取列表
    getDataList() {
      if (!this.teamValue) {
        this.$message({
          message: "请先选择团队",
          type: "warning",
        });
        return;
      }
      const data = {
        teamId: this.teamValue,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        name: this.searchVal,
        usId: this.isMember ? this.userId : null,
        type: (this.isMember && this.userId) || !this.isMember ? 2 : 1,
      };
      this.loading = true;
      this.$http
        .post("/Task/GetTaskList.ashx", data)
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
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
.task-list {
  height: 100%;
  .screen {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .search {
      display: flex;
      flex-direction: row;
      align-items: center;
      .el-input,
      .el-select {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        margin: 0 5px;
        width: 18rem;
      }
    }
  }
  .user {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .el-avatar {
      margin-right: 5px;
    }
  }
}
</style>
