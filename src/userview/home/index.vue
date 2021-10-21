<template>
  <div class="home">
    <Header title="首页" titleEnglish="Home" class="baseHeader"></Header>
    <div class="h_con">
      <div class="warp-right-top">
        <div class="info-right-title"><span>团队列表</span></div>
        <div class="right-form" v-loading="tableLoading">
          <el-table :data="tableData">
            <el-table-column
              label="团队名称"
              prop="Name"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              label="创建人"
              prop="UserName"
              show-overflow-tooltip
              align="center"
            />
            <!-- <el-table-column
                label="创建时间"
                prop="CreateTime"
                show-overflow-tooltip
                align="center"
                ><template slot-scope="scope">
                  {{ scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:mm") }}
                </template>
              </el-table-column> -->
            <el-table-column
              label="管理员"
              prop="AdminUserName"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                <div
                  v-if="
                    scope.row.AdminUserName && scope.row.AdminUserName.length
                  "
                >
                  <span
                    v-for="(admin, index) in scope.row.AdminUserName"
                    :key="index"
                    >{{ index == 0 ? admin : `、${admin}` }}</span
                  >
                </div>
                <div v-else>无</div>
              </template>
            </el-table-column>
            <el-table-column label="团队人数" prop="MemberCount" align="center"
              ><template slot-scope="scope">
                {{ scope.row.MemberCount }}人
              </template></el-table-column
            >
            <!-- <el-table-column label="购买版本" align="center"
              ><template slot-scope="scope">
                {{ scope.row.Vsersion ? scope.row.Vsersion.Name : "无" }}
              </template></el-table-column
            > -->
            <!-- <el-table-column
                label="服务器"
                align="center"
                show-overflow-tooltip
                ><template slot-scope="scope">
                  {{ scope.row.Database ? scope.row.Database : "无" }}
                </template></el-table-column
              > -->
            <el-table-column
              label="我的部门"
              prop="gName"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.gName">{{ scope.row.gName }}</span>
                <el-tag v-else size="medium" type="danger"> 暂无部门 </el-tag>
              </template></el-table-column
            >
            <el-table-column
              label="我的操作效率"
              prop="EfficiencyStatus"
              show-overflow-tooltip
              align="center"
              width="110"
            >
              <template slot-scope="scope"
                ><span
                  :style="`color:${getEfficiencyColor(
                    scope.row.EfficiencyStatus
                  )}`"
                  >{{
                    scope.row.EfficiencyStatus
                      ? scope.row.EfficiencyStatus
                      : "无"
                  }}</span
                ></template
              ></el-table-column
            >

            <el-table-column
              label="我的行为状态"
              prop="BehaviorStatus"
              show-overflow-tooltip
              align="center"
              width="110"
            >
              <template slot-scope="scope"
                ><span
                  :style="`color:${getbehaviorColor(scope.row.BehaviorStatus)}`"
                  >{{
                    scope.row.BehaviorStatus ? scope.row.BehaviorStatus : "无"
                  }}</span
                ></template
              ></el-table-column
            >
          </el-table>
          <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
        </div>
      </div>
      <div class="warp-right-bottom">
        <div class="info-right-title">
          <span>我的申请</span>
          <el-select
            v-model="selStatus"
            placeholder="结果筛选"
            @change="applyStatusChange"
          >
            <el-option label="所有结果" :value="null"> </el-option>
            <el-option
              v-for="item in $D.LIST('invited_status')"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="right-form" v-loading="applyLoading">
          <el-table :data="tableDataApply">
            <el-table-column
              label="团队名称"
              prop="TeamName"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              label="邀请人"
              prop="Inviter"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.Inviter ? scope.row.Inviter : "无" }}
              </template>
            </el-table-column>
            <el-table-column
              label="处理人"
              prop="Handler"
              show-overflow-tooltip
              align="center"
            />
            <el-table-column
              label="邀请时间"
              prop="CreateTime"
              show-overflow-tooltip
              align="center"
              ><template slot-scope="scope">
                {{
                  scope.row.CreateTime
                    ? scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:mm")
                    : "无"
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="结果"
              prop="InvitedStatus"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  size="medium"
                  :type="`${
                    $D.ITEM('invited_status', scope.row.InvitedStatus).color
                  }`"
                  >{{
                    $D.ITEM("invited_status", scope.row.InvitedStatus).name
                  }}</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
          <CPages
            v-model="pageDataApply"
            @changeEvent="handlePaginationApplyChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getEfficiencyColor, getbehaviorColor } from "@/commons";
export default {
  components: {
    Header: () => import("@/components/Header"),
    CPages: () => import("@/components/CPages"),
  },
  data() {
    return {
      selStatus: null,
      applyLoading: false,
      tableLoading: false,
      tableData: [], //团队列表
      tableDataApply: [], //申请列表
      pageData: {
        //团队分页
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      pageDataApply: {
        //团队申请分页
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
    };
  },
  mounted() {
    this.getTeamList();
    this.getApplyList();
  },
  methods: {
    getEfficiencyColor,
    getbehaviorColor,
    /**
     * 申请记录结果切换
     */
    applyStatusChange() {
      this.pageDataApply.pageIndex = 1;
      this.getApplyList();
    },
    /**
     * 获取团队列表
     */
    getTeamList() {
      this.tableLoading = true;
      const data = {
        searchText: null,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        type: 2,
      };
      this.$http
        .get("/Teams/TeamManagement.ashx", { params: data })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.data;
            this.pageData.totalNum = resp.data.total;
            //获取当前团队
            const role = this.$xStorage.getItem("user-role");
            this.nowTeam = this.tableData.filter((m) => m.Id == role.team);
          }
        })
        .finally(() => (this.tableLoading = false));
    },
    /**
     * 获取申请记录
     */
    getApplyList() {
      this.applyLoading = true;
      const data = {
        name: null,
        pageIndex: this.pageDataApply.pageIndex,
        pageSize: this.pageDataApply.pageSize,
        status: this.selStatus,
        sdate: null,
        edate: null,
      };
      this.$http
        .post("/Teams/InvitedOrApply/GetMyTeamApply.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.tableDataApply = resp.data.data;
            this.pageDataApply.totalNum = resp.data.total;
          }
        })
        .finally(() => (this.applyLoading = false));
    },
    /**
     * 团队列表分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getTeamList();
    },
    /**
     * 申请记录分页
     */
    handlePaginationApplyChange(val) {
      this.pageDataApply = val;
      this.getApplyList();
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .h_con {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .warp-right-top,
    .warp-right-bottom {
      background-color: #ffffff;
      height: 100%;
      width: 49.5%;
      border: 1px solid #e4e7ed;
    }
    .warp-right-top {
      margin-bottom: 5px;
    }
    .info-right-title {
      font-size: 1.6rem;
      border-bottom: 1px #eeeeee solid;
      color: #409eff;
      font-weight: bold;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      line-height: 3.5rem;
      padding: 0 16px 0 10px;
      /deep/.el-select {
        .el-input__inner {
          height: 28px;
          line-height: 28px;
          width: 120px;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6 !important;
          border-radius: 4px;
        }
      }
    }
    .right-form {
      padding: 0px 10px 5px;
      height: calc(100% - 3.5rem);
      .el-table {
        height: calc(100% - 33px);
        overflow-y: auto;
        &::before {
          height: 0;
        }
        /deep/td {
          padding: 8px 0;
        }
      }
    }
    /deep/.set-up {
      & > .el-form-item > .el-form-item__label {
        font-size: 1.6rem;
        color: black;
      }
      & > .el-form-item > .el-form-item__content {
        padding-top: 30px;
      }
    }
  }
}
</style>
