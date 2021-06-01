<template>
	<div>
		<Xmodal name="quickNews" width="70%" height="80%" @beforeClose="closed" id="quickNews">
			<Chat @showChatTem="showChatTem" ref="chat" :isInit="initTarget" :isModal="true">
				<div slot="header"></div>
				<el-collapse slot="otherNews" value="1">
					<el-collapse-item title="消息助手" name="1">
						<PlatformMsg @changType="changType"></PlatformMsg>
					</el-collapse-item>
				</el-collapse>
				<MsgContent slot="otherMsgTem" :isQuickMsg="true" class="msgContent" v-if="showOtherMsg" :type="type" :isModal="true"></MsgContent>
				<!-- <Msg slot="otherMsgTem" :type='type' v-if="showOtherMsg"></Msg> -->
			</Chat>
		</Xmodal>
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
			}
		}
	};
</script>

<style lang="less" scoped>
	#quickNews {
		/deep/.main-box {
			height: calc(100% - 1rem);
			padding-top: 1rem;
		}

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
</style>
