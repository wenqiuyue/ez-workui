<template>
  <div class="taskdetail-modal">
    <XModal
      name="taskdetailM"
      width="800px"
      title="任务详情"
      :showCrossBtn="true"
      @opened="opened"
    >
      <div class="taskm_content" v-if="selTask">
        <el-row>
          <el-col :span="10" class="left_col"
            ><div class="m_left">
              <el-image :src="cmurl + selTask.Img" fit="fill"></el-image></div
          ></el-col>
          <el-col :span="14" class="right_col"
            ><div class="m_right">
              <p class="name">
                <span>{{ selTask.TaskInfo.Title }}</span>
              </p>
              <p class="time_status">
                <span>
                  <label class="lable">时间段：</label>
                  <label class="con"
                    >{{ selTask.StartTime }} - {{ selTask.EndTime }}</label
                  >
                </span>
                <span>
                  <label class="lable">任务状态：</label>
                  <label class="con">{{
                    selTask.TaskInfo.Enable ? "启用" : "禁用"
                  }}</label>
                </span>
                <span>
                  <label class="lable">创建时间：</label>
                  <label class="con">{{
                    selTask.TaskInfo.CreateTime.timeFormat("yyyy-MM-dd HH:mm")
                  }}</label>
                </span>
              </p>
              <p class="desc">
                <span>
                  <label class="lable">任务描述：</label>
                  <label class="con">{{ selTask.TaskInfo.Describe }}</label>
                </span>
              </p>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="24">
            <ThermodynamicChart
              :datestart="ds"
              :dateend="de"
              :UsId="selMem && selMem.length ? selMem[0].UsId : null"
              :teamId="teamValue"
            ></ThermodynamicChart
          ></el-col>
        </el-row>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    ThermodynamicChart: () => import("@/components/ThermodynamicChart"),
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
      ds: null,
      de: null,
    };
  },
  computed: {
    cmurl() {
      return process.env.VUE_APP_CMURL;
    },
  },
  methods: {
    opened() {
      this.$nextTick(() => {
        this.ds = new Date(this.date).timeFormat(
          `yyyy-MM-dd ${this.selTask.StartTime}`
        );
        this.de = new Date(this.date).timeFormat(
          `yyyy-MM-dd ${this.selTask.EndTime}`
        );
      });
    },
  },
};
</script>
<style lang="less" scoped>
.taskdetail-modal {
  .taskm_content {
    margin-top: 6px;
    padding: 0 10px;
    .left_col {
      padding: 0 14px;
    }
    .m_left {
      .el-image {
        width: 290px;
        height: 180px;
        border: 4px solid #dcdfe6;
        border-radius: 8px;
      }
    }
    .m_right {
      p {
        margin-bottom: 6px;
        color: #606266;
        .lable {
          font-weight: bold;
          font-size: 14px;
        }
        .con {
          font-size: 14px;
        }
      }
      .time_status {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .desc {
        .con {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }
      }
      .name {
        font-weight: bold;
        color: #303133;
        font-size: 18px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
