<!--
* @author: zxg
* @date: 2019-10-18 
* @description:
-->
<template>
  <div style="width: 100%; height: 100%;">
    <div
      class="handle_button"
      v-if="
        handleTaskStatus == 1 ||
          (handleTaskStatus == 2 &&
            quickAddTaskListData &&
            quickAddTaskListData.length > 0)
      "
    >
      <el-button
        type="primary"
        class="task_keep_button"
        plain
        @click="handleBatchKeep"
        >保存{{ handleTaskStatus == 1 ? "编辑" : "任务" }}</el-button
      >
      <el-button
        type="info"
        class="task_cancle_button"
        plain
        @click="handleBatchClose"
        >取消{{ handleTaskStatus == 1 ? "编辑" : "创建" }}</el-button
      >
    </div>
    <div
      ref="ritem"
      v-show="!childLoad"
      class="r-conent"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      infinite-scroll-distance="10"
    >
      <div class="insertBtn" v-if="showInsert">
        <el-button type="primary" v-show="!isInsert" @click="beforInsert"
          >调整任务顺序</el-button
        >
        <el-button
          type="primary"
          v-show="isInsert"
          @click="saveInsert"
          :loading="saveLoading"
          >保存</el-button
        >
        <el-button v-show="isInsert" @click="cancelInsert">取消</el-button>
      </div>
      <el-button
        type="primary"
        class="add_task"
        @click="addTask"
        v-if="page != 'approval' && page != 'quickview'"
        >创建任务</el-button
      >
      <!-- 关注的项目 -->
      <transition-group
        name="list-complete"
        type="transition"
        tag="ul"
        v-if="type === 'pro'"
      >
        <div
          class="briefing_item"
          v-for="(item, i) in childVaule"
          :key="i"
          @click.stop="openPro(item.id)"
          style="width: 49%"
          v-show="!item.show"
          :style="{ 'margin-left': (i + 1) % 2 == 0 ? '1rem' : '' }"
        >
          <div
            class="left_hr"
            :style="{ background: priorityBorderColor(item) }"
          ></div>
          <!-- 项目名  -->
          <div class="item_top">
            <div
              class="briefing_name"
              :style="{
                color:
                  item.Schedules != 7
                    ? 'rgba(74, 74, 74, 1)'
                    : 'rgba(204, 204, 204, 1)',
              }"
            >
              <!-- <span class="hiFont hi-task"></span> -->
              <p :title="item.name">{{ item.name }}</p>
            </div>
            <!-- 项目进度 -->
            <div class="top_progress pro-process">
              <el-progress
                title="项目进度"
                text-inside
                :stroke-width="20"
                :percentage="
                  item.Process < 0 ? 0 : item.Process > 100 ? 100 : item.Process
                "
              ></el-progress>
            </div>
          </div>
          <div class="item_bottom">
            <div class="item_div_left">
              <!-- 项目执行人 -->
              <div class="item_div task_user">
                <i
                  v-if="item.FrontmanID == null"
                  class="hiFont hi-user-task"
                ></i>
                <img v-else v-lazy="$url + item.Picture" />
                <p class="task_p">负责人：{{ item.Frontman || "暂无" }}</p>
              </div>
              <!-- 项目状态 -->
              <div class="item_div" style="margin-right: 1rem">
                <p
                  :class="[
                    'hiFont',
                    $D.ITEM('pro_status', item.Schedules).icon,
                  ]"
                  :style="{
                    color: $D.ITEM('pro_status', item.Schedules).color,
                  }"
                ></p>
                <p class="task_p">
                  {{ $D.ITEM("pro_status", item.Schedules).name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <draggable
        class="c-scroll"
        v-model="childVaule"
        :options="dragOptions"
        v-else
      >
        <transition-group
          name="list-complete"
          type="transition"
          tag="ul"
          v-if="handleTaskStatus != 1"
        >
          <!-- 快速创建任务列表 -->
          <div
            class="briefing_item add_briefing_item"
            :class="{ 'move-task': isInsert }"
            v-for="(quickitem, i) in quickAddTaskListData"
            :key="'index-' + i"
          >
            <!-- 任务名和耗时  -->
            <div class="item_top edit_top">
              <div
                class="briefing_name"
                :style="{
                  color:
                    quickitem.Schedules != 7
                      ? 'rgba(74, 74, 74, 1)'
                      : 'rgba(204, 204, 204, 1)',
                }"
              >
                <span class="hiFont hi-task"></span>
                <el-input
                  class="task_name"
                  v-model="quickitem.name"
                  placeholder="请输入任务名"
                ></el-input>
              </div>
              <div class="time_tip close_icon">
                <i
                  class="hiFont hi-close-thin"
                  @click="handleCloseQuick(i)"
                ></i>
              </div>
            </div>
            <div class="edit_bottom">
              <!-- 执行人 -->
              <div class="edit_task_user" style="width: 25%">
                <p class="task_p">执行者：</p>
                <mb
                  :isSelection="false"
                  :showActive="false"
                  :arrays="quickitem.user"
                  @Confirm="changPro"
                  :userRoleItem="{ index: i }"
                  @getUser="getQuickitem"
                >
                  <div slot="button">
                    <div v-if="!quickitem.user[0]" class="mem-add">
                      <i class="el-icon-plus"></i>
                    </div>
                    <div v-else style="display: flex; cursor: pointer">
                      <img
                        class="user-img"
                        v-lazy="$url + quickitem.user[0].Picture"
                      />
                      <p class="ttr-name">{{ quickitem.user[0].UName }}</p>
                    </div>
                  </div>
                </mb>
              </div>
              <!-- <div class="task_schedules">
                <span class="hidden-phone">任务状态:</span>
                <el-select v-model="quickitem.Schedules" placeholder="请选择">
                  <el-option
                    v-for="task in $D.LIST('task_status')"
                    :key="task.key"
                    :value="task.value"
                    :label="task.name"
                  >
                    <span>
                      <i :class="['hiFont', task.icon]" :style="{ color: task.color }"></i>
                      {{ task.name }}
                    </span>
                  </el-option>
                </el-select>
              </div>-->
              <div class="time_consuming">
                <span>预计耗时:</span>
                <el-input
                  class="consuming_input"
                  v-model="quickitem.EstimatedTime"
                  placeholder="预计耗时"
                ></el-input>
              </div>
              <!-- 时间 -->
              <div class="add_task_time">
                <span>任务期限:</span>
                <el-date-picker
                  v-model="quickitem.value"
                  :key="quickitem.value[0]"
                  type="daterange"
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  start-placeholder="任务开始日期"
                  end-placeholder="任务结束日期"
                  @blur="searchDate(i)"
                ></el-date-picker>
              </div>
            </div>
            <div
              class="task_describe"
              v-if="!quickitem.isTaskDescribe"
              @click="handleShowDescribeQuickTask(i, 1)"
            >
              <i class="el-icon-s-operation"></i>
              <span>任务描述</span>
            </div>
            <div class="describe" v-else>
              <span class="describe_title">
                <label
                  class="describe_cur"
                  @click="handleShowDescribeQuickTask(i, 0)"
                >
                  <i class="el-icon-s-operation"></i>
                  <span>任务描述：</span>
                </label>
              </span>
              <xfroala
                v-model="quickitem.Casts"
                placeholder="请输入任务的具体内容"
                class="xfroala"
              ></xfroala>
            </div>
          </div>
          <!-- 任务列表 -->
          <div
            class="briefing_item"
            :class="{ 'move-task': isInsert }"
            v-for="(item, i) in childVaule"
            :key="i"
            v-show="!item.show & !item.insert"
            @click.stop="detail(item, i)"
          >
            <!-- 优先级  -->
            <div
              class="left_hr"
              :style="{ background: priorityBorderColor(item) }"
            ></div>
            <!-- 任务名和耗时  -->
            <div class="item_top">
              <div
                class="briefing_name"
                :style="{
                  color:
                    item.Schedules != 7
                      ? 'rgba(74, 74, 74, 1)'
                      : 'rgba(204, 204, 204, 1)',
                }"
              >
                <span class="hiFont hi-task"></span>
                <span class="children-job" v-if="item.IsChirenjob">子</span>
                <span class="children-job" v-else-if="item.IsFjob">父</span>
                <span class="kpi-job" v-if="item.associatedKPI">KPI</span>
                <p :title="item.name">{{ item.name }}</p>
              </div>
              <!-- 进度 -->
              <div class="top_progress">
                <el-progress
                  title="进度"
                  :color="
                    item.process == 100 && item.Schedules != 7
                      ? '#F56C6C'
                      : 'rgba(68, 142, 245, 1)'
                  "
                  text-inside
                  :stroke-width="20"
                  :percentage="
                    item.process < 0
                      ? 0
                      : item.process > 100
                      ? 100
                      : item.process
                  "
                ></el-progress>
              </div>
              <div class="time_tip">
                <span class="hidden-phone">预计</span>
                <span
                  >耗时{{ type }}
                  {{
                    !item.EstimatedTime || item.EstimatedTime < 0
                      ? "未知"
                      : `${item.EstimatedTime}小时`
                  }}</span
                >
              </div>
            </div>
            <div class="item_bottom">
              <div class="item_div_left">
                <!-- 执行人 -->
                <div class="item_div task_user">
                  <i
                    v-if="item.FrontmanID == null"
                    class="hiFont hi-user-task"
                  ></i>
                  <img v-else v-lazy="$url + item.Picture" />
                  <p class="task_p">执行者：{{ item.Frontman || "暂无" }}</p>
                </div>
                <!-- 任务状态 -->
                <div class="item_div tsak_schedules">
                  <p
                    :class="[
                      'hiFont',
                      $D.ITEM('task_status', item.Schedules).icon,
                    ]"
                    :style="{
                      color: $D.ITEM('task_status', item.Schedules).color,
                    }"
                  ></p>
                  <p class="task_p">
                    {{ $D.ITEM("task_status", item.Schedules).name }}
                  </p>
                </div>
              </div>
              <div class="item_div_right">
                <!-- 时间 -->
                <div class="item_div task_time">
                  <p class="task_p task_time_bg">
                    {{ item.StartTimes | formatDate(item.PridictionTimes) }}
                  </p>
                  <p
                    class="task_p task_time_bg must_overtime"
                    v-if="item.isMustOverTime"
                  >
                    必须加班
                  </p>
                  <p
                    class="task_p task_time_bg refund"
                    v-if="item.jobType == 3"
                  >
                    退款
                  </p>
                  <p
                    class="task_p task_time_bg collection"
                    v-if="item.jobType == 2"
                  >
                    收款
                  </p>
                  <p class="task_p task_time_bg" v-if="item.Tabs != ''">
                    {{ item.Tabs | formattabnames }}
                  </p>
                  <!-- <p class="task_p bp_bg hidden-xs-only" @click.stop="addLabel()">添加标签</p> -->
                </div>
                <!-- 耗时进度 -->
                <div class="item_div task_progres">
                  <el-progress
                    title="耗时进度"
                    color="rgba(19, 194, 194, 1)"
                    text-inside
                    :stroke-width="20"
                    :percentage="
                      item.spendTime < 0
                        ? 0
                        : item.spendTime > 100
                        ? 100
                        : item.spendTime
                    "
                  ></el-progress>
                </div>
                <!-- 操作 -->
                <div class="item_div task_edit" v-show="!isInsert">
                  <label v-if="page != 'approval'">
                    <span
                      title="添加审核节点"
                      @click.stop="verifyAdd(item)"
                      v-if="isProLeader"
                    >
                      <i class="hiFont hi-shenhe7"></i>
                    </span>
                    <span
                      title="编辑任务"
                      @click.stop="editTask(item)"
                      v-if="item.IsEdit"
                    >
                      <i class="hiFont hi-edit"></i>
                    </span>
                    <span title="移动任务" @click.stop="moveTask(item)">
                      <i class="hiFont hi-move"></i>
                    </span>
                    <span title="删除任务" @click.stop="deleteTask(item.id, i)">
                      <i class="hiFont hi-delete"></i>
                    </span>
                    <span
                      v-if="showStar"
                      title="取消关注"
                      @click.stop="cancelStar(item.id, i)"
                    >
                      <i class="hiFont hi-star-in" style="color: #ffde34"></i>
                    </span>
                  </label>
                </div>
                <div class="item_div task_edit" v-show="isInsert">
                  <span @click="top(i)" v-if="i != 0">
                    <i class="hiFont hi-to-top"></i>
                    置顶
                  </span>
                  <span @click="bottom(i)" v-if="i != childVaule.length - 1">
                    <i class="hiFont hi-to-bottom"></i>
                    置底
                  </span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
        <transition-group
          name="list-com mplete"
          type="transition"
          tag="ul"
          v-else
        >
          <div
            class="briefing_item add_briefing_item"
            :class="{ 'move-task': isInsert }"
            v-for="(item, i) in editListData"
            :key="item.id"
          >
            <!-- 任务名和耗时  -->
            <div class="item_top edit_top">
              <div
                class="briefing_name"
                :style="{
                  color:
                    item.Schedules != 7
                      ? 'rgba(74, 74, 74, 1)'
                      : 'rgba(204, 204, 204, 1)',
                }"
              >
                <span class="hiFont hi-task"></span>
                <span class="children-job" v-if="item.IsChirenjob">子</span>
                <span class="children-job" v-else-if="item.IsFjob">父</span>
                <span class="kpi-job" v-if="item.associatedKPI">KPI</span>
                <el-input
                  class="task_name"
                  v-model="item.name"
                  placeholder="请输入任务名"
                ></el-input>
              </div>
              <!-- 任务状态 -->
              <!-- <div class="time_tip">
                <el-select v-model="item.Schedules" placeholder="请选择">
                  <el-option
                    v-for="task in $D.LIST('task_status')"
                    :key="task.key"
                    :value="task.value"
                    :label="task.name"
                  >
                    <span>
                      <i :class="['hiFont', task.icon]" :style="{ color: task.color }"></i>
                      {{ task.name }}
                    </span>
                  </el-option>
                </el-select>
              </div>-->
            </div>
            <div :class="!item.See ? 'edit_bottom see_bottom' : 'edit_bottom'">
              <!-- 执行人 -->
              <div class="edit_task_user">
                <i
                  v-if="item.FrontmanID == null"
                  class="hiFont hi-user-task"
                ></i>
                <img v-else v-lazy="$url + item.Picture" />
                <p class="task_p">执行者：{{ item.Frontman || "暂无" }}</p>
              </div>
              <div class="time_consuming estimated_time">
                <span>预计耗时:</span>
                <el-input
                  :disabled="
                    item.IsFjob || item.isEditEstimatedTime ? true : false
                  "
                  class="consuming_input"
                  v-model="item.EstimatedTime"
                  placeholder="预计耗时"
                ></el-input>
              </div>
              <div class="time_consuming" v-if="item.See">
                <span class="hidden-phone">标准预计耗时:</span>
                <el-input
                  :disabled="item.IsFjob ? true : false"
                  class="consuming_input"
                  v-model="item.StandardEstimateTime"
                  placeholder="标准预计耗时"
                ></el-input>
              </div>
              <!-- 时间 -->
              <div class="edit_task_time edit_time_row">
                <el-date-picker
                  :disabled="item.value[0] ? true : false"
                  v-model="item.StartTimes"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="任务开始日期"
                  @change="
                    editChangeTime(item.StartTimes, item.PridictionTimes, i, 1)
                  "
                ></el-date-picker>
                <span class="time_line">至</span>
                <el-date-picker
                  :disabled="item.value[1] ? true : false"
                  v-model="item.PridictionTimes"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="任务结束日期"
                  @change="
                    editChangeTime(item.StartTimes, item.PridictionTimes, i, 2)
                  "
                ></el-date-picker>
              </div>
            </div>
            <div
              class="task_describe"
              v-if="!item.isTaskDescribe"
              @click="handleShowDescribe(i, 1)"
            >
              <i class="el-icon-s-operation"></i>
              <span>任务描述</span>
            </div>
            <div class="describe" v-else>
              <span class="describe_title">
                <label class="describe_cur" @click="handleShowDescribe(i, 0)">
                  <i class="el-icon-s-operation"></i>
                  <span>任务描述：</span>
                </label>
              </span>
              <xfroala
                v-model="item.Casts"
                placeholder="请输入任务的具体内容"
                class="xfroala"
              ></xfroala>
            </div>
          </div>
        </transition-group>
      </draggable>
      <div
        v-if="
          (handleTaskStatus != 1 && data.length > 0) ||
            (handleTaskStatus == 1 && editListData.length > 0)
        "
        class="load-status"
      >
        <div class="g-loading" v-if="isLoading">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div class="g-loaded" v-if="noMore">已全部加载</div>
      </div>
      <div v-else class="empty_task">
        <div>
          <img src="../../assets/img/emptyTask.png" />
          <p class="tip_text">
            暂无{{ handleTaskStatus == 1 ? "编辑" : ""
            }}{{ type === "pro" ? "项目" : "任务" }}
          </p>
        </div>
      </div>
      <el-backtop target=".r-conent">
        <div class="quickBox" style="bottom: 0.5rem">
          <i class="el-icon-caret-top" style="font-size: 3rem"></i>
        </div>
      </el-backtop>
      <TaskDetail
        @loadSuccess="xmodalLoaded"
        ref="detail"
        v-model="jobid"
        :type="1"
        :url="detailUrl"
        :referer="detailReferer"
        @updated="detailUpdated"
        @handleBeforInit="$emit('successApply')"
        @successHandle="$emit('successHandle')"
        :page="page"
      ></TaskDetail>
      <EditTask :editId="editData" @updated="$emit('refresh')"></EditTask>
    </div>
    <div
      v-show="childLoad"
      class="r-conent"
      style="height: 100%"
      v-loading="childLoad"
      element-loading-text="任务加载中"
    ></div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: [
    "data",
    "page",
    "childLoad",
    "isLoading",
    "noMore",
    "type",
    "showInsert",
    "quickAddTaskListData",
    "handleTaskStatusData",
  ],
  model: {
    prop: "data",
    event: "upItem",
  },
  watch: {
    data: function(newval, oldval) {
      this.oldChildVaule = JSON.parse(JSON.stringify(newval));
      this.childVaule = newval;
    },
    childVaule: function(newval) {
      this.$emit("upItem", newval);
      //当列表数据改变且为编辑状态，更新编辑列表数据
      if (this.handleTaskStatus == 1) {
        this.editListData = this.childVaule.filter((s) => s.IsEdit);
        if (this.editListData.length > 0) {
          this.editListData.forEach((element) => {
            element.isTaskDescribe = false;
            element.isEditEstimatedTime = element.EstimatedTime;
            element.value = [];
            if (element.StartTimes) {
              element.value[0] = element.StartTimes;
            } else {
              element.value[0] = "";
            }
            if (element.EndTimes) {
              element.PridictionTimes = element.EndTimes;
              element.value[1] = element.EndTimes;
            } else {
              element.value[1] = "";
            }
          });
        }
      }
    },
    handleTaskStatus() {
      //当为编辑状态，更新编辑列表数据
      if (this.handleTaskStatus == 1) {
        this.editListData = this.childVaule.filter((s) => s.IsEdit);
        if (this.editListData.length > 0) {
          this.editListData.forEach((element) => {
            element.isTaskDescribe = false;
            element.isEditEstimatedTime = element.EstimatedTime;
            element.value = [];
            if (element.StartTimes) {
              element.value[0] = element.StartTimes;
            } else {
              element.value[0] = "";
            }
            if (element.EndTimes) {
              element.PridictionTimes = element.EndTimes;
              element.value[1] = element.EndTimes;
            } else {
              element.value[1] = "";
            }
          });
        }
      }
    },
  },
  components: {
    TaskDetail: () => import("./taskDetail"),
    EditTask: () => import("./editTask"),
    draggable: () => import("vuedraggable"),
    xfroala: () => import("@/components/XFroala"),
    mb: () => import("@/components/Selectors/MemberSelect"),
  },
  data() {
    return {
      jobid: NaN, //任务ID
      jobClass: null, //任务分类ID
      currentIndex: NaN, //当前选中的任务ID
      detailUrl: "",
      detailReferer: "",
      childVaule: this.data, //v-model 绑定值
      isInsert: false, //插入模式
      tempData: null,
      saveLoading: false,
      isHistory: false,
      editData: null, //编辑数据
      jobCast: null,
      editListData: [],
      isTaskDescribe: false, //编辑状态是否显示任务描述
      value: "",
      selQuickTaskUser: null,
      isPost: true,
      oldChildVaule: null,
      isProLeader: null, //是否是领导
    };
  },
  computed: {
    ...mapState(["user"]),
    handleTaskStatus() {
      return this.handleTaskStatusData;
    },
    //禁用加载，没有了或者正在请求接口
    disabled() {
      return this.isLoading || this.noMore;
    },
    showStar() {
      return this.$route.fullPath === "/quickview/-2";
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: !this.isInsert,
        ghostClass: "ghost",
      };
    },
  },
  created() {
    this.isProLeader = this.$store.state.isProLeader;
  },
  methods: {
    ...mapActions(["task_addId", "task_setIndex"]),
    beforInsert() {
      this.tempData = JSON.parse(JSON.stringify(this.childVaule));
      this.isInsert = true;
    },

    /**
     * 批量编辑任务时间验证
     * start任务开始时间，end任务结束时间，index改变的列表index，type类型（1更改开始时间，2更改结束时间）
     */
    editChangeTime(start, end, index, type) {
      if (start > end) {
        if (type == 1) {
          this.$message.error("开始时间不能大于结束时间");
          this.editListData[index].StartTimes = null;
        } else {
          this.$message.error("结束时间不能小于开始时间");
          this.editListData[index].PridictionTimes = null;
        }
        this.editListData.splice(index, 1, this.editListData[index]);
      }
    },

    /**
     * 批量保存
     */
    handleBatchKeep() {
      if (this.handleTaskStatus == 1) {
        this.handleKeepEdit(0);
      } else if (this.handleTaskStatus == 2) {
        this.handleKeepEdit(1);
      }
    },
    /**
     * 取消批量
     */
    handleBatchClose() {
      this.$emit("closeHandle");
      this.childVaule = this.oldChildVaule;
    },
    /**
     * 编辑任务描述显示
     */
    handleShowDescribe(i, type) {
      if (type === 0) {
        this.editListData[i].isTaskDescribe = false;
      } else {
        this.editListData[i].isTaskDescribe = true;
      }
      this.editListData.splice(i, 1, this.editListData[i]);
    },
    /**
     * 快速创建任务描述显示
     */
    handleShowDescribeQuickTask(i, type) {
      if (type === 0) {
        this.quickAddTaskListData[i].isTaskDescribe = false;
      } else {
        this.quickAddTaskListData[i].isTaskDescribe = true;
      }
      this.quickAddTaskListData.splice(i, 1, this.quickAddTaskListData[i]);
    },
    /**
     * 任务开始结束日期选择
     */
    searchDate(i) {
      this.editListData[i].StartTimes = this.editListData[i].value[0];
      this.editListData[i].PridictionTimes = this.editListData[i].value[1];
      this.editListData.splice(i, 1, this.editListData[i]);
    },
    /**
     * 快速创建的任务时删除某一个正在创建的任务
     */
    handleCloseQuick(i) {
      this.$emit("cancelQuickTask", i);
    },
    /**
     * 快速创建任务，执行人选择
     */
    changPro(value) {
      const index = this.selQuickTaskUser.index;
      this.quickAddTaskListData[index].user = [];
      this.quickAddTaskListData[index].user.push(...value);
    },
    getQuickitem(value) {
      this.selQuickTaskUser = value;
    },
    /**
     * 定位到
     */
    scrollTop(distance) {
      this.$refs.ritem.scroll({
        top: distance,
        behavior: "smooth",
      });
    },
    /**
     * 编辑任务提交
     */
    handleKeepEdit(type) {
      const form = [];
      const data = type === 0 ? this.editListData : this.quickAddTaskListData;
      this.isPost = true;
      data.forEach((item, index) => {
        if (!item.name) {
          this.isPost = false;
          return;
        }
        form.push({
          JId: type === 0 ? item.id : null,
          Name: item.name,
          Casts: item.Casts,
          Schedule: item.Schedules || item.Schedules == 0 ? item.Schedules : 1,
          EventId: this.$route.params.eid,
          StartTime: type === 0 ? item.StartTimes : item.value[0],
          PridictionTime: type === 0 ? item.PridictionTimes : item.value[1],
          EstimatedTime: type === 0 && item.IsFjob ? null : item.EstimatedTime,
          FrontmanId:
            type === 0
              ? item.FrontmanID
              : item.user[0]
              ? item.user[0].UId
              : null,
          StandardEstimateTime:
            item.IsFjob || type === 1 ? null : item.StandardEstimateTime,
        });
      });
      if (this.isPost) {
        this.$emit("handleClearData", true);
        this.$http
          .post("/Project/SaveJobList.ashx", {
            data: form,
          })
          .then((resp) => {
            if (resp.res == 0) {
              this.$message({
                message: `${type === 0 ? "编辑" : "保存"}成功`,
                type: "success",
              });
            }
            this.$emit("closeHandle");
            this.$emit("updateEditAndQuick");
          });
      } else {
        this.$emit("handleClearData", false);
        this.$notify({
          type: "info",
          message: "请完善任务名",
        });
        return;
      }
    },
    //保存顺序
    saveInsert() {
      const nowArr = this.childVaule.map((item) => item.id);
      const oldArr = this.tempData.map((item) => item.id);
      let flag = false;
      for (let i = 0; i < oldArr.length && !flag; i++) {
        if (oldArr[i] != nowArr[i]) {
          flag = true;
        }
      }
      if (flag) {
        let params = {
          u: this.childVaule[0].FrontmanID,
          s: nowArr,
        };
        this.saveLoading = true;
        this.$http
          .post("/Project/Job/SetJobSequences.ashx", params)
          .then((resp) => {
            if (resp.res == 0) {
              this.isInsert = false;
              this.$notify({
                type: "success",
                message: "保存成功",
              });
            }
            this.saveLoading = false;
          })
          .catch((err) => {
            this.saveLoading = false;
          });
      } else {
        this.isInsert = false;
      }
    },
    //取消插入
    cancelInsert() {
      this.childVaule = JSON.parse(JSON.stringify(this.tempData));
      this.isInsert = false;
    },
    //置顶
    top(taskIndex) {
      this.childVaule.unshift(this.childVaule.splice(taskIndex, 1)[0]);
    },
    //置底
    bottom(taskIndex) {
      this.childVaule.push(this.childVaule.splice(taskIndex, 1)[0]);
    },
    //懒加载
    load() {
      if (!this.noMore) {
        this.$emit("loadData");
      }
    },
    //优先级颜色
    priorityBorderColor(item) {
      if (item.Schedules == 7) {
        return this.$D.ITEM("g_priority", 1).color[0];
      }
      return this.$D.ITEM("g_priority", item.Firs ? item.Firs : 1).color[0];
    },
    //项目
    openPro(eid) {
      this.$router.push({
        name: "task",
        params: {
          eid: eid,
        },
      });
    },
    //查看任务详情
    detail(item, index, isHistory = true) {
      if (!this.isInsert) {
        this.common(item, index);
        this.detailUrl = `/task/${item.eid}/${this.jobid}`;
        if (this.page == "approval") {
          this.detailReferer = `/${this.page}`;
        } else {
          this.detailReferer = `/${this.page}/${this.$route.params.eid}`;
        }
        this.$modal.show("taskDetail");
        this.isHistory = isHistory;
        //添加历史
        this.task_addId(item.id);
        this.task_setIndex(0);
        this.$emit("getProEidData", item.eid);
      }
    },
    /*
     * 打开审核节点
     */
    verifyAdd(item) {
      this.$emit("routItem", item);
    },

    //编辑任务
    editTask(item) {
      this.editData = item.id;
      this.$modal.show("editTask");
    },

    //移动任务
    moveTask(item) {
      this.$refs.detail.showMoveTask(
        item.id,
        item.IsChirenjob,
        item.eid,
        item.jobClassID
      );
    },
    common(item, index) {
      this.jobid = item.id;
      this.currentIndex = index;
      this.$emit("upIndex", index);
    },
    cancelStar(tid, index) {
      //访问接口
      this.$http
        .post("/Project/taskExtend.ashx", {
          jobid: tid,
          typeId: 6,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.$set(this.childVaule[index], "show", true);
            this.$notify({
              message: "已取消关注",
              type: "success",
            });
            if (this.page == "quickview") {
              this.$emit("upData", true);
            }
          }
        });
    },
    //删除任务
    deleteTask(tid, index) {
      this.$confirm("确认删除此任务？", "提示", {
        type: "warning",
      }).then(() => {
        this.$http
          .post("/Project/taskExtend.ashx", {
            jobid: tid,
            typeId: 5,
          })
          .then((resp) => {
            if (resp.res == 0) {
              this.$set(this.childVaule[index], "show", true);
              this.$notify({
                type: "success",
                message: "删除成功",
              });
              // if (this.page == "quickview") {
              this.$emit("upData", true);
              // }
            }
          });
      });
    },
    //创建任务
    addTask() {
      this.$modal.show("addTask");
    },
    //添加标签
    addLabel() {},

    //更新任务列表
    detailUpdated(data, flag) {
      if (flag) {
        this.$set(this.childVaule[this.currentIndex], "show", true);
      } else {
        if (this.isHistory) {
          this.$emit("upData", 2);
        }
      }
    },
    xmodalLoaded() {
      if (this.page == "task" && this.$route.params.jid) {
        this.jobid = parseInt(this.$route.params.jid);
        this.detailUrl = `/task/${this.$route.params.eid}/${this.jobid}`;
        if (this.page == "approval") {
          this.detailReferer = `/${this.page}`;
        } else {
          this.detailReferer = `/${this.page}/${this.$route.params.eid}`;
        }
        this.$modal.show("taskDetail");
        const params = this.$route.query;
        if (params.open) {
          this.$refs.detail.open(params.open);
        }
        //添加历史
        this.task_addId(this.jobid);
        this.task_setIndex(0);
      }
    },
  },
  filters: {
    //格式化时间
    formatDate(startTime, endTime) {
      const year = new Date().getFullYear();
      if (startTime && endTime) {
        if (
          new Date(endTime).getFullYear() - new Date(startTime).getFullYear() >=
          1
        ) {
          return `${startTime.timeFormat("yyyy年M月d日")}-${endTime.timeFormat(
            "yyyy年M月d日"
          )}`;
        } else {
          return `${startTime.timeFormat("M月d日")}-${endTime.timeFormat(
            "M月d日"
          )}`;
        }
      } else if (startTime) {
        if (Math.abs(year - new Date(startTime).getFullYear()) >= 1) {
          return startTime.timeFormat("开始于 yyyy年M月d日");
        } else {
          return startTime.timeFormat("开始于 M月d日");
        }
      } else if (endTime) {
        if (Math.abs(year - new Date(endTime).getFullYear()) >= 1) {
          return endTime.timeFormat("预计 yyyy年M月d日");
        } else {
          return endTime.timeFormat("预计 M月d日");
        }
      }
      return "暂无时间";
    },
    //格式化标签
    formattabnames(val) {
      if (val == "" || val == null) {
        return "";
      }
      if (val.length > 1) {
        return val[0].tabname + "...";
      } else {
        return val[0].tabname;
      }
    },
  },
};
</script>
<style lang="less">
.task_keep_button.is-plain {
  background: #dbecff;
}

.task_cancle_button.is-plain {
  background: #e5e5e6;
}
</style>
<style lang="less" scoped>
.list-complete-enter {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}

.list-complete-leave-to {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.list-complete-leave-active {
  transition-duration: 0.3s !important;
}

.handle_button {
  display: flex;
  flex-direction: row;
  margin-bottom: 0.8rem;

  button {
    width: 50%;
  }

  .task_cancle_button {
  }
}

.r-conent {
  width: 100%;
  padding-right: 0.2rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  box-sizing: border-box;
  position: relative;

  .insertBtn {
    display: flex;
    justify-content: center;

    .el-button {
      width: 100%;
    }

    margin-bottom: 1rem;
  }

  //选择除第一个子元素
  .briefing_item + .briefing_item {
    margin-top: 1rem;
  }

  .el-backtop {
    right: initial !important;
    bottom: initial !important;
  }

  .move-task {
    cursor: move !important;

    &:hover {
      box-shadow: none !important;
    }
  }

  .add_task {
    display: none;
  }

  .add_briefing_item {
    cursor: default !important;
  }

  //单个任务
  .briefing_item {
    padding-right: 0.6rem;
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    position: relative;
    background: rgba(255, 255, 255, 1);
    cursor: pointer;
    user-select: none;
    transition: box-shadow 0.5s ease, transform 1s, opacity 1s;

    //任务hover效果
    &:hover {
      box-shadow: 0px 2px 10px 0px rgba(225, 224, 224, 0.6);
    }

    //优先级
    .left_hr {
      position: absolute;
      left: 0;
      width: 0.5rem;
      height: 100%;
      border-radius: 6px 0px 0px 6px;
    }

    //任务名 耗时
    .item_top {
      margin: 0.8rem 0.5rem 0 1rem;
      display: flex;
      justify-content: space-between;

      .briefing_name {
        box-sizing: border-box;
        width: 62%;
        font-size: 1.6rem;
        font-weight: 600;
        display: flex;

        .hiFont {
          font-size: 2.2rem;
        }

        .children-job {
          color: #bbb;
          background: #f2f2f2;
          width: 23px;
          height: 23px;
          text-align: center;
          line-height: 23px;
          border-radius: 5px;
          font-size: 1.4rem;
        }

        .kpi-job {
          width: 23px;
          height: 23px;
          text-align: center;
          line-height: 26px;
          border-radius: 5px;
          font-size: 1.2rem;
          color: #409eff;
          background: #ecf5ff;
          // font-weight: normal;
        }

        span {
          margin-right: 0.5rem;
        }

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .top_progress {
        width: 13rem;

        div {
          width: 100%;
        }
      }

      //耗时
      .time_tip {
        color: rgba(155, 155, 155, 1);
        width: 11.5rem;
        text-align: right;
      }

      .close_icon {
        padding-right: 0.8rem;

        .hi-close-thin {
          font-size: 1.2rem;
          color: #969696;
          cursor: pointer;
        }
      }
    }

    .edit_top {
      display: flex;
      align-items: center;

      .briefing_name {
        display: flex;
        align-items: center;

        .task_name {
          /deep/ input {
            background: none !important;
          }
        }
      }
    }

    //执行人 时间 操作
    .item_bottom {
      display: flex;
      margin-bottom: 0.45rem;

      //公共
      .item_div_left,
      .item_div_right {
        display: flex;
        justify-content: space-between;
        flex: 1;

        .item_div {
          display: flex;
          align-items: center;
        }

        .task_p {
          color: rgba(109, 109, 109, 1);
          font-size: 1.2rem;
          margin-left: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      //左
      .item_div_left {
        margin-left: 1.2rem;
        flex: 3;

        //执行人
        .task_user {
          img {
            height: 3.2rem;
            width: 3.2rem;
            border-radius: 50%;
          }

          .hi-user-task {
            width: 3rem;
            height: 3rem;
            background: #f4f4f4;
            box-sizing: border-box;
            font-size: 1.7rem;
            color: #9b9b9b;
            border: 0px solid #fff;
            border-radius: 50%;
            text-align: center;
            line-height: 3rem;
          }
        }

        //状态
        .tsak_schedules {
          margin-right: 5%;
        }
      }

      .item_div_right {
        flex: 7;

        //时间和标签
        .task_time {
          width: 48%;
          display: flex;
          justify-content: center;

          .task_time_bg {
            background: rgba(242, 242, 242, 1);
            padding: 1px 0.5rem 1px 0.5rem;
            height: 2.5rem;
            line-height: 2.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .must_overtime {
            color: #008fd0;
          }

          .refund {
            color: #b27cf1;
          }

          .collection {
            color: #fea940;
          }
        }

        .task_progres {
          width: 13rem;

          div {
            width: 100%;
          }

          /deep/.el-progress-bar__inner {
            max-width: 100% !important;
          }
        }

        //操作
        .task_edit {
          width: 14rem;
          justify-content: flex-end;

          .task_isorder {
            color: #409eff;
          }

          span {
            cursor: pointer;
            color: rgba(187, 187, 187, 1);
            font-size: 1.6rem;
            margin: 0.8rem 0.3rem 0.8rem 0.8rem;

            i {
              font-size: 2rem;
            }
          }
        }
      }
    }

    .see_bottom {
      justify-content: space-around;
    }

    .edit_bottom {
      padding: 0.3rem 0.5rem;
      margin-top: 1rem;
      display: flex;
      align-items: center;

      .time_consuming {
        width: 25%;
        font-size: 1.3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 1rem;

        .consuming_input {
          width: 50%;

          /deep/ input {
            background: none !important;
          }
        }
      }

      .task_schedules {
        width: 25%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 1rem;
        font-size: 1.3rem;

        .el-select {
          width: 60%;
        }
      }

      .estimated_time {
        width: 20%;
      }

      //执行人
      .edit_task_user {
        width: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;

        img {
          height: 3.2rem;
          width: 3.2rem;
          border-radius: 50%;
        }

        .hi-user-task {
          width: 3rem;
          height: 3rem;
          background: #f4f4f4;
          box-sizing: border-box;
          font-size: 1.7rem;
          color: #9b9b9b;
          border: 0px solid #fff;
          border-radius: 50%;
          text-align: center;
          line-height: 3rem;
        }

        .task_p {
          font-size: 1.3rem;
          margin-left: 0.5rem;
        }
      }

      .edit_task_time {
        width: 33%;

        .el-range-editor.el-input__inner {
          width: 100%;
        }
      }

      .add_task_time {
        width: 45%;
        font-size: 1.3rem;

        .el-range-editor.el-input__inner {
          width: 80%;
        }
      }

      .edit_time_row {
        display: flex;
        flex-direction: row;
        justify-content: center;

        .time_line {
          margin: 0 0.5rem;
          line-height: 40px;
          font-size: 1.4rem;
        }
      }
    }

    .task_describe {
      cursor: pointer;
      display: inline-block;
      // float: right;
      color: rgba(68, 142, 245, 1);
      padding: 0.8rem 1.2rem 1rem 1.2rem;

      .el-icon-s-operation {
        font-size: 2.2rem;
        vertical-align: middle;
      }

      span {
        font-size: 1.3rem;
        vertical-align: middle;
      }
    }

    .describe {
      display: flex;
      flex-direction: column;
      margin-top: 0.6rem;
      padding: 0 1.2rem;

      .describe_title {
        display: flex;
        align-items: center;
        font-size: 1.3rem;

        .describe_cur {
          cursor: pointer;
          color: rgba(68, 142, 245, 1);

          .el-icon-s-operation {
            font-weight: bold;
            font-size: 1.8rem;
            margin-right: 0.3rem;
          }
        }
      }

      .xfroala {
        margin: 1.1rem auto 20px;
        width: 100%;
        z-index: 1;
      }
    }
  }

  .load-status {
    height: 3.2rem;
  }

  .empty_task {
    height: 100%;
    background: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;

    div {
      height: 100%;
      display: table-cell;
      vertical-align: middle;

      img {
        max-width: 100%;
        max-height: 82%;
        display: block;
        margin: auto;
      }
    }
  }
}

.user-img {
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
}

.ttr-name {
  margin-left: 0.5rem;
  color: #6d6d6d;
  line-height: 3.4rem;
  font-size: 1.2rem;
}

.hiFont {
  font-size: 2rem;
  color: #ccc;
  font-weight: normal;
}

@media all and (max-width: 1440px) {
  .r-conent {
    .add_task {
      display: none;
    }

    //单个任务
    .briefing_item {
      //优先级
      .left_hr {
        width: 0.3rem;
      }

      //任务名 耗时
      .item_top {
        margin-bottom: 1rem;

        .briefing_name {
          .children-job {
            width: 21px;
            height: 21px;
            line-height: 21px;
            border-radius: 4px;
          }
        }

        .top_progress {
          width: 10rem;
        }
      }

      //执行人 时间 操作
      .item_bottom {
        //左
        .item_div_left {
          flex: 3.2;

          //执行人
          .task_user {
            img {
              height: 2.7rem;
              width: 2.7rem;
            }
          }

          //状态
          .tsak_schedules {
            margin-right: 0;
          }
        }

        .item_div_right {
          flex: 6.8;

          .task_time {
            width: 48%;
          }

          .task_progres {
            width: 10rem;
          }

          //操作
          .task_edit {
            width: 14.5rem;
          }
        }
      }
    }
  }
}

@media all and (max-width: 1024px) {
  .el-backtop {
    display: none;
  }

  .r-conent {
    // height: initial;
    // overflow-y: hidden;
    .add_task {
      display: inline;
      width: 100% !important;
      transition: background 0.3s ease;
      background: linear-gradient(
        90deg,
        rgba(97, 193, 254, 1) 0%,
        rgba(66, 139, 244, 1) 50%,
        rgba(97, 193, 254, 1) 100%
      );
      background-size: 200% 100%;
      color: #fff;
      margin-bottom: 1rem;
    }

    //单个任务
    .briefing_item {
      width: 100% !important;
      margin-left: 0 !important;

      .item_top {
        .time_tip {
          .hidden-phone {
            display: none;
          }
        }

        .top_progress {
          display: none;
        }

        .pro-process {
          display: block;
        }
      }

      //执行人 时间 操作
      .item_bottom {
        display: block;

        //公共
        .item_div_left,
        .item_div_right {
          margin: 1rem 0 0 0.8rem;
        }

        //左
        .item_div_left {
          //状态
          .tsak_schedules {
            margin-right: 0.4rem;
          }
        }

        .item_div_right {
          .task_time {
            justify-content: flex-start;
          }

          .task_progres {
            display: none;
          }
        }
      }

      .see_bottom {
        justify-content: space-around;
      }

      .edit_bottom {
        padding: 0.3rem 0.5rem;
        margin-top: 1rem;
        display: flex;
        align-items: center;
        flex-direction: column;

        .time_consuming {
          width: 100%;
          font-size: 1.4rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: 1rem;

          .consuming_input {
            width: 50%;

            /deep/ input {
              background: none !important;
            }
          }
        }

        //执行人
        .edit_task_user {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            height: 3.2rem;
            width: 3.2rem;
            border-radius: 50%;
          }

          .hi-user-task {
            width: 3rem;
            height: 3rem;
            background: #f4f4f4;
            box-sizing: border-box;
            font-size: 1.7rem;
            color: #9b9b9b;
            border: 0px solid #fff;
            border-radius: 50%;
            text-align: center;
            line-height: 3rem;
          }

          .task_p {
            font-size: 1.4rem;
            margin-left: 0.5rem;
          }
        }

        .edit_task_time {
          width: 100%;

          .el-range-editor.el-input__inner {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
