<template>
  <div class="add-team">
    <XModal
      ref="modal"
      :name="modalName"
      :title="modalName == 'editTeam' ? '编辑团队基础信息' : '开始创建团队'"
      :confirmBtnText="modalName == 'editTeam' ? '提交' : '立即创建团队'"
      width="40%"
      showCrossBtn
      @closed="closed"
      @onConfirm="onConfirm"
      @opened="opened"
    >
      <div class="content">
        <p v-if="modalName != 'editTeam'">创建团队，开启高效工作方式</p>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="180px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item prop="name" label="团队名称">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入团队名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="describe" label="团队描述">
            <el-input
              v-model="ruleForm.describe"
              :autosize="{ minRows: 4, maxRows: 6 }"
              type="textarea"
              placeholder="请输入团队描述"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="IsAgree"
            label="是否允许成员邀请其他人加入团队"
            class="radio"
          >
            <el-radio-group v-model="ruleForm.IsAgree">
              <el-radio :label="1">允许</el-radio>
              <el-radio :label="0">禁止</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  props: {
    modalName: {
      type: String,
      default: "addTeam",
    },
    editData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      ruleForm: {
        teamId: "",
        name: null,
        describe: null,
        IsAgree: 1,
      },
      rules: {
        name: [{ required: true, message: "请输入团队名称", trigger: "blur" }],
        IsAgree: [
          {
            required: true,
            message: "请选择是否允许成员邀请其他人加入团队",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    opened() {
      this.$nextTick(() => {
        if (this.modalName == "editTeam" && this.editData) {
          this.ruleForm.teamId = this.editData.Id;
          this.ruleForm.name = this.editData.Name;
          this.ruleForm.describe = this.editData.Describe;
          this.ruleForm.IsAgree = this.editData.IsAgree;
        }
      });
    },
    closed() {
      Object.assign(this.$data, this.$options.data());
    },
    onConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.modal.loadBtn(true);
          this.$http
            .post("/Teams/SaveTeamManagement.ashx", this.ruleForm)
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  showClose: true,
                  message: "团队创建成功",
                  type: "success",
                });
                this.$modal.hide(this.modalName);
                this.$emit("success", resp.data.teamId);
              }
            })
            .finally(() => this.$refs.modal.loadBtn(false));
        } else {
          return;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.add-team {
  .content {
    padding: 0 16px;
    p:first-child {
      font-size: 14px;
      color: #409eff;
      margin-bottom: 12px;
    }
    /deep/.el-form {
      .el-form-item__label {
        padding: 0;
        font-weight: 700;
      }
      .radio {
        .el-form-item__content {
          line-height: 20px;
        }
      }
    }
  }
}
</style>
