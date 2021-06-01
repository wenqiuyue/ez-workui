<template>
	<div>
		<XM ref="xmodal" isFixed :closeOnDimmer="false" title="添加考核" :name="customName" confirmBtnText="确认" cancelBtnText="取消"
		 @onConfirm="hConfirm" @closed="closed" @beforeOpen="beforeOpen">
			<el-form id="assessment" :model="formData" :rules="rules" ref="addForm" label-width="100px">
				<el-form-item class="form-line-item" label="人 员:" prop="UsId">
					<el-input style="display: none;" v-model="formData.UsId"></el-input>
					<MS @Confirm="getMS" size="small" :selRange="1" :readonly="memberFixed" :arrays="defaultMan" :isSelection="!memberFixed"></MS>
				</el-form-item>
				<el-form-item class="form-line-item" label="KPI项:" prop="KId">
					<el-select @change="setScore" :disabled="remote" v-model="formData.KId" filterable clearable placeholder="请选择"
					 style="width: 100%;">
						<el-option v-for="item in selects" :label="item.Name" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<transition name="showType">
					<el-form-item label="类 型:" v-show="formData.KId" prop="IsAdd">{{ typeName }}</el-form-item>
				</transition>
				<el-form-item :label="isAddType == 1 ? '分 值:' : '金 额:'" prop="Score">
					<el-input type="number" v-model="formData.Score"></el-input>
				</el-form-item>
				<el-form-item class="form-line-item" label="审阅人:" required>
					<el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
						<el-option label="将我设为审阅人" :value="1"></el-option>
						<el-option label="将成员直系上属设为审阅人" :value="2"></el-option>
						<el-option label="KPI默认审阅人" :value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="理 由:" prop="Content">
					<el-input style="display: none;" v-model="formData.Content"></el-input>
					<XFroala v-model="formData.Content" :showToolbar="false" placeholder="请输入理由" :height="110" :maxHeight="110"></XFroala>
				</el-form-item>
				<el-form-item label=" URL:">
					<el-input v-model="formData.refUrl" placeholder="平台URL" clearable></el-input>
				</el-form-item>
				<el-form-item label="可申诉:">
					<el-radio-group v-model="formData.IsComplaint">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="延迟添加:">
					<el-radio-group v-model="formData.IsDelay">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
					<!-- 	<div>
						<el-radio-group v-model="formData.IsDelay">
							<el-radio :label="true">是</el-radio>
							<el-radio :label="false">否</el-radio>
						</el-radio-group>
						<el-tag v-if="formData.IsDelay" type="primary" style="margin-left: 30px;cursor: pointer;" @click="()=>{$modal.show('addKpiTask')}">添加任务</el-tag>
					</div> -->
				</el-form-item>
				<el-form-item label="延迟时间:" v-if="formData.IsDelay" prop="EndTime" :rules="{required:true,message:'必填项'}">
					<el-input v-model="formData.EndTime" placeholder="成员需在该时间内完成任务">
						<template slot="append">小时</template>
					</el-input>
				</el-form-item>
				<!-- 		<el-form-item label="选择项目:" v-if="formData.IsDelay" prop="ProjectId" :rules="{required:true,message:'请选择延迟任务所属项目'}">
				  <selPro :isRadio="true" @getList="getProject"></selPro>
				</el-form-item> -->

			</el-form>


		</XM>
		<addTask customName="addKpiTask" :frontman="frontman" :isHome="true"></addTask>
	</div>
</template>

<script>
	export default {
		components: {
			XM: () => import('@/components/XModal'),
			MS: () => import('@/components/Selectors/MemberSelect'),
			XFroala: () => import('@/components/XFroala'),
			addTask: () => import('@/views/task/addTask'),
			selPro: () => import('@/components/Selectors/selPro')

		},
		data() {
			return {
				formData: {
					UsId: null,
					Content: '',
					KId: '',
					type: 2,
					Score: null,
					refUrl: window.location + '',
					// refUrl:window.location.pathname,
					IsComplaint: true,
					IsAdd: null,
					IsDelay: false,
					EndTime: null,
					ProjectId: null
				},
				rules: {
					UsId: [{
						required: true,
						message: '请选择人员',
						trigger: 'blur'
					}],
					KId: [{
						required: true,
						message: '请选择KPI项',
						trigger: 'blur'
					}],
					Score: [{
						required: true,
						message: '必填项',
						trigger: 'blur'
					}]
				},
				selects: [],
				remote: true,
				isAddType: 1,
				typeName: null,
				frontman: {}
			};
		},
		props: {
			customName: {
				type: String,
				default: 'assessment'
			},
			memberFixed: {
				type: Boolean,
				default: false
			},
			defaultMan: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		methods: {
			getProject(arr) {
				if (arr.length) {
					this.formData.ProjectId = arr[0].proId
				} else {
					this.formData.ProjectId = null
				}
			},
			//下拉改变
			setScore(val) {
				for (let i of this.selects) {
					if (i.Id == val) {
						this.formData.Score = i.Score;
						this.isAddType = parseInt(i.IsAdd) > 2 ? 2 : 1;
						if (i.IsAdd == 1) {
							this.typeName = '加分';

						} else if (i.IsAdd == 2) {
							this.typeName = '减分';
						} else if (i.IsAdd == 3) {
							this.typeName = '奖励';
						} else if (i.IsAdd == 4) {
							this.typeName = '罚款';
						}
						this.formData.IsAdd = i.IsAdd
						return;
					}
				}
				this.formData.Score = null;
			},
			//提交
			hConfirm() {
				this.$refs.addForm.validate(valid => {
					if (valid) {
						this.$refs.xmodal.loadBtn(true);
						this.$http.post('/Work/Performance/addUserKPI.ashx', this.formData).then(resp => {
							if (resp.res == 0) {
								this.$notify({
									message: '添加成功',
									type: 'success'
								});
								this.$modal.hide(this.customName);
							}
							this.$refs.xmodal.loadBtn(false);
						});
					}
				});
			},
			//关闭后
			closed() {
				Object.assign(this.$data, this.$options.data());
			},
			//获取人员
			getMS(user) {
				// console.log(user)
				if (user.length) {
					this.frontman = user[0]
				} else {
					this.frontman = {}
				}
				this.remote = true;
				if (user.length == 0) {
					this.formData.UsId = [];
					this.formData.Score = null;
					this.selects = [];
				} else {
					let arr = [];
					user.forEach(item => {
						arr.push(item.UId);
					});
					this.formData.UsId = JSON.stringify(arr);
					this.$http
						.post('/Work/Performance/userKPISelect.ashx', {
							UsId: arr,
							Type: 1
						})
						.then(resp => {
							if (resp.res == 0) {
								this.remote = false;
								this.selects = resp.data;
							}
						});
				}
			},
			beforeOpen() {
				if (this.defaultMan.length) {
					let arr = [];
					this.defaultMan.forEach(item => {
						arr.push(item.UId);
					});
					this.formData.UsId = JSON.stringify(arr);
					this.$http
						.post('/Work/Performance/userKPISelect.ashx', {
							UsId: arr,
							Type: 1
						})
						.then(resp => {
							if (resp.res == 0) {
								this.remote = false;
								this.selects = resp.data;
							}
						});
				}
			}
		},
		created() {
			this.$E.$on('upChildTask', obj => {
				// if (obj.isChildren && this.user.id == obj.frontmanID) {
				// 	this.getList();
				// }
			});
		}
	};
</script>

<style lang="less" scoped>
	.showType-enter-active,
	.showType-leave-active {
		transition: all 0.5s;
	}

	.showType-enter,
	.showType-leave-to {
		opacity: 0;
		transform: translateX(-50%);
	}

	#assessment {
		padding: 0 1rem 0 0;
		overflow-x: hidden;

		/deep/ .fr-toolbar {
			display: none;
		}

		/deep/.fr-box.fr-basic .fr-element {
			border-top: 1px solid #ddd;
		}

		/deep/.sel-tags {
			.el-tag {
				margin-bottom: 0;
			}
		}
	}
</style>
