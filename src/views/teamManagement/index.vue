<template>
  <div id="teamManagement" v-loading="loading">
    <Header
      title="团队管理"
      titleEnglish="Team Management"
      class="baseHeader"
    />
    <CContent>
      <template #search>
        <CTitle :TInfo="titleInfo" @addClick="handleAdd" />
      </template>
      <template #main>
        <el-table :data="tableData" stripe>
          <el-table-column
            label="团队ID"
            prop="Id"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="公司ID"
            prop="CompanyId"
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
            label="公司名称"
            prop="CompanyName"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="版本名称"
            prop="VersionName"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="版本费用"
            prop="VersionPrice"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="版本期限(天)"
            prop="VersionPeriod"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="团队名称"
            prop="Name"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="团队描述"
            prop="Describe"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="所选版本过期时间"
            prop="ExpireTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{ row: { ExpireTime } }">{{
              typeof ExpireTime === "string"
                ? ExpireTime.timeFormat("yyyy-MM-dd HH:s")
                : null
            }}</template>
          </el-table-column>
          <el-table-column
            label="团队创建时间"
            prop="CreatTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{ row: { CreatTime } }">{{
              typeof CreatTime === "string"
                ? CreatTime.timeFormat("yyyy-MM-dd HH:s")
                : null
            }}</template></el-table-column
          >
          <el-table-column
            label="是否删除"
            prop="Shape"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{ row: { Shape } }">{{
              Shape | getShape
            }}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope)"
                >查看</el-button
              >
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @eventComfirm="handlePaginationChange" />
      </template>
    </CContent>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
  },
  data: () => ({
    loading: false,
    tableData: [],
    titleInfo: {
      btnShow: [
        { type: "addBtn", ishow: true },
        { type: "startBtn", ishow: false, disabled: true },
        { type: "closeBtn", ishow: false, disabled: true },
        { type: "delBtn", ishow: false, disabled: true },
      ],
      dropDown: {
        searchInput: {
          placeholder: "请输入团队名称",
        },
      },
    },
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
  }),
  methods: {
    async queryData() {
      this.loading = true;
      try {
        const { res, data: { data, total } = {} } = await this.$http.get(
          `/Teams/TeamManagement.ashx${this.queryParams}`
        );
        if (res !== 0) return;

        console.log(data);
        this.tableData = data;
      } catch {}
      this.loading = false;
    },
    async handleAdd() {
      console.log("handleAdd");
    },
    async handlePaginationChange(...a) {
      console.log(a);
    },
    handleView(...a) {
      console.log(a);
    },
  },
  computed: {
    queryParams() {
      const {
        query: { searchText, pageIndex, pageSize },
      } = this.$route;
      return `?searchText=${searchText ?? ""}&pageIndex=${
        pageIndex ?? 1
      }&pageSize=${pageSize ?? 10}`;
    },
  },
  watch: {
    queryParams: {
      deep: true,
      immediate: true,
      async handler(value, oldValue) {
        await this.queryData();
      },
    },
  },
  filters: {
    getShape(value) {
      switch (value) {
        case 1:
          return "正常";
        case 0:
          return "禁用";
        case -1:
          return "删除";
        default:
          return "未知";
      }
    },
  },
};
</script>

<style lang="less" scoped>
#teamManagement {
  height: 100%;
}
</style>