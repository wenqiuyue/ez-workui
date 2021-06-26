import Vue from "vue";
import VModal from "vue-js-modal";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import echarts from "echarts";
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

Vue.prototype.$echarts = echarts;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
