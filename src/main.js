import Vue from "vue";
import VModal from "vue-js-modal";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import echarts from "echarts";
import VueClipboard from "vue-clipboard2";
import VueCropper from "vue-cropper";
import _ from "lodash";

import "@/assets/HiFont/iconfont.js"; //字体图标
import "@/assets/HiFont/iconfont.css"; //字体图标
import "@/assets/reset.less"; //覆盖全局样式
import xVar from "@/assets/xVar"; //引入全局属性和函数
import xUrl from "@/assets/xUrl"; //引入接口统一管理文件

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(xVar);
Vue.use(xUrl);
Vue.use(VModal);
Vue.use(VueClipboard);
Vue.use(VueCropper);
Vue.prototype.$echarts = echarts;

/**
 * 全局前置守卫
 */
router.beforeEach((to, from, next) => {
  let token = Vue.prototype.$xStorage.getItem("token");
  let role = Vue.prototype.$xStorage.getItem("user-role");
  if (token && role) {
    if (to.path == "/") {
      if (role.role == "管理员") {
        next({ path: "/manager" });
      } else {
        next({ path: "/profile" });
      }
    } else {
      next();
    }
  } else if (
    to.path != "/" &&
    to.path != "/resetpassword" &&
    to.path != "/register" &&
    to.path != "/jointeam"
  ) {
    next({ path: "/" });
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
