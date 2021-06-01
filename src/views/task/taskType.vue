<template>
  <div class="page">
    <div class="box">
      <div class="box_left">
        <div class="l_title1">
          <div class="l_title1_type1">{{ taskTypeModelTitle }}</div>
          <div class="l_title1_type2">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="cursor: pointer">
                {{ taskTypeModel }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in taskType"
                  :key="index"
                  @click.native="changeType(item)"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <!-- 按状态查看 -->
        <div class="l_title2" v-if="flag == 1">
          <div class="l_title2_title1" style="margin: 15px 0">
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
          </div>
          <div
            :class="{ l_title2_title1: true, active: item.id == activeTask }"
            v-for="item in $D
              .LIST('task_status')
              .sort((a, b) => {
                return a.custom - b.custom;
              })
              .filter((o) => {
                return o.custom;
              })"
            :key="item.value"
            style="margin-bottom: 16px; cursor: pointer"
            @click="activeList(item.value, 1, 'childLoading')"
          >
            <i
              :class="['hiFont', item.icon]"
              :style="{
                color: item.color,
                'font-size': '22px',
                'margin-right': '10px',
              }"
            ></i>
            <span>{{ item.name }}</span>
            <em>({{ numbers[0][item.value] }})</em>
          </div>
        </div>
        <!-- 按成员查看 -->
        <div class="l_title2" v-if="flag == 2">
          <!-- <div class="l_title2_title1" style="margin-bottom: 15px">
            <div class="l_title2_title1_left">所有</div>
            <div class="l_title2_title1_right">所有成员任务</div>
          </div> -->
          <div
            class="tip_text"
            v-if="numbers[1] == null || numbers[1].length == 0"
          >
            暂无更多内容
          </div>
          <!-- <el-input v-else placeholder="搜索成员" v-model="filterText" prefix-icon="el-icon-search"></el-input> -->
          <div v-show="searchGenera.length == 0">
            <!--XBB: 分组折叠的话直接照搬以下格式 -->
            <el-collapse accordion v-if="!isSearch">
              <el-collapse-item
                v-for="g in numbers[1]"
                :key="g.ReachID"
                :title="g.ReachName"
                ::percentage="0"
              >
                <ul class="title2_ul">
                  <li
                    v-for="gg in g.Item"
                    :key="gg.UsId"
                    :class="{ activeList: clickID[1] === gg.UsId }"
                    @click="activeList(gg.UsId, 2, 'childLoading')"
                  >
                    <img v-lazy="$url + gg.Picture" />
                    <span style="margin-left: 10px">{{ gg.Name }}</span>
                    <em>({{ gg.count }})</em>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
            <div v-else class="tip_text">未搜索到数据</div>
          </div>
        </div>
        <!-- 按需求查看第一个label是一级 -->
        <div class="l_title3" v-if="flag == 3" v-loading="dataTreeLoad">
          <div style="display: flex; flex-direction: column">
            <el-select
              v-if="flag == 3"
              v-model="selVersion"
              class="task_select"
              style="margin-top: 10px"
              @change="changeisProLeader"
              ><el-option label="所有版本" :value="null"></el-option
              ><el-option
                :label="ver"
                :value="ver"
                v-for="(ver, verind) in versionsAllData"
                :key="verind"
              ></el-option
            ></el-select>
            <el-select
              v-model="isProLeaderSelect"
              class="task_select"
              style="margin-top: 10px"
              placeholder="换用户视图"
              v-if="flag == 3"
              @change="changeisProLeader"
            >
              <el-option label="成员视图" :value="false"></el-option>
              <el-option label="个人视图" :value="true"></el-option>
            </el-select>
          </div>
          <div
            :class="`t3_title1 ${!allActive ? ' title1_active' : ''}`"
            @click="handleAlldemand"
            style="
              display: flex;
              justify-content: space-between;
              padding-right: 14px;
              align-items: center;
            "
          >
            所有需求
            <el-tooltip
              class="item"
              effect="dark"
              content="创建需求分类"
              placement="top"
            >
              <i
                class="el-icon-circle-plus"
                style="font-size: 24px; color: #448ef5"
                @click.stop="addDemandOpen(1)"
              ></i>
            </el-tooltip>
          </div>
          <div class="t3_box" v-for="item in dataTree" :key="item.label">
            <div class="box_top">
              <div
                :class="{ box_active: item.flagActive }"
                @click.stop="threeOpenActive(item)"
              >
                <i
                  class="el-icon-caret-right"
                  v-if="item.flag == false"
                  @click.stop="threeOpenClose(item)"
                ></i>
                <i
                  class="el-icon-caret-bottom"
                  v-if="item.flag == true"
                  @click.stop="threeOpenClose(item)"
                ></i>
                <span>{{ item.Name }}</span>
              </div>
              <div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="创建需求"
                  placement="top"
                >
                  <i
                    class="el-icon-circle-plus-outline"
                    @click.stop="addxqOK2(item, 1)"
                  ></i>
                </el-tooltip>
                <el-dropdown trigger="click" style="margin-left: 5px">
                  <span class="el-dropdown-link"
                    ><i class="el-icon-more"></i
                  ></span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="addDemandOpen(4, item)"
                      v-if="isProLeader"
                    >
                      <i class="el-icon-edit-outline"></i>
                      添加审核节点
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addDemandOpen(2, item)">
                      <i class="el-icon-edit-outline"></i>
                      编辑需求分类
                    </el-dropdown-item>
                    <el-dropdown-item
                      style="color: #f03e3e"
                      @click.native="addDemandOpen(3, item)"
                    >
                      <i class="el-icon-delete"></i>
                      删除需求分类
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="box_bottom" v-if="item.flag == true">
              <!-- <draggable element="ul" v-model="item.Childen" handle=".handle"> -->
              <div
                v-for="e in item.Demands"
                :class="{ box_li: true, active: activeLi === e.Name + e.Id }"
                :key="e.Id"
              >
                <div
                  v-if="activeLi === e.Name + e.Id"
                  style="margin-right: 5px"
                >
                  <i class="el-icon-menu handle"></i>
                </div>

                <div
                  style="
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                  "
                >
                  <div
                    @click.stop="getThreeLi(e, item)"
                    style="
                      width: 136px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                  >
                    <tooltip
                      :content="e.Name"
                      :ref="`demandLeftMenu-${e.Id}`"
                      width="136px"
                      @handleClick="getThreeLi(e, item)"
                    ></tooltip>
                  </div>
                  <el-dropdown
                    v-if="activeLi === e.Name + e.Id"
                    :ref="`topDro-${item.Name}`"
                    trigger="click"
                    placement="right-start"
                    :hide-on-click="false"
                  >
                    <span class="el-dropdown-link"
                      ><i class="el-icon-more"></i
                    ></span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="itemq in CheckOption">
                        <el-dropdown-item
                          v-if="
                            !itemq.Children &&
                              ((isProLeader &&
                                itemq.Name == '添加到审核节点') ||
                                itemq.Name != '添加到审核节点')
                          "
                          @click.native="
                            handleSelect(
                              itemq.Type,
                              e,
                              item.Name,
                              'topDro',
                              item
                            )
                          "
                        >
                          <div v-if="itemq.Type == 3" style="color: #f03e3e">
                            <span
                              class="hiFont"
                              :class="itemq.Icon"
                              style="color: #f03e3e"
                            ></span>
                            {{ itemq.Name }}
                          </div>
                          <div
                            class="el-dropdown-link"
                            v-else-if="itemq.Type == 'switch'"
                          >
                            {{ itemq.Name }}
                            <el-switch
                              v-model="itemq.value"
                              @change.stop="setReview(itemq)"
                            ></el-switch>
                          </div>
                          <div v-else>
                            <span class="hiFont" :class="itemq.Icon"></span>
                            {{ itemq.Name }}
                          </div>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item v-else>
														<el-dropdown placement="right-start" trigger="click" :hide-on-click="false" :ref="`topDro2-${item.Name}`">
															<span class="el-dropdown-link" v-if="itemq.type == 'switch'">
																{{ itemq.Name }}
																<el-switch v-model="itemq.value"></el-switch>
															</span>
															<span class="el-dropdown-link" v-else>
																<span class="hiFont" :class="itemq.Icon"></span>
																{{ itemq.Name }}
															</span> -->
                        <!-- <el-dropdown-menu slot="dropdown">
																<template v-for="items in itemq.Children"> -->
                        <!-- <el-dropdown-item v-if="!items.Children" @click.native="handleSelect(itemq.Type, e, item.Name, 'topDro')">
																		<div v-if="items.img" style="display: flex;justify-content: space-between;align-items: center;">
																			{{ items.Name }}
																			<img :src="items.img" alt="" style="width: 12px;height: 12px;" />
																		</div>
																		<div v-else-if="items.type == 'switch'">
																			{{ items.Name }}
																			<el-switch v-model="items.value"></el-switch>
																		</div>
																		<div v-else>
																			<span class="hiFont" :class="itemq.Icon"></span>
																			{{ items.Name }}
																		</div>
																	</el-dropdown-item> -->
                        <!-- <el-dropdown-item v-else  @click.native="handleSelect(itemq.Type, e,item.Name,'topDro',items.Name,'topDro2')">
																		<el-dropdown placement="right-start" trigger="click" :hide-on-click="false" :ref="`topDro3-${item.Name}`">
																			<span class="el-dropdown-link">
																				<span class="hiFont" :class="itemq.Icon"></span>
																				{{ itemq.Name }}4
																			</span>
																			<el-dropdown-menu slot="dropdown">
																				<draggable element="ul" v-model="items.Children" group="people" handle=".handle">
																					<template v-for="q in items.Children">
																						<el-dropdown-item
																							v-if="q.type === 'add'"
																							style="color:#448EF5;font-weight: 600;display: flex;align-items: center;"
																						>
																							<i :class="q.Icon" style="font-size: 20px;"></i>
																							{{ q.Name }}5
																						</el-dropdown-item>
																						<el-dropdown-item
																							v-else
																							style="display: flex;justify-content: space-between;align-items: center;"
																							 @click.native="handleSelect(q.Type, e,item.Name, 'topDro2',items.Name,'topDro3',items.Name)"
																						>
																							{{ q.Name }}5
																							<img src="../../assets/img/stop.png" v-if="!q.Icon" alt="" />
																						</el-dropdown-item>
																					</template>
																				</draggable>
																			</el-dropdown-menu>
																		</el-dropdown>
																	</el-dropdown-item> -->
                        <!-- </template> -->
                        <!-- </el-dropdown-menu> -->
                        <!-- </el-dropdown>
													</el-dropdown-item> -->
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <!-- </draggable> -->
            </div>
          </div>
          <!-- <div class="t3_bottom">
            
            <p @click="addDemandOpen(1)">创建需求分类</p>
          </div> -->
        </div>
        <!-- 按版本查看 -->
        <div class="l_title2" v-if="flag == 4">
          <div class="l_title2_title1" style="margin: 15px 0">
            <el-select v-model="edition" class="task_select"
              ><el-option label="所有版本" value="1"></el-option
            ></el-select>
          </div>
          <div
            :class="`edition ${editionActive == -1 ? 'active_edition' : ''}`"
            @click="editionActive = -1"
          >
            <span>所有版本</span>
          </div>
          <div
            :class="`edition ${editionActive == index ? 'active_edition' : ''}`"
            v-for="(item, index) in 5"
            :key="index"
            @click="editionActive = index"
          >
            <span>版本{{ index }}.1.2</span>
          </div>
        </div>
      </div>
      <!-- 右边一大块的内容 -->
      <div
        class="box_right"
        v-if="flag == 1 || flag == 2"
        style="margin-left: 10px"
      >
        <RoutineItem
          :childLoad="childLoading"
          @handleClick="handleClick"
          slot="content"
          page="task"
          @routItem="routItem"
          v-model="itemData"
          @updateEditAndQuick="orderAndSearch('childLoading', false)"
          @refresh="refreshData"
        ></RoutineItem>
      </div>
      <div class="box_right" v-if="flag == 3" v-loading="loadingRight">
        <AllDemand
          v-show="isAlldemand"
          ref="alldemand"
          :isProLeader="isProLeaderSelect"
        ></AllDemand>
        <div v-show="!isAlldemand">
          <div class="box_right_bottom" v-if="taskProce.length !== 0">
            <div class="boxinfo" v-for="item in taskProce" :key="item.Name">
              <div class="boxinfo_title">
                <p
                  :class="{
                    pcolor1: item.IsFinished === true,
                    pcolor2:
                      item.IsFinished == false && item.IsExcuting == true,
                    pcolor3:
                      item.IsFinished == false && item.IsExcuting == false,
                  }"
                >
                  {{ item.Name }}
                  <span
                    :class="{
                      box: item.IsFinished === true,
                      box2: item.IsFinished == false && item.IsExcuting == true,
                      box3:
                        item.IsFinished == false && item.IsExcuting == false,
                    }"
                  >
                    <span class="litter"></span>
                  </span>
                </p>
                <div>
                  <!-- <span class="succe" @click="sureTaskOk(item)" v-if="item.IsFinished ==false && item.TaskCount > 0">确认完成</span> -->
                  <!-- {{item.Excuters.filter(e=>{return e.UsId==$store.state.user.id}).length}} -->
                  <el-popconfirm
                    title="确认完成吗？"
                    @confirm="sureTaskOk(item, true)"
                  >
                    <span
                      slot="reference"
                      v-if="
                        item.Excuters.length > 0 &&
                          item.Excuters.filter((e) => {
                            return e.UsId == $store.state.user.id;
                          }).length > 0 &&
                          item.IsFinished == false &&
                          item.IsExcuting == true &&
                          item.SubmitFinished == false
                      "
                      class="succe"
                    >
                      确认完成
                    </span>
                  </el-popconfirm>
                  <el-popconfirm
                    title="取消完成吗？"
                    @confirm="sureTaskOk(item, false)"
                  >
                    <span
                      slot="reference"
                      v-if="
                        item.IsFinished == false &&
                          item.IsExcuting == true &&
                          item.SubmitFinished == true
                      "
                      class="succe2"
                    >
                      取消完成
                    </span>
                  </el-popconfirm>
                  <el-dropdown
                    :ref="`topDro-${item.Name}`"
                    trigger="click"
                    placement="right-start"
                    :hide-on-click="false"
                  >
                    <span class="el-dropdown-link"
                      ><i class="el-icon-more" @click="filterTask(item)"></i
                    ></span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(itemq, index) in CheckOptionTop">
                        <el-dropdown-item v-if="itemq.Children">
                          <el-dropdown
                            placement="right-start"
                            trigger="click"
                            :hide-on-click="false"
                            @visible-change="visibleChange"
                          >
                            <span
                              class="el-dropdown-link"
                              style="
                                display: flex;
                                align-items: center;
                                height: 43px;
                              "
                              @click="
                                handleCheckOptionTop(
                                  item.Name,
                                  'topDro',
                                  itemq.type,
                                  item.Step
                                )
                              "
                            >
                              <span class="hiFont" :class="itemq.Icon"></span>
                              {{ itemq.Name }}
                            </span>

                            <el-dropdown-menu slot="dropdown">
                              <template v-for="items in itemq.Children">
                                <el-dropdown-item
                                  v-if="!items.Children"
                                  @click.native="
                                    handleCheckOptionTop(
                                      item.Name,
                                      'topDro',
                                      'q',
                                      item.Step
                                    )
                                  "
                                  :key="items.Name"
                                >
                                  <div
                                    v-if="items.Icon"
                                    style="font-size: 16px; font-weight: 600"
                                  >
                                    <span>
                                      <i :class="items.Icon"></i>
                                      {{ items.Name }}
                                    </span>
                                  </div>
                                  <div v-else>
                                    <div>
                                      <i :class="items.Icon"></i>
                                      {{ items.Name }}
                                      <div
                                        v-for="(s, indexs) in items.switch"
                                        :key="indexs"
                                        style="
                                          margin-bottom: 5px;
                                          display: flex;
                                          align-items: center;
                                          justify-content: space-between;
                                        "
                                      >
                                        <div v-if="s.Name !== item.Name">
                                          {{ s.Name }}
                                          <el-switch
                                            v-model="s.value"
                                            @change="
                                              switchChange(
                                                item,
                                                item.Name,
                                                'topDro'
                                              )
                                            "
                                          ></el-switch>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </el-dropdown-item>
                                <el-dropdown-item v-else>
                                  <el-dropdown
                                    placement="right-start"
                                    trigger="click"
                                  >
                                    <span class="el-dropdown-link">
                                      <i :class="itemq.Icon"></i>
                                      {{ itemq.Name }}
                                    </span>
                                  </el-dropdown>
                                </el-dropdown-item>
                              </template>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-else-if="
                            (!item.IsFinished &&
                              item.IsExcuting &&
                              itemq.Name == '创建任务') ||
                              (item.IsFinished && itemq.Name == '创建任务') ||
                              (isProLeader && itemq.Name == '添加到审核节点') ||
                              (itemq.Name != '创建任务' &&
                                itemq.Name != '添加到审核节点')
                          "
                        >
                          <el-dropdown
                            placement="right-start"
                            trigger="click"
                            :hide-on-click="false"
                            @click.native="
                              handleCheckOptionTop(
                                item.Name,
                                'topDro',
                                itemq.type,
                                item.Step
                              )
                            "
                          >
                            <span
                              class="el-dropdown-link"
                              style="
                                display: flex;
                                align-items: center;
                                height: 43px;
                              "
                              v-if="itemq.type == 'switch'"
                            >
                              <span class="hiFont" :class="itemq.Icon"></span>
                              {{ itemq.Name }}
                              <el-switch
                                v-model="item.NeedReview"
                                @change="rightSwitch(item, item.Step)"
                              ></el-switch>
                            </span>
                            <span
                              class="el-dropdown-link"
                              style="
                                display: flex;
                                align-items: center;
                                height: 43px;
                              "
                              v-else
                            >
                              <span class="hiFont" :class="itemq.Icon"></span>
                              {{ itemq.Name }}
                            </span>
                            <el-dropdown-menu></el-dropdown-menu>
                          </el-dropdown>
                        </el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
              <div class="boxinfo_bottom">
                <!-- <draggable element="ul" v-model="item.Children" group="people"> -->
                <div class="card">
                  <div class="card_title1">
                    <span class="cardtype">
                      <tooltip
                        :content="activeLiName"
                        :ref="`demand-name-${item.Name}`"
                        maxWidth="96px"
                      ></tooltip
                    ></span>
                    <span
                      class="cardtype1"
                      v-if="item.IsFinished === true && !item.IsExcuting"
                      >已完成</span
                    >
                    <span
                      class="cardtype2"
                      v-else-if="
                        item.IsFinished == false &&
                          item.IsExcuting == true &&
                          item.TaskCount > 0
                      "
                      >进行中</span
                    >
                    <span
                      class="cardtype3"
                      v-else-if="
                        (item.IsFinished == false &&
                          item.IsExcuting == false) ||
                          (item.TaskCount == 0 && item.IsFinished == false)
                      "
                      >未开始</span
                    >
                    <span
                      class="cardtype1"
                      v-if="item.IsFinished === true && item.IsExcuting"
                      >待审核</span
                    >
                  </div>

                  <div class="card_title3">
                    <div class="card_title3_left">
                      时间:{{
                        item.CreateTime
                          ? item.CreateTime.timeFormat("yyyy-MM-dd")
                          : "暂无数据"
                      }}
                    </div>
                    <div class="card_title3_right">
                      实际耗时：{{ item.CostTime }}小时
                    </div>
                  </div>
                  <div class="card_title4">
                    <span>任务进度：</span>
                    <div class="card_title4_pro">
                      <el-progress
                        :text-inside="true"
                        :stroke-width="14"
                        :percentage="item.percen"
                      ></el-progress>
                    </div>
                  </div>
                  <div class="card_carry">
                    <div class="title">执行者:</div>
                    <div
                      :class="{ carry_box: true, hideheight: item.headFlag }"
                    >
                      <div
                        class="info"
                        @click="openPeople(item)"
                        v-if="
                          item.Excuters == null || item.Excuters.length == 0
                        "
                      >
                        <div
                          class="box_img"
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <i class="el-icon-plus" style="color: #fff"></i>
                        </div>
                      </div>
                      <div
                        class="info"
                        @click="openPeople(item)"
                        v-for="child in item.Excuters"
                        :key="child.UsId"
                      >
                        <div class="box_user_img">
                          <el-tooltip
                            effect="dark"
                            :content="child.UName"
                            placement="top"
                          >
                            <el-avatar
                              :size="26"
                              :src="`${$url}${child.Picture}`"
                              @error="errorHandler"
                            >
                              <img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                              />
                            </el-avatar>
                          </el-tooltip>
                        </div>
                      </div>
                      <i
                        class="el-icon-caret-top heidetop"
                        @click="openHeadFlag(item)"
                        v-if="item.headFlag && item.Excuters.length > 5"
                      ></i>
                      <i
                        class="el-icon-caret-bottom heidetop"
                        @click="openHeadFlag(item)"
                        v-if="!item.headFlag && item.Excuters.length > 5"
                      ></i>
                    </div>
                  </div>
                  <div class="childtask" v-if="!item.Flag">
                    <div class="left">
                      <div class="title">任务</div>
                      <span
                        :class="{
                          title1:
                            item.IsFinished === true && item.TaskCount > 0,
                          title2:
                            item.IsFinished == false && item.IsExcuting == true,
                          title3:
                            item.IsFinished == false &&
                            item.IsExcuting == false,
                        }"
                      >
                        {{ item.TaskFinished }}/{{ item.TaskCount }}
                      </span>
                    </div>
                    <div class="right" @click="cardOpen(item, taskProce)">
                      <i
                        class="el-icon-caret-top"
                        style="font-size: 14px; cursor: pointer"
                      ></i>
                    </div>
                  </div>
                  <div class="childtask" v-if="item.Flag">
                    <div class="left">
                      <div class="title">任务</div>
                      <span
                        :class="{
                          title1:
                            item.IsFinished === true && item.TaskCount > 0,
                          title2:
                            item.IsFinished == false && item.IsExcuting == true,
                          title3:
                            item.IsFinished == false &&
                            item.IsExcuting == false,
                        }"
                      >
                        {{ item.TaskFinished }}/{{ item.TaskCount }}
                      </span>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="任务、任务阶段通知"
                        placement="top"
                      >
                        <div
                          class="tixingbtn"
                          v-if="
                            item.IsExcuting &&
                              !item.IsFinished &&
                              item.TaskCount > 0
                          "
                          @click="
                            noticeWindowOpen(
                              item.noticJob,
                              item.OpenCountMenu,
                              item.Step,
                              taskProce
                            )
                          "
                        >
                          <span class="hiFont hi-tixing"></span>通知
                        </div>
                      </el-tooltip>
                    </div>
                    <div class="right" @click="cardOpen(item, taskProce)">
                      <i
                        class="el-icon-caret-bottom"
                        style="font-size: 14px; cursor: pointer"
                      ></i>
                    </div>
                  </div>
                  <div class="newcheck" v-if="item.Flag">
                    <div class="leftcheck">
                      <div
                        :class="{ left_menu: true, active: menu.flag == true }"
                        v-for="(menu, indexq) in item.OpenCountMenu"
                        :key="indexq"
                        @click="jobChange(item, menu, indexq)"
                      >
                        阶段{{ menu.menulist }}
                      </div>
                    </div>
                    <div class="rightcheck">
                      <div
                        class="checktask"
                        v-if="item.Job.length == 0"
                        style="color: #a0a0a0"
                      >
                        暂无任务
                      </div>
                      <div
                        class="checktask"
                        v-for="c in item.Job"
                        :key="c.JId"
                        v-else
                        @click="jobinfo(c.JId)"
                      >
                        <div class="el-checkbox">
                          <!-- v-if="item.IsExcuting" -->
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="该任务已通知"
                            placement="top"
                          >
                            <span
                              class="el-icon-message-solid"
                              style="color:#67C23A"
                              v-if="c.Noticed"
                            ></span>
                          </el-tooltip>

                          <!-- {{item.noticJob.findIndex(e=>e.JId === c.JId)}} -->
                          <!-- {{item.noticJob.filter(e=>{return e.JId==c.JId})[0].JId}} -->
                          <tooltip
                            :content="c.Name"
                            :ref="`demand-${c.Id}`"
                            width="125px"
                            @handleClick="jobinfo(c.JId)"
                          ></tooltip>
                          <i
                            class="el-icon-success"
                            style="color: #37b24d"
                            v-if="c.Schedule == 7"
                          ></i>
                        </div>
                        <div>
                          <!-- {{c.Excuter.Name}} -->
                          <el-avatar
                            :size="20"
                            :src="$url + c.Excuter.Picture"
                            @error="errorHandler"
                          >
                            <img
                              src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                            />
                          </el-avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="messagelist" @click="NoticFlag(item)">
                    <div class="msg_title">消息列表</div>
                    <i
                      :class="[
                        item.NoticFlag
                          ? 'el-icon-caret-bottom'
                          : 'el-icon-caret-top',
                      ]"
                      class="mi"
                    ></i>
                  </div>
                  <div class="noticlist" v-if="item.NoticFlag">
                    <div
                      class="n_list"
                      v-for="(n, index) in item.NoticData"
                      :key="index"
                      @click="handleMsgInfo(n)"
                    >
                      <div class="num_info">
                        <div class="num_row">
                          <div class="num">
                            <el-avatar
                              size="small"
                              :src="$url + n.AuthorPicture"
                              @error="errorHandler"
                            >
                              <img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                            /></el-avatar>
                            <span>{{ n.Author }}</span>
                          </div>
                          <span class="text">通知</span>
                          <div class="num">
                            <el-avatar
                              size="small"
                              :src="$url + n.GoalManPicture"
                              @error="errorHandler"
                              ><img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                            /></el-avatar>
                            <span>{{ n.GoalMan }}</span>
                          </div>
                        </div>
                        <span class="time">{{
                          n.Time.timeFormat("yyyy-MM-dd")
                        }}</span>
                      </div>
                      <p class="msg" v-html="n.Message"></p>
                    </div>
                    <div class="page_msg" v-if="item.PageCount >= 2">
                      <div
                        @click="handleMsgPage(1, item)"
                        :class="
                          item.pageMsgIndex > 1 ? 'div_pointer' : 'div_nodrop'
                        "
                      >
                        <i class="el-icon-d-arrow-left"></i>
                        <span>上一页</span>
                      </div>
                      <div
                        @click="handleMsgPage(2, item)"
                        :class="
                          item.PageCount > item.pageMsgIndex
                            ? 'div_pointer'
                            : 'div_nodrop'
                        "
                      >
                        <span>下一页</span>
                        <i class="el-icon-d-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="bottomcolor"></div> -->
                  <!-- <div class="trends">
										<div class="title">动态</div>
										<div class="title2">最近记录时间10:00</div>
									</div>
									<div class="option" v-if="e.Flag == true">
										<div class="title">陈天心偷偷的完成了任务"原型交互"陈天心偷偷的完成了任务"原型交互"陈天心偷偷的完成了任务"原型交互"</div>
										<div class="title2">操作日期</div>
									</div>
									<div class="option" v-if="e.Flag == true">
										<div class="title">闫三花添加了任务"原型交互"</div>
										<div class="title2">操作日期</div>
									</div>
									<div class="option" v-if="e.Flag == true">
										<div class="title">负责人审核了流程</div>
										<div class="title2">操作日期</div>
									</div> -->
                </div>
                <!-- </draggable> -->
              </div>
            </div>
          </div>
          <div
            class="box_right_bottom"
            style="
              width: 98%;
              height: calc(100vh - 90px);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              background: #fff;
            "
            v-else
          >
            <img
              src="@/assets/img/emptyTask.png"
              alt=""
              style="max-width: 100%; max-height: 82%; display: block"
            />
            <h3
              style="
                width: 100%;
                text-align: center;
                color: #aaa;
                font-size: 1.8rem;
                height: 4rem;
                line-height: 4rem;
              "
            >
              暂无数据
            </h3>
          </div>
        </div>
      </div>

      <!-- 创建需求 -->
      <!-- <tasktypeadd></tasktypeadd> -->

      <!-- 增加需求循环设置 -->
      <!-- <XModel name="taskLoopNew2" confirmBtnText="完成" title="任务循环设置" @onConfirm="taskLoopOk" width="320px">
			<div style="display: flex;flex-direction: column;padding: 15px;">
				
				<div style="display: flex;">
					<div style="font-size: 16px;color: #333;min-width: 65px;height: 40px;line-height: 40px;text-align: right;margin-right: 5px;"> 循环周期</div>
					<div>
           
						<el-select v-model="looptype" placeholder="请选择" style="margin-bottom: 10px;" @change="typeone(looptype)">
							<el-option v-for="item in options1" :key="item" :label="item" :value="item"></el-option>
						</el-select>
						<el-select v-model="loopweek" v-if="loopWeek" placeholder="请选择周" style="margin-bottom: 10px;" >
							<el-option v-for="item in optionweek" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-select v-model="loopweek2" v-if="loopWeek2" placeholder="请选择几周" style="margin-bottom: 10px;" >
							<el-option v-for="item in optionweek2" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-select v-model="loopmonth" v-if="loopMonth" placeholder="请选择月" style="margin-bottom: 10px;" >
							<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
						<el-select v-model="loopday" v-if="loopDay" placeholder="请选择日" style="margin-bottom: 10px;">
							<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</div>
				</div>
				<div style="display: flex;">
					<div  style="font-size: 16px;color: #333;min-width: 65px;text-align: right;margin-right: 5px;height: 40px;line-height: 40px; text-align-last:justify">条件</div>
					<div>
						<el-select v-model="value4" placeholder="请选择" style="margin-bottom: 10px;">
							<el-option v-for="item in options4" :key="item" :label="item" :value="item"></el-option>
						</el-select>
					</div>
				</div>
				
				<span style="margin-top: 20px;color: #aaa;font-size: 12px;">每月1号零点会自动创建新的循环任务</span>
			</div>
		</XModel> -->
      <!-- 创建需求、编辑需求 -->
      <XModel
        name="taskListOpen"
        :title="DamoTitle"
        cancelBtnText="取消"
        confirmBtnText="确定"
        @onConfirm="addxqOK"
        @onCancel="taskListDel"
        width="1000px"
        height="800"
        ref="damo"
      >
        <!-- <div class="deepDark" @click="deepDarkOpen">循环需求</div> -->
        <div class="qwqBig2">
          <div class="left">
            <div class="dlog" v-if="DamoFlag == 2">
              <div class="dlogtitle">需求分类</div>
              <el-select
                v-model="dataTreeId"
                placeholder="请选择"
                style="margin-bottom: 10px; width: 100%"
              >
                <el-option
                  v-for="treeitem in dataTree"
                  :key="treeitem.Id"
                  :label="treeitem.Name"
                  :value="treeitem.Id"
                ></el-option>
              </el-select>
            </div>
            <div class="dlog">
              <div class="dlogtitle">需求名称</div>
              <el-input
                v-model="DemandFormSmall.Name"
                placeholder="请输入名称"
              ></el-input>
            </div>
            <div class="dlog">
              <div class="dlogtitle">所属版本</div>
              <el-input
                v-model="DemandFormSmall.Describe2"
                placeholder="请输入描述"
              ></el-input>
            </div>
            <p></p>
            <div class="dlog">
              <div class="dlogtitle">循环设置</div>
              <el-input placeholder="" style="opacity: 0"></el-input>
            </div>
            <div class="dlog">
              <div class="dlogtitle">循环条件</div>
              <el-select
                v-model="looptype"
                placeholder="请选择"
                style="margin-bottom: 10px; width: 100%"
                @change="typeone(looptype)"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="dlog" v-if="loopWeek2">
              <div class="dlogtitle">请选择几周</div>
              <el-select
                v-model="loopweek2"
                placeholder="请选择几周"
                style="margin-bottom: 10px; width: 100%"
              >
                <el-option
                  v-for="item in optionweek2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="dlog" v-if="loopWeek">
              <div class="dlogtitle">请选择周</div>
              <el-select
                v-model="loopweek"
                placeholder="请选择周"
                style="margin-bottom: 10px; width: 100%"
              >
                <el-option
                  v-for="item in optionweek"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="dlog" v-if="loopMonth">
              <div class="dlogtitle">请选择月</div>
              <el-select
                v-model="loopmonth"
                placeholder="请选择月"
                style="margin-bottom: 10px; width: 100%"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="dlog" v-if="loopDay">
              <div class="dlogtitle">请选择日</div>
              <el-select
                v-model="loopday"
                placeholder="请选择日"
                style="margin-bottom: 10px; width: 100%"
              >
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="dlog">
              <div class="dlogtitle">请选择</div>
              <el-select
                v-model="value4"
                placeholder="请选择"
                style="margin-bottom: 10px; width: 100%"
              >
                <el-option
                  v-for="item in options4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="dlog" v-if="DamoFlag == 1">
              <div class="dlogtitle">选择流程</div>
              <div class="p-right-public-content" style="width: 100%">
                <div
                  class="process-item"
                  v-for="item in processList"
                  :key="item.id"
                >
                  <div class="item-header clear_fix">
                    <h2>{{ item.name }}</h2>
                    <el-button v-if="item.isUse" type="text" disabled
                      >正在使用</el-button
                    >
                    <el-button
                      v-else
                      @click="userProcess(item)"
                      type="text"
                      :loading="item.loading"
                      >使用流程</el-button
                    >
                  </div>
                  <div class="step-box">
                    <span
                      v-for="(s, index) in item.stages"
                      :key="index"
                      class="step"
                    >
                      <span>{{ s.stageName }}</span>
                      <i
                        v-if="index != item.stages.length - 1"
                        class="el-icon-right"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </XModel>

      <XModel
        title="提示"
        name="taskListDel"
        cancelBtnText="取消"
        confirmBtnText="确定"
        @onConfirm="addxqDel"
        width="450px"
        ref="damodel"
      >
        <div class="delbox">
          <i class="el-icon-question" style="color: rgb(240, 62, 62)"></i>
          <p>是否删除需求</p>
        </div>
      </XModel>

      <!-- 创建需求分类 -->
      <XModel
        name="taskListAdd"
        :title="demandTitle"
        cancelBtnText="取消"
        confirmBtnText="确定"
        @onConfirm="addDemandOK"
        width="508px"
        ref="xm"
      >
        <!-- 需求分类创建和编辑 -->
        <div class="qwqBig">
          <div class="dlog">
            <div class="dlogtitle">名称</div>
            <el-input
              v-model="DemandFormBig.Name"
              placeholder="请输入名称"
            ></el-input>
          </div>
          <div class="dlog">
            <div class="dlogtitle">描述</div>
            <el-input
              v-model="DemandFormBig.Describe"
              placeholder="请输入描述"
            ></el-input>
          </div>
        </div>
      </XModel>
      <!-- 删除需求分类 -->
      <XModel
        title="提示"
        name="taskListDel2"
        width="450px"
        cancelBtnText="取消"
        confirmBtnText="确定"
        @onConfirm="taskdel"
        ref="damodel2"
      >
        <div class="delbox">
          <i class="el-icon-question" style="color: rgb(240, 62, 62)"></i>
          <p>是否删除需求分类</p>
        </div>
      </XModel>
      <!-- 新建流程 编辑流程-->
      <XModel
        name="processAdd2"
        cancelBtnText="取消"
        confirmBtnText="确定"
        :title="processTitle"
        @onConfirm="processAddOK"
      >
        <div class="qwqBig">
          <div class="dlog">
            <div class="dlogtitle">名称</div>
            <el-input
              v-model="processFrom.ProceName"
              placeholder="请输入名称"
            ></el-input>
          </div>
        </div>
      </XModel>
      <!-- 设置执行人 -->
      <XModel
        name="taskListPeple"
        cancelBtnText="取消"
        confirmBtnText="确定"
        title="设置需求执行人"
        @onConfirm="peopleOk"
        ref="pepleid"
      >
        <div class="peoplerun">
          <div class="nav">
            <li
              class="box per_list_del"
              v-for="item in peopleData"
              :key="item.UId"
              @click="deluser(item, $event)"
            >
              <div class="img">
                <img :src="`${$url}${item.Picture}`" alt="" />
              </div>
              <div class="name">
                <div class="title2">{{ item.UName }}</div>
                <div class="title3">{{ item.PositionName }}</div>
              </div>
            </li>

            <Memberselect
              @Confirm="Confirm"
              :arrays="peopleData"
              class="title22"
              :showActive="false"
              ><div class="title1" slot="button">管理</div></Memberselect
            >
          </div>
        </div>
      </XModel>
      <!-- 确认完成 -->
      <XModel
        title="是否确认完成？"
        name="sureok"
        cancelBtnText="取消"
        confirmBtnText="确定"
        @onConfirm="sureok2"
        ref="suretaskok"
      ></XModel>
      <!-- 添加审核节点 -->
      <XModel
        :title="verifyTitle"
        name="addverify"
        :cancelBtnText="verifyFlag == 1 ? '取消' : '重置'"
        :confirmBtnText="verifyFlag == 1 ? '确定' : '立即创建'"
        @onConfirm="verifyaddComfirm"
        @onCancel="verifyaddCancel"
        ref="verifyId"
        class="addverify_modal"
        @opened="openedAddverify"
        :isCancelClose="false"
      >
        <!-- {{this.verifyForm.page }} 当前添加类型{{verifyType}}  需求id {{dataTreeId2}} 需求分类id{{dataTreeId}} -->
        <div v-show="verifyFlag == 1">
          <el-card class="box-card" style="box-shadow: none">
            <div slot="header" class="clearfix">
              <span style="font-size: 14px">节点名称</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="createVerify"
                >新增审核节点</el-button
              >
            </div>
            <div v-for="item in verifyData" :key="item.Id" class="verifyli">
              <el-radio v-model="verifySelectId" :label="item.Id">{{
                item.Name
              }}</el-radio>
              <el-popconfirm title="确认删除吗？" @confirm="verifyDel(item.Id)">
                <span slot="reference" class="delete"> 删除 </span>
              </el-popconfirm>
            </div>
          </el-card>
          <el-pagination
            @current-change="verifyChangePage"
            :current-page.sync="verifyForm.page"
            :page-size="verifyForm.limit"
            layout="prev, pager, next, jumper"
            :total="verifyForm.Total"
          >
          </el-pagination>
        </div>
        <div v-show="verifyFlag == 2" v-loading="addverifyModalLoading">
          <el-card class="box-card" style="box-shadow: none">
            <div slot="header" class="clearfix">
              <span style="font-size: 14px">新增审核节点</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="backVerify"
                >返回</el-button
              >
            </div>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm verifyform"
            >
              <div class="verifyli2">
                <el-form-item label="节点名称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
              </div>
              <div class="verifyli2">
                <el-form-item label="节点描述" prop="discription">
                  <el-input v-model="ruleForm.discription"></el-input>
                </el-form-item>
              </div>
              <div class="verifyli2">
                <el-form-item label="截止日期" prop="dueDate">
                  <el-date-picker
                    v-model="ruleForm.dueDate"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="verifyli2">
                <el-form-item label="必须审核人：">
                  <div class="r_per">
                    <li
                      v-for="(mustitem, index) in mustList"
                      :key="index"
                      :class="`per_list per_list_del`"
                      @click="delMemberuser(mustitem, 1, $event)"
                    >
                      <el-avatar
                        size="small"
                        :src="$url + mustitem.Picture"
                      ></el-avatar>
                      <span class="name">
                        {{ mustitem.UName }}
                      </span>
                    </li>
                    <Memberselect
                      :showActive="false"
                      @Confirm="getMember($event, 1)"
                      :arrays="mustList"
                    >
                      <template slot="button">
                        <div class="add"><i class="el-icon-plus"></i></div>
                      </template>
                    </Memberselect>
                  </div>
                </el-form-item>
              </div>
              <div class="verifyli2">
                <el-form-item label="辅助审核人：">
                  <div class="r_per">
                    <li
                      v-for="(auxilitem, index) in auxiliaryList"
                      :key="index"
                      :class="`per_list per_list_del`"
                      @click="delMemberuser(auxilitem, 2, $event)"
                    >
                      <el-avatar
                        size="small"
                        :src="$url + auxilitem.Picture"
                      ></el-avatar>
                      <span class="name">
                        {{ auxilitem.UName }}
                      </span>
                    </li>
                    <Memberselect
                      :showActive="false"
                      @Confirm="getMember($event, 2)"
                      :arrays="auxiliaryList"
                    >
                      <template slot="button">
                        <div class="add"><i class="el-icon-plus"></i></div>
                      </template>
                    </Memberselect>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-card>
        </div>
      </XModel>
      <taskDetail :jid="jid" v-if="flag == 3"></taskDetail>
      <addTask
        customName="taskTypeAddTask"
        :eid="$route.params.eid"
        :classification="dataTreeId"
        :demand="dataTreeId2"
        :verifySetp="verifySetp"
        :isDefaultDemand="true"
      ></addTask>
      <!-- 任务通知 -->
      <XModel
        title="任务通知"
        name="taskNotice"
        cancelBtnText="取消"
        confirmBtnText="确定通知"
        @onConfirm="noticeOk"
        ref="noticeLoading"
        @opened="taskNoticeOpened"
        height="80%"
        :isFixed="true"
      >
        <el-card class="box-card" style="box-shadow: none; border: 0">
          <div slot="header" class="clearfix" style="">
            <p style="font-size: 16px; font-weight: 700">选择流程及成员：</p>
            <el-checkbox-group
              v-model="newArrayDataStepModel"
              class="groupJobStep"
            >
              <el-checkbox
                v-for="item in StepPeople"
                :label="item.Step"
                :key="item.Step"
                class="groupjoblabelStep"
              >
                {{ item.StepName }}
                <el-checkbox-group
                  @change="changeSetPeople"
                  v-model="item.UsersModel"
                  class="groupJob"
                >
                  <el-checkbox
                    v-for="list in item.Users"
                    :label="list.UsId"
                    :key="list.UsId"
                    class="groupjoblabel"
                  >
                    <div class="g_b_num">
                      <el-avatar
                        size="small"
                        :src="$url + list.Picture"
                      ></el-avatar>
                      <span class="num_name">{{ list.Name }}</span>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </el-checkbox>
            </el-checkbox-group>
            <br />
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="notictextarea"
              style="margin-top:10px"
            >
            </el-input>

            <!-- newArrayDataStep -->
          </div>

          <div>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="noticeJobAll"
              @change="handleCheckAllChange"
              >任务全选</el-checkbox
            >
          </div>
          <!-- {{noticeDataJob}} -->
          <el-checkbox-group
            v-model="noticeJobSelectData"
            class="groupJob"
            @change="handleCheckedJobChange"
          >
            <el-checkbox
              v-for="item in noticeDataJob"
              :label="item.JId"
              :key="item.JId"
              class="groupjoblabel"
            >
              <tooltip
                :content="item.Name"
                :ref="`demandLeftMenu-${item.JId}`"
                width="136px"
              ></tooltip>
            </el-checkbox>
          </el-checkbox-group>
        </el-card>
      </XModel>
    </div>
    <!-- 消息详情 -->
    <demandMsgInfo :demandMsgInfo="demandMsgInfo"></demandMsgInfo>
  </div>
</template>

<script>
import draggable from "vuedraggable";
// import tasktypeadd from './taskTypeAdd.vue'
export default {
  components: {
    draggable,
    tasktypeadd: () => import("./taskTypeAdd.vue"),
    XModel: () => import("@/components/XModal"),
    RoutineItem: () => import("@/views/task/RoutineItem"),
    AllDemand: () => import("./alldemand"),
    Memberselect: () => import("@/components/Selectors/MemberSelect.vue"),
    taskDetail: () => import("./taskDetail.vue"),
    tooltip: () => import("@/components/textTooltip"),
    addTask: () => import("@/views/task/addTask"),
    demandMsgInfo: () => import("./demandMsgInfo"),
  },

  data() {
    return {
      selVersion: null, //选择的版本
      versionsAllData: null, //版本数据
      demandMsgInfo: null, //要查看的消息
      mustList: [], //必须审核人
      auxiliaryList: [], //辅助审核人
      checkList: [],
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
      loopmonth: 1,
      loopday: 1,
      loopweek: 1,
      loopweek2: 1,

      postType: null, //判断type类型--日-月-周-不循环

      value4: "",
      loopMonth: false, //判断什么时候显示下拉菜单
      loopDay: false,
      loopWeek2: false,
      loopWeek: false,

      loopForm: null,

      // 2021-4-13临时变量
      value1: "",
      DemandThree: {},
      peopleData: [], //设置执行人数据
      jid: "",
      edition: null, //版本查看选项
      editionActive: 1, //被激活的版本
      checkList: [],
      checked: [],
      jobid: "10097",
      dataTreeLoad: false, //load加载
      isAlldemand: true, //是否为所有需求
      processList: [], //流程模板数据

      allActive: false,

      CheckOptionTop: [
        {
          Name: "添加到审核节点",
          Icon: "hi-shenhe7",
          type: 1,
        },
        {
          Name: "配置流程规则",
          Icon: "hi-liuchengshezhi",
          type: 2,
          Children: [
            {
              Name: "配置流程规则",
              Icon: "el-icon-arrow-left",
            },
            {
              Name: "流转后自动开启同步",
              switch: [
                {
                  Name: "",
                  Step: "",
                  value: false,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          type: "switch",
          Name: "负责人审核后流转",
          Icon: "hi-liucheng",
          value: false,
        },
        {
          Name: "创建任务",
          Icon: "hi-append",
          type: 3,
        },
      ],
      CheckOption: [
        {
          Name: "添加到审核节点",
          id: 1,
          Icon: "hi-shenhe7",
          Type: "verify",
        },
        // {
        //   id: 1,
        //   Type: "switch",
        //   Name: "负责人审核后流转",
        //   Icon: "hi-liucheng",
        //   value: false,
        // },
        {
          id: 2,
          Type: "2",
          Name: "编辑需求",
          Icon: "hi-Notebook",
        },
        // {
        // 	id: 3,
        // 	Type: '',
        // 	Name: '编辑流程阶段',
        // 	Icon: 'hi-jiaoseguanli',
        // 	Children: [
        // 		{
        // 			id: 44,
        // 			Icon: 'el-icon-arrow-left',
        // 			Name: '编辑流程阶段',
        // 			type: ''
        // 		},
        // 		{
        // 			id: 45,
        // 			Name: '新建流程阶段',
        // 			type: 'add',
        // 			Icon: 'el-icon-circle-plus-outline',
        // 			img: require('@/assets/img/stop.png')
        // 		},
        // 		{
        // 			id: 46,
        // 			Name: '需求阶段',
        // 			type: '',
        // 			img: require('@/assets/img/stop.png')
        // 		},
        // 		{
        // 			id: 47,
        // 			Name: '原型阶段',
        // 			type: '',
        // 			img: require('@/assets/img/stop.png')
        // 		},
        // 		{
        // 			id: 48,
        // 			Name: '设计阶段',
        // 			type: '',
        // 			img: require('@/assets/img/stop.png')
        // 		},
        // 		{
        // 			id: 49,
        // 			Name: '开发阶段',
        // 			type: '',
        // 			img: require('@/assets/img/stop.png')
        // 		},
        // 		{
        // 			id: 50,
        // 			Name: '测试阶段',
        // 			type: '',
        // 			img: require('@/assets/img/stop.png')
        // 		}
        // 	]
        // },
        // {
        // 	id: 4,
        // 	Type: '',
        // 	Name: '配置规则流程',
        // 	Icon: 'hi-liucheng',
        // 	Children: [
        // 		{
        // 			id: 41,
        // 			Icon: 'hi-liucheng',
        // 			Name: '配置流程规则'
        // 		},
        // 		{
        // 			id: 42,
        // 			Name: '负责人审核后流转',
        // 			Icon: 'hi-liucheng',
        // 			type: 'switch',
        // 			value: false
        // 		}
        // 		// {
        // 		// 	id: 43,
        // 		// 	Name: '编辑流程阶段',
        // 		// 	Children: [
        // 		// 		{
        // 		// 			id: 44,
        // 		// 			Icon: 'el-icon-arrow-left',
        // 		// 			Name: '编辑流程阶段',
        // 		// 			type: ''
        // 		// 		},
        // 		// 		{
        // 		// 			id: 45,
        // 		// 			Name: '新建流程阶段',
        // 		// 			type: 'add',
        // 		// 			Icon: 'el-icon-circle-plus-outline',
        // 		// 			img: require('@/assets/img/stop.png')
        // 		// 		},
        // 		// 		{
        // 		// 			id: 46,
        // 		// 			Name: '需求阶段',
        // 		// 			type: '',
        // 		// 			img: require('@/assets/img/stop.png')
        // 		// 		},
        // 		// 		{
        // 		// 			id: 47,
        // 		// 			Name: '原型阶段',
        // 		// 			type: '',
        // 		// 			img: require('@/assets/img/stop.png')
        // 		// 		},
        // 		// 		{
        // 		// 			id: 48,
        // 		// 			Name: '设计阶段',
        // 		// 			type: '',
        // 		// 			img: require('@/assets/img/stop.png')
        // 		// 		},
        // 		// 		{
        // 		// 			id: 49,
        // 		// 			Name: '开发阶段',
        // 		// 			type: '',
        // 		// 			img: require('@/assets/img/stop.png')
        // 		// 		},
        // 		// 		{
        // 		// 			id: 50,
        // 		// 			Name: '测试阶段',
        // 		// 			type: '',
        // 		// 			img: require('@/assets/img/stop.png')
        // 		// 		}
        // 		// 	]
        // 		// }
        // 	]
        // },
        {
          id: 5,
          Type: "3",
          Name: "删除需求",
          Icon: "hi-delete",
        },
      ],
      taskType: [
        { id: 1, label: "按状态查看", title: "状态", type: 1 },
        { id: 2, label: "按成员查看", title: "成员", type: 2 },
        { id: 3, label: "按需求查看", title: "需求", type: 3 },
        { id: 3, label: "按分类查看", title: "需求", type: 3 },
      ],
      taskTypeModel: "按状态查看",
      taskTypeModelTitle: "状态",
      flag: 3, //任务类型
      //按成员查看
      taskUserInfo: [
        { id: 1, userName: "闫三花", voCation: "UI设计" },
        { id: 2, userName: "刘超", voCation: "后端" },
        { id: 3, userName: "赵兴港", voCation: "前端" },
      ],
      taskCode: "所有任务",
      taskStatu: [
        {
          label: "进行中",
          icon: "hiFont hi-in-progress-cr",
          st: "color:rgb(105, 192, 255);font-size: 24px;",
        },
        {
          label: "需完善",
          icon: "hiFont hi-extend-cr",
          st: "color:rgb(105, 192, 255);font-size: 24px;",
        },
        {
          label: "被驳回",
          icon: "hiFont hi-revise-cr",
          st: "color:rgb(105, 192, 255);font-size: 24px;",
        },
        {
          label: "未开始",
          icon: "hiFont hi-stop-cr",
          st: "color: rgb(254, 78, 79);font-size: 24px;",
        },
        {
          label: "暂停的",
          icon: "hiFont hi-pause-cr",
          st: "color: rgb(254, 78, 79);font-size: 24px;",
        },
        {
          label: "待定中",
          icon: "hiFont hi-in-progress-cr",
          st: "color: rgb(254, 169, 64);font-size: 24px;",
        },
        {
          label: "待评审",
          icon: "hiFont hi-under-review",
          st: "color: rgb(254, 169, 64);font-size: 24px;",
        },
        {
          label: "已完成",
          icon: "hiFont hi-finished-cr",
          st: "color: #37B24D;font-size: 24px;",
        },
      ],
      activeTask: 1,

      // 任务里的卡片
      childLoading: false,
      itemData: [], //所有展示的数据
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
          value: "2", //状态，成员，分类ID
        },
        params: {},
        quickView: "-1", //快捷查看
      },
      activeNow: 1,
      clickID: {},
      numbers: {
        0: [0, 0, 0, 0, 0, 0, 0, 0], //状态数
        1: null,
        2: null,
      },

      //按任务需求
      activeLi: "", //二级菜单控制li的高亮
      dataTree: [], //左侧菜单数据
      dataTreeId: null, //需求分类ID
      dataTreeId2: null, //需求ID

      searchGenera: [], //搜索后的人员
      isSearch: false, //是否在搜索
      filterText: "", //搜索人员

      //按任务需求卡片数据
      //任务流程 1个流程一个对象
      taskProce: [], //右侧底部卡片数据
      taskProceData: {}, //获取单独的卡片数据
      checkList: [], //流程里面复选
      loadingRight: false,

      demandFlag: "", //创建弹窗类型 修改or新增  创建小的需求分类or修改小的 1/2/3/4
      demandTitle: "", //弹窗标题
      DemandFormBig: {
        Name: "",
        Describe: "",
        Describe2: "",
      }, //创建大的or修改大的
      DemandFormSmall: {
        Name: "",
        Describe: "",
        Describe2: "",
      }, //创建小的or修改小的
      dataTree2: {}, //存放临时数据
      DamoTitle: "", //创建、修改需求的标题
      DamoFlag: null, //1创建 2修改
      MBData: {}, //选中的的模板的数据
      deepDarkFlag: 1, //1正常创建，2 需求循环设置

      // 新建流程
      processTitle: "",
      processFlag: "", //判断是新建还是编辑流程
      processData: null, //存放当前点击的流程数据
      processFrom: {
        ProceName: "",
      },

      //设置可同时执行的需求流程阶段
      switchData: [],

      sureTaskOkData: null, //存储是否完成任务的数据
      isProLeader: null, //是否是领导
      isProLeaderSelect: false,
      /*
       *审核节点
       */
      verifyTitle: "添加审核节点",
      verifyLoading: false, //创建审核节点的loading
      verifyForm: {
        page: 1,
        limit: 5,
        Total: "",
      },
      verifyData: [], //所有审核节点数据
      verifyType: 1, //1 需求分类节点 2添加需求节点 3需求流程 4routeritem组件的添加节点 (number)
      verifySelectId: "", //审核节点
      verifyFlag: 1, //1添加审核节点页面---2创建审核节点页面(number)
      verifySetp: null,
      routItemId: null, //任务id
      ruleForm: {
        name: "",
        discription: "",
        dueDate: "",
        eId: null,
      },
      rules: {
        name: [{ required: true, message: "请输入节点名称", trigger: "blur" }],
        dueDate: [
          { required: true, message: "请选择审核截止日期", trigger: "blur" },
        ],
      },

      noticeSelectDown: "", //切换阶段的下拉菜单
      noticeDataJob: null, //等待通知-- 任务

      noticeJobSelectData: [], //选中的任务
      allNotice: [], //已经全选的数据

      noticeJobAll: false, //全选
      isIndeterminate: true,
      AllSelect: [], //全选的数据ID
      noticeStep: [], //点击通知,存储第几个流程

      notictextarea: "请尽快开始下一阶段任务！",

      newArrayDataStep: [], //通知的流程数组
      newArrayDataStepModel: [],
      StepPeople: [], //所有流程执行人数据
      StepPeopleModel: [], //所有流程执行人数据
      PeopleSet: [], //选取的user和流程 死麻烦

      /*
       *获取未通知任务
       */
      addverifyModalLoading: false, //创建审核
      addverifyLeader: [], //项目默认审核人
      proRulesIsChange: false, //配置流程规则是否改变
      taskNoticeLoading: false, //任务通知弹窗加载
      activeLiName: null, //选择的标题
    };
  },
  methods: {
    errorHandler() {
      return true;
    },
    /**
     * 任务通知弹窗
     */
    taskNoticeOpened() {
      this.PeopleSet = [];
      this.newArrayDataStepModel = [];
      this.taskNoticeLoading = true;
      const data = {
        dId: this.dataTreeId2,
        steps: this.newArrayDataStep.map((m) => m.Step),
      };
      this.$http
        .post("/Work/Project/Demand/GetStepExcuters.ashx", data)
        .then((res) => {
          if (res.res === 0) {
            this.StepPeople = res.data;
            this.StepPeople.forEach((item) => {
              this.$set(item, "UsersModel", []);
            });
            console.log(this.StepPeople, "流程阶段下的人");
          }
        });
    },
    /**
    获取所有版本 */
    getVersionsAllData() {
      this.$http
        .post("/Work/Project/Demand/GetVersions.ashx", {
          eId: this.$route.params.eid,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.versionsAllData = resp.data;
          }
        });
    },
    /**
     * 消息详情
     */
    handleMsgInfo(msg) {
      this.demandMsgInfo = msg;
      this.$modal.show("demandMsgInfo");
    },
    /**
     * 消息分页
     */
    handleMsgPage(type, item) {
      if (type == 1 && item.pageMsgIndex > 1) {
        item.pageMsgIndex--;
        this.getStepExcuters(item);
      } else if (type == 2 && item.PageCount > item.pageMsgIndex) {
        item.pageMsgIndex++;
        this.getStepExcuters(item);
      }
    },
    visibleChange(e) {
      if (this.proRulesIsChange && !e) {
        this.getDataThree();
        this.getDamoList();
      }
      this.proRulesIsChange = false;
    },
    /**
     * 打开创建审核节点弹窗回调
     */
    openedAddverify() {
      this.addverifyModalLoading = true;
      this.$http
        .post("/Work/Project/ReviewNode/GetDealers.ashx", {
          eId: JSON.parse(this.$route.params.eid),
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.addverifyLeader = resp.data.Dealers;
            this.initAddverifyData();
          }
        })
        .finally(() => (this.addverifyModalLoading = false));
    },
    /**
     * 初始化创建审核节点审核人
     */
    initAddverifyData() {
      if (this.addverifyLeader && this.addverifyLeader.length) {
        this.mustList = [];
        this.auxiliaryList = [];
        this.addverifyLeader.forEach((m) => {
          if (m.IsRequired) {
            this.mustList.push({
              UId: m.Id,
              UName: m.Name,
              Picture: m.Picture,
            });
          } else {
            this.auxiliaryList.push({
              UId: m.Id,
              UName: m.Name,
              Picture: m.Picture,
            });
          }
        });
      }
    },
    /**
     * 删除审核人
     */
    delMemberuser(val, type, e) {
      if (e.target.localName == "li")
        if (type == 1) {
          this.mustList = this.mustList.filter((m) => m.UId != val.UId);
        } else {
          this.auxiliaryList = this.auxiliaryList.filter(
            (m) => m.UId != val.UId
          );
        }
    },
    /**
     * 获取成员选择器人员
     * 必须审核人:1
     * 辅助审核人:2
     */
    getMember(val, type) {
      if (type == 1) {
        this.mustList = val;
      } else if (type == 2) {
        this.auxiliaryList = val;
      }
    },
    /**
     * 删除执行人
     */
    deluser(val, e) {
      if (e.target.localName == "li") {
        this.peopleData = this.peopleData.filter((m) => m.UId != val.UId);
      }
    },
    //消息通知
    NoticFlag(item) {
      item.NoticFlag = !item.NoticFlag;
      this.getStepExcuters(item);
    },
    // 获取阶段任务通知列表
    async getStepExcuters(item) {
      const data = {
        dId: this.dataTreeId2,
        step: item.Step,
        page: item.pageMsgIndex,
        limit: 10,
        userView: this.isProLeaderSelect,
      };
      let res = await this.$http.post(
        "/Work/Project/Demand/GetJobNotice.ashx",
        data
      );
      if (res.res === 0) {
        item.NoticData = res.data.Datas;
        this.$set(item, "PageCount", res.data.PageCount);
        this.$set(item, "Total", res.data.Total);
        console.log(res);
      }
    },
    changeSetPeople() {
      this.PeopleSet = [];
      console.log(this.StepPeople);
      this.StepPeople.forEach((item) => {
        if (item.UsersModel && item.UsersModel.length) {
          if (this.newArrayDataStepModel.indexOf(item.Step) == -1) {
            this.newArrayDataStepModel.push(item.Step);
          }
          this.PeopleSet.push({ Step: item.Step, Users: item.UsersModel });
        } else {
          this.newArrayDataStepModel = this.newArrayDataStepModel.filter(
            (s) => s != item.Step
          );
        }
      });
      console.log(this.PeopleSet, "完成");
    },
    /*
     * 获取未通知任务
     */
    async getNotice(e) {
      try {
        // this.$set(e, "noticJob", []);
        const data = {
          dId: this.dataTreeId2,
          step: this.noticeStep,
          userView: this.isProLeaderSelect,
        };
        const res = await this.$http.post(
          "/Work/Project/Demand/GetUnNoticeJob.ashx",
          data
        );
        if (res.res == 0) {
          e.noticJob = res.data;
          this.noticeDataJob = res.data;
          console.log(res.data, this.noticeDataJob, "任务");
          // console.log(e,res.data)
        }
      } catch (err) {
        console.log(err);
      }
    },

    // taskLoop2() {
    // 	this.options2=[]
    // 	this.options3=[]
    // 	for(var i = 1;i<13;i++){
    // 		this.options2.push({
    // 			value:i,
    // 			label:i+'月'
    // 		})
    // 	}
    // 	for(var i = 1;i<32;i++){
    // 		this.options3.push({
    // 			value:i,
    // 			label:i+'日'
    // 		})
    // 	}
    // 	this.getLoopData()
    // },
    typeone(val) {
      this.postType = val;
      console.log(this.postType);
      //判断
      if (val == 1) {
        this.loopMonth = false;
        this.loopDay = true;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopmonth = 1;
        this.loopday = 1;
        this.loopweek = 1;
        this.loopweek2 = 1;
      } else if (val == 2) {
        this.loopMonth = true;
        this.loopDay = true;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopmonth = 1;
        this.loopday = 1;
        this.loopweek = 1;
        this.loopweek2 = 1;
      } else if (val == 3) {
        this.loopMonth = false;
        this.loopDay = false;
        this.loopWeek = true;
        this.loopWeek2 = true;
        this.loopmonth = 1;
        this.loopday = 1;
        this.loopweek = 1;
        this.loopweek2 = 1;
      } else if (val == 4) {
        this.loopMonth = false;
        this.loopDay = false;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopmonth = 1;
        this.loopday = 1;
        this.loopweek = 1;
        this.loopweek2 = 1;
      }
      // console.log(this.loopFlag1,this.loopFlag2)
    },

    //任务循环设置点了完成按钮
    taskLoopOk() {
      this.postType = this.looptype;
      if (this.postType == 1) {
        const data = {
          Condition: this.value4,
          LoopType: this.postType,
          LoopTime1: this.loopday,
          LoopTime2: 0,
        };
        this.loopForm = data;
      } else if (this.postType == 2) {
        const data = {
          Condition: this.value4,
          LoopType: this.postType,
          LoopTime1: this.loopmonth,
          LoopTime2: this.loopday,
        };
        this.loopForm = data;
      } else if (this.postType == 3) {
        const data = {
          Condition: this.value4,
          LoopType: this.postType,
          LoopTime1: this.loopweek2,
          LoopTime2: this.loopweek,
        };
        this.loopForm = data;
      } else if (this.postType == 4) {
        const data = {
          Condition: this.value4,
          LoopType: this.postType,
          LoopTime1: 0,
          LoopTime2: 0,
        };
        this.loopForm = data;
      } else {
        this.loopForm = null;
      }
    },
    /*
     * 任务通知
     */
    noticeWindowOpen(menu, Step) {
      this.noticeStep = Step;
      this.noticeDataMenu = menu;
      this.allNotice = [];
      this.noticeDataJob.forEach((e) => {
        this.allNotice.push(e.JId);
      });

      // this.newArrayDataStepModel = this.newArrayDataStep[0].Step
      // const data = {
      //   dId: this.dataTreeId2,
      //   step: this.noticeStep
      // }
      // this.$http.post('/Work/Project/Demand/JobNoticeMember.ashx',data)
      // .then(res=>{
      //   console.log(res)
      // })

      this.$modal.show("taskNotice");
    },
    async noticeOk() {
      try {
        this.$refs.noticeLoading.loadBtn(true);
        setTimeout(() => {
          this.$refs.noticeLoading.loadBtn(false);
          this.$modal.hide("taskNotice");
        }, 4000);
        const data = {
          users: this.PeopleSet, //阶段id
          jobs: this.noticeJobSelectData, //要通知的任务id
          dId: this.dataTreeId2, //需求id
          message: this.notictextarea, //通知消息
        };
        const res = await this.$http.post(
          "/Work/Project/Demand/JobNoticeMember.ashx",
          data
        );
        if (res.res == 0) {
          this.$refs.noticeLoading.loadBtn(false);
          this.$notify.success(res.msg);
          this.$modal.hide("taskNotice");
        }
      } catch (err) {
        console.log(err);
      }
    },
    //  全选--取消全选
    handleCheckAllChange(val) {
      this.noticeJobSelectData = val ? this.allNotice : [];
      this.isIndeterminate = false;
    },
    //任务选择事件
    handleCheckedJobChange(value) {
      let checkJobLength = value.length;
      this.noticeJobAll = this.noticeDataJob.length === checkJobLength;
      this.isIndeterminate =
        checkJobLength > 0 && checkJobLength < this.noticeDataJob.length;
    },

    /*
     * 负责人审核后流转
     */
    setReview(val) {
      const data = {
        did: this.dataTreeId2,
      };
      this.$http.post("/Work/Project/Demand/SetReview.ashx");
    },
    /*
     * 审核节点
     */
    routItem(item) {
      this.$modal.show("addverify");
      this.routItemId = item.id;
    },
    // 创建/新增 页面切换
    createVerify() {
      (this.verifyFlag = 2), (this.verifyTitle = "创建审核节点");
    },
    backVerify() {
      (this.verifyFlag = 1), (this.verifyTitle = "添加审核节点");
    },
    // 重置创建节点表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.initAddverifyData();
    },
    //创建审核节点
    submitForm(formName) {
      this.ruleForm.eId = Number(this.$route.params.eid);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let isConfirm = null;
          this.mustList.forEach((m) => {
            this.auxiliaryList.forEach((a) => {
              if (m.UId == a.UId) {
                isConfirm = m.UName;
              }
            });
          });
          if (isConfirm) {
            this.$message({
              showClose: true,
              message: `${isConfirm}不能同时为主审核人和辅助审核人`,
              type: "warning",
            });
            return;
          }
          const mustListData = this.mustList.map((m) => {
            return {
              UserId: m.UId,
              IsRequired: true,
            };
          });
          const auxiliaryListData = this.auxiliaryList.map((m) => {
            return {
              UserId: m.UId,
              IsRequired: false,
            };
          });
          this.ruleForm.users = [];
          this.ruleForm.users.push(...mustListData, ...auxiliaryListData);
          if (!this.ruleForm.users.length) {
            this.$message({
              showClose: true,
              message: `请选择审核人`,
              type: "warning",
            });
            return;
          }
          this.verifyLoading = true;
          this.$http
            .post("/Work/Project/ReviewNode/Create.ashx", this.ruleForm)
            .then((res) => {
              if (res.res == 0) {
                this.$notify.success(res.msg);
                setTimeout(() => {
                  this.$refs[formName].resetFields();
                  this.verifyLoading = false;
                  this.initAddverifyData();
                  this.getverify(); //审核节点
                }, 500);
              } else {
                this.$notify.error(res.msg);
                setTimeout(() => {
                  this.verifyLoading = false;
                }, 500);
              }
            })
            .catch((err) => {
              this.$notify.error(err.msg);
              setTimeout(() => {
                this.verifyLoading = false;
              }, 500);
            });
        }
      });
      setTimeout(() => {
        this.verifyLoading = false;
      }, 2000);
    },
    // 删除审核节点
    verifyDel(ID) {
      this.$http
        .post("/Work/Project/ReviewNode/Delete.ashx", { id: ID })
        .then((res) => {
          if (res.res == 0) {
            this.$notify.success(res.msg);
            this.verifyForm.page = 1;
            this.getverify();
          } else {
            this.$notify.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取全部审核节点
    getverify() {
      // const eid =
      var data = {
        eid: Number(this.$route.params.eid),
        page: this.verifyForm.page,
        limit: this.verifyForm.limit,
        userView: this.isProLeaderSelect,
      };
      this.$http
        .post("/Work/Project/ReviewNode/GetAll.ashx", data)
        .then((res) => {
          this.verifyData = res.data.Datas;
          this.verifyForm.Total = res.data.Total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    verifyChangePage(page) {
      this.verifyForm.page = page;
      this.getverify();
    },
    /**
     * 添加到审核节点弹窗取消按钮
     */
    verifyaddCancel() {
      if (this.verifyFlag == 1) {
        this.$modal.hide("addverify");
      } else if (this.verifyFlag == 2) {
        this.resetForm("ruleForm");
      }
    },
    /**
     * 添加到审核节点弹窗确认按钮
     */
    verifyaddComfirm() {
      if (this.verifyFlag == 1) {
        this.verifyadd();
      } else if (this.verifyFlag == 2) {
        this.submitForm("ruleForm");
      }
    },
    async verifyadd() {
      // 1添加需求分类 2添加需求 3流程 4routeritem的审核节点
      if (this.verifyFlag == 2) {
        return this.$notify.warning("请返回再执行此操作！");
      }
      this.$refs.verifyId.loadBtn(true);
      if (this.verifyType == 1) {
        try {
          const data = {
            rnId: this.verifySelectId,
            dcId: [this.dataTreeId],
          };
          var res = await this.$http.post(
            "/Work/Project/ReviewNode/AddDemandClassify.ashx",
            data
          );
          if (res.res == 0) {
            this.$notify.success(res.msg);
            this.verifySelectId = "";
            this.$refs.verifyId.loadBtn(false);
            this.$modal.hide("addverify");
          } else {
            this.$refs.verifyId.loadBtn(false);
            this.$notify.error(res.msg);
            this.$modal.hide("addverify");
            this.verifySelectId = "";
          }
        } catch (err) {
          this.$refs.verifyId.loadBtn(false);
          this.$modal.hide("addverify");
          this.verifySelectId = "";
          console.warn(err);
        }
      } else if (this.verifyType == 2) {
        try {
          const data = {
            rnId: this.verifySelectId,
            dId: [this.dataTreeId2],
          };

          let res = await this.$http.post(
            "/Work/Project/ReviewNode/AddDemand.ashx",
            data
          );
          if (res.res == 0) {
            this.$notify.success(res.msg);
            this.$modal.hide("addverify");
            this.$refs.verifyId.loadBtn(false);
            this.verifySelectId = "";
          } else {
            this.$notify.error(res.msg);
            this.$modal.hide("addverify");
            this.$refs.verifyId.loadBtn(false);
            this.verifySelectId = "";
          }
        } catch (err) {
          this.$refs.verifyId.loadBtn(false);
          this.$modal.hide("addverify");
          this.verifySelectId = "";
          console.warn(err);
        }
      } else if (this.verifyType == 3) {
        try {
          const data = {
            rnId: this.verifySelectId,
            datas: [{ dId: this.dataTreeId2, step: this.verifySetp }],
          };

          let res = await this.$http.post(
            "/Work/Project/ReviewNode/AddDemandflowStep.ashx",
            data
          );
          if (res.res == 0) {
            this.$notify.success(res.msg);
            this.$refs.verifyId.loadBtn(false);
            this.$modal.hide("addverify");
            this.verifySelectId = "";
          } else {
            this.$notify.error(res.msg);
            this.$refs.verifyId.loadBtn(false);
            this.$modal.hide("addverify");
            this.verifySelectId = "";
          }
        } catch (err) {
          this.$refs.verifyId.loadBtn(false);
          this.$modal.hide("addverify");
          this.verifySelectId = "";
          console.warn(err);
        }
      } else if (this.verifyType == 4) {
        try {
          const data = {
            rnId: this.verifySelectId,
            jId: [this.routItemId],
          };
          let res = await this.$http.post(
            "/Work/Project/ReviewNode/AddJob.ashx",
            data
          );
          if (res.res == 0) {
            this.$notify.success(res.msg);
            this.$modal.hide("addverify");
            this.verifySelectId = "";
          } else {
            this.$notify.error(res.msg);
            this.$modal.hide("addverify");
            this.verifySelectId = "";
          }
        } catch {
          this.$refs.verifyId.loadBtn(false);
          this.$modal.hide("addverify");
          this.verifySelectId = "";
          console.warn(err);
        }
      }
      this.verifySelectId = "";
      this.$refs.verifyId.loadBtn(false);
    },

    //任务详情
    jobinfo(id) {
      this.jid = id;
      this.$modal.show("taskDetail");
    },
    //确认完成任务
    sureTaskOk(item, val) {
      // 需求id 需求流程序号 用户id isComplete是否已完成
      const data = {
        did: this.dataTreeId2,
        step: item.Step,
        uid: this.$store.state.user.id,
        isComplete: val,
      };
      this.sureTaskOkData = data;
      this.sureok2();
      // this.$modal.show("sureok");
    },
    sureok2() {
      this.$refs.suretaskok.loadBtn(true);
      this.$http
        .post("/Work/Project/Demand/SetStepStatus.ashx", this.sureTaskOkData)
        .then((res) => {
          if (res.res == 0) {
            this.$notify.success(res.msg);
            this.$refs.suretaskok.loadBtn(false);
            this.getDataThree();
            this.getDamoList();
          } else {
            this.$notify.error(res.msg);
            this.$refs.suretaskok.loadBtn(false);
            this.getDataThree();
            this.getDamoList();
          }
        })
        .catch((err) => {
          this.$notify.error(err.msg);
          this.$refs.suretaskok.loadBtn(false);
        });
    },
    /*
     * 配置规则流程--- 过滤那组switch状态
     */
    filterTask(item) {
      this.CheckOptionTop[1].Children[1].switch.forEach((e) => {
        e.value = false;
        item.ConcurrentlySteps.forEach((q) => {
          if (q == e.Step) {
            e.value = true;
          }
        });
      });
    },
    //设置可同时执行的需求流程阶段
    switchChange(s, name, ref) {
      this.$refs[`${ref}-${name}`][0].show();
      //先遍清空历一遍,如果开关是false 就pass ,没有就push
      this.switchData = [];
      this.CheckOptionTop[1].Children[1].switch.forEach((item) => {
        if (item.value == true) {
          this.switchData.push(item.Step);
        }
      });
      //需求id 流程阶段
      const data = {
        did: this.dataTreeId2,
        step: s.Step,
        csteps: this.switchData,
      };
      this.$http
        .post("/Work/Project/Demand/SetConcurrentlySteps.ashx", data)
        .then((res) => {
          if (res.res == 0) {
            this.$refs[`${ref}-${name}`][0].show();
            this.$notify.success(res.msg);
            this.proRulesIsChange = true;
          } else {
            this.$notify.error(res.msg);
          }
        })
        .catch((err) => {
          this.$notify.error(err.msg);
        });
    },
    //选择执行人
    openPeople(item) {
      this.$modal.show("taskListPeple");
      this.taskProceData = item;
      this.peopleData = item.Excuters.map((item) => {
        return {
          UName: item.UName,
          Picture: item.Picture,
          PositionName: item.PositionName,
          UId: item.UsId,
        };
      });
    },
    Confirm(val) {
      this.peopleData = val;
    },
    //确认执行人
    peopleOk() {
      this.$refs.pepleid.loadBtn(true);
      const peopleArray = [];
      this.peopleData.forEach((item) => {
        peopleArray.push(item.UId);
      });
      const data = {
        did: this.dataTreeId2, //需求ID
        step: this.taskProceData.Step, //步骤
        users: peopleArray, //执行人id
      };
      this.$http
        .post("/Work/Project/Demand/SetStepExcuters.ashx", data)
        .then((res) => {
          if (res.res == 0) {
            this.$modal.hide("taskListPeple");
            this.$notify.success(res.msg);
            this.$refs.pepleid.loadBtn(false);
            this.getDamoList();
          } else {
            this.$notify.error(res.msg);
            this.$refs.pepleid.loadBtn(false);
          }
        })
        .catch((err) => {
          this.$refs.pepleid.loadBtn(false);
          this.$notify.error(err.msg);
        });
    },
    //获取需求分类流程模板
    getMB() {
      const data = {
        CurrentPage: 1,
        PageCount: 10,
        keyword: "",
      };
      this.$http
        .get("/MGT/System/Demandflow/ListTemplate.ashx", data)
        .then((res) => {
          if (res.res == 0) {
            const data = res.data.infos;
            data.forEach((res) => {
              this.$set(res, "isUse", false);
              this.$set(res, "loading", false);
            });
            this.processList = data;
          }
        });
      // isUse loading
    },
    //获取需求阶段任务
    getDamoList(val) {
      if (val) {
        this.dataTreeId2 = val.Id;
      }
      this.loadingRight = true;
      this.taskProce = [];
      this.CheckOptionTop[1].Children[1].switch = []; //先清空流程规则再push
      this.$http
        .post("/Work/Project/Demand/Details.ashx", {
          id: this.dataTreeId2,
          userView: this.isProLeaderSelect,
        })
        .then((res) => {
          if (res.res === 0 && res.data !== null) {
            this.EditInitLoop(res.data.LoopInfo);
            this.taskProce = res.data.Data;
            this.taskProce.forEach((e) => {
              this.$set(e, "pageMsgIndex", 1);
              this.$set(e, "Flag", false);
              this.$set(e, "NoticFlag", false);
              this.$set(e, "headFlag", true);
              this.$set(e, "NoticData", []);
              var bf = "";
              if (e.TaskCount !== 0) {
                bf = parseInt((e.TaskFinished / e.TaskCount) * 100); //res.TaskFinished/res.TaskCount
              } else {
                bf = 0;
              }
              console.log(this.taskProce, "流程数据");
              this.$set(e, "percen", bf);
              this.CheckOptionTop[1].Children[1].switch.push({
                Name: e.Name,
                Step: e.Step,
                value: false,
              });
            });
            setTimeout(() => {
              this.loadingRight = false;
            }, 500);
          }
        });
      setTimeout(() => {
        this.loadingRight = false;
      }, 6000);
    },
    /**
     * 编辑需求，初始化循环设置
     */
    EditInitLoop(val) {
      if (!val) {
        return;
      }
      this.looptype = val.LoopType;
      if (this.looptype == 1) {
        //选择天
        this.loopMonth = false;
        this.loopDay = true;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopday = val.LoopTime1;
        this.value4 = val.Condition;
      } else if (this.looptype == 2) {
        this.loopMonth = true;
        this.loopDay = true;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.loopmonth = val.LoopTime1;
        this.loopday = val.LoopTime2;
        this.value4 = val.Condition;
      } else if (this.looptype == 3) {
        this.loopMonth = false;
        this.loopDay = false;
        this.loopWeek = true;
        this.loopWeek2 = true;
        this.loopweek2 = val.LoopTime1;
        this.loopweek = val.LoopTime2;
        this.value4 = val.Condition;
      } else if (this.looptype == 4) {
        this.loopMonth = false;
        this.loopDay = false;
        this.loopWeek = false;
        this.loopWeek2 = false;
        this.value4 = val.Condition;
      }
    },
    /*
     *---使用流程
     */
    userProcess(item) {
      const data = this.processList;
      this.processList.forEach((res) => {
        res.isUse = false;
      });
      item.isUse = true;
      this.MBData = item;
    },
    // 创建需求
    addxqOK2(item, val) {
      //清空表单数据
      Object.keys(this.DemandFormSmall).forEach((m) => {
        this.DemandFormSmall[m] = null;
      });
      this.looptype = ""; //保存的参数
      this.postType = null;
      this.loopMonth = false;
      this.loopDay = false;
      this.loopWeek = false;
      this.loopWeek2 = false;
      this.loopmonth = 1;
      this.loopday = 1;
      this.loopweek = 1;
      this.loopweek2 = 1;
      this.value4 = 1;
      this.DamoTitle = "创建需求";
      this.getMB();
      this.dataTreeId = item.Id;
      this.$modal.show("taskListOpen");

      this.options1 = [];
      this.options4 = [];

      this.$D.LIST("loop_demand_type").forEach((e) => {
        this.options1.push({ value: e.value, label: e.key });
      });
      this.$D.LIST("loop_demand_condit").forEach((e) => {
        this.options4.push({ value: e.value, label: e.key });
      });

      // this.options1 = this.$D.LIST('loop_demand_type')
      // this.options4 = this.$D.LIST('loop_demand_condit')
      this.options2 = [];
      this.options3 = [];
      // this.options2.push({ value: 0, label: "默认" });
      // this.options3.push({ value: 0, label: "默认" });
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

      this.DamoFlag = 1;
    },
    //创建、编辑
    addxqOK() {
      this.$refs.damo.loadBtn(true);
      const eid = Number(this.$route.params.eid);
      this.taskLoopOk();

      if (this.DamoFlag == 1) {
        this.$http
          .post("/Work/Project/Demand/Create.ashx", {
            name: this.DemandFormSmall.Name,
            dcid: this.dataTreeId,
            eid: eid,
            dftId: this.MBData.id, //模板id
            version: this.DemandFormSmall.Describe2, //版本
            loop: this.loopForm,
          })
          .then((res) => {
            if (res.res == 0) {
              if (this.flag == 3 && this.isAlldemand) {
                this.$refs.alldemand.refreshAllDeMandData(
                  this.dataTreeId,
                  this.isProLeaderSelect,
                  this.selVersion
                );
              }
              this.$refs.damo.loadBtn(false);
              this.getDataThree();
              this.DemandFormSmall.Name = "";
              this.DemandFormSmall.Describe2 = "";
              this.getMB();
              this.$modal.hide("taskListOpen");
              this.$notify.success("创建需求成功");
              this.getVersionsAllData();
            }
          });
      } else {
        this.$http
          .post("/Work/Project/Demand/Modify.ashx", {
            id: this.DemandThree.Id,
            name: this.DemandFormSmall.Name,
            version: this.DemandFormSmall.Describe2,
            loop: this.loopForm,
            dcid: this.dataTreeId,
          })
          .then((res) => {
            if (res.res == 0) {
              this.$refs.damo.loadBtn(false);
              this.getDataThree();
              this.$modal.hide("taskListOpen");
              this.DemandFormSmall.Name = "";
              this.$notify.success("编辑需求成功");
            }
          });
      }
      setTimeout(() => {
        this.$refs.damo.loadBtn(false);
      }, 2000);
    },
    /*
     * 点击取消按钮 清空创建需求选中的模板
     */
    taskListDel() {
      this.MBData = {};
    },
    //删除需求
    addxqDel() {
      this.$refs.damodel.loadBtn(true);
      this.$http
        .post("/Work/Project/Demand/Delete.ashx", {
          id: this.DemandThree.Id,
        })
        .then((res) => {
          if (res.res == 0) {
            this.getDataThree();
            this.$refs.damodel.loadBtn(false);
            this.$modal.hide("taskListDel");
            this.$notify.success("删除成功");
          }
        });
      setTimeout(() => {
        this.$refs.damodel.loadBtn(false);
      }, 2000);
    },
    handleSelect(type, e, name, ref, item) {
      this.$refs[`${ref}-${name}`][0].show();
      // this.$refs[`${ref2}-${name2}`][0].show();
      if (type == 1) {
      } else if (type == 2) {
        console.log("编辑需求");
        this.getMB();
        this.DamoTitle = "编辑需求";
        this.options1 = [];
        this.options4 = [];

        this.$D.LIST("loop_demand_type").forEach((e) => {
          this.options1.push({ value: e.value, label: e.key });
        });
        this.$D.LIST("loop_demand_condit").forEach((e) => {
          this.options4.push({ value: e.value, label: e.key });
        });
        this.options2 = [];
        this.options3 = [];
        // this.options2.push({ value: 0, label: "默认" });
        // this.options3.push({ value: 0, label: "默认" });
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
        this.dataTreeId = item.Id;
        this.DamoFlag = 2;
        this.$modal.show("taskListOpen");
        this.DemandFormSmall.Name = this.DemandThree.Name;
        this.DemandFormSmall.Describe2 = e.Version;
        this.DamoFlag = 2;
        this.$refs[`${ref}-${name}`][0].hide();
      } else if (type == 3) {
        // console.log("删除需求");
        this.$refs[`${ref}-${name}`][0].hide();
        this.$modal.show("taskListDel");
      } else if (type == "verify") {
        // console.log("审核节点");
        this.verifyType = 2;
        this.$modal.show("addverify");
        this.$refs[`${ref}-${name}`][0].hide();
      } else if (type == "33") {
        this.$refs[`${ref}-${name}`][0].hide();
        this.$modal.show("taskLoopNew2");
        this.deepDarkOpen();
      }
    },
    /**
     * 控制点击二级下拉菜单时一级下拉菜单不被隐藏
     */
    handleCheckOptionTop(name, ref, type, Step, val) {
      this.$refs[`${ref}-${name}`][0].show();
      if (type !== undefined && type == 1) {
        this.$modal.show("addverify");
        this.verifyType = 3;
        this.verifySetp = Step;
        this.$refs[`${ref}-${name}`][0].hide();
      } else if (type !== undefined && type == 3) {
        this.verifySetp = Step;
        this.$refs[`${ref}-${name}`][0].hide();
        this.$modal.show("taskTypeAddTask");
      }
    },
    async rightSwitch(item, step) {
      try {
        const data = {
          did: this.dataTreeId2,
          step,
          needReview: item.NeedReview,
        };
        const res = await this.$http.post(
          "/Work/Project/Demand/SetReview.ashx",
          data
        );
        if (res.res == 0) {
          this.$notify.success(res.msg);
        }
      } catch (err) {
        console.warn(err);
      }
    },
    cardSetpMenu(e) {
      var num = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
      ];
      var q = 0;
      var w = true;
      var newOpenCount = e.OpenCount + 1;
      this.$set(e, "OpenCountMenu", []);
      for (var i = 0; i < newOpenCount; i++) {
        if (num[q + 1] !== undefined) {
          e.OpenCountMenu.push({ menulist: num[q + 1], flag: w });
          w = false;
          q += 1;
        } else {
          q += 1;
          e.OpenCountMenu.push({ menulist: q, flag: false });
        }
      }
      console.log(e);
    },

    //卡片的开关
    cardOpen(e, taskProce) {
      e.Flag = !e.Flag;
      this.cardSetpMenu(e);

      this.newArrayDataStep = [];
      console.log(taskProce, e.Step);
      taskProce.forEach((item) => {
        if (item.Step != e.Step) {
          this.newArrayDataStep.push({ Step: item.Step, Name: item.Name });
        }
      });
      console.log(this.newArrayDataStep);

      if (this.isProLeaderSelect == null) {
        this.isProLeaderSelect = this.isProLeader;
      }

      console.log(e);
      this.noticeStep = e.Step;
      this.getNotice(e);
      //需求id step阶段 openCount打开次数 page页码  limit单页数量
      const data = {
        did: this.dataTreeId2,
        step: e.Step,
        openCount: 0,
        page: 1,
        limit: 10,
        userView: this.isProLeaderSelect,
      };
      if (!e.Job) {
        this.$set(e, "Job", []);
      }

      if (e.Flag) {
        this.$http
          .post("/Work/Project/Demand/JobsByOpenTime.ashx", data)
          .then((res) => {
            if (res.res === 0) e.Job = res.data.Datas;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 执行人的折叠面板
    openHeadFlag(item) {
      item.headFlag = !item.headFlag;
    },
    //更换阶段
    jobChange(item, menu, indexq) {
      item.OpenCountMenu.forEach((e) => {
        e.flag = false;
      });
      menu.flag = true;
      console.log(menu, item);
      if (this.isProLeaderSelect == null) {
        this.isProLeaderSelect = this.isProLeader;
      }
      const data = {
        did: this.dataTreeId2,
        step: item.Step,
        openCount: indexq,
        page: 1,
        limit: 30,
        userView: this.isProLeaderSelect,
      };

      this.$http
        .post("/Work/Project/Demand/JobsByOpenTime.ashx", data)
        .then((res) => {
          console.log(res);
          item.Job = [];
          item.Job = res.data.Datas;
          // this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 所有需求
     */
    handleAlldemand() {
      this.isAlldemand = true;
      this.allActive = false; //本家控制高亮
      this.activeLi = null;
      this.dataTree.forEach((e) => {
        e.flagActive = false;
      });
      this.$refs.alldemand.refreshAllDeMandData(
        null,
        this.isProLeaderSelect,
        this.selVersion
      );
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
    //排序和搜索
    orderAndSearch(loadName, page) {
      console.log("排序搜索");
      if (page) {
        this.isLoading = true;
        this.formData.currentPage++;
      } else {
        this.formData.currentPage = 1;
      }
      console.log(this.formData);
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
    //切换Tab函数
    handleClick(tab, flag, call) {
      console.log("点了routeritem");
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
    activeList(index, item, loadName) {
      console.log(index, item, loadName);
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
    getTaskNumber(loadName) {
      this.$http
        .post("/Project/taskMenuInquire.ashx#", this.formData)
        .then((resp) => {
          console.log(resp, "2");
          if (resp.res == 0) {
            this.numbers[0] = resp.data.count;
            this.itemData = resp.data.data;
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
    refreshData() {
      console.log("更新右边数据");
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
    // 打开新建流程窗口
    processAdd(val, item) {
      this.$modal.show("processAdd2");
      this.processData = item;
      console.log(val, this.processData);
      this.processFlag = val;
      if (val === 1) {
        this.processTitle = "新建流程";
      } else if (val === 2) {
        this.processTitle = "编辑流程";
        this.processFrom.ProceName = this.processData.ProceName;
      }
    },
    //确认新建流程
    processAddOK() {
      this.$modal.hide("processAdd2");
      if (this.processFlag === 1) {
        this.taskProce.push({
          ProceName: this.processFrom.ProceName,
          Children: [],
        });
        this.$notify.success("新建流程成功");
        this.processFrom.ProceName = "";
      } else {
        for (let item of this.taskProce) {
          if (item.ProceName === this.processData.ProceName) {
            item.ProceName = this.processFrom.ProceName;
            this.$notify.success("编辑成功");
          }
        }
      }
    },
    //切换任务类型
    changeType(val) {
      this.flag = val.id;
      this.dataTreeLoad = true;
      setTimeout(() => {
        this.dataTreeLoad = false;
      }, 1500);
      if (val.type === 2) {
        this.formData.view.queryType = val.type;
        this.$http
          .post("/Project/taskMenuInquire.ashx#", this.formData)
          .then((res) => {
            if (res.res === 0) {
              this.numbers[1] = res.data.count;
              console.log(this.numbers);
            }
          });
      }
      this.taskTypeModel = val.label;
      this.taskTypeModelTitle = val.title;
    },
    //任务需求
    getThree() {
      this.dataTree.forEach((res) => {
        this.$set(res, "flag", true);
        this.$set(res, "flagActive", false);
      });
    },
    //树状图的展开关闭切换
    threeOpenClose(val) {
      val.flag = !val.flag;
    },
    threeOpenActive(item) {
      this.isAlldemand = true;
      this.activeLi = "";
      this.dataTree.forEach((res) => {
        res.flagActive = false;
      });
      item.flagActive = true;
      this.allActive = item.flagActive;
      // console.log(this.$refs.alldemand);
      this.$refs.alldemand.refreshAllDeMandData(
        item.Id,
        this.isProLeaderSelect,
        this.selVersion
      );
    },
    //获取树状图数据
    getDataThree() {
      this.dataTreeLoad = true;
      if (this.isProLeaderSelect == null) {
        this.isProLeaderSelect = this.isProLeader;
      }
      this.$http
        .post("/Work/Project/DemandClassify/GetAll.ashx", {
          eid: this.$route.params.eid,
          userView: this.isProLeaderSelect,
          version: this.selVersion,
        })
        .then((res) => {
          if (res.res == 0) {
            this.dataTree = res.data;
            let data = res.data;
            this.getThree();
          }
        })
        .finally(() => (this.dataTreeLoad = false));
    },
    /**
     * 从消息界面自动定位到某需求
     */
    locationDemand() {
      const msgDemand = this.$route.query.selDemand;
      if (msgDemand) {
        const val = {
          Id: msgDemand.DemandId,
          Name: msgDemand.Name,
        };
        this.getThreeLi(val);
      }
    },
    //"高亮"
    getThreeLi(val, item) {
      console.log(val, item, "高亮");
      this.allActive = true; //控制全部需求高亮
      this.getDamoList(val); //查询阶段
      this.DemandThree = val;
      this.activeLiName = val.Name;
      this.activeLi = val.Name + val.Id;
      this.isAlldemand = false;
      if (item) {
        item.flagActive = false;
      }
    },
    // 任务详情
    taskInfo() {
      this.$modal.show("taskDetail");
    },
    //创建需求弹窗打开
    taskTypeAdd() {
      this.$modal.show("taskTypeAdd");
    },
    //大的需求分类和小的需求分类创建
    addDemandOpen(val, e) {
      this.demandFlag = val;
      if (e) {
        this.dataTreeId = e.Id;
      }
      if (val == 1) {
        this.demandTitle = "创建需求分类";
        this.DemandFormBig.Name = "";
        this.DemandFormBig.Describe = "";
        this.$modal.show("taskListAdd");
      } else if (val == 2) {
        this.demandTitle = "编辑需求分类";
        this.DemandFormBig.Name = e.Name;
        this.DemandFormBig.Describe = e.Describe;
        this.$modal.show("taskListAdd");
      } else if (val == 3) {
        this.$modal.show("taskListDel2");
        // 删除需求分类
      } else if (val == 4) {
        this.verifyType = 1;
        this.$modal.show("addverify");
      }
    },
    // 删除需求分类
    taskdel() {
      this.$refs.damodel2.loadBtn(true);
      this.$http
        .post("/Work/Project/DemandClassify/Delete.ashx", {
          cid: this.dataTreeId,
        })
        .then((res) => {
          this.$refs.damodel2.loadBtn(false);
          if (res.res == 0) {
            setTimeout(() => {
              this.$notify.success("成功");
              this.getDataThree();
              this.$modal.hide("taskListDel2");
            }, 1000);
          } else {
            this.$modal.hide("taskListDel2");
          }
        })
        .catch((err) => {
          this.$notify.warning(err);
        });
    },
    //确认创建or修改 大的or小的
    addDemandOK() {
      this.$refs.xm.loadBtn(true);
      if (this.demandFlag == 1) {
        this.$http
          .post("/Work/Project/DemandClassify/Create.ashx", {
            name: this.DemandFormBig.Name,
            describe: this.DemandFormBig.Describe,
            eid: this.$route.params.eid,
          })
          .then((res) => {
            if (res.res == 0) {
              this.$notify.success("成功");
              this.DemandFormBig.Describe = "";
              this.DemandFormBig.Name = "";
              this.$modal.hide("taskListAdd");
              this.$refs.xm.loadBtn(false);
              this.getDataThree();
            } else {
              // this.$notify.error(res.msg)
              this.$modal.hide("taskListAdd");
              this.$refs.xm.loadBtn(false);
            }
          })
          .catch((err) => {
            this.$notify.error(err.msg);
            this.$modal.hide("taskListAdd");
            this.$refs.xm.loadBtn(false);
          });
      } else if (this.demandFlag == 2) {
        // this.demandTitle = "编辑需求分类";
        this.$http
          .post("/Work/Project/DemandClassify/Modify.ashx", {
            cid: this.dataTreeId,
            name: this.DemandFormBig.Name,
            des: this.DemandFormBig.Describe,
          })
          .then((res) => {
            if (res.res == 0) {
              this.$refs.xm.loadBtn(false);
              this.$notify.success("成功");
              this.DemandFormBig.Describe = "";
              this.DemandFormBig.Name = "";
              this.$modal.hide("taskListAdd");
              this.getDataThree();
            } else {
              // this.$notify.error(res.msg)
              this.$modal.hide("taskListAdd");
              this.$refs.xm.loadBtn(false);
            }
          })
          .catch((err) => {
            this.$notify.error(err.msg);
            this.$modal.hide("taskListAdd");
            this.$refs.xm.loadBtn(false);
          });
        setTimeout(() => {
          this.$refs.xm.loadBtn(false);
        }, 2000);
      }
    },
    /*
     * 切换视图
     */
    changeisProLeader() {
      this.getThree(); //需求数据
      this.getDataThree(); //需求分类
      this.refreshData();
      this.getverify(); //节点

      this.$refs.alldemand.refreshAllDeMandData(
        this.dataTreeId,
        this.isProLeaderSelect,
        this.selVersion
      );
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
  created() {
    this.isProLeader = this.$store.state.isProLeader;
    // this.isProLeaderSelect = this.isProLeader;
    this.getverify(); //审核节点
    this.getThree(); //任务需求数据
    this.getDataThree(); //需求分类
    this.getVersionsAllData();
    this.refreshData();
    this.$E.$on("upChildTask", (obj) => {
      // index, item, loadName
      this.activeList(1, 1, "childLoading");

      if (this.flag == 3 && this.dataTreeId2) {
        // 按状态查看
        this.getDataThree();
        this.getDamoList();
      }
      if (this.flag == 3 && this.isAlldemand) {
        this.$refs.alldemand.refreshAllDeMandData(
          this.dataTreeId,
          this.isProLeaderSelect,
          this.selVersion
        );
      }
      this.$forceUpdate();
    });
  },
  mounted() {
    this.locationDemand();
  },
};
</script>
<style lang="less">
.addverify_modal {
  .modal {
    .ctn {
      max-height: 485px;
      overflow-y: auto;
    }
  }
}
.page {
  padding: 1rem;
  box-sizing: border-box;
  height: 100%;
}
.box {
  display: flex;
  height: 100%;
  .box_left {
    min-width: 200px;
    height: calc(100% - 20px);

    overflow-x: hidden;
    overflow-y: auto;
    background: #fff;
    padding: 10px;
    .l_title1 {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #aaaaaa;
      height: 30px;
      line-height: 30px;
      .l_title1_type1 {
        font-size: 16px;
      }
      .l_title1_type2 {
        color: #aaaaaa;
        font-size: 16px;
      }
    }
    .l_title2 {
      .edition {
        margin-bottom: 15px;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        span {
          cursor: pointer;
        }
      }
      .active_edition {
        color: #448ef5;
      }
      .l_title2_title1 {
        height: 30px;
        display: flex;
        align-items: center;
        margin-top: 5px;
        .l_title2_title1_left {
          width: 30px;
          height: 30px;
          background: #448ef5;
          border-radius: 50%;
          font-size: 8px;
          color: #ffffff;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
        }
        .l_title2_title1_right {
          cursor: pointer;
          color: #1890ff;
          font-size: 14px;
          font-weight: 700;
          margin-left: 5px;
        }
        .l_title2_title1_rig {
          margin-left: 8px;
          color: #448ef5;
          border: 1px solid #448ef5;
        }
      }
      .title2_ul {
        li {
          display: flex;
          margin-bottom: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }
        }
        li:last-child {
          margin-bottom: 0;
        }
      }
      .active {
        box-shadow: 0px 3px 18px -5px rgba(80, 166, 255, 0.7);
      }
    }
    .l_title3 {
      max-width: 200px;
      .t3_title1 {
        font-size: 16px;
        color: #666;
        margin: 10px 0;
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
      }
      .title1_active {
        color: #448ef5;
      }
      .t3_box {
        margin-bottom: 10px;
        .box_top {
          font-size: 16px;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            color: #1890ff;
          }
          .box_active {
            color: #1890ff;
          }
        }
        .box_bottom {
          border-left: 1px solid #aaaaaa;
          margin-left: 8px;

          .box_li {
            display: flex;
            justify-content: space-between;
            padding-left: 10px;
            color: #aaaaaa;
            font-size: 12px;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            .addtype {
              color: #448ef5;
            }
            .el-submenu {
              height: 30px;

              .el-submenu__title {
                height: 30px;
                line-height: 30px;
                border-bottom: 2px solid #fff !important;
                .el-icon-more {
                  width: 26px !important;
                  font-size: 14px !important;
                  color: #606266 !important;
                }
              }
            }
          }
          .active {
            color: #448ef5;
          }
        }
      }
      .t3_bottom {
        display: flex;
        align-items: center;
        cursor: pointer;
        p {
          color: #448ef5;
          font-size: 16px;
        }
      }
    }
  }
  .box_right {
    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: #d8d8d8;
      }
    }
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    .breadcrumb {
      background: #ffffff;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 5%);
      margin-bottom: 10px;
      padding: 14px;
    }
    .box_right_top {
      width: 80%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 20px;
      .b_r_one {
        margin-right: 24px;
        color: #1890ff;
        cursor: pointer;
        font-size: 14px;
      }
      .b_r_two {
        margin-right: 16px;
        cursor: pointer;
      }
      .b_r_three {
        cursor: pointer;
      }
    }
    .box_right_bottom {
      &:hover {
        &::-webkit-scrollbar-thumb {
          background-color: #d8d8d8;
        }
      }
      margin-left: 10px;
      // width: 80%;
      // height: calc(100% - 20px);
      display: flex;
      // overflow-x: auto;
      // overflow-y: hidden;
      .boxinfo {
        min-width: 255px;
        margin-right: 50px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        // background: #fff;
        .boxinfo_title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          .succe {
            background: #448ef5;
            color: #fff;
            padding: 4px 6px 4px 6px;
            border-radius: 12px;
            margin-right: 5px;
          }
          .succe2 {
            background: #f56c6c;
            color: #fff;
            padding: 4px 6px 4px 6px;
            border-radius: 12px;
            margin-right: 5px;
          }
          .el-menu-demo2 {
            background: #f6f6f6 !important;
            .el-submenu__title:hover {
              background-color: #f6f6f6 !important;
              color: #333 !important;
            }
            .el-submenu__title {
              border-bottom: 2px solid #f6f6f6;
            }
          }
          .pcolor1 {
            color: #37b24d;
          }
          .pcolor2 {
            color: #448ef5;
          }
          .pcolor22 {
            color: #448ef5;
          }
          .pcolor3 {
            color: #666666;
          }
          > p {
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            .box,
            .box2,
            .box3 {
              position: relative;
              margin-left: 10px;
              transform: rotate(45deg);
              width: 14px;
              height: 14px;
              background: #37b24d;
              .litter {
                width: 7px;
                height: 7px;
                background: #fff;
                border-radius: 50%;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
            .box2 {
              background: #448ef5;
            }
            .box22 {
              background: #448ef5;
            }
            .box3 {
              background: #aaaaaa;
            }
          }
        }
        .boxinfo_bottom {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          width: 255px;
          margin-top: 8px;
          .card {
            background: #fff;
            margin-bottom: 10px;
            padding: 10px 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .card_title1 {
              display: flex;

              > .cardtype {
                font-weight: bold;
                color: #333;
                font-size: 14px;
              }
              > .cardtype1 {
                padding: 0 5px;
                margin-left: 5px;
                border: 1px solid #37b24d;
                color: #37b24d;
              }
              > .cardtype2 {
                padding: 0 5px;
                margin-left: 5px;
                border: 1px solid #448ef5;
                color: #448ef5;
              }
              > .cardtype3 {
                padding: 0 5px;
                margin-left: 5px;
                border: 1px solid #666666;
                color: #666666;
              }
            }

            .card_title3 {
              height: 10px;
              color: #666;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 10px 0;
              line-height: 15px;
            }
            .card_title4 {
              display: flex;
              align-items: center;
              .card_title4_pro {
                flex: 2;
              }
            }
            .card_carry {
              margin: 10px 0;
              padding: 10px 5px 8px 5px;
              width: calc(100% - 10px);
              background: #efefef;
              display: flex;
              overflow: hidden;
              position: relative;
              .title {
                font-size: 12px;
                margin-right: 8px;
                color: #333;
                /* min-width: 40px; */
                flex-shrink: 0;
                padding-top: 5px;
              }
              .carry_box {
                display: flex;
                -webkit-box-pack: justify;
                flex-wrap: wrap;
                .info {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  margin: 0 8px 5px 0;
                  .box_img {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: #ccc;
                    margin-bottom: 5px;
                    overflow: hidden;
                    cursor: pointer;
                  }
                  .box_user_img {
                    margin-bottom: 5px;
                    cursor: pointer;
                  }
                  .el-radio__label {
                    padding: 0 !important;
                  }
                }
                .heidetop {
                  font-size: 14px;
                  position: absolute;
                  right: 3px;
                  top: 20px;
                  cursor: pointer;
                }
              }
              .hideheight {
                height: 26px;
              }
            }
            .childtask {
              line-height: 10px;
              padding-right: 3px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              // margin-top: 10px;
              > .left {
                color: #666666;
                display: flex;
                align-items: center;
                > .title {
                  color: #666666;
                  font-weight: 600;
                }
                > .title1 {
                  color: #37b24d;
                  margin: 0 5px;
                }
                > .title2 {
                  color: #448ef5;
                  margin: 0 5px;
                }
                > .tixingbtn {
                  height: 20px;
                  width: 50px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 4px;
                  cursor: pointer;
                  color: #409eff;
                  background: #ecf5ff;
                  border-color: #b3d8ff;
                }
                .tixingbtn:hover {
                  background: #409eff;
                  border-color: #409eff;
                  color: #fff;
                }
                > .title3 {
                  color: #666666;
                  margin-right: 5px;
                }
                .taskmenu {
                  margin: 0 5px;
                  color: #aaaaaa;
                  font-size: 12px;
                }
              }
            }
            .newcheck {
              margin-top: 10px;
              display: flex;
              max-height: 175px;
              overflow-y: scroll;
              .leftcheck {
                max-height: 100%;
                overflow-y: auto;
                color: #aaaaaa;
                border-right: 1px solid #aaaaaa;
                margin-right: 8px;
                padding-right: 8px;
                display: flex;
                flex-direction: column;
                .left_menu {
                  margin-bottom: 8px;
                  cursor: pointer;
                }
                .active {
                  color: #448ef5;
                }
              }
              .rightcheck {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 75%;
                max-height: 100%;
                overflow-y: auto;
                .checktask {
                  width: 100%;
                  margin-bottom: 8px;
                  font-size: 14px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  cursor: pointer;
                  .el-checkbox {
                    display: flex;
                    align-items: center;
                    width: 125px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .noactive {
                      color: #f18989;
                    }
                  }
                }
                .img {
                  width: 20px;
                  height: 20px;
                  overflow: hidden;
                  border-radius: 50%;
                  background: #ccc;
                  flex-shrink: 0;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .messagelist {
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .msg_title {
                color: #666666;
                font-weight: 600;
              }
              .mi {
                margin-right: 3px;
                font-size: 14px;
                cursor: pointer;
              }
            }
            .noticlist {
              max-height: 235px;
              overflow-y: scroll;
              .n_list {
                cursor: pointer;
                padding: 8px 5px;
                border-radius: 5px;
                color: #333333;
                .num_info {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 3px;
                  .num_row {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .num {
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      .el-avatar {
                        width: 24px;
                        height: 24px;
                      }
                    }
                    .text {
                      font-weight: bold;
                      color: #666666;
                      margin: 0 4px 0 3px;
                    }
                  }
                  .time {
                    color: #666666;
                  }
                }
                .msg {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                &:hover {
                  background-color: #ecf5ff;
                  color: #409eff;
                  border-color: #c6e2ff;
                  .time,
                  .text {
                    color: #409eff !important;
                  }
                }
              }
              .page_msg {
                display: flex;
                justify-content: space-around;
                // text-align: center;
                div {
                  margin-right: 5px;
                }
                .div_pointer {
                  cursor: pointer;
                  &:hover {
                    color: #409eff;
                  }
                }
                .div_nodrop {
                  cursor: no-drop;
                  color: #999999;
                }
              }
            }

            .bottomcolor {
              height: 2px;
              width: 100%;
              background: #aaaaaa;
              margin-top: 10px;
            }
            .trends {
              margin: 5px 0;
              display: flex;
              align-items: center;
              > .title {
                color: #666666;
                font-size: 14px;
                margin-right: 10px;
              }
              > .title2 {
                font-size: 12px;
                color: #aaaaaa;
              }
            }
            .option {
              margin-bottom: 10px;
              > .title {
                color: #666;
                font-size: 12px;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1; /* 这里是超出几行省略 */
                overflow: hidden;
              }
              > .title2 {
                color: #448ef5;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
  .box_right::-webkit-scrollbar-track-piece,
  .box_right::-webkit-scrollbar-thumb,
  .box_right::-webkit-scrollbar-corner,
  .box_right_bottom::-webkit-scrollbar-track-piece,
  .box_right_bottom::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
}

.qwqBig {
  padding: 10px;
  .dlog {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
    .dlogtitle {
      text-align: right;
      margin-right: 10px;
      width: 15%;
    }
  }
}
.ctn {
  // overflow: scroll;
  height: calc(100% - 120px) !important;
  position: relative;
  .deepDark {
    position: absolute;
    top: -20px;
    right: 35px;
    font-size: 16px;
    cursor: pointer;
    color: #6cb4ff;
  }
}
.qwqBig2 {
  padding: 10px;
  height: calc(100% - 20px);
  overflow: scroll;
  .left {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    // width: 60%;

    .dlog {
      display: flex;
      // align-items: center;
      justify-content: flex-start;

      margin-bottom: 20px;
      .dlogtitle {
        line-height: 40px;
        font-size: 14px;
        color: #333;
        text-align: right;
        margin-right: 10px;
        width: 15%;
      }
      .process-item {
        margin-top: 10px;
        border: 0.5px solid #aaaaaa;
        border-radius: 4px;
        padding: 8px 16px 16px 16px;
        .item-header {
          margin-bottom: 14px;
          h2 {
            float: left;
          }
          .el-button {
            float: right;
            line-height: 1;
            padding: 0;
          }
        }
        .step-box {
          padding-top: 2px;
          white-space: nowrap;
          overflow-x: auto;
          &::-webkit-scrollbar {
            height: 0;
          }
          .step {
            margin-right: 7px;
            user-select: none;
            span {
              border: 0.5px solid #666666;
              padding: 3px 8px;
              border-radius: 4px;
              color: #666666;
              margin-right: 7px;
            }
            i {
              font-size: 2rem;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
}
.peoplerun {
  width: 650px;
  height: 200px;
  overflow: hidden;
  /* overflow: auto; */
  overflow-y: scroll;
  .title1 {
    color: #1890ff;
    font-size: 14px;
    position: absolute;
    top: 5px;
    left: -28px;
    width: 100px;
    cursor: pointer;
  }
  .title22 {
    color: #1890ff;
    font-size: 14px;
    position: absolute;
    top: -43px;
    left: 50px;
    cursor: pointer;
  }

  .nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    // justify-content: space-between;
    padding: 10px;
    .box {
      display: flex;
      width: 20%;
      overflow: hidden;
      align-items: center;
      margin: 10px 10px;
      .img {
        background: #448ef5;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        display: flex;
        flex-direction: column;
        margin-left: 5px;
        // align-items: center;
        > .title2 {
          color: #333333;
          font-weight: 600;
          font-size: 14px;
        }
        > .title3 {
          color: #666666;
          font-size: 12px;
        }
      }
    }
    .per_list_del:before {
      content: "\e6db";
      position: absolute;
      margin-left: 4%;
      margin-top: -2.8rem;
      color: rgba(255, 255, 255, 1);
      background: rgba(252, 76, 77, 1);
      font-family: element-icons !important;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 1);
      opacity: 0;
      transition: all 0.3s linear;
    }
    //头像右上角删除
    .per_list_del:hover:before {
      opacity: 1;
    }
  }
}
.delbox {
  padding: 20px;
  color: #448ef5;
  display: flex;
  font-size: 18px;
  align-items: center;
  justify-content: center;
}
.verifyform {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .verifyli2 {
    .r_per {
      background: #f9f9f9;
      padding: 6px 8px;
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      border-radius: 2px;
      .per_list {
        margin-right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 4px 20px 4px 0;
        .name {
          margin-left: 5px;
        }
      }
      .per_list_del:before {
        content: "\e6db";
        position: absolute;
        margin-left: 4%;
        margin-top: -2.8rem;
        color: rgba(255, 255, 255, 1);
        background: rgba(252, 76, 77, 1);
        font-family: element-icons !important;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 1);
        opacity: 0;
        transition: all 0.3s linear;
      }
      //头像右上角删除
      .per_list_del:hover:before {
        opacity: 1;
      }
      .add {
        width: 28px;
        height: 28px;
        background: #448ef5;
        border-radius: 50%;
        line-height: 28px;
        text-align: center;
        margin: 4px 0;
        .el-icon-plus {
          color: #ffffff;
          font-size: 15px;
        }
      }
    }
  }
}
.verifyli {
  display: flex;
  justify-content: space-between;
  height: 35px;
  align-items: center;
  /deep/.el-radio {
    display: flex;
    align-items: center;
  }
  .delete {
    cursor: pointer;
    color: #fff;
    width: 50px;
    height: 20px;
    border-radius: 6px;
    display: block;
    background-color: #f56c6c;
    border-color: #f56c6c;
    line-height: 20px;
    text-align: center;
  }
}
/deep/ .el-progress-bar__innerText {
  color: #333 !important;
}
.groupJobStep {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;

  .groupjoblabelStep {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    margin-right: 0px;
    .el-checkbox__label {
      flex: 1;
    }
  }
}
.groupJob {
  display: flex;
  flex-wrap: wrap;
  .groupjoblabel {
    display: flex;
    align-items: center;
    margin: 10px 18px 10px 0;
    .g_b_num {
      display: flex;
      align-items: center;
      .num_name {
        margin-left: 3px;
      }
    }
  }
}
</style>
