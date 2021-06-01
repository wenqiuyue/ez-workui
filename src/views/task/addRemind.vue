<template>
	<XModal name="addRemind" ref="xmAddRmd" isFixed classes="xmAddRmd" confirmBtnText="确认" cancelBtnText="取消"
	 :closeOnDimmer="false" @onConfirm="confirm" @opened="init" @closed="clear">
		<div slot="header">
			<b>添加任务提醒</b>
			<el-button type="primary" size="small" icon="hiFont hi-add" @click="newRemind">添加一条新的提醒</el-button>
		</div>
		<div class="main">
			<div ref="boxAddRmd">
				<el-form v-for="(item, i) in reminds" :key="item.id">
					<h5>
						<b>第 {{ i + 1 }} 条提醒</b>
						<a class="hiFont hi-delete" @click="reminds.splice(i, 1)">
							<span>删除</span>
						</a>
					</h5>
					<el-form-item label="提醒时间">
						<el-select v-model="item.status" placeholder="选择状态">
							<el-option v-for="(opt, i) in $D.LIST('task_remind_status')" :key="i" :label="opt.name" :value="opt.value"></el-option>
						</el-select>
						<!-- 选择范围 -->
						<el-select v-model="item.option" v-if="
                $D.ITEM('task_remind_status', item.status).custom.type ==
                  'date' &&
                $D.ITEM('task_remind_status', item.status).custom.sel
              "
						 placeholder="选择时间">
							<el-option v-for="(opt, i) in $D.LIST('task_remind_option')" :key="i" :label="opt.name" :value="opt.value"></el-option>
						</el-select>
						<!-- 选择进度 -->
						<el-select v-model="item.progress" v-if="$D.ITEM('task_remind_status', item.status).custom.type == 'num'"
						 placeholder="选择进度">
							<el-option v-for="i of 10" :key="i" :label="`达到 ${i * 10}% 时`" :value="i * 10"></el-option>
						</el-select>
						<!-- 选择时间 -->
						<el-time-picker v-if="$D.ITEM('task_remind_status', item.status).custom.type == 'time'" v-model="item.Timepoint"
						 :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="选择时间点" value-format="HH:mm:ss"></el-time-picker>
					</el-form-item>
					<el-form-item label="提醒范围" v-if="checkPower()">
						<el-switch v-model="item.onlyMe" active-color="#409EFF" inactive-color="#409EFF"></el-switch>
						<span style="margin-left: 0.5rem">{{
              item.onlyMe ? "仅通知我" : "通知其他人"
            }}</span>
					</el-form-item>
					<el-form-item label="通知成员" v-show="!item.onlyMe">
						<div>
							<el-radio v-model="item.memberType" :label="1">按角色选择</el-radio>
							<el-radio v-model="item.memberType" :label="2">按成员选择</el-radio>
							<div v-if="item.memberType == 1">
								<el-select v-model="item.roles" multiple collapse-tags>
									<el-option v-for="(opt, i) in roles" :key="i" :label="opt.name" :value="opt.value"></el-option>
								</el-select>
							</div>
							<div v-else>
								<MemberSelect :eid="eid" @Confirm="item.members = $event"></MemberSelect>
							</div>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</XModal>
</template>

<script>
	export default {
		components: {
			XModal: () => import("@/components/XModal"),
			MemberSelect: () => import("@/components/Selectors/MemberSelect"),
		},
		props: ["jid", "eid"], //任务ID，项目ID
		data() {
			return {
				reminds: [],
			};
		},
		computed: {
			//可选角色
			roles() {
				return _.filter(this.$D.LIST("task_role"), function(o) {
					return o.custom.select;
				});
			},
		},
		methods: {
			clear() {
				this.reminds = [];
			},
			//初始化数据
			init() {
				this.clear();
				this.newRemind();
			},
			//向提醒表单加一条新内容
			newRemind() {
				const rmd = {
					id: this.reminds.length > 0 ? _.last(this.reminds).id + 1 : 1,
					status: 2,
					option: 60,
					progress: 50,
					text: "",
					onlyMe: true, //true仅通知我，false通知其他人
					memberType: 1, //1按角色进行选择，2按成员进行选择
					roles: [], //选中的角色
					members: [], //选中的成员ID
					Timepoint: null, //时间点
				};
				this.reminds.push(rmd);
				let box = document.querySelector(".xmAddRmd .ctn");
				box.scrollTop = box.scrollHeight;
			},
			//提交表单
			confirm() {
				this.$refs.xmAddRmd.loadBtn(true);

				const rmds = [];
				this.reminds.map((aa) => {
					let member = [];
					if (!aa.onlyMe) {
						member = aa.memberType == 1 ? aa.roles : aa.members.map((mb) => mb.UId);
					}
					const type = this.$D.ITEM("task_remind_status", aa.status).custom.type;
					rmds.push({
						Status: aa.status,
						Option: type == "date" ? this.$D.ITEM("task_remind_status", aa.status).custom.sel ? aa.option : 1 : aa.progress,
						Scope: aa.onlyMe,
						Type: aa.memberType,
						MemberVal: "," + member.join() + ",",
						Timepoint: aa.Timepoint
					});
				});

				this.$http
					.post("/Project/addTaskRemind.ashx", {
						JobId: this.jid,
						Data: rmds,
					})
					.then((res) => {
						this.$refs.xmAddRmd.loadBtn(false);
						if (res.res == 0) {
							this.$notify({
								type: "success",
								title: "添加成功",
							});
							this.$modal.hide("addRemind");
							this.$emit("confirm");
						}
					});
			},
			//检查权限（只有上级才能给下级添加提醒，否则只能给自己添加提醒）
			checkPower() {
				return true;
			},
		},
	};
</script>

<style lang="less" scoped>
	.main {
		display: flex;
		flex-direction: column;

		&>div {
			height: 100%;
			overflow-y: scroll;

			.el-form {
				margin: 1.6rem 1rem;
				margin-right: 0.6rem;
				padding: 1rem 1.6rem;
				border-bottom: 1px solid #eee;
				box-sizing: border-box;
				transition: box-shadow 0.3s ease, border-bottom-color 0.3s ease;

				&:hover {
					border-bottom-color: #fff;
					border-radius: 4px;
					box-shadow: 0px 5px 16px -2px rgba(0, 0, 0, 0.2);
				}

				/deep/ .el-form-item__content {
					display: flex;
					align-items: center;
				}

				h5 {
					display: flex;
					align-items: center;
					padding: 1rem 0;
					margin-bottom: 1rem;
					font-size: 2rem;

					&>b {
						margin-right: auto;
					}

					&>a {
						font-size: 1.4rem;
						color: #9b9b9b;
						cursor: pointer;
						transition: color 0.3s ease;

						&:hover {
							color: #448ef5;
						}

						&>span {
							margin-left: 0.3rem;
						}
					}
				}

				.el-select {
					margin-right: 0.5rem;
				}
			}
		}
	}

	/deep/ .xmAddRmd {
		//除了.header里面的&>div 其他都是固定顶部，固定底部的必要样式（不需要写响应式样式）

		.header {
			padding: 1.6rem 1rem;
			border-bottom: 1px solid #f2f2f2;

			&>div {
				display: flex;
				align-items: center;
				width: 100%;

				&>b {
					display: block;
					font-weight: 600;
					font-size: 2rem;
					color: #448ef5;
					margin-right: auto;
					padding-left: 0.5rem;
				}
			}
		}
	}
</style>
