<template>
	<XModel id="task-history" isFixed ref="xmodal" name="taskHistory" title="历史调整记录" showCrossBtn @beforeOpen="beforeOpen">
		<p class="tip">点击记录查看详细调整</p>
		<el-table
			:data="tableData"
			class="table"
			:header-cell-style="headerStyle"
			height="400px"
			row-key="rid"
			v-infinite-scroll="getData"
			:expand-row-keys="[rid]"
			infinite-scroll-disabled="disabled"
			v-loading="tabLoading"
		>
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="任务:" v-for="task in props.row.dtls" :key="task.job.jid">
							<p class="task-name" @click="showDetail(task.job)">{{ task.job.name }}</p>
							<p class="task-location">
								调整为第
								<span>{{ task.position }}</span>
								个任务
							</p>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column label="调整人"  width="170">
				<template slot-scope="scope">
					<div class="task-user">
						<img v-lazy="scope.row.user.picture" />
						<span>{{ scope.row.user.name }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="调整时间">
				<template slot-scope="scope">
					<span>{{ scope.row.time.timeFormat('yyyy年M月d日 HH:mm') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="调整类型" :filters="filtersArr" :filter-method="filterType" width="120">
				<template slot-scope="scope">
					<span>{{ $D.ITEM('task_seq_rec_type', scope.row.type).name }}</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="g-loading" v-if="loading && !tabLoading">
			<i class="el-icon-loading"></i>
			加载中...
		</div>
		<div class="g-loaded" v-if="noMore">已全部加载</div>
	</XModel>
</template>
<script>
export default {
	components: {
		XModel: () => import('@/components/XModal')
	},
	props: {
		userId: {
			type: Number,
			default: NaN
		},
		rid:{
			type:String,
			default:null
		}
	},
	data() {
		return {
			tabLoading: false,
			tableData: [],
			params: {
				u: NaN,
				p: 1, //当前页码
				pc: 10 //单页显示数量
			},
			headerStyle: {
				fontSize: '1.5rem',
				color: 'black'
			},
			loading: false,
			pageTotal: 0
		};
	},
	computed: {
		noMore() {
			return this.pageTotal >= this.tableData.length;
		},
		disabled() {
			return this.loading || this.noMore;
		},
		filtersArr() {
			return this.$D.LIST('task_seq_rec_type').map(item => {
				return {
					text: item.name,
					value: item.value
				};
			});
		}
	},
	// watch: {
	// 	userId: {
	// 		immediate: true,
	// 		handler(newVal, oldVal) {
	// 			if (newVal) {
	// 				this.getData(true);
	// 			}
	// 		}
	// 	}
	// },
	methods: {
		beforeOpen(){
			if (this.userId) {
				this.getData(true);
			}
		},
		filterType(value, row) {
			return row.type == value;
		},
		showDetail(task) {
			task.ID = task.jid;
			this.$emit('showDetail', task);
		},
		getData(flag) {
			if (flag == true) {
				this.tabLoading = true;
				this.params.u = this.userId;
				this.params.p = 1;
			} else {
				this.params.p++;
			}
			this.loading = true;
			this.$http.post('/Project/Job/taskSeqRecord.ashx', this.params).then(resp => {
				if (resp.res == 0) {
					this.pageTotal = resp.data.page.TotalCount;
					if (flag == true) {
						this.tabLoading = false;
						this.tableData = resp.data.data;
					} else {
						this.tableData.concat(resp.data.data);
					}
					this.loading = false;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
#task-history {
	/deep/.tit {
		font-size: 2.5rem;
		letter-spacing: 2px;
		height: initial;
		flex: initial;
		line-height: initial;
		& > :nth-of-type(2) {
			margin-top: 1.2rem;
		}
	}
	.tip {
		color: #aaa;
		text-align: center;
	}
	.table {
		width: 90%;
		margin: 2rem auto 0 auto;
		.task-user {
			display: flex;
			align-items: center;
			img {
				width: 50px;
				height: 50px;
				border-radius: 50%;
				margin-right: 1rem;
			}
		}
		/deep/.el-table__column-filter-trigger i {
			font-size: 16px;
		}
		.demo-table-expand {
			.el-form-item {
				display: flex;
				/deep/ .el-form-item__label {
					white-space: nowrap;
				}
				/deep/.el-form-item__content {
					width: 99%;
					.task-name {
						color: black;
						font-size: 18px;
						cursor: pointer;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						transition: color 0.4s ease;
						&:hover {
							color: #409eff;
						}
					}
					.task-location {
						line-height: 1;
						color: #aaa;
						font-size: 12px;
						span {
							color: #b75757;
						}
					}
				}
			}
		}
	}
}
</style>
