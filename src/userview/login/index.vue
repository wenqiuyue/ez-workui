<template>
  <!-- 李俊豪 -->
  <div class="login-wrap">
    <div>
      <div id="banner"></div>
      <div id="login">
        <div>
          <div id="title">
            <h3>
              <img class="pc" src="@/assets/main/main.png" />
              <img class="mb" src="@/assets/main/main_mb.png" />
            </h3>
          </div>
          <div id="loginForm" @keyup.enter="login" v-if="showLogin">
            <el-input
              v-model="input"
              placeholder="请输入你的账户"
              :autofocus="true"
              suffix-icon="el-icon-user"
            ></el-input>
            <el-input
              placeholder="请输入密码"
              v-model="password"
              show-password
            ></el-input>
            <el-select v-model="teamValue" filterable placeholder="请选择团队">
              <el-option
                v-for="item in teamoptions"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              >
              </el-option>
            </el-select>
            <div class="v-forget" @click="showLogin = false">忘记密码</div>
            <div class="hp-btn">
              <el-button class="v-button" @click="login" :loading="loading"
                >登录</el-button
              >
            </div>
            <div class="register">
              <span>还没有账号？</span>
              <span @click="handleRegister">立即注册</span>
            </div>
          </div>
          <!-- 忘记密码 -->
          <div class="modalinput xm-ctn-padding-h" v-else>
            <h3>找回密码</h3>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="60px"
              class="demo-ruleForm"
            >
              <el-form-item label="邮 箱" prop="Email"
                ><el-input
                  v-model="ruleForm.Email"
                  placeholder="请输入您的邮箱"
                ></el-input
              ></el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  @click="onConfirm(ruleForm)"
                  v-if="!loadSubmit"
                  >提 交</el-button
                >
                <el-button type="primary" style="width: 100%" v-else>
                  <i class="el-icon-loading"></i>
                  提交中
                </el-button>
              </el-form-item>
            </el-form>
            <p @click="showLogin = true">
              <i class="el-icon-d-arrow-left"></i>
              返回登录页面
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamoptions: [], //团队选项
      loading: false,
      input: "",
      password: "",
      teamValue: null, //选择的团队
      ruleForm: {
        Email: "",
      },
      rules: {
        Email: [
          {
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur",
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      showLogin: true,
      loadSubmit: false,
    };
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    /**
     * 点击立即注册
     */
    handleRegister() {
      this.$router.push("/register");
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 1 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamoptions = resp.data;
          }
        });
    },
    onConfirm(ruleForm) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loadSubmit = true;
          this.$http
            .post("/ForegetPassword.ashx", {
              Email: this.ruleForm.Email,
            })
            .then((res) => {
              if (res.res == 0) {
                this.$modal.hide("forgetpw");
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            })
            .finally(() => (this.loadSubmit = false));
        } else {
          return false;
        }
      });
    },
    login() {
      if (!this.input || !this.password) {
        this.$notify.error("请填入账号密码");
      } else {
        this.loading = true;
        let params = {
          acc: this.input,
          pwd: this.password,
          info: null,
          teamId: this.teamValue,
        };
        if (window.hasOwnProperty("plus")) {
          params.info = JSON.stringify(window.plus.push.getClientInfo());
        }
        this.$http
          .post("/UserLogin.ashx", params)
          .then((req) => {
            //判断返回的数据进行不同操作 以下默认为验证通过跳转到主页
            this.loading = false;
            if (req.res == 0) {
              this.$message({
                message: "登陆成功",
                type: "success",
              });
              this.$xStorage.setItem("token", req.data.token, req.data.exp);
              this.$xStorage.setItem(
                "user-role",
                {
                  role: req.data.RoleName,
                  team: this.teamValue,
                },
                req.data.exp
              );
              const query = window.location.search.substr(1).split("&");
              for (let item of query) {
                if (item.indexOf("callback") >= 0) {
                  this.$router.push(decodeURIComponent(item.split("=")[1]));
                  return;
                }
              }
              if (req.data.RoleName == "管理员") {
                this.$router.push({
                  path: "/manager",
                });
              } else {
                this.$router.push({
                  path: "/profile",
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    // inputchange() {
    //   let bool = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    //   if (bool.test(this.input)) {
    //     //验证邮箱格式
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f2f2f2;

  & > div {
    background: #fff;
    width: 100%;
    height: 100%;
    max-height: 62rem;
    max-width: 110rem;
    display: flex;
  }
}

#banner {
  height: 100%;
  width: 40%;
  background: linear-gradient(
    180deg,
    rgba(80, 187, 254, 1) 0%,
    rgba(75, 158, 254, 1) 100%
  );
}

#login {
  width: 60%;
  display: flex;
  justify-content: center;
  // align-items: center;

  & > div {
    width: 60%;
  }

  #title {
    width: 100%;

    h1 {
      margin-top: 3rem;
      text-align: center;
      font-size: 2.8rem;
      font-weight: 600;
      color: rgba(74, 74, 74, 1);
      letter-spacing: 0.1rem;
    }

    h3 {
      font-size: 1.6rem;
      color: rgba(60, 191, 255, 1);
      line-height: 1.7rem;
      letter-spacing: 0.3rem;
      margin: 7rem 0;
      text-align: center;
    }

    img {
      display: inline-block;

      &.mb {
        display: none;
      }
    }
  }

  #loginForm {
    margin-top: 5rem;
    width: 100%;
    text-align: center;
    transition: all 0.5s ease;

    /deep/ .el-input {
      margin-top: 1.6rem;
      .el-input__inner {
        height: 5rem;
        width: 100%;
        font-size: 1.8rem;
        line-height: 2.5rem;
      }

      .el-input__icon {
        line-height: 5rem;
      }
    }
    /deep/.el-select,
    .el-autocomplete {
      display: block;
    }
  }
}

.v-button {
  margin-top: 3rem;
  background: linear-gradient(
    90deg,
    rgba(97, 193, 254, 1) 0%,
    rgba(66, 139, 244, 1) 50%,
    rgba(97, 193, 254, 1) 100%
  );
  background-size: 200% 100%;
  transition: background 0.5s ease;
  box-shadow: 0px 6px 10px 0px rgba(74, 144, 226, 0.51);
  border-radius: 2px;
  width: 100%;
  height: 5rem;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #ffffff;
  line-height: 2.5rem;

  &:hover {
    background-position-x: -100%;
  }
}

.v-forget {
  display: block;
  float: right;
  margin-top: 1.6rem;
  font-size: 1.6em;
  color: #9b9b9b;
  cursor: pointer;

  &:hover {
    color: #448ef5;
  }
}
.register {
  margin-top: 1.6rem;
  font-size: 14px;
  span:first-child {
    color: #909399;
  }
  span:last-child {
    color: #409eff;
    cursor: pointer;
  }
}
.modalinput {
  h3 {
    font-size: 1.6rem;
    color: #333;
    margin-bottom: 3rem;
    display: none;
  }

  p {
    font-size: 1.4rem;
    color: #6d6d6d;
    margin-top: 8rem;
    text-align: right;
    cursor: pointer;

    &:hover {
      color: #448ef5;
    }
  }
  /deep/ .el-input {
    .el-input__inner {
      height: 4.6rem;
      width: 100%;
      font-size: 1.6rem;
    }
  }
}

@media all and(max-width: 1024px) {
  .login-wrap > div {
    max-height: unset;
  }

  #banner {
    display: none !important;
  }

  #login {
    width: 100%;
    padding: 1.6rem;
    box-sizing: border-box;

    & > div {
      width: 100%;
    }

    #title {
      img {
        &.pc {
          display: none;
        }

        &.mb {
          display: inline-block;
        }
      }
    }

    #loginForm {
      width: inherit;
      margin-bottom: 5rem;
    }
  }
}
</style>
