<template>
  <div id="process-rulesver">
    <div class="ver" v-if="!isInfoView">
      <c-content v-loading="loading">
        <div slot="search" class="header_con">
          <div class="h_left">
            <span @click="$emit('handleViewChange')"
              ><i class="el-icon-d-arrow-left"></i
              >{{ team ? team.Name : "" }}</span
            >
          </div>
          <div>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-set-up"
              @click="handleCopy"
              :loading="copyLoading"
              >应用系统配置组</el-button
            >
            <el-button
              type="primary"
              @click="addClick"
              icon="el-icon-circle-plus-outline"
              size="small"
              >新增</el-button
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
            label="名称"
            :show-overflow-tooltip="true"
            prop="ConfigName"
          >
          </el-table-column>
          <el-table-column
            label="是否是系统配置组"
            :show-overflow-tooltip="true"
            prop="IsSystem"
          >
            <template slot-scope="scope">{{
              scope.row.IsSystem ? "是" : "否"
            }}</template>
          </el-table-column>
          <el-table-column
            label="是否启用"
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
          <el-table-column label="操作" width="410">
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
                >启用</el-button
              >
              <el-button
                type="warning"
                size="mini"
                @click="handleUpdate(2, scope.row)"
                v-if="scope.row.IsSystem && scope.row.IsUpdate"
                >更新</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleUpdate(3, scope.row)"
                v-if="scope.row.IsSystem && scope.row.IsReset"
                >重置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </c-content>
    </div>
    <RuleSetting
      v-else
      @handleVerList="handleVerList"
      :selRow="selRow"
      :teamValue="teamValue"
    ></RuleSetting>
    <VerModal
      :indexData="indexData"
      ref="VerModal"
      @eventComfirm="getDataList"
      :teamValue="teamValue"
    ></VerModal>
    <SystemRuleverSel
      ref="RuleverSelModal"
      :teamValue="teamValue"
      @success="getDataList"
    ></SystemRuleverSel>
  </div>
</template>

<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    RuleSetting: () => import("../rule-setting"),
    VerModal: () => import("./verModal"),
    SystemRuleverSel: () => import("./systemRuleverSel"),
  },
  props: {
    //选择的团队Id
    teamValue: {
      type: Number,
      default: null,
    },
    team: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    copyLoading: false,
    iSShowApplication: false,
    isShowTeam: true,
    teamOptions: [],
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
  mounted() {
    const role = this.$xStorage.getItem("user-role");
    if (role.team) {
      this.teamValue = role.team;
      this.isShowTeam = false;
    } else {
      this.isShowTeam = true;
    }
    this.$nextTick(() => {
      if (!this.teamValue) {
        this.getTeams();
      } else {
        this.getDataList();
      }
    });
  },
  methods: {
    /**
     * 启用配置组
     */
    handleStart(val) {
      this.$confirm(`此操作需要重新设置成员进程组，谨慎更改`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/ConfigGroup/UpdateStart.ashx", {
              tcId: val.Id,
              teamId: this.teamValue,
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消${name}`,
          });
        });
    },
    /**
     * 引用系统配置组
     */
    handleCopy() {
      this.$refs.RuleverSelModal.openModal();
    },
    /**
     * 更新和重置
     */
    handleUpdate(type, val) {
      let name = null;
      let operationVal = null;
      if (type == 2) {
        name = "更新";
        operationVal = 2;
      } else {
        operationVal = 1;
        name = "重置";
      }
      this.$confirm(`${name}后团队的进程设置将会失效, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/ConfigGroup/UpdateTeamConfig.ashx", {
              teamId: this.teamValue,
              operation: operationVal,
              tcId: val.Id,
            })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  message: `${name}成功`,
                  type: "success",
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
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
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
      this.$confirm("此操作将删除此进程, 是否继续?", "提示", {
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
        .post("/ConfigGroup/DelConfigGroup.ashx", params)
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
        .get("/ConfigGroup/ConfigGroupList.ashx", {
          params: { teamId: this.teamValue },
        })
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.Data;
            this.iSShowApplication = result.data.ISApplication ? false : true;
            this.loading = false;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
#process-rulesver {
  height: 100%;
  .ver {
    height: 100%;
  }
  .header_con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    background: #ffffff;
    padding: 5px 10px;
    .h_left {
      color: #303133;
      i {
        margin-right: 10px;
        font-size: 16px;
      }
      span {
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
    .el-select {
      margin-right: 12px;
    }
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
}
</style>
