<template>
	<el-row class="timeview">
		<el-col :span="layout.left" class="timeview-left">
			<div class="line" v-if="isPhone">
				<span>
					<i class="el-icon-arrow-right" @click="open = !open" v-if="!open"></i>
					<i class="el-icon-arrow-left" @click="open = !open" v-else></i>
				</span>
			</div>
			<el-card class="timeview-card" shadow="never">
				<div slot="header" class="clearfix" v-if="open">
					<el-select v-model="taskTreeQuery.Type" placeholder="请选择" @change="handleSelectChange" class="timeview-select">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<div>
					<h5>筛选时间</h5>
					<el-date-picker v-model="taskTreeQuery.SDate" type="date" placeholder="开始时间" value-format="yyyy-MM-dd" :clearable="false" @change="handleSelectChange"></el-date-picker>
					<el-date-picker v-model="taskTreeQuery.EDate" type="date" placeholder="结束时间" value-format="yyyy-MM-dd" :clearable="false" @change="handleSelectChange" :picker-options="pickerOptions()"></el-date-picker>
				</div>
			</el-card>
		</el-col>
		<el-col :span="layout.right" class="timeview-right"><TimeLine v-model="tasks" @onTaskClick="handleTaskClick" /></el-col>
	</el-row>
</template>

<script>
import dayjs from 'dayjs';
import TimeLine from '@/components/TimeLine';

const defaultLayout = {
	left: 4,
	right: 20
};
export default {
	name: 'TaskTimeView',
	components: {
		TimeLine
	},
	data() {
		return {
			options: [
				{
					value: 1,
					label: '按部门成员查看'
				},
				{
					value: 2,
					label: '按部门项目查看'
				}
			],
			taskTreeQuery: {
				Type: 1,
				EventId: 0,
				SDate: dayjs()
					.subtract(3, 'day')
					.format('YYYY-MM-DD'),
				EDate: dayjs()
					.add(3, 'day')
					.format('YYYY-MM-DD')
			},
			tasks: [],
			layout: Object.assign({}, defaultLayout),
			open: true
		};
	},
	watch: {
		$route: {
			handler(newVal) {
				this.taskTreeQuery.EventId = newVal.params.eid;
				this.getData();
			},
			immediate: true
		},
		open(val) {
			if (val) {
				this.layout = {
					left: 20,
					right: 4
				};
			} else {
				this.layout = Object.assign({}, defaultLayout);
			}
		}
	},
	computed: {
		isPhone() {
			return /(nokia|iphone|android|ipad|motorola|^mot\-|softbank|foma|docomo|kddi|up\.browser|up\.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220)/i.test(
				window.navigator.userAgent
			);
		}
	},
	created() {
		if (this.isPhone) {
			this.open = false;
		}
	},
	methods: {
		pickerOptions() {
			let that = this;
			return {
				disabledDate(now) {
					return dayjs(now).isBefore(dayjs(that.taskTreeQuery.SDate));
				}
			};
		},
		handleTaskClick(data) {
			console.log(data);
		},
		handleSelectChange(value) {
			this.getData();
		},
		async getData() {
			const res = await this.$http.get('/Project/TaskTree.ashx', {
				params: this.taskTreeQuery
			});
			if (res.res == 0) {
				let tasksData,
					ReachData = [],
					UserData = [],
					EventData = [],
					JobData = [];
				if (Object.keys(res.data).length) {
					if (this.taskTreeQuery.Type == 1) {
						// 按部门成员
						ReachData = res.data.ReachData.map((r, rIdx) => {
							r.id = r.RId;
							r.UserData.map((u, uIdx) => {
								u.id = u.UsId + r.id * 100;
								u.parentId = r.id;
								u.EventData.map((e, eIdx) => {
									e.id = e.EId + u.id * 1000;
									e.parentId = u.id;
									e.JobData.map((j, jIdx) => {
										j.id = j.JId + e.id * 10000;
										j.parentId = e.id;
										JobData = JobData.concat(j);
										return j;
									});
									EventData = EventData.concat(e);
									delete e.JobData;
									return e;
								});
								UserData = UserData.concat(u);
								delete u.EventData;
								return u;
							});
							delete r.UserData;
							return r;
						});
					} else if (this.taskTreeQuery.Type == 2) {
						// 按部门项目
						ReachData = res.data.ReachData.map(r => {
							r.id = r.RId;
							r.EventData.map(e => {
								e.id = e.EId + r.id * 100;
								e.parentId = r.id;
								e.UserData.map(u => {
									u.id = u.UsId + e.id * 1000;
									u.parentId = e.id;
									u.JobData.map(j => {
										j.id = j.JId + u.id * 10000;
										j.parentId = u.id;
										JobData = JobData.concat(j);
										return j;
									});
									UserData = UserData.concat(u);
									delete u.JobData;
									return u;
								});
								EventData = EventData.concat(e);
								delete e.UserData;
								return e;
							});
							delete r.EventData;
							return r;
						});
					}
					tasksData = _.uniqWith([...ReachData, ...UserData, ...EventData, ...JobData], _.isEqual);
					this.tasks = tasksData.map(i => {
						let status = this.$D.ITEM('task_status', i.Status);
						return {
							RId: i.RId,
							UsId: i.UsId,
							EId: i.EId,
							JId: i.JId,
							id: i.id,
							label: i.Name,
							start: dayjs(i.StartTime).valueOf(),
							end: dayjs(i.EndTime).valueOf(),
							progress: i.Progress || 0,
							parentId: i.parentId || null,
							dependentOn: i.dependentOn || [],
							type: 'task',
							SpentTime: i.SpentTime + '小时',
							EstimatedTime: i.EstimatedTime + '小时',
							status: status.key || '',
							percent: i.Progress
						};
					});
				} else {
					this.tasks = [
						{
							id: 0,
							label: '此项目或时间段暂无视图',
							start: dayjs().format('YYYY-MM-DD'),
							end: dayjs().format('YYYY-MM-DD'),
							progress: 0,
							parentId: null,
							dependentOn: [],
							type: 'task',
							SpentTime: 0,
							EstimatedTime: 0,
							status: '',
							percent: 0
						}
					];
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
.timeview {
	height: 100%;
	.timeview-left {
		height: 99%;
		position: relative;
		.timeview-card {
			height: 100%;
			.el-card__header {
				height: 60px;
				padding: 10px 20px;
				text-align: left;
				.timeview-select {
					.el-input__inner {
						border: none;
					}
				}
			}
			.el-card__body {
				padding: 1rem;
				h5 {
					text-align: center;
				}
				// 筛选时间
				.el-date-editor.el-input,
				.el-date-editor.el-input__inner {
					width: initial;
					margin-top: 1rem;
				}
			}
		}
	}
	.timeview-right {
		height: 99%;
		overflow-y: scroll;
	}

	.line {
		&::before {
			content: '';
			display: inline-block;
			background: #1b9aed;
			width: 2px;
			height: 100%;
		}

		span {
			display: inline-block;
			background: #1b9aed;
			position: absolute;
			top: 300px;
			width: 17px;
			border-radius: 0 4px 4px 0;
			height: 30px;
			line-height: 30px;
			i {
				font-weight: bolder;
			}
		}

		color: #ffffff;
		height: 100%;
		position: absolute;
		right: 0px;
		z-index: 999;
	}
}
</style>
