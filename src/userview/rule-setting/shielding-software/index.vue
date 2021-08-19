<template>
  <div class="shielding-software">
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

        <el-table-column label="软件" :show-overflow-tooltip="true" prop="Name">
        </el-table-column>
        <el-table-column label="创建时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{
              scope.row.CreatTime
                ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
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
        @changeEvent="handlePage"
      ></c-pages>
    </c-content>
    <ShieldModal
      :teamValue="teamValue"
      :selRow="selRow"
      :indexData="indexData"
      ref="shieldM"
      @eventComfirm="getDataList"
    ></ShieldModal>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    ShieldModal: () => import("./shield-modal"),
  },
  props: {
    //规则版本信息
    selRow: {
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
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },

      tableData: [
        {
          Name: "网易游戏",
          CreatTime: "2021-02-01 12:12:11",
        },
      ],
      indexData: {
        type: "", // Add Edit
        name: "",
        departmentCode: "",
      },
      cellStyle: {
        textAlign: "center",
      },
    };
  },
  methods: {
    handleChange() {
      this.pageData.pageIndex = 1;
      this.getDataList();
    },
    /**
     * 分页
     */
    handlePage(val) {
      this.pageData = val;
      this.getDataList();
    },
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此软件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: [row.Id],
            teamId: this.teamValue,
          };
          this.comDelete(params);
        })
        .catch(() => {});
    },
    comDelete(params) {
      this.$http
        .post("/ProgressGroup/DelProgressGroup.ashx", params)
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
      this.openWin("ed", row.Id, row.Name);
    },
    // 打开窗口
    openWin(ty, code, proName) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加软件" : "编辑软件",
        departmentCode: code,
        proName: proName,
        xModalName: "shieldM",
      };
      this.$modal.show("shieldM");
      this.$nextTick(() => {
        this.$refs.shieldM.changeEditState();
      });
    },
    // 获取数据
    getDataList() {
      let params = {
        name: this.searchKW,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        teamId: this.teamValue,
        configId: this.selRow.Id,
      };
      this.loading = true;
      this.$http
        .post("/ProgressGroup/QueryProgressGroupList.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
            this.loading = false;
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.shielding-software {
  height: 100%;
  .screen {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
