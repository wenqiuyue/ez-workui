<template>
  <div class="create-user">
    <XModal
      ref="modal"
      name="createUser"
      title="添加成员"
      confirmBtnText="立即添加"
      width="40%"
      showCrossBtn
      @onConfirm="onConfirm"
      @opened="opened"
    >
      <div class="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="180px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item prop="Name" label="用户昵称">
            <el-input
              v-model="ruleForm.Name"
              placeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="Phone" label="用户电话">
            <el-input
              v-model="ruleForm.Phone"
              placeholder="请输入电话"
            ></el-input>
          </el-form-item>
          <el-form-item prop="addres" label="用户邮箱">
            <el-input
              v-model="ruleForm.addres"
              placeholder="用户邮箱"
            ></el-input>
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
    teamValue: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      ruleForm: {
        teamId: null,
        Name: null,
        Phone: null,
        addres: null,
      },
      rules: {
        addres: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    opened() {
      Object.assign(this.$data, this.$options.data());
    },
    onConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.modal.loadBtn(true);
          this.ruleForm.teamId = this.teamValue;
          this.$http
            .post("/User/AddUser.ashx", this.ruleForm)
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  showClose: true,
                  message: "成员添加成功",
                  type: "success",
                });
                this.$modal.hide("createUser");
                this.$emit("success");
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
.create-user {
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
