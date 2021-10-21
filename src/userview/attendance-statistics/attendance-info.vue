<template>
  <div v-loading="childLoading" style="height: 100%">
    <div
      class="attendance-all"
      style="height: 100%; backgroundcolor: #fff; overflow: auto"
    >
      <!--考勤 通用头-->
      <div class="attendance-header">
        <ul>
          <li
            v-if="childData.publicTab1TimeHeader && childData.tabsNum === '1'"
            style="flex: 0 0 15rem"
          >
            {{ childData.publicTab1TimeHeader }}
          </li>
          <li style="display: flex; align-items: center">
            <el-date-picker
              size="mini"
              :clearable="false"
              :title="'点击切换月份'"
              :editable="false"
              v-model="timeHeaderToggle"
              class="top-left-date"
              type="month"
              placeholder="选择月"
              format="yyyy年MM月"
              value-format="yyyy-MM-dd"
              v-if="
                (timeHeaderToggle && childData.tabsNum === '2') ||
                childData.menuType === 'privateAttendance'
              "
            ></el-date-picker>
            <h3 style="font-size: 1.8rem; font-weight: bold; color: #333">
              考勤
            </h3>
            <div
              class="header_team"
              v-if="childData.menuType === 'privateAttendance'"
            >
              <el-select
                v-if="isShowTeam"
                v-model="teamValue"
                filterable
                placeholder="请选择团队"
                @change="handleTeamChange"
              >
                <el-option
                  v-for="item in teamOptions"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
              <el-button
                type="primary"
                size="medium"
                class="add-btn-process"
                @click="handleSearchData"
                >搜索</el-button
              >
            </div>
          </li>
          <!-- <li>
            <span @click="toggleBtn"
              >{{ onlyUnusual ? "查看全部" : "只看异常" }}考勤</span
            >
          </li> -->
        </ul>
        <div
          v-if="
            childData.tabsNum == '1' &&
            childData.publicTab1TimeHeader &&
            this.teamValue
          "
          class="time-filters"
        >
          <div>
            <span>成员</span>
            <selMember
              size="small"
              @Confirm="getSelMember"
              :selRange="1"
              :arrays="selMem"
              :showLength="10"
              :teamId="teamValue"
            >
            </selMember>
          </div>
        </div>
      </div>
      <div v-loading="attendanceLoading" class="attendance-container-all">
        <!--成员时间视图考勤 主体部分-->
        <div
          v-show="
            childData.menuType === 'publicAttendance' &&
            childData.tabsNum === '1'
          "
          v-if="String(timeAttence)"
          class="attence-content"
        >
          <el-row>
            <el-col
              :xs="24"
              :sm="12"
              :md="24"
              :lg="8"
              ref="AmControl"
              :class="[
                onlyUnusual ? 'see-unusual' : 'see-all',
                item.hasUnusualState ? 'has-unusual' : 'not-unusual',
              ]"
              v-for="(item, index) in timeAttence"
              :key="index"
            >
              <ul class="genera-info" @click="handleDateInfo(true, item)">
                <li>
                  <img :src="imgChange(item.Picture)" />
                  <span>{{ item.UserName }}</span>
                </li>
                <li>
                  <p :class="['last-p', item.isNormalAm ? '' : 'is-unusual']">
                    <span
                      >上班：{{
                        item.StartTime
                          ? item.StartTime.timeFormat("HH:mm")
                          : "--:--"
                      }}</span
                    >
                    <em>{{
                      item.StartStatus && item.StartStatus !== -1
                        ? $D.ITEM("at_state", item.StartStatus).name
                        : ""
                    }}</em>
                  </p>
                  <p :class="['last-p', item.isNormalPm ? '' : 'is-unusual']">
                    <span
                      >下班：{{
                        item.EndTime
                          ? item.EndTime.timeFormat("HH:mm")
                          : "--:--"
                      }}</span
                    >
                    <em>{{
                      item.EndStatus && item.EndStatus !== -1
                        ? $D.ITEM("at_state", item.EndStatus).custom
                        : ""
                    }}</em>
                  </p>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>

        <!--个人考勤以及成员考勤 主体部分-->
        <div
          v-if="
            (childData.menuType == 'publicAttendance' &&
              childData.tabsNum == '2') ||
            childData.menuType == 'privateAttendance'
          "
        >
          <!-- 个人考勤汇总 -->
          <el-table
            :data="attenceTable"
            border
            style="width: 100%; margin: 1.5rem 0"
            :header-row-class-name="tableHeaderStyle"
            :cell-style="attenceCellStyle"
            :header-cell-style="attenceHeaderStyle"
            v-if="
              childData.menuType == 'privateAttendance' ||
              childData.tabsNum == 2
            "
          >
            <el-table-column
              prop="ShouldBeAttendance"
              label="应出勤"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.ShouldBeAttendance
                    ? scope.row.ShouldBeAttendance
                    : 0
                }}天</template
              >
            </el-table-column>
            <el-table-column
              prop="ActualAttendance"
              label="实际出勤"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.ActualAttendance ? scope.row.ActualAttendance : 0
                }}天</template
              >
            </el-table-column>
            <el-table-column
              prop="NoAttendance"
              label="未出勤"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.NoAttendance ? scope.row.NoAttendance : 0
                }}天</template
              >
            </el-table-column>
          </el-table>

          <!-- 个人及成员日历 -->
          <el-calendar
            v-model="childData.time"
            class="attendance-container"
            style="height: 100%"
          >
            <template slot="dateCell" slot-scope="{ date, data }">
              <div
                :class="[
                  'attendance-cell',
                  Boolean(new Date() < new Date(date)) ? 'is-rest' : '',
                  data.isSelected ? 'is-selected' : '',
                ]"
                v-if="
                  data.type === 'current-month' &&
                  attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                "
                @click="
                  handleDateInfo(
                    Boolean(new Date() > new Date(date)),
                    attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                  )
                "
              >
                <el-row
                  :class="[
                    'cell-title',
                    attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                      .hasUnusualState
                      ? 'has-unusual'
                      : '',
                  ]"
                >
                  <el-col :sm="24" :md="4">
                    <p
                      class="cell-title-left"
                      v-text="parseInt(data.day.split('-').slice(2))"
                    ></p>
                  </el-col>
                  <el-col
                    :sm="24"
                    :md="20"
                    class="hidden-sm-and-down"
                    v-if="parseInt(data.day.split('-').slice(2)) == 5"
                  >
                    <p
                      class="cell-title-right"
                      v-show="Boolean(new Date() > new Date(date))"
                    >
                      审核中
                    </p>
                  </el-col>
                  <el-col :sm="24" :md="20" class="hidden-sm-and-down" v-else>
                    <p
                      class="cell-title-right apply"
                      v-show="Boolean(new Date() > new Date(date))"
                    >
                      <span
                        @click.stop="
                          handlApply(
                            attenceData[
                              parseInt(data.day.split('-').slice(2)) - 1
                            ]
                          )
                        "
                        >我要申诉</span
                      >
                    </p>
                  </el-col>
                </el-row>
                <el-row
                  v-show="Boolean(new Date() > new Date(date))"
                  :class="['cell-info', onlyUnusual ? 'only-unusual' : '']"
                >
                  <el-col :span="24">
                    <p
                      :class="[
                        attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                          .StartStatus == 0 ||
                        attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                          .LeaveStartStatus
                          ? ''
                          : 'is-unusual',
                      ]"
                    >
                      <span
                        >上班：{{
                          attenceData[
                            parseInt(data.day.split("-").slice(2)) - 1
                          ].StartTime
                            ? attenceData[
                                parseInt(data.day.split("-").slice(2)) - 1
                              ].StartTime.timeFormat("HH:mm")
                            : "--:--"
                        }}</span
                      >
                      <em
                        ><label
                          v-if="
                            attenceData[
                              parseInt(data.day.split('-').slice(2)) - 1
                            ].LeaveStartStatus
                          "
                          >{{
                            attenceData[
                              parseInt(data.day.split("-").slice(2)) - 1
                            ].IsStartAdjust
                              ? "调休"
                              : "请假"
                          }}</label
                        >&nbsp;<label
                          v-if="
                            !attenceData[
                              parseInt(data.day.split('-').slice(2)) - 1
                            ].LeaveStartStatus
                          "
                          >{{
                            attenceData[
                              parseInt(data.day.split("-").slice(2)) - 1
                            ].StartStatus &&
                            attenceData[
                              parseInt(data.day.split("-").slice(2)) - 1
                            ].StartStatus !== -1
                              ? $D.ITEM(
                                  "at_state",
                                  attenceData[
                                    parseInt(data.day.split("-").slice(2)) - 1
                                  ].StartStatus
                                ).name
                              : ""
                          }}</label
                        ></em
                      >
                    </p>
                  </el-col>
                  <el-col :span="24">
                    <p
                      :class="[
                        'last-p',
                        attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                          .EndStatus == 0 ||
                        attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                          .LeaveEndStatus
                          ? ''
                          : 'is-unusual',
                      ]"
                    >
                      <span
                        >下班：{{
                          attenceData[
                            parseInt(data.day.split("-").slice(2)) - 1
                          ].EndTime
                            ? attenceData[
                                parseInt(data.day.split("-").slice(2)) - 1
                              ].EndTime.timeFormat("HH:mm")
                            : "--:--"
                        }}</span
                      >
                      <em
                        ><label
                          v-if="
                            attenceData[
                              parseInt(data.day.split('-').slice(2)) - 1
                            ].LeaveEndStatus
                          "
                          >{{
                            attenceData[
                              parseInt(data.day.split("-").slice(2)) - 1
                            ].IsEndAdjust
                              ? "调休"
                              : "请假"
                          }}</label
                        >&nbsp;<label
                          v-if="
                            !attenceData[
                              parseInt(data.day.split('-').slice(2)) - 1
                            ].LeaveEndStatus
                          "
                          >{{
                            attenceData[
                              parseInt(data.day.split("-").slice(2)) - 1
                            ].EndStatus &&
                            attenceData[
                              parseInt(data.day.split("-").slice(2)) - 1
                            ].EndStatus !== -1
                              ? $D.ITEM(
                                  "at_state",
                                  attenceData[
                                    parseInt(data.day.split("-").slice(2)) - 1
                                  ].EndStatus
                                ).custom
                              : ""
                          }}</label
                        ></em
                      >
                    </p>
                  </el-col>
                  <el-col :span="24">
                    <p
                      class="cell-info-right"
                      v-show="Boolean(new Date() > new Date(date))"
                    >
                      当日办公：{{
                        attenceData[parseInt(data.day.split("-").slice(2)) - 1]
                          .DayTime
                      }}小时
                    </p>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-calendar>

          <!--移动端新增日历结构-->
          <ol class="mobile-cell-info" v-if="moblieOlData.Date">
            <!--中间-->
            <li>
              <div class="m-first-li">
                <p>
                  上午：
                  <span
                    :class="[moblieOlData.isNormalAm ? '' : 'is-unusual']"
                    >{{ moblieOlData.STime }}</span
                  >
                  <span
                    :class="[moblieOlData.isNormalAm ? '' : 'is-unusual']"
                    >{{ moblieOlData.StartStatus }}</span
                  >
                </p>
                <p>
                  下午：
                  <span
                    :class="[moblieOlData.isNormalPm ? '' : 'is-unusual']"
                    >{{ moblieOlData.ETime }}</span
                  >
                  <span
                    :class="[moblieOlData.isNormalPm ? '' : 'is-unusual']"
                    >{{ moblieOlData.EndStatus }}</span
                  >
                </p>
              </div>
            </li>
            <!--左右-->
            <li
              v-text="moblieOlData.Date.substring(5, 10).split('-').join('月')"
            ></li>
            <li>
              <el-button
                plain
                size="mini"
                v-if="childData.menuType === 'privateAttendance'"
                @click="appealShow(moblieOlData)"
                >我要申诉</el-button
              >
            </li>
          </ol>
        </div>
      </div>
    </div>
    <!-- 打卡时间线弹窗 -->
    <TimeLineModal
      :selDateTimeLine="selDateTimeLine"
      :IsRealTimeScreenshot="IsRealTimeScreenshot"
    ></TimeLineModal>
    <!-- 申诉审核弹窗 -->
    <appeal
      :popData="popData"
      ref="myAppeal"
      @appealSubmit="handleSearch"
      :Type="1"
      @appealChange="handleSearch"
    ></appeal>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  props: ["childLoading", "fatData", "changeTab", "activeItem"],
  components: {
    TimeLineModal: () => import("./timeline-modal"),
    appeal: () => import("./appeal"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  data() {
    return {
      IsRealTimeScreenshot: true, //是否显示截图
      selDateTimeLine: null, //选择的日期查看打卡时间线
      teamValue: null, //选择的团队
      teamOptions: [],
      // 请求参数
      childData: {
        // timeYM: yyyy-MM, // 左侧查询的时间
        // time: yyyy-MM'-01 00:00:00', // 子组件自己处理的
      },
      attendanceLoading: false,
      attenceData: [], // 返回数据
      onlyUnusual: false,

      moblieOlData: {}, // 移动端的时候这个数据才利用
      popData: {}, // 需要传递给弹层的数据
      timeAttence: [],
      timeHeaderToggle: "",
      memberName: "",

      //考勤汇总
      attenceTable: [], //个人考勤和成员考勤 日历对象
      // selectTimeYear: new Date().toLocaleString(),
      listType: 0, //考勤统计  选择的考勤组id
      // selectTimeMonth: new Date().getMonth() + 1,
      // selectTime: new Date(),
      selMem: [], //时间视图  选择成语
      selectMonth: new Date(), //考勤查询时间
      Attend: true, //未考勤
      Quit: true, //未离职
      attenceGroup: [], //考勤列表
      modalLoading: false,
      attenceGroupList: [], //考勤统计 （考勤组，成员） 个人列表
      attenceGroupTable: [], //考勤统计(考勤组，成员) 汇总

      selectType: 1, //考勤类型
      selAttenceMem: [], //考勤统计选择成员

      obj: {
        id: "",
        day: "",
      },

      isShowTeam: true,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    timeHeaderToggle(val, oldv) {
      if (!oldv) {
        return;
      }
      if (!this.teamValue) {
        this.$message({
          message: "请选择团队",
          type: "warning",
        });
        return;
      }
      this.childData.time = val;
      this.childData.reqsTime = val;
      this.attenceData = {};
      if (this.childData.menuType === "publicAttendance") {
        this.getAttendance();
      }
    },
    changeTab() {
      this.activeItem = "审核列表";
      this.onlyUnusual = false;
    },
    attenceData: {
      deep: true,
      immediate: true,
      handler: function (newV, oldV) {},
    },
  },
  filters: {
    dateFormat(day) {
      return day.timeFormat("MM月dd日");
    },
  },
  methods: {
    imgChange,
    /**
     * 申诉
     */
    handlApply(obj) {
      this.popData = obj;
      this.$modal.show("appeal"); // 这个打开弹层的原理仔细看下
    },
    /**
     * 成员考勤团队切换
     */
    memberTeamChange(val) {
      this.IsRealTimeScreenshot = val;
    },
    /**
     * 团队切换
     */
    handleTeamChange(val) {
      const team = this.teamOptions.find((m) => m.Id == val);
      if (team) {
        this.IsRealTimeScreenshot = team.IsRealTimeScreenshot; //是否显示实时截图
      }
    },
    /**
     * 选择团队后的搜索
     */
    handleSearchData() {
      if (!this.teamValue) {
        this.$message({
          message: "请选择团队",
          type: "warning",
        });
        return;
      }
      this.childData.time = this.timeHeaderToggle;
      this.childData.reqsTime = this.timeHeaderToggle;
      this.attenceData = {};
      this.getAttendance();
    },

    /**
     * 获取团队
     */
    getTeams() {
      if (this.childData.menuType == "privateAttendance" && !this.teamValue) {
        this.$http
          .get("/Teams/GetAllTeams.ashx", {
            params: { searchText: null, type: 2 },
          })
          .then((resp) => {
            if (resp.res == 0) {
              this.teamOptions = resp.data;
            }
          });
      }
    },

    /**
     * 查询考勤
     */
    handleSearch() {
      if (this.selectType == 1) {
        this.getAttenceGroupList();
      } else {
        this.getuserList();
      }
    },

    //个人考勤表
    tableHeaderStyle(row) {
      return "table-header";
    },
    attenceCellStyle() {
      return {
        textAlign: "center",
      };
    },
    attenceHeaderStyle() {
      return {
        background: "#f9f9f9",
        textAlign: "center",
        fontWeight: "normal",
        color: "#333",
      };
    },

    getSelMember(arr) {
      this.selMem = arr;
      this.getTimeAttendance();
    },

    // 点击日历,查看时间线
    handleDateInfo(bool, obj) {
      if (!bool) {
        return;
      }
      this.selDateTimeLine = {
        Date: obj.Date,
        UsId: obj.UserId,
        teamId: this.teamValue,
        userName: obj.UserName,
      };
      this.$modal.show("timeline");
    },
    // 拆解父组件传递的参数
    showData() {
      this.childData = JSON.parse(JSON.stringify(this.fatData)); // 来源props
      if (this.childData.teamValue) {
        this.teamValue = this.childData.teamValue;
      }

      // 00  个人考勤
      // debugger;
      if (this.childData.menuType == "privateAttendance") {
        // 时间‘2019-11-01’ 成员‘undefined’
        let obj1 = {
          time: new Date(this.childData.fatTimeYMD + " 00:00:00"), // 给日历使用
          reqsTime: this.childData.fatTimeYMD, //调取接口传递的时间
        };
        this.childData = Object.assign(this.childData, obj1);
        this.timeHeaderToggle = this.childData.time;

        if (this.teamValue) {
          this.getAttendance();
        }
      }
      // 10   时间视图考勤
      if (
        this.childData.menuType === "publicAttendance" &&
        this.childData.tabsNum === "1"
      ) {
        // 时间‘2019-11-18’ 成员 ‘undefined’
        let timeArr = this.childData.fatTimeYMD.split("-");
        let obj2 = {
          time: new Date(this.childData.fatTimeYMD + " 00:00:00"), // 无日历
          publicTab1TimeHeader:
            timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日",
        };
        this.childData = Object.assign(this.childData, obj2);
        if (this.teamValue) {
          this.getTimeAttendance();
        }
      }
      // 11   //成员考勤
      if (
        this.childData.menuType === "publicAttendance" &&
        this.childData.tabsNum === "2"
      ) {
        this.memberName = this.childData.memberName;
        if (!this.timeHeaderToggle) {
          this.timeHeaderToggle = new Date();
          let obj3 = {
            time: this.timeHeaderToggle,
            reqsTime: this.timeHeaderToggle,
          };
          this.childData = Object.assign(this.childData, obj3);
        } else {
          let obj3 = {
            time: this.timeHeaderToggle,
            reqsTime: this.timeHeaderToggle,
          };
          this.childData = Object.assign(this.childData, obj3);
        }
        // 如果只点击的头tab，那只做前面的切换，不做请求 这种情况没有UsId
        if (this.childData.fatUsId && this.teamValue) {
          this.getAttendance();
        }
      }
    },

    // 使用父组件传递的时间参数 timeYMD，请求日历接口
    // 请求单个成员 某月30天的考勤
    getAttendance() {
      this.attendanceLoading = true;
      this.$http
        .get("/Attendance/MyAttendance.ashx", {
          params: {
            Date: this.childData.reqsTime, // '2019-11-01'
            UsId: this.childData.fatUsId, // 不穿就是当前账号
            teamId: this.teamValue,
          },
        })
        .then((resp) => {
          if (resp.res === 0) {
            this.attenceData = {};
            this.attendanceLoading = false;
            resp.data.map((item) => {
              // 休息日节假日 无cell详情 且永为暗色
              item.isRest = "休息日节假日".includes(item.Type);

              item.isNormalAm =
                item.StartStatus == 0 || item.StartStatus == null
                  ? true
                  : false;
              item.isNormalPm =
                item.EndStatus == 0 || item.EndStatus == null ? true : false;
              if (item.StartStatus !== 0 || item.EndStatus !== 0) {
                item.hasUnusualState = true;
              }
              if (item.StartStatus == null && item.EndStatus == null) {
                item.hasUnusualState = false;
              }
            });

            this.attenceData = resp.data;
            // 给移动端的ol列表一初值，之后只通过click改变
            this.moblieOlData = resp.data[0];
            this.getPersonGatherData();
            this.$emit("updata");
          }
        });
    },

    //获得个人考勤汇总
    getPersonGatherData() {
      if (
        this.childData.tabsNum == 1 &&
        this.childData.menuType == "publicAttendance"
      ) {
        return;
      }
      this.attendanceLoading = true;
      this.$http
        .post("/Attendance/MyAttendanceSummaryByDate.ashx ", {
          Date: this.childData.reqsTime,
          UsId: this.childData.fatUsId
            ? this.childData.fatUsId
            : this.$store.state.user.id,
          teamId: this.teamValue,
        })
        .then((res) => {
          if (res.res == 0) {
            this.attendanceLoading = false;
            this.attenceTable.splice(0, 1, res.data);
          }
        });
    },
    getuserList() {
      let arr = [];
      this.selAttenceMem.forEach((item) => {
        arr.push(item.UId);
      });
      this.modalLoading = true;
      this.$http
        .post("/MGT/Personnel/Work/UsersList.ashx", {
          SDate: this.selectMonth,
          // EDate:this.selectMonth,
          Ids: arr,
          Attend: this.Attend,
          Quit: this.Quit,
        })
        .then((res) => {
          if (res.res == 0) {
            this.attenceGroupTable = [];
            this.attenceGroupTable.push(res.data.SummaryData);
            this.attenceGroupList = [];
            this.attenceGroupList = res.data.UsersData;
            this.modalLoading = false;
          }
        });
    },
    //获取考勤组数据
    getAttenceGroupList() {
      this.modalLoading = true;
      this.$http
        .post("/MGT/Personnel/Work/QueryUsersByGroup.ashx", {
          SDate: this.selectMonth,
          GroupId: this.listType,
          Attend: this.Attend,
          Quit: this.Quit,
        })
        .then((res) => {
          if (res.res == 0) {
            this.modalLoading = false;
            this.attenceGroupTable = [];
            this.attenceGroupTable.push(res.data.SummaryData);
            this.attenceGroupList = [];
            this.attenceGroupList = res.data.UserData;
          }
        });
    },

    // 时间视图考勤
    getTimeAttendance() {
      this.attendanceLoading = true;
      let arr1 = [];
      this.selMem.forEach((item) => {
        arr1.push(item.UsId);
      });
      this.$http
        .post("/Attendance/QueryUsersAttendanceByDate.ashx#", {
          Date: this.childData.fatTimeYMD, // '2019-11-18 这种01 02 03'
          UList: arr1,
          teamId: this.teamValue,
        })
        .then((resp) => {
          if (resp.res === 0) {
            resp.data.map((item) => {
              // 休息日节假日 无cell详情 且永为暗色
              item.isNormalAm =
                item.StartStatus == 0 || item.StartStatus == null
                  ? true
                  : false;
              item.isNormalPm =
                item.EndStatus == 0 || item.EndStatus ? true : false;
              if (item.StartStatus !== 0 || item.EndStatus !== 0) {
                item.hasUnusualState = true;
              }
            });
            // console.log(resp)
            this.timeAttence = resp.data;
            this.attendanceLoading = false;
            this.$emit("updata");
          }
        });
    },
  },
  mounted() {
    const role = this.$xStorage.getItem("user-role");
    if (role.team) {
      this.teamValue = role.team;
      this.isShowTeam = false;
    } else {
      this.isShowTeam = true;
    }
    this.showData();
    this.getTeams();
    // console.log(this.fatData)
  },
};
</script>
<style>
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
</style>
<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;

  /deep/.el-form-item__label {
    width: 75px;
    font-weight: bold;
  }
}

// 表格
.table-header {
  background-color: #f9f9f9 !important;

  span {
    margin-right: 0.5rem;
    font-weight: normal;
    color: #333;
  }

  i {
    font-weight: normal;
    font-size: 1.5rem;
    cursor: pointer;
    position: relative;
    top: 0.5px;
    color: #999;
  }

  th {
    background: #ddd;
  }
}

.hi-task:before {
  color: #409eff;
}

.cell-double {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;

  span:nth-of-type(1) {
    border-right: 1px solid #ebeef5;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/deep/.ctn {
  height: calc(100% - 6rem);
  // overflow: auto;
}

// 成员  考勤统计
.attence-static {
  /deep/.ctn {
    // height: 100%;
    height: calc(100% - 6rem);
    box-sizing: border-box;
    padding-bottom: 1rem;

    & > div {
      box-sizing: border-box;
      padding: 0 1rem;
      overflow: auto;
      height: 100%;
    }

    .cell {
      padding: 0 0.2rem;
    }
  }

  h3 {
    font-size: 1.6rem;
    color: #6d6d6d;
    // margin: 1rem 0;
  }

  .time-pick {
    // margin: 0 auto;
    margin-bottom: 2rem;
    display: flex;
    position: relative;
    justify-content: space-between;

    & > div {
      display: flex;
      align-items: center;

      span {
        color: #333;
        font-size: 1.6rem;
        margin-right: 1rem;
      }
    }

    span {
      font-size: 1.4rem;
      color: #6d6d6d;
    }

    /deep/.el-select {
      margin-right: 1rem;
      display: flex;
      align-items: center;
    }

    /deep/.el-date-editor {
      // margin-left: 3rem;
      display: flex;
      align-items: center;
      width: 150px;
    }

    /deep/.el-input__inner {
      background: #fff;
      // height: 3rem;
      border: 1px solid #ccc !important;
    }

    .select-time {
      & > div {
        display: flex;
        align-items: center;
      }

      span:last-child {
        margin-left: 4rem;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }
    }

    .exclude {
      margin-left: 1rem;

      .el-checkbox {
        margin-right: 1rem;
      }
    }
  }

  .handle {
    display: flex;
    justify-content: space-around;

    .hiFont {
      font-size: 1.7rem;
    }
  }
}

// 加班记录弹窗
.calc-content {
  box-sizing: border-box;
  padding: 0 2rem;
  width: 100%;
  border-collapse: collapse;

  tr {
    font-size: 1.6rem;
    color: #666;
    border-bottom: 1px solid #eee;
    font-weight: bold;

    span,
    td {
      width: 50%;
      line-height: 5rem;
      padding-left: 2rem;
    }
  }

  tr:last-child {
    border: none;
  }

  tbody {
    tr {
      font-size: 1.4rem;
      font-weight: 0;
      color: #969696;
    }
  }
}

/deep/ .footer-table {
  padding: 0 20px;

  span.row-state i {
    cursor: pointer;
    font-size: 16px;
    font-weight: 900;

    &.el-icon-check {
      color: #73d13d;
    }

    &.el-icon-close {
      color: #fc4c4d;
    }

    &.el-icon-more {
      color: #fea940;
    }
  }

  .is-check {
    color: #73d13d;
  }

  .is-close {
    color: #fc4c4d;
  }

  .is-more {
    color: #fea940;
  }

  &::before {
    height: 0;
  }

  // 下边线
}

// 分页器

.attence-table {
  // min-height: 100%;
  // height: 90%;
  height: calc(100% - 5rem);
  position: relative;
  box-sizing: border-box;
  overflow: auto;
}

/deep/ .footer-page {
  margin-top: 1rem;

  /deep/.el-pagination {
    text-align: center;
  }

  .el-button--small {
    padding: 9px 10px;
  }
}

@media all and (max-width: 1024px) {
  /deep/ .footer-table {
    padding: 0 10px;
  }

  /deep/ .footer-page {
    padding: 0 10px 0;
    position: relative;

    // total弄到最右边
    .el-pagination__total {
      position: absolute;
      right: 0;
      height: 28px;
      line-height: 28px;
      font-size: 13px;
      display: inline-block;
    }
  }

  /*移动端样式开始*/
  /*隐藏右上角头部按钮 只看异常那个*/
  .attendance-header ul li:last-child {
    display: none;
    /*剩的另一个li就能占用100%宽度了*/
  }

  .time-pick {
    flex-direction: column;

    .select-time {
      flex-direction: column;
      align-items: flex-start !important;
      margin-top: 1rem;

      & > div {
        margin-right: 0 !important;
        width: 100%;

        span {
          width: 35%;
          text-align: center;
        }

        /deep/.el-date-editor {
          width: 200px !important;
        }
      }

      /deep/.el-button--medium {
        margin-top: 1rem;
        // float: right;
        width: 100%;
      }
    }
  }

  /*移动端 缩小格子尺寸*/
  .attendance-container {
    /deep/ .el-calendar__body {
      /*先去掉容器的上下多余空间*/
      padding: 0 2rem;

      /*重新处理cell的边框*/
      .el-calendar-table tr td {
        border: none;

        /*改变cell高度*/
        .el-calendar-day {
          height: 5.5rem; // 移动端格子大小
        }
      }
    }
  }

  /*只留头部变色，主体cell-info部分隐藏，*/
  .attendance-container /deep/ .attendance-cell {
    .cell-title p {
      color: rgba(74, 74, 74, 1);
      text-align: center !important;

      &.cell-title-left {
        font-size: 1.8rem;
      }

      &.cell-title-right {
        font-size: 1.6rem;
        margin-top: 1rem;
      }
    }

    .cell-title.has-unusual p {
      color: rgba(255, 122, 69, 1);
      // color: darkred;
    }

    .cell-info {
      display: none;
    }
  }

  /*: 移动端ol列表 修饰详细的cell详情info*/
  .attendance-all /deep/ ol.mobile-cell-info {
    display: block !important;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;

    li {
      float: left;
      height: 7rem;
    }

    /*center*/
    li:nth-child(1) {
      width: 100%;
      background-color: #fff;

      div.m-first-li {
        margin: 1rem 8rem;

        p {
          text-align: left;
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 1.4rem;
          font-weight: 500;
          color: rgba(74, 74, 74, 1);
          white-space: nowrap;

          span.is-unusual {
            color: rgba(255, 122, 69, 1);
          }
        }
      }
    }

    /*left 2019 11 09*/
    li:nth-child(2) {
      width: 8rem;
      margin-left: -100%;
      text-align: left;
      line-height: 7rem;
      font-size: 2rem;
      color: rgba(74, 74, 74, 1);
      font-weight: bold;
      text-align: center;
    }

    /*right button*/
    li:nth-child(3) {
      width: 8rem;
      margin-left: -8rem;
      line-height: 7rem;
      text-align: center;

      .el-button--mini,
      .el-button--small {
        color: rgba(68, 142, 245, 1);
        border-color: rgba(68, 142, 245, 1);
      }
    }
  }
}

/*PC端样式*/
.attendance-container /deep/ .el-calendar-table {
  thead th {
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    font-size: 1.6rem;
    color: rgba(74, 74, 74, 1);
  }
}

.attendance-container /deep/ .el-calendar-table td {
  /*cell小遮罩层效果，看起来像而已*/
  &.is-selected {
    background-color: transparent;
  }

  .el-calendar-day {
    background-color: transparent;
    height: 90px;
    padding: 0;
  }

  &:hover {
    background-color: #f2f8fe !important;
  }

  animation: tdAm 0.6s;

  @keyframes tdAm {
    0% {
      transform: rotateY(-100deg);
    }

    100% {
      transform: rotateY(0deg);
    }
  }
}

//
.attendance-container /deep/ .attendance-cell {
  padding: 0 8px;
  margin-top: 8px;

  /*正常工作日 头部样式*/
  .cell-title {
    margin-bottom: 1.2rem;

    p {
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(74, 74, 74, 1);

      &.cell-title-left {
        text-align: left;
        font-size: 1.6rem;
      }

      &.cell-title-right {
        text-align: right;
        font-size: 1.2rem;
      }
      &.apply {
        display: none;
      }
    }
  }
  &:hover {
    .cell-title {
      p {
        &.apply {
          display: block;
          span {
            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }
  }
  /*非工作日(节假日 休息日)的头部样式 全为暗色，且没主体部分*/
  &.is-rest {
    .cell-title p {
      color: rgba(187, 187, 187, 1);
    }

    .cell-info {
      display: none;
    }
  }

  /*常态展示*/
  .cell-info {
    .cell-info-right {
      text-align: right;
      margin-top: 0;

      margin-bottom: 0.5rem;
    }
    p {
      display: flex;
      justify-content: space-between;
      font-size: 1.2rem;
      margin-top: 0.5rem;
      transition: all 0.4s ease;

      &.last-p {
        padding-bottom: 0.5rem;
      }

      color: rgba(109, 109, 109, 1);

      /*普通文字 灰色*/
      span {
        flex: 2;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      em {
        flex: 1;
        text-align: right;
        color: rgba(27, 196, 196, 1);
        /*正常 蓝色*/
        // overflow: hidden;
        white-space: nowrap;
        // text-overflow: ellipsis;
      }

      &.is-unusual em {
        color: rgba(255, 122, 69, 1);
        /*异常 亮色*/
      }
    }
  }

  /*只看异常考勤时*/
  .cell-info.only-unusual p {
    /*思路：只看异常时，先不管类型把所有cell-info下的p全隐藏，然后再把异常的展示*/
    /*不要脱离文档流 666 */
    // visibility: hidden;
    opacity: 0;

    &.is-unusual {
      opacity: 1;
      // visibility: visible;
      color: rgba(255, 122, 69, 1);
    }
  }
}

.attendance-all {
  overflow: hidden;

  /deep/ ol.mobile-cell-info {
    display: none;
  }

  /*大于991 隐藏: 手机端底部页面*/
  /deep/ .el-calendar__header {
    display: none;
  }

  /*隐藏 elementUI 日历组件的头*/
  /deep/ .el-calendar-table {
    padding-bottom: 0rem;
  }

  /*这个样式为了底下对齐*/
}

.attendance-header {
  ul {
    display: flex;
    height: 4rem;
    align-items: center;
    padding: 0.5rem 2rem;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
  }

  li {
    flex: 1;

    & > div {
      flex: 0 0 15rem;
      display: flex;
      align-items: center;
    }

    &:first-child {
      text-align: left;
      font-size: 1.8rem;
      font-weight: bold;
      color: rgba(74, 74, 74, 1);
    }

    &:last-child {
      text-align: right;
      font-size: 1.4rem;
      font-weight: 500;
      color: rgba(155, 155, 155, 1);

      span {
        cursor: pointer;
      }
    }
  }

  .time-filters {
    margin-bottom: 5px;
    div {
      height: 5rem;
      align-items: center;
      padding: 0.5rem 2rem;
      padding-bottom: 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ebeef5;

      span {
        color: #333;
        font-size: 1.4rem;
        font-weight: bold;
      }
    }

    /deep/#mem-public {
      border: none !important;

      .c_button {
        display: flex;
        align-items: center;
        // margin-left: 1rem;
      }

      .avatar_small {
        img {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }

    /deep/.main-box {
      border: none;
    }
  }

  // tab2下左上角时间选择
  /deep/ .top-left-date .el-input__inner {
    cursor: pointer;
  }

  /deep/.el-date-editor {
    width: 85px;
    height: 2.9rem;
    margin-right: 1rem;
    position: relative;
    // top: 4px;

    .el-input__inner {
      height: 3rem;
      padding-right: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #4a4a4a;
      text-align: center;
      border: 1px solid #ddd !important;
      border-radius: 0.4rem;
      background: #fff;
      padding: 0;
    }

    .el-input__icon {
      line-height: 3rem;
      color: #6d6d6d;
    }

    .el-input__prefix {
      display: none;
    }
  }
  .header_team {
    margin-left: 10px;
    /deep/.el-select {
      width: 140px;
      margin-right: 5px;
      .el-input__inner {
        border: 1px solid #e4e7ed !important;
        height: 36px;
        line-height: 36px;
      }
    }
  }
}

/*日历点击优化 cx****** */
.attendance-container /deep/ .prev,
.attendance-container /deep/ .next {
  pointer-events: none;

  /*这控制移动端不乱跳日历mainDays 以后实在有兼容问题就从头写个原生js日历(抄袭element的css样式，结构自己写[].concat(pre, cur, next))*/
  .el-calendar-day {
    pointer-events: none;
  }

  /*下面这个只能控制pc不乱跳日历mainDays*/
}

.attendance-container-all {
  min-height: calc(100% - 4rem);
  display: flex;
  flex-direction: column;
}

.attence-content {
  overflow: auto;
  background-color: #fff;
  padding: 3rem 0 3rem 1.5rem;
  box-sizing: border-box;
  height: calc(100% - 4rem); // 有问题用flex也行

  /deep/ .el-col.el-col-24.el-col-xs-24.el-col-sm-12.el-col-md-24.el-col-lg-8 {
    perspective: 1000px;

    .genera-info {
      display: flex;
      align-items: center;
      height: 7.4rem;
      padding: 0 1rem 0 1rem;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 5px;
      border: 1px solid rgba(242, 242, 242, 1);
      margin: 0 1.5rem 0.7rem 0;

      // li {
      // 	cursor: pointer;
      // }

      li:nth-child(1) {
        flex: 1;
        display: flex;
        align-items: center;

        img {
          width: 4.5rem;
          height: 4.5rem;
          border-radius: 50%;
          vertical-align: middle;
        }

        span {
          margin-left: 2rem;
          font-size: 1.6rem;
          flex: 0 0 5rem;
          font-weight: bold;
        }
      }

      li:nth-child(2) {
        flex: 1;
        text-align: right;
        font-size: 1.3rem;
        font-weight: 500;
        color: rgba(109, 109, 109, 1);
        display: flex;
        flex-direction: column;
        // justify-content: flex-end;
        align-items: flex-end;

        p {
          margin: 1rem 0;
          white-space: nowrap;
          display: flex;
          // justify-content: flex-end;
          width: 100px;

          span {
            width: 7rem;
            text-align: left;
            // display: block;
          }

          em {
            color: rgba(27, 196, 196, 1);
            /*正常 蓝色*/
            margin-left: 1rem;
          }

          &.is-unusual em {
            color: rgba(255, 122, 69, 1);
            /*异常 亮色*/
          }
        }
      }
    }
  }
}

// CX C3动画
// 就是el-col
.attence-content
  /deep/
  .el-col.el-col-24.el-col-xs-24.el-col-sm-12.el-col-md-24.el-col-lg-8 {
  &.see-all {
    animation: liAm 0.4s ease-out;

    @keyframes liAm {
      from {
        transform: scale(0.9);
      }

      to {
        transform: scale(1);
      }
    }
  }

  // 只看异常时：就是el-col
  &.see-unusual {
    &.has-unusual {
      ul li:nth-child(3) p {
        visibility: hidden;

        &.is-unusual {
          visibility: visible;
          color: rgba(255, 122, 69, 1);
        }
      }

      animation: liAp 0.4s forwards;

      @keyframes liAp {
        from {
          transform: translateY(-10000px);
        }

        to {
          transform: translateY(0);
        }
      }
    }

    &.not-unusual {
      animation: liA 0.4s forwards;

      @keyframes liA {
        from {
          transform: translateX(0);
        }

        to {
          transform: translateX(10000px);
          // 这玩意和relative很相似：跑都跑了还占着
        }
      }
    }
  }
}
</style>
