<template>
  <!-- 菜单 -->
  <div id="manager-func">
    <Tab :options="tabOptions" @change="getTab">
      <el-button
        slot="custom"
        type="primary"
        size="medium"
        class="add-btn-process"
        @click="addClick"
        >添 加</el-button
      >
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
              v-if="
                scope.row.ProgressGroupIds && scope.row.ProgressGroupIds.length
              "
            >
              <span v-for="(item, index) in scope.row.ProgressGroupIds">
                {{ filterGroup(item) }}
                <i v-if="index !== scope.row.ProgressGroupIds.length - 1">，</i>
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
              v-if="scope.row.UInfo && scope.row.UInfo.length > 0"
              width="300"
            >
              <div style="display: flex; flex-wrap: wrap">
                <p
                  v-for="(item, index) in scope.row.UInfo"
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
                  v-for="(name, index) in scope.row.UInfo.filter(
                    (m, index) => index < 1
                  )"
                  :key="index"
                  >{{ name.Name }} </span
                ><i v-if="scope.row.UInfo.length > 1"
                  >等{{ scope.row.UInfo.length }}人</i
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
              v-if="scope.row.ProgressNames.length"
            >
              <p v-for="(item, index) in scope.row.ProgressNames">{{ item }}</p>
              <p slot="reference" style="cursor: pointer">
                <span
                  v-for="(name, index) in scope.row.ProgressNames"
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
              v-if="scope.row.FormNames.length"
            >
              <p v-for="(item, index) in scope.row.FormNames">{{ item }}</p>
              <p slot="reference" style="cursor: pointer">
                <span
                  v-for="(name, index) in scope.row.FormNames"
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
            <div v-if="scope.row.FormNames.length">
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
            <c-btn>
              <span @click="handleEdit(scope.$index, scope.row)">详情</span>
              <span @click="handleDelt(scope.$index, scope.row)">删除</span>
            </c-btn>
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
    ></ProRuleW>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    CBtn: () => import("@/components/CBtn"),
    Tab: () => import("@/components/TabUtil"),
    ProRuleW: () => import("./proRuleW"),
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
      proxy: "",
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
      user: [],
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
  methods: {
    filterGroup(val) {
      let str = "";
      this.processOptions.forEach((item) => {
        if (item.ID == val) {
          str = item.Name;
        }
      });
      return str;
    },
    getTab(item) {
      this.activeItem = item.join();
      this.getDataList();
    },
    async GetProgressGroup() {
      const resp = await this.$http.get(
        "/MGT/Personnel/User/GetProgressGroupSelected.ashx"
      );
      if (resp.res == 0) {
        this.processOptions = resp.data;
      }
    },
    // 删除某一行
    handleDelt(ind, row) {
      this.$confirm("此操作将删除此规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .get(this.proxy + "/Api/mgr.ashx?type=DeleteRule", {
              params: {
                id: row.Id,
              },
            })
            .then((res) => {
              if (res.res == 0) {
                this.getDataList();
              }
            });
        })
        .catch(() => {});
    },

    comDelete(params) {
      this.$http
        .post("/MGT/System/Func/DelFunc.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.getDataList();
          }
        });
    },

    // 新增
    addClick() {
      this.operationName = 1;
      this.id = "";
      Object.assign(this.$data.formParams, this.$options.data().formParams);
      this.formParams.t = this.activeItem;
      this.user = [];
      this.$modal.show("ruleXmodal");
    },
    // 编辑
    handleEdit(i, row) {
      this.id = row.Id;
      // this.$refs.detail.id=row.Id
      this.operationName = 2;
      if (this.id) {
        this.$modal.show("ruleXmodal");
      }
    },
    // 获取表单数据
    getDataList() {
      this.loading = true;
      this.$http.post("/MGT/System/Progress/RuleList.ashx").then((result) => {
        if (result.res == 0) {
          this.resultData = result.data;
          this.loading = false;
          if (this.activeItem == "进程组") {
            this.resultData.csRules.forEach((item) => {
              if (item.MarkInCheck == "上班") {
                item.MarkInCheck = "工作";
              }
              if (item.MarkOutCheck == "上班") {
                item.MarkOutCheck = "工作";
              }
            });
            this.tableData = this.resultData.csRules;
          } else {
            this.resultData.mkRules.forEach((item) => {
              if (item.MarkInCheck == "上班") {
                item.MarkInCheck = "工作";
              }
              if (item.MarkOutCheck == "上班") {
                item.MarkOutCheck = "工作";
              }
            });
            this.tableData = this.resultData.mkRules;
          }
        }
      });
    },
  },
  created() {
    this.GetProgressGroup();
    if (process.env.NODE_ENV === "development") {
      this.proxy = "http://localhost:8081/Api";
      // this.proxy = location.origin;
    } else {
      this.proxy = location.origin;
    }
    setTimeout(() => {
      this.getDataList();
    }, 100);
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

  /deep/.title-box {
    display: none;
  }

  /deep/.add-btn-process {
    position: absolute;
    right: 0;
    top: -2px;
    padding: 8px 22px;
  }
}
</style>
