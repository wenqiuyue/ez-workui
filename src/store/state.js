/**
 * State 规范
 * 1. 每个全局状态是一个对象，方便以后扩展追加属性
 * 2. 每个状态和属性值都要写详细注释
 */
// -------------------------------------------------------------------------------------------------------------------

/**
 * 控制移动端显示的状态
 */
const mobile = {
  showMobileTop: false, //控制移动端的顶部栏切换（true:显示主菜单顶部，false：显示内容页顶部）
  showMobileMenu: false, //控制移动端的主菜单的子菜单显示
  showLeft: false, //移动端左部视图菜单
};

/**
 * 消息全局状态
 */
const msg = {
  proCount: 0, //项目及任务消息未读数量
  reportCount: 0, //简报消息未读数量
  reviewCount: 0, //审核消息未读数量
  epCount: 0, //企业消息未读数量（公告，制度，处罚）
  customerCount: 0, //客户及合同消息未读数量
  calendarCount: 0, //会议及日程消息未读数量
  otherCount: 0, //其他消息未读数量
  systemCount: 0, //系统消息未读数量
  chatCount: 0, //聊天消息未读数量
  immediateCount: 0, //即时消息
  unreadMainMenu: true, //主菜单的消息是否未读，用于点击后就取消掉消息主菜单的标签提示
};
/**
 * 成员选择器全局状态
 */
const locationSingle = null;
/**
 *	删除项目的ID
 */
const delProjectId = null;
/**
 *	打开的任务历史相关
 */
const task = {
  history: [],
  index: 0,
  flag: false,
};

/**
 * 当前登录的个人用户，实际使用
 */
const user = null;

/**
 * 合同状态
 */
const contracts = {
  draftContract: [], //合同模板
  signingContract: [], //已签约
  inProgressContract: [], //进行中
  closedContract: [], //已结束
};
/**
 * 审核数量
 */
const auditListData = {
  taskNumSum: 0, //任务审批数量
  kpiNumSum: 0, //kpi审批数量
  sumNum: 0, //审批总数
  reportNum: 0, //简报数量
  affairNum: 0, //事务审批数量
  kpiNum: 0, //kpi考核申诉数量
  complaintNum: 0, //kpi投诉数量
  taskNum: 0, //任务数量
  flowNum: 0, //流程任务数量
  unreadAuditMenu: true, //主菜单的审核是否未读，用于点击后就取消掉消息主菜单的标签提示
};
/*
 * 音频对象
 */
const audio = {
  currentAudio: null,
};

/**
 * 当前用户是否是该项目管理员
 */
const isProLeader = false;

export default {
  mobile,
  msg,
  user,
  locationSingle,
  task,
  delProjectId,
  contracts,
  audio,
  auditListData,
  isProLeader,
};
