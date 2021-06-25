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
//用户端在routes的index为0，管理端的index为1，其余页面请以此也在后面
const routes = [
  // {
  //   //首页设为登录页，如果含有token则自动跳转到home页面
  //   path: "/",
  //   component: () => import("./views/login/Login"),
  // },
  // {
  //   path: "/resetpassword",
  //   component: () => import("./views/resetpassword/resetpassword"),
  // },
  /**
   * 用户端
   */
  {
    path: "",
    name: "",
    component: () => import("@/userview/main"),
    children: [
      {
        path: "",
        name: "",
        props: {
          menu: 0,
        },
        redirect: "/teamManagement",
        component: () => import("@/userview/main/content"),
        children: [
          {
            path: "/teamManagement",
            name: "团队管理",
            component: () => import("@/userview/team-management"),
            layout: true,
            icon: "hi-customer",
          },
        ],
      },
    ],
  },
  /**
   * 管理端
   */
  {
    path: "/manager",
    name: "main",
    component: () => import("@/views/main"),
    children: [
      {
        path: "",
        name: "",
        props: {
          menu: 0,
        },
        redirect: "/manager/teamManagement",
        component: () => import("@/views/main/content"),
        children: [
          {
            path: "/manager/teamManagement",
            name: "团队管理",
            component: () => import("@/views/teamManagement"),
            layout: true,
            icon: "hi-customer",
          },
          // {
          //   path: "/memberManagement",
          //   name: "成员管理",
          //   component: () => import("@/views/memberManagement"),
          //   layout: true,
          //   icon: "hi-contract",
          // },
          // {
          //   path: "/orderManagement",
          //   name: "订单管理",
          //   component: () => import("@/views/orderManagement"),
          //   layout: true,
          //   icon: "hi-statistic",
          // },
          // {
          //   path: "/teamOrderManagement",
          //   name: "团队订单管理",
          //   component: () => import("@/views/teamOrderManagement"),
          //   layout: true,
          //   icon: "hi-attendance",
          // },
          {
            path: "/manager/roleManagement",
            name: "角色管理",
            component: () => import("@/views/roleManagement"),
            layout: true,
            icon: "hi-report",
          },
          {
            path: "/manager/userManagement",
            name: "用户管理",
            component: () => import("@/views/userManagement"),
            layout: true,
            icon: "hi-achievement",
          },
          {
            path: "/manager/editionManager",
            name: "版本管理",
            component: () => import("@/views/editionManager"),
            layout: true,
            icon: "hi-shenhe7",
          },
          {
            path: "/manager/processRulesManager",
            name: "进程规则管理",
            component: () => import("@/views/processRulesManager"),
            layout: true,
            icon: "hi-contract",
          },
          {
            path: "/manager/databaseManagement",
            name: "数据库管理",
            component: () => import("@/views/databaseManagement"),
            layout: true,
            icon: "hi-projects-o",
          },

          {
            path: "/manager/dictionary",
            name: "数据字典",
            component: () => import("@/views/dictionary"),
            layout: true,
            icon: "hi-Notebook",
          },
          // {
          //   path: "/memberProccess",
          //   name: "成员实况",
          //   component: () => import("@/views/memberProccess"),
          //   layout: true,
          //   icon: "hi-money-copy",
          // },
        ],
      },
    ],
  },
];

const _flat = (data) => {
  const result = [];

  const _ = (data) => {
    data.forEach((item) => {
      const { layout, children, ...props } = item;

      if (layout === true)
        result.push({
          layout,
          ...props,
        });

      if (Array.isArray(children) && children.length >= 1) _(children);
    });
  };

  _(data);

  return result;
};
const layoutRoutes = _flat([routes[1]]);
const layoutRoutesUser = _flat([routes[0]]);
export { routes, layoutRoutes, layoutRoutesUser };

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
