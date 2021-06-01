<!-- 
	@Description:项目选择器  chooseProject xmodal名
	@Author:pan
	@Params: array    默认选中项目id数组,eg:[1,2,3] 
	         isRadio  是否单选，默认false
			 isGlobal 权限，默认true表示查看全部项目
			 isShow   选中是否展示 默认true
			 
	@Return:  监听getList事件获得返回数组			

-->
<template>
	<div id="selProject">
		<div class="sel-tags">
			<el-tag v-for="(item,index) in projectList" :key="item.proId" @close="handleClose(item.proId)" closable size="medium"
			 @click="tagClick(item)" v-if="isShow" v-show="showLength==0?true:index<showLength">{{item.proName}}</el-tag>

			<span v-if="projectList.length>showLength&&isShow&&isShowLength" class="info">等{{projectList.length}}个项目</span>

			<i class="el-icon-circle-plus" @click="()=>{$modal.show('chooseProject')}" v-if="!custom"></i>
			<div v-else @click="()=>{$modal.show('chooseProject')}">
				<slot name="custom"></slot>
			</div>
		</div>
		<XModal name="chooseProject" width="680" height="720" @beforeOpen="beforeOpen()" @closed="closed()" cancelBtnText="取消"
		 confirmBtnText="确认" @onConfirm="onConfirm" isFixed>
			<div class="content">
				<h3>
					<p>项目选择</p>
					<span class="icon hiFont hi-close-thin" @click="()=>{this.$modal.hide('chooseProject')}"></span>
				</h3>
				<div class="content-body">
					<div class="search-List">
						<div class="search-input">
							<el-input v-model="EventeName" placeholder="项目搜索" @keyup.enter.native="search()"></el-input>
							<span @click="search()">搜索</span>
						</div>
						<div class="search-condition">
							<el-select v-model="EventeClass" placeholder="项目分类" clearable>
								<svg class="icon svg-icon" aria-hidden="true" slot="prefix">
									<use xlink:href="#hi-statistics-pie-cr" />
								</svg>
								<el-option v-for="item in projectType" :key="item.Name" :label="item.Name" :value="item.ECId"></el-option>
							</el-select>
							<el-select v-model="Fir" placeholder="重要程度" clearable>
								<svg class="icon svg-icon" aria-hidden="true" slot="prefix">
									<use xlink:href="#hi-priority-cr" />
								</svg>
								<el-option v-for="item in $D.LIST('g_priority')" :key="item.name" :label="item.name" :value="item.value"></el-option>
							</el-select>
							<el-date-picker v-model="StartTime" type="date" placeholder="开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
							<el-date-picker v-model="EndTime" type="date" placeholder="结束时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
						</div>
					</div>
					<div class="search-result">
						<h3 :style="List.length>0?'margin-bottom:1.5rem':''">
							<span>搜索结果：</span>
							<span>已选择：{{checkList.length}}条</span>
						</h3>
						<div class="check-box" v-infinite-scroll="loadData" infinite-scroll-distance="10" :infinite-scroll-disabled="isLoad"
						 v-loading="loading" v-if="List.length">
							<el-checkbox-group v-model="checkList" @change="getCheckList">
								<el-checkbox :label="item.proId" v-for="(item,index) in List" :key="index">
									<p>{{item.proName}}</p>
									<p>
										<sub>
											<i :class="'hiFont '+$D.ITEM('pro_status',item.proSchedule).icon" :style="'margin-right:.5rem;color:'+$D.ITEM('pro_status',item.proSchedule).color"></i>
											{{$D.ITEM('pro_status',item.proSchedule).name}}
										</sub>
										<el-tooltip :content="item.proDefFrontManId" placement="top">
											<img v-lazy="$url+item.proDefFrontManHead" alt v-if="item.proDefFrontManId" />
										</el-tooltip>
									</p>
								</el-checkbox>
							</el-checkbox-group>
							<p v-if="!more" class="g-loaded">已加载全部</p>
						</div>
						<div v-else class="empty">
							<img src="../../assets/img/emptyTask.png" alt />
							<p>暂无项目</p>
						</div>
					</div>
				</div>
			</div>
		</XModal>
	</div>
</template>

<script>
	import XModal from "../XModal";
	export default {
		components: {
			XModal,
		},
		props: {
			isRadio: {
				type: Boolean,
				default: false,
			},
			isGlobal: {
				type: Boolean,
				default: true,
			},
			isShow: {  //选中是否显示
				type: Boolean,
				default: true,
			},
			array: {
				type: Array,
				default: function() {
					return [];
				},
			},
			custom: {
				//自定义按钮
				type: Boolean,
				default: false,
			},
			showLength: {  //显示固定长度个数
				type: Number,
				default: 0,
			},
			isShowLength: {  //显示固定长度
				type: Boolean,
				default: false,
			},
			isChange: {
				type: Boolean,
				default: false,
			},
			openDetail:{  //选中项目后是否打开项目详情
				type:Boolean,
				default:false 
			}
		},
		data() {
			return {
				EventeClass: "",
				Fir: "",
				StartTime: "",
				EndTime: "",
				qxcs: "",
				EventeName: "",
				CurrentPage: 1,
				PageCount: 15,
				checkList: [],
				List: [],
				isLoad: false,
				more: true,
				loading: false,
				projectType: [],
				projectList: [],
			};
		},
		watch: {
			EventeClass() {
		
				this.CurrentPage = 1;
				this.List = [];
				this.getProjectList();
			},
			Fir() {
			
				this.CurrentPage = 1;
				this.List = [];
				this.getProjectList();
			},
			StartTime() {
			
				this.CurrentPage = 1;
				this.List = [];
				this.getProjectList();
			},
			EndTime() {
				
				this.CurrentPage = 1;
				this.List = [];
				this.getProjectList();
			},
			array() {
				if (this.isChange) {
					this.projectList = [];
					this.checkList = [];
					this.array.forEach((item) => {
						this.checkList.push(item);
					});
					this.setList();
				}
			},
		},
		methods: {
			getProjectType() {
				this.$http
					.get("/Project/ProjectType/ProjectTypeList.ashx")
					.then((res) => {
						if (res.res == 0) {
							this.projectType = res.data;
						}
					});
			},
			tagClick(item){
			   if(this.openDetail){
				   this.$emit('proDetail',item)
			   }else{
				   this.$modal.show('chooseProject')
			   }
				
				
				
				
			},
			// 获得数据
			async getProjectList() {
				this.isLoad = true;
				this.loading = true;
				let params = {
					EventeClass: this.EventeClass,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					Fir: this.Fir,
					qxcs: "",
					CurrentPage: this.CurrentPage,
					PageCount: this.PageCount,
					EventeName: this.EventeName,
				};
				if (this.isGlobal) {
					delete params.qxcs;
				}
				let res = await this.$http.post("/General/GetProjectSelector.ashx", params)
					if (res.res == 0) {
						this.isLoad = false
						this.loading = false;
						this.List = this.List.concat(res.data.message)
						if (this.List.length >= res.data.PageData.TotalCount) {
							this.more = false;
							this.isLoad=true
						}
					}
	},
	   loadData() {
		   // console.log('loadMore')
			if (this.more) {
				this.CurrentPage++;
				this.getProjectList();
			}
		},
		getCheckList() {
			if (this.isRadio) {
				this.checkList.splice(0, this.checkList.length - 1);
			}
		},
		beforeOpen() {
			this.List = [];
			// this.checkList = []
			this.CurrentPage = 1
			this.isLoad = false
			this.more = true
			this.getProjectList();
			this.getProjectType();
		},
		setList() {
			this.$http
				.post("/General/GetProjectSelector.ashx", {
					CurrentPage: 1,
					PageCount: 9999999,
				})
				.then((res) => {
					if (res.res == 0) {
						let arr = [];
						res.data.message.forEach((item) => {
							this.checkList.forEach((val) => {
								if (item.proId == val) {
									arr.push(item);
								}
							});
						});
						this.projectList = arr;
					}
				});
		},
		onConfirm() {
			this.$http
				.post("/General/GetProjectSelector.ashx", {
					CurrentPage: 1,
					PageCount: 9999999,
				})
				.then((res) => {
					if (res.res == 0) {
						let arr = [];
						res.data.message.forEach((item) => {
							this.checkList.forEach((val) => {
								if (item.proId == val) {
									arr.push(item);
								}
							});
						});
						this.projectList = arr;
						this.$emit("getList", this.projectList);
						this.$modal.hide("chooseProject");
					}
				});
		},

		handleClose(id) {
			this.checkList = this.checkList.filter((item) => {
				return item !== id;
			});
			this.projectList = this.projectList.filter((item) => {
				return item.proId !== id;
			});
			this.$emit("getList", this.projectList);
		},
		search() {
			this.List = [];
			this.CurrentPage = 1
			this.isLoad = false
			this.more = true
			this.getProjectList();
		},
		//清空选择的项目
		cleanProAll() {
			this.projectList = [];
			this.checkList = [];
		},
		closed() {},
	},
	mounted() {
		this.array.forEach((item) => {
			this.checkList.push(item);
		});
		this.setList();
	},
	};
</script>

<style lang="less" scoped>
	#selProject {}

	/deep/.bottom {
		position: absolute;
		bottom: 0;
	}

	.sel-tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;

		.el-tag {
			margin-right: 0.5rem;
			margin-bottom: 0.5rem;
		}

		i {
			font-size: 3.2rem;
			color: #d3d3d3;
			cursor: pointer;

			&:hover {
				color: #999;
			}
		}

		.info {
			font-size: 1.2rem;
			color: #333;
			margin-right: 1rem;
		}
	}

	// 模态框内容
	.content {
		box-sizing: border-box;
		height: 100%;

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
			box-sizing: border-box;
			padding: 2rem 0rem;
			display: flex;
			height: calc(100% - 122px);
			flex-direction: column;

			.search-List {
				height: 145px;
				box-sizing: border-box;
				padding: 0 2rem;
			}

			.search-input {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				height: 40px;
				margin-bottom: 1.5rem;

				.el-input {
					flex: 1;
					border: 1px solid #448ef5 !important;
					height: 38px;
					border-radius: 4px 0px 0px 4px;
					overflow: hidden;
					border-right: 0;

					/deep/.el-input__inner {
						line-height: 38px;
						height: 38px;
						background: #fff;
						border: none !important;
					}
				}

				span {
					width: 8rem;
					height: 100%;
					background: linear-gradient(136deg,
						rgba(97, 193, 254, 1) 0%,
						rgba(66, 139, 244, 1) 100%);
					border-radius: 0px 4px 4px 0px;
					text-align: center;
					color: #fff;
					font-weight: bold;
					line-height: 4rem;
					font-size: 1.6rem;
					letter-spacing: 0.5rem;
					cursor: pointer;
				}
			}

			.search-condition {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.el-input {
					/deep/.el-input__inner {
						padding-left: 36px;
					}
				}

				.el-select {
					width: 48%;
					margin-bottom: 1rem;

					svg {
						position: relative;
						top: 0.8rem;
						left: 0.5rem;
						font-size: 2rem;
					}

					/deep/.el-input__inner {
						padding-left: 36px;
					}
				}

				.el-date-editor {
					width: 48%;

					/deep/.el-input__icon {
						font-size: 2.1rem;
						position: relative;
						left: 1px;
						color: #6d6d6d;
					}
				}
			}

			.search-result {
				height: calc(100% - 145px);
				box-sizing: border-box;

				h3 {
					margin: 1.5rem 0;
					margin-bottom: 0;
					border-bottom: 0;
					box-sizing: border-box;
					padding: 0 2rem;
					height: auto;
					display: flex;
					justify-content: space-between;

					span {
						font-size: 1.6rem;
						color: #8a8a8a;
					}

					span:nth-of-type(2) {
						font-size: 1.3rem;
						color: #999;
					}
				}

				.empty {
					img {
						width: 240px;
						display: block;
						margin: 0 auto;
					}

					p {
						font-size: 1.6rem;
						color: #6d6d6d;
						text-align: center;
					}
				}

				.check-box {
					overflow: auto;
					box-sizing: border-box;
					padding: 0 2rem;
					height: calc(100% - 50px);
				}

				/deep/.el-checkbox-group {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
				}

				/deep/.el-checkbox {
					width: 48%;
					margin-bottom: 1rem;
					margin-right: 0;
					box-shadow: 0px 2px 8px 0px rgba(242, 242, 242, 1);
					border-radius: 2px;
					box-sizing: border-box;
					padding: 1.5rem;
					display: flex;

					.el-checkbox__label {
						width: 90%;

						p:nth-of-type(1) {
							font-size: 1.4rem;
							color: #4a4a4a;
							font-weight: bold;
							text-overflow: ellipsis;
							overflow: hidden;
							line-height: 1.2;
							white-space: nowrap;
							width: 100%;
							margin-bottom: 1rem;
						}

						p:nth-of-type(2) {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;

							img {
								width: 30px;
								height: 30px;
								border-radius: 50%;
							}
						}

						sub {
							color: #4a4a4a;
						}
					}
				}
			}
		}
	}

	@media screen and (max-width: 375px) {
		/deep/.el-checkbox {
			width: 100% !important;
		}
	}
</style>
