<template>
	<XM id="dialogDetail" title="考核详情" :name="customName" showCrossBtn @opened="getDetail" :url="'/assessment/assessDetail/'+this.activeId"
	 referer="/assessment">
		<div>
			<div class="detail-tr">
				<div class="detail-td-title">KPI&nbsp;&nbsp;项：</div>
				<div class="detail-td-info">{{ dialogData.myKPIAssess.Name }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">时&nbsp;&nbsp;&nbsp;&nbsp;间：</div>
				<div class="detail-td-info">{{ dialogData.myKPIAssess.Times?dialogData.myKPIAssess.Times.timeFormat('yyyy-MM-dd HH:mm'):'无' }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">结&nbsp;&nbsp;&nbsp;&nbsp;果：</div>
				<div class="detail-td-info">{{ dialogData.myKPIAssess.AddName | RESULT(dialogData.myKPIAssess.Score) }}</div>
			</div>
			<div class="detail-tr" v-show="dialogData.myKPIAssess.TypeName == '常规'">
				<div class="detail-td-title">来源页：</div>
				<div class="detail-td-info">
					<el-link type="primary" :href="dialogData.myKPIAssess.refUrl" target="_blank">{{ dialogData.myKPIAssess.refUrl }}</el-link>
				</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">状&nbsp;&nbsp;&nbsp;&nbsp;态：</div>
				<div class="detail-td-info">{{ dialogData.myKPIAssess.StatusName }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">KPI描述：</div>
				<div class="detail-td-info">{{ dialogData.myKPIAssess.Describe }}</div>
			</div>
			<div class="detail-tr">
				<div class="detail-td-title">{{ dialogData.myKPIAssess.TypeName == '常规' ? '考核' : '投诉' }}原因：</div>
				<FroalaView :html="dialogData.myKPIAssess.Content"></FroalaView>
			</div>
		</div>
	</XM>
</template>

<script>
	export default {
		// props: ['activeId'],
		props:{
			activeId:{
				type:Number
			},
			customName:{
				type:String,
				default:'dialogDetail'
			}
		},
		filters: {
			RESULT(statu, score) {
				switch (statu) {
					case '加分':
						return `加${score}分`;
						break;
					case '减分':
						return `减${score}分`;
						break;
					case '奖励':
						return `奖励${score}元`;
						break;
					case '罚款':
						return `罚款${score}元`;
						break;
					default:
						return '未知';
				}
			}
		},
		data() {
			return {
				dialogData: {
					myKPIAssess: {
						Name: ''
					}
				}
			}
		},
		components: {
			XM: () => import('@/components/XModal'),
			FroalaView: () => import('@/components/XFroalaView'),
		},
		methods: {
			getDetail() {
			   	this.$http.get('/Work/Performance/GetUserAssessById.ashx', {
			   	params: {
			   		Id: this.activeId?this.activeId:this.$route.params.id
			   	}
			   }).then(res => {
			   	if (res.res == 0) {
			   		let data = res.data
			   		if (data.JobData) {
			   			this.dialogData.myKPIAssess.refUrl = this.baseURL + '/task/' + data.JobData.EventId + '/' + data.JobData.JId;
			   		}
			   		if (data.ProjectData) {
			   			this.dialogData.myKPIAssess.refUrl = this.baseURL + '/task/' + data.ProjectData.EId;
			   		}
			   		if (data.BullData) {
			   			this.dialogData.myKPIAssess.refUrl = this.baseURL + '/report/' + data.BullData.AuthorId + '/' + data.BullData.TodayTime;
			   		}
			   		this.dialogData.myKPIAssess = data;
			   	}
			   })
			}
		}

	}
</script>

<style lang="less" scoped="scoped">
	.detail-tr {
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		padding: 0.5rem;

		.detail-td-title {
			width: 8rem;
			text-align: right;
			margin-right: 0.5rem;
			font-size: 1.6rem;
			color: #9b9b9b;
			flex: 0 0 8rem;
		}

		.detail-td-info {
			flex: auto;
			display: flex;
			align-items: center;
			font-size: 1.4rem;

			.success {
				color: #75d030;
			}

			.err {
				color: #ed4b4b;
			}
		}
	}
</style>
