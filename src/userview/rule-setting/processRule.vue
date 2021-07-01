<template>
  <!-- 菜单 -->
  <div id="manager-func">
    <Tab :options="tabOptions" @change="getTab">
      <template slot="custom">
        <div class="screen">
          <span class="lable">团队</span>
          <el-select v-model="teamValue" filterable placeholder="请选择团队">
            <el-option
              v-for="item in teamOptions"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            >
            </el-option>
          </el-select>
          <el-button
            type="primary"
            size="medium"
            class="add-btn-process"
            @click="getDataList"
            >搜索</el-button
          >
          <el-button
            type="primary"
            size="medium"
            class="add-btn-process"
            @click="addClick"
            >添加规则</el-button
          >
        </div>
      </template>
    </Tab>
    <c-content v-loading="loading">
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
          label="规则名"
          :show-overflow-tooltip="true"
          fixed
          prop="RuleName"
          width="200"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.RuleName">{{ scope.row.RuleName }}</div>
            <div v-else>—</div>
          </template>
        </el-table-column>
        <el-table-column
          label="进程组"
          :show-overflow-tooltip="true"
          fixed
          v-if="activeItem == '进程组'"
        >
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
        <el-table-column label="成员姓名" fixed v-else>
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
              v-if="scope.row.UserData && scope.row.UserData.length > 0"
              width="300"
            >
              <div style="display: flex; flex-wrap: wrap">
                <p
                  v-for="(item, index) in scope.row.UserData"
                  :key="index"
                  style="
                    margin-right: 1rem;
                    width: 5rem;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                >
                  {{ item.Name }}
                </p>
              </div>
              <p slot="reference" style="cursor: pointer">
                <span
                  v-for="(name, index) in scope.row.UserData.filter(
                    (m, index) => index < 1
                  )"
                  :key="index"
                  >{{ name.Name }} </span
                ><i v-if="scope.row.UserData.length > 1"
                  >等{{ scope.row.UserData.length }}人</i
                >
              </p>
            </el-popover>
            <span v-else>全部</span>
          </template>
        </el-table-column>
        <el-table-column
          label="进程名称"
          :show-overflow-tooltip="true"
          width="300"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
              v-if="scope.row.ProgressNames && scope.row.ProgressNames.length"
            >
              <p v-for="(item, index) in scope.row.ProgressNames" :key="index">
                {{ item }}
              </p>
              <p slot="reference" style="cursor: pointer">
                <span
                  v-for="(name, index) in scope.row.ProgressNames"
                  :key="index"
                  v-if="index < 1"
                  >{{ name }} </span
                ><i v-if="scope.row.ProgressNames.length > 1"
                  >等{{ scope.row.ProgressNames.length }}个进程</i
                >
              </p>
            </el-popover>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="窗体名称关键词" width="300">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              minwidth="100"
              trigger="hover"
              v-if="scope.row.FormNames && scope.row.FormNames.length"
            >
              <p v-for="(item, index) in scope.row.FormNames" :key="index">
                {{ item }}
              </p>
              <p slot="reference" style="cursor: pointer">
                <span
                  v-for="(name, index) in scope.row.FormNames"
                  :key="index"
                  v-if="index < 1"
                  >{{ name }} </span
                ><i v-if="scope.row.FormNames.length > 1"
                  >等{{ scope.row.FormNames.length }}个窗口</i
                >
              </p>
            </el-popover>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          label="标记结果"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.FormNames && scope.row.FormNames.length">
              <p>匹配：{{ scope.row.MarkInCheck }}</p>
              <p>否则：{{ scope.row.MarkOutCheck }}</p>
            </div>
            <div v-else>
              <p>{{ scope.row.MarkInCheck }}</p>
            </div>
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
    </c-content>
    <ProRuleW
      :operationName="operationName"
      :activeItem="activeItem"
      ref="detail"
      :id="id"
      @update="getDataList"
      :teamValue="teamValue"
    ></ProRuleW>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    Tab: () => import("@/components/TabUtil"),
    ProRuleW: () => import("./proRuleW"),
  },
  data() {
    "#main";
    return {
      teamValue: null, //选择的团队
      teamOptions: [],
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
          {
            type: "addBtn",
            ishow: true,
          },
          {
            type: "startBtn",
            ishow: false,
            disabled: true,
          },
          {
            type: "closeBtn",
            ishow: false,
            disabled: true,
          },
          {
            type: "delBtn",
            ishow: true,
            disabled: true,
          },
        ],
      },
      tabOptions: ["进程组", "成员组"],
      operationName: 1,
      tableData: [],
      formParams: {
        t: "进程组",
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
      processOptions: [],
      resultData: {
        CSRules: [],
        MKRules: [],
      },
      activeItem: "进程组",
      cellStyle: {
        textAlign: "center",
      },
      rule: {},
      id: "",
    };
  },
  watch: {},
  filters: {},
  mounted() {
    this.getTeams();
  },
  methods: {
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 3 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
    getTab(item) {
      this.activeItem = item.join();
      this.getDataList();
    },

    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/ProcessRules/DelProcessRules.ashx", {
              id: [row.ID],
            })
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
      this.$modal.show("ruleXmodal");
    },
    // 编辑
    handleEdit(row) {
      this.id = row.ID;
      // this.$refs.detail.id=row.Id
      this.operationName = 2;
      if (this.id) {
        this.$modal.show("ruleXmodal");
      }
    },
    // 获取表单数据
    getDataList() {
      if (!this.teamValue) {
        this.$message({
          showClose: true,
          message: "请选择团队",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      const data = {
        type: this.activeItem == "进程组" ? 1 : 2,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        teamId: this.teamValue,
        searchtext: null,
      };
      this.$http
        .post("/ProcessRules/GetProcessRules.ashx", data)
        .then((result) => {
          if (result.res == 0) {
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
            this.loading = false;
            this.tableData.forEach((item) => {
              if (item.MarkInCheck == "上班") {
                item.MarkInCheck = "工作";
              }
              if (item.MarkOutCheck == "上班") {
                item.MarkOutCheck = "工作";
              }
            });
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
#manager-func {
  height: 100%;
  box-sizing: border-box;
  .screen {
    position: absolute;
    right: 0;
    top: -7px;
    padding: 0px 22px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .lable {
      font-size: 1.4rem;
      font-weight: 700;
      margin-right: 5px;
    }
    .el-select {
      height: 40px;
    }
  }

  /deep/.tab_flex {
    padding-left: 0;
  }

  /deep/.title-box {
    display: none;
  }
}
</style>
