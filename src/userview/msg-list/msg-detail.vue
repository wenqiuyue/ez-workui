<template>
  <div class="msg-detail">
    <XModel
      id="msg_modal"
      isFixed
      ref="xmodal"
      name="msgDetail"
      title="消息详情"
      :showCrossBtn="true"
      width="700"
    >
      <div v-if="selMsg" class="content">
        <div class="send">
          <div class="send_con">
            <span class="lable">发送人：</span>
            <div class="user">
              <el-avatar
                size="small"
                :src="imgChange(selMsg.Picture)"
              ></el-avatar>
              <span>{{ selMsg.UserName }}</span>
            </div>
          </div>
          <div class="send_con">
            <span class="lable">所在团队：</span>
            <el-tag size="small">{{ selMsg.TeamName }}</el-tag>
          </div>
          <div class="send_con">
            <span class="lable">发送时间：</span>
            <span>{{
              selMsg.CreateTime.timeFormat("yyyy年MM月dd日 HH:mm")
            }}</span>
          </div>
        </div>
        <p class="msg_con">{{ selMsg.Content }}</p>
        <div
          class="read_user_card"
          style="border-left: 5px solid #67c23a"
          v-if="activeItem == '我发送的消息'"
        >
          <p>已读人员:</p>
          <div class="user_list" v-if="selMsg.Reads && selMsg.Reads.length">
            <div
              class="user_info"
              v-for="(ritem, rind) in selMsg.Reads"
              :key="rind"
            >
              <el-avatar
                size="small"
                :src="imgChange(ritem.Picture)"
              ></el-avatar>
              <span>{{ ritem.UserName }}</span>
            </div>
          </div>
          <div class="user_list" v-else>无</div>
        </div>
        <div
          class="read_user_card"
          style="border-left: 5px solid #f56c6c"
          v-if="activeItem == '我发送的消息'"
        >
          <p>未读人员:</p>
          <div class="user_list" v-if="selMsg.UnReads && selMsg.UnReads.length">
            <div
              class="user_info"
              v-for="(uitem, uind) in selMsg.UnReads"
              :key="uind"
            >
              <el-avatar
                size="small"
                :src="imgChange(uitem.Picture)"
              ></el-avatar>
              <span>{{ uitem.UserName }}</span>
            </div>
          </div>
          <div class="user_list" v-else>无</div>
        </div>
      </div>
    </XModel>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    XModel: () => import("@/components/XModal"),
  },
  props: {
    selMsg: {
      type: Object,
      default: null,
    },
    activeItem: {
      type: String,
      default: null,
    },
  },
  methods: {
    imgChange,
  },
};
</script>
<style lang="less" scoped>
.msg-detail {
  .content {
    padding: 10px 10px 20px;
    .send {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .send_con {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 1.2rem;
      .lable {
        font-weight: bold;
        font-size: 13px;
        color: #303133;
      }
      .user {
        display: flex;
        flex-direction: row;
        align-items: center;
        .el-avatar {
          margin-right: 5px;
        }
      }
    }
    .msg_con {
      min-height: 180px;
      padding: 5px 15px;
      border-radius: 4px;
      background: #f8f8f8;
      font-size: 1.4rem;
    }
    .read_user_card {
      padding: 1rem;
      background-color: #f8f8f8;
      border-radius: 4px;
      margin-top: 0.8rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      p {
        font-size: 13px;
        font-weight: bold;
        color: #303133;
        margin-right: 8px;
        flex-shrink: 0;
      }
      .user_list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .user_info {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
