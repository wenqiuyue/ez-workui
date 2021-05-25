import Vue from "vue";
import Router from "vue-router";
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Router.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    // {
    //   //首页设为登录页，如果含有token则自动跳转到home页面
    //   path: "/",
    //   component: () => import("./views/login/Login"),
    // },
    // {
    //   path: "/resetpassword",
    //   component: () => import("./views/resetpassword/resetpassword"),
    // },

    {
      path: "/",
      name: "main",
      component: () => import("../views/main"),
      children: [
        {
          path: "",
          name: "",
          props: {
            menu: 0,
          },
          component: () => import("../views/main/content"),
          // children: [
          //   {
          //     path: "home",
          //     name: "home",
          //     component: () => import("./views/home"),
          //   },
          // ],
        },
      ],
    },
  ],
});
