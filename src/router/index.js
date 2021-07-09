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
//用户端在routes的index为1，管理端的index为2，其余页面请以此也在后面
const routes = [
  {
    //首页设为登录页，如果含有token则自动跳转到home页面
    path: "",
    component: () => import("@/userview/login"),
  },
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
        redirect: "/profile",
        component: () => import("@/userview/main/content"),
        children: [
          {
            path: "/profile",
            name: "个人信息",
            component: () => import("@/userview/profile"),
            layout: true,
            icon: "hi-profile",
          },
          {
            path: "/dataAnalysis",
            name: "数据分析",
            component: () => import("@/userview/data-analysis"),
            layout: true,
            icon: "hi-statistic",
          },
          {
            path: "/teamManagement",
            name: "团队管理",
            component: () => import("@/userview/team-management"),
            layout: true,
            icon: "hi-customer",
          },
          {
            path: "/attendanceStatistics",
            name: "考勤统计",
            component: () => import("@/userview/attendance-statistics"),
            layout: true,
            icon: "hi-attendance",
          },
          {
            path: "/ruleSetting",
            name: "规则设置",
            component: () => import("@/userview/process-rulesver"),
            layout: true,
            icon: "hi-liuchengshezhi",
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
            path: "/manager/processRulesVer",
            name: "进程规则管理",
            component: () => import("@/views/processRulesVer"),
            layout: true,
            icon: "hi-contract",
          },
          // {
          //   path: "/manager/databaseManagement",
          //   name: "数据库管理",
          //   component: () => import("@/views/databaseManagement"),
          //   layout: true,
          //   icon: "hi-projects-o",
          // },

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
  // 修改密码
  {
    path: "/resetpassword",
    component: () => import("@/userview/reset-password"),
  },
  // 注册
  {
    path: "/register",
    component: () => import("@/userview/register"),
  },
  // 邀请加入团队
  {
    path: "/jointeam",
    component: () => import("@/userview/team-management/invitation-join"),
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
const layoutRoutes = _flat([routes[2]]);
const layoutRoutesUser = _flat([routes[1]]);
export { routes, layoutRoutes, layoutRoutesUser };

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
