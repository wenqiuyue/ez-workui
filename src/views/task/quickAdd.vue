<!-- 
	@Description:快速安排任务 
	@Author:zxg 
	@Params: 
	@Return: 
	@Date:2019-12-25
-->
<template>
	<XModel id="sendTask" isFixed ref="qucilkForm" :name="customeName" title="快速安排任务" cancelBtnText="取消" confirmBtnText="发布"
	 @onConfirm="confirm" :closeOnDimmer="false" @closed="closed">
		<el-form label-width="85px" class="add_form">
			<transition-group name="el-fade-in-linear">
				<div v-for="(item, index) in form" class="form_item" :key="index">
					<el-form-item label="任务类型" class="first-item">
						<el-radio v-for="item in $D.LIST('fast_job_type')" v-model="form[index].CtnType" :label="item.value" border>{{ item.name }}</el-radio>
						<el-button class="item-delete" type="danger" @click="delItem(index)"><i class="el-icon-delete"></i></el-button>
					</el-form-item>
					<el-form-item v-show="form[index].CtnType == 1" label="任务名称" required>
						<el-input v-model="form[index].title" placeholder="输入任务名"></el-input>
					</el-form-item>
					<el-form-item v-show="form[index].CtnType == 2" label="语音任务" required class="aduio-task">
						<XAudio @audioURL="getAudio($event, index)" :maxRecorderTime="300" :showPlayer="false" @click="setAudStat(index)"
						 v-show="form[index].Audio == null">
							<div slot class="custom-audio">
								<i class="hiFont hi-micro-o"></i>
								<p v-show="form[index].audStat">点击开始录制</p>
								<p v-show="!form[index].audStat">点击停止录制</p>
							</div>
						</XAudio>
						<XPlayer v-show="form[index].Audio != null" :file="{ link: form[index].Audio }" :duration="form[index].AudioSec"></XPlayer>
						<i v-show="form[index].Audio != null" class="el-icon-close" title="重新录制" @click.stop="clearAudio(index)"></i>
					</el-form-item>
					<el-form-item label="选择流程" required>
						<el-select v-model="form[index].ProcessId" @change="getProcess($event, index)" :loading="processLoad"
						 loading-text="正在加载流程">
							<el-option v-for="item in processList" :label="item.FormName" :value="item.FormID"></el-option>
							<el-option label="不使用流程" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<div class="item-line" style="justify-content: space-between;">
						<el-form-item label="关注人">
							<ms size="small" @Confirm="getAttention($event, index)" :showLength="1" :arrays="form[index].Attention"></ms>
						</el-form-item>
						<el-form-item>
							<el-button plain @click="setAtten(form[index])">{{ form[index].myAtt ? '取消自己为关注人' : '将自己设为关注人' }}</el-button>
						</el-form-item>
					</div>
					<!-- 使用流程 -->
					<el-steps direction="vertical" :active="-1" v-show="form[index].ProcessId != 0">
						<el-step v-for="(step, si) in form[index].Steps" :title="`${step.stepName}`" status="process">
							<div class="item-line" slot="description">
								<el-form-item label="接 收 人" required>
									<ms :isSelection="false" size="small" @Confirm="getReceiver($event, step)" :showActive="false">
										<div slot="button">
											<div v-if="step.user == null" class="mem-add"><i class="el-icon-plus"></i></div>
											<div v-else class="user-info">
												<img class="user-img" v-lazy="$url + step.user.Picture" />
												<p class="ttr-name">{{ step.user.UName }}</p>
											</div>
										</div>
									</ms>
								</el-form-item>
								<el-form-item label="预计">
									<el-input type="number" placeholder="小数" v-model="step.estimate" @input="check(step)"><span slot="suffix">小时</span></el-input>
								</el-form-item>
								<el-form-item label="优先级">
									<el-select v-model="step.priority">
										<el-option v-for="item in $D.LIST('g_priority')" :label="item.name" :value="item.value"></el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-step>
					</el-steps>
					<!-- 不使用流程 -->
					<div class="item-line" v-show="form[index].ProcessId == 0">
						<el-form-item label="接 收 人" required>
							<ms :isSelection="false" size="small" @Confirm="getReceiver($event, form[index].noStep)" :showActive="false">
								<div slot="button">
									<div v-if="form[index].noStep.user == null" class="mem-add"><i class="el-icon-plus"></i></div>
									<div v-else class="user-info">
										<img class="user-img" v-lazy="$url + form[index].noStep.user.Picture" />
										<p class="ttr-name">{{ form[index].noStep.user.UName }}</p>
									</div>
								</div>
							</ms>
						</el-form-item>
						<el-form-item label="预计">
							<el-input type="number" placeholder="小数" v-model="form[index].noStep.estimate" @input="check(form[index].noStep)">
								<span slot="suffix">小时</span>
							</el-input>
						</el-form-item>
						<el-form-item label="优先级">
							<el-select v-model="form[index].noStep.priority">
								<el-option v-for="item in $D.LIST('g_priority')" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="item-line">
						<el-form-item label="任务描述">
							<XFroala ref="editorDes" v-model="form[index].casts" placeholder="请输入任务的具体内容" :sShot="false"></XFroala>
						</el-form-item>
					</div>



				</div>
			</transition-group>
			<div class="add" @click="addItem">
				<i class="el-icon-plus"></i>
				<p>添加一条任务</p>
			</div>
		</el-form>
	</XModel>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			customeName: {
				type: String,
				default: 'sendTask'
			}
		},
		components: {
			XModel: () => import('@/components/XModal'),
			ms: () => import('@/components/Selectors/MemberSelect'),
			XAudio: () => import('@/components/Audio/H5'),
			XPlayer: () => import('@/components/Audio/player'),
			XFroala: () => import("@/components/XFroala")
		},
		data() {
			return {
				form: [
					//表单
					{
						CtnType: 1,
						ProcessId: 0,
						ProcessName: '不使用流程',
						title: null,
						Audio: null,
						AudioSec: null,
						Steps: [],
						audStat: true,
						noStep: {
							user: null,
							receiver: null,
							priority: 1,
							estimate: null
						},
						Attention: [],
						myAtt: false //自己关注任务
					}
				],
				step: {
					user: null,
					receiver: null,
					priority: 1,
					estimate: null
				},
				processList: [],
				processLoad: true
			};
		},
		computed: {
			...mapState(['user'])
		},
		created() {
			this.getProcessList();
		},
		methods: {
			async getProcessList() {
				try {
					let res = await this.$http.post('/Work/Process/GetProcessTaskOption.ashx');
					if (res.res == 0) {
						this.processList = res.data;
						this.processLoad = false;
					}
				} catch (e) {
					console.log(`获取任务流程出错${e}`);
				}
			},
			setAudStat(index) {
				this.form[index].audStat = !this.form[index].audStat;
			},
			//获取流程长度
			getProcess(value, index) {
				// if (stepSize > value) {
				// 	let temp = [];
				// 	for (let i = 0; i < value; i++) {
				// 		temp.push(this.form[index].Steps[i]);
				// 	}
				// 	this.form[index].Steps = temp;
				// } else {
				// 	for (let i = 0; i < value - stepSize; i++) {
				// 		this.form[index].Steps.push(this.$options.data().step);
				// 	}
				// }
				if (value == 0) {
					this.form[index].ProcessName = '不使用流程';
					return;
				}
				for (let item of this.processList) {
					if (item.FormID == value) {
						this.form[index].ProcessName = item.FormName;
						// const current = this.form[index].Steps.length;
						const total = item.Steps.length;
						this.form[index].Steps = [];
						for (let i = 0; i < total; i++) {
							let params = Object.assign({
									stepId: item.Steps[i].stepID, //步骤ID
									stepName: item.Steps[i].stepName, //步骤名称
									auditType: item.Steps[i].auditIDType, //审核人类型
									role: item.Steps[i].RoleId, //审核角色ID
									dept: item.Steps[i].DeptId, //审核部门ID
									auditor: item.Steps[i].auditorID, ///审核人ID
									lastSteps: item.Steps[i].stepLastName ///审核人ID
								},
								this.$options.data().step
							);
							this.form[index].Steps.push(params);
						}
					}
				}
			},
			clearAudio(index) {
				this.form[index].Audio = null;
				this.form[index].AudioSec = null;
			},
			//获取录音文件地址
			getAudio(result, index) {
				this.form[index].Audio = result.url.link;
				this.form[index].AudioSec = result.duration;
			},
			//提交
			confirm() {
				this.$refs.qucilkForm.loadBtn(true);
				let form = [];
				for (let i = 0; i < this.form.length; i++) {
					let currentObj = JSON.parse(JSON.stringify(this.form[i]));
					//类型
					if (currentObj.CtnType == 1) {
						let name = _.trim(currentObj.title);
						if (name) {
							delete currentObj.Audio;
							delete currentObj.AudioSec;
						} else {
							this.$notify({
								type: 'error',
								message: `第${i + 1}个任务没有填写任务名`
							});
							this.$refs.qucilkForm.loadBtn(false);
							return;
						}
					} else if (currentObj.CtnType == 2) {
						if (currentObj.Audio) {
							delete currentObj.title;
						} else {
							this.$notify({
								type: 'error',
								message: `第${i + 1}个任务没有输入语音`
							});
							this.$refs.qucilkForm.loadBtn(false);
							return;
						}
					}
					//接收人
					if (currentObj.ProcessId == 0) {
						if (currentObj.noStep.user == null) {
							this.$notify({
								type: 'error',
								message: `第${i + 1}个任务没有设置接收人`
							});
							this.$refs.qucilkForm.loadBtn(false);
							return;
						} else {
							currentObj.noStep.receiver = currentObj.noStep.user.UId;
							delete currentObj.noStep.user;
							currentObj.Steps.push(currentObj.noStep);
							delete currentObj.noStep;
						}
					} else {
						//流程
						delete currentObj.noStep;
						let flag = true;
						for (let j = 0; j < currentObj.Steps.length && flag; j++) {
							if (currentObj.Steps[j].user == null) {
								this.$notify({
									type: 'error',
									message: `第${i + 1}个任务的步骤${j + 1}没有设置接收人`
								});
								flag = false;
							} else {
								currentObj.Steps[j].receiver = currentObj.Steps[j].user.UId;
								delete currentObj.Steps[j].user;
							}
						}
						if (!flag) {
							this.$refs.qucilkForm.loadBtn(false);
							return;
						}
					}
					//关注人
					currentObj.Attention = currentObj.Attention.map(user => {
						return user.UId;
					}).join(',');
					delete currentObj.myAtt;
					delete currentObj.audStat;
					form.push(currentObj);
				}
				this.$http
					.post('/Project/fastJobAdd.ashx', {
						fastJob: form
					})
					.then(resp => {
						this.$refs.qucilkForm.loadBtn(false);
						if (resp.res == 0) {
							this.$notify({
								message: resp.msg,
								type: 'success'
							});
							this.$modal.hide(this.customeName);
						}
					})
					.catch(err => {
						this.$refs.qucilkForm.loadBtn(false);
					});
			},
			closed() {
				this.form = [Object.assign({}, this.$options.data().form)];
				Object.assign(this.$data.step, this.$options.data().step);
			},
			//增加一个
			addItem() {
				this.form.push(this.$options.data().form[0]);
			},
			//删除一个
			delItem(index) {
				this.form.splice(index, 1);
			},
			//检查数字
			check(step) {
				if (step.estimate < 0) {
					step.estimate = null;
				}
			},
			//获取接收人
			getReceiver(arrays, step) {
				if (arrays.length) {
					step.user = arrays[0];
				} else {
					step.user = null;
				}
			},
			//获取关注人
			getAttention(arrays, index) {
				this.form[index].Attention = arrays;
			},
			setAtten(obj) {
				obj.myAtt = !obj.myAtt;
				if (obj.myAtt) {
					obj.Attention.push({
						UId: this.user.id,
						UName: this.user.name,
						Picture: this.user.Picture
					});
				} else {
					obj.Attention = obj.Attention.map(item => {
						if (item && item.UId != this.user.id) {
							return item;
						}
					});
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.add_form {
		padding: 0 1.5rem 2rem 1.5rem;
		position: relative;
		border-top: 0.1rem solid #eee;

		//语音任务
		.aduio-task {
			/deep/.el-form-item__content {
				position: relative;
			}

			.el-icon-close {
				position: absolute;
				right: 1rem;
				top: 1rem;
				font-size: 2rem;
				cursor: pointer;

				&:hover {
					color: #f56c6c;
				}
			}

			//播放
			#player {
				display: flex;
				height: 3rem;
				justify-content: center;
				align-items: center;
				background: #ffffff;
				border: 1px solid #cccccc;
			}

			//语音
			#recorder {
				justify-content: flex-start;

				/deep/.record {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					border: 1px solid #cccccc;
					border-radius: 4px;
					cursor: pointer;
					margin-right: 0px !important;

					.custom-audio {
						display: flex;

						i {
							font-size: 2rem;
						}
					}

					.record-tip {
						margin-left: 1rem;
					}
				}
			}
		}

		//单个
		.form_item {
			margin: 1rem 0 1rem 0;
			border-bottom: 0.1rem solid #eee;

			/deep/.el-select {
				width: 100%;
			}

			/deep/.first-item {
				.el-radio.is-bordered {
					margin-right: 12px;
				}
			}

			//步骤条
			/deep/.el-step .el-step__description {
				padding-right: 0;
			}

			//删除
			.item-delete {
				float: right;
				font-size: 20px;
				padding: 9px 31px;
				margin-left: 10px;
			}

			.item-line {
				display: flex;

				.user-info {
					display: flex;
					flex-direction: column;

					.user-img {
						width: 3.4rem;
						height: 3.4rem;
						border-radius: 50%;
					}

					.ttr-name {
						color: #6d6d6d;
						white-space: nowrap;
						line-height: 1;
						margin-top: 0.5rem;
						width: 4.4rem;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}

		//第一个不显示删除按钮
		.form_item:first-child {
			.item-delete {
				display: none !important;
			}
		}

		//添加
		.add {
			position: absolute;
			right: 1.5rem;
			bottom: 0.6rem;
			color: rgba(68, 142, 245, 1);
			cursor: pointer;
			display: flex;
			font-size: 1.4rem;
			font-weight: bold;

			i {
				font-weight: bold;
				line-height: 1.5rem;
				margin-right: 0.5rem;
				font-size: 1.5rem;
			}
		}
	}

	@media screen and (max-width: 1024px) {
		.add_form {

			//单个
			.form_item {
				.first-item .el-radio.is-bordered {
					margin-right: 5px;
				}

				.item-delete {
					padding: 8px 15px;
				}

				.item-line {
					display: inline-block !important;
					width: 100%;

					&> :first-child,
					&> :last-child {
						/deep/.el-date-editor.el-input {
							width: 100% !important;
						}
					}
				}
			}
		}
	}
</style>
