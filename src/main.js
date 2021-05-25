import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/HiFont/iconfont.js"; //字体图标
import "@/assets/HiFont/iconfont.css"; //字体图标
import "@/assets/reset.less"; //覆盖全局样式
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
