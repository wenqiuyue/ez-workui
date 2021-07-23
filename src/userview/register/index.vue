<template>
  <!-- 李俊豪 -->
  <div class="register-wrap">
    <div>
      <img id="banner" src="@/assets/img/ll.jpg" />
      <div id="register">
        <div>
          <div id="registerForm" @keyup.enter="register">
            <div class="title">
              <img class="pc" src="@/assets/main/main.png" />
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item prop="Name">
                <el-input
                  v-model="ruleForm.Name"
                  placeholder="请输入你的姓名"
                  :autofocus="true"
                  suffix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
              <el-form-item prop="Pwd">
                <el-input
                  placeholder="请输入密码"
                  v-model="ruleForm.Pwd"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item prop="Phone">
                <el-input
                  v-model="ruleForm.Phone"
                  placeholder="请输入电话号码"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="addres"
                :class="`emali ${timer ? ' notgetcode' : ''}`"
              >
                <el-input v-model="ruleForm.addres" placeholder="请输入邮箱"
                  ><div slot="append" @click="handleGetCode">
                    <i class="el-icon-loading" v-if="codeLoading"></i>
                    {{ timer ? `剩余${count}秒` : "获取验证码" }}
                  </div></el-input
                >
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="ruleForm.code"
                  placeholder="请输入邮箱验证码"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="hp-btn">
              <el-button class="v-button" @click="register" :loading="loading"
                >注册</el-button
              >
            </div>
            <div class="register">
              <span>已有账号？</span>
              <span @click="handleLogin">直接登录</span>
            </div>
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
      timer: null,
      count: null,

      codeLoading: false, //获取验证码加载
      loading: false,
      ruleForm: {
        Name: null,
        Pwd: null,
        Phone: null,
        addres: null,
        code: null,
      },
      rules: {
        Name: [
          {
            required: true,
            message: "请输入你的姓名",
            trigger: "blur",
          },
        ],
        Pwd: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur",
          },
        ],
        // Name: [
        //   {
        //     required: true,
        //     message: "请输入昵称",
        //     trigger: "blur",
        //   },
        // ],
        Phone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur",
          },
        ],
        addres: [
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
        code: [
          {
            required: true,
            message: "请输入邮箱验证码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    /**
     * 获取邮箱验证码
     */
    handleGetCode() {
      if (this.timer) {
        return;
      }
      this.$refs.ruleForm.validateField("addres", (email_check) => {
        if (email_check) {
          return;
        } else {
          this.codeLoading = true;
          this.$http
            .post("/User/SendEmailVerificationCode.ashx", {
              email: this.ruleForm.addres,
            })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  showClose: true,
                  message: "验证码发送成功",
                  type: "success",
                });
                this.getCode();
              }
            })
            .finally(() => (this.codeLoading = false));
        }
      });
    },
    /**
     * 点击登录
     */
    handleLogin() {
      this.$router.push("/");
    },
    /**
     * 注册
     */
    register() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http
            .post("/User/Register.ashx", this.ruleForm)
            .then((req) => {
              if (req.res == 0) {
                this.$message({
                  message: "注册成功",
                  type: "success",
                });
                this.$router.push("/");
              }
            })
            .finally(() => (this.loading = false))
            .catch((err) => {
              console.log(err);
            });
        } else {
          return;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.register-wrap {
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
  width: 45%;
  background: linear-gradient(
    180deg,
    rgba(80, 187, 254, 1) 0%,
    rgba(75, 158, 254, 1) 100%
  );
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
}

#register {
  width: 60%;
  display: flex;
  justify-content: center;
  // align-items: center;

  & > div {
    width: 68%;
  }

  #registerForm {
    margin-top: 2rem;
    width: 100%;
    text-align: center;
    transition: all 0.5s ease;
    .title {
      margin-bottom: 2rem;
      img {
        height: 90px;
      }
    }
    /deep/ .el-input {
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
    /deep/.emali {
      .el-input-group__append {
        background-color: #409eff;
        color: #ffffff;
        cursor: pointer;
      }
    }
    /deep/.notgetcode {
      .el-input-group__append {
        background-color: #ebeef5;
        color: #909399;
        cursor: no-drop;
      }
    }
  }
}

.v-button {
  margin-top: 2rem;
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
  .register-wrap > div {
    max-height: unset;
  }

  #banner {
    display: none !important;
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
  }

  #register {
    width: 100%;
    padding: 1.6rem;
    box-sizing: border-box;

    & > div {
      width: 100%;
    }

    #registerForm {
      width: inherit;
      margin-bottom: 5rem;
    }
  }
}
</style>
