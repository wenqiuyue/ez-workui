<template>
  <div class="hp-content">
    <div class="hp-content-child">
      <div class="hide">*5</div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent)
    ) {
      document.getElementsByClassName("hp-content")[0].style.paddingBottom =
        "9rem";
    }
  },
};
</script>

<style lang="less">
@import "../../assets/content.less";
</style>
