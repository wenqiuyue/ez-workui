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
          </form>

          <!-- 菜单列表 -->
          <div>
            <div>
              <router-link
                v-for="{ path, name, icon } of layoutRoutes"
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
import { layoutRoutes } from "@/router";

export default {
  data() {
    "#main";
    return {
      menuIndex: this.$menuIndex,
      showBtn: true,
      layoutRoutes,
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
  },
  mounted() {},
};
</script>

<style lang="less">
@import "../../assets/menu.less";
</style>
