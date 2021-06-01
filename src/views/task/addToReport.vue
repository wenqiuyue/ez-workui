<template>
	<XModal ref="addReport" id="add-Report" name="addReport" title="将任务添加到简报" cancelBtnText="取消" confirmBtnText="确认" 
	 @onConfirm="confirm" @opened="init" width="500px" height="350px" isFixed>
		<el-form :model="form" :rules="rule" ref="form">
			<el-form-item label="任务耗时" label-width="80px" prop="spend">
				<el-input type="text" placeholder="请输入任务耗时" v-model="form.spend">
					<template slot="append">小时</template>
				</el-input>
			</el-form-item>
			<el-form-item label="简报日期" label-width="80px" prop="date">
				<el-date-picker v-model="form.date" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd">
				</el-date-picker>
			</el-form-item>
		</el-form>
	</XModal>
</template>

<script>
	export default {
		props: ['jid'], //任务ID,项目ID，任务分类ID
		components: {
			XModal: () => import('@/components/XModal'),
		},
		data() {
			return {
				form: {
					spend: null,
					date: '',
				},
				rule: {
					spend: [{
						required: true,
						message: '请输入任务耗时',
						trigger: 'blur'
					} ],
					date:[{
						required: true,
						message: '请选择简报日期',
						trigger: 'blur'
					}]
					

				},

			};
		},
		computed: {},
		methods: {
			//每次打开初始化
			init() {
				
				this.$refs['form'].resetFields()
				Object.assign(this.$data.form,this.$options.data().form)
				this.$refs.addReport.loadBtn(false)
				
			},
			confirm() {
				this.$refs['form'].validate(valid => {
					if (valid) {
						this.$refs.addReport.loadBtn(true);
						this.$http.post('/Work/Report/addToReport.ashx', {
							jid: this.jid,
							spend: this.form.spend,
							date: this.form.date
						}).then(res => {
							if (res.res == 0) {
								this.$message({
									type: 'success',
									message: '添加成功'
								})
								this.$modal.hide('addReport')
							}
							this.$refs.addReport.loadBtn(false);
						})
					}
				})

			},

		},

	};
</script>

<style lang="less" scoped>
	#add-Report {
		/deep/.ctn {
			.el-form {
				padding: 4rem 2rem;

				.el-form-item {
					margin-bottom: 3rem;
					.el-form-item__content {

						// flex: 1;
						.el-input{
							width: 100%;
						}
					}
				}
			}
		}
	}
</style>
