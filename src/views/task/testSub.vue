<template>
</template>

<script>
export default {
    props: ["detailProp"],
    model: {
        prop: 'detailProp',
        event: 'changeObj',
    },
    data() {
        return {
            timer: null,
            detail: this.detailProp
        }
    },
    watch: {
        detail: {
            handler(val) {
                this.$emit('changeObj', this.detail)
            },
            deep: true
        }
    },
    mounted() {
        let that = this;
        // this.timer = setInterval(function () {
        //     if (that.detail.progress < 10) {
        //         that.detail.status = "开始了";
        //         that.detail.progress++;
        //         that.detail.array.push(that.detail);
        //     } else {
        //         that.detail.status = "已结束";
        //         clearInterval(that.timer);
        //     }
        // }, 100);
    }
}
</script>
