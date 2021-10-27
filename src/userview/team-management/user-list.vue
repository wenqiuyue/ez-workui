<template>
  <div class="user-list" v-loading="loading">
    <el-table :data="tableData" stripe>
      <el-table-column label="成员姓名" prop="Name" align="center" />
      <el-table-column
        label="加入时间"
        prop="CreatTime"
        show-overflow-tooltip
        align="center"
        ><template slot-scope="scope">
          {{
            scope.row.CreatTime
              ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="MType" align="center"
        ><template slot-scope="scope">
          {{ scope.row.MType == 1 ? "成员" : "管理员" }}
        </template></el-table-column
      >
      <!-- <el-table-column label="用户状态" prop="Shape" align="center"
        ><template slot-scope="scope">
          {{ scope.row.Shape | getShape }}
        </template></el-table-column
      > -->
      <el-table-column label="部门" prop="Shape" align="center"
        ><template slot-scope="scope">
          {{ scope.row.ProgressGroupName ? scope.row.ProgressGroupName : "无" }}
        </template></el-table-column
      >
      <el-table-column label="进程状态" prop="IsGNameStatus" align="center"
        ><template slot-scope="scope">
          {{ scope.row.IsGNameStatus ? "可用" : "不可用" }}
        </template></el-table-column
      >
      <el-table-column label="可查看成员" prop="MemberCount" align="center"
        ><template slot-scope="scope">
          <span v-if="scope.row.MType == 2 && !scope.row.VisibleUser.length"
            >全部成员</span
          >
          <div v-else>
            <el-popover
              trigger="hover"
              placement="top"
              width="350"
              v-if="scope.row.VisibleUser.length"
            >
              <div slot="reference">
                <p class="mem_count">{{ scope.row.VisibleUser.length }}人</p>
              </div>
              <ul class="member-style">
                <li v-for="(item, index) in scope.row.VisibleUser" :key="index">
                  <img :src="imgChange(item.Picture)" alt="" />
                  <span>{{ item.Name }}</span>
                  <i
                    :style="
                      (index + 1) % 3 == 0 ||
                      index == scope.row.VisibleUser.length - 1
                        ? 'display:none'
                        : ''
                    "
                  ></i>
                </li>
              </ul>
            </el-popover>
            <span v-else>{{ scope.row.VisibleUser.length }}人</span>
          </div>
        </template></el-table-column
      >
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleUserDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            type="success"
            size="small"
            @click="handleHourlyWage(scope.row)"
            v-if="userMemberMType != 1"
            >设置时薪</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.row)"
            v-if="userMemberMType != 1"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <UserInfo
      :selUser="selUser"
      :teamId="selRow ? selRow.Id : null"
      @success="$emit('loadData')"
      :userMemberMType="userMemberMType"
    ></UserInfo>
    <UserWage
      :selUser="selUser"
      :teamValue="selRow ? selRow.Id : null"
    ></UserWage>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    UserInfo: () => import("./user-info"),
    UserWage: () => import("./user-wage"),
  },
  props: {
    //团队详情
    infoData: {
      type: Object,
      default: null,
    },
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selUser: null,
      loading: false,
      tableData: [],
      userMemberMType: null,
    };
  },
  watch: {
    infoData(val, oval) {
      if (val != oval) {
        this.tableData = this.infoData.Membersdata;
        this.userMemberMType = this.infoData.Teamdata.UserMemberMType;
      }
    },
  },
  mounted() {},
  filters: {
    getShape(val) {
      if (val == 1) {
        return "正常";
      } else if (val == 0) {
        return "禁用";
      } else {
        return "删除";
      }
    },
  },
  methods: {
    imgChange,
    /**
     * 成员设置时薪
     */
    handleHourlyWage(val) {
      this.selUser = val;
      this.$modal.show("userWageM");
    },
    /**
     * 删除成员
     */
    handleDel(row) {
      this.$confirm("此操作将删除该成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            ids: [row.Id],
            teamId: this.selRow.Id,
          };
          this.$http.post("/Teams/DelMembers.ashx", data).then((resp) => {
            if (resp.res == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.$emit("loadData");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // /**
    //  * 获取团队成员列表
    //  */
    // getTeamList() {
    //   this.loading = true;
    //   this.$http
    //     .get("/Teams/TeamManagementDetail.ashx", {
    //       params: { teamId: this.selRow.Id },
    //     })
    //     .then((resp) => {
    //       if (resp.res == 0) {
    //         this.tableData = resp.data.Membersdata;
    //         this.userMemberMType = resp.data.Teamdata.UserMemberMType;
    //       }
    //     })
    //     .finally(() => {
    //       this.loading = false;
    //     });
    // },
    /**
     * 查看成员详情
     */
    handleUserDetail(val) {
      this.selUser = val;
      this.$modal.show("userInfo");
    },
  },
};
</script>
<style lang="less" scoped>
.user-list {
  // margin-top: 10px;
  height: calc(100% - 2px);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  .mem_count {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .page {
    position: relative;
    padding: 1rem 0 0.4rem;
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
.member-style {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  li {
    display: flex;
    width: 33%;
    margin-bottom: 1rem;
    // margin-right: 1rem;
    align-items: center;
    // justify-content: space-between;
    position: relative;

    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    span {
      color: #333;
      margin-right: 2rem;
      max-width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i {
      width: 1px;
      height: 70%;
      background: #ddd;
      position: absolute;
      right: 20%;
      top: 3px;
    }
  }
}
</style>
