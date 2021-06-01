<template>
	<!-- width="95%" height="95%" -->
	<XModal name="taskGroup" id="taskGroup" title="自定义分类管理" @opened="opened" @closed="closed" cancelBtnText="取消">
		<el-button @click="taskClassVisible = true" class="add">添加分类</el-button>
		<el-table :data="taskClassData" border style="width: 100%" :header-cell-style="{ 'text-align': 'center' }" v-loading="tableLoad">
			<el-table-column label="分类名称">
				<template slot-scope="scope">
					<el-input ref="input" v-model="jobClassName" v-if="editIndex == scope.row.jCId"></el-input>
					<p v-else>{{ scope.row.name }}({{ scope.row.jobcount }})</p>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button v-if="editIndex == scope.row.jCId" @click.native.prevent="editClassName(scope.row, scope.$index)" type="primary" size="mini">确认</el-button>
					<el-button v-else @click.native.prevent="showEdit(scope.row.jCId, scope.row.name)" size="mini">编辑</el-button>
					<el-button @click.native.prevent="delClassName(scope.row.jCId, scope.$index)" type="danger" size="mini">删除</el-button>
					<!-- 	<i v-if="editIndex == t.jCId" class="el-icon-check" @click=""></i>
					<i v-else class="hiFont hi-edit" @click="showEdit(t.jCId, t.name)"></i>
					<i class="hiFont hi-move"></i>
					<i class="hiFont hi-delete" @click="delClassName(t.jCId, index)"></i> -->
				</template>
			</el-table-column>
		</el-table>
		<div class="bottom">
			<el-pagination layout="prev, pager, next" :total="pageData.totalCount" :page-size="pageData.pageSize" @current-change="currChange"></el-pagination>
		</div>
		<el-dialog title="添加分类" :visible.sync="taskClassVisible" width="30%" center :show-close="false" :append-to-body="true" custom-class="add-task-classes">
			<el-input placeholder="请输入自定义分类" v-model="taskClassName" @keyup.enter.native="addTaskClass"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="taskClassVisible = false">取 消</el-button>
				<el-button type="primary" @click="addTaskClass()">确 定</el-button>
			</span>
		</el-dialog>
	</XModal>
</template>

<script>
export default {
	components: {
		XModal: () => import('@/components/XModal')
	},
	data() {
		return {
			taskClassData: null, //任务分类数据
			taskClassVisible: false, //添加分类对话框
			taskClassName: null, //添加分类
			editIndex: null, //编辑的任务分类id
			jobClassName: null, //要修改任务分类名称
			pageData: {
				currentPage: 1,
				totalCount: 0,
				pageSize: 5
			},
			tableLoad: false
		};
	},
	methods: {
		//添加任务分类
		addTaskClass() {
			if (!this.taskClassName) {
				return;
			}
			this.$http
				.post('/Project/Job/taskTypeCreate.ashx', {
					eventeId: this.$route.params.eid,
					name: this.taskClassName
				})
				.then(resp => {
					if (resp.res == 0) {
						this.opened();
						this.taskClassVisible = false;
						this.taskClassName = '';
						this.$message({
							type: 'success',
							message: resp.msg
						});
					}
				});
		},
		currChange(page) {
			this.pageData.currentPage = page;
			this.opened();
		},
		opened() {
			this.tableLoad = true;
			this.$http
				.post('/Project/projectDetailsInquireTab.ashx', {
					EventeId: this.$route.params.eid,
					typeId: 6,
					PageCount: this.pageData.pageSize,
					CurrentPage: this.pageData.currentPage
				})
				.then(resp => {
					if (resp.res == 0) {
						this.taskClassData = resp.data.data;
						this.pageData.totalCount = resp.data.page.TotalCount;
						this.tableLoad = false;
					}
				});
		},
		//删除任务分类
		delClassName(tid, index) {
			this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http
						.post('/Project/Job/taskTypeDelete.ashx', {
							jobClassID: tid
						})
						.then(resp => {
							if (resp.res == 0) {
								this.opened();
								this.$message({
									type: 'success',
									message: resp.msg
								});
								this.$emit('upData');
							}
						});
				})
				.catch(() => {});
		},
		//显示任务分类编辑
		showEdit(id, name) {
			this.editIndex = id;
			this.jobClassName = name;
			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		},
		//提交任务分类编辑
		editClassName(obj, index) {
			if (this.jobClassName === obj.name) {
				this.editIndex = null;
				return;
			}
			this.$http
				.post('/Project/Job/taskTypeEdit.ashx', {
					jobClassID: obj.jCId,
					jobClassName: this.jobClassName,
					operate: 1,
					eventeid: this.$route.params.eid
				})
				.then(resp => {
					if (resp.res == 0) {
						this.editIndex = null;
						this.taskClassData[index].name = this.jobClassName;
						this.$message({
							type: 'success',
							message: resp.msg
						});
						this.$emit('upData');
					}
				});
		},
		closed() {
			Object.assign(this.$data, this.$options.data());
		}
	}
};
</script>

<style lang="less" scoped>
#taskGroup {
	/deep/.ctn {
		padding: 0 20px;
		.add {
			margin-bottom: 5px;
		}
		.bottom {
			margin: 5px 0;
			text-align: center;
		}
	}
}
@media all and (max-width: 1024px) {
	/deep/.add-task-classes {
		width: 80%!important;
	}
}
</style>
