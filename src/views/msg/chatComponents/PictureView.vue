<template>
  <div
    class="background"
    v-if="isShowImg"
    ref="background"
    @mousewheel="mousewheel"
    @DOMMouseScroll="mousewheel"
  >
    <i class="hiFont hi-close" @click="hide()"></i>
    <!-- @load="defaultPosition" -->
    <img v-lazy="src" ref="targetImg" draggable="false" @mousedown="move" @touchstart="touchstart" />
    <ul>
      <li @click="reduction">原图</li>
      <li @click="shrink">缩小</li>
      <li>{{parseInt(defaultSize/1*100)}}%</li>
      <li @click="enlarge">放大</li>
      <li @click="rotate">旋转</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["src"],
  data() {
    return {
      isShowImg: false,
      defaultSize: 1,
      degrees: 0,
    };
  },
  watch: {
    isShowImg() {
      if (this.isShowImg) {
        setTimeout(() => {
          this.defaultPosition();
        }, 500);
      }
    },
  },
  methods: {
    show() {
      this.isShowImg = true;
    },
    hide() {
      this.degrees = 0;
      this.defaultSize = 1;
      this.isShowImg = false;
    },
    shrink() {
      if (this.defaultSize == 0.1) return;
      this.defaultSize = (this.defaultSize - 0.1).toFixed(1);
      this.$refs[
        "targetImg"
      ].style.transform = `scale(${this.defaultSize}) rotate(${this.degrees}deg)`;
    },
    enlarge() {
      this.defaultSize = (Number(this.defaultSize) + 0.1).toFixed(1);
      this.$refs[
        "targetImg"
      ].style.transform = `scale(${this.defaultSize}) rotate(${this.degrees}deg)`;
    },
    reduction() {
      this.defaultSize = 1;
      this.degrees = 0;
      this.$refs[
        "targetImg"
      ].style.transform = `scale(${this.defaultSize}) rotate(${this.degrees}deg)`;
      this.defaultPosition();
    },
    rotate() {
      this.degrees += 90;
      this.$refs[
        "targetImg"
      ].style.transform = `scale(${this.defaultSize}) rotate(${this.degrees}deg)`;
    },
    mousewheel() {
      if (event.wheelDelta) {
        event.wheelDelta > 0 || this.enlarge();
        event.wheelDelta < 0 || this.shrink();
        return;
      }
      if (event.detail) {
        event.detail < 0 || this.enlarge();
        event.detail > 0 || this.shrink();
      }
    },
    move(e) {
      let odiv = e.target;
      let disX = e.clientX;
      let disY = e.clientY;
      document.onmousemove = (e) => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        disX = e.clientX;
        disY = e.clientY;
        odiv.style.left = parseFloat(odiv.style.left) + left + "px";
        odiv.style.top = parseFloat(odiv.style.top) + top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    touchstart(e) {
      let odiv = e.target;
      let disX = e.targetTouches[0].clientX;
      let disY = e.targetTouches[0].clientY;
      document.ontouchmove = (e) => {
        let left = e.targetTouches[0].clientX - disX;
        let top = e.targetTouches[0].clientY - disY;
        disX = e.targetTouches[0].clientX;
        disY = e.targetTouches[0].clientY;
        odiv.style.left = parseFloat(odiv.style.left) + left + "px";
        odiv.style.top = parseFloat(odiv.style.top) + top + "px";
      };
      document.ontouchend = (e) => {
        document.ontouchmove = null;
        document.ontouchend = null;
      };
    },
    defaultPosition() {
      this.$refs["targetImg"].style.maxWidth = "90vw";
      this.$refs["targetImg"].style.top =
        this.$refs["background"].clientHeight / 2 -
        this.$refs["targetImg"].clientHeight / 2 +
        "px";
      this.$refs["targetImg"].style.left =
        this.$refs["background"].clientWidth / 2 -
        this.$refs["targetImg"].clientWidth / 2 +
        "px";
    },
  },
};
</script>
<style lang="less" scoped>
.background {
  background-color: rgba(0, 0, 0, 0.9);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  .hi-close {
    color: white;
    cursor: pointer;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 999999;
  }
  img {
    position: absolute;
    cursor: move;
    user-select: none;
    // top: 50%;
  }
  .hi-close:hover {
    transform: scale(1.3);
  }
  ul {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 2rem;
    color: white;
    display: flex;
    background-color: black;
    li {
      padding: 1rem;
      margin: 0 0.5rem;
      cursor: pointer;
    }
  }
}
</style>