<template>
  <div class="main-box">
    <div class="title" v-if="!isFlag">
      <!-- 	<div>
				<span class="laber">子任务（{{ pageData.TotalCount }}）</span>
				<span class="switch-txt">只看自己</span>
				<el-switch v-model="pageData.onlyMy" @change="initFun(true, true)"></el-switch>
      </div>-->
      <span
        v-show="task.status != 7"
        class="add-childTask"
        @click="$modal.show('addTaskChild')"
      >
        <!-- <i class="hiFont hi-add-square"></i> -->
        新建子任务
      </span>
      <span @click="open = !open" class="show-children">
        已完成：{{ overCount }}，总数：{{ pageData.TotalCount }}
        <i
          class="el-icon-arrow-right"
          :style="{ transform: open ? 'rotate(90deg)' : '' }"
        ></i>
      </span>
    </div>
    <el-collapse-transition>
      <ul
        class="item-list"
        v-show="open"
        :class="{ 'item-list-open': open }"
        v-infinite-scroll="initFun"
        :infinite-scroll-disabled="disabledLoad"
        ref="children"
      >
        <li
          v-for="(item, index) in myData"
          :key="index"
          :style="{
            'border-left': priorityBorderColor(item),
            cursor: item.canOpen ? 'pointer' : '',
          }"
        >
          <div
            :class="{
              'background-over': item.schedule == 7 || item.progress == 100,
              'background-ing': item.schedule != 7 && item.progress != 100,
            }"
            :style="{
              width:
                item.progress == 0 || item.progress == -1
                  ? '0'
                  : item.progress > 90
                  ? item.progress - 5
                  : item.progress - 2 + '%',
              'border-right':
                item.progress == 0 || item.progress == -1
                  ? '0'
                  : '37px solid transparent',
            }"
          ></div>
          <div class="content-box" @click.stop="taskDetail(item)">
            <div class="item-head">
              <div class="task-name" :title="item.jobName">
                {{ item.jobName }}
              </div>
              <MemberSelect
                v-if="item.canOpen"
                ref="memberSelect"
                @Confirm="getMember(item, $event)"
                :isSelection="false"
                :showActive="false"
              >
                <div class="executor" slot="button">
                  <div>
                    <img
                      v-if="item.frontman"
                      v-lazy="$url + item.frontman.frontmanHead"
                    />
                    <i v-else class="hiFont hi-user-task"></i>
                  </div>
                  <div>
                    <p>执行者</p>
                    <p>
                      {{ item.frontman ? item.frontman.frontmanName : "暂无" }}
                    </p>
                  </div>
                </div>
              </MemberSelect>
              <div v-else class="executor" slot="button">
                <div>
                  <img v-lazy="$url + item.frontman.frontmanHead" />
                </div>
                <div>
                  <p>执行者</p>
                  <p>{{ item.frontman.frontmanName }}</p>
                </div>
              </div>
            </div>
            <div class="content">
              <div @click.stop>
                <el-dropdown
                  v-if="item.canOpen"
                  trigger="click"
                  placement="bottom-start"
                  @command="changeStatus(item, $event)"
                >
                  <span>
                    <i
                      class="hiFont"
                      :class="$D.ITEM('task_status', item.schedule).icon"
                      :style="{
                        color: $D.ITEM('task_status', item.schedule).color,
                      }"
                    ></i>
                    <span class="task-state">{{
                      $D.ITEM("task_status", item.schedule).name
                    }}</span>
                    <span
                      >（进度：{{
                        item.progress === -1 ? "0%" : item.progress + "%"
                      }}）</span
                    >
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="i in statusOptions(item.schedule)"
                      :key="i"
                      :command="i"
                    >
                      <i
                        :class="['hiFont', $D.ITEM('task_status', i).icon]"
                        :style="{ color: $D.ITEM('task_status', i).color }"
                      ></i>
                      {{ $D.ITEM("task_status", i).name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <span v-else>
                  <i
                    class="hiFont"
                    :class="$D.ITEM('task_status', item.schedule).icon"
                    :style="{
                      color: $D.ITEM('task_status', item.schedule).color,
                    }"
                  ></i>
                  <span class="task-state">{{
                    $D.ITEM("task_status", item.schedule).name
                  }}</span>
                  <span
                    >（进度：{{
                      item.progress === -1 ? "0%" : item.progress + "%"
                    }}）</span
                  >
                </span>
              </div>
              <div>
                <span>{{
                  formatDate(item.startTime, item.PridictionTimes)
                }}</span>
                <span>{{
                  item.estimatedTime
                    ? `（预估耗时${mhTimeChange(item.estimatedTime)}）`
                    : ""
                }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="item.canOpen"
            class="delete-box"
            @click="deleteTask(item.jobID, index)"
          >
            <i class="hiFont hi-delete"></i>
          </div>
        </li>
        <div class="g-loading" v-show="isLoading">
          <i class="el-icon-loading"></i>
          加载中...
        </div>
        <div class="g-loaded" v-show="noMore">已全部加载</div>
      </ul>
    </el-collapse-transition>
    <add-task
      :eid="task.evID"
      :fJobID="fJobId"
      :isChildTask="isChildTask"
      :frontman="minProInfo.evDefFrontMan"
      :tester="minProInfo.evDefTesterId"
      :pntFrontman="minProInfo.evDefPntFrontId"
    ></add-task>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    isChildTask: {
      type: Boolean,
      default: true,
    },
    fJobId: {},
    task: {},
    isFlag: {},
  },
  components: {
    MemberSelect: () => import("@/components/Selectors/MemberSelect"),
    AddTask: () => import("@/views/task/addTask"),
  },

  data() {
    return {
      minProInfo: {},
      myData: [],
      pageData: {
        onlyMy: true,
        currentPage: 1,
        pageCount: 8,
        TotalCount: 0,
        jobID: 0,
      },
      isLoading: false,
      open: false,
      oldData: {
        id: null,
        myData: null,
        pageData: null,
        open: false,
        scrollTop: 0,
        fScrollTop: 0,
      },
    };
  },

  methods: {
    ...mapActions(["task_addId", "task_setIndex"]),
    //获取子任务
    initFun(flag, type) {
      if (flag) {
        this.pageData.currentPage = 1;
        if (!type) {
          this.pageData.onlyMy = true;
        }
      } else {
        this.isLoading = true;
        this.pageData.currentPage++;
      }
      this.$http
        .post("/Project/Job/taskChildrenList.ashx", this.pageData)
        .then((resp) => {
          if (resp.res == 0) {
            this.pageData.TotalCount = resp.data.page.TotalCount;
            if (flag) {
              this.myData = resp.data.data;
            } else {
              this.isLoading = false;
              this.myData = this.myData.concat(resp.data.data);
            }
          }
        });
    },
    //优先级颜色
    priorityBorderColor(item) {
      if (item.schedule == 7) {
        return "0.3rem solid " + this.$D.ITEM("g_priority", 1).color[0];
      } else {
        return "0.3rem solid " + this.$D.ITEM("g_priority", item.fir).color[0];
      }
    },
    async changeStatus(i, e) {
      if (!i.frontMan && e == 7) {
        this.$notify({
          type: "info",
          message: "请设置执行人",
        });
        return;
      }
      try {
        let res = await this.$http.post("/Project/taskSubmitReview.ashx", {
          tag: e,
          jobId: i.jobID,
        });
        if (res.res == 0) {
          this.$notify({
            title: "修改成功",
            msg: res.msg,
            type: "success",
          });
          if (e == 7) {
            i.schedule = 4;
          } else {
            i.schedule = e;
          }
        }
      } catch (error) {
        console.log("修改子任务状态错误", error);
      }
    },
    async deleteTask(id, index) {
      try {
        await this.$confirm("确认要删除该子任务吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        this.$http.post("/Project/taskExtend.ashx", {
          typeId: 5,
          jobid: id,
        });
        // 全局通知
        let obj = {
          isChildren: true, //是否子任务
          frontmanID: this.myData[index].frontman.frontmanID, //执行人
          type: 2, //类型-->1添加，2删除
        };
        this.$E.$emit("upChildTask", obj);
        this.$notify({
          message: "删除成功",
          type: "success",
        });
      } catch (error) {
        if (error !== "cancel") {
          console.log("删除子任务错误", error);
        } else {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }
      }
    },
    taskDetail(item) {
      if (item.canOpen) {
        let old = JSON.parse(JSON.stringify(this.$data));
        this.oldData.id = this.fJobId;
        this.oldData.myData = old.myData;
        this.oldData.pageData = old.pageData;
        this.oldData.open = old.open;
        this.oldData.scrollTop = this.$refs.children.scrollTop;
        this.oldData.fScrollTop = document.getElementsByClassName(
          "left"
        )[1].scrollTop;
        //添加历史
        this.$emit("changTaskID", item.jobID);
        this.task_addId(item.jobID);
        this.task_setIndex(0);
      }
    },
    async getMember(item, result) {
      try {
        let res = await this.$http.post("/Project/taskRoleEdit.ashx", {
          jobid: item.jobID,
          typeId: 1,
          valueId: result[0].UId,
        });
        if (res.res === 0) {
          this.$notify({
            title: "修改成功",
            msg: res.msg,
            type: "success",
          });
          item.frontman.frontmanHead = result[0].Picture;
          item.frontman.frontmanName = result[0].UName;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //分钟-小时时间换算方法
    mhTimeChange(time) {
      const h = Number.parseInt(time / 60);
      const m = time % 60;
      if (h > 0 && m > 0) {
        return `${h}小时${m}分钟`;
      } else if (h > 0 && m === 0) {
        return `${h}小时`;
      } else {
        return `${m}分钟`;
      }
    },
  },
  watch: {
    isFlag(newVal, oldVal) {
      if (newVal) {
        this.open = newVal;
      }
    },
    // 'task.evID': {
    // 	handler(newVal) {
    // 		console.log(newVal)
    // 		if (!newVal || newVal == this.$route.params.eid) return;
    // 		//获取简要的项目详情
    // 		this.$http
    // 			.post('/project/projectInformation.ashx', {
    // 				EventeId: newVal
    // 			})
    // 			.then(resp => {
    // 				if (resp.res == 0) {
    // 					if (resp.data) {
    // 						this.minProInfo = resp.data;
    // 					} else {
    // 						this.$notify({
    // 							type: 'info',
    // 							message: '项目不存在或已删除'
    // 						});
    // 					}
    // 				}
    // 			});
    // 	},
    // 	immediate: true
    // },
    fJobId: {
      handler(newVal) {
        if (!newVal) return;

        setTimeout(() => {
          console.log(document.getElementsByClassName("left")[1]);
          document.getElementsByClassName("left")[1].scrollTop = 0;
        }, 3000);
        if (this.oldData.id == newVal) {
          this.myData = this.oldData.myData;
          this.pageData = this.oldData.pageData;
          this.open = this.oldData.open;
          this.$nextTick(() => {
            this.$refs.children.scrollTop = this.oldData.scrollTop;
          });
        } else {
          this.pageData.jobID = newVal;
          this.initFun(true);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isFlag) {
        this.open = this.isFlag;
      }
    });
  },
  computed: {
    overCount() {
      let count = 0;
      this.myData.forEach((item) => {
        if (item.schedule == 7) count++;
      });
      return count;
    },
    //禁用加载，没有了或者正在请求接口
    disabledLoad() {
      return this.isLoading || this.noMore;
    },
    noMore() {
      return this.pageData.TotalCount <= this.myData.length;
    },
    //任务详情中可供切换的任务状态
    statusOptions() {
      return function (state) {
        if ([4].indexOf(state) >= 0) {
          return [99]; //只显示撤销申请
        } else {
          return [2, 7, 0, 3, 1]; //显示进行中、已完成、待定中、暂停的、未开始
        }
      };
    },
    formatDate() {
      return function (startTime, endTime) {
        const year = new Date().getFullYear();
        if (startTime && endTime) {
          if (
            new Date(endTime).getFullYear() -
              new Date(startTime).getFullYear() >=
            1
          ) {
            return `${startTime.timeFormat(
              "yyyy年M月d日"
            )}-${endTime.timeFormat("yyyy年M月d日")}`;
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
      };
    },
  },
};
</script>
<style lang="less" scoped>
.main-box {
  // padding-top: 2rem;
  // margin-top: 3rem;
  margin-bottom: 1rem;
  // border-top: 1px solid #eee;
  position: relative;
  .title {
    position: absolute;
    top: -20px;
    right: 0rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .laber {
      font-size: 2rem;
      color: #9b9b9b;
    }
    .switch-txt {
      vertical-align: middle;
      margin-right: 0.5rem;
    }

    .add-childTask {
      float: right;
      color: #448ef5;
      cursor: pointer;
      font-size: 15px;
      margin-right: 1rem;
      i {
        font-size: 1.4rem;
        line-height: 2rem;
        height: 2rem;
        margin: 0 0.4rem 0 0;
      }
    }
    .show-children {
      cursor: pointer;
      font-size: 15px;
      user-select: none;
    }
  }
  .item-list-open {
    border-bottom: 1px solid #eee;
  }
  .item-list {
    overflow-y: scroll;
    // max-height: 34rem;
    max-height: 60rem;
    li:hover {
      box-shadow: 0px 6px 10px -5px #448ef5;
    }

    li {
      border: 1px solid #f4f4f4;
      border-radius: 0.3rem;
      margin-top: 1rem;
      display: flex;
      position: relative;
      overflow: hidden;
      position: 0.3s;

      .background-over {
        position: absolute;
        width: 100% !important;
      }

      .background-over + .content-box {
        .item-head {
          .task-name {
            color: #c5c5c5;
          }
        }
      }

      .background-ing {
        position: absolute;
        border-bottom: 7rem solid #effaff;
      }

      .content-box {
        padding: 0.7rem 1rem;
        flex-grow: 1;
        z-index: 9;
        max-width: 98%;
      }

      .item-head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .task-name {
          color: rgb(74, 74, 74);
          font-size: 1.6rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 85%;
        }

        .executor {
          display: flex;

          div:first-child {
            display: flex;
            align-items: center;
            img {
              height: 2.7rem;
              width: 2.7rem;
              border-radius: 50%;
              margin-right: 0.5rem;
            }
            .hiFont {
              font-size: 1.7rem;
            }
            .hi-user-task {
              display: inline-block;
              width: 3.5rem;
              height: 3.5rem;
              background: #f4f4f4;
              box-sizing: border-box;
              color: #9b9b9b;
              border: 0px solid #fff;
              border-radius: 50%;
              text-align: center;
              line-height: 3.5rem;
              margin-right: 0.5rem;
            }
          }

          div:last-child {
            p:first-child {
              font-size: 1rem;
              color: #c5c5c5;
            }

            p:last-child {
              font-size: 1.4rem;
              color: #4a4a4a;
            }
          }
        }
      }

      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
        color: #6d6d6d;

        div {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.task-state {
  font-size: 1rem;
  margin-left: 0.5rem;
}

.delete-box {
  width: 2.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #efefef;
  cursor: pointer;
  color: #b6b6b6;
  z-index: 9;
}

.delete-box:hover {
  background: #dbdbdb;
  color: white;
}

.hi-task {
  color: #c7c7c7;
}
@media screen and (max-width: 1024px) {
  .main-box {
    margin-bottom: 0;
    .title {
      justify-content: flex-start;
      position: initial;
      margin-top: 0.5rem;
    }
  }
}
</style>
