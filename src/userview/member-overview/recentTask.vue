<!-- 成员的任务近况     taskActivity -->
<template>
	<div>
		<XModal width="80%" height="80%" name="taskActivity" :showCrossBtn="true" class="work-timeAxis"
		 @opened="open()">
			<div class="c-header" slot="header">
				<h3>{{activeMan}}的最近任务动态</h3>
				<el-date-picker v-model="taskTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
				 value-format="yyyy/MM-dd" :picker-options="pickOption">
				</el-date-picker>
				<a><i class="hiFont hi-close-thin" @click="()=>{$modal.hide('taskActivity')}"></i></a>
			</div>

			<div style="height: 100%;box-sizing: border-box;padding-bottom: 1rem;">
				<div style="overflow: auto;height: 100%;" v-infinite-scroll="loadMoreAct" v-loading="taskLoading">
					<div v-for="(value,index) in taskList" :key="index" color="#409eFF" class="task-item">
						<div class="task-item-wrapper">
							<div class="task-item-left">
								<div>
									<p @click="toTask(value,index)">任务名：<span :style="value.isRead?'color:#ccc':''" class="name" :title="value.jname">{{value.jname}}</span></p>
									<el-tag type="primary" size="small" @click="toProject(value)">{{value.ename}}</el-tag>
								</div>
								<div>在本周的执行天数：<span style="margin-right: 2rem;">{{value.exeDay}}天</span> 实际耗时：<span>{{formateDecimal(value.spent) }}小时</span></div>
							</div>
							<div class="task-item-right">
								<div>
									<p>开始日期：{{value.startDate.timeFormat('yyyy-MM-dd')}}</p>
									<div>开始进度： <el-progress :text-inside="true" :stroke-width="20" :percentage="value.startProgress"></el-progress>
									</div>
								</div>
								<div>
									<p>结束日期：{{value.endDate?value.endDate.timeFormat('yyyy-MM-dd'):value.startDate.timeFormat('yyyy-MM-dd HH:ss')}}</p>
									<div>结束进度： <el-progress :text-inside="true" :stroke-width="20" :percentage="value.endProgress"></el-progress>
									</div>
								</div>
							</div>
						</div>
						<div class="pro-tags" v-if="value.eveTags.length">
							<i class="pro-label">项目标签：</i>
							<el-tag type="info" v-for="(tag,tindex) in value.eveTags" :key="tindex" :title="tag">{{tag}}</el-tag>
						</div>
					</div>
					<div v-if="taskList.length > 0" class="load-status">
						<div class="g-loading" v-if="isLoading">
							<i class="el-icon-loading"></i>
							加载中...
						</div>
						<div class="g-loaded" v-if="!moreTask">已全部加载</div>
					</div>
					<div class="empty-proccess-list" v-if="taskList.length==0">
						<img src="@/assets/img/emptyTask.png" alt="">
						<p>暂无任务动态</p>
					</div>
				</div>
			</div>
		</XModal>


	</div>



</template>

<script>
	export default {
		data() {
			return {
				pickOption: this.pickDate(),
				taskTime: '',
				moreTask: true,
				taskList: [],
				taskPage: {
					page: 1,
					count: 10
				},
				taskLoading: false,
				isLoading:false



			}
		},
		components: {
			XModal: () => import('@/components/XModal.vue')

		},
		props: {
			selDate: { //选择的周数
				type: String | Date,
				default: ''
			},
			activeId: { //查看人的id
				type: Number | String,
				default: ''

			},
			activeMan: { //查看人的名字
				type: String,
				default: ''
			}

		},
		watch: {
			taskTime(newVal) {
				this.taskPage.page = 1
				this.taskList = []
				this.moreTask = true
				this.taskLoading = true
				this.getTaskActiveList()
			}
		},
		methods: {
			pickDate() {
				let _this = this;
				return {
					disabledDate(time) {
						return time.getTime() > new Date().getTime();
					}
				};
			},
			open(){
				this.taskItem={}
				this.moreTask=true
				this.taskList=[]
				this.taskTime=''
				this.taskPage.page=1
			    this.taskLoading = true
				this.getTaskActiveList()
				
			},
			getTaskActiveList() {
			
				this.isLoading=true
				this.$http.get('/Company/MemberJob/RecentJobs.ashx', {
					params: {
						u: this.activeId,
						wk: this.selDate.timeFormat('yyyy-MM-dd'),
						p: this.taskPage.page,
						c: this.taskPage.count,
						st: this.taskTime ? this.taskTime[0] : null,
						et: this.taskTime ? this.taskTime[1] : null
					}
				}).then(res => {
					if (res.res == 0) {
						this.taskLoading = false
						this.isLoading=false
						this.taskList = this.taskList.concat(res.data.items)
						if (this.taskList.length >= res.data.totalCount) {
							this.moreTask = false
						}

					}
				})
			},
			loadMoreAct() {
				if (this.moreTask && !this.isLoading) {
					this.taskPage.page++
					this.getTaskActiveList()
				}
			},
			formateDecimal(num) {
				if (!num) {
					return 0
				}
				num = parseFloat(num).toFixed(2)
				let reg = /00/
				if (reg.test(num)) {
					let i = num.indexOf('.')
					num = num.slice(0, i)
					return num
				}
				if (num[num.length - 1] == 0) {
					num = num.slice(0, num.length - 1)
					return num
				}
				return num
			},
			toTask(item, index) {
				this.$emit('openTask',item)
				this.taskList[index].isRead = true
			},
			toProject(item) {
				this.$route.params.eid = item.eid
				this.$modal.show('projectDetail')
			},

		},
		



	}
</script>

<style lang="less" scoped="scoped">
	/deep/.ctn{
		height: calc(100% - 6rem);
	}
	.work-timeAxis {
		box-sizing: border-box;
		padding: 2rem;
		overflow: auto;


		/deep/.el-timeline-item__timestamp {
			font-size: 1.6rem;
			color: #333;

		}

		/deep/.el-collapse-item__wrap {
			border: none;
		}

		/deep/.el-timeline {
			padding: 2.5rem 2rem;

			img {
				cursor: pointer;
			}
		}

		/deep/.el-timeline-item__content {
			color: #999;
		}

		h4 {
			display: flex;
			font-size: 1.6rem;
			color: #303133;
			flex-direction: column;

			span {
				margin-right: 2rem;
				line-height: 1;
				margin-bottom: 1rem;
			}

		}

		// 任务动态相关
		.task-item {
			// display: flex;
			box-sizing: border-box;
			padding: 1.5rem 2rem;
			// border-radius: 6px;
			border: 1px solid #f2f2f2;
			cursor: pointer;

			.task-item-wrapper {
				display: flex;
			}

			.pro-tags {
				display: flex;
				align-items: center;
				margin-top: 1rem;
				flex-wrap: wrap;

				.pro-label {
					font-size: 1.4rem;
				}

				.el-tag {
					margin-right: 1rem;
				}
			}

			.task-item-left {
				width: 50%;

				&>div {
					display: flex;
					align-items: center;
					// flex-direction: column;
				}

				/deep/.el-tag {
					max-width: 15rem;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&>div:first-child {
					p {
						max-width: 60%;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
						margin-right: 1rem;
						font-size: 1.4rem;
						color: #333 !important;
						cursor: pointer;

						&:hover {
							.name {
								color: #409eff;
							}
						}
					}
				}

				&>div:last-child {
					margin-top: 1rem;
					font-size: 1.4rem;

					span {
						color: rgb(245, 108, 108);
					}
				}

			}

			.task-item-right {
				width: 50%;

				&>div {
					display: flex;
				}

				&>div:first-child,
				&>div:last-child {
					p {
						flex: 0 0 180px;
						color: #333;
						font-size: 1.4rem;
						// margin-right: 1rem;
					}

					div {
						display: flex;
						flex: 1;
						font-size: 1.4rem;
						color: #333;
					}
				}

				&>div:last-child {
					margin-top: 1rem;

				}

			}

			&:hover {
				box-shadow: 0px 2px 10px 0px rgba(225, 224, 224, 0.6);

				.task-item-left {
					&>div:first-child {
						p {
							color: #409eff;
						}
					}
				}

			}
		}

		.c-header {
			height: 6rem;
			line-height: 6rem;
			text-align: center;
			width: 100%;
			position: relative;
			display: flex;
			box-sizing: border-box;
			padding: 0 6rem 0 2rem;
			justify-content: space-between;
			align-items: center;

			/deep/ .el-input__inner {
				border: 1px solid #DDD !important;
				width: 243px;
				margin-right: 2rem;
			}

			h3 {
				color: #409eff;
				font-size: 2.2rem;
				font-weight: 600;
			}

			&>a {
				position: absolute;
				display: block;
				top: 2rem;
				right: 0.5rem;
				line-height: 2rem;
				border-left: 1px solid #eee;
				color: #9b9b9b;

				i {
					padding: 0 1rem;
					display: block;
					font-size: 2rem;
					cursor: pointer;
					transition: color 0.3s ease;
					color: #999;

					&:hover {
						color: #409eff;
					}
				}
			}

		}

	}

	.empty-proccess-list {
		img {
			width: 245px;
			height: 245px;
			margin: 4rem auto;
			display: block;
		}

		p {
			font-size: 1.6rem;
			color: #6d6d6d;
			text-align: center;
		}
	}

	@media only screen and (max-width:1024px) {
		.work-timeAxis {
			padding: 0;

			.task-item,
			.task-item-wrapper {
				flex-direction: column;

				.task-item-left,
				.task-item-right {
					width: 100%;
				}

				.task-item-right {
					margin-top: 1rem;
				}
			}

			.c-header {
				h3 {
					font-size: 1.6rem;
					flex: 0 0 15rem;
					line-height: 1;
					text-align: left;
					margin-right: 1rem;
				}
			}


		}
	}
</style>
