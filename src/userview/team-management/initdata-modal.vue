<template>
  <div class="initdata-modal">
    <XModal
      ref="initdata"
      name="initdata"
      title="清理团队数据库数据"
      :showCrossBtn="true"
      confirmBtnText="确认"
      @onConfirm="onConfirm"
      @opened="opened"
      width="420px"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="清除类型">
          <el-select
            v-model="form.Type"
            placeholder="请选择清除类型"
            @change="typeChange"
          >
            <el-option
              :label="item.key"
              :value="item.value"
              v-for="(item, index) in $D.LIST('DBCS_Type')"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间循环" v-if="form.Type == 2">
          <el-select
            v-model="form.TimeLoopType"
            placeholder="请选择执行时间循环类型"
            @change="timeLoopTypeChange"
          >
            <el-option
              :label="item.key"
              :value="item.value"
              v-for="(item, index) in $D.LIST('DBCS_TimeLoopType')"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="间隔月份"
          v-if="form.TimeLoopType == 3 && form.Type == 2"
        >
          <el-select v-model="form.Time1" placeholder="请选择间隔月份">
            <el-option
              :label="`${item}月`"
              :value="item"
              v-for="(item, index) in 12"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="请选择日"
          v-if="form.TimeLoopType == 3 && form.Type == 2"
        >
          <el-select v-model="form.Time2" placeholder="请选择请选择日">
            <el-option
              :label="`${item}日`"
              :value="item"
              v-for="(item, index) in 31"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="请选择几周"
          v-if="form.TimeLoopType == 2 && form.Type == 2"
        >
          <el-select v-model="form.Time1" placeholder="请选择几周">
            <el-option
              :label="`${getWeek(item)}周`"
              :value="item"
              v-for="(item, index) in 5"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="请选择周"
          v-if="form.TimeLoopType == 2 && form.Type == 2"
        >
          <el-select v-model="form.Time2" placeholder="请选择周">
            <el-option
              :label="`周${getWeek(item)}`"
              :value="item"
              v-for="(item, index) in 7"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="间隔天数"
          v-if="form.TimeLoopType == 1 && form.Type == 2"
        >
          <el-select v-model="form.Time2" placeholder="请选择间隔天数">
            <el-option
              :label="`${item}日`"
              :value="item"
              v-for="(item, index) in 31"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存储量 " v-if="form.Type == 3">
          <el-input
            v-model="form.Storage"
            placeholder="请输入存储量"
            type="number"
          >
            <template slot="append">M</template></el-input
          >
        </el-form-item>
        <el-form-item label="执行清理模式" v-if="form.Type != 1">
          <el-select
            v-model="form.ClearType"
            placeholder="请选择执行清理模式"
            @change="clearTypeChange"
          >
            <el-option
              :label="item.key"
              :value="item.value"
              v-for="(item, index) in $D
                .LIST('DBCS_ClearType')
                .filter((m) => m.value != 3)"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="指定天数"
          v-if="form.ClearType == 1 && form.Type != 1"
        >
          <el-input
            type="number"
            v-model="form.ClearTotalDay"
            placeholder="请输入指定天数"
          ></el-input>
        </el-form-item>
      </el-form>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  props: {
    teamVal: {
      type: Number,
      default: null,
    },
    dataClear: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        Type: 4,
        TimeLoopType: 2,
        Time1: 1,
        Time2: 1,
        Storage: null,
        ClearType: null,
        ClearTotalDay: null,
        teamId: null,
        Id: null,
      },
    };
  },
  methods: {
    onConfirm() {
      this.form.teamId = this.$refs.initdata.loadBtn(true);
      this.form.teamId = this.teamVal;
      this.form.Id = this.dataClear.Id;
      this.$http
        .post("/Teams/DatabaseSetting/SaveDatabaseClearSetting.ashx", this.form)
        .then((resp) => {
          if (resp.res == 0) {
            this.$modal.hide("initdata");
            this.$emit("success");
          }
        })
        .finally(() => this.$refs.initdata.loadBtn(false));
    },
    opened() {
      this.$nextTick(() => {
        if (this.dataClear) {
          this.form.Type = this.dataClear.Type;
          this.form.TimeLoopType = this.dataClear.TimeLoopType;
          this.form.Time1 = this.dataClear.Time1;
          this.form.Time2 = this.dataClear.Time2;
          this.form.Storage = this.dataClear.Storage;
          this.form.ClearType = this.dataClear.ClearType;
          this.form.ClearTotalDay = this.dataClear.ClearTotalDay;
        } else {
          Object.assign(this.$data, this.$options.data());
        }
      });
    },
    /**
     * 清除类型切换
     */
    typeChange(val) {
      if (val == 2) {
        this.form.TimeLoopType = 2;
        this.form.Time1 = 1;
        this.form.Time2 = 1;
        this.form.Storage = null;
        this.form.ClearType = 2;
        this.form.ClearTotalDay = null;
      } else if (val == 3 || val == 4 || val == 1) {
        this.form.TimeLoopType = null;
        this.form.Time1 = null;
        this.form.Time2 = null;
        this.form.Storage = null;
        this.form.ClearType = val == 1 ? null : 2;
        this.form.ClearTotalDay = null;
      }
    },
    /**
     * 执行时间循环类型切换
     */
    timeLoopTypeChange(val) {
      if (val == 1) {
        this.form.Time1 = null;
        this.form.Time2 = 1;
      } else {
        this.form.Time1 = 1;
        this.form.Time2 = 1;
      }
    },
    /**
     * 执行清理模式切换
     */
    clearTypeChange(val) {
      this.form.ClearTotalDay = null;
    },
    getWeek(val) {
      switch (val) {
        case 1:
          return "一";
        case 2:
          return "二";
        case 3:
          return "三";
        case 4:
          return "四";
        case 5:
          return "五";
        case 6:
          return "六";
        case 7:
          return "日";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.initdata-modal {
  .modal {
    .el-form {
      padding: 0 10px;
      .el-form-item {
        margin-bottom: 18px;
      }
    }
  }
  .el-select {
    width: 100%;
  }
}
</style>
