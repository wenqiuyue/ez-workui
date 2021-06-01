<template>
	<!-- 选择成员介入 -->
	<div id="assist">
		<XModal name="addAssist" confirmBtnText="确认" cancelBtnText="取消" @closed="close()" @onConfirm="submitForm" ref="addAssist">

			<div class="box">
				<div class="box-header"> <span>指定成员介入</span>
					<!-- <el-button type="primary" size="small" icon="hiFont hi-add" @click="add()">添加成员介入</el-button> -->
				</div>
				<div class="box-content">
					<div class="tips">
						<i class="el-icon-warning"></i>
						<span>建议当任务实在无法进展，需要某人进行调和时才让其介入进来</span>
					</div>
					<!-- 	<div v-for="(item,index) in formArr" :key="index">
						<el-card shadow="hover">
							<el-form ref="form" label-width="100px" class="demo-ruleForm" label-position="left">
								<el-form-item label="选择成员" prop="ids">
									<MemberSelect @Confirm="getMember(index,$event)" :isSelection="false" size="small">
									</MemberSelect>
								</el-form-item>
								<el-form-item label="紧急介入" prop="isMerge">
									<div>
										<el-radio v-model="formArr[index].isMerge" label="1" size="medium">是</el-radio>
										<el-radio v-model="formArr[index].isMerge" label="2" size="medium">否</el-radio>
									</div>
								</el-form-item>
								<el-form-item label="原因类型" prop="type" >
									<el-select v-model="formArr[index].type">
										<el-option value="0" label='任务执行人不配合'></el-option>
										<el-option value="2" label='客户不配合'></el-option>
										<el-option value="3" label='介入人不配合'></el-option>
										<el-option value="4" label='无法解决'></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="填写原因" prop="reason" class="align">
									<el-input type="textarea" rows="3" v-model="formArr[index].reason" placeholder="请输入未解决的原因" ></el-input>
								</el-form-item>
								
							</el-form>
							<div class="delete">
								<div @click="formArr.splice(index, 1)">
									<a class="hiFont hi-delete">
									</a>
									<span>删除</span>
								</div>
							</div>

						</el-card>

					</div> -->
					<el-card shadow="hover">
						<el-form ref="form" :rules="rules" :model="form" label-width="100px" class="demo-ruleForm" label-position="left">
							<el-form-item label="选择成员" prop="goalManId">
								<MemberSelect @Confirm="getMember" :isSelection="false" size="small">
								</MemberSelect>
							</el-form-item>
							<el-form-item label="紧急介入" prop="Fir">
								<div>
									<el-radio v-model="form.Fir" label="4" size="medium">是</el-radio>
									<el-radio v-model="form.Fir" label="2" size="medium">否</el-radio>
								</div>
							</el-form-item>
							<el-form-item label="原因类型" prop="PreUnionIssuesType">
								<el-select v-model="form.PreUnionIssuesType">
									<el-option value="0" label='任务执行人不配合'></el-option>
									<el-option value="2" label='客户不配合'></el-option>
									<el-option value="3" label='介入人不配合'></el-option>
									<el-option value="4" label='无法解决'></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="填写原因" prop="PreUnionIssues" class="align">
								<el-input type="textarea" rows="3" v-model="form.PreUnionIssues" placeholder="请输入未解决的原因"></el-input>
							</el-form-item>

						</el-form>
						<!-- 	<div class="delete">
							<div @click="formArr.splice(index, 1)">
								<a class="hiFont hi-delete">
								</a>
								<span>删除</span>
							</div>
						</div> -->

					</el-card>

				</div>

			</div>
		</XModal>





	</div>




</template>

<script>
	export default {
		data() {
			return {
				rules: {
					goalManId: [{
						required: true,
						message: '请选择介入成员',
						trigger: 'blur'
					}],
					Fir: [{
						required: true,
						message: '请选择是否紧急介入',

					}],
					PreUnionIssuesType: [{
						required: true,
						message: '请选择原因类型',
						trigger: 'blur'
					}],
					PreUnionIssues: [{
						required: true,
						message: '请输入未解决的原因',
						trigger: 'blur',
					}]
				},
				formArr: [{
					ids: [],
					isMerge: '',
					reason: '',
					type: ''
				}],
				form: {}

			}
		},
		props: {
			JId: {
				type: String | Number,
				default: ''
			},
			frontMan: {
				type: String | Number,
				default: ''
			}
		},
		components: {
			XModal: () => import("@/components/XModal"),
			MemberSelect: () => import("@/components/Selectors/MemberSelect"),
		},
		computed: {
			user() {
				return this.$store.state.user
			}
		},
		methods: {
			getMember(arr) {
				if (arr.length) {
					this.form.goalManId = arr[0].UId
				} else {
					this.form.goalManId = ''
				}
			},
			close() {
				Object.assign(this.$data, this.$options.data())
			},
			submitForm() {
				if (this.form.goalManId == this.frontMan.UId) {
					this.$message({
						type: 'warning',
						message: '该介入成员已经是此任务的执行人'
					})
					return false
				}
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$refs.addAssist.loadConfirm = true
						this.form.JId = this.JId
						this.form.AuthorId = this.user.id
						this.$http.post('/Project/JionTask.ashx', this.form).then(res => {
							this.$refs.addAssist.loadConfirm = false
							if (res.res == 0) {
								this.$message({
									type: 'success',
									message: '操作成功'
								})
								this.$modal.hide('addAssist')
								this.$emit('updateAssist')
							}
						})


					}



				})
			}
			// 			add() {
			// 				this.formArr.push({
			// 					ids: [],
			// 					isMerge: false
			// 				})
			// 			},
			// 

		}





	}
</script>

<style lang="less" scoped="scoped">
	.box-header {
		font-weight: 600;
		font-size: 2rem;
		color: #448ef5;
		margin-right: auto;
		padding-left: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 20px;
		border-bottom: 1px solid #EBEEF5;
	}

	.box-content {
		box-sizing: border-box;
		padding: 0 18px;
		max-height: 650px;
		overflow: auto;

		/deep/#mem-public {
			// border: none !important;

			.mem-add {
				width: 2.2rem;
				height: 2.2rem;
			}
		}
	}

	.tips {

		display: flex;
		padding: 1.5rem 0;
		align-items: center;

		i {
			font-size: 1.9rem;
			color: #E6A23C;
			margin-right: 1rem;
		}

		span {
			color: #4a4a4a;
			font-size: 1.3rem;
		}
	}

	/deep/.el-form-item {
		display: flex;
		align-items: center;
		margin-bottom: 20px;

		/deep/.el-form-item__content {
			margin-left: 0 !important;
			flex: 1;
		}

		.el-select {
			width: 90%;
		}

		.el-textarea {
			width: 90%;
		}
	}

	.align {
		/deep/.el-form-item__label {
			align-self: flex-start;
		}
	}

	/deep/.el-form-item__label {
		font-size: 1.5rem;
		color: #4a4a4a;
	}

	/deep/.el-radio {
		/deep/.el-radio__inner {
			width: 18px;
			height: 18px;
		}

		/deep/.el-radio__label {
			font-size: 1.5rem;
		}
	}

	.el-card {
		margin-bottom: 1.5rem;
	}

	/deep/.el-card__body {
		display: flex;

		.el-form {
			flex: 1;
		}

		.delete {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			div {
				width: 30px;
				color: #999;
				cursor: pointer;
				text-align: center;

				span {
					text-align: center;
					font-size: 1.5rem;
					margin-top: .5rem;
				}

				&:hover {
					color: #448ef5;
				}
			}

		}


	}
</style>
