<template>
  <div class="hourlywage-modal">
    <div id="hourlywage-tabel">
      <c-content v-loading="loading">
        <div slot="search" class="screen">
          <div class="screen_left"></div>
          <div class="screen_right">
            <el-button type="primary" @click="addClick" size="medium"
              >添加</el-button
            >
          </div>
        </div>
        <!-- 主体表格部分 -->
        <el-table
          slot="main"
          :data="tableData"
          ref="multipleTable"
          style="width: 100%"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <template slot="empty" style="font-size: 0">
            <!-- <p>暂无内容</p> -->
            <div style="height: 100%">
              <img
                src="@/assets/img/emptyData.png"
                style="display: inline-block; width: 50%; margin-top: 100px"
              />
            </div>
          </template>

          <el-table-column
            label="类型"
            :show-overflow-tooltip="true"
            prop="WageType"
          >
          </el-table-column>
          <el-table-column label="时薪" prop="Wage">
            <template slot-scope="scope">
              {{ scope.row.Wage ? scope.row.Wage : 0 }}元
            </template>
          </el-table-column>
          <el-table-column label="创建时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{
                scope.row.CreateTime
                  ? scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:mm")
                  : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- fixed  -->
            <template slot-scope="scope">
              <span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleDelt(scope.row)"
                  >删除</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <c-pages
          slot="pages"
          v-model="pageData"
          @changeEvent="handlePaginationChange"
        ></c-pages>
      </c-content>
    </div>
    <Sethourlywage
      :teamValue="teamValue"
      :indexData="indexData"
      ref="hourlywageSetM"
      @eventComfirm="getDataList"
      :selUser="selUser"
    ></Sethourlywage>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    Sethourlywage: () => import("./set-hourlywage-modal"),
    CPages: () => import("@/components/CPages"),
  },
  props: {
    selUser: {
      type: Object,
      default: null,
    },
    teamValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
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
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getDataList();
    },

    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此时薪, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            Ids: [row.Id],
            teamId: this.teamValue,
          };
          this.comDelete(params);
        })
        .catch(() => {});
    },
    comDelete(params) {
      this.$http
        .post("/Teams/MemberWage/SaveMemberWageType.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success",
            });
            this.getDataList();
          }
        });
    },

    // 新增
    addClick() {
      this.openWin("ad");
    },
    // 编辑
    handleEdit(row) {
      this.openWin("ed", row.Id, row);
    },
    // 打开窗口
    openWin(ty, code, row) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加时薪" : "编辑时薪",
        departmentCode: code,
        row: row,
        xModalName: "hourlywageSetM",
      };
      this.$modal.show("hourlywageSetM");
      this.$nextTick(() => {
        this.$refs.hourlywageSetM.changeEditState();
      });
    },
    // 获取数据
    getDataList() {
      let params = {
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        teamId: this.teamValue,
      };
      this.loading = true;
      this.$http
        .post("/Teams/MemberWage/GetMemberWageType.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.data;
            this.pageData.totalNum = result.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style lang="less" scoped>
.hourlywage-modal {
  height: 100%;
  #hourlywage-tabel {
    height: 100%;
    /deep/.cx-content {
      .title-box {
        padding-top: 0.5rem;
      }
    }

    .screen {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
