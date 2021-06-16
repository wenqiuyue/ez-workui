<template>
    <div class="statistic-root">
        <div class="statistic-title">
            <slot name="title" />
        </div>
        <div class="statistic-value">
            <slot name="value">--</slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
/deep/.statistic {
    &-root {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: #000000d9;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: "tnum";
    }
    &-title {
        margin-bottom: 4px;
        color: #00000073;
        font-size: 14px;
    }
    &-value {
        color: #000000d9;
        font-size: 24px;
        display: inline-block;
        direction: ltr;

        > div.el-form-item {
            margin-bottom: unset !important;
        }
    }
}
</style>