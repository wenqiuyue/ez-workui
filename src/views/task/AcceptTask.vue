<template>
	<!-- 接收任务弹窗 -->
	<XModal isFixed :name="customName" title="任务详情" cancelBtnText="关闭" @beforeOpen="beforeOpen" id="accept-task">
		<template v-if="pageData != null">
			<el-form label-width="100px" class="custom-from" v-loading="loading">
				<el-form-item label="任务名" v-if="pageData.CtnType == 1">{{ pageData.JobName }}</el-form-item>
				<el-form-item label="语音任务" v-else-if="pageData.CtnType == 2"><player :file="{ link: pageData.JobName }" :duration="pageData.AudioSec"></player></el-form-item>
				<div class="item-line">
					<el-form-item label="下发时间">{{ pageData.AddTime ? pageData.AddTime.timeFormat('yyyy-MM-dd') : '暂无时间' }}</el-form-item>
					<el-form-item label="内容类型">{{ $D.ITEM('fast_job_type', pageData.CtnType).name }}</el-form-item>
				</div>
				<div class="item-line">
					<el-form-item label="创建者">
						<div v-if="pageData.Creator" class="people">
							<img v-lazy="$url + pageData.Creator.Picture" />
							<p>{{ pageData.Creator.Name }}</p>
						</div>
					</el-form-item>
					<!-- <el-form-item label="接收状态">{{ $D.ITEM('fast_job_status', pageData.Status).name }}</el-form-item> -->
				</div>
				<div class="step">
					<el-timeline>
						<el-timeline-item
							v-for="(step, si) in pageData.Steps"
							:timestamp="pageData.ProcessId != null ? `${stepStatu(step, si).name + step.Name}` : '接收详情'"
							placement="top"
							:class="{ ing: stepStatu(step, si).cuttenting }"
						>
							<el-card :class="{ over: stepStatu(step, si).name === '（已经过）' }">
								<div class="priority" :style="{ background: $D.ITEM('g_priority', step.Priority).color[0] }"></div>
								<div class="item-line">
									<el-form-item label="接 收 人">
										<div class="people">
											<img v-lazy="$url + step.Recipient.Picture" />
											<p>{{ step.Recipient.Name }}</p>
										</div>
									</el-form-item>
									<el-form-item label="任务状态">
										<template v-if="step.Status == 1">
											<p class="status" style="color: rgb(155, 155, 155); background-color: rgb(242, 242, 242);">未接收</p>
										</template>
										<template v-if="step.Status == 2">
											<p v-if="step.AuditStatus == null" class="status" style="color: rgb(68, 142, 245);background-color: rgb(236, 243, 254);">已接收</p>
											<p v-else-if="step.AuditStatus == 2" class="status" style="color: rgb(255, 169, 64);background-color: rgb(254, 247, 236);">审核中</p>
											<p v-else-if="step.AuditStatus == 3" class="status" style="color: rgb(252, 76, 77);background-color: rgb(254, 238, 238);">被驳回</p>
											<p v-else-if="step.AuditStatus == 4" class="status" style="color: #67C23A;background-color: rgb(240, 249, 235);">已通过</p>
										</template>
									</el-form-item>
								</div>
								<div class="item-line">
									<el-form-item label="预计耗时">{{ step.EstimatedTime ? `${step.EstimatedTime}小时` : '未填写' }}</el-form-item>
									<el-form-item label="接收时间">{{ pageData.ReceiveTime ? pageData.ReceiveTime.timeFormat('yyyy-MM-dd') : '' }}</el-form-item>
								</div>
								<div class="accept-btn" v-if="step.Recipient.UsId == user.id && step.Status == 1">
									<p @click="showChild(step.StepId, si)">
										<i class="hiFont hi-receive"></i>
										接收
									</p>
								</div>
								<div v-else-if="step.Status == 2" class="accept-btn">
									<p @click="showTask(step)">
										<i class="hiFont hi-task"></i>
										查看
									</p>
								</div>
							</el-card>
						</el-timeline-item>
					</el-timeline>
				</div>
			</el-form>
			<XModal
				ref="xml"
				:name="customName + 'box'"
				title="接收任务"
				:closeOnDimmer="false"
				cancelBtnText="取消"
				confirmBtnText="确认"
				@closed="closed"
				@onConfirm="onConfirm"
				id="accept-child"
			>
				<div class="tabs">
					<ul>
						<li @click="handleClick(1)" :class="{ tab_active: form.tabId == 1 }">创建新的任务</li>
						<li @click="handleClick(2)" :class="{ tab_active: form.tabId == 2 }">选择已有任务</li>
						<!-- <li @click="handleClick(3)" :class="{ tab_active: form.tabId == 3 }">拒收此任务</li> -->
					</ul>
					<div class="tab-item" v-show="form.tabId == 1">
						<el-form :model="form.newTask" :rules="rules" ref="firstform" label-width="100px">
							<el-form-item label="任务名称:" prop="first"><el-input v-model="form.newTask.first" placeholder="输入新的任务名称"></el-input></el-form-item>
							<el-form-item label="所属项目:" prop="second">
								<el-select v-model="form.newTask.second" placeholder="选择项目或搜索" filterable>
									<el-option v-for="item in firstOptions" :label="item.proName" :value="item.proId"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</div>
					<div class="tab-item" v-show="form.tabId == 2">
						<el-form :model="form" :rules="rules" ref="secondform">
							<el-form-item prop="taskObj">
								<div class="tab-item-seltask" @click="openSelTask" v-if="form.taskObj == null">
									<i class="el-icon-plus"></i>
									<span>添加</span>
								</div>
								<div class="tab-item-show-task" v-else>
									<i
										:class="['hiFont', $D.ITEM('task_status', form.taskObj.Schedule).icon]"
										:style="{
											color: $D.ITEM('task_status', form.taskObj.Schedule).color
										}"
									></i>
									<p>{{ form.taskObj.Name }}</p>
									<div @click="openSelTask">重新选择</div>
								</div>
							</el-form-item>
							<el-form-item class="tab-item-button">
								<div class="tab-item-b">
									<el-radio v-model="form.haveTask.second" label="1">以选中的任务的优先级为准</el-radio>
									<el-radio v-model="form.haveTask.second" label="2">以任务安排的优先级为准</el-radio>
								</div>
								<div class="tab-item-b">
									<el-checkbox v-model="form.haveTask.isSubtasks">创建成选中任务的子任务</el-checkbox>
									<el-form-item v-if="form.haveTask.isSubtasks" label="名称:" prop="subName">
										<el-input v-model="form.newTask.subName" placeholder="输入新的任务名称"></el-input>
									</el-form-item>
								</div>
							</el-form-item>
						</el-form>
					</div>
					<div class="tab-item" v-show="form.tabId == 3"><p style="padding: 15px 0;text-align: center;">点击确认即可拒收任务</p></div>
				</div>
			</XModal>
		</template>
		<template v-else>
			<div class="empty">
				<img src="@/assets/img/emptyTask.png" />
				<p>该任务不存在或无权查看</p>
			</div>
		</template>
		<!-- 任务选择器 -->
		<sel-task @getTaskList="getCheckList" :userID="user.id"></sel-task>
	</XModal>
</template>

<script>
import { mapState } from 'vuex';
export default {
	components: {
		SelTask: () => import('@/components/Selectors/selTask'),
		XModal: () => import('@/components/XModal'),
		player: () => import('@/components/Audio/player')
	},
	props: {
		customName: {
			type: String,
			default: 'acceptJob'
		},
		Jid: {
			type: Number,
			default: null
		},
		kid:{
			type:Number,
			default:null
		}
	},
	computed: {
		...mapState(['user'])
	},
	data() {
		return {
			form: {
				tabId: 1,
				taskObj: null, //所选任务
				//新的任务
				newTask: {
					tabId: 1,
					fastJobId: '', //要接收任务的id
					stepId: null,
					first: '',
					second: ''
				},
				//选择任务
				haveTask: {
					tabId: 2,
					fastJobId: '',
					stepId: null,
					first: '',
					second: '1',
					isSubtasks: false,
					subName: null
				}
			},
			//表单验证
			rules: {
				subName: [
					{
						required: true,
						message: '请输入任务名称',
						trigger: 'blur'
					}
				],
				first: [
					{
						required: true,
						message: '请输入任务名称',
						trigger: 'blur'
					}
				],
				second: [
					{
						required: true,
						message: '请选择项目',
						trigger: 'change'
					}
				],
				taskObj: [
					{
						required: true,
						message: '请选择任务',
						trigger: 'change'
					}
				]
			},
			firstOptions: [], //项目列表
			loading: false,
			pageData: {},
			currentTask: null
		};
	},
	methods: {
		showTask(step) {
			this.$emit('showTask', step.Job);
		},
		//接受
		showChild(stepId, index) {
			this.$modal.show(this.customName + 'box');
			this.form.haveTask.stepId = this.form.newTask.stepId = stepId;
			this.currentTask = index;
		},
		stepStatu(step, index) {
			let obj = {
				name: '',
				cuttenting: false
			};
			if (step.Status == 1) {
				obj.name = '（未开始）';
			} else if (step.Status == 2) {
				if (step.AuditStatus == null && index == 0) {
					obj.name = '（进行中）';
					obj.cuttenting = true;
				} else {
					if (step.AuditStatus == 3 || step.AuditStatus == 4) {
						obj.name = '（已经过）';
					} else if (index > 0 && (step.AuditStatus == 2 || this.pageData.Steps[index - 1].AuditStatus == 3 || this.pageData.Steps[index - 1].AuditStatus == 4)) {
						obj.name = '（进行中）';
						obj.cuttenting = true;
					} else if (step.AuditStatus == null) {
						obj.name = '（未开始）';
					}
				}
			}
			return obj;
		},
		//打开任务选择器
		openSelTask() {
			this.$modal.show('chooseTask');
		},
		//切换选项卡
		handleClick(tabid) {
			if (this.form.tabId != tabid) {
				this.form.tabId = tabid;
			}
		},
		//获取任务选择器返回数据
		getCheckList(task) {
			if (task.length) {
				this.form.taskObj = task[0];
				this.form.haveTask.first = this.form.taskObj.JId;
			} else {
				this.form.taskObj = null;
				this.form.haveTask.first = '';
			}
		},
		//弹窗关闭事件
		closed() {
			Object.assign(this.$data.form, this.$options.data().form);
		},
		beforeOpen() {
			this.$nextTick(async () => {
				this.loading = true;
				let resp = await this.$http.get('/Project/fastJobDetail.ashx', { params: { fastJobId: this.Jid } });
				if (resp.res == 0) {
					this.pageData = resp.data;
					this.form.KPIId=this.pageData.KPIId
					this.loading = false;
				}
			});
		},
		//弹窗取消按钮
		onConfirm() {
			let Promise = null;
			if (this.form.tabId == 1) {
				this.$refs['firstform'].validate(valid => {
					if (valid) {
						this.$refs.xml.loadBtn(true);
						this.form.newTask.fastJobId = this.Jid;
						this.form.newTask.KPIId=this.form.KPIId
						Promise = this.$http.post('/Project/taskReceive.ashx', this.form.newTask);
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			} else if (this.form.tabId == 2) {
				this.$refs['secondform'].validate(valid => {
					if (valid) {
						this.$refs.xml.loadBtn(true);
						this.form.haveTask.fastJobId = this.Jid;
						this.form.haveTask.KPIId=this.form.KPIId
						Promise = this.$http.post('/Project/taskReceive.ashx', this.form.haveTask);
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			} else {
				this.$refs.xml.loadBtn(true);
				Promise = this.$http.post('/Project/taskReceive.ashx', {
					tabId: 3,
					fastJobId: this.Jid
				});
			}
			if (Promise) {
				Promise.then(async resp => {
					if (resp.res == 0) {
						this.$emit('success', this.form.tabId);
						this.$modal.hide(this.customName + 'box');
						this.$notify({
							message: resp.msg,
							type: 'success'
						});
						this.pageData.Steps[this.currentTask].Status = 2;
						this.pageData.Steps[this.currentTask].Job = {
							JId: resp.data.jid,
							EventId: resp.data.eid
						};
					}
					this.$refs.xml.loadBtn(false);
				});
			}
		},
		//获取项目
		getPros() {
			this.$http
				.post('/General/GetProjectSelector.ashx', {
					CurrentPage: 1,
					PageCount: 100,
					qxcs: 1
				})
				.then(resp => {
					if (resp.res == 0) {
						this.firstOptions = resp.data.message;
					}
				});
		}
	},
	created() {
		this.getPros();
	}
};
</script>

<style lang="less">
#accept-task {
	.empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		p {
			text-align: center;
			font-size: 1.8rem;
			color: #aaa;
			padding: 1rem 0;
		}
	}
	.custom-from {
		margin-bottom: 20px;
		border-bottom: 1px solid #eee;
		.el-form-item {
			margin-bottom: 0px;
		}
		.step {
			padding: 0 20px;
			margin-top: 10px;
			.ing {
				.el-timeline-item__timestamp.is-top {
					color: #448ef5;
					font-weight: bold;
				}
				.el-timeline-item__node {
					background-color: rgb(103, 194, 58);
				}
			}
			.el-card__body {
				padding: 0;
			}
			.over {
				box-shadow: none;
				border: none;
				background: #f2f2f2;
				opacity: 0.6;
			}
			.el-card {
				position: relative;
				.el-card__body {
					& > :nth-of-type(2) {
						padding-top: 15px;
						@media all and (max-width:1024px){
							padding-top: 5px;
						}
					}
					& > .item-line {
						margin-bottom: 10px;
						@media all and (max-width:1024px){
							margin-bottom:0px;
						}
					}
				}

				.priority {
					position: absolute;
					left: -0.05rem;
					border-radius: 0.4rem 0 0 0.4rem;
					width: 7px;
					height: 100%;
				}
				.accept-btn {
					position: absolute;
					right: 10px;
					top: 0;
					margin: 20px 0;
					border-left: 1px solid #cccccc;
					height: calc(100% - 40px);
					padding-left: 10px;
					display: flex;
					align-items: center;
					justify-content: center;
					@media all and (max-width:1024px){
						padding-left: 20px;
						right: 20px;
					}
					p {
						cursor: pointer;
						color: #409eff;
						font-size: 12px;
						@media all and (max-width:1024px){
							font-size: 16px;
						}
						i {
							display: block;
							text-align: center;
						}
					}
				}
			}
		}
		.item-line {
			display: flex;
			@media all and (max-width:1024px){
				display: block;
			}
			& > :first-child,
			& > :last-child {
				flex: 1;

				.el-date-editor.el-input {
					width: initial;
				}
			}
			.people {
				display: flex;
				align-items: center;
				img {
					height: 3rem;
					width: 3rem;
					border-radius: 50%;
					margin-right: 0.5rem;
				}
				p {
					max-width: 130px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.status {
				display: inline-block;
				font-size: 12px;
				border-radius: 4px;
				padding: 0;
				line-height: 1;
				text-align: center;
				padding: 9px;
			}
		}
	}
}
#accept-child {
	.tabs {
		padding: 0 20px;
		ul {
			display: flex;
			justify-content: space-around;
			font-size: 1.6rem;
			font-weight: 500;
			color: rgba(109, 109, 109, 1);

			li {
				cursor: pointer;
				user-select: none;
			}
		}

		.tab-item {
			margin-top: 2rem;
			padding: 0 2rem;
			.el-input__inner,
			.el-input {
				width: 100%;
			}

			.el-select {
				display: block;
			}

			.tab-item-seltask,
			.tab-item-show-task {
				height: 5rem;
				border: 0.1rem solid rgba(199, 195, 195, 1);
				border-radius: 6px;
				display: flex;
				align-items: center;
			}

			.tab-item-seltask {
				justify-content: center;
				color: rgba(199, 195, 195, 1);
				cursor: pointer;

				i {
					font-size: 2rem;
					border: 1px solid rgba(199, 195, 195, 1);
					border-radius: 50%;
					padding: 0.4rem;
				}

				span {
					font-size: 1.6rem;
					margin-left: 0.5rem;
				}
			}

			.tab-item-show-task {
				border-right: none;
				.hiFont {
					font-size: 2.5rem;
					margin-left: 1.7rem;
				}

				p {
					flex: auto;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-left: 0.8rem;
					font-size: 2rem;
					font-weight: bold;
					color: rgba(74, 74, 74, 1);
				}

				div {
					flex: 0 0 8rem;
					line-height: 5rem;
					cursor: pointer;
					text-align: center;
					background: rgba(68, 142, 245, 0.49);
					border: 0.1rem solid rgb(163, 200, 250);
					border-radius: 0px 6px 6px 0px;
					font-size: 1.6rem;
					font-weight: 600;
					color: rgba(255, 255, 255, 1);
				}
			}
			.tab-item-button {
				margin: 2rem 0;
				.el-form-item__content {
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}

	.tab_active {
		font-weight: bold;
		color: rgba(68, 142, 245, 1);

		&:after {
			content: '';
			display: block;
			position: relative;
			background: #000000;
			width: 100%;
			top: 5px;
			height: 2px;
			background: rgba(68, 142, 245, 1);
			border-radius: 2px;
		}
	}
}
@media screen and (max-width: 991px) {
	#accept-child .tabs .tab-item .tab-item-button {
		margin: 1rem 0;
		text-align: center;
	}
	#accept-child .tabs .tab-item .tab-item-button .el-form-item__content {
		display: block;
		line-height: 30px;
		.el-radio {
			margin-right: 0;
		}
	}
}
</style>
