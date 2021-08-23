<template>
  <div class="taskdetail-modal">
    <XModal
      name="taskdetailM"
      width="800px"
      title="任务详情"
      :showCrossBtn="true"
    >
      <div class="taskm_content">
        <el-row>
          <el-col :span="10" class="left_col"
            ><div class="m_left">
              <el-image
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                fit="fill"
              ></el-image></div
          ></el-col>
          <el-col :span="14" class="right_col"
            ><div class="m_right">
              <p class="name">
                <span
                  >第三阶段任务详情的前端页面第三阶段任务详情的前端页面</span
                >
              </p>
              <p class="time_status">
                <span>
                  <label class="lable">时间段：</label>
                  <label class="con">13:21 - 14:11</label>
                </span>
                <span>
                  <label class="lable">任务状态：</label>
                  <label class="con">启用</label>
                </span>
                <span>
                  <label class="lable">创建时间：</label>
                  <label class="con">2021-2-31 14:21</label>
                </span>
              </p>
              <p class="desc">
                <span>
                  <label class="lable">任务描述：</label>
                  <label class="con"
                    >第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面第三阶段任务详情的前端页面</label
                  >
                </span>
              </p>
            </div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="24">
            <ThermodynamicChart
              :datestart="'2021-08-17 00:00:01'"
              :dateend="'2021-08-17 23:59:59'"
              :UsId="2"
              :teamId="29"
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
