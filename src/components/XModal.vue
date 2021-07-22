<!-- 
    [????-??-?? 许彬彬]：增加方法loadBtn(type=true)，true（默认）:将确认按钮变为提交状态，如果没有确认按钮，则将取消按钮变为加载状态，false:取消按钮的提交状态
    [2019-12-19 许彬彬]：增加属性confirmBtnIcon（String），设置确认按钮的图标
    [2019-12-19 许彬彬]：增加属性cancelBtnIcon（String），设置取消按钮的图标
    [2019-12-20 许彬彬]：修复classes属性无效的问题，现在能正确添加自定义样式了
    [2019-12-20 许彬彬]：增加header插槽，可以在顶部添加内容（title属性必须为空才会有此插槽）
    [2019-12-20 许彬彬]：增加footer插槽，可以在底部添加内容（设置按钮的属性必须为空才会有此插槽）
    [2019-12-20 许彬彬]：增加isFixed属性（默认false），是否固定头尾，只让中间内容区域滚动，header插槽，footer插槽需要自己定义高度，否则这两块是自动高度，并且会根据内容区域增大逐渐变小，具体样式见下面.isFixed里面的.tit或.bottom（就一个height和flex样式）
-->
<template>
  <modal
    :name="this.name"
    :width="this.width"
    :height="this.height"
    :minWidth="this.minWidth"
    :minHeight="this.minHeight"
    :maxWidth="this.maxWidth"
    :maxHeight="this.maxHeight"
    :pivotX="this.pivotX"
    :pivotY="this.pivotY"
    :delay="this.delay"
    :adaptive="this.adaptive"
    :resizable="this.resizable"
    :draggable="this.draggable"
    :scrollable="this.scrollable"
    :clickToClose="this.closeOnDimmer"
    :classes="this.classess"
    @before-open="beforeOpen"
    @before-close="beforeClose"
    @opened="opened"
    @closed="closed"
    transition="nice-show"
    ref="location"
  >
    <div class="modal" :style="issafariBrowser ? 'padding-bottom:7rem' : ''">
      <!-- tit 顶部区域 -->
      <div v-if="this.title" class="tit">
        <div class="sel">
          <slot name="sel"></slot>
        </div>
        <div class="tit_text">{{ this.title }}</div>
        <a v-if="this.showCrossBtn">
          <i class="hiFont hi-close-thin" @click="onCancel"></i>
        </a>
      </div>
      <div v-else class="header">
        <slot name="header"></slot>
      </div>

      <!-- ctn 内容区域 -->
      <div class="ctn">
        <slot></slot>
      </div>

      <!-- bottom 底部按钮区域 -->
      <div class="bottom" v-if="this.cancelBtnText || this.confirmBtnText">
        <a
          class="cancel"
          :class="{ loading: loadCancel }"
          v-if="this.cancelBtnText"
          @click="onCancel"
        >
          <span v-if="loadCancel">
            <i class="el-icon-loading"></i>
            提交中...
          </span>
          <span v-if="!loadCancel">
            <i v-if="cancelBtnIcon" :class="['hiFont', cancelBtnIcon]"></i>
            {{ this.cancelBtnText }}
          </span>
        </a>
        <a
          class="confirm"
          :class="{ loading: loadConfirm }"
          v-if="this.confirmBtnText"
          @click="onConfirm"
        >
          <span v-if="loadConfirm">
            <i class="el-icon-loading"></i>
            提交中...
          </span>
          <span v-if="!loadConfirm">
            <i v-if="confirmBtnIcon" :class="['hiFont', confirmBtnIcon]"></i>
            {{ this.confirmBtnText }}
          </span>
        </a>
      </div>
      <div v-else class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: "xModal",
  props: {
    //模态窗的唯一标识（不能与其他模态框重复）
    name: {
      type: String,
      default: "",
    },

    //模态窗的标题
    title: {
      type: String,
      default: "",
    },

    //当存在标题时可显示右上角是否存在关闭按钮
    showCrossBtn: {
      type: Boolean,
      default: false,
    },

    //确认按钮的内容（为空则没有按钮）
    confirmBtnText: {
      type: String,
      default: "",
    },

    //取消按钮的内容（为空则没有按钮）
    cancelBtnText: {
      type: String,
      default: "",
    },

    //确认按钮图标
    confirmBtnIcon: {
      type: String,
      default: "",
    },

    //取消按钮图标
    cancelBtnIcon: {
      type: String,
      default: "",
    },

    //宽度
    width: {
      type: String | Number,
      default: "600",
    },

    //高度
    height: {
      type: String | Number,
      default: "auto",
    },

    //最小宽度
    minWidth: {
      type: Number,
      default: 0,
    },

    //最小高度
    minHeight: {
      type: Number,
      default: 0,
    },

    //最大宽度
    maxWidth: {
      type: Number,
      default: 99999999,
    },

    //最大高度
    maxHeight: {
      type: Number,
      default: 99999999,
    },

    //模态框X轴（0-1.0）
    pivotX: {
      type: Number,
      default: 0.5,
    },

    //模态框Y轴（0-1.0）
    pivotY: {
      type: Number,
      default: 0.5,
    },

    //自定义样式
    classes: {
      type: String | Array,
      default: "v--modal",
    },

    //打开模态窗的延迟，单位：秒
    delay: {
      type: Number,
      default: 0,
    },

    //是否自适应宽度
    adaptive: {
      type: Boolean,
      default: true,
    },

    //是否可以拉伸大小
    resizable: {
      type: Boolean,
      default: false,
    },

    //是否可以自由拖拽
    draggable: {
      type: Boolean,
      default: false,
    },

    //如果height属性为auto，并且模式高度超过窗口高度，则可以滚动
    scrollable: {
      type: Boolean,
      default: function () {
        return this.height == "auto";
      },
    },

    //点击遮罩层是否关闭弹窗
    closeOnDimmer: {
      type: Boolean,
      default: true,
    },
    //点击确认按钮是否能关闭模态框，默认点击不会关闭
    isConfirmClose: {
      type: Boolean,
      default: false,
    },

    //点击取消按钮是否能关闭模态框，默认点击就关闭
    isCancelClose: {
      type: Boolean,
      default: true,
    },

    //是否固定头尾，仅让中间区域滚动
    isFixed: {
      type: Boolean,
      default: false,
    },

    //打开模态框后需要改变的路由链接，默认为空，不改变
    //路径开头一定有斜杠才会从根域名替换地址 如果url="/aaa/bbb"，原路由为"http://www.a.cn/ccc"，会变为"http://www.a.cn/aaa/bbb"
    //不带斜杠就会变成在地址后面追加参数 如果url="aaa/bbb"，原路由为"http://www.a.cn/ccc"，会变为"http://www.a.cn/ccc/aaa/bbb"
    url: {
      type: String,
      default: "",
    },

    //路由来源，表示模态框关闭后要返回的路由地址
    //这个路径开头一定要带斜杠，如"/report"
    referer: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isFirstOpen: true,
      loadCancel: false,
      loadConfirm: false,
      issafariBrowser: false,
    };
  },
  computed: {
    classess() {
      let res = this.classes;
      if (typeof this.classes == "string") {
        res = [this.classes];
      }

      if (this.classes.indexOf("v--modal") < 0) {
        res.unshift("v--modal");
      }

      if (this.isFixed) {
        res.push("isFix");
      }
      return res;
    },
  },
  watch: {
    url(val) {
      if (this.url && !this.isFirstOpen) {
        history.pushState(null, "", val);
      }
    },
  },
  mounted() {
    this.$emit("loadSuccess");
    //判断移动端safari
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.issafariBrowser =
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent);
    } else {
      this.issafariBrowser = false;
    }
    // console.log(this.issafariBrowser)
  },
  methods: {
    //点击确认
    onConfirm() {
      if (this.loadConfirm) return;
      if (this.isConfirmClose) {
        this.$modal.hide(this.name);
      }
      this.$emit("onConfirm");
    },

    //点击取消
    onCancel() {
      if (this.loadCancel) return;
      if (this.isCancelClose) {
        this.$modal.hide(this.name);
      }
      this.$emit("onCancel");
    },

    //打开前
    beforeOpen(e) {
      this.$emit("beforeOpen", e);
    },
    //关闭前
    beforeClose(e) {
      this.$emit("beforeClose", e);
    },

    //打开后
    opened(e) {
      if (process.env.NODE_ENV === "prodution") {
        const body = document.getElementById("app");
        if (body.append) {
          body.append(this.$refs.location.$el);
        } else {
          body.appendChild(this.$refs.location.$el);
        }
      }
      if (this.url) {
        history.pushState(null, "", this.url);
        this.isFirstOpen = false;
      }
      this.$emit("opened", e);
    },

    //关闭后
    closed(e) {
      if (this.referer) {
        history.pushState(null, "", this.referer);
      }
      this.$emit("closed", e);
    },

    /**
     * 切换提交按钮的加载状态
     * @param {Boolean} bool true变为加载，false恢复原样
     */
    loadBtn(bool) {
      if (this.confirmBtnText) {
        this.loadConfirm = bool;
      } else if (this.cancelBtnText) {
        this.loadCancel = bool;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../assets/variable.less";
.modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.tit {
  height: 6rem;
  line-height: 6rem;
  text-align: center;
  width: 100%;
  position: relative;
  font-size: 2.2rem;
  font-weight: 600;
  color: @color_blue;
  position: relative;
  .sel {
    position: absolute;
    left: 0;
    top: 0rem;
  }

  & > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 1.6rem;
  }

  & > a {
    position: absolute;
    display: block;
    top: 2rem;
    right: 0.5rem;
    line-height: 2rem;
    border-left: 1px solid #eee;
    color: #9b9b9b;

    i {
      padding: 0 1rem;
      display: block;
      font-size: 2rem;
      cursor: pointer;
      transition: color 0.3s ease;
      color: @color_black_light;

      &:hover {
        color: @color_blue;
      }
    }
  }
}

.ctn {
  height: 100%;
  flex: 1;
  position: relative;
}

.bottom {
  padding-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  box-sizing: border-box;

  a {
    border-radius: 4px;
    flex: 1;
    display: block;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.5rem;
    text-align: center;
    margin: 0 1rem;
    cursor: pointer;

    &.loading {
      cursor: default;
      opacity: 0.6 !important;
    }

    &:last-child {
      margin-left: 0;
    }

    &:first-child {
      margin-left: 1rem;
    }

    & > span > i {
      margin-right: 5px;
    }
  }

  .confirm {
    transition: background 0.3s ease;
    background: linear-gradient(
      90deg,
      rgba(97, 193, 254, 1) 0%,
      rgba(66, 139, 244, 1) 50%,
      rgba(97, 193, 254, 1) 100%
    );
    background-size: 200% 100%;
    color: #fff;
  }

  .confirm:hover {
    background-position-x: -100%;
  }

  .cancel {
    background: rgba(242, 242, 242, 1);
    color: #9b9b9b;
  }

  .cancel:hover {
    background-color: rgba(233, 233, 233, 1);
  }
}

.isFix {
  max-height: 100vh;

  .modal {
    max-height: 100vh;

    .tit {
      height: 6rem;
      flex: 0 0 6rem;
    }

    .ctn {
      overflow-y: auto;
    }

    .bottom {
      height: 5rem;
      flex: 0 0 5rem;
    }
  }
}

@media screen and (max-width: 1024px) {
  .modal {
    height: 100vh;
    box-sizing: border-box;
    div {
      -webkit-overflow-scrolling: touch;
    }
  }
}
</style>
