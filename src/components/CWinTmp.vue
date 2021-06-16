<template>
    <div class="content-box">
        <!-- 头部标题，编辑关闭等按钮 -->
        <div class="title-box"> 
            <!-- 左 -->
            <div class="tit-left" v-text="indexData.name"  v-if="showLabel">
            </div>
			<div class="tit-left"   v-else>
				标签详情
			</div>
            <!-- 右 -->
            <div class="tit-right">
                <span v-if="indexData.type === 'Add'" 
                    v-show="!submiting" @click="topSubmit">提交
                </span>
                <span v-show="submiting" style="cursor:default;">
                    <i class="el-icon-loading" style="font-size: 18px;color: #fff;font-weight: 900;"></i>提交中...
                </span>

                <i v-if="indexData.type === 'Edit'" class="el-icon-edit" @click="editClick"> 点击编辑</i>
                <i class="el-icon-close" title="关闭窗口" @click="$modal.hide(indexData.xModalName)"></i>
            </div>
        </div>

        <!-- 主体表单 -->
        <div class="form-box" :class="[editState === true ? 'edit-ing' : '']">
            <!-- 1 也可以用插槽作用域来传这个'编辑中'状态，
                 那editSate这个变量的起始位置得写在当前这个子组件的data上了 -->
            <!-- 子层: 利用插槽作用域传值:state="editState"后 -->
            <!-- 父层: slot-scope="props" 后 props.state才能用 -->
            <!-- 2 目前利用的v-model传，editSate变量起始在父组件那 -->
            <slot name="form"></slot>
        </div>

        <!-- 底下按钮 -->
        <ul class="bottom-box" v-show="editState && indexData.type === 'Edit'">
            <li>
                <el-button @click="editClick" size="medium">取消</el-button>
            </li>
            <li>
                <el-button @click="comfirmClick" type="primary" size="medium" v-if="!comfirming">确认</el-button>
                <el-button type="primary" size="medium" v-if="comfirming" :loading="true">提交中...</el-button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    // props: ['indexData', 'editState','showLabel'],
	props:{
		indexData:{
			type:Object,
			default:function(){
				return{}
			}
		},
		editState:{
			type:Boolean,
			default:false
		},
		showLabel:{
			type:Boolean,
			default:true
		}
		
		
	},
    model: {
        prop: 'editState',
        event: 'editChange'
    },
    data() {
        return {
            submiting: false, // 添加时，提交中

            comfirming: false, // 提交中
        }
    },
    created () { },
    methods: {
        // 添加窗口
        // 单击大添加按钮
        topSubmit () {
            this.$emit('topSubmit')
        }, 
        toggleSubmit () {
            this.submiting = !this.submiting
        },

        // 编辑窗口
        // 单击小编辑后，小取消
        editClick () {
            this.$emit('editChange', !this.editState)
            this.$emit('editClick')
        },
        // 单击小确定后
        comfirmClick () {
            this.$emit('comfirmClick')
        },
        toggleComfirm () {
            this.comfirming = !this.comfirming
        },
        
    }
}
</script>

<style lang="less" scoped>
.content-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f7f7f7;
    // 头部
    .title-box {
        height: 50px;
        line-height: 50px;
        margin-bottom: 5px;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        position: relative;
        // 绝对定位实现三栏布局缺点：左侧小方块脱离文档流，无法自动支撑父容器高度
        .tit-left {
            position: absolute;
            top: 0; bottom: 0; 
            left: 10px; 
            width: 90px;
            font-size: 14px;
            color: #666;
            font-weight: 700;
        }
        .tit-right {
            margin-left: 100px;
            text-align: right;
            padding-right: 10px;
            span, i {
                text-align: center;
                vertical-align: middle;
                cursor: pointer;  
            }
            // 大提交按钮
            span {
                display: inline-block;
                width: 119px;
                height: 51px; // ******
                color: #fff;
                font-size: 18px;
                background: #448ef5;
                font-weight: bold;
                margin-top: -2px; // 父层的行高对行内行内块有影响，正好span用了行内块
            }
            // 编辑按钮
            i.el-icon-edit {
                font-size: 14px;
                color: #448ef5;
                margin-left: 7px;
                padding: 10px 0; // 点击范围弄大点
            }
            // 关闭按钮
            i:last-child {
                font-size: 2.5rem; 
                color: rgb(74, 74, 74);
                margin-left: 15px;
                margin-right: 5px;
            }
        }
    }

    // 中间
    .form-box {
        flex: 1 0 0; // 最后个零针对firefox浏览器的，它特殊点呗，min-height: 0的思路
        margin-bottom: 5px;
        background-color: #fff;
        padding: 7px 30px 0;
        
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
            background: #FFF;
            width: 5px; }
        &::-webkit-scrollbar-track {
            background: #FFF;
            width: 5px; }
        &::-webkit-scrollbar-thumb {
            background: #FFF;
            border-radius: 5px;
            width: 5px; }
        &:hover::-webkit-scrollbar-thumb {
            background: #eee; }
    }

    // 底下
    .bottom-box {
        height: 50px;
        // flex-basis: 50px;
        line-height: 50px;
        background-color: #fff;
        padding: 0 10px;
        // overflow: auto;
        li {
            float: left;
            width: 50%;
            &:last-child {
                text-align: right;
            }
        }
    }
}

// 中间：写了一些自定义的表单样式
// 处理小红点 
// 查看状态下，红点全部取消，不然初始会自带，查看模式很难看
.form-box /deep/ .is-required .el-form-item__label:before {
    content: none !important;
}
// 编辑状态下，只把必填标签的红点重新展示出来
.form-box.edit-ing /deep/ .is-required .el-form-item__label:before {
    content: '*' !important;
}     

// 编辑状态 间距大 非编辑 间距小
.form-box {
    &.edit-ing /deep/ .el-form-item {
        margin-bottom: 23px;
    }
	/deep/.el-form-item {
	    margin-bottom: 7px;
	}
}
.form-box {
    // Label美化
    /deep/ .el-form-item__label {
        font-weight: 500;
        text-align-last: justify;
        color: #111;
    }
    // Label以外的：暗一点
    /deep/ .state-see { color: #606266; }    
    
	/deep/.el-form-item.is-error .el-input__inner{
		 border: 1px solid #F56C6C !important;
		 border-radius: 4px;
	}
    // 单选按钮 右margin默认太多，有点丑
    /deep/ .el-radio {
        margin-right: 15px;
    }
    // 带单位的尾巴
    /deep/ .el-input-group__append {
        display: table-cell;
        position: relative;
        vertical-align: middle;
        border: none;
        width: 1px;
        padding: 0 11px;
        border-radius: 0;
        white-space: nowrap;
        color: #909299;
        background-color: #DCDFE6;
        cursor: pointer;
    }
}

// 成员选择器：加号按钮隐藏
.form-box {
    /deep/ .mem-add { display: none !important; }
}
// 针对成员选择器，单选或多选时自定义按钮
/deep/ .el-form-item__content #mem-public {
    display: inline-block;
    vertical-align: middle;
    .location > div:first-child {
        margin-top: -5px;
        p {
            color: #9A9CA2;
            width: 42px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .c-btn {
        width: 150px;
		 margin-left: 10px;
        // p标签
        p.hi-user-task,
        p.el-icon-plus {
            display: inline-block;
            width: 3.4rem;
            height: 3.4rem;
            line-height: 3.4rem;
            text-align: center;

            font-size: 2.5rem !important;
            font-weight: 900;
            color: #bbb;
            border: 2px solid #bbb;
            border-radius: 50%;
            cursor: pointer;
            margin-top: 0;
            vertical-align: middle;
        }
        img {
            display: inline-block;
            width: 3.4rem;
            height: 3.4rem;
            border-radius: 50%;
            cursor: pointer;
            vertical-align: middle;
        }
        span {
            margin-left: 10px;
            color: #9A9CA2;
        }
    }
}
@media screen and (max-width: 1024px) {
}
</style>
