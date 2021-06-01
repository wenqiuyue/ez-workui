<template>
	<XModal ref="addKpi" id="add-Kpi" name="addKpi" :title="type==1?'快速提醒':'快速添加KPI'" cancelBtnText="取消" confirmBtnText="确认"
	 @onConfirm="confirm" @beforeOpen="init" width="800px" height="450px">
		<el-form :model="form" :rules="rule" ref="form">
			<el-form-item label="KPI类型" label-width="80px" prop="kpiId">
				<el-select v-model="form.kpiId">
					<el-option v-for="(item) in kpiList" :label="item.Name" :key="item.Id" :value="item.Id"></el-option>
				</el-select>
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
		props: ['jid', 'type','frontMan'], //任务ID,项目ID，任务分类ID
		components: {
			XModal: () => import('@/components/XModal'),
		},
		data() {
			return {
				form: {
					kpiId: null,
					leaveMessage: '',
				},
				rule: {
					kpiId: [{
						required: true,
						message: '请选择要扣除的kpi项',
						trigger: 'blur'
					}, ]

				},
				kpiList: []

			};
		},
		computed: {},
		methods: {
			//每次打开初始化
			init() {
				this.$nextTick(() => {
					this.getKpiList()
					this.form.leaveMessage = ""
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
			confirm() {
				this.$refs['form'].validate(valid => {
					if (valid) {
						this.$refs.addKpi.loadBtn(true);
						this.$http.post('/Work/Performance/SendNoticeKPIMess.ashx', {
							Type: 1,
							Kid: this.form.kpiId,
							SourceId: this.jid,
							content: this.form.leaveMessage,
							Operation: this.type
						}).then(res => {
							// console.log(res)
							if (res.res == 0) {
								this.$message({
									type: 'success',
									message: this.type == 1 ? '提醒成功' : '扣除成功'
								})
								this.$modal.hide('addKpi')
							}
							this.$refs.addKpi.loadBtn(false);
						})
					}
				})

			},

		},

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
