<template>
  <!-- 李俊豪 -->
  <div class="reset-password">
    <div>
      <div id="banner"></div>
      <div id="reset">
        <div>
          <div id="title">
            <h3>
              <img class="pc" src="@/assets/main/main.png" />
              <img class="mb" src="@/assets/main/main_mb.png" />
            </h3>
          </div>
          <div id="resetForm" @keyup.enter="reset">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item prop="oldPwd">
                <el-input
                  v-model="ruleForm.oldPwd"
                  placeholder="请输入旧密码"
                  :autofocus="true"
                ></el-input>
              </el-form-item>
              <el-form-item prop="newPwd">
                <el-input
                  v-model="ruleForm.newPwd"
                  placeholder="请输入新密码"
                ></el-input>
              </el-form-item>
              <el-form-item prop="secPwd">
                <el-input
                  v-model="ruleForm.secPwd"
                  placeholder="请输入确认密码"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="hp-btn">
              <el-button class="v-button" @click="reset" :loading="loading"
                >修改密码</el-button
              >
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
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      ruleForm: {
        oldPwd: null,
        newPwd: null,
        secPwd: null,
      },
      rules: {
        oldPwd: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur",
          },
        ],
        newPwd: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
        ],
        secPwd: [
          {
            validator: validatePass,
            required: true,
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    reset() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http
            .post("/User/personPwd.ashx", this.ruleForm)
            .then((res) => {
              if (res.res == 0) {
                this.$message.success("修改密码成功返回登录页面");
                this.$router.push("/");
              } else {
                this.$message.error(res.msg);
              }
            })
            .finally(() => (this.loading = false));
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.reset-password {
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

#reset {
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

  #resetForm {
    margin-top: 5rem;
    width: 100%;
    text-align: center;
    transition: all 0.5s ease;

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

@media all and(max-width: 1024px) {
  .reset-password > div {
    max-height: unset;
  }

  #banner {
    display: none !important;
  }

  #reset {
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

    #resetForm {
      width: inherit;
      margin-bottom: 5rem;
    }
  }
}
</style>
