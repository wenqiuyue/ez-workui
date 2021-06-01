<template>
	<!-- 菜单 -->
	<div id="my-assessment">
					<!-- 我的考核详情弹框 -->
		<kpiDetail :activeId="activeId"></kpiDetail>
		<!-- 头部 -->
		<Header title="我的考核" titleEnglish="My Assessment" class="baseHeader" :haveBaseViewLeft="true">
			<!--XBB: PC按钮组的插槽 -->
			<div slot="btnGroup">
				<a v-for="item in options" :class="{ 'is-active': tabType == item.value }" @click.prevent="changeDispaly(item.value)">
					<span>{{ item.label }}</span>
				</a>
			</div>
			<!--XBB: 移动端按钮组的插槽 -->
			<el-dropdown @command="changeDispaly" trigger="click" slot="dropdown">
				<el-button type="primary" size="small" style="margin-right: .5rem;">{{ headerTitle }}</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="item in options" :command="item.value" :class="{ 'link-active': tabType == item.value }">{{ item.label }}</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</Header>
		<c-content>
			<!-- 选项卡 搜索部分 -->
			<div slot="search" class="search">
				<div class="search-item">
					<span>时间</span>
					<el-date-picker
						v-model="value1"
						type="daterange"
						value-format="yyyy-MM-dd"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="searchDate"
					></el-date-picker>
				</div>
				<div class="search-item" v-show="tabType != 2">
					<span>人员</span>
					<!-- <h6>筛选人员</h6> -->
					<SM :showLength="9" @Confirm="getMS" size="small" :showActiveImg="false">
						<template slot="button">
							<span class="btn-custom"><i class="el-icon-plus"></i></span>
						</template>
					</SM>
				</div>
			</div>
			<!-- 主体表格部分 slot="main" -->
			<el-table slot="main" border class="table" :data="tableData" v-loading="loading">
				<template slot="empty" style="font-size: 0;">
					<div style="height:100%;"><img src="@/assets/img/emptyData.png" style="display: inline-block;width:50%;margin-top:100px;" /></div>
				</template>
				<el-table-column v-if="(tabType != 2) & (tabType != 3)" min-width="70" label="KPI编号" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.Number }}
					</template>
				</el-table-column>
				<el-table-column v-if="(tabType != 2) & (tabType != 3)" min-width="110" label="KPI名称" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.Name }}
					</template>
				</el-table-column>
				<el-table-column v-else min-width="110" label="投诉类型" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.TypeName }}
					</template>
				</el-table-column>
				<el-table-column min-width="100" label="描述" show-overflow-tooltip  prop="Describe">
				  <template slot-scope="scope">
				  	{{ scope.row.Describe?scope.row.Describe:'无' }}
				  </template>
				</el-table-column>
				<el-table-column min-width="100" :label="UserName" show-overflow-tooltip>
					<template slot-scope="scope">
						<p v-if="tabType == 0">{{ scope.row.AssessedName }}</p>
						<p v-else-if="tabType == 2">{{ scope.row.ComplaintsOr }}</p>
						<p v-else>{{ scope.row.BeAssessedName }}</p>
					</template>
				</el-table-column>
				<el-table-column v-if="tabType == 0" min-width="60" label="类型" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.TypeName }}
					</template>
				</el-table-column>
				<el-table-column v-if="(tabType != 2) & (tabType != 3)" min-width="80" label="结果" show-overflow-tooltip>
					<template slot-scope="scope">
						<p>{{ scope.row.AddName | RESULT(scope.row.Score) }}</p>
					</template>
				</el-table-column>
				<el-table-column min-width="100" label="时间" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.Times.timeFormat('yyyy-MM-dd') }}
					</template>
				</el-table-column>
				<el-table-column min-width="80" label="状态" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.StatusName }}
					</template>
				</el-table-column>
				<el-table-column min-width="110" label="操作" show-overflow-tooltip>
					<template slot-scope="scope">
						<div v-if="tabType == 0" class="cell">
							<el-button class="el-button--text" size="medium" @click="handleDetail(scope.$index, scope.row)">详细</el-button>
							<el-button
								v-if="(scope.row.Status == 1) | (scope.row.Status == 5) && scope.row.IsComplaint"
								class="el-button--text"
								size="medium"
								@click="handleAppeal(scope.$index, scope.row)"
							>
								申诉
							</el-button>
							<el-button v-else-if="scope.row.Status == 2" class="el-button--text" size="medium" @click="cancelAppeal(scope.$index, scope.row)">撤销</el-button>
							<el-button v-else-if="scope.row.Status == 3" class="el-button--text cel-over" size="medium">已撤销</el-button>
							<el-button v-else-if="scope.row.Status == 4" class="el-button--text cel-over" size="medium">申诉成功</el-button>
						</div>
						<div v-else-if="tabType == 1" class="cell">
							<el-button v-if="scope.row.Status == 1" class="el-button--text" size="medium" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button v-if="scope.row.Status != 3" class="el-button--text" size="medium" @click="cancelAppeal(scope.$index, scope.row)">撤销</el-button>
							<el-button v-else class="el-button--text cel-over" size="medium">已撤销</el-button>
						</div>
						<div v-else-if="tabType == 3" class="cell">
							<el-button v-if="scope.row.Status == 2" class="el-button--text" size="medium" @click="cancelAppeal(scope.$index, scope.row)">撤销</el-button>
							<el-button v-if="scope.row.Status == 3" class="el-button--text cel-over" size="medium">已撤销</el-button>
						</div>
						<div v-else class="cell"><el-button class="el-button--text" size="medium" @click="handleDetail(scope.$index, scope.row)">详细</el-button></div>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<c-pages slot="pages" v-model="pageData" @childEvent="getData"></c-pages>
		</c-content>



		
		
		<!-- 我的投诉详情弹框 -->
		<XM id="dialogDetail" title="投诉详情" name="myComplaints" showCrossBtn >
			<div class="detail-tr">
				<div class="detail-td-title">投诉类型：</div>
				<div class="detail-td-info">{{ dialogData.myComplaints.TypeName }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">投诉人：</div>
				<div class="detail-td-info">{{ dialogData.myComplaints.ComplaintsOr }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">时间：</div>
				<div class="detail-td-info">{{ dialogData.myComplaints.Times.timeFormat('yyyy-MM-dd HH:mm') }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">状态：</div>
				<div class="detail-td-info">{{ dialogData.myComplaints.StatusName }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">投诉原因：</div>
				<FroalaView :html="dialogData.myComplaints.Reason"></FroalaView>
			</div>
		</XM>
		<!-- 编辑我添加的考核 -->
		<AS :editData="dialogData.myAddAssess" @result="upData"></AS>
		<!-- 我的考核申诉弹框 -->
		<XM isFixed id="dialogAppeal" title="考核申诉" name="dialogAppeal" confirmBtnText="提交" cancelBtnText="取消" @onConfirm="appeal()">
			<div v-loading="examineLoading">
				<div class="detail-tr">
					<div class="detail-td-title">KPI项：</div>
					<div class="detail-td-info">{{ nowObj.data.Name }}</div>
				</div>
				<div class="detail-tr">
					<div class="detail-td-title">向谁申诉：</div>
					<div class="detail-td-info">
						<div v-if="nowObj.data.AssessCount">
							<el-select v-model="dialogData.appeal.AuditOr"><el-option v-for="item in nowObj.list" :label="item.Name" :value="item.UsId"></el-option></el-select>
						</div>
						<div v-else>{{ nowObj.data.AssessedName }}</div>
					</div>
				</div>
				<div class="detail-tr">
					<div class="detail-td-title">理 由：</div>
					<div class="detail-td-info"><el-input type="textarea" v-model="dialogData.appeal.Remark" placeholder="请输入内容"></el-input></div>
				</div>
				<!-- 记录 -->
				<div class="records" v-for="r in dialogDetail.Data">
					<div class="detail-tr">
						<div class="detail-td-title">时&nbsp;&nbsp;&nbsp;&nbsp;间：</div>
						<div class="detail-td-info">{{ r.Times.timeFormat('yyyy-MM-dd HH:mm') }}</div>
					</div>
					<div class="detail-tr">
						<div class="detail-td-title">结&nbsp;&nbsp;&nbsp;&nbsp;果：</div>
						<div class="detail-td-info">
							<span v-if="r.Status == 1" class="success">通过</span>
							<span v-else class="err">未通过</span>
						</div>
					</div>
					<div class="detail-tr">
						<div class="detail-td-title">理&nbsp;&nbsp;&nbsp;&nbsp;由：</div>
						<div class="detail-td-info">{{ r.AuditRemark }}</div>
					</div>
				</div>
			</div>
		</XM>
	
	</div>
</template>
<script>
export default {
    props:['Id'],
	components: {
		Header: () => import('@/components/Header'),
		CContent: () => import('@/manager/com/CContent'),
		CPages: () => import('@/manager/com/CPages'),
		FroalaView: () => import('@/components/XFroalaView'),
		XM: () => import('@/components/XModal'),
		AS: () => import('./editAssess'),
		SM: () => import('@/components/Selectors/MemberSelect'),
		kpiDetail:()=>import('./kpiDetail')
	},
	data() {
		return {
			loading: false,
			examineLoading: false,
			headerTitle: '我的考核',
			options: [
				{
					value: 0,
					label: '我的考核'
				},
				{
					value: 1,
					label: '我添加的考核'
				},
				{
					value: 2,
					label: '我收到的投诉'
				},
				{
					value: 3,
					label: '我添加的投诉'
				}
			],
			tableData: [],
			value1: null,
			tabType: 0,
			//请求数据
			pageData: {
				pageIndex: 1,
				pageSize: 10,
				totalNum: 0,
				STime: null,
				ETime: null,
				UsId: null
			},
			dialogData: {
				myKPIAssess: {
					Times: 's'
				},
				myComplaints: {
					Times: 's'
				},
				myAddAssess: null,
				appeal: {
					Id: null,
					Remark: null,
					AuditOr: null
				}
			},
			//当前操作的行对象
			nowObj: {
				index: -1,
				data: {},
				list: []
			},
			dialogDetail: {},
			appealLoading: false,
			activeId:null
		};
	},
	methods: {
		//时间段
		searchDate() {
			if (this.value1) {
				this.pageData.STime = this.value1[0];
				this.pageData.ETime = this.value1[1];
			} else {
				this.pageData.STime = this.pageData.ETime = null;
			}
			this.getData();
		},
		getMS(val) {
			if (val.length) {
				this.pageData.UsId = val.map(item => item.UId);
			} else {
				this.pageData.UsId = null;
			}
			this.getData();
		},
		//选项卡
		changeDispaly(val) {
			this.headerTitle = this.options[val].label;
			this.tabType = val;
			this.pageData.pageIndex = 1;
			// this.value1 = null;
			// this.pageData.UsId = this.pageData.STime = this.pageData.ETime = null;
			this.getData();
		},
		//我的考核详细
		handleDetail(index, data) {
			if (this.tabType == 0) {
				this.dialogData.myKPIAssess = data;
				const baseURL = window.location.protocol + '//' + window.location.hostname;
				this.activeId=data.UId
	            if(this.activeId){
					console.log(this.activeId)
					this.$modal.show('dialogDetail');
				}
				
			} else {
				this.dialogData.myComplaints = data;
				this.$modal.show('myComplaints');
			}
		},
		//我的考核申诉
		handleAppeal(index, data) {
			this.nowObj.index = index;
			this.nowObj.data = data;
			this.examineLoading = true;
			if (data.AssessCount) {
				this.$http
					.get('/Work/Performance/queryAssessBoss.ashx', {
						params: {
							UId: data.UId
						}
					})
					.then(resp => {
						if (resp.res == 0) {
							this.nowObj.list = resp.data;
						}
					});
			}
			//记录
			this.$http
				.post('/Work/Performance/getAssessRecord.ashx', {
					Id: data.UId
				})
				.then(resp => {
					if (resp.res == 0) {
						this.examineLoading = false;
						this.dialogDetail = resp.data;
						this.dialogDetail['Status'] = data.Status;
					}
				});
			this.dialogData.appeal.AuditOr = data.AessessOr;
			this.dialogData.appeal.Id = data.UId;
			this.dialogData.appeal.Remark = null;
			this.$modal.show('dialogAppeal');
		},
		//我的考核申诉
		appeal() {
			if (this.appealLoading) return;
			this.appealLoading = true;
			this.$http
				.post('/Work/Performance/appealAssess.ashx', this.dialogData.appeal)
				.then(resp => {
					if (resp.res == 0) {
						this.$notify({
							message: '申诉成功',
							type: 'success'
						});
						this.$modal.hide('dialogAppeal');
						this.upData();
					}
					this.appealLoading = false;
				})
				.catch(e => {
					this.appealLoading = false;
				});
		},
		//撤销操作
		cancelAppeal(index, data) {
			this.nowObj.index = index;
			this.nowObj.data = data;
			let txt = '';
			let url = ' ';
			let params = {
				Id: data.UId
			};
			if (this.tabType == 0) {
				txt = '此操作将撤销此申诉, 是否继续?';
				url = '/Work/Performance/undoAssess.ashx';
				params['Type'] = 2;
			} else if (this.tabType == 1) {
				txt = '此操作将撤销此考核, 是否继续?';
				url = '/Work/Performance/undoAssess.ashx';
			} else if (this.tabType == 3) {
				txt = '此操作将撤销此投诉, 是否继续?';
				url = '/Work/Performance/undoComplaints.ashx';
			}
			this.$confirm(txt, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$http.post(url, params).then(resp => {
						if (resp.res == 0) {
							this.$notify({
								message: '撤销成功',
								type: 'success'
							});
							this.upData();
						}
					});
				})
				.catch(() => {});
		},
		//编辑
		handleEdit(index, data) {
			this.nowObj.index = index;
			this.nowObj.data = data;
			this.dialogData.myAddAssess = data;
			this.dialogData.myAddAssess['tabType'] = this.tabType;
			this.$modal.show('editAssess');
		},
		getData() {
			this.loading = true;
			let params = {
				PageIndex: this.pageData.pageIndex,
				PageSize: this.pageData.pageSize,
				STime: this.pageData.STime,
				ETime: this.pageData.ETime,
				UsId: this.pageData.UsId
			};
			let url = '';
			if (this.tabType == 0) {
				url = '/Work/Performance/queryMyKPIAssess.ashx#';
			} else if (this.tabType == 1) {
				url = '/Work/Performance/queryMyAddAssess.ashx#';
			} else if (this.tabType == 2) {
				url = '/Work/Performance/queryMyComplaints.ashx#';
				params.UsId = null;
			} else if (this.tabType == 3) {
				url = '/Work/Performance/queryMyAddComplaints.ashx#';
			}
			this.$http.post(url, params).then(resp => {
				if (resp.res == 0) {
					this.tableData = resp.data.Data;
					this.pageData.totalNum = resp.data.TotalCount;
					this.loading = false;
				}
			});
		},
		//更新某行
		upData() {
			this.$http
				.post('/Work/Performance/getAssessById.ashx', {
					Id: this.nowObj.data.UId
				})
				.then(resp => {
					if (resp.res == 0) {
						Object.assign(this.tableData[this.nowObj.index], resp.data);
					}
				});
		},

	},
	mounted() {
		this.getData();
		if(this.$route.params.id){
            this.activeId=this.$route.params.id
			setTimeout(()=>{
				this.$modal.show('dialogDetail')
			},500)
		}
	},
	filters: {
		RESULT(statu, score) {
			switch (statu) {
				case '加分':
					return `加${score}分`;
					break;
				case '减分':
					return `减${score}分`;
					break;
				case '奖励':
					return `奖励${score}元`;
					break;
				case '罚款':
					return `罚款${score}元`;
					break;
				default:
					return '未知';
			}
		}
	},
	computed: {
		UserName() {
			if (this.tabType == 0) {
				return '考核人/投诉人';
			} else if (this.tabType == 1) {
				return '被考核人';
			} else if (this.tabType == 2) {
				return '投诉人';
			} else if (this.tabType == 3) {
				return '被投诉人';
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import './comm.less';
#dialogAppeal {
	.records {
		border-top: 1px solid #eee;
		padding-top: 1rem;
	}

	.detail-tr {
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		padding: 0.5rem;

		.detail-td-title {
			width: 8rem;
			text-align: right;
			margin-right: 0.5rem;
			font-size: 1.6rem;
			color: #9b9b9b;
			flex: 0 0 8rem;
		}

		.detail-td-info {
			flex: auto;
			display: flex;
			align-items: center;
			font-size: 1.4rem;

			.success {
				color: #75d030;
			}

			.err {
				color: #ed4b4b;
			}
		}
	}
}
#my-assessment {
	margin-top: 1rem;
	width: 100%;
	height: calc(100% - 1rem);
	.is-active {
		color: #409eff;
		border-top-color: #448ef5;
	}

	/deep/.cx-content {
		margin: 0 1rem 0 1rem;

		/deep/.title-box {
			border-bottom: none;
			padding-bottom: 0;

			.search {
				background-color: #ffffff;
				padding: 0 1rem;
				.search-item + .search-item {
					border-top: 1px solid #eee;
				}
				.search-item {
					display: flex;
					align-items: center;
					padding: 1rem 0;
					& > span {
						color: #333;
						font-size: 1.4rem;
						font-weight: bold;
						margin-right: 1.5rem;
						white-space: nowrap;
					}
					.el-date-editor {
						border-color: #f6f6f6 !important;
					}
					.mem-add {
						display: none;
					}
					.location {
						align-items: center;
					}
					.btn-custom {
						width: 35px;
						height: 20px;
						display: block;
						border: 1px solid #ccc;
						border-radius: 0.6rem;
						cursor: pointer;
						display: flex;
						justify-content: center;
						align-items: center;
						transition: all 0.3s;
						i {
							font-size: 1.4rem;
							color: #6d6d6d;
						}
						&:hover {
							border-color: #409eff;
						}
					}
				}
			}
		}
	}

	.el-table .cell {
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
		word-break: break-all;
		padding-left: 0 !important;
		padding-right: 10px;

		.cel-over {
			cursor: initial;
			color: #909399;
		}
	}
}
@media screen and (max-width: 1024px) {
	#my-assessment {
		/deep/.mobile-btns {
			.hi-more {
				display: none;
			}
		}
	}
}
</style>
