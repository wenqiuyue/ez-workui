<template>
  <div id="teamManagement">
    <Header title="团队管理" titleEnglish="Team Management" class="baseHeader">
      <div slot="btnGroup">
        <a v-for="item in tabList" :key="item.value">
          <span @click="tabChange(item.value)" class="el-dropdown-link">
            <label>{{ item.label }}</label>
          </span>
        </a>
      </div></Header
    >

    <!-- 列表页 -->
    <CContent
      v-if="!isInfoView && user && user.TeamCount > 0"
      v-loading="loading"
    >
      <template #search>
        <div class="screen">
          <el-select
            v-model="teamValue"
            filterable
            placeholder="请选择团队"
            @change="handleSearch"
          >
            <el-option label="所有团队" :value="2"> </el-option>
            <el-option label="我创建的团队" :value="3"> </el-option>
            <el-option label="我管理的团队" :value="4"> </el-option>
          </el-select>
          <div class="search">
            <el-input
              v-model="searchVal"
              placeholder="请输入内容"
              @keyup.enter.native="handleSearch"
            ></el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
        </div>
      </template>
      <template #main>
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
              {{
                scope.row.CreateTime
                  ? scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:mm")
                  : "--"
              }}
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
                v-if="scope.row.AdminUserName && scope.row.AdminUserName.length"
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
          <!-- <el-table-column label="服务器" align="center"
            ><template slot-scope="scope">
              {{ scope.row.Database ? scope.row.Database : "无" }}
            </template></el-table-column
          > -->
          <el-table-column label="我的部门" prop="gName" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.gName">{{ scope.row.gName }}</span>
              <el-tag v-else size="medium" type="danger"> 暂无部门</el-tag>
            </template></el-table-column
          >
          <el-table-column
            label="团队操作效率"
            prop="TeamEfficiencyStatus"
            show-overflow-tooltip
            align="center"
            width="110"
          >
            <template slot-scope="scope"
              ><span
                :style="`color:${getEfficiencyColor(
                  scope.row.TeamEfficiencyStatus
                )}`"
                >{{
                  scope.row.TeamEfficiencyStatus
                    ? scope.row.TeamEfficiencyStatus
                    : "无"
                }}</span
              ></template
            ></el-table-column
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
                  scope.row.EfficiencyStatus ? scope.row.EfficiencyStatus : "无"
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

          <el-table-column
            label="到期时间"
            prop="ExpireTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.ExpireTime
                ? scope.row.ExpireTime.timeFormat("yyyy-MM-dd")
                : "--"
            }}</template></el-table-column
          >
          <el-table-column
            label="待处理申请"
            prop="ExpireTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope"
              ><span class="apply_count">{{
                scope.row.ApplyCount
              }}</span></template
            ></el-table-column
          >
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-button
                type="success"
                size="mini"
                @click="queryTeamManagementDetail(scope.row)"
                >购买</el-button
              > -->
              <el-button
                type="primary"
                size="mini"
                @click="queryTeamManagementDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleDeleteRow(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
      </template>
    </CContent>
    <!-- 详情页 -->
    <TeamInfoUser
      v-else-if="isInfoView && user && user.TeamCount > 0"
      @viewChange="viewChange"
      :selRow="selRow"
    ></TeamInfoUser>
    <!-- 没有团队时 -->
    <div v-else class="new_user">
      <div class="img">
        <el-image
          :src="require('../../assets/img/noTeam.png')"
          fit="scale-down"
        ></el-image>
      </div>
      <p class="tips">您还没有团队，请先创建或加入一个团队</p>
      <div class="btn">
        <el-button type="primary" @click="tabChange(1)">创建团队</el-button>
        <el-button type="warning" @click="tabChange(3)">加入团队</el-button>
      </div>
    </div>

    <!-- 创建团队 -->
    <AddTeam @success="addTeamSuccess"></AddTeam>
    <!-- 加入团队 -->
    <JoinTeam @success="addTeamSuccess"></JoinTeam>
    <!-- 邀请成员 -->
    <InvitationUser></InvitationUser>
  </div>
</template>

<script>
import _ from "lodash";
import { getEfficiencyColor, getbehaviorColor } from "@/commons";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    TeamInfoUser: () => import("./teaminfo-user"),
    AddTeam: () => import("./add-team"),
    JoinTeam: () => import("./join-team"),
    InvitationUser: () => import("./invitation-user"),
  },
  data() {
    return {
      teamValue: 2, //选择的团队
      selRow: null, //选择的团队
      searchVal: null, //搜索的内容
      isInfoView: false, //是否是详情页面
      loading: false,
      tableData: [],
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      tabList: [
        {
          value: 1,
          label: "创建团队",
        },
        {
          value: 2,
          label: "邀请成员加入",
        },
        {
          value: 3,
          label: "加入团队",
        },
      ],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {
    this.getTeamList();
    console.log(this.user);
  },
  methods: {
    getEfficiencyColor,
    getbehaviorColor,
    ...mapActions(["user_setUser"]),
    /**
     * 添加团队成功
     */
    addTeamSuccess(id) {
      this.handleSearch();
      //如果是加的第一个团队，则重新存个人信息
      if (this.user.TeamCount == 0) {
        this.$http
          .get("/Management/UserManagement/GetUserDetail.ashx", {
            params: { usId: null },
          })
          .then((resp) => {
            if (resp.res == 0) {
              this.user_setUser(resp.data);
              if (this.user.TeamCount == 0) {
                this.$router.push("/teamManagement");
              }
            }
          });

        this.selRow = {
          Id: id,
        };
        this.isInfoView = true;
      }
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.pageData.pageIndex = 1;
      this.getTeamList();
    },
    /**
     * 获取团队列表
     */
    getTeamList() {
      this.loading = true;
      const data = {
        searchText: this.searchVal,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        type: this.teamValue,
      };
      this.$http
        .get("/Teams/TeamManagement.ashx", { params: data })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.data;
            this.pageData.totalNum = resp.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },

    /**
     * 查看详情
     */
    queryTeamManagementDetail(val) {
      this.selRow = val;
      this.isInfoView = true;
    },
    /**
     * 删除
     */
    handleDeleteRow(val) {
      this.$confirm("此操作将删除该团队, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/Teams/DelTeam.ashx", { ids: [val.Id], operation: -1 })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: `删除成功！`,
                });
                this.getTeamList();
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
    /**
     * 右边顶部更多操作
     * 2 邀请他人  1 创建团队  3 加入团队
     */
    tabChange(val) {
      if (val == 1) {
        this.$modal.show("addTeam");
      } else if (val == 3) {
        this.$modal.show("joinTeam");
      } else if (val == 2) {
        this.$modal.show("invitation");
      }
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getTeamList();
    },
    /**
     * 返回列表页
     */
    viewChange() {
      this.isInfoView = false;
    },
  },
};
</script>

<style lang="less" scoped>
#teamManagement {
  height: 100%;
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .screen {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .search {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .apply_count {
    font-size: 1.3srem;
    font-style: normal;
    color: #fff;
    padding: 0.1rem 1rem;
    background: linear-gradient(-55deg, #448ef5, #69a4f7);
    border-radius: 1rem 0.8rem;
  }
  .new_user {
    height: 100%;
    overflow-y: auto;
    .img {
      .el-image {
        width: 100%;
        height: 65vh;
        border-radius: 4px 4px 0 0;
      }
    }
    .tips {
      font-weight: bold;
      font-size: 16px;
      color: #606266;
      text-align: center;
    }
    .btn {
      margin-top: 32px;
      text-align: center;
      .el-button {
        width: 40%;
      }
    }
  }
}
</style>
