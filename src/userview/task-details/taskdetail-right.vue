<template>
  <div class="taskdetail-right">
    <div style="height: 100%" v-if="true">
      <el-row :gutter="12">
        <el-col :span="4" v-for="(item, index) in 21" :key="index"
          ><div class="task_card" @click="handleTask">
            <el-image
              v-if="index % 2 == 0"
              class="bujiao_img"
              :src="require('../../assets/img/bujiao.png')"
              fit="contain"
            ></el-image>
            <div class="img">
              <el-image
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                fit="fill"
              ></el-image>
            </div>
            <div class="task_content">
              <p class="task_title">
                <i class="hiFont hi-task"></i>
                <span
                  >第三阶段任务详情的前端页面第三阶段任务详情的前端页面</span
                >
              </p>
              <p><el-tag size="mini">时间段：13:21 - 14:00</el-tag></p>
            </div>
          </div></el-col
        >
      </el-row>
    </div>
    <div class="empty-wrapper" v-else>
      <img src="../../assets/img/emptyMem.png" alt="" />
      <p class="empty-taskList">暂无数据</p>
    </div>
    <TaskDetailM></TaskDetailM>
  </div>
</template>
<script>
export default {
  components: {
    TaskDetailM: () => import("./taskdetail-modal"),
  },
  methods: {
    handleTask() {
      this.$modal.show("taskdetailM");
    },
  },
};
</script>
<style lang="less" scoped>
.taskdetail-right {
  height: 100%;
  background: #ffffff;
  padding: 12px;
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
