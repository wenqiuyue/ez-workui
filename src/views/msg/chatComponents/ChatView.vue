<!-- 聊天窗口各种消息 -->
<template>
	<div class="msg" ref="msgBox">
		<AcceptTask :Jid="Jid" @success="getData" :customName="customName" :readonly="isReadOnly"></AcceptTask>
		<PictureView :src="imgSrc" ref="picView"></PictureView>
		<!-- 消息 -->
		<div class="msg-box" v-for="(item, index) in msgList" :key="index">
			<!-- 快速安排任务 -->
			<div class="msg-item" v-if="item.SpeedJobData">
				<div class="one-msg pc-msg" :class="{ 'phone-msg': item.Name === user.name }">
					<p>
						<span>{{ item.Name }}</span>
						<span>{{ item.CreateTime.timeFormat('yyyy-MM-dd HH:mm:ss') }}</span>
					</p>
					<div class="msg-body">
						<div class="task-box" @click="toAcceptJob(item.SpeedJobData, index)">
							<div>
								<i class="hiFont hi-task"></i>
								<p v-if="item.SpeedJobData.CtnType == 1">{{ item.SpeedJobData.JobName }}</p>
								<p v-else><player :file="fileFilter(item.SpeedJobData.JobName, item.SpeedJobData.AudioSec)" :duration="item.SpeedJobData.AudioSec"></player></p>
							</div>
							<div>
								<div>
									<img v-lazy="$url + item.SpeedJobData.Picture" />
									<span>{{ item.SpeedJobData.Name }}</span>
								</div>
								<div>
									<i v-if="item.SpeedJobData.Status == 1">
										<b class="hiFont hi-stop-cr"></b>
										未接收
									</i>
									<i v-else-if="item.SpeedJobData.Status == 3">
										<b class="hiFont hi-pause-cr"></b>
										已拒收
									</i>
									<i v-else style="color: #73D13D;">
										<b class="hiFont hi-finished-cr" style="color: #73D13D;"></b>
										已接收
									</i>
									<sub v-if="item.SpeedJobData.EstimateTime">预计：{{ item.SpeedJobData.EstimateTime }}小时</sub>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="member-pic"><img v-lazy="$url + item.HeadImg" /></div>
			</div>

			<!-- 普通消息 -->
			<div class="msg-item" v-if="item.Type == null && (!item.Special || item.Special == false) && !item.SpeedJobData">
				<!-- <div class="member-pic" v-if="0"><img v-lazy="$url+user.img"></div> -->
				<div class="one-msg pc-msg " :class="{ 'phone-msg': item.Name === user.name }">
					<p>
						<span>{{ item.Name }}</span>
						<span>{{ item.CreateTime.timeFormat('yyyy-MM-dd HH:mm:ss') }}</span>
					</p>
					<!-- item.content   -->
					<div class="msg-body pc-msg-body" :ref="'msg' + index" v-html="filterImg(item.Mess, index)"></div>
				</div>
				<div class="member-pic"><img v-lazy="$url + item.HeadImg" /></div>
			</div>
			<!-- 抖动 -->
			<div class="shake-msg" v-else-if="item.Special == true && !item.SpeedJobData">
				<p>{{ item.CreateTime.timeFormat('yyyy-MM-dd HH:mm:ss') }}</p>
				<p>
					<i class="el-icon-check"></i>
					{{ item.Mess }}
				</p>
			</div>
			<!-- 文件消息 -->
			<div class="msg-item" v-if="item.Type == 1 && !item.SpeedJobData">
				<div class="member-pic" v-if="0"><img v-lazy="$url + item.picture" /></div>
				<div class="one-msg pc-msg" :class="{ 'phone-msg': item.Name === user.name }">
					<p>
						<span>{{ item.Name }}</span>
						<span>{{ item.CreateTime.timeFormat('yyyy-MM-dd HH:mm:ss') }}</span>
					</p>
					<div class="msg-body">
						<div class="file-box">
							<div>
								<img v-lazy="$getFileImg(item.FileData[0].link)" />
								<div>
									<P>{{ item.FileData[0].fileName | handleText }}</P>
									<P>{{ (item.FileData[0].fileSize / 1024 / 1024).toFixed(2) + 'M' }}</P>
								</div>
							</div>
							<div @click="downLoadFile(item)">下载</div>
						</div>
					</div>
				</div>
				<div class="member-pic"><img v-lazy="$url +  item.HeadImg" /></div>
			</div>
			<!-- 语音消息 -->
			<div class="msg-item" v-if="item.Type == 2 && !item.SpeedJobData">
				<div class="member-pic" v-if="0"><img v-lazy="$url + item.picture" /></div>
				<div class="one-msg pc-msg" :class="{ 'phone-msg': item.Name === user.name }">
					<p>
						<span>{{ item.Name }}</span>
						<span>{{ item.CreateTime.timeFormat('yyyy-MM-dd HH:mm:ss') }}</span>
					</p>
					<div class="msg-body" @click="playVoice(item.FileData[0].link, index)">
						<player :file="fileFilter(item.FileData[0].link, item.AudioSec)" :duration="item.AudioSec"></player>
					</div>
				</div>
				<div class="member-pic"><img v-lazy="$url + item.HeadImg" /></div>
			</div>
		</div>
		<taskDetail :type="1" :url="'/task/' + eventId + '/' + jobId" v-model="jobId" :refer="refer"></taskDetail>
	</div>
</template>
<script>
import { mapState } from 'vuex';
const getAudio = (() => {
	var audio;
	return function() {
		if (!audio) {
			return (audio = new Audio());
		} else {
			return audio;
		}
	};
})();

export default {
	props: {
		msgList: {
			type: Array,
			default: function() {
				return [];
			}
		},
		onlyPic: {
			type: Boolean,
			default: false
		},
		isChatRecord: {
			type: Boolean,
			default: false
		}
	},
	components: {
		PictureView: () => import('./PictureView'),
		AcceptTask: () => import('@/views/task/AcceptTask'),
		taskDetail: () => import('@/views/task/taskDetail'),
		player: () => import('@/components/Audio/player')
	},
	data() {
		return {
			volPic: -1,
			playing: -1, //
			imgSrc: '',
			Jid: null,
			jobId: null,
			eventId: null,
			customName: 'chatRecieveTask',
			refer: '',
			isReadOnly: false,
			lastHeight: null
		};
	},
	mounted() {
		this.$emit('initialized');
		this.refer = window.location.pathname;
	},
	watch: {
		msgList(val, old) {
			this.$nextTick(() => {
				if (old.length == 0 ||this.lastHeight-this.$refs.msgBox.scrollTop <=30) {
					this.$refs.msgBox.scrollTop = this.$refs.msgBox.scrollHeight;
					this.lastHeight = this.$refs.msgBox.scrollTop;
				} 
			});
		}
	},
	computed: {
		...mapState(['user'])
	},
	filters: {
		handleText(val) {
			if (val.length > 14) {
				return val.slice(0, 7) + '...' + val.slice(val.length - 7, val.length);
			}
			return val;
		}
	},
	methods: {
		fileFilter(url, size) {
			return {
				link: url,
				size
			};
		},
		downLoadFile(item) {
			let id = item.FileData[0].fileId;
			window.location.href = this.$url + '/General/DownloadFile.ashx?fid=' + id + '&a=' + this.$xStorage.getItem('token');
		},
		filterImg(content, index) {
			let target = 'msg' + index;
			this.$nextTick(() => {
				let listImg = [...this.$refs[target][0].getElementsByTagName('img')];
				if (listImg.length > 0) {
					listImg.forEach(element => {
						this.addEvent(element);
					});
				}
			});
			return content;
		},
		addEvent(img) {
			img.onclick = () => {
				this.imgSrc = img.src;
				this.$refs['picView'].show();
			};
		},
		// //播放语音
		playVoice: (function() {
			let time;
			return function(audioURL, index) {
				this.playing = index;
				this.volPic == 1;
				clearInterval(time);
				var audio = getAudio();
				audio.src = this.$url + '/Msg/Chat/audioFileStream.ashx?Url=' + audioURL;
				let self = this;
				time = setInterval(() => {
					this.volPic += 1;
					if (this.volPic == 2) {
						this.volPic = -1;
					}
				}, 500);
				audio.onended = function() {
					clearInterval(time);
					self.playing = -1;
					self.volPic = -1;
				};
				audio.onerror = function(e) {
					clearInterval(time);
					self.playing = -1;
					self.volPic = -1;
				};
				audio.oncanplay = function() {
					console.log('playing');
					audio.play();
				};
			};
		})(),
		toAcceptJob(item, index) {
			console.log(item);
			if (item.JobId) {
				////任务详情
				this.jobId = item.JobId;
				this.eventId = item.EventId;
				if (this.eventId && this.jobId) {
					this.$modal.show('taskDetail');
				}
			} else {
				this.Jid = item.Id;
				if (this.Jid && !this.isChatRecord) {
					this.customName = 'chatRecieveTask';
				} else {
					this.customName = 'chatRecordRecieveTask';
				}
				this.$modal.show(this.customName);
			}
		},
		getData(res) {
			console.log('emit');
			this.$emit('reloadList');
		}
	}
};
</script>
<style lang="less" scoped>
.msg {
	height: 100%;
	flex-wrap: 1;
	overflow-y: auto;
	overflow-x: hidden;

	.msg-box {
		margin: 1.5rem 1rem;
		position: relative;
	}

	.msg-item {
		display: flex;
		font-size: 1.5rem;

		.one-msg {
			width: 0;
			flex-grow: 1;
			margin: 0 1rem;

			> p {
				color: #a29f9f;
				font-size: 1.3rem;

				span:last-child {
					margin: 0 1rem;
				}
			}

			.msg-body {
				padding: 0.7rem 0.7rem;
				position: relative;
				background: #f0f0f0;
				display: inline-block;
				border-radius: 0.5rem;
				white-space: pre-wrap;
				word-wrap: break-word;
				max-width: 100%;
				color: #4b4b4b;
				margin-top: 0.3rem;

				/deep/ img {
					max-width: 300px !important;
				}
			}
		}

		.member-pic {
			height: 3rem;
			width: 3rem;
			background: rgba(121, 193, 251, 1);
			border-radius: 50%;
			overflow: hidden;

			img {
				height: 100%;
				width: 100%;
			}
		}
	}

	.shake-msg {
		text-align: center;
		color: #626262;
		font-size: 1rem;

		p:last-child {
			font-size: 1.2rem;
			padding: 0.2rem 1rem;
			background: #ececec;
			border-radius: 1rem;
			display: inline-block;
			margin-top: 0.2rem;
		}
	}
}

.pc-msg {
	order: 1;
}

.pc-msg-body {
	float: left;
}

.msg-body::after {
	content: '';
	display: block;
	border: 5px solid transparent;
	border-right: 15px solid #f0f0f0;
	transform: rotate(30deg);
	position: absolute;
	left: -14px;
	top: 7px;
}

.record-msg {
	display: flex;
	align-items: center;
	color: #5a5a5a;

	i {
		font-size: 2.3rem;
	}
}

.file-box {
	border-radius: 5px;
	background: white;
	overflow: hidden;
	display: flex;

	& > div:first-child {
		margin: 0 1rem 1rem 1rem;
		display: flex;
		align-items: center;
		padding-top: 1rem;

		img {
			height: 5rem;
			width: 4rem;
			margin-right: 1rem;
		}

		> div {
			width: calc(100% - 5rem);
		}

		div p:first-child {
			font-size: 1.5rem;
			color: #5c5c5c;
		}

		div p:last-child {
			font-size: 1.2rem;
			color: #a4a4a4;
			margin-top: 0.2rem;
		}
	}

	& > div:last-child {
		display: flex;
		justify-content: center;
		align-items: center;
		border-left: 1px solid #f0f0f0;
		padding: 0 1rem;
		color: #2196f3;
		cursor: pointer;
	}

	& > div:last-child:hover {
		background: #2196f3;
		color: white;
	}
}
.task-box {
	display: flex;
	flex-direction: column;
	border-radius: 5px;
	background: white;
	overflow: hidden;
	padding: 1rem;
	// width: 260px;
	min-width: 220px;
	cursor: pointer;
	& > div:first-child {
		display: flex;
		margin-bottom: 1rem;
		i {
			font-size: 1.8rem;
			color: #6d6d6d;
			margin-right: 0.5rem;
			// width: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		p {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #333;
			// text-align: left;
			display: flex;
		}
	}
	& > div:last-child {
		display: flex;
		align-items: center;
		justify-content: space-between;
		img {
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			margin-right: 1rem;
		}
		span {
			flex: 0 0 50px;
			font-size: 1.4rem;
			color: #6d6d6d;
		}
		div {
			display: flex;
			align-items: center;
		}
		div:last-child {
			justify-content: space-between;
			flex: 0 0 140px;
			i,
			sub {
				font-size: 1.3rem;
				color: #6d6d6d;
			}
			b {
				font-size: 1.4rem;
				color: #fe4e4f;
				margin-right: 0.3rem;
			}
			i {
				color: #fe4e4f;
			}
		}
	}
}

.el-icon-check {
	background: rgb(0, 209, 10);
	border-radius: 50%;
	color: white;
	padding: 0.1rem;
}

@media screen and (max-width: 1024px) {
	.phone-msg {
		order: 0;

		p {
			text-align: end;

			span:first-child {
				float: right;
			}
		}

		div {
			float: right;
		}

		div::after {
			transform: rotate(-30deg);
			border-left: 15px solid #f0f0f0;
			border-right: none;
			right: -10px;
			left: auto;
		}
	}
	.msg {
		.msg-item {
			.one-msg {
				.msg-body {
					/deep/ img {
						max-width: 100% !important;
					}
				}
			}
		}
	}
}
</style>
