<!-- 群聊设置 -->
<template>
   <XModal name = 'setGroup' width='468px'  @opened="init"  @closed='closed'  :closeOnDimmer="false"  >
         <MemberSelect :arrays='merberList|getMerberInfo' @Confirm='getMember' ref="memberSelect">
            <div slot="button" class="memberButtton" ref="memberButtton"></div>
        </MemberSelect>
       <div class="add-box">
           <div class="head">群聊管理<i class="hiFont hi-close close" @click="$modal.hide('setGroup');"></i></div>
                    <div class="content-box" ref="contentBox">
                            <div class="content select-item" >
                                <div class="title">
                                    <div>群聊名称:</div>
                                    <span v-if="isEdit==0">{{group.Name}}</span><i v-if="isEdit==0 && operator && operator.IsMaster" class="el-icon-edit" @click="edit"></i>
                                    <el-input @blur='update' ref="input" v-if="isEdit==1" v-model="groupName"></el-input>
                                </div>
                                <div class="member-box">
                                    <div class="laber"><span>群聊成员</span> <span>共{{merberList.length}}人</span></div>
                                    <div  v-loading="loading">
                                            <div class="member-item" v-for="(item, index) in merberList" :key="index" @click="manageMembers(item)">
                                                <img v-lazy="$url +item.Picture">
                                               <p>
                                                    <svg title="群主" v-if="item.IsMaster" t="1579416041823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1984" width="16" height="16"><path d="M876.0576 769.024c5.12 34.816 34.82624 29.696 39.94624 45.056 0 9.71776-5.12 45.056-19.968 49.664-14.84288 0-34.816-5.12-49.664 0-9.71776 5.12-19.95776 9.72288-25.07776 19.96288-9.728 25.08288 9.71776 45.05088 0 54.77888-14.848 9.728-45.06112 25.088-54.784 14.848-14.84288-14.848-14.84288-34.82112-45.056-34.82112-39.94112 0-39.94112 39.94112-59.904 39.94112s-54.784-14.848-54.784-29.70112c5.12-19.96288 14.848-34.81088-5.12-54.77888-25.088-19.968-54.77888 0-65.01888-9.728-14.84288-9.728-19.96288-34.816-14.84288-49.65888s39.936-14.84288 39.936-54.78912c0-29.69088-34.816-34.81088-39.936-54.77376-5.12-14.848 5.12-39.94624 19.96288-45.06624 25.08288-9.71776 39.93088 9.728 65.01888-9.71776 14.848-14.83776 9.728-49.664 9.728-59.904 5.12-14.84288 25.07776-19.96288 39.936-19.96288 29.696 0 19.96288 34.82112 59.904 39.94112 39.936 0 34.816-14.848 54.77888-39.94112 25.08288 0 45.06112 9.72288 49.65888 19.96288 9.728 19.968-9.71776 49.664 19.968 69.63712 25.07776 14.84288 49.664-5.12 65.024 0 9.72288 5.12 14.84288 19.96288 19.96288 39.94112-9.72288 29.16352-54.78912 24.04352-49.66912 69.10976z m-179.70176-99.84c-119.80288 29.696-74.752 204.28288 39.936 184.832 115.2-25.09824 99.84-209.92-39.936-184.832z m-204.288-174.58688c-119.808 0-214.528-94.72-214.528-214.528s94.72-214.528 214.528-214.528c119.80288 0 214.52288 94.72 214.52288 214.528 0.00512 114.688-94.71488 214.528-214.52288 214.528z m174.592 49.65888s-79.88224 0-74.76224 54.784c5.12 59.904-74.752 14.83776-89.59488 65.024-19.968 59.89376 9.72288 49.65376 25.08288 89.6 9.728 25.08288-39.936 39.936-34.816 84.992 9.728 59.904 59.904 29.70624 74.75712 65.024 9.72288 29.696-25.08288 49.664-104.96 49.664-65.01888 0-189.44 0-234.496-5.12 0 0-129.536-5.12-129.536-89.6 0 0-5.12-124.928 74.752-214.528 0 0 84.992-109.56288 229.38112-109.56288l264.192 9.72288z" fill="#FFC107" p-id="1985"></path></svg>
                                                    <svg title="管理员" v-if="item.IsManager" t="1579416041823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1984" width="16" height="16"><path d="M876.0576 769.024c5.12 34.816 34.82624 29.696 39.94624 45.056 0 9.71776-5.12 45.056-19.968 49.664-14.84288 0-34.816-5.12-49.664 0-9.71776 5.12-19.95776 9.72288-25.07776 19.96288-9.728 25.08288 9.71776 45.05088 0 54.77888-14.848 9.728-45.06112 25.088-54.784 14.848-14.84288-14.848-14.84288-34.82112-45.056-34.82112-39.94112 0-39.94112 39.94112-59.904 39.94112s-54.784-14.848-54.784-29.70112c5.12-19.96288 14.848-34.81088-5.12-54.77888-25.088-19.968-54.77888 0-65.01888-9.728-14.84288-9.728-19.96288-34.816-14.84288-49.65888s39.936-14.84288 39.936-54.78912c0-29.69088-34.816-34.81088-39.936-54.77376-5.12-14.848 5.12-39.94624 19.96288-45.06624 25.08288-9.71776 39.93088 9.728 65.01888-9.71776 14.848-14.83776 9.728-49.664 9.728-59.904 5.12-14.84288 25.07776-19.96288 39.936-19.96288 29.696 0 19.96288 34.82112 59.904 39.94112 39.936 0 34.816-14.848 54.77888-39.94112 25.08288 0 45.06112 9.72288 49.65888 19.96288 9.728 19.968-9.71776 49.664 19.968 69.63712 25.07776 14.84288 49.664-5.12 65.024 0 9.72288 5.12 14.84288 19.96288 19.96288 39.94112-9.72288 29.16352-54.78912 24.04352-49.66912 69.10976z m-179.70176-99.84c-119.80288 29.696-74.752 204.28288 39.936 184.832 115.2-25.09824 99.84-209.92-39.936-184.832z m-204.288-174.58688c-119.808 0-214.528-94.72-214.528-214.528s94.72-214.528 214.528-214.528c119.80288 0 214.52288 94.72 214.52288 214.528 0.00512 114.688-94.71488 214.528-214.52288 214.528z m174.592 49.65888s-79.88224 0-74.76224 54.784c5.12 59.904-74.752 14.83776-89.59488 65.024-19.968 59.89376 9.72288 49.65376 25.08288 89.6 9.728 25.08288-39.936 39.936-34.816 84.992 9.728 59.904 59.904 29.70624 74.75712 65.024 9.72288 29.696-25.08288 49.664-104.96 49.664-65.01888 0-189.44 0-234.496-5.12 0 0-129.536-5.12-129.536-89.6 0 0-5.12-124.928 74.752-214.528 0 0 84.992-109.56288 229.38112-109.56288l264.192 9.72288z" fill="#409eff" p-id="1985"></path></svg>
                                                    {{item.Name}}
                                                </p>
                                            </div>
                                            <div class="member-item" @click="invitation">
                                                <i class="hiFont hi-add"></i>
                                                <p class="invitation">邀请</p>
                                            </div>
                                            
                                    </div>
                                </div>
                                <div class="bottom" v-if="operator && !operator.IsMaster">
                                    <el-button class="button" type="primary" @click="quitGroup(operator)">退出群聊</el-button>
                                </div>
                                <div class="bottom" v-if="operator && operator.IsMaster">
                                    <el-button class="button" type="primary" @click="deleteGroup">解散群聊</el-button>
                                </div>
                            </div>
                            <div class="select-item" v-if="targer">
                                <div class="member-info">
                                    <span class="back" @click="back"><i class="el-icon-d-arrow-left"></i>返回</span>
                                    <div class="member-item">
                                   
                                        <img v-lazy="$url +targer.Picture">
                                        <p>{{targer.Name}}</p>
                                    </div>
                                </div>
                                <div class="manage-item">
                                    <span>职位：</span>
                                    <span>{{targer.PostName}}</span>
                                </div>
                                 <div class="manage-item">
                                    <span>所属部门：</span>
                                    <span>{{targer.ReachName}}</span>
                                </div>
                                <div class="manage-item" v-if="operator && operator.IsMaster && targer.IsManager" >
                                    <span>转让群主</span>
                                    <el-switch
                                        :disabled='targer.IsMaster'
                                        class="switch"
                                        @change="setMaster"
                                        v-model="targer.IsMaster"
                                        active-color="#409EFF"
                                        inactive-color="#DCDFE6">
                                    </el-switch>
                                </div>
                                <div class="manage-item" v-if="operator && operator.IsMaster">
                                    <span>设置为管理员</span>
                                    <el-switch
                                        @change="setAdministrators"
                                        class="switch"
                                        v-model="targer.IsManager"
                                        active-color="#409EFF"
                                        inactive-color="#DCDFE6">
                                    </el-switch>
                                </div>
                                <div class="bottom" v-if="operator && (operator.IsMaster || operator.IsManager)">
                                    <el-button class="button" type="primary" @click="deleteMember">移出群聊</el-button>
                                </div>
                            </div>
                             
                    </div>
       </div>
   </XModal>
</template>
<script>
import {mapState} from "vuex";
export default {
    props:['group'],
    data() {
        return {
            groupName:'' ,//群名
            targer:null,
            operator:null,//当前操作人
            isEdit:0,
            merberList:[],
            loading:true,
            list:[{
                Picture: "/images/head/10879q4.jpeg",
                UId: 108,
                UName: "罗松良",
            }]
        }
    },
    created() {
        // this.getReach();
    },
    components:{
        XModal:()=>import('@/components/XModal'),
        MemberSelect:()=>import('@/components/Selectors/MemberSelect'),
    },
    filters:{
        getMerberInfo(val){
            let list = [];
            val.forEach(element => {
                let obj = {
                    UId:element.Id,
                    UName:element.Name,
                    Picture:element.Picture,
                }
                list.push(obj);
            });
            return list;
        }
    },
    computed: {
        ...mapState(["user"]),
    },
    methods: {
        //初始化
        init(){
            this.getGroupInfo();
            this.groupName = this.group.Name
        },
        // 获取群信息
        async getGroupInfo(){
            try {
                let res = await this.$http.post('/Msg/Chat/groupMember.ashx',{GId:this.group.Id});
                this.merberList = res.data;
                this.merberList.some(element => {
                    if(element.Id === this.user.id){
                        this.operator = element;
                    }
                    return element.Id === this.user.id;
                  
                });
                this.loading = false;
            } catch (error) {
                console.log('获取群信息报错',error);
            }
        },
        closed(){
            this.loading = true;
            this.merberList = [];
        },
        //解散群聊
        deleteGroup(){
            this.$confirm('确认解散该群聊吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post('/Msg/Chat/dissolveGroup.ashx',{GId:this.group.Id,Type:1}).then(()=>{
                    this.$emit('deletGroup',this.group);
                    this.$message({
                        type:"success",
                        message:"解散成功"
                    });
                    this.$modal.hide('setGroup');
                }).catch((err)=>{
                    console.log('解散群聊出错',err);
                });
              
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消解散'
                });          
            });
        },
        //退出群聊
        async quitGroup(){
             try {
                await this.$confirm('确认退出该群聊吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                let id  = this.operator.Id;
                let result = await this.$http.post('/Msg/Chat/dissolveGroup.ashx',{GId:this.group.Id,Type:2});
                this.$emit('deletGroup',this.group);
                this.$modal.hide('setGroup');
                this.$message({
                    type:"success",
                    message:"退出成功"
                });
				this.targer=null
            } catch (error) {
                if(error !== 'cancel'){
                    console.log('退出群聊错误',error);
                }else{
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });  
                }
            }
        },
        //删除成员
        async deleteMember(){
            try {
                await this.$confirm('确认移除该成员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                let id  = this.targer.Id;
                let result = await this.$http.post('/Msg/Chat/setGroupMember.ashx',{GId:this.group.Id,Memberid:`,${id},`});
                let index = this.merberList.indexOf(this.targer);
                this.merberList.splice(index,1);
                this.back();
                this.$message({
                    type:"success",
                    message:"移除成功"
                });
            } catch (error) {
                if(error !== 'cancel'){
                    console.log('移除成员错误',error);
                }else{
                    this.$message({
                        type: 'info',
                        message: '已取消解散'
                    });  
                }
            }
        },
        //设置管理员setMaster
        async setAdministrators(){
            try {
                this.$http.post('/Msg/Chat/setGroupManager.ashx',{GId:this.group.Id,Managerid:this.targer.Id})
            } catch (error) {
                console.log('设置管理员错误',error);
            }
        },
        //转让群主
        async setMaster(){
               this.$confirm('确认将群主转让给该成员吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
					this.$http.post('/Msg/Chat/handOverMaster.ashx',{GId:this.group.Id,ManagerId:this.targer.Id}).then(res=>{
						if(res.res==0){
							this.getGroupInfo()
						}
					})
				}).catch(err=>{
					this.getGroupInfo()
					 this.$message({
					    type: 'info',
					    message: '已取消转让'
					}); 
				})      
        },
        getMember(result){
            this.filterMember(result);
        },
        async filterMember(result){
            let list = [];
            let listClone = []
            let memberList = [];
            result.forEach(element => {
               
                for(let i = 0,length = this.merberList.length; i < length; i++){
                    if(this.merberList[i].Id === element.UId ){
                        listClone.push(this.merberList[i]);
                        break;
                    }else if(i === length-1){
                         listClone.push({
                            Id: element.UId,
                            IsManager: false,
                            IsMaster: false,
                            Name: element.UName,
                            Picture: element.Picture,
                            PostName: '',
                            ReachName: '',
                        });
                        list.push(element.UId);
                        let obj = {
                            Id:element.UId,
                            IsManager: false,
                            IsMaster: false,
                            Name:element.UName,
                            Picture:element.Picture,
                            PostName: element.PositionName,
                            ReachName: "",
                        }
                    }
                }
            });
            await this.saveMember(list);
            this.merberList = listClone;
        },
        //邀请成员
        async saveMember(list){
            list =  list.join();
            await this.$http.post('/Msg/Chat/setGroupMember.ashx',{GId:this.group.Id,Memberid:`,${list},`});
            this.$message({
                type: 'success',
                message: '邀请成功!'
            });
        },
        manageMembers(item){
			console.log(item)
            this.targer = item;
            this.$refs.contentBox.style.marginLeft = '-100%';
        },
        back(){
            this.targer = null;
            this.$refs.contentBox.style.marginLeft = 0
        },
        invitation(){
            this.$refs['memberButtton'].click();
        },
        edit(){
            this.isEdit = 1;
            this.$nextTick(()=>{
                this.$refs.input.focus();
            });
        },
        async update(){
			if(this.group.Name==this.groupName){
				 this.isEdit = 0;
				return 
			}
            try {
                let data = {
                    GId:this.group.Id,
                    Name:this.groupName,
                    Task:null,
                    Project:null,
                }
               this.$http.post('/Msg/Chat/msgGroupEdit.ashx',data).then(res=>{
				   if(res.res==0){
					   this.group.Name = this.groupName;
				   }
			   })   
            } catch (error) {
                console.log('群编辑接口错误',error);
            }
            this.isEdit = 0;
        }
    },
}
</script>
<style lang="less" scoped>
.add-box{
    .head{
        font-size: 1.8rem;
        font-weight: 600;
        color: white;
        height: 4.2rem;
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
        margin-top: 1rem;
        div:first-child{
            white-space: nowrap;
            font-size: 1.4rem;
            margin-right: 1rem;
        }
        span{
            font-size: 1.4rem;
        }
        i{
            font-size: 1.6rem;
            margin-left: 1rem;
            color: #62afff;
            cursor: pointer;
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
.member-item{
    display: inline-block;
    margin-right: 1rem;
    margin-top: 0.5rem;
    cursor: pointer;
    text-align: center;
    img{
        height: 4rem;
        width: 4rem;
        border-radius: 50%;
        overflow: hidden;
    }
    p{
        font-size: 1.4rem;
        line-height: 2.2rem;
        text-align: center;
    }
    i{
        height: 4rem;
        width: 4rem;
        border-radius: 50%;
        border: 1px solid #62afff;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #62afff;
    }
    .invitation{
        color: #62afff;
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
    margin: 1rem;
    .laber{
        white-space: nowrap;
        font-size: 1.4rem;
        span:last-child{
            color: #8d8d8d;
            font-size: 1.2rem;
            float:right;
        }
    }
   
}
.content-box{
    width: 200%;
    transition: all .3s;
    .select-item{
        width: 50%;
        float: left;
    }
}
.member-info{
    background: #cfd3d7;
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    position: relative;
    img{
        height: 6rem;
        width: 6rem;
    }
    .back{
        position: absolute;
        cursor: pointer;
        left: 0.5rem;
        color: white;
        font-size: 1.5rem;
    }
}
.manage-item{
    padding: 0.5rem 1rem;
    font-size: 1.3rem;
}
.switch{
    float:right;
}
/deep/ .showDel{
    display: none;
}
/deep/ .mem-imgs{
    display: none !important;
}
/deep/.l-relative{
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%,-50%)
}
</style>