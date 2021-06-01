<template>
	<XModal ref="delayKpi" id="add-Kpi" name="delayKpi" title="添加延迟KPI" cancelBtnText="取消" confirmBtnText="确认" @onConfirm="confirm"
	 @beforeOpen="init" width="800px" height="620px">
		<el-form :model="form" :rules="rule" ref="form">
			<el-form-item label="KPI类型" label-width="80px" prop="kpiId">
				<el-select v-model="form.kpiId">
					<el-option v-for="(item,index) in kpiList" :label="item.Name" :value="item.Id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型" label-width="80px" prop="score" v-if="form.isAdd">
				{{$D.ITEM('kpi_rp_type',form.isAdd).name}}
			</el-form-item>
			<el-form-item label="分值" label-width="80px" prop="score">
				<el-input v-model="form.score"></el-input>
			</el-form-item>
			<el-form-item label="截止时间" label-width="80px" prop="score">
				<el-input v-model="form.endTime" placeholder="成员需在该时间内完成任务">
					<template slot="append">小时</template>
				</el-input>
			</el-form-item>
			<el-form-item label="留言" label-width="80px">
				<el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="form.leaveMessage">
				</el-input>
			</el-form-item>
		</el-form>
	</XModal>
</template>

<script>
	export default {
		props: ['frontMan', 'eid','jid'], //任务ID,项目ID，任务分类ID
		components: {
			XModal: () => import('@/components/XModal'),
		},
		data() {
			return {
				form: {
					kpiId: null,
					score: null,
					leaveMessage: '',
					isAdd: null,
					endTime:''

				},
				rule: {
					kpiId: [{
						required: true,
						message: '请选择要扣除的kpi项',
						trigger: 'blur'
					}],
					score: [{
						required: true,
						message: '请选择要扣除的分值',
						trigger: 'blur'
					}]

				},
				kpiList: [],

			};
		},
		watch: {
			'form.kpiId'(newVal) {
				this.kpiList.forEach(item => {
					if (item.Id == newVal) {
						this.form.score = item.Score
						this.form.isAdd = item.IsAdd
					}
				})
			}
		},
		computed: {},
		methods: {
			//每次打开初始化
			init() {
				this.$nextTick(() => {
					this.getKpiList()
					this.getPersonInfo()
					// this.form.leaveMessage = ""
					// this.form.endTime=''
					Object.assign(this.$data,this.$options.data())
				});
			},
			getKpiList() {
				this.$http.post('/Work/Performance/KPISelectedByType.ashx', {
					Type: 1
				}).then(res => {
					if (res.res == 0) {
						this.kpiList = res.data
					}
				})
			},
			getPersonInfo() {
				this.$http.get('/Person/GetPersonInfo.ashx').then(res => {
					if (res.res == 0) {
						this.form.kpiId = res.data.TaskLastKid
					}
				})
			},
			confirm() {
				this.$refs['form'].validate(valid => {
					if (valid) {
						this.$refs.delayKpi.loadBtn(true);
						this.$http.post('/Work/Performance/AddDelayKPIByJob.ashx', {
							KId: this.form.kpiId,
							ProjectId: this.eid,
							JId:this.jid,
							UsId: this.frontMan.UId,
							Content: this.form.leaveMessage,
							IsAdd: this.form.isAdd,
							Score: this.form.score,
							EndTime: this.form.endTime
						}).then(res => {
							// console.log(res)
							if (res.res == 0) {
								this.$message({
									type: 'success',
									message:'添加成功'
								})
								this.$modal.hide('delayKpi')
							}
							this.$refs.delayKpi.loadBtn(false);
						})
					}
				})

			},


		},
		created() {

		}

	};
</script>

<style lang="less" scoped>
	#add-Kpi {
		/deep/.ctn {
			.el-form {
				padding: 0 1.6rem;

				.el-form-item {
					.el-form-item__content {

						// flex: 1;
						.el-select {
							width: 100%;
						}
					}
				}
			}
		}
	}
</style>
