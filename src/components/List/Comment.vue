<template>
	<div id="comment">
		<div v-if="childVaule.length > 0" class="com_content" v-loading="loadAll || isLoading" v-infinite-scroll="turnPage"
		 :infinite-scroll-disabled="disabled" :infinite-scroll-distance="10">
			<ul>
				<li v-for="(item, i) in childVaule" :key="i">
					<div>
						<i class="hiFont hi-msg"></i>
						<div>
							<h3>
								<span>{{ item.cmName }}</span>
								<time>
									{{
										new Date(item.cmTime).getFullYear() == new Date().getFullYear()
											? item.cmTime.timeFormat('M月d日 HH:mm')
											: item.cmTime.timeFormat('yyyy年M月d日 HH:mm')
									}}
								</time>
								<a @click="changeCommentTarget(item.cmId, item.cmName, i)">回复</a>
							</h3>
							<XFroalaView v-if="item.cmComType == 0 || item.cmComType == null" :html="item.cmMess"></XFroalaView>
							<Xlayer v-else-if="item.cmComType == 1" :file="{ link: item.cmMess }" :duration="item.cmAudioSec"></Xlayer>
						</div>
					</div>
					<ul v-if="item.cmChild.length > 0">
						<li v-for="(sub, j) in item.cmChild" :key="j">
							<div>
								<i class="hiFont hi-msg"></i>
								<div>
									<h3>
										<span>{{ sub.cmcName }}</span>
										<time>
											{{
												new Date(sub.cmcTime).getFullYear() == new Date().getFullYear()
													? sub.cmcTime.timeFormat('M月d日 HH:mm')
													: sub.cmcTime.timeFormat('yyyy年M月d日 HH:mm')
											}}
										</time>
										<a @click="changeCommentTarget(sub.cmcId, sub.cmcName, i)">回复</a>
									</h3>
									<XFroalaView v-if="sub.cmComType == 0 || sub.cmComType == null" :html="sub.cmcMess"></XFroalaView>
									<Xlayer v-else-if="sub.cmComType == 1" :file="{ link: sub.cmcMess }" :duration="sub.cmAudioSec"></Xlayer>
								</div>
							</div>
						</li>
					</ul>
				</li>
				<li v-if="onTurnPage" class="g-loading">
					<i class="el-icon-loading"></i>
					加载中...
				</li>
				<li v-if="noMore" class="g-loaded">已全部加载</li>
			</ul>
		</div>
		<div v-else class="com_content no-ctn" v-loading="loadAll || isLoading">
			<div>
				<img src="../../assets/img/noNews.png" />
				<div>还没有任何评论</div>
			</div>
		</div>
		<div class="com_input">
			<div v-show="parent.name && parent.id" class="reply">
				回复：
				<span>{{ parent.name }}</span>
				<a class="hiFont hi-close" @click="clear(true)"></a>
			</div>
			<XFroala openTip allCheckbox ref="editorCmt" v-model="commentCtn" placeholder="@ 提及其他成员，按Enter快捷发送" :uploadImg="false"
			 :height="100" :maxHeight="100" :eid="evID" v-show="CommentType == 0"></XFroala>
			<XAudio v-show="CommentType == 1" @audioURL="getAudio" :showPlayer="audio.link != null"></XAudio>
			<div class="buttons">
				<ul>
					<li v-show="CommentType == 0">
						<el-tooltip class="item" effect="dark" content="@其他成员" placement="top-start">
							<el-button @click="sendTip" class="hiFont hi-alt"></el-button>
						</el-tooltip>
					</li>

					<li v-show="CommentType == 0">
						<el-tooltip class="item" effect="dark" content="插入图片" placement="top-start">
							<el-upload ref="upload" :action="this.$url + '/Handler/FroalaHandler.ashx'" :on-success="handleSuccess"
							 :on-error="handleError" :before-upload="beforUp" :show-file-list="false" accept="image/*">
								<el-button slot="trigger" class="el-icon-picture"></el-button>
							</el-upload>
						</el-tooltip>
					</li>
					<li v-show="CommentType == 0">
						<el-dropdown trigger="click" @command="screenShot">
							<span class="el-dropdown-link">
								<button><i class="el-icon-scissors"></i></button>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="0">最小化当前窗口截图</el-dropdown-item>
								<el-dropdown-item command="1">当前窗口截图</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</li>
					<li v-show="CommentType == 0" class="audio">
						<el-button @click="sendAudio(1)" class="hiFont hi-micro-o"></el-button>
					</li>
					<li v-show="CommentType == 1" class="audio">
						<el-button @click="sendAudio(0)" class="hiFont hi-keyboard"></el-button>
					</li>
				</ul>
				<el-button v-if="isSending || commitLoading" type="primary" :loading="true">提交中</el-button>
				<el-button v-else-if="CommentType == 0" type="primary" @click="sendComment">发送评论</el-button>
				<el-button v-else-if="CommentType == 1" type="primary" @click="sendComment">发送语音</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			//页面数据，需要固定格式
			pageData: {
				type: Array,
				default: function() {
					return [];
				}
			},
			//控制加载整个评论区域（通过外部控制）
			loadAll: {
				type: Boolean,
				default: false
			},
			//控制翻页加载的显示，值表示是否在翻页加载中
			onTurnPage: {
				type: Boolean,
				default: false
			},
			//是否数据已经加载完毕
			noMore: {
				type: Boolean,
				default: true
			},
			//是否禁用提交按钮
			commitLoading: {
				type: Boolean,
				default: false
			},
			evID: {
				type: Number,
				default: null
			}
		},
		model: {
			prop: 'pageData',
			event: 'upItem'
		},
		watch: {
			pageData: {
				handler(newval) {
					this.childVaule = newval;
				},
				immediate: true
			},
			childVaule: function(newval) {
				this.$emit('upItem', newval);
			}
		},
		components: {
			XFroala: () => import('@/components/XFroala'),
			XFroalaView: () => import('@/components/XFroalaView'),
			XAudio: () => import('@/components/Audio/H5'),
			Xlayer: () => import('@/components/Audio/player')
		},
		computed: {
			...mapState(['user']),
			disabled() {
				return this.onTurnPage || this.noMore;
			}
		},
		data() {
			return {
				commentCtn: null, //用户输入的内容
				isLoading: false, //控制加载整个评论区（通过内部控制）
				isSending: false, //是否在发送中
				parent: {
					name: null,
					id: null,
					index: null
				},
				CommentType: 0,
				audio: {
					link: null,
					duration: null
				},
				childVaule: [],
				photos: ''
			};
		},
		methods: {
			getAudio(audio) {
				this.audio.link = audio.url.link;
				this.audio.duration = audio.duration;
			},
			//发送@消息
			sendTip() {
				this.$refs.editorCmt.insertText();
			},
			//选择图片
			handleSuccess(response) {
				if (response.link) {
					let html = `<img src='${response.link}' style='width: 300px;' class='fr-fic fr-dii fr-draggable'>`;
					this.$refs.editorCmt.$refs.froala._editor.html.insert(html, true);
				}
			},
			beforUp(file) {
				let pattern = /image\/.*/;
				return pattern.test(file.type);
			},
			handleError(err) {
				this.$notify({
					type: 'error',
					message: '图片上传失败，请重试'
				});
			},
			//发生类型
			sendAudio(flag) {
				this.CommentType = flag;
			},
			// 提交评论 返回内容和层次信息
			sendComment() {
				if (this.CommentType == 0) {
					let temp = this.commentCtn;
					if (temp) {
						if (temp.indexOf("<img src=") == -1) {
							//tmp用于判断将标签排除后是否内容为空
							temp = temp.replace(/<(\S*?)[^>]*>.*?|<.*?\/>/g, '');
							temp = temp.replace(/&nbsp;/g, '');
							temp = temp.replace(/\s*/g, '');
						}
					}
					if (!temp) return;
				}
				if (this.CommentType == 1 && !this.audio.link) return;
				this.isLoading = true;
				this.isSending = true;
				const result = {
					CommentType: this.CommentType, //类型 0文本 1语音
					AudioSec: this.audio.duration, //语音时长
					ctn: this.CommentType == 0 ? this.commentCtn : this.audio.link, //评论类容
					parent: this.parent //回复的人
				};
				this.$emit('sendComment', result);
			},
			//回复成功的方法
			success(data) {
				this.isLoading = false;
				this.isSending = false;
				this.$notify({
					message: '评论成功',
					type: 'success'
				});
				if (this.parent.index != null) {
					let msg = {
						cmcId: data.COId, //id
						cmcName: this.user.name, //姓名
						cmcTime: data.CTime, //时间
						cmcMess: data.Mess, //内容
						cmComType: data.CommentType, //类型
						cmAudioSec: data.AudioSec //时长
					};
					//子
					this.childVaule[this.parent.index].cmChild.push(msg);
				} else {
					let msg = {
						cmId: data.COId, //id
						cmName: this.user.name, //姓名
						cmTime: data.CTime, //时间
						cmMess: data.Mess, //内容
						cmComType: data.CommentType, //类型
						cmAudioSec: data.AudioSec, //时长
						cmChild: []
					};
					//父
					this.childVaule.splice(0, 0, msg);
				}
				this.clear();
			},
			//无限加载方法
			turnPage() {
				//通知父组件执行翻页方法
				this.$emit('turnPage');
			},
			//清空评论区及回复对象
			clear(onlyParent = false) {
				this.parent = {
					name: null,
					id: null,
					index: null
				};
				this.audio = {
					link: null,
					duration: null
				};
				if (!onlyParent) {
					this.commentCtn = '';
				}
			},
			//回复的id名字
			changeCommentTarget(id, name, index) {
				this.parent.id = id;
				this.parent.name = name;
				this.parent.index = index;
			},
			//加载整个评论区（true开始加载，false停止加载）
			loading(flag) {
				this.loading = flag;
			},
			screenShot(command) {
				// this.$toClient('ScShot', {
				// 	hide: command == 0 ? true : false,
				// 	npic: false,
				// 	type:2
				// })
				let params = {
					hide: command == 0 ? true : false,
					npic: true,
					type: 2
				}
				this.$http.post('/Work/WrokAreas/NoticeUserInputScreenshots.ashx', params).then()
			}
		},
		created() {
			this.$E.$on('scShot', res => {
				if (res.type == 2) {
					let arr = JSON.parse(res.imgUrl)
					let html = ""
					if (arr.length) {
						html = `<img src=${this.$url+JSON.parse(res.imgUrl)[0].ImgUrl} style="width:200px"/>`
					} else {
						html = ""
						this.$message({
							type: 'warning',
							message: '截图失败'
						})
					}
					if (!this.commentCtn || this.commentCtn == null) {
						this.commentCtn = ""
					}
					this.commentCtn += html
				}
			})
		}
	};
</script>

<style lang="less" scoped>
	#comment {
		background: rgba(255, 255, 255, 1);
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-flow: column;
		position: relative;

		//评论列表
		.com_content {
			flex: 1;
			padding: 1.5rem 3rem;
			overflow-y: auto;
			overflow-x: hidden;

			&>ul {
				padding-right: 0.5rem;

				li {
					position: relative;
					padding: 0.8rem 3rem;
					padding-right: 0;
					border-bottom: 1px solid #eee;

					&>div {
						&>i {
							position: absolute;
							left: 0;
							top: 1.1rem;
							font-size: 1.6rem;
							font-weight: normal;
							color: #bbb;
						}

						&>div {
							&>h3 {
								margin-bottom: 0.5rem;
								position: relative;

								&>span {
									margin-right: 0.5rem;
									color: #575757;
									font-weight: 600;
								}

								&>time {
									color: #9b9b9b;
									font-size: 90%;
								}

								&>a {
									position: absolute;
									right: 0;
									top: 0.15rem;
									color: #448ef5;
									font-size: 1.4rem;
									cursor: pointer;
								}
							}

							.fr-view {
								color: #777;

								/deep/ s {
									color: #448ef5;
									text-decoration: none;
								}
							}
						}
					}

					&>ul {
						border-top: 1px dashed #eee;
						margin-top: 1.6rem;

						li {
							border-bottom: 1px dashed #eee;
						}
					}

					&:last-child {
						border-bottom: none;
					}
				}
			}
		}

		.no-ctn {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			text-align: center;
			justify-content: center;
			font-size: 1.8rem;
			color: #aaa;
			box-sizing: border-box;
			padding: 0 2rem;

			img {
				width: 100%;
				max-width: 32rem;
				margin-bottom: 5rem;
			}
		}

		//评论输入框
		.com_input {
			padding: 0.8rem 0 0 5px;
			border-top: 1px solid #ddd;
			position: relative;

			/deep/.fr-box {
				z-index: 1 !important;
			}

			/deep/ .fr-toolbar {
				display: none;
			}

			/deep/ .fr-wrapper {
				border: none;
			}

			.reply {
				padding: 0.5rem 1rem 0.5rem 0;
				margin-left: 2rem;
				display: inline-block;

				span {
					color: #448ef5;
					font-weight: 600;
				}

				a {
					font-size: 1rem;
					width: 2.4rem;
					color: #ccc;
					margin-left: 0.5rem;
					cursor: pointer;
				}

				&:hover {
					background: #f2f2f2;
				}
			}

			#xfroala-box {
				padding-bottom: 5.1rem;

				/deep/ .fr-element {
					padding: 0 1rem 0 2rem;
				}
			}

			#recorder {
				height: 70px;
				margin-left: 2rem;
				align-items: center;
				margin-bottom: 5rem;
				// width: 93%;
				width: 74%;
			}

			.buttons {
				left: 0;
				bottom: .5rem;
				width: 100%;
				position: absolute;
				display: flex;
				align-items: center;
				padding: 0 1.6rem;
				box-sizing: border-box;

				&>ul {
					display: flex;
					align-items: center;
					flex: auto;
					margin-right: 1rem;

					li {
						display: inline-block;
						vertical-align: middle;

						div {
							height: 2rem;
							line-height: 2rem;
							font-size: 1.4rem;
							margin-left: 0.5rem;
						}
					}

					.audio {
						flex: auto;
						border: 1px solid #cccccc;
						border-radius: 4px;
						padding: 0.7rem 0;
						margin-left: 1rem;

						.hiFont {
							width: 100%;
							font-size: 2.5rem;
						}
					}

					a,
					button {
						background: none;
						border: none;
						display: inline-block;
						width: 3.2rem;
						height: 2rem;
						font-size: 2rem;
						padding: 0;
						cursor: pointer;
						text-align: center;
						transition: all 0.3s ease;

						&:hover {
							color: #448ef5;
						}
					}
				}
			}
		}
	}

	@media screen and (max-width: 1024px) {

		//评论区域（移动端）
		#comment {

			//评论列表
			.com_content {
				padding: 2rem 1.5rem;

				ul {
					&>li {
						&>div {
							&>h3 {
								&>a {
									opacity: 1;
								}
							}
						}
					}
				}
			}

			//评论输入区域
			.com_input {
				.reply {
					margin-left: 0rem;
				}

				#xfroala-box {
					padding-bottom: 6.2rem;

					/deep/.fr-wrapper.show-placeholder .fr-placeholder {
						padding-left: 0 !important;
					}

					/deep/.fr-element {
						padding: 0.8rem 1rem 0 0;
					}
				}

				.buttons {
					padding: 0 1rem;
				}

				#recorder {
					height: 14rem;

					/deep/.record {
						.record-tip {
							font-size: 1.6rem;
						}

						.record-box {
							.centant {
								height: 6rem;
								width: 6rem;

								svg {
									width: 40px;
									height: 40px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
