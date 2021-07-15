<template>
  <div id="memberProccess" v-loading="load">
    <XHeader title="成员实况" titleEnglish="Member Live" class="baseHeader">
      <div slot="filter">
        <i
          class="hiFont hi-search mobile-filter-btn"
          @click="
            () => {
              showFilter = true;
            }
          "
        ></i>
        <a
          class="filter-btn"
          @click="
            () => {
              showFilter = true;
            }
          "
        >
          <span>筛选</span>
          <i class="hiFont hi-search"></i>
        </a>
        <el-drawer
          :visible.sync="showFilter"
          direction="rtl"
          :append-to-body="true"
          size="350px"
          :show-close="false"
        >
          <!-- 头部 -->
          <div class="filter-title" slot="title">
            <span>筛选</span>
          </div>
          <!-- 筛选内容 -->
          <div class="filter-form">
            <div class="sel">
              <span class="label">成员</span>
              <selMember
                size="small"
                @Confirm="getMember"
                :selRange="1"
                :arrays="selMem"
                :showLength="20"
              >
                <span slot="button" class="btn-custom"
                  ><i class="el-icon-plus"></i
                ></span>
              </selMember>
            </div>
            <div class="sel">
              <span class="label">部门</span>
              <selDepart :showButton="false" @getResult="getDepart">
                <span slot="buttonCustom" class="btn-custom"
                  ><i class="el-icon-plus"></i
                ></span>
              </selDepart>
            </div>
            <div class="btns">
              <el-button type="primary" @click="getTask()" size="small"
                >确认搜索</el-button
              >
              <el-button
                @click="
                  () => {
                    showFilter = false;
                  }
                "
                size="small"
              >
                取消
              </el-button>
            </div>
          </div>
        </el-drawer>
      </div>

      <div slot="btnGroup">
        <a href="javascript:void(0)" class="sp">
          <span>刷新</span>
          <i class="hiFont hi-refresh"></i>
          <!-- <el-button type="primary" size="mini" @click="getTask()" style="height: 3.2rem;">刷新</el-button> -->
        </a>
      </div>
    </XHeader>
    <div
      class="content"
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
            <el-collapse
              v-model="userID"
              @change="changeUser()"
              accordion
              class="list-wrapper"
            >
              <div
                v-for="(item, childindex) in loadItem[index]"
                :key="childindex"
                class="collapse-item"
              >
                <el-collapse-item
                  :name="item.usInfo.UsId"
                  :style="
                    userID == item.usInfo.UsId
                      ? 'box-shadow:0px 5px 20px -5px #448ef5'
                      : ''
                  "
                  class="mobile-collapse"
                >
                  <!-- 未展开时个人信息 展开头部-->

                  <template slot="title">
                    <div class="title">
                      <div class="touxiang">
                        <img v-lazy="$url + item.usInfo.Picture" alt="" />
                        <span :title="item.usInfo.Name">{{
                          item.usInfo.Name
                        }}</span>

                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="
                            $D.ITEM('work_status', item.WorkStatus).name
                          "
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
                        <p v-if="item.jobInfo">
                          <i
                            :style="
                              'color:' +
                              $D.ITEM('g_priority', item.jobInfo.Fir).color[0] +
                              ';margin-right:1rem'
                            "
                            v-if="item.jobInfo.Fir !== 1"
                            >{{
                              $D.ITEM("g_priority", item.jobInfo.Fir).name
                            }}</i
                          ><span
                            style="cursor: pointer"
                            @click.stop="toDetail(item.jobInfo)"
                            class="task-name"
                            >{{ item.jobInfo.Name }}</span
                          >
                        </p>
                        <p v-else>未开始任务</p>
                        <div class="progress-bars" v-if="item.jobInfo">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="11"
                            :percentage="parseInt(item.jobInfo.Progress)"
                          ></el-progress>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="任务/项目"
                            placement="right"
                          >
                            <span>任务进度</span>
                          </el-tooltip>
                        </div>
                        <div class="progress-bars" v-else>
                          <el-progress
                            :text-inside="true"
                            :stroke-width="11"
                            :percentage="0"
                          ></el-progress>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="任务/项目"
                            placement="right"
                          >
                            <span>任务进度</span>
                          </el-tooltip>
                        </div>
                        <div class="progress-bars" v-if="item.jobInfo">
                          <div class="progress-div">
                            <div
                              class="progress-div-bar"
                              :style="
                                'width:' +
                                parseInt(item.jobInfo.SpentRatio * 100) +
                                '%'
                              "
                            >
                              <i
                                :style="
                                  parseInt(item.jobInfo.SpentRatio * 100) > 80
                                    ? 'left:80%'
                                    : 'left:' +
                                      parseInt(item.jobInfo.SpentRatio * 100) +
                                      '%'
                                "
                                >{{
                                  parseInt(item.jobInfo.SpentRatio * 100)
                                }}%</i
                              >
                            </div>
                          </div>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="总耗时/预估耗时"
                            placement="right"
                          >
                            <span
                              >{{
                                parseFloat(
                                  item.jobInfo.SpentTotal / 60
                                ).toFixed(2) | formateDecimal
                              }}
                              h/{{
                                parseFloat(
                                  item.jobInfo.EstimatedTime / 60
                                ).toFixed(2) | formateDecimal
                              }}
                              h</span
                            >
                          </el-tooltip>
                        </div>
                        <div class="progress-bars" v-else>
                          <div class="progress-div">
                            <div class="progress-div-bar">
                              <i>0%</i>
                            </div>
                          </div>

                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="总耗时/预估耗时"
                            placement="right"
                          >
                            <span>0 h/0 h</span>
                          </el-tooltip>
                        </div>

                        <p class="progress">
                          正在运行进程：{{
                            item.ProcessName == null ? "无" : item.ProcessName
                          }}
                        </p>
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
                            >{{ $D.ITEM("work_status", item.WorkStatus).name }}
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
                            >{{ $D.ITEM("work_status", item.WorkStatus).name }}
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
                  </template>
                  <el-collapse
                    v-model="activeCollapse"
                    accordion
                    class="collapse-detail"
                  >
                    <el-collapse-item name="task">
                      <template slot="title">
                        <span>任务详情</span>
                        <el-select
                          v-model="taskType"
                          @change="changTaskType()"
                          class="tips"
                          v-if="activeCollapse == 'task'"
                        >
                          <el-option
                            v-for="item in taskTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </template>
                      <!-- 个人任务列表（任务详情） -->
                      <div class="task-content" v-loading="taskLoading">
                        <div v-if="list.length">
                          <div
                            class="list-item"
                            v-for="(val, index) in list"
                            :key="index"
                          >
                            <div class="task-detail" @click="toDetail(val)">
                              <p>
                                <span
                                  :style="
                                    'color:' +
                                    $D.ITEM('g_priority', val.Fir).color[0] +
                                    ';margin-right:1rem'
                                  "
                                  v-if="val.Fir !== 1"
                                  class="fir"
                                  >{{
                                    $D.ITEM("g_priority", val.Fir).name
                                  }}</span
                                ><span class="name" :title="val.Name">{{
                                  val.Name
                                }}</span>
                              </p>

                              <p v-if="val.StartTime && val.PridictionTime">
                                <i
                                  :class="
                                    'hiFont ' +
                                    $D.ITEM('task_status', val.Schedule).icon
                                  "
                                  :style="
                                    'color:' +
                                    $D.ITEM('task_status', val.Schedule).color +
                                    ';margin-right:.5rem'
                                  "
                                ></i
                                >{{ val.StartTime | formateTime }} 至
                                {{ val.PridictionTime | formateTime }}
                              </p>
                              <p
                                v-else-if="val.StartTime && !val.PridictionTime"
                              >
                                开始于：{{ val.StartTime | formateTime }}
                              </p>
                              <p
                                v-else-if="!val.StartTime && val.PridictionTime"
                              >
                                截止于：{{ val.PridictionTime | formateTime }}
                              </p>
                              <p v-else>未设置时间</p>
                            </div>
                          </div>
                          <!-- <el-pagination layout="prev, pager, next" :total="100">
												</el-pagination> -->
                        </div>
                        <div v-else class="empty-task">暂无</div>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item name="2">
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
                              加班时长：{{
                                formateShowTime(item.usInfo.OverTime)
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
                    <el-collapse-item name="3">
                      <template slot="title">
                        <span>活动详情</span>
                      </template>
                      <div class="active-content">
                        <p class="active-name">
                          正在运行的程序：{{
                            item.ProcessName == null ? "无" : item.ProcessName
                          }}
                        </p>
                        <div class="screen-shot">
                          <p @click="shotScreenPhoto()">
                            <span v-if="imgload && item.usInfo.UsId == userID"
                              ><i class="el-icon-loading"></i>截图中...</span
                            ><span v-else>屏幕截图</span>
                          </p>
                          <div class="show-imgs">
                            <div class="imgs">
                              <div
                                class="receive-img"
                                v-for="(pic, imgIndex) in item.ProcessImgs"
                                :key="imgIndex"
                              >
                                <span>{{ pic.time }}</span>
                                <img
                                  v-lazy="$url + pic.imgUrl"
                                  :preview="item.usInfo.UsId"
                                  :οnerrοr="errorImg"
                                />
                                <!-- <span>{{item.time.timeFormat('yyyy年MM月dd日 HH:mm')}}</span> -->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-collapse-item>
              </div>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="empty-wrapper" v-else>
      <img src="../../assets/img/emptyMem.png" alt="" />
      <p class="empty-taskList">暂无可查看成员</p>
    </div>
    <taskDetail
      v-model="taskItem.JId"
      :type="1"
      referer="/memberProccess"
      :url="'/task/' + taskItem.EventId + '/' + taskItem.JId"
    ></taskDetail>
  </div>
</template>

<script>
import XHeader from "@/components/Header";
import taskDetail from "@/views/task/taskDetail";
// import xSocketLink from "@/assets/xSocketLink";
import PictureView from "@/views/msg/chatComponents/PictureView";
export default {
  components: {
    XHeader,
    taskDetail,
    PictureView,
    selMember: () => import("@/components/Selectors/MemberSelect"),
    selDepart: () => import("@/components/Selectors/DepartmentSelector"),
  },

  data() {
    return {
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
      selDepart: [],
      calcTime: null,
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
    userID() {
      this.imgload = false;
    },
  },
  methods: {
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
    toDetail(item) {
      this.taskItem = item;
      if (this.taskItem.EventId && this.taskItem.JId) {
        this.$modal.show("taskDetail");
      }
    },
    getTask() {
      //获得正在进行中的任务
      this.load = true;

      this.$http
        .post(
          "/HomePage/UsersTask/TaskCurrentList.ashx#",
          {
            rid: this.selDepart.map((item) => {
              return item.RId;
            }),
            uid: this.selMem.map((item) => {
              return item.UId;
            }),
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
    shotScreenPhoto(type, index) {
      //屏幕截图
      this.imgload = true;
      this.$http
        .get("/Work/WrokAreas/NoticeUserScreenshots.ashx", {
          params: {
            Id: this.userID,
          },
          timeout: 1000 * 60 * 3,
        })
        .then((res) => {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
          this.setTimer();
        });
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
    getDepart(arr) {
      this.selDepart = arr;
    },
  },
  mounted() {
    this.getTask();
  },
  created() {
    this.$E.$on("renewProccess", (res) => {
      this.getTask();
    });
    this.$E.$on("loadpic", (res) => {
      console.log("开始截图");
    });
    this.$E.$on("loadingpic", (res) => {
      console.log("收到截图");
      for (let key in this.loadItem) {
        if (this.loadItem[key].length) {
          this.loadItem[key].forEach((item) => {
            if (res.UserId == item.usInfo.UsId) {
              this.imgload = false;
              if (JSON.parse(res.imgUrl).length) {
                item.ProcessImgs = item.ProcessImgs.slice(0, 4);
                let shotArr = JSON.parse(res.imgUrl);
                shotArr = shotArr.length > 4 ? shotArr.splice(0, 3) : shotArr;
                shotArr.forEach((val) => {
                  item.ProcessImgs.unshift({
                    imgUrl: val.ImgUrl,
                    time: new Date(val.Times)
                      .toString()
                      .timeFormat("yyyy年MM月dd日 HH:mm"),
                  });
                });
                item.ProcessImgs.splice(-1, shotArr.length);
                this.$previewRefresh();
              } else {
                this.$notify({
                  message: "未获取到截图",
                  type: "info",
                });
              }
            }
          });
        }
      }
    });
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
    clearInterval(this.calcTime);
    this.calcTime = null;
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
  height: 98%;
  box-sizing: border-box;
  margin: 1%;
  display: flex;
  flex-direction: column;
  overflow: auto;

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

  .content {
    .depart {
      /deep/.el-collapse-item {
        border-radius: 0.6rem;
        overflow: hidden;
        margin-bottom: 1rem;
        margin-top: 1rem;
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
    position: absolute;
    font-size: 1.3rem;
    // left: 76%;
    right: 3%;
    bottom: 10px;
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
    width: 90%;
    align-items: center;
    box-sizing: border-box;
    position: relative;

    .touxiang {
      padding: 0rem 1.5rem;
      width: 5rem;
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
      width: 70%;
      padding-left: 1.5rem;
      box-sizing: border-box;
      height: 100%;
      border-left: 1px solid #ddd;

      // padding:1rem 0;
      p {
        line-height: 2.1rem;
        font-size: 1.4rem;
        color: #6d6d6d;
        font-weight: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 0.5rem;
        width: 70%;
      }

      p:nth-of-type(1) {
        font-weight: bold;
      }

      p:nth-of-type(2) {
        margin-bottom: 5px;
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
        margin-bottom: 1rem;
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
            height: 100px;
            position: relative;
            overflow: hidden;
            // border-radius: 1px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 1rem;

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
