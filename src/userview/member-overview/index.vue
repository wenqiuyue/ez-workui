<template>
  <div id="member-overview">
    <div id="member-overview-content" v-loading="loading">
      <div class="overview-content">
        <div class="select-conditions">
          <div class="sel-item">
            <span>成员</span>
            <selMember
              size="small"
              @Confirm="getSelMember"
              :selRange="1"
              :arrays="selMem"
              :showLength="showLength"
            >
              <span slot="button" class="btn-custom">
                <i class="el-icon-plus"></i>
              </span>
            </selMember>
          </div>
          <div class="sel-item">
            <span>日期</span>
            <div class="sel-date">
              <el-select v-model="dateType">
                <el-option
                  v-for="(item, index) in $D.LIST('member_overview_date_type')"
                  :key="index"
                  :value="item.value"
                  :label="item.name"
                ></el-option>
              </el-select>
              <el-date-picker
                v-model="selDate"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                value-format="yyyy-MM-dd"
                v-if="dateType == 1"
                :clearable="false"
              >
              </el-date-picker>
              <el-date-picker
                v-model="selDate"
                type="month"
                format="yyyy 年 MM 月"
                placeholder="选择月"
                value-format="yyyy-MM-dd"
                :clearable="false"
                :picker-options="pickOption"
                v-else
              >
              </el-date-picker>
            </div>
            <el-button type="primary" class="btn" @click="submitSearch()"
              >搜 索</el-button
            >
          </div>
        </div>
        <div class="member-content">
          <div v-if="memberList.length">
            <div
              class="content-item"
              v-for="(item, index) in memberList"
              :key="index"
            >
              <div class="wrapper">
                <div class="content-item-left">
                  <!-- 个人信息 -->
                  <div class="user-info">
                    <img v-lazy="$url + item.wsInfo.picture" />
                    <span>{{ item.wsInfo.name }}</span>
                  </div>
                  <!-- 个人信息移动端 -->
                  <div class="mobile-user-info">
                    <div class="info-wrapper">
                      <div class="user">
                        <img v-lazy="$url + item.wsInfo.picture" />
                        <span>{{ item.wsInfo.name }}</span>
                      </div>
                      <div class="main-score">
                        <p
                          :style="
                            'color:' + getScore(item.scores.scoreMain).color
                          "
                        >
                          {{ getScore(item.scores.scoreMain).score }}
                        </p>
                        <i class="unit">分</i>
                      </div>
                    </div>
                    <div class="score-wrapper">
                      <ul>
                        <li>
                          <span>效率分</span>
                          <p>
                            <i
                              :style="
                                'color:' +
                                getScore(item.scores.scoreEfficiency).color
                              "
                              >{{
                                getScore(item.scores.scoreEfficiency).score
                              }}</i
                            ><i class="unit">分</i>
                          </p>
                        </li>
                        <li>
                          <span>质量分</span>
                          <p>
                            <i
                              :style="
                                'color:' +
                                getScore(item.scores.scoreQuality).color
                              "
                              >{{ getScore(item.scores.scoreQuality).score }}</i
                            ><i class="unit">分</i>
                          </p>
                        </li>
                        <li>
                          <span>审核分</span>
                          <p>
                            <i
                              :style="
                                'color:' +
                                getScore(item.scores.scoreReview).color
                              "
                              >{{ getScore(item.scores.scoreReview).score }}</i
                            ><i class="unit">分</i>
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="ratio-info">
                    <h3 @click="toDetail(item.wsInfo.id, item)">
                      工作占比详细
                    </h3>
                    <h3 @click="toDetail(item.wsInfo.id, item)">
                      加班占比详细
                    </h3>
                  </div>
                  <!-- 工作信息 -->
                  <div class="job-info-wrapper">
                    <div class="job-info">
                      <h3>正在执行</h3>
                      <p
                        v-if="item.crtTask"
                        @click="toTask(item.crtTask)"
                        class="task"
                      >
                        {{ item.crtTask.jname }}
                      </p>
                      <p v-else>暂无正在执行的任务</p>
                      <el-tag size="mini" v-if="item.crtTask">{{
                        item.crtTask.ename
                      }}</el-tag>
                    </div>
                    <div class="next-job-info">
                      <h3>下个任务 <i>调整顺序</i></h3>
                      <p
                        v-if="item.nextTask"
                        @click="toTask(item.nextTask)"
                        class="task"
                      >
                        {{ item.nextTask.jname }}
                      </p>
                      <p v-else>暂无下个任务</p>
                      <el-tag size="mini" v-if="item.nextTask">{{
                        item.nextTask.ename
                      }}</el-tag>
                    </div>
                  </div>
                  <div class="task-dynamic">
                    <h3>
                      {{ checkType[commandArr[index] - 1].name
                      }}<i v-if="item.bltDate"
                        >源自{{ item.bltDate.timeFormat("M月d日") }}</i
                      >
                      <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                          <i>切换</i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <template>
                            <el-dropdown-item
                              v-for="opt in checkType"
                              :key="opt.value"
                              :command="composeValue(opt, index)"
                            >
                              <p
                                :style="
                                  commandArr[index] == opt.value
                                    ? 'color:#448EF5;'
                                    : ''
                                "
                              >
                                <span style="margin-right: 2rem">{{
                                  opt.name
                                }}</span>
                                <i
                                  v-if="commandArr[index] == opt.value"
                                  class="hiFont hi-yes-lg"
                                  style="color: #448ef5"
                                ></i>
                              </p>
                            </el-dropdown-item>
                          </template>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <b @click="showTaskAct(item)"> 详情</b>
                    </h3>
                    <ul>
                      <li
                        v-for="(val, keyIndex) in item.happening"
                        :key="keyIndex"
                        v-if="keyIndex < 3"
                      >
                        <div class="detail">
                          <p @click="toTask(val)">{{ val.jname }}</p>
                          <i>{{ val.progress }}%</i>
                        </div>
                        <div class="time">
                          耗时：{{ val.spent.toFixed(1) }} 小时
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="task-cost">
                    <h3>任务耗时占比</h3>
                    <div class="task-cost-chart"></div>
                  </div>
                  <div class="common-software">
                    <h3 style="text-align: center">常用程序</h3>
                    <div class="common-software-chart"></div>
                  </div>
                </div>
                <div class="content-item-right">
                  <div class="work-ratio">
                    <div class="work">
                      <h3>
                        工作占比
                        <i @click.stop="toDetail(item.wsInfo.id, item)">详细</i>
                      </h3>
                      <div class="chart">
                        <el-popover
                          placement="top"
                          width="150"
                          trigger="hover"
                          v-for="(pop, popIndex) in item.wsInfo.workRat"
                        >
                          <div>
                            <!-- <p>{{pop.name}}</p> -->
                            <p>
                              {{ pop.name }}：{{
                                formateDecimal(
                                  ((pop.value / 100) * 100).toFixed(2)
                                )
                              }}%
                            </p>
                          </div>
                          <div
                            class="bar-wrapper"
                            slot="reference"
                            @click="showGetBar(pop, item)"
                          >
                            <p
                              :style="getStyle(pop, item.wsInfo.maxWorkNum)"
                            ></p>
                          </div>
                        </el-popover>
                      </div>
                    </div>
                    <div v-if="item.wsInfo.overRat.length" class="overwork">
                      <h3>
                        加班占比
                        <i @click.stop="toDetail(item.wsInfo.id, item)">详细</i>
                      </h3>
                      <div class="chart">
                        <el-popover
                          placement="top"
                          width="150"
                          trigger="hover"
                          v-for="(pop, popIndex) in item.wsInfo.overRat"
                        >
                          <div>
                            <!-- <p>{{pop.name}}</p> -->
                            <p>
                              {{ pop.name }}：{{
                                formateDecimal(
                                  ((pop.value / 100) * 100).toFixed(2)
                                )
                              }}%
                            </p>
                          </div>
                          <div
                            class="bar-wrapper"
                            slot="reference"
                            @click="showGetBar(pop, item)"
                          >
                            <p
                              :style="getStyle(pop, item.wsInfo.maxWorkNum)"
                            ></p>
                          </div>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                  <!-- 综合评分 -->
                  <div class="score">
                    <h3>综合评分 <i class="score-i">(10分制)</i></h3>
                    <div class="main-score">
                      <p
                        :style="
                          'color:' + getScore(item.scores.scoreMain).color
                        "
                      >
                        {{ getScore(item.scores.scoreMain).score }}
                      </p>
                      <i class="unit">分</i>
                    </div>
                    <ul>
                      <li>
                        <span>效率分</span>
                        <p>
                          <i
                            :style="
                              'color:' +
                              getScore(item.scores.scoreEfficiency).color
                            "
                            >{{
                              getScore(item.scores.scoreEfficiency).score
                            }}</i
                          ><i class="unit">分</i>
                        </p>
                      </li>
                      <li>
                        <span>质量分</span>
                        <p>
                          <i
                            :style="
                              'color:' +
                              getScore(item.scores.scoreQuality).color
                            "
                            >{{ getScore(item.scores.scoreQuality).score }}</i
                          ><i class="unit">分</i>
                        </p>
                      </li>
                      <li>
                        <span>审核分</span>
                        <p>
                          <i
                            :style="
                              'color:' + getScore(item.scores.scoreReview).color
                            "
                            >{{ getScore(item.scores.scoreReview).score }}</i
                          ><i class="unit">分</i>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- 标签 -->
              <div class="member-label">
                <el-tag type="info" size="small"
                  >完成的任务数：{{
                    item.nums.finishJob ? item.nums.finishJob : 0
                  }}次</el-tag
                >
                <el-tag type="info" size="small"
                  >执行的任务数：{{
                    item.nums.exeJob ? item.nums.exeJob : 0
                  }}次</el-tag
                >
                <el-tag type="info" size="samll"
                  >考核惩罚：{{
                    item.nums.pulish ? item.nums.pulish : 0
                  }}次</el-tag
                >
                <el-tag type="info" size="small"
                  >考核奖励：{{
                    item.nums.reward ? item.nums.reward : 0
                  }}次</el-tag
                >
              </div>
            </div>
            <div v-if="memberList.length > 0" class="load-status">
              <div class="g-loading" v-if="isLoading">
                <i class="el-icon-loading"></i>
                加载中...
              </div>
              <div class="g-loaded" v-if="!morePeople">已全部加载</div>
            </div>
          </div>
          <div class="empty-proccess-list" v-else>
            <img src="@/assets/img/emptyTask.png" alt="" />
            <p>暂无可查看成员</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 任务详情 -->
    <!-- <taskDetail
      v-model="taskItem.JId"
      :type="1"
      referer="/memberOverview"
      :url="url"
    ></taskDetail> -->
    <!-- 项目详情 -->
    <!-- <proDetail :eid="taskItem.EId"></proDetail> -->
    <!-- 任务近况 -->
    <!-- <recentTask
      :selDate="selDate"
      :activeId="activeId"
      :activeMan="activeTask"
      @openTask="toTask"
    ></recentTask> -->
    <!-- 个人工作加班信息情况 -->
    <!-- <personInfo
      :childDesData="childDesData"
      :childPerson="childPerson"
      :st="st"
      :et="et"
    ></personInfo> -->
    <!-- 进度条 / 条形图截图 -->
    <barPhoto :st="st" :et="et" :activeBar="activeBar"></barPhoto>
  </div>
</template>

<script>
import selMember from "@/components/Selectors/MemberSelectCopy.vue";
// import taskDetail from "@/views/task/taskDetail";
// import proDetail from "@/views/pro/proDetail";
// import recentTask from "./recentTask";
// import personInfo from "./personInfo";
import barPhoto from "./barPhoto";
export default {
  components: {
    selMember,
    // taskDetail,
    // proDetail,
    // recentTask,
    // personInfo,
    barPhoto,
  },
  data() {
    return {
      st: new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      ).toLocaleDateString(),
      et: new Date().toLocaleDateString(),
      //查看个人工作和加班的统计
      childDesData: {
        list: {},
      },
      loading: false,
      morePeople: true,
      activeMan: {}, // 查看某人的最近任务动态
      colorList: [
        "#63b2ee",
        "#76da91",
        "#f8cb7f",
        "#f89588",
        "#7cd6cf",
        "#9192ab",
        "#7898e1",
        "#efa666",
        "#eddd86",
        "#9987ce",
        "#63b2ee",
        "76da91",
        "#f8cb7f",
        "#f89588",
        "#7cd6cf",
        "#9192ab",
        "#7898e1",
        "#efa666",
        "#eddd86",
        "#9987ce",
      ],
      //renew
      selMem: [], //筛选 选中成员
      pageData: {
        c: 9,
        p: 1,
      },
      memberList: [],
      checkType: [
        {
          name: "最近任务动态",
          value: 1,
        },
        {
          name: "最近收款记录",
          value: 2,
        },
        {
          name: "最近客户动态",
          value: 3,
        },
        {
          name: "最近合同动态",
          value: 4,
        },
      ],
      activeBar: {},
      commandArr: [],
      showLength: 0,
      isLoading: true,
      url: "",
      taskItem: {},
      selDate: new Date(),
      activeId: null,
      activeTask: "",
      taskPage: {
        page: 1,
        count: 10,
      },
      dateType: 1,
      childPerson: "",
      pickOption: this.pickDate(),
    };
  },
  watch: {
    memberList: {
      handler: function (newVal) {
        // console.log(newVal)
      },
      deep: true,
    },
    selDate() {},
  },
  filters: {},
  methods: {
    pickDate() {
      let _this = this;
      return {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
      };
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
    getSelMember(arr) {
      this.selMem = arr;
    },
    //柱状图获取截图
    showGetBar(pop, item) {
      if (pop.name == "离线") {
        this.$message({
          type: "warning",
          message: "离线类没有进程截图",
        });
        return;
      }
      this.activeBar.name = pop.name;
      this.activeBar.id = item.wsInfo.id;
      if (this.activeBar.id) {
        this.$modal.show("timeAxis");
      }
    },
    toDetail(id, item) {
      this.childPerson = id;
      this.childDesData.name = item.wsInfo.name;
      item.wsInfo.workRat.forEach((val) => {
        val.width = val.value.toFixed(2);
        val.id = item.wsInfo.id;
      });
      item.wsInfo.overRat.forEach((val) => {
        val.width = val.value.toFixed(2);
        val.id = item.wsInfo.id;
      });
      this.childDesData.list.work = item.wsInfo.workRat;
      this.childDesData.list.overwork = item.wsInfo.overRat;
      this.childDesData.progress = item.wsInfo.progress;
      this.$modal.show("personProcess");
    },
    //成员概况
    getMemberData() {
      this.isLoading = true;
      let arr = this.selMem.map((item) => {
        return item.UId;
      });
      this.$http
        .get("/Company/MemberJob/MemberOverview.ashx", {
          params: {
            p: this.pageData.p,
            c: this.pageData.c,
            u: JSON.stringify(arr),
            wk: this.selDate.timeFormat("yyyy-MM-dd"),
            dt: this.dateType,
          },
        })
        .then((res) => {
          if (res.res == 0) {
            this.loading = false;
            this.isLoading = false;
            res.data.items.forEach((item) => {
              this.commandArr.push(1);
              let costTotal = 0;
              if (item.wsInfo.progress) {
                item.wsInfo.progress.forEach((val) => {
                  costTotal += val.value;
                });
              }
              item.wsInfo.cost = costTotal;
              let arr1 = item.wsInfo.workRat.map((val) => {
                return val.value;
              });
              let arr2 = item.wsInfo.overRat.map((val) => {
                return val.value;
              });
              arr1 = arr1.sort((a, b) => {
                return b - a;
              });
              arr2 = arr2.sort((a, b) => {
                return b - a;
              });
              item.wsInfo.maxWorkNum = arr1[0];
              item.wsInfo.maxOverworkNum = arr2[0];
            });
            this.memberList = this.memberList.concat(res.data.items);
            this.memberList.forEach((item, index) => {
              this.drawWorkCostChart(item.happenChart, index);
              this.drawCommonSoftwareChart(item.wsInfo.progress, index);
            });

            if (this.memberList.length >= res.data.totalCount) {
              this.morePeople = false;
            }
          }
        });
    },
    handleCommand(obj) {
      this.commandArr.splice(obj.index, 1, obj.value);
    },
    composeValue(item, index) {
      return {
        value: item.value,
        index,
      };
    },
    getStyle(item, num) {
      let background = "";
      let height = 0;
      switch (item.name) {
        case "工作":
          background = "#448EF5";
          break;
        case "娱乐":
          background = "#ffef67";
          break;
        case "空闲":
          background = "#ff6565";
          break;
        case "未知":
          background = "#3bc8f1";
          break;
        case "离线":
          background = "#73e8ed";
          break;
      }
      height = (item.value / num) * 100 + "%";
      return "height:" + height + ";background:" + background;
    },
    //获取可管理成员
    getSub() {
      this.loading = true;
      this.$http.get("/Person/GetPersonInfo.ashx").then((res) => {
        if (res.res == 0) {
          this.selMem = [];
          res.data.subUserIds.forEach((item) => {
            this.selMem.push({
              UId: item.UsId,
              UName: item.Name,
              Picture: item.Picture,
            });
          });
          this.getMemberData();
        }
      });
    },
    IsPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = new Array(
        "Android",
        "iPhone",
        "SymbianOS",
        "Windows Phone",
        "iPad",
        "iPod"
      );
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    toTask(item) {
      this.taskItem.JId = item.jid;
      this.taskItem.EId = item.eid;
      this.url = "/task/" + this.taskItem.EId + "/" + this.taskItem.JId;
      if (this.taskItem.JId && this.taskItem.EId) {
        this.$modal.show("taskDetail");
        // this.taskList[index].isRead = true
      }
    },
    // openTask(item){
    //
    // },
    toProject(item) {
      this.$route.params.eid = item.eid;
      this.$modal.show("projectDetail");
    },
    showTaskAct(item) {
      //获取任务动态
      this.activeId = item.wsInfo.id;
      this.activeTask = item.wsInfo.name;
      if (this.activeTask) {
        this.$modal.show("taskActivity");
      }
    },
    // 任务耗时占比
    drawWorkCostChart(data, index) {
      let option = {
        tooltip: {
          formatter: function (params) {
            if (params) {
              let str = "";
              str +=
                '<div style="with:200px;padding:1rem;font-size:14px;border-radius:4px">';
              params.data.name =
                params.data.name.length > 6
                  ? params.data.name.slice(0, 15)
                  : params.data.name;
              str +=
                "任务名：" +
                params.data.name +
                "<br/> 耗时：" +
                params.data.spent +
                "小时 <br/> 任务进度：" +
                params.data.progress +
                "% <br/> 上次提交简报时间：" +
                params.data.lastDate.timeFormat("yyyy/MM/dd");
              return str + "</div>";
            }
          },
        },
        legend: {
          orient: "vertical",
          top: "middle",
          right: 30,
          data: data.map((item) => {
            return item.name;
          }),
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: "98%",
            center: ["50%", "50%"],
            data: data,
            animation: false,
            itemStyle: {
              normal: {
                color: (params) => {
                  return this.colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: false,
            },
          },
        ],
      };

      this.$nextTick(() => {
        let chart = this.$echarts.init(
          document.getElementsByClassName("task-cost-chart")[index]
        );
        chart.setOption(option);
      });
    },
    drawCommonSoftwareChart(data, index) {
      let option = {
        tooltip: {
          formatter: function (params) {
            if (params) {
              let str = "";
              str +=
                '<div style="with:200px;padding:1rem;font-size:14px;border-radius:4px">';
              params.data.name =
                params.data.name.length > 6
                  ? params.data.name.slice(0, 15)
                  : params.data.name;
              return (
                str +
                "程序名：" +
                params.data.name +
                "<br/> 占比：" +
                params.value.toFixed(1) +
                "% </div>"
              );
            }
          },
        },
        legend: {
          orient: "vertical",
          top: "middle",
          right: 30,
          data: data.map((item) => {
            return item.name;
          }),
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: "98%",
            center: ["50%", "50%"],
            data: data,
            animation: false,
            itemStyle: {
              normal: {
                color: (params) => {
                  return this.colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: false,
            },
          },
        ],
      };
      this.$nextTick(() => {
        let chart = this.$echarts.init(
          document.getElementsByClassName("common-software-chart")[index]
        );
        chart.setOption(option);
      });
    },
    getScore(score) {
      let label = "未知";
      let color = "#BBB";
      let bg = "#fff";
      if (score == null) {
        return {
          label,
          color,
          score: "—",
          bg: "#f2f2f2",
        };
      }
      if (score >= 0 && score < 3) {
        label = "极差";
        color = "#ED4242";
        bg = "#FBD9D9";
      }
      if (score >= 3 && score < 5) {
        label = "较差";
        color = "#ED4242";
        bg = "#FBD9D9";
      }
      if (score >= 5 && score < 6.5) {
        label = "一般";
        color = "#FBB020";
        bg = "#fdf6ec";
      }
      if (score >= 6.5 && score < 8) {
        label = "正常";
        color = "#33DFB0";
        bg = "#E1FAF3";
      }
      if (score >= 8 && score < 9.5) {
        label = "优秀";
        color = "#448EF6";
        bg = "#E3EEFE";
      }
      if (score >= 9.5) {
        label = "完美";
        color = "#448EF6";
        bg = "#E3EEFE";
      }
      return {
        label,
        color,
        bg,
        score: score.toFixed(1),
      };
    },
    submitSearch() {
      this.loading = true;
      this.memberList = [];
      this.commandArr = [];
      this.pageData.p = 1;
      this.getMemberData();
    },
  },
  created() {
    let bool = this.IsPC();
    if (bool) {
      this.showLength = 13;
      this.pageData.c = 10;
    } else {
      this.showLength = 3;
      this.pageData.c = 4;
    }
  },
  mounted() {
    this.getSub();
    this.$nextTick(() => {
      const el = document.getElementById("member-overview-content");
      const offsetHeight = el.offsetHeight;
      el.onscroll = () => {
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        if (offsetHeight + scrollTop - scrollHeight >= -1) {
          // 需要执行的代码
          if (this.morePeople && !this.isLoading) {
            this.pageData.p++;
            this.getMemberData();
          }
        }
      };
    });
  },
};
</script>

<style lang="less" scoped="scoped">
/deep/.el-input__inner {
  border: none !important;
}

.empty-proccess-list {
  img {
    width: 245px;
    height: 245px;
    margin: 4rem auto;
    display: block;
  }

  p {
    font-size: 1.6rem;
    color: #6d6d6d;
    text-align: center;
  }
}

#member-overview {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

#member-overview-content {
  box-sizing: border-box;
  height: 100%;
  background: #fff;
  overflow-x: hidden;

  // overflow: auto;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .overview-content {
    padding: 0rem 2rem;
  }

  .select-conditions {
    display: flex;
    flex-direction: column;
    // margin-bottom: 1rem;
    // height: 8rem;

    .sel-item {
      display: flex;
      border-bottom: 1px solid #eee;
      align-items: center;
      height: 4rem;
      box-sizing: border-box;
      height: 6rem;

      span {
        color: #333;
        font-size: 1.4rem;
        font-weight: bold;
        margin-right: 0.5rem;
        flex: 0 0 40px;
      }

      /deep/#mem-public {
        border: none !important;

        .mem-add {
          display: none;
        }

        .c_button {
          display: flex;
          align-items: center;
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
        margin-left: 1rem;

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

      .btn {
        margin-left: 2rem;
      }
    }

    .sel-date {
      display: flex;

      /deep/.el-select {
        width: 10rem;

        /deep/.el-input__inner {
          border-radius: 4px 0 0 4px;
        }
      }

      /deep/.el-date-editor {
        /deep/.el-input__inner {
          border-radius: 0px 4px 4px 0px;
        }
      }
    }

    div:first-child {
      display: flex;
      // justify-content: flex-end;
      box-sizing: border-box;
    }
  }
}

// 内容部分
.member-content {
  flex: 1;
  // overflow: auto;

  .content-item {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #eee;
    padding: 0.5rem 1rem;

    .wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .member-label {
      display: flex;
      align-items: center;
      padding-left: 8rem;
      margin: 0.8rem 0;

      /deep/.el-tag {
        height: 2.5rem;
        border: none;
        background: #eee;
        // border-radius: 0;
        margin-right: 2rem;
        line-height: 2.5rem;
      }
    }

    h3 {
      font-size: 1.4rem;
      color: #333;
      font-weight: bold;
      margin-bottom: 1rem;

      i {
        font-size: 1.2rem;
        font-weight: normal;
        color: #409eff;
        margin-left: 0.5rem;
        cursor: pointer;
      }

      b {
        font-weight: normal;
        color: #333;
        font-size: 1.3rem;
        margin-left: 0.5rem;

        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
    }

    .content-item-left {
      // flex: 1;
      width: 75%;
      display: flex;
      box-sizing: border-box;
      // margin-right: 5rem;

      /deep/.el-tag {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      & > div:hover {
        .task {
          color: #409eff;
          cursor: pointer;
        }
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 0 0 6rem;
      margin-right: 2rem;

      img {
        width: 4.6rem;
        height: 4.6rem;
        border-radius: 50%;
        margin-bottom: 1rem;
      }

      span {
        font-size: 1.6rem;
        font-weight: bold;
        // color: #6D6D6D;
      }
    }

    .mobile-user-info {
      display: none;
    }

    .ratio-info {
      display: none;
    }

    .job-info-wrapper {
      display: flex;
      flex-direction: column;
      margin-right: 2rem;
      width: 20%;
    }

    .job-info {
      margin-bottom: 1rem;

      p {
        color: #333;
        font-size: 1.3rem;
        margin: 0.8rem 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .next-job-info {
      p {
        color: #333;
        font-size: 1.3rem;
        line-height: 1;
        margin-bottom: 0.8rem;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .task-dynamic {
      width: 35%;

      span {
        color: #6d6d6d;
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }

      ul {
        li {
          font-size: 1.3rem;
          line-height: 1.1;
          margin-bottom: 0.6rem;
          color: #333;

          .detail {
            display: flex;
            margin-bottom: 0.5rem;

            p {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 70%;
              margin-right: 1rem;

              &:hover {
                color: #409eff;
                cursor: pointer;
              }
            }

            i {
              color: #95de64;
            }
          }

          .time {
            color: #999;
            font-size: 1.3rem;
          }
        }

        li:last-child {
          margin-bottom: 0;
        }
      }
    }

    //任务耗时图表 常用程序
    .task-cost {
      margin-right: 2rem;
    }

    .task-cost-chart,
    .common-software-chart {
      width: 9rem;
      height: 9rem;
    }

    .content-item-right {
      display: flex;
      width: 25%;
      justify-content: flex-end;

      .work-ratio {
        margin-right: 2rem;
      }

      .work {
        margin-bottom: 0.5rem;
      }

      .score {
        .score-i {
          color: #6d6d6d;
          cursor: initial;
        }

        .unit {
          color: #6d6d6d;
          font-size: 1.3rem;
        }

        .main-score {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          p {
            font-size: 4.2rem;
            line-height: 4.2rem;
          }

          .unit {
            font-size: 1.8rem;
            line-height: 3rem;
          }
        }

        ul {
          li {
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 0.5rem;

            span {
              color: #4a4a4a;
            }

            .unit {
              margin-left: 1rem;
            }
          }
        }
      }

      .chart {
        height: 40px;
        display: flex;
        justify-content: flex-start;

        .bar-wrapper {
          width: 16px;
          height: 100%;
          display: flex;
          float: left;
          flex-direction: column;
          justify-content: flex-end;
          cursor: pointer;

          p {
            width: 16px;
            min-height: 3px;
            box-sizing: border-box;
            border-bottom: none;
          }
        }

        span:first-child {
          .bar-wrapper {
            p {
              background: rgb(68, 142, 245);
              border: 1px solid rgb(68, 142, 245);
              border-bottom: none;
            }

            &:hover {
              p {
                border: 1px solid #0000b9;
                border-bottom: none;
              }
            }
          }
        }

        span:nth-of-type(2) {
          .bar-wrapper {
            p {
              background: rgb(59, 200, 241);
              border: 1px solid rgb(59, 200, 241);
              border-bottom: none;
            }

            &:hover {
              p {
                border: 1px solid #00a4a4;
                border-bottom: none;
              }
            }
          }
        }

        span:nth-of-type(3) {
          .bar-wrapper {
            p {
              background: rgb(255, 239, 103);
              border: 1px solid rgb(255, 239, 103);
              border-bottom: none;
            }

            &:hover {
              p {
                border: 1px solid #dddd00;
                border-bottom: none;
              }
            }
          }
        }

        span:nth-of-type(4) {
          .bar-wrapper {
            p {
              background: rgb(255, 101, 101);
              border: 1px solid rgb(255, 101, 101);
              border-bottom: none;
            }

            &:hover {
              p {
                border: 1px solid #d50000;
                border-bottom: none;
              }
            }
          }
        }

        span:last-child {
          .bar-wrapper {
            p {
              background: rgb(115, 232, 237);
              border: 1px solid rgb(115, 232, 237);
              border-bottom: none;
            }

            &:hover {
              p {
                border: 1px solid #00c8c8;
                border-bottom: none;
              }
            }
          }
        }
      }
    }
  }
}

/deep/.ctn {
  height: calc(100% - 6rem);
}

// 进程说明
/deep/.ctn {
  height: calc(100% - 6rem);
}

/deep/.tit {
  & > div {
    border-bottom: 1px solid #eee;
  }
}

@media screen and (max-width: 1024px) {
  /deep/.location {
    max-height: 6rem;
    overflow: auto;
  }

  #member-overview-content {
    overflow-x: hidden;

    .overview-content {
      padding: 0 1rem;
    }
  }

  .member-content {
    .content-item {
      width: 100%;
      box-sizing: border-box;

      .wrapper {
        flex-direction: column;
      }

      // 左边
      .content-item-left {
        width: 100%;
        flex-direction: column;

        .user-info {
          display: none;
        }

        .mobile-user-info {
          display: flex;
          flex-direction: column;

          .info-wrapper {
            display: flex;
            justify-content: space-between;

            .user {
              display: flex;
              align-items: center;

              img {
                width: 4.6rem;
                height: 4.6rem;
                border-radius: 50%;
                margin-right: 2rem;
              }

              span {
                color: #4a4a4a;
                font-weight: bold;
                font-size: 1.6rem;
              }
            }

            .main-score {
              font-size: 3.5rem;
              display: flex;
              align-items: flex-end;

              p {
                line-height: 3.5rem;
              }

              .unit {
                font-size: 1.6rem;
                color: #6d6d6d;
                line-height: 3rem;
                margin-left: 0.5rem;
              }
            }
          }

          .score-wrapper {
            margin: 1rem 0;

            ul {
              display: flex;

              li {
                flex: 1;
                font-size: 1.4rem;
                display: flex;

                span {
                  margin-right: 0.5rem;
                }
              }

              li:nth-of-type(2) {
                justify-content: center;
              }

              li:last-child {
                justify-content: flex-end;
              }
            }
          }
        }

        .job-info-wrapper {
          width: 100%;
          margin-right: 0;
        }

        .task-dynamic {
          width: 100%;
          margin: 1rem 0;

          ul {
            li {
              .detail {
                p {
                  width: 100%;
                }
              }
            }
          }
        }

        .task-cost,
        .common-software {
          margin: 0;
          margin-top: 1rem;

          h3 {
            text-align: left !important;
          }

          & > div {
            width: 100%;
          }
        }
      }

      // 右边
      .content-item-right {
        // display: none;
        flex-direction: column;
        width: 100%;
        justify-content: flex-start;
        align-items: flex-start;

        .work-ratio {
          margin: 0;
          width: 100%;
        }

        .score {
          display: none;
        }

        .chart {
          height: 60px;
          justify-content: center;
        }

        .overwork {
          margin-bottom: 1rem;
        }
      }

      //标签
      .member-label {
        padding-left: 0;
        flex-wrap: wrap;

        /deep/.el-tag {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
