<template>
  <div>
    <XModel
      ref="actionRuleXmodal"
      name="actionRuleXmodal"
      width="800px"
      height="600px"
      :title="operationName == 1 ? '添加行为规则 ' : '编辑行为规则'"
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
                <span>行为名称</span>
                <el-input v-model="loadForm.Behavior"></el-input>
              </li>
              <li>
                <span>作用类型</span>
                <el-select v-model="loadForm.rType">
                  <el-option label="部门" :value="1"></el-option>
                  <el-option label="员工" :value="2"></el-option>
                </el-select>
              </li>
              <li v-if="loadForm.rType == 2">
                <span>规则作用成员</span>
                <mb
                  @Confirm="getUser"
                  :arrays="loadForm.UserIds"
                  :teamId="teamValue"
                ></mb>
              </li>
              <li v-if="loadForm.rType == 1">
                <span>规则作用部门</span>
                <el-select v-model="loadForm.ProgressGroupIds" multiple>
                  <el-option
                    v-for="(item, index) in processOptions"
                    :label="item.Name"
                    :key="index"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <span匹配的行为类型</span>
                <el-select v-model="loadForm.BehaviorInCheck" placeholder="请选择">
                  <el-option
                    :label="item.key"
                    :value="item.key"
                    v-for="(item, index) in $D.LIST('Behavior_Type')"
                    :key="index"
                  ></el-option>
                </el-select>
              </li>          
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="row marginB">
                <span>匹配的关键词名</span>
                <div class="add" @click="addMore">
                  <i class="el-icon-plus"></i>
                </div>
              </li>
            </ul>
            <div
              class="input"
              v-for="(item, index) in loadForm.Words"
              :key="index"
            >
              <el-input v-model="loadForm.Words[index]"></el-input>
              <i
                class="hiFont hi-delete"
                @click="
                  () => {
                    loadForm.Words.splice(index, 1);
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
                  $modal.hide('actionRuleXmodal');
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
    //规则版本信息
    selRow: {
      type: Object,
      default: null,
    },
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
      default: "部门",
    },
    id: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      loadForm: {
        Words: [undefined, undefined, undefined, undefined, undefined],
        ProgressGroupIds: [],
        Behavior: null,
        BehaviorInCheck: null,
        rType: 1,
        UserIds:[]
      },
      processOptions: [],
 
      copyForm: "",
      subLoading: false,
      loading: false,
    };
  },
  methods: {
    getUser(arr) {
      this.loadForm.UserIds = arr;
    },
    async GetProgressGroup() {
      const resp = await this.$http.post(
        "/User/GetProgressGroupSelected.ashx",
        { teamId: this.teamValue, configId: this.selRow.Id }
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
        .post("/BehaviorAnalyse/GetBehaviorAnalyseDetail.ashx", {
         Id: this.id, teamId: this.teamValue
        })
        .then((res) => {
          if (res.res == 0) {
            this.loading = false;
            if (this.activeItem == "部门") {
              this.loadForm.rType = 1;
              this.loadForm.ProgressGroupIds = res.data.PreocessGroup.map((m) => m.ID);
            } else {
              this.loadForm.rType = 2;
         
              this.loadForm.UserIds = [];
              res.data.UserData.forEach((item) => {
                this.loadForm.UserIds.push({
                  Name: item.Name,
                  UsId: item.UsId,
                });
              });
            }
            this.loadForm.Behavior = res.data.Behavior;
            this.loadForm.BehaviorInCheck = res.data.BehaviorInCheck;
            this.loadForm.Words = res.data.Words;       
          }
        });
    },
    init() {
      Object.assign(this.$data, this.$options.data());
    },
    addMore() {
      let arr = this.loadForm.Words.filter((item) => {
        return item == undefined || "";
      });
      if (!arr.length) {
        this.loadForm.Words.unshift(undefined);
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
        this.$modal.hide("actionRuleXmodal");
        return;
      } else {
        let word = [];
        this.loadForm.Words.forEach((item) => {
          //关键词
          if (item) {
            word.push(item);
          }
        });
     
        let flag = false;
        let str = "";
        if (this.loadForm.ProgressGroupIds.length == 0 && this.rType == 1) {
          flag = true;
          str = "请选择作用部门";
        }
        if (this.loadForm.UserIds.length == 0 && this.rType == 2) {
          flag = true;
          str = "请选择作用成员";
        }
        if (!this.loadForm.Behavior) {
          flag = true;
          str = "请输入行为名称";
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
          Behavior: this.loadForm.Behavior,
          ProgressGroupIds: this.loadForm.rType == 1 ? this.loadForm.ProgressGroupIds : [],
          UserIds:
            this.loadForm.rType == 2
              ? this.loadForm.UserIds.map((item) => item.UsId)
              : [],
          BehaviorInCheck: this.loadForm.BehaviorInCheck,
          teamId: this.teamValue,
          configId: this.selRow.Id,
          Words: word,
        };
        params = this.filterParams(params);
        this.$http
          .get("/BehaviorAnalyse/SaveBehaviorAnalyse.ashx", {
            params,
          })
          .then((res) => {
            this.subLoading = false;
            if (res.res == 0) {
              this.$modal.hide("actionRuleXmodal");
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
