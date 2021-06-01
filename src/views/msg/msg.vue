<template>
  <div class="main-box" :style="isModal ? 'height:calc(100% - 4rem)' : ''">
    <XModal name="pclmDetail" width="95%" height="95%" :closeOnDimmer="false">
      <pclmDetail :pclmID="pclmID"></pclmDetail>
    </XModal>

    <RuleDetail :ruleId="ruleId"></RuleDetail>
    <XModal
      name="report"
      width="95%"
      height="95%"
      :closeOnDimmer="false"
      :url="reporturl"
      :referer="cloneUrl"
    >
      <ReportDetail></ReportDetail>
    </XModal>
    <taskDetail
      v-model="jid"
      :type="1"
      :url="jburl"
      :referer="cloneUrl"
    ></taskDetail>
    <XModal name="details" width="95%" height="95%" :closeOnDimmer="false">
      <contractDetails :contractId="contractId"></contractDetails>
    </XModal>
    <proDetail :eid="eid"></proDetail>
    <AuditModal ref="modalForm"></AuditModal>
    <KpiDetail :activeId="kid"></KpiDetail>
    <CalendarModal :calendarData="calendarData"></CalendarModal>
    <!-- 下发任务接收或拒收 -->
    <AcceptTask
      :Jid="selJId"
      @showTask="showTask"
      v-if="isChat"
      customName="chatAcceptJob"
    ></AcceptTask>
    <AcceptTask :Jid="selJId" @showTask="showTask" v-else></AcceptTask>
    <Tabutil :options="options" v-on:change="changeDispaly"></Tabutil>
    <!-- 审核结果弹窗 -->
    <approveAuditModal :selExa="approveId" :Uid="selUid"></approveAuditModal>
    <!-- 需求详情 -->
    <!-- <LSetp :XId="selDemandId"></LSetp> -->
    <!-- getMsg(type,display,'',0) -->
    <div class="msgBox" v-loading="loading" ref="msgBox" v-refresh="refresh">
      <div class="no_msg" v-if="noMsg">
        <img v-lazy="require('@/assets/img/noNews.png')" alt="" />
        <div>暂无消息</div>
      </div>
      <!-- 全部未读 -->
      <div v-for="(item, index) in msgList" :key="index">
        <!-- 项目任务消息 -->
        <div
          class="msg-item"
          :class="{ alreadyRead: item.Message.Shape }"
          v-if="[1, 8].includes(item.Message.Type)"
        >
          <div class="msg-row msg-title">
            <div>
              <i class="hiFont hi-project" v-if="item.Message.Type === 4"></i>
              <i
                class="hiFont hi-task"
                v-if="[1, 8].includes(item.Message.Type)"
              ></i>
              <!-- <span class="name">{{item.Author}}</span>  -->
              <span v-html="item.Message.Mess"></span>
              <el-tag
                size="mini"
                class="fir"
                :style="{
                  color: $D.ITEM('g_priority', item.Message.Fir).color[1],
                  backgroundColor: $D.ITEM('g_priority', item.Message.Fir)
                    .color[2],
                  borderColor: $D.ITEM('g_priority', item.Message.Fir).color[2],
                }"
              >
                {{ $D.ITEM("g_priority", item.Message.Fir).name }}
              </el-tag>
              <span class="time pc">{{ getDay(item.Message.CreateTime) }}</span>
              <i
                v-if="display && !item.Message.IsTop"
                class="hiFont hi-star"
                @click="follow(item)"
                title="关注"
              ></i>
              <i
                v-if="display && item.Message.IsTop == 1"
                class="hiFont hi-star-in"
                @click="follow(item)"
              ></i>
              <button
                @click="clearTypeMsg(item)"
                v-if="display == 0"
                class="relation-msg"
              >
                相关消息已读
              </button>
              <p class="msg-row msg-time">
                {{ item.Message.CreateTime.timeFormat("yyyy-MM-dd HH:mm:ss") }}
                <span class="time phone">{{
                  getDay(item.Message.CreateTime)
                }}</span>
              </p>
            </div>
            <div class="name-pic">
              <img v-lazy="$url + item.AuthorPicture" />
            </div>
          </div>
          <div
            class="msg-row msg-content"
            v-if="item.EventeInfo"
            @touchstart="touchstart"
            @touchend="touchend(item)"
          >
            <p v-if="!item.ComentMess">
              <span>{{ item.EventeInfo.Name }}</span>
              <span class="look" @click="toDetail(item)">进入项目查看</span>
            </p>
            <p v-if="!item.ComentMess">
              <span class="bottom-msg">
                <i
                  class="hiFont msg-state"
                  :class="$D.ITEM('pro_status', item.EventeInfo.Schedule).icon"
                  :style="{
                    color: $D.ITEM('pro_status', item.EventeInfo.Schedule)
                      .color,
                  }"
                ></i>
                {{ $D.ITEM("pro_status", item.EventeInfo.Schedule).name }}
              </span>
              <span class="bottom-msg">
                <span>负责人：</span>
                <span>{{ item.EventeInfo.DefFrontManName }}</span>
              </span>
              <span class="bottom-msg">
                <span>项目分类：</span>
                <span>{{
                  item.EventeInfo.Genre == 1 ? "常规项目" : "计划项目"
                }}</span>
              </span>
            </p>
            <!-- 评论/回复消息 -->
            <div v-if="item.ChildMess" class="com-content">
              <div
                class="childMess"
                v-html="extractPart(item.ChildMess.Mess)"
              ></div>
              <span v-if="item.ChildMess" @click="toDetail(item)">去回复</span>
            </div>
            <div v-if="item.MessInfo" class="com-content">
              <div
                v-if="item.MessInfo.ComentMess"
                v-html="extractPart(item.MessInfo.ComentMess)"
              ></div>
              <span v-if="!item.MessInfo.ChildMess" @click="toDetail(item)"
                >去回复</span
              >
            </div>
            <p v-if="item.MessInfo">
              <span>来自项目：</span>
              <span>{{ item.EventeInfo.Name }}</span>
            </p>
          </div>
          <div
            class="msg-row msg-content"
            v-if="item.JobInfo"
            @touchstart="touchstart"
            @touchend="touchend(item)"
          >
            <!-- touchend(item) @touchstart='touchstart' @touchend="touchend(item)"-->
            <p v-if="!item.MessInfo">
              <span>{{ item.JobInfo.JobName }}</span>
              <span class="look" @click="toDetail(item)">进入任务查看</span>
            </p>
            <p v-if="!item.MessInfo">
              <span class="bottom-msg">
                <i
                  class="hiFont msg-state"
                  :class="$D.ITEM('task_status', item.JobInfo.JobShape).icon"
                  :style="{
                    color: $D.ITEM('task_status', item.JobInfo.JobShape).color,
                  }"
                ></i>
                {{ $D.ITEM("task_status", item.JobInfo.JobShape).name }}
              </span>
              <span class="bottom-msg">
                <span>执行者：</span>
                <span>{{ item.JobInfo.FrontName }}</span>
              </span>
              <span class="bottom-msg">
                <span>所属项目：</span>
                <span>{{ item.JobInfo.EventName }}</span>
              </span>
            </p>
            <!-- 评论/回复消息 -->
            <div
              v-if="
                item.MessInfo &&
                  item.MessInfo.ComentMess &&
                  item.MessInfo.FCommentMess
              "
              class="com-content"
            >
              <div
                class="childMess"
                v-html="extractPart(item.MessInfo.ComentMess)"
              ></div>
              <span v-if="item.MessInfo.FCommentMess" @click="toDetail(item)"
                >去回复</span
              >
            </div>
            <div v-if="item.MessInfo" class="com-content">
              <div
                v-html="
                  extractPart(
                    item.MessInfo.FCommentMess
                      ? item.MessInfo.FCommentMess
                      : item.MessInfo.ComentMess
                  )
                "
              ></div>
              <span v-if="!item.MessInfo.FCommentMess" @click="toDetail(item)"
                >去回复</span
              >
            </div>
            <p v-if="item.MessInfo">
              <span>来自任务：</span>
              <span>{{ item.JobInfo.JobName }}</span>
            </p>
          </div>
          <!-- 下发任务 -->
          <div
            class="msg-row msg-content"
            v-if="item.Message.speedJobId"
            @touchstart="touchstart"
            @touchend="touchend(item)"
          >
            <p>
              <span class="look" @click="toDetail(item)">进入任务查看</span>
            </p>
          </div>
          <!-- 文件下载 -->
          <div
            class="msg-row msg-content"
            v-if="item.FileInfo.length"
            @touchstart="touchstart"
            @touchend="touchend(item)"
            style="background: #fff"
          >
            <fileList :fileData="item.file" :showUpload="false"></fileList>
          </div>
          <!-- 需求完成类型 -->
          <div
            class="msg-row msg-content"
            v-if="item.Demand"
            @touchstart="touchstart"
            @touchend="touchend(item)"
          >
            <p>
              <span>{{ item.Demand.Name }}</span>
              <span class="look" @click="toDetail(item)">进入需求查看</span>
            </p>
          </div>
          <!-- 查看审核节点类型 -->
          <div
            class="msg-row msg-content"
            v-if="item.ReviewNode"
            @touchstart="touchstart"
            @touchend="touchend(item)"
          >
            <p>
              <span>{{ item.ReviewNode.Name }}</span>
              <span class="look" @click="toDetail(item)">进入审核节点查看</span>
            </p>
          </div>
        </div>
        <div
          class="msg-item"
          :class="{ alreadyRead: item.Message.Shape }"
          v-if="[2, 3, 4, 5, 11].includes(item.Message.Type)"
        >
          <div class="msg-row msg-title">
            <div>
              <i class="hiFont hi-report" v-if="item.Message.Type === 2"></i>
              <i class="hiFont hi-pclm" v-if="item.Message.Type === 3"></i>
              <i
                class="hiFont hi-review"
                v-if="item.Message.Type === 4 || item.Message.Type === 11"
              ></i>
              <i class="hiFont hi-customer" v-if="item.Message.Type === 5"></i>
              <span v-html="item.Message.Mess"></span>
              <el-tag
                size="mini"
                class="fir"
                :style="{
                  color: $D.ITEM('g_priority', item.Message.Fir).color[1],
                  backgroundColor: $D.ITEM('g_priority', item.Message.Fir)
                    .color[2],
                  borderColor: $D.ITEM('g_priority', item.Message.Fir).color[2],
                }"
              >
                {{ $D.ITEM("g_priority", item.Message.Fir).name }}
              </el-tag>
              <span class="time pc">{{ getDay(item.Message.CreateTime) }}</span>
              <i
                v-if="display && !item.Message.IsTop"
                class="hiFont hi-star"
                @click="follow(item)"
                title="关注"
              ></i>
              <i
                v-if="display && item.Message.IsTop == 1"
                class="hiFont hi-star-in"
                @click="follow(item)"
              ></i>
              <p class="msg-row msg-time">
                {{ item.Message.CreateTime.timeFormat("yyyy-MM-dd HH:mm:ss") }}
                <span class="time phone">{{
                  getDay(item.Message.CreateTime)
                }}</span>
              </p>
            </div>
            <div class="name-pic">
              <img v-lazy="$url + item.AuthorPicture" />
            </div>
          </div>
          <div
            class="msg-row msg-content"
            @touchstart="touchstart"
            @touchend="touchend(item)"
          >
            <p
              class="remove-margin"
              v-if="item.Message.Type === 2 || item.Message.ChildrenType"
            >
              <span v-if="item.Message.Type === 2 && item.BulletinInfo"
                >{{ item.BulletinInfo.AuthName }}---{{
                  item.BulletinInfo.Today.timeFormat("yyyy年MM月dd日")
                }}工作简报</span
              >
              <span v-if="item.Message.Type === 4"
                >{{ item.Message.formName }}---{{
                  item.Message.CreateTime.timeFormat("yyyy-MM-dd HH:mm")
                }}</span
              >
              <span
                class="look"
                @click="toDetail(item)"
                v-if="item.Message.ChildrenType"
                >查看{{ getMsgType(item) }}</span
              >
            </p>
          </div>
        </div>
        <!-- 系统消息 -->
        <div
          class="msg-item"
          :class="{ alreadyRead: item.Message.Shape }"
          v-if="[0, 7, 9].includes(item.Message.Type)"
        >
          <div class="msg-row msg-title">
            <div>
              <i class="hiFont hi-system"></i>
              <span v-html="item.Message.Mess"></span>
              <el-tag
                size="mini"
                class="fir"
                :style="{
                  color: $D.ITEM('g_priority', item.Message.Fir).color[1],
                  backgroundColor: $D.ITEM('g_priority', item.Message.Fir)
                    .color[2],
                  borderColor: $D.ITEM('g_priority', item.Message.Fir).color[2],
                }"
              >
                {{ $D.ITEM("g_priority", item.Message.Fir).name }}
              </el-tag>
              <span class="time pc">{{ getDay(item.Message.CreateTime) }}</span>
              <p class="msg-row msg-time">
                {{ item.Message.CreateTime.timeFormat("yyyy-MM-dd HH:mm:ss") }}
                <span class="time phone">{{
                  getDay(item.Message.CreateTime)
                }}</span>
              </p>
            </div>
            <div class="name-pic">
              <img v-lazy="$url + item.AuthorPicture" />
            </div>
          </div>
          <div
            class="msg-row msg-content"
            @touchstart="touchstart"
            @touchend="touchend(item)"
            v-if="[1, 2, 3, 4, 9, 7].includes(item.Message.SysMsgType)"
          >
            <p class="remove-margin" @click="toDetail(item)">
              <span class="look">查看消息</span>
            </p>
          </div>
        </div>
        <!-- 阶段任务通知 -->
        <div
          class="msg-item"
          :class="{ alreadyRead: item.Message.Shape }"
          v-if="[10].includes(item.Message.Type)"
        >
          <div class="msg-row msg-title">
            <div>
              <i class="hiFont hi-task"></i>
              <span v-html="item.Message.Mess"></span>
              <el-tag
                size="mini"
                class="fir"
                :style="{
                  color: $D.ITEM('g_priority', item.Message.Fir).color[1],
                  backgroundColor: $D.ITEM('g_priority', item.Message.Fir)
                    .color[2],
                  borderColor: $D.ITEM('g_priority', item.Message.Fir).color[2],
                }"
              >
                {{ $D.ITEM("g_priority", item.Message.Fir).name }}
              </el-tag>
              <span class="time pc">{{ getDay(item.Message.CreateTime) }}</span>
              <p class="msg-row msg-time">
                {{ item.Message.CreateTime.timeFormat("yyyy-MM-dd HH:mm:ss") }}
                <span class="time phone">{{
                  getDay(item.Message.CreateTime)
                }}</span>
              </p>
            </div>
            <div class="name-pic">
              <img v-lazy="$url + item.AuthorPicture" />
            </div>
          </div>
          <div class="msg_demand" v-if="item.Demand">
            <el-collapse v-model="item.demandTypeActiveName">
              <el-collapse-item :title="`需求：${item.Demand.Name}`" name="1">
                <template v-if="item.Demand.Jobs && item.Demand.Jobs.length">
                  <div
                    class="msg-row msg-content"
                    @touchstart="touchstart"
                    @touchend="touchend(item)"
                    v-for="(demandJob, djindex) in item.Demand.Jobs"
                  >
                    <p>
                      <span>{{ demandJob.JobName }}</span>
                      <span class="look" @click="toDetail(item, demandJob.JId)"
                        >进入任务查看</span
                      >
                    </p>
                    <p>
                      <span class="bottom-msg">
                        <i
                          class="hiFont msg-state"
                          :class="
                            $D.ITEM('task_status', demandJob.JobShape).icon
                          "
                          :style="{
                            color: $D.ITEM('task_status', demandJob.JobShape)
                              .color,
                          }"
                        ></i>
                        {{ $D.ITEM("task_status", demandJob.JobShape).name }}
                      </span>
                      <span class="bottom-msg">
                        <span>执行者：</span>
                        <span>{{ demandJob.FrontName }}</span>
                      </span>
                      <span class="bottom-msg">
                        <span>所属项目：</span>
                        <span>{{ item.Demand.EventName }}</span>
                      </span>
                    </p>
                  </div>
                </template>
                <div class="msg-row msg-content" v-else>
                  <p>
                    无任务
                  </p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
      <div ref="sentry" v-loading="lazyLoad"></div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
let lazyLoade = function(dom, fn) {
  let observer = new IntersectionObserver((entry) => {
    if (entry[0].intersectionRatio > 0) {
      fn();
    }
  });
  observer.observe(dom);
};
export default {
  props: ["type", "isQuickMsg", "isChat", "initTarget", "isModal"],
  components: {
    Tabutil: () => import("@/components/TabUtil.vue"),
    ReportDetail: () => import("@/views/report/reportDetail.vue"),
    taskDetail: () => import("@/views/task/taskDetail"),
    pclmDetail: () => import("@/views/pclm/pclmDetail"),
    RuleDetail: () => import("@/views/rule/ruleDetail"),
    proDetail: () => import("@/views/pro/proDetail"),
    contractDetails: () => import("@/views/contract/Details"),
    XModal: () => import("../../components/XModal"),
    AuditModal: () => import("@/views/apply/AuditModal"),
    AcceptTask: () => import("@/views/task/AcceptTask"),
    fileList: () => import("@/components/List/FileList"),
    KpiDetail: () => import("@/views/assessment/kpiDetail"),
    CalendarModal: () => import("./CalendarModal"),
    approveAuditModal: () => import("@/views/pro/approve/auditModal"),
    LSetp: () => import("../../components/LSetp"),
  },
  data() {
    return {
      options: ["未读消息", "已读消息", "关注"],
      url: "",
      pclmID: "", //公告详情id
      ruleId: "", //制度详情id
      display: "", //头部选项卡
      contractId: "", //合同id
      kid: null, //kpiId
      msgList: [],
      noMsg: false, //缺消息占位图
      loading: true,
      lazyLoad: false,
      page: 1,
      jid: -1,
      jburl: "",
      reporturl: "",
      cloneUrl: "",
      clientTouch: {}, //手机端触摸坐标记录
      selJId: null,
      calendarData: null,
      eid: null,
      approveId: null, //审核节点id
      selUid: null, //uid
      selDemandId: null, //需求id
    };
  },
  created() {
    this.display = 0;
    this.getMsg(this.type, this.display);
    this.$E.$on("notify", (obj) => {
      this.toDetail(obj);
    });
  },
  mounted() {
    lazyLoade(this.$refs["sentry"], this.lazyGetMsg);
    if (this.$route.query.Message) {
      setTimeout(() => {
        this.toDetail(this.$route.query);
      }, 2000);
    }
    if (this.$route.query.audit) {
      setTimeout(() => {
        this.$refs.modalForm.showModal({
          auditID: this.$route.query.audit,
        });
      }, 2000);
    }
    // let arr=
    console.log(this.$D.LIST("sys_msg_type"));
  },
  watch: {
    $route() {
      this.msgList = [];
      this.page = 1;
      this.getMsg(this.type, this.display);
    },
    type() {
      if (this.isQuickMsg) {
        this.msgList = [];
        this.page = 1;
        this.getMsg(this.type, this.display);
      }
    },
  },

  methods: {
    ...mapActions(["task_addId", "task_setIndex"]),
    //刷新
    refresh() {
      this.msgList = [];
      this.page = 1;
      this.getMsg(this.type, this.display);
    },
    showTask(task) {
      this.jid = task.JId;
      this.jburl = `/task/${task.EventId}/${this.jid}`;
      this.$modal.show("taskDetail");
      //添加历史
      this.task_addId(this.jid);
      this.task_setIndex(0);
    },
    touchstart() {
      this.clientTouch.X = event.touches[0].clientX;
      this.clientTouch.Y = event.touches[0].clientY;
    },
    touchend(item) {
      if (
        Math.abs(this.clientTouch.X - event.changedTouches[0].clientX) < 30 &&
        Math.abs(this.clientTouch.Y - event.changedTouches[0].clientY) < 30
      ) {
        setTimeout(() => {
          this.$nextTick(() => {
            this.toDetail(item);
          });
        }, 100);
      }
    },
    lazyGetMsg() {
      if (this.msgList.length >= 6) {
        this.page++;
        this.getMsg(this.type, this.display, "", 1);
      }
    },
    changeDispaly(list) {
      let change = {
        未读消息: 0,
        已读消息: 1,
        关注: 2,
      };
      this.msgList = [];
      this.page = 1;
      this.display = change[list[0]];
      this.$emit("chang", this.display);
      this.getMsg(this.type, this.display);
    },
    //消息详情
    toDetail(item, demandeid) {
      let msgTypeList = {
        100: this.toPro,
        101: this.toTask,
        200: this.toReport,
        300: this.toPclm,
        301: this.toRule,
        302: "",
        400: this.toApprove,
        102: this.toRecieveTask,
      };
      let systemMsgList = {
        1: this.toTask,
        2: this.toPro,
        3: this.toReport,
        4: this.toApprove,
        9: this.toKPI,
        7: this.toCalendar,
      };
      if (item.Message.Type == 10) {
        this.jid = demandeid;
        this.eid = item.Demand.Eid;
        this.jburl = `/task/${this.eid}/${this.jid}`;
        this.$modal.show("taskDetail");
        //添加历史
        this.task_addId(this.jid);
        this.task_setIndex(0);
        item.Message.Shape || this.markedRead(item);
        this.cloneUrl = window.location.pathname;
      } else if (item.Message.Type == 8) {
        this.jid = item.JobInfo.JobId;
        this.eid = item.JobInfo.EventId;
        this.jburl = `/task/${this.eid}/${this.jid}`;
        this.$modal.show("taskDetail");
        //添加历史
        this.task_addId(this.jid);
        this.task_setIndex(0);
        item.Message.Shape || this.markedRead(item);
        this.cloneUrl = window.location.pathname;
      } else if (item.Message.Type == 11) {
        this.approveId = item.Message.ReviewNodeId; //审核节点id
        this.selUid = item.AuthorId; //uid
        this.$modal.show("auditModal");
        item.Message.Shape || this.markedRead(item);
        this.cloneUrl = window.location.pathname;
      } else if (item.Message.Type == 1 && item.Demand) {
        this.$router.push({
          path: `/task/${item.Demand.Eid}?`,
          query: {
            activeView: "taskType",
            selDemand: item.Demand,
          },
        });
        item.Message.Shape || this.markedRead(item);
        this.selDemandId = item.Demand.DemandId;
        // this.$modal.show("allLc");
      } else if (item.Message.Type == 1 && item.ReviewNode) {
        this.$router.push({
          path: `/task/${item.ReviewNode.EventeId}?`,
          query: {
            activeView: "approve",
            selDemand: item.ReviewNode,
          },
        });
        item.Message.Shape || this.markedRead(item);
      } else if (
        item.Message.ChildrenType &&
        msgTypeList[item.Message.ChildrenType]
      ) {
        msgTypeList[item.Message.ChildrenType](item);
        this.cloneUrl = window.location.pathname;
        item.Message.Shape || this.markedRead(item);
      } else if (item.Message.ChildrenType == 0 && item.Message.SysMsgType) {
        systemMsgList[item.Message.SysMsgType](item);
        this.cloneUrl = window.location.pathname;
        item.Message.Shape || this.markedRead(item);
      } else {
        this.$message({
          type: "warning",
          message: "该消息没有详情",
        });
        item.Message.Shape || this.markedRead(item);
      }
    },
    //公告弹窗
    toPclm(item) {
      this.pclmID = item.Message.ProclaimId;
      if (this.pclmID) {
        this.$modal.show("pclmDetail");
      }
      item.Message.Shape || this.markedRead(item);
    },
    toKPI(item) {
      this.kid = item.Message.AssessId;
      if (this.kid) {
        this.$modal.show("dialogDetail");
      }
    },
    //制度弹窗
    toRule(item) {
      this.ruleId = item.Message.AregulationId;
      if (this.ruleId) {
        this.$modal.show("ruleDetail");
      }
      item.Message.Shape || this.markedRead(item);
    },
    //项目弹窗
    toPro(item) {
      this.$route.params.eid = item.Message.EventeId;
      this.$modal.show("projectDetail");
      item.Message.Shape || this.markedRead(item);
    },
    //简报弹窗
    toReport(item) {
      let id = item.BulletinInfo.UserId,
        date = item.BulletinInfo.Today.timeFormat("yyyy-MM-dd");
      this.$route.params.id = id;
      this.$route.params.date = date;
      this.reporturl = `/report/${id}/${date}`;
      this.$modal.show("report");
      item.Message.Shape || this.markedRead(item);
    },
    //任务弹窗
    toTask(item) {
      this.jid = item.JobInfo.JobId;
      this.eid = item.JobInfo.EventId;
      this.jburl = `/task/${item.JobInfo.EventId}/${this.jid}`;
      this.$modal.show("taskDetail");
      //添加历史
      this.task_addId(this.jid);
      this.task_setIndex(0);
      item.Message.Shape || this.markedRead(item);
    },
    //合同弹窗
    toContract(item) {
      this.contractId = "";
      this.$modal.show("details");
      item.Message.Shape || this.markedRead(item);
    },
    //去审核
    toApprove(item) {
      this.$refs.modalForm.showModal({
        auditID: item.Message.AuditId,
      });
      item.Message.Shape || this.markedRead(item);
    },
    // 去接收任务
    toRecieveTask(item) {
      this.selJId = item.Message.speedJobId;
      if (this.isChat) {
        this.$modal.show("chatAcceptJob");
      } else {
        this.$modal.show("acceptJob");
      }
      item.Message.Shape || this.markedRead(item);
    },
    //日程提醒
    toCalendar(item) {
      this.calendarData = JSON.parse(item.Message.ScheduleParams);
      this.$modal.show("calendar");
      item.Message.Shape || this.markedRead(item);
    },
    //关注
    async follow(item) {
      try {
        let id = item.Message.MId;
        let type = item.Message.IsTop;
        let res = await this.$http.post("/Msg/MsgTop.ashx", {
          id: id,
        });
        let tip = type ? "取消关注" : "关注成功";
        this.$message({
          type: "success",
          message: tip,
        });
        item.Message.IsTop = type ? 0 : 1;
      } catch (error) {
        console.log("关注消息错误", error);
      }
    },
    //标记已读
    async markedRead(item) {
      try {
        let res = await this.$http.post("/Msg/MsgSta.ashx", {
          ids: [item.Message.MId],
        });
        item.Message.Shape = 1;
        this.$store.commit("msg_SetNum", {
          type: item.Message.Type,
          action: "add",
          value: -1,
        });
      } catch (error) {
        console.log("消息标记已读错误", error);
      }
    },
    //类型消息标记未为已读
    async clearTypeMsg(item) {
      try {
        await this.$confirm(
          "确认将与该消息相关的所有消息标为已读吗？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        let childrenType = item.Message.ChildrenType;
        let typeList = {
          100: ["EventeInfo", "EventeId"],
          101: ["JobInfo", "JobId"],
          200: ["BulletinInfo", "BulletinId"],
        };
        let sourceId = typeList[childrenType];
        let type1 = sourceId[0],
          type2 = sourceId[1],
          id = item[type1][type2];

        let res = await this.$http.post("/Msg/CleanMsgByChildrenType.ashx", {
          sourceId: id,
          childrenType: childrenType,
        });
        let num = this.deleteMsg(type1, type2, id);
        this.$store.commit("msg_SetNum", {
          type: item.Message.Type,
          action: "add",
          value: num,
        });
      } catch (error) {
        if (error !== "cancel") {
          console.log("类型消息标记已读错误", error);
        } else {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        }
      }
    },
    //响应式去除已读消息
    deleteMsg(type1, type2, id) {
      let list = this.msgList.filter((element) => {
        return !(element[type1] && element[type1][type2] === id);
      });
      let num = list.length - this.msgList.length;
      this.msgList = list;
      return num;
    },
    //获取星期
    getDay(val) {
      if (val != null) {
        let date = new Date(val);
        if (this.timeReduce(date) === 0) return "今天";
        if (this.timeReduce(date) === 1) return "昨天";
        const week = {
          0: "星期天",
          1: "星期一",
          2: "星期二",
          3: "星期三",
          4: "星期四",
          5: "星期五",
          6: "星期六",
        };
        return week[date.getDay()];
      }
    },
    //获取时差
    timeReduce(date) {
      let nowTime = new Date();
      if (
        nowTime.getFullYear() === date.getFullYear() &&
        nowTime.getMonth() === date.getMonth()
      ) {
        return nowTime.getDate() - date.getDate();
      }
      return null;
    },
    //获取消息
    getMsg(type, IsRead = 0, order = "", loadtype = 0) {
      // if(type =='unread') return;
      this.noMsg = false;
      if (!loadtype) {
        this.loading = true;
      } else {
        this.lazyLoad = true;
      }
      let typeMatch = {
        unread: "",
        pro: "pro",
        review: "review",
        report: "report",
        ep: "ep",
        customer: "customer",
        calendar: "calendar",
        other: "other",
        system: "system",
        immediate: "immediate",
      };
      let data = {
        type: typeMatch[type],
        IsRead: IsRead,
        CurrentPage: this.page,
        PageCount: 12,
        order: order,
      };
      this.$http
        .post("/msg/Getmsg.ashx#", data)
        .then((res) => {
          let list = this.msgList.concat(res.data.message);
          this.msgList = list;
          this.msgList.forEach((item) => {
            let arr = [];
            item.FileInfo.forEach((val) => {
              arr.push({
                ifName: val.Name,
                ifaddsize: val.Size,
                ifUserName: item.Author,
                ifUploadTime: item.Message.CreateTime,
                ifid: val.Id,
              });
            });
            item.file = arr;
            //给需求阶段通知 type为10的类型添加折叠面板model
            if (item.Message.Type == 10) {
              item.demandTypeActiveName = null;
            }
          });
          this.loading = false;
          this.lazyLoad = false;
          this.noMsg = this.msgList.length ? false : true;
        })
        .catch((error) => {
          console.log("消息获取错误：", error);
        });
    },
    getMsgType(item) {
      let typeList = {
        200: "简报消息",
        300: "公告消息",
        301: "制度消息",
        501: "合同消息",
      };
      let simpleList = {
        11: "评分结果",
        2: "简报消息",
        3: "企业消息",
        5: "客户消息",
      };
      return (
        typeList[item.Message.ChildrenType] || simpleList[item.Message.Type]
      );
    },
    //提取部分内容
    extractPart(content) {
      let lastIndex = content.search(/<\/p>/) + 4;
      content = content.slice(0, lastIndex);
      return content;
    },
    //按时间排序
    orderBy(state, type) {
      this.msgList = [];
      if (state == 0) {
        this.getMsg(this.type, 2, 0);
      } else {
        this.getMsg(this.type, 2, 1);
      }
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.hp-content-child {
  height: 100% !important;
}

.main-box {
  margin-top: 1rem;
  height: calc(100vh - 5rem);
  overflow: auto;
  width: 100%;
}

.relation-msg {
  font-size: 1.4rem;
  font-weight: normal;
  color: #448ef5;
  cursor: pointer;
  border: none;
  background: none;
  margin-left: 1rem;
}

.hi-star {
  color: #bfbfbf;
}

.hi-star,
.hi-star-in {
  margin-left: 1rem;
  font-size: 2rem;
}

.hi-star-in {
  color: #fea940;
}

.no_msg {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 2rem;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #979797;

  img {
    margin-bottom: 1rem;
  }

  .testinput:invalid {
    border-color: #448ef5;
  }
}

.msgBox {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 1.5rem;
  overflow: hidden;
  min-height: 83vh;
  position: relative;
  width: calc(100% - 3rem);

  .msg-item {
    padding: 1rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 10px 0px rgba(225, 224, 224, 1);
    border-radius: 6px;
    margin-bottom: 15px;
    position: relative;

    .fir {
      margin-left: 1.1rem;
    }
    .msg-time {
      font-size: 1rem;
      font-weight: 500;
      color: rgba(155, 155, 155, 1);
      margin-left: 2.5rem;
    }

    .msg-row {
      margin: 0.4rem 0;
    }

    .msg-content {
      background: rgba(248, 248, 248, 1);
      border-radius: 2px;
      border-left: 5px solid #448ef5;
      padding: 1rem;
      margin-left: 2.5rem;
      text-align: justify;

      & > p {
        font-size: 1.4rem;
        font-weight: 500;
        color: #4a4a4a;
        margin-bottom: 8px;
      }

      p:last-child {
        font-size: 1.2rem;
        font-weight: 500;
        color: rgba(109, 109, 109, 1);
        letter-spacing: 1px;
        margin-bottom: 0px;
      }

      // 文件下载
      /deep/#file-list {
        .annexs {
          .anxCtn {
            .single {
              width: 30%;
            }
          }
        }
      }

      .com-content {
        display: flex;
        margin-bottom: 8px;
        align-items: center;

        & > div {
          color: #a2a2a2;
          white-space: nowrap;
          overflow: hidden;

          /deep/ p {
            font-size: 1.4rem;
            overflow: hidden;
            width: 100%;
            text-overflow: ellipsis;

            /deep/ * {
              white-space: nowrap !important;
              background: none !important;
            }
          }
        }

        .childMess {
          color: #575757;
        }

        span:last-child {
          font-size: 1rem;
          font-weight: 500;
          color: #448ef5;
          margin-left: 10px;
          cursor: pointer;
          flex-basis: 7rem;
          white-space: nowrap;
        }
      }

      .remove-margin {
        margin-bottom: 0 !important;
      }

      .look {
        font-size: 1rem;
        font-weight: 500;
        color: rgba(68, 142, 245, 1);
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .msg_demand {
      /deep/.el-collapse {
        .el-collapse-item__header {
          height: 40px;
          line-height: 40px;
          font-weight: bold;
          color: #333333;
        }
        .el-collapse-item__content {
          line-height: normal;
          padding-bottom: 8px;
        }
      }
    }
  }

  .alreadyRead {
    .msg-content {
      opacity: 0.5;
    }

    .time {
      background: #efefef;
      color: #ccc;
    }
  }
}

.msg-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgba(74, 74, 74, 1);
  display: flex;

  div {
    span {
      /deep/ s {
        color: #448ef5;
      }
    }

    &:first-child {
      flex-grow: 1;
    }
  }

  .name {
    padding: 0 10px;
  }
}

.bottom-msg {
  margin-right: 2rem;
}

.svg {
  margin-right: 5px;
}

.name-pic {
  height: 3.5rem;
  width: 3.5rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
  }
}

.time {
  background: rgba(97, 193, 254, 1);
  border-radius: 9px;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  padding: 1px 12px;
  margin-left: 12px;
}

.phone {
  display: none;
}

.hi-undetermined {
  color: #fea940;
}

.hi-project,
.hi-task,
.hi-report,
.hi-pclm,
.hi-rule,
.hi-customer {
  color: #96969f;
}

.hiFont {
  font-weight: normal;
  margin-right: 1rem;
}

.msg-state {
  margin: 0;
}

.hi-extend-cr {
  color: #69c0ff;
}

@media all and (max-width: 1024px) {
  .phone {
    display: inline;
  }

  .pc {
    display: none;
  }

  .msgBox .msg-item .msg-content {
    margin-left: 0;

    p:last-child {
      display: flex;
      flex-direction: column;

      span {
        margin: 0 !important;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    // 文件下载
    /deep/#file-list {
      .annexs {
        padding: 0;

        .anxCtn {
          .single {
            width: 100%;
          }
        }
      }
    }
  }

  .msgBox {
    padding: 1.5rem 0.7rem;
  }

  .look {
    float: right;
  }

  .bottom-msg:first-child {
    display: block;
    margin-bottom: 5px;
  }
}
</style>
