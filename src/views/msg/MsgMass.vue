<template>
  <XModel
    id="mass_modal"
    isFixed
    ref="xmodal"
    name="MsgMass"
    title="群发消息"
    cancelBtnText="取消"
    confirmBtnText="发送"
    @onConfirm="handleConfirm"
    @beforeOpen="beforeOpen"
    width="800"
  >
    <el-form class="form" :model="msgForm" :rules="rules" ref="msgForm">
      <el-form-item class="form_item" label="消息类型：" prop="Urgent">
        <el-select v-model="msgForm.Urgent" placeholder="请选择消息类型">
          <el-option label="普通消息" :value="0"></el-option>
          <el-option label="紧急消息" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form_item" label="接 收 人：">
        <mb @Confirm="confirm" :arrays="users"></mb>
      </el-form-item>
      <el-form-item class="form_item" label="消息内容：" prop="Msg">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="请输入消息内容"
          v-model="msgForm.Msg"
        ></el-input>
      </el-form-item>
    </el-form>
  </XModel>
</template>

<script>
export default {
  components: {
    XModel: () => import("@/components/XModal"),
    mb: () => import("@/components/Selectors/MemberSelect"),
  },
  props: {},

  data() {
    return {
      msgForm: {
        Msg: "", //消息内容
        Ids: null, //成员id数组
        Urgent: null, //0：普通消息1：紧急消息
      },
      users: [],
      rules: {
        Urgent: [
          { required: true, message: "请选择消息类型", trigger: "blur" },
        ],
        Msg: [{ required: true, message: "请输入消息内容", trigger: "blur" }],
      },
    };
  },

  methods: {
    /**
     * 数据初始化
     */
    beforeOpen() {
      this.users = [];
      this.msgForm.Ids = null;
      this.msgForm.Msg = "";
      this.msgForm.Urgent = null;
    },
    /**
     * 消息发送
     */
    handleConfirm() {
      this.msgForm.Ids = this.users.map((m) => m.UId);
      this.$refs.msgForm.validate((vail) => {
        if (vail) {
          this.$http
            .post("/Msg/SendUrgentMsg.ashx", this.msgForm)
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  message: "发送成功",
                  type: "success",
                });
                this.$modal.hide("MsgMass");
              }
            });
        } else {
          return false;
        }
      });
    },
    /**
     * 消息接收人选择
     */
    confirm(val) {
      this.users = [];
      this.users.push(...val);
    },
  },
};
</script>

<style lang="less" scoped>
#mass_modal {
  /deep/.ctn {
    overflow-y: scroll;
    .el-form {
      padding: 0 1.6rem;
      .el-form-item {
        display: flex;
        align-items: center;
        .el-form-item__content {
          flex: 1;
          .el-select {
            width: 100%;
          }
        }
        /deep/.el-form-item__label {
          padding-right: 10px;
          width: 95px;
        }
      }
    }
  }
}
.form {
  padding: 0 2rem 0 2rem;
  .form_item {
    display: flex;

    /deep/.el-form-item__label {
      padding-right: 10px;
      width: 95px;
    }

    /deep/.el-form-item__content {
      flex: auto;
      display: flex;
      align-items: center;

      .el-select {
        width: 100%;
      }
    }
  }
}

@media all and (max-width: 1024px) {
  .form_item {
    display: block !important;
    width: 92%;
  }
}
</style>
