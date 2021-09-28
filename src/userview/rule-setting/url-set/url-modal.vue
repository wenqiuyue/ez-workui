<template>
  <XModal name="urlM" :width="'35%'" height="35%" @beforeClose="beforeClose">
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
            <el-form-item label="URL：" prop="name" style="width: 100%">
              <el-input
                v-model="formData.name"
                placeholder="请填写URL地址"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">
                {{ formData.name }}
              </div> </el-form-item
            ><el-form-item label="URL类型：" prop="type" style="width: 100%">
              <el-input
                v-model="formData.type"
                placeholder="请填写类型"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">
                {{ formData.type }}
              </div>
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
    }, //规则版本信息
    selRow: {
      type: Object,
      default: null,
    },
    teamValue: {
      type: Number,
      default: 0,
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
        name: "", // 敏感词
        type: "", // 类型
      },
      Rules: {
        name: [
          {
            required: true,
            message: "请输入URL地址",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请输入URL地址类型",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 改变窗口状态的，搭配index页 添加和编辑按钮
    changeEditState() {
      this.editState = this.indexData.type === "Add" ? true : false;
      if (this.indexData.proName) {
        this.formData.name = this.indexData.proName;
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
              .post("/SensitiveWord/AddSensitiveWord.ashx", {
                name: this.formData.name,
                configId: this.selRow.Id,
                teamId: this.teamValue,
              })
              .then((res) => {
                if (res.res == 0) {
                  this.$message({
                    message: `添加URL地址成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("wordsM");
                  this.$emit("eventComfirm");
                } else {
                  this.submiting();
                }
              });
          } else {
            let params = {
              Id: this.formData.id, // 添加时值是 undefined
              name: this.formData.name,
              configId: this.selRow.Id,
              teamId: this.teamValue,
            };
            this.$http
              .post("/SensitiveWord/EditSensitiveWord.ashx", params)
              .then((result) => {
                if (result.res == 0) {
                  this.$message({
                    message: `编辑URL地址成功`,
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
        name: "", // 标签名称
      };
    },
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 1024px) {
}
</style>
