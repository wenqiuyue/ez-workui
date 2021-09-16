<template>
  <div id="editionManager">
    <Header
      title="版本管理"
      titleEnglish="Version  Management"
      class="baseHeader"
    />
    <CContent v-loading="loading">
      <template #search>
        <CTitle
          :TInfo="titleInfo"
          @addClick="handleAdd"
          @searchClick="searchClick"
        />
      </template>
      <template #main>
        <el-table
          :data="tableData"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <el-table-column label="版本名称" prop="Name" />

          <el-table-column label="时长" prop="Period" sortable>
            <template slot-scope="scope"> {{ scope.row.Period }}天 </template>
          </el-table-column>
          <el-table-column label="可加入人数" prop="Capacity" sortable>
            <template slot-scope="scope">
              {{ scope.row.Capacity ? scope.row.Capacity : 0 }}人
            </template>
          </el-table-column>
          <el-table-column label="存储量" prop="StorageLimits" sortable>
            <template slot-scope="scope">
              {{ scope.row.StorageLimits }}
            </template>
          </el-table-column>
          <el-table-column
            label="存储方式"
            prop="StorageLimits"
            show-overflow-tooltip
          >
            <template slot-scope="scope"> 本地存储 </template>
          </el-table-column>
          <el-table-column
            label="版本功能"
            prop="StorageLimits"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tooltip placement="right" effect="light">
                <div slot="content">多行信息<br />第二行信息</div>
                <span>版本功能</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column label="购买人数" prop="m7" sortable
            ><template slot-scope="scope">
              {{ scope.row.m7 }}人
            </template></el-table-column
          > -->
          <el-table-column label="价格" prop="Price" sortable
            ><template slot-scope="scope">
              {{ scope.row.Price }}元
            </template></el-table-column
          >
          <el-table-column label="创建时间" prop="CreatTime" sortable
            ><template slot-scope="scope">
              {{
                scope.row.CreatTime
                  ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
                  : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleView(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-if="scope.row.IsSoldOut == 1"
                type="danger"
                size="mini"
                @click="handleDel(scope.row, 0)"
                >下架</el-button
              >
              <el-button
                v-else-if="scope.row.IsSoldOut == 0"
                type="success"
                size="mini"
                @click="handleDel(scope.row, 1)"
                >上架</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @eventComfirm="handlePaginationChange" />
      </template>
    </CContent>
    <VersionModal
      :indexData="indexData"
      ref="versionModal"
      @eventComfirm="getDataList"
      :editObj="editObj"
    ></VersionModal>
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
    VersionModal: () => import("./versionModal"),
  },
  data: () => ({
    searchtext: null, //搜索的内容
    editObj: {},
    loading: false,
    cellStyle: {
      textAlign: "center",
    },
    indexData: {
      type: "", // Add Edit
      name: "",
      departmentCode: "",
    },
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
          placeholder: "请输入版本名称",
        },
      },
    },
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
    isAdd: true, //是否是添加类型
  }),
  mounted() {
    this.getDataList();
  },
  methods: {
    /**
     * 获取列表数据
     */
    getDataList() {
      this.loading = true;
      const data = {
        searchtext: this.searchtext,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
      };
      this.$http
        .get("/Management/VersionManagement/VersionList.ashx", { params: data })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.Data;
            this.pageData.totalNum = resp.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
    },
    // 打开窗口
    openWin(ty, obj) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加版本" : "编辑版本",
        xModalName: "versionModal",
      };
      if (ty == "ed") {
        this.editObj = obj;
      } else {
        this.editObj = {};
      }
      this.$modal.show("versionModal");
      this.$nextTick(() => {
        this.$refs.versionModal.changeEditState();
      });
    },
    /**
     * 添加
     */
    handleAdd() {
      this.openWin("ad");
    },
    /**
     * 分页
     */
    handlePaginationChange(a) {
      this.pageData = a;
      this.getDataList();
    },
    /**
     * 上架和下架
     */
    handleDel(row, type) {
      let name = null;
      if (type == 0) {
        name = "下架";
      } else {
        name = "上架";
      }
      this.$confirm(`此操作将${name}该版本, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/Management/VersionManagement/SoldOutVersion.ashx", {
              ids: [row.Id],
              issoldout: type,
            })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: `${name}成功!`,
                });
                this.getDataList();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消${name}`,
          });
        });
    },
    /**
     * 搜索
     */
    searchClick(val) {
      this.pageData.pageIndex = 1;
      this.searchtext = val;
      this.getDataList();
    },
    /**
     * 编辑
     */
    handleView(row) {
      this.openWin("ed", row);
    },
  },
};
</script>

<style lang="less" scoped>
#editionManager {
  height: 100%;
}
</style>
