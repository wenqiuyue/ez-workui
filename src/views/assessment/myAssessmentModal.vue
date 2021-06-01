<template>
  <XModal
    name="myAssessmentModal"
    title="绩效记录"
    :showCrossBtn="true"
    width="95%"
    height="90%"
    @beforeOpen="init"
  >
    <c-content>
      <!-- 选项卡 搜索部分 -->
      <div slot="search" class="search">
        <div class="search-item">
          <span>时间</span>
          <el-date-picker
            v-model="value1"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchDate"
          ></el-date-picker>
        </div>
        <!-- <div class="search-item" v-show="tabType != 2">
        <span>人员</span>-->
        <!-- <h6>筛选人员</h6> -->
        <!-- <SM :showLength="9" @Confirm="getMS" size="small" :showActiveImg="false">
            <template slot="button">
              <span class="btn-custom">
                <i class="el-icon-plus"></i>
              </span>
            </template>
          </SM>
        </div>-->
      </div>
      <!-- 主体表格部分 slot="main" -->
      <el-table slot="main" border class="table" :data="tableData" v-loading="loading">
        <template slot="empty" style="font-size: 0;">
          <div style="height:100%;">
            <img
              src="@/assets/img/emptyData.png"
              style="display: inline-block;width:50%;margin-top:100px;"
            />
          </div>
        </template>
        <el-table-column
          v-if="(tabType != 2) & (tabType != 3)"
          min-width="70"
          label="KPI编号"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.Number }}</template>
        </el-table-column>
        <el-table-column
          v-if="(tabType != 2) & (tabType != 3)"
          min-width="110"
          label="KPI名称"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.Name }}</template>
        </el-table-column>
        <el-table-column v-else min-width="110" label="投诉类型" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.TypeName }}</template>
        </el-table-column>
        <el-table-column min-width="100" label="描述" show-overflow-tooltip prop="Describe">
          <template slot-scope="scope">{{ scope.row.Describe?scope.row.Describe:'无' }}</template>
        </el-table-column>
        <el-table-column min-width="100" :label="UserName" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="tabType == 0">{{ scope.row.AssessedName }}</p>
            <p v-else-if="tabType == 2">{{ scope.row.ComplaintsOr }}</p>
            <p v-else>{{ scope.row.BeAssessedName }}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="tabType == 0" min-width="60" label="类型" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.TypeName }}</template>
        </el-table-column>
        <el-table-column
          v-if="(tabType != 2) & (tabType != 3)"
          min-width="80"
          label="结果"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <p>{{ scope.row.AddName | RESULT(scope.row.Score) }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Times.timeFormat('yyyy-MM-dd') }}</template>
        </el-table-column>
        <el-table-column min-width="80" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.StatusName }}</template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <c-pages slot="pages" v-model="pageData" @childEvent="getData"></c-pages>
    </c-content>
  </XModal>
</template>

<script>
export default {
  props: {
    usid: {
      type: Number,
      default: null,
    },
  },
  components: {
    XModal: () => import("@/components/XModal"),
    CContent: () => import("@/manager/com/CContent"),
    CPages: () => import("@/manager/com/CPages"),
  },
  data() {
    return {
      value1: null,
      //请求数据
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
        STime: null,
        ETime: null,
        UsId: null,
      },
      tableData: [],
      loading: false,
      tabType: 0,
    };
  },
  filters: {
    RESULT(statu, score) {
      switch (statu) {
        case "加分":
          return `加${score}分`;
          break;
        case "减分":
          return `减${score}分`;
          break;
        case "奖励":
          return `奖励${score}元`;
          break;
        case "罚款":
          return `罚款${score}元`;
          break;
        default:
          return "未知";
      }
    },
  },
  computed: {
    UserName() {
      if (this.tabType == 0) {
        return "考核人/投诉人";
      } else if (this.tabType == 1) {
        return "被考核人";
      } else if (this.tabType == 2) {
        return "投诉人";
      } else if (this.tabType == 3) {
        return "被投诉人";
      }
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.value1 = null;
        this.pageData.STime = this.pageData.ETime = null;
        this.pageData.pageIndex = 1;
        this.getData();
      });
    },
    //时间段
    searchDate() {
      if (this.value1) {
        this.pageData.STime = this.value1[0];
        this.pageData.ETime = this.value1[1];
      } else {
        this.pageData.STime = this.pageData.ETime = null;
      }
      this.getData();
    },
    getData() {
      this.loading = true;
      let params = {
        PageIndex: this.pageData.pageIndex,
        PageSize: this.pageData.pageSize,
        STime: this.pageData.STime,
        ETime: this.pageData.ETime,
        MyId: this.usid,
      };
      this.$http
        .post("/Work/Performance/queryMyKPIAssess.ashx#", params)
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.Data;
            this.pageData.totalNum = resp.data.TotalCount;
            this.loading = false;
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.search {
  background-color: #ffffff;
  padding: 0 1rem;
  .search-item + .search-item {
    border-top: 1px solid #eee;
  }
  .search-item {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    & > span {
      color: #333;
      font-size: 1.4rem;
      font-weight: bold;
      margin-right: 1.5rem;
      white-space: nowrap;
    }
    .el-date-editor {
      border-color: #f6f6f6 !important;
    }
    .mem-add {
      display: none;
    }
    .location {
      align-items: center;
    }
    .btn-custom {
      width: 35px;
      height: 20px;
      display: block;
      border: 1px solid #ccc;
      border-radius: 0.6rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      i {
        font-size: 1.4rem;
        color: #6d6d6d;
      }
      &:hover {
        border-color: #409eff;
      }
    }
  }
}
</style>
