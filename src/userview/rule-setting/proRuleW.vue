<template>
  <div>
    <XModel
      ref="ruleXmodal"
      name="ruleXmodal"
      width="1000px"
      height="600px"
      :title="operationName == 1 ? '添加规则 ' : '编辑规则'"
      :showCrossBtn="true"
      class="n-rule"
      @closed="init"
      @opened="beforeOpen"
    >
      <div class="n-content">
        <div class="rule-wrapper" v-loading="loading">
          <div class="item">
            <ul class="border">
              <li>
                <span>规则名称</span>
                <el-input v-model="loadForm.RuleName"></el-input>
              </li>
              <li>
                <span>对象类型</span>
                <el-select v-model="loadForm.rType">
                  <el-option label="部门" :value="1"></el-option>
                  <el-option label="员工" :value="2"></el-option>
                </el-select>
              </li>
              <li v-if="loadForm.rType == 2">
                <span>选择成员</span>
                <mb @Confirm="getUser" :arrays="loadForm.member"></mb>
              </li>
              <li v-if="loadForm.rType == 1">
                <span>规则作用部门</span>
                <el-select v-model="loadForm.g" multiple>
                  <el-option
                    v-for="(item, index) in processOptions"
                    :label="item.Name"
                    :key="index"
                    :value="item.ID"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <span>匹配的标记类型</span>
                <el-select v-model="loadForm.mk1" placeholder="请选择">
                  <el-option label="工作" value="工作"></el-option>
                  <el-option label="娱乐" value="娱乐"></el-option>
                  <el-option label="未知" value="未知"></el-option>
                </el-select>
              </li>
              <li>
                <span>不匹配的标记类型</span>
                <el-select v-model="loadForm.mk2" placeholder="请选择">
                  <el-option label="工作" value="工作"></el-option>
                  <el-option label="娱乐" value="娱乐"></el-option>
                  <el-option label="未知" value="未知"></el-option>
                </el-select>
              </li>
              <li class="row" style="margin-top: 1rem">
                <div
                  class="check-wrapper"
                  :style="loadForm.Automatic ? 'borderColor:#409eff' : ''"
                >
                  <el-checkbox v-model="loadForm.Automatic"
                    >自动匹配员工姓名</el-checkbox
                  >
                </div>
              </li>
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="row marginB">
                <div class="flex">
                  <span>进程名</span>
                  <div
                    class="check-wrapper"
                    :style="
                      loadForm.radio
                        ? 'borderColor:#409eff;width: 14rem;'
                        : 'width: 14rem'
                    "
                  >
                    <el-checkbox v-model="loadForm.radio"
                      >作用于所有进程</el-checkbox
                    >
                  </div>
                </div>
                <div class="add" @click="addMore(1)" v-if="!loadForm.radio">
                  <i class="el-icon-plus"></i>
                </div>
              </li>
            </ul>

            <div
              class="input"
              v-for="(item, index) in loadForm.pn"
              :key="index"
              v-if="!loadForm.radio"
            >
              <el-input v-model="loadForm.pn[index]"></el-input>
              <i
                class="hiFont hi-delete"
                @click="
                  () => {
                    loadForm.pn.splice(index, 1);
                  }
                "
              ></i>
            </div>
          </div>
          <div class="item">
            <ul>
              <li class="row marginB">
                <span>匹配的关键词名</span>
                <div class="add" @click="addMore(2)">
                  <i class="el-icon-plus"></i>
                </div>
              </li>
            </ul>
            <div
              class="input"
              v-for="(item, index) in loadForm.word"
              :key="index"
            >
              <el-input v-model="loadForm.word[index]"></el-input>
              <i
                class="hiFont hi-delete"
                @click="
                  () => {
                    loadForm.word.splice(index, 1);
                  }
                "
              ></i>
            </div>
          </div>
        </div>
        <div class="rule-footer">
          <div class="btns">
            <el-button
              type="info"
              @click="
                () => {
                  $modal.hide('ruleXmodal');
                }
              "
              >取 消</el-button
            >
            <el-button type="primary" @click="submit()"
              ><i class="el-icon-loading" v-if="subLoading"></i>确 定</el-button
            >
          </div>
        </div>
      </div>
    </XModel>
  </div>
</template>

<script>
export default {
  components: {
    XModel: () => import("@/components/XModal"),
    mb: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  props: {
    teamValue: {
      type: Number,
      default: null,
    },
    operationName: {
      type: String | Number,
      default: 1,
    },
    activeItem: {
      type: String,
      default: "进程组",
    },
    id: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      loadForm: {
        word: [undefined, undefined, undefined, undefined, undefined],
        pn: [undefined, undefined, undefined, undefined, undefined],
        rType: 1,
        mk2: "未知",
        mk1: "未知",
        g: [],
        radio: false,
        Automatic: false,
        RuleName: "",
        member: [],
      },
      processOptions: [],
      user: [],
      copyForm: "",
      subLoading: false,
      loading: false,
    };
  },
  methods: {
    getUser(arr) {
      this.loadForm.member = arr;
    },
    async GetProgressGroup() {
      const resp = await this.$http.post(
        "/User/GetProgressGroupSelected.ashx",
        { teamId: this.teamValue }
      );
      if (resp.res == 0) {
        this.processOptions = resp.data;
      }
    },
    beforeOpen() {
      this.loading = false;
      this.GetProgressGroup();
      if (this.operationName == 2) {
        this.getDetail();
      }
    },
    getDetail() {
      this.loading = true;
      this.$http
        .get("/ProcessRules/ProcessRulesDetail.ashx", {
          params: { ruleId: this.id },
        })
        .then((res) => {
          if (res.res == 0) {
            this.loading = false;
            if (this.activeItem == "进程组") {
              this.loadForm.rType = 1;
              this.loadForm.g = res.data.PreocessGroup.map((m) => m.ID);
            } else {
              this.loadForm.rType = 2;
              this.user = [];
              this.loadForm.member = [];
              res.data.UserData.forEach((item) => {
                this.loadForm.member.push({
                  Name: item.Name,
                  UsId: item.UsId,
                });
              });
            }
            if (res.data.ProgressNames && res.data.ProgressNames.length) {
              res.data.ProgressNames.forEach((item, index) => {
                this.loadForm.pn[index] = item;
              });
              this.loadForm.radio = false;
            } else {
              this.loadForm.radio = true;
            }
            if (res.data.FormNames && res.data.FormNames.length) {
              res.data.FormNames.forEach((item, index) => {
                this.loadForm.word[index] = item;
              });
            }
            this.loadForm.RuleName = res.data.RuleName;
            this.loadForm.mk1 =
              res.data.MarkInCheck == "上班" ? "工作" : res.data.MarkInCheck;
            this.loadForm.mk2 =
              res.data.MarkOutCheck == "上班" ? "工作" : res.data.MarkOutCheck;
            this.loadForm.Automatic = res.data.Automatic ? false : true;
            this.loadForm.t = this.activeItem;
            this.copyForm = JSON.stringify(this.loadForm);
            Object.assign({}, this.loadForm);
          }
        });
    },
    init() {
      Object.assign(this.$data, this.$options.data());
    },
    addMore(type) {
      if (type == 1) {
        let arr = this.loadForm.pn.filter((item) => {
          return item == undefined || "";
        });
        if (!arr.length) {
          this.loadForm.pn.unshift(undefined);
        }
      } else {
        let arr = this.loadForm.word.filter((item) => {
          return item == undefined || "";
        });
        if (!arr.length) {
          this.loadForm.word.unshift(undefined);
        }
      }
    },
    filterParams(params) {
      let _params = { ...params };

      for (let key in _params) {
        if (_params[key] instanceof Array) {
          _params[key] = JSON.stringify(_params[key]);
        }
      }
      return _params;
    },
    check() {},
    //提交
    submit() {
      if (this.subLoading) {
        return;
      }
      let bool = this.copyForm == JSON.stringify(this.loadForm);
      if (bool && this.operationName == 2) {
        this.$modal.hide("ruleXmodal");
        return;
      } else {
        let word = [];
        this.loadForm.word.forEach((item) => {
          //关键词
          if (item) {
            word.push(item);
          }
        });
        let pn = [];
        this.loadForm.pn.forEach((item) => {
          //进程名
          if (item) {
            pn.push(item);
          }
        });
        let flag = false;
        let str = "";
        if (!this.loadForm.radio && pn.length == 0) {
          flag = true;
          str = "请至少输入一个进程名称";
        }
        if (this.loadForm.g.length == 0 && this.rType == 1) {
          flag = true;
          str = "请选择作用部门";
        }
        if (this.loadForm.member.length == 0 && this.rType == 2) {
          flag = true;
          str = "请选择成员";
        }
        if (!this.loadForm.RuleName) {
          flag = true;
          str = "请输入规则名称";
        }
        if (flag) {
          this.$message({
            type: "warning",
            message: str,
          });
          return;
        }

        this.subLoading = true;
        let params = {
          Id: this.id,
          RuleName: this.loadForm.RuleName,
          ProgressGroupIds: this.loadForm.rType == 1 ? this.loadForm.g : [],
          UserIds:
            this.loadForm.rType == 2
              ? this.loadForm.member.map((item) => item.UsId)
              : [],
          ProgressNames: this.loadForm.radio ? [] : pn,
          FormNames: word,
          MarkOutCheck: this.loadForm.mk2,
          MarkInCheck: this.loadForm.mk1,
          Automatic: this.loadForm.Automatic,
          teamId: this.teamValue,
        };
        params = this.filterParams(params);
        this.$http
          .get("/ProcessRules/SaveProcessRules.ashx", {
            params,
          })
          .then((res) => {
            this.subLoading = false;
            if (res.res == 0) {
              this.$modal.hide("ruleXmodal");
              this.$emit("update");
              this.$message({
                type: "success",
                message: this.operationName == 1 ? "添加成功" : "修改成功",
              });
            }
          });
      }
    },
  },
  mounted() {},
  created() {},
};
</script>

<style lang="less" scoped="scoped">
/deep/.rule-xmodal {
  .tit {
    border-bottom: 1px solid #eee;
  }

  .el-select {
    width: 100%;
  }

  .el-input {
    width: 90%;
  }

  .add-btn-input {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .el-input {
      width: 75% !important;
    }
  }

  .add-btn,
  .delete-btn {
    font-size: 2.3rem;
    margin-left: 1rem;
    color: #6d6d6d;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }

  /deep/#mem-public {
    .mem-imgs {
      .showDel {
        p {
          line-height: 4rem;
          font-size: 1.5rem;
          width: 5rem;
        }
      }
    }
  }

  /deep/.el-form-item__content {
    width: 74%;
  }
}

.n-rule {
  box-sizing: border-box;

  /deep/.tit {
    border-bottom: 1px solid #ccc;
  }

  /deep/.el-input__inner {
    height: 3.2rem;
    line-height: 3.2rem;
    border: 1px solid #ccc !important;
  }

  /deep/.el-input__icon {
    line-height: 3.2rem;
  }

  .border {
    /deep/.el-input__inner {
      background: #fff;
      border: 1px solid #ccc !important;
    }
  }

  .n-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .rule-wrapper {
    display: flex;
    border-bottom: 1px solid #ccc;
    height: 46rem;

    .item {
      flex: 1;
      box-sizing: border-box;
      padding: 1rem;
      border-right: 1px solid #ccc;
      overflow: auto;

      ul {
        li {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;

          span {
            font-size: 1.5rem;
            color: #4a4a4a;
            font-weight: bold;
            margin-bottom: 1rem;
          }
        }

        .row {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          span {
            margin-bottom: 0;
          }

          /deep/.el-checkbox__inner {
            border-radius: 50%;
          }

          /deep/.el-checkbox__label {
            top: 0.5px;
          }

          .check-wrapper {
            width: 15rem;
            height: 3rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .marginB {
          margin-bottom: 1rem;
        }
        .flex {
          display: flex;
          align-items: center;
          span {
            margin-right: 1rem;
          }
        }

        .add {
          width: 3.5rem;
          height: 2.5rem;
          border: 1px solid #bbb;
          border-radius: 0.4rem;
          text-align: center;
          cursor: pointer;

          i {
            color: #4a4a4a;
            font-size: 2rem;

            line-height: 2.5rem;
          }

          &:hover {
            border-color: #409eff;

            i {
              color: #409eff;
            }
          }
        }
      }
    }

    .input {
      display: flex;
      margin-bottom: 1rem;
      align-items: center;

      .el-input {
        width: 85%;
        // width: 22rem;
        margin-right: 10%;
      }

      i {
        flex: 0 0 3.5rem;
        text-align: center;
        font-size: 2rem;
        color: #4a4a4a;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .rule-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: calc(100% - 46rem);
    box-sizing: border-box;
    padding: 1rem;

    .btns {
      /deep/.el-button {
        padding: 8px 25px;
      }
    }
  }
}
</style>
