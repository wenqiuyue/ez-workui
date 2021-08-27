<template>
  <div class="task-list">
    <XModal
      width="70%"
      height="80%"
      name="tasklist"
      :showCrossBtn="true"
      title="任务列表"
      @opened="opened"
    >
      <div class="modal_content" v-loading="loading">
        <el-table
          :data="tableData"
          border
          style="width: 100%; margin-bottom: 5px"
          :header-cell-style="attenceHeaderStyle"
        >
          <el-table-column prop="Title" label="任务" show-overflow-tooltip>
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
          <el-table-column label="操作" width="100" align="center">
            <!-- fixed  -->
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleSel(scope.row)"
                >选择</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.pageIndex"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="pageData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.totalNum"
        >
        </el-pagination>
      </div>
    </XModal>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  props: {
    teamValue: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      pageData: {
        pageIndex: 1,
        pageSize: 20,
        totalNum: 0,
      }, //分页
      loading: false,
      tableData: [], //表格数据
      searchVal: null,
      cellStyle: {
        textAlign: "center",
      },
    };
  },
  methods: {
    imgChange,
    /**
     * 选择任务
     */
    handleSel(sel) {
      this.$emit("getTask", sel);
      this.$modal.hide("tasklist");
    },
    /**
     * 打开弹窗回调
     */
    opened() {
      this.$nextTick(() => {
        this.getAllData();
      });
    },
    /**
     * 获取全部任务数据
     */
    getAllData() {
      const data = {
        teamId: this.teamValue,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        name: this.searchVal,
        usId: null,
        type: 2,
      };
      this.loading = true;
      this.$http
        .post("/Task/GetTaskList.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.Data;
            this.pageData.totalNum = resp.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 每页条数改变
     */
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.pageData.pageIndex = 1;
      this.getAllData();
    },
    /**
     * 页数改变
     */
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getAllData();
    },

    attenceHeaderStyle() {
      return {
        color: "#909399",
      };
    },
  },
};
</script>
<style lang="less" scoped>
.task-list {
  /deep/.ctn {
    overflow-y: auto;
    padding-bottom: 10px;
  }
  .modal_content {
    padding: 0 5px;
    height: 100%;
    /deep/.el-table {
      font-size: 13px;
      height: calc(100% - 32px);
      overflow: auto;
      th,
      td {
        padding: 8px 0;
      }
      .window_key {
        cursor: pointer;
      }
      &::before {
        background-color: transparent;
      }
      .user {
        display: flex;
        flex-direction: row;
        align-items: center;
        .el-avatar {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
