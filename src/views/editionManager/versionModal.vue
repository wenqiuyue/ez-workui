<template>
  <XModal name="versionModal" :width="'35%'" height="70%">
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
        label-width="110px"
      >
        <!-- 必填项 -->
        <el-row>
          <el-col :sm="24" :md="24">
            <el-form-item label="版本名称：" prop="name" style="width: 100%">
              <el-input
                v-model="formData.name"
                placeholder="请填写版本名称"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              ></el-input>
              <div v-else class="state-see">版本名称</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="时长：" prop="name" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.name"
                placeholder="请填写时长"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">年</template></el-input
              >
              <div v-else class="state-see">2年</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="可加入人数：" prop="name" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.name"
                placeholder="请填写可加入人数"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">人</template></el-input
              >
              <div v-else class="state-see">20人</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="存储空间：" prop="name" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.name"
                placeholder="请填写存储空间"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">G</template></el-input
              >
              <div v-else class="state-see">20G</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="服务器地址：" prop="name" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.name"
                placeholder="请填写服务器地址"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">192.168.1.1</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="购买人数：" prop="name" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.name"
                placeholder="请填写购买人数"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">人</template></el-input
              >
              <div v-else class="state-see">20人</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="价格：" prop="name" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.name"
                placeholder="请填写价格："
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">元</template></el-input
              >
              <div v-else class="state-see">20元</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </c-win-tmp>
  </XModal>
</template>

<script>
export default {
  props: ["indexData", "editObj"],
  components: {
    XModal: () => import("@/components/XModal"),
    CWinTmp: () => import("@/components/CWinTmp"),
  },
  data() {
    return {
      loading: false,
      editState: false,
      comWidth: "95%",
      formData: {
        id: "", // 编辑窗口才用ID
        name: "", // 名称
      },
      Rules: {
        name: [
          {
            required: true,
            message: "输入名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    stimeChange(val) {
      console.log(val);
    },
    // 改变窗口状态的，搭配index页 添加和编辑按钮
    changeEditState() {
      this.editState = this.indexData.type === "Add" ? true : false;
      if (this.editObj.Id) {
        this.formData.id = this.editObj.Id;
      } else {
        Object.assign(this.$data.formData, this.$options.data().formData);
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
          var params = null;
          var url = "";
          var tipTxt = "";
          if (!this.indexData.vacationCode) {
            // this.formData.id
            params = {
              name: this.formData.name,
              stime: this.formData.stime,
              etime:
                this.formData.changeType === 1
                  ? this.formData.stime
                  : this.formData.etime,
              // type: this.formData.type,
            };
            url = "/MGT/Personnel/Holiday/AddHoliday.ashx";
            tipTxt = "添加";
          } else {
            params = {
              hid: this.formData.id,
              name: this.formData.name,
              stime: this.formData.stime,
              etime:
                this.formData.changeType === 1
                  ? this.formData.stime
                  : this.formData.etime,
              // type: this.formData.type,
            };
            url = "/MGT/Personnel/Holiday/EditHoliday.ashx";
            tipTxt = "编辑";
          }
          console.log(params);
          this.$http
            .get(url, {
              params: params,
            })
            .then((result) => {
              if (result.res == 0) {
                this.$message({
                  message: `${tipTxt}节假成功`,
                  type: "success",
                });
                this.submiting();
                this.$modal.hide("versionModal");
                this.$emit("eventComfirm");
              } else {
                console.log(result);
                this.submiting();
              }
            })
            .catch(() => {});
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
  },
};
</script>

<style lang="less" scoped></style>
