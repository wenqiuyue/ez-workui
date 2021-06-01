<template>
	<div id="player" @click.stop="playVoice">
		<slot>
			<div class="player-item" v-show="status === 'waiting'"><i class="hiFont hi-vol-0"></i></div>
			<div class="player-item" v-show="status === 'info'"><i class="el-icon-loading"></i></div>
			<div class="player-item" v-show="status === 'success'">
				<i class="hiFont hi-vol-1" v-if="volPic == -1"></i>
				<i class="hiFont hi-vol-2" v-else-if="volPic == 0"></i>
				<i class="hiFont hi-vol-3" v-else-if="volPic == 1"></i>
				<i class="hiFont hi-vol-0" v-else></i>
			</div>
		</slot>
		<p v-show="status === 'success' || status === 'waiting'">{{ getDuration }}</p>
		<audio ref="audio">
			<source :src="audioURL" type="audio/ogg" />
			<source :src="audioURL | reName" type="audio/mpeg" />
			Your browser does not support the audio element.
		</audio>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	props: {
		file: {
			type: Object,
			default: function() {
				return {
					link: '',
					size: 0
				};
			}
		},
		duration: {
			type: Number,
			default: null
		}
	},
	computed: {
		getDuration() {
			if (this.duration) {
				let second = parseInt(this.duration % 60)<10&&this.duration / 60 >= 1 ?`0${parseInt(this.duration % 60)}''` :`${parseInt(this.duration %60)}''`;
				let minute = this.duration / 60 >= 1 ? `${parseInt(this.duration / 60)}'` : '';
				return minute + second;
			}
			return null;
		}
	},
	data() {
		return {
			volPic: null,
			time: null,
			audioURL: null,
			status: 'waiting',
			message: '加载中,请稍后'
		};
	},
	filters: {
		reName(filename) {
			if (filename) {
				return filename.replace(/ogg$|amr$|wave$/, 'mp3');
			}
			return filename;
		}
	},
	watch: {
		'file.link': {
			handler(newVal) {
				this.status = 'waiting';
				this.message = '加载中,请稍后';
			}
		}
	},
	mounted() {
		let audio = this.$refs.audio;
		let _this = this;
		const comm = err => {
			if (err.type === 'error') {
				console.log(audio.error);
			}
			clearInterval(_this.time);
			_this.volPic = null;
		};
		audio.addEventListener('error', comm, false);
		audio.addEventListener('ended', comm, false);

		audio.addEventListener(
			'canplay',
			function(e) {
				_this.status = 'success';
			},
			false
		);
		audio.addEventListener(
			'pause',
			function() {
				clearInterval(_this.time);
			},
			false
		);
	},
	methods: {
		...mapActions(['setAudio']),
		start(audio) {
			this.setAudio({
				obj: audio,
				index: this._uid
			});
			audio.play().catch(e => {
				// 音频加载失败
				console.log(e);
			});
			this.time = setInterval(() => {
				this.volPic += 1;
				if (this.volPic == 2) {
					this.volPic = -1;
				}
			}, 500);
		},
		playVoice() {
			let audio = this.$refs.audio;
			if (this.status === 'waiting') {
				this.audioURL = this.file.link;
				this.status = 'info';
				audio.load();
				this.start(audio);
			} else {
				if (this.status !== 'success') {
					this.$notify({
						type: this.status,
						message: this.message
					});
					return;
				}
				if (audio.paused) {
					this.start(audio);
				} else {
					audio.pause();
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
#player {
	display: inline-block;
	background: #f0f0f0;
	padding: 5px 20px;
	border-radius: 0.5rem;
	cursor: pointer;
	i {
		font-size: 2.5rem;
		color: #6d6d6d;
	}
	.player-item{
		display: inline-block;
		vertical-align: middle;
	}
	p {
		margin-left: 1rem;
		display: inline-block;
		vertical-align: middle
	}
}
</style>
