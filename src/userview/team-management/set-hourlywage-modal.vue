<template>
  <XModal
    name="hourlywageSetM"
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
        label-width="100px"
      >
        <!-- 必填项 -->
        <el-row>
          <el-col :sm="24" :md="24">
            <el-form-item label="类型：" prop="wagetype" style="width: 100%">
              <el-input
                v-model="formData.wagetype"
                placeholder="请填写类型"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">
                {{ formData.wagetype }}
              </div>
            </el-form-item>
            <el-form-item label="时薪：" prop="wage" style="width: 100%">
              <el-input
                v-model="formData.wage"
                placeholder="请填写时薪"
                v-if="editState"
                type="number"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">
                {{ formData.wage }}
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
    selUser: {
      type: Object,
      default: null,
    },
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
        wagetype: "", // 标签名称
        wage: "",
      },
      Rules: {
        wagetype: [
          {
            required: true,
            message: "请输入类型",
            trigger: "blur",
          },
          {
            min: 2,
            message: "至少2个字符",
            trigger: "blur",
          },
        ],
        wage: [
          {
            required: true,
            message: "请输入金额",
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
        this.formData.wagetype = this.indexData.row.WageType;
        this.formData.wage = this.indexData.row.Wage;
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
              .post("/Teams/MemberWage/SaveMemberWage.ashx", {
                memberId: this.selUser.UserId,
                wage: this.formData.wage,
                wagetype: this.formData.wagetype,
                teamId: this.teamValue,
              })
              .then((res) => {
                if (res.res == 0) {
                  this.$message({
                    message: `添加时薪成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("hourlywageSetM");
                  this.$emit("eventComfirm");
                } else {
                  this.submiting();
                }
              });
          } else {
            let params = {
              memberId: this.selUser.UserId,
              wage: this.formData.wage,
              wagetype: this.formData.wagetype,
              teamId: this.teamValue,
              Id: this.formData.id,
            };
            this.$http
              .post("/Teams/MemberWage/SaveMemberWage.ashx", params)
              .then((result) => {
                if (result.res == 0) {
                  this.$message({
                    message: `编辑时薪成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("hourlywageSetM");
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
        wagetype: "",
        wage: "",
      };
    },
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 1024px) {
}
</style>
