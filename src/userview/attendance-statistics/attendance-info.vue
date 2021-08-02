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
              <ul class="genera-info">
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
                  <el-col :sm="24" :md="6">
                    <p
                      class="cell-title-left"
                      v-text="parseInt(data.day.split('-').slice(2))"
                    ></p>
                  </el-col>
                  <el-col :sm="24" :md="18" class="hidden-md-and-up">
                    <p
                      class="cell-title-right"
                      @click="
                        attendanceCellPcClick(
                          $event,
                          attenceData[
                            parseInt(data.day.split('-').slice(2)) - 1
                          ]
                        )
                      "
                    >
                      {{
                        attenceData[parseInt(data.day.split("-").slice(2)) - 1]
                          .Type
                          ? attenceData[
                              parseInt(data.day.split("-").slice(2)) - 1
                            ].Type.slice(0, -1)
                          : ""
                      }}
                    </p>
                  </el-col>
                  <el-col :sm="24" :md="18" class="hidden-sm-and-down">
                    <!-- <p
                      class="cell-title-right"
                      v-if="
                        !attenceData[parseInt(data.day.split('-').slice(2)) - 1]
                          .Flag
                      "
                      @click="
                        attendanceCellPcClick(
                          $event,
                          attenceData[
                            parseInt(data.day.split('-').slice(2)) - 1
                          ]
                        )
                      "
                    >
                      {{
                        attenceData[parseInt(data.day.split("-").slice(2)) - 1]
                          .Type
                      }}
                    </p> -->
                    <p
                      class="cell-title-right"
                      v-show="Boolean(new Date() > new Date(date))"
                    >
                      当日办公：{{
                        attenceData[parseInt(data.day.split("-").slice(2)) - 1]
                          .DayTime
                      }}小时
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

    <!-- 考勤组统计 -->
    <XModal
      name="attenceStatic"
      title="考勤统计"
      width="98%"
      height="90%"
      :showCrossBtn="true"
      @opened="openStatic"
      class="attence-static"
      @closed="closeStatic"
    >
      <div v-loading="modalLoading">
        <div class="time-pick">
          <div style="display: flex">
            <el-select
              v-model="selectType"
              style="width: 120px"
              :clearable="false"
              @change="selectTypeChange"
            >
              <el-option label="按考勤组" :value="1"></el-option>
              <el-option label="按成员" :value="2"></el-option>
            </el-select>
            <el-select
              v-model="listType"
              v-if="selectType == 1"
              style="width: 200px"
            >
              <el-option
                v-for="(item, index) in attenceGroup"
                :value="item.AgId"
                :label="item.Name"
                :key="index"
              ></el-option>
            </el-select>
            <selMember
              size="small"
              @Confirm="getSelAttenceMember"
              :selRange="1"
              :arrays="selAttenceMem"
              v-if="selectType == 2"
              :showLength="5"
            ></selMember>
            <el-date-picker
              style="margin-left: 1rem"
              v-model="selectMonth"
              type="month"
              placeholder="请选择月份"
              value-format="yyyy-MM"
              :clearable="false"
              format="yyyy-MM"
            ></el-date-picker>
            <label class="exclude">
              <el-checkbox v-model="Attend">排除未出勤人员</el-checkbox>
              <el-checkbox v-model="Quit">排除离职人员</el-checkbox>
            </label>
            <el-button
              type="primary"
              size="medium"
              @click="handleSearch"
              style="margin-left: 1rem"
            >
              <i class="hiFont hi-search"></i>查询
            </el-button>
          </div>
          <div style="display: flex" class="select-time">
            <div style="margin-right: 2rem"></div>
            <el-button type="primary" size="medium" @click="exportFile">
              <i class="el-icon-download"></i>导出
            </el-button>
          </div>
        </div>
        <el-table
          :data="attenceGroupTable"
          border
          style="width: 100%; margin: 1.5rem 0"
          :header-row-class-name="tableHeaderStyle"
          :cell-style="attenceCellStyle"
          :header-cell-style="attenceHeaderStyle"
        >
          <el-table-column
            prop="PerScore"
            label="平均绩效"
            class="table-header"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.PerScore }}分</span>
            </template>
          </el-table-column>
          <el-table-column label="出勤" class="table-header">
            <el-table-column
              prop="ShouldAttendance"
              label="应出勤"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.ShouldAttendance ? scope.row.ShouldAttendance : 0
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
            <el-table-column prop="Leave" label="请假" class="table-header">
              <template slot-scope="scope"
                >{{ scope.row.Leave ? scope.row.Leave : 0 }}天</template
              >
            </el-table-column>
            <el-table-column prop="Adjust" label="调休" class="table-header">
              <template slot-scope="scope"
                >{{ scope.row.Adjust ? scope.row.Adjust : 0 }}天</template
              >
            </el-table-column>
            <el-table-column
              prop="OutsideTotalHour"
              label="外出"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.OutsideTotalHour ? scope.row.OutsideTotalHour : 0
                }}小时</template
              >
            </el-table-column>
            <el-table-column
              prop="Absenteeism"
              label="旷工"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.Absenteeism ? scope.row.Absenteeism : 0
                }}天</template
              >
            </el-table-column>
            <el-table-column
              prop="DeductionLeave"
              label="抵扣后的请假"
              class="table-header"
              width="120"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.DeductionLeave ? scope.row.DeductionLeave : 0
                }}天</template
              >
            </el-table-column>
          </el-table-column>
          <el-table-column label="缺卡" class="table-header">
            <el-table-column prop="StartCard" label="上班" class="table-header">
              <template slot-scope="scope"
                >{{ scope.row.StartCard ? scope.row.StartCard : 0 }}次</template
              >
            </el-table-column>
            <el-table-column prop="EndCard" label="下班" class="table-header">
              <template slot-scope="scope"
                >{{ scope.row.EndCard ? scope.row.EndCard : 0 }}次</template
              >
            </el-table-column>
          </el-table-column>
          <el-table-column label="早退" class="table-header">
            <el-table-column
              prop="LeaveEarly"
              label="早退"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.LeaveEarly ? scope.row.LeaveEarly : 0
                }}次</template
              >
            </el-table-column>
            <el-table-column
              prop="SeriousLeaveEarly"
              label="严重早退"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.SeriousLeaveEarly ? scope.row.SeriousLeaveEarly : 0
                }}次</template
              >
            </el-table-column>
          </el-table-column>
          <el-table-column label="迟到" class="table-header">
            <el-table-column prop="Late" label="迟到" class="table-header">
              <template slot-scope="scope"
                >{{ scope.row.Late ? scope.row.Late : 0 }}次</template
              >
            </el-table-column>
            <el-table-column
              prop="SeriousLate"
              label="严重迟到"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.SeriousLate ? scope.row.SeriousLate : 0
                }}次</template
              >
            </el-table-column>
          </el-table-column>
          <el-table-column label="加班" class="table-header">
            <el-table-column
              prop="OverTime"
              label="总时长"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{ scope.row.OverTime ? scope.row.OverTime : 0 }}小时</template
              >
            </el-table-column>
            <el-table-column
              prop="EffectiveOverTime"
              label="有效时长"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.EffectiveOverTime ? scope.row.EffectiveOverTime : 0
                }}小时</template
              >
            </el-table-column>
            <el-table-column
              prop="DeductionOver"
              label="抵扣后的时长"
              class="table-header"
              width="120"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.DeductionOver ? scope.row.DeductionOver : 0
                }}小时</template
              >
            </el-table-column>
          </el-table-column>
          <el-table-column label="简报" class="table-header">
            <el-table-column
              prop="NotSubBulletin"
              label="未提交"
              class="table-header"
            ></el-table-column>
            <el-table-column
              prop="RejectBulletin"
              label="被驳回"
              class="table-header"
            ></el-table-column>
            <el-table-column
              prop="NotAuditBulletin"
              label="未审批"
              class="table-header"
            ></el-table-column>
            <el-table-column
              prop="NotApprovedBulletin"
              label="未被审批"
              class="table-header"
            ></el-table-column>
          </el-table-column>
          <el-table-column prop="ReimbursementPrice" label="金额">
            <el-table-column prop="ReimbursementPrice" label="报销">
              <template slot-scope="scope"
                >￥ {{ scope.row.ReimbursementPrice }}</template
              >
            </el-table-column>
            <el-table-column prop="Fine" label="罚款">
              <template slot-scope="scope">￥ {{ scope.row.Fine }}</template>
            </el-table-column>
            <el-table-column prop="bonus" label="奖金">
              <template slot-scope="scope">￥ {{ scope.row.Bonus }}</template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <h3 style="text-align: center">成员列表</h3>
        <el-table
          :data="attenceGroupList"
          border
          style="width: 100%; margin: 1.5rem 0"
          :header-row-class-name="tableHeaderStyle"
          :cell-style="attenceCellStyle"
          :header-cell-style="attenceHeaderStyle"
          @cell-click="toDetail"
        >
          <el-table-column prop="Name" label="成员姓名"></el-table-column>
          <el-table-column
            prop="PerScore"
            label="绩效分数"
            class="table-header"
            sortable
            width="90"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.PerScore }}分
                <span title="KPI记录">
                  <i
                    class="hiFont hi-task record_icon"
                    @click="handleKPI(scope.row)"
                  ></i>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="出勤" class="table-header">
            <el-table-column
              prop="ShouldAttendance"
              label="应出勤"
              class="table-header"
              sortable
            >
              <template slot-scope="scope"
                >{{ scope.row.ShouldAttendance }}天</template
              >
            </el-table-column>
            <el-table-column
              prop="ActualAttendance"
              label="实际出勤"
              class="table-header"
              sortable
              width="90"
            >
              <template slot-scope="scope">
                {{ scope.row.ActualAttendance }}天
                <span title="考勤记录">
                  <i
                    class="hiFont hi-task record_icon"
                    @click="handleAttendance(scope.row, 1, 99)"
                  ></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Leave"
              label="请假"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                {{ scope.row.Leave }}天
                <span title="请假记录">
                  <i
                    class="hiFont hi-task record_icon"
                    @click="handleAttendance(scope.row, 2, 5)"
                  ></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Adjust"
              label="调休"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                {{ scope.row.Adjust }}天
                <span title="调休记录">
                  <i
                    class="hiFont hi-task record_icon"
                    @click="handleAttendance(scope.row, 10, 5)"
                  ></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="OutsideTotalHour"
              label="外出"
              class="table-header"
            >
              <template slot-scope="scope"
                >{{
                  scope.row.OutsideTotalHour ? scope.row.OutsideTotalHour : 0
                }}小时</template
              >
            </el-table-column>
            <el-table-column
              prop="Absenteeism"
              label="旷工"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                {{ scope.row.Absenteeism }}天
                <span title="旷工记录">
                  <i
                    class="hiFont hi-task record_icon"
                    @click="handleAttendance(scope.row, 3, 3)"
                  ></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DeductionLeave"
              label="抵扣后的请假"
              class="table-header"
              width="120"
              sortable
            >
              <template slot-scope="scope"
                >{{
                  scope.row.DeductionLeave ? scope.row.DeductionLeave : 0
                }}天</template
              >
            </el-table-column>
          </el-table-column>
          <el-table-column label="缺卡" class="table-header">
            <el-table-column
              prop="StartCard"
              label="上班"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.StartCard }}次
                  <span title="上班缺卡记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleAttendance(scope.row, 6, 2)"
                    ></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="EndCard"
              label="下班"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.EndCard }}次
                  <span title="下班缺卡记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleAttendance(scope.row, 7, 2)"
                    ></i>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="早退" class="table-header">
            <el-table-column
              prop="LeaveEarly"
              label="早退"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.LeaveEarly }}次
                  <span title="早退记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleAttendance(scope.row, 4, 1)"
                    ></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="SeriousLeaveEarly"
              label="严重早退"
              class="table-header"
              sortable
              width="90"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.SeriousLeaveEarly }}次
                  <span title="严重早退记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleAttendance(scope.row, 8, 4)"
                    ></i>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="迟到" class="table-header">
            <el-table-column
              prop="Late"
              label="迟到"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.Late }}次
                  <span title="迟到记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleAttendance(scope.row, 5, 1)"
                    ></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="SeriousLate"
              label="严重迟到"
              class="table-header"
              sortable
              width="90"
            >
              <template slot-scope="scope">
                <div>
                  {{ scope.row.SeriousLate }}次
                  <span title="严重迟到记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleAttendance(scope.row, 9, 4)"
                    ></i>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="加班" class="table-header">
            <el-table-column
              prop="OverTime"
              label="总时长"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                <span>{{ scope.row.OverTime }}小时</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="EffectiveOverTime"
              label="有效时长"
              class="table-header"
              sortable
              width="90"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.EffectiveOverTime }}小时
                  <span title="加班记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleCalc(scope.row)"
                    ></i>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DeductionOver"
              label="抵扣后的时长"
              class="table-header"
              width="120"
              sortable
            >
              <template slot-scope="scope"
                >{{
                  scope.row.DeductionOver ? scope.row.DeductionOver : 0
                }}小时</template
              >
            </el-table-column>
          </el-table-column>
          <el-table-column label="简报" class="table-header">
            <el-table-column prop="NotSubBulletin" label="未提交" sortable>
              <template slot-scope="scope">
                <span>
                  {{ scope.row.NotSubBulletin }}
                  <span title="未提交简报记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleBriefingInfo(scope.row, 1)"
                    ></i>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="RejectBulletin"
              label="被驳回"
              class="table-header"
              sortable
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.RejectBulletin }}
                  <span title="被驳回简报记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleBriefingInfo(scope.row, 4)"
                    ></i>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="NotAuditBulletin" label="未审批" sortable>
              <template slot-scope="scope">
                <span>
                  {{ scope.row.NotAuditBulletin }}
                  <span title="未审批简报记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleBriefingInfo(scope.row, 3)"
                    ></i>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="NotApprovedBulletin"
              label="未被审批"
              sortable
              width="90"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.NotApprovedBulletin }}
                  <span title="未被审批简报记录">
                    <i
                      class="hiFont hi-task record_icon"
                      @click="handleBriefingInfo(scope.row, 2)"
                    ></i>
                  </span>
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="金额" width="90">
            <el-table-column prop="ReimbursementPrice" label="报销" sortable>
              <template slot-scope="scope">
                ￥ {{ scope.row.ReimbursementPrice }}
                <span title="报销记录">
                  <i
                    class="hiFont hi-task record_icon"
                    @click="handleReimbursement(scope.row)"
                  ></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="Fine" label="罚款" sortable>
              <template slot-scope="scope"> ￥ {{ scope.row.Fine }} </template>
            </el-table-column>
            <el-table-column prop="Bonus" label="奖金" sortable>
              <template slot-scope="scope"> ￥ {{ scope.row.Bonus }} </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </XModal>
    <!-- 加班记录 -->
    <XModal
      title="加班记录"
      confirmBtnText="确认"
      @onConfirm="handleCalcConfirm()"
      name="calcTime"
      :showCrossBtn="true"
      height="65%"
      :isFixed="true"
    >
      <table class="calc-content">
        <tr style="font-weight: bold">
          <td>
            日期
            <el-date-picker
              v-model="calcConMonth"
              type="month"
              placeholder="请选择月份"
              value-format="yyyy-MM"
              :clearable="false"
              format="yyyy-MM"
              @change="getCalcDate"
            ></el-date-picker>
          </td>
          <td>加班时长</td>
        </tr>
        <tbody v-if="calcTableData && calcTableData.List.length > 0">
          <tr
            v-for="(item, index) in calcTableData.List"
            :key="index"
            @click="handleCalcInfo(item)"
          >
            <td>{{ item.day | dateFormat }}</td>
            <td>{{ item.time }}h</td>
          </tr>
          <tr>
            <td>有效加班时长:</td>
            <td>{{ calcTableData.totalTime }}小时</td>
          </tr>
        </tbody>
        <tr v-else>
          <td>该月没有加班记录</td>
        </tr>
      </table>
    </XModal>
    <!-- <XModal
      name="report"
      width="95%"
      height="95%"
      :url="'/attendances/' + obj.id + '/' + obj.day"
      referer="/attendances"
    >
      <Report :obj="obj" :detail="fatherDetail" :isMember="true"></Report>
    </XModal> -->
    <XModal
      name="attencePersonStatic"
      :title="activePerson + '的考勤'"
      width="95%"
      height="90%"
      :showCrossBtn="true"
      class="attence-static"
    >
      <div v-loading="personAttenceLoading">
        <h3>考勤汇总</h3>
        <el-table
          :data="attencePersonTable"
          border
          style="width: 100%; margin: 1.5rem 0"
          :header-row-class-name="tableHeaderStyle"
          :cell-style="attenceCellStyle"
          :header-cell-style="attenceHeaderStyle"
        >
          <el-table-column
            prop="ShouldAttendance"
            label="应出勤工时"
            class="table-header"
          >
            <template slot-scope="scope"
              >{{
                scope.row.ShouldAttendance ? scope.row.ShouldAttendance : 0
              }}小时</template
            >
          </el-table-column>
          <el-table-column
            prop="ActualAttendance"
            label="出勤工时"
            class="table-header"
          >
            <template slot-scope="scope"
              >{{
                scope.row.ActualAttendance ? scope.row.ActualAttendance : 0
              }}小时</template
            >
          </el-table-column>
          <el-table-column
            prop="StartCard"
            label="上班缺卡"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="EndCard"
            label="下班缺卡"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="LeaveEarly"
            label="早退"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="Late"
            label="迟到"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="Absenteeism"
            label="旷工"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="Adjust"
            label="调休天数"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="OutsideTotalHour"
            label="外出"
            class="table-header"
          >
            <template slot-scope="scope"
              >{{
                scope.row.OutsideTotalHour ? scope.row.OutsideTotalHour : 0
              }}小时</template
            >
          </el-table-column>
          <el-table-column
            prop="OverTime"
            label="加班总时长"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="EffectiveOverTime"
            label="有效加班时长"
            class="table-header"
          ></el-table-column>
          <el-table-column
            prop="SubmitreportNumber"
            label="应提交简报"
          ></el-table-column>
          <el-table-column
            prop="ActualSubmitreportNumber"
            label="实际提交简报"
          ></el-table-column>
        </el-table>
        <h3>考勤详情</h3>
        <el-table
          :data="attencePersonList"
          border
          style="width: 100%; margin: 1.5rem 0"
          :header-row-class-name="tableHeaderStyle"
          :cell-style="attenceCellStyle"
          :header-cell-style="attenceHeaderStyle"
        >
          <el-table-column prop="Date" label="日期" class="table-header">
            <template slot-scope="scope">{{
              scope.row.Date.timeFormat("yyyy年MM月dd日")
            }}</template>
          </el-table-column>
          <el-table-column
            prop="StartTime"
            label="上班时间"
            class="table-header"
          >
            <template slot-scope="scope">{{
              scope.row.StartTime
                ? scope.row.StartTime.timeFormat("HH:mm")
                : "无"
            }}</template>
          </el-table-column>
          <el-table-column
            prop="StartStatus"
            label="上班状态"
            class="table-header"
          >
            <template slot-scope="scope">{{
              scope.row.StartStatus
                ? $D.ITEM("at_state", scope.row.StartStatus).name
                : ""
            }}</template>
          </el-table-column>
          <el-table-column prop="EndTime" label="下班时间" class="table-header">
            <template slot-scope="scope">{{
              scope.row.EndTime ? scope.row.EndTime.timeFormat("HH:mm") : "无"
            }}</template>
          </el-table-column>
          <el-table-column
            prop="EndStatus"
            label="下班状态"
            class="table-header"
          >
            <template slot-scope="scope">{{
              scope.row.EndStatus
                ? $D.ITEM("at_state", scope.row.EndStatus).custom
                : ""
            }}</template>
          </el-table-column>
          <el-table-column
            prop="Type"
            label="日期类型"
            class="table-header"
          ></el-table-column>
        </el-table>
      </div>
    </XModal>
    <XModal
      name="applyAuditList"
      ref="applyAuditList"
      :title="activeItem"
      width="95%"
      height="90%"
      :showCrossBtn="true"
      @opened="openApplyList"
      @closed="closeModal"
    >
      <div slot="sel" v-if="activeItem == '审核列表'">
        <el-select v-model="applyType" class="sel-apply-type">
          <el-option label="未审批" :value="1"></el-option>
          <el-option label="已审批" :value="2"></el-option>
        </el-select>
      </div>
      <div class="attence-table">
        <el-table
          :cell-class-name="cellStyle"
          :data="tableData"
          class="footer-table"
          ref="attendances"
          style="width: 100%"
          @sort-change="sortChange"
          v-loading="attendanceLoading"
        >
          <template slot="empty" style="font-size: 0">
            <div style="height: 100%">
              <img
                src="../../assets/img/emptyTask.png"
                style="display: inline-block; width: 50%; margin-top: 100px"
              />
            </div>
          </template>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="申诉人">
                  <span>{{ props.row.UserName }}</span>
                </el-form-item>
                <el-form-item label="申诉日期">
                  <span>{{
                    props.row.Date
                      ? props.row.Date.timeFormat("yyyy-MM-dd HH:mm")
                      : "--:--:--"
                  }}</span>
                </el-form-item>
                <el-form-item label="申诉原因">
                  <span>{{ props.row.Reason }}</span>
                </el-form-item>
                <el-form-item label="审核状态">
                  <span>{{
                    $D.ITEM("affair_filter", props.row.AuditResult).name
                  }}</span>
                </el-form-item>
                <el-form-item label="审核人">
                  <span>{{ props.row.CurrentAuditorName }}</span>
                </el-form-item>
                <el-form-item label="驳回原因">
                  <span>{{
                    props.row.ComReason ? props.row.ComReason : "无"
                  }}</span>
                </el-form-item>
                <el-form-item
                  :label="
                    props.row.AuditResult !== 4 && props.row.AuditResult !== 3
                      ? '申诉前'
                      : '审核前'
                  "
                >
                  <p>
                    上午状态：
                    {{ $D.ITEM("at_state", props.row.BeForeStartStatus).name }}
                  </p>
                  <p>
                    下午状态：
                    {{ $D.ITEM("at_state", props.row.BeForeEndStatus).custom }}
                  </p>
                  <p>
                    上班时间：{{
                      props.row.BeForeStartTime
                        ? props.row.BeForeStartTime.timeFormat(
                            "yyyy-MM-dd HH:mm"
                          )
                        : "--:--:--"
                    }}
                  </p>
                  <p>
                    下班时间：{{
                      props.row.BeForeEndTime
                        ? props.row.BeForeEndTime.timeFormat("yyyy-MM-dd HH:mm")
                        : "--:--:--"
                    }}
                  </p>
                </el-form-item>
                <el-form-item
                  :label="
                    props.row.AuditResult !== 4 && props.row.AuditResult !== 3
                      ? '申诉后'
                      : '审核后'
                  "
                >
                  <p>
                    上午状态：
                    {{ $D.ITEM("at_state", props.row.StartStatus).name }}
                  </p>
                  <p>
                    下午状态：
                    {{ $D.ITEM("at_state", props.row.EndStatus).custom }}
                  </p>
                  <p>
                    上班时间：{{
                      props.row.StartTime
                        ? props.row.StartTime.timeFormat("yyyy-MM-dd HH:mm")
                        : "--:--:--"
                    }}
                  </p>
                  <p>
                    下班时间：{{
                      props.row.EndTime
                        ? props.row.EndTime.timeFormat("yyyy-MM-dd HH:mm")
                        : "--:--:--"
                    }}
                  </p>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="Date"
            min-width="100"
            label="申诉日期"
            :show-overflow-tooltip="true"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.Date
                  ? scope.row.Date.timeFormat("yyyy-MM-dd")
                  : "--:--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="申诉人"
            :show-overflow-tooltip="true"
            v-if="activeItem == '审核列表'"
          >
            <template slot-scope="scope">
              <div>
                <span style="display: inline-block; vertical-align: middle">{{
                  scope.row.UserName
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="Reason"
            min-width="100"
            label="申诉原因"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            min-width="100"
            label="AM/PM"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span slot="reference">
                <p>
                  上午：
                  {{ $D.ITEM("at_state", scope.row.BeForeStartStatus).name }}
                </p>
                <p>
                  下午：
                  {{ $D.ITEM("at_state", scope.row.BeForeEndStatus).custom }}
                </p>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="审核状态"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{
                $D.ITEM("affair_filter", scope.row.AuditResult).name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ComReason"
            min-width="100"
            label="驳回原因"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="CurrentAuditorName"
            min-width="100"
            label="审核人"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作" min-width="100" v-if="applyType !== 2">
            <template slot-scope="scope">
              <c-btn v-if="activeItem == '申诉列表'">
                <span
                  @click="handleDeltCancel(scope.$index, scope.row)"
                  v-if="
                    scope.row.AuditResult !== 4 && scope.row.AuditResult !== 3
                  "
                  >取消申诉</span
                >
                <i v-else style="color: #ddd; cursor: initial">取消申诉</i>
              </c-btn>
              <c-btn v-if="activeItem == '审核列表'">
                <span
                  @click="handleDelt(scope.$index, scope.row)"
                  v-if="
                    scope.row.AuditResult !== 4 && scope.row.AuditResult !== 3
                  "
                  >审核</span
                >
                <!-- <i v-else style="color: #DDD;cursor: initial;">审核</i> -->
              </c-btn>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <c-pages
        class="footer-page"
        v-model="pageData"
        @changeEvent="pageChange"
        v-if="tableData.length > 0"
        v-show="childData.menuType === 'publicAttendance'"
      ></c-pages>
    </XModal>
    <!-- 打卡时间线弹窗 -->
    <TimeLineModal :selDateTimeLine="selDateTimeLine"></TimeLineModal>
    <!-- 申诉审核弹窗 -->
    <!-- <appeal
      :popData="popData"
      ref="myAppeal"
      @appealSubmit="appealSubmit"
      :Type="appealType"
      @appealChange="appealChange"
    ></appeal> -->
    <!-- 考勤日历 -->
    <!-- <AttendanceCalendar
      :selUser="selUser"
      :timeHeaderToggle="selectMonth"
      :usid="selUser ? selUser.UsId : null"
      @getAppealData="appealData"
      @getCalendarModalData="getCalendarModal"
      ref="cale"
    ></AttendanceCalendar> -->
    <!-- 考核记录 -->
    <!-- <MyAssessmentModal
      :usid="selUser ? selUser.UsId : null"
    ></MyAssessmentModal> -->
    <!-- 报销记录 -->
    <!-- <ReimbursementModal
      :reimbursementData="selUser ? selUser.ReimbursementData.ProjectData : []"
    ></ReimbursementModal> -->
    <!-- 简报记录 -->
    <!-- <BriefingModal
      :briefingTypeData="briefingType"
      :usid="selUser ? selUser.UsId : null"
      :briefingDate="selectMonth"
      @reportData="reportData"
    ></BriefingModal> -->
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  props: ["childLoading", "fatData", "changeTab", "activeItem"],
  components: {
    TimeLineModal: () => import("./timeline-modal"),
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
    XModal: () => import("@/components/XModal"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  data() {
    return {
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
      noPass: false, // 默允许用户通过 申诉

      timeAttence: [],
      timeHeaderToggle: "",
      memberName: "",

      // 2020 02 13新增考勤申述审批功能
      tableData: [],
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      myOptions: ["考勤"],
      memOptions: ["考勤"],
      appealType: 1,
      //考勤汇总
      attenceTable: [], //个人考勤和成员考勤 日历对象
      // selectTimeYear: new Date().toLocaleString(),
      listType: 0, //考勤统计  选择的考勤组id
      // selectTimeMonth: new Date().getMonth() + 1,
      // selectTime: new Date(),
      selMem: [], //时间视图  选择成语
      selDep: [], //时间视图  选择部门
      selectMonth: new Date(), //考勤查询时间
      Attend: true, //未考勤
      Quit: true, //未离职
      attenceGroup: [], //考勤列表
      modalLoading: false,
      attenceGroupList: [], //考勤统计 （考勤组，成员） 个人列表
      attenceGroupTable: [], //考勤统计(考勤组，成员) 汇总
      attencePersonTable: [], //成员详情  个人汇总
      attencePersonList: [], //成员详情 每日详情列表
      personAttenceLoading: false, //考勤成员详情loading
      activePerson: "", //考勤成员详情成员名
      selectType: 1, //考勤类型
      selAttenceMem: [], //考勤统计选择成员
      formParams: {},
      applyType: 1,
      sortOrder: null,
      calcConMonth: null, //加班月份
      selUser: null, //要查看的人
      calcTableData: null, //加班记录
      obj: {
        id: "",
        day: "",
      },
      fatherDetail: {},
      isCalendarModal: 0,
      briefingType: null, //选择查看的简报类型
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
          message: "请先选择团队",
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
    applyType() {
      this.getTableList();
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
     * 分页
     */
    pageChange(val) {
      this.pageData = val;
      this.getTableList();
    },
    /**
     * 选择团队后的搜索
     */
    handleSearchData() {
      if (!this.teamValue) {
        this.$message({
          message: "请先选择团队",
          type: "warning",
        });
        return;
      }
      this.childData.time = this.timeHeaderToggle;
      this.childData.reqsTime = this.timeHeaderToggle;
      this.attenceData = {};
      this.getAttendance();
      // this.showData();
    },
    // teamOptionsData() {
    //   return this.teamOptions;
    // },
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
    selectTypeChange() {
      this.Attend = true;
      this.Quit = true;
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
    reportData(obj, fData) {
      this.obj = obj;
      this.fatherDetail = fData;
      this.$modal.show("report");
    },
    /**
     * 查看简报记录
     * type:1 未提交 3 未审批 2 未被审批
     */
    handleBriefingInfo(row, type) {
      this.briefingType = type;
      this.selUser = row;
      this.$modal.show("briefing");
    },
    /**
     * 查看报销记录
     */
    handleReimbursement(row) {
      this.selUser = row;
      this.$modal.show("reimbursementModal");
    },
    /**
     * 查看绩效
     */
    handleKPI(row) {
      this.selUser = row;
      this.$modal.show("myAssessmentModal");
    },
    /**
     * 查看考勤
     * row:选择的表格行数据
     * type：区分查看的记录
     * state：对应的考勤异常状态
     */
    handleAttendance(row, type, state) {
      this.selUser = row;
      this.selUser.type = type;
      this.selUser.stateData = state;
      if (type === 1) {
        this.selUser.typeData = `${this.selUser.Name}的考勤记录`;
      } else if (type === 2) {
        this.selUser.typeData = `${this.selUser.Name}的请假记录`;
      } else if (type === 3) {
        this.selUser.typeData = `${this.selUser.Name}的旷工记录`;
      } else if (type === 4) {
        this.selUser.typeData = `${this.selUser.Name}的早退记录`;
      } else if (type === 5) {
        this.selUser.typeData = `${this.selUser.Name}的迟到记录`;
      } else if (type === 6) {
        this.selUser.typeData = `${this.selUser.Name}的上班缺卡记录`;
      } else if (type === 7) {
        this.selUser.typeData = `${this.selUser.Name}的下班缺卡记录`;
      } else if (type === 8) {
        this.selUser.typeData = `${this.selUser.Name}的严重早退记录`;
      } else if (type === 9) {
        this.selUser.typeData = `${this.selUser.Name}的严重迟到记录`;
      } else if (type === 10) {
        this.selUser.typeData = `${this.selUser.Name}的调休记录`;
      }
      this.$modal.show("attendanceCalendar");
    },
    getCalendarModal(val) {
      this.isCalendarModal = val;
    },
    /**
     * 查看加班记录简报
     */
    handleCalcInfo(calc) {
      this.obj = {
        id: this.selUser.UsId,
        day: calc.day,
      };
      if (this.obj.id && this.obj.day) {
        this.$modal.show("report");
      }
      this.fatherDetail = {
        list: null,
        // index,
        // fatherIndex,
        isSuccess: false,
        isApprove: false,
        time: 0,
        isReject: false,
        IsOverwork: true,
        endTime: "",
      };
    },
    /**
     * 查看加班记录
     */
    handleCalc(row) {
      this.calcConMonth = this.selectMonth;
      this.selUser = row;
      //获取加班记录
      this.getCalcDate();
      this.$modal.show("calcTime");
    },
    /**
     * 获取加班记录数据
     */
    getCalcDate(usid) {
      this.$http
        .get("/work/report/GetUserOverTime.ashx", {
          params: {
            month: this.calcConMonth,
            usid: this.selUser.UsId,
          },
        })
        .then((res) => {
          if (res.res == 0) {
            this.calcTableData = res.data;
            console.log(this.calcTableData);
          }
        });
    },
    //加班记录确认
    handleCalcConfirm() {
      this.$modal.hide("calcTime");
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
    closeModal() {
      this.applyType = 1;
    },
    exportFile() {
      if (this.selectType == 1) {
        window.location.href =
          this.$url +
          "/Work/Attendance/AttendanceSumExport.ashx?Token=" +
          JSON.parse(window.localStorage.getItem("token")).data +
          "&SDate=" +
          this.selectMonth.timeFormat("yyyy-MM") +
          "&Type=1&GroupId=" +
          this.listType +
          "&Attend=" +
          this.Attend +
          "&Quit=" +
          this.Quit;
      } else {
        let arr = [];
        this.selAttenceMem.forEach((item) => {
          arr.push(item.UId);
        });
        arr = JSON.stringify(arr);
        window.location.href =
          this.$url +
          "/Work/Attendance/AttendanceSumExport.ashx?Token=" +
          JSON.parse(window.localStorage.getItem("token")).data +
          "&SDate=" +
          this.selectMonth.timeFormat("yyyy-MM") +
          "&Type=2&Ids=" +
          arr +
          "&Attend=" +
          this.Attend +
          "&Quit=" +
          this.Quit;
      }
    },
    getSelMember(arr) {
      this.selMem = arr;
      this.getTimeAttendance();
    },
    getSelAttenceMember(arr) {
      this.selAttenceMem = arr;
      // this.getuserList();
    },
    // PC单击cell 右上角li 才触发
    attendanceCellPcClick(e, obj) {
      // console.log('ajldfjalj')
      if (
        document.body.clientWidth > 991 &&
        e.currentTarget.textContent.trim() === "我要申诉"
      ) {
        this.appealType = 1;
        this.appealShow(obj); // 直接就打开弹层
      }
      if (
        document.body.clientWidth > 991 &&
        e.currentTarget.textContent.trim() === "修改考勤"
      ) {
        this.appealType = 2;
        this.appealShow(obj);
      }
    },

    // CX 我要申述 弹层（只 ‘工作日’ 类型才弹出）
    appealShow(obj) {
      let s1 = obj.EndStatus;
      let s2 = obj.StartStatus;
      // this.popData = obj;
      if (obj.Flag || Boolean(new Date() < new Date(obj.Date))) return false; // 审核中 节假类型 正常类型 日期大于‘今天’的类型 不让继续操作
      this.popData = obj;
      this.$modal.show("appeal"); // 这个打开弹层的原理仔细看下
    },
    // 点击日历,查看时间线
    handleDateInfo(bool, obj) {
      if (!bool) {
        return;
      }
      this.selDateTimeLine = obj;
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
    //申诉或审批触发改变列表方法
    appealSubmit() {
      if (this.activeItem == "审核列表") {
        this.getTableList();
      } else {
        this.attenceData = {};
        this.getAttendance();
      }
    },
    appealChange() {
      if (this.isCalendarModal === 0) {
        this.attenceData = {};
        this.getAttendance();
      } else {
        this.$refs.cale.monthChange();
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
    //获取个人申诉列表
    getPersonApplyList() {
      this.attendanceLoading = true;
      this.$http
        .post("/Work/Attendance/QueryMyAttendanceComplaint.ashx", {
          Date: this.childData.reqsTime,
          IsAsc: this.sortOrder,
        })
        .then((res) => {
          if (res.res == 0) {
            this.attendanceLoading = false;
            this.tableData = res.data;
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
    openStatic() {
      //打开考勤模态框

      if (this.attenceGroup.length) {
        this.listType = this.attenceGroup[0].AgId;
        // console.log(this.listType)
        // this.getAttenceGroupList();
        this.handleSearch();
      }
    },
    closeStatic() {},
    getAttenceList() {
      //获取考勤组列表
      this.modalLoading = true;
      this.$http
        .post("/Work/Attendance/AttendanceGroupListSummary.ashx#")
        .then((res) => {
          if (res.res == 0) {
            // this.attenceData = [];
            this.modalLoading = false;
            this.attenceGroup = res.data;
            // console.log(this.attenceGroup)
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
    toDetail(row, column) {
      //列表点击个人

      // console.log(column)
      if (column.label !== "成员姓名") {
        return;
      }
      this.activePerson = row.Name;
      this.$modal.show("attencePersonStatic");
      this.personAttenceLoading = true;
      if (row.UsId) {
        let arr = [];
        arr.push(row.UsId);
        this.$http
          .post("/MGT/Personnel/Work/AttendanceSummary.ashx", {
            SDate: this.selectMonth,
            // EDate:this.selectMonth,
            Ids: arr,
          })
          .then((res) => {
            if (res.res == 0) {
              this.personAttenceLoading = false;
              this.attencePersonTable = [];
              this.attencePersonTable.push(res.data.SunmmaryData);
              this.attencePersonList = res.data.UsersData;
            }
          });
      }
    },
    openApplyList() {
      this.tableData = [];
      console.log(this.activeItem);
      if (this.activeItem == "审核列表") {
        Object.assign(this.$data.pageData, this.$options.data().pageData);
        this.getTableList();
      } else {
        this.getPersonApplyList();
      }
    },
    // 获得审核列表
    getTableList() {
      this.attendanceLoading = true;
      let params = {
        PageIndex: this.pageData.pageIndex,
        PageSize: this.pageData.pageSize,
        Type: this.applyType,
        IsAsc: this.sortOrder,
      };
      this.$http
        .get("/Work/Attendance/QueryUsersAttendanceComplaintByAudit.ashx", {
          params: params,
        })
        .then((res) => {
          if (res.res == 0) {
            this.attendanceLoading = false;
            this.tableData = res.data.Data;
            this.pageData.totalNum = res.data.TotalCount;
          }
        });
    },
    sortChange({ column, prop, order }) {
      if (order == "ascending") {
        this.sortOrder = 1;
      } else if (order == null) {
        this.sortOrder = null;
      } else {
        this.sortOrder = 2;
      }
      if (this.activeItem == "审核列表") {
        this.getTableList();
      } else {
        this.getPersonApplyList();
      }
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
    // 打开审核窗口
    handleDelt(i, row) {
      // console.log(row)
      this.appealType = 3;
      this.popData = row;
      this.$modal.show("appeal");
      // this.formData.CId = row.CId
    },
    handleDeltCancel(i, row) {
      this.$confirm("确定取消此申诉?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/MGT/Process/AuditBack.ashx", {
              auditID: row.ID,
            })
            .then((res) => {
              // console.log(res)
              if (res.res == 0) {
                this.getPersonApplyList();
                this.getAttendance();
              }
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 鼠标hover处理 ’我要申述‘ 细节
    toggleWorkStateTxt(e, txt, type, date, bool, item) {
      let _this = e.currentTarget;
      // 1 单元格状态都是‘审核中’的不让通过
      // 2 单元格是休息日不让通过 3 格子日期大于今天的不让通过
      if (!item.ArId) {
        //没有考勤记录
        return false;
      }
      if (bool) {
        //审核中不能提交申述
        return false;
      }
      if (
        document.body.clientWidth <= 991 ||
        Boolean(new Date() < new Date(date))
      ) {
        return false;
      }
      if (
        item.UserId == this.user.id &&
        this.childData.menuType !== "publicAttendance"
      ) {
        switch (type) {
          case "over":
            _this.firstElementChild.lastElementChild.firstElementChild.textContent =
              "我要申诉";
            break;
          case "out":
            if (
              _this.firstElementChild.lastElementChild.firstElementChild.textContent.trim() ===
              "我要申诉"
            ) {
              _this.firstElementChild.lastElementChild.firstElementChild.textContent =
                txt;
            }
            break;
        }
      } else if (item.UserId !== this.user.id) {
        switch (type) {
          case "over":
            _this.firstElementChild.lastElementChild.firstElementChild.textContent =
              "修改考勤";
            break;
          case "out":
            if (
              _this.firstElementChild.lastElementChild.firstElementChild.textContent.trim() ===
              "修改考勤"
            ) {
              _this.firstElementChild.lastElementChild.firstElementChild.textContent =
                txt;
            }
            break;
        }
      }
    },
    // 只看异常考勤 按钮click
    toggleBtn() {
      this.onlyUnusual = !this.onlyUnusual;
      // 以下代码有用。别删，如果只看异常要求做重新排列，这的代码就有用（暂时注释，
      // 主要原因还是移动端没可能出现点击只看异常按钮的情况，在PC端不采用下面的代码个人感觉排版反而好看点，全屏情况）
      // 连贯效果：指定删除某一个
      // this.$nextTick(() => {
      //     if (this.onlyUnusual) {
      //         setTimeout(() => {
      //             let dom = document.getElementsByClassName('see-unusual not-unusual')
      //             for (let i = 0; i < dom.length; i++) {
      //                 dom[i].style.display = 'none'
      //             }
      //         }, 100)
      //         // 这个时间尽量短，在落下来之前就处理完，看起来就连贯些
      //     } else {
      //        let dom = document.getElementsByClassName('see-all')
      //         for (let i = 0; i < dom.length; i++) {
      //             dom[i].style.display = 'block'
      //         }
      //     }
      // })
    },
    // 行状态
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 4) return false;
      if (row.Status === 1) {
        return "is-check";
      } else if (row.Status === 2) {
        return "is-close";
      } else if (row.Status === 0) {
        return "is-more";
      }
    },
    appealData(pop, type) {
      this.popData = pop;
      this.appealType = type;
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
    // this.getAttenceList();
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
  .cell-info p {
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
