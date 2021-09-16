import { login } from "./zh-page/login/index";
import { attendanceInfo } from "./zh-page/attendance-statistics/attendance-info";
import { attendanceStatistics } from "./zh-page/attendance-statistics/attendance-statistics";
import { memberAttendance } from "./zh-page/attendance-statistics/member-attendance";
import { myAttendance } from "./zh-page/attendance-statistics/my-attendance";
import { timelineModal } from "./zh-page/attendance-statistics/timeline-modal";
import { allbehavior } from "./zh-page/data-analysis/allbehavior";
import { allSensitiveWord } from "./zh-page/data-analysis/allSensitiveWord";
import { allsoftware } from "./zh-page/data-analysis/allsoftware";
import { allwords } from "./zh-page/data-analysis/allwords";
import { behaviorEcharts } from "./zh-page/data-analysis/behavior-echarts";
import { dataAnalysis } from "./zh-page/data-analysis/index";
import { keywordfrequency } from "./zh-page/data-analysis/keywordfrequency";
import { memberData } from "./zh-page/data-analysis/member-data";
import { memworkprogress } from "./zh-page/data-analysis/memworkprogress";
import { progressCom } from "./zh-page/data-analysis/progressCom";
import { ranking } from "./zh-page/data-analysis/ranking";
import { workstatusPieecharts } from "./zh-page/data-analysis/workstatus-pieecharts";
import { staffData } from "./zh-page/data-analysis/staffData/index";
import { radar } from "./zh-page/data-analysis/staffData/radar";
import { satechart } from "./zh-page/data-analysis/staffData/satechart";
import { main } from "./zh-page/main/index";
import { memberProccess } from "./zh-page/member-proccess/index";
import { msgList } from "./zh-page/msg-list/index";
import { msgDetail } from "./zh-page/msg-list/msg-detail";
import { msgMass } from "./zh-page/msg-list/MsgMass";
import { processRulesver } from "./zh-page/process-rulesver/index";
import { systemRuleverSel } from "./zh-page/process-rulesver/systemRuleverSel";
import { verModal } from "./zh-page/process-rulesver/verModal";
import { profile } from "./zh-page/profile/index";

module.exports = {
  login: { ...login },
  attendanceInfo: { ...attendanceInfo },
  attendanceStatistics: { ...attendanceStatistics },
  memberAttendance: { ...memberAttendance },
  myAttendance: { ...myAttendance },
  timelineModal: { ...timelineModal },
  allbehavior: { ...allbehavior },
  allSensitiveWord: { ...allSensitiveWord },
  allsoftware: { ...allsoftware },
  allwords: { ...allwords },
  behaviorEcharts: { ...behaviorEcharts },
  dataAnalysis: { ...dataAnalysis },
  keywordfrequency: { ...keywordfrequency },
  memberData: { ...memberData },
  memworkprogress: { ...memworkprogress },
  progressCom: { ...progressCom },
  ranking: { ...ranking },
  workstatusPieecharts: { ...workstatusPieecharts },
  staffData: { ...staffData },
  radar: { ...radar },
  satechart: { ...satechart },
  main: { ...main },
  memberProccess: { ...memberProccess },
  msgList: { ...msgList },
  msgDetail: { ...msgDetail },
  msgMass: { ...msgMass },
  processRulesver: { ...processRulesver },
  systemRuleverSel: { ...systemRuleverSel },
  verModal: { ...verModal },
  profile: { ...profile },
};
