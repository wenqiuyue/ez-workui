<template>
  <div class="ranking">
    <XModal
      name="ranking"
      width="1200px"
      height="700px"
      title="操作效率排名"
      showCrossBtn
      class="high-table"
      ref="ranking"
      @opened="opened"
    >
      <CContent>
        <template #search>
          <div class="screen">
            <el-select v-model="typeVal">
              <el-option label="综合排名" :value="1"> </el-option>
              <el-option label="按鼠标排名" :value="2"> </el-option>
              <el-option label="按键盘排名" :value="3"> </el-option>
            </el-select>
            <!-- <el-select v-model="speedVal" placeholder="选择速度">
              <el-option label="平均速度" :value="1"> </el-option>
              <el-option label="最高速度" :value="2"> </el-option>
              <el-option label="最低速度" :value="3"> </el-option>
            </el-select> -->
            <el-button type="primary" @click="handleRank" size="medium"
              >开始排名</el-button
            >
          </div>
        </template>
        <template #main>
          <el-table :data="tableData" v-loading="loading">
            <el-table-column align="center" label="排名">
              <template slot-scope="scope">
                <span v-if="scope.$index == 0" class="ranking">
                  <i class="hiFont hi-first" style="color: #f43f34"></i>
                </span>
                <span v-else-if="scope.$index == 1" class="ranking">
                  <i class="hiFont hi-second" style="color: #f4be5e"></i>
                </span>
                <span v-else-if="scope.$index == 2" class="ranking">
                  <i class="hiFont hi-third" style="color: #70e5dc"></i>
                </span>
                <div v-else class="flower_rank">
                  <div class="flower">
                    <span class="flower1"></span>
                    <span class="flower2"></span>
                    <span class="flower3"></span>
                    <span class="flower4"></span>
                    <span class="rank">{{ scope.$index + 1 }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="成员" width="110" align="center">
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
            <el-table-column align="center" label="鼠标点击速度">
              <template slot-scope="scope">
                {{ scope.row.MouseClickRatio }}次每分钟
              </template>
            </el-table-column>
            <el-table-column align="center" label="键盘输入速度">
              <template slot-scope="scope">
                {{ scope.row.KeysRatio }}次每分钟
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作效率"
              prop="MemberEfficiencyStatus"
            >
              <template slot-scope="scope">
                <span
                  :style="`color:${getEfficiencyColor(
                    scope.row.MemberEfficiencyStatus
                  )}`"
                  >{{
                    scope.row.MemberEfficiencyStatus
                      ? scope.row.MemberEfficiencyStatus
                      : "无"
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="BehaviorStatus"
              label="行为状态"
            >
              <template slot-scope="scope">
                {{
                  scope.row.BehaviorStatus ? scope.row.BehaviorStatus : "未知"
                }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </CContent>
    </XModal>
  </div>
</template>
<script>
import { imgChange, getEfficiencyColor } from "@/commons";
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    CContent: () => import("@/components/CContent"),
  },
  props: {
    teamId: {
      type: Number,
      default: null,
    },
    uids: {
      type: Array,
      default: () => [],
    },
    datestart: {
      type: String,
      default: null,
    },
    dateend: {
      type: String,
      default: null,
    },
    dateType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      typeVal: 1,
      speedVal: 1,
      tableData: [],
    };
  },
  methods: {
    imgChange,
    getEfficiencyColor,
    opened() {
      this.$nextTick(() => {
        this.typeVal = 1;
        this.handleRank();
      });
    },
    handleRank() {
      this.loading = true;
      let wk = null;
      //如果是按周查询，则wk获取组件传回的天数的前一天,否则wk为组件传回的日期
      if (this.dateType == 1) {
        const seldate = new Date(this.dateend);
        wk = new Date(seldate.setDate(seldate.getDate() - 1)).timeFormat(
          "yyyy-MM-dd 23:59:59"
        );
      } else if (this.dateType == 2) {
        wk = this.dateend.timeFormat("yyyy-MM-dd 23:59:59");
      }
      const data = {
        uids: this.uids.map((m) => m.UsId),
        datestart: this.datestart.timeFormat("yyyy-MM-dd 00:00:01"),
        dateend: wk,
        teamId: this.teamId,
        rankType: this.typeVal,
      };
      this.$http
        .post("/User/Work/GetEfficiencyRanking.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data;
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style lang="less" scoped>
.ranking {
  /deep/.modal {
    .ctn {
      height: calc(100% - 6rem);
    }
  }
  .screen {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 5px 0 0;
    /deep/.el-select {
      margin-right: 8px;
      width: 18rem;
      .el-input {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        .el-input__inner {
          height: 34px;
          line-height: 34px;
          font-size: 1.3rem;
        }
        .el-input__icon {
          height: 34px;
          line-height: 34px;
        }
      }
    }
  }
  .high-table {
    /deep/.ranking {
      i {
        font-size: 2.8rem;
      }
    }
    .flower_rank {
      .flower {
        width: 26px;
        margin: 0 auto;
        position: relative;
        .flower1,
        .flower2,
        .flower3,
        .flower4 {
          display: block;
          float: left;
          width: 13px;
          height: 13px;
          background: rgb(160, 207, 255);
        }

        .flower1 {
          border-radius: 50px 50px 0 50px;
        }

        .flower2 {
          border-radius: 50px 50px 50px 0;
        }

        .flower3 {
          border-radius: 50px 0 50px 50px;
        }
        .flower4 {
          border-radius: 0 50px 50px 50px;
        }
        .rank {
          text-align: center;
          width: 26px;
          height: 26px;
          line-height: 26px;
          position: absolute;
          top: 0px;
          left: 0px;
          color: #ffffff;
        }
      }
    }
    /deep/.user {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
  }
}
</style>
