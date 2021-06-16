<script>
import XModal from '@/components/XModal'
import CWinTmp from '@/components/CWinTmp'

export default {
    props: {
        readonly: {
            type: Boolean,
            default: false,
        },
        XModelProps: {
            type: Object,
            default: {},
            required: true,
        },
        CWinTmpProps: {
            type: Object,
            default: {},
            required: true,
        },
    },
    components: {
        XModal,
        CWinTmp,
    },
    render() {
        const {
            readonly,
            XModelProps,
            CWinTmpProps,
        } = this

        return (
            <XModal
                { ...XModelProps }
            >
                <CWinTmp
                    { ...CWinTmpProps }
                    ref="winTmp"
                >
                    <template slot="form">{ this.$slots.default }</template>
                </CWinTmp>
            </XModal>
        )
    },
}
</script>