<template>
  <div class="roleModal">
    <XModal
      name="roleModal"
      width="40%"
      height="30%"
      @closed="closed"
      @opened="opened"
    >
      <CWinTmp
        :indexData="indexData"
        v-loading="loading"
        @topSubmit="topSubmit"
        ref="cwt"
      >
        <el-form
          slot="form"
          ref="roleForm"
          :model="formData"
          :rules="Rules"
          label-width="100px"
        >
          <el-form-item label="角色名称：" prop="role" style="width: 100%">
            <el-input
              v-model="formData.role"
              placeholder="请填写角色名称"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-form>
      </CWinTmp>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    CWinTmp: () => import("@/components/CWinTmp"),
  },
  props: {
    isAdd: {
      type: Boolean,
      default: null,
    },
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      indexData: {
        type: "Add",
        name: "添加角色",
        xModalName: "roleModal",
      },
      formData: { role: null },
      Rules: {
        role: [{ required: true, message: "输入角色名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    /**
     * 弹窗打开回调
     */
    opened() {
      this.$nextTick(() => {
        if (this.isAdd) {
          this.indexData.name = "添加角色";
        } else {
          this.indexData.name = "编辑角色";
          this.formData.role = this.selRow.Name;
        }
      });
    },
    /**
     * 弹窗关闭回调
     */
    closed() {
      this.formData.role = null;
    },
    /**
     * 提交
     */
    topSubmit() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.$refs.cwt.toggleSubmit();
          if (this.isAdd) {
            this.addRole();
          } else {
            this.editRole();
          }
        } else {
          return;
        }
      });
    },
    /**
     * 确认添加
     */
    addRole() {
      this.$http
        .post("/Management/RoleManagement/AddRole.ashx", {
          name: this.formData.role,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              message: resp.msg,
              type: "success",
            });
            this.$modal.hide("roleModal");
            this.$emit("success");
          }
        });
    },
    /**
     * 确认编辑
     */
    editRole() {
      this.$http
        .post("/Management/RoleManagement/EditRole.ashx", {
          name: this.formData.role,
          id: this.selRow.Id,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.$message({
              message: resp.msg,
              type: "success",
            });
            this.$modal.hide("roleModal");
            this.$emit("success");
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.roleModal {
  .el-form {
    margin-top: 10px;
  }
}
</style>
