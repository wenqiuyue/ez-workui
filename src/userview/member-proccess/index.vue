<template>
  <div id="memberProccess" v-loading="load">
    <XHeader title="成员实况" titleEnglish="Staffs' Status" class="baseHeader">
    </XHeader>
    <div class="select-conditions">
      <div class="sel_inline">
        <div class="sel" v-if="isShowTeam">
          <span>团队</span>
          <div>
            <el-select
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
          </div>
        </div>
        <div class="sel" v-if="teamValue">
          <span>员工</span>
          <selMember
            size="small"
            @Confirm="getMember"
            :selRange="1"
            :arrays="selMem"
            :showLength="10"
            :teamId="teamValue"
          >
            <span slot="button" class="btn-custom">
              <i class="el-icon-plus"></i>
            </span>
          </selMember>
        </div>
      </div>
      <el-button type="primary" class="btn" @click="getTask">搜 索</el-button>
    </div>
    <div
      class="pro_content"
      v-if="
        loadItem.Free.length || loadItem.Online.length || loadItem.Unline.length
      "
    >
      <!-- 在线 -->
      <el-collapse v-model="activeNames" class="depart">
        <el-collapse-item
          :title="index | formateTitle"
          v-for="(type, index) in loadItem"
          :key="index"
          :name="index"
        >
          <div class="member">
            <div class="list-wrapper">
              <div
                v-for="(item, childindex) in loadItem[index]"
                :key="childindex"
                class="collapse-item"
              >
                <div class="mobile-collapse">
                  <div class="title">
                    <div class="touxiang">
                      <img :src="imgChange(item.usInfo.Picture, true)" alt="" />
                      <span :title="item.usInfo.Name">{{
                        item.usInfo.Name
                      }}</span>

                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$D.ITEM('work_status', item.WorkStatus).name"
                        placement="bottom"
                      >
                        <p>
                          <i
                            :style="
                              'background:' +
                              $D.ITEM('work_status', item.WorkStatus).color
                            "
                          ></i>
                        </p>
                      </el-tooltip>
                    </div>
                    <div class="taskDes">
                      <div class="progress">
                        <span class="processname"
                          >{{
                            item.ClientStatus == 0 ? "上一次" : "正在"
                          }}运行进程：{{
                            item.ProcessName == null ? "无" : item.ProcessName
                          }}
                        </span>
                        <div class="status_speed">
                          <div>
                            <span
                              >操作效率：<label
                                :style="`color:${getEfficiencyColor(
                                  item.EfficiencyStatus
                                )}`"
                              >
                                {{
                                  item.EfficiencyStatus
                                    ? item.EfficiencyStatus
                                    : "无"
                                }}</label
                              ></span
                            >
                          </div>
                          <div>
                            <span
                              >行为状态：<label
                                :style="`color:${getbehaviorColor(
                                  item.BehaviorStatus
                                )}`"
                                >{{
                                  item.BehaviorStatus
                                    ? item.BehaviorStatus
                                    : "无"
                                }}</label
                              ></span
                            >
                          </div>
                        </div>
                      </div>
                      <div class="info">
                        <span v-if="item.ClientStatus !== 1"
                          ><i
                            :style="
                              'background:' +
                              $D.ITEM('client_status', item.ClientStatus).color
                            "
                            >{{
                              $D.ITEM("client_status", item.ClientStatus).name
                            }}</i
                          ></span
                        >
                        <div v-if="item.WorkStatus == 0">
                          <p
                            :style="
                              'background:' +
                              $D.ITEM('work_status', item.WorkStatus).color
                            "
                          >
                            {{ $D.ITEM("work_status", item.WorkStatus).name }}
                          </p>
                          <i
                            :style="
                              'border-left-color:' +
                              $D.ITEM('work_status', item.WorkStatus).color
                            "
                          ></i>
                        </div>
                        <div v-else-if="item.WorkStatus == 2">
                          <p
                            :style="
                              'background:' +
                              $D.ITEM('work_status', item.WorkStatus).color
                            "
                          >
                            <span
                              >{{
                                $D.ITEM("work_status", item.WorkStatus).name
                              }}
                              {{ formateShowTime(item.usInfo.OverTime) }}</span
                            >
                          </p>
                          <i
                            :style="
                              'border-left-color:' +
                              $D.ITEM('work_status', item.WorkStatus).color
                            "
                          ></i>
                        </div>
                        <div v-else>
                          <p
                            :style="
                              'background:' +
                              $D.ITEM('work_status', item.WorkStatus).color
                            "
                          >
                            <span
                              >{{
                                $D.ITEM("work_status", item.WorkStatus).name
                              }}
                              {{ formateShowTime(item.usInfo.WorkTime) }}</span
                            >
                          </p>
                          <i
                            :style="
                              'border-left-color:' +
                              $D.ITEM('work_status', item.WorkStatus).color
                            "
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <el-collapse
                    v-model="activeCollapse"
                    accordion
                    class="collapse-detail"
                  >
                    <el-collapse-item :name="`${index}-${childindex}-task`">
                      <template slot="title">
                        <span>任务详情</span>
                      </template>
                      <!-- 个人任务列表（任务详情） -->
                      <div class="task-content">
                        <div v-if="true">
                          <div
                            class="list-item"
                            v-for="(val, index) in item.TaskMembers"
                            :key="index"
                          >
                            <div class="task-detail" @click="toDetail(val)">
                              <p>
                                <span class="name">{{ val.Name }}</span>
                                <el-tag
                                  type="success"
                                  size="mini"
                                  v-if="val.Status"
                                  >{{ val.Status }}</el-tag
                                >
                              </p>
                            </div>
                          </div>
                          <!-- <el-pagination layout="prev, pager, next" :total="100">
												</el-pagination> -->
                        </div>
                        <div v-else class="empty-task">暂无</div>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item :name="`${index}-${childindex}-workinfo`">
                      <template slot="title">
                        <span>上班详情</span>
                      </template>
                      <div class="active-content">
                        <div class="active-time-infor">
                          <div>
                            <p>
                              上班时间：{{
                                item.usInfo.WorkStart
                                  ? item.usInfo.WorkStart.timeFormat("HH:mm")
                                  : "无"
                              }}
                            </p>
                            <p>
                              下班时间：{{
                                item.usInfo.WorkEnd
                                  ? item.usInfo.WorkEnd.timeFormat("HH:mm")
                                  : "无"
                              }}
                            </p>
                          </div>
                          <div>
                            <p>
                              上班时长：{{
                                formateShowTime(item.usInfo.WorkTime)
                              }}
                            </p>

                            <p>
                              日期：{{
                                item.usInfo.WorkStart
                                  ? item.usInfo.WorkStart.timeFormat(
                                      "yyyy-MM-dd"
                                    )
                                  : "无"
                              }}
                            </p>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item
                      :name="`${index}-${childindex}-avticeinfo`"
                    >
                      <template slot="title">
                        <span>活动详情</span>
                      </template>
                      <div class="active-content">
                        <!-- <p class="active-name">
                          {{
                            item.ClientStatus == 0 ? "上一次" : "正在"
                          }}运行的程序：{{
                            item.ProcessName == null ? "无" : item.ProcessName
                          }}
                        </p> -->
                        <div class="screen-shot">
                          <span
                            v-if="item.ClientStatus == 1"
                            class="screen_check"
                          >
                            <el-checkbox-group v-model="screenCheck">
                              <el-checkbox label="屏幕"></el-checkbox>
                              <el-checkbox
                                label="摄像头"
                                :disabled="!item.IsStartCamera"
                              ></el-checkbox>
                            </el-checkbox-group>
                            <p @click="shotScreenPhoto(item.usInfo.UsId, item)">
                              <span v-if="imgload && item.usInfo.UsId == userID"
                                ><i class="el-icon-loading"></i>截图中...</span
                              ><span v-else>立即截图</span>
                            </p>
                          </span>
                          <el-tag
                            type="info"
                            effect="plain"
                            v-else
                            size="medium"
                          >
                            该用户当前已离线，无法截图
                          </el-tag>
                          <div v-if="item.title">
                            当前进程：{{ item.title }}
                          </div>
                          <div class="show-imgs">
                            <div class="imgs">
                              <div
                                class="receive-img"
                                v-for="(pic, imgIndex) in item.ProcessImgs"
                                :key="imgIndex"
                              >
                                <span>{{ pic.time }}</span>
                                <el-image
                                  :src="$url + pic.imgUrl"
                                  :preview-src-list="[$url + pic.imgUrl]"
                                >
                                </el-image>
                                <!-- <span>{{item.time.timeFormat('yyyy年MM月dd日 HH:mm')}}</span> -->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="empty-wrapper" v-else>
      <img src="../../assets/img/emptyMem.png" alt="" />
      <p class="empty-taskList">暂无可查看成员</p>
    </div>
    <TaskModal
      ref="taskM"
      :indexData="indexData"
      :IsRealTimeScreenshot="IsRealTimeScreenshot"
    ></TaskModal>
  </div>
</template>

<script>
import { imgChange, getEfficiencyColor, getbehaviorColor } from "@/commons";
// import xSocketLink from "@/assets/xSocketLink";
export default {
  components: {
    XHeader: () => import("@/components/Header"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    TaskModal: () => import("@/userview/task-manager/task-modal"),
  },

  data() {
    return {
      IsRealTimeScreenshot: true,
      screenCheck: [], //截屏类型
      isShowTeam: false, // 是否显示团队选择
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
      errorImg: require("@/assets/img/emptyCon.png"),
      imgload: false,
      userID: "",
      list: [],
      taskList: {},
      load: false,
      loadItem: {
        Free: [],
        Online: [],
        Unline: [],
      },
      taskItem: {},
      statuList: [
        {
          label: "部门",
          value: 0,
        },
        {
          label: "成员",
          value: 1,
        },
      ],
      activeNames: [],
      taskLoading: false,
      taskType: 0,
      taskTypes: [
        {
          label: "按未完成的任务",
          value: 0,
        },
        {
          label: "按暂停中的任务",
          value: 1,
        },
        {
          label: "按待定中的任务",
          value: 2,
        },
      ],
      onArr: [], //在线
      freeArr: [], //空闲
      offArr: [], //离线
      activeCollapse: "",
      activeType: "",
      acitiveIndex: "",
      timer: null,
      showFilter: false,
      selMem: [],
      calcTime: null,
      indexData: {
        type: "", // Add Edit
        name: "",
        departmentCode: "",
      },
    };
  },
  computed: {
    workInfor() {
      return this.$store.state.user;
    },
  },
  filters: {
    formateTime(time) {
      if (!time) {
        return;
      }
      return time.timeFormat("yyyy-MM-dd");
    },
    formateTitle(str) {
      if (str == "Online") {
        return "在线成员";
      }
      if (str == "Unline") {
        return "离线成员";
      }
      if (str == "Free") {
        return "空闲成员";
      }
    },
    formatSeconds(value) {
      let _seconds = parseInt(_time);
      let hours, mins, seconds;
      let result = "";
      seconds = parseInt(_seconds % 60);
      mins = parseInt((_seconds % 3600) / 60);
      hours = parseInt(_seconds / 3600);
      if (hours) {
        result =
          this.PadZero(hours) +
          ":" +
          this.PadZero(mins) +
          "''" +
          ":" +
          this.PadZero(seconds) +
          "'";
      } else {
        result = this.PadZero(mins) + "''" + ":" + this.PadZero(seconds) + "'";
      }

      return result;
    },
    formateDecimal(num) {
      if (!num) {
        return 0;
      }
      num = parseFloat(num).toFixed(2);
      let reg = /00/;
      if (reg.test(num)) {
        let i = num.indexOf(".");
        num = num.slice(0, i);
        return num;
      }
      if (num[num.length - 1] == 0) {
        num = num.slice(0, num.length - 1);
        return num;
      }
      return num;
    },
  },
  watch: {
    "searchData.text"() {
      if (!this.searchData.text) {
        this.getTask();
      }
    },
    // userID() {
    //   this.imgload = false;
    //   console.log(this.imgload, "1111");
    // },
  },
  methods: {
    imgChange,
    getEfficiencyColor,
    getbehaviorColor,
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
     * 任务详情
     */
    toDetail(val) {
      this.$modal.show("taskM");
      this.$refs.taskM.setLoading(true);
      this.$http
        .post("/Task/GetTaskDetail.ashx", {
          teamId: this.teamValue,
          Id: val.Id,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.indexData = {
              type: "",
              name: "任务详情",
              departmentCode: 1,
              row: resp.data,
              xModalName: "taskM",
            };
            this.$nextTick(() => {
              this.$refs.taskM.changeEditState();
            });
          }
        })
        .finally(() => this.$refs.taskM.setLoading(false));
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
    changeUser() {
      //点击某成员获得正在执行的任务
      this.taskType = 0;
      this.taskLoading = true;
      if (this.userID) {
        this.$http
          .post(
            "/HomePage/UsersTask/TaskInProgressList.ashx",
            {
              usId: this.userID,
              type: this.taskType,
            },
            {
              timeout: 1000 * 60 * 3,
            }
          )
          .then((res) => {
            if (res.res == 0) {
              this.taskLoading = false;
              this.list = res.data.Jobs;
              this.Count = res.data.Count;
            }
          });
      }
    },
    changTaskType() {
      //个人任务切换任务类型
      this.taskLoading = true;
      if (this.userID) {
        this.$http
          .post(
            "/HomePage/UsersTask/TaskInProgressList.ashx",
            {
              usId: this.userID,
              type: this.taskType,
            },
            {
              timeout: 1000 * 60 * 3,
            }
          )
          .then((res) => {
            if (res.res == 0) {
              this.taskLoading = false;
              this.list = res.data.Jobs;
              this.Count = res.data.Count;
            }
          });
      }
    },
    getTask() {
      if (!this.teamValue) {
        this.$message({
          message: "请先选择团队",
          type: "warning",
        });
        return;
      }
      //获得实况数据
      this.load = true;

      this.$http
        .post(
          "/User/TaskCurrentList.ashx#",
          {
            uid: this.selMem.map((item) => {
              return item.UsId;
            }),
            teamId: this.teamValue,
          },
          {
            timeout: 1000 * 60 * 3,
          }
        )
        .then((res) => {
          if (res.res == 0) {
            this.load = false;
            this.loadItem = res.data;
            this.activeNames = Object.keys(this.loadItem);
            this.calcWorkTime();
          }
        });
    },
    PadZero(str) {
      //补零
      return new RegExp(/^\d$/g).test(str) ? `0${str}` : str;
    },
    formateShowTime(time) {
      if (!time) {
        return "无";
      }
      if (time) {
        let _time = time * 60 * 60;
        let _seconds = parseInt(_time);
        let hours, mins, seconds;
        let result = "";
        seconds = parseInt(_seconds % 60);
        mins = parseInt((_seconds % 3600) / 60);
        hours = parseInt(_seconds / 3600);
        if (hours) {
          result =
            this.PadZero(hours) +
            ":" +
            this.PadZero(mins) +
            "'" +
            ":" +
            this.PadZero(seconds) +
            '"';
        } else {
          result =
            "00:" +
            this.PadZero(mins) +
            "'" +
            ":" +
            this.PadZero(seconds) +
            '"';
        }

        return result;
      }
    },
    shotScreenPhoto(id, item) {
      if (!this.screenCheck.length) {
        this.$message({
          showClose: true,
          message: "请选择截图类型",
          type: "warning",
          duration: 2000,
        });
        return;
      }
      this.userID = id;
      item.ProcessImgs = [];
      //屏幕截图
      this.imgload = true;
      if (this.screenCheck.includes("屏幕")) {
        this.screenShot();
      }
      if (this.screenCheck.includes("摄像头")) {
        this.screenShotCamera();
      }
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.setTimer();
    },
    setTimer() {
      if (this.timer == null) {
        let num = 0;
        this.timer = setInterval(() => {
          num += 1;
          if (num == 30 && this.imgload == true) {
            clearInterval(this.timer);
            this.timer = null;
            this.imgload = false;
            this.$notify({
              type: "error",
              message: "请求超时",
            });
          }
        }, 1000);
      }
    },
    /**
     * 屏幕截图
     */
    screenShot() {
      this.$http
        .get("/User/Work/NoticeUserScreenshots.ashx", {
          params: { Id: this.userID, teamId: this.teamValue },
        })
        .then((res) => {});
    },
    /**
     * 摄像头截图
     */
    screenShotCamera() {
      this.$http
        .get("/User/Work/NoticeUserPhotographs.ashx", {
          params: { Id: this.userID, teamId: this.teamValue },
        })
        .then((res) => {});
    },
    calcWorkTime() {
      if (this.calcTime == null) {
        this.calcTime = setInterval(() => {
          for (let key in this.loadItem) {
            this.loadItem[key].forEach((item) => {
              item.usInfo.WorkTime = (item.usInfo.WorkTime * 3600 + 1) / 3600;
            });
          }
        }, 1000);
      }
    },
    getMember(arr) {
      this.selMem = arr;
    },
    /**
     * websocket截图回调
     */
    socketPic(res, type) {
      console.log(`收到${type}`);
      if (res.teamId != this.teamValue) {
        return;
      }
      for (let key in this.loadItem) {
        if (this.loadItem[key].length) {
          this.loadItem[key].forEach((item) => {
            if (res.UserId == item.usInfo.UsId) {
              this.imgload = false;
              if (JSON.parse(res.imgUrl).length) {
                item.title = res.title;
                // item.ProcessImgs = item.ProcessImgs.slice(0, 4);
                let shotArr = JSON.parse(res.imgUrl);
                // shotArr = shotArr.length > 4 ? shotArr.splice(0, 3) : shotArr;
                shotArr.forEach((val) => {
                  console.log(val);
                  // item.ProcessImgs = [];
                  item.ProcessImgs.push({
                    imgUrl: val.ImgUrl,
                    time: new Date(val.Times)
                      .toString()
                      .timeFormat("yyyy年MM月dd日 HH:mm"),
                  });
                });
              } else {
                this.$notify({
                  message: `未获取到${type}`,
                  type: "info",
                });
              }
            }
          });
        }
      }
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
    this.$nextTick(() => {
      if (this.teamValue) {
        this.getTask();
      } else {
        this.getTeams();
      }
    });
    this.$E.$on("renewProccess", (res) => {
      this.getTask();
    });
    this.$E.$on("loadpic", (res) => {
      console.log("开始截图");
    });
    this.$E.$on("loadcamerapic", (res) => {
      console.log("开始摄像头拍照");
    });
    this.$E.$on("loadingcamerapic", (res) => {
      this.socketPic(res, "摄像头拍照");
    });
    this.$E.$on("loadingpic", (res) => {
      this.socketPic(res, "屏幕截图");
    });
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
    clearInterval(this.calcTime);
    this.calcTime = null;
    this.$E.$off("loadpic");
    this.$E.$off("loadingpic");
    this.$E.$off("loadcamerapic");
    this.$E.$off("loadingcamerapic");
  },
};
</script>
<style>
.el-drawer__container {
  position: fixed !important;
}
</style>

<style lang="less" scoped="scoped">
.member-style {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  li {
    display: flex;
    width: 33%;
    margin-bottom: 1rem;
    // margin-right: 1rem;
    align-items: center;
    // justify-content: space-between;
    position: relative;

    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    span {
      color: #333;
      margin-right: 2rem;
    }

    i {
      width: 1px;
      height: 70%;
      background: #ddd;
      position: absolute;
      right: 20%;
      top: 3px;
    }
  }
}

.filter-form {
  .sel {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 1rem;
    margin-bottom: 2rem;

    .label {
      color: #333;
      font-size: 1.4rem;
      font-weight: bold;
      margin-right: 1rem;
      margin-bottom: 1rem;
    }

    /deep/#mem-public {
      border: none !important;

      .mem-add {
        display: none;
      }

      .c_button {
        display: flex;
        align-items: center;
        // margin-left: 1rem;
      }
    }

    .btn-custom {
      width: 35px;
      height: 20px;
      display: block;
      border: 1px solid #ccc;
      border-radius: 0.6rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      // margin-left: 1rem;

      i {
        font-size: 1.4rem;
        color: #6d6d6d;
      }

      &:hover {
        border-color: #409eff;

        i {
          color: #409eff;
        }
      }
    }
  }
  .btns {
    width: 100%;
    box-sizing: border-box;
    margin-top: 2rem;

    .el-button {
      width: 48%;
    }
  }
}

#memberProccess {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .select-conditions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    background: #ffffff;
    padding: 5px 14px 0 10px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 5%);
    .sel_inline {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .sel {
      display: flex;
      border-bottom: 1px solid #eee;
      align-items: center;
      height: 5rem;
      box-sizing: border-box;
      padding-left: 1rem;
      // height: 5rem;padding-left: 1rem;

      span {
        color: #333;
        font-size: 1.4rem;
        font-weight: bold;
        margin-right: 1rem;
      }

      /deep/#mem-public {
        border: none !important;

        .mem-add {
          display: none;
        }

        .c_button {
          display: flex;
          align-items: center;
          // margin-left: 1rem;
        }

        .avatar_small {
          img {
            width: 2.2rem;
            height: 2.2rem;
          }
        }
      }

      .btn-custom {
        width: 35px;
        height: 20px;
        display: block;
        border: 1px solid #ccc;
        border-radius: 0.6rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;
        // margin-left: 1rem;

        i {
          font-size: 1.4rem;
          color: #6d6d6d;
        }

        &:hover {
          border-color: #409eff;

          i {
            color: #409eff;
          }
        }
      }
    }
  }
  // background:#fff;
  .showName {
    color: #448ef5;
    font-size: 1.6rem;
    font-weight: bold;

    i {
      margin-left: 1rem;
    }
  }

  /deep/.el-progress-bar__innerText {
    position: relative;
    top: -3px;
  }

  .empty-wrapper {
    background: #fff;
    flex: 1;

    img {
      display: block;
      margin: 5rem auto;
      margin-top: 0;
      padding-top: 5rem;
      width: 245px;
      height: 245px;
    }

    p {
      color: #6d6d6d;
      font-size: 1.6rem;
      text-align: center;
    }
  }

  /deep/.el-collapse {
    border: none;
    box-shadow: 0px 5px 10px -5px transparent;
  }

  /deep/.el-collapse-item__wrap {
    border: none;
  }

  /deep/.el-collapse-item__header {
    height: auto;
    border: none;
  }

  /deep/.el-collapse-item__arrow {
    font-size: 2rem;
    color: #6d6d6d;
  }

  /deep/.el-collapse-item__content {
    padding-bottom: 0;
  }

  .pro_content {
    .depart {
      /deep/.el-collapse-item {
        border-radius: 0.6rem;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      /deep/.el-collapse-item__header {
        padding-left: 2rem;
        line-height: 5rem;
        color: #bbbbbb;
        font-size: 1.6rem;
        font-weight: bold;
        border-top: none;
      }

      /deep/.el-collapse-item__arrow {
        font-size: 2rem;
        color: #bbbbbb;
      }

      /deep/.el-collapse-item__content {
        padding-bottom: 0;
      }
    }

    .empty-task {
      line-height: 6rem;
      color: #6d6d6d;
      font-size: 1.4rem;
      text-align: center;
      border-top: 1px solid #f8f8f8;
    }

    .member {
      /deep/.el-collapse-item__header {
        padding-left: 0rem;
        line-height: 5rem;
        color: #bbbbbb;
        font-size: 1.6rem;
        font-weight: bold;
        position: relative;

        &:hover {
          .task-name {
            color: #448ef5;
          }
        }
      }

      /deep/.el-collapse-item__arrow {
        font-size: 2rem;
        color: #bbbbbb;
        padding-right: 2rem;
      }

      /deep/.el-collapse-item__content {
        padding-bottom: 0;
      }

      .list-wrapper {
        display: flex;
        flex-wrap: wrap;
      }

      .collapse-item {
        width: 49%;
        position: relative;

        /deep/.el-progress {
          width: 45%;
          margin-top: 2px;
        }

        /deep/ .el-collapse-item__arrow {
          padding-right: 0;
          margin: -55px 30px 0 auto;
        }

        .tips {
          margin-left: 2rem;

          /deep/ .el-input__inner {
            border: none !important;
            font-size: 1.2rem;
            height: 2.2rem;
            width: 10rem;
            border-radius: 0.4rem;
            background: #eee;
            padding: 0;
            text-align: center;
            color: #999;
          }

          /deep/.el-input__suffix {
            display: none;
          }
        }
        .mobile-collapse {
          border: 1px solid #eee;
          margin: 1rem;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          padding-top: 5px;
        }
      }

      /deep/.el-collapse-item {
        // width: 45%;
        box-shadow: 0px 5px 18px -5px #fff;
        border: 1px solid #eee;
        margin: 1rem;

        &:hover {
          box-shadow: 0px 5px 18px -5px #448ef5;
          border: none;
          border: 1px solid #fff;
        }
      }

      .collapse-detail {
        /deep/.el-collapse-item {
          // width: 45%;
          box-shadow: none;
          border: none;
          margin: 0;

          &:hover {
            box-shadow: none;
            border: none;
            border: none;
          }
        }

        /deep/.el-collapse-item__header {
          font-size: 1.4rem;
          color: #6d6d6d;
          padding-left: 2rem;
          font-weight: normal;
          line-height: 4rem;
        }

        /deep/.el-collapse-item__arrow {
          top: 0;
          right: 0;
          margin: 0 30px 0 auto;
          // color: #6D6D6D;
        }
      }
    }
  }

  .empty-taskList {
    text-align: center;
    font-size: 1.4rem;
    color: #6d6d6d;
    margin-top: 5rem;
  }

  .info {
    font-size: 1.3rem;
    display: flex;
    flex-direction: column;
    span {
      line-height: 1;
      margin-bottom: 0.5rem;
      font-size: 1.3rem;
      width: auto;
      color: #fff;
      font-weight: normal;

      i {
        background: #448ef5;
        padding: 0 5px;
      }
    }

    div {
      display: flex;

      p {
        line-height: 1.4;
        font-size: 1.3rem;
        background: #67c23a;
        color: #fff;
        font-weight: normal;
        width: 110px;
        padding-left: 5px;
        box-sizing: border-box;

        // display: flex;
        span {
          width: 110px;
          display: inline-block;
        }
      }

      i {
        display: block;
        border: 10px solid transparent;
        border-left-color: #67c23a;
      }
    }
  }

  .title {
    display: flex;
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    position: relative;

    .touxiang {
      padding: 0rem 1.5rem;
      height: 100%;

      img {
        width: 4.2rem;
        height: 4.2rem;
        border-radius: 50%;
        margin-bottom: 0.2rem;
        display: block;
        margin: 0 auto;
      }

      span {
        font-size: 1.4rem;
        color: #6d6d6d;
        line-height: 2rem;
        text-align: center;
        display: block;
        width: 100%;
        display: block;
        word-spacing: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ddd;
          line-height: 1;
        }

        span {
          color: #6d6d6d;
          font-size: 1.2rem;
          line-height: 1;
        }
      }
    }

    .taskDes {
      width: 88%;
      padding-left: 1.5rem;
      box-sizing: border-box;
      height: 100%;
      border-left: 1px solid #ddd;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      // padding:1rem 0;
      .progress {
        line-height: 2.1rem;
        color: #6d6d6d;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 0.5rem;
        width: 65%;
        .processname {
          font-weight: bold;
          font-size: 1.4rem;
        }
        .status_speed {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          span {
            margin: 0 5px;
          }
        }
      }
      .progress-bars {
        display: flex;
        align-items: center;

        span {
          position: relative;
          top: 1px;
          margin-left: 1rem;
          font-size: 1.2rem;
          line-height: 1;
        }

        .progress-div {
          width: 45%;
          height: 11px;
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          background: #ebeef5;
          margin-top: 5px;

          .progress-div-bar {
            position: absolute;
            height: 100%;
            background: #13c2c2;
            max-width: 100%;
            border-radius: 0 6px 6px 0;

            i {
              font-size: 12px;
              position: absolute;
              color: #fff;
              top: 0;
              left: 0;
              margin: 0 5px;
              line-height: 1;
            }
          }
        }
      }
    }
  }

  .task-content {
    padding-bottom: 0.5rem;

    .empty-task {
      line-height: 6rem;
      color: #6d6d6d;
      font-size: 1.4rem;
      text-align: center;
      border-top: 1px solid #f8f8f8;
    }

    .list-item {
      width: 100%;
      border-top: 1px solid #f8f8f8;
      display: flex;
      color: #6d6d6d;
      box-sizing: border-box;
      align-items: center;
      cursor: pointer;
      flex-direction: column;

      .task-detail {
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
        padding-left: 3rem;
        transition: all 0.2s;

        p:first-child {
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
          display: flex;
          line-height: 2rem;
          color: #4a4a4a;

          .name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
          }
        }

        p:last-child {
          margin-bottom: 0;
          color: #999;
          line-height: 2rem;
          font-size: 1.2rem;
        }

        &:hover {
          background: #f6f6f6;
          padding-left: 4rem;

          p:first-child {
            color: #448ef5;
          }
        }
      }
    }

    .more {
      font-size: 2rem;
      color: #6d6d6d;
      height: 6rem;
      width: 100%;
      border-top: 1px solid #f8f8f8;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 1.5rem;

      i {
        transform: rotate(-90deg);
        font-weight: 300;
        color: #999;
        // width: 3rem;
      }
    }
  }

  .active-time-infor {
    // padding-bottom: .5rem;
    // padding-left: 3rem;
    div {
      display: flex;
      margin-bottom: 0.5rem;

      p {
        width: 30%;
        text-align: left;
        color: #333;
        margin-right: 2rem;
      }
    }
  }

  .active-content {
    padding-bottom: 0.5rem;
    padding-left: 3rem;

    .active-name {
      // width: 80%;
      // border-bottom: 1px solid #DDD;
      color: #6d6d6d;
      width: 90%;
      // background: red;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .screen-shot {
      margin-top: 0.5rem;

      p {
        display: flex;
        font-size: 1.2rem;
        cursor: pointer;
        // margin-bottom: 1rem;
        height: 2.1rem;
        width: 7rem;
        align-items: center;
        line-height: 2.1rem;
        border: 1px solid #ddd;
        border-radius: 0.3rem;
        justify-content: center;

        span {
          line-height: 1;

          i {
            font-size: 1.4rem;
            margin-right: 1px;
          }
        }
      }

      .show-imgs {
        display: flex;
        justify-content: center;

        .imgs {
          width: 90%;
          display: flex;
          // justify-content: space-between;

          .receive-img {
            width: 28%;
            // height: 100px;
            position: relative;
            overflow: hidden;
            // border-radius: 1px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 1rem;
            .el-image {
              width: 115px;
              height: 60px;
            }
            img {
              width: 100%;
              // max-height: 85px;
              border: 1px solid #eee;
            }

            span {
              color: #6d6d6d;
              font-size: 1.2rem;
              text-align: center;
            }

            .image-slot {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;

              i {
                font-size: 2.5rem;
                color: #6d6d6d;
              }
            }
          }

          .receive-img:last-child {
            margin-right: 0;
          }
        }
      }
      .screen_check {
        display: flex;
        flex-direction: row;
        align-items: center;
        /deep/.el-checkbox-group {
          .el-checkbox {
            margin-right: 9px;
            .el-checkbox__label {
              padding-left: 5px;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}

@media all and (max-width: 990px) {
  .member {
    .collapse-item {
      width: 90% !important;
      margin: 0 auto;
    }

    .taskDes,
    .empty {
      ul {
        display: flex;
        flex-direction: column;

        li {
          margin-bottom: 0.5rem;
        }
      }
    }
  }
}

@media all and (max-width: 767px) {
  #memberProccess {
    .mobile-collapse {
      // padding-bottom: 4rem;
      position: relative;
    }

    .info {
      display: none !important;
    }

    // .mobile-info {
    // 	position: absolute;
    // 	font-size: 1.3rem;
    // 	// left: 76%;
    // 	right: 3%;
    // 	bottom: 10px;
    // 	display: flex;
    // 	flex-direction: column;
    //
    // 	span {
    // 		line-height: 1;
    // 		margin-bottom: .5rem;
    // 		font-size: 1.3rem;
    // 		width: auto;
    // 		color: #fff;
    // 		font-weight: normal;
    //
    // 		i {
    // 			background: #448EF5;
    // 			padding: 0 5px;
    // 		}
    // 	}
    //
    // 	div {
    // 		display: flex;
    //
    // 		p {
    // 			line-height: 1.4;
    // 			font-size: 1.3rem;
    // 			background: #67c23a;
    // 			color: #fff;
    // 			font-weight: normal;
    // 			width: 110px;
    // 			padding-left: 5px;
    // 			box-sizing: border-box;
    //
    // 			// display: flex;
    // 			span {
    // 				width: 110px;
    // 				display: inline-block;
    // 			}
    //
    // 		}
    //
    // 		i {
    // 			display: block;
    // 			border: 10px solid transparent;
    // 			border-left-color: #67c23a;
    // 		}
    // 	}
    //
    // }
  }
}
</style>
