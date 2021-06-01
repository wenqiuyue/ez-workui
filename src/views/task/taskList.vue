<template>
	<xmodal width="70%" height="80%" name="task_lsit" title="任务列表" :showCrossBtn="true">
		<ul v-infinite-scroll="load" infinite-scroll-disabled="disabled" class="task-list">
			<li v-for="i in pageData">
				<div class="task_priority"></div>
				<div class="task_content">
					<div class="task_content_left">
						<i class="hiFont hi-task"></i>
						<h2>这是任务名称{{ i }}</h2>
					</div>
					<div class="task_content_right">
						<p>2019年02月15日 - 2019年02月15日</p>
						<p>所属项目</p>
						<p>执行人：暂无</p>
					</div>
				</div>
			</li>
			<div class="g-loading" v-if="isLoading">
				<i class="el-icon-loading"></i>
				加载中...
			</div>
			<div class="g-loaded" v-if="noMore">已全部加载</div>
		</ul>
	</xmodal>
</template>

<script>
export default {
	components: {
		xmodal: () => import('@/components/XModal')
	},
	data() {
		return {
			pageSize: 5,
			currentPage: 1,
			count: 25,
			isLoading: false,
			pageData: 5
		};
	},
	computed: {
		noMore() {
			return this.count <= this.pageSize * this.currentPage;
		},
		//禁用加载，没有了或者正在请求接口
		disabled() {
			return this.isLoading || this.noMore;
		}
	},
	methods: {
		load() {
			//无限加载 开始请求 this.isLoading = true
			this.isLoading = true;
			setTimeout(() => {
				this.pageData += 5;
				//请求完
				this.currentPage++;
				this.isLoading = false;
			}, 5000);
		}
	},
	created() {
		// load();
		console.log(process.env.NODE_ENV)
	},
	mounted() {
		setTimeout(() => {
			this.$modal.show('task_lsit');
		}, 1000);
	}
};
</script>

<style lang="less" scoped>
.task-list {
	height: 100%;
	border-top: 1px solid #e5e5e5;
	overflow-y: scroll;
	//单个任务
	li {
		height: 5.49rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #e5e5e5;
		cursor: pointer;
		.task_priority {
			width: 4px;
			height: 5.4rem;
			background-color: red;
		}
		.task_content {
			width: 100%;
			padding: 1.5rem 1rem 1.5rem 2rem;
			display: flex;
			justify-content: space-between;
			.task_content_left,
			.task_content_right {
				display: flex;
				align-items: center;
			}
			.task_content_left {
				h2 {
					padding-left: 1rem;
				}
			}
			.task_content_right {
				p {
					margin-left: 3rem;
				}
			}
		}
	}
}
.g-loading,
.g-loaded {
	margin-bottom: 6rem;
}
</style>
