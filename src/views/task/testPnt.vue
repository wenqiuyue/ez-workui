<template>
<div>
    <div>名称: {{detail.name}}</div>
    <div>状态: {{detail.status}}</div>
    <div>进度: {{detail.progress}}%</div>
    <div v-for="(item,i) in detail.array" v-bind:key="i">
        <div>名称{{i}}: {{item.name}}</div>
    </div>
    <Sub v-model="detail"></Sub>
</div>
</template>

<script>
export default {
    components: {
        Sub: () => import('./testSub'),
    },
    data() {
        return {
            detail: {
                name: '详情',
                status: '未开始',
                progress: 0,
                array: [],
            }
        }
    },
}
</script>
