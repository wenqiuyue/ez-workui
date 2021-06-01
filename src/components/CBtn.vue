<template>
	<div class="c-btn"><slot></slot></div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="less" scoped>
.c-btn /deep/ span {
	color: #38adff;
	background: transparent;
	outline: none;
	cursor: pointer;
	transition: color 0.3s ease;
	display: inline-block;
	margin-right: 10px;
	&:hover {
		color: #68c1ff;
	}
}

@media screen and (max-width: 1024px) {
}
</style>
