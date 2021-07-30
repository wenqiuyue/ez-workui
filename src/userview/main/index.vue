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
            <h3 @click="handleHome" class="header_title_main">工作平台</h3>
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
              <router-link
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
              </router-link>
              <a href="javascript:;" @click="exit" class="hiFont hi-signout">
                <span>登出</span>
              </a>
              <div class="title_bottom" @click="handleHome">
                <img class="mb" src="@/assets/main/main_mb.png" />
                <p>http://47.106.90.178:703/</p>
              </div>
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
import { mapState, mapActions } from "vuex";
import { layoutRoutesUser } from "@/router";
import xSocketLink from "@/assets/xSocketLink";
export default {
  data() {
    "#main";
    return {
      menuIndex: this.$menuIndex,
      showBtn: true,
      layoutRoutesUser,
      applyCount: null, //申请数量
    };
  },
  computed: {
    ...mapState(["mobile"]),
  },
  methods: {
    ...mapActions(["mobile_ToggleState"]),
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
     * 官网
     */
    handleHome() {
      window.open("http://47.106.90.178:703/");
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
      this.$message("登出成功");
    },
    /**
     * 获取申请条数
     */
    getApplyCount() {
      this.$http
        .post("/Teams/InvitedOrApply/GetApplyMessage.ashx")
        .then((resp) => {
          if (resp.res == 0) {
            this.applyCount = resp.data;
          }
        });
    },
  },
  mounted() {
    this.getApplyCount();
    //建立Socket链接
    // return;
    let _this = this;
    new xSocketLink({
      onMsg: (res) => {
        if (["25"].includes(res.res)) {
          _this.$E.$emit("loadpic", res); //发来开始进程截图
        } else if (["26"].includes(res.res)) {
          _this.$E.$emit("loadingpic", res); //发来加载进程截图
        } else if (["120"].includes(res.res)) {
          this.applyCount = res.data.ApplySumCount; //更新团队申请数量
        }
      },
    });
  },
};
</script>

<style lang="less">
@import "../../assets/menu.less";
</style>
<style lang="less" scoped>
/deep/.title_bottom {
  position: absolute;
  bottom: 12px;
  height: 58px !important;
  text-align: center;
  width: 100%;
  cursor: pointer;
  .mb {
    height: 26px;
  }
  p {
    color: #4078c0;
    margin-top: 5px;
  }
}
</style>
