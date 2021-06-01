<!-- 聊天记录 -->
<template>
	<XModal name='chatRecord' width='520px' height="90%" @beforeOpen="init" @closed="()=>{thisOpened=false;visible=false;selectItem='first'}"
	 :closeOnDimmer="false" class="chatRecord">
		<div class="head">聊天记录<i class="hiFont hi-close close" @click="$modal.hide('chatRecord')"></i></div>
		<div class="head-nav">
		<el-popover placement="bottom" width="350" :offset='-170' v-model="visible" v-if="thisOpened" trigger="click">
			<div class="popover">
				<div class="laber">
					查找范围：
				</div>
				<div>
					<el-select v-model="checkMerber" placeholder="请选择">
						<el-option v-for="(item, index) in merberList" :key="index" :label="item.Name" :value="item.Id"></el-option>

					</el-select>
					<el-select v-model="timeRange" placeholder="请选择">
						<el-option v-for="(item, index) in checkTime" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
			</div>
			<div class="handle-button">
				<el-button type="primary" size="small" @click="decide">确定</el-button>
				<el-button type="info" size="small" @click="visible=false">取消</el-button>
			</div>
			<span slot="reference" class="filter" v-if="selectItem=='first'">
				<svg t="1579421575845" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2778" width="20"
				 height="20">
					<path d="M568.552727 954.181818a86.341818 86.341818 0 0 1-41.425454-10.472727l-114.269091-62.836364a86.574545 86.574545 0 0 1-44.916364-76.101818V442.181818a16.989091 16.989091 0 0 0-6.981818-13.730909L97.047273 218.298182 93.090909 214.807273A85.876364 85.876364 0 0 1 155.927273 69.818182h711.214545A86.574545 86.574545 0 0 1 930.909091 214.807273l-3.490909 3.490909-266.24 213.410909a17.454545 17.454545 0 0 0-6.050909 13.730909v422.4A86.341818 86.341818 0 0 1 568.552727 954.181818zM141.963636 166.632727l262.283637 209.454546A85.178182 85.178182 0 0 1 437.061818 442.181818v362.589091a17.92 17.92 0 0 0 8.610909 15.592727l114.269091 62.138182a17.687273 17.687273 0 0 0 17.687273 0 17.221818 17.221818 0 0 0 8.378182-15.36V445.44a85.876364 85.876364 0 0 1 31.883636-67.258182l263.214546-211.549091a17.687273 17.687273 0 0 0 1.62909-18.152727 17.454545 17.454545 0 0 0-15.592727-8.843636H155.927273a17.221818 17.221818 0 0 0-13.963637 27.694545zM920.669091 512h-188.974546a34.443636 34.443636 0 0 1 0-69.818182h188.974546a34.443636 34.443636 0 0 1 0 69.818182z m0 128.930909h-188.974546a34.443636 34.443636 0 0 1 0-69.818182h188.974546a34.443636 34.443636 0 0 1 0 69.818182z m0 128h-188.974546a34.443636 34.443636 0 0 1 0-69.818182h188.974546a34.443636 34.443636 0 0 1 0 69.818182z"
					 p-id="2779" fill="#8a8a8a"></path>
				</svg>
			</span>
		</el-popover>
		<el-tabs v-model="selectItem" v-if="thisOpened" @tab-click="handleClick">
			<el-tab-pane label="全部聊天" name="first">
				<div class="search-column">
					<div class="search">
						<input type="text" v-model="searchInput" placeholder="搜索" />
						<i class="el-icon-search"></i>
					</div>
					<div class="button">
						<span @click="search">搜索</span>

					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="聊天图片" name="second">
			</el-tab-pane>
			<el-tab-pane label="聊天文件" name="third">
			</el-tab-pane>
			<el-tab-pane label="聊天任务" name="fourth">
			</el-tab-pane>
		</el-tabs>
		</div>
		<div class="record-content">
			<ChatView id="child-msg-box" :msgList='msgRecordList' v-if="msgRecordList.length" :isChatRecord='true' @reloadList="reloadList"></ChatView>
			<div v-else class="empty">
				<img src="../../../assets/img/emptyTask.png" alt="">
				<p>暂无数据</p>
			</div>
		</div>
	
	</XModal>
</template>
<script>
	export default {
		props: ['target', 'msgList'],
		data() {
			return {
				thisOpened: false,
				selectItem: 'first',
				checkTime: [{
					value: 0,
					label: '不限时间'
				}, {
					value: 1,
					label: '最近一个月',
				}, {
					value: 2,
					label: '最近三个月',
				}, {
					value: 3,
					label: '最近一年',
				}],
				merberList: [], //成员
				checkMerber: -1, //被查询成员
				checkType: 0, //
				timeRange: 0, //聊天消息时间范围
				visible: false,
				searchInput: '',
				msgRecordList: [],
			}
		},
		created() {

		},
		components: {
			ChatView: () => import('./ChatView'),
			XModal: () => import('@/components/XModal'),
		},
		methods: {
			handleClick(tab) {

				if (tab.index == 0) {
					this.checkType = 0;
					this.search();
				} else if (tab.index == 1) {
					this.checkType = 2;
					this.search();
				} else if (tab.index == 2) {
					this.checkType = 1;
					this.search();
				} else {
					this.checkType = 3
					this.search()
				}
			},
			init() {
				this.msgRecordList = []
				this.getGroupInfo();
				this.thisOpened = true;
				this.search();
			},
			reloadList() {
				this.search()
			},
			decide() {
				this.visible = false
				this.search();
			},
			reloadList() {
				this.search()
			},
			// 获取群信息
			async getGroupInfo() {
				try {

					let res = await this.$http.post('/Msg/Chat/groupMember.ashx#', {
						GId: this.target.Id
					});
					this.merberList = res.data;
					this.merberList.unshift({
						Id: -1,
						Name: '全部成员'
					});
				} catch (error) {
					console.log('获取群信息报错', error);
				}
			},
			// 搜索
			async search() {
				if (!this.target.Id) {
					return
				}
				try {

					let data = {
						GId: this.target.Id,
						Type: this.checkType,
						Classes: 1,
						Str: this.searchInput,
						UTime: this.checkValue3,
						UId: this.checkMerber !== -1 ? this.checkMerber : null,
						PageIndex: 1,
						PageSize: 1000
					}
					let result = await this.$http.post('/Msg/Chat/queryChatRecord.ashx#', data);
					if (this.selectItem == 'second') {
						let arr = []
						let reg =
							/<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgData>[^""'<>]*)[^<>]*?\/?[\s\t\r\n]*>/g
						result.data.forEach(item => {
							let _arr = []
							item.Mess.replace(reg, function(arg) {
								_arr.push(arg)
							})
							item.Mess = _arr.join('')
						})
					}
					this.msgRecordList = result.data.reverse();

				} catch (error) {
					console.log('消息搜索错误', error);
				}
			}
		},
	}
</script>
<style lang="less" scoped>
	.chatRecord {
		/deep/.el-tabs__nav-scroll{
			box-sizing:border-box;
			padding-left: 1rem;
			width: 92%;
			/deep/.el-tabs__item{
				padding:0 1rem;
			}
		}
	}

	.empty {
		img {
			width: 240px;
			margin: 3rem auto;
			display: block;
		}

		p {
			font-size: 1.4rem;
			text-align: center;
			color: #6D6D6D;
		}
	}

	#child-msg-box {
		padding: 0 1rem;
	}

	.filter {
		position: absolute;
		right: 1rem;
		margin-top: 1rem;
		z-index: 9999;
		cursor: pointer;
	}

	.head {
		font-size: 1.8rem;
		font-weight: 600;
		color: white;
		height: 4.2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		background: #409eff;
	}

	.hi-close {
		float: right;
		right: 1rem;
		cursor: pointer;
		position: absolute;
		font-weight: normal;
		color: white;
	}

	.search-column {
		display: flex;
		padding: 1rem 0;
		justify-content: center;
		border-bottom: 1px #f1f1f1 solid;

		.search {
			position: relative;
			width: 80%;
			display: flex;
			border: 1px lightgrey solid;
			border-top-left-radius: 6px;
			border-bottom-left-radius: 6px;
			overflow: hidden;

			input {
				padding: 0.7rem 1rem 0.7rem 2.5rem;
				border: none;
				color: #757575;
				flex-grow: 1;
			}

			i {
				position: absolute;
				left: 1rem;
				top: 50%;
				color: #757575;
				transform: translate(0, -50%);
			}
		}

		.button {
			min-width: 60px;
			display: flex;
			background-color: #dddddd;
			border: 1px lightgrey solid;
			border-left: none;
			display: flex;
			min-width: 70px;
			border-top-right-radius: 6px;
			border-bottom-right-radius: 6px;
			overflow: hidden;

			span {
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
			}

			span:first-child {
				flex-grow: 1;
				font-size: 1.4rem;
				color: #5c5c5c;
			}

			span:last-child:hover {
				background-color: #b4b4b4;
			}
		}
	}

	.popover {
		display: flex;

		.laber {
			min-width: 70px;
		}

		.el-select {
			display: inline-block;
			position: relative;
			width: 48%;

			border: 1px #a1a1a1 solid;
			margin-bottom: 0.5rem;

			/deep/ .el-input__inner {
				height: 30px;
				line-height: 30px;
			}
		}

		.el-select:nth-child(2n+1) {
			margin-right: 2%;
		}
	}

	.handle-button {
		text-align: end;
	}

	/deep/.el-tabs__header {
		margin: 0;
	}

	/deep/.ctn {
		display: flex;
		flex-direction: column;
	}
    .record-content{
		flex: 1;
		overflow: auto;
	}
</style>
