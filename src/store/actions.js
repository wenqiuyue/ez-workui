/**
 * Actions 规范
 * 1.如果要新加一个 Actions 对象，名字就取名为相关的文件夹的名字加上 Actions，如任务就是 taskActions，消息就是 msgActions
 * 2.将方法补充到主要对应相关的 Actions 里面，如任务的就放在 taskActions 里，消息的就放在 msgActions 里面
 * 3.所有方法名前缀加上控制的全局状态对象的名字，如 state.js 里面消息的对象是 msg，则消息方法全部格式为 msg_XxxYyy()
 * 4.所有方法需要写完整的注释
 */
// -------------------------------------------------------------------------------------------------------------------

/**
 * 消息相关的 Actions
 */
const msgActions = {
  /**
   * 修改指定类型的未读消息数量
   * @param {*} context
   * @param {Object} data 一个对象：
   * {
   *    action: 标识是否是追加数量，如果值为 "add" 就是追加数量，否则是直接赋值,
   *    type: 消息类型（如"report"代表简报消息，详细见对应的Mutations）,
   *    value: 要变更的消息数值
   * }
   */
  msg_SetNum(context, data) {
    context.commit("msg_SetNum", data);
  },

  /**
   * 用于加载页面时从后端获取消息数量统一装进全局状态
   * @param {*} state
   * @param {Object} data 所有数量的数组如 [200,5,4,6,7,...]
   */
  msg_SetNumAll(context, data) {
    context.commit("msg_SetNumAll", data);
  },

  /**
   * 切换主菜单的消息提示 "!" 标签
   * @param {*} state
   * @param {Boolean} bool 设为true显示 "!" 标签，false隐藏标签
   */
  msg_toggleUnreadMainMenu(context, bool) {
    context.commit("msg_toggleUnreadMainMenu", bool);
  },
};

/**
 * 移动端相关的 Actions
 */
const mobileActions = {
  /**
   * 切换移动端的顶部菜单的显示，有主菜单时显示主菜单的顶部，否则显示页面内的顶部
   * @param {*} context
   * @param {Object} data 一个对象，格式如：{ action: "all", value: true }
   */
  mobile_ToggleState(context, data) {
    context.commit("mobile_ToggleState", data);
  },
  mobile_ToggleLeft(context, data) {
    context.commit("mobile_ToggleLeft", data);
  },
};
/**
 * 定位弹框相关的 Actions
 */
const locationActions = {
  /**
   * 切换打开的定位弹窗
   */
  location_SetObject(context, object) {
    context.commit("location_SetObject", object);
  },
};
/**
 * 当前用户是否是该项目管理员
 */
const isProLeaderActions = {
  is_ProLeader(context, data) {
    context.commit("is_ProLeader", data);
  },
};
/**
 * 个人信息相关的Actions
 */
const userActions = {
  /**
   * 保存当前登录用户的全部信息
   * @param {Object} data 用户全部信息数据（必须跟state里面的user格式一模一样）
   */
  user_setUser(context, data) {
    context.commit("user_setUser", data);
  },
  /**
   * 保存当前登录用户的基本信息
   * @param {Object} data 用户基本信息数据
   */
  user_setInfo(context, data) {
    context.commit("user_setInfo", data);
  },
};
/**
 * 审核数量
 */
const auditLisActions = {
  auditLis_setNum(context, data) {
    context.commit("auditLis_setNum", data);
  },
  /**
   * 审核是否已读
   */
  auditLis_toggleUnread(context, bool) {
    context.commit("auditLis_toggleUnread", bool);
  },
};
/**
 * 合同相关的 Actions
 */
const contractActions = {
  con_getContracts(context, data) {
    return data.self.$http
      .post("/Work/PersonalContract/MyContract.ashx", data.data)
      .then((response) => {
        let list = response.data.cts ? response.data.cts : [];
        console.log(response.data);
        context.commit("con_setList", list);
      })
      .catch((error) => {
        console.log("我的合同接口错误", error);
      });
  },
};
/**
 * 项目相关的 Actions
 */
const projectActions = {
  pro_setId(context, data) {
    context.commit("project_SetId", data);
  },
};
/**
 * 任务相关的 Actions
 */
const taskActions = {
  task_addId(context, data) {
    context.commit("task_addId", data);
  },
  task_setIndex(context, data) {
    context.commit("task_setIndex", data);
  },
};
/**
 * 语音相关的 Actions
 */
const audioActions = {
  setAudio(context, object) {
    context.commit("setAudio", object);
  },
};

export default Object.assign(
  mobileActions,
  msgActions,
  userActions,
  locationActions,
  taskActions,
  projectActions,
  contractActions,
  audioActions,
  auditLisActions,
  isProLeaderActions
);
