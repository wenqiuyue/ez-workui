<template>
  <div class="invitation-user">
    <XModal
      ref="invitation"
      :name="mName"
      title="邀请成员"
      :showCrossBtn="true"
      confirmBtnText="完成"
      cancelBtnText="取消"
      @onConfirm="onConfirm"
      @opened="opened"
      width="40%"
    >
      <div class="inv_content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="ruleForm"
        >
          <el-form-item label="团队:" prop="teamValue">
            <el-select
              style="width: 100%"
              v-model="ruleForm.teamValue"
              filterable
              placeholder="请选择团队"
            >
              <el-option
                v-for="item in teamOptions"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀请方式:">
            <el-radio-group v-model="ruleForm.invType">
              <el-radio :label="1">链接邀请</el-radio>
              <el-radio :label="2">二维码邀请</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="code_content" v-if="linkCode">
          <div v-if="ruleForm.invType == 1">
            <div class="link">
              <el-input placeholder="请输入内容" v-model="linkCode" disabled>
                <template slot="append">
                  <span
                    class="copy"
                    v-clipboard:copy="linkCode"
                    v-clipboard:success="copySuccess"
                    v-clipboard:error="copyError"
                    >复制</span
                  >
                </template>
              </el-input>
              <p>分享链接邀请你的团队伙伴吧！</p>
            </div>
          </div>
          <div v-if="ruleForm.invType == 2">
            <div class="code">
              <vue-qr :text="linkCode"></vue-qr>
              <p>分享二维码邀请你的团队伙伴吧！</p>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </XModal>
  </div>
</template>
<script>
import VueQr from "vue-qr";
export default {
  props: {
    mName: {
      type: String,
      default: "invitation",
    },
    teamId: {
      type: Number,
      default: null,
    },
  },
  components: {
    VueQr,
    XModal: () => import("@/components/XModal"),
  },
  data() {
    return {
      linkCode: null, //链接邀请码
      ruleForm: {
        teamValue: null,
        invType: 1,
      },
      teamOptions: [],
      rules: {
        teamValue: [
          { required: true, message: "请选择团队", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    /**
     * 弹窗打开回调
     */
    opened() {
      Object.assign(this.$data, this.$options.data());
      this.getTeams();
      this.$nextTick(() => {
        if (this.teamId) {
          this.ruleForm.teamValue = this.teamId;
        }
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
     * 邀请
     */
    onConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.invitation.loadBtn(true);
          const data = {
            teamId: this.ruleForm.teamValue,
          };
          this.$http
            .post("/Teams/InvitedOrApply/CreateInvitedCode.ashx", data)
            .then((resp) => {
              if (resp.res == 0) {
                if (resp.data) {
                  this.linkCode = resp.data;
                } else {
                  this.$message({
                    showClose: true,
                    message: resp.msg,
                    type: "warning",
                  });
                }
              }
            })
            .finally(() => this.$refs.invitation.loadBtn(false));
        } else {
          return;
        }
      });
    },
    //复制链接后的回调
    copySuccess: function () {
      this.$notify({
        type: "success",
        title: "复制成功",
      });
    },
    copyError: function () {
      this.$notify({
        type: "error",
        title: "复制失败",
        msg: "请确认浏览器是否支持此功能",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.invitation-user {
  .inv_content {
    padding: 0 30px 10px;
    .ruleForm {
      /deep/.el-form-item {
        margin-bottom: 12px;
      }
    }
    .code_content {
      margin-top: 28px;
      border-top: 2px dashed #409eff;
      .link {
        margin-top: 15px;
        /deep/.el-input__inner {
          cursor: default;
        }
        .copy {
          cursor: pointer;
        }
        p {
          margin-top: 5px;
          color: #e6a23c;
        }
      }
      .code {
        margin-top: 15px;
        text-align: center;
        p {
          color: #e6a23c;
        }
      }
    }
  }
}
</style>
