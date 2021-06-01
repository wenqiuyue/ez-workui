<!-- 
    [2019/12/05 许彬彬] 任务详情
    [2019/12/19 许彬彬] 增加事件$emit('updated', 任务详情对象（Object）, 是否被删除(Boolean))，当任务详情发生修改时会通知父组件进行修改 
-->
<template>
  <div>
    <XModal
      :name="modalName"
      width="95%"
      height="95%"
      :url="myurl"
      :referer="referer"
      classes="xmTaskDtl"
      @opened="opened"
      @closed="closed"
      @loadSuccess="xmodalLoaded"
    >
      <!-- 菜单 -->
      <template v-if="crtTask" slot="header">
        <div class="arrows">
          <a
            class="el-icon-arrow-left"
            :class="{ disabled: task.index == 0, normal: task.index != 0 }"
            @click.self="pageTurn(false)"
          ></a>
          <a
            class="el-icon-arrow-right"
            :class="{
              disabled: task.index == task.history.length - 1,
              normal: task.index != task.history.length - 1,
            }"
            @click.self="pageTurn(true)"
          ></a>
        </div>
        <div class="pro" v-if="TYPE(['常规任务', '收款任务'])">
          <!-- <a :href="`https://work.damaiking.com/task/${crtTask.evID}?pro=true`" target="_blank" style="color: #ccc">	{{ this.crtTask.evName }}</a>			 -->
          <a
            :href="`https://work.damaiking.com/task/${crtTask.evID}?true`"
            target="_blank"
            style="color: #ccc"
            >{{ this.crtTask.evName }}</a
          >
        </div>
        <div class="pro" v-if="TYPE('计划任务')">{{ this.crtTask.name }}</div>
        <div class="btns">
          <!-- 催促完成任务提醒 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="催促完成任务提醒"
            placement="bottom"
          >
            <el-button
              @click="$modal.show(`${modalName}-urgeFinish`)"
              class="hiFont hi-tixing1"
              style="color:#ED7C6C"
              ><span
                style="font-size:12px"
                v-if="crtTask && crtTask.noticeCount && crtTask.noticeCount > 0"
                >(已提醒:{{ crtTask.noticeCount }}次)</span
              ></el-button
            >
          </el-tooltip>
          <!-- 刷新任务 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="刷新任务"
            placement="bottom"
          >
            <el-button
              @click="getTaskDetail({ reloadTab: true })"
              class="hiFont hi-refresh"
            ></el-button>
          </el-tooltip>

          <!-- 关注任务 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="关注任务"
            placement="bottom"
          >
            <el-button
              @click="infoExSubmit(1)"
              class="hiFont"
              :class="{
                'hi-star-in': crtTask.isAttention,
                'hi-star': !crtTask.isAttention,
              }"
            ></el-button>
          </el-tooltip>

          <!-- 复制链接 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="复制链接"
            placement="bottom"
          >
            <el-button
              v-clipboard:copy="`${$mainUrl}${url}`"
              v-clipboard:success="copySuccess"
              v-clipboard:error="copyError"
              class="hiFont hi-clip"
            ></el-button>
          </el-tooltip>

          <!-- 下拉菜单 -->
          <el-dropdown v-if="thisOpened" trigger="click" @command="menuCommand">
            <a class="el-dropdown-link hiFont hi-ellipsis"></a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="hiFont hi-move" command="move"
                >移动任务</el-dropdown-item
              >
              <el-dropdown-item icon="hiFont hi-move" command="changeF"
                >更换父任务</el-dropdown-item
              >
              <el-dropdown-item icon=" hiFont hi-relate" command="copy"
                >复制任务</el-dropdown-item
              >
              <el-dropdown-item icon="hiFont hi-bell" command="mention"
                >快速提醒</el-dropdown-item
              >
              <el-dropdown-item icon=" hiFont hi-punish" command="addKpi"
                >快速添加KPI</el-dropdown-item
              >
              <el-dropdown-item icon=" hiFont hi-punish" command="delayKpi"
                >延迟添加KPI</el-dropdown-item
              >
              <el-dropdown-item icon="hiFont hi-user-add" command="letAtn"
                >拉为关注</el-dropdown-item
              >
              <el-dropdown-item icon="hiFont hi-report" command="report"
                >添加简报</el-dropdown-item
              >
              <el-dropdown-item
                icon="hiFont hi-bell"
                command="setting"
                :disabled="!crtTask.isAttention"
                >关注通知设置</el-dropdown-item
              >
              <el-dropdown-item
                icon="hiFont hi-delete"
                command="delete"
                v-if="ROLE('主要人员')"
                divided
                >删除任务</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <s></s>
          <!-- 分割线 -->
          <a class="hiFont hi-close" @click="$modal.hide(modalName)"></a>
        </div>
      </template>

      <!-- 内容 -->
      <template v-if="crtTask">
        <!-- 基本信息区域 -->
        <div class="left">
          <div v-loading="loadStatus.info">
            <!-- 【移动端】开始审核 -->
            <div
              class="mb-review"
              v-if="
                ROLE('审核人') &&
                  crtTask.reviews[0] &&
                  crtTask.reviews[0].states == 3
              "
            >
              <el-button type="primary" @click="startReview(crtTask.reviews[0])"
                >存在申请，立即审核</el-button
              >
            </div>
            <!-- 名字 -->
            <div class="name">
              <div class="fatherName" v-if="crtTask.fjob" @click="toFJob()">
                父任务：{{ crtTask.fjob.fjobName }}
              </div>
              <div v-show="!infoCtrl.showNameEditor">
                <el-dropdown
                  v-if="crtTask.priority > 1"
                  trigger="click"
                  placement="bottom-start"
                  @command="infoSubmit(4, $event)"
                >
                  <span class="el-dropdown-link">
                    <a
                      class="priority"
                      :style="{
                        color: priority.color[1],
                        backgroundColor: priority.color[2],
                      }"
                    >
                      {{ priority.name }}
                    </a>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="prioritySelect full">
                    <el-dropdown-item
                      v-for="(item, i) in $D.LIST('g_priority')"
                      :key="i"
                      :command="item.value"
                    >
                      <span
                        class="item-tag"
                        :style="{
                          color: item.color[1],
                          backgroundColor: item.color[2],
                        }"
                      >
                        {{ item.name }}
                      </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="mb-review">
                  <a
                    class="ev"
                    :href="
                      `https://work.damaiking.com/task/${crtTask.evID}?true`
                    "
                    target="_blank"
                    >项目：{{ crtTask.evName }}</a
                  >
                </div>
                <span>
                  <el-tag
                    v-if="crtTask.kpi"
                    class="kpi-tag"
                    type="danger"
                    size="medium"
                    >KPI</el-tag
                  >
                  {{ crtTask.name }}
                  <a
                    class="el-icon-edit"
                    title="编辑任务名称"
                    @click="infoEdit(1)"
                  ></a>
                </span>
                <!-- 子任务列表 -->
                <ChildTaskList
                  :task="crtTask"
                  :fJobId="myJobID"
                  ref="childJob"
                  @changTaskID="beforInit($event)"
                />
              </div>
              <div v-show="infoCtrl.showNameEditor">
                <el-input
                  ref="inputName"
                  @blur="infoSubmit(1)"
                  @keyup.enter.native="infoSubmit(1)"
                  v-model="formTask.name"
                  placeholder="请输入任务名称，回车确认"
                ></el-input>
              </div>
            </div>
            <!-- 状态、执行人、上级负责人、审核人 -->
            <div class="people">
              <div class="single">
                <el-dropdown
                  trigger="click"
                  placement="bottom-start"
                  @command="changeStatus"
                  v-if="ROLE('主要人员')"
                >
                  <span class="el-dropdown-link">
                    <div class="block">
                      <div>
                        <i
                          class="status hiFont"
                          :class="status.icon"
                          :style="{ color: status.color }"
                        ></i>
                      </div>
                      <div>
                        <h3>{{ status.name }}</h3>
                        <div>任务状态</div>
                      </div>
                    </div>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="i in statusOptions"
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
                <div class="block" v-else>
                  <div>
                    <i
                      class="status hiFont"
                      :class="status.icon"
                      :style="{ color: status.color }"
                    ></i>
                  </div>
                  <div>
                    <h3>{{ status.name }}</h3>
                    <div>任务状态</div>
                  </div>
                </div>
              </div>
              <div class="single">
                <!-- @Confirm="memberSubmit(1, $event)" 改执行人
							 v-if="(TYPE('收款任务', false) && ROLE('主要人员')) || ROLE('创建者')"
                -->
                <!--       <MemberSelect
							       	:eid="crtTask.evID"
							       	:arrays="[crtTask.frontMan]"
							       	@Confirm="memberSubmit(1, $event)"
							       	:isSelection="false"
							       	:showActive="false"
							       >
							       	<div class="block" slot="button">
							       		<div>
							       			<img v-if="crtTask.frontMan.Picture" :src="this.$url + crtTask.frontMan.Picture" />
							       			<i v-else class="hiFont hi-user-task"></i>
							       		</div>
							       		<div>
							       			<h3 :class="{ empty: !crtTask.frontMan.UName }">{{ crtTask.frontMan.UName || '暂无' }}</h3>
							       			<div>任务执行人</div>
							       		</div>
							       	</div>
                </MemberSelect>-->
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="不能更换执行人,请使用右上角复制任务"
                  placement="top"
                >
                  <div class="block">
                    <div>
                      <img
                        v-if="crtTask.frontMan.Picture"
                        :src="this.$url + crtTask.frontMan.Picture"
                      />
                      <i v-else class="hiFont hi-user-task"></i>
                    </div>
                    <div>
                      <h3 :class="{ empty: !crtTask.frontMan.UName }">
                        {{ crtTask.frontMan.UName || "暂无" }}
                      </h3>
                      <div>任务执行人</div>
                    </div>
                  </div>
                </el-tooltip>
              </div>
              <div class="single">
                <!-- <MemberSelect
									:eid="crtTask.evID"
									:arrays="[crtTask.tester]"
									@Confirm="memberSubmit(2, $event)"
									:isSelection="false"
									:showActive="false"
									v-if="ROLE('主要人员')"
								>
									<div class="block" slot="button">
										<div>
											<img v-if="crtTask.tester.Picture" :src="this.$url + crtTask.tester.Picture" />
											<i v-else class="hiFont hi-user-task"></i>
										</div>
										<div>
											<h3 :class="{ empty: !crtTask.tester.UName }">{{ crtTask.tester.UName || '暂无' }}</h3>
											<div>质量审核人</div>
										</div>
									</div>
								</MemberSelect>
								<div class="block" v-else>
									<div>
										<img v-if="crtTask.tester.Picture" :src="this.$url + crtTask.tester.Picture" />
										<i v-else class="hiFont hi-user-task"></i>
									</div>
									<div>
										<h3 :class="{ empty: !crtTask.tester.UName }">{{ crtTask.tester.UName || '暂无' }}</h3>
										<div>质量审核人</div>
									</div>
								</div> -->
              </div>
              <div class="single">
                <!-- <MemberSelect
									:eid="crtTask.evID"
									:arrays="[crtTask.pntFrontMan]"
									@Confirm="memberSubmit(3, $event)"
									:isSelection="false"
									:showActive="false"
									v-if="ROLE('主要人员')"
								>
									<div class="block" slot="button">
										<div>
											<img v-if="crtTask.pntFrontMan.Picture" :src="this.$url + crtTask.pntFrontMan.Picture" />
											<i v-else class="hiFont hi-user-task"></i>
										</div>
										<div>
											<h3 :class="{ empty: !crtTask.pntFrontMan.UName }">{{ crtTask.pntFrontMan.UName || '暂无' }}</h3>
											<div>上级负责人</div>
										</div>
									</div>
								</MemberSelect>
								<div class="block" v-else>
									<div>
										<img v-if="crtTask.pntFrontMan.Picture" :src="this.$url + crtTask.pntFrontMan.Picture" />
										<i v-else class="hiFont hi-user-task"></i>
									</div>
									<div>
										<h3 :class="{ empty: !crtTask.pntFrontMan.UName }">{{ crtTask.pntFrontMan.UName || '暂无' }}</h3>
										<div>上级负责人</div>
									</div>
								</div> -->
              </div>
            </div>
            <!-- 基本信息 -->
            <div class="info">
              <!-- 关联KPI -->
              <div class="connect-kpi" v-if="crtTask.kpi">
                <h3>
                  <i class="hiFont hi-punish"></i>
                  <span>关联KPI</span>
                </h3>
                <div>
                  <el-button type="danger" class="kpi-btn">
                    <span @click="toKpi(crtTask.kpi)" class="kpi">{{
                      crtTask.kpi.Name
                    }}</span>
                    <i
                      class="hiFont hi-task"
                      @click="openTaskRelationDetail(crtTask.kpi)"
                    ></i>
                  </el-button>
                </div>
              </div>
              <!-- 任务期限 -->
              <div class="time">
                <h3>
                  <i class="hiFont hi-clock-cr"></i>
                  <span>任务期限</span>
                </h3>
                <div>
                  <div class="time-left">
                    <u>开始于：</u>
                    <el-date-picker
                      v-if="
                        !crtTask.startTime &&
                          ROLE('主要人员') &&
                          TYPE(['常规任务', '收款任务'])
                      "
                      v-model="formTask.startTime"
                      @change="infoSubmit(2)"
                      type="date"
                      placeholder="开始时间"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                    <span v-else-if="!crtTask.startTime && !ROLE('主要人员')"
                      ><b>开始时间未设置</b></span
                    >
                    <span v-else>{{
                      crtTask.startTime.timeFormat("yyyy 年 MM 月 dd 日")
                    }}</span>
                    <s>-</s>
                    <u>截止于：</u>
                    <el-date-picker
                      v-if="
                        !crtTask.endTime &&
                          ROLE('主要人员') &&
                          TYPE(['常规任务', '收款任务'])
                      "
                      v-model="formTask.endTime"
                      @change="infoSubmit(3)"
                      type="date"
                      placeholder="最终期限"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                    <span v-else-if="!crtTask.endTime && !ROLE('主要人员')"
                      ><b>最终期限未设置</b></span
                    >
                    <span v-else>{{
                      crtTask.endTime.timeFormat("yyyy 年 MM 月 dd 日")
                    }}</span>
                    <div class="qwq" @click="taskLoop2">
                      <span
                        class="hiFont hi-clock-cr"
                        style="color: #448EF5;"
                      ></span>
                      <span style="color: #F03E3E;font: 14px;"
                        >增加循环设置</span
                      >
                    </div>
                  </div>
                  <!-- 执行人其余安排 -->

                  <!-- 修改任务时间 -->
                  <div
                    v-if="ROLE('主要人员') && TYPE('常规任务')"
                    class="time-right"
                  >
                    <el-popover
                      popper-class="clear-time"
                      width="190"
                      v-model="infoCtrl.showClearTime"
                      v-if="ROLE('上级负责人')"
                    >
                      <p>
                        确认是否要把时间和预估耗时一并清除？
                        <span>(此操作不可逆)</span>
                      </p>
                      <div>
                        <el-button
                          size="mini"
                          type="text"
                          @click="infoCtrl.showClearTime = false"
                          >取消</el-button
                        >
                        <el-button type="primary" size="mini" @click="clearTime"
                          >确定</el-button
                        >
                      </div>
                      <a
                        class="btn"
                        slot="reference"
                        v-show="
                          crtTask.startTime ||
                            crtTask.endTime ||
                            crtTask.estimatedTime
                        "
                      >
                        <i class="hiFont hi-time-go"></i>
                        <p>清空时间</p>
                      </a>
                    </el-popover>
                    <el-popover
                      v-if="[4, 7].indexOf(crtTask.status) < 0 && thisOpened"
                      placement="top-end"
                      v-model="infoCtrl.showTimeEditor"
                    >
                      <h3 class="timeEditorTitle">申请修改时间</h3>
                      <el-form label-width="80px">
                        <el-form-item label="开始时间">
                          <el-date-picker
                            v-model="formTask.startTime"
                            type="date"
                            placeholder="开始时间"
                            format="yyyy年MM月dd日"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                          ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                          <el-date-picker
                            v-model="formTask.endTime"
                            type="date"
                            placeholder="截止时间"
                            format="yyyy年MM月dd日"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                          ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="预估耗时">
                          <el-input
                            v-model="formTask.estimatedTime"
                            placeholder="小数"
                          >
                            <i
                              slot="suffix"
                              class="el-input__icon"
                              style="margin-right: 0.5rem"
                              >小时</i
                            >
                          </el-input>
                        </el-form-item>
                        <el-form-item label="修改理由"
                          ><el-input
                            v-model="formMore.reasonTimeEdit"
                            type="textarea"
                            :rows="4"
                          ></el-input
                        ></el-form-item>
                        <el-form-item>
                          <el-button type="primary" @click="changeStatus(4)"
                            >提交</el-button
                          >
                          <el-button @click="infoCtrl.showTimeEditor = false"
                            >取消</el-button
                          >
                        </el-form-item>
                      </el-form>
                      <a
                        class="btn"
                        slot="reference"
                        v-show="crtTask.startTime && crtTask.estimatedTime"
                      >
                        <i class="hiFont hi-time-go"></i>
                        <p>修改时间</p>
                      </a>
                    </el-popover>
                  </div>
                </div>
              </div>
              <!-- 预计时间  -->
              <div class="time">
                <h3>
                  <i class="hiFont hi-clock-cr"></i>
                  <span>预计时间</span>
                </h3>
                <div>
                  <div class="time-left">
                    <u>预计开始：</u>
                    <span v-if="crtTask.estimateStartTime">{{
                      crtTask.estimateStartTime.timeFormat(
                        "yyyy 年 MM 月 dd 日"
                      )
                    }}</span>
                    <span v-else><b>暂无预计开始时间</b></span>
                    <s>-</s>
                    <u>预计完成：</u>
                    <span v-if="crtTask.PridictionTimes">{{
                      crtTask.PridictionTimes.timeFormat("yyyy 年 MM 月 dd 日")
                    }}</span>
                    <span v-else><b>暂无预计完成时间</b></span>
                    <el-tooltip
                      effect="dark"
                      content="此项为预计开始时间和完成时间,由系统自动计算出结果"
                      placement="top"
                    >
                      <i class="hiFont hi-question"></i>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <!-- 预估耗时 实际耗时-->
              <div class="estimate" v-if="TYPE('常规任务')">
                <h3>
                  <i class="hiFont hi-plan-o"></i>
                  <span>耗时</span>
                </h3>
                <div>
                  <u>实际耗时：</u>
                  <b
                    >{{
                      crtTask.actualTime < 0 ? 0 : crtTask.actualTime
                    }}小时</b
                  >
                  <s>/</s>
                  <u>预计耗时：</u>
                  <a
                    v-if="
                      !crtTask.estimatedTime &&
                        ROLE('主要人员') &&
                        !infoCtrl.showEstimateEditor &&
                        !crtTask.jobChild.length
                    "
                    class="btn"
                    @click="infoEdit(6)"
                  >
                    填写耗时
                  </a>
                  <b
                    v-else-if="
                      (!crtTask.estimatedTime &&
                        ROLE('主要人员') &&
                        !infoCtrl.showEstimateEditor &&
                        crtTask.jobChild.length) ||
                        (!crtTask.estimatedTime && !ROLE('主要人员'))
                    "
                  >
                    未设置
                  </b>
                  <b
                    v-else-if="
                      crtTask.estimatedTime && !infoCtrl.showEstimateEditor
                    "
                    >{{ `${crtTask.estimatedTime}小时` }}</b
                  >
                  <el-tooltip
                    effect="dark"
                    content="实际耗时/预估耗时"
                    placement="top"
                  >
                    <i
                      class="hiFont hi-question"
                      v-show="!infoCtrl.showEstimateEditor"
                    ></i>
                  </el-tooltip>
                  <div v-show="infoCtrl.showEstimateEditor">
                    <el-input
                      type="number"
                      ref="inputEstimate"
                      @keyup.enter="infoSubmit(6)"
                      v-model="formTask.estimatedTime"
                      placeholder="小数"
                    >
                      <i slot="suffix" class="el-input__icon">小时</i>
                    </el-input>
                    <a @click="infoSubmit(6)" class="primary">确认</a>
                    <a @click="infoCtrl.showEstimateEditor = false">取消</a>
                  </div>
                  <!--标准预计耗时  -->
                  <s></s>
                  <span class="standard-time"><b>标准预计耗时</b></span>
                  <u>标准预计耗时：</u>
                  <b
                    class="standard-time-show"
                    v-show="!infoCtrl.showStandardEditor"
                  >
                    {{
                      crtTask.standardEstime
                        ? `${crtTask.standardEstime}小时`
                        : "未设置"
                    }}
                  </b>
                  <a
                    style="position: absolute; right: 0"
                    v-if="ROLE('上级负责人') && !infoCtrl.showStandardEditor"
                    class="btn"
                    @click="infoEdit(7)"
                    >修改标准</a
                  >
                  <div v-show="infoCtrl.showStandardEditor">
                    <el-input
                      type="number"
                      ref="inputStandard"
                      @keyup.enter="infoSubmit(9)"
                      v-model="formTask.standardEstime"
                      placeholder="小数"
                    >
                      <i slot="suffix" class="el-input__icon">小时</i>
                    </el-input>
                    <a @click="infoSubmit(9)" class="primary">确认</a>
                    <a @click="infoCtrl.showStandardEditor = false">取消</a>
                  </div>
                </div>
              </div>
              <!-- 必须加班 -->
              <div class="priority">
                <h3>
                  <i class="hiFont hi-priority"></i>
                  <span>必须加班</span>
                </h3>
                <div>
                  <el-dropdown
                    trigger="click"
                    placement="bottom-start"
                    @command="infoSubmit(10, $event)"
                  >
                    <span class="el-dropdown-link">
                      <a
                        class="btn"
                        style="background-color: #f0f9eb;color: #67c23a;"
                        v-if="crtTask.operate"
                        >是</a
                      >
                      <a
                        class="btn"
                        style="background-color: #fef0f0;color: #f56c6c;"
                        v-else
                        >否</a
                      >
                    </span>
                    <el-dropdown-menu
                      slot="dropdown"
                      class="prioritySelect"
                      v-if="ROLE('主要人员')"
                    >
                      <el-dropdown-item :key="0" :command="true">
                        <span
                          class="item-tag"
                          style="background-color: #f0f9eb;color: #67c23a;"
                          >是</span
                        >
                      </el-dropdown-item>
                      <el-dropdown-item :key="1" :command="false">
                        <span
                          class="item-tag"
                          style="background-color: #fef0f0;color: #f56c6c;"
                          >否</span
                        >
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <!-- 收款金额 -->
              <div class="money" v-if="crtTask.childType == 2">
                <h3>
                  <i class="hiFont hi-money-copy"></i>
                  <span>收款金额</span>
                </h3>
                <div>
                  <b
                    >{{ crtTask.receviedMoney }} /
                    {{ crtTask.money.toFixed(2) }}</b
                  >
                </div>
              </div>
              <!-- 收款进度-->
              <div class="progress" v-if="crtTask.childType == 2">
                <h3>
                  <i class="hiFont hi-progress"></i>
                  <span>收款进度</span>
                </h3>
                <div>
                  <div class="progress-item">
                    <el-progress
                      color="rgba(19, 194, 194, 1)"
                      text-inside
                      :stroke-width="23"
                      :percentage="0"
                    ></el-progress>
                  </div>
                </div>
              </div>
              <!-- 完成进度 耗时比-->
              <div class="progress" v-if="crtTask.childType == 1">
                <h3>
                  <i class="hiFont hi-progress"></i>
                  <span>进度{{ showProgress }}</span>
                </h3>
                <div>
                  <div class="progress-item">
                    <el-progress
                      :color="
                        crtTask.progress == 100 && crtTask.status != 7
                          ? '#F56C6C'
                          : 'rgba(68, 142, 245, 1)'
                      "
                      text-inside
                      :stroke-width="23"
                      :percentage="crtTask.progress > 0 ? crtTask.progress : 0"
                    ></el-progress>
                    <span>完成度</span>
                  </div>
                  <div class="progress-item">
                    <el-progress
                      color="rgba(19, 194, 194, 1)"
                      text-inside
                      :stroke-width="23"
                      :percentage="
                        crtTask.spentTimeRatio < 0 ? 0 : crtTask.spentTimeRatio
                      "
                    ></el-progress>
                    <span>耗时比例</span>
                  </div>
                </div>
              </div>
              <!-- 描述 -->
              <div
                class="des"
                :class="{
                  titleTop: infoCtrl.showDesEditor || crtTask.description,
                }"
              >
                <h3>
                  <i class="hiFont hi-task"></i>
                  <span>描述</span>
                </h3>
                <div>
                  <a
                    class="btn"
                    v-show="!infoCtrl.showDesEditor"
                    @click="infoEdit(5)"
                    >{{ crtTask.description ? "修改描述" : "添加描述" }}</a
                  >
                  <XFroalaView
                    :html="crtTask.description"
                    v-show="crtTask.description && !infoCtrl.showDesEditor"
                    @click="infoCtrl.showDesEditor = true"
                  ></XFroalaView>
                  <div v-show="infoCtrl.showDesEditor">
                    <XFroala
                      ref="editorDes"
                      v-model="formTask.description"
                      placeholder="请输入任务的具体内容"
                    ></XFroala>
                    <div class="des-btns">
                      <el-button type="primary" @click="infoSubmit(5)"
                        >确认修改</el-button
                      >
                      <el-button
                        @click="formTask.description = crtTask.description"
                        >重置</el-button
                      >
                      <el-button @click="infoCtrl.showDesEditor = false"
                        >取消</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <!-- 优先级 -->
              <div class="priority">
                <h3>
                  <i class="hiFont hi-priority"></i>
                  <span>优先级</span>
                </h3>
                <div>
                  <el-dropdown
                    trigger="click"
                    placement="bottom-start"
                    @command="infoSubmit(4, $event)"
                  >
                    <span class="el-dropdown-link">
                      <a
                        class="btn"
                        :style="{
                          color: priority.color[1],
                          backgroundColor: priority.color[2],
                        }"
                      >
                        {{ priority.name }}
                      </a>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="prioritySelect">
                      <el-dropdown-item
                        v-for="(item, i) in $D.LIST('g_priority')"
                        :key="i"
                        :command="item.value"
                      >
                        <span
                          class="item-tag"
                          :style="{
                            color: item.color[1],
                            backgroundColor: item.color[2],
                          }"
                        >
                          {{ item.name }}
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <!-- 标签 -->
              <div class="tag" v-if="TYPE('常规任务')">
                <h3>
                  <i class="hiFont hi-tag"></i>
                  <span>标签</span>
                </h3>
                <div>
                  <ul>
                    <li v-for="(item, i) in crtTask.tags" :key="i">
                      <span>{{ item.Name }}</span>
                      <a @click="setTab(item, i)" class="hiFont hi-close"></a>
                    </li>
                    <el-dropdown
                      trigger="click"
                      placement="bottom-start"
                      :hide-on-click="false"
                      @command="setTab"
                    >
                      <span class="el-dropdown-link">
                        <a v-if="crtTask.tags.length == 0" class="btn"
                          >添加标签</a
                        >
                        <a v-else class="btn btn-auto hiFont hi-add"></a>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-for="(item, i) in formMore.tags"
                          :key="i"
                          :command="item"
                          class="has-right-icon"
                        >
                          <span>{{ item.Name }}</span>
                          <i
                            v-if="isTagSelected(item.JTId)"
                            class="hiFont hi-yes-lg"
                          ></i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </ul>
                </div>
              </div>

              <!-- 退款任务 分割线 -->
              <template v-if="crtTask.childType == 3">
                <div style="border-top: 1px solid #eee;width: 100%;"></div>
                <!-- 退款金额 -->
                <div class="priority">
                  <h3>
                    <i class="hiFont hi-priority"></i>
                    <span>退款金额</span>
                  </h3>
                  <div v-show="!infoCtrl.refundAmountEditor">
                    <b v-if="crtTask.refundAmount != null"
                      >{{ crtTask.refundAmount }}元</b
                    >
                    <b v-else>未设置</b>
                    <a
                      v-if="ROLE('主要人员')"
                      class="el-icon-edit"
                      title="编辑金额"
                      ref="refundAmount"
                      @click="infoEdit(9)"
                    ></a>
                  </div>
                  <div v-show="infoCtrl.refundAmountEditor">
                    <el-input
                      style="width: 22rem;"
                      placeholder="输入金额,回车确认"
                      v-model="formTask.refundAmount"
                      type="number"
                      @keyup.enter.native="infoSubmit(15)"
                    >
                      <template slot="append">
                        元
                      </template>
                    </el-input>
                  </div>
                </div>
                <!-- 退款比例 -->
                <div class="priority">
                  <h3>
                    <i class="hiFont hi-priority"></i>
                    <span>退款比例</span>
                  </h3>
                  <div v-show="!infoCtrl.refundRatioEditor">
                    <b v-if="crtTask.refundRatio != null"
                      >{{ crtTask.refundRatio }}%</b
                    >
                    <b v-else>未设置</b>
                    <a
                      v-if="ROLE('主要人员')"
                      class="el-icon-edit"
                      title="编辑比例"
                      @click="infoEdit(10)"
                    ></a>
                  </div>
                  <div v-show="infoCtrl.refundRatioEditor">
                    <el-input
                      style="width: 22rem;"
                      placeholder="输入比例,回车确认"
                      ref="refundRatio"
                      v-model="formTask.refundRatio"
                      type="number"
                      @keyup.enter.native="infoSubmit(16)"
                    >
                      <template slot="append">
                        %
                      </template>
                    </el-input>
                  </div>
                </div>
                <!-- 退款时间 -->
                <div class="priority">
                  <h3>
                    <i class="hiFont hi-priority"></i>
                    <span>退款时间</span>
                  </h3>
                  <div>
                    <el-date-picker
                      v-if="!crtTask.refundTime && ROLE('主要人员')"
                      v-model="formTask.refundTime"
                      @change="infoSubmit(11)"
                      type="datetime"
                      placeholder="退款时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                    <span v-else-if="!crtTask.refundTime && !ROLE('主要人员')"
                      ><b>退款时间未设置</b></span
                    >
                    <span v-else style="font-size: 2rem;">{{
                      crtTask.refundTime.timeFormat("yyyy 年 MM 月 dd 日")
                    }}</span>
                  </div>
                </div>
                <!-- 退款状态 -->
                <div class="priority">
                  <h3>
                    <i class="hiFont hi-priority"></i>
                    <span>退款状态</span>
                  </h3>
                  <div>
                    <el-dropdown
                      trigger="click"
                      placement="bottom-start"
                      @command="infoSubmit(12, $event)"
                    >
                      <span class="el-dropdown-link">
                        <a
                          class="btn"
                          :style="{
                            cursor: ROLE('主要人员')
                              ? 'pointer'
                              : 'not-allowed',
                            color: $D.ITEM(
                              'task_refund_status',
                              crtTask.refundStatus
                            ).color[1],
                            background: $D.ITEM(
                              'task_refund_status',
                              crtTask.refundStatus
                            ).color[2],
                          }"
                          v-if="crtTask.refundStatus != null"
                        >
                          {{
                            $D.ITEM("task_refund_status", crtTask.refundStatus)
                              .name
                          }}
                        </a>
                        <a
                          class="btn"
                          :style="{
                            cursor: ROLE('主要人员')
                              ? 'pointer'
                              : 'not-allowed',
                          }"
                          style="color: rgb(155, 155, 155);background-color: rgb(242, 242, 242);"
                          v-else
                        >
                          选择状态
                        </a>
                      </span>
                      <el-dropdown-menu
                        slot="dropdown"
                        class="prioritySelect"
                        v-if="ROLE('主要人员')"
                      >
                        <el-dropdown-item
                          v-for="(item, i) in $D.LIST('task_refund_status')"
                          :key="i"
                          :command="item.value"
                        >
                          <span
                            class="item-tag"
                            :style="{
                              color: item.color[1],
                              backgroundColor: item.color[2],
                            }"
                          >
                            {{ item.name }}
                          </span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <!-- 退款类型 -->
                <div class="priority" v-if="crtTask.refundStatus == 3">
                  <h3>
                    <i class="hiFont hi-priority"></i>
                    <span>退款类型</span>
                  </h3>
                  <div>
                    <el-dropdown
                      trigger="click"
                      placement="bottom-start"
                      @command="infoSubmit(13, $event)"
                    >
                      <span class="el-dropdown-link">
                        <a
                          class="btn"
                          :style="{
                            cursor: ROLE('主要人员')
                              ? 'pointer'
                              : 'not-allowed',
                          }"
                          style="color: rgb(155, 155, 155);background-color: rgb(242, 242, 242);width: auto; padding: 0 1rem;"
                          v-if="crtTask.refundType != null"
                        >
                          {{
                            $D.ITEM("task_refund_types", crtTask.refundType)
                              .name
                          }}
                        </a>
                        <a
                          class="btn"
                          :style="{
                            cursor: ROLE('主要人员')
                              ? 'pointer'
                              : 'not-allowed',
                          }"
                          style="color: rgb(155, 155, 155);background-color: rgb(242, 242, 242);"
                          v-else
                        >
                          选择类型
                        </a>
                      </span>
                      <el-dropdown-menu
                        slot="dropdown"
                        class="prioritySelect"
                        v-if="ROLE('主要人员')"
                      >
                        <el-dropdown-item
                          v-for="(item, i) in $D.LIST('task_refund_types')"
                          :key="i"
                          :command="item.value"
                        >
                          <span
                            class="item-tag"
                            style="width: auto;"
                            :style="{
                              color: item.color[1],
                              backgroundColor: item.color[2],
                            }"
                          >
                            {{ item.name }}
                          </span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <!-- 退款原因 -->
                <div class="des">
                  <h3>
                    <i class="hiFont hi-task"></i>
                    <span>退款原因</span>
                  </h3>
                  <div>
                    <a
                      class="btn"
                      v-show="!infoCtrl.showRefundEditor"
                      @click="infoEdit(8)"
                      >{{ crtTask.refundReason ? "修改原因" : "添加原因" }}</a
                    >
                    <XFroalaView
                      :html="crtTask.refundReason"
                      v-show="
                        crtTask.refundReason && !infoCtrl.showRefundEditor
                      "
                      @click="infoCtrl.showRefundEditor = true"
                    ></XFroalaView>
                    <div v-show="infoCtrl.showRefundEditor">
                      <XFroala
                        ref="editorDes"
                        v-model="formTask.refundReason"
                        placeholder="请输入任务的具体内容"
                      ></XFroala>
                      <div class="des-btns">
                        <el-button type="primary" @click="infoSubmit(14)"
                          >确认修改</el-button
                        >
                        <el-button
                          @click="formTask.refundReason = crtTask.refundReason"
                          >重置</el-button
                        >
                        <el-button @click="infoCtrl.showRefundEditor = false"
                          >取消</el-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- 创建者 -->
              <div class="creator">
                {{ crtTask.creator.name }} 创建于
                {{ crtTask.createTime.timeFormat("yyyy年MM月dd日 HH:mm") }}
              </div>
              <div class="creator" v-if="crtTask.actualStartTime">
                任务实际 开始于
                {{ crtTask.actualStartTime.timeFormat("yyyy年MM月dd日 HH:mm") }}
              </div>
              <div class="creator" v-if="crtTask.actualEndTime">
                任务实际 结束于
                {{ crtTask.actualEndTime.timeFormat("yyyy年MM月dd日 HH:mm") }}
              </div>
            </div>
            <!-- 参与者 -->
            <div class="participant">
              <h3>
                <span
                  >参与者（{{
                    crtTask.participant ? crtTask.participant.length : 0
                  }}）</span
                >
                <a v-if="TYPE('计划任务')">下发任务</a>
              </h3>
              <MemberSelect
                :eid="crtTask.evID"
                :arrays="crtTask.participant"
                @Confirm="memberSubmit(4, $event)"
              ></MemberSelect>
            </div>
            <!-- 关注者 -->
            <div
              class="concern"
              v-if="crtTask.attention && crtTask.attention.length > 0"
            >
              <h3>
                <span>关注了此任务的人（{{ crtTask.attention.length }}）</span>
              </h3>
              <MemberSelect readonly :arrays="crtTask.attention"></MemberSelect>
            </div>
            <!-- 任务关系图 -->
            <div class="relation" v-if="relationArr.length">
              <h3>
                <span>任务关系图</span>
                <div>
                  <el-radio v-model="relationType" :label="1"
                    >步骤信息</el-radio
                  >
                  <el-radio v-model="relationType" :label="2"
                    >任务信息</el-radio
                  >
                </div>
              </h3>
              <taskRelation
                :sourceData="relationArr"
                :type="relationType"
                @openTask="openTaskRelationDetail"
                :JId="myJobID"
              ></taskRelation>
            </div>

            <!-- 进度走势 -->
            <div class="planChart" v-if="TYPE('计划任务')">
              <div ref="planChart"></div>
            </div>
          </div>
        </div>

        <!-- 选项卡区域 -->
        <div class="right" id="detail">
          <div>
            <el-tabs
              v-model="tabCtrl.tabActive"
              :stretch="true"
              @tab-click="toggleTab"
            >
              <!-- 子任务选项 -->
              <el-tab-pane :name="TAB_TYPE.NEWLIST">
                <span slot="label">
                  <i class="hiFont work hi-projects-o"></i>
                  子任务
                </span>
                <!-- {{myJobID}}{{crtTask}} -->
                <!-- 子任务列表 -->

                <ChildTaskList
                  :isFlag="true"
                  :task="crtTask"
                  :fJobId="myJobID"
                  ref="childJob"
                  :isChildTask="false"
                  @changTaskID="beforInit($event)"
                />
              </el-tab-pane>
              <!-- 评论 -->
              <el-tab-pane :name="TAB_TYPE.COMMENT">
                <span slot="label">
                  <i class="hiFont hi-msg hide-mobile"></i>
                  评论
                </span>
                <comment
                  ref="comment"
                  :loadAll="loading.commentFirst"
                  :onTurnPage="loading.comment"
                  :noMore="loaded.comment"
                  v-model="crtTask.comments"
                  @turnPage="loadTab(TAB_TYPE.COMMENT, 0)"
                  @sendComment="sendComment"
                  :evID="crtTask.evID"
                ></comment>
              </el-tab-pane>

              <!-- 审核 -->
              <el-tab-pane :name="TAB_TYPE.REVIEW" v-if="false">
                <span slot="label">
                  <i class="hiFont hi-review hide-mobile"></i>
                  审核
                </span>
                <div class="reviews" v-loading="loading.reviewFirst">
                  <div
                    v-if="crtTask.reviews.length > 0"
                    class="revCtn"
                    v-infinite-scroll="loadTabFn(TAB_TYPE.REVIEW)"
                    :infinite-scroll-disabled="disableScrollLoad.review"
                  >
                    <!-- 列表区域 -->
                    <ul v-if="!formMore.review">
                      <li
                        v-for="(item, i) in crtTask.reviews"
                        :key="i"
                        :class="{ un: item.states == 3 && ROLE('审核人') }"
                      >
                        <div
                          class="single"
                          :class="{ un: item.states == 3 && ROLE('审核人') }"
                        >
                          <i class="hiFont hi-review"></i>
                          <div v-if="item.states == 3">
                            <h3>
                              <span>{{ item.applicantIdName }}</span>
                              <small>提交了申请</small>
                              <a
                                v-if="ROLE('审核人')"
                                @click="startReview(item)"
                                >立即审核</a
                              >
                            </h3>
                            <div>
                              <div>
                                <h4>申请类型：</h4>
                                <b>{{
                                  item.checkType | formatReviewType($D)
                                }}</b>
                              </div>
                              <div>
                                <h4>申请时间：</h4>
                                <span>
                                  {{
                                    new Date(item.auditTime).getFullYear() ==
                                    new Date().getFullYear()
                                      ? item.auditTime.timeFormat(
                                          "M月d日 HH:mm"
                                        )
                                      : item.auditTime.timeFormat(
                                          "yyyy年M月d日 HH:mm"
                                        )
                                  }}
                                </span>
                              </div>
                              <div
                                class="rows"
                                v-if="
                                  $D.CHECK(
                                    'task_review_type',
                                    '修改时间',
                                    item.checkType
                                  ) &&
                                    (item.dpStime ||
                                      item.dpTime ||
                                      item.estimateTime)
                                "
                              >
                                <h4>修改时间：</h4>
                                <div>
                                  <span v-if="item.dpStime"
                                    >开始于
                                    {{
                                      item.dpStime.timeFormat("yyyy年MM月dd日")
                                    }}</span
                                  >
                                  <span v-if="item.dpTime"
                                    >截止于
                                    {{
                                      item.dpTime.timeFormat("yyyy年MM月dd日")
                                    }}</span
                                  >
                                  <span v-if="item.estimateTime"
                                    >预计要 {{ item.estimateTime }}小时</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else>
                            <h3>
                              <span>{{ item.applicantIdName }}</span>
                              <small>提交的申请</small>
                              <time>
                                {{
                                  new Date(item.auditTime).getFullYear() ==
                                  new Date().getFullYear()
                                    ? item.auditTime.timeFormat("M月d日 HH:mm")
                                    : item.auditTime.timeFormat(
                                        "yyyy年M月d日 HH:mm"
                                      )
                                }}
                              </time>
                            </h3>
                            <div>
                              <div>
                                <h4>审核结果：</h4>
                                <b
                                  :class="{
                                    yes: $D.CHECK(
                                      'task_review_res',
                                      '通过',
                                      item.states
                                    ),
                                    no: $D.CHECK(
                                      'task_review_res',
                                      '驳回',
                                      item.states
                                    ),
                                  }"
                                >
                                  {{ item.states | formatReviewStatus }}
                                </b>
                              </div>
                              <div>
                                <h4>申请类型：</h4>
                                <span>{{
                                  item.checkType | formatReviewType($D)
                                }}</span>
                              </div>
                              <div v-if="item.states != 4">
                                <h4>审核成员：</h4>
                                <span>{{ item.reviewerId }}</span>
                              </div>
                              <div
                                v-if="
                                  $D.CHECK(
                                    'task_review_type',
                                    '修改时间',
                                    item.checkType
                                  ) &&
                                    (item.dpStime ||
                                      item.dpTime ||
                                      item.estimateTime)
                                "
                                class="rows"
                              >
                                <h4>修改时间：</h4>
                                <div>
                                  <span v-if="item.dpStime"
                                    >开始于
                                    {{
                                      item.dpStime.timeFormat("yyyy年MM月dd日")
                                    }}</span
                                  >
                                  <span v-if="item.dpTime"
                                    >截止于
                                    {{
                                      item.dpTime.timeFormat("yyyy年MM月dd日")
                                    }}</span
                                  >
                                  <span v-if="item.estimateTime"
                                    >预计要 {{ item.estimateTime }}小时</span
                                  >
                                </div>
                              </div>
                              <div v-if="item.apReason" class="reason">
                                <h4>申请原因：</h4>
                                <span>{{ item.apReason }}</span>
                              </div>
                              <div v-if="item.qualityScore">
                                <h4>质量评分：</h4>
                                <el-rate
                                  v-model="item.qualityScore"
                                  disabled
                                  allow-half
                                ></el-rate>
                                <span>{{
                                  item.qualityScore | formatScore
                                }}</span>
                                <em>{{ item.qualityScore }}分</em>
                              </div>
                              <div v-if="item.efficiencyScore">
                                <h4>效率评分：</h4>
                                <el-rate
                                  v-model="item.efficiencyScore"
                                  disabled
                                  allow-half
                                ></el-rate>
                                <span>{{
                                  item.efficiencyScore | formatScore
                                }}</span>
                                <em>{{ item.efficiencyScore }}分</em>
                              </div>
                              <div
                                v-if="
                                  item.comment &&
                                    item.comment.length > 0 &&
                                    item.comment[0].cmMess
                                "
                                class="reason"
                              >
                                <h4
                                  v-if="
                                    item.states == 1 &&
                                      $D.CHECK(
                                        'task_review_type',
                                        '任务核查',
                                        item.checkType
                                      )
                                  "
                                >
                                  审核评语：
                                </h4>
                                <h4
                                  v-if="
                                    item.states == 1 &&
                                      !$D.CHECK(
                                        'task_review_type',
                                        '任务核查',
                                        item.checkType
                                      )
                                  "
                                >
                                  审核留言：
                                </h4>
                                <h4 v-if="item.states == 2">驳回原因：</h4>
                                <span>{{ item.comment[0].cmMess }}</span>
                              </div>
                              <div
                                v-if="
                                  $D.CHECK(
                                    'task_review_type',
                                    '任务核查',
                                    item.checkType
                                  ) &&
                                    item.contents &&
                                    item.contents.length > 0
                                "
                                class="rows"
                              >
                                <h4
                                  v-if="
                                    $D.CHECK(
                                      'task_review_res',
                                      '通过',
                                      item.states
                                    )
                                  "
                                >
                                  补充内容：
                                </h4>
                                <h4
                                  v-if="
                                    $D.CHECK(
                                      'task_review_res',
                                      '驳回',
                                      item.states
                                    )
                                  "
                                >
                                  修改内容：
                                </h4>
                                <div>
                                  <span
                                    v-for="(sub, j) in item.contents"
                                    :key="j"
                                  >
                                    <h5>
                                      {{
                                        sub.AtId
                                          | formatReviewContentType(
                                            formMore.reviewType
                                          )
                                      }}
                                    </h5>
                                    <div>{{ sub.Content }}</div>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li v-if="loading.review" class="g-loading">
                        <i class="el-icon-loading"></i>
                        加载中...
                      </li>
                      <li v-if="loaded.review" class="g-loaded">已全部加载</li>
                    </ul>

                    <!-- 审核操作区域 -->
                    <div v-else class="reviewArea">
                      <div class="single in">
                        <i class="hiFont hi-review"></i>
                        <div>
                          <h3>
                            <span>{{ formMore.review.applicantIdName }}</span>
                            <small>提交了申请</small>
                            <time>
                              {{
                                new Date(
                                  formMore.review.auditTime
                                ).getFullYear() == new Date().getFullYear()
                                  ? formMore.review.auditTime.timeFormat(
                                      "M月d日 HH:mm"
                                    )
                                  : formMore.review.auditTime.timeFormat(
                                      "yyyy年M月d日 HH:mm"
                                    )
                              }}
                            </time>
                          </h3>
                          <div>
                            <div>
                              <h4>申请类型：</h4>
                              <b>{{
                                formMore.review.checkType | formatReviewType($D)
                              }}</b>
                            </div>
                            <div
                              class="rows"
                              v-if="
                                $D.CHECK(
                                  'task_review_type',
                                  '修改时间',
                                  formMore.review.checkType
                                ) &&
                                  (formMore.review.dpStime ||
                                    formMore.review.dpTime ||
                                    formMore.review.estimateTime)
                              "
                            >
                              <h4>修改时间：</h4>
                              <div>
                                <span v-if="formMore.review.dpStime"
                                  >开始于
                                  {{
                                    formMore.review.dpStime.timeFormat(
                                      "yyyy年MM月dd日"
                                    )
                                  }}</span
                                >
                                <span v-if="formMore.review.dpTime"
                                  >截止于
                                  {{
                                    formMore.review.dpTime.timeFormat(
                                      "yyyy年MM月dd日"
                                    )
                                  }}</span
                                >
                                <span v-if="formMore.review.estimateTime"
                                  >预计要
                                  {{ formMore.review.estimateTime }}小时</span
                                >
                              </div>
                            </div>
                            <div v-if="false"><h4>历史时间：</h4></div>
                            <div v-if="formMore.review.apReason">
                              <h4>申请原因：</h4>
                              <span>{{ formMore.review.apReason }}</span>
                            </div>
                            <div>
                              <h4>审核结果：</h4>
                              <el-switch
                                v-model="formMore.review.states"
                                active-color="#448EF5"
                                inactive-color="#fc4c4d"
                                :active-value="1"
                                :inactive-value="2"
                              ></el-switch>
                              <span>{{
                                formMore.review.states | formatReviewStatus
                              }}</span>
                            </div>
                            <div
                              v-if="
                                $D.CHECK(
                                  'task_review_type',
                                  '任务核查',
                                  formMore.review.checkType
                                )
                              "
                            >
                              <h4>质量评分：</h4>
                              <el-rate
                                v-model="formMore.review.qualityScore"
                                allow-half
                              ></el-rate>
                              <span>{{
                                formMore.review.qualityScore | formatScore
                              }}</span>
                              <em>{{ formMore.review.qualityScore }}分</em>
                            </div>
                            <div
                              v-if="
                                $D.CHECK(
                                  'task_review_type',
                                  '任务核查',
                                  formMore.review.checkType
                                )
                              "
                            >
                              <h4>效率评分：</h4>
                              <el-rate
                                v-model="formMore.review.efficiencyScore"
                                allow-half
                              ></el-rate>
                              <span>{{
                                formMore.review.efficiencyScore | formatScore
                              }}</span>
                              <em>{{ formMore.review.efficiencyScore }}分</em>
                            </div>

                            <div class="msg">
                              <h4
                                v-if="
                                  formMore.review.states == 1 &&
                                    $D.CHECK(
                                      'task_review_type',
                                      '任务核查',
                                      formMore.review.checkType
                                    )
                                "
                              >
                                填写评语：
                              </h4>
                              <h4
                                v-if="
                                  formMore.review.states == 1 &&
                                    !$D.CHECK(
                                      'task_review_type',
                                      '任务核查',
                                      formMore.review.checkType
                                    )
                                "
                              >
                                填写留言：
                              </h4>
                              <h4 v-if="formMore.review.states == 2">
                                驳回原因：
                              </h4>
                              <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 5 }"
                                placeholder="请输入评语或者留言"
                                v-model="formMore.reviewCmt"
                              ></el-input>
                            </div>

                            <div
                              class="extend"
                              v-if="
                                $D.CHECK(
                                  'task_review_type',
                                  '任务核查',
                                  formMore.review.checkType
                                )
                              "
                            >
                              <h3>
                                <div v-if="formMore.review.states == 1">
                                  审核通过，还需要扩展其余内容
                                </div>
                                <div v-else>审核不通过，请补充需要修改的点</div>
                                <a @click="addReviewCtn()">
                                  <span>再加一条</span>
                                  <i class="hiFont hi-extend-cr"></i>
                                </a>
                              </h3>
                              <ul>
                                <li
                                  v-for="(item, i) in formMore.review.contents"
                                  :key="i"
                                >
                                  <el-input
                                    placeholder="请输入内容"
                                    v-model="item.Content"
                                    class="input-with-select"
                                  >
                                    <el-select
                                      slot="prepend"
                                      v-model="item.Type"
                                    >
                                      <el-option
                                        v-for="(item, i) in formMore.reviewType"
                                        :key="i"
                                        :label="item.Name"
                                        :value="item.AtId"
                                      ></el-option>
                                    </el-select>
                                    <el-button
                                      slot="append"
                                      class="hiFont hi-delete"
                                      @click="removeReviewCtn(i)"
                                    ></el-button>
                                  </el-input>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <el-button
                          @click="submitReview(true)"
                          type="primary"
                          :loading="infoCtrl.loadingRevBtn"
                          >确认审核</el-button
                        >
                        <el-button @click="submitReview(false)">取消</el-button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="no-ctn">
                    <div>
                      <img src="@/assets/img/emptyTask.png" />
                      <div>还没有任何审核申请</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <!-- 附件 -->
              <el-tab-pane :name="TAB_TYPE.ANNEX">
                <span slot="label">
                  <i class="hiFont hi-clip hide-mobile"></i>
                  附件
                </span>
                <file-list
                  :gloaded="loaded.annex"
                  :gloading="loading.annex"
                  @loadFile="loadTabFn(TAB_TYPE.ANNEX)"
                  :file-data="crtTask.annexs"
                  :ROLE="ROLE('主要人员')"
                  @result="upChange"
                  @deleFile="deleteFile"
                ></file-list>
              </el-tab-pane>
              <!-- 日报-->
              <el-tab-pane :name="TAB_TYPE.DAILY">
                <span slot="label">
                  <i class="hiFont hi-report hide-mobile"></i>
                  日报
                </span>
                <div
                  class="dailys"
                  v-loading="loading.dailyFirst"
                  v-infinite-scroll="loadTabFn(TAB_TYPE.DAILY)"
                  :infinite-scroll-disabled="disableScrollLoad.dynamic"
                >
                  <div v-if="crtTask.dailys.length" class="d-container">
                    <div class="single" v-for="d in crtTask.dailys">
                      <div class="isOverTime" v-if="d.isOverTime">加班</div>
                      <div>
                        <div class="proress">
                          <span>时间</span>
                          <p>
                            {{ d.releaseTime.timeFormat("yyyy年MM月dd日") }}
                          </p>
                        </div>
                        <div class="proress">
                          <span>进度</span>
                          <el-progress
                            text-inside
                            :stroke-width="20"
                            :percentage="d.progress"
                          ></el-progress>
                        </div>
                      </div>
                      <div>
                        <div class="proress">
                          <span>任务名</span>
                          <p>{{ d.name }}</p>
                        </div>
                        <div class="proress">
                          <span>耗时</span>
                          <p>{{ d.spentTime }}h</p>
                        </div>
                      </div>
                      <div>
                        <span>工作详情</span>
                        <p>{{ d.content ? d.content : "暂未填写" }}</p>
                      </div>
                    </div>
                    <div v-if="loading.daily" class="g-loading">
                      <i class="el-icon-loading"></i>
                      加载中...
                    </div>
                    <div v-if="loaded.daily" class="g-loaded">已全部加载</div>
                  </div>
                  <div v-else class="no-ctn">
                    <div>
                      <img src="@/assets/img/emptyMem.png" />
                      <div>还没有任何日报</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <!-- 动态 -->
              <el-tab-pane :name="TAB_TYPE.DYNAMIC">
                <span slot="label">
                  <i class="hiFont hi-note hide-mobile"></i>
                  动态
                </span>
                <div
                  class="dynamics"
                  v-loading="loading.dynamicFirst"
                  v-infinite-scroll="loadTabFn(TAB_TYPE.DYNAMIC)"
                  :infinite-scroll-disabled="disableScrollLoad.dynamic"
                >
                  <div v-if="crtTask.dynamics.length > 0">
                    <div
                      class="single"
                      v-for="(item, i) in crtTask.dynamics"
                      :key="i"
                    >
                      <el-divider
                        v-if="checkIsNeedDivider(TAB_TYPE.DYNAMIC, i)"
                        >{{
                          item.tsTakeTime | getDividerName(crtTask.dynamics, i)
                        }}</el-divider
                      >
                      <div>
                        <div>
                          <i class="hiFont hi-note"></i>
                          <span v-html="item.tsMsg"></span>
                        </div>
                        <time>{{ item.tsTakeTime | formatDynamicTime }}</time>
                      </div>
                    </div>
                    <div v-if="loading.dynamic" class="g-loading">
                      <i class="el-icon-loading"></i>
                      加载中...
                    </div>
                    <div v-if="loaded.dynamic" class="g-loaded">已全部加载</div>
                  </div>
                  <div v-else class="no-ctn">
                    <div>
                      <img src="@/assets/img/emptyMem.png" />
                      <div>还没有任何动态</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <!-- 提醒 -->
              <el-tab-pane :name="TAB_TYPE.REMIND">
                <span slot="label">
                  <i class="hiFont hi-bell hide-mobile"></i>
                  提醒
                </span>
                <div class="remind" v-loading="loading.remindFirst">
                  <div class="addRemind">
                    <el-button
                      type="primary"
                      icon="hiFont hi-clock"
                      @click="$modal.show('addRemind')"
                      >创建新的提醒</el-button
                    >
                  </div>
                  <div v-if="crtTask.reminds.length > 0" class="ctn">
                    <div
                      class="single"
                      v-for="(item, i) in crtTask.reminds"
                      :key="i"
                    >
                      <i class="hiFont hi-clock"></i>
                      <h3
                        v-if="
                          $D.ITEM('task_remind_status', item.Status).custom
                            .type == 'date'
                        "
                      >
                        <em
                          >{{
                            $D.ITEM("task_remind_status", item.Status).name
                          }}
                          {{
                            $D.ITEM("task_remind_option", item.Time).name
                          }}</em
                        >
                        进行提醒
                      </h3>
                      <h3
                        v-else-if="
                          $D.ITEM('task_remind_status', item.Status).custom
                            .type == 'time'
                        "
                      >
                        <em
                          >{{
                            $D.ITEM("task_remind_status", item.Status).name
                          }}
                          {{ item.Timepoint }}</em
                        >
                        进行提醒
                      </h3>
                      <h3 v-else>
                        <em
                          >{{
                            $D.ITEM("task_remind_status", item.Status).name
                          }}
                          达到 {{ item.Time }}% 时</em
                        >
                        进行提醒
                      </h3>
                      <time v-if="item.CreateUserId == user.id">
                        <i class="hiFont hi-delete" @click="delRemind(item.TId)"
                          >删除</i
                        >
                        <span
                          >{{ item.CreateUserName }}
                          {{ item.CreateTime.timeFormat("M月d日 HH:mm") }}</span
                        >
                      </time>
                      <time v-else
                        >{{ item.CreateUserName }}
                        {{ item.CreateTime.timeFormat("M月d日 HH:mm") }}</time
                      >
                      <div v-if="item.Scope">提醒我</div>
                      <div v-else-if="item.Type == 1">
                        <span>
                          <span>提醒</span>
                          <em v-for="val in item.MemberArray" :key="val">{{
                            $D.ITEM("task_role", val).name
                          }}</em>
                        </span>
                      </div>
                      <div v-else>
                        <el-popover
                          v-if="item.UserData.length > 3"
                          placement="top"
                          title="全部成员"
                          width="360"
                          trigger="hover"
                        >
                          <div>
                            <MemberSelect
                              readonly
                              size="small"
                              :arrays="item.UserData"
                            ></MemberSelect>
                          </div>
                          <span slot="reference">
                            <span>提醒</span>
                            <em
                              v-for="u in item.UserData.slice(0, 3)"
                              :key="u.UId"
                              >{{ u.UName }}</em
                            >
                            <s>等{{ item.UserData.length }}人</s>
                          </span>
                        </el-popover>
                      </div>
                    </div>
                    <div v-if="loading.remind" class="g-loading">
                      <i class="el-icon-loading"></i>
                      加载中...
                    </div>
                  </div>
                  <div v-else class="no-ctn">
                    <div>
                      <img src="@/assets/img/emptyMem.png" />
                      <div>还没有任何提醒</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <!-- 申请介入 -->
              <el-tab-pane :name="TAB_TYPE.ASSIST">
                <span slot="label">
                  <i class="hiFont hi-bell hide-mobile"></i>
                  介入
                </span>
                <div class="assist" v-loading="loading.assistFirst">
                  <div class="addAssist">
                    <el-button
                      type="primary"
                      icon="hiFont hi-clock"
                      @click="$modal.show('addAssist')"
                      >指定成员介入</el-button
                    >
                  </div>
                  <div class="ctn" v-if="assistRecord.length">
                    <div
                      class="single"
                      v-for="(item, index) in assistRecord"
                      :key="index"
                    >
                      <el-card class="box-card">
                        <div class="line">
                          <span class="label">申请成员</span>
                          <div class="info">
                            <img :src="$url + item.AuthorPicture" alt="" />
                            <span>{{ item.AuthorName }}</span>
                          </div>
                        </div>
                        <div class="line">
                          <span class="label">介入成员</span>
                          <div class="info">
                            <img :src="$url + item.goalPicture" alt="" />
                            <span>{{ item.goalName }}</span>
                          </div>
                        </div>
                        <div class="line">
                          <span class="label">申请时间</span>
                          <div>
                            {{ item.CreateTime.timeFormat("MM/dd HH:mm") }}
                          </div>
                        </div>
                        <div class="line">
                          <span class="label">申请介入原因类型</span>
                          <div
                            :title="
                              $D.ITEM('assist_unsolve', item.PreUnionIssuesType)
                                .name
                            "
                          >
                            {{
                              $D.ITEM("assist_unsolve", item.PreUnionIssuesType)
                                .name
                            }}
                          </div>
                        </div>
                        <div class="line">
                          <span class="label">申请介入原因</span>
                          <div :title="item.PreUnionIssues">
                            {{ item.PreUnionIssues }}
                          </div>
                        </div>
                        <div class="line">
                          <span class="label">介入状态</span>
                          <div>
                            {{ $D.ITEM("assist_status", item.Status).name }}
                          </div>
                        </div>
                        <div
                          class="line"
                          v-if="item.ReasonType || item.ReasonType == 0"
                        >
                          <span class="label">介入后未解决类型</span>
                          <div
                            :title="
                              $D.ITEM('assist_unsolve', item.ReasonType).name
                            "
                          >
                            {{
                              $D.ITEM("assist_unsolve", item.ReasonType).name
                            }}
                          </div>
                        </div>
                        <div class="line" v-if="item.Reason">
                          <span class="label">介入后未解决原因</span>
                          <div :title="item.Reason">{{ item.Reason }}</div>
                        </div>
                        <div class="line" v-if="item.RefuseReason">
                          <span class="label">拒绝介入原因</span>
                          <div :title="item.RefuseReason">
                            {{ item.RefuseReason }}
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </div>
                  <div v-else class="no-ctn">
                    <div>
                      <img src="@/assets/img/emptyMem.png" />
                      <div>还没有介入记录</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </template>

      <!-- 内部模态框 -->
      <template v-if="crtTask">
        <!-- 拉为关注 -->
        <XModal
          name="letAttention"
          ref="xmLetAtn"
          title="选择成员关注此任务"
          confirmBtnText="确认"
          cancelBtnText="取消"
          @onConfirm="infoExSubmit(2)"
        >
          <el-form class="xm-ctn-padding-h">
            <el-form-item label="选择成员："
              ><MemberSelect
                :eid="crtTask ? crtTask.evID : 0"
                @Confirm="memberSel(2, $event)"
              ></MemberSelect
            ></el-form-item>
          </el-form>
        </XModal>

        <!-- 关注设置 -->
        <XModal
          name="atnSetting"
          ref="xmSetting"
          title="我的关注通知设置"
          confirmBtnText="确认"
          cancelBtnText="取消"
          @onConfirm="infoExSubmit(3)"
        >
          <el-form class="xm-ctn-padding-h">
            <el-form-item label="通知间隔：" class="fill-item">
              <el-select v-model="formTask.interval">
                <el-option
                  v-for="num of 7"
                  :key="num"
                  :value="num"
                  :label="num == 0 ? '不通知' : `每 ${num} 天向我发送任务动态`"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </XModal>
        <!-- 复制任务 -->
        <XModal
          name="copyTask"
          ref="xmCopy"
          title="复制任务"
          confirmBtnText="确认"
          cancelBtnText="取消"
          @onConfirm="infoExSubmit(4)"
        >
          <el-form class="xm-ctn-padding-h" style="width: 100%">
            <el-form-item label="选择新的执行人：">
              <MemberSelect
                :eid="crtTask ? crtTask.evID : 0"
                :isSelection="false"
                @Confirm="memberSel(4, $event)"
              ></MemberSelect>
            </el-form-item>
            <el-form-item label="是否删除原任务：">
              <el-radio-group v-model="formMore.copyTask.isDeleteSource">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </XModal>

        <!-- 添加提醒 -->
        <AddRemind
          :jid="myJobID"
          :eid="crtTask.eid"
          @confirm="loadTab(TAB_TYPE.REMIND)"
        ></AddRemind>
        <!-- 更换父任务 -->
        <changeFJob :jid="myJobID" @upData="getTaskDetail()"></changeFJob>
        <!-- 移动任务-->
        <MoveTask
          :jid="moveTask.jid"
          :isChild="moveTask.isChild"
          :eid="moveTask.eid"
          :jobClass="moveTask.jobClass"
          @successMove="successMove"
        ></MoveTask>
      </template>

      <!-- 缺省页 -->
      <div v-if="!crtTask" class="no-task">
        <div>
          <img src="@/assets/img/emptyTask.png" />
          <div>该任务不存在或无权查看</div>
          <el-button type="primary" @click="$modal.hide(modalName)"
            >返回页面</el-button
          >
        </div>
      </div>
    </XModal>
    <!-- 移动任务-->
    <MoveTask
      :jid="moveTask.jid"
      :isChild="moveTask.isChild"
      :eid="moveTask.eid"
      :jobClass="moveTask.jobClass"
      @successMove="successMove"
    ></MoveTask>
    <!-- 提醒添加KPI -->
    <addKpi :jid="myJobID" :type="addType" :frontMan="frontMan"></addKpi>
    <!-- KPI详情 -->
    <KpiDetail :activeId="kpiId" customName="taskKpi"></KpiDetail>
    <!-- 延迟添加KPI -->
    <delayKpi
      :frontMan="frontMan"
      :eid="crtTask && crtTask.evID"
      :jid="myJobID"
    ></delayKpi>
    <!-- 成员介入 -->
    <assist
      :frontMan="frontMan"
      :JId="myJobID"
      @updateAssist="getAssistRecord"
    ></assist>
    <!-- 将任务添加至简报 -->
    <addReport :jid="myJobID"></addReport>
    <!-- 催促任务执行提醒 -->
    <urgeFinishModal
      :jid="myJobID"
      :modalName="`${modalName}-urgeFinish`"
      :noticeCount="crtTask ? crtTask.noticeCount : 0"
    ></urgeFinishModal>
    <!-- 增加循环设置 -->

    <XModal
      name="taskLoopNew"
      confirmBtnText="完成"
      title="任务循环设置"
      @onConfirm="taskLoopOk"
      width="320px"
    >
      <div style="display: flex;flex-direction: column;padding: 15px;">
        <div style="display: flex;">
          <div
            style="font-size: 16px;color: #333;min-width: 65px;height: 40px;line-height: 40px;text-align: right;margin-right: 5px;"
          >
            循环周期
          </div>
          <div>
            <el-select
              v-model="looptype"
              placeholder="请选择"
              style="margin-bottom: 10px;"
              @change="typeone(looptype)"
            >
              <el-option
                v-for="item in options1"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <el-select
              v-model="loopweek"
              v-if="loopWeek"
              placeholder="请选择周"
              style="margin-bottom: 10px;"
              @change="val2"
            >
              <el-option
                v-for="item in optionweek"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="loopweek2"
              v-if="loopWeek2"
              placeholder="请选择几周"
              style="margin-bottom: 10px;"
              @change="val2"
            >
              <el-option
                v-for="item in optionweek2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="loopmonth"
              v-if="loopMonth"
              placeholder="请选择月"
              style="margin-bottom: 10px;"
              @change="val2"
            >
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="loopday"
              v-if="loopDay"
              placeholder="请选择日"
              style="margin-bottom: 10px;"
            >
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div style="display: flex;">
          <div
            style="font-size: 16px;color: #333;min-width: 65px;text-align: right;margin-right: 5px;height: 40px;line-height: 40px; text-align-last:justify"
          >
            条件
          </div>
          <div>
            <el-select
              v-model="value4"
              placeholder="请选择"
              style="margin-bottom: 10px;"
            >
              <el-option
                v-for="item in options4"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </div>

        <span style="margin-top: 20px;color: #aaa;font-size: 12px;"
          >每月1号零点会自动创建新的循环任务</span
        >
      </div>
    </XModal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  components: {
    MemberSelect: () => import("@/components/Selectors/MemberSelect"),
    XFroala: () => import("@/components/XFroala"),
    XFroalaView: () => import("@/components/XFroalaView"),
    XModal: () => import("@/components/XModal"),
    MoveTask: () => import("./moveTask"),
    changeFJob: () => import("./changeFJob"),
    AddRemind: () => import("./addRemind"),
    ChildTaskList: () => import("./ChildTaskList"),
    Comment: () => import("@/components/List/Comment"),
    FileList: () => import("@/components/List/FileList"),
    taskRelation: () => import("./taskRelation"),
    addKpi: () => import("./addKpi"),
    KpiDetail: () => import("@/views/assessment/kpiDetail"),
    delayKpi: () => import("./delayKPi"),
    assist: () => import("./memberAssist"),
    addReport: () => import("./addToReport"),
    RoutineItem: () => import("@/views/task/RoutineItem"),
    urgeFinishModal: () => import("./urgeFinishModal"),
  },
  props: {
    //打开的任务或计划详情ID
    jid: {
      default: 0,
    },
    //详情类型（1任务，2计划）
    type: {
      type: Number,
      default: 1,
    },

    //打开详情页后的相对路由
    url: {
      type: String,
      default: "",
    },

    //关闭详情页后返回的相对路由
    referer: {
      type: String,
      default: "",
    },
    page: {
      type: String,
      default: "",
    },
    modalName: {
      type: String,
      default: "taskDetail",
    },
  },
  model: {
    prop: "jid",
    event: "changJid",
  },
  data() {
    return {
      // 任务里的卡片
      childLoading: false,
      itemData: [], //所有展示的数据

      //选项卡类型（常量，不做任何数据绑定，只用于判断选项卡项）
      TAB_TYPE: {
        COMMENT: "1", //评论
        REVIEW: "2", //审核
        ANNEX: "3", //附件
        DYNAMIC: "4", //动态
        REMIND: "5", //提醒
        RELATION: "6", //关联任务
        DAILY: "7", //日报
        ASSIST: "8", //申请介入
        NEWLIST: "9", //子任务选项
      },

      //用于重新加载dropdown，popover, tabs等el组件 (防止第二次打开Modal时组件卡死或失效)
      thisOpened: false,

      //标识首次详情是否加载完毕
      thisLoaded: false,

      //实际数据的任务或计划信息（具体字段见init方法）
      crtTask: null,

      //表单中的任务或计划信息（具体字段见init方法）
      formTask: null,

      //详情里各种表单中表单项的绑定值（具体字段见init方法）
      formMore: {},

      //任务基本信息的功能控制的状态（页面左半边）
      infoCtrl: {
        showNameEditor: false, //显示任务名的输入框
        showTimeEditor: false, //显示修改时间的弹出框
        showClearTime: false, //清除时间
        showDesEditor: false, //显示描述的富文本框
        showRefundEditor: false, //显示退款的富文本
        showEstimateEditor: false, //显示预估耗时的输入框
        showStandardEditor: false, //显示标准耗时
        loadingRevBtn: false, //控制审核按钮是否为提交中
        refundAmountEditor: false, //退款金额
        refundRatioEditor: false, //退款比例
      },

      //任务其它信息的功能控制状态（页面右半边，详细见init）
      tabCtrl: {},

      //加载时用的状态
      loadStatus: {
        info: false, //加载任务基本信息
        comment: false, //加载评论列表
        review: false, //加载审核列表
        annex: false, //加载附件列表
        dynamic: false, //加载动态列表
        remind: false, //加载提醒列表
        daily: false, //加载日报列表
      },

      //页码翻到底时用的状态
      loaded: {
        comment: false, //评论列表加载完毕
        review: false, //审核列表加载完毕
        annex: false, //附件列表加载完毕
        dynamic: false, //动态列表加载完毕
        remind: false, //提醒列表加载完毕
        daily: false, //日报列表加载完毕
      },

      //权限控制
      powCtrl: {
        isCreator: false, //是否是创建人
        isFrontMan: false, //是否是执行人
        isTester: false, //是否是审核人
        isPntFrontMan: false, //是否是上级负责人
        isParticipant: false, //是否是参与者
      },
      //组件本身的ID
      myJobID: this.jid,
      myurl: this.url,
      queryParams: false,
      //关系图
      relationArr: [],
      relationType: 1,
      //移动任务的对象
      moveTask: {
        jid: NaN,
        eid: NaN,
        isChild: false,
        jobClass: NaN,
      },
      //提醒 扣除Kpi
      addType: null,
      kpiId: null,
      frontMan: {},
      eid: null,
      photos: "",
      //介入记录
      assistRecord: [],

      //任务循环设置
      options1: [], //循环类型 每天、每周、每月
      options2: [], //每月
      options3: [], //每日
      options4: [], //条件
      optionweek: [
        { value: 1, label: "周一" },
        { value: 2, label: "周二" },
        { value: 3, label: "周三" },
        { value: 4, label: "周四" },
        { value: 5, label: "周五" },
        { value: 6, label: "周六" },
        { value: 7, label: "周日" },
      ],
      optionweek2: [
        { value: 1, label: "一周" },
        { value: 2, label: "二周" },
        { value: 3, label: "三周" },
        { value: 4, label: "四周" },
      ],
      looptype: "", //保存的参数
      loopmonth: "",
      loopday: "",
      loopweek: "",
      loopweek2: "",

      postType: null, //判断type类型--日-月-周-不循环

      value4: "",
      loopMonth: false, //判断什么时候显示下拉菜单
      loopDay: false,
      loopWeek2: false,
      loopWeek: false,

      loopForm: null,
    };
  },
  computed: {
    ...mapState(["user", "task"]),
    //耗时比
    showProgress() {
      let temp = this.crtTask.progress > -1 ? this.crtTask.progress : 0;
      if (this.crtTask.spentTimeRatio < temp) {
        return "(快)";
      } else if (this.crtTask.spentTimeRatio > temp) {
        return "(慢)";
      }
      return "";
    },
    //当前任务或计划详情的状态对象
    status: function() {
      let obj = this.$D.ITEM("task_status", 1);
      let data = this.$D.ITEM("task_status", this.crtTask.status);
      if (data) {
        obj = data;
      } else {
        obj.name = "未知";
      }
      return obj;
    },
    //任务详情中可供切换的任务状态
    statusOptions: function() {
      if ([4].indexOf(this.crtTask.status) >= 0) {
        return [99]; //只显示撤销申请
      } else {
        return [2, 7, 0, 3, 1]; //显示进行中、已完成、待定中、暂停的、未开始
      }
    },
    //当前任务或计划详情的优先级对象
    priority: function() {
      let data = this.$D.ITEM("g_priority", this.crtTask.priority);
      if (data) {
        return data;
      } else {
        return this.$D.ITEM("g_priority", 1);
      }
    },
    //加载中的控制状态
    loading() {
      return {
        comment: this.loadStatus.comment && this.tabCtrl.comment > 1, //评论翻页
        review: this.loadStatus.review && this.tabCtrl.review > 1, //审核翻页
        annex: this.loadStatus.annex && this.tabCtrl.annex > 1, //附件翻页
        dynamic: this.loadStatus.dynamic && this.tabCtrl.dynamic > 1, //动态翻页
        remind: this.loadStatus.remind && this.tabCtrl.remind > 1, //动态翻页
        daily: this.loadStatus.daily && this.tabCtrl.daily > 1, //日报翻页
        commentFirst: this.loadStatus.comment && this.tabCtrl.comment == 1, //首次评论加载
        reviewFirst: this.loadStatus.review && this.tabCtrl.review == 1, //首次审核加载
        annexFirst: this.loadStatus.annex && this.tabCtrl.annex == 1, //首次附件加载
        dynamicFirst: this.loadStatus.dynamic && this.tabCtrl.dynamic == 1, //首次动态加载
        remindFirst: this.loadStatus.remind && this.tabCtrl.remind == 1, //动态翻页
        dailyFirst: this.loadStatus.daily && this.tabCtrl.daily == 1, //日报
        // assistFirst:this.loadStatus.assist && this.tabCtrl.assist=1 //申请介入
      };
    },
    //禁用无限滚动加载
    disableScrollLoad() {
      return {
        comment:
          this.tabCtrl.tabActive != "1" ||
          this.loadStatus.comment ||
          this.loaded.comment,
        review:
          this.tabCtrl.tabActive != "2" ||
          this.loadStatus.review ||
          this.loaded.review,
        annex:
          this.tabCtrl.tabActive != "3" ||
          this.loadStatus.annex ||
          this.loaded.annex,
        dynamic:
          this.tabCtrl.tabActive != "4" ||
          this.loadStatus.dynamic ||
          this.loaded.dynamic,
        daily:
          this.tabCtrl.tabActive != "7" ||
          this.loadStatus.daily ||
          this.loaded.daily,
      };
    },
  },
  methods: {
    ...mapActions(["task_addId", "task_setIndex"]),
    /*------ 菜单的函数（START）-----*/
    toKpi(item) {
      this.kpiId = item.UId;
      if (this.kpiId) {
        this.$modal.show("taskKpi");
      }
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
    refreshData() {
      //更新右边数据
      let temp1 = this.formData.currentPage;
      let temp2 = this.formData.pageCount;
      this.formData.currentPage = 1;
      // this.formData.pageCount = this.itemData.length;
      this.$http
        .post("/Project/taskMenuInquire.ashx", this.formData)
        .then((resp) => {
          if (resp.res == 0) {
            console.log(resp, "1");
            this.itemData = resp.data.data;
          }
          this.formData.pageCount = temp2;
          this.formData.currentPage = temp1;
        });
    },

    //任务循环设置
    taskLoop2() {
      this.options2 = [];
      this.options3 = [];
      for (var i = 1; i < 13; i++) {
        this.options2.push({
          value: i,
          label: i + "月",
        });
      }
      for (var i = 1; i < 32; i++) {
        this.options3.push({
          value: i,
          label: i + "日",
        });
      }
      this.getLoopData();
      this.$modal.show("taskLoopNew");
    },
    typeone(val) {
      this.postType = val;
      console.log(this.postType);
      //判断
      if (val == "每天") {
        this.loopMonth = false;
        this.loopDay = true;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopmonth = "";
        this.loopday = "";
        this.loopweek = "";
        this.loopweek2 = "";
      } else if (val == "每月") {
        this.loopMonth = true;
        this.loopDay = true;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopmonth = "";
        this.loopday = "";
        this.loopweek = "";
        this.loopweek2 = "";
      } else if (val == "每周") {
        this.loopMonth = false;
        this.loopDay = false;
        this.loopWeek = true;
        this.loopWeek2 = true;
        this.loopmonth = "";
        this.loopday = "";
        this.loopweek = "";
        this.loopweek2 = "";
      } else if (val == "不循环") {
        this.loopMonth = false;
        this.loopDay = false;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopmonth = "";
        this.loopday = "";
        this.loopweek = "";
        this.loopweek2 = "";
      }
      // console.log(this.loopFlag1,this.loopFlag2)
    },
    //循环设置-判断月份如果超出当月最大日期则清空
    val2(val) {
      if (
        val == 1 ||
        val == 3 ||
        val == 5 ||
        val == 7 ||
        val == 8 ||
        val == 10 ||
        val == 12
      ) {
        this.options3 = [];
        for (var i = 1; i < 32; i++) {
          this.options3.push({
            value: i,
            label: i + "日",
          });
        }
      } else if (val == 2) {
        if (this.loopday > 29) {
          this.loopday = "";
        }
        this.options3 = [];
        for (var i = 1; i < 30; i++) {
          this.options3.push({
            value: i,
            label: i + "日",
          });
        }
      } else {
        this.options3 = [];
        if (this.loopday > 30) {
          this.loopday = "";
        }
        for (var i = 1; i < 31; i++) {
          this.options3.push({
            value: i,
            label: i + "日",
          });
        }
      }
    },
    //任务循环设置点了完成按钮
    taskLoopOk() {
      if (this.postType == "每天") {
        const data = {
          Jid: this.jid,
          uid: this.$store.state.user.id,
          type: this.looptype,
          month: this.loopday,
          day: "",
          condit: this.value4,
        };
        this.loopForm = data;
      } else if (this.postType == "每月") {
        const data = {
          Jid: this.jid,
          uid: this.$store.state.user.id,
          type: this.looptype,
          month: this.loopmonth,
          day: this.loopday,
          condit: this.value4,
        };
        this.loopForm = data;
      } else if (this.postType == "每周") {
        const data = {
          Jid: this.jid,
          uid: this.$store.state.user.id,
          type: this.looptype,
          month: this.loopweek2,
          day: this.loopweek,
          condit: this.value4,
        };
        this.loopForm = data;
      } else if (this.postType == "不循环") {
        const data = {
          Jid: this.jid,
          uid: this.$store.state.user.id,
          type: this.looptype,
          month: "",
          day: "",
          condit: this.value4,
        };
        this.loopForm = data;
      }

      this.$http
        .post("/Project/Job/LoopAdd.ashx", this.loopForm)
        .then((res) => {
          if (res.res == 0) {
            this.$notify.success(res.msg);
          }
        });
      this.$modal.hide("taskLoopNew");
    },

    //移动任务
    successMove(classid) {
      this.crtTask.class = classid;
    },
    //切换任务
    pageTurn(value) {
      //右翻
      if (value) {
        if (this.task.index < this.task.history.length - 1) {
          this.task_setIndex(1);
          this.beforInit(this.task.history[this.task.index]);
        }
      } else {
        if (this.task.index > 0) {
          this.task_setIndex(2);
          this.beforInit(this.task.history[this.task.index]);
        }
      }
    },
    showMoveTask(jid, isChild, eid, jobClass) {
      this.moveTask.jid = jid;
      this.moveTask.isChild = isChild;
      this.moveTask.eid = eid;
      this.moveTask.jobClass = jobClass;
      this.$modal.show("moveTask");
    },
    //菜单下拉菜单事件
    menuCommand(type) {
      switch (type) {
        case "move":
          this.showMoveTask(
            this.myJobID,
            this.crtTask.fjob != null,
            this.crtTask.evID,
            this.crtTask.class
          );
          break;
        case "changeF":
          this.$modal.show("changeF");
          break;
        case "letAtn":
          this.$modal.show("letAttention");
          break;
        case "setting":
          this.$modal.show("atnSetting");
          break;
        case "delete":
          this.$confirm("确认删除此任务？", "提示", {
            type: "warning",
          }).then(() => {
            this.infoExSubmit(5);
          });
          break;
        case "copy":
          this.$modal.show("copyTask");
          break;
        case "addKpi":
          // this.dialogFormVisible=true
          this.addType = 2;
          this.$modal.show("addKpi");
          break;
        case "mention":
          this.addType = 1;
          this.$modal.show("addKpi");
          break;
        case "delayKpi":
          this.$modal.show("delayKpi");
          break;
        case "report":
          this.$modal.show("addReport");
          break;
      }
    },
    /*------ 菜单的函数（END）-----*/

    /*------ 基本信息的函数（START）-----*/
    open(name) {
      this.queryParams = true;
      if (name === "files") {
        setTimeout(() => {
          this.tabCtrl.tabActive = this.TAB_TYPE.ANNEX;
          this.loadTab(this.TAB_TYPE.ANNEX);
          window.location.hash = "detail";
        }, 1000);
      }
      // else if (name === 'comment') {
      // 	this.tabCtrl.tabActive = '1'
      // 	this.loadTab(this.TAB_TYPE.COMMENT);
      // }
    },
    beforInit(newJobID) {
      this.myJobID = newJobID;
      this.$refs.childJob.open = false;
      this.init();
      this.myurl =
        this.myurl.substring(0, this.myurl.lastIndexOf("/")) + `/${newJobID}`;
    },
    //打开任务关系图详情
    openTaskRelationDetail(item) {
      let _item = {};
      if (item.jid) {
        _item = item;
      } else {
        _item.jid = item.JId;
        _item.eid = item.EventId;
      }
      this.myJobID = _item.jid;
      this.beforInit(_item.jid);
      this.task_addId(_item.jid);
      this.task_setIndex(0);
      this.init();
      this.myurl = `/task/${_item.eid}/${_item.jid}`;
    },
    //初始化详情
    init() {
      this.clear();
      //实际数据的任务或计划信息
      this.crtTask = {
        name: "", //任务名称
        evName: "", //项目名称
        description: "", //任务描述
        status: 0, //状态
        createTime: "", //创建时间
        startTime: "", //开始时间
        endTime: "", //截止时间
        priority: 0, //优先级
        isAttention: false, //是否关注
        estimatedTime: null, //预估耗时
        actualTime: null, //实际耗时
        participant: [], //参与人
        expandTimeRec: [], //扩展时间记录
        reminds: [], //提醒
        comments: [], //评论内容
        reviews: [], //审核记录
        annexs: [], //附件
        dailys: [], //附件
        dynamics: [], //动态记录
        tags: [], //标签
        class: 0, //任务分类
        creator: {
          //创建人
          id: 0,
          name: "",
        },
        frontMan: {
          //执行人
          UId: 0,
          UName: "",
          Picture: "",
          otherArguments: [], //执行人其余安排
        },
        pntFrontMan: {
          //上级执行人
          UId: 0,
          UName: "",
          Picture: "",
        },
        tester: {
          //审核人
          UId: 0,
          UName: "",
          Picture: "",
        },
      };

      //表单中的任务或计划信息
      this.formTask = {
        name: "", //任务名称
        startTime: "", //开始时间
        endTime: "", //截止时间
        estimatedTime: null, //预估耗时
        description: "", //任务描述
        standardEstime: null, //标准预估耗时
        refundTime: null, //退款时间
        refundReason: "", //退款原因
        refundAmount: null, //退款金额
        refundRatio: null, //退款比例
      };

      //详情里各种表单中表单项的绑定值
      this.formMore = {
        reasonTimeEdit: "", //修改时间的理由
        tags: [], //标签下拉选项
        taskClasses: [], //任务分类下拉选项
        attentions: [], //拉为关注的选择人
        review: null, //当前正在审核的申请记录
        reviewCmt: "", //评语
        reviewType: [], //审核里面的类型
        reminds: [], //新增的提醒集合
        copyTask: {
          //复制任务
          jobID: this.myJobID,
          frontID: null, //新的负责人ID
          isDeleteSource: false, //是否删除原任务
        },
      };

      //任务其它信息的功能控制状态（页面右半边）
      this.tabCtrl = {
        tabActive: "9", //控制右边选项卡显示哪一张卡
        comment: 1, //评论当前加载的页数
        review: 1, //审核当前加载的页数
        annex: 1, //附件当前加载的页数
        dynamic: 1, //动态当前加载的页数
        remind: 1, //提醒当前加载的页数
        daily: 1, //日报当前加载的页数
        dailyCount: 17, //日报的单页数量
        commentCount: 8, //评论的单页数量
        reviewCount: 8, //审核的单页数量
        annexCount: 8, //附件的单页数量
        dynamicCount: 15, //动态的单页数量
        remindCount: 999, //提醒的单页数量
      };

      this.$http.get("/Project/AuditExtendJobType.ashx").then((res) => {
        if (res.res == 0) {
          this.formMore.reviewType = res.data;
        }
      });

      this.thisLoaded = false;
      this.getTaskDetail();
    },
    //父任务
    toFJob() {
      this.task_addId(this.crtTask.fjob.fjobID);
      this.task_setIndex(0);
      this.beforInit(this.crtTask.fjob.fjobID);
    },
    //清除详情
    clear() {
      this.tabCtrl.tabActive = "1";

      this.crtTask = null;
      this.formTask = null;
      this.formMore = null;

      for (let i in this.infoCtrl) {
        this.infoCtrl[i] = false;
      }
      for (let i in this.loadStatus) {
        this.loadStatus[i] = false;
      }
      for (let i in this.loaded) {
        this.loaded[i] = false;
      }
      for (let i in this.powCtrl) {
        this.powCtrl[i] = false;
      }
    },
    clearTime() {
      this.$http
        .post("/Project/Job/ClearTime.ashx", {
          jobID: this.myJobID,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.$emit("updated", this.crtTask);
            this.infoCtrl.showClearTime = false;
            this.$notify({
              type: "success",
              message: resp.msg,
            });
            this.formTask.estimatedTime = this.crtTask.estimatedTime = this.formTask.startTime = this.formTask.endTime = this.crtTask.startTime = this.crtTask.endTime = this.crtTask.estimatedTime = null;
          }
        });
    },
    //获取任务或计划的详情
    getTaskDetail(opt, flag) {
      let def = {
        reloadTab: false,
        notifyPnt: false,
      };
      opt = Object.assign(def, opt);
      if (!flag) {
        this.loadStatus.info = true;
        this.loadStatus.comment = true;
      }

      if (!this.myJobID) {
        return;
      }
      if (opt.reloadTab) {
        this.$refs.childJob.initFun(true);
        switch (this.tabCtrl.tabActive) {
          case "2":
            this.loadTab(this.TAB_TYPE.REVIEW);
            this.submitReview(false);
            break;
          case "3":
            this.loadTab(this.TAB_TYPE.ANNEX);
            break;
          case "4":
            this.loadTab(this.TAB_TYPE.DYNAMIC);
            break;
          case "5":
            this.loadTab(this.TAB_TYPE.REMIND);
            break;
          case "7":
            this.loadTab(this.TAB_TYPE.DAILY);
            break;
          case "8":
            this.loadTab(this.TAB_TYPE.NEWLIST);
            break;
        }
      }
      this.$http
        .post("/Project/taskDetailsInquire.ashx", {
          id: this.myJobID,
          // id:11767,
          type: this.type,
        })
        .then((res) => {
          this.loadStatus.info = false;
          this.loadStatus.comment = false;
          if (res.res == 0) {
            const data = res.data;
            if (!data) {
              this.crtTask = null;
              return;
            }
            //保留之前已经加载过的审核记录，附件，动态记录，提醒
            let tmpReviews = [];
            let tmpAnnexs = [];
            let tmpDynamics = [];
            let tmpReminds = [];
            let tmpDailys = [];
            if (this.crtTask.reviews) tmpReviews = this.crtTask.reviews;
            if (this.crtTask.annexs) tmpAnnexs = this.crtTask.annexs;
            if (this.crtTask.dynamics) tmpDynamics = this.crtTask.dynamics;
            if (this.crtTask.reminds) tmpReminds = this.crtTask.reminds;
            if (this.crtTask.dailys) tmpDailys = this.crtTask.dailys;
            //转换接口的数据
            this.crtTask = {
              noticeCount: data.noticeCount, //任务提醒次数
              kpi: data.associatedKPI, //关联kpi
              jobID: this.myJobID, //自身id
              name: data.jobName, //任务名称
              fjob: data.fjob, //父任务
              evID: data.evID, //项目ID
              evName: data.evName, //项目名称
              jobChild: data.jobChild,
              childType: data.jobChildrenType, //任务子类型
              description: data.jobCasts == null ? "" : data.jobCasts, //任务描述
              status: data.jobSchedules, //状态
              money: data.money, //任务金额
              receviedMoney:
                data.receviedMoney == null ? 0 : data.receviedMoney, //已收金额
              progress: data.Progress, //完成进度
              spentTimeRatio: data.spentTimeRatio, //耗时比例
              createTime: data.jobCreateTime, //创建时间
              startTime: data.jobStartTime, //开始时间
              PridictionTimes: data.PridictionTimes, //预计结束时间
              estimateStartTime: data.estimateStartTime, //预计开始时间
              endTime: data.jobPridictionTime, //截止时间
              priority: data.jobFirs, //优先级
              isAttention: data.jobAttention, //是否关注
              estimatedTime:
                data.jobEstimatedTime == 0 ? null : data.jobEstimatedTime, //预估耗时
              standardEstime: data.standardEstime, //标准预计耗时
              actualTime: data.actualSpend, //实际耗时
              expandTimeRec: data.jobTimeModifyRecording, //扩展时间记录
              comments: data.jobComment, //评论内容
              reviews: tmpReviews, //审核记录
              annexs: tmpAnnexs, //附件
              dynamics: tmpDynamics, //动态记录
              reminds: tmpReminds, //提醒
              dailys: tmpDailys, //日报
              tags: data.jobTabs, //标签
              class: data.class, //任务分类
              interval: data.interval, //关注通知间隔
              operate: data.isMustOverTime, //加班
              refundAmount: data.refundAmount, //退款金额
              refundRatio: data.refundRate, //退款比例
              refundTime: data.refundTime, //退款时间
              refundStatus: data.refundState, //退款状态
              refundType: data.refundType, //退款类型
              refundReason: data.refundReson, //退款原因
              creator: {
                //创建人
                id: data.jobCreateID,
                name: data.jobCreateP,
              },
              frontMan: {
                //执行人
                UId: data.FrontmanId,
                UName: data.jobFrontman,
                Picture: data.PictureFrontman,
                otherArguments: data.jobFrontmanOtherArrangement, //执行人其余安排
              },
              pntFrontMan: {
                //上级执行人
                UId: data.PntFrontmanId,
                UName: data.jobPntFrontman,
                Picture: data.PicturePntFrontman,
              },
              tester: {
                //审核人
                UId: data.TesterId,
                UName: data.jobTester,
                Picture: data.PictureTester,
              },
              participant: [], //参与人
              attention: [], //当前关注此任务的人
              actualStartTime: data.actualStartTime, //实际开始时间
              actualEndTime: data.actualEndTime, //实际结束时间
            };
            this.frontMan = this.crtTask.frontMan;

            data.jobParticipant.map((item) => {
              this.crtTask.participant.push(
                _.zipObject(["UId", "UName", "Picture"], _.toArray(item))
              );
            });

            data.attention.map((item) => {
              this.crtTask.attention.push(
                _.zipObject(["UId", "UName", "Picture"], _.toArray(item))
              );
            });

            let pids = this.crtTask.participant.map((aa) => aa.UId);
            this.powCtrl.isParticipant = pids.indexOf(this.user.id) >= 0;
            this.formTask = JSON.parse(JSON.stringify(this.crtTask));
            this.initChart_Plan();

            if (opt.notifyPnt) {
              this.$emit("updated", this.crtTask);
            }
          }
        });

      this.$http.post("/Project/Job/taskGetClass.ashx").then((res) => {
        if (res.res == 0) {
          this.formMore.tags = res.data.tag;
          this.formMore.taskClasses = res.data.jobClass;
        }
      });
      this.getTaskRelation();
    },
    async getLoopData() {
      try {
        const data = {
          Jid: this.myJobID,
        };
        const res = await this.$http.post(
          "/Project/Job/GetLoopInfo.ashx",
          data
        );
        console.log(res);
        if (res.res == 0) {
          const resdata = res.data;
          this.options1 = resdata.list;
          this.options4 = resdata.conditList;
          console.log(this.options1, this.options4);
        }
      } catch (err) {
        console.warn(err);
      }
    },
    //基本信息切换为编辑模式
    infoEdit(type) {
      for (let i in this.infoCtrl) {
        //关闭全部基本信息编辑框
        this.infoCtrl[i] = false;
      }
      switch (type) {
        case 1: //切换为编辑任务名，并使输入框获取焦点
          this.infoCtrl.showNameEditor = true;
          this.$nextTick(() => {
            this.$refs.inputName.focus();
          });
          break;
        case 5: //切换为编辑描述
          this.infoCtrl.showDesEditor = true;
          // this.formTask.description = this.crtTask.description;
          break;
        case 6: //切换为编辑预估耗时，并使输入框获取焦点
          this.infoCtrl.showEstimateEditor = true;
          this.$nextTick(() => {
            this.$refs.inputEstimate.focus();
          });
          break;
        case 7: //切换为编辑预估耗时，并使输入框获取焦点
          this.infoCtrl.showStandardEditor = true;
          this.$nextTick(() => {
            this.$refs.inputStandard.focus();
          });
          break;
        case 8: //切换为编辑退款原因
          this.infoCtrl.showRefundEditor = true;
          // this.formTask.description = this.crtTask.description;
          break;
        case 9: //切换为编辑退款金额，并使输入框获取焦点
          this.infoCtrl.refundAmountEditor = true;
          this.$nextTick(() => {
            this.$refs.refundAmount.focus();
          });
          break;
        case 10: //切换为编辑退款比例，并使输入框获取焦点
          this.infoCtrl.refundRatioEditor = true;
          this.$nextTick(() => {
            this.$refs.refundRatio.focus();
          });
          break;
      }
    },

    //提交修改任务的基本信息（包括提醒）
    infoSubmit(type, value = null) {
      for (let i in this.infoCtrl) {
        //关闭全部基本信息编辑框
        this.infoCtrl[i] = false;
      }

      let that = this;
      let title = "修改成功";
      let valueOld = null;
      let isNotifyPnt = false;
      let success = function() {};
      let failed = function() {};

      switch (type) {
        case 1: //任务名称
          if (this.formTask.name == this.crtTask.name) {
            return;
          }
          isNotifyPnt = true;
          value = this.formTask.name;
          valueOld = this.crtTask.name;
          this.crtTask.name = this.formTask.name;
          failed = function() {
            that.crtTask.name = valueOld;
          };
          break;
        case 2: //开始时间
          isNotifyPnt = true;
          value = this.formTask.startTime;
          valueOld = this.crtTask.startTime;
          this.crtTask.startTime = this.formTask.startTime;
          success = function(data) {
            that.crtTask.status = data.status;
          };
          failed = function() {
            that.formTask.startTime = valueOld;
            that.crtTask.startTime = valueOld;
          };
          break;
        case 3: //结束时间
          isNotifyPnt = true;
          value = this.formTask.endTime;
          valueOld = this.crtTask.endTime;
          this.crtTask.endTime = this.formTask.endTime;
          failed = function() {
            that.crtTask.endTime = valueOld;
            that.formTask.endTime = valueOld;
          };
          break;
        case 4: //优先级
          if (value == this.crtTask.priority) {
            return;
          }
          isNotifyPnt = true;
          valueOld = this.crtTask.priority;
          this.crtTask.priority = value;
          failed = function() {
            that.crtTask.priority = valueOld;
          };
          break;
        case 5: //描述
          if (this.formTask.description == this.crtTask.description) {
            return;
          }
          value = this.formTask.description;
          valueOld = this.crtTask.description;
          this.crtTask.description = value;
          failed = function() {
            that.crtTask.description = valueOld;
          };
          break;
        case 6: //预估耗时
          if (
            !this.formTask.estimatedTime ||
            parseFloat(this.formTask.estimatedTime) <= 0
          ) {
            this.$notify({
              type: "info",
              message: "数值必须大于零",
            });
            return;
          }
          isNotifyPnt = true;
          value = this.$toFixed(this.formTask.estimatedTime, 2);
          success = function() {
            that.crtTask.estimatedTime = value;
          };
          break;
        case 7: //增加提醒
          break;
        case 8: //删掉提醒
          break;
        case 9: //标准耗时
          if (
            !this.formTask.standardEstime ||
            parseFloat(this.formTask.standardEstime) <= 0
          ) {
            this.$notify({
              type: "info",
              message: "数值必须大于零",
            });
            return;
          }
          isNotifyPnt = true;
          value = this.$toFixed(this.formTask.standardEstime, 2);
          success = function() {
            that.crtTask.standardEstime = value;
          };
          break;
        case 10: //是否必须加班
          if (value == this.crtTask.operate) return;
          this.crtTask.operate = value;
          failed = function() {
            that.crtTask.operate = !value;
          };
          break;
        case 11: //退款时间
          // if (value == this.crtTask.operate) return;
          valueOld = this.crtTask.refundTime;
          this.crtTask.refundTime = value;
          failed = function() {
            that.crtTask.refundTime = valueOld;
          };
          break;
        case 12: //退款状态
          if (value == this.crtTask.refundStatus) return;
          success = function() {
            that.crtTask.refundStatus = value;
          };
          break;
        case 13: //退款类型
          if (value == this.crtTask.refundType) return;
          valueOld = this.crtTask.refundType;
          this.crtTask.refundType = value;
          failed = function() {
            that.crtTask.refundType = valueOld;
          };
          break;
        case 14: //退款原因
          if (this.formTask.refundReason == this.crtTask.refundReason) {
            return;
          }
          value = this.formTask.refundReason;
          valueOld = this.crtTask.refundReason;
          this.crtTask.refundReason = value;
          failed = function() {
            that.crtTask.refundReason = valueOld;
          };
          break;
        case 15: //退款金额
          if (this.formTask.refundAmount == this.crtTask.refundAmount) {
            return;
          }
          value = this.formTask.refundAmount;
          valueOld = this.crtTask.refundAmount;
          this.crtTask.refundAmount = value;
          failed = function() {
            that.crtTask.refundAmount = valueOld;
          };
          break;
        case 16: //退款比例
          if (this.formTask.refundRatio == this.crtTask.refundRatio) {
            return;
          }
          value = this.formTask.refundRatio;
          valueOld = this.crtTask.refundRatio;
          this.crtTask.refundRatio = value;
          failed = function() {
            that.crtTask.refundRatio = valueOld;
          };
          break;
      }

      //访问接口
      this.$http
        .post("/Project/taskEdit.ashx", {
          jobid: this.myJobID,
          typeId: type,
          value: value,
        })
        .then((res) => {
          if (res.res == 0) {
            this.$notify({
              title: title,
              msg: res.msg,
              type: "success",
            });
            if (isNotifyPnt) {
              this.$emit("updated", this.crtTask);
            }
            success(res.data);
          } else {
            failed(res.data);
          }
        });
    },

    //提交修改任务的其它信息（另一个接口）
    infoExSubmit(type) {
      for (let i in this.infoCtrl) {
        //关闭全部基本信息编辑框
        this.infoCtrl[i] = false;
      }

      let uids, intid, tpStr, tpEvStr;
      let that = this;
      let title = "修改成功";
      let valueOld = null;
      let ifNotifyPnt = false;
      let success = function() {};
      let failed = function() {};

      switch (type) {
        case 1: //关注，取消关注
          ifNotifyPnt = true;
          this.crtTask.isAttention = !this.crtTask.isAttention;
          if (!this.crtTask.isAttention) {
            title = "已取消关注";
            type = 6;
          } else {
            title = "关注成功";
          }
          success = (data) => {
            this.crtTask.attention.length = 0;
            data.attention.map((item) => {
              this.crtTask.attention.push(
                _.zipObject(["UId", "UName", "Picture"], _.toArray(item))
              );
            });
          };
          break;
        case 2: //拉为关注
          uids = JSON.stringify(this.formMore.attentions.map((aa) => aa.UId));
          title = "添加关注成功";
          this.$refs.xmLetAtn.loadBtn(true);
          success = (data) => {
            this.$refs.xmLetAtn.loadBtn(false);
            this.$modal.hide("letAttention");
            this.crtTask.attention.length = 0;
            data.attention.map((item) => {
              this.crtTask.attention.push(
                _.zipObject(["UId", "UName", "Picture"], _.toArray(item))
              );
            });
          };
          failed = () => {
            this.$refs.xmLetAtn.loadBtn(false);
          };
          break;
        case 3: //关注设置
          this.$refs.xmSetting.loadBtn(true);
          intid = this.formTask.interval;
          success = () => {
            this.$refs.xmSetting.loadBtn(false);
            this.$modal.hide("atnSetting");
          };
          failed = () => {
            this.$refs.xmSetting.loadBtn(false);
          };
          break;
        case 4: //复制任务
          if (this.formMore.copyTask.frontID == this.crtTask.frontMan.UId) {
            this.$notify({
              type: "info",
              message: "执行人未改变",
            });
          } else {
            if (this.formMore.copyTask.frontID == null) {
              this.$notify({
                type: "info",
                message: "请选择新的执行人",
              });
            } else {
              this.$refs.xmCopy.loadBtn(true);
              this.$http
                .post("/Project/Job/CopyJob.ashx", this.formMore.copyTask)
                .then((resp) => {
                  if (resp.res == 0) {
                    this.beforInit(resp.data.newJobID);
                    this.$notify({
                      message: resp.msg,
                      type: "success",
                    });
                    this.$modal.hide("copyTask");
                    Object.assign(
                      this.$data.formMore.copyTask,
                      this.$options.data().formMore.copyTask
                    );
                  }
                  this.$refs.xmCopy.loadBtn(false);
                });
            }
          }
          return;
        case 5: //删除任务
          ifNotifyPnt = true;
          title = "删除成功";
          success = () => {
            this.$modal.hide(this.modalName);
          };
          break;
      }

      //访问接口
      this.$http
        .post("/Project/taskExtend.ashx", {
          jobid: this.myJobID,
          typeId: type,
          uids: uids,
          intid: intid,
          tpStr: tpStr,
          tpEvStr: tpEvStr,
        })
        .then((res) => {
          if (res.res == 0) {
            this.$notify({
              title: title,
              msg: res.msg,
              type: "success",
            });
            if (ifNotifyPnt) {
              //如果任务被删除，第二个参数返回的true
              this.$emit("updated", this.crtTask, type == 5);
            }
            success(res.data);
          } else {
            failed(res.data);
          }
        });
    },

    //变更任务的状态
    async changeStatus(status) {
      const that = this;
      const submit = (value, text) => {
        console.log(value);
        let oldVal = JSON.parse(JSON.stringify(that.crtTask.status));
        if (oldVal == value) return;
        that.crtTask.status = value;
        let type = null; //1申请完成审核 2申请扩展，修改时间 3申请暂停
        let msg = "变更成功";
        if (status == 3) {
          type = 3; //申请暂停
          if (this.crtTask.frontMan.UId !== this.crtTask.tester.UId) {
            msg = "申请成功";
          }
        } else if (status == 4) {
          if (!text.length) {
            return false;
          }
          that.infoCtrl.showTimeEditor = false;
          type = 2; //申请扩展，修改时间
          if (this.crtTask.frontMan.UId == this.crtTask.tester.UId) {
            //审核人为自己
            that.crtTask.status = 2;
            this.crtTask.estimatedTime = this.formTask.estimatedTime;
          } else {
            msg = "申请成功";
          }
        } else if (status == 7) {
          msg = "提交成功";
          type = 1;
        }
        that.$http
          .post("/Project/taskSubmitReview.ashx", {
            tag: value,
            jobId: that.myJobID,
            typeId: type,
            Cancel: value == 99 ? 4 : null,
            reason: text,
            dp: that.formTask.endTime,
            stime: that.formTask.startTime,
            estimateTime: that.formTask.estimatedTime,
          })
          .then((res) => {
            if (res.res == 0) {
              that.$notify({
                type: "success",
                title: msg,
              });
              if (msg != "变更成功") {
                that.loadTab(this.TAB_TYPE.REVIEW);
              }
              if (res.data.Schedule) {
                that.crtTask.status = res.data.Schedule;
              }

              this.$emit("updated", this.crtTask);
            } else {
              that.crtTask.status = oldVal;
            }
          });
      };
      switch (parseInt(status)) {
        case 0: //设为待定
          this.$confirm("是否确认将任务设置为待定中？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true,
          })
            .then(() => {
              submit(status);
            })
            .catch(() => {});
          return;
        case 1:
          let resp = await this.$http.get(
            "/Project/Job/CheckUserWorkAreaJobRun.ashx",
            {
              params: {
                JobId: this.myJobID,
              },
            }
          );
          if (resp.res == 0) {
            if (resp.data) {
              this.$confirm(
                "当前任务正在执行中，如果设置为未开始将取消执行，是否确认继续？",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                  center: true,
                }
              )
                .then(() => {
                  submit(status);
                })
                .catch(() => {});
            } else {
              submit(status);
            }
          }
          return;
        case 3: //申请暂停
          if (!this.crtTask.tester.UId) {
            this.$notify({
              type: "info",
              message: "未设置审核人",
            });
            return;
          }
          this.$prompt("请输入暂停此任务的原因", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          })
            .then((reason) => {
              if (reason.value) {
                if (this.crtTask.frontMan.UId == this.crtTask.tester.UId) {
                  //审核人为自己  修改为暂停中
                  submit(3, reason.value);
                } else {
                  submit(4, reason.value);
                }
              } else {
                this.$message({
                  type: "warning",
                  message: "请输入暂停此任务原因",
                });
                return false;
              }
            })
            .catch(() => {});
          return;
        case 4: //申请修改时间
          if (this.formMore.reasonTimeEdit.length) {
            submit(4, this.formMore.reasonTimeEdit);
          } else {
            this.$message({
              type: "warning",
              message: "请输入修改扩展时间原因",
            });
          }
          break;
        case 7: //提交完成
          if (this.crtTask.frontMan.UId != this.user.id) {
            this.$notify({
              type: "info",
              message: "您不是执行人，不能提交任务",
            });
            return;
          }
          if (!this.crtTask.frontMan.UId || !this.crtTask.tester.UId) {
            this.$notify({
              type: "info",
              message: "请设置执行人和审核人",
            });
          } else {
            if (this.crtTask.startTime && this.crtTask.estimatedTime) {
              this.$confirm("是否要提交任务", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "success",
                center: true,
              })
                .then(() => {
                  submit(4);
                })
                .catch(() => {});
            } else {
              this.$notify({
                type: "info",
                message: "开始时间和预估时间必填",
              });
            }
          }
          return;
        default:
          //其它不需要确认的状态
          submit(status);
          break;
      }
    },

    //设置任务标签
    setTab(item, i) {
      let type = 2;
      let oldTags = JSON.parse(JSON.stringify(this.crtTask.tags));
      if (_.some(this.crtTask.tags, ["JTId", item.JTId])) {
        this.crtTask.tags.splice(i, 1);
      } else {
        this.crtTask.tags.push(item);
        type = 1;
      }

      this.$http
        .post("/Project/taskLabel.ashx", {
          jobid: this.myJobID,
          typeId: type,
          value: item.JTId,
        })
        .then((res) => {
          if (res.res == 1) {
            this.crtTask.tags = oldTags;
          } else {
            this.$emit("updated", this.crtTask);
          }
        });
    },

    //成员选择器选中后赋值
    memberSel(type, value) {
      if (type == 2) {
        this.formMore.attentions = value;
      } else if (type == 4) {
        value.forEach((item) => {
          this.formMore.copyTask.frontID = item.UId;
        });
      }
    },

    //提交选择的成员
    memberSubmit(type, value = []) {
      let nu =
        value.length > 0
          ? value[0]
          : {
              UId: null,
              UName: "",
              Picture: "",
            };
      let ou = [];
      let nid = value.map((aa) => aa.UId);

      let that = this;
      let valueOld = null;
      let success = function() {};
      let failed = function() {};

      switch (type) {
        case 1: //修改执行人
          ou = this.crtTask.frontMan;
          if (nu.UId == ou.UId) {
            return;
          }
          valueOld = JSON.parse(JSON.stringify(this.crtTask.frontMan));
          this.crtTask.frontMan = nu;
          nid = nu.UId;
          success = function() {
            that.$emit("updated", that.crtTask);
          };
          failed = function() {
            that.crtTask.frontMan = valueOld;
          };
          break;
        case 2: //修改审核人
          ou = this.crtTask.tester;
          if (nu.UId == ou.UId) {
            return;
          }
          valueOld = JSON.parse(JSON.stringify(this.crtTask.tester));
          this.crtTask.tester = nu;
          nid = nu.UId;
          failed = function() {
            that.crtTask.tester = valueOld;
          };
          break;
        case 3: //修改上级负责人
          ou = this.crtTask.pntFrontMan;
          if (nu.UId == ou.UId) {
            return;
          }
          valueOld = JSON.parse(JSON.stringify(this.crtTask.pntFrontMan));
          this.crtTask.pntFrontMan = nu;
          nid = nu.UId;
          failed = function() {
            that.crtTask.pntFrontMan = valueOld;
          };
          break;
        case 4: //修改参与者
          ou = this.crtTask.participant.map((aa) => aa.ParticipantID);
          if (_.isEqual(nid.sort(), ou.sort())) {
            return;
          }
          valueOld = JSON.parse(JSON.stringify(this.crtTask.participant));
          this.crtTask.participant = JSON.parse(JSON.stringify(value));
          success = function() {
            let pids = that.crtTask.participant.map((aa) => aa.UId);
            that.powCtrl.isParticipant = pids.indexOf(that.user.id) >= 0;
          };
          failed = function() {
            that.crtTask.participant = valueOld;
          };
          break;
      }

      this.$http
        .post("/Project/taskRoleEdit.ashx", {
          jobid: this.myJobID,
          typeId: type,
          valueId: nid,
        })
        .then((res) => {
          if (res.res == 0) {
            this.$notify({
              title: "修改成功",
              msg: res.msg,
              type: "success",
            });
            success();
          } else {
            failed();
          }
        });
    },

    /*------ 基本信息的函数（END）-----*/

    /*------ 选项卡区域的函数（START）-----*/

    //切换选项卡的事件
    toggleTab(tab) {
      //将评论回复对象全部清空
      this.loadTab(tab.name);
    },

    //按页数加载选项卡的各种列表（执行）
    loadTab(type, page = 1) {
      if (type == 8) {
        this.getAssistRecord();
        return;
      }
      this.loadTabFn(type)(page);
    },

    //按页数加载选项卡的各种列表（Function）
    loadTabFn(type) {
      return (page = 0) => {
        //加载成功的回调函数
        let success = () => {};
        //单页数量
        let pageCount = 0;

        switch (type) {
          case this.TAB_TYPE.COMMENT:
            this.loadStatus.comment = true;
            pageCount = this.tabCtrl.commentCount;
            if (page == 0) {
              page = ++this.tabCtrl.comment;
            } else {
              this.tabCtrl.comment = page;
            }

            success = (res) => {
              this.loadStatus.comment = false;
              this.loaded.comment = res.page.CurrentPage >= res.page.TotalPage;
              if (page == 1) {
                this.crtTask.comments = res.data;
              } else {
                this.crtTask.comments.concat(res.data);
              }
            };
            break;
          case this.TAB_TYPE.REVIEW:
            this.loadStatus.review = true;
            pageCount = this.tabCtrl.reviewCount;
            if (page == 0) {
              page = ++this.tabCtrl.review;
            } else {
              this.tabCtrl.review = page;
            }

            success = (res) => {
              this.loadStatus.review = false;
              this.loaded.review = res.page.CurrentPage >= res.page.TotalPage;
              if (page == 1) {
                this.crtTask.reviews = res.data;
              } else {
                this.crtTask.reviews.concat(res.data);
              }
            };
            break;
          case this.TAB_TYPE.ANNEX:
            this.loadStatus.annex = true;
            pageCount = this.tabCtrl.annexCount;
            if (page == 0) {
              page = ++this.tabCtrl.annex;
            } else {
              this.tabCtrl.annex = page;
            }

            success = (res) => {
              this.loadStatus.annex = false;
              this.loaded.annex = res.page.CurrentPage >= res.page.TotalPage;
              if (page == 1) {
                try {
                  this.crtTask.annexs = res.data;
                } catch {}
              } else {
                this.crtTask.annexs.concat(res.data);
              }
            };
            break;
          case this.TAB_TYPE.DYNAMIC:
            this.loadStatus.dynamic = true;
            pageCount = this.tabCtrl.dynamicCount;
            if (page == 0) {
              page = ++this.tabCtrl.dynamic;
            } else {
              this.tabCtrl.dynamic = page;
            }

            success = (res) => {
              this.loadStatus.dynamic = false;
              this.loaded.dynamic = res.page.CurrentPage >= res.page.TotalPage;
              if (page == 1) {
                this.crtTask.dynamics = res.data;
              } else {
                this.crtTask.dynamics.concat(res.data);
              }
            };
            break;

          case this.TAB_TYPE.REMIND:
            this.loadStatus.remind = true;
            this.$http
              .post("/Project/QueryTaskTrmindList.ashx", {
                JobId: this.myJobID,
              })
              .then((res) => {
                this.loadStatus.remind = false;
                if (res.res == 0) {
                  this.crtTask.reminds = res.data;
                }
              });
            return;
          case this.TAB_TYPE.DAILY:
            this.loadStatus.daily = true;
            pageCount = this.tabCtrl.dailyCount;
            if (page == 0) {
              page = ++this.tabCtrl.daily;
            } else {
              this.tabCtrl.daily = page;
            }

            success = (res) => {
              this.loadStatus.daily = false;
              this.loaded.daily = res.page.CurrentPage >= res.page.TotalPage;
              if (page == 1) {
                try {
                  this.crtTask.dailys = res.data;
                } catch {}
              } else {
                this.crtTask.dailys.concat(res.data);
              }
            };
            break;
        }

        this.$http
          .post("/Project/taskTab.ashx", {
            jobid: this.myJobID,
            page: page,
            pageCount: pageCount,
            typeId: type,
          })
          .then((res) => {
            if (res.res == 0) {
              success(res.data);
            }
          });
      };
    },
    //发送评论（普通，回复，回复审核记录）
    sendComment(params) {
      this.$http
        .post("/General/CmtPost.ashx", {
          ctn: params.ctn,
          type: 1,
          id: this.myJobID,
          FaId: params.parent.id,
          CommentType: params.CommentType,
          AudioSec: params.AudioSec,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.$refs.comment.success(resp.data);
          }
        });
    },
    // 开始审核
    startReview(item) {
      this.formMore.review = JSON.parse(JSON.stringify(item));
      this.formMore.review.states = 1;
      this.formMore.review.qualityScore = 4;
      this.formMore.review.efficiencyScore = 4;
      this.formMore.review.contents = [
        {
          Type: "",
          Content: "",
        },
      ];
    },
    toPro(evid, isPro) {
      if (isPro) {
        this.$modal.show("projectDetail");
      } else if (this.$route.name === "task") {
        this.$notify({
          type: "info",
          message: "已经在此项目中",
        });
      } else {
        this.$modal.hide(this.modalName);
        setTimeout(() => {
          this.$router.push({
            name: "task",
            params: {
              eid: evid,
            },
          });
        }, 500);
      }
    },
    //新增审核的一项扩展内容
    addReviewCtn() {
      this.formMore.review.contents.push({
        Type: "",
        Content: "",
      });
    },

    //删除审核的某项扩展内容
    removeReviewCtn(i) {
      this.formMore.review.contents.splice(i, 1);
    },

    //确认审核
    submitReview(isSubmit) {
      if (isSubmit) {
        //提交审核
        this.infoCtrl.loadingRevBtn = true;
        this.$http
          .post("/Project/taskReview.ashx", {
            AiId: this.formMore.review.aid,
            States: this.formMore.review.states,
            EfficiencyScore:
              this.formMore.review.checkType == 1
                ? this.formMore.review.efficiencyScore
                : null,
            QualityScore:
              this.formMore.review.checkType == 1
                ? this.formMore.review.qualityScore
                : null,
            Contents: JSON.stringify(this.formMore.review.contents),
            Msg: this.formMore.reviewCmt,
          })
          .then((res) => {
            this.infoCtrl.loadingRevBtn = false;
            if (res.res == 0) {
              this.getTaskDetail({
                reloadTab: true,
              });
              this.$emit("updated", this.crtTask);
              if (this.page == "approval") {
                this.$emit("handleBeforInit");
                this.$emit("successHandle");
              }
            }
          });
      } else {
        //取消审核
        this.formMore.review = null;
        this.formMore.reviewCmt = "";
      }
    },
    //上传成功
    upChange(success, error) {
      let _this = this;
      var value = [];
      success.forEach((file) => {
        let item = {
          addres: file.response.link,
          addsize: file.raw.size,
          addtype: file.raw.type,
          inforClassId: 1,
          name: file.name,
        };
        value.push(item);
      });
      this.$http
        .post("/Project/taskFileUpload.ashx", {
          jobid: this.myJobID,
          type: 1,
          value: value,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.loadTab(this.TAB_TYPE.ANNEX);
            this.$notify({
              type: "success",
              message: `${success.length}个文件上传成功`,
            });
          }
        });
    },
    //删除文件
    deleteFile(data) {
      this.$http
        .post("/Project/taskFileUpload.ashx", {
          type: 3,
          jobid: this.myJobID,
          ifid: data.fileId,
        })
        .then((res) => {
          if (res.res == 0) {
            this.crtTask.annexs.splice(data.rowIndex, 1);
            this.$notify({
              type: "success",
              title: res.msg,
            });
          }
        });
    },

    //判断是否需要分割线
    checkIsNeedDivider(type, i) {
      switch (type) {
        case this.TAB_TYPE.DYNAMIC:
          if (i == 0) {
            return true;
          }
          const crt = this.crtTask.dynamics[i];
          const last = this.crtTask.dynamics[i - 1];

          const lastDay = new Date(last.tsTakeTime).getYMD();
          const crtDay = new Date(crt.tsTakeTime).getYMD();
          if (lastDay.reduce(crtDay) >= 1) {
            return true;
          }
          break;
      }
      return false;
    },

    //删除提醒
    delRemind(rid) {
      this.$confirm("确认删除这项提醒？", "提示", {
        type: "warning",
      }).then(() => {
        this.$http
          .post("/Project/DelTaskTrmind.ashx", {
            TId: rid,
          })
          .then((res) => {
            if (res.res == 0) {
              this.$notify({
                type: "success",
                title: res.msg,
              });
              this.loadTab(this.TAB_TYPE.REMIND);
            }
          })
          .catch(() => {});
      });
    },

    /*------ 选项卡区域的函数（END）-----*/

    /*------ 其它函数（START）-----*/
    opened() {
      this.thisOpened = true;
      this.init();
    },
    closed() {
      this.thisOpened = false;
      this.task_addId(null);
      this.clear();
    },
    xmodalLoaded() {
      this.$emit("loadSuccess");
    },
    //判断角色
    ROLE: function(pow) {
      switch (pow) {
        case "主要人员": //创建者 或 执行人 或 上级负责人
          return (
            this.powCtrl.isCreator ||
            this.powCtrl.isFrontMan ||
            this.powCtrl.isPntFrontMan
          );
        case "创建者":
          return this.powCtrl.isCreator;
        case "执行人":
          return this.powCtrl.isFrontMan;
        case "上级负责人":
          return this.powCtrl.isPntFrontMan;
        case "审核人":
          return this.powCtrl.isTester;
        default:
          //只要是任务里面的人
          return (
            this.powCtrl.isCreator ||
            this.powCtrl.isFrontMan ||
            this.powCtrl.isTester ||
            this.powCtrl.isPntFrontMan ||
            this.powCtrl.isParticipant
          );
      }
    },

    //判断当前任务是否属于或不属于某个或某些类型
    TYPE(name, contain = true) {
      if (typeof name == "string") {
        name = [name];
      }
      let res = false;
      if (contain) {
        //包含
        this.$D.LIST("task_type").map((item) => {
          if (name.indexOf(item.key) >= 0 && item.value == this.type) {
            res = true;
          }
        });
      } else {
        //不包含
        res = true;
        this.$D.LIST("task_type").map((item) => {
          if (name.indexOf(item.key) >= 0 && item.value == this.type) {
            res = false;
          }
        });
      }
      return res;
    },

    //判断任务标签是否已被选中
    isTagSelected(id) {
      return this.crtTask.tags.map((aa) => aa.JTId).indexOf(id) >= 0;
    },

    //复制链接后的回调
    copySuccess: function() {
      this.$notify({
        type: "success",
        title: "复制成功",
      });
    },
    copyError: function() {
      this.$notify({
        type: "error",
        title: "复制失败",
        msg: "请确认浏览器是否支持此功能",
      });
    },

    //初始化表单（计划进度走势图）
    initChart_Plan() {
      if (!this.$refs.planChart) {
        return;
      }
      const chart = this.$echarts.init(this.$refs.planChart);

      var base = +new Date(1968, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var date = [];

      var data = [Math.random() * 300];

      for (var i = 1; i < 20000; i++) {
        var now = new Date((base += oneDay));
        date.push(
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
        );
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      }

      const option = {
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "1968-2019 计划进度走势",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
          },
        ],
        series: [
          {
            name: "模拟数据",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(255, 70, 131)",
            },
            areaStyle: {
              color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)",
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)",
                },
              ]),
            },
            data: data,
          },
        ],
      };

      chart.setOption(option);
    },
    getTaskRelation() {
      this.$http
        .post("/Project/taskProcessMap.ashx", {
          jid: this.myJobID,
        })
        .then((res) => {
          if (res.res == 0) {
            this.relationArr = res.data;
          }
        });
    },
    //介入
    //获取介入列表
    getAssistRecord(arr) {
      this.$http
        .post("/Project/QueryJoin.ashx", {
          JId: this.myJobID,
        })
        .then((res) => {
          this.assistRecord = [];
          if (res.res == 0) {
            this.assistRecord = res.data;
          }
        });
    },
  },
  created() {
    this.$E.$on("upChildTask", (obj) => {
      if (this.$refs.childJob && obj.isChildren) {
        this.$refs.childJob.initFun(true, true);
        this.getTaskDetail({}, true);
      }
    });
    this.$E.$on("scShot", (res) => {
      if (res.type == 1) {
        let arr = JSON.parse(res.imgUrl);
        let html = "";
        if (arr.length) {
          html = `<img src=${this.$url +
            JSON.parse(res.imgUrl)[0].ImgUrl} style="width:200px"/>`;
        } else {
          html = "";
          this.$message({
            type: "warning",
            message: "截图失败",
          });
        }
        this.formTask.description += html;
      }
    });
  },
  watch: {
    //监听变化，实时判断当前用户是否为【创建人】
    "crtTask.creator.id"(uid) {
      this.powCtrl.isCreator = this.user.id == uid;
    },
    //监听变化，实时判断当前用户是否为【任务执行人】
    "crtTask.frontMan.UId"(uid) {
      this.powCtrl.isFrontMan = this.user.id == uid;
    },
    //监听变化，实时判断当前用户是否为【审核人】
    "crtTask.tester.UId"(uid) {
      this.powCtrl.isTester = this.user.id == uid;
      if (!this.thisLoaded && uid > 0) {
        if (
          this.powCtrl.isTester &&
          this.$D.CHECK("task_status", "待评审", this.crtTask.status)
        ) {
          if (this.queryParams == false) {
            this.tabCtrl.tabActive = "2";
            this.loadTab(this.TAB_TYPE.REVIEW);
          }
          this.queryParams = true;
        }
        this.thisLoaded = true;
      }
    },
    //监听变化，实时判断当前用户是否为【上级负责人】
    "crtTask.pntFrontMan.UId"(uid) {
      this.powCtrl.isPntFrontMan = this.user.id == uid;
    },
    //任务id
    jid(newVal, oldVal) {
      this.myJobID = newVal;
    },
    myJobID(newVal, oldVal) {
      this.$emit("changJid", newVal);
    },
    url(newVal) {
      this.myurl = newVal;
    },
  },
  filters: {
    //根据审核扩展类型ID显示对应类型名称
    formatReviewContentType(atid, types) {
      const item = _.find(types, function(o) {
        return o.AtId == atid;
      });
      if (item) {
        return item.Name;
      } else {
        return "";
      }
      return "";
    },

    //根据审核类型显示对应的类型名
    formatReviewType(checkType, $D) {
      return $D.ITEM("task_review_type", checkType).name;
    },

    //根据审核状态显示对应的状态名
    formatReviewStatus(status) {
      if (status == 1) {
        return "通过";
      } else if (status == 2) {
        return "未通过";
      } else if (status == 3) {
        return "审核中";
      } else if (status == 4) {
        return "已撤销";
      } else {
        return "未知";
      }
    },

    //根据分数显示对应的等级
    formatScore(score) {
      if (score >= 4.5) {
        return "优秀";
      } else if (score == 4) {
        return "正常";
      } else if (score >= 3) {
        return "瑕疵";
      } else if (score >= 2) {
        return "较差";
      } else {
        return "不行";
      }
    },
    //根据数组显示对应的角色名
    showRoles(g, $D) {
      let res = "";
      for (let v of g) {
        res += $D.ITEM("task_role", v).name + ",";
      }
      return res.trimRight(",");
    },
  },
};
</script>

<style lang="less" scoped>
.clear-time {
  & > div {
    padding-top: 1.5rem;
    text-align: right;
    margin: 0;
  }

  span {
    color: #409eff;
  }
}

//头部
/deep/ .xmTaskDtl .header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.6rem;
  height: 5rem;
  flex: 0 0 5rem;
  border-bottom: 1px solid #eee;
  background: #fff;
  box-sizing: border-box;

  //前进后退按钮
  .arrows {
    .normal {
      cursor: pointer;
      transition: color 0.3s ease;
      font-size: 3rem;
      margin-right: 1rem;

      &:hover {
        color: #448ef5;
      }
    }

    .disabled {
      font-size: 3rem;
      margin-right: 1rem;
      color: #ccc;
    }
  }

  //项目名
  .pro {
    color: #ccc;
    font-size: 2rem;
    cursor: pointer;
  }

  //按钮组
  .btns {
    a,
    button {
      border: none;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      transition: color 0.3s ease;
      font-size: 1.8rem;
      margin-left: 0;
      background: none;
      margin-right: 1.2rem;
      padding: 0;

      &:hover {
        color: #448ef5;
      }

      &.hi-star-in {
        color: #ffde34;
      }

      &.hi-close {
        font-size: 1.6rem;
        margin-right: 0;
      }
    }

    s {
      display: inline-block;
      vertical-align: middle;
      border-right: 1px solid #ccc;
      margin-right: 1.2rem;
      height: 2rem;
    }
  }
}

//内容
/deep/ .xmTaskDtl .ctn {
  display: flex;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 5rem);

  [class^="mb-"] {
    display: none;
  }

  //左边基本信息
  .left {
    width: 62%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;

    //任务名称
    .name {
      margin-bottom: 0.5rem;

      .el-dropdown {
        display: inline-block;
      }

      .priority {
        font-size: 1.6rem;
        padding: 0.5rem 1.6rem;
        border-radius: 4px;
        margin-right: 0.5rem;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
      }

      & > div > span {
        display: inline-block;
        font-size: 2.4rem;
        font-weight: 600;
        max-width: 70%;
        // max-width: 70%;
        vertical-align: middle;
        word-break: break-all;

        .el-icon-edit {
          display: inline-block;
          vertical-align: middle;
          font-size: 2.5rem;
          color: #aaa;
          margin-left: 0.5rem;
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: #448ef5;
          }
        }
      }

      & > div > .el-input {
        /deep/ input {
          font-size: 2.2rem !important;
          height: 4rem;
          line-height: 4rem;
        }
      }
    }

    .kpi-tag {
      position: relative;
      top: -4px;
      font-size: 1.4rem;
    }

    //任务状态，执行人，审核人，上级负责人
    .people {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      padding-bottom: 3.2rem;
      margin-bottom: 2rem;
      .single {
        flex: 1;

        .block {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          margin-top: 1.6rem;
          margin-right: 1.6rem;
          padding: 1rem 0;
          border-radius: 8px;
          position: relative;
          transition: all 0.3s;
          cursor: pointer;

          &:hover {
            padding: 1rem 1.2rem;
            box-shadow: 0px 6px 25px -5px #448ef590;
          }

          i,
          img {
            display: inline-block;
            width: 5rem;
            height: 5rem;
            line-height: 5rem;
            font-size: 6rem;
            border-radius: 50%;
            text-align: center;
            margin-right: 1.35rem;
            box-sizing: border-box;
            border: 0px solid #fff;
            left: 0;
            top: 0;

            &.hi-user-task {
              background: #f4f4f4;
              box-sizing: border-box;
              font-size: 2.5rem;
              color: #9b9b9b;
            }
          }

          & > div:last-child {
            position: relative;
            display: block;
            width: 100%;

            & > h3 {
              font-size: 2rem;
              color: #575757;
              font-weight: 600;
              white-space: nowrap;
              display: block;

              &.empty {
                color: #9b9b9b;
              }
            }

            & > div {
              min-width: 7rem;
              font-size: 1.5rem;
              color: #9b9b9b;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        & > .block {
          cursor: inherit;
        }
      }
    }

    //基本信息
    .info {
      border-bottom: 1px solid #eee;
      margin-bottom: 2rem;

      & > :first-child {
        height: 3.2rem;
      }

      & > div {
        display: flex;
        position: relative;
        align-items: center;
        padding-bottom: 1.5rem;

        & > h3 {
          position: absolute;
          left: 0;

          & > i {
            color: #979797;
            font-size: 2.25rem;
            margin-right: 1rem;
            vertical-align: middle;
          }

          & > span {
            color: #9b9b9b;
            font-size: 1.7rem;
            vertical-align: middle;
          }
        }

        & > div {
          width: 100%;
          padding-left: 11rem;
          box-sizing: border-box;

          b {
            font-size: 1.6rem;
            height: 3.2rem;
            line-height: 3.2rem;
            font-weight: 600;
            color: #6d6d6d;
            vertical-align: middle;
            margin-right: 0.3rem;
          }

          i.hi-question {
            color: #ccc;
            margin-left: 5px;
          }
        }

        &.titleTop {
          align-items: flex-start;
          margin-bottom: 0.5rem;

          & > h3 {
            padding-top: 1.2rem;
          }
        }

        a.btn {
          display: inline-block;
          cursor: pointer;
          font-size: 1.6rem;
          border-radius: 4px;
          padding: 0;
          width: 8.5rem;
          height: 3.2rem;
          line-height: 3.2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: #f2f2f2;
          color: #6d6d6d;

          i {
            font-size: 1.8rem;
          }

          &:hover {
            color: #448ef5;
          }

          &:active {
            background: #ddd;
          }

          &.btn-auto {
            padding: 0 1rem;
            width: auto;
          }
        }

        /deep/ & .fr-box {
          box-shadow: 0 8px 16px -3px rgba(0, 0, 0, 0.2);
        }

        /deep/ & .fr-wrapper,
        /deep/ & .fr-toolbar {
          border: none;
        }
      }

      //时间设置
      & > .time > div {
        display: flex;
        justify-content: space-between;

        & > .time-left {
          display: flex;
          align-items: center;

          & > s {
            padding: 0 1rem;
          }

          & > u {
            display: none;
          }

          & > span {
            font-size: 2rem;
            white-space: nowrap;

            &.end {
              margin-right: 1rem;
            }
          }
        }
        .qwq {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 20px;
          cursor: pointer;
        }
        & > div {
          a.btn {
            margin-left: 1rem;

            i {
              display: none;
            }
          }
        }
      }

      //进度
      & > .progress {
        align-items: flex-start;

        & > div > .progress-item {
          max-width: 56rem;
          display: flex;
          margin-bottom: 1rem;

          & > div {
            flex: auto;
          }

          /deep/.el-progress-bar__inner {
            max-width: 100% !important;
          }

          & > span {
            margin-left: 0.5rem;
            color: #9b9b9b;
            font-size: 1.4rem;
            flex: 0 0 8rem;
          }
        }
      }

      //退款编辑
      .priority {
        .el-icon-edit {
          display: inline-block;
          vertical-align: middle;
          font-size: 2rem;
          color: #aaa;
          margin-left: 0.5rem;
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: #448ef5;
          }
        }
      }

      //描述
      & > .des {
        .des-btns {
          margin: 1.6rem 0;
        }

        .fr-view {
          font-size: 1.6rem;
          margin-top: 1rem;
        }
      }

      //标签
      & > .tag {
        & > div::after {
          content: "";
          display: block;
          clear: both;
        }

        ul {
          float: left;

          li {
            display: block;
            float: left;
            background: #f2f2f2;
            border-radius: 4px;
            padding: 0 1.6rem;
            height: 3.2rem;
            line-height: 3.2rem;
            margin-right: 0.5rem;
            font-size: 1.4rem;
            color: #6d6d6d;
            position: relative;
            transition: padding 0.3s ease;
            overflow: hidden;
            display: flex;
            align-items: center;

            a {
              cursor: pointer;
              font-size: 1.2rem;
              opacity: 0;
              transition: all 0.3s ease;
              position: absolute;
              right: 1rem;

              &:hover {
                color: #448ef5;
              }
            }

            &:hover {
              padding-right: 2.5rem;

              a {
                opacity: 1;
              }
            }
          }

          .el-dropdown {
            float: left;
          }

          &::after {
            display: block;
            content: "";
            clear: both;
          }
        }
      }

      & > .connect-kpi {
        & > div::after {
          content: "";
          display: block;
          clear: both;
        }

        /deep/.el-button {
          padding: 0px;

          &:hover {
            color: #fff;
            background-color: #f56c6c;
            border-color: #f56c6c;
          }

          i {
            display: inline-block;
            padding-right: 10px;
          }
        }

        .kpi-btn {
          font-size: 1.6rem;
          cursor: pointer;
          height: 3.8rem;

          .kpi {
            position: relative;
            margin-right: 10px;
            height: 3.8rem;
            display: inline-block;
            line-height: 3.8rem;
            padding-right: 10px;
            padding-left: 10px;
            position: relative;
            top: -1px;
            left: -1px;
            border-radius: 4px 0 0 4px;

            &::after {
              content: "";
              position: absolute;
              display: inline-block;
              width: 1px;
              height: 3rem;
              top: 0.4rem;
              background: #eee;
              right: 0px;
              transition: all 0.2s;
            }

            &:hover {
              background: #f78989;

              &::after {
                top: 0;
                height: 3.8rem;
              }
            }
          }
        }
      }

      //预估耗时
      & > .estimate {
        & > div > div > span {
          color: #c0c4cc;
          font-size: 1.6rem;
          margin-right: 1rem;
        }

        .el-input {
          width: 8.5rem;
          height: 3.2rem;
          line-height: 3.2rem;
          padding: 0;
          vertical-align: middle;

          /deep/ input {
            width: 100%;
            height: 100%;
            line-height: 1;
          }

          /deep/ .el-input__icon {
            padding-right: 0.5rem;
            line-height: initial !important;
          }
        }

        a {
          display: inline-block;
          vertical-align: middle;
          font-size: 1.6rem;
          width: 5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          border-radius: 2.5rem;
          text-align: center;
          transition: background 0.3s ease;
          color: #9b9b9b;
          cursor: pointer;

          &.primary {
            color: #448ef5;
          }

          &:hover {
            background: #f2f2f2;
          }
        }

        div {
          display: flex;
          align-items: center;
          position: relative;

          & > s {
            margin: 0 0.5rem;
          }

          & > u {
            display: none;
          }

          .standard-time {
            margin-left: 2rem;
          }

          .standard-time-show {
            margin-left: 1rem;
          }

          .el-tooltip {
            display: inline-block;
          }
        }
      }

      //创建者
      & > .creator {
        display: block;
        min-height: unset;
        // padding: 1rem 0;
        padding-bottom: 0.5rem;
        font-size: 1.4rem;
        text-align: right;
        color: #9b9b9b;
        height: auto;
      }
    }

    //参与者
    .participant {
      & > h3 {
        font-size: 2rem;
        color: #9b9b9b;
        margin-bottom: 1rem;

        & > a {
          font-size: 1.4rem;
          color: #6d6d6d;
          background: #f2f2f2;
          vertical-align: middle;
          transition: all 0.3s ease;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 2rem;

          &:hover {
            background: #ddd;
          }
        }
      }
    }

    //关系图
    .relation {
      & > h3 {
        font-size: 2rem;
        color: #9b9b9b;
        margin: 2rem 0 1rem;
        display: flex;
        justify-content: space-between;
      }
    }

    //关注者
    .concern {
      margin-top: 2rem;

      & > h3 {
        font-size: 2rem;
        color: #9b9b9b;
        margin-bottom: 1rem;
      }
    }

    //计划进度走势图
    .planChart {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;

      & > div {
        height: 30rem;
      }
    }

    //滚动条
    & {
      .fatherName {
        box-sizing: border-box;
        max-width: 80%;
        display: inline-block;
        height: 2.5rem;
        font-size: 1.6rem;
        color: #9b9b9b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.5s ease;

        &:hover {
          cursor: pointer;
          color: black;
        }
      }

      & > div {
        padding: 3rem;
        min-height: 100%;
        box-sizing: border-box;
        position: relative;

        &::after {
          content: "";
          display: block;
          width: 0.4rem;
          height: 100%;
          top: 0;
          bottom: 0;
          right: 0;
          background: #eee;
          position: absolute;
        }
      }

      &::-webkit-scrollbar-thumb {
        background: #d8d8d8;
      }

      &::-webkit-scrollbar-track-piece {
        background: #eee;
      }
    }
  }

  //右边选项卡
  .right {
    width: 38%;
    height: 100%;

    & > div {
      height: 100%;
      box-sizing: border-box;
      position: relative;

      &::after {
        content: "";
        display: block;
        width: 0.34rem;
        height: 100%;
        left: 0;
        bottom: 0;
        right: 0;
        background: #eee;
        position: absolute;
      }

      .el-tabs {
        height: 100%;

        /deep/ .el-tabs__header {
          width: 100%;
          position: absolute;
          box-sizing: border-box;
          padding: 1.5rem 3rem 0;

          /deep/ .el-tabs__item {
            font-size: 1.6rem;
            color: #9b9b9b;
            padding: 0;

            /deep/ &.is-active {
              color: #448ef5;
            }
          }

          /deep/ .el-tabs__active-bar {
            height: 4px;
            border-radius: 4px;
          }
        }

        /deep/ .el-tabs__content {
          height: 100%;
          padding-top: 5rem;
          box-sizing: border-box;

          /deep/ & > .el-tab-pane {
            height: 100%;
          }
        }
      }

      .el-tab-pane {
        /deep/ .el-loading-mask {
          left: 5px;
          z-index: 100001;
        }

        & > div {
          height: 100%;
          padding-left: 0.34rem;
          box-sizing: border-box;

          &:not(.comments):not(.annexs):not(.remind) {
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
          }
        }
      }

      //审核
      .reviews {
        //审核列表
        .revCtn {
          flex: 1;
          padding: 1.5rem 3rem;
          overflow-y: auto;
          overflow-x: hidden;

          & > ul {
            padding-right: 0.5rem;

            li {
              position: relative;
              padding: 0.8rem 3rem;
              padding-right: 0;
              border-bottom: 1px solid #eee;

              &:last-child {
                border-bottom: none;
              }
            }

            li.un {
              padding: 1.2rem 4rem;
              padding-right: 1.6rem;
              background: #448ef5;
              color: #d4e6ff;
              border-radius: 4px;
            }
          }

          & > div {
            position: relative;
            padding: 0.8rem 3rem;
            padding-right: 0;
          }

          .single {
            //审核过（全部状态）
            & {
              & > i {
                position: absolute;
                left: 0;
                top: 1.1rem;
                font-size: 1.6rem;
                font-weight: normal;
                color: #bbb;
              }

              & > div {
                & > h3 {
                  margin-bottom: 0.5rem;
                  position: relative;

                  & > span {
                    margin-right: 0.5rem;
                    color: #409eff;
                    font-weight: 600;
                  }

                  & > small {
                    color: #9b9b9b;
                    font-size: 90%;
                  }

                  & > time {
                    color: #9b9b9b;
                    position: absolute;
                    right: 0;
                  }
                }

                & > div {
                  font-size: 1.6rem;
                  margin-top: 1rem;

                  & > div {
                    display: flex;
                    margin-bottom: 0.7rem;

                    &.rows {
                      align-items: flex-start !important;

                      & > div > span {
                        display: block;
                        margin-bottom: 0.5rem;

                        & > * {
                          display: inline;
                        }

                        & > h5 {
                          margin-right: 0.5rem;
                          color: #448ef5;
                          font-weight: 600;
                          font-size: 1.4rem;
                        }
                      }
                    }

                    /deep/ .el-rate {
                      height: auto;
                      margin-right: 0.5rem;

                      .el-rate__icon {
                        font-size: 2.4rem;
                        margin-right: 0.2rem;
                      }
                    }

                    & > em {
                      margin-left: 0.5rem;
                      color: #448ef5;
                    }
                  }

                  h4 {
                    display: inline;
                    color: #9b9b9b;
                    width: 7rem;
                    flex: 0 0 7rem;
                    white-space: nowrap;
                  }

                  b {
                    font-weight: 600;
                    color: #448ef5;

                    &.yes {
                      color: #75d030;
                    }

                    &.no {
                      color: #ed4b4b;
                    }
                  }
                }
              }
            }

            //待审核
            &.un {
              & > i {
                top: 1.6rem;
                left: 1.3rem;
                color: #d4e6ff;
              }

              & > div {
                & > h3 {
                  display: flex;
                  align-items: center;

                  & > span {
                    color: #fff;
                  }

                  & > small {
                    color: #d4e6ff;
                    margin-right: auto;
                  }

                  & > a {
                    cursor: pointer;
                    display: block;
                    border-radius: 5rem;
                    padding: 0.3rem 1.2rem;
                    color: #448ef5;
                    background: rgba(255, 255, 255, 0.92);
                    transition: all 0.3s ease;

                    &:hover {
                      background: #fafafa;
                      box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.2);
                    }
                  }
                }

                & > div {
                  h4 {
                    color: #d4e6ff;
                  }

                  b,
                  span {
                    color: #fff;
                  }
                }
              }
            }

            //审核中
            &.in {
              & > div {
                & > h3 > span {
                  color: #575757;
                }

                & > div {
                  margin-top: 2rem;

                  & > div {
                    display: flex;
                    align-items: center;
                    margin-bottom: 2rem;

                    & > h3 {
                      display: flex;
                      width: 100%;
                      align-items: auto;

                      & > div {
                        margin-right: auto;
                      }
                    }

                    & > span {
                      margin-left: 0.5rem;
                    }

                    &.msg {
                      align-items: flex-start;

                      & > h4 {
                        padding-top: 0.33rem;
                      }
                    }

                    &.extend {
                      display: block;

                      & > h3 {
                        color: #9b9b9b;
                        font-size: 1.4rem;
                        margin-bottom: 1rem;

                        & > a {
                          cursor: pointer;
                          transition: color 0.3s ease;

                          & > i {
                            margin-left: 0.3rem;
                          }

                          &:hover {
                            color: #448ef5;
                          }
                        }
                      }

                      & > ul {
                        & > li {
                          margin-bottom: 1rem;

                          /deep/ & > .el-input-group {
                            display: flex;
                            align-items: center;

                            .el-input-group__prepend {
                              flex: 0 0 12rem;
                              box-sizing: border-box;
                              border: none;

                              .el-select {
                                margin: 0 -20px;
                              }
                            }

                            .el-input__inner {
                              border-radius: 0;
                            }

                            .el-input-group__append {
                              height: 40px;
                              padding: 0;
                              flex: 0 0 5rem;
                              box-sizing: border-box;
                              border: none;

                              & > .el-button {
                                margin: 0;
                                height: 100%;
                                width: 100%;
                                padding: 0;
                                line-height: 1;
                                font-size: 1.6rem;

                                &:hover {
                                  color: #448ef5;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        .no-ctn > div {
          padding-bottom: 10rem;
        }
      }

      //动态
      .dynamics {
        padding: 1.5rem 3rem !important;

        .single {
          font-size: 1.6rem;
          padding: 1.2rem 0;
          padding-right: 3rem;
          position: relative;

          & > .el-divider {
            margin-top: 0.5rem;
            margin-bottom: 2.6rem;
            background: #eee;

            .el-divider__text {
              color: #ccc;
            }
          }

          & > div {
            position: relative;

            & > div {
              display: flex;
              align-items: flex-start;

              i {
                color: #bbb;
                margin-right: 0.8rem;
                flex: 0 0 1.8rem;
                font-size: 2rem;
              }

              span {
                width: 100%;

                /deep/ s {
                  color: #448ef5;
                }
              }
            }

            & > time {
              position: absolute;
              right: 0;
              top: 0;
              color: #bbb;
            }
          }
        }
      }

      //日报
      .dailys {
        & > div {
          padding: 1.5rem 3rem;
        }

        .no-ctn {
          background-color: #ffffff;
        }

        .d-container {
          background-color: #f6f6f6;
        }

        .single {
          box-sizing: border-box;
          font-size: 1.4rem;
          background: #ffffff;
          border-radius: 0.2rem;
          margin: 1rem;
          padding: 1rem 0.7rem;
          position: relative;
          overflow: hidden;

          .isOverTime {
            position: absolute;
            bottom: -45px;
            right: -19px;
            height: 45px;
            width: 65px;
            display: inline-block;
            text-align: center;
            background-color: #409eff;
            color: #ffffff;
            margin-bottom: 0;
            transform: rotate(-45deg);
            transform-origin: 0px 0px;
          }

          & > div {
            display: flex;
            margin-bottom: 1rem;

            & > span {
              margin-right: 0.5rem;
              color: #909399;
              white-space: nowrap;
            }

            .proress {
              flex: 1;
              display: flex;

              & > span {
                margin-right: 0.5rem;
                color: #909399;
              }

              & > p {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }

              & > div {
                width: 75%;
                margin-left: 0.5rem;
              }
            }
          }
        }
      }

      //提醒
      .remind {
        display: flex;
        flex-direction: column;
        position: relative;

        & > .addRemind {
          text-align: center;
          padding: 0 3rem;
          height: 7.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        & > .ctn {
          display: block;
          overflow-y: auto;
          padding: 0 3rem 2rem;
          height: calc(100% - 7.2rem);

          .single {
            position: relative;
            padding: 1rem 0;
            padding-left: 4rem;
            border-top: 1px solid #eee;

            & > i {
              position: absolute;
              color: #ccc;
              font-size: 3.2rem;
              left: 0rem;
            }

            & > time {
              position: absolute;
              right: 0;
              top: 1.1rem;
              color: #bbb;
              font-size: 1.3rem;

              & > i {
                display: none;
                font-size: 1.3rem;
                cursor: pointer;

                &::before {
                  margin-right: 3px;
                }

                &:hover {
                  color: #448ef5;
                }
              }

              & > span {
                display: block;
              }
            }

            & > h3 {
              margin-bottom: 0.5rem;
              color: #2d2d2d;

              & > em {
                color: #448ef5;
                font-weight: 600;
              }
            }

            & > div {
              font-size: 1.4rem;

              & > span,
              & > span > .el-popover__reference {
                color: #bbb;

                & > em {
                  display: inline-block;
                  padding: 0 0.3rem;
                  color: #2d2d2d;
                }
              }
            }

            &:hover {
              & > time {
                & > i {
                  display: block;
                }

                & > span {
                  display: none;
                }
              }
            }
          }
        }
      }

      //介入
      .assist {
        display: flex;
        flex-direction: column;
        position: relative;

        & > .addAssist {
          text-align: center;
          padding: 0 3rem;
          height: 7.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        & > .ctn {
          display: block;
          overflow-y: auto;
          padding: 0 3rem 2rem;
          height: calc(100% - 7.2rem);
        }

        .single {
          font-size: 1.6rem;
          padding: 1rem 0;
          position: relative;

          .el-card__body {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            padding: 1rem 1.5rem;
          }

          .line {
            display: flex;
            align-items: center;
            width: 49%;
            height: 3.6rem;

            .label {
              font-size: 1.4rem;
              color: #6d6d6d;
              flex: 0 0 12rem;
            }

            .info {
              display: flex;
              align-items: center;

              img {
                width: 3.4rem;
                height: 3.4rem;
                border-radius: 50%;
                margin-right: 0.5rem;
                border: 1px solid #ddd;
              }

              span {
                font-size: 1.4rem;
                color: #333;
                letter-spacing: 2px;
              }
            }

            div {
              font-size: 1.4rem;
              color: #333;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              max-width: 50%;
            }
          }
        }
      }
    }
  }
}

//申请修改时间的表单标题
.timeEditorTitle {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.6rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

//选择优先级的下拉
.prioritySelect {
  /deep/.el-dropdown-menu__item {
    line-height: 4rem;
  }

  /deep/.el-dropdown-menu__item:focus,
  /deep/.el-dropdown-menu__item:not(.is-disabled):hover {
    background: none;

    .item-tag {
      opacity: 0.7;
    }
  }
}

//优先级下拉选单里面的按钮样式
.item-tag {
  width: 8.5rem;
  height: 3.2rem;
  line-height: 3.2rem;
  display: inline-block;
  text-align: center;
  border-radius: 4px;
}

.no-task,
.no-ctn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #aaa;
  padding: 3.6rem 2rem;
  box-sizing: border-box;

  img {
    width: 100%;
    max-width: 32rem;
    margin-bottom: 5rem;
  }

  button {
    margin-top: 1.6rem;
  }
}

.no-ctn {
  align-items: center;
  padding: 0 2rem;

  img {
    max-width: 20rem;
  }
}

//表单中让下拉选框自动撑满屏幕
/deep/ .el-form-item.fill-item {
  .el-form-item__content {
    display: flex;
    align-items: center;

    & > .el-select {
      width: 100%;
    }
  }
}

@media screen and (max-width: 1440px) {
  /deep/.xmTaskDtl .ctn .left .info > div a.btn {
    width: 7.5rem;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 180px;
  }

  .xmTaskDtl .ctn .left .info > .estimate a {
    width: 4rem;
  }

  .xmTaskDtl .ctn .left .info > .estimate .el-input {
    width: 7.5rem;
  }
}

@media screen and (max-width: 991px) {
  //头部（移动端）
  /deep/ .xmTaskDtl .header {
    //项目名（移动端）
    .pro {
      display: none;
    }
  }

  //nav图标
  .hide-mobile {
    display: none;
  }

  //内容（移动端）
  /deep/ .xmTaskDtl .ctn {
    display: block;
    overflow-y: auto;
    overflow-x: hidden;

    //左边基本信息（移动端）
    .left {
      width: 100%;
      height: auto;
      overflow: auto;

      & > div {
        padding: 2rem 1.6rem;

        &::after {
          display: none;
        }
      }

      //任务名（移动端）
      .name {
        .el-dropdown,
        .el-dropdown-link {
          width: 100%;
          display: block;
        }

        .priority {
          display: block;
          text-align: center;
          margin-right: 0;
          margin-bottom: 0.8rem;
        }

        & > div > span {
          max-width: 88%;
          font-size: 2rem;
        }
      }

      //任务状态，执行人，审核人，上级负责人（移动端）
      .people {
        flex-wrap: wrap;
        padding-bottom: 1rem;
        margin-bottom: 0rem;

        .single {
          flex: 0 0 50%;

          .block {
            margin: 0;

            i,
            img {
              width: 3.6rem;
              height: 3.6rem;
              line-height: 3.6rem;
              font-size: 4.4rem;
              margin-right: 1rem;

              &.hi-user-task {
                font-size: 2rem;
                line-height: 4rem;
              }
            }

            & > div:last-child {
              & > h3 {
                font-size: 1.8rem;
              }

              & > div {
                font-size: 1.3rem;
              }
            }

            &:hover {
              padding: 0.7rem 0.8rem;
            }
          }
        }
      }

      //基本信息（移动端）
      .info {
        //任务时间（移动端）
        & > .time {
          display: block;
          height: auto;
          border-bottom: 1px solid #eee;
          padding-top: 1rem;
          position: relative;

          & > h3 {
            margin-bottom: 1rem;
            position: relative;
          }

          & > div {
            display: block;
            margin-bottom: 1rem;
            padding-left: 0;

            & > .time-left {
              display: block;
              padding-top: 1rem;

              & > span {
                display: inline-block;
                font-size: 1.6rem;
                margin-bottom: 0.5rem;
              }

              & > i {
                display: none;
              }

              & > s {
                display: block;
                overflow: hidden;
                width: 0;
                height: 0;
                padding: 0;
              }

              & > u {
                display: inline-block;
                font-size: 1.4rem;
              }

              & > .el-date-editor {
                margin-bottom: 0.5rem;
                width: 80%;
              }
            }

            & > .time-right {
              position: absolute;
              right: 0;
              top: 0.5rem;

              a.btn {
                width: 3rem;

                i {
                  display: inline-block;
                  font-size: 2.2rem;
                }

                p {
                  display: none;
                }
              }
            }
          }
        }

        //预估耗时（移动端）
        & > .estimate {
          display: block;
          border-bottom: 1px solid #eee;
          padding-top: 1rem;

          & > h3 {
            margin-bottom: 1rem;
            position: relative;
          }

          & > div {
            display: block;
            padding-left: 0;

            & > div {
              display: inline-block;

              .el-input {
                display: inline-block;
              }

              & > span {
                vertical-align: middle;
              }
            }

            & > s {
              display: block;
              overflow: hidden;
              width: 0;
              height: 0;
              padding: 0;
            }

            & > u {
              display: inline-block;
              font-size: 1.4rem;
              margin-bottom: 1.3rem;
            }

            .el-tooltip {
              display: none;
            }

            .standard-time {
              display: none;
            }

            .standard-time-show {
              margin-left: 0;
            }
          }
        }

        //进度（移动端）
        & > .progress {
          display: block;
          padding-top: 1rem;
          border-bottom: 1px solid #eee;

          & > h3 {
            margin-bottom: 1rem;
            position: relative;
          }

          & > div {
            max-width: unset;
            margin: 1.2rem 0;
            padding-left: 0;
          }
        }

        //描述（移动端）
        & > .des {
          display: block;
          padding-top: 1rem;
          border-bottom: 1px solid #eee;
          position: relative;

          & > h3 {
            position: absolute;
            top: 1rem;
            left: 0.5rem;
          }

          & > div {
            min-height: 3rem;
            padding-left: 0;

            & > a.btn {
              position: absolute;
              top: 1rem;
              right: 0;
            }

            & > div {
              margin-top: 4rem;
            }
          }
        }

        & > .tag {
          border-bottom: none !important;
        }

        //标签（移动端）
        & > .tag,
        & > .priority {
          padding-top: 1rem;
          border-bottom: 1px solid #eee;
          justify-content: space-between;

          & > h3 {
            position: relative;
          }

          & > div {
            width: unset;
            padding-left: 0;

            ul {
              &::after {
                display: none;
              }

              li {
                margin-bottom: 0.5rem;
              }
            }
          }
        }

        //创建者（移动端）
        & > .creator {
          text-align: left;
        }
      }

      //立即审核（移动端）
      .mb-review {
        display: block;
        margin-bottom: 0.8rem;

        & > button {
          display: block;
          width: 100%;
          font-weight: 600;
          font-size: 1.6rem;
        }

        .ev {
          color: #9b9b9b;
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      &::after {
        display: none;
      }
    }

    //右边选项卡（移动端）
    .right {
      width: 100%;
      overflow: auto;
      height: auto;
      border-top: 1px solid #eee;

      & > div {
        &::after {
          display: none;
        }

        & > .el-tabs {
          /deep/ .el-tabs__header {
            padding: 1rem 1.5rem;
          }

          /deep/ .el-tabs__content {
            padding-top: 5rem;
          }
        }

        //审核（移动端）
        .reviews {
          //审核列表
          .revCtn {
            padding: 1.6rem;

            & > .reviewArea {
              position: fixed;
              box-sizing: border-box;
              width: 100vw;
              height: 100vh;
              padding: 1rem;
              top: 0;
              left: 0;
              overflow: auto;
              background: #fff;

              .hi-review {
                display: none;
              }
            }
          }
        }

        //动态（移动端）
        .dynamics {
          padding: 1rem 1.5rem !important;

          .single {
            & > div {
              time {
                top: 0;
                margin-left: 2.2rem;
                font-size: 1.4rem;
                position: relative;
              }
            }
          }
        }

        //日报（移动端）
        .dailys {
          & > div {
            padding: 1rem 0.5rem;
          }
        }

        .assist {
          .addAssist {
            height: 4.2rem;
          }

          .ctn {
            padding: 1rem 0.5rem;
          }

          .single {
            padding: 0;
            margin-bottom: 0.8rem;

            /deep/.el-card__body {
              flex-direction: column;
            }

            .line {
              width: 100%;
              justify-content: space-between;

              & > div {
                display: flex;
                flex-wrap: wrap;
                overflow: visible;
                white-space: pre-wrap;
                max-width: 70%;
              }
            }
          }
        }
      }
    }
  }

  //选择优先级的下拉
  .prioritySelect.full {
    width: 88%;

    .item-tag {
      width: 100%;
    }
  }
}
</style>
