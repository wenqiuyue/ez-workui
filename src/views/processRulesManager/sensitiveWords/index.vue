<template>
  <!-- 菜单 -->
  <div id="sensitiveWords">
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
          label="敏感词"
          :show-overflow-tooltip="true"
          fixed
          prop="Sensitive"
        >
        </el-table-column>
        <el-table-column
          label="创建时间"
          :show-overflow-tooltip="true"
          fixed
          prop="CreateTime"
        >
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
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >详情</el-button
            >
            <el-button type="danger" size="mini" @click="handleDelt(scope.row)"
              >删除</el-button
            >
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

    <SensitiveWordsW
      :indexData="indexData"
      ref="sensitiveWordsW"
      @eventComfirm="getDataList"
      :selRow="selRow"
    ></SensitiveWordsW>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CPages: () => import("@/components/CPages"),
    SensitiveWordsW: () => import("./sensitiveWordsW"),
  },
  props: {
    //版本信息
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    "#main";
    return {
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
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
            placeholder: "请输入敏感词名称",
          },
        },
      },

      tableData: [],
      searchKW: "",
      multipleSelection: "",
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
    this.getDataList();
  },
  methods: {
    imgChange,
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此敏感词, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            Ids: [row.Id],
          };
          this.comDelete(params);
        })
        .catch(() => {});
    },
    comDelete(params) {
      this.$http
        .post(
          "/Management/ProgressManagement/SensitiveWordManagement/DelSystemSensitiveWord.ashx",
          params
        )
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
        name: ty === "ad" ? "添加敏感词" : "编辑敏感词",
        departmentCode: code,
        proName: proName,
        xModalName: "sensitiveWordsW",
      };
      this.$modal.show("sensitiveWordsW");
      this.$nextTick(() => {
        this.$refs.sensitiveWordsW.changeEditState();
      });
    },

    // 查询
    searchClick(val) {
      this.searchKW = val;
      this.pageData.pageIndex = 1;
      this.getDataList();
    },
    // 获取列表
    getDataList() {
      let params = {
        name: this.searchKW,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        configId: this.selRow.Id,
      };
      this.loading = true;
      this.$http
        .post(
          "/Management/ProgressManagement/SensitiveWordManagement/QuerySystemSensitiveWordList.ashx",
          params
        )
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
            this.loading = false;
          }
        });
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getDataList();
    },
  },
};
</script>

<style lang="less" scoped>
#sensitiveWords {
  height: 100%;
  box-sizing: border-box;
  /deep/.el-table__row td:last-child {
    text-align: center !important;
  }
}
</style>
