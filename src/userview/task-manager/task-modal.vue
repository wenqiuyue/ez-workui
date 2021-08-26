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
              label="执行人："
              prop="userName"
              style="width: 100%"
              v-if="!editState"
            >
              <div class="user">
                <el-avatar
                  size="small"
                  :src="imgChange(formData.userPic)"
                ></el-avatar>
                <span>{{ formData.userName }}</span>
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
                {{ formData.status ? "启用" : "禁用" }}
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
            <el-form-item label="任务历史：" v-if="!editState" class="progress">
              <el-timeline v-if="formData.progress && formData.progress.length">
                <el-timeline-item
                  :timestamp="`${item.CreateTime.timeFormat(
                    'yyyy年MM月dd日 HH:mm'
                  )} 至 ${item.UpdateTime.timeFormat('yyyy年MM月dd日 HH:mm')}`"
                  placement="top"
                  v-for="(item, index) in formData.progress"
                  :key="index"
                >
                  <el-card>
                    <p class="task_con">
                      {{ item.Describe }}
                    </p>
                    <el-image
                      style="max-width: 160px"
                      :src="cmurl + item.Img"
                      alt=""
                      :preview-src-list="[cmurl + item.Img]"
                    >
                    </el-image>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
              <div v-else>无历史数据</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </c-win-tmp>
  </XModal>
</template>

<script>
import { imgChange } from "@/commons";
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
        progress: [],
        userName: null,
        userPic: null,
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
  computed: {
    cmurl() {
      return process.env.VUE_APP_CMURL;
    },
  },
  created() {},
  methods: {
    imgChange,
    opened() {
      this.$nextTick(() => {
        this.formData.teamValue = this.teamValue;
      });
    },
    // 改变窗口状态的，搭配index页 添加和编辑按钮
    changeEditState() {
      this.editState = this.indexData.type === "Add" ? true : false;
      if (this.indexData.row) {
        this.formData.task = this.indexData.row.Title;
        this.formData.status = this.indexData.row.Enable;
        this.formData.describe = this.indexData.row.Describe;
        this.formData.CreatTime = this.indexData.row.CreateTime;
        this.formData.progress = this.indexData.row.Taskhistorys;
        this.formData.userName = this.indexData.row.UserName;
        this.formData.userPic = this.indexData.row.Picture;
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
              .post("/Task/AddTask.ashx", {
                teamId: this.formData.teamValue,
                title: this.formData.task,
                Describe: this.formData.describe,
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
              Id: this.formData.id,
              teamId: this.formData.teamValue,
              title: this.formData.task,
              describe: this.formData.describe,
            };
            this.$http
              .post("/Task/EditTask.ashx", params)
              .then((result) => {
                if (result.res == 0) {
                  this.$message({
                    message: `编辑任务成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("taskM");
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
      Object.assign(this.$data, this.$options.data());
      // this.formData = {
      //   id: "", // 编辑窗口才用ID
      //   task: "",
      //   status: "",
      //   describe: "",
      //   CreatTime: "",
      //   teamValue: "",
      // };
    },
  },
};
</script>

<style lang="less" scoped>
.taskM {
  /deep/.el-form {
    .el-form-item__label {
      color: #303133;
    }
    .progress {
      display: flex;
      flex-direction: column;
      .el-form-item__label {
        font-weight: bold;
        color: #303133;
      }
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
    .user {
      display: flex;
      flex-direction: row;
      align-items: center;
      .el-avatar {
        margin-right: 5px;
      }
    }
  }
  .form-box .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
