<template>
  <div id="windowalias">
    <c-content v-loading="loading">
      <!-- 搜索部分 -->
      <CTitle
        slot="search"
        :TInfo="titleInfo"
        @addClick="addClick"
        :showSearch="false"
      ></CTitle>
      <!-- 主体表格部分 -->
      <el-table
        slot="main"
        :data="tableData"
        ref="multipleTable"
        style="width: 100%"
        :header-row-class-name="tableHeaderStyle"
        :cell-style="attenceCellStyle"
        :header-cell-style="attenceHeaderStyle"
      >
        <template slot="empty" style="font-size: 0">
          <div style="height: 100%">
            <img
              src="@/assets/img/emptyData.png"
              style="display: inline-block; width: 50%; margin-top: 100px"
            />
          </div>
        </template>
        <el-table-column label="别名" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.AliasName }}</template>
        </el-table-column>
        <el-table-column label="进程窗体名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.FormNames && scope.row.FormNames.length">
              <span
                v-for="(nitem, index) in scope.row.FormNames"
                :key="index"
                >{{ index == 0 ? nitem : `、${nitem}` }}</span
              >
            </div>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
        <el-table-column label="操作">
          <!-- fixed  -->
          <template slot-scope="scope">
            <c-btn>
              <span @click="handleEdit(scope.row)">编辑</span>
              <span @click="handleCancle(scope.row)">删除</span>
            </c-btn>
          </template>
        </el-table-column>
      </el-table>
      <div class="pag" slot="pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="pageData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.dataNum"
        >
        </el-pagination>
      </div>
    </c-content>
    <XModal
      ref="xmodal"
      name="editRole"
      width="900px"
      height="600px"
      :title="`${isAdd ? '添加' : '编辑'}进程窗口别名`"
      confirmBtnText="确定"
      cancelBtnText="取消"
      @onConfirm="handleConfirm"
      isFixed
      @closed="
        () => {
          Object.assign($data.roleForm, $options.data().roleForm);
        }
      "
    >
      <div class="wrapper">
        <el-form
          ref="roleForm"
          :model="roleForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="别名" prop="name">
            <div class="form-header" slot="label">
              <span>别名</span>
            </div>
            <el-input
              placeholder="请输入别名"
              v-model="roleForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item prop="formnames">
            <div class="form-header" slot="label">
              <span>进程窗口名称</span>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="
                  () => {
                    roleForm.formnames.push({ str: '' });
                  }
                "
                >添加进程窗口名称</el-button
              >
            </div>
            <el-input
              placeholder="请输入进程窗口名称"
              v-model="item.str"
              v-for="(item, index) in roleForm.formnames"
              :key="index"
            >
              <template slot="append"
                ><i class="el-icon-delete del" @click="delFormname(index)"></i
              ></template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    XModal: () => import("@/components/XModal"),
    CBtn: () => import("@/components/CBtn"),
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
      isAdd: null,
      pageData: {
        pageIndex: 1,
        pageSize: 20,
        dataNum: 0,
        currentPage: 1,
      }, //分页
      loading: false,
      tableData: [],
      roleForm: {
        name: null, //名称
        formnames: [{ str: "" }],
        id: null,
      },
      titleInfo: {
        btnShow: [
          { type: "addBtn", ishow: true },
          { type: "startBtn", ishow: false, disabled: true },
          { type: "closeBtn", ishow: false, disabled: true },
          { type: "delBtn", ishow: false, disabled: true },
        ],
        dropDown: {
          searchInput: {
            placeholder: "",
          },
        },
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getNameData();
  },
  methods: {
    /**
     * 设置每页条数
     */
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.pageData.pageIndex = 1;
      this.getNameData();
    },
    /**
     * 去往某一页
     */
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getNameData();
    },
    /**
     * 添加别名
     */
    addClick() {
      this.isAdd = true;
      this.roleForm.Name = null;
      this.$modal.show("editRole");
    },
    /**
     * 删除别名
     */
    handleCancle(row) {
      this.$confirm("此操作将删除该别名, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/ProgressAlia/DelProgressAlias.ashx", {
              Ids: [row.Id],
              teamId: this.teamValue,
            })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getNameData();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 编辑操作
     */
    handleEdit(row) {
      this.isAdd = false;
      console.log(row);
      this.roleForm.name = row.AliasName;
      this.roleForm.id = row.Id;
      this.roleForm.formnames = row.FormNames.map((m) => {
        return {
          str: m,
        };
      });
      this.$modal.show("editRole");
    },
    /**
     * 确认编辑/添加
     */
    handleConfirm() {
      this.$refs.roleForm.validate((val) => {
        if (val) {
          if (this.isAdd) {
            this.addConfirm();
          } else {
            this.editConfirm();
          }
        } else {
          return;
        }
      });
    },
    /**
     * 编辑
     */
    editConfirm() {
      const fm = this.roleForm.formnames.filter((m) => m.str);
      const data = {
        Id: this.roleForm.id,
        name: this.roleForm.name,
        formnames: fm.map((m) => m.str),
        teamId: this.teamValue,
        configId: this.selRow.Id,
      };
      this.$refs.xmodal.loadBtn(true);
      this.$http
        .post("/ProgressAlia/EditProgressAlias.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.$notify({
              message: "编辑成功",
              type: "success",
            });
            this.$modal.hide("editRole");
            this.getNameData();
          }
        })
        .finally(() => this.$refs.xmodal.loadBtn(false));
    },
    /**
     * 添加
     */
    addConfirm() {
      const fm = this.roleForm.formnames.filter((m) => m.str);
      this.$refs.xmodal.loadBtn(true);
      this.$http
        .post("/ProgressAlia/AddProgressAlias.ashx", {
          name: this.roleForm.name,
          formnames: fm.map((m) => m.str),
          teamId: this.teamValue,
          configId: this.selRow.Id,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              type: "success",
              message: "添加进程窗口别名成功",
            });
            this.$modal.hide("editRole");
            this.getNameData();
          }
        })
        .finally(() => this.$refs.xmodal.loadBtn(false));
    },
    delFormname(index) {
      this.roleForm.formnames.splice(index, 1);
    },
    /**
     * 获取别名数据
     */
    getNameData() {
      this.loading = true;
      const data = {
        name: null,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        teamId: this.teamValue,
        configId: this.selRow.Id,
      };
      this.$http
        .get("/ProgressAlia/QueryProgressAliasList.ashx", {
          params: data,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.Data.map((m) => {
              return {
                AliasName: m.AliasName,
                FormNames: JSON.parse(m.FormNames),
                Id: m.Id,
              };
            });
            this.pageData.dataNum = resp.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
    },
    tableHeaderStyle(row) {
      return "table-header";
    },
    attenceCellStyle() {
      return {
        textAlign: "center",
      };
    },
    attenceHeaderStyle() {
      return {
        background: "#F5F7FA",
        textAlign: "center",
        fontWeight: "bold",
        color: "#909399",
      };
    },
  },
};
</script>
<style lang="less" scoped>
#windowalias {
  height: 100%;
  box-sizing: border-box;
}

.wrapper {
  box-sizing: border-box;
  padding: 0rem 6rem;
}

/deep/.el-form-item__label {
  font-size: 14px;
  color: #333333;
  line-height: 3.6rem;
  padding-bottom: 0;
  display: flex;
  width: 100%;
}

/deep/.el-form-item__content {
  .el-input {
    margin-bottom: 0.8rem;
  }

  .el-input:last-child {
    margin-bottom: 0;
  }
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  i {
    font-size: 2rem;
    color: #409eff;
    cursor: pointer;

    &:hover {
      color: #0482ff;
    }
  }
}

.del {
  font-size: 2rem;
  cursor: pointer;
}
</style>
