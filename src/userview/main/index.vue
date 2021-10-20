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
            <h3>易掌-工作平台</h3>
            <!-- <el-dropdown
              style="text-align: right; margin: 2rem 1rem"
              trigger="click"
              @command="handleCommand"
            >
              <i
                class="el-icon-s-tools"
                style="font-size: 22px; cursor: pointer"
              ></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="退出">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </form>

          <!-- 菜单列表 -->
          <div>
            <div>
              <el-menu
                :default-active="
                  user && user.TeamCount == 0 ? '/teamManagement' : '/home'
                "
                class="el-menu-vertical-demo"
                router
                ><el-menu-item index="/home">
                  <i class="hiFont hi-home"></i>
                  <span slot="title">首页</span>
                </el-menu-item>
                <el-menu-item index="/teamManagement">
                  <i class="hiFont hi-customer"></i>
                  <span slot="title">团队管理</span>
                </el-menu-item>
                <el-menu-item
                  index="/memberData"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-statistic"></i>
                  <span slot="title">数据分析</span>
                </el-menu-item>
                <el-menu-item
                  index="/memberProccess"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-overtime"></i>
                  <span slot="title">成员实况</span>
                </el-menu-item>
                <el-menu-item
                  index="/sensitiveword"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-minganciku"></i>
                  <span slot="title">敏感词记录</span>
                </el-menu-item>
                <!-- <el-submenu index="1">
                  <template slot="title">
                    <i class="hiFont hi-relate"></i>
                    <span>数据监控</span>
                  </template>
                  <el-menu-item index="/networkRequest">
                    <i class="hiFont hi-wangluo"></i>
                    <span slot="title">网络请求</span></el-menu-item
                  >
                  <el-menu-item index="/flow">
                    <i class="hiFont hi-liuliang"></i>
                    <span slot="title">流量监控</span></el-menu-item
                  >
                  <el-menu-item index="/mail">
                    <i class="hiFont hi-youjian"></i>
                    <span slot="title">邮件监控</span></el-menu-item
                  >
                  <el-menu-item index="/fileOperation">
                    <i class="hiFont hi-folder"></i>
                    <span slot="title">文件操作</span></el-menu-item
                  >
                  <el-menu-item index="/print">
                    <i class="hiFont hi-dayin"></i>
                    <span slot="title">打印监控</span></el-menu-item
                  >
                </el-submenu> -->
                <el-menu-item
                  index="/attendanceStatistics"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-attendance"></i>
                  <span slot="title">考勤统计</span>
                </el-menu-item>
                <el-menu-item
                  index="/taskDetails"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-task"></i>
                  <span slot="title">成员任务</span>
                </el-menu-item>
                <el-menu-item
                  index="/taskManager"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-task-box"></i>
                  <span slot="title">任务管理</span>
                </el-menu-item>
                <el-menu-item
                  index="/salaryreport"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-xinzipeizhi"></i>
                  <span slot="title">薪资报表</span>
                </el-menu-item>
                <el-menu-item
                  index="/applyAudit"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-reviews"></i>
                  <span slot="title">事务审批</span>
                </el-menu-item>
                <el-menu-item
                  index="/msglist"
                  :disabled="user && user.TeamCount == 0 ? true : false"
                >
                  <i class="hiFont hi-msg"></i>
                  <span slot="title">消息列表</span>
                </el-menu-item>

                <el-menu-item index="/profile">
                  <i class="hiFont hi-profile"></i>
                  <span slot="title">个人信息</span>
                </el-menu-item>
                <el-menu-item @click="handleManual">
                  <i class="hiFont hi-Notebook"></i>
                  <span slot="title">使用说明</span>
                </el-menu-item>
                <el-menu-item @click="handleDowload">
                  <i class="hiFont hi-download"></i>
                  <span slot="title">下载客户端</span>
                </el-menu-item>
                <el-menu-item @click="exit">
                  <i class="hiFont hi-signout"></i>
                  <span slot="title">退出</span>
                </el-menu-item>
              </el-menu>
              <!-- <router-link
                v-for="{ path, name, icon } of layoutRoutesUser"
                :key="path"
                :to="path"
                :class="['hiFont', icon]"
                @click.native="hideMobileMenu"
              >
                <span>{{ name }}</span>
                <i v-if="name == '团队管理' && applyCount > 0">{{
                  applyCount > 99 ? "+99" : applyCount
                }}</i>
                <i v-if="name == '消息列表' && informationCount > 0">
                  {{ informationCount > 99 ? "+99" : informationCount }}
                </i>
              </router-link>
              <a href="javascript:;" @click="exit" class="hiFont hi-signout">
                <span>退出</span>
              </a> -->
              <div class="title_bottom" @click="handleHome">
                <!-- <img class="mb" src="@/assets/main/main_mb.png" />
                <p>http://www.ezteams.cn</p> -->
                <p>官 网</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <router-view />
    <el-drawer
      :visible.sync="drawerManual"
      direction="rtl"
      size="60%"
      class="drawer_manual"
    >
      <div slot="title">
        <div>
          <span style="margin-right: 10px">使用说明</span
          ><el-radio-group v-model="roleType">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="2">员工</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 操作手册 -->
      <Manual :roleType="roleType" ref="manual"></Manual>
    </el-drawer>
    <div class="quickBox quick-add" @click="handleManual">
      <i class="hiFont hi-Notebook"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { layoutRoutesUser } from "@/router";
import xSocketLink from "@/assets/xSocketLink";
export default {
  components: {
    Manual: () => import("./manual"),
  },
  data() {
    "#main";
    return {
      roleType: 1, //角色
      menuIndex: this.$menuIndex,
      showBtn: true,
      layoutRoutesUser,
      applyCount: null, //申请数量
      informationCount: null, //消息数量
      drawerManual: false, //使用手册抽屉
    };
  },
  computed: {
    ...mapState(["mobile", "user"]),
  },
  watch: {
    roleType(val, oval) {
      if (val != oval) {
        this.$refs.manual.initSelStep();
      }
    },
  },
  methods: {
    ...mapActions(["mobile_ToggleState", "user_setUser"]),
    /**
     * 获取用户信息
     */
    getUserInfo() {
      this.$http
        .get("/Management/UserManagement/GetUserDetail.ashx", {
          params: { usId: null },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.user_setUser(resp.data);
            if (resp.data.TeamCount == 0) {
              this.$router.push("/teamManagement");
            }
          }
        });
    },
    /**
     * 下载客户端
     */
    handleDowload() {
      window.location.href = "http://admin.ezteams.cn/download.ashx";
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
    /**
     * 操作手册
     */
    handleManual() {
      this.drawerManual = true;
    },
    /**
     * 官网
     */
    handleHome() {
      window.open("http://www.ezteams.cn");
    },
    /**
     * 退出
     */
    exit() {
      this.$xStorage.removeItem("token");
      this.$xStorage.removeItem("user-role");
      // this.$xSocket.destroy();
      // this.$xSocket = 0;
      this.$router.push("/");
      this.$message("退出成功");
    },
    /**
     * 获取申请条数
     */
    getCount() {
      Promise.all([
        this.$http.post("/Teams/InvitedOrApply/GetApplyMessage.ashx"),
        this.$http.post("/Information/GetSumNewInformation.ashx"),
      ]).then((resp) => {
        if (resp[0].res == 0) {
          this.applyCount = resp[0].data;
        }
        if (resp[1].res == 0) {
          this.informationCount = resp[1].data.Count;
        }
      });
    },
  },
  mounted() {
    this.getCount();
    this.getUserInfo();
    //建立Socket链接
    // return;
    this.$http.get("/User/GetLocalIP.ashx").then((resp) => {
      if (resp.res == 0) {
        this.$xStorage.setItem("user-local-iP", resp.data);
        let _this = this;
        new xSocketLink({
          onMsg: (res) => {
            if (["25"].includes(res.res)) {
              _this.$E.$emit("loadpic", res); //发来开始进程截图
            } else if (["26"].includes(res.res)) {
              _this.$E.$emit("loadingpic", res); //发来加载进程截图
            } else if (["120"].includes(res.res)) {
              this.applyCount = res.data.ApplySumCount; //更新团队申请数量
            } else if (["122"].includes(res.res)) {
              this.informationCount = res.data.InformationCount; //更新消息数量
            } else if (["28"].includes(res.res)) {
              _this.$E.$emit("loadcamerapic", res); //发来通知成员拍照
            } else if (["29"].includes(res.res)) {
              _this.$E.$emit("loadingcamerapic", res); //发来返回摄像头拍照图片
            }
          },
        });
        console.log(this.localIP);
      }
    });
  },
};
</script>

<style lang="less">
@import "../../assets/menu.less";
</style>
<style lang="less" scoped>
#sub-work {
  .el-menu {
    .el-submenu__title {
      .hiFont {
        margin-right: 5px;
      }
    }
    .el-menu-item {
      height: 44px;
      line-height: 44px;
      .hiFont {
        margin-right: 5px;
      }
    }
  }
}

/deep/.title_bottom {
  position: absolute;
  bottom: 16px;
  // height: 58px !important;
  height: auto !important;
  text-align: center;
  width: 100%;
  cursor: pointer;
  border-top: 1px solid #e4e7ed;
  .mb {
    height: 32px;
  }
  p {
    color: #4078c0;
    margin-top: 5px;
    font-size: 13px;
  }
}
</style>
