<template>
	<div>
		<div class="defect">
			<div class="def_left">
				<div class="title">缺陷</div>
				<div class="title2">
					所有缺陷
					<i class="el-icon-circle-plus" style="color: #448EF5;" @click="openDefect"></i>
				</div>
				<div class="title3">
					<div class="list" v-for="item in leftData" :key="item.Name" >
						<div class="top">
							<!-- 父级ul的开关 -->
							<div>
								<i class="el-icon-caret-bottom" v-if="item.Flag == true" @click="titleShow(item)"></i>
								<i class="el-icon-caret-right" v-else @click="titleShow(item)"></i>
								{{ item.Name }}
							</div>
							<div>
								<i class="el-icon-circle-plus-outline" @click.stop="openDefect(1)"></i>
								<el-dropdown trigger="click" placement="right-start" :hide-on-click="false">
									<span class="el-dropdown-link"><i class="el-icon-more"></i></span>
									<el-dropdown-menu slot="dropdown">
										<template v-for="itemq in CheckOption">
											<el-dropdown-item v-if="!itemq.Children" @click.native="openDefect(itemq.Type)">
												<i :class="itemq.Icon"></i>
												{{ itemq.Name }}
											</el-dropdown-item>
											<el-dropdown-item v-else>
												<el-dropdown placement="right-start" trigger="click" :hide-on-click="false">
													<span class="el-dropdown-link">
														<i :class="itemq.Icon"></i>
														{{ itemq.Name }}
													</span>
													<el-dropdown-menu slot="dropdown">
														<template v-for="items in itemq.Children">
															<el-dropdown-item v-if="!items.Children">{{ items.Name }}</el-dropdown-item>
															<el-dropdown-item v-else>
																<el-dropdown placement="right-start" trigger="click" :hide-on-click="false">
																	<span class="el-dropdown-link">
																		<i :class="itemq.Icon"></i>
																		{{ itemq.Name }}
																	</span>
																	<el-dropdown-menu slot="dropdown">
																		<draggable element="ul" v-model="items.Children" group="people" handle=".handle">
																			<template v-for="q in items.Children">
																				<el-dropdown-item v-if="q.type==='add'" style="color:#448EF5;font-weight: 600;display: flex;align-items: center;">
																					<i :class="q.Icon" style="font-size: 20px;"></i>
																					{{q.Name}}
																				</el-dropdown-item>
																				<el-dropdown-item v-else style="display: flex;justify-content: space-between;align-items: center;">
																					<i v-if="!q.Icon" class="el-icon-s-grid handle"></i>
																					<i :class="q.Icon"></i>
																					{{ q.Name }}
																					<img src="../../assets/img/stop.png" v-if="!q.Icon" alt="">
																				</el-dropdown-item>
																			</template>
																		</draggable>
																	</el-dropdown-menu>
																</el-dropdown>
															</el-dropdown-item>
														</template>
													</el-dropdown-menu>
												</el-dropdown>
											</el-dropdown-item>
										</template>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
					
						<ul class="listul" v-if="item.Flag == true">
							<draggable element="ul" v-model="item.Children" group="people" handle=".hos">
								<li @click.stop="liShow(c, item)" :class="{ listli: true, active: item.Active == c.Name }" v-for="(c, index) in item.Children" :key="index">
									<div>
										<i class="el-icon-menu hos" v-if="item.Active == c.Name"></i>
										{{ c.Name }}
									</div>
									<div class="listlileft" v-if="item.Active == c.Name">
										<i class="el-icon-circle-plus-outline" @click.stop="openDefect(1)"></i>
										<el-dropdown trigger="click" placement="right-start" :hide-on-click="false">
											<span class="el-dropdown-link"><i class="el-icon-more"></i></span>
											<el-dropdown-menu slot="dropdown">
												<template v-for="itemq in CheckOption">
													<el-dropdown-item v-if="!itemq.Children" @click.native="openDefect(itemq.Type)">
														<i :class="itemq.Icon"></i>
														{{ itemq.Name }}
													</el-dropdown-item>
													<el-dropdown-item v-else>
														<el-dropdown placement="right-start" trigger="click" :hide-on-click="false">
															<span class="el-dropdown-link">
																<i :class="itemq.Icon"></i>
																{{ itemq.Name }}
															</span>
															<el-dropdown-menu slot="dropdown">
																<template v-for="items in itemq.Children">
																	<el-dropdown-item v-if="!items.Children">{{ items.Name }}</el-dropdown-item>
																	<el-dropdown-item v-else>
																		<el-dropdown placement="right-start" trigger="click" :hide-on-click="false">
																			<span class="el-dropdown-link">
																				<i :class="itemq.Icon"></i>
																				{{ itemq.Name }}
																			</span>
																			<el-dropdown-menu slot="dropdown">
																				<draggable element="ul" v-model="items.Children" group="people" handle=".handle">
																					<template v-for="q in items.Children">
																						<el-dropdown-item v-if="q.type==='add'" style="color:#448EF5;font-weight: 600;display: flex;align-items: center;">
																							<i :class="q.Icon" style="font-size: 20px;"></i>
																							{{q.Name}}
																						</el-dropdown-item>
																						<el-dropdown-item v-else style="display: flex;justify-content: space-between;align-items: center;">
																							<i v-if="!q.Icon" class="el-icon-s-grid handle"></i>
																							<i :class="q.Icon"></i>
																							{{ q.Name }}
																							<img src="../../assets/img/stop.png" v-if="!q.Icon" alt="">
																						</el-dropdown-item>
																					</template>
																				</draggable>
																			</el-dropdown-menu>
																		</el-dropdown>
																	</el-dropdown-item>
																</template>
															</el-dropdown-menu>
														</el-dropdown>
													</el-dropdown-item>
												</template>
											</el-dropdown-menu>
										</el-dropdown>
									</div>
									
								</li>
							</draggable>
						</ul>
					</div>
				</div>
			</div>
			<div class="def_right">
				<div class="right_box" v-for="(item, index) in rightData" :key="index">
					<div class="title">
						{{ item.Name }}
						<el-dropdown trigger="click">
							<span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon-more"></i></span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item>任务一</el-dropdown-item>
								<el-dropdown-item>任务一</el-dropdown-item>
								<el-dropdown-item>任务一</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<draggable element="ul" v-model="item.Children" group="people" style="min-height: 130px;">
						<div class="card" v-for="(c, indexs) in item.Children" :key="c.Name">
							<div class="title">
								<el-checkbox v-model="c.checked">{{ c.Name }}</el-checkbox>
							</div>
							<div class="menu">
								<el-dropdown>
									<el-button type="primary">
										{{ c.Select }}
										<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item v-for="s in c.Selectlist" :key="s.Name" @click.native="downselect(c,s)">{{ s.Name }}</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
								<div class="menuchild">未开始</div>
							</div>
							<div class="date">
								<div class="starttime">今天{{ c.Time }}创建</div>
								<div class="endtime">实际耗时：{{ c.Endtime }}小时</div>
							</div>
							<div class="footer"><el-progress :text-inside="true" :stroke-width="12" :percentage="c.Jd"></el-progress></div>
						</div>
					</draggable>
					<div class="addbottom" v-if="item.type==1" @click="taskTypeAdd">
						<i class="el-icon-plus"></i>
					</div>
				</div>
			</div>
		</div>
		<!-- 创建缺陷分类 -->
		<XModel name="taskListAdd" :title="demandTitle" cancelBtnText="取消" confirmBtnText="确定" @onConfirm="addDemandOK" width="508px">
			<!-- 需求分类创建和编辑 -->
			<div class="qwqBig">
				<div class="dlog">
					<div class="dlogtitle">名称</div>
					<el-input v-model="DemandFormBig.Name" placeholder="请输入名称"></el-input>
				</div>
				<div class="dlog">
					<div class="dlogtitle">描述</div>
					<el-input v-model="DemandFormBig.Describe" placeholder="请输入描述"></el-input>
				</div>
				<div class="dlog">
					<div class="dlogtitle">所属版本</div>
					<el-input v-model="DemandFormBig.Describe2" placeholder="请输入描述"></el-input>
				</div>
			</div>
		</XModel>
		<!-- 设置执行人 -->
		<XModel name="taskListPeple" cancelBtnText="取消" confirmBtnText="确定" title="设置需求执行人">
			<div class="people">
				<div class="nav">
					<div class="box">
						<div class="img"></div>
						<div class="name">
							<div class="title2">予思念</div>
							<div class="title3">管理员</div>
						</div>
					</div>
				</div>
				<Memberselect class="title1"></Memberselect>
			</div>
		</XModel>
		<!-- 创建需求 -->
		<tasktypeadd></tasktypeadd>
	</div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
	components: {
		draggable,
		XModel: () => import('@/components/XModal'),
		tasktypeadd: () => import('./taskTypeAdd.vue'),
	},
	data() {
		return {
			// 创建缺陷
			DefectFlag:1, //状态1创建2编辑
			demandTitle:'创建缺陷分类',
			DemandFormBig:{
				Name:'',
				Describe:'',
				DemandFormBig:'',
			},
			
			// 左侧下拉列表
			CheckOption: [
				{
					Name: '添加到审核节点',
					Icon: 'el-icon-edit-outline',
					Type: '',
					Children: [
						{
							Name: '审核节点1'
						},
						{
							Name: '审核节点2'
						},
						{
							Name: '审核节点3'
						}
					]
				},
				{
					Type: '2',
					Name: '编辑缺陷分类',
					Icon: 'el-icon-edit-outline'
				},
				{
					Type: '3',
					Name: '设置执行人',
					Icon: 'el-icon-user-solid'
				},
				{
					Type: '',
					Name: '配置规则流程',
					Icon: 'el-icon-user-solid',
					Children: [
						{
							Icon: 'el-icon-arrow-left',
							Name: '配置流程规则'
						},
						{
							Name: '负责人审核后流转',
							type:'switch'
						},
						{
							Name: '编辑流程阶段',
							Children: [
								{
									Icon: 'el-icon-arrow-left',
									Name: '配置规划流程',
									type:''
								},
								{
									Name: '新建流程阶段',
									type:'add',
									Icon:'el-icon-circle-plus-outline'
								},
								{
									Name: '需求阶段',
									type:''
								},
								{
									Name: '原型阶段',
									type:''
								},
								{
									Name: '设计阶段',
									type:''
								},
								{
									Name: '开发阶段',
									type:''
								},
								{
									Name: '测试阶段',
									type:''
								}
							]
						}
					]
				},
				{
					Type: '',
					Name: '删除需求分类',
					Icon: 'el-icon-delete-solid'
				}
			],
			
			checked: false,
			rightData: [
				{
					Name: '待处理',
					type:1,
					Children: [
						{
							Name: '登录注册功能',
							checked: false,
							Select: '马化腾',
							Selectlist: [
								{
									Name: '周杰伦'
								},
								{
									Name: '马化腾'
								}
							],
							Time: '09:20',
							Endtime: '5',
							Jd: 70
						}
					]
				},
				{
					Name: '重新打开',
					Children: [
						{
							Name: '重新打开功能',
							checked: false,
							Select: '马化腾',
							Selectlist: [
								{
									Name: '周杰伦'
								},
								{
									Name: '马化腾'
								}
							],
							Time: '09:20',
							Endtime: '5',
							Jd: 70
						}
					]
				},
				{
					Name: '修复中',
					Children:[]
				},
				{
					Name: '已解决',
					Children:[]
				},
				{
					Name: '关闭',
					Children:[]
				}
			],
			leftData: [
				{
					Name: '未分类缺陷·1',
					Flag: false,
					Active: '',
					Children: [
						{
							Name: '未分类缺陷1'
						}
					]
				},
				{
					Name: '版本V1.0缺陷·6',
					Flag: true,
					Active: '登录注册',
					Children: [
						{
							Name: '登录注册'
						},
						{
							Name: '首页'
						},
						{
							Name: '消息'
						},
						{
							Name: '项目'
						},
						{
							Name: '工作'
						},
						{
							Name: '企业'
						}
					]
				}
			]
		};
	},
	methods: {
		// 左侧开关
		titleShow(item) {
			item.Flag = !item.Flag;
		},
		liShow(c, item) {
			item.Active = c.Name;
		},
		downselect(c,s){
			c.Select = s.Name
		},
		// 创建缺陷分类
		openDefect(flag,val){
			this.DefectFlag = flag
			if(this.DefectFlag == 1){
				this.demandTitle = '创建缺陷分类'
			}else{
				this.demandTitle = '编辑缺陷分类'
			}
			// console.log(this.DefectFlag)
			this.$modal.show('taskListAdd');
		},
		addDemandOK(){
			//缺陷分类点击确定
		},
		
		//创建需求弹窗打开
		taskTypeAdd() {
			this.$modal.show('taskTypeAdd');
		},
	}
};
</script>

<style lang="less" scoped>
.defect {
	height: calc(100vh - 15px * 2 - 65px);
	overflow: hidden;
	margin: 10px;
	display: flex;
	.def_left {
		margin-right: 10px;
		min-width: 180px;
		height: calc(100vh - 15px * 2 - 65px);
		background: #fff;
		padding: 10px;
		.title {
			font-size: 16px;
			color: #333;
			border-bottom: 1px solid #aaaaaa;
			padding-bottom: 10px;
		}
		.title2 {
			color: #666666;
			display: flex;
			justify-content: space-between;
			font-size: 16px;
			padding: 10px;
			align-items: center;
			i {
				cursor: pointer;
				padding-right: 6px;
			}
		}
		.title3{
			overflow: scroll;
			height: calc(100vh - 15px * 2 - 65px);
			.list {
			margin-bottom: 10px;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #666666;
				font-size: 16px;
				i {
					cursor: pointer;
				}
			}
			.listul {
				margin-left: 8px;
				border-left: 1px solid #ccc;
				padding: 10px 0 5px 10px;
				.listli {
					position: relative;
					list-style-type: disc !important;
					margin: 0 0 10px 0;
					color: #aaaaaa;
					cursor: pointer;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.listlileft {
						font-size: 16px;
						color: #666;
					}
					.hos {
						// position: absolute;
						// left: -25px;
						// top: 50%;
						// transform: translateY(-40%);
					}
				}
				.active {
					color: #448ef5;
				}
			}
		}
		}
		
	}
	.def_right {
		// height: calc(100vh - 15px * 2 - 50px);
		width: 100%;
		display: flex;
		overflow-x: auto;
		overflow-y: scroll;
		.right_box {
			min-width: 240px;
			height: 100%;
			margin-right: 80px;
			.title {
				width: 100%;
				color: #333333;
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 10px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				i{
					cursor: pointer;
				}
			}
			.card {
				margin-bottom: 10px;
				height: 96px;
				background-color: #fff;
				padding: 10px;
				border-left: 4px solid #c2c2c2;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				.title {
					color: #333333;
					font-size: 12px;
				}
				.menu {
					padding-left: 25px;
					display: flex;
					button {
						padding: 2px 7px !important;
						border-radius: 0 !important;
					}
					.menuchild {
						color: #666666;
						font-size: 12px;
						padding: 0 5px;
						margin-left: 10px;
						border: 1px solid #666666;
					}
				}
				.date {
					padding-left: 25px;
					display: flex;
					justify-content: space-between;
					color: #aaaaaa;
					font-size: 12px;
					margin-top: 10px;
				}
				.footer {
					padding-left: 25px;
					margin-top: 5px;
				}
			}
			.addbottom{
				height: 40px;
				width: 100%;
				background: #fff;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 20px;
				font-weight: 600;
				color: #448EF5;
				cursor: pointer;
			}
		}
	}
}
.qwqBig {
	padding: 10px;
	.dlog {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 20px;
		.dlogtitle {
			text-align: right;
			margin-right: 10px;
			width: 15%;
		}
	}
}
</style>
