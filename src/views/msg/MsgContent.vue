<template>
  <div>
    <!-- <div> -->
    <slot name="header">
      <Header title="我的消息" titleEnglish="My Messages" class="baseHeader">
        <!--XBB: PC按钮组的插槽 -->
        <div slot="btnGroup">
          <a class="sp" @click="handleMassMessaging">
            <span>群发消息</span>
          </a>
          <a ref="isread" v-if="showAllRead == 0" class="sp" @click="allRead">
            <span>全部已读</span>
          </a>
          <a class="sp sort" ref="sort" v-if="showSort==2">
            <el-dropdown trigger="click" :hide-on-click="false">
              <span class="el-dropdown-link hp-aspan sp">排序</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="sortByTime(1)">
                    关注时间
                    <span>↓</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="sortByTime(0)">
                    消息时间
                    <span>↓</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </a>
        </div>
        <!--移动端 -->
        <el-dropdown v-if="showSort==2" trigger="click" :hide-on-click="false" slot="dropdown">
          <span class="el-dropdown-link">
            <i class="hiFont hi-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="addTask">
              <div @click="sortByTime(1)">
                关注时间
                <span v-if="byFollow==-1">↑</span>
                <span v-if="byFollow==1">↓</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item command="proDetail">
              <div @click="sortByTime(0)">
                消息时间
                <span v-if="byTime==-1">↑</span>
                <span v-if="byTime==1">↓</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </Header>
    </slot>

    <div class="box">
      <msg
        :type="type"
        :isQuickMsg="isQuickMsg"
        ref="msg"
        @chang="changDisplay"
        :isChat="true"
        :isModal="isModal"
      ></msg>
    </div>
    <MsgMass></MsgMass>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  props: ["type", "isQuickMsg", "initTarget", "isModal"],
  data() {
    return {
      showAllRead: 0, //显示全部已读
      showSort: 0, //显示排序
      searchData: {
        text: "", //输入的查询关键字
        type: "0", //查询类型（默认综合）
      },
      byTime: 1, //
      byFollow: 1,
    };
  },

  components: {
    Header: () => import("../../components/Header"),
    msg: () => import("./msg"),
    MsgMass: () => import("./MsgMass"),
  },
  methods: {
    allRead() {
      let typeList = {
        unread: "all",
        system: 0,
        pro: 1,
        report: 2,
        ep: 3,
        review: 4,
        customer: 5,
        calendar: 6,
        immediate: 9,
      };
      let data = {
        type: typeList[this.type],
      };
      this.$confirm("是否确认将当前全部消息标记为已读", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs.msg.loading = true;
          this.$http
            .post("/Msg/CleanNotReadMsg.ashx", data)
            .then((res) => {
              this.$refs.msg.refresh();
              this.zeroClearing();
            })
            .catch((error) => {
              console.log("全部消息已读接口" + error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //未读消息状态清零
    zeroClearing() {
      let msg = {
        unread: null,
        system: {
          count: "systemCount",
          type: 0,
        },
        pro: {
          count: "proCount",
          type: 1,
        },
        report: {
          count: "reportCount",
          type: 2,
        },
        ep: {
          count: "epCount",
          type: 3,
        },
        review: {
          count: "reviewCount",
          type: 4,
        },
        customer: {
          count: "customerCount",
          type: 5,
        },
        calendar: {
          count: "calendarCount",
          type: 6,
        },
         immediate: {
          count: "immediateCount",
          type: 9,
        },
        other: {
          count: "chatCount",
          type: 99,
        },
      };
      let msgData = msg[this.type];
      if (msgData) {
        this.$store.commit("msg_SetNum", {
          type: msgData.type,
          action: "add",
          value: -this.$store.state.msg[msgData.count],
        });
      } else {
        this.$store.commit("msg_SetNumAll", [0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
    },
    changDisplay(result) {
      this.showAllRead = result;
      this.showSort = result;
      this.$forceUpdate();
    },
    //按时间排序
    sortByTime(type) {
      if (type == 0) {
        this.byTime = this.byTime == 1 ? -1 : 1;
        this.$refs.msg.orderBy(0, this.byTime);
      } else {
        this.byFollow = this.byFollow == 1 ? -1 : 1;
        this.$refs.msg.orderBy(1, this.byFollow);
      }
      this.$forceUpdate();
    },
    /**
     * 群发消息
     */
    handleMassMessaging() {
      this.$modal.show("MsgMass");
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  padding: 0 1.5rem;
}

.hp-aspan {
  color: #448ef5;
}

/deep/.sort {
  display: none;
}

@media all and (max-width: 1024px) {
  .box {
    padding: 0;
  }
}
</style>
