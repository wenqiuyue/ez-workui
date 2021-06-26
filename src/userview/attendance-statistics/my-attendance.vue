<template>
  <div style="height: 100%" class="my-attendance">
    <BaseView class="attendance_single">
      <item
        slot="content"
        :fatData="fatData"
        :childLoading="childLoading"
        @updata="updata"
        ref="child"
        activeItem="申诉列表"
      ></item>
    </BaseView>
  </div>
</template>

<script>
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    item: () => import("./attendance-info"),
  },
  data() {
    return {
      childLoading: false,
      fatData: {}, // 需要传给日历组件
    };
  },
  created() {
    this.sendParams();
  },
  methods: {
    sendParams() {
      this.fatData = {};
      this.fatData.menuType = "privateAttendance"; // 个人考勤
      this.fatData.tabsNum = "1";
      this.fatData.fatTimeYMD = new Date()
        .toLocaleDateString()
        .timeFormat("yyyy-MM-dd");
      this.fatData.fatUsId = undefined;
    },
    //更新
    updata(val) {},
  },
};
</script>

<style lang="less" scoped>
.my-attendance {
  /deep/#module_bv {
    padding: 0;
  }
}
/deep/.bv_left {
  display: none;
}

.box {
  margin-top: 3rem;
}

.is-selected {
  color: rgba(187, 187, 187, 1);
}

.bg-purple {
  background: #d3dce6;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.attendance_single /deep/ .bv_left_ctn .el-tabs .el-tabs__content {
  padding-top: 0;
}

.attendance_single /deep/ .bv_right {
  height: 100%; //CX 这个高度不晓得谁弄的100%, 还无法撑高，只有改一下了
}

//考勤统计
.my-attence-static {
  box-sizing: border-box;
  padding: 0 2rem;

  .time-pick {
    margin: 0 auto;
    margin-bottom: 2rem;

    // text-align: center;
    span {
      font-size: 1.4rem;
      color: #6d6d6d;
    }

    /deep/.el-date-editor {
      /deep/.el-input__inner {
        background: #fff;
        border: 1px solid #eee !important;
      }
    }
  }
}

@media all and (max-width: 1024px) {
}
</style>
