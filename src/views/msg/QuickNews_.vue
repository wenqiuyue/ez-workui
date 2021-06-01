<template>
	<div id="platform-chat">
		<Chat @showChatTem="showChatTem" ref="chat" :isInit="initTarget" :isModal="true">
			<div slot="header"></div>
			<el-collapse slot="otherNews" value="1">
				<el-collapse-item title="消息助手">
					<PlatformMsg @changType="changType"></PlatformMsg>
				</el-collapse-item>
			</el-collapse>
			<MsgContent slot="otherMsgTem" :isQuickMsg="true" class="msgContent" v-if="showOtherMsg" :type="type" :isModal="true"></MsgContent>
			<!-- <Msg slot="otherMsgTem" :type='type' v-if="showOtherMsg"></Msg> -->
		</Chat>
	</div>
</template>
<script>

	export default {
		data() {
			return {
				type: '',
				showOtherMsg: false,
				initTarget: false
			};
		},
		computed: {},
		components: {
			Chat: () => import('./Chat'),
			Msg: () => import('./msg'),
			MsgContent: () => import('./MsgContent'),
			PlatformMsg: () => import('./PlatformMsg'),
			Xmodal: () => import('@/components/XModal')
		},
		methods: {
			changType(type) {
				this.showOtherMsg = true;
				this.$refs['chat'].close();
				this.type = type;
			},
			showChatTem() {
				this.showOtherMsg = false;
			},
			closed() {
				this.showOtherMsg = false;
				this.$refs['chat'].target = null;
			},

		}
	};
</script>
<style>
	.quickBox{
		display: none;
	}
	.main{
		display: none;
	}
	.hp-content{
		padding: 0;
	}
	.hp-content .hp-content-child .content{
		height: 100%;
	}
	.bv_left .el-tab-pane{
     max-height: 99vh !important;	
	}
</style>

<style lang="less" scoped>

	#platform-chat {
		width: 100%;
		height: 100%;
	

		/deep/#module_bv {
			padding: 0;
		}
		/deep/ .msgBox {
			min-height: calc(100% - 6.6rem);
			padding: 0;
		}

		/deep/.msgContent {
			height: 100%;

			.baseHeader {
				position: relative;
				padding: 0;

				.header {
					height: 4rem;

					.title {
						font-size: 1.5rem;
					}

					.titleEnglish {
						font-size: 1.3rem;
					}
				}
			}

			.box {
				height: calc(100% - 5rem);
			}

			// 文件下载
			/deep/#file-list {
				.annexs {
					.anxCtn {
						.single {
							width: 98%;
						}
					}
				}
			}
		}
	}

	@media all and (max-width: 1024px) {
		#platform-chat  {
			/deep/#module_bv {
				position: relative;

				/deep/.bv_left {
					position: relative;
					width: 30%;
					height: 100%;
					left: 0;
					margin: 0;
					transform: translateX(0);
					
				}
				/deep/.bv_right {
					position: relative;
					box-sizing: border-box;
					width: 70%;
					right: 0;
					top: 0;
					height: 100%;
					padding: 0;
					margin: 0;
				}

				/deep/.msg-tip {
					/deep/.top-tip {
						top: 2px;
					}
				}

			}
		}

	}
</style>
