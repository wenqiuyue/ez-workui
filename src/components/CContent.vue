<!--
* @ author: CX slot
* @ date:   2019-12-16
* @ description: 统一管理后台模板样式 有时候直觉自己能把某些地方的多个this写成一个this，那就用slot吧（思想差不多）
-->
<template>
    <!-- 后台模块排版 -->
    <div class="cx-content">
        <!-- 查询 -->
        <div class="title-box">
            <slot name="search"></slot>
        </div>
        <!-- 表格 -->
        <div class="table-box" ref="scrollTable">
            <slot name="main"></slot>
            <!-- <span style="position: fixed; bottom: 100px; right: 50px;
                width: 50px; height: 50px; line-height: 50px;
                background-color: #f2f5f6;
                box-shadow: 0 0 6px rgba(0, 0, 0, .12);
                text-align: center;
                font-size: 18px;
                font-weight: 700;
                color: #1989fa;"
                @click="toTop">TOP
            </span> -->
        </div>
        <!-- 分页 -->
        <div class="pages-box">
            <slot name="pages"></slot>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        el: '';
        return {}
    },
    methods: {
        // toTop () {
        //     this.$refs.scrollTable.scrollTop = 0
        // }
    }
}
</script>

<style lang="less" scoped>
.cx-content {
    // margin: 可以在这设置margin-top，然后让父margin塌陷，父用calc(100% - 这的margin-top)设置高
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction:column;

    // 上 搜索
    /deep/ .title-box {
        // 36px就是 size="medium" 的高度，左边上下对齐，改size，影响这
        min-height: 36px;
        background-color: #f6f6f6 !important;
        border-bottom: 1px solid #EBEEF5;
        padding-bottom: .5rem; // title下间隔
        // 搜索按钮
        .left {
            // 左边按钮住上下居中
            margin-top: 2px;
            .el-button--small, 
            .el-button--small.is-round {
                padding: 9px 10px;
            }
        }
        .right { text-align: right; }
        // 搜索按钮
        .right .el-input-group__append {
            border: none !important;
            color: #fff;
            background-color: #448EF5;
        }
        // 查询框的白色小背景 以及背景色
        .el-input__inner {
            background-color: #fff;
            border-color: #fff !important;
            &:hover { 
                border-color: #fff; // f0f0f0
                background-color: #fff !important; 
            }
            &:focus {
                border-color: #448EF5;
            }
        }
        // PC端 搜索框距离
        .el-select--medium,
        .el-input-group {
            margin-left: 15px;
        }
    }

    // title和page-foot固定，让table-box分掉所有的父层剩余空间
    // 同时控制当table-box内部的内容，超出'这个剩余空间'时，滚动
    // 中 表格
    /deep/ .table-box {
        flex: 1;
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
        // 去掉表格默认下边框，自己重写给分页上边框好看点
        .el-table::before, 
        .el-table__fixed-right::before, 
        .el-table__fixed::before {
            height: 0;
        }
        // 还要去一个
        .el-table td, .el-table th.is-leaf {
            border: none;
        }
        // 之后加自己的边框线
        .el-table__fixed-body-wrapper tbody tr {
            transform: translateY(1px);
        } 

        // 表格行换色
        th {
            background-color: #F5F7FA;
        }
        tr:nth-child(even) {
            background-color: #F5F7FA;
        }
        tr.hover-row td {
            background-color: transparent;
        }

        // 行状态 √ ×
        span.row-state i {
            cursor: pointer;
            font-size: 16px;
            font-weight: 900;
            &.el-icon-check {color: #73D13D;}
            &.el-icon-close {color: #FC4C4D;}
            &.el-icon-remove-outline {color: #FEA940;}
        }
    }

    // 下 分页器
    /deep/ .pages-box {
        position:relative;
        padding: 1rem 0 .4rem;
        border-top: 1px solid #EBEEF5;
        // total弄到最右边
        .el-pagination__total {
            position: absolute;
            right:0;
            height: 28px;
            line-height: 28px;
            font-size: 13px;
            display: inline-block;
        }
    }
}

// 移动端
@media only screen and (max-width:991px) {

.cx-content {
    // 上 搜索
    /deep/ .title-box .right {
        // 移动端搜索框100%，上边距
        .el-select--medium,
        .el-input-group,
        .el-date-editor {
            width: 100% !important;
            margin-left: 0;
            margin-top: 10px;
        }
        .vacation-btn {
            margin-top: 10px;
        }
    }
    // 中 表格
    // 下 分页器
    /deep/ .page-box .el-button--small {
        padding: 9px 10px; 
    }
}

}
</style>
