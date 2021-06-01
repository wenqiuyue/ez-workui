<template>
	<!-- <Header :class="{ in: this.mobile.showMobileTop }"> -->
	<Header>
		<div>
			<div class="x-header">
				<!-- 移动端左侧返回按钮 -->
				<div class="mobile-back"><i class="hiFont hi-home" @click="back"></i></div>
				<!-- 				<div class="mobile-back">
					<img src="../../public/images/logo_b_32.png" alt="">
				</div> -->
				<!-- PC端左侧栏目标题 -->
				<div class="left" :title="this.title + this.titleEnglish">
					<span class="title">{{ this.title }}</span>
					<span class="titleEnglish">{{ this.titleEnglish }}</span>
				</div>
				<!-- 搜索框插槽 -->
				<div class="center">
					<slot name="search"></slot>
				</div>
				<div class="right">
					<!-- pc端右侧按钮插槽 -->
					<slot name="btnGroup"></slot>
					<slot name="filter"></slot>

				</div>
				<!-- 移动端的按钮组 -->
				<div class="mobile-btns">

					<!-- 移动端按钮组中的el下拉菜单（el-dropdown） -->
					<!-- 也可以写放单个按钮在这，用A标签 -->
					<slot name="dropdown"></slot>
					<i class="hiFont hi-more" @click="toggleBaseViewLeft()" v-if="haveBaseViewLeft"></i>
					<slot name="filter"></slot>
					<!-- <i class="hiFont hi-search mobile-filter-btn" @click="() => {showFilter = true;}"></i>
					<a class="filter-btn" @click="() => {showFilter = true;}">
						<span>筛选</span>
						<i class="hiFont hi-search"></i>
					</a>
					<el-drawer :visible.sync="showFilter" direction="rtl" :append-to-body="true" size="350px" :show-close="false">
						<div class="filter-title" slot="title">
							<span>筛选任务</span>
						</div>
						<div class="filter-form">
						</div>
					</el-drawer> -->
					<i class="hiFont hi-search" @click="toggleSearch()" v-if="showSearch"></i>


				</div>
			</div>
			<!-- 搜索框插槽 -->
			<div class="mobile-search" :class="{ on: showMobileSearch }">
				<slot name="search"></slot>
			</div>


		</div>
	</Header>
</template>

<script>
	import {
		Header
	} from 'element-ui';
	import {
		mapState,
		mapActions
	} from 'vuex';
	export default {
		data() {
			return {
				showMobileSearch: false,
			};
		},
		computed: {
			...mapState(['mobile'])
		},
		props: {
			//中文标题
			title: {
				type: String,
				default: ''
			},
			//英文副标题
			titleEnglish: {
				type: String,
				default: ''
			},
			showSearch: {
				type: Boolean,
				default: false
			},
			haveBaseViewLeft: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			...mapActions(['mobile_ToggleState', 'mobile_ToggleLeft']),
			toggleSearch() {
				this.showMobileSearch = !this.showMobileSearch;
			},
			back() {
				// this.$router.back();
				this.$router.push('/home')
			},
			toggleBaseViewLeft() {
				this.mobile_ToggleLeft(!this.mobile.showLeft)
			}
		},
	};
</script>

<style lang="less">
	@import '../assets/variable.less';

	.el-drawer__header {
		margin-bottom: 1rem;
		border-bottom: 1px solid #DDD;
		padding: 1.5rem 2rem;

		&>div {
			display: flex;
			font-size: 1.6rem;
			display: flex;
			box-sizing: border-box;
			justify-content: space-between;
			font-size: 1.8rem;
			color: #4a4a4a;
			font-weight: bold;
		}

	}

	.el-drawer__body {
		padding: 0rem 2rem 2rem;
		overflow: auto;
	}

	.mobile-filter-btn {
		display: none;
	}

	header.baseHeader {
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 90;
		box-sizing: border-box;
		padding-left: @menu_sidebar_width;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

		.mobile-back,
		.mobile-btns,
		.mobile-search {
			display: none;
		}

		.x-header {
			padding: 0 1rem;
			height: @body_title_height;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.title {
			font-size: 2rem;
			font-weight: 600;
			color: #448ef5;
			letter-spacing: 1px;
			white-space: nowrap;
		}

		.titleEnglish {
			font-size: 1.4rem;
			color: #c3c3c3;
			margin-left: 0.6rem;
			display: inline-block;
			width: 16rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			vertical-align: bottom;
		}

		.center>div,
		.mobile-search>div {
			height: auto;
			position: relative;

			&::before {
				position: absolute;
				color: @color_grey;
				left: 0.8rem;
				font-size: 1.8rem;
				transform: translateY(50%);
				z-index: 2;
			}

			&>.el-input {
				&>.el-input__inner {
					box-shadow: none;
					position: relative;
					display: block;
					border: none !important;
					border-radius: 5rem;
					background: #fafafa;
					color: #666;
					margin: 0 auto;
					padding: 0.7rem 1.2rem;
					padding-left: 2.7rem;
					width: 100%;
					font-size: 1.4rem;
					box-sizing: border-box;
					transition: all 0.3s ease;
					z-index: 1;

					&:focus {
						background: #f2f2f2 !important;
					}

					&::-webkit-input-placeholder {
						color: #aaa;
						font-size: 1.2rem;
					}
				}

				.el-input-group__append {
					border: none;
				}
			}

			&>.el-input-group .el-input__inner {
				border-radius: 0.4rem 0 0 0.4rem;
			}

			&>.el-input-group .el-select .el-input__inner {
				border-radius: 0 0.4rem 0.4rem 0;
				width: 7rem;
				padding-left: 1.2rem;
				padding-right: 2.5rem !important;
				font-size: 1.2rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.right {
			display: flex;
			justify-content: flex-end;

			div {
				display: flex;
				height: @body_title_height;
				line-height: 4.7rem;

				&>a {
					display: block;
					cursor: pointer;
					margin-right: 1rem;
					font-size: 1.4rem;
					box-sizing: border-box;
					border-top: 3px solid #fff;
					transition: all 0.2s ease;
					color: initial;

					&.sp {
						color: @color_blue;
					}

					&>i {
						margin-left: 0.5rem;
					}

					&:last-child {
						margin-right: 0;
					}

					&:hover {
						color: @color_blue;
						border-top-color: @color_blue;
					}
				}
			}

			&>div:last-child {
				margin-left: 2rem;
			}

		}
	}

	@media screen and (max-width: 1024px) {
		header.baseHeader {
			padding: 0;
			z-index: 96;

			&.in {
				display: none;
			}

			.x-header {
				padding: 0;
				justify-content: flex-start;
			}

			.mobile-back {
				display: block;
				cursor: pointer;
				font-size: 3.2rem;
				flex: 0 0 5rem;
				text-align: center;

				i {
					display: block;
					height: @body_title_height;
					line-height: @body_title_height;
					// line-height: 3.5rem;
					color: #c9c9c9;
					transition: color 0.3s ease;
					font-size: 2.8rem;
				}

				&:hover>i {
					color: @color_blue;
				}
			}

			.mobile-btns {
				display: flex;
				font-size: 2.7rem;
				justify-content: flex-end;
				align-items: center;
				width: 16rem;

				i {
					transition: all 0.3s ease;
					display: block;
					cursor: pointer;
					height: @body_title_height;
					line-height: @body_title_height;
					padding: 0 1rem;
					margin: 0 !important;
					font-size: 2rem;
					color: #909399;

					&:hover {
						background: @color_grey_light_hover;
					}
				}
			}

			.mobile-search {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				overflow: hidden;
				height: 0rem;
				transition: height 0.3s ease;
				text-align: center;

				&.on {
					height: 5rem;
				}

				&>div {
					width: 90%;
					margin: 0 auto;
					position: relative;
				}
			}

			[class*=' el-icon-'],
			[class^='el-icon-'] {
				color: #909399;
			}

			.left {
				margin-right: auto;
				text-align: left;

				.title {
					font-size: 2rem;
					display: flex;
					flex-direction: column;
				}

				.titleEnglish {
					margin: 0;
					font-size: 1.2rem;
				}
			}

			.right,
			.center {
				display: none;
			}
		}
		header.baseHeader + div{
			height: calc(100% - 5rem) !important;
			top: 5rem;
			position: relative;
			overflow: auto;
			box-sizing: border-box;
			margin: 0rem !important;
			// padding: 0 !important;
		}
		

		.mobile-filter-btn {
			display: block;
		}

		.filter-btn {
			display: none;
		}
	}
</style>
