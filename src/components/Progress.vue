<template>
  <div id="hp-pbarbox">
    <h6 v-if="title">{{ title }}</h6>
    <div class="hp-Pbar">
      <el-tooltip
        v-for="(item, i) in paramsobj"
        :key="i"
        class="item"
        effect="dark"
        :content="cleartext(item.name).value + ':' + item.width + '%'"
        placement="top"
        v-if="item.width > 0"
      >
        <li
          :style="
            'width:' +
              item.width +
              '%;background:' +
              cleartext(item.name).background
          "
          @click.stop="clickBar(item)"
        >
          <i class="hp-Pbar-text" v-if="item.width > 10 && showName"
            >{{ cleartext(item.name).value }} {{ item.width }}%</i
          >
        </li>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "Progress",
  props: {
    title: {
      type: String,
      default: "",
    },
    paramsobj: {
      type: Array,
      default: function() {
        return [];
      },
    },
    showName: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    cleartext(text) {
      let value = "";
      let background = "";
      // console.log(text)
      switch (text) {
        case "CORTime":
          value = "工作";
          background = "#73e8ed";
          break;
        case "工作":
          value = "工作";
          background = "#73e8ed";
          break;
        case "ETTime":
          value = "娱乐";
          background = "#ffef67";
          break;
        case "娱乐":
          value = "娱乐";
          background = "#ffef67";
          break;
        case "FreeTime":
          value = "空闲";
          background = "#ff6565";
          break;
        case "空闲":
          value = "空闲";
          background = "#ff6565";
          break;
        case "未知":
          value = "未知";
          background = "#3bc8f1";
          break;
        case "UnknownTime":
          value = "未知";
          background = "#3bc8f1";
          break;
        case "离线":
          value = "离线";
          background = "#ebebeb";
          break;
        case "NotExistTime":
          value = "离线";
          background = "#ebebeb";
          break;
        case "CORTimeWork":
          value = "工作";
          background = "#73e8ed";
          break;
        case "UnknownTimeWork":
          value = "未知";
          background = "#3bc8f1";
          break;
        case "FreeTimeWork":
          value = "空闲";
          background = "#ff6565";
          break;
        case "ETTimeWork":
          value = "娱乐";
          background = "#ffef67";
          break;
        case "NotExistTimeWork":
          value = "离线";
          background = "#ebebeb";
          break;
        default:
          value = text;
          break;
      }
      return {
        value,
        background,
      };
    },
    clickBar(item) {
      item.name = this.cleartext(item.name).value;
      this.$emit("getBar", item);
    },
  },

  mounted() {},
};
</script>

<style lang="less" scoped>
#hp-pbarbox {
  width: 100%;
  background: #d8d8d8;
  border-radius: 1.1rem;

  h6 {
    font-size: 1.8rem;
    line-height: 1.8rem;
    margin-bottom: 3rem;
  }
}

.hp-Pbar {
  width: 100%;
  height: 1.5rem;
  display: flex;
  cursor: pointer;
  min-height: 1.5rem;

  li {
    height: 100%;
    min-width: 5%;
    position: relative;
    font-size: 1.2rem;
  }

  li:first-child {
    // background: #FE4E4F;
    border-top-left-radius: 1.1rem;
    border-bottom-left-radius: 1.1rem;
  }
  li:last-child {
    // background: #D8D8D8;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  .hp-Pbar-text {
    min-width: 8rem;
    color: #6d6d6d;
    position: absolute;
    line-height: 1.5rem !important;
    bottom: -2rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
