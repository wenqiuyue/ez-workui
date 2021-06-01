<template>
	<XModal ref="xm" id="move-task" name="moveTask" title="移动任务" cancelBtnText="取消" confirmBtnText="确认" @onConfirm="confirm" @beforeOpen="init">
		<el-form>
			<el-form-item label="移动范围：">
				<el-radio v-model="form.range" :label="1">项目内</el-radio>
				<el-radio v-if="!isChild" v-model="form.range" :label="2">移动至其它项目</el-radio>
			</el-form-item>
			<el-form-item label="选择项目：" v-show="form.range == 2" placeholder="输入项目名查询">
				<el-select v-model="form.pro" filterable no-match-text="没有这个项目" @change="loadTaskType(form.pro)">
					<el-option v-for="item in options.pros" :key="item.proId" :value="item.proId" :label="item.proName"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="选择分类：">
				<el-select
					v-model="form.class"
					filterable
					no-match-text="没有这个分类"
					:placeholder="placeholder"
					:loading="loading"
					loading-text="获取分类中..."
					no-data-text="该项目没有分类"
				>
					<el-option v-for="item in options.classes" :key="item.cid" :value="item.cid" :label="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否将子任务一起移动：" v-show="form.range == 1">
				<el-radio-group v-model="form.moveChildren">
					<el-radio :label="false">否</el-radio>
					<el-radio :label="true">是</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</XModal>
</template>

<script>
export default {
	props: ['jid', 'eid', 'jobClass', 'isChild'], //任务ID,项目ID，任务分类ID
	components: {
		XModal: () => import('@/components/XModal'),
		SelPro: () => import('@/components/Selectors/selPro')
	},
	data() {
		return {
			form: {
				range: 1, //移动任务-移动范围
				pro: null, //移动任务-移动到哪个项目ID
				class: null, //移动任务-移动到哪个任务类型ID
				moveChildren: false
			},
			options: {
				classes: [], //可选分类列表
				pros: [] //可选项目列表
			},
			placeholder: '输入类型名查询',
			loading: false,
			oldClass: 0
		};
	},
	methods: {
		//每次打开初始化
		init() {
			this.$nextTick(() => {
				if (this.jobClass != null) this.oldClass = this.jobClass;
				this.form = {
					range: 1, //移动任务-移动范围
					pro: Number(this.eid), //移动任务-移动到哪个项目ID
					class: this.oldClass, //移动任务-移动到哪个任务类型ID
					moveChildren: false
				};
				this.loadTaskType(this.eid);
			});
		},
		confirm() {
			if (this.form.pro == null && this.form.class == null) {
				this.$message({
					message: '至少选择一个选项',
					type: 'error'
				});
				return;
			}
			if (this.form.pro == this.eid && this.form.class == this.oldClass) {
				this.$notify({
					message: '已经在此分类啦~~',
					type: 'info'
				});
				return;
			}
			this.$refs.xm.loadBtn(true);
			this.$http
				.post('/Project/taskExtend.ashx', {
					jobid: this.jid,
					typeId: 4,
					tpStr: this.form.class,
					tpEvStr: this.form.pro == this.eid ? null : this.form.pro,
					moveChildren: this.form.range == 1 ? this.form.moveChildren : null
				})
				.then(resp => {
					this.$refs.xm.loadBtn(false);
					if (resp.res == 0) {
						this.$notify({
							message: '移动成功',
							type: 'success'
						});
						this.$emit('successMove', this.form.class);
						this.$modal.hide('moveTask');
					}
				});
		},
		//获取分类
		loadTaskType(eid) {
			this.placeholder = '获取分类中...';
			this.loading = true;
			this.$http
				.post('/Project/taskAddSelector.ashx', {
					eventeId: eid,
					typeId: 2
				})
				.then(res => {
					this.loading = false;
					if (res.res == 0) {
						this.placeholder = '输入类型名查询';
						this.options.classes = [];
						res.data.map(item => {
							this.options.classes.push(_.zipObject(['cid', 'name'], _.toArray(item)));
						});
					}
				});
		}
	},
	watch: {
		'form.range'(val) {
			if (val == 1 && this.form.pro != this.eid) {
				this.loadTaskType(this.eid);
				this.form.pro = this.eid;
				this.form.class = null;
			}
		}
	},
	created() {
		//加载可选项目列表
		this.$http
			.post('/General/GetProjectSelector.ashx', {
				qxcs: 1,
				CurrentPage: 1,
				PageCount: 999999
			})
			.then(res => {
				if (res.res == 0) {
					this.options.pros = res.data.message;
				}
			});
	}
};
</script>

<style lang="less" scoped>
#move-task {
	/deep/.ctn {
		.el-form {
			padding: 0 1.6rem;
			.el-form-item {
				display: flex;
				align-items: center;
				.el-form-item__content {
					flex: 1;
					.el-select {
						width: 100%;
					}
				}
			}
		}
	}
}
</style>
