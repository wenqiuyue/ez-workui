<!--
* @author: zxg
* @date: 2019-10-18 
* @description:
-->
<template>
  <!--XBB：引用了BaseView的页面必须套一层baseViewPage样式的div-->
  <div class="baseViewPage" id="pro-task">
    <!-- 	<Header title="项目和任务" :titleEnglish="minProInfo.evName" class="baseHeader" :showSearch="true" :haveBaseViewLeft="true">
			<div class="hiFont hi-search" slot="search" v-if="viewActive==1">
				<el-select
					clearable
					v-model="formData.integratQuery.status"
					placeholder="请选择"
					class="sel-report-statu"
					v-if="formData.integratQuery.queryType == 4"
					@change="headSearch($event)"
				>
					<el-option v-for="item in $D.LIST('task_status')" :label="item.name" :value="item.value"></el-option>
				</el-select>
				<el-select
					clearable
					v-model="formData.integratQuery.status"
					placeholder="请选择"
					class="sel-report-statu"
					v-else-if="formData.integratQuery.queryType == 5"
					@change="headSearch($event)"
				>
					<el-option v-for="item in $D.LIST('task_review_type')" :label="item.name" :value="item.value"></el-option>
				</el-select>
				<el-input v-else v-model="formData.integratQuery.value" placeholder="回车查询" class="input-with-select" @keyup.native.enter="headSearch()"></el-input>
				<el-select slot="append" v-model="formData.integratQuery.queryType" placeholder="综合" class="sel-statu" style="font-size: 1.4rem" @change="resetValue()">
					<el-option label="综合" value="0"></el-option>
					<el-option label="任务名" value="1"></el-option>
					<el-option label="标签" value="2"></el-option>
					<el-option v-show="activeNow != 2" label="成员" value="3"></el-option>
					<el-option v-show="activeNow != 1" label="任务状态" value="4"></el-option>
					<el-option v-show="formData.sort == 8" label="审核类型" value="5"></el-option>
				</el-select>
			</div>
			<div slot="btnGroup">
				<el-dropdown @command="openHeadMenu" trigger="click">
					<span class="el-dropdown-link">
						<span>更多</span>
						<i class="hiFont hi-ellipsis"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item v-if="viewActive == 1 && handleTaskStatus != 2" icon="hiFont hi-edit" command="edit">编辑模式</el-dropdown-item>
						<el-dropdown-item icon="hiFont hi-add-pro" command="addTask">创建任务</el-dropdown-item>
						<el-dropdown-item icon="hiFont hi-pro-detail" command="
						">项目详情</el-dropdown-item>
						<el-dropdown-item icon="hiFont hi-task" command="taskView" v-show="viewActive != 1">任务视图</el-dropdown-item>
						<el-dropdown-item icon="hiFont hi-time-go" command="timeView" v-show="viewActive != 2">时间视图</el-dropdown-item>
						<el-dropdown-item icon="hiFont hi-department" command="process" v-show="viewActive != 3">流程视图</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<div slot="dropdown">
				<div class="mobile-tab">
					<el-dropdown @command="openHeadMenu" trigger="click">
						<span class="el-dropdown-link"><i class="hiFont hi-ellipsis"></i></span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item icon="hiFont hi-add-pro" command="addTask">创建任务</el-dropdown-item>
							<el-dropdown-item icon="hiFont hi-pro-detail" command="proDetail">项目详情</el-dropdown-item>
							<el-dropdown-item icon="hiFont hi-task" command="taskView" v-show="viewActive != 1">任务视图</el-dropdown-item>
							<el-dropdown-item icon="hiFont hi-time-go" command="timeView" v-show="viewActive != 2">时间视图</el-dropdown-item>
							<el-dropdown-item icon="hiFont hi-department" command="process" v-show="viewActive != 3">流程视图</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</Header> -->
    <div class="pro-header">
      <div class="header-container">
        <div class="title">项目：{{ minProInfo.evName }}</div>
        <ul class="h-tabs clear_fix">
          <li>项目概览</li>
          <li>任务</li>
          <li>缺陷</li>
          <li>迭代</li>
          <li>文档</li>
          <li>审核</li>
          <li>统计</li>
          <li>+</li>
        </ul>
      </div>
    </div>
    <div v-loading="loading" style="height: 100%" v-if="viewActive == 1">
      <div class="min-info" v-if="minProInfo.evSchedules != null">
        <div v-if="minProInfo.evDefFrontMan != null" class="min-info-item">
          <h1>项目负责人:</h1>
          <img
            class="pro-man-img"
            v-lazy="$url + minProInfo.evDefFrontMan.Picture"
          />
          <p>{{ minProInfo.evDefFrontMan.UName }}</p>
        </div>
        <div v-else class="min-info-item">
          <h1>项目负责人:</h1>
          <p>暂无</p>
        </div>
        <div class="min-info-item">
          <h1>项目状态:</h1>
          <i
            :class="[
              'hiFont',
              $D.ITEM('pro_status', minProInfo.evSchedules).icon,
            ]"
            :style="{
              color: $D.ITEM('pro_status', minProInfo.evSchedules).color,
            }"
          ></i>
          <p>{{ $D.ITEM("pro_status", minProInfo.evSchedules).name }}</p>
        </div>
        <div class="min-info-item add_task" v-if="handleTaskStatus != 1">
          <el-button
            type="primary"
            class="add_quick_button"
            size="small"
            @click="handleQuickAddTask"
            >快速创建任务</el-button
          >
        </div>
        <div class="pro-complete">
          <h1>完成进度:</h1>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="evJobcomplete"
          ></el-progress>
        </div>
      </div>
      <BaseView title_name="视图列表">
        <!-- 排序 -->
        <el-dropdown slot="view_btn" trigger="click">
          <span class="el-dropdown-link task_orderBy">
            {{ orderName }}
            <i class="el-icon-sort"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="task_orderBy_item">
            <el-dropdown-item
              v-for="item in orderList"
              @click.native="taskOrderBy(item)"
            >
              {{ item.name }}
              <span
                class="el-icon-check"
                v-if="formData.sort == item.value"
              ></span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tabs
          v-model="activeName"
          slot="panes"
          @tab-click="handleClick"
          v-loading="myload"
        >
          <!-- pane 1 -->
          <el-tab-pane name="1">
            <span slot="label">
              <i class="hiFont hi-tag-cr"></i>
              状态
            </span>
            <ul>
              <el-select
                v-model="formData.quickView"
                @change="orderAndSearch('childLoading', false)"
                class="task_select"
              >
                <el-option label="所有任务" value="-1"></el-option>
                <el-option label="我关注的任务" value="-2"></el-option>
                <el-option label="我执行的任务" value="-3"></el-option>
                <el-option label="我审核的任务" value="-4"></el-option>
                <el-option label="我监管的任务" value="-5"></el-option>
                <el-option label="我参与的任务" value="-6"></el-option>
              </el-select>
              <!-- 任务状态列表 -->
              <li
                v-for="item in $D
                  .LIST('task_status')
                  .sort((a, b) => {
                    return a.custom - b.custom;
                  })
                  .filter((o) => {
                    return o.custom;
                  })"
                :key="item.value"
                :class="{ activeList: clickID[0] === item.value }"
                @click="activeList(item.value, 1, 'childLoading')"
              >
                <i
                  :class="['hiFont', item.icon]"
                  :style="{ color: item.color }"
                ></i>
                <span>{{ item.name }}</span>
                <em>({{ numbers[0][item.value] }})</em>
              </li>
            </ul>
          </el-tab-pane>
          <!-- pane 2 -->
          <el-tab-pane name="2">
            <span slot="label">
              <i class="el-icon-user"></i>
              成员
            </span>
            <div class="pane-btn">
              <el-button type="primary" size="small" @click="openProDet"
                >成员管理</el-button
              >
            </div>
            <div
              class="tip_text"
              v-if="numbers[1] == null || numbers[1].length == 0"
            >
              暂无更多内容
            </div>
            <el-input
              v-else
              placeholder="搜索成员"
              v-model="filterText"
              prefix-icon="el-icon-search"
            ></el-input>
            <div v-show="searchGenera.length == 0">
              <!--XBB: 分组折叠的话直接照搬以下格式 -->
              <el-collapse accordion v-if="!isSearch">
                <el-collapse-item
                  v-for="g in numbers[1]"
                  :key="g.ReachID"
                  :title="g.ReachName"
                >
                  <ul>
                    <li
                      v-for="gg in g.Item"
                      :key="gg.UsId"
                      :class="{ activeList: clickID[1] === gg.UsId }"
                      @click="activeList(gg.UsId, 2, 'childLoading')"
                    >
                      <img v-lazy="$url + gg.Picture" />
                      <span>{{ gg.Name }}</span>
                      <em>({{ gg.count }})</em>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
              <div v-else class="tip_text">未搜索到数据</div>
            </div>
            <div v-show="searchGenera.length > 0">
              <!--XBB: 分组折叠的话直接照搬以下格式 -->
              <el-collapse v-model="colllist">
                <el-collapse-item
                  v-for="g in searchGenera"
                  :key="g.ReachID"
                  :title="g.ReachName"
                  :name="g.ReachID"
                >
                  <ul>
                    <li
                      v-for="gg in g.Item"
                      :key="gg.UsId"
                      :class="{ activeList: clickID[1] === gg.UsId }"
                      @click="activeList(gg.UsId, 2, 'childLoading')"
                    >
                      <img v-lazy="$url + gg.Picture" />
                      <span>{{ gg.Name }}</span>
                      <em>({{ gg.count }})</em>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tab-pane>
          <!-- pane 3 -->
          <el-tab-pane name="3">
            <span slot="label">
              <i class="el-icon-setting"></i>
              分类
            </span>
            <ul>
              <div class="pane-btn">
                <el-button
                  type="primary"
                  size="small"
                  @click="openXmodal('taskGroup')"
                  >自定义分类管理</el-button
                >
              </div>
              <li
                :class="{ activeList: clickID[2] === custom.id }"
                v-on:click="activeList(custom.id, 3, 'childLoading')"
                v-for="custom in numbers[2]"
                :key="custom.id"
              >
                <span>{{ custom.name }}</span>
                <em>({{ custom.count }})</em>
              </li>
              <div
                class="tip_text"
                v-if="numbers[2] == null || numbers[2].length == 0"
              >
                暂无更多内容
              </div>
            </ul>
          </el-tab-pane>
        </el-tabs>
        <RoutineItem
          ref="item"
          :childLoad="childLoading"
          slot="content"
          page="task"
          v-model="itemData"
          @handleClick="handleClick"
          @upData="updata"
          @upIndex="upIndex"
          @loadData="orderAndSearch(null, true, null)"
          @updateEditAndQuick="orderAndSearch('childLoading', false)"
          :isLoading="isLoading"
          :noMore="noMore"
          @refresh="refreshData"
          :quickAddTaskListData="quickAddTaskData"
          :handleTaskStatusData="handleTaskStatus"
          @cancelQuickTask="handleCancelQuickTask"
          @handleClearData="clearData"
          @closeHandle="handleClose"
        ></RoutineItem>
      </BaseView>
    </div>
    <div
      v-else-if="viewActive == 2"
      style=" height: calc(100% - 1rem);padding-bottom: 1rem;padding-right: 0.5rem;"
    >
      <TimeLine></TimeLine>
    </div>
    <div v-else-if="viewActive == 3"><process></process></div>

    <!-- 其他组件 -->
    <add-task
      @upData="updata(arguments)"
      :frontman="minProInfo.evDefFrontMan"
      :tester="minProInfo.evDefTesterId"
      :pntFrontman="minProInfo.evDefPntFrontId"
    ></add-task>
    <pro-detail @upData="updata" ref="detail"></pro-detail>
    <task-group @upData="updata"></task-group>
  </div>
</template>

<script>
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    AddTask: () => import("@/views/task/addTask"),
    // Header: () => import('@/components/Header'),
    ProDetail: () => import("@/views/pro/proDetail"),
    RoutineItem: () => import("@/views/task/RoutineItem"),
    TimeLine: () => import("./timeLine"),
    TaskGroup: () => import("./taskGroup"),
    process: () => import("@/views/pro/process/index"),
  },
  data() {
    return {
      loading: false, //加载
      activeName: "1", //视图选项
      numbers: {
        0: [0, 0, 0, 0, 0, 0, 0, 0], //状态数
        1: null,
        2: null,
      },
      taskcount: 0, //总条数
      isLoading: false, //懒加载
      itemData: [], //任务列表数据
      filterText: "", //搜索人员
      searchGenera: [], //搜索后的人员
      myload: false,
      childLoading: false,
      colllist: [], //展开搜索的
      isSearch: false, //是否在搜索
      minProInfo: {
        evName: "",
      }, //简要项目详情
      activeNow: 1,
      orderName: "创建时间",
      activeIndex: null, //当前选择的任务索引
      formData: {
        sort: 1, //排序
        // sort: null, //排序
        eventeID: null, //项目ID
        integratQuery: {
          queryType: "0", //查询类型
          value: "", //查询值
          status: "",
        },
        currentPage: 1, //当前页
        pageCount: 10, //单页数量
        view: {
          queryType: "1", //点击的什么视图
          value: "", //状态，成员，分类ID
        },
        params: {},
        quickView: "-1", //快捷查看
      },
      clickID: {},
      viewActive: 1,
      showFilter: false, //项目筛选抽屉
      quickAddTaskData: [], //快速创建的任务列表
      isClearData: true,
      handleTaskStatus: null, //1编辑模式 2创建模式
    };
  },
  methods: {
    handleClose() {
      if (this.handleTaskStatus == 2) {
        this.quickAddTaskData = [];
      }
      this.handleTaskStatus = null;
    },
    /**
     * 编辑模式
     */
    handleEdit() {
      this.handleTaskStatus = 1;
    },
    /**
     * 快速创建任务
     */
    handleQuickAddTask() {
      //当创建第一个任务时，将列表滚动条滑到顶部
      if (this.quickAddTaskData.length <= 0) {
        this.$refs.item.scrollTop(0);
      }
      this.handleTaskStatus = 2;
      const quickTaskFofm = {
        name: null, //任务名字
        Schedules: null, //任务状态
        Casts: null, //任务描述
        StartTimes: null, //任务开始日期
        PridictionTimes: null, //任务结束日期
        EstimatedTime: null,
        Frontman: null,
        FrontmanID: null,
        value: [],
        isTaskDescribe: false,
        user: [this.minProInfo.evDefFrontMan],
      };
      this.quickAddTaskData.push(quickTaskFofm);
    },
    /**
     * 删除某一个正在创建的快速任务
     */
    handleCancelQuickTask(i) {
      this.quickAddTaskData = this.quickAddTaskData.filter(
        (m, index) => index != i
      );
      if (this.quickAddTaskData.length <= 0) {
        this.handleTaskStatus = null;
      }
    },
    clearData(val) {
      this.isClearData = val;
    },
    openProDet() {
      this.openXmodal("projectDetail");
      this.$refs.detail.open();
    },
    refreshData() {
      //更新右边数据
      let temp1 = this.formData.currentPage;
      let temp2 = this.formData.pageCount;
      this.formData.currentPage = 1;
      this.formData.pageCount = this.itemData.length;
      this.$http
        .post("/Project/taskMenuInquire.ashx", this.formData)
        .then((resp) => {
          if (resp.res == 0) {
            this.itemData = resp.data.data;
          }
          this.formData.pageCount = temp2;
          this.formData.currentPage = temp1;
        });
    },
    resetValue() {
      this.formData.integratQuery.value = "";
      this.formData.integratQuery.status = "";
    },
    //排序和搜索
    orderAndSearch(loadName, page) {
      if (page) {
        this.isLoading = true;
        this.formData.currentPage++;
      } else {
        this.formData.currentPage = 1;
      }
      this.$http
        .post("/Project/taskMenuInquire.ashx#", this.formData)
        .then((resp) => {
          if (resp.res == 0) {
            this.taskcount = resp.data.paging.TotalCount;
            this.numbers[this.activeNow - 1] = resp.data.count;
            //换页
            if (!page) {
              this.itemData = resp.data.data;
            } else {
              this.itemData = _.concat(this.itemData, resp.data.data);
              this.isLoading = false;
            }
            this[loadName] = false;
          }
        })
        .catch((e) => {});
    },
    //任务排序改变
    taskOrderBy(item) {
      this.formData.currentPage = 1;
      this.formData.sort = item.value;
      this.orderName = item.name;
      this.childLoading = true;
      this.orderAndSearch("childLoading");
    },
    //头部搜索
    headSearch(status) {
      this.formData.currentPage = 1;
      let text = _.trim(this.formData.integratQuery.value);
      let type = this.formData.integratQuery.queryType;
      if (type == 4 || type == 5) {
        this.formData.integratQuery.value = status;
      }
      this.childLoading = true;
      this.orderAndSearch("childLoading");
    },
    openHeadMenu(item) {
      switch (item) {
        case "addTask":
          this.openXmodal("addTask");
          break;
        case "proDetail":
          this.openXmodal("projectDetail");
          break;
        case "timeView":
          this.viewActive = 2;
          break;
        case "taskView":
          this.viewActive = 1;
          break;
        case "edit":
          this.handleEdit();
          break;
        case "process":
          this.viewActive = 3;
          // this.handleEdit();
          break;
      }
    },
    //点击事件
    activeList(index, item, loadName) {
      this.formData.currentPage = 1;
      this[loadName] = true;
      if (this.activeNow != item) {
        //综合搜索
        Object.assign(
          this.$data.formData.integratQuery,
          this.$options.data().formData.integratQuery
        );
        this.activeNow = item;
      }
      this.formData.view.queryType = item;
      this.formData.view.value = index;
      if (item === 1) {
        this.clickID[0] = index;
        this.clickID[1] = null;
        this.clickID[2] = null;
        if (index == 4) {
          this.formData.sort = 8;
          this.orderName = "提交审核时间";
        } else {
          if (this.formData.sort == 8) {
            this.formData.integratQuery.queryType = "0";
            this.formData.sort = 1;
            this.orderName = "创建时间";
          }
        }
      }
      if (item === 2) {
        this.clickID[0] = null;
        this.clickID[1] = index;
        this.clickID[2] = null;
      }
      if (item === 3) {
        this.clickID[0] = null;
        this.clickID[1] = null;
        this.clickID[2] = index;
      }
      this.orderAndSearch(loadName);
    },
    //搜索人员
    filterNode(value) {
      if (!value) {
        this.searchGenera = [];
        this.isSearch = false;
        return;
      }
      let temp = [];
      this.colllist = [];
      this.numbers[1].forEach((item, index) => {
        let childs = [];
        //人员
        item.Item.forEach((child) => {
          if (child.Name.toLowerCase().indexOf(value) !== -1) {
            childs.push(child);
          }
        });
        //部门
        if (childs.length > 0) {
          let depa = Object.assign({}, item);
          depa.Item = childs;
          temp.push(depa);
          this.colllist.push(depa.ReachID);
        }
      });
      this.isSearch = true;
      this.searchGenera = temp;
    },
    //切换Tab函数
    handleClick(tab, flag, call) {
      if (this.numbers[tab.index] == null || flag == true) {
        if (flag != true) {
          this.myload = true;
        }
        //视图
        let temp1 = this.formData.view.value;
        let temp2 = this.formData.view.queryType;
        this.formData.view.queryType = tab.name;
        this.formData.view.value = null;
        this.$http
          .post("/Project/taskMenuInquire.ashx", this.formData)
          .then((resp) => {
            this.formData.view.value = temp1;
            this.formData.view.queryType = temp2;
            if (resp.res == 0) {
              this.numbers[tab.index] = resp.data.count;
              this.myload = false;
              if (call) {
                call();
              }
            }
          });
      }
    },
    //得到当前操作item
    upIndex(index) {
      this.activeIndex = index;
    },
    //更新
    updata(type) {
      //项目详情修改后
      if (type == true) {
        if (this.clickID[0] != null) {
          this.numbers[0][this.clickID[0]] =
            this.numbers[0][this.clickID[0]] - 1;
        }
        return;
      }
      if (type == 3) {
        this.getMiniPro(function() {});
      } else {
        this.numbers[1] = null;
        this.numbers[2] = null;
        //用户
        const tab = {
          index: this.activeNow,
          name: this.activeNow + "",
        };
        //获取数字
        this.handleClick(tab, true, () => {
          //有多个参数时
          if (typeof type === "object") {
            //新建任务后
            if (type[0] == 1) {
              //清除综合搜索内容
              Object.assign(
                this.$data.formData.integratQuery,
                this.$options.data().formData.integratQuery
              );
              if (this.formData.view.queryType == "1") {
                //状态.
                this.activeList(type[1].data.schedule, 1);
              } else if (this.formData.view.queryType == "2") {
                if (type[2] == 0 || type[2] == null) {
                  this.activeList(this.minProInfo.evDefFrontMan.UId, 2);
                } else {
                  this.activeList(type[2], 2);
                }
              } else if (this.formData.view.queryType == "3") {
                //自定义
                this.activeList(type[3], 3);
              }
            }
          } else if (type == 2) {
            //更新右边数据
            this.isLoading = true;
            let temp = this.formData.currentPage;
            this.formData.currentPage = this.activeIndex + 1;
            this.formData.pageCount = 1;
            this.$http
              .post("/Project/taskMenuInquire.ashx", this.formData)
              .then((resp) => {
                if (resp.res == 0) {
                  if (
                    resp.data.data.length == 0 ||
                    resp.data.data[0].id != this.itemData[this.activeIndex].id
                  ) {
                    this.$set(this.itemData[this.activeIndex], "show", true);
                  } else {
                    Object.assign(
                      this.itemData[this.activeIndex],
                      resp.data.data[0]
                    );
                  }
                  this.isLoading = false;
                }
                this.formData.pageCount = 10;
                this.formData.currentPage = temp;
              });
          }
        });
      }
    },
    //打开相应的弹窗
    openXmodal(name) {
      this.$modal.show(name);
    },
    getMiniPro(call) {
      //获取简要的项目详情
      this.$http
        .post("/project/projectInformation.ashx", {
          EventeId: this.$route.params.eid,
        })
        .then((resp) => {
          if (resp.res == 0) {
            if (resp.data) {
              this.minProInfo = resp.data;
              const url = window.location.href;
              const isEid = url.split("?")[1];
              if (isEid) {
                this.openXmodal("projectDetail");
              }
              call(true);
            } else {
              this.$notify({
                type: "info",
                message: "项目不存在或已删除",
              });
              this.loading = true;
              call(false);
            }
          }
        });
    },
    //获取状态的任务数
    getTaskNumber(loadName) {
      this.$http
        .post("/Project/taskMenuInquire.ashx#", this.formData)
        .then((resp) => {
          if (resp.res == 0) {
            this.numbers[0] = resp.data.count;
            var index = 2;
            if (resp.data.count[2] > 0) {
              index = 2;
            } else if (resp.data.count[6] > 0) {
              index = 6;
            } else if (resp.data.count[1] > 0) {
              index = 1;
            } else if (resp.data.count[3] > 0) {
              index = 3;
            } else if (resp.data.count[0] > 0) {
              index = 0;
            } else if (resp.data.count[4] > 0) {
              index = 4;
            } else if (resp.data.count[5] > 0) {
              index = 5;
            } else if (resp.data.count[7] > 0) {
              index = 7;
            }
            this.getMiniPro((result) => {
              if (result) {
                this.formData.view.value = index;
                this.activeList(index, 1, loadName);
              }
            });
          }
        })
        .catch(() => {});
    },
  },
  watch: {
    filterText(val) {
      this.filterNode(val);
    },
    $route: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        //初始化数据
        Object.assign(this.$data, this.$options.data());
        this.formData.eventeID = newval.params.eid;
        this.loading = true;
        this.viewActive = 1;
        this.getTaskNumber("loading");
      },
    },
  },
  computed: {
    //进度
    evJobcomplete() {
      if (this.minProInfo.evJobcomplete == 0) {
        return 0;
      }
      return parseFloat(
        (
          (this.minProInfo.evJobcomplete / this.minProInfo.evJobCount) *
          100
        ).toFixed(2)
      );
    },
    //加载
    noMore() {
      return this.taskcount <= this.itemData.length;
    },
    orderList() {
      return this.$D.LIST("task_order").filter((item) => {
        return item.value != 9;
      });
    },
  },
};
</script>

<style lang="less">
@menu_place_width: 26rem;
#pro-task {
  .pro-header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 90;
    width: 100%;
    box-sizing: border-box;
    padding-left: @menu_place_width;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    .header-container {
      padding: 1.5rem 2.2rem;
      background-color: #ffffff;
      .title {
        font-size: 2rem;
        font-weight: bold;
      }
      .h-tabs {
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.el-collapse {
  border: none;
}

#module_bv {
  padding-top: 7rem;
}

.mobile-tab {
  display: flex;
}

.task_orderBy {
  i {
    font-size: 1.8rem;
  }

  cursor: pointer;
  color: #448ef5;
}

.task_orderBy_item {
  /deep/.el-dropdown-menu__item {
    position: relative;
    padding-right: 4rem;

    span {
      font-size: 1.8rem;
      position: absolute;
      right: 1rem;
      top: 25%;
    }
  }
}

// 搜索
.sel-report-statu {
  width: 16rem;
  /deep/.el-input__inner {
    border-radius: 0.4rem 0 0 0.4rem;
    font-size: 1.2rem !important;
    background: #fafafa;
    color: #666;
    padding: 0.7rem 1.2rem;
    padding-left: 2.7rem;
    border: none;
  }
}

/deep/.center > div {
  .input-with-select {
    .el-input__inner {
      border-radius: 0.4rem 0rem 0rem 0.4rem !important;
      width: 16rem;
    }
  }
}

.sel-statu {
  position: absolute;

  /deep/ .el-input__inner {
    width: 8.6rem;
    border-radius: 0 0.4rem 0.4rem 0;
    font-size: 1.2rem !important;
    color: #666;
    padding: 0.7rem 1.2rem;
    border: none;
    background: #f5f7fa;
  }
}

//搜索end
.completion_time > span > p {
  font-size: 1.4rem;
  color: rgba(68, 142, 245, 1);
  padding-right: 1rem;
}

.hiFont {
  font-size: 1.4rem;
  line-height: 2rem;
  height: 2rem;
  margin: 0 0.4rem 0 0;
}

ul > li > i {
  font-size: 2.5rem !important;
}

.min-info {
  display: flex;
  height: 6rem;
  box-sizing: border-box;
  background-color: #ffffff;
  background-clip: content-box;
  padding: 1rem 1rem 0 1rem;
  position: absolute;
  border-radius: 6px;
  width: 100%;
  z-index: 1;

  .min-info-item,
  .pro-complete {
    display: flex;
    align-items: center;

    h1 {
      padding-left: 1rem;
      font-size: 1.6rem;
      margin-right: 0.5rem;
    }

    p {
      font-size: 1.3rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-left: 0.5rem;
    }

    .hiFont {
      font-size: 3rem;
      margin: 0 !important;
    }

    .pro-man-img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
  }

  .min-info-item {
    margin-right: 1.5rem;
  }
  .add_task {
    .add_quick_button {
      transition: background 0.3s ease;
      background: linear-gradient(
        90deg,
        rgba(97, 193, 254, 1) 0%,
        rgba(66, 139, 244, 1) 50%,
        rgba(97, 193, 254, 1) 100%
      );
      background-size: 200% 100%;
      color: #fff;
    }
  }
  .pro-complete {
    width: 24%;
    position: absolute;
    right: 2rem;
    top: 2.5rem;
    white-space: nowrap;

    div {
      width: 71%;
    }
  }
}

@media all and (max-width: 1024px) {
  #module_bv {
    padding: 0;
    padding-top: 9rem;
  }

  .min-info {
    height: auto !important;
    flex-wrap: wrap;
    .add_task {
      display: none;
    }
    .min-info-item {
      width: 50% !important;
      height: 3rem;
      margin-top: 0.7rem;
      margin-right: 0 !important;

      h1 {
        padding-left: 0.5rem !important;
        text-align: right;
      }

      .hiFont {
        font-size: 2.8rem;
      }

      .pro-man-img {
        width: 2.6rem;
        height: 2.6rem;
      }
    }
  }

  .pro-complete {
    position: initial !important;
    width: 100% !important;
    height: 4rem;

    h1 {
      padding-left: 0.7rem !important;
    }

    .hiFont {
      font-size: 3rem !important;
    }
  }

  // 搜索
  .mobile-search,
  .on {
    & > div {
      display: flex;
      justify-content: center;

      &::before {
        display: none;
      }
    }

    .input-with-select {
      width: 50%;

      /deep/.el-input__inner {
        border-radius: 0.4rem 0 0 0.4rem !important;
        border: none;
      }
    }

    .sel-report-statu {
      width: 50%;

      /deep/.el-input__inner {
        border-radius: 0.4rem 0 0 0.4rem;
        border: none;
        padding-left: 2rem !important;
      }
    }

    .sel-statu {
      position: relative;
      width: 25%;

      /deep/.el-input__inner {
        width: inherit;
        border-radius: 0 0.4rem 0.4rem 0 !important;
      }
    }
  }
}
</style>
