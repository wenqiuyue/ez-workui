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
    :showCrossBtn="true"
    width="800"
  >
    <el-form class="form" :model="msgForm" :rules="rules" ref="msgForm">
      <el-form-item class="form_item" label="团 队：" prop="teamId">
        <el-select v-model="msgForm.teamId" placeholder="请选择团队">
          <el-option
            v-for="item in teamOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form_item" label="接 收 人：" v-if="msgForm.teamId">
        <mb @Confirm="confirm" :arrays="users" :teamId="msgForm.teamId"></mb>
      </el-form-item>
      <el-form-item class="form_item" label="消息内容：" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          placeholder="请输入消息内容"
          v-model="msgForm.content"
        ></el-input>
      </el-form-item>
    </el-form>
  </XModel>
</template>

<script>
export default {
  components: {
    XModel: () => import("@/components/XModal"),
    mb: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  props: {
    teamOptions: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      msgForm: {
        content: "", //消息内容
        reader: null, //成员id数组
        teamId: null,
      },

      users: [],
      rules: {
        teamId: [{ required: true, message: "请选择团队", trigger: "blur" }],
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    /**
     * 数据初始化
     */
    beforeOpen() {
      this.users = [];
      this.msgForm.reader = null;
      this.msgForm.content = "";
    },
    /**
     * 消息发送
     */
    handleConfirm() {
      this.msgForm.reader = this.users.map((m) => m.UsId);
      this.$refs.msgForm.validate((vail) => {
        if (vail) {
          this.$refs.xmodal.loadBtn(true);
          this.$http
            .post("/Information/SaveInformation.ashx", this.msgForm)
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  message: "发送成功",
                  type: "success",
                });
                this.$modal.hide("MsgMass");
              }
            })
            .finally(() => this.$refs.xmodal.loadBtn(false));
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
