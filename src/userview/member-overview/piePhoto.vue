<!-- 进度条截图 -->
<template>
	<div>
		<XModal width="60%" height="80%" :name="customName" :showCrossBtn="true" :title="activePie.name+'的截图'" class="work-timeAxis"
		 @beforeOpen="dataInit" @opened="open()">
			<div style="overflow: auto;height: 100%;" :infinite-scroll-disabled="photoDis" v-infinite-scroll="loadMorePieShotShot"
			 v-loading="photoLoading" infinite-scroll-distance="10">
				<el-timeline>
					<el-timeline-item :timestamp="value.time.timeFormat('yyyy-MM-dd HH:mm:ss')" placement="top" v-for="(value,index) in progressPhotoArr"
					 :key="index" color="#409eFF">
						<el-card>
							<h4><span>进程名：{{value.pname}} </span>
								<span>窗口名：{{value.fname}}</span></h4>
							<img v-lazy="value.imgURL" alt="" style="max-width: 200px;" :preview="index">
						</el-card>
					</el-timeline-item>
					<p v-if="!morePhoto&&progressPhotoArr.length" class="g-loaded">已加载全部</p>
				</el-timeline>
				<div class="empty-proccess-list" v-if="progressPhotoArr.length==0">
					<img src="@/assets/img/emptyTask.png" alt="">
					<p>暂无进程截图</p>
				</div>
				<div v-if="progressPhotoArr.length > 0" class="load-status">
					<div class="g-loading" v-if="loading">
						<i class="el-icon-loading"></i>
						加载中...
					</div>
					<div class="g-loaded" v-if="!morePhoto">已全部加载</div>
				</div>
			</div>
		</XModal>

	</div>



</template>

<script>
	export default {
		data() {
			return {
				photoDis: false,
				photoLoading: false,
				progressPhotoArr: [],
				last: '',
				morePhoto: true,
				loading: false,
				page: 1
			}
		},
		props: {
			activePie: {
				type: Object,
				default: function() {
					return {}
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
			customName: {
				type: String,
				default: 'pieTimeAxis'
			}


		},
		components: {
			XModal: () => import('@/components/XModal.vue')

		},
		methods: {
			loadMorePieShotShot() { //加载工作条截图
				if (this.morePhoto) {
					this.page++
					this.getPiePhoto()
				}
			},
			dataInit() {
				Object.assign(this.$data, this.$options.data())
			},
			open() {
				this.photoLoading = true
				this.getPiePhoto()
			},
			getPiePhoto() {
				console.log(this.activePie)
				let params = this.activePie
				this.photoDis = true
				this.morePhoto = true
				let name = []
				if (params.name == '其它') {
					name = params.data.itemData.filter(item => {
						return item !== '其它'
					})
				}
				this.$http.post('/General/GetProcessImg.ashx', {
					pname: name.length ? JSON.stringify(name) : params.name,
					uid: params.data.id,
					stime: this.st,
					etime: this.et,
					page: this.page,
					pageCount: 15
				}).then(res => {
					if (res.res == 0) {
						this.photoLoading = false
						if (res.data.length) {
							this.progressPhotoArr = this.progressPhotoArr.concat(res.data)
							this.last = res.data[res.data.length - 1].time
							this.photoDis = false
						} else {
							this.morePhoto = false
							this.photoDis = true
						}
					}
				})
			},

		}
	}
</script>

<style lang="less" scoped="scoped">
	/deep/.ctn {
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
		}
	}
</style>
