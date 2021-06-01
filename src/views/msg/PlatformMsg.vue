<template>
   <div  class="hp-sidebar-sub">
        <!-- 消息 -->
        <div id="sub-msg"  class="hp-menu-borderd">
          <!-- 菜单列表 -->
          <div>
            <div class="linkList">
              <!-- 所有消息 -->
              <a class="hiFont hi-unread " :class="{link:link=='unread'}" @click="hideMobileMenu('unread')">
                <span>所有消息</span>
                <i v-if="msg.notChatCount > 0">{{ msg.notChatCount | moreThan99 }}</i>
              </a>
              <!-- 项目消息 -->
              <a class="hiFont hi-task" :class="{link:link=='pro'}"  @click="hideMobileMenu('pro')" >
                    <span>项目消息</span>
                    <i v-if="msg.proCount > 0">{{ msg.proCount | moreThan99 }}</i>
              </a>
              <!-- 简报消息 -->
              <a  class="hiFont hi-report" :class="{link:link=='report'}"  @click="hideMobileMenu('report')" > 
                    <span>简报消息</span>
                    <i v-if="msg.reportCount > 0">{{
                    msg.reportCount | moreThan99
                    }}</i>
              </a>
              
              <!-- 审核消息 -->
                <a class="hiFont hi-review" :class="{link:link=='review'}"  @click="hideMobileMenu('review')" > 
                    <span>审核消息</span>
                    <i v-if="msg.reviewCount > 0">{{
                    msg.reviewCount | moreThan99
                    }}</i>
                </a>
              <!-- 企业消息 -->
                <a  class="hiFont hi-enterprise" :class="{link:link=='ep'}" @click="hideMobileMenu('ep')" >
                    <span>企业消息</span>
                    <i v-if="msg.epCount > 0">{{ msg.epCount | moreThan99 }}</i>
                </a>
              <!-- 客户消息 -->
                <a  class="hiFont hi-customer" :class="{link:link=='customer'}" @click="hideMobileMenu('customer')" >
                    <span>客户消息</span>
                    <i v-if="msg.customerCount > 0">{{
                    msg.customerCount | moreThan99
                    }}</i>
                </a>
              <!-- 日程消息 -->
                <a class="hiFont hi-calendar" :class="{link:link=='calendar'}"  @click="hideMobileMenu('calendar')" >
                    <span>日程消息</span>
                    <i v-if="msg.calendarCount > 0">{{
                    msg.calendarCount | moreThan99
                    }}</i>
                </a>
              <!-- 其他消息 -->
                <a class="hiFont hi-bell" :class="{link:link=='other'}" @click="hideMobileMenu('other')" >
                    <span>其他消息</span>
                    <i v-if="msg.otherCount > 0">{{
                    msg.otherCount | moreThan99
                    }}</i>
                </a>
              <!-- 系统消息 -->
                <a class="hiFont hi-system" :class="{link:link=='system'}" @click="hideMobileMenu('system')" >
                    <span>系统消息</span>
                    <i v-if="msg.systemCount > 0">{{
                    msg.systemCount | moreThan99
                    }}</i>
                </a>
              <!-- 聊天
              <router-link
                to="/chat"
                class="hiFont hi-chat"
                @click.native="hideMobileMenu"
              >
                <span>聊天</span>
                <i v-if="msg.chatCount > 0">{{ msg.chatCount | moreThan99 }}</i>
              </router-link> -->
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    data() {
        return {
            link:'',
        }
    },
    methods:{
        hideMobileMenu(type){
            this.link = type
            this.$emit('changType',type)
        }
    },
    computed:{
        ...mapGetters(["msg"]),
    },
}
</script>
<style lang="less" scoped>
@import "../../assets/variable.less";
.hp-sidebar-sub {
  position:relative;
  height:auto;
  width: auto;
  left: 0;
  & > div {
    display: block;
    position: relative;
    height: 100%;

    & > form {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: #fff;
      z-index: 2;

      & > div {
        width: 90%;
        margin: 0 auto;
        position: relative;

        &::before {
          position: absolute;
          color: @color_grey;
          left: 0.8rem;
          font-size: 1.8rem;
          top: 0.6rem;
          z-index: 2;
        }

        & > input {
          display: block;
          border: none;
          border-radius: 5rem;
          background: #fafafa;
          color: @color_black_light;
          margin: 0 auto;
          padding: 0.7rem 1.2rem;
          padding-left: 2.7rem;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 1.2rem;
          font-size: 1.4rem;
          transition: all 0.3s ease;
          z-index: 1;

          &::-webkit-input-placeholder {
            color: #aaa;
            font-size: 1.2rem;
          }

          &:focus {
            background: #f2f2f2;
          }
        }
      }

      & > h3 {
        margin: 0;
        padding: 0;
        border: none;
        display: flex;
        align-items: center;
        margin: 2rem 0;
        position: relative;
        padding-left: 3rem;
        padding-right: 1.6rem;
        font-size: 1.8rem;
        font-weight: bold;
        color: #777;

        &::before {
          border-left: 5px solid @color_blue;
          display: block;
          position: absolute;
          content: "";
          left: @spacer_md;
          top: 50%;
          margin-top: -1rem;
          height: 2rem;
        }

        & > span {
          margin-right: auto;
        }

        & > div {
          i {
            color: #448ef5;
            font-size: 2rem;
            cursor: pointer;
            height: auto;
            font-weight: normal;
            padding: 0.5rem;
            border-radius: 4px;
            transition: all 0.3s ease;
          }

          &:hover i {
            color: #999;
            background: #f8f8f8;
          }
        }
      }
    }

    & > div {
      padding-top: 0;
      height: 100%;
      box-sizing: border-box;

      & > div {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
		-webkit-overflow-scrolling:touch;

        &::-webkit-scrollbar {
          background: #fff;
          width: 5px;
        }

        &::-webkit-scrollbar-track {
          background: #fff;
          width: 5px;
        }

        &::-webkit-scrollbar-thumb {
          background: #fff;
          border-radius: 5px;
          width: 5px;
        }

        &:hover::-webkit-scrollbar-thumb {
          background: #eee;
        }
      }

      &.with-input {
        padding-top: 10rem;
        height: 100vh;
      }
    }

    a {
      display: block;
      color: #3c3c3c !important;
      font-weight: normal !important;
      padding: 0 @spacer_md;
      height: 4.5rem;
      line-height: 4.5rem;
      position: relative;
      font-size: 1.4rem;
      transition: all 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.exception {
        height: 0;
        border-bottom-width: 0px;
      }

      &:hover {
        background: @color_grey_light_hover;
      }

      &:before {
        color: #bbb;
        margin-right: 0.7rem;
        font-size: 120%;
        vertical-align: middle;
      }

      & > span {
        vertical-align: middle;
      }

      & > i {
        font-size: 1rem;
        font-style: normal;
        color: #fff;
        padding: 0 0.6rem;
        top: @spacer_md;
        right: @spacer_md;
        position: absolute;
        background: linear-gradient(
          -55deg,
          @color_blue 0%,
          @color_blue_snd 100%
        );
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        border-radius: 1rem 0.8rem;
        line-height: 1.6rem;
      }

      & > s {
        font-style: normal;
        float: right;
        display: block;
        text-decoration: none;
        color: #bbb;
        margin-bottom: 0.2rem;
        transform: rotateZ(-90deg);
        transition: all 0.3s ease;
      }

      &.on,
      &.router-link-active {
        background: @color_grey_light_hover;
        color: @color_blue !important;
      }

      &.on > s,
      &.router-link-active > s,
      &.inSrch > s {
        transform: none;
      }

      &.on::before,
      &.router-link-active::before {
        color: @color_blue;
      }

      & + div:not(.sub-group) {
        height: 0px;
        overflow: hidden;
        transition: height 0.5s ease;
      }
    }

    .sub-group {
      .el-menu-item-group__title {
        padding: 0;
      }

      .el-menu {
        border: 0;
      }

      .el-menu-item {
        &.is-active:not(.is-opened) {
          color: @color_blue;
        }

        &:focus {
          background: unset;
        }

        &:hover {
          background: @color_grey_light_hover;
        }
      }

      .el-submenu {
        .el-menu-item {
          padding-right: 2rem;

          & > div {
            display: flex;
            align-items: center;
            padding-right: 0;

            .pro-priority {
              flex: 0 0 0.9rem;
              height: 0.9rem;
              display: block;
              margin-right: 0.7rem;
              border-radius: 50%;
            }

            .pro-status {
              flex: 0 0 0.9rem;
              display: block;
              margin-right: 0.45rem;
              font-size: 1.5rem;
            }

            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        .el-submenu__title {
          & > * {
            padding-right: 0.7rem;
          }

          & > i {
            color: #bbb;
          }

          &:hover {
            background: @color_grey_light_hover;
          }

          .el-submenu__icon-arrow {
            transform: rotateZ(-90deg);
            padding-right: 0;
          }
        }

        &.is-opened > .el-submenu__title {
          color: @color_blue;

          & > i {
            color: @color_blue;
          }

          .el-submenu__icon-arrow {
            transform: rotateZ(0deg);
          }
        }
      }
    }

    &#sub-pro > form > h3 {
      padding-right: @spacer_sm;
    }
  }
}

.link{
    background: #f8f8f8;
    color: #448ef5 !important;
}

</style>