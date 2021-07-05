<template>
  <div id="teamManagement">
    <Header title="团队管理" titleEnglish="Team Management" class="baseHeader">
      <div slot="btnGroup">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">邀请他人进入</el-dropdown-item>
            <el-dropdown-item command="2">创建团队</el-dropdown-item>
            <el-dropdown-item command="3">加入团队</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div></Header
    >
    <!-- 列表页 -->
    <CContent v-if="!isInfoView" v-loading="loading">
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
          <el-table-column
            label="创建时间"
            prop="CreateTime"
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
          <el-table-column label="购买版本" align="center"
            ><template slot-scope="scope">
              {{ scope.row.Vsersion ? scope.row.Vsersion.Name : "无" }}
            </template></el-table-column
          >
          <el-table-column label="服务器" align="center"
            ><template slot-scope="scope">
              {{ scope.row.Vsersion ? scope.row.Vsersion.Capacity : "无" }}
            </template></el-table-column
          >
          <el-table-column
            label="到期时间"
            prop="ExpireTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.ExpireTime
                ? scope.row.ExpireTime.timeFormat("yyyy-MM-dd HH:ss")
                : "--"
            }}</template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="操作"
            width="210"
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
      v-else
      @viewChange="viewChange"
      :selRow="selRow"
    ></TeamInfoUser>
    <!-- 创建团队 -->
    <AddTeam @success="handleSearch"></AddTeam>
    <!-- 加入团队 -->
    <JoinTeam></JoinTeam>
    <!-- 邀请成员 -->
    <InvitationUser></InvitationUser>
  </div>
</template>

<script>
import _ from "lodash";

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
    };
  },
  mounted() {
    this.getTeamList();
  },
  methods: {
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
     * 1 邀请他人  2 创建团队  3 加入团队
     */
    handleCommand(val) {
      if (val == 2) {
        this.$modal.show("addTeam");
      } else if (val == 3) {
        this.$modal.show("joinTeam");
      } else {
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
}
</style>
