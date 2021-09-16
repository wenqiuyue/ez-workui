import { login } from "./en-page/login/index";
import { attendanceInfo } from "./en-page/attendance-statistics/attendance-info";
import { attendanceStatistics } from "./en-page/attendance-statistics/attendance-statistics";
import { memberAttendance } from "./en-page/attendance-statistics/member-attendance";
import { myAttendance } from "./en-page/attendance-statistics/my-attendance";
import { timelineModal } from "./en-page/attendance-statistics/timeline-modal";
import { allbehavior } from "./en-page/data-analysis/allbehavior";
import { allSensitiveWord } from "./en-page/data-analysis/allSensitiveWord";
import { allsoftware } from "./en-page/data-analysis/allsoftware";
import { allwords } from "./en-page/data-analysis/allwords";
import { behaviorEcharts } from "./en-page/data-analysis/behavior-echarts";
import { dataAnalysis } from "./en-page/data-analysis/index";
import { keywordfrequency } from "./en-page/data-analysis/keywordfrequency";
import { memberData } from "./en-page/data-analysis/member-data";
import { memworkprogress } from "./en-page/data-analysis/memworkprogress";
import { progressCom } from "./en-page/data-analysis/progressCom";
import { ranking } from "./en-page/data-analysis/ranking";
import { workstatusPieecharts } from "./en-page/data-analysis/workstatus-pieecharts";
import { staffData } from "./en-page/data-analysis/staffData/index";
import { radar } from "./en-page/data-analysis/staffData/radar";
import { satechart } from "./en-page/data-analysis/staffData/satechart";
import { main } from "./en-page/main/index";
import { memberProccess } from "./en-page/member-proccess/index";
import { msgList } from "./en-page/msg-list/index";
import { msgDetail } from "./en-page/msg-list/msg-detail";
import { msgMass } from "./en-page/msg-list/MsgMass";
import { processRulesver } from "./en-page/process-rulesver/index";
import { systemRuleverSel } from "./en-page/process-rulesver/systemRuleverSel";
import { verModal } from "./en-page/process-rulesver/verModal";
import { profile } from "./en-page/profile/index";

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
