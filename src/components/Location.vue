<!-- 
	@Description: 定位弹框
	@Author:zxg 
	@Date:2019-11-7 update:11-15
	@params: width、height【弹出内容的宽高 单位rem 不是PX】   isShow【默认是否显示弹框】
	emit : beforeOpen()【打开弹框之前的事件,可用于加载数据 】
-->
<template>
	<div class="location">
		<!-- other 其他内容 -->
		<slot name="other"></slot>
		<!-- button 点击出现的按钮 -->
		<div @click.stop="open($event)" class="c_button">
			<!-- <div @click.stop="show($event)" style="position: fixed;top: 850px;left: 1000px;"> -->
			<slot name="LocationButton"></slot>
		</div>
		<!-- content 显示的内容 -->
		<transition :name="animationName">
			<div
				ref="location"
				@click.stop
				:class="{ 'l-relative': true, phoneFull: phoneFull }"
				:style="{ width: `${width}px`, height: `${height}px`, left: left, top: top, bottom: bottom, right: right }"
				v-show="show"
			>
				<slot name="content"></slot>
			</div>
		</transition>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	props: {
		//正文弹出的宽度 单位：px
		width: {
			type: String,
			default: '0'
		},
		//正文弹出的高度 单位：px
		height: {
			type: String,
			default: '0'
		},
		//自定义弹出位置，基于窗口
		position: {
			type: Object,
			default: null
		},
		//手机全屏
		phoneFull: {
			type: Boolean,
			default: false
		},
		//只读不弹
		readonly: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapState(['locationSingle'])
	},
	data() {
		return {
			animationName: null,
			top: null,
			left: null,
			bottom: null,
			right: null,
			show: false
		};
	},
	methods: {
		...mapActions(['location_SetObject']),
		open(event) {
			if (this.readonly) return;
			if (this.locationSingle == null) {
				this.location_SetObject(this);
			} else {
				if (this.locationSingle._uid != this._uid) {
					this.locationSingle.isShow(false);
					this.location_SetObject(this);
				} else {
					if (this.show) {
						return;
					}
				}
			}
			//是否自定义弹出位置
			if (this.position != null) {
				this.left = this.position.offLeft;
				this.top = this.position.offTop;
				this.right = this.position.offRight;
				this.bottom = this.position.offBottom;
			} else {
				//游览器兼容性
				const e = window.event || event;
				let path = event.path || (event.composedPath && event.composedPath());
				for (let i = 0; i < path.length; i++) {
					if (path[i].className.indexOf('mem-add') > -1 || path[i].className === 'c_button') {
						path = path[i];
						break;
					}
				}
				this.top = null;
				this.left = null;
				this.bottom = null;
				let height = e.view.innerHeight; //文档可视高
				let width = e.view.innerWidth; //文档可视宽
				let target = path.getBoundingClientRect(); //点击的按钮
				let X = target.x + target.width / 2; //按钮宽度的中间
				let topY = target.y; //按钮高度的上面
				let centerY = target.y + target.height / 2; //按钮高度的中间
				let bottomY = target.y + target.height; //按钮高度的下面
				let elWidth = parseInt(this.width); //选择器宽度
				let elHeight = parseInt(this.height); //选择器高度
				if (centerY <= height / 2) {
					// 点击的位置在上面
					//按钮下面剩余的高度
					let diffY = height - bottomY;
					this.animationName = 'el-zoom-in-top';
					//剩余高度不够
					if (diffY < elHeight) {
						this.top = 2 + 'px';
					} else {
						this.top = `${bottomY + 3}px`;
					}
				} else {
					this.animationName = 'el-zoom-in-bottom';
					//按钮上面剩余的高度不够
					if (topY < elHeight) {
						this.bottom = 2 + 'px';
					} else {
						this.bottom = `${height - topY}px`;
					}
				}
				//按钮右边剩余的宽度
				let diffX = width - X;
				//在右边剩余宽度不够
				if (diffX < elWidth) {
					this.left = `${width - elWidth - 2}px`;
				} else {
					//按钮在左边
					if (X < elWidth / 2) {
						this.left = `${0}px`;
					} else {
						this.left = `${X - elWidth / 2}px`;
					}
				}
			}
			this.$emit('beforeOpen');
			this.isShow(true);
		},
		isShow(flag) {
			this.show = flag;
			const body = document.querySelector('body');
			if (!flag) {
				const child = body.childNodes;
				for (var i = child.length - 1; i >= 0; i--) {
					if (typeof child[i].className == 'string' && child[i].className.indexOf('l-relative') > -1) {
						body.removeChild(child[i]);
						return;
					}
				}
			} else {
				if (body.append) {
					body.append(this.$refs.location);
				} else {
					body.appendChild(this.$refs.location);
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
.l-relative {
	position: fixed;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
	border-radius: 6px;
	z-index: 9999;
	display: flex;
}

.location {
	display: flex;
	flex-wrap: wrap;
}

.c_button {
	cursor: pointer;
}

@media all and (max-width: 1024px) {
	.phoneFull {
		left: 0 !important;
		top: 0 !important;
		width: 100% !important;
		height: 100% !important;
	}
}
</style>
