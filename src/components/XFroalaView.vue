<template>
	<div>
		<PictureView :src="imgSrc" ref="picView"></PictureView>
		<froalaView ref="froalaView" v-model="html"></froalaView>
	</div>
</template>
<script>
import Froala from '@/components/XFroala';
import PictureView from '@/views/msg/chatComponents/PictureView';
export default {
	props: {
		//展示内容
		html: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			imgSrc: ''
		};
	},
	components: {
		Froala,
		PictureView
	},
	mounted() {
		this.addEvent();
	},
	watch: {
		html: 'addEvent'
	},
	methods: {
		addEvent() {
			let _this = this;
			this.$nextTick(() => {
				let objs = this.$refs['froalaView'].$el.getElementsByTagName('img');
				for (var i = 0; i < objs.length; i++) {
					objs[i].onclick = function() {
						_this.imgSrc = this.src;
						_this.$refs['picView'].show();
					};
					objs[i].style.cursor = 'pointer';
				}
			});
		}
	}
};
</script>
