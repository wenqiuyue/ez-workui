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
            <h3>工作平台</h3>
            <el-dropdown
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
            </el-dropdown>
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
              </router-link>
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

export default {
  data() {
    "#main";
    return {
      menuIndex: this.$menuIndex,
      showBtn: true,
      layoutRoutesUser,
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
     * 下拉菜单
     */
    handleCommand(com) {
      if (com == "退出") {
        this.$xStorage.removeItem("token");
        this.$xStorage.removeItem("user-role");
        // this.$xSocket.destroy();
        // this.$xSocket = 0;
        this.$router.push("/");
        this.$message("登出成功");
      }
    },
  },
  mounted() {},
};
</script>

<style lang="less">
@import "../../assets/menu.less";
</style>
