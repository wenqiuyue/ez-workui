<template>
	<!-- 接收任务弹窗 -->
	<XModal id="changeF" ref="xml" name="changeF" title="更换所属父任务" cancelBtnText="取消" confirmBtnText="更换" @onConfirm="onConfirm">
		<el-form :model="form" :rules="rules" ref="form">
			<el-form-item prop="taskObj">
				<div class="tab-item-seltask" @click="openSelTask" v-if="form.taskObj == null">
					<i class="el-icon-plus"></i>
					<span>选择任务</span>
				</div>
				<div class="tab-item-show-task" v-else>
					<i :class="['hiFont', $D.ITEM('task_status', form.taskObj.Schedule).icon]" :style="{ color: $D.ITEM('task_status', form.taskObj.Schedule).color }"></i>
					<p>{{ form.taskObj.Name }}</p>
					<div @click="openSelTask">重新选择</div>
				</div>
			</el-form-item>
		</el-form>
		<!-- 任务选择器 -->
		<sel-task @getTaskList="getCheckList" :userID="user.id"></sel-task>
	</XModal>
</template>

<script>
import { mapState } from 'vuex';
export default {
	props: ['jid'],
	components: {
		XModal: () => import('@/components/XModal'),
		SelTask: () => import('@/components/Selectors/selTask')
	},
	data() {
		var validateJob = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请选择任务'));
			} else {
				if (parseInt(this.form.jid) == this.form.pid) {
					callback(new Error('目标任务与源任务相同，请重新选择'));
				}
				callback();
			}
		};
		return {
			form: {
				taskObj: null,
				pid: null,
				jid: this.jid
			},
			//表单验证
			rules: {
				taskObj: [{ validator: validateJob, trigger: 'blur' }]
			}
		};
	},
	methods: {
		//打开任务选择器
		openSelTask() {
			this.$modal.show('chooseTask');
		},
		//获取任务选择器返回数据
		getCheckList(task) {
			if (task.length) {
				this.form.taskObj = task[0];
				this.form.pid = task[0].JId;
			} else {
				this.form.taskObj = null;
			}
		},
		onConfirm() {
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$refs.xml.loadBtn(true);
					let params = Object.assign({}, this.form);
					delete params.taskObj;
					this.$http.post('/Project/ChangeParentJob.ashx', params).then(resp => {
						if (resp.res == 0) {
							this.$modal.hide('changeF');
							this.$notify({
								message: resp.msg,
								type: 'success'
							});
							this.$emit('upData');
							Object.assign(this.$data.form, this.$options.data().form);
						}
						this.$refs.xml.loadBtn(false);
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		}
	},
	computed: {
		...mapState(['user'])
	}
};
</script>

<style lang="less" scoped>
#changeF {
	/deep/.ctn {
		margin-top: 2rem;
		padding: 0 2rem;
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
	}
}
</style>
