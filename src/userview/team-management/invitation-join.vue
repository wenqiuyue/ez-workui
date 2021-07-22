<template>
  <div class="invitation-join">
    <div class="content">
      <h3>通过团队号加入</h3>
      <div class="con">
        <p>
          团队号是团队的唯一标识，请向管理员或者已经在团队中的成员索要团队号
        </p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="团队号" prop="teamNum">
            <el-input
              v-model="ruleForm.teamNum"
              placeholder="请输入团队号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邀请口令" prop="inviterWord">
            <el-input
              v-model="ruleForm.inviterWord"
              placeholder="请输入邀请口令"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom">
        <a class="confirm" @click="onConfirm" v-if="!loading">
          <span> 加入团队 </span>
        </a>
        <a class="confirm" v-else> <span>提交中。。。</span></a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      loading: false,
      ruleForm: {
        teamNum: null,
        inviterWord: null,
      },
      rules: {
        teamNum: [{ required: true, message: "请输入团队号", trigger: "blur" }],
      },
    };
  },
  created() {
    let token = this.$xStorage.getItem("token");
    let role = this.$xStorage.getItem("user-role");
    if (token && role.role == "用户") {
      return;
    } else {
      this.$router.push({
        path: "/",
        query: {
          invitUrl: this.$route.fullPath,
        },
      });
    }
  },
  mounted() {
    const code = this.$route.query.teamCode;
    if (code) {
      this.ruleForm.teamNum = code;
    }
  },
  methods: {
    /**
     * 确认
     */
    onConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const data = {
            teamCode: this.ruleForm.teamNum,
            inviterId: this.$route.query.userID
              ? this.$route.query.userID
              : null,
            inviterWord: this.ruleForm.inviterWord,
          };
          this.$http
            .post("/Teams/InvitedOrApply/ApplyTeam.ashx", data)
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  showClose: true,
                  message: "申请发送成功！",
                  type: "success",
                });
                this.$router.push("/profile");
              }
            })
            .finally(() => (this.loading = false));
        } else {
          return;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.invitation-join {
  background: #ffffff;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 35%;
    h3 {
      text-align: center;
      font-size: 2.2rem;
      font-weight: 600;
      color: #448ef5;
      line-height: 6rem;
    }
    .con {
      p {
        font-size: 14px;
        color: #409eff;
        margin-bottom: 12px;
        margin-bottom: 16px;
      }
    }
    /deep/.el-form-item__label {
      font-weight: bold;
    }
    .bottom {
      padding-top: 1rem;
      margin-bottom: 1rem;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      margin-top: 5rem;
      .confirm {
        transition: background 0.3s ease;
        background: linear-gradient(
          90deg,
          #61c1fe 0%,
          #428bf4 50%,
          #61c1fe 100%
        );
        background-size: 200% 100%;
        color: #fff;
      }
      a {
        border-radius: 4px;
        flex: 1;
        display: block;
        height: 4rem;
        line-height: 4rem;
        font-size: 1.5rem;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
@media screen and (max-width: 1024px) {
  .invitation-join {
    .content {
      width: 90%;
      .bottom {
        margin-top: 10rem;
      }
    }
  }
}
</style>
