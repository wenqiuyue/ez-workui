<template>
  <div class="msg-list">
    <Header title="消息列表" titleEnglish="Message" class="baseHeader">
      <div slot="btnGroup">
        <el-button type="text" @click="handleMass">群发消息</el-button>
        <el-button type="text" @click="handleAllRead" v-if="teamValue"
          >全部已读</el-button
        >
      </div></Header
    >
    <Tab :options="tabOptions" @change="getTab">
      <template slot="custom">
        <div class="screen">
          <el-select v-model="teamValue" filterable placeholder="请选择团队">
            <el-option
              v-for="item in teamOptions"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            >
              <div class="team_sel">
                <span>{{ item.Name }}</span>
                <el-tag
                  type="warning"
                  effect="dark"
                  size="mini"
                  v-if="item.Count"
                >
                  {{ item.Count }}</el-tag
                >
              </div>
            </el-option>
          </el-select>
          <el-button
            type="primary"
            size="small"
            class="add-btn-process"
            @click="handleSearch"
            >搜 索</el-button
          >
        </div>
      </template>
    </Tab>
    <c-content v-loading="loading" style="height: calc(100% - 3.6rem)">
      <div class="msg_con" slot="main">
        <ul v-if="msgData && msgData.length">
          <li v-for="(item, index) in msgData" :key="index">
            <!-- <div class="num">
              <span @click="handleRead(item)">查看详情</span>
            </div> -->
            <div class="user">
              <el-avatar
                size="large"
                :src="imgChange(item.Picture)"
              ></el-avatar>
              <div class="msg_user_right">
                <p class="name">{{ item.UserName }}</p>
                <p class="time">
                  <el-tag type="info" size="mini">{{
                    item.CreateTime.timeFormat("yyyy年MM月dd日 HH:mm")
                  }}</el-tag>
                  <el-tag size="mini" type="warning">{{
                    item.TeamName
                  }}</el-tag>
                  <el-button type="text" size="small" @click="handleRead(item)"
                    >点击查看详情</el-button
                  >
                </p>
              </div>
            </div>
            <div class="msg_text">
              {{ item.Content }}
            </div>
            <div
              class="read_user_card"
              style="border-left: 5px solid #67c23a"
              v-if="activeItem == '我发送的消息'"
            >
              <p>已读人员:</p>
              <div class="user_list" v-if="item.Reads && item.Reads.length">
                <div
                  class="user_info"
                  v-for="(ritem, rind) in item.Reads"
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
              <div class="user_list" v-if="item.UnReads && item.UnReads.length">
                <div
                  class="user_info"
                  v-for="(uitem, uind) in item.UnReads"
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
          </li>
        </ul>
        <div class="empty-wrapper" v-else>
          <img src="../../assets/img/emptyMem.png" alt="" />
          <p class="empty-taskList">暂无数据</p>
        </div>
      </div>
      <c-pages
        v-if="msgData && msgData.length"
        slot="pages"
        v-model="pageData"
        @changeEvent="pageChange"
      ></c-pages>
    </c-content>
    <MsgMass></MsgMass>
    <MsgDetail :selMsg="selMsg" :activeItem="activeItem"></MsgDetail>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    Header: () => import("@/components/Header"),
    Tab: () => import("@/components/TabUtil"),
    CContent: () => import("@/components/CContent"),
    CPages: () => import("@/components/CPages"),
    MsgMass: () => import("./MsgMass"),
    MsgDetail: () => import("./msg-detail"),
  },
  data() {
    return {
      selMsg: null, //选择查看的消息
      msgData: [],
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
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
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    imgChange,
    handleRead(val) {
      if (this.activeItem == "未读消息") {
        this.$http.post("/Information/ReadInformation.ashx", {
          teamId: this.teamValue,
          Id: val.Id,
        });
      }
      this.selMsg = val;
      this.$modal.show("msgDetail");
    },
    /**
     * 全部标记已读
     */
    handleAllRead() {
      this.$confirm("此操作将全部消息标记为已读, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/Information/AllReadInformation.ashx", {
              teamId: this.teamValue,
            })
            .then((resp) => {
              if (resp.res == 0) {
                this.$message({
                  type: "success",
                  message: "标记成功!",
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消标记",
          });
        });
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.pageData.pageIndex = 1;
      this.getMsg();
    },
    /**
     * 获取消息
     */
    getMsg() {
      if (this.activeItem == "未读消息") {
        this.myMsg(2);
      } else if (this.activeItem == "已读消息") {
        this.myMsg(1);
      } else {
        this.mySendMsg();
      }
    },
    /**
     * 我发送的消息
     */
    mySendMsg() {
      this.loading = true;
      const data = {
        teamId: this.teamValue,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
      };
      this.$http
        .post("/Information/GetInformations.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.msgData = resp.data.Data;
            this.pageData.totalNum = resp.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 我的消息
     */
    myMsg(type) {
      this.loading = true;
      const data = {
        teamId: this.teamValue,
        type: type,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
      };
      this.$http
        .post("/Information/GetUserReadInformations.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.msgData = resp.data.Data;
            this.pageData.totalNum = resp.data.TotalCount;
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http.post("/Teams/GetInformationTeamList.ashx").then((resp) => {
        if (resp.res == 0) {
          this.teamOptions = resp.data;
          this.teamValue = this.user.DefaultTeamId;
          if (this.teamValue) {
            this.handleSearch();
          }
        }
      });
    },
    /**
     * 群发消息
     */
    handleMass() {
      this.$modal.show("MsgMass");
    },
    getTab(item) {
      this.activeItem = item.join();
      if (this.teamValue) {
        this.handleSearch();
      } else {
        this.$message({
          showClose: true,
          message: "请先选择团队！",
          type: "warning",
          duration: 2000,
        });
        return;
      }
    },
    /**
     * 分页
     */
    pageChange(val) {
      this.pageData = val;
      this.getMsg();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.team_sel {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.msg-list {
  height: 100%;
  .screen {
    position: absolute;
    right: 0;
    top: -3px;
    // padding: 0px 22px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .el-select {
      width: 200px;
      height: 34px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }
  }
  .msg_con {
    ul {
      li {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        padding: 6px 12px;
        position: relative;
        .num {
          position: absolute;
          top: 6px;
          right: 0px;
          color: #fff;
          text-align: center;
          line-height: 30px;
          font-size: 13px;
          font-weight: bold;
          span {
            display: block;
            float: left;
            width: 72px;
            height: 30px;
            background: rgb(121, 187, 255);
            border-radius: 50px 0 50px 50px;
            margin-right: 10px;
            cursor: pointer;
            &:hover {
              background: #67c23a;
            }
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
          display: -webkit-box;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
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
  /deep/.title-box {
    display: none;
  }
}
</style>
