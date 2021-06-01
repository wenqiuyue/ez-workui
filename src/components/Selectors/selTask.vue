<!-- 任务选择器     潘悦 
模态框name：'chooseTask'-->
<!-- 父组件监听函数getTaskList 可获得返回值 -->
<template>
	<XModal :name="modalName" width="1200" :maxHeight="700" height="700" @beforeOpen="beforeOpen()" @closed="closed()" id="chooseTask">
		<div class="submit" @click="getCheckList()" v-if="taskList.length">确定</div>
		<div class="content" v-if="width > 1024">
			<h3>
				<p>任务选择</p>
				<span class="icon hiFont hi-close-thin" @click="close()"></span>
			</h3>
			<div class="content-body">
				<div class="content-left">
					<el-input v-model="searchValue" placeholder="搜索" @keyup.native="findProject()"></el-input>
					<h3 class="title">项目名称</h3>
					<div class="project" v-infinite-scroll="loadPro" infinite-scroll-disabled="isLoadingPro" infinite-scroll-distance="10">
						<p v-for="(item, index) in projectList" :key="index" :class="index == perojectIndex ? 'active' : ''" @click="toggleProject(index, item.proId)">
							{{ item.proName }}
						</p>
					</div>
				</div>
				<div class="content-center">
					<div class="center-top" v-if="!isSelf">
						<h3 class="title">默认查询</h3>
						<p :class="activeTask == '所有任务' ? 'active' : ''" @click="toggleType()">所有任务</p>
					</div>
					<div class="center-bottom">
						<h3 class="title">快捷查询</h3>
						<p v-for="(item, index) in chooseTypeList" :key="index" :class="item.value == activeTask ? 'active' : ''" @click="toggleType(item)">{{ item.value }}</p>
					</div>
				</div>
				<div class="content-right">
					<div class="right-top">
						<div class="sel">
							<svg class="icon" aria-hidden="true" style="font-size: 2rem;"><use xlink:href="#hi-statistics-pie-cr"></use></svg>
							<el-select v-model="jobClass" placeholder="任务分类" clearable :readonly="projectID == '' ? true : false">
								<el-option v-for="item in taskClassList" :label="item.Name" :value="item.JCId" :key="item.JCId"></el-option>
							</el-select>
						</div>
						<div class="sel">
							<svg class="icon" aria-hidden="true" style="font-size: 2rem;"><use xlink:href="#hi-tag-cr"></use></svg>
							<el-select v-model="jobStates" placeholder="任务状态" clearable>
								<el-option v-for="(item, index) in taskStatus" :key="item.value" :value="index" :label="item.name">
									<p style="display: flex;align-items: center;">
										<i :class="'hiFont ' + item.icon" :style="'margin-right:1rem;color:' + item.color"></i>
										<span>{{ item.name }}</span>
									</p>
								</el-option>
							</el-select>
						</div>
						<div class="sel">
							<i class="hiFont hi-user-add"></i>
							<el-cascader
								:options="memberList"
								:props="props"
								v-model="frontmanId"
								:collapse-tags="tag"
								clearable
								@change="getId"
								:show-all-levels="false"
								placeholder="执行人"
							></el-cascader>
						</div>
						<div class="sel">
							<svg class="icon" aria-hidden="true" style="font-size: 2rem;"><use xlink:href="#hi-priority-cr"></use></svg>
							<el-select v-model="fir" placeholder="优先级" clearable>
								<el-option v-for="(item, index) in priority" :key="item.name" :value="index * 1 + 1" :label="item.name"></el-option>
							</el-select>
						</div>

						<div class="sel">
							<i></i>
							<el-date-picker v-model="startTime" type="date" placeholder="开始时间" clearable></el-date-picker>
						</div>

						<div class="sel">
							<i></i>
							<el-date-picker v-model="endTime" type="date" placeholder="结束时间" clearable></el-date-picker>
						</div>
						<div class="searchBox">
							<input v-model="keywords" placeholder="任务名" />
							<span @click="search()">搜索</span>
						</div>
					</div>
					<div class="right-bottom">
						<div class="split">
							<p>搜索结果:</p>
							<div>
								<p>已选择:{{ selTaskList.length }}条</p>
								<el-select v-model="orderByTime" placeholder="选择排序方式" class="sort-select">
									<el-option v-for="item in sortArr" :key="item.value" :label="item.value" :value="item.orderByTime"></el-option>
								</el-select>
							</div>
						</div>
						<div class="results" v-loading="loading">
							<el-checkbox-group
								v-infinite-scroll="load"
								style="overflow:auto"
								infinite-scroll-disabled="isLoading"
								infinite-scroll-distance="10"
								v-model="selTaskList"
								@change="getSelTaskList"
								v-if="taskList.length > 0"
							>
								<el-checkbox :label="item" v-for="(item, index) in taskList" :key="index" class="taskListRoot">
									<i :class="'hiFont ' + $D.ITEM('task_status', item.Schedule).icon" :style="'color:' + $D.ITEM('task_status', item.Schedule).color"></i>
									<p :title="item.Name">{{ item.Name }}</p>
									<div class="span">
										<img v-lazy="$url + item.Picture" />
										<i>{{ item.FrontmanName }}</i>
									</div>
								</el-checkbox>
							</el-checkbox-group>
							<div class="empty" v-else>
								<img src="../../assets/img/emptyTask.png" />
								<p>暂无任务</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 移动端 -->
		<div class="mobile-content" v-else>
			<h3>
				<p>
					<i class="el-icon-arrow-left" @click="back()"></i>
					<span>任务选择</span>
				</p>
				<span class="icon hiFont hi-close-thin" @click="close"></span>
			</h3>
			<div class="mobile-content-body">
				<div class="wrapper0" v-if="tabIndex == 0">
					<el-input v-model="searchValue" placeholder="搜索" @keyup.native="findProject()"></el-input>
					<h3 class="title">项目名称</h3>
					<div class="project" v-infinite-scroll="loadPro" infinite-scroll-disabled="isLoadingPro" infinite-scroll-distance="5">
						<p v-for="(item, index) in projectList" :key="index" :class="index == perojectIndex ? 'active' : ''" @click="toggleProject(index, item.proId)">
							{{ item.proName }}
						</p>
					</div>
				</div>
				<div class="wrapper1" v-if="tabIndex == 1">
					<div class="center-top" v-if="!isSelf">
						<h3 class="title">默认查询</h3>
						<p :class="activeTask == '所有任务' ? 'active' : ''" @click="toggleType()">所有任务</p>
					</div>
					<div class="center-bottom">
						<h3 class="title">快捷查询</h3>
						<p v-for="(item, index) in chooseTypeList" :key="index" :class="item.value == activeTask ? 'active' : ''" @click="toggleType(item)">{{ item.value }}</p>
					</div>
				</div>
				<div class="wrapper2" v-if="tabIndex == 2">
					<div class="right-top">
						<div class="searchBox">
							<input v-model="keywords" placeholder="任务名" />
							<span @click="search()">搜索</span>
						</div>
						<div style="display: flex;justify-content: flex-end;margin: 1rem 1.5rem 0rem;">
							<el-switch v-model="showDetail" active-color="#448EF5" inactive-color="#8a8a8a" active-text="详细搜索"></el-switch>
						</div>
						<div class="detailSearch" v-if="showDetail">
							<div class="sel">
								<svg class="icon" aria-hidden="true" style="font-size: 2rem;"><use xlink:href="#hi-statistics-pie-cr"></use></svg>
								<el-select v-model="jobClass" placeholder="任务分类" clearable :readonly="projectID == '' ? true : false">
									<el-option v-for="item in taskClassList" :label="item.Name" :value="item.JCId" :key="item.JCId"></el-option>
								</el-select>
							</div>
							<div class="sel">
								<svg class="icon" aria-hidden="true" style="font-size: 2rem;"><use xlink:href="#hi-tag-cr"></use></svg>
								<el-select v-model="jobStates" placeholder="任务状态" clearable>
									<el-option v-for="(item, index) in taskStatus" :key="item.value" :value="index" :label="item.name">
										<p style="display: flex;align-items: center;">
											<i :class="'hiFont ' + item.icon" :style="'margin-right:1rem;color:' + item.color"></i>
											<span>{{ item.name }}</span>
										</p>
									</el-option>
								</el-select>
							</div>
							<div class="sel">
								<i class="hiFont hi-user-add"></i>
								<el-cascader
									:options="memberList"
									:props="props"
									v-model="frontmanId"
									:collapse-tags="tag"
									clearable
									@change="getId"
									:show-all-levels="false"
									placeholder="执行人"
								></el-cascader>
							</div>
							<div class="sel">
								<svg class="icon" aria-hidden="true" style="font-size: 2rem;"><use xlink:href="#hi-priority-cr"></use></svg>
								<el-select v-model="fir" placeholder="优先级" clearable>
									<el-option v-for="(item, index) in priority" :key="item.name" :value="index * 1 + 1" :label="item.name"></el-option>
								</el-select>
							</div>
							<div class="sel">
								<i></i>
								<el-date-picker v-model="startTime" type="date" placeholder="开始时间" clearable></el-date-picker>
							</div>
							<div class="sel">
								<i></i>
								<el-date-picker v-model="endTime" type="date" placeholder="结束时间" clearable></el-date-picker>
							</div>
						</div>
					</div>
					<div class="right-bottom">
						<div class="split">
							<p>搜索结果:</p>
							<div>
								<p>已选择:{{ selTaskList.length }}条</p>
								<el-select v-model="orderByTime" placeholder="选择排序方式" class="sort-select">
									<el-option v-for="item in sortArr" :key="item.value" :label="item.value" :value="item.orderByTime"></el-option>
								</el-select>
							</div>
						</div>
						<div class="mobile-results" v-loading="loading">
							<el-checkbox-group
								v-infinite-scroll="load"
								infinite-scroll-disabled="isLoading"
								infinite-scroll-distance="0"
								v-model="selTaskList"
								@change="getSelTaskList"
								v-if="taskList.length"
							>
								<el-checkbox :label="item" v-for="(item, index) in taskList" :key="index">
									<i :class="'hiFont ' + $D.ITEM('task_status', item.Schedule).icon" :style="'color:' + $D.ITEM('task_status', item.Schedule).color"></i>
									<p :title="item.Name">{{ item.Name }}</p>
									<div class="span">
										<img v-lazy="$url + item.Picture" />
										<i>{{ item.FrontmanName }}</i>
									</div>
								</el-checkbox>
							</el-checkbox-group>
							<div class="empty" v-else>
								<img src="../../assets/img/emptyTask.png" />
								<p>暂无任务</p>
							</div>
							<p v-if="!more && taskList.length" class="g-loaded">已加载全部</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</XModal>
</template>

<script>
import XModal from '@/components/XModal';
export default {
	name: 'taskChoose',
	props: {
		isRadio: {
			//是否为单选
			type: Boolean,
			default: true
		},
		isSelf: {
			//是否只显示与自己相关
			type: Boolean,
			default: false
		},
		isSort: {
			//只显示有顺序的任务
			type: Boolean,
			default: false
		},
		userID: {
			//加载指定人的任务
			type: Number,
			default: null
		},
		reportId: {
			// type:Number
			// default:null
		},
		reportDate: {
			// type:String
			// default:null
		},
		modalName: {
			type: String,
			default: 'chooseTask'
		}
	},
	components: {
		XModal
	},
	data() {
		return {
			searchValue: '',
			loading: false,
			taskStatus: [],
			selTaskList: [], //获得所选任务
			taskList: this.$D.LIST('task_status'),
			priority: this.$D.LIST('g_priority'),
			chooseTypeList: [
				{
					type: 1,
					value: '我负责的任务'
				},
				{
					type: 0,
					value: '我创建的任务'
				},
				{
					type: 2,
					value: '我审核的任务'
				},
				{
					type: 3,
					value: '我监督的任务'
				},
				{
					type: 4,
					value: '我参与的任务'
				},
				{
					type: 5,
					value: '我关注的任务'
				}
			],
			isload: true,
			activeTask: '所有任务', //任务选择
			projectList: [], //项目列表
			searchProList: [], //搜索项目列表
			allProList: [], //所有项目列表
			perojectIndex: 0, //项目选择
			memberList: [], //成员列表
			taskClassList: [], //任务状态分类
			//查询参数
			projectID: '', //项目id
			queryType: '', //任务查询类型id
			jobClass: '', //任务分类
			jobStates: '', //任务状态
			frontmanId: '', //执行人id
			frontmanIdArr: '', //执行人id
			startTime: '', //开始时间
			endTime: '', //结束时间
			fir: '', //任务优先级
			keywords: '',
			orderByTime: 1, //是否按照创建时间排序
			inputSearch: '', //搜索框
			currentPage: 1, //任务接口当前页
			more: true,
			isLoading: false,
			isMoblie: false, //是否移动端
			tabIndex: 0, //移动端页面切换
			showDetail: false, //移动端详细搜索
			width: '',
			projectCurrentPage: 1, //项目分页
			axiosNum: 1,
			isLoadingPro: false,
			morePro: true,
			props: {
				multiple: true
			},
			tag: true,
			sortArr: [
				{
					value: '工作顺序',
					orderByTime: 1
				},
				{
					value: '创建时间',
					orderByTime: 2
				},
				{
					value: '结束时间',
					orderByTime: 3
				}
			]
		};
	},
	watch: {
		projectID() {
			if (this.projectID) {
				this.jobClass = '';
				this.taskClassList = [];
				this.getTaskStatusList();
			}
			this.taskList = [];
			this.currentPage = 1;
			this.getTasks();

			if (this.isRadio) {
				this.selTaskList = [];
			}
		},
		queryType() {
			if (this.isload) {
				this.currentPage = 1;
				this.taskList = [];
				this.getTasks();

				if (this.isRadio) {
					this.selTaskList = [];
				}
			}
		},
		jobClass() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		},
		jobStates() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		},
		frontmanIdArr() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		},
		startTime() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		},
		endTime() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		},
		fir() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		},
		orderByTime() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		},
		width() {
			if (this.width < 991) {
				this.isMoblie = true;
			} else {
				this.isMoblie = false;
			}
		}
	},
	methods: {
		getTasks() {
			//默认获取全部任务
			this.loading = true;
			this.isLoading = false;
			let params = {
				projectID: this.projectID,
				queryType: this.queryType,
				jobClass: this.jobClass,
				jobStates: this.jobStates,
				frontmanId: this.frontmanIdArr.length == 0 ? '' : this.frontmanIdArr,
				fir: this.fir,
				startTime: this.startTime,
				endTime: this.endTime,
				orderByTime: this.orderByTime,
				inputSearch: this.keywords,
				currentPage: this.currentPage,
				hasSequence: this.isSort,
				bulletinTime: this.reportDate,
				bulletinUserID: this.reportId
			};
			if (!(this.reportDate && this.reportId)) {
				delete params.bulletinTime;
				delete params.bulletinUserID;
			}
			this.$http.post('/General/TaskSelector.ashx', params).then(res => {
				if (res.res == 0) {
					this.loading = false;
					this.taskList = this.taskList.concat(res.data.jobs);
					if (this.taskList.length >= res.data.page.TotalCount) {
						this.more = false;
					}
				}
			});
		},
		load() {
			this.isLoading = true;
			if (this.more) {
				this.currentPage++;
				setTimeout(() => {
					this.getTasks();
				}, 500);
			}
		},
		mobileLoad() {
			console.log(1);
		},
		loadPro() {
			this.isLoadingPro = true;
			if (this.morePro) {
				this.projectCurrentPage++;
				this.axiosNum++;
				setTimeout(() => {
					this.getProjectList();
				}, 500);
			}
		},
		getProjectList() {
			//获取项目列表
			this.isLoadingPro = false;
			this.$http
				.post('/General/GetProjectSelector.ashx', {
					// qxcs: 1,
					CurrentPage: this.projectCurrentPage,
					PageCount: 99999
				})
				.then(res => {
					if (res.res == 0) {
						this.allProList = this.allProList.concat(res.data.message);
						if (!(this.allProList[0].proId == '')) {
							this.allProList.unshift({
								proId: '',
								proName: '全部项目'
							});
						}
						if (this.allProList.length >= res.data.PageData.TotalCount) {
							this.morePro = false;
						}
						this.projectList = this.allProList;
					}
				});
		},
		getMemberList() {
			//获取成员列表
			this.$http.get('/General/GetUserAllGroupByReachName.ashx').then(res => {
				if (res.res == 0) {
					this.memberList = res.data;
					let arr = [];
					this.memberList.forEach(item => {
						let cc = [];
						item.user.forEach(val => {
							cc.push({
								value: val.UsId,
								label: val.Name
							});
						});
						arr.push({
							value: item.reach.RId,
							label: item.reach.Name,
							children: cc
						});
					});
					this.memberList = arr;
				}
			});
		},
		getTaskStatusList() {
			//获得任务状态分类
			this.$http
				.post('/Project/Job/taskGetClass.ashx', {
					projectID: this.projectID
				})
				.then(res => {
					if (res.res == 0) {
						this.taskClassList = res.data.jobClass;
					}
				});
		},
		toggleType(item) {
			//切换任务类型
			this.tabIndex++;
			this.isload = true;
			if (item == undefined) {
				this.activeTask = '所有任务';
				this.queryType = '';
				return;
			}
			this.activeTask = item.value;
			this.queryType = item.type;
		},
		toggleProject(index, id) {
			//切换项目
			this.perojectIndex = index;
			this.projectID = id;
			this.tabIndex++;
		},
		getSelTaskList() {
			//是否单选
			if (this.isRadio) {
				if (this.selTaskList.length > 1) {
					this.selTaskList = this.selTaskList.splice(-1, 1);
				}
			}
		},
		getCheckList() {
			//获取所选任务
			this.$modal.hide(this.modalName);
			this.$emit('getTaskList', this.selTaskList);
			this.taskList = [];
			this.selTaskList = [];
		},
		getSelTask() {
			// this.taskList[i].checked = !item.checked
			// //多选
			// if (!this.isRadio) {
			// 	if (item.checked) {
			// 		this.selTaskList.push(item)
			// 	} else {
			// 		for (let j = 0; j < this.selTaskList.length; j++) {
			// 			if (this.selTaskList[j].JId == item.JId) {
			// 				this.selTaskList.splice(j, 1)
			// 			}
			// 		}
			// 	}
			// }
			// if (this.isRadio) {
			// 	this.selTaskList.length--
			// }
		},
		findProject() {
			this.searchProList = [];
			if (this.searchValue == '') {
				this.projectList = this.allProList;
			} else {
				this.allProList.forEach(item => {
					if (item.proName.indexOf(this.searchValue) !== -1) {
						let bool = false;
						for (let i = 0; i < this.searchProList.length; i++) {
							if (this.searchProList[i].proId == item.proId) {
								bool = true;
								break;
							}
						}
						if (!bool) {
							this.searchProList.push(item);
						}
					}
				});
				this.projectList = this.searchProList;
			}
		},
		getId() {
			//获得执行人ID
			let arr = [];
			this.frontmanId.forEach(item => {
				arr.push(item[1]);
			});
			this.frontmanIdArr = arr;
		},
		// 只选择与自己相关的内容
		selfStatu() {
			if (this.isSelf) {
				for (let i = 0; i < this.chooseTypeList.length; i++) {
					if (this.chooseTypeList[i].type == 5) {
						this.chooseTypeList.splice(i, 1);
					}
				}
				this.activeTask = this.chooseTypeList[0].value;
				this.queryType = this.chooseTypeList[0].type;
			}
		},
		back() {
			//移动端返回
			if (this.tabIndex == 0) {
				return;
			}
			this.tabIndex--;
		},
		close() {
			this.$modal.hide(this.modalName);
		},
		beforeOpen() {
			this.taskList = [];
			this.selTaskList = [];
			this.width = document.documentElement.clientWidth;
			this.$nextTick(() => {
				if (this.userID) {
					this.frontmanIdArr = [];
					this.frontmanIdArr.push(this.userID);
				} else {
					this.selfStatu();
					this.getTasks();
				}
			});
			this.getMemberList();
			this.getProjectList();
			this.taskStatus = this.$D.LIST('task_status');
			this.isload = false;
		},
		closed() {
			this.taskList = [];
		},
		search() {
			this.currentPage = 1;
			this.taskList = [];
			if (this.isRadio) {
				this.selTaskList = [];
			}
			this.getTasks();
		}
	},
	beforeCreate() {
		this.taskStatus = this.$D.LIST('task_status');
	},
	mounted() {
		this.sortValue = this.sortArr[0].orderByTime;
		this.width = document.documentElement.clientWidth;
		window.onresize = () => {
			this.width = document.documentElement.clientWidth;
		};
	}
};
</script>

<style scoped="scoped" lang="less">
#chooseTask {
	/deep/.ctn {
		padding: 0;
	}
	.submit {
		width: 12rem;
		height: 4.2rem;
		background: rgba(68, 142, 245, 1);
		box-shadow: 0px 2px 4px 0px rgba(204, 204, 204, 1);
		border-radius: 4px;
		font-size: 1.8rem;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		line-height: 4.2rem;
		position: absolute;
		bottom: 2.2rem;
		right: 2rem;
		cursor: pointer;
		z-index: 999;
	}
	.content {
		box-sizing: border-box;
		position: relative;

		.active {
			background: #f7f7f7;
			color: #448ef5 !important;
			font-size: 1.8rem;
			font-weight: bold;
		}

		h3 {
			display: flex;
			height: 7rem;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #ccc;

			p {
				font-size: 2.2rem;
				color: #4a4a4a;
				padding-left: 1.7rem;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
			}

			span {
				font-size: 2.4rem;
				color: #e1e0e0;
				padding-right: 1.7rem;
				cursor: pointer;
			}

			span:hover {
				color: #4a4a4a;
			}
		}

		.content-body {
			// padding: 0 1.7rem;
			display: flex;
			padding-right: 1.5rem;
			min-height: 63rem;

			.title {
				color: #4a4a4a;
				font-size: 2rem;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				height: 2.8rem;
				border: none;
			}

			.content-left {
				width: 15%;
				border-right: 1px solid #ccc;

				/deep/.el-input {
					width: 90%;
					margin: 0 auto;
					margin-top: 2rem;
					margin-bottom: 3rem;
					margin-left: 1rem;

					.el-input__inner {
						background: #ffffff;
						border: 1px solid #ccc !important;
						border-radius: 0.4rem;
						height: 3.2rem;
						font-size: 1.4rem;
						color: #cccccc;
						font-family: PingFangSC-Regular, PingFang SC;
					}
				}

				.title {
					padding-left: 1.5rem;
					margin-bottom: 1rem;
				}

				.project {
					overflow: auto;
					max-height: 35rem;

					&::-webkit-scrollbar {
						background: #fff;
						width: 5px;
					}

					&::-webkit-scrollbar-track {
						background: #fff;
						width: 5px;
					}

					&::-webkit-scrollbar-thumb {
						background: #fff;
						border-radius: 5px;
						width: 5px;
					}

					&:hover::-webkit-scrollbar-thumb {
						background: #eee;
					}
				}

				p {
					padding-left: 1.5rem;
					line-height: 3.6rem;
					color: #6d6d6d;
					font-size: 1.6rem;
					cursor: pointer;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				p:hover {
					background: #f7f7f7;
					color: #448ef5 !important;
					// font-size: 1.8rem;
					font-weight: bold;
				}
			}

			.content-center {
				width: 15%;
				border-right: 1px solid #ccc;
				height: 63rem;

				.title {
					margin-bottom: 1rem;
					padding-left: 1.5rem;
				}

				p {
					line-height: 3.5rem;
					color: #6d6d6d;
					font-size: 1.6rem;
					cursor: pointer;
					padding-left: 1.5rem;
				}

				p:hover {
					background: #f7f7f7;
					color: #448ef5 !important;
					// font-size: 1.8rem;
					font-weight: bold;
				}

				.center-top {
					.title {
						margin-top: 2rem;
						margin-bottom: 1rem;
					}

					p {
						line-height: 4.5rem;
						height: 4.5rem;
					}
				}

				.center-bottom {
					margin-top: 2rem;
				}
			}

			.content-right {
				width: 70%;
				padding-top: 2rem;

				.right-top {
					display: flex;
					flex-wrap: wrap;
					padding-left: 1.5rem;
					justify-content: space-between;

					.sel {
						width: 23%;
						height: 3.2rem;
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-radius: 0.4rem;
						background: #f8f8f8;
						margin-bottom: 1.7rem;

						svg {
							font-size: 1.9rem;
							padding-left: 1rem;
						}

						i {
							font-size: 1.9rem;
							padding-left: 1rem;
						}

						/deep/ .el-input {
							height: 3.2rem !important;

							.el-input__inner {
								height: 3.2rem !important;
								background: #f8f8f8;
								line-height: 3.2rem;
								font-size: 1.3rem;
								font-family: PingFangSC-Semibold, PingFang SC;
							}
						}

						/deep/.el-input__icon {
							line-height: 3.2rem;
							float: right;
						}

						/deep/.el-select {
							height: 3.2rem;
							flex: 1;

							/deep/.el-input--suffix {
								height: 3.2rem;
							}
						}
						/deep/.el-cascader {
							height: 3.2rem;
							flex: 1;

							.el-input {
								display: flex;
							}

							.el-cascader__tags {
								flex-wrap: nowrap;

								.el-input__inner {
									height: 3.2rem !important;
								}
							}
						}
					}

					.searchBox {
						width: 48%;
						height: 3.2rem;
						border-radius: 0.4rem;
						border: 1px solid #448ef5;
						display: flex;
						justify-content: space-between;
						display: flex;
						align-items: center;
						padding-left: 0.5rem;

						input {
							outline: none;
							border: none;
							height: 3.2rem;
							font-size: 1.4rem;
							text-indent: 0.5em;
							color: #6d6d6d;
						}

						span {
							width: 8.9rem;
							height: 3.3rem;
							background: linear-gradient(134deg, rgba(97, 193, 254, 1) 0%, rgba(66, 139, 244, 1) 100%);
							border-radius: 0px 0.4rem 0.4rem 0px;
							font-size: 14px;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: rgba(255, 255, 255, 1);
							line-height: 3.2rem;
							text-align: center;
							cursor: pointer;
							transition: all 0.3s;
						}
					}
				}

				.right-bottom {
					padding-left: 1.2rem;
					position: relative;
					.split {
						display: flex;
						margin-bottom: 1.4rem;
						line-height: 2.2rem;
						justify-content: space-between;

						p {
							line-height: 4rem;
							font-size: 1.6rem;
							font-family: PingFang-SC-Medium, PingFang-SC;
							font-weight: 500;
							color: rgba(138, 138, 138, 1);
						}

						div {
							display: flex;
							/deep/.el-select {
								width: 10rem;

								/deep/.el-input__inner {
									background: #ffffff;
									border-bottom: none;
									font-size: 1.4rem;
									color: rgba(0, 0, 0, 0.25);
									padding-right: 2rem;
									text-align: center;
									height: 4rem !important;
									border: none !important;
								}

								.el-input__icon {
									width: 1.5rem;
									position: relative;
								}
							}
							p {
								font-size: 1.4rem;
							}
						}
					}
					.sort-select {
						.el-input__suffix-inner {
							position: relative;
							top: -4px;
						}
					}

					.results {
						.taskListRoot {
							/deep/.el-checkbox__label {
								display: flex;
								align-items: center;
								width: 91%;

								> p {
									flex: 1;
									margin-left: 16px;
									margin-right: 16px;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}

								> .span {
									display: flex;
									flex-direction: column;

									> img {
										width: 40px;
										height: 40px;
										border-radius: 20px;
									}
								}
							}
						}
					}

					.empty {
						img {
							width: 21.7rem;
							height: 20.1rem;
							margin: 0 auto;
							margin-top: 3rem;
							display: block;
						}

						p {
							font-size: 1.6rem;
							font-family: PingFang-SC-Medium, PingFang-SC;
							font-weight: 500;
							color: rgba(165, 165, 165, 1);
							margin-top: 3.3rem;
							text-align: center;
						}
					}

					/deep/.el-checkbox-group {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						max-height: 35rem;

						&::-webkit-scrollbar {
							background: #fff;
							width: 5px;
						}

						&::-webkit-scrollbar-track {
							background: #fff;
							width: 5px;
						}

						&::-webkit-scrollbar-thumb {
							background: #fff;
							border-radius: 5px;
							width: 5px;
						}

						&:hover::-webkit-scrollbar-thumb {
							background: #eee;
						}
					}

					/deep/.el-checkbox {
						width: 49%;
						height: 6rem;
						box-shadow: 0px 2px 8px 0px rgba(242, 242, 242, 1);
						border-radius: 0.6rem;
						display: flex;
						box-sizing: border-box;
						padding: 0.5rem 1rem;
						display: flex;
						align-items: center;
						margin-right: 0;
						margin-bottom: 1.6rem;

						/deep/.el-checkbox__label {
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding-left: 0;

							i {
								color: #ffa940;
								font-size: 1.8rem;
								margin-right: 1.5rem;
								line-height: 1.8rem;
								margin-left: 1.2rem;
							}

							p {
								width: 18rem;
								color: #4a4a4a;
								font-size: 1.4rem;
								line-height: 1.8rem;
								font-weight: bold;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							.span {
								width: 5rem;
								height: 5rem;
								display: flex;
								align-items: center;
								flex-direction: column;
								justify-content: center;

								img {
									width: 2.8rem;
									height: 2.8rem;
									border-radius: 50%;
									overflow: hidden;
								}

								i {
									color: #4a4a4a;
									font-size: 1.2rem;
									margin-right: 0;
									margin-left: 0;
								}
							}
						}
					}
				}
			}
		}
	}
	.mobile-content {
		display: none;
	}
}

@media all and (max-width: 1024px) {
	#chooseTask{
		.content {
			display: none ;
			.results {
				display: none;
			}
		}
		.mobile-content {
			display: flex;
			flex-direction: column;
			height: 100% !important;
		
			.active {
				background: #f7f7f7;
				color: #448ef5 !important;
				font-size: 1.8rem;
				font-weight: bold;
			}
		
			h3 {
				height: 6rem;
				border-bottom: 1px solid #ccc;
				padding: 0 1.5rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 1.6rem;
		
				p {
					display: flex;
					align-items: center;
		
					i {
						color: #ccc;
						font-size: 2.5rem;
						margin-right: 1rem;
					}
		
					span {
						font-size: 1.8rem;
						color: #448ef5;
					}
				}
		
				span {
					color: #ccc;
				}
			}
		
			.mobile-content-body {
				height: calc(100% - 6rem);
				display: flex;
				overflow: auto;
				.wrapper0 {
					flex: 1;
					width: 100%;
		
					/deep/.el-input {
						width: 90%;
						margin: 0 5%;
						margin-top: 2rem;
		
						.el-input__inner {
							background: #ffffff;
							border: 1px solid #448ef5 !important;
							border-radius: 0.4rem;
							height: 4rem;
							font-size: 1.4rem;
							color: #cccccc;
							font-family: PingFangSC-Regular, PingFang SC;
						}
					}
		
					.title {
						padding-left: 1.5rem;
						margin-bottom: 1rem;
					}
		
					.project {
						overflow: auto;
						max-height: 45rem;
		
						&::-webkit-scrollbar {
							background: #fff;
							width: 5px;
						}
		
						&::-webkit-scrollbar-track {
							background: #fff;
							width: 5px;
						}
		
						&::-webkit-scrollbar-thumb {
							background: #fff;
							border-radius: 5px;
							width: 5px;
						}
		
						&:hover::-webkit-scrollbar-thumb {
							background: #eee;
						}
					}
		
					p {
						padding: 0 2rem;
						height: 4.5rem;
						line-height: 4.5rem;
						color: #6d6d6d;
						font-size: 1.6rem;
						cursor: pointer;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
		
				.wrapper1 {
					flex: 1;
					width: 100%;
		
					.title {
						padding: 0 1.5rem;
						height: 4.5rem;
						font-size: 1.8rem;
					}
		
					p {
						line-height: 4.5rem;
						color: #6d6d6d;
						font-size: 1.6rem;
						cursor: pointer;
						padding-left: 2rem;
						width: 100%;
					}
		
					.center-top {
						.title {
							border: none;
						}
		
						p {
							line-height: 5rem;
							height: 5rem;
						}
					}
				}
		
				.wrapper2 {
					flex: 1;
					display: flex;
					flex-direction: column;
					height: 100%;
					width: 100%;
		
					.right-top {
						.searchBox {
							width: 92%;
							margin: 0 3%;
							height: 3.2rem;
							border-radius: 0.4rem;
							border: 1px solid #448ef5;
							display: flex;
							justify-content: space-between;
							margin-top: 1rem;
							display: flex;
							align-items: center;
							padding-left: 0.5rem;
		
							input {
								outline: none;
								border: none;
								height: 3rem;
								font-size: 1.4rem;
								text-indent: 0.5em;
								color: #6d6d6d;
							}
		
							span {
								width: 8.9rem;
								height: 3.3rem;
								background: linear-gradient(134deg, rgba(97, 193, 254, 1) 0%, rgba(66, 139, 244, 1) 100%);
								border-radius: 0px 0.4rem 0.4rem 0px;
								font-size: 14px;
								font-family: PingFangSC-Semibold, PingFang SC;
								font-weight: 600;
								color: rgba(255, 255, 255, 1);
								line-height: 3.2rem;
								text-align: center;
								cursor: pointer;
								transition: all 0.3s;
							}
						}
		
						.detailSearch {
							display: flex;
							justify-content: space-between;
							flex-wrap: wrap;
							// margin-top: 2rem;
		
							.sel {
								width: 45%;
								margin: 0 auto;
								height: 3.2rem;
								display: flex;
								border-radius: 0.4rem;
								background: #f8f8f8;
								margin-top: 1.5rem;
		
								i,
								svg {
									font-size: 1.9rem;
									padding-left: 1rem;
									padding-top: 0.5rem;
								}
		
								/deep/ .el-input {
									height: 3.2rem !important;
		
									.el-input__inner {
										height: 3.2rem !important;
										background: #f8f8f8;
										line-height: 3.2rem;
										font-size: 1.3rem;
										font-family: PingFangSC-Semibold, PingFang SC;
										// font-weight: 600;
									}
								}
		
								/deep/.el-input__icon {
									line-height: 3.2rem;
									float: right;
								}
		
								/deep/.el-select {
									height: 3.2rem;
									flex: 1;
		
									/deep/.el-input--suffix {
										height: 3.2rem;
									}
								}
							}
						}
					}
		
					.right-bottom {
						position: relative;
						height: 80%;
						display: flex;
						flex-direction: column;
		
						.split {
							display: flex;
							margin-bottom: 1.4rem;
							line-height: 2.2rem;
							justify-content: space-between;
							padding: 0 1rem;
							p {
								line-height: 4rem;
								font-size: 1.6rem;
								font-family: PingFang-SC-Medium, PingFang-SC;
								font-weight: 500;
								color: rgba(138, 138, 138, 1);
							}
		
							div {
								display: flex;
								/deep/.el-select {
									width: 10rem;
		
									/deep/.el-input__inner {
										background: #ffffff;
										border-bottom: none;
										font-size: 1.4rem;
										color: rgba(0, 0, 0, 0.25);
										padding-right: 2rem;
										text-align: center;
										height: 4rem !important;
										border: none !important;
									}
		
									.el-input__icon {
										width: 1.5rem;
										position: relative;
									}
								}
								p {
									font-size: 1.4rem;
								}
							}
						}
		
						.results {
							overflow: hidden;
						}
		
						.empty {
							img {
								width: 21.7rem;
								height: 20.1rem;
								margin: 0 auto;
								margin-top: 3rem;
								display: block;
							}
		
							p {
								font-size: 1.6rem;
								font-family: PingFang-SC-Medium, PingFang-SC;
								font-weight: 500;
								color: rgba(165, 165, 165, 1);
								margin-top: 3.3rem;
								text-align: center;
							}
						}
						.mobile-results {
							height: 98%;
							overflow: auto;
						}
						/deep/.el-checkbox-group {
							height: 98%;
							overflow: auto;
						}
						/deep/.el-checkbox {
							width: 94%;
							margin: 0 3%;
							height: 6rem;
							box-shadow: 0px 2px 8px 0px rgba(242, 242, 242, 1);
							border-radius: 0.6rem;
							display: flex;
							box-sizing: border-box;
							padding: 0.5rem 1rem;
							display: flex;
							align-items: center;
							margin-right: 0;
							margin-bottom: 1rem;
		
							/deep/.el-checkbox__label {
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: space-between;
								padding-left: 0;
		
								i {
									color: #ffa940;
									font-size: 1.8rem;
									line-height: 1.8rem;
									margin: 0 1.2rem;
								}
		
								p {
									width: 18rem;
									color: #4a4a4a;
									font-size: 1.4rem;
									line-height: 1.8rem;
									font-weight: bold;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
		
								.span {
									width: 5rem;
									height: 5rem;
									display: flex;
									align-items: center;
									flex-direction: column;
									justify-content: center;
		
									img {
										width: 2.8rem;
										height: 2.8rem;
										border-radius: 50%;
										overflow: hidden;
									}
		
									i {
										color: #4a4a4a;
										margin-right: 0;
										font-size: 1.2rem;
										margin-left: 0;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
@media  screen and (max-width: 768px) {
	#chooseTask .mobile-content .mobile-content-body .wrapper2 .right-bottom .mobile-results{
		height: 80% ;
	}
}
</style>
