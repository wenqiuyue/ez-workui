<template>
	<XM title="编辑考核" name="editAssess" confirmBtnText="确认" cancelBtnText="取消" @onConfirm="hConfirm">
		<el-form id="editAssess" :model="formData" :rules="rules" ref="addForm" label-width="80px">
			<div class="form-line">
				<el-form-item class="form-line-item" label="人 员:" prop="UsId">
					<el-input style="display: none;" v-model="formData.UsId"></el-input>
					<MS :isSelection="false" :showActive="false" @Confirm="getMS" :arrays="defaultMS">
						<template slot="button">
							<div slot="button" class="slot_div">
								<img v-if="showUser" class="user-img" v-lazy="$url + showUser.Picture" />
								<div v-else class="mem-add"><i class="el-icon-plus"></i></div>
								<p class="ttr-name">{{ showUser == null ? '' : showUser.UName }}</p>
							</div>
						</template>
					</MS>
				</el-form-item>
				<el-form-item class="form-line-item" label="KPI项:" prop="KId">
					<el-select @change="setScore" :disabled="remote" v-model="formData.KId" filterable clearable placeholder="请选择" style="width: 100%;">
						<el-option v-for="item in selects" :label="item.Name" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
			</div>
			<el-form-item label="分 数:" prop="Score"><el-input type="number" v-model="formData.Score"></el-input></el-form-item>
			<el-form-item label="理 由:" prop="Content">
				<el-input style="display: none;" v-model="formData.Content"></el-input>
				<XFroala v-model="formData.Content" :showToolbar="false" placeholder="请输入理由" :height="110" :maxHeight="110"></XFroala>
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
	props: {
		editData: {
			type: Object,
			default: null
		}
	},
	components: {
		XM: () => import('@/components/XModal'),
		MS: () => import('@/components/Selectors/MemberSelect'),
		XFroala: () => import('@/components/XFroala')
	},
	data() {
		return {
			formData: {
				UsId: null,
				Content: '',
				KId: '',
				Score: null,
				IsComplaint: false
			},
			showUser: null,
			rules: {
				UsId: [
					{
						required: true,
						message: '请选择人员',
						trigger: 'blur'
					}
				],
				KId: [
					{
						required: true,
						message: '请选择KPI项',
						trigger: 'blur'
					}
				],
				Content: [
					{
						required: true,
						message: '请输入理由',
						trigger: 'blur'
					}
				],
				Score: [
					{
						required: true,
						message: '必填项',
						trigger: 'blur'
					}
				]
			},
			selects: [],
			remote: true,
			defaultMS: []
		};
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
		},
		//提交
		hConfirm() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					if (this.formData.UsId != this.editData.UId || this.formData.KId != this.editData.KId || this.formData.Content != this.editData.Content) {
						this.$http.post('/Work/Performance/updateAssess.ashx', this.formData).then(resp => {
							if (resp.res == 0) {
								this.$notify({
									message: '编辑成功',
									type: 'success'
								});
								this.$emit('result');
								this.$modal.hide('editAssess');
							}
						});
					} else {
						this.$modal.hide('editAssess');
					}
				}
			});
		},
		//获取人员
		getMS(user) {
			this.remote = true;
			if (user.length == 0) {
				this.showUser = null;
				this.formData.UsId = null;
				this.selects = [];
			} else {
				this.showUser = user[0];
				this.formData.UsId = user[0].UId;
				this.getSel({
					UsId: [user[0].UId],
					Type: 1
				});
			}
		},
		getSel(param, id) {
			this.$http.post('/Work/Performance/userKPISelect.ashx', param).then(resp => {
				if (resp.res == 0) {
					this.remote = false;
					this.selects = resp.data;
					if (id) {
						for (let i of this.selects) {
							if (i.Id == id) {
								this.formData.KId = id;
								return;
							}
						}
					}
				}
			});
		}
	},
	watch: {
		editData: {
			handler(newv, oldv) {
				this.defaultMS = [];
				let user = {
					UId: newv.UsId,
					UName: newv.UserName,
					Picture: newv.Picture
				};
				this.defaultMS.push(user);
				this.showUser = user;
				this.formData.UsId = user.UId;
				this.formData.KId = null;
				this.getSel(
					{
						UsId: [user.UId],
						Type: 1
					},
					newv.KId
				);
				this.formData.Content = newv.Content;
				this.formData['UId'] = newv.UId;
				this.formData.Score = newv.Score;
				this.formData.IsComplaint = newv.IsComplaint;
			}
		}
	}
};
</script>

<style lang="less" scoped>
#editAssess {
	padding: 0 1rem 0 0;

	.form-line {
		display: flex;
		margin-bottom: 0.5rem;

		& > :first-child {
			flex: 4;
		}

		& > :last-child {
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
