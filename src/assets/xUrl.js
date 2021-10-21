import Vue from "vue";
import axios from "axios";
import { Notification } from "element-ui";
import router from "@/router";

let SocketUrl = "";
if (window.location.protocol === "https:") {
  SocketUrl = "wss://";
} else {
  SocketUrl = "ws://";
}
if (process.env.NODE_ENV === "development" || window.location.port === "773") {
  //***** 测试 *****
  SocketUrl += "47.106.90.178:711";
  // axios.BaseUrl = "http://47.106.90.178:711";
  axios.BaseUrl = "http://192.168.1.105:8081";
} else {
  //***** 线上 *****
  SocketUrl += window.location.host;
  axios.BaseUrl = ""; //后端的接口域名
  axios.defaults.withCredentials = true;

  //***** 企业 *****
  // const SocketUrl = "ws://47.108.112.144:798"; //后端的Socket请求域名
  // axios.BaseUrl = "http://47.108.112.144:798"; //后端的接口域名
}

// cancelToken
let cancelToken = axios.CancelToken;
// 两个取消的请求是一组请写在这里
let cancelUrl = [
  [
    "/User/MemberDataDetailsSummary.ashx#",
    "/Teams/MemberJob/MemberDataDetails.ashx#",
    "/General/GetProcessImg.ashx#",
    "/General/GetProcessImgWithForm.ashx#",
    "/User/MemberPeriod.ashx#",
    "/User/Work/GetBehaviorThermodynamicChart.ashx#",
    "/User/Work/WorkEfficiencyAnalysis.ashx#",
  ],
];
let pending = [];
let isGroup = (requset, cancel) => {
  for (let item of cancelUrl) {
    if (item.includes(requset) && item.includes(cancel)) {
      return true;
    }
  }
  return false;
};
//请求拦截
axios.interceptors.request.use(
  (config) => {
    if (config.url.includes("/Api/mgr.ashx")) return config; //此代码是因为/Api/mgr.ashx类型的接口都会跨域，所以直接跳过请求拦截
    let token = Vue.prototype.$xStorage.getItem("token");
    config.baseURL = axios.BaseUrl; //根域名
    //config.timeout=10000 //网络超时
    if (token) {
      config.headers.Authorization = token;
    }
    if (config.url.charAt(config.url.length - 1) === "#") {
      let temp = pending;
      pending.forEach(function (item, index) {
        if (item.u === config.url || isGroup(config.url, item.u)) {
          item.f();
          temp.splice(index, 1);
        }
      });
      pending = temp;
    }
    config.cancelToken = new cancelToken(function (c) {
      pending.push({
        u: config.url,
        f: c,
      });
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截
 * author:zxg
 */
const filterUrls = [
  "/User/Work/NoticeUserScreenshots.ashx",
  "/User/Work/NoticeUserPhotographs.ashx",
  "/Handler/ChatUploadFile.ashx",
];
axios.interceptors.response.use(
  async (response) => {
    const result = response.data;
    for (var url of filterUrls) {
      if (response.config.url.indexOf(url) >= 0) {
        return result;
      }
    }
    if (response.status < 200 || response.status >= 300) {
      const apiUrl = response.config.url.substring(axios.BaseUrl.length);
      Notification.error({
        title: "服务器错误",
        message: result.msg,
      });
      return Promise.reject(null).catch(function () {});
    }
    if (result.res == 3) {
      return result;
    }
    // 返回数据错误
    if (
      result.res != 0 &&
      result.res != 200 &&
      result.res != 2 &&
      result.res != 99 &&
      result.res != 5
    ) {
      Notification.error({
        title: "错误",
        message: result.msg,
      });
    } else if (result.res == 2) {
      Notification.warning({
        title: "警告",
        message: result.msg,
      });
    } else if (result.res == 99) {
      Notification.warning({
        title: "登录超时",
        message: "即将返回登录页面",
      });
      pending.forEach(function (item, index) {
        item.f();
      });
      pending = [];
      router.push("/?callback=" + window.location.pathname);
      Vue.prototype.$xStorage.removeItem("token");
    }
    return result;
  },
  (error) => {
    if (error.message) {
      if (error.message.indexOf("500") > -1) {
        Notification.error({
          message: "服务器错误 500",
        });
      }
      // 对响应错误做点什么
      return Promise.reject(error);
    } else {
      return error;
    }
  }
);
export default {
  install: function (Vue) {
    Vue.prototype.$http = axios;
    Vue.prototype.$mainUrl = window.location.protocol + "//" + location.host;
    Vue.prototype.$url = axios.BaseUrl;
    Vue.prototype.$socketUrl = SocketUrl;
  },
};
