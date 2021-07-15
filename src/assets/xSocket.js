/**
 * WebSocket封装
 * 作者：XBB
 * 2019-10-28 11:47
 */

import Vue from "vue";
export default class xSocket {
  constructor(opt) {
    this.url = opt.url; //WebSocket链接
    this.time = 6000; //心跳间隔时间（ms）
    this.heartMsg = "HeartCheck"; //心跳消息
    this.timeoutObj = null; //心跳发送计时器
    this.webSocketObj = null; //原生的websocket对象
    this.isOut = false; //是否被挤掉
    this.lastOffTime = null; //上次离线时间
    this.reconnectTime = 1000; //重连间隔

    this.create(opt); //创建websocket链接
  }

  /**
   * 创建socket链接
   * @param {Object} params
   */
  create(params) {
    if (params) {
      if (params.time && !isNaN(params.time)) {
        this.time = params.time;
      }

      if (params.heartMsg) {
        this.heartMsg = params.heartMsg;
      }

      if (params.onopen) {
        this.onopen = params.onopen;
      }

      if (params.onmessage) {
        this.onmessage = params.onmessage;
      }

      if (params.onerror) {
        this.onerror = params.onerror;
      }

      if (params.onclose) {
        this.onclose = params.onclose;
      }

      if (params.afterReconnect) {
        this.afterReconnect = params.afterReconnect;
      }

      return initWS(this);
    }
  }

  /**
   * 关闭socket链接
   */
  destroy() {
    clearInterval(this.timeoutObj);
    this.timeoutObj = null;
    this.isOut = true;
    this.webSocketObj.close();
    Vue.prototype.$xSocket = 0;
  }

  /**
   * 开始发送心跳
   * @param {Number} time
   */
  heartStart(time) {
    if (this.webSocketObj.readyState != 1) {
      return false;
    }
    if (time) {
      this.time = time;
    }
    const self = this;
    if (this.timeoutObj) {
      clearInterval(this.timeoutObj);
    }
    this.timeoutObj = setInterval(function () {
      self.webSocketObj.send(self.heartMsg);
    }, time);
  }

  /**
   * 重置心跳
   */
  heartReset() {
    if (this.timeoutObj) {
      clearInterval(this.timeoutObj);
      this.timeoutObj = null;
    }
    this.heartStart(this.time);
  }

  /**
   * 重新链接
   */
  reconnect() {
    if (this.timeoutObj) {
      clearInterval(this.timeoutObj);
      this.timeoutObj = null;
    }
    initWS(this);
  }

  /**
   * 【生命周期】创建链接后触发
   * @param {Object} 事件对象
   */
  onopen(e) {}
  /**
   * 【生命周期】收到消息时触发
   * @param {Object} 事件对象
   */
  onmessage(e) {}
  /**
   * 【生命周期】错误时触发
   * @param {Object} 事件对象
   */
  onerror(e) {}
  /**
   * 【生命周期】关闭时触发
   * @param {Object} 事件对象
   */
  onclose(e) {}
  /**
   * 【生命周期】重新连接后触发
   */
  afterReconnect() {}
}

const initWS = (xs) => {
  try {
    xs.webSocketObj = new WebSocket(xs.url);
    const ws = xs.webSocketObj;
    ws.onopen = (e) => {
      xs.heartStart(xs.time);
      xs.onopen(e);
    };
    ws.onmessage = (e) => {
      xs.onmessage(e);
    };
    ws.onerror = (e) => {
      xs.onerror(e);
    };
    ws.onclose = (e) => {
      xs.onclose(e);
      if (!xs.lastOffTime) {
        if (!xs.isOut) {
          xs.reconnect();
          xs.afterReconnect();
        }
      } else {
        if (
          new Date().getTime() - new Date(xs.lastOffTime).getTime() >=
          xs.reconnectTime
        ) {
          if (!xs.isOut) {
            xs.reconnect();
            xs.afterReconnect();
          }
        } else {
          setTimeout(() => {
            if (!xs.isOut) {
              xs.reconnect();
              xs.afterReconnect();
            }
          }, new Date().getTime() - new Date(xs.lastOffTime).getTime());
        }
      }
    };
  } catch (e) {}
};
