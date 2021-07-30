<template>
  <div class="systemRuleverSel">
    <el-dialog
      title="应用系统配置组"
      :visible.sync="dialogFormVisible"
      width="35%"
    >
      <el-form :model="form" label-position="top" v-loading="selLoading">
        <el-form-item label="系统配置组">
          <el-select
            v-model="form.tcId"
            placeholder="请选择系统配置组"
            style="width: 100%"
          >
            <el-option
              :label="item.ConfigName"
              :value="item.Id"
              v-for="item in options"
              :key="item.Id"
              ><span style="float: left">{{ item.ConfigName }}</span>
              <span style="float: right; color: #67c23a; font-size: 13px">{{
                item.IsStart ? "默认" : ""
              }}</span></el-option
            >
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfrim" :loading="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    teamValue: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      selLoading: false,
      loading: false,
      options: [],
      dialogFormVisible: false,
      form: {
        tcId: null,
      },
    };
  },
  methods: {
    /**
     * 打开弹窗
     */
    openModal() {
      this.dialogFormVisible = true;
      this.form.tcId = null;
      this.$nextTick(() => {
        this.getSystemSel();
      });
    },
    /**
     * 确认
     */
    handleConfrim() {
      if (!this.form.tcId) {
        this.$message({
          showClose: true,
          message: "请选择系统配置组！",
          type: "warning",
        });
        return;
      }
      this.loading = true;
      const data = {
        teamId: this.teamValue,
        tcId: this.form.tcId,
      };
      this.$http
        .post("/ConfigGroup/ApplySystemConfig.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.dialogFormVisible = false;
            this.$emit("success");
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     *获取系统配置选项
     */
    getSystemSel() {
      this.selLoading = true;
      this.$http
        .post("/ConfigGroup/GetTeamConfigSelect.ashx", {
          teamId: this.teamValue,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.options = resp.data;
          }
        })
        .finally(() => (this.selLoading = false));
    },
  },
};
</script>
<style lang="less" scoped>
.systemRuleverSel {
  /deep/.el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
