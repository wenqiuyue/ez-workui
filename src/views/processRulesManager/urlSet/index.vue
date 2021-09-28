<template>
  <div id="url-set">
    <c-content v-loading="loading">
      <!-- 搜索部分 -->
      <c-title
        slot="search"
        :TInfo="titleInfo"
        @addClick="addClick"
        @searchClick="searchClick"
      >
      </c-title>
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

        <el-table-column
          label="URL地址"
          :show-overflow-tooltip="true"
          prop="Sensitive"
        >
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
        @changeEvent="handlePage"
      ></c-pages>
    </c-content>
    <UrlModal
      :teamValue="teamValue"
      :selRow="selRow"
      :indexData="indexData"
      ref="urlM"
      @eventComfirm="getDataList"
    ></UrlModal>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    UrlModal: () => import("./urlModal"),
    CTitle: () => import("@/components/CTitle"),
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
      searchKW: "",
      // CX Title组件
      titleInfo: {
        // 控制左侧：按钮组四个
        btnShow: [
          { type: "addBtn", ishow: true },
          { type: "startBtn", ishow: false, disabled: true },
          { type: "closeBtn", ishow: false, disabled: true },
          { type: "delBtn", ishow: false, disabled: true },
        ],
        // 控制右侧：下拉细节 搜索框
        dropDown: {
          // Input组件们的：右侧共同属性
          searchInput: {
            placeholder: "请输入URL地址",
          },
        },
      },
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },

      tableData: [{}, {}],
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
  mounted() {
    // this.getDataList();
  },
  methods: {
    // 查询
    searchClick(val) {
      this.searchKW = val;
      this.pageData.pageIndex = 1;
      this.getDataList();
    },
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
      this.$confirm("此操作将删除此URL分类, 是否继续?", "提示", {
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
        .post("/SensitiveWord/DelSensitiveWord.ashx", params)
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
      this.openWin("ed", row.Id, row.Sensitive);
    },
    // 打开窗口
    openWin(ty, code, proName) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加URL地址" : "编辑URL地址",
        departmentCode: code,
        proName: proName,
        xModalName: "urlM",
      };
      this.$modal.show("urlM");
      this.$nextTick(() => {
        this.$refs.wordsM.changeEditState();
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
        .post("/SensitiveWord/QuerySensitiveWordList.ashx", params)
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
#url-set {
  height: 100%;
  box-sizing: border-box;
  /deep/.el-table__row td:last-child {
    text-align: center !important;
  }
}
</style>
