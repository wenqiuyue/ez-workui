<template>
   <XModal name = 'addGroup' width='468px' :maxHeight="500"  @opened="init"  @closed="thisOpened=false" :closeOnDimmer="false"  >
       <div class="add-box">
           <div class="head">新建群聊<i class="hiFont hi-close close" @click="$modal.hide('addGroup')"></i></div>
           <el-tabs v-model="selectItem" v-if="thisOpened">
               	<el-tab-pane name="1">
                    <span class="classify" slot="label">
                        按成员创建
                    </span>
				    <div class="content">
                        <div class="title">
                            <div>群聊名称</div>
                            <el-input v-model="groupName"  ref="input"></el-input>
                        </div>
                        <div class="member-box">
                            <div>选择成员</div>
                            <div>
                                <MemberSelect @Confirm ="getMember"></MemberSelect>
                            </div>
                        </div>
                       
                    </div>
				</el-tab-pane>
                <el-tab-pane name="2">
					<span class="classify" slot="label">
                        按部门创建 
                    </span>
                     <div class="content">
                        <div class="title">
                            <div>群聊名称</div>
                            <el-input v-model="groupName"  ref="input"></el-input>
                        </div>
                        <div class="member-box">
                            <div>选择部门</div>
                            <div>
                                <DepartmentSelector></DepartmentSelector>
                            </div>
                        </div>
                       
                    </div>
				</el-tab-pane>
           </el-tabs>
           <div class="bottom">
               <el-button class="button" type="primary" @click="addGroup">立即创建 <span v-if="memberList.length">({{memberList.length}})</span></el-button>
           </div>
       </div>
   </XModal>
</template>
<script>
export default {
    data() {
        return {
            thisOpened:false,
            reachAll:'',
            selectItem:'1',
            input:'',
            memberList:[],
            groupName:'' ,//群名
        }
    },
    created() {
        // this.getReach();
    },
    components:{
        XModal:()=>import('@/components/XModal'),
        MemberSelect:()=>import('@/components/Selectors/MemberSelect'),
        DepartmentSelector:()=>import('@/components/Selectors/DepartmentSelector'),
    },
    methods: {
        //保存群聊
        async saveGroup(data){
            try {
                let res = await this.$http.post('/Msg/Chat/createGroup.ashx',data);
                if(res.res===0){
                    this.$emit('getGroupChat',data);
                    this.$message({
                        type:"success",
                        message:"创建成功"
                    });
                    this.$modal.hide('addGroup');
                }
            } catch (error) {
                console.log('创建群聊报错',error);
            }
        },
        addGroup(){
            if(!this.groupName){
                this.$message({
                    type:"warning",
                    message:"请输入群名"
                });
                this.$refs['input'].focus();
                return;
            }
            const data = {
                Type:'2',
                groupName:this.groupName,
                group:this.memberList,
                Members:`,${this.extractID(this.memberList)},`,
                Name:this.groupName,
            };
            this.saveGroup(data);
        },
        extractID(memberList){
            let list = [];
            memberList.forEach(element => {
                list.push(element.UId);
            });
            return list.join();
        },
        init(){
            this.thisOpened=true; 
            this.memberList = [];
            this.groupName = '';
        },
        getMember(result){
            this.memberList  = result;
        }
    },
}
</script>
<style lang="less" scoped>
	/deep/.el-tabs__nav{
		box-sizing: border-box;
		// padding: 0 1rem;
		margin-left: 1rem;
	}
.add-box{
    .head{
        font-size: 1.8rem;
        font-weight: 600;
        color: white;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position:relative;
        background: #409eff;
    }
    .title{
        display: flex;
        align-items: center;
        padding: 0 1rem;
        margin-bottom: 15px;
        div:first-child{
            white-space: nowrap;
            font-size: 1.4rem;
            margin-right: 1rem;
        }
    }
    .bottom{
        padding: 1rem;
        text-align: center;
        .button{
            width: 90%;
            background:  #62afff;
        }
    }
    .classify{
        font-size: 1.5rem;
    }
    .content{
		max-height: 600px;
		overflow: auto;
        .select-box{
            background: #efefef;
            display: flex;
            padding:1rem 0;
            flex-wrap: wrap;
            .select-pic{
                text-align: center;
                margin-left:1rem;
                margin-right: 0.5rem; 
                img{
                    height: 4rem;
                    width: 4rem;
                    border-radius: 50%;
                    margin-bottom: 0.3rem;;
                }
            }
        }
        .member{
            position: relative;
            padding: 0 1.6rem;
            list-style: none;
            font-size: 1.6rem;
            height: 4rem;
            display: flex;
            color: #8d8d8d;
            cursor: pointer;
            background: #fff;
            border-radius: 6px;
            align-items: center;
            margin: 0.5rem;
            transition: box-shadow 0.3s ease;
            z-index: 1;
            user-select: none;
            img{
                border-radius: 50%;
                width: 3rem;
                height: 3rem;
                margin: 0 1rem 0 2rem;
            }
            span{
                margin-right: auto;
                font-size: 1.4rem;
            }
        }
        .input-box{
            background: #efefef;
            color: #8d8d8d;
            flex-grow: 1;
            min-width: 100px;
            input{
                width: calc(100% - 2rem);
                border: none;
                background: #efefef;
                font-size: 1.3rem;
                color: #8d8d8d;
                padding: 0 1rem;
                height: 100%;
            }
        }
    }
} 
 .hi-close{
    float:right;
    right: 1rem;
    cursor: pointer;
    position: absolute;
    font-weight:normal;
    color:white;
}
.member-box{
    margin: 0 1rem;
    display: flex;
    div:first-child{
        white-space: nowrap;
        font-size: 1.4rem;
        margin-right: 1rem;
    }
   
}


</style>