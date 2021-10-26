<template>
  <div class="apply_audit">
    <Header
      v-if="!isApply"
      title="事务审批"
      titleEnglish="Apply Audit"
      class="baseHeader"
    ></Header>
    <el-card class="custom-card audit-table" shadow="never">
      <el-row slot="header" type="flex" justify="space-between">
        <span class="header-title">事务流程审批</span>
        <div class="header-tab">
          <div v-if="!isApply">
            <span class="header-tab-text"> 团队： </span>
            <el-select
              v-model="teamValue"
              filterable
              placeholder="请选择团队"
              @change="initData"
              style="width: 180px"
            >
              <el-option
                v-for="item in teamOptions"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <span class="header-tab-text"> 审批状态： </span>
            <el-select
              size="small"
              v-model="applyStatus"
              placeholder="请选择"
              @change="initData"
              v-if="!isApply"
            >
              <el-option
                v-for="item in auditOperateOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              size="small"
              v-model="applyStatus"
              placeholder="请选择"
              @change="initData"
              v-else
            >
              <el-option
                v-for="item in auditOperateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-row>
      <!-- 审批 -->
      <el-table :data="auditData" v-if="!isApply" v-loading="tableLoading">
        <el-table-column
          label="申请人"
          class-name="table_member"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <img :src="$url + scope.row.ApplyPicture" />
            <span>{{ scope.row.ApplyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所在团队"
          class-name="table_member"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p>
              {{ scope.row.TeamName }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p>
              {{
                scope.row.CreateTime &&
                scope.row.CreateTime.timeFormat("M月d日 HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              v-show="applyStatus == 1"
              type="primary"
              @click="handleAudit(scope.row)"
              >审核</el-button
            >
            <el-button
              v-show="applyStatus == 2"
              type="primary"
              @click="handleAudit(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 申请 -->
      <el-table
        height="100%"
        :data="auditData"
        style="width: 100%"
        v-else
        v-loading="tableLoading"
      >
        <el-table-column
          label="审批结果"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p>{{ scope.row.AuditStatus | auditResultFilters }}</p>
          </template>
        </el-table-column>

        <el-table-column
          label="申请时间"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p>
              {{
                scope.row.CreateTime &&
                scope.row.CreateTime.timeFormat("M月d日 HH:mm")
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="审批时间"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p>
              {{
                scope.row.AuditTime
                  ? scope.row.AuditTime.timeFormat("M月d日 HH:mm")
                  : "--"
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="审批人"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-row type="flex" align="middle" justify="center">
              <span>{{ scope.row.AuditName }}</span>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleAudit(scope.row)"
              >查看</el-button
            >
            <!-- <el-button type="text" @click="auditCancel(scope.$index, scope.row)"
              >取消申请</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="page">
        <c-pages
          v-model="pageData"
          @changeEvent="handlePaginationChange"
        ></c-pages>
      </div>
      <AuditModal
        ref="modalForm"
        @upData="getData"
        @successHandle="$emit('successHandle')"
        :auditInfo="auditInfo"
        :isApply="applyStatus == 2 ? true : isApply"
      >
      </AuditModal>
    </el-card>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CPages: () => import("@/components/CPages"),
    AuditModal: () => import("./AuditModal"),
  },
  props: {
    isApply: {
      type: Boolean,
      default: false,
    },
    teamId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      auditInfo: null,
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
      auditData: [],
      tableLoading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      applyStatus: 1, //审核状态

      auditOperateOptions: [
        {
          value: null,
          label: "全部",
        },
        {
          value: 1,
          label: "待审核",
        },
        {
          value: 2,
          label: "通过",
        },
        {
          value: 3,
          label: "驳回",
        },
      ],
      auditOperateOptions2: [
        {
          value: 1,
          label: "待审批",
        },
        {
          value: 2,
          label: "已审批",
        },
      ],
    };
  },
  filters: {
    auditResultFilters(value) {
      switch (value) {
        case 1:
          return "待审核";
        case 2:
          return "通过";
        case 3:
          return "驳回";
        default:
          break;
      }
    },
  },
  mounted() {
    this.getData();
    if (!this.isApply) {
      this.getTeams();
    }
  },
  methods: {
    /**
     * 团队切换
     */
    initData() {
      this.pageData.pageIndex = 1;
      this.getData();
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
    //取消申请
    auditCancel(index, audit) {
      this.$confirm("确认取消申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let resp = await this.$http.post("/MGT/Process/AuditBack.ashx", {
          auditID: audit.auditID,
        });
        if (resp.res == 0) {
          this.$notify({
            type: "success",
            message: "取消成功",
          });
          this.initData();
        }
      });
    },
    handleAudit(row) {
      this.auditInfo = row;
      this.$modal.show("applyAudit");
    },
    /**
     * 获取数据
     */
    getData() {
      this.tableLoading = true;
      const data = {
        teamId: this.isApply ? this.teamId : this.teamValue,
        type: this.isApply ? 2 : 1,
        aStatus: this.applyStatus,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
      };
      this.$http
        .post("/Attendance/AnomalyAppeals/GetAnomalyAppeals.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.auditData = resp.data.Data;
            this.pageData.totalNum = resp.data.TotalCount;
          }
        })
        .finally(() => (this.tableLoading = false));
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getData();
    },
  },
};
</script>
<style lang="less" scoped>
.apply_audit {
  height: 100%;
  .custom-card {
    width: 100%;
    height: 100%;
    position: relative;
    color: #4a4a4a;

    /deep/.el-card__header {
      padding: 12px 20px;
    }
    /deep/.el-card__body {
      height: calc(100% - 53px);
      padding: 0;
    }
  }

  .audit-table {
    .el-card__header {
      .header-title {
        font-size: 20px;
        font-weight: 500;
        text-indent: 10px;
      }
      .header-tab {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .header-tab-text {
        font-size: 14px;
        margin-left: 10px;
        font-weight: bold;
      }

      .el-select {
        width: 160px;

        .el-input__inner {
          border: none;
          font-size: 14px;
          font-weight: 500;
          color: rgba(109, 109, 109, 1);
        }
      }
    }
    .page {
      padding: 3px 5px;
      border-top: 1px solid #ddd;
    }
    .el-table {
      height: calc(100% - 42px) !important;
      &::before {
        background: none;
      }

      th,
      td {
        border: none;
      }
      .table_member {
        img {
          width: 3rem;
          height: 3rem;
          display: inline-block;
          vertical-align: middle;
          border-radius: 50%;
          margin-right: 0.2rem;
        }
        span {
          vertical-align: middle;
        }
      }
    }
    .custom-card-footer {
      text-align: center;
    }
    &-footer {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  @media all and (max-width: 1024px) {
    .audit-table .el-card__header .header-title {
      display: none;
    }
    .el-row--flex.is-justify-space-between {
      justify-content: center;
    }

    .header-tab-text .hidden {
      display: none;
    }
  }
}
</style>
