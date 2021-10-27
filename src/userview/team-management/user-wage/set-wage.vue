<template>
  <XModal
    name="setWage"
    :width="'35%'"
    height="35%"
    @beforeClose="beforeClose"
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
            <el-form-item label="类型：" prop="wagetype">
              <el-select
                v-if="editState"
                v-model="formData.wagetype"
                placeholder="请选择时薪"
                style="width: 100%"
              >
                <el-option
                  v-for="item in wageOptions"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
              <div
                v-else-if="wageOptions && wageOptions.length"
                class="state-see"
              >
                {{ wageOptions.find((m) => m.Id == formData.wagetype).Name }}
              </div>
            </el-form-item>
            <el-form-item label="金额：" prop="wage">
              <el-input
                style="width: 100%"
                v-model="formData.wage"
                placeholder="请填写金额"
                v-if="editState"
                clearable
                type="number"
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
      attend: false,
      wageOptions: [],
      formData: {
        id: "", // 编辑窗口才用ID
        wagetype: "", // 时薪类型
        wage: "",
      },
      Rules: {
        wagetype: [
          {
            required: true,
            message: "请选择类型",
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
    opened() {
      this.$nextTick(() => {
        this.getWages();
      });
    },
    /**
     * 获取时薪
     */
    getWages() {
      this.loading = true;
      this.$http
        .post("/Teams/MemberWage/GetMemberWageType.ashx", {
          teamId: this.teamValue,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.wageOptions = resp.data.Data;
          }
        })
        .finally(() => (this.loading = false));
    },
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
                wagetype: this.formData.wagetype,
                wage: this.formData.wage,
                teamId: this.teamValue,
                Id: null,
                memberId: this.selUser.UserId,
              })
              .then((res) => {
                if (res.res == 0) {
                  this.$message({
                    message: `添加时薪成功`,
                    type: "success",
                  });
                  this.submiting();
                  this.$modal.hide("setWage");
                  this.$emit("eventComfirm");
                } else {
                  this.submiting();
                }
              });
          } else {
            let params = {
              wagetype: this.formData.wagetype,
              wage: this.formData.wage,
              teamId: this.teamValue,
              Id: this.formData.id,
              memberId: this.selUser.UserId,
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
                  this.$modal.hide("setWage");
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
