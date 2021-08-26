<template>
  <div class="makeup-card">
    <XModal
      id="makeup_modal"
      isFixed
      ref="xmodal"
      name="makeup"
      title="补交任务"
      cancelBtnText="取消"
      confirmBtnText="确定"
      @onConfirm="handleConfirm"
      :showCrossBtn="true"
      width="660"
      ><el-form class="form" :model="formData" :rules="rules" ref="formData">
        <el-form-item class="form_item" label="任 务：" prop="task">
          <el-input placeholder="任务名" v-model="formData.task.name">
            <template slot="append">选择任务</template>
          </el-input>
        </el-form-item>
        <el-form-item class="form_item" label="时间段：" prop="task">
          <el-time-select
            placeholder="起始时间"
            v-model="startTime"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
            }"
          >
          </el-time-select>
          <span style="margin: 0 20px">至</span>
          <el-time-select
            placeholder="结束时间"
            v-model="endTime"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
              minTime: startTime,
            }"
          >
          </el-time-select>
        </el-form-item>

        <el-form-item class="form_item" label="任务描述：" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 7 }"
            placeholder="请输入任务描述"
            v-model="formData.content"
          ></el-input>
        </el-form-item> </el-form
    ></XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  props: {
    selTask: {
      type: Object,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
    teamValue: {
      type: Number,
      default: null,
    },
    selMem: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      teamOptions: [],
      formData: {
        content: "", //消息内容
        reader: null, //成员id数组
        task: {
          name: null,
          id: null,
        },
      },

      users: [],
      rules: {
        content: [
          { required: true, message: "请输入消息内容", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleConfirm() {},
  },
};
</script>
<style lang="less" scoped>
.makeup-card {
  .form {
    padding: 0 2rem 0 2rem;
    .form_item {
      display: flex;

      /deep/.el-form-item__label {
        padding-right: 10px;
        width: 95px;
      }

      /deep/.el-form-item__content {
        flex: auto;
        display: flex;
        align-items: center;

        .el-select {
          width: 100%;
        }
      }
      /deep/.el-input-group__append {
        background-color: #409eff;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
}
</style>
