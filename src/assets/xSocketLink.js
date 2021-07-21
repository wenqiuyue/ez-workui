import Vue from "vue";
import store from "./../store";
import xSocket from "./xSocket";

export default class xSocketLink {
  /**
   * 连接socket
   * @param {Object} opt
   * {
   *    onMsg: function(res) {},     //接收到消息的回调函数（除心跳等无用消息），参数是socket接收到返回数据
   * }
   */
  constructor(opt) {
    if (Vue.prototype.$xSocket) {
      Vue.prototype.$xSocket.destroy();
    }
    //链接socket
    const wsParam = {
      token: Vue.prototype.$xStorage.getItem("token"),
      ua: navigator.userAgent,
    };
    //是否重连
    let isReconnect = false;
    if (wsParam.token) {
      Vue.prototype.$xSocket = new xSocket({
        url: `${Vue.prototype.$socketUrl}/socket/ws.ashx?p=${JSON.stringify(
          wsParam
        )}`,
        onopen: function (e) {
          console.log("socket链接成功");
          Vue.prototype.$toClient("client.WsConnected", true);
        },

        reconnect() {
          isReconnect = true;
        },
        onclose(e) {
          if (!isReconnect) {
            console.log("socket链接失败");
            Vue.prototype.$toClient("client.WsConnected", false);
          }
        },
        onmessage: function (e) {
          //这里的this指向是new的xSocket对象
          const data = e.data;
          const res = JSON.parse(data);
          const command = parseInt(res.res);
          if (command != 100) {
            this.heartReset();
          }
          try {
            switch (command) {
              case 100:
                //确认心跳
                return;
              case -1:
                //你已在本浏览器打开了其他的Socket链接
                this.destroy();
                return;
              case 20:
                //客户端打上班卡了，设置应下班时间
                store.dispatch("user_setOffTime", new Date(res.offTime));
                return;
              case 21:
                //客户端打下班卡了，设置实际下班时间
                store.dispatch("user_setOffTimeActual", new Date(res.offTime));
                return;
              //50-80是调用客户端方法的返回值
              case 50:
                //评论消息
                Vue.prototype.$toClient("NewCmt", data);
                break;
              case 51:
                //常规消息
                Vue.prototype.$toClient("NewPmt", data);
                break;
              case 53:
                //系统消息
                Vue.prototype.$toClient("SystemMsg", data);
                break;
              case 54:
                //通知客户端异地登录了
                Vue.prototype.$toClient("ClientOutline", data);
                break;
              case 55:
                //通知客户端重新获取服务器时间
                Vue.prototype.$toClient("RegetServerTime", res.uu);
                break;
              case 56:
                //通知客户端下载文件
                console.log(data);
                console.log(res);
                Vue.prototype.$toClient("Down", data);
                break;
              case 25:
                //通知客户端截图
                Vue.prototype.$toClient("client.ScShot", res.data);
                break;
              case 70:
                //通知客户端聊天 (WORK_CLIENT_AGENT_3698和发送消息本人不需要接收消息提示)
                if (
                  navigator.userAgent !== "WORK_CLIENT_AGENT_3698" &&
                  store.state.user.id !== JSON.parse(data).usId
                ) {
                  Vue.prototype.$toClient("NewMsg", data);
                } else {
                  console.log("不调用客户端方法");
                }
                break;
            }

            if (
              ["1", "50", "51", "53", "26", "25", "27", "70", "120"].indexOf(
                res.res
              ) >= 0
            ) {
              opt.onMsg(res);
              const msgType = Vue.prototype.$D.ITEM("msg_type_pnt", res.type);
              if (msgType && msgType.type) {
                store.dispatch("msg_SetNum", {
                  action: "add",
                  type: msgType.type,
                  value: 1,
                });
              }
            }
          } catch (e) {
            console.log(`Socket接收信息的方法异常：${e.message}`);
          }
        },
      });
    }
  }
}
