<template>
  <div class="demandMsgInfo">
    <XModel name="demandMsgInfo" title="消息详情" :showCrossBtn="true">
      <div class="content" v-if="demandMsgInfo">
        <el-form ref="form" :model="demandMsgInfo" label-width="120px">
          <el-form-item label="消息发送人：">
            <div class="num_name">
              <el-avatar
                size="small"
                :src="$url + demandMsgInfo.AuthorPicture"
              ></el-avatar>
              <span>{{ demandMsgInfo.Author }}</span>
            </div>
          </el-form-item>
          <el-form-item label="消息接收人：">
            <div class="num_name">
              <el-avatar
                size="small"
                :src="$url + demandMsgInfo.GoalManPicture"
              ></el-avatar>
              <span>{{ demandMsgInfo.GoalMan }}</span>
            </div>
          </el-form-item>
          <el-form-item label="消息发送时间：">
            <span>{{ demandMsgInfo.Time.timeFormat("yyyy-MM-dd") }}</span>
          </el-form-item>
          <el-form-item label="发送内容：">
            <span v-html="demandMsgInfo.Message"></span>
          </el-form-item>
        </el-form>
      </div>
    </XModel>
  </div>
</template>
<script>
export default {
  components: {
    XModel: () => import("@/components/XModal"),
  },
  props: {
    demandMsgInfo: {
      type: Object,
      default: null,
    },
  },
};
</script>
<style lang="less" scoped>
.demandMsgInfo {
  /deep/.content {
    padding: 0 10px;
    .num_name {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
    s {
      font-weight: bold;
      color: #448ef5;
    }
  }
}
</style>
