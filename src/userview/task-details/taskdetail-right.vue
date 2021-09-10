<template>
  <div class="taskdetail-right">
    <div style="height: 100%" v-if="taskArray && taskArray.length">
      <el-row :gutter="10">
        <el-col :span="4" v-for="(item, index) in taskArray" :key="index">
          <!-- 正常任务 -->
          <div
            class="task_card"
            @click="handleTask(item, 1)"
            v-if="!item.IsFree && item.TaskInfo"
          >
            <el-image
              v-if="item.IsRepair"
              class="bujiao_img"
              :src="require('../../assets/img/bujiao.png')"
              fit="contain"
            ></el-image>
            <div class="img">
              <el-image
                :src="cmurl + item.Img"
                fit="fill"
                v-if="IsRealTimeScreenshot"
              ></el-image>
              <el-image
                :src="require('../../assets/img/task.png')"
                fit="contain"
                v-else
              ></el-image>
            </div>
            <div class="task_content">
              <p class="task_title">
                <i class="hiFont hi-task"></i>
                <span>{{ item.TaskInfo.Title }}</span>
              </p>
              <p>
                <el-tag size="mini"
                  >任务时间段：{{ item.CreateTime.timeFormat("HH:mm") }} -
                  {{
                    item.UpdateTime
                      ? item.UpdateTime.timeFormat("HH:mm")
                      : "当前"
                  }}</el-tag
                >
              </p>
            </div>
          </div>
          <!-- 补交任务 -->
          <div
            class="task_card notask"
            @click="handleTask(item, 2)"
            v-else-if="item.IsFree"
          >
            <div class="img">
              <el-image
                :src="require('../../assets/img/noTask.png')"
                fit="scale-down"
              ></el-image>
            </div>
            <div class="task_content">
              <!-- <p class="add_task">+</p> -->
              <p>
                <el-tag size="mini" type="warning"
                  >无任务时段：{{ item.CreateTime.timeFormat("HH:mm") }} -
                  {{ item.UpdateTime.timeFormat("HH:mm") }}</el-tag
                >
              </p>
            </div>
          </div>
          <!-- 签到 -->
          <div class="task_card notask" v-else-if="item.CheckStatus == '签到'">
            <div class="img">
              <el-image
                :src="require('../../assets/img/clock.png')"
                fit="scale-down"
              ></el-image>
            </div>
            <div class="task_content">
              <!-- <p class="add_task">+</p> -->
              <p>
                <el-tag size="mini" type="success"
                  >开始工作：{{
                    item.CheckTime.timeFormat("MM月dd日 HH:mm")
                  }}</el-tag
                >
              </p>
            </div>
          </div>
          <!-- 签退 -->
          <div class="task_card notask" v-else-if="item.CheckStatus == '签退'">
            <div class="img">
              <el-image
                :src="require('../../assets/img/clock.png')"
                fit="scale-down"
              ></el-image>
            </div>
            <div class="task_content">
              <!-- <p class="add_task">+</p> -->
              <p>
                <el-tag size="mini" type="danger"
                  >结束工作：{{
                    item.CheckTime.timeFormat("MM月dd日 HH:mm")
                  }}</el-tag
                >
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="empty-wrapper" v-else>
      <img src="../../assets/img/emptyMem.png" alt="" />
      <p class="empty-taskList">暂无数据</p>
    </div>
    <TaskDetailM
      :selTask="selTask"
      :date="date"
      :teamValue="teamValue"
      :selMem="selMem"
      :IsRealTimeScreenshot="IsRealTimeScreenshot"
    ></TaskDetailM>
    <MakeUp
      :selTask="selTask"
      :date="date"
      :teamValue="teamValue"
      :selMem="selMem"
      @loadData="$emit('loadData')"
    ></MakeUp>
  </div>
</template>
<script>
export default {
  components: {
    TaskDetailM: () => import("./taskdetail-modal"),
    MakeUp: () => import("./makeup-card"),
  },
  props: {
    //是否显示截图
    IsRealTimeScreenshot: {
      type: Boolean,
      default: true,
    },
    taskArray: {
      type: Array,
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
      selTask: null,
    };
  },
  computed: {
    cmurl() {
      return process.env.VUE_APP_CMURL;
    },
  },

  methods: {
    /**
     * 卡片点击
     * type:1 任务详情弹窗  2补交任务弹窗
     */
    handleTask(val, type) {
      this.selTask = val;
      if (type == 1) {
        this.$modal.show("taskdetailM");
      } else if (type == 2) {
        this.$modal.show("makeup");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.taskdetail-right {
  height: 100%;
  background: #ffffff;
  padding: 12px;
  overflow-y: auto;
  .el-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .task_card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    position: relative;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 2px 12px 0 rgba(80, 166, 255, 0.7);
    }
    .bujiao_img {
      position: absolute;
      top: 0;
      width: 30px;
      z-index: 999;
      right: 5px;
    }
    .img {
      .el-image {
        width: 100%;
        height: 70px;
        border-radius: 4px 4px 0 0;
      }
    }
    .task_content {
      padding: 6px 6px 10px;
      .task_title {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 8px;
        height: 32px;
        i {
          color: #909399;
        }
        span {
          font-weight: bold;
          color: #303133;
          margin-left: 3px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }
      }
      .el-tag {
        width: 100%;
        overflow-x: hidden;
      }
    }
  }
  .notask {
    .img {
      .el-image {
        width: 100%;
        height: 110px;
        border-radius: 4px 4px 0 0;
      }
    }
    .add_task {
      border: 2px solid #ebeef5;
      text-align: center;
      font-size: 18px;
      border-radius: 5px;
      color: #303133;
      font-weight: bold;
      margin-bottom: 5px;
    }
  }
  .empty-wrapper {
    background: #fff;
    height: 100%;

    img {
      display: block;
      margin: 5rem auto;
      margin-top: 0;
      padding-top: 5rem;
      width: 245px;
      height: 245px;
    }

    p {
      color: #6d6d6d;
      font-size: 1.6rem;
      text-align: center;
    }
  }
}
</style>
