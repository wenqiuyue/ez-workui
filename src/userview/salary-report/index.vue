<template>
  <div class="salary-report">
    <Header title="薪资报表" titleEnglish="Salary Report" class="baseHeader">
    </Header>
    <div class="salary_content">
      <div class="select-conditions">
        <div class="sel_inline">
          <div class="sel">
            <span>日期</span>
            <div class="sel-date">
              <el-select v-model="dateType">
                <el-option
                  v-for="(item, index) in $D.LIST('member_overview_date_type')"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                ></el-option>
              </el-select>
              <el-date-picker
                v-model="selDate"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                value-format="yyyy-MM-dd"
                v-show="dateType == 1"
                :clearable="false"
                :picker-options="{ firstDayOfWeek: 1 }"
                style="width: 18rem"
              >
              </el-date-picker>
              <el-date-picker
                v-model="selDate"
                type="month"
                format="yyyy 年 MM 月"
                placeholder="选择月"
                value-format="yyyy-MM-dd"
                :clearable="false"
                :picker-options="pickOption"
                v-show="dateType == 2"
                style="width: 18rem"
              >
              </el-date-picker>
              <el-date-picker
                v-model="DateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-show="dateType == 3"
                style="width: 26rem"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="sel">
            <span>团队</span>
            <div class="team">
              <el-select
                v-model="teamValue"
                filterable
                placeholder="请选择团队"
                @change="handleTeamChange"
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
          </div>
          <div class="sel" v-if="teamValue" style="margin-left: 8px">
            <span>员工</span>
            <selMember
              :teamId="teamValue"
              size="small"
              @Confirm="getSelMember"
              :selRange="1"
              :arrays="selMem"
              :showLength="5"
            >
              <span slot="button" class="btn-custom">
                <i class="el-icon-plus"></i>
              </span>
            </selMember>
          </div>
        </div>
        <el-button type="primary" class="search_btn" size="medium"
          >搜 索</el-button
        >
      </div>
      <div class="salary_list" v-loading="loading">
        <div class="salary_table" v-if="tableData && tableData.length">
          <el-table
            :data="tableData"
            border
            style="width: 100%; margin-bottom: 5px"
            row-key="id"
            :header-cell-style="attenceHeaderStyle"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="name" label="成员" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column prop="hourlyWage" label="时薪" align="center">
              <template slot-scope="scope">
                {{ scope.row.hourlyWage }}元
              </template>
            </el-table-column>
            <el-table-column prop="salary" label="薪资" align="center">
              <template slot-scope="scope"> {{ scope.row.salary }}元 </template>
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
        <div class="empty-wrapper" v-else>
          <img src="../../assets/img/emptyMem.png" alt="" />
          <p class="empty-taskList">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  data() {
    return {
      tableData: [
        {
          id: 2,
          name: "王小虎",
          hourlyWage: 220,
          salary: 320,
          children: [
            {
              id: 29,
              type: "加班时薪",
              hourlyWage: 120,
              salary: 300,
            },
            {
              id: 30,
              type: "普通时薪",
              hourlyWage: 100,
              salary: 20,
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          hourlyWage: 220,
          salary: 320,
          children: [
            {
              id: 31,
              type: "加班时薪",
              hourlyWage: 120,
              salary: 300,
            },
            {
              id: 32,
              type: "普通时薪",
              hourlyWage: 100,
              salary: 20,
            },
          ],
        },
      ],
      pageData: {
        pageIndex: 1,
        pageSize: 15,
        totalNum: 0,
      }, //分页
      loading: false,
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
      selMem: [], //选择的成员
      dateType: 1, //时间查询类型
      selDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      ),
      pickOption: this.pickDate(),
      DateRange: [
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() - 7
        ),
        new Date(),
      ],
    };
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    /**
     * 获取列表数据
     */
    handleGetData() {
      if (!this.teamValue) {
        this.$message({
          message: "请先选择团队",
          type: "warning",
        });
        return;
      }
      this.pageData.pageIndex = 1;
      this.memberData = [];
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    pickDate() {
      let _this = this;
      return {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
      };
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
    /**
     * 选择成员
     */
    getSelMember(arr) {
      this.selMem = arr;
    },
    /**
     * 团队切换
     */
    handleTeamChange() {
      this.selMem = [];
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
.salary-report {
  height: 100%;
  .salary_content {
    height: 100%;
    .select-conditions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      background: #ffffff;
      padding: 5px 14px 0 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 5%);
      .search_btn {
      }
      .sel_inline {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .sel {
        display: flex;
        border-bottom: 1px solid #eee;
        align-items: center;
        height: 5rem;
        box-sizing: border-box;
        margin-right: 1rem;
        // height: 5rem;padding-left: 1rem;

        span {
          color: #333;
          font-size: 1.4rem;
          font-weight: bold;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        /deep/#mem-public {
          border: none !important;
          .location,
          .mem-imgs {
            flex-wrap: nowrap;
          }
          .mem-add {
            display: none;
          }

          .c_button {
            display: flex;
            align-items: center;
            // margin-left: 1rem;
          }

          .avatar_small {
            margin-left: 0;
            img {
              width: 2.3rem;
              height: 2.3rem;
            }
          }
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
          // margin-left: 1rem;

          i {
            font-size: 1.4rem;
            color: #6d6d6d;
          }

          &:hover {
            border-color: #409eff;

            i {
              color: #409eff;
            }
          }
        }
        .btn {
          margin-left: 2rem;
        }
        .sel-date {
          display: flex;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          /deep/.el-select {
            width: 13rem;

            /deep/.el-input__inner {
              border-radius: 4px 0 0 4px;
            }
          }

          /deep/.el-date-editor {
            /deep/.el-input__inner {
              border-radius: 0px 4px 4px 0px;
            }
          }
          /deep/ .el-date-editor--daterange {
            background-color: #f8f8f8;
            border: none;
            .el-range-input {
              background-color: #f8f8f8;
            }
            .el-range-separator {
              width: 15%;
            }
          }
        }
        .team {
          .el-select {
            border: 1px solid #dcdfe6;
            border-radius: 4px;
          }
        }
      }
    }
    .salary_list {
      height: calc(100% - 55px);
      .salary_table {
        height: 100%;
        /deep/.el-table {
          font-size: 13px;
          height: calc(100% - 52px);
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
        }
        .el-pagination {
          padding: 5px 8px;
          background: #fff;
        }
      }
      .empty-wrapper {
        background: #fff;
        height: 100%;

        img {
          display: block;
          margin: 5rem auto;
          margin-top: 0;
          padding-top: 5rem;
          width: 245px;
          height: 245px;
        }

        p {
          color: #6d6d6d;
          font-size: 1.6rem;
          text-align: center;
        }
      }
    }
  }
}
</style>
