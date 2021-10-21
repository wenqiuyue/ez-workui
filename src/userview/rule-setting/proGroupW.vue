<template>
  <XModal
    name="proGroupWindow"
    :width="'35%'"
    height="35%"
    @beforeClose="beforeClose"
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
        label-width="130px"
      >
        <!-- 必填项 -->
        <el-row>
          <el-col :sm="24" :md="24">
            <el-form-item label="名称：" prop="name" style="width: 100%">
              <el-input
                v-model="formData.name"
                placeholder="请填写部门名称"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">
                {{ formData.name }}
              </div>
            </el-form-item>
            <el-form-item
              label="是否是默认部门："
              prop="isdefault"
              style="width: 100%"
            >
              <el-radio-group v-model="formData.isdefault" v-if="editState">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
              <div v-else class="state-see">
                {{ formData.isdefault ? "是" : "否" }}
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
        name: "", // 名称
        isdefault: false,
      },
      Rules: {
        name: [
          {
            required: true,
            message: "请输入部门名称",
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
    // 改变窗口状态的，搭配index页 添加和编辑按钮
    changeEditState() {
      this.editState = this.indexData.type === "Add" ? true : false;
      if (this.indexData.row) {
        this.formData.name = this.indexData.row.Name;
        this.formData.id = this.indexData.departmentCode;
        this.formData.isdefault = this.indexData.row.IsDefault;
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
                isdefault: this.formData.isdefault,
              })
              .then((res) => {
                if (res.res == 0) {
                  this.$message({
                    message: `添加部门成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("proGroupWindow");
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
              isdefault: this.formData.isdefault,
            };
            this.$http
              .post("/ProgressGroup/EditProgressGroup.ashx", params)
              .then((result) => {
                if (result.res == 0) {
                  this.$message({
                    message: `编辑部门成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("proGroupWindow");
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
        isdefault: false,
      };
    },
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 1024px) {
}
</style>
