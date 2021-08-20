<!--
* @author: zxg
* @date: 2019-10-18 
* @description:

slot -> 左边视图

title_icon:标题图标 非必需

view_btn:标题右边的功能按钮  非必需

panes:视图下的菜单 非必需

custom:自定义内容  非必需

content -> 右边视图

props -> 

title_name:标题 必需

load:加载开关 非必需

childLoading: 右边视图加载动画

-->
<template>
  <div
    id="module_bv"
    v-loading.lock="load"
    :class="{ on: this.mobile.showLeft }"
    element-loading-text="拼命加载中"
  >
    <div class="bv_left">
      <div>
        <div class="bv_left_top">
          <div class="view_title">
            <slot name="title_icon"></slot>
            <p>{{ title_name }}</p>
            <slot name="title"></slot>
          </div>
          <div class="view_title_ben"><slot name="view_btn"></slot></div>
        </div>
        <div class="bv_left_ctn"><slot name="panes"></slot></div>
        <slot name="custom"></slot>
      </div>
      <div class="bv-card-item" v-if="title_name2">
        <div class="bv_left_top">
          <div class="view_title">
            <slot name="title_icon2"></slot>
            <p>{{ title_name2 }}</p>
          </div>
          <div class="view_title_ben"><slot name="view_btn2"></slot></div>
        </div>
        <div class="bv_left_ctn"><slot name="panes2"></slot></div>
        <slot name="custom2"></slot>
      </div>
      <span
        v-if="mobile.showLeft"
        class="bv-left-switch hiFont hi-close"
        @click="toggleBvLeft()"
      ></span>
      <!-- <span v-else-if="!this.isOpen" class="bv-left-switch hiFont hi-more" @click="toggleBvLeft()"></span> -->
    </div>
    <!-- left end -->
    <div class="bv_right" v-loading="childLoading">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    title_name: {
      type: String,
      default: "",
    },
    title_name2: {
      type: String,
      default: "",
    },
    load: {
      type: Boolean,
      required: false,
    },
    childLoading: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    ...mapState(["mobile"]),
  },
  methods: {
    ...mapActions(["mobile_ToggleLeft"]),
    toggleBvLeft() {
      // this.isOpen = !this.isOpen;
      this.mobile_ToggleLeft(!this.mobile.showLeft);
    },
    updata(val) {
      this.$emit("updata", val);
    },
  },
};
</script>

<style lang="less">
@import "../assets/variable.less";

.baseViewPage {
  height: 100%;
}

#module_bv {
  display: flex;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #f6f6f6;
  height: 100%;
}

.bv_left {
  position: relative;
  width: 25rem;
  flex: 0 0 25rem;
  padding-right: 1rem;
  transition: transform 0.5s ease;
  .bv-card-item {
    margin-top: 1.5rem;
  }
  & > div {
    position: relative;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 4px;
    padding-top: 5rem;
    height: 100%;

    ul {
      overflow-y: auto;
      list-style-type: none;
      height: 100%;
      margin: 0 auto;
      padding-bottom: 0.5rem;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        background: #fff;
        width: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ddd;
        width: 5px;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
        width: 5px;
      }

      .el-select {
        position: relative;
        font-size: 1.6rem;
        height: 4rem;
        display: flex;
        border-radius: 6px;
        align-items: center;
        margin: 0.5rem 1rem;

        .el-input > .el-input__inner:focus {
          background: #f8f8f8;
        }

        .el-input__inner {
          user-select: none;
        }
      }

      li {
        position: relative;
        padding: 0 1.6rem;
        list-style: none;
        font-size: 1.6rem;
        height: 4rem;
        display: flex;
        color: #8d8d8d;
        cursor: pointer;
        background: #fff;
        border-radius: 6px;
        align-items: center;
        margin: 0.5rem;
        transition: box-shadow 0.3s ease;
        z-index: 1;
        user-select: none;

        & > i {
          font-weight: normal;
          font-size: 2.4rem;
          margin-right: 1rem;
        }

        & > img {
          border-radius: 50%;
          width: 2.8rem;
          height: 2.8rem;
          margin-right: 1rem;
        }

        & > span {
          margin-right: auto;
          font-size: 1.4rem;
        }

        &:hover {
          font-weight: 600;
          color: #448ef5;
        }

        &.activeList {
          color: #448ef5;
          font-weight: 600;
          box-shadow: 0px 3px 18px -5px rgba(80, 166, 255, 0.7);
          font-size: 1.6rem;
          z-index: 2;

          & > span {
            font-size: 1.6rem;
          }
        }
      }
    }
  }

  .el-tab-pane::-webkit-scrollbar {
    background: #fff;
    width: 5px;
  }

  .el-tab-pane::-webkit-scrollbar-thumb {
    background: #ddd;
    width: 5px;
  }

  .el-tab-pane::-webkit-scrollbar-track {
    background: #fff;
    width: 5px;
  }

  .el-tab-pane {
    overflow: auto;
    max-height: 80vh;
  }

  .el-collapse-item__content {
    padding-bottom: 0;
  }

  .el-collapse-item__header {
    border-bottom: none;
    font-weight: bold;
    color: rgba(109, 109, 109, 1);
    font-size: 1.4rem;
    transition: all 0.3s ease;

    &.is-active {
      font-size: 1.6rem;
    }
  }

  .el-collapse-item__wrap {
    border-bottom: none;
  }
  .el-tabs__nav-wrap {
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      display: none;
    }
    .el-tabs__nav-scroll {
      margin-left: 0px;
      display: flex;
      justify-content: center;
      .el-tabs__item {
        padding: 0 10px;
      }
    }
  }

  .el-input__inner {
    border-bottom: 0px;
  }
}

.bv_left_top {
  position: absolute;
  display: flex;
  justify-content: space-between;
  height: 4rem;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  padding: 0 1rem;
}

.bv-left-switch {
  // border-radius: 0 4px 4px 0;
  display: none;
  position: absolute;
  bottom: 8rem;
  text-align: center;
  width: 3.5rem;
  // right: -3.5rem;
  // right: 0;
  left: -3.5rem;
  height: 4rem;
  line-height: 4rem;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &.hi-close {
    background: #fff;
    color: #ccc;

    &:hover {
      color: @color_blue;
    }
  }

  &.hi-more {
    box-shadow: 0px 2px 5px rgba(99, 141, 175, 0.55);
    background: @color_blue;
    color: #fff;

    &:hover {
      background: @color_blue_snd;
    }
  }
}

.bv_left_ctn {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  position: relative;
  .el-tabs {
    position: relative;
    height: 100%;

    .el-tabs__header {
      position: absolute;
      width: 100%;
    }

    .el-tabs__content {
      padding-top: 5rem;
      box-sizing: border-box;
      height: 100%;
      .pane-btn {
        margin: 0 0 10px 0;
        text-align: center;
        .el-button {
          width: 96%;
        }
      }
      & > * {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
          background: #fff;
          width: 5px;
        }

        &::-webkit-scrollbar-track {
          background: #fff;
          width: 5px;
        }

        &::-webkit-scrollbar-thumb {
          background: #eee;
          border-radius: 5px;
          width: 5px;
        }
      }
    }
  }
}

.view_title {
  color: rgba(87, 87, 87, 1);
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  flex: 8;
}

.view_title_ben {
  align-items: center;
  display: flex;
}

.el-tabs__nav-wrap::after {
  border-bottom: none;
  background-color: transparent;
}

.bv_right {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    background: @color_grey_bg;
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: @color_grey_bg;
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: @color_grey_bg;
    border-radius: 5px;
    width: 5px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #ddd;
  }
}

@media all and (max-width: 1024px) {
  #module_bv {
    padding: 0;

    .bv_left {
      position: fixed;
      z-index: 667;
      height: 100%;
      width: 68%;
      padding: 0;
      top: 0;
      right: 0;
      transform: translateX(200%);

      & > div {
        border-radius: 0;
      }

      .bv-left-switch {
        display: block;
      }
    }

    .bv_right {
      padding: 0 1rem;
      margin: 1rem 0;

      height: 95%;
      &::-webkit-scrollbar {
        width: 0px;
      }

      &::-webkit-scrollbar-track {
        width: 0px;
      }

      &::-webkit-scrollbar-thumb {
        width: 0px;
      }

      &:hover::-webkit-scrollbar-thumb {
        background: transparent;
      }

      &::after {
        top: 0;
        left: 0;
        z-index: -1;
        content: "";
        display: block;
        position: fixed;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }
  }

  #module_bv.on {
    height: 100vh;
    width: 100%;
    position: fixed;
    z-index: 668;
    top: 0;
    .bv_left {
      transform: translateX(0);
    }

    .bv_right {
      &::after {
        z-index: 665;
        opacity: 0.3;
      }
    }
  }
}
</style>
