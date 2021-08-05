<template>
  <!-- 菜单 -->
  <div id="manager-func">
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
        row-key="Id"
        :cell-style="cellStyle"
        :header-cell-style="cellStyle"
      >
        <template slot="empty" style="font-size: 0">
          <div style="height: 100%">
            <img
              src="@/assets/img/emptyData.png"
              style="display: inline-block; width: 50%; margin-top: 100px"
            />
          </div>
        </template>
        <el-table-column
          label="行为名称"
          :show-overflow-tooltip="true"
          fixed
          prop="Behavior"
          width="200"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.Behavior">{{ scope.row.Behavior }}</div>
            <div v-else>—</div>
          </template>
        </el-table-column>
        <el-table-column label="部门" :show-overflow-tooltip="true" fixed>
          <template slot-scope="scope">
            <div
              v-if="scope.row.PreocessGroup && scope.row.PreocessGroup.length"
            >
              <span
                v-for="(item, index) in scope.row.PreocessGroup"
                :key="index"
              >
                {{ item.Name }}
                <i v-if="index !== scope.row.PreocessGroup.length - 1">，</i>
              </span>
            </div>

            <span v-else>全部</span>
          </template>
        </el-table-column>
        <el-table-column label="匹配的关键词" width="300">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              minwidth="100"
              trigger="hover"
              v-if="scope.row.Words && scope.row.Words.length"
            >
              <p v-for="(item, index) in scope.row.Words" :key="index">
                {{ item }}
              </p>
              <p slot="reference" style="cursor: pointer">
                <span
                  v-for="(name, index) in scope.row.Words"
                  :key="index"
                  v-if="index < 1"
                  >{{ name }} </span
                ><i v-if="scope.row.Words.length > 1"
                  >等{{ scope.row.Words.length }}个窗口</i
                >
              </p>
            </el-popover>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          label="匹配的类型"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.BehaviorInCheck }}
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
        @changeEvent="handlePage"
      ></c-pages>
    </c-content>
    <ActionRuleW
      :operationName="operationName"
      :activeItem="activeItem"
      ref="detail"
      :id="id"
      @update="getDataList"
      :selRow="selRow"
    ></ActionRuleW>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CPages: () => import("@/components/CPages"),
    ActionRuleW: () => import("./actionRuleW"),
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
      searchVal: null,
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
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
            placeholder: "行为名称",
          },
        },
      },
      operationName: 1,
      tableData: [],
      formParams: {
        t: "部门",
        g: [],
        pn: [
          {
            name: "",
          },
        ],
        word: [
          {
            name: "",
          },
        ],
        mk1: "工作",
        mk2: "未知",
        id: "",
      },
      activeItem: "部门",
      cellStyle: {
        textAlign: "center",
      },
      rule: {},
      id: "",
    };
  },
  watch: {},
  filters: {},
  methods: {
    // 查询
    searchClick(val) {
      this.searchVal = val;
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
    getTab(item) {
      this.activeItem = item.join();
      this.getDataList();
    },
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此行为规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post(
              "/Management/SystemBehaviorAnalyse/DelSystemBehaviorAnalyse.ashx",
              {
                Ids: [row.Id],
              }
            )
            .then((res) => {
              if (res.res == 0) {
                this.$message({
                  showClose: true,
                  message: "删除成功！",
                  type: "success",
                });
                this.getDataList();
              }
            });
        })
        .catch(() => {});
    },
    // 新增
    addClick() {
      this.operationName = 1;
      this.id = "";
      Object.assign(this.$data.formParams, this.$options.data().formParams);
      this.formParams.t = this.activeItem;
      this.$modal.show("actionRuleXmodal");
    },
    // 编辑
    handleEdit(row) {
      this.id = row.Id;
      // this.$refs.detail.id=row.Id
      this.operationName = 2;
      if (this.id) {
        this.$modal.show("actionRuleXmodal");
      }
    },
    // 获取表单数据
    getDataList() {
      this.loading = true;
      const data = {
        name: this.searchVal,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        configId: this.selRow.Id,
      };
      this.$http
        .get(
          "/Management/SystemBehaviorAnalyse/GetSystemBehaviorAnalyse.ashx",
          {
            params: data,
          }
        )
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
            this.loading = false;
          }
        });
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>

<style lang="less" scoped>
#manager-func {
  height: 100%;
  box-sizing: border-box;

  /deep/.tab_flex {
    padding-left: 0;
  }

  /deep/.add-btn-process {
    position: absolute;
    right: 0;
    top: -2px;
    padding: 8px 22px;
  }
}
</style>
