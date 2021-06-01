<template>
  <XModel
    isFixed
    ref="xmodal"
    name="taskTypeAdd"
    title="创建需求"
    cancelBtnText="取消"
    confirmBtnText="确定"
    @onConfirm="handleConfirm"
    @beforeOpen="beforeOpen"
    @closed="close"
    width="1100px"
  >
    <div class="t-wrapper">
      <div class="t-form">
        <el-form ref="taskForms" class="form" :model="taskForm" :rules="rules">
          <el-form-item class="form_item" prop="name" label="需求名称：">
            <el-input
              placeholder="输入新的任务名称（必填）"
              v-model="taskForm.name"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="form_item" label="所属项目：" prop="eventeID">
            <el-select
              v-model="taskForm.eventeID"
              @change="getLists"
              placeholder="选择项目分类"
              filterable
            >
              <el-option
                v-for="(item, index) in projectList"
                :key="index"
                :label="item.proName"
                :value="item.proId"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="form-line">
            <el-form-item class="form-line-item" label="任务分类：">
              <el-select
                v-model="taskForm.jobClassID"
                placeholder="选择任务分类"
                :disabled="jobClassList.length == 0"
              >
                <el-option
                  v-for="j in jobClassList"
                  :key="j.JCId"
                  :label="j.Name"
                  :value="j.JCId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="form-line-item" label="任务类型：">
              <el-select v-model="taskForm.jobType" @change="jobTypeChange">
                <el-option
                  v-for="j in $D.LIST('job_type')"
                  :key="j.value"
                  :label="j.name"
                  :value="j.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="form-line-item" label="优 先 级：">
              <el-select v-model="taskForm.fir" placeholder="任务优先级">
                <el-option
                  v-for="(p, index) in $D.LIST('g_priority')"
                  :key="index"
                  :label="p.name"
                  :value="p.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item
            class="form_item"
            prop="jobProceeds"
            label="收款金额："
            v-if="taskForm.jobType == 2"
          >
            <el-input
              type="number"
              placeholder="输入目标金额"
              v-model="taskForm.jobProceeds"
              @input="check('jobProceeds', $event)"
            ></el-input>
          </el-form-item>
          <div class="form-line" v-if="taskForm.jobType == 3">
            <el-form-item
              class="form-line-item"
              prop="refundAmount"
              label="退款金额："
            >
              <el-input
                type="number"
                placeholder="退款金额"
                v-model="taskForm.refundAmount"
                @input="check('refundAmount', $event)"
              >
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
            <el-form-item
              class="form-line-item"
              prop="refundRate"
              label="退款比例："
            >
              <el-input
                type="number"
                placeholder="退款比例"
                v-model="taskForm.refundRate"
                @input="check('refundRate', $event)"
              >
                <span slot="append">%</span>
              </el-input>
            </el-form-item>
            <el-form-item class="form-line-item" label="退款时间：">
              <el-date-picker
                type="datetime"
                v-model="taskForm.refundTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="退款时间"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="form-line" v-if="taskForm.jobType == 3">
            <el-form-item
              class="form-line-item"
              prop="refundState"
              label="退款状态："
            >
              <el-select
                v-model="taskForm.refundState"
                @change="taskForm.refundType = null"
              >
                <el-option
                  v-for="j in $D.LIST('task_refund_status')"
                  :key="j.value"
                  :label="j.name"
                  :value="j.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="form-line-item form-line-item-two"
              prop="refundType"
              label="退款类型："
              v-if="taskForm.refundState == 3"
            >
              <el-select v-model="taskForm.refundType">
                <el-option
                  v-for="j in $D.LIST('task_refund_types')"
                  :key="j.value"
                  :label="j.name"
                  :value="j.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item
            class="form_item"
            label="退款原因："
            style="margin-bottom: 0"
            v-if="taskForm.jobType == 3"
          ></el-form-item>
          <xfroala
            v-model="taskForm.refundReson"
            placeholder="请输入退款详细原因"
            class="xfroala"
            v-if="taskForm.jobType == 3"
          ></xfroala>
          <div class="form-line">
            <!-- <el-form-item class="form-line-item" label="执 行 人：">
							<div v-if="isMemberList && users[0]" style="display: flex; cursor: not-allowed">
								<img class="user-img" v-lazy="$url + users[0].Picture" />
								<p class="ttr-name">{{ users[0].UName }}</p>
							</div>
							<mb v-else :eid="taskForm.eventeID" @Confirm="confirm($event, 0)" :showActive="false" :isSelection="false"
							 :arrays="[users[0]]">
								<div slot="button">
									<div v-if="users[0] == null" class="mem-add">
										<i class="el-icon-plus"></i>
									</div>
									<div v-else style="display: flex; cursor: pointer">
										<img class="user-img" v-lazy="$url + users[0].Picture" />
										<p class="ttr-name">{{ users[0].UName }}</p>
									</div>
								</div>
							</mb>
						</el-form-item> -->
            <el-form-item label="预估耗时：" class="form-line-item">
              <el-input
                type="number"
                placeholder="小数"
                v-model="taskForm.estimate"
                @input="check('estimate', $event)"
              >
                <p slot="suffix" style="color: #575757">小时</p>
              </el-input>
            </el-form-item>
            <el-form-item class="form-line-item" label="插入顺序：">
              <el-select
                v-model="insert"
                @change="insertChang"
                :disabled="isMemberList"
              >
                <el-option label="置顶任务" :value="-2"></el-option>
                <el-option label="插入最后" :value="-1"></el-option>
                <el-option label="选择任务之前插入" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-line">
            <el-form-item
              prop="postion"
              v-show="insert == 0"
              class="form-line-item"
              label="选择任务："
            >
              <span
                v-if="isMemberList && selName"
                class="select-task"
                style="cursor: not-allowed"
                >{{ selName.Name }}</span
              >
              <span
                v-else-if="selName"
                @click="
                  () => {
                    activeType = 1;
                    $modal.show('taskSelTask');
                  }
                "
                class="select-task"
                style="cursor: pointer"
                >{{ selName.Name }}</span
              >
              <span
                v-else
                class="mem-add"
                @click="
                  () => {
                    activeType = 1;
                    $modal.show('taskSelTask');
                  }
                "
                ><i class="el-icon-plus"></i
              ></span>
            </el-form-item>
            <!-- <el-form-item class="form-line-item" label="是否必须加班：">
              <el-radio-group v-model="taskForm.isMustOverTime">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="form-line-item"
              label="立即执行："
              v-show="user.id == taskForm.frontmanID"
            >
              <el-radio-group v-model="taskForm.loadToWorkArea">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </div>
          <div class="detail_btn" @click="detail = !detail">
            <i class="el-icon-s-operation"></i>
            <span>详细创建</span>
          </div>
          <div v-show="detail">
            <div class="form-line">
              <el-form-item class="form-line-item" label="所属部门：">
                <el-select
                  v-model="taskForm.reachID"
                  placeholder="选择所属部门"
                >
                  <el-option label="项目所属部门" :value="0"></el-option>
                  <el-option
                    v-for="r in departmentList"
                    :label="r.Name"
                    :value="r.RId"
                    :key="r.RId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="form-line-item" label="开始时间：">
                <el-date-picker
                  v-model="taskForm.startDate"
                  value-format="yyyy-MM-dd"
                  placeholder="开始时间"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="form-line-item" label="结束时间：">
                <el-date-picker
                  v-model="taskForm.endDate"
                  value-format="yyyy-MM-dd"
                  placeholder="结束时间"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="form-line">
              <el-form-item class="form-line-item" label="审 核 人：">
                <mb
                  :eid="taskForm.eventeID"
                  @Confirm="confirm($event, 1)"
                  :showActive="false"
                  :isSelection="false"
                  :arrays="[users[1]]"
                >
                  <div slot="button">
                    <div v-if="users[1] == null" class="mem-add">
                      <i class="el-icon-plus"></i>
                    </div>
                    <div v-else style="display: flex">
                      <img class="user-img" v-lazy="$url + users[1].Picture" />
                      <p class="ttr-name">{{ users[1].UName }}</p>
                    </div>
                  </div>
                </mb>
              </el-form-item>
              <el-form-item class="form-line-item" label="负 责 人：">
                <mb
                  :eid="taskForm.eventeID"
                  @Confirm="confirm($event, 2)"
                  :showActive="false"
                  :isSelection="false"
                  :arrays="[users[2]]"
                >
                  <div slot="button">
                    <div v-if="users[2] == null" class="mem-add">
                      <i class="el-icon-plus"></i>
                    </div>
                    <div v-else style="display: flex">
                      <img class="user-img" v-lazy="$url + users[2].Picture" />
                      <p class="ttr-name">{{ users[2].UName }}</p>
                    </div>
                  </div>
                </mb>
              </el-form-item>
            </div>
            <el-form-item class="form_item" label="任务标签：">
              <el-select
                v-model="taskForm.tags"
                placeholder="选择标签（多选）"
                multiple
              >
                <el-option
                  v-for="ta in tagList"
                  :key="ta.JTId"
                  :label="ta.Name"
                  :value="ta.JTId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="form_item"
              label="任务描述："
              style="margin-bottom: 0"
            ></el-form-item>
            <xfroala
              v-model="taskForm.jobCast"
              placeholder="请输入任务的具体内容"
              class="xfroala"
              :sShot="false"
            ></xfroala>
          </div>
        </el-form>
      </div>
      <div class="t-list">
        <el-form @submit.native.prevent>
          <el-form-item>
            <el-input
              placeholder="搜索相似任务"
              v-model="similarTask"
              style="width: 100%;"
              class="search-similar"
              @keyup.enter.native="searchSimilar"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchSimilar"
              ></el-button>
            </el-input>
          </el-form-item>
          <div class="tips">
            注：若该项目之前也做过类似的任务，但是由于之前任务没完善好因而又需要进行修改，请选择该任务将新任务与其进行关联
          </div>
          <el-form-item label="相似任务：" v-if="selTaskName">
            <el-tag
              type="primary"
              size="small"
              :closable="true"
              @close="
                () => {
                  selList = [];
                  selTaskName = '';
                }
              "
              >{{ selTaskName }}</el-tag
            >
          </el-form-item>
          <div class="list" v-loading="searchLoading">
            <el-checkbox-group v-model="selList" @change="getSel">
              <el-checkbox
                :label="item"
                v-for="(item, index) in taskList"
                :key="index"
              >
                <i
                  :class="
                    'hiFont ' + $D.ITEM('task_status', item.Schedule).icon
                  "
                  :style="
                    'color:' + $D.ITEM('task_status', item.Schedule).color
                  "
                ></i>
                <p :title="item.Name" @click.stop="toDetail(item)">
                  {{ item.Name }}
                </p>
                <div class="span">
                  <img v-lazy="$url + item.Picture" />
                  <i>{{ item.FrontmanName }}</i>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <p class="no-found" v-if="similarTask && loaded">
              <i class="el-icon-question question"></i
              ><span
                @click="
                  () => {
                    activeType = 2;
                    $modal.show('taskSelTask');
                  }
                "
                >未找到想要关联的任务</span
              >
            </p>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 任务选择器 -->
    <sel-task
      @getTaskList="getCheckList"
      :userID="userID"
      :isSelf="isSelf"
      isSort
      modalName="taskSelTask"
    ></sel-task>
    <detail
      v-model="taskItem.JobId"
      :type="1"
      referer="/home"
      :url="'/task/' + taskItem.EventId + '/' + taskItem.JobId"
    ></detail>
  </XModel>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    XModel: () => import("@/components/XModal"),
    mb: () => import("@/components/Selectors/MemberSelect"),
    xfroala: () => import("@/components/XFroala"),
    SelTask: () => import("@/components/Selectors/selTask"),
    detail: () => import("./taskDetail"),
  },
  props: {
    //执行人
    frontman: {
      type: Object,
      default: null,
    },
    //审核人
    tester: {
      type: Object,
      default: null,
    },
    //上级负责人 项目经理
    pntFrontman: {
      type: Object,
      default: null,
    },
    isHome: {
      type: Boolean,
      default: false,
    },
    fJobID: {
      type: String | Number,
      default: "",
    },
    eid: {
      type: String | Number,
      default: "",
    },
  },
  watch: {
    frontman: {
      handler(newVal, oldVal) {
        this.users[0] = newVal;
        if (newVal != null) {
          this.taskForm.frontmanID = newVal.UId;
        } else {
          this.taskForm.frontmanID = null;
        }
      },
      deep: true,
    },
    tester: {
      handler(newVal, oldVal) {
        this.users[1] = newVal;
        if (newVal != null) {
          this.taskForm.testerID = newVal.UId;
        } else {
          this.taskForm.testerID = null;
        }
      },
      deep: true,
    },
    pntFrontman: {
      handler(newVal, oldVal) {
        this.users[2] = newVal;
        if (newVal != null) {
          this.taskForm.pntFrontmanID = newVal.UId;
        } else {
          this.taskForm.pntFrontmanID = null;
        }
      },
      deep: true,
    },
  },
  data() {
    const checkRatio = (rule, value, callback) => {
      if (value > 100) {
        callback(new Error("比例不能大于100%"));
      } else {
        callback();
      }
    };
    return {
      taskForm: {
        name: null, //任务名称
        jobClassID: null, //任务分类ID
        fir: 1, //优先级
        frontmanID: null, //执行人
        reachID: 0, //任务所属部门ID
        tags: [], //标签ID（1对多）
        testerID: null, //审核人ID
        pntFrontmanID: null, //上级负责人ID
        startDate: null, //开始时间
        endDate: null, //结束时间
        estimate: null, //预估耗时
        eventeID: null, //项目分类
        jobProceeds: null, //收款
        jobCast: null,
        jobType: 1,
        postion: -1, //任务顺序
        loadToWorkArea: false, //是否挂入工作区
        isMustOverTime: false, //是否立即加班
        refundMoneyType: 1, //退款金类型
        refundAmount: null, //退款金额
        refundRate: null, //退款比例
        refundTime: null, //退款时间
        refundState: null, //退款状态
        refundReson: null, //退款原因
        refundType: null, //退款类型
      },
      departmentList: [], //任务所属部门
      tagList: [], //标签
      jobClassList: [], //任务分类
      projectList: [], //项目分类
      rules: {
        name: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: "blur",
          },
        ],
        postion: [
          {
            required: true,
            message: "请选择任务",
            trigger: "blur",
          },
        ],
        jobProceeds: [
          {
            required: true,
            message: "请输入收款金额",
            trigger: "blur",
          },
        ],
        eventeID: [
          {
            required: true,
            message: "请选择项目",
            trigger: "blur",
          },
        ],
        refundState: [
          {
            required: true,
            message: "请选择退款状态",
            trigger: "blur",
          },
        ],
        refundType: [
          {
            required: true,
            message: "请选择退款类型",
            trigger: "blur",
          },
        ],
        refundRate: [
          {
            validator: checkRatio,
            trigger: "blur",
          },
        ],
      },
      detail: false, //详细创建
      users: {
        0: null,
        1: null,
        2: null,
      },
      insert: -1, //插入顺序
      //任务选择器 start
      selName: null,
      userID: null,
      isSelf: false,
      //任务选择器 end
      isMemberList: false,
      similarTask: "",
      selList: [],
      taskList: [],
      searchLoading: false,
      activeType: 1, //任务选择器选择类型
      selTaskName: "", //选择相似任务任务名
      loaded: false,
      taskItem: {
        JobId: "",
        EventId: "",
      },
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    close() {
      Object.assign(this.$data, this.$options.data());
    },
    //父组件使用的方法
    init(obj, task) {
      this.isMemberList = true;
      if (this.userID != obj.ID) {
        Object.assign(this.$data.taskForm, this.$options.data().taskForm);
      }
      this.userID = obj.ID;
      let newVal = {
        Picture: obj.head,
        UName: obj.name,
        UId: obj.ID,
      };
      this.users[0] = newVal;
      this.isSelf = true;
      this.getprojectList();
      this.taskForm.frontmanID = newVal.UId;
      this.insert = 0;
      let selTsak = {
        Name: task.name,
        ID: task.jid,
      };
      this.selName = selTsak;
      this.taskForm.postion = selTsak.ID;
      this.$modal.show(this.customName);
    },
    //获取任务选择器返回数据
    getCheckList(task) {
      //选择任务顺序
      if (this.activeType == 1) {
        if (task.length) {
          this.selName = task[0];
          this.taskForm.postion = task[0].JId;
        } else {
          this.selName = null;
          this.taskForm.postion = null;
        }
      } else {
        //选择相似任务
        this.selTaskName = task.length ? task[0].Name : null;
        this.taskForm.similarJob = task.length ? task[0].JId : null;
      }
    },
    // 插入顺序
    insertChang(val) {
      if (val == -1 || val == -2) {
        //末尾//开头
        this.taskForm.postion = val;
      } else {
        this.taskForm.postion = null;
      }
    },
    //检查数字
    check(type, value) {
      if (value < 0) {
        this.taskForm[type] = null;
      } else {
        this.taskForm[type] = this.$toFixed(this.taskForm[type], 2);
      }
    },
    //任务类型
    jobTypeChange(type) {
      if (type == 1) {
        this.taskForm.jobProceeds = null;
      }
    },
    //成员选择器的返回
    confirm(user, index) {
      if (user.length == 0) {
        switch (index) {
          case 0:
            this.taskForm.frontmanID = this.users[index] = null;
            break;
          case 1:
            this.taskForm.testerID = this.users[index] = null;
            break;
          case 2:
            this.taskForm.pntFrontmanID = this.users[index] = null;
            break;
        }
      } else {
        switch (index) {
          case 0:
            this.taskForm.frontmanID = this.userID = user[0].UId;
            if (this.taskForm.frontmanID !== this.user.id) {
              this.taskForm.loadToWorkArea = false;
            }
            break;
          case 1:
            this.taskForm.testerID = user[0].UId;
            break;
          case 2:
            this.taskForm.pntFrontmanID = user[0].UId;
            break;
        }
        this.users[index] = user[0];
      }
    },
    //处理提交
    handleConfirm() {
      this.$refs.taskForms.validate((valid) => {
        if (valid) {
          this.$refs.xmodal.loadBtn(true);
          this.taskForm.similarJob = this.selList.length
            ? this.selList[0].JId
            : "";
          this.$http
            .post("/Project/Job/taskAdd.ashx", this.taskForm)
            .then((resp) => {
              if (resp.res == 0) {
                this.$notify({
                  message: resp.msg,
                  type: "success",
                  offset: 25,
                });
                //通知父组件  目标源，任务状态，任务执行人，任务分类
                this.$emit(
                  "upData",
                  1,
                  resp,
                  this.taskForm.frontmanID,
                  this.taskForm.jobClassID
                );
                // 全局通知
                let obj = {
                  isChildren: this.isChildTask, //是否子任务
                  frontmanID: this.taskForm.frontmanID, //执行人
                  type: 1, //类型-->1添加，2删除
                  taskForm: this.taskForm,
                  loadToWorkArea: this.taskForm.loadToWorkArea,
                };
                this.$E.$emit("upChildTask", obj);
                // this.$emit('upChildTask', obj);
                Object.assign(
                  this.$data.taskForm,
                  this.$options.data().taskForm
                );
                //执行人
                if (this.frontman) {
                  this.taskForm.frontmanID = this.frontman.UId;
                }
                //审核人
                if (this.tester) {
                  this.taskForm.testerID = this.tester.UId;
                }
                //上级
                if (this.pntFrontman) {
                  this.taskForm.pntFrontmanID = this.pntFrontman.UId;
                }
                this.users[0] = this.frontman;
                this.users[1] = this.tester;
                this.users[2] = this.pntFrontman;
                this.detail = false;
                if (this.isChildTask) {
                  this.$modal.hide("addTaskChild");
                } else {
                  this.$modal.hide(this.customName);
                }
                this.insert = -1; //插入顺序
                this.selName = null; //选择的任务
              }
              this.$refs.xmodal.loadBtn(false);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    getprojectList() {
      this.$http
        .post("/General/GetProjectSelector.ashx", {
          CurrentPage: 1,
          PageCount: 9999,
        })
        .then((res) => {
          if (res.res == 0) {
            this.projectList = res.data.message;
          }
        });
    },
    //获取任务分类和标签分类
    getLists(projectID) {
      this.taskForm.jobClassID = null;
      this.$http
        .post("/Project/Job/taskGetClass.ashx", {
          projectID: projectID,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.tagList = resp.data.tag;
            this.jobClassList = resp.data.jobClass;
          }
        });
    },
    //项目打开前
    beforeOpen() {
      this.$http.get("/General/getReachAll.ashx").then((resp) => {
        this.departmentList = resp.data;
      });
      if (this.isHome) {
        this.getprojectList();
        this.users[0] = {};
        this.users[0].UName = this.user.name;
        this.users[0].Picture = this.user.Picture;
        this.taskForm.frontmanID = this.userID = this.user.id;
      } else {
        this.getprojectList();
        if (this.isChildTask) {
          this.taskForm["fJobID"] = this.fJobID;
          this.taskForm.eventeID = this.eid;
        } else {
          this.taskForm.eventeID = this.$route.params.eid;
        }
        this.getLists(this.taskForm.eventeID);
      }
    },
    searchSimilar() {
      let str = this.similarTask.replace(/\s/g, "");
      this.loaded = false;
      if (str.length) {
        this.searchLoading = true;
        this.$http
          .post("/Project/Similarjob.ashx", {
            name: this.similarTask,
          })
          .then((res) => {
            if (res.res == 0) {
              this.searchLoading = false;
              this.taskList = res.data;
              this.loaded = true;
            }
          });
      } else {
        this.taskList = [];
      }
    },
    getSel() {
      if (this.selList.length > 1) {
        this.selList = this.selList.splice(-1, 1);
      }
      this.selTaskName = this.selList.length ? this.selList[0].Name : "";
    },
    toDetail(item) {
      this.taskItem.JobId = item.JId;
      this.taskItem.EventId = item.EventId;
      if (this.taskItem.JobId && this.taskItem.EventId) {
        this.$modal.show("taskDetail");
      }
    },
  },
  mounted() {
    //获取部门
  },
};
</script>

<style lang="less" scoped>
.t-wrapper {
  display: flex;

  .t-form {
    width: 65%;
    box-sizing: border-box;
    padding-right: 1rem;
    padding-left: 2rem;
    max-height: 60rem;
    overflow: auto;
  }

  .t-list {
    width: 35%;
    max-height: 60rem;
    overflow: auto;
    padding: 0 1rem;
    /deep/.el-form-item {
      margin-bottom: 0.5rem;
    }

    .tips {
      font-size: 1.2rem;
      color: #409eff;
    }
    .search-similar {
      .el-button {
        background: #409eff;
        color: #fff;
        border-radius: 0 4px 4px 0;
      }
      /deep/.el-input__inner {
        border: 1px solid #ddd !important;
        border-right: 0;
        box-sizing: border-box;
        height: 38px;
        border-radius: 4px 0 0 4px;
        background: #fff;
        line-height: 38px;
      }
    }
    .no-found {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 2rem;
      i {
        font-size: 1.5rem;
        margin-right: 0.5rem;
        color: #6d6d6d;
      }
      span {
        font-size: 1.2rem;
        color: #4a4a4a;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
    .list {
      min-height: 10rem;
      /deep/.el-checkbox {
        // width: 49%;
        width: 100%;
        height: 6rem;
        box-shadow: 0px 2px 8px 0px rgba(242, 242, 242, 1);
        border-radius: 0.6rem;
        display: flex;
        box-sizing: border-box;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        margin-right: 0;
        margin-top: 1rem;

        /deep/.el-checkbox__label {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 0;

          i {
            color: #ffa940;
            font-size: 1.8rem;
            margin-right: 1.5rem;
            line-height: 1.8rem;
            margin-left: 1.2rem;
          }

          p {
            width: 18rem;
            color: #4a4a4a;
            font-size: 1.4rem;
            line-height: 1.8rem;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .span {
            width: 5rem;
            height: 5rem;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;

            img {
              width: 2.8rem;
              height: 2.8rem;
              border-radius: 50%;
              overflow: hidden;
            }

            i {
              color: #4a4a4a;
              font-size: 1.2rem;
              margin-right: 0;
              margin-left: 0;
            }
          }
        }
      }
    }
  }
}

.form {
  .form_item {
    display: flex;

    /deep/.el-form-item__label {
      padding-right: 10px;
      width: 95px;
    }

    /deep/.el-form-item__content {
      flex: auto;
      display: flex;
      align-items: center;

      .el-select {
        width: 100%;
      }
    }
  }

  .xfroala {
    margin: 0 auto 20px;
    width: 96%;
  }

  .detail_btn {
    display: inline-block;
    zoom: 1;
    cursor: pointer;
    color: rgba(68, 142, 245, 1);
    margin-bottom: 10px;

    .el-icon-s-operation {
      font-size: 2.5rem;
      vertical-align: middle;
    }

    span {
      font-size: 1.5rem;
      vertical-align: middle;
    }
  }

  .form-line {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    .form-line-item {
      display: flex;
      width: 33.3%;
      align-items: center;

      .select-task {
        width: 13rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      /deep/.el-form-item__label {
        padding-right: 10px;
        width: 95px;
        white-space: nowrap;
      }

      /deep/.el-form-item__content {
        display: flex;
        align-items: center;
        width: 65%;

        .el-select {
          width: 100%;
        }

        .el-date-editor.el-input {
          width: initial;
        }
      }
    }

    .form-line-item-two {
      width: 66.7%;

      /deep/.el-form-item__content {
        width: 85%;
      }
    }
  }
}

.hi-user-task {
  font-size: 2.2rem !important;
  width: 3.1rem;
  height: 3.1rem;
  line-height: 3.1rem;
  border-width: 2px;
}

.user-img {
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
}

.ttr-name {
  margin-left: 0.5rem;
  color: #6d6d6d;
}

@media all and (max-width: 1024px) {
  .t-wrapper {
    flex-direction: column;

    .t-form {
      width: 100%;
    }

    .t-list {
      width: 100%;
    }
  }

  .form_item {
    display: block !important;
    width: 92%;
  }

  .form-line {
    display: block !important;

    .form-line-item,
    .form-line-item-two {
      width: 100% !important;

      /deep/.el-form-item__label {
        width: 95px !important;
      }

      /deep/.el-date-editor.el-input {
        width: 100% !important;
      }
    }
  }
}
</style>
