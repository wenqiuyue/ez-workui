<template>
  <div class="sensitiveword-record">
    <Header
      title="敏感词记录"
      titleEnglish="Sensitive Word Record"
      class="baseHeader"
    >
    </Header>
    <div class="sensitiveword_content">
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
        <el-button
          type="primary"
          class="search_btn"
          size="medium"
          @click="handleGetData"
          >搜 索</el-button
        >
      </div>
      <div class="sensitiveword_list" v-loading="loading">
        <div class="list_card" v-if="memberData && memberData.length">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(item, index) in memberData" :key="index"
              ><div class="card">
                <div class="user">
                  <el-avatar
                    size="large"
                    :src="imgChange(item.Picture)"
                  ></el-avatar>
                  <p>{{ item.UserName }}</p>
                </div>
                <div class="rigth_word" v-if="item.Words && item.Words.length">
                  <tooltip
                    class="word_item"
                    v-for="(worditem, wordind) in item.Words"
                    :key="wordind"
                    @handleClick="handleKeyWord(worditem, item)"
                    :content="`${worditem}`"
                    :ref="`memprop-${index}-${wordind}`"
                    width="80px"
                  ></tooltip>
                </div>
                <div class="rigth_word empty" v-else>无敏感词</div>
              </div></el-col
            >
          </el-row>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.pageIndex"
            :page-sizes="[20, 30, 40, 50]"
            :page-size="pageData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.totalCount"
          >
          </el-pagination>
        </div>
        <div class="empty-wrapper" v-else>
          <img src="../../assets/img/emptyMem.png" alt="" />
          <p class="empty-taskList">暂无可查看的敏感词</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    Header: () => import("@/components/Header"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    tooltip: () => import("@/components/textTooltip"),
  },
  data() {
    return {
      ds: null, //开始时间
      de: null, //结束时间
      pageData: {
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
      }, //分页
      loading: false,
      memberData: [],
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
    imgChange,
    /**
     * 查看某个敏感词
     */
    handleKeyWord(val, item) {
      console.log(val, item);
    },
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
      this.getWordData();
    },
    /**
     * 获取敏感词数据
     */
    getWordData() {
      this.loading = true;
      const day = new Date(this.selDate).getDay();
      const dayNum = day > 0 ? day - 1 : 6;
      const date = new Date(this.selDate);
      if (this.dateType == 1) {
        this.ds = new Date(date.setDate(date.getDate() - dayNum)).timeFormat(
          "yyyy-MM-dd 00:00:01"
        );
        const s = new Date(this.ds);
        this.de = new Date(s.setDate(s.getDate() + 6)).timeFormat(
          "yyyy-MM-dd 23:59:59"
        );
      } else if (this.dateType == 2) {
        this.ds = new Date(date.getFullYear(), date.getMonth(), 1).timeFormat(
          "yyyy-MM-dd 00:00:01"
        );
        this.de = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).timeFormat("yyyy-MM-dd 23:59:59");
      } else {
        this.ds = this.DateRange[0].timeFormat("yyyy-MM-dd 00:00:01");
        this.de = this.DateRange[1].timeFormat("yyyy-MM-dd 23:59:59");
      }
      const data = {
        datestart: this.ds,
        dateend: this.de,
        UsIds: this.selMem.map((m) => m.UsId),
        page: this.pageData.pageIndex,
        pageCount: this.pageData.pageSize,
        teamId: this.teamValue,
        dt: this.dateType,
      };
      this.$http
        .post("/SensitiveWord/GetMemberSensitiveWord.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.memberData = resp.data.Data;
            this.pageData.totalCount = resp.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
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
  },
};
</script>
<style lang="less" scoped>
.sensitiveword-record {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .sensitiveword_content {
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
  }
  .sensitiveword_list {
    height: calc(100% - 55px);
    .list_card {
      height: 100%;
      .el-row {
        height: calc(100% - 42px);
        overflow-y: auto;
      }
      .el-pagination {
        padding: 5px 8px;
        background: #fff;
      }
      .card {
        background: #ffffff;
        padding: 6px 12px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: row;
        height: 88px;
        overflow-y: hidden;
        margin-bottom: 8px;
        .user {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-right: 10px;
          border-right: 1px solid #ebeef5;
          flex-shrink: 0;
          p {
            margin-top: 3px;
            font-size: 14px;
            font-weight: bold;
            color: #303133;
          }
        }
        .rigth_word {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          padding: 0 8px;
          .word_item {
            cursor: pointer;
            margin: 0 6px 3px 0;
            color: #333333;
            &:hover {
              color: #409eff;
            }
          }
          /deep/.tooltip_text {
            font-size: 13px;
          }
        }
        .empty {
          align-items: center;
          justify-content: center;
        }
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
</style>
