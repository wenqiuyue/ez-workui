<!--
* @ author: CX
* @ date: 2019-12-16
* @ description：title部分搜索组件
-->
<template>
    <div>
    <el-row v-if="TInfo">
        <el-col :sm="24" :md="8" class="left">
            <!--CX 左侧 按钮组 --- 不弄插槽，插槽在弹层弄，那个变化多更适合 <slot name="btnGroup"></slot> -->
            <el-button-group>
                <el-button type="info" size="small" icon="el-icon-plus"
                    v-if="TInfo.btnShow[0].ishow"
                    @click="btnGroupClick('add')">新增
                </el-button>

                <el-button type="info" size="small" icon="el-icon-check" 
                    v-if="TInfo.btnShow[1].ishow" :disabled="TInfo.btnShow[1].disabled"
                    @click="btnGroupClick('start')">启用
                </el-button>

                <el-button type="info" size="small" icon="el-icon-close"
                    v-if="TInfo.btnShow[2].ishow" :disabled="TInfo.btnShow[2].disabled"
                    @click="btnGroupClick('close')">禁用
                </el-button>

                <el-button type="info" size="small" icon="el-icon-delete" 
                    v-if="TInfo.btnShow[3].ishow" :disabled="TInfo.btnShow[3].disabled"
                    @click="btnGroupClick('del')">删除
                </el-button>
            </el-button-group>
        </el-col>
		<el-col :sm="24" :md="16" class="right" v-if="showBtn">
			 <slot name="btn"></slot>
		</el-col>
        <el-col :sm="24" :md="16" class="right" v-if="showSearch">
            <!-- 右侧 下拉 及 搜索框 -->
            <!-- 通用下拉1 选择部门-->
            <el-select v-model="dropValue1" @change="drop1Change"
                    v-if="TInfo.dropDown.drop_1" 
                    :placeholder="TInfo.dropDown.drop_1.placeholder" 
                    :clearable="TInfo.dropDown.drop_1.clear"
                    size="medium" :style="{width: TInfo.dropDown.comWidth}">
                <el-option
                    v-for="item in TInfo.dropDown.drop_1.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
            </el-select>
            <!-- 通用下拉2 选择状态-->
            <el-select v-model="dropValue2" @change="drop2Change"
                    v-if="TInfo.dropDown.drop_2"
                    :placeholder="TInfo.dropDown.drop_2.placeholder"
                    :clearable="TInfo.dropDown.drop_2.clear"
                    size="medium" :style="{width: TInfo.dropDown.comWidth}">
                <el-option
                    v-for="item in TInfo.dropDown.drop_2.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!-- 通用查询3 选择时间范围-->
            <el-date-picker v-if="TInfo.dropDown.drop_3"
                type="dates" size="medium" 
                v-model="dropValue3" @change="drop3Change" 
                value-format="yyyy-MM-dd"
                :clearable="TInfo.dropDown.drop_3.clear" 
                :placeholder="TInfo.dropDown.drop_3.placeholder" 
                :style="{width: TInfo.dropDown.comWidth}">
            </el-date-picker>
            <el-input  v-if="TInfo.dropDown.searchInput" v-model="searchValue" 
                :placeholder="TInfo.dropDown.searchInput.placeholder" autofocus
                @keyup.enter.native="searchClick" @blur="searchEvent"
                size="medium" style="width: 219px;">
                <el-button slot="append" @click="searchClick">搜索</el-button>
            </el-input>
            <!-- 节假管理4 针对一键查询法定节假 -->
      <!--      <el-button type="primary" size="medium"
                v-if="TInfo.dropDown.drop_4" icon="el-icon-search"
                @click="getVacation" class="vacation-btn"
                style="margin-left: 15px;background:#448EF5;">
                法定节假
            </el-button> -->
        </el-col>
    </el-row>
    <XModal :title="'总操作'" confirmBtnText="确认" cancelBtnText="取消" width='30%'
        @onConfirm="handleConfirm" name="cPopTxt" ref="cPopTxt" id="pop-txt">
            <div v-show="btnGroupPop[1]">确认要进行批量<span> [激活] </span>操作? </div>
            <div v-show="btnGroupPop[2]">确认要进行批量<span> [禁用] </span>操作? </div>
            <div v-show="btnGroupPop[3]">确认要进行批量<span> [删除] </span>操作? </div>
    </XModal>    
    </div>
</template>

<script>
export default {
	props:{
		showSearch:{
	       type:Boolean,
		   default:true
		},
		TInfo:{
			type:Object,
			default:function(){
				return {}
			}
		},
		showBtn:{
			type:Boolean,
			default:false
		}
	},
    components: {
        XModal: () => import('@/components/XModal')
    },
    data() {
        return {
            btnGroupPop: [false, false, false, false], // pop 确认批量删除 批量激活 批量禁用
            dropValue1: '',
            dropValue2: '全部的',
            dropValue3: [], // 选择时间范围
            
            oldSearchValue: '',
            searchValue: this.TInfo.dropDown.searchInput.value ?? ''
        }
    },
    watch: {
        // 时间范围选择监听，控制只两值
        dropValue3 (value, oldvalue) {
            if (!value) // null时不执行
                return false
            if (value.length >= 3)
                this.dropValue3 = oldvalue
        },
        // 查询请求细节
        searchValue (val, oldval) {
            this.oldSearchValue = oldval
        }
    },
    methods: {
        //清空搜索框
        searchValueInit(){
            this.searchValue=''
        },
        // 按钮组被单机时 分支写这把，不然父组件还是要写分支，看着不简洁
        btnGroupClick (txt) {
            if (txt === 'add') {
                this.$emit('addClick') // 添加不需要弹层确认
            } else if (txt === 'start') {
                this.popCalc(1)
            } else if (txt === 'close') {
                this.popCalc(2)
            } else if (txt === 'del') {
                this.popCalc(3)
            }
        },
        // 后三个按钮有二次确认,先打开个弹层确认，确认后才触发父方法，如果你还要确认，那继续去父组件判断
        popCalc (n) {
            // pop 确认批量删除 批量激活 批量禁用
            this.btnGroupPop.forEach((item, index) => {
                if (index === n) {
                    this.btnGroupPop[index] = true
                } else {
                    this.btnGroupPop[index] = false
                }
            })
            // 单机的那个btn唤醒，别的btn全沉睡
            // 数据处理好后就可以打开XModal弹层了
            this.$forceUpdate()
            this.$modal.show('cPopTxt');
        },
        // 弹层必须选择确认，才开始执行以下事件，传给父级
        handleConfirm () {
            if (this.btnGroupPop[1]) {
                this.$emit('startClick')
            } else if (this.btnGroupPop[2]) {
                this.$emit('closeClick')
            } else if (this.btnGroupPop[3]) {
                this.$emit('delClick')
            }

            // this.$refs.cPopTxt.loadBtn(true) 
            // // 这post请求
            // this.$refs.cPopTxt.loadBtn(false)  
            this.$modal.hide('cPopTxt')
        },
        
        // 搜索按钮失去焦点时：空值就别触发查询
        searchEvent () {
            if (this.oldSearchValue === '' && this.searchValue === '') {
                return false
            }
            this.oldSearchValue = ''
            this.$emit('searchClick', this.searchValue)
        },
        // 搜索按钮被单机时：无脑查询不管有没有值
        searchClick () {
            this.oldSearchValue = ''
            this.$emit('searchClick', this.searchValue)
        },
        // 各个下拉被选中时
        drop1Change () {
            this.$emit('drop1Change', this.dropValue1)
        },
        drop2Change () {
            this.$emit('drop2Change', this.dropValue2)
        },
        drop3Change () { 
            // 点击确定按钮后才会触发这货
            if (!this.dropValue3) { // null时
                this.$emit('drop3Change', [])
            } else {
                // 快速比较大小：t1.replace(/-/g, '') > t2.replace(/-/g, '')
                this.$emit('drop3Change', this.dropValue3)
            }
        },

        // 节假管理：一键获取国家法定节假，提供
        getVacation () {
            this.$emit('vacationClick')
        },
        toggleSearch() {
            this.showMobileSearch = !this.showMobileSearch;
        },
        back() {
            this.mobile_ToggleState({
                act: 'all',
                value: true
            })
        }
    }
}
</script>

<style lang="less">
 // 总操作弹窗
        #pop-txt {
           /deep/.ctn{
			   color: #909399;
			   font-size: 18px;
			   padding: 20px 11px 40px;
			   span { color: #448EF5; }
		   }
        }
</style>
