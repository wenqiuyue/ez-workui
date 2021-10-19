/**
 * Mutations 规范
 * 1.如果要新加一个 Mutations 对象，名字就取名为相关的文件夹的名字加上 Mutations，如任务就是 taskMutations，消息就是 msgMutations
 * 2.将方法补充到主要对应相关的 Mutations 里面，如任务的就放在 taskMutations 里，消息的就放在 msgMutations 里面
 * 3.所有方法名前缀加上控制的全局状态对象的名字，如 state.js 里面消息的对象是 msg，则消息方法全部格式为 msg_XxxYyy()
 * 4.所有方法需要写完整的注释
 * 5.有公用方法可以提出来写在 funs 对象里面，供其余 Mutations 调用
 */
// -------------------------------------------------------------------------------------------------------------------

/**
 * 审核数量
 */
const auditLisMutations = {
  auditLis_setNum(state, data) {
    state.auditListData.taskNumSum = data.taskNumSum;
    state.auditListData.kpiNumSum = data.kpiNumSum;
    state.auditListData.sumNum = data.sumNum;
    state.auditListData.reportNum = data.reportNum;
    state.auditListData.affairNum = data.affairNum;
    state.auditListData.kpiNum = data.kpiNum;
    state.auditListData.complaintNum = data.complaintNum;
    state.auditListData.taskNum = data.taskNum;
    state.auditListData.flowNum = data.flowNum;
  },
  /**
   * 切换主菜单的审核提示 "!" 标签
   * 设为true显示 "!" 标签，false隐藏标签
   */
  auditLis_toggleUnread(state, bool) {
    state.auditListData.unreadAuditMenu = bool;
  },
};
/**
 * 消息相关的 Mutations
 */
const msgMutations = {
  /**
   * 修改指定类型的未读消息数量
   * @param {*} state
   * @param {Object} data 一个对象：
   * {
   *    action: 标识是否是追加数量，如果值为 "add" 就是追加数量，否则是直接赋值,
   *    type: 消息类型（如"report"代表简报消息，详细见对应的Mutations）,
   *    value: 要变更的消息数值
   * }
   */
  msg_SetNum(state, data) {
    switch (parseInt(data.type)) {
      case 1: //项目及任务消息
        state.msg.proCount = fn.changeNum(state.msg.proCount, data);
        break;
      case 2: //简报消息
        state.msg.reportCount = fn.changeNum(state.msg.reportCount, data);
        break;
      case 4: //审核消息
        state.msg.reviewCount = fn.changeNum(state.msg.reviewCount, data);
        break;
      case 3: //企业消息（公告、制度、处罚）
        state.msg.epCount = fn.changeNum(state.msg.epCount, data);
        break;
      case 5: //客户及合同消息
        state.msg.customerCount = fn.changeNum(state.msg.customerCount, data);
        break;
      case 6: //日程及会议消息
        state.msg.calendarCount = fn.changeNum(state.msg.calendarCount, data);
        break;
      case 99: //其他消息
        state.msg.otherCount = fn.changeNum(state.msg.otherCount, data);
        break;
      case 0: //系统消息
        state.msg.systemCount = fn.changeNum(state.msg.systemCount, data);
        break;
      case 98: //聊天消息
        state.msg.chatCount = fn.changeNum(state.msg.chatCount, data);
        break;
      case 9: //即时消息
        state.msg.immediateCount = fn.changeNum(state.msg.immediateCount, data);
        break;
    }
  },

  /**
   * 用于加载页面时从后端获取消息数量统一装进全局状态
   * @param {*} state
   * @param {Object} data 所有数量的数组如 [200,5,4,6,7,...]
   */
  msg_SetNumAll(state, data) {
    [
      state.msg.proCount,
      state.msg.reportCount,
      state.msg.reviewCount,
      state.msg.epCount,
      state.msg.customerCount,
      state.msg.calendarCount,
      state.msg.otherCount,
      state.msg.systemCount,
      state.msg.chatCount,
      state.msg.immediateCount,
    ] = data;
  },

  /**
   * 切换主菜单的消息提示 "!" 标签
   * @param {*} state
   * @param {Boolean} bool 设为true显示 "!" 标签，false隐藏标签
   */
  msg_toggleUnreadMainMenu(state, bool) {
    state.msg.unreadMainMenu = bool;
  },
};

/**
 * 任务相关的 Mutations
 */
const taskMutations = {
  /**
   * 存储打开的任务
   * @param {*} state
   * @param 目前打开的任务id
   */
  task_addId(state, id) {
    if (id == null) {
      state.task.history = [];
    } else {
      if ([...state.task.history].pop() != id) {
        if (
          state.task.flag &&
          state.task.index != state.task.history.length - 1
        ) {
          state.task.history = state.task.history.filter((t, i) => {
            return i <= state.task.index;
          });
          state.task.flag = false;
        }
        state.task.history.push(id);
      }
    }
  },
  /**
   * 存储打开的任务
   * @param {*} state
   * @param 目前打开的索引
   */
  task_setIndex(state, number) {
    if (number == 0) {
      state.task.index = state.task.history.length - 1;
    } else if (number == 1) {
      state.task.index++;
      state.task.flag = true;
    } else if (number == 2) {
      state.task.index--;
      state.task.flag = true;
    }
  },
};

/**
 * 个人信息相关的 Mutations
 */
const userMutations = {
  /**
   * 保存当前登录用户的全部信息
   * @param {Object} data 用户基本全部数据（必须跟state里面的user格式一模一样）
   */
  user_setUser(state, data) {
    state.user = JSON.parse(JSON.stringify(data));
  },
  /**
   * 保存当前登录用户的基本信息
   * @param {Object} data 用户基本信息数据
   */
  user_setInfo(state, data) {
    state.user.id = data.id; //ID
    state.user.img = data.img; //头像
    state.user.name = data.name; //名字
    state.user.departments = data.departments; //部门名称
    state.user.positions = data.positions; //职位名称
    state.user.qq = data.qq; //QQ
    state.user.phone = data.phone; //电话号码
    state.user.email = data.email; //email
    state.user.whb = data.whb; //whb账号
    state.user.power = data.power; //权限
  },
};

/**
 * 移动端控制相关的 Mutations
 */
const mobileMutations = {
  /**
   * 切换移动端的顶部与菜单的显示
   * @param {*} state
   * @param {Object} data 一个对象：
   * {
   *    action: "menu"只切换展示移动端主菜单中的菜单列表，"top"只切换移动端展示主菜单的头部
   *    value: true显示主菜单的头部，false显示子页面的头部
   * }
   */
  mobile_ToggleState(state, data) {
    switch (data.action) {
      case "menu":
        state.mobile.showMobileMenu = data.value;
        break;
      case "top":
        state.mobile.showMobileTop = data.value;
        break;
      default:
        state.mobile.showMobileTop = data.value;
        state.mobile.showMobileMenu = data.value;
        break;
    }
  },
  mobile_ToggleLeft(state, data) {
    state.mobile.showLeft = data;
  },
};

/**
 * 成员选择器的 Mutations
 */
const locationMutations = {
  /**
   * 存储打开的定位弹框
   * @param {*} state
   * @param 目前打开的弹框对象
   */
  location_SetObject(state, object) {
    state.locationSingle = object;
  },
};
/**
 * 当前用户是否是该项目管理员
 */
const isProLeaderMutations = {
  is_ProLeader(state, data) {
    state.isProLeader = data;
  },
};
/**
 * 项目的 Mutations
 */
const projectMutations = {
  /**delId
   * 存储是否删除了一个项目
   * @param {*} state
   * @param 目前打开的弹框对象
   */
  project_SetId(state, id) {
    state.delProjectId = id;
  },
};

/**
 * 合同相关的 Mutations
 */
const contractMutations = {
  //合同列表赋值
  con_setList(state, list) {
    state.contracts.draftContract = list[0];
    state.contracts.signingContract = list[1];
    state.contracts.inProgressContract = list[2];
    state.contracts.closedContract = list[3];
  },
  /**
   * 删除合同
   */
  con_deleteContract(state, data) {
    let stateList = {
      1: state.contracts.draftContract,
      2: state.contracts.signingContract,
      3: state.contracts.inProgressContract,
      4: state.contracts.closedContract,
    };
    stateList[data.state].splice(data.index, 1);
  },
};
/**
 * 语音相关的 Mutations
 */
const audioMutations = {
  setAudio(state, object) {
    let current = state.audio.currentAudio;
    if (current != null && current.index != object.index) {
      current.obj.pause();
      current.obj.currentTime = 0;
    }
    state.audio.currentAudio = object;
  },
};
export default Object.assign(
  mobileMutations,
  msgMutations,
  taskMutations,
  userMutations,
  locationMutations,
  projectMutations,
  contractMutations,
  audioMutations,
  auditLisMutations,
  isProLeaderMutations
);

// -------------------------------------------------------------------------------------------------------------------

/**
 * Mutations内用的函数
 */
const fn = {
  /**
   * 修改数值的公用方法
   * @param {Number} num 需要变动的数
   * @param {String} data.action add则为在原值上进行增加或者减少，其余为直接赋值
   * @param {Number} data.value 变化的值
   */
  changeNum(num, data) {
    switch (data.action) {
      case "add": //增加数值，负数则是减少
        return num + data.value;
      default:
        return data.value;
    }
  },
};
