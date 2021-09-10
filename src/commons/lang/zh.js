import { login } from "./zh-page/login";
import { attendanceInfo } from "./zh-page/attendance-statistics/attendance-info";
import { attendanceStatistics } from "./zh-page/attendance-statistics/attendance-statistics";
import { memberAttendance } from "./zh-page/attendance-statistics/member-attendance";
import { myAttendance } from "./zh-page/attendance-statistics/my-attendance";

module.exports = {
  login: { ...login },
  attendanceInfo: { ...attendanceInfo },
  attendanceStatistics: { ...attendanceStatistics },
  memberAttendance: { ...memberAttendance },
  myAttendance: { ...myAttendance },
};
