<template>
  <!-- 菜单 -->
  <div id="manager-label">
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
          min-width="100"
          label="进程组名称"
          :show-overflow-tooltip="true"
          fixed
          prop="Name"
        >
        </el-table-column>
        <el-table-column
          min-width="150"
          label="成员"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              width="350"
              v-if="scope.row.UserData.length"
            >
              <div slot="reference" class="name-wrapper">
                <p style="cursor: pointer">{{ scope.row.UserData.length }}人</p>
              </div>
              <ul class="member-style">
                <li v-for="(item, index) in scope.row.UserData" :key="index">
                  <img :src="$url + item.Picture" alt="" /><span>{{
                    item.Name
                  }}</span>
                  <i
                    :style="
                      (index + 1) % 3 == 0 ||
                      index == scope.row.UserData.length - 1
                        ? 'display:none'
                        : ''
                    "
                  ></i>
                </li>
              </ul>
            </el-popover>
            <span v-else>{{ scope.row.UserData.length }}人</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
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

    <LabelW
      :indexData="indexData"
      ref="proGroupWindow"
      @eventComfirm="getDataList"
    ></LabelW>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CPages: () => import("@/components/CPages"),
    LabelW: () => import("./proGroupW"),
  },
  data() {
    "#main";
    return {
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 100,
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
            placeholder: "请输入进程组名称",
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
  created() {
    this.getDataList();
  },
  methods: {
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此进程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: [row.ID],
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
      this.openWin("ed", row.ID, row.Name);
    },
    // 打开窗口
    openWin(ty, code, proName) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加进程组" : "编辑进程组",
        departmentCode: code,
        proName: proName,
        xModalName: "proGroupWindow",
      };
      this.$modal.show("proGroupWindow");
      this.$nextTick(() => {
        this.$refs.proGroupWindow.changeEditState();
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
      };
      this.loading = true;
      this.$http
        .get("/Management/ProgressManagement/ProgressGroupAllList.ashx", {
          params: params,
        })
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
    },
  },
};
</script>

<style lang="less" scoped>
.member-style {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  li {
    display: flex;
    width: 33%;
    margin-bottom: 1rem;
    // margin-right: 1rem;
    align-items: center;
    // justify-content: space-between;
    position: relative;

    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    span {
      color: #333;
      margin-right: 2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    i {
      width: 1px;
      height: 70%;
      background: #ddd;
      position: absolute;
      right: 20%;
      top: 3px;
    }
  }
}
#manager-label {
  height: 100%;
  box-sizing: border-box;
}
</style>
