<template>
  <XModal
    name="taskM"
    :width="'45%'"
    height="70%"
    @beforeClose="beforeClose"
    class="taskM"
    @opened="opened"
  >
    <c-win-tmp
      ref="winTmp"
      v-loading="loading"
      :indexData="indexData"
      v-model="editState"
      @topSubmit="comSubmit"
      @comfirmClick="comSubmit"
      @editClick="editClick"
    >
      <el-form
        slot="form"
        ref="editForm"
        :model="formData"
        :rules="Rules"
        label-width="100px"
      >
        <!-- 必填项 -->
        <el-row>
          <el-col :sm="24" :md="24">
            <el-form-item label="任务：" prop="task" style="width: 100%">
              <el-input
                v-model="formData.task"
                placeholder="请填写任务"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">
                {{ formData.task }}
              </div>
            </el-form-item>
            <el-form-item
              label="团队："
              prop="teamValue"
              style="width: 100%"
              v-if="editState"
            >
              <el-select
                v-model="formData.teamValue"
                filterable
                placeholder="请选择团队"
                :style="{ width: comWidth }"
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
            <el-form-item
              label="状态："
              prop="status"
              style="width: 100%"
              v-if="!editState"
            >
              <div class="state-see">
                {{ formData.status }}
              </div>
            </el-form-item>
            <el-form-item label="描述：" prop="describe" style="width: 100%">
              <el-input
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 7 }"
                v-model="formData.describe"
                placeholder="请填写任务描述"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">
                {{ formData.describe }}
              </div>
            </el-form-item>
            <el-form-item label="任务进展：" v-if="!editState" class="progress">
              <el-timeline>
                <el-timeline-item
                  timestamp="2020年12月2日 13:21"
                  placement="top"
                  v-for="(item, index) in 3"
                  :key="index"
                >
                  <el-card>
                    <p class="task_con">
                      单元测试是软件开发过程中要进行的最基本的测试，属于白盒测试范围，一般情况下是在开发人员完成了某个单独模块的编码之后做的测试。它的目的是检查软件编码的正确性以及一些规范性测试，站在开发人员的角度上来查找软件所存在的BUG并记录下产生BUG的原因，以便开发人员进行修改。这样可以在很大程度上减少集成以后而出现的BUG。
                    </p>
                    <el-image
                      style="max-width: 160px"
                      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                      alt=""
                      :preview-src-list="[
                        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                      ]"
                    >
                    </el-image>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </c-win-tmp>
  </XModal>
</template>

<script>
export default {
  props: {
    indexData: {
      type: Object,
      default: null,
    },
    teamValue: {
      type: Number,
      default: 0,
    },
    teamOptions: {
      type: Array,
      default: null,
    },
  },
  components: {
    XModal: () => import("@/components/XModal"),
    CWinTmp: () => import("@/components/CWinTmp"),
  },

  data() {
    return {
      loading: false,
      editState: false,
      comWidth: "95%",
      attend: false,

      formData: {
        id: "", // 编辑窗口才用ID
        task: "",
        status: "",
        describe: "",
        CreatTime: "",
        teamValue: "",
      },
      Rules: {
        name: [
          {
            required: true,
            message: "请输入任务",
            trigger: "blur",
          },
          {
            min: 2,
            message: "至少2个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    opened() {
      this.$nextTick(() => {
        this.formData.teamValue = this.teamValue;
      });
    },
    // 改变窗口状态的，搭配index页 添加和编辑按钮
    changeEditState() {
      this.editState = this.indexData.type === "Add" ? true : false;
      if (this.indexData.row) {
        this.formData.task = this.indexData.row.task;
        this.formData.status = this.indexData.row.status;
        this.formData.describe = this.indexData.row.describe;
        this.formData.CreatTime = this.indexData.row.CreatTime;
        this.formData.id = this.indexData.departmentCode;
      }
    },

    // 提交... 细节
    submiting() {
      if (this.formData.id) {
        this.$refs.winTmp.toggleComfirm();
      } else {
        this.$refs.winTmp.toggleSubmit();
      }
    },
    // 子组件提交共同的接口
    comSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.submiting();

          if (!this.formData.id) {
            this.$http
              .post("/ProgressGroup/AddProgressGroup.ashx", {
                name: this.formData.name,
                configId: this.selRow.Id,
                teamId: this.teamValue,
              })
              .then((res) => {
                if (res.res == 0) {
                  this.$message({
                    message: `添加任务成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("taskM");
                  this.$emit("eventComfirm");
                } else {
                  this.submiting();
                }
              });
          } else {
            let params = {
              id: this.formData.id, // 添加时值是 undefined
              name: this.formData.name,
              configId: this.selRow.Id,
              teamId: this.teamValue,
            };
            this.$http
              .post("/ProgressGroup/EditProgressGroup.ashx", params)
              .then((result) => {
                if (result.res == 0) {
                  this.$message({
                    message: `编辑任务成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("wordsM");
                  this.$emit("eventComfirm");
                } else {
                  this.submiting();
                }
              })
              .catch(() => {});
          }
        } else {
          return false;
        }
      });
    },
    // 子组件事件3
    editClick() {
      this.$refs.editForm.clearValidate();
      if (this.editState === false) this.changeEditState();
    },

    // 关闭弹层前，重置数据
    beforeClose() {
      this.attend = false;
      this.loading = false;
      this.formData = {
        id: "", // 编辑窗口才用ID
        task: "",
        status: "",
        describe: "",
        CreatTime: "",
        teamValue: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.taskM {
  /deep/.el-form {
    .el-form-item__label {
      font-weight: bold;
      color: #303133;
    }
    .progress {
      display: flex;
      flex-direction: column;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
    .el-card {
      .el-card__body {
        padding: 1rem;
        .task_con {
          line-height: 30px;
          margin-bottom: 5px;
        }
        img {
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
