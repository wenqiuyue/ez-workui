<template>
  <div
    class="text-tooltip"
    :style="`min-width:${minWidth};width:${width};max-width:${maxWidth}`"
  >
    <el-tooltip
      class="item"
      effect="dark"
      :disabled="isShowTooltip"
      :content="content"
      :placement="placement"
    >
      <p class="over-flow" @mouseover="onMouseOver(refName)">
        <span
          class="tooltip_text"
          :ref="refName"
          @click.stop="$emit('handleClick')"
          >{{ content }}</span
        >
      </p>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "textTooltip",
  props: {
    minWidth: {
      style: String,
      default: null,
    },
    maxWidth: {
      style: String,
      default: null,
    },
    width: {
      style: String,
      default: null,
    },
    //显示方向
    placement: {
      type: String,
      default: "top",
    },
    // 显示的文字内容
    content: {
      type: String,
      default: () => {
        return "";
      },
    },
    // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）
    refName: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      isShowTooltip: true,
    };
  },
  methods: {
    onMouseOver(str) {
      let parentWidth = this.$refs[str].parentNode.offsetWidth;
      let contentWidth = this.$refs[str].offsetWidth;
      // 判断是否开启tooltip功能
      if (contentWidth > parentWidth) {
        this.isShowTooltip = false;
      } else {
        this.isShowTooltip = true;
      }
    },
  },
};
</script>
<style>
.el-tooltip__popper {
  z-index: 99999 !important;
}
</style>
<style lang="less" scoped>
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
