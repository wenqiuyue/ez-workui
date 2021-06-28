<template>
  <div id="teamManagement">
    <Header
      title="团队管理"
      titleEnglish="Team Management"
      class="baseHeader"
    />
    <!-- 列表页 -->
    <CContent v-if="!isInfoView" v-loading="loading">
      <template #search>
        <CTitle :TInfo="titleInfo" @searchClick="handleSearchByKeyWord" />
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
              {{
                scope.row.CreatTime
                  ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:ss")
                  : ""
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
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="queryTeamManagementDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                v-if="scope.row.Shape == 1"
                type="danger"
                size="small"
                @click="handleDeleteRow(scope.row, 0)"
                >禁用</el-button
              >
              <el-button
                v-else-if="scope.row.Shape == 0"
                type="success"
                size="small"
                @click="handleDeleteRow(scope.row, 1)"
                >启用</el-button
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
    <TeamInfo v-else @viewChange="viewChange" :selRow="selRow"></TeamInfo>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CPages: () => import("@/components/CPages"),
    TeamInfo: () => import("./teamInfo"),
  },
  data() {
    return {
      selRow: null, //选择的团队
      searchVal: null, //搜索的内容
      isInfoView: false, //是否是详情页面
      loading: false,
      tableData: [],
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
  mounted() {
    this.getTeamList();
  },
  methods: {
    /**
     * 获取团队列表
     */
    getTeamList() {
      this.loading = true;
      const data = {
        searchText: this.searchVal,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
      };
      this.$http
        .post("/Management/TeamManagement/TeamList.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.data;
            this.pageData.totalNum = resp.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
    /**搜索 */
    handleSearchByKeyWord(val) {
      this.searchVal = val;
      this.getTeamList();
    },
    /**
     * 查看详情
     */
    queryTeamManagementDetail(val) {
      this.selRow = val;
      this.isInfoView = true;
    },
    /**
     * 禁用
     */
    handleDeleteRow(val, type) {
      this.$confirm(
        `此操作将${type == 0 ? "禁用" : "启用"}该团队, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http
            .get("/Teams/DelTeam.ashx", { ids: [val.Id], operation: type })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: `${type == 0 ? "禁用" : "启用"}成功！`,
                });
                this.getTeamList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消${type == 0 ? "禁用" : "启用"}`,
          });
        });
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
}
</style>
