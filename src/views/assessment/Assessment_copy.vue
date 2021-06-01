<template>
	<XM ref="xmodal"  :closeOnDimmer="false" title="添加考核" name="assessmentAdd" confirmBtnText="确认" cancelBtnText="取消" @onConfirm="hConfirm"
	 @closed="closed" @opened="opened">
		<el-form id="assessmentAdd" :model="formData" :rules="rules" ref="addForm" label-width="80px">
			<el-form-item class="form-line-item" label="人 员:" prop="UsId">
				<MS  size="small" :readonly="memberFixed" :arrays="defaultMan" :isSelection="!memberFixed" @Confirm="ConfirmMs">
				</MS>
			</el-form-item>
			<el-form-item class="form-line-item" label="KPI项:" prop="KId">
				<el-select @change="setScore" :disabled="remote" v-model="formData.KId" filterable clearable placeholder="请选择"
				 style="width: 100%;">
					<el-option v-for="item in selects" :label="item.Name" :value="item.Id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="分 数:" prop="Score">
				<el-input type="number" v-model="formData.Score"></el-input>
			</el-form-item>
			<el-form-item label="理 由:" prop="Content">
				<el-input style="display: none;" v-model="formData.Content"></el-input>
				<XFroala v-model="formData.Content" :showToolbar="false" placeholder="请输入理由" :height="110" :maxHeight="110"></XFroala>
			</el-form-item>
			<el-form-item label=" URL:">
				<el-input v-model="formData.refUrl" placeholder="平台URL"></el-input>
			</el-form-item>
			<el-form-item label="可申诉:">
				<el-radio-group v-model="formData.IsComplaint">
					<el-radio :label="true">是</el-radio>
					<el-radio :label="false">否</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</XM>
</template>

<script>
	export default {
		components: {
			XM: () => import('@/components/XModal'),
			MS: () => import('@/components/Selectors/MemberSelect'),
			XFroala: () => import('@/components/XFroala'),
		},
		props:{
			memberFixed:{
				type:Boolean,
				default:false
			},
			defaultMan:{
				type:Array,
				default:function(){
					return []
				}
			}
		},
		data() {
			return {
				formData: {
					UsId: null,
					Content: '',
					KId: '',
					Score: null,
					refUrl: window.location + '',
					IsComplaint: true
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
						message: '分数必填',
						trigger: 'blur'
					}]
				},
				selects: [],
				remote: true
			}
		},
		methods: {
			//下拉改变
			setScore(val) {
				for (let i of this.selects) {
					if (i.Id == val) {
						this.formData.Score = i.Score;
						return;
					}
				}
				this.formData.Score = null
			},
			//提交
			hConfirm() {
				this.$refs.addForm.validate(valid => {
					if (valid) {
					  this.$refs.xmodal.loadBtn(true)
						this.$http.post('/Work/Performance/addUserKPI.ashx', this.formData).then(resp => {
						   
							if (resp.res == 0) {
								this.$notify({
									message: '添加成功',
									type: 'success'
								});
								this.$modal.hide('assessmentAdd');
								this.$emit('getKpi',this.formData)
								this.$refs.xmodal.loadBtn(false)
							}
						})
					}
				})
			},
			//关闭后
			closed() {
				Object.assign(this.$data, this.$options.data())
			},
			ConfirmMs(arr){
				let array=[]
			  if(arr.length){
				 arr.forEach(item=>{
					  array.push(item.UId)
				 })
				  this.$http.post('/Work/Performance/userKPISelect.ashx', {
				  	UsId: array,
				  	Type: 1
				  }).then(resp => {
				  	if (resp.res == 0) {
				  		this.remote = false;
				  		this.selects = resp.data;
				  	}
				  })
			  }	
			},
	
			opened(){
				// console.log(this.defaultMan)
			  if(this.memberFixed){
			  	this.formData.UsId=[]
			  	console.log(this.defaultMan)
			  	this.formData.UsId.push(this.defaultMan[0].UId)
			  	this.$http.post('/Work/Performance/userKPISelect.ashx', {
			  		UsId: this.formData.UsId,
			  		Type: 1
			  	}).then(resp => {
			  		if (resp.res == 0) {
			  			this.remote = false;
			  			this.selects = resp.data;
			  				// console.log(this.selects)
			  		}
			  	})
			  }
			},
			
		}
	}
</script>

<style lang="less" scoped>
	#assessmentAdd {
		padding: 0 1rem 0 0;

		.form-line {
			display: flex;
			margin-bottom: 0.5rem;

			// .form-line-item{
			// 	flex: 1;
			// }
			&>:first-child {
				flex: 4;
			}

			&>:last-child {
				flex: 6;
			}

			/deep/.el-form-item__content {
				.slot_div {
					display: flex;
					padding-left: 0.2rem;

					.ttr-name {
						margin-left: 0.5rem;
						color: #6d6d6d;
					}

					.user-img {
						width: 3.4rem;
						height: 3.4rem;
						border-radius: 50%;
					}
				}
			}
		}

		/deep/ .fr-toolbar {
			display: none;
		}

		/deep/.fr-box.fr-basic .fr-element {
			border-top: 1px solid #ddd;
		}
	}
</style>
