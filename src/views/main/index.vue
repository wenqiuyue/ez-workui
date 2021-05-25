<template>
  <div id="main">
    <!-- 菜单 -->
    <div class="main">
      <!-- 子菜单 -->
      <div class="hp-sidebar-sub">
        <a
          href="javascpript:;"
          class="el-icon-arrow-down hp-menu-btn hidden-md-and-up"
          @click="hideMobileMenu"
        ></a>
        <!-- 工作 -->
        <div id="sub-work" class="hp-menu-borderd">
          <!-- 标题 -->
          <form>
            <h3>个人工作</h3>
          </form>

          <!-- 菜单列表 -->
          <div>
            <div>
              <!-- 快速笔记 -->
              <a href="javascript:;" class="hiFont hi-note" @click="quickNote">
                <span>快速笔记</span>
              </a>

              <!-- 我的简报 -->
              <router-link
                to="/report"
                class="hiFont hi-report"
                @click.native="hideMobileMenu"
              >
                <span>我的简报</span>
              </router-link>

              <!-- 我的考核 -->
              <router-link
                to="/assessment"
                class="hiFont hi-achievement"
                @click.native="hideMobileMenu"
              >
                <span>我的考核</span>
              </router-link>
              <!-- 我的提成 -->
              <router-link
                to="/commission"
                class="hiFont hi-money-copy"
                @click.native="hideMobileMenu"
              >
                <span>我的提成</span>
              </router-link>

              <!-- 事务申请 -->
              <router-link
                to="/apply"
                class="hiFont hi-apply"
                @click.native="hideMobileMenu"
              >
                <span>事务申请</span>
              </router-link>
              <!-- 事务申请 -->
              <router-link
                to="/assistant"
                class="hiFont hi-user-add"
                @click.native="hideMobileMenu"
              >
                <span>申请介入</span>
              </router-link>
              <!-- 请假排班 -->
              <router-link
                to="/leave"
                class="hiFont hi-apply"
                @click.native="hideMobileMenu"
              >
                <span>请假申请</span>
              </router-link>

              <!-- 我的客户 -->
              <router-link
                to="/myCustomer"
                class="hiFont hi-customer"
                @click.native="hideMobileMenu"
              >
                <span>我的客户</span>
              </router-link>

              <!-- 我的合同 -->
              <router-link
                to="/contract"
                class="hiFont hi-contract"
                @click.native="hideMobileMenu"
              >
                <span>我的合同</span>
              </router-link>

              <!-- 个人收支 -->
              <router-link
                to="/enterpriseBudget"
                class="hiFont hi-statistic"
                @click.native="hideMobileMenu"
              >
                <span>个人收支</span>
              </router-link>

              <!-- 我的考勤 -->
              <router-link
                to="/attendance"
                class="hiFont hi-attendance"
                @click.native="hideMobileMenu"
              >
                <span>我的考勤</span>
              </router-link>

              <!-- 我的日程 -->
              <router-link
                to="/calendar"
                class="hiFont hi-calendar"
                @click.native="hideMobileMenu"
              >
                <span>我的日程</span>
              </router-link>

              <!-- 我的会议 -->
              <router-link
                to="/meeting"
                class="hiFont hi-meeting"
                @click.native="hideMobileMenu"
              >
                <span>我的会议</span>
              </router-link>

              <!-- 我的处罚 -->

              <!-- 通讯录 -->
              <router-link
                to="/directoreies"
                class="hiFont hi-directory"
                @click.native="hideMobileMenu"
              >
                <span>通讯录</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 企业 -->
        <div id="sub-mgr" v-show="menuIndex == 4" class="hp-menu-borderd">
          <!-- 标题 -->
          <form>
            <h3>企业管理</h3>
          </form>

          <!-- 菜单列表 -->
          <div>
            <div>
              <!-- 成员简报 -->
              <router-link
                to="/reports"
                class="hiFont hi-report"
                @click.native="hideMobileMenu"
              >
                <span>成员简报</span>
              </router-link>

              <!-- 成员考勤 -->
              <router-link
                to="/attendances"
                class="hiFont hi-attendance"
                @click.native="hideMobileMenu"
              >
                <span>成员考勤</span>
              </router-link>
              <!-- 成员提成 -->
              <router-link
                to="/memberCommission"
                class="hiFont hi-money-copy"
                @click.native="hideMobileMenu"
              >
                <span>成员提成</span>
              </router-link>

              <!-- 成员实况 -->
              <router-link
                to="/memberProccess"
                class="hiFont hi-overtime"
                @click.native="hideMobileMenu"
              >
                <span>成员实况</span>
              </router-link>

              <!-- 成员周况 -->
              <router-link
                @click.native="hideMobileMenu"
                to="/memberOverview"
                class="hiFont hi-scheduling"
              >
                <span>成员周况</span>
              </router-link>
              <!-- 成员数据 -->
              <router-link
                @click.native="hideMobileMenu"
                to="/memberdata"
                class="hiFont hi-scheduling"
              >
                <span>成员数据</span>
              </router-link>
              <!-- 成员任务 -->
              <router-link
                to="/memberTask"
                class="hiFont hi-task"
                @click.native="hideMobileMenu"
              >
                <span>成员任务</span>
              </router-link>

              <!-- 成员考核 -->
              <router-link
                to="/memberAssessment"
                class="hiFont hi-achievements"
                @click.native="hideMobileMenu"
              >
                <span>成员考核</span>
              </router-link>

              <!-- 成员日程 -->
              <router-link
                to="/calendars"
                class="hiFont hi-calendar"
                @click.native="hideMobileMenu"
              >
                <span>成员日程</span>
              </router-link>

              <!-- 企业公告 -->
              <router-link
                to="/pclm"
                class="hiFont hi-pclm"
                @click.native="hideMobileMenu"
              >
                <span>企业公告</span>
              </router-link>

              <!-- 企业制度 -->
              <router-link
                to="/rule"
                class="hiFont hi-rule"
                @click.native="hideMobileMenu"
              >
                <span>企业制度</span>
              </router-link>

              <!-- 客户管理 -->
              <router-link
                @click.native="hideMobileMenu"
                to="/memberCustomers"
                class="hiFont hi-customer"
              >
                <span>客户管理</span>
              </router-link>

              <!-- 合同管理 -->
              <router-link
                @click.native="hideMobileMenu"
                to="/contracts"
                class="hiFont hi-contract"
              >
                <span>合同管理</span>
              </router-link>

              <!-- 成员收支 -->
              <router-link
                to="/memberBudget"
                class="hiFont hi-statistic-pie"
                @click.native="hideMobileMenu"
              >
                <span>成员收支</span>
              </router-link>

              <!-- 成员会议 -->
              <router-link
                to="/meetings"
                class="hiFont hi-meeting"
                @click.native="hideMobileMenu"
              >
                <span>成员会议</span>
              </router-link>

              <!-- 成员处罚 -->

              <!-- 企业报表 -->
              <router-link
                to="/staticForm"
                class="hiFont hi-statistic-pie"
                @click.native="hideMobileMenu"
              >
                <span>企业报表</span>
              </router-link>
              <!-- 项目标签统计 -->
              <router-link
                to="/labelStatic"
                class="hiFont hi-statistic-pie"
                @click.native="hideMobileMenu"
              >
                <span>标签统计</span>
              </router-link>
              <!-- 知识库 -->
              <router-link
                to="/knowledge"
                class="hiFont hi-knowledge"
                @click.native="hideMobileMenu"
              >
                <span>知识库</span>
              </router-link>

              <!-- 管理后台 -->
              <router-link
                to="/manager/member"
                class="hiFont hi-setting"
                @click.native="hideMobileMenu"
              >
                <span>管理后台</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 个人 -->
        <div id="sub-profile" v-show="menuIndex == 5" class="hp-menu-borderd">
          <!-- 标题 -->
          <form>
            <h3>个人信息</h3>
          </form>

          <!-- 菜单列表 -->
          <div>
            <div>
              <!-- 首页 -->
              <router-link
                to="/home"
                class="hiFont hi-home"
                @click.native="hideMobileMenu"
              >
                <span>首页</span>
              </router-link>
              <!-- 个人信息 -->
              <router-link
                to="/profile"
                class="hiFont hi-profile"
                @click.native="hideMobileMenu"
              >
                <span>个人信息</span>
              </router-link>

              <!-- 更改密码 -->
              <router-link
                to="/updatePassword"
                class="hiFont hi-password"
                @click.native="hideMobileMenu"
              >
                <span>更改密码</span>
              </router-link>

              <!-- 成员投诉 -->
              <router-link
                to="/complaint"
                class="hiFont hi-punish"
                @click.native="hideMobileMenu"
              >
                <span>投诉</span>
              </router-link>

              <!-- 登出 -->
              <a
                href="javascript:;"
                @click="exit"
                class="hiFont hi-signout"
                v-if="showExit"
              >
                <span>登出</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <router-view />
  </div>
</template>

<script>
import xSocketLink from "@/assets/xSocketLink";
import XModal from "@/components/XModal";
// import Note from "@/views/note/note";
// import AddPro from "@/views/pro/AddPro";
// import QuickAdd from "@/views/task/quickAdd";
// import QuickNews from "@/views/msg/QuickNews";
// import Assessment from "@/views/assessment/Assessment";
// import addTask from "@/views/task/addTask";
import { mapState, mapActions, mapGetters } from "vuex";
// import { Notification } from "element-ui";
// import QRCode from 'qrcodejs2'

export default {
  components: {
    XModal,
    // Note,
    // QuickAdd,
    // AddPro,
    // QuickNews,
    // Assessment,
    // addTask,
  },
  data() {
    el: "#main";
    return {
      searchText: "",
      menuIndex: this.$menuIndex,
      openeds: [],
      defaultOpeneds: [],
      menu: [],
      menuSource: [],
      eid: null,
      defaultEid: null,
      proView: 1,
      newPro: null, //新建的项目
      addFileName: "", //新增的项目分类
      projectFileList: [], //项目文件加列表
      selprojectFileList: [], //合并文件夹选项
      mergeFileId: "", //合并文件id
      ECId: "", //被合并文件id
      proFilesLoading: false, //项目管理loading
      showExit: true,
      showProFast: false, //移动端项目快捷按钮
      activeItem: null, //4个box盒子
      taskNum: {
        jobNum: 0,
        jobBox: 0,
        IsRead: true,
      },
      showBtn: true,
      auditListNum: null,
      urgent: {},
      isReward: false,
    };
  },
  computed: {
    ...mapState(["mobile", "user", "delProjectId"]),
    ...mapGetters(["msg"]),

    sortFir: function () {
      if (this.proView == 1) {
        let c = [];
        this.menu.map((item) => {
          let b = {};
          b.id = item.id;
          b.isShow = item.isShow;
          b.name = item.name;
          b.items = this.sortByTime(item.items, "CreateTime");
          c.push(b);
        });
        let items = [];
        c.map((item) => {
          let li = {};
          li.id = item.id;
          li.isShow = item.isShow;
          li.name = item.name;
          li.items = this.sortByFir(item.items, "Fir");
          items.push(li);
        });
        items.forEach((val) => {
          if (val.name == "快捷查看" || val.name == "我关注的项目") {
            val.isShow = false;
          }
        });
        return items;
      } else {
        let c = [];
        this.menu.map((item) => {
          let b = {};
          b.id = item.id;
          b.isShow = item.isShow;
          b.name = item.name;
          b.items = this.sortByTime(item.items, "CreateTime");
          c.push(b);
        });
        let items = [];
        c.map((item) => {
          let b = {};
          b.id = item.id;
          b.isShow = item.isShow;
          b.name = item.name;
          b.items = this.sortBySchedule(item.items, "Schedule");
          items.push(b);
        });
        items.forEach((val) => {
          if (val.name == "快捷查看" || val.name == "我关注的项目") {
            val.isShow = false;
          }
        });
        return items;
      }
    },
  },
  filters: {
    formateNum(val) {
      if (val >= 10000) {
        return val / 10000 + "万";
      } else {
        return val;
      }
    },
    moreThan99(val) {
      if (!val) {
        return "";
      }
      if (val <= 0) {
        return "";
      } else if (val > 99) {
        return "99+";
      } else {
        return val;
      }
    },
  },
  watch: {
    delProjectId: function (newVal, oldVal) {
      if (typeof newVal == "string") {
        this.getMenuInfo();
      } else {
        let showItem = [];
        let index = 0;
        let active;
        this.menu.map((group) => {
          group.items.map((item) => {
            if (item.isShow) {
              showItem.push(item);
              index++;
            }
            if (item.EId == newVal) {
              item.isShow = false;
              active = index;
            }
          });
        });
        if (showItem.length > 6) {
          var eid;
          if (index == active) {
            eid = showItem[active - 2].EId;
          } else {
            eid = showItem[active].EId;
          }
          this.eid = eid;
          this.defaultEid = eid + "";
          this.$router.replace({
            name: "task",
            params: {
              eid: eid,
            },
          });
        } else {
          this.$router.replace({
            name: "taskbox",
            params: {
              eid: -1,
            },
          });
        }
      }
    },
    $route: {
      deep: true,
      handler(newVal, oldVal) {
        console.log(newVal);
      },
    },
  },
  methods: {
    ...mapActions([
      "mobile_ToggleState",
      "msg_SetNumAll",
      "msg_toggleUnreadMainMenu",
      "user_setUser",
      "user_formTOuser",
      "auditLis_setNum",
      "auditLis_toggleUnread",
    ]),
    readMsg() {
      console.log(this.urgent);
    },
    //项目名太长
    showProName(el, name) {
      if (el.target.title) return;
      if (el.target.scrollWidth > el.target.clientWidth) el.target.title = name;
    },
    sortByFir(array, key) {
      //(数组、排序的列)
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return y - x;
      });
    },
    sortBySchedule(array, key) {
      //(数组、排序的列)
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x - y;
      });
    },
    sortByTime(array, key) {
      //(数组、排序的列)
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return x - y ? 1 : -1;
      });
    },
    /**
     * 获取审批数量
     */
    getAuditListNum() {
      // this.$http.post("/Work/Process/QueryAuditListNum.ashx").then((resp) => {
      //   if (resp.res == 0) {
      //     this.auditListNum = resp.data;
      //     this.auditListNum.taskNumSum = parseInt(
      //       this.auditListNum.flowNum + this.auditListNum.taskNum
      //     );
      //     this.auditListNum.kpiNumSum = parseInt(
      //       this.auditListNum.kpiNum + this.auditListNum.complaintNum
      //     );
      //     this.auditListNum.sumNum = parseInt(
      //       resp.data.reportNum +
      //         resp.data.affairNum +
      //         resp.data.kpiNum +
      //         resp.data.complaintNum +
      //         resp.data.taskNum +
      //         resp.data.flowNum
      //     );
      //     this.auditLis_setNum(this.auditListNum);
      //   }
      // });
    },
    /* 获取个人信息 */
    getInfomation() {
      // this.$http
      //   .get("/Person/GetPersonInfo.ashx")
      //   .then((res) => {
      //     const that = this;
      //     const data = res.data;
      //     //将当前登录的用户ID保存到全局
      //     this.user.id = data.UsId;
      //     this.user.name = data.Name;
      //     this.user.img = this.$url + data.Picture;
      //     this.user.Picture = data.Picture;
      //     this.user.departments = data.Reach;
      //     this.user.positions = data.Post;
      //     this.user.qq = data.QQ;
      //     this.user.phone = data.Phone;
      //     this.user.email = data.Email;
      //     this.user.whb = data.WHBAcc;
      //     this.user.rsTime = data.RsTime;
      //     this.user.reTime = data.ReTime;
      //     this.user.onTime1 = data.OnTime1;
      //     this.user.onTime2 = data.OnTime2;
      //     this.user.onTimeActual = data.OnTimeActual;
      //     this.user.offTime = data.OffTime;
      //     this.user.offTimeActual = data.OffTimeActual;
      //     this.user.fn = data.Fn;
      //     this.user.pntReachIds = data.pntReachIds;
      //     this.user.pntUserIds = data.pntUserIds;
      //     this.user.subReachIds = data.subReachIds;
      //     this.user.subUserIds = data.subUserIds;
      //     this.user.firstLoad = true;
      //     //把获取到的数据存入copy 把图片转为base64后再调用全局方法存入个人信息
      //     let image = new Image();
      //     image.crossOrigin = "";
      //     image.src = this.$url + res.data.Picture;
      //     image.onload = function () {
      //       let base64 = that.$getBase64Image(image);
      //       that.user.img = base64;
      //       that.user_setUser(that.user);
      //     };
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    //登出
    exit() {
      try {
        this.$xStorage.removeItem("token");
        if (this.$xSocket) {
          this.$xSocket.destroy();
        }
      } catch {}
      this.$router.push("/");
      this.$message("登出成功");
    },
    quickNote() {
      this.$modal.show("quickNote");
    },
    /**
     * 初始化加载数据
     */
    initData() {
      this.getMenuInfo();
      this.getMsgNum();
      this.getTaskNum();
      if (this.$route.params.eid) {
        this.eid = this.$route.params.eid;
        this.defaultEid = this.$route.params.eid + "";
      }
    },
    /**
     * 获取项目列表数据
     */
    getMenuInfo(newData) {
      // this.$http.get("/Project/projectInquire.ashx").then((response) => {
      //   if (response.res == 0) {
      //     this.menuSource = response.data;
      //     this.menu = JSON.parse(JSON.stringify(this.menuSource));
      //     // 显示新的项目
      //     if (newData != undefined) {
      //       this.newPro = newData.pName;
      //       let active = document.getElementsByClassName(
      //         "el-menu-item is-active"
      //       )[0];
      //       if (active) {
      //         active.scrollIntoView(false);
      //       }
      //       this.openeds = [];
      //       this.searchText = null;
      //       this.search();
      //       this.$refs.menu.open(newData.pId + "");
      //       this.eid = newData.eId;
      //       this.defaultEid = newData.eId + "";
      //       this.$router.replace({
      //         name: "task",
      //         params: {
      //           eid: newData.eId,
      //         },
      //       });
      //     }
      //   }
      // });
    },
    // 获取任务箱数量和任务数量
    getTaskNum() {
      // this.$http.post("/Project/EventeSummary.ashx").then((res) => {
      //   // console.log(res)
      //   if (res.res == 0) {
      //     this.taskNum.jobNum = res.data.JobNumber;
      //     this.taskNum.jobBox = res.data.JobBoxNumber;
      //     this.taskNum.IsRead = res.data.IsRead;
      //   }
      // });
    },
    /**
     * 获取消息菜单的数字
     */
    getMsgNum() {
      // this.$http
      //   .get("/msg/GetMsgNum.ashx")
      //   .then((response) => {
      //     if (response.res == 0) {
      //       this.msg_SetNumAll(response.data);
      //       this.getChatMsgMum();
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    //获取未读聊天消息
    async getChatMsgMum() {
      // try {
      //   let res = await this.$http.get("/Msg/Chat/statisticalTotalCount.ashx");
      //   this.$store.commit("msg_SetNum", {
      //     type: 98,
      //     value: res.data,
      //   });
      // } catch (error) {
      //   console.log("获取未读聊天消息错误", error);
      // }
    },
    handleOpen(key, keyPath) {
      this.showBtn = true;
      this.openeds.push(key);
    },
    handleClose(key, keyPath) {
      _.pull(this.openeds, key);
    },

    //项目查询
    search() {
      this.menu = JSON.parse(JSON.stringify(this.menuSource));
      if (!this.searchText) {
        this.defaultOpeneds = JSON.parse(JSON.stringify(this.openeds));
        return;
      }
      const srch = this.searchText.toLowerCase();
      this.menu.map((group) => {
        let hideCount = 0;
        group.items.map((item) => {
          if (item.Name.toLowerCase().indexOf(srch) < 0) {
            item.isShow = false;
            hideCount++;
          }
        });
        if (group.items.length == hideCount) {
          group.isShow = false;
        }
      });
      let openeds = [];
      this.menu.map((group) => {
        if (group.isShow) openeds.push(group.id);
      });
      this.defaultOpeneds = openeds;
    },

    hideMobileMenu(notPro = true) {
      if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
        this.menuIndex = null;
      }
      this.showBtn = true;
      if (notPro) {
        this.eid = null;
      }
      this.mobile_ToggleState({
        action: "all",
        value: false,
      });
    },

    changeNav(index) {
      this.showProFast = false;
      if (index == 1) {
        this.msg_toggleUnreadMainMenu(false);
      }
      if (index == 4) {
        this.auditLis_toggleUnread(false);
      }
      if (
        navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) &&
        index == 2 &&
        !this.showProFast
      ) {
        this.showBtn = !this.showBtn;
      } else if (
        navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) &&
        index == 2
      ) {
        this.showBtn = false;
      } else {
        this.showBtn = true;
      }
      if (
        this.mobile.showMobileTop &&
        this.menuIndex == index &&
        navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
      ) {
        this.mobile_ToggleState({
          action: "all",
          value: false,
        });
        this.menuIndex = null;
      } else {
        this.mobile_ToggleState({
          action: "all",
          value: true,
        });
        this.menuIndex = index;
      }
    },
    showPopover() {
      this.showProFast = !this.showProFast;
    },
    //项目的下拉菜单
    handleProList(action) {
      switch (action) {
        case "quickNote": //快速笔记
          this.$modal.show("quickNote");
          break;
        case "addPro": //添加项目
          this.isReward = false;
          setTimeout(() => {
            this.$modal.show("addPro");
          }, 50);
          break;
        case "sendTask": //快速安排任务
          this.$modal.show("sendTask");
          break;
        case "manageFile": //管理项目分类
          this.$modal.show("manageFile");
          this.getProjectList();
          break;
        case "showPriority": //按优先级进行显示
          this.proView = 1;
          this.$xStorage.setItem("proView", 1);
          break;
        case "showStatus": //项目状态进行显示
          this.proView = 2;
          this.$xStorage.setItem("proView", 2);
          break;
        case "addAssess": //添加考核
          this.$modal.show("assessment");
          break;
        case "addTask":
          this.$modal.show("mainAddTask");
          break;
        case "addRewardPro": //创建悬赏项目
          this.isReward = true;
          setTimeout(() => {
            this.$modal.show("addPro");
          }, 50);
          break;
      }
    },
    //获取项目视图
    getTask(eid, genre, name) {
      if (name == this.newPro) {
        this.newPro = null;
      }
      this.hideMobileMenu(false);
      if (this.eid == eid) return;
      if (genre == null) {
        if (eid == -1) {
          this.$router.push("/taskbox");
        } else {
          this.$router.push({
            name: "quickview",
            params: {
              eid: eid,
            },
          });
        }
      } else {
        this.$router.push({
          name: "task",
          params: {
            eid: eid,
          },
        });
      }
      this.eid = eid;
    },
    toPlan(path) {
      this.showBtn = true;
      this.eid = null;
      this.$router.replace({
        path: "/" + path,
      });
    },
    //项目管理弹窗
    alterFileName(index) {
      //修改文件夹名
      for (let i = 0; i < this.projectFileList.length; i++) {
        if (i == index) {
          this.projectFileList[index].edit = false;
        } else {
          this.projectFileList[i].edit = true;
        }
      }
      this.$nextTick(() => {
        this.$refs.reNameInput[0].focus();
      });
    },

    submitName(item, index) {
      //项目分类重命名
      this.projectFileList[index].edit = true;
      if (item.reName == item.Name) {
        return;
      }
      if (item.reName.length > 15) {
        this.$notify({
          message: "文件夹名长度不能超过15个字符",
          type: "warning",
        });
        return;
      }
      this.$http
        .post("/Project/ProjectType/ProjectTypeEdit.ashx", {
          ECId: item.ECId,
          Name: item.reName,
        })
        .then((res) => {
          if (res.res == 0) {
            this.projectFileList[index].Name = item.reName;
          }
        });
    },
    addFile() {
      //增加一个项目分类
      if (this.addFileName == "") {
        this.$notify({
          message: "请输入新建的文件分类",
          type: "warning",
        });
        return;
      }
      if (this.addFileName.length > 15) {
        this.$notify({
          message: "文件夹名长度不能超过15个字符",
          type: "warning",
        });
        return;
      }
      this.$http
        .post("/Project/ProjectType/ProjectTypeEdit.ashx", {
          Name: this.addFileName,
        })
        .then((res) => {
          if (res.res == 0) {
            this.addFileName = "";
            this.getProjectList();
          }
        });
    },
    getProjectList() {
      //获取当前项目分类列表
      // this.proFilesLoading = true;
      // this.$http
      //   .get("/Project/ProjectType/ProjectTypeList.ashx")
      //   .then((res) => {
      //     if (res.res == 0) {
      //       res.data.forEach((item) => {
      //         item.edit = true;
      //         item.reName = item.Name;
      //       });
      //       this.projectFileList = res.data;
      //       this.proFilesLoading = false;
      //     }
      //   });
    },
    delFile(id, index) {
      //删除文件夹
      this.$confirm("确认删除此文件夹？", "提示", {
        type: "warning",
      }).then(() => {
        this.$http
          .post("/Project/ProjectType/ProjectTypeDel.ashx", {
            ECId: id,
          })
          .then((res) => {
            if (res.res == 0) {
              this.projectFileList.splice(index, 1);
            }
          });
      });
    },
    mergeFile(id) {
      //项目分类管理合并文件
      this.$modal.show("showSelect");
      this.ECId = id;
      this.selprojectFileList = [];
      this.projectFileList.forEach((item) => {
        if (item.ECId !== id) {
          this.selprojectFileList.push(item);
        }
      });
    },
    mergeFiles() {
      //合并文件夹
      if (this.mergeFileId == "") {
        this.$notify({
          message: "请选择一个文件夹",
          type: "warning",
        });
        return;
      }
      this.$http
        .post("/Project/ProjectType/ProjectTypeMerge.ashx", {
          ECId: this.ECId,
          MergeId: this.mergeFileId,
        })
        .then((res) => {
          if (res.res == 0) {
            this.mergeFileId = "";
            this.getProjectList();
            this.$modal.hide("showSelect");
          }
        });
    },
    closeManageFile() {
      //关闭项目管理弹窗
      this.getMenuInfo();
    },
  },
  created() {
    this.getInfomation();
    this.getAuditListNum();
  },
  mounted() {
    //初始化加载数据
    this.initData();
  },
};
</script>

<style lang="less">
@import "../../assets/menu.less";
</style>
