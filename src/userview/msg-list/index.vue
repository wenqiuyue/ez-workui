<template>
  <div class="msg-list">
    <Header title="消息列表" titleEnglish="Message List" class="baseHeader">
      <div slot="btnGroup">
        <el-button type="text" @click="handleMass">群发消息</el-button>
      </div></Header
    >
    <Tab :options="tabOptions" @change="getTab"> </Tab>
    <c-content v-loading="loading" style="height: calc(100% - 3.6rem)">
      <div class="msg_con" slot="main">
        <ul>
          <li v-for="(item, index) in 12" :key="index">
            <div class="num">
              <span>{{ index + 1 }}</span>
            </div>
            <div class="user">
              <el-avatar
                size="large"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              ></el-avatar>
              <div class="msg_user_right">
                <p class="name">文秋月</p>
                <p class="time">
                  <el-tag type="info" size="mini">2020年8月21日 11:21</el-tag>
                  <el-tag size="mini">数据监测团队</el-tag>
                </p>
              </div>
            </div>
            <div class="msg_text">
              最新的botchiefdll及botchiefdebug文件，修复了debug
              60版本运行错误的问题，所有文件全部替换成最新的
            </div>
            <div
              class="read_user_card"
              style="border-left: 5px solid #67c23a"
              v-if="activeItem == '我发送的消息'"
            >
              <p>已读人员:</p>
              <div class="user_list">
                <div class="user_info" v-for="(uitem, uind) in 12" :key="uind">
                  <el-avatar
                    size="small"
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  ></el-avatar>
                  <span>张晓晓</span>
                </div>
              </div>
            </div>
            <div
              class="read_user_card"
              style="border-left: 5px solid #f56c6c"
              v-if="activeItem == '我发送的消息'"
            >
              <p>未读人员:</p>
              <div class="user_list">
                <div class="user_info" v-for="(uitem, uind) in 3" :key="uind">
                  <el-avatar
                    size="small"
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  ></el-avatar>
                  <span>张晓晓</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <c-pages
        slot="pages"
        v-model="pageData"
        @changeEvent="pageChange"
      ></c-pages>
    </c-content>
    <MsgMass></MsgMass>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    Tab: () => import("@/components/TabUtil"),
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    MsgMass: () => import("./MsgMass"),
  },
  data() {
    return {
      tabOptions: ["未读消息", "已读消息", "我发送的消息"],
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      activeItem: "未读消息",
    };
  },
  methods: {
    /**
     * 群发消息
     */
    handleMass() {
      this.$modal.show("MsgMass");
    },
    getTab(item) {
      this.activeItem = item.join();
    },
    /**
     * 分页
     */
    pageChange(val) {
      this.pageData = val;
    },
  },
};
</script>
<style lang="less" scoped>
.msg-list {
  height: 100%;
  .msg_con {
    ul {
      li {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        padding: 6px 12px;
        position: relative;
        .num {
          position: absolute;
          top: 8px;
          right: 2px;
          color: #fff;
          text-align: center;
          line-height: 32px;
          font-size: 19px;
          font-weight: bold;
          span {
            display: block;
            float: left;
            width: 32px;
            height: 32px;
            background: rgb(121, 187, 255);
            border-radius: 50px 0 50px 50px;
            margin-right: 10px;
          }
        }
        .user {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          align-items: center;
          .msg_user_right {
            margin-left: 8px;
            .name {
              font-size: 14px;
              color: #303133;
              font-weight: bold;
            }
            .time {
              margin-top: 3px;
              .el-tag {
                margin-right: 5px;
              }
            }
          }
        }
        .msg_text {
          margin-top: 8px;
          font-size: 14px;
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
  }
  /deep/.title-box {
    display: none;
  }
}
</style>
