<template>
  <div id="teamManagement" v-loading="loading">
    <Header title="团队管理" titleEnglish="Team Management" class="baseHeader">
      <div slot="btnGroup">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>邀请他人进入</el-dropdown-item>
            <el-dropdown-item>创建团队</el-dropdown-item>
            <el-dropdown-item>加入团队</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div></Header
    >
    <!-- 列表页 -->
    <CContent v-if="!isInfoView">
      <template #search>
        <CTitle
          :TInfo="titleInfo"
          @addClick="handleAdd"
          @searchClick="handleSearchByKeyWord"
        />
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
            prop="CreatTime"
            show-overflow-tooltip
            align="center"
            ><template slot-scope="scope">
              {{ scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:ss") }}
            </template>
          </el-table-column>
          <el-table-column
            label="管理员"
            prop="AdminUserName"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column label="团队人数" prop="MemberCount" align="center"
            ><template slot-scope="scope">
              {{ scope.row.MemberCount }}人
            </template></el-table-column
          >
          <el-table-column label="购买版本" align="center"
            ><template slot-scope="scope">
              {{ scope.row.Vsersion.Name }}人
            </template></el-table-column
          >
          <el-table-column
            label="到期时间"
            prop="ExpireTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.ExpireTime.timeFormat("yyyy-MM-dd HH:s")
            }}</template></el-table-column
          >
          <el-table-column label="服务器信息" align="center"
            ><template slot-scope="scope">
              {{ scope.row.Vsersion.Name }}人
            </template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <c-btn>
                <span @click="queryTeamManagementDetail(scope.row)">详情</span>
                <span @click="handleDeleteRow(scope.row)">禁用</span>
              </c-btn>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
      </template>
    </CContent>
    <!-- 详情页 -->
    <TeamInfoUser v-else @viewChange="viewChange"></TeamInfoUser>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
    TeamInfoUser: () => import("./teamInfoUser"),
  },
  data() {
    return {
      isInfoView: false, //是否是详情页面
      loading: false,
      tableData: [
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
      ],
      titleInfo: {
        btnShow: [
          { type: "addBtn", ishow: false, disabled: true },
          { type: "startBtn", ishow: false, disabled: true },
          { type: "closeBtn", ishow: false, disabled: true },
          { type: "delBtn", ishow: false, disabled: true },
        ],
        dropDown: {
          searchInput: {
            placeholder: "请输入团队名称",
            value: this.$route.query.searchText ?? null,
          },
        },
      },
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
    };
  },
  created() {},
  methods: {
    /** 添加*/
    handleAdd() {},
    /**搜索 */
    handleSearchByKeyWord() {},
    /**
     * 查看详情
     */
    queryTeamManagementDetail(val) {
      this.isInfoView = true;
    },
    /**
     * 禁用
     */
    handleDeleteRow(val) {
      this.$confirm("此操作将禁用该团队, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "禁用成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消禁用",
          });
        });
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {},
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
}
</style>
