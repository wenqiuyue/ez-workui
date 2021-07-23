<template>
  <XModal name="versionModal" :width="'35%'" height="60%">
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
              <div v-else class="state-see">{{ formData.name }}</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="时长：" prop="period" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.period"
                placeholder="请填写时长"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">天</template></el-input
              >
              <div v-else class="state-see">{{ formData.period }}天</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item
              label="可加入人数："
              prop="capacity"
              style="width: 100%"
            >
              <el-input
                type="number"
                v-model="formData.capacity"
                placeholder="请填写可加入人数"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">人</template></el-input
              >
              <div v-else class="state-see">{{ formData.capacity }}人</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item
              label="存储量："
              prop="storageLimits"
              style="width: 100%"
            >
              <el-input
                type="number"
                v-model="formData.storageLimits"
                placeholder="请填写存储量"
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
              </el-input>
              <div v-else class="state-see">{{ formData.storageLimits }}</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24">
            <el-form-item label="价格：" prop="price" style="width: 100%">
              <el-input
                type="number"
                v-model="formData.price"
                placeholder="请填写价格："
                v-if="editState"
                :style="{ width: comWidth }"
                clearable
              >
                <template slot="append">元</template></el-input
              >
              <div v-else class="state-see">{{ formData.price }}元</div>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="24" v-if="!editState">
            <el-form-item
              label="创建时间："
              prop="creatTime"
              style="width: 100%"
            >
              <div class="state-see">
                {{
                  formData.creatTime
                    ? formData.creatTime.timeFormat("yyyy-MM-dd HH:mm")
                    : "--"
                }}
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
        name: null, // 名称
        price: null, //金额
        period: null, //期限
        capacity: null, //可加入人数
        storageLimits: 0, //存储量
        creatTime: null,
      },
      Rules: {
        name: [
          {
            required: true,
            message: "请输入版本名称",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
          },
        ],
        period: [
          {
            required: true,
            message: "请输入期限",
            trigger: "blur",
          },
        ],
        capacity: [
          {
            required: true,
            message: "请输入可加入人数",
            trigger: "blur",
          },
        ],
        storageLimits: [
          {
            required: true,
            message: "请输入存储量",
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
        this.formData.name = this.editObj.Name;
        this.formData.price = this.editObj.Price;
        this.formData.period = this.editObj.Period;
        this.formData.capacity = this.editObj.Capacity;
        this.formData.storageLimits = this.editObj.StorageLimits;
        this.formData.creatTime = this.editObj.CreatTime;
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
          if (this.indexData.name == "添加版本") {
            // this.formData.id
            params = {
              name: this.formData.name,
              price: this.formData.price,
              period: this.formData.period,
              capacity: this.formData.capacity,
              storageLimits: this.formData.storageLimits,
            };
            url = "/Management/VersionManagement/AddVersion.ashx";
            tipTxt = "添加";
          } else {
            params = {
              id: this.formData.id,
              name: this.formData.name,
              price: this.formData.price,
              period: this.formData.period,
              capacity: this.formData.capacity,
              storageLimits: this.formData.storageLimits,
            };
            url = "/Management/VersionManagement/EditVersion.ashx";
            tipTxt = "编辑";
          }
          this.$http
            .post(url, params)
            .then((result) => {
              if (result.res == 0) {
                this.$message({
                  message: `${tipTxt}版本成功`,
                  type: "success",
                });
                this.submiting();
                this.$modal.hide("versionModal");
                this.$emit("eventComfirm");
              } else {
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
