<!-- 个人加班信息和正常工作信息 -->

<template>
	<div>
		<XModal name="personProcess" :title="childDesData.name+'的个人详情'" width="90%" height="95%" :showCrossBtn="true"
		 @beforeOpen="dataInit" @opened="open()">
			<div id="person-progress" v-loading="childLoading">
				<div class="static-content" v-infinite-scroll="loadPerson" :infinite-scroll-disabled="disabled"
				 infinite-scroll-distance="20">
					<div class="depart-progress-content" v-if="childDesData.list.work||childDesData.list.overWork">
						<h3>{{childDesData.name}}</h3>
						<div class="depart-progress">
							<div class="progress-bars">
								<div class="progress-bar" style="cursor: pointer;">
									<span>工 作</span>
									<progressBar :paramsobj="childDesData.list.work" @getBar="getBarData"></progressBar>
								</div>
								<div class="progress-bar" style="cursor: pointer;">
									<span>加 班</span>
									<progressBar :paramsobj="childDesData.list.overWork" @getBar="getBarData"></progressBar>
								</div>
							</div>
							<div class="progress-chart-father-container">
								<div class="progress-chart-father-Des" style="width:100% ;height: 100px;"></div>
							</div>
						</div>
					</div>
					<!-- 成员统计 -->
					<div>
						<div class="child-progress-content" v-for="(pro,index) in childDesList" :key="index" v-if="childDesList.length">
							<!-- 进度条 -->
							<div class="progress-bars">
								<span>{{pro.name}}</span>
								<div class="progress-bar">
									<div class="bar"><span>工作</span>
										<progressBar :paramsobj="pro.list.work" @getBar="getBarData"></progressBar>
									</div>
									<div class="bar">
										<span>加班</span>
										<progressBar :paramsobj="pro.list.overWork" @getBar="getBarData"></progressBar>
									</div>

								</div>
							</div>

							<!-- 饼图 -->
							<div class="progress-chart">
								<div class="static-progress-chart-Des">

								</div>
							</div>
						</div>
						<div v-else class="empty">

							<img src="../../assets/img/emptyData.png" alt="">
							<p>暂无进程</p>
						</div>
						<div v-if="childDesList.length > 0" class="load-status">
							<div class="g-loading" v-if="loading">
								<i class="el-icon-loading"></i>
								加载中...
							</div>
							<div class="g-loaded" v-if="!more">已全部加载</div>
						</div>

					</div>
				</div>
			</div>
		</XModal> 
		 <!-- 进度条截图 -->
		<barPhoto :activeBar="activeBar" :st="st" :et="et" customName="personBarAxis"></barPhoto>
		 <!-- 饼图截图 -->
		 <piePhoto :activePie="activePie" :st="st" :et="et"></piePhoto>
		

	</div>




</template>

<script>
	export default {
		data() {
			return {
				disabled: true,
				childLoading: false,
				childDesList: [],
				condition: {
					p: 1,
					c: 10,
					u: []

				},
				childDes: [],
				more: true,
				colorList: ['#63b2ee', '#76da91', '#f8cb7f', '#f89588', '#7cd6cf', "#9192ab", "#7898e1", "#efa666", "#eddd86",
					"#9987ce", "#63b2ee", "76da91", '#f8cb7f', '#f89588', '#7cd6cf', "#9192ab", "#7898e1", "#efa666", "#eddd86",
					"#9987ce"
				],
				loading:false,
				activeBar:{},   //进度条截图
				activePie:{}  //饼图截图


			}
		},
		props: {
			childDesData: {
				type: Object,
				default: function() {
					return {
						list: []
					}
				}
			},
			st: {
				type: Date | String,
				default: ''
			},
			et: {
				type: Date | String,
				default: ''
			},
			childPerson: {
				type: Number | String,
				default: ''
			}
		},
		components: {
			XModal: () => import('@/components/XModal.vue'),
			progressBar: () => import('@/components/Progress.vue'),
			barPhoto:()=>import('./barPhoto'),
			piePhoto:()=>import('./piePhoto')
		},
		methods: {
			loadPerson() {
				if (this.more) {
					this.condition.p++
					this.selectPersonProcess()
				}
			},
			dataInit() {
				Object.assign(this.$data, this.$options.data())
			},
			open() {
				this.drawChart(0, this.childDesData.progress, 4, this.childPerson)
				this.condition.p = 1
				this.condition.u.push(this.childPerson)
				this.childLoading = true
				this.selectPersonProcess()
			},
			selectPersonProcess() {
				this.loading=true
				this.disabled = true
				this.condition.st = this.st
				this.condition.et = this.et
				this.$http.post('/MGT/system/progress/WorkStatisticssub.ashx', this.condition).then(res => {
					if (res.res == 0) {
						if (res.data.items) {
							this.childDes = this.childDes.concat(res.data.items)
							this.formateParams(this.childDes, 2, this.childPerson)
						    this.loading=false
							this.disabled=false
							if (this.childDes.length >= res.data.totalCount - 1) {
								this.more = false
								this.disabled = true
							}
						}
						setTimeout(() => {
							this.childLoading = false
							
						}, 1000)
					}
				})
			},
			formateParams(arr, index, _id) {
				this.childDesList = []
				arr.forEach(item => {
					let arr1 = []
					let arr2 = []
					let _list = {}
					if (!item.ratios) {
						return
					}
					for (let k in item.ratios[0]) {
						arr1.push({
							name: k,
							width: parseFloat(item.ratios[0][k].Key).toFixed(1),
							id: _id,
							date: item.name
						})
					}
					for (let k in item.ratios[1]) {
						arr2.push({
							name: k,
							width: parseFloat(item.ratios[1][k].Key).toFixed(1),
							id: _id,
							date: item.name
						})
					}
					_list = {
						work: arr1,
						overWork: arr2
					}
					let arr3 = []
					item.progress.forEach(val => {
						arr3.push(val.name)
					})
					item.progress.forEach(val => {
						val['itemData'] = arr3
					})
					this.childDesList.push({
						id: _id,
						name: item.name,
						list: _list,
						progress: item.progress,
					})

				})
				setTimeout(() => {
					for (let i = 0; i < this.childDesList.length; i++) {
						this.drawChart(i, this.childDesList[i].progress, 2, _id)
					}
				}, 10)
			},
			drawChart(index, data, type, _id) {
				let option = {
					tooltip: {
						formatter: function(params) {
							if (params) {
								let str = ""
								str +=
									'<div style="with:200px;box-shadow:0px 5px 10px -2px rgba(74, 144, 226, 0.9);padding:1rem;font-size:14px;border-radius:4px">'
								params.data.name = params.data.name.length > 6 ? params.data.name.slice(0, 15) : params.data.name
								return str + '进程名：' + params.data.name + '<br/> 占比：' + params.percent + '% </div>'
							}
						}
					},
					series: [{
						type: 'pie',
						radius: '90%',
						center: ['50%', '50%'],
						data: data,
						animation: false,
						itemStyle: {
							normal: {
								color: (params) => {
									return this.colorList[params.dataIndex]
								}
							}
						},
						label: {
							position: 'outer',
							alignTo: 'none',
							bleedMargin: 5
						},
						left: 0,
						right: '0',
						top: 0,
						bottom: 0
					}]
				}
				this.$nextTick(() => {
					if (type == 2) {
						//打开个人详情的饼图
						if (document.getElementsByClassName('static-progress-chart-Des')[index]) {
							let chart2 = this.$echarts.init(document.getElementsByClassName('static-progress-chart-Des')[index])
							chart2.setOption(option)
							chart2.off('click')
							chart2.on('click', (params) => {
								params.event.event.stopPropagation();
								params.data.id = _id
								this.activePie = params.data.name
								this.getPiePhoto(params)

							})
						}
					}
					if (type == 4) { //个人详情的汇总饼图
						if (document.getElementsByClassName('progress-chart-father-Des')[0]) {
							let chart4 = this.$echarts.init(document.getElementsByClassName('progress-chart-father-Des')[0])
							chart4.setOption(option)
							chart4.off('click')
							chart4.on('click', (params) => {
								params.event.event.stopPropagation();
								params.data.id = _id
								params.data.itemData = data
								this.activePie = params.data.name
								this.getPiePhoto(params)
								

							})
						}
					}
				})

			},
			getStatus(text) {
				let value = ''
				switch (text) {
					case "CORTime":
						value = "工作";
						break;
					case "工作":
						value = "工作";
			
						break;
					case "ETTime":
						value = "娱乐";
			
						break;
					case "娱乐":
						value = "娱乐";
			
						break;
					case "FreeTime":
						value = "空闲";
			
						break;
					case "空闲":
						value = "空闲";
			
						break;
					case "未知":
						value = "未知";
			
						break;
					case "UnknownTime":
						value = "未知";
			
						break;
					case "离线":
						value = "离线";
			
						break;
					case "NotExistTime":
						value = "离线";
			
						break;
					case "CORTimeWork":
						value = "工作";
			
						break;
					case "UnknownTimeWork":
						value = "未知";
			
						break;
					case "FreeTimeWork":
						value = "空闲";
			
						break;
					case "ETTimeWork":
						value = "娱乐";
			
						break;
					case "NotExistTimeWork":
						value = "离线";
			
						break;
					default:
						value = text;
						break;
			
				}
				return value
			},
			getBarData(item) {
                this.activeBar.name=this.getStatus(item.name)
				this.activeBar.id=item.id
				this.activeBar.date=item.date
				this.$modal.show('personBarAxis')
			},
			getPiePhoto(item){
				this.activePie=item
				this.$modal.show('pieTimeAxis')
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	/deep/.ctn {
		height: calc(100% - 6rem);
	}

	#person-progress {
		padding: 0 3rem;
		overflow: auto;
		height: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		padding-bottom: 1rem;

		.child-progress-content {
			cursor: initial !important;
		}

	}

	.depart-progress-content {
		padding-bottom: 3rem;

		h3 {
			font-size: 1.8rem;
			font-weight: bold;
			color: #448ef5;
			line-height: 5rem;
			letter-spacing: .5rem;
		}

		.depart-progress {
			display: flex;

		}

		.progress-bars {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 50%;

			.progress-bar {
				width: 100%;
				display: flex;
				box-sizing: border-box;

				span {
					flex: 0 0 6rem;
					font-size: 1.6rem;
				}
			}

			.progress-bar:nth-of-type(1) {
				margin-bottom: 3rem;
			}

			/deep/.hp-Pbar {
				height: 100%;
			}
		}

		.progress-chart-father-container {
			width: 50%;

			&>div {
				width: 100%;
			}
		}


	}

	.progress-chart {
		width: 50%;
		cursor: pointer;

		.static-progress-chart,
		.static-progress-chart-Des {
			width: 100%;
			height: 100px;
		}

	}

	// 个人进程详情
	.child-progress-content {
		padding: 2rem 0;
		box-shadow: 0px 15px 10px -5px transparent;
		display: flex;
		border-top: 1px solid #DDD;


		.progress-bars {
			width: 50%;
			display: flex;
			align-items: center;
			cursor: pointer;

			span {
				flex: 0 0 11rem;
				font-size: 1.4rem;
				color: #333;
				// display: none;
			}

			.progress-bar {
				display: flex;
				flex-direction: column;
				flex: 1;

				.bar {
					display: flex;

					span {
						flex: 0 0 4rem;
						margin-right: 1rem;
						display: none;

					}
				}

				.bar:nth-of-type(1) {
					margin-bottom: 3rem;
				}
			}


		}

		cursor: pointer;
		transition: all .4s;

		&:hover {
			box-shadow: 0px 5px 10px -5px #999;
			padding-left: 1.5rem;
			padding-right: 1.5rem;
			border-radius: .4rem;

			span {
				color: #448ef5 !important;
			}
		}
	}
	@media only screen and (max-width:1024px){
		//个人详情页面
		.child-progress-content {
			flex-direction: column;
		
			.progress-bars {
				flex-direction: column;
				width: 100%;
		
				span {
					flex: 0;
					margin-bottom: 1rem;
				}
		
				.progress-bar {
					width: 100%;
				}
			}
		
			.progress-chart {
				width: 100%;
				margin-top: 4rem;
			}
		}
		
		.depart-progress-content {
			h3 {
				margin-bottom: 1rem;
			}
		
			.depart-progress {
				flex-direction: column;
		
				.progress-bars {
					width: 100%;
				}
		
				.progress-chart-father-container {
					width: 100%;
					margin-top: 4rem;
				}
			}
		}
	}
</style>
