<template>
  <div class="info_right" v-loading="loading">
    <!-- 右边标题 -->
    <h3 class="info-title">
      <span>团队邀请管理</span>
      <div class="screen_left" v-if="UserMemberMType == 2">
        <el-button type="success" size="small" @click="handleInv(null, 1)"
          >全部同意</el-button
        >
        <el-button type="danger" size="small" @click="handleInv(null, -1)"
          >全部拒绝</el-button
        >
        <el-button type="info" size="small" @click="handleDel"
          >清空记录</el-button
        >
      </div>
    </h3>
    <!-- 右边搜索 -->
    <div class="r_screen">
      <div class="screen_right">
        <ul>
          <li>
            <span class="lable">时间范围</span>
            <el-date-picker
              v-model="timeScreen"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </li>
          <li>
            <span class="lable">状态</span>
            <el-select v-model="statusScreen" placeholder="请选择状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li class="number_screen">
            <!-- <span class="lable">状态</span> -->
            <el-input
              v-model="numberScreen"
              placeholder="邀请人/被邀请人"
            ></el-input>
          </li>
          <li>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="medium"
              @click="handleSearch"
              >搜索</el-button
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- 右边表格 -->
    <div class="right_table">
      <el-table :data="tableData" stripe>
        <el-table-column label="申请人" prop="UserName" align="center">
        </el-table-column>
        <el-table-column label="邀请人" prop="Inviter" align="center">
          <template slot-scope="scope">
            {{ scope.row.Inviter ? scope.row.Inviter : "无" }}
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="CreatTime"
          show-overflow-tooltip
          align="center"
          ><template slot-scope="scope">
            {{
              scope.row.CreateTime
                ? scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:ss")
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          align="center"
          v-if="UserMemberMType == 2"
        >
          <template slot-scope="scope">
            <c-btn v-if="scope.row.InvitedStatus == 0">
              <span @click="handleInv(scope.row, 1)">同意</span>
              <span @click="handleInv(scope.row, -1)">拒绝</span>
            </c-btn>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
  },
  props: {
    //团队id
    teamId: {
      type: Number,
      default: null,
    },
    //当前用户角色
    UserMemberMType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      statusOptions: [
        {
          label: "所有",
          value: null,
        },
        {
          label: "已通过",
          value: 1,
        },
        {
          label: "未通过",
          value: -1,
        },
        {
          label: "未审核",
          value: 0,
        },
      ],
      numberScreen: null, //邀请人、被邀请人筛选
      timeScreen: null, //时间筛选
      statusScreen: null, //状态筛选
      tableData: [],
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    /**
     * 清空邀请
     */
    handleDel() {
      this.$confirm("此操作将清空所有记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            Ids: "",
            teamId: this.teamId,
          };
          this.$http
            .post("/Teams/InvitedOrApply/DelSubmit.ashx", data)
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: "清空记录成功!",
                });
                this.handleSearch();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    /**
     * 同意/拒绝申请
     */
    handleInv(val, type) {
      const data = {
        Ids: val ? [val.Id] : "",
        operation: type,
        teamId: this.teamId,
      };
      this.$http
        .post("/Teams/InvitedOrApply/BatchOperation.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              showClose: true,
              message: "申请处理成功！",
              type: "success",
            });
            this.getListData();
          }
        });
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.pageData.pageIndex = 1;
      this.getListData();
    },
    /**
     * 邀请列表查询
     */
    getListData() {
      this.loading = true;
      const data = {
        name: this.numberScreen,
        teamId: this.teamId,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        status: this.statusScreen,
        sdate:
          this.timeScreen && this.timeScreen.length
            ? this.timeScreen[0].timeFormat("yyyy-MM-dd")
            : null,
        edate:
          this.timeScreen && this.timeScreen.length
            ? this.timeScreen[1].timeFormat("yyyy-MM-dd")
            : null,
      };
      this.$http
        .get("/Teams/InvitedOrApply/GetTeamApply.ashx", { params: data })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.data;
            this.pageData.totalNum = resp.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getListData();
    },
  },
};
</script>
<style lang="less" scoped>
.info_right {
  height: 100%;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  .info-title {
    padding: 0 10px;
    line-height: 4rem;
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .r_screen {
    line-height: 4.5rem;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .screen_right {
      ul {
        display: flex;
        flex-direction: row;
        li {
          margin-right: 14px;
          display: flex;
          align-items: center;
          .lable {
            margin-right: 3px;
            font-weight: bold;
            color: #606266;
          }
          /deep/.el-range-editor {
            width: 234px;
            height: 36px;
            line-height: 36px;
            .el-input__icon {
              height: auto;
            }
            .el-range-separator {
              width: 20px;
              height: auto;
            }
          }
          /deep/.el-select {
            width: 140px;
            .el-input__inner {
              border: 1px solid #e4e7ed !important;
              height: 36px;
              line-height: 36px;
            }
          }
        }
        .number_screen {
          /deep/.el-input {
            width: 150px;
            .el-input__inner {
              border: 1px solid #e4e7ed !important;
              height: 36px;
              line-height: 36px;
            }
          }
        }
      }
    }
  }
  .right_table {
    height: calc(100% - 86px);
    display: flex;
    flex-direction: column;
    .mem_count {
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .page {
      position: relative;
      padding: 0.4rem 0;
      border-top: 1px solid #ebeef5;
      // total弄到最右边
      .el-pagination__total {
        position: absolute;
        right: 0;
        height: 28px;
        line-height: 28px;
        font-size: 13px;
        display: inline-block;
      }
    }
    /deep/.el-table {
      .el-table__body-wrapper {
        height: calc(100% - 47px);
        overflow-y: auto;
      }
    }
  }
}
</style>
