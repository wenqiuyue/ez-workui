<template>
	<div id="recorder">
		<div class="record" @click.stop="initRecorder()" v-loading="">
			<slot>
				<div class="record-box">
					<span class="centant" :class="{ startRecord: recorder.isrecording }">
						<svg t="1575860688961" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2552" :width="getSize" :height="getSize">
							<path
								d="M518.42953584 62a178.71428584 178.71428584 0 0 1 178.71428583 178.71428584v285.42857168a178.71428584 178.71428584 0 0 1-357.42857167 0V240.71428584A178.71428584 178.71428584 0 0 1 518.42953584 62z m0 64.28571416a114.42857168 114.42857168 0 0 0-114.42857168 114.42857168v285.42857168a114.42857168 114.42857168 0 0 0 228.85714336 0V240.71428584A114.42857168 114.42857168 0 0 0 518.42953584 126.28571416z"
								p-id="2553"
								fill="#ffffff"
							></path>
							<path
								d="M743.42953584 897.71428584h-192.85714336v-68.14285752A321.42857168 321.42857168 0 0 0 833.42953584 512a32.14285752 32.14285752 0 1 0-64.28571417 0 257.14285752 257.14285752 0 0 1-514.28571415 0 32.14285752 32.14285752 0 0 0-64.28571504 0 321.42857168 321.42857168 0 0 0 295.71428584 321.42857168v64.28571416h-192.85714248a32.14285752 32.14285752 0 0 0 0 64.28571416h450a32.14285752 32.14285752 0 0 0 0-64.28571416z"
								p-id="2554"
								fill="#ffffff"
							></path>
						</svg>
						<template v-if="startRecord">
							<div class="circle circle1"></div>
							<div class="circle circle2"></div>
							<div class="circle circle3"></div>
							<div class="circle circle4"></div>
						</template>
					</span>
				</div>
			</slot>
			<div v-if="startRecord" class="record-tip">{{ getRecordTime }}</div>
		</div>
		<player :file="url" :duration="lastTime" v-if="showPlayer"></player>
	</div>
</template>

<script>
import Recorder from 'js-audio-recorder';
export default {
	components: {
		player: () => import('./player')
	},
	data() {
		return {
			recorder: null,
			recordTime: 0,
			lastTime: 0,
			timer: null,
			url: {},
			startRecord: false,
			recordObj: null,
			upURL: '/Handler/ChatUploadFile.ashx',
			upLoad: false
		};
	},
	props: {
		maxRecorderTime: {
			type: Number,
			default: 60
		},
		size: {
			type: String,
			default: 'small'
		},
		showPlayer: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		getRecordTime() {
			let count = this.recordTime / 100;
			let second = count % 60 < 10 ? `0${parseInt(count % 60)}` : parseInt(count % 60) + '';
			let minute = Math.floor(count / 60) < 10 ? `0${Math.floor(count / 60)}:` : Math.floor(count / 60) + ':';
			return minute + second;
		},
		getSize() {
			switch (this.size) {
				case 'medium':
					return 64;
				case 'small':
					return 32;
				case 'mini':
					return 16;
			}
		}
	},
	methods: {
		initRecorder() {
			this.$emit('click');
			if (this.startRecord) {
				if (typeof plus === 'undefined') {
					this.closeH5();
				} else {
					this.closeAPP();
				}
				this.startRecord = false;
			} else {
				this.startRecord = true;
				if (typeof plus === 'undefined') {
					this.getStartH5();
				} else {
					this.getStartAPP();
				}
			}
		},
		send(fileName) {
			let downURL;
			if (process.env.NODE_ENV === 'development') {
				downURL = this.$url;
			} else {
				downURL = window.location.protocol + '//' + window.location.host;
			}
			downURL += this.upURL;
			let _this = this;
			let upload = plus.uploader.createUpload(
				downURL,
				{
					method: 'POST'
				},
				function(file, status) {
					if (status == 200) {
						_this.upLoad = false;
						let res = JSON.parse(file.responseText);
						if (res.length) {
							_this.url = res[0];
							_this.lastTime = parseInt(_this.recordTime / 100);
							let result = {
								url: res[0],
								duration: _this.lastTime
							};
							_this.$emit('audioURL', result);
						}
						// 请求本地文件系统对象
						plus.io.resolveLocalFileSystemURL(
							fileName,
							function(entry) {
								// remove this file
								entry.remove(
									function(entry) {},
									function(e) {
										console.log('删除录音文件出错：' + e.message);
									}
								);
							},
							function(error) {
								console.log('获取录音文件出错：' + error);
							}
						);
					}
				}
			);
			upload.addFile(fileName, { key: fileName });
			upload.addData('type', 'audio');
			this.upLoad = true;
			upload.start();
		},
		getStartAPP() {
			let audio = plus.audio.getRecorder();
			this.recordObj = audio;
			// console.log('设备录音支持的采用率:');
			// console.log(audio.supportedSamplerates);
			// console.log('设备录音支持的文件格式:');
			// console.log(audio.supportedFormats);
			//开始录音
			const success = success => {
				this.send(success);
			};
			const err = err => {
				clearInterval(this.time);
				this.startRecord = false;
				this.$notify({
					title: '录音失败',
					type: 'error',
					message: err.message
				});
			};
			this.beforStart();
			audio.record(
				{
					channels: 'mono',
					format: 'amr'
				},
				success,
				err
			);
		},
		getStartH5() {
			//开始录音
			this.recorder.start().then(
				() => {
					this.beforStart();
				},
				error => {
					this.$notify({
						type: 'error',
						message: '浏览器不支持录音'
					});
					this.startRecord = false;
					this.beforClose();
					console.log(`${error}`);
				}
			);
		},
		beforStart() {
			this.recordTime = 0;
			clearInterval(this.timer);
			this.timer = null;
			this.getTime();
		},
		beforClose() {
			this.startRecord = false;
			clearInterval(this.timer);
			this.timer = null;
		},
		closeH5() {
			this.beforClose();
			let blob = this.recorder.getWAVBlob();
			let audioFile = new File([blob], Date.now() + '.ogg', {
				type: 'audio/ogg',
				lastModified: Date.now()
			});
			this.uploadFile(audioFile);
		},
		closeAPP() {
			this.beforClose();
			this.recordObj.stop();
		},
		getTime() {
			if (this.timer == null) {
				this.timer = setInterval(() => {
					if (this.recordTime >= this.maxRecorderTime * 100) {
						if (typeof plus === 'undefined') {
							this.closeH5();
						} else {
							this.closeAPP();
						}
					} else {
						this.recordTime++;
					}
				}, 10);
			}
		},
		async uploadFile(file) {
			let formdate = new FormData();
			formdate.append('file', file);
			formdate.append('type', 'audio');
			try {
				this.upLoad = true;
				let res = await this.$http.post(this.upURL, formdate);
				this.upLoad = false;
				if (res.length) {
					this.url = res[0];
				}
				this.lastTime = parseInt(this.recorder.duration);
				let result = {
					url: res[0],
					duration: this.lastTime
				};
				this.$emit('audioURL', result);
			} catch (error) {
				console.log('聊天文件上传错误', error);
			}
		}
	},
	created() {
		this.recorder = new Recorder({
			sampleBits: 8
		});
	},
	destroyed() {
		this.recorder.destroy();
	}
};
</script>

<style lang="less" scoped>
#recorder {
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	.record {
		margin-right: 2rem;
		// width: 100%;
		.record-tip {
			text-align: center;
			line-height: 10px;
		}
		.record-box {
			margin-bottom: 1rem;
			cursor: pointer;
			.centant {
				padding: 10px;
				border-radius: 50%;
				display: flex;
				background-color: #4690f5;
				width: 2rem;
				height: 2rem;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
			}
		}
	}
}

.circle {
	position: absolute;
	width: 100%;
	height: 100%;
	left: -3px;
	top: -3px;
	border-radius: 50%;
	border: 3px solid #ffffff;
}

.circle1 {
	animation: circle-opacity 3s infinite;
}

.circle2 {
	animation: circle-opacity 3s infinite;
	animation-delay: 1s;
}

.circle3 {
	animation: circle-opacity 3s infinite;
	animation-delay: 2s;
}

.circle4 {
	animation: circle-opacity 3s infinite;
	animation-delay: 3s;
}

.startRecord {
	background-color: rgba(68, 149, 245, 0.5) !important;
}

@keyframes circle-opacity {
	from {
		opacity: 1;
		transform: scale(0);
	}

	to {
		opacity: 0;
		transform: scale(1);
	}
}
</style>
