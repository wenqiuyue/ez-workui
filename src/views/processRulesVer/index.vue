<template>
  <div id="processRulesVer">
    <div class="ver" v-if="!isInfoView">
      <Header
        title="进程规则管理"
        titleEnglish="Process Rules Management"
        class="baseHeader"
      >
      </Header>
      <c-content v-loading="loading">
        <!-- 搜索部分 -->
        <c-title
          slot="search"
          :TInfo="titleInfo"
          @addClick="addClick"
          @searchClick="searchClick"
          :showSearch="false"
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
            label="名称"
            :show-overflow-tooltip="true"
            prop="ConfigName"
          >
          </el-table-column>
          <el-table-column
            label="是否为默认"
            :show-overflow-tooltip="true"
            prop="IsSystem"
          >
            <template slot-scope="scope">{{
              scope.row.IsStart ? "是" : "否"
            }}</template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            :show-overflow-tooltip="true"
            prop="name"
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
              <el-button
                type="success"
                size="mini"
                @click="handleInfo(scope.row)"
                >详情</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button type="danger" size="mini" @click="handleDel(scope.row)"
                >删除</el-button
              >
              <el-button
                type="start"
                size="mini"
                @click="handleStart(scope.row)"
                v-if="!scope.row.IsStart"
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </c-content>
    </div>
    <processRulesManager
      v-else
      @handleVerList="handleVerList"
      :selRow="selRow"
    ></processRulesManager>
    <VerModal
      :indexData="indexData"
      ref="VerModal"
      @eventComfirm="getDataList"
    ></VerModal>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CTitle: () => import("@/components/CTitle"),
    CContent: () => import("@/components/CContent"),
    processRulesManager: () => import("../processRulesManager"),
    VerModal: () => import("./verModal"),
  },
  data: () => ({
    selRow: null,
    isInfoView: false,
    loading: false,
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
          placeholder: "",
        },
      },
    },

    tableData: [],
    searchKW: "",
    indexData: {
      type: "", // Add Edit
      name: "",
      departmentCode: "",
    },
    cellStyle: {
      textAlign: "center",
    },
  }),
  created() {
    this.getDataList();
  },
  methods: {
    /**
     * 启用配置组
     */
    handleStart(val) {
      this.$http
        .post("/Management/ConfigGroupManagement/UpdateSystemStart.ashx", {
          tcId: val.Id,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              message: resp.msg,
              type: "success",
            });
            this.getDataList();
          }
        });
    },
    /**
     * 返回到版本列表
     */
    handleVerList() {
      this.isInfoView = false;
    },
    /**
     * 详情
     */
    handleInfo(row) {
      this.selRow = row;
      this.isInfoView = true;
    },
    // 删除某一行
    handleDel(row) {
      this.$confirm("此操作将删除此版本, 是否继续?", "提示", {
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
          "/Management/ConfigGroupManagement/DelSystemConfigGroup.ashx",
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
      this.openWin("ed", row.Id, row.ConfigName);
    },
    // 打开窗口
    openWin(ty, code, proName) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加进程版本" : "编辑进程版本",
        departmentCode: code,
        proName: proName,
        xModalName: "verModal",
      };
      this.$modal.show("verModal");
      this.$nextTick(() => {
        this.$refs.VerModal.changeEditState();
      });
    },

    // 查询
    searchClick(val) {
      this.searchKW = val;
      this.getDataList();
    },
    // 获取列表
    getDataList() {
      this.loading = true;
      this.$http
        .get("/Management/ConfigGroupManagement/SystemConfigGroupList.ashx")
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data;
            this.loading = false;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
#processRulesVer {
  height: 100%;
  .ver {
    height: 100%;
  }
  .el-button--start {
    color: #fff;
    background-color: #02ce90;
    border-color: #02ce90;
    &:hover {
      background-color: #02df9b;
      border-color: #02df9b;
    }
  }
  /deep/.el-table__row {
    td:last-child {
      text-align: left !important;
    }
  }
}
</style>
