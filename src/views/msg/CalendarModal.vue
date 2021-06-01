<template>
  <XModal
    name="calendar"
    :showCrossBtn="true"
    title="日程提醒"
    @opened="openInfo"
  >
    <div class="demo-app" v-if="ruleForm"> 
      <div class="calendar-tr">
				<div class="calendar-title">标题：</div>
				<div class="calendar-info">{{ ruleForm.Title?ruleForm.Title:'无' }}</div>
			</div>
      <div class="calendar-tr">
				<div class="calendar-title">时间：</div>
				<div class="calendar-info">{{ ruleForm.STime?ruleForm.STime.timeFormat("yyyy-MM-dd HH:mm:ss"):'--:--' }}至{{ ruleForm.ETime?ruleForm.ETime.timeFormat("yyyy-MM-dd HH:mm:ss"):'--:--' }}</div>
			</div>
      <div class="calendar-tr">
				<div class="calendar-title">提醒时间：</div>
				<div class="calendar-info">{{ ruleForm.Remind==0?'不提醒':$D.ITEM('task_remind_option',ruleForm.Remind).name }}</div>
			</div>
      <div class="calendar-tr">
				<div class="calendar-title">重复方式：</div>
				<div class="calendar-info">{{ Type[ruleForm.Type] }}</div>
			</div>
      <div class="calendar-tr">
				<div class="calendar-title">是否公开：</div>
				<div class="calendar-info">
          <div class="calendar-info">{{ ruleForm.IsOpen?'是':'否' }}</div>
        </div>
			</div>
      <div class="calendar-tr">
				<div class="calendar-title">备注：</div>
				<div class="calendar-info">{{ ruleForm.Remark?ruleForm.Remark:'无' }}</div>
			</div>
      <div class="calendar-tr">
				<div class="calendar-title">地址：</div>
				<div class="calendar-info">{{ ruleForm.Area?ruleForm.Area:'无' }}</div>
			</div>
      <div class="calendar-tr">
				<div class="calendar-title">成员：</div>
				<div class="calendar-info"><MemberSelect
            :arrays="ruleForm.Mem"
            :readonly="true"
        />
        </div>
			</div>
    </div>
  </XModal>
</template>

<script>
import MemberSelect from "@/components/Selectors/MemberSelect";
import XModal from "@/components/XModal";
import dayjs from "dayjs";

import { mapActions, mapState } from "vuex";
export default {
  components: {
    MemberSelect,
    XModal,
  },
  props: {
    calendarData: null,
  },

  data() {
    return {
      params: {},
      ruleForm: null,
      rules: {},
      scheduleDialog: {
        title: "",
        visible: false,
        info: {},
      },
      selectable: true,
      buttonText: {
        today: "今天",
        month: "月",
        week: "周",
        day: "天",
      },
      Type:['不重复','每天重复','每周重复','每月重复','每年重复','工作日重复']
    };
  },
  methods: {
    ...mapActions(["task_addId", "task_setIndex"]),
    openInfo() {
      this.$nextTick(() => {
        this.getScheduleDetail(this.calendarData);
      });
    },
    // 查询单个日程详情
    getScheduleDetail(event) {
      this.$http
        .post("/Work/Schedule/GetScheduleDetail.ashx", event)
        .then((resp) => {
          if (resp.res == 0) {
            this.ruleForm = resp.data.Detail;
            this.ruleForm.Mem=[];
            resp.data.Mem.forEach((item) => {
							this.ruleForm.Mem.push(
								JSON.parse(
									JSON.stringify(item)
									  .replace("UsId", "UId")
										.replace("Name", "UName")
										.replace("Picture", "Picture")
								)
							);
						});
          }else{
            this.$modal.hide("calendar");
          }
        });
    }
  },
};
</script>

<style lang="less" scoped>
.demo-app {
  padding: 0 1rem;
  .calendar-tr {
    margin-bottom: 1rem;
		display: flex;
		align-items: center;
		padding: 0.5rem;
    .calendar-title{
	    width: 8rem;
			text-align: right;
			margin-right: 0.5rem;
			font-size: 1.6rem;
			color: #9b9b9b;
			flex: 0 0 8rem;
    }
    .calendar-info{
      flex: auto;
			display: flex;
			align-items: center;
			font-size: 1.4rem;
    }
  }
}
</style>
