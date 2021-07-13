<template>
  <div id="hp-pbarbox">
    <h6 v-if="title">{{ title }}</h6>
    <div class="hp-Pbar">
      <el-tooltip
        v-for="(item, i) in paramsobj.ComputerUsageRecord.workRat"
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
          <i class="member-bar-proportion" v-if="item.width > 11 && showName">
            {{ item.width }}%
          </i>
          <i
            class="member-hp-Pbar-text"
            v-if="item.width > 11 && showName"
            :style="`color:${cleartext(item.name).background}`"
          >
            <div class="item-name">
              <div
                class="item_circle"
                :style="`background:${cleartext(item.name).background}`"
              ></div>
              {{ cleartext(item.name).value }}
            </div>
            <p>{{ item.time }}小时</p>
          </i>
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
      type: Object,
      default: null,
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
          background = "#F59F00";
          break;
        case "娱乐":
          value = "娱乐";
          background = "#F59F00";
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
          background = "#666666";
          break;
        case "NotExistTime":
          value = "离线";
          background = "#666666";
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
          background = "#F59F00";
          break;
        case "NotExistTimeWork":
          value = "离线";
          background = "#666666";
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
      const data = {
        stime: this.paramsobj.stime,
        etime: this.paramsobj.etime,
        clickUser: this.paramsobj.User.id,
        gid: this.paramsobj.User.ProgressGroupId,
      };
      this.$emit("getBar", item, data);
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
  height: 1.6rem;
  display: flex;
  cursor: pointer;
  min-height: 1.6rem;

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
  .member-hp-Pbar-text {
    position: absolute;
    top: 24px;
    font-weight: bold;
    .item-name {
      display: flex;
      flex-direction: row;
      align-items: center;
      .item_circle {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 3px;
      }
    }
  }
  .member-bar-proportion {
    width: 100%;
    display: block;
    text-align: right;
    color: #ffffff;
  }
}
</style>
