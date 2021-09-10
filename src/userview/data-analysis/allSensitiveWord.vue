<template>
  <div class="allSensitiveWords">
    <XModal
      name="allSensitiveWords"
      width="1200px"
      height="700px"
      title="所有敏感词"
      showCrossBtn
      class="high-table"
      ref="allSensitiveWords"
    >
      <el-table
        v-if="sensitiveWord"
        :data="sensitiveWord"
        stripe
        style="width: 100%; height: 100%"
        :cell-style="{ textAlign: 'center', cursor: 'pointer' }"
        :header-cell-style="headerCellStyle"
        border
        @cell-click="cellClick"
      >
        <el-table-column prop="Sensitive" label="敏感词" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.Sensitive }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="DateSumNum" label="停留时长" sortable>
          <template slot-scope="scope">
            {{ scope.row.DateSumNum ? scope.row.DateSumNum.toFixed(2) : 0 }} min
          </template>
        </el-table-column>
        <el-table-column prop="ClickSumNum" label="点击次数" sortable>
          <template slot-scope="scope">
            {{ scope.row.ClickSumNum }} 次
          </template>
        </el-table-column>
        <el-table-column prop="KeySumNum" label="键盘输入量" sortable>
          <template slot-scope="scope"> {{ scope.row.KeySumNum }} 次 </template>
        </el-table-column>
      </el-table>
    </XModal>
    <progresscom
      :IsRealTimeScreenshot="IsRealTimeScreenshot"
      :name="'sensitiveWord'"
      :activeBar="{ name: word }"
      :stime="stime"
      :etime="etime"
      :uid="uid"
      :teamValue="teamValue"
    ></progresscom>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    progresscom: () => import("./progressCom"),
  },
  props: {
    //是否显示截图
    IsRealTimeScreenshot: {
      type: Boolean,
      default: true,
    },
    sensitiveWord: {
      type: Array,
      default: null,
    },
    //(开始时间）
    stime: {
      type: String | Date,
      default: null,
    },
    //结束时间
    etime: {
      type: String | Date,
      default: null,
    },
    //用户id
    uid: {
      type: Number,
      default: null,
    },
    teamValue: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      word: null,
      headerCellStyle: {
        textAlign: "center",
        fontSize: "18",
        background: "#f8f8f8",
        color: "#4a4a4a",
      },
    };
  },
  methods: {
    cellClick(row) {
      this.word = row.Sensitive;
      this.$modal.show("sensitiveWord");
    },
  },
};
</script>
<style lang="less" scoped>
.allSensitiveWords {
  .high-table {
    /deep/.ctn {
      height: 100%;
      padding: 0 2rem 1rem;
      padding-right: 0;
      box-sizing: border-box;
      .el-table__body-wrapper {
        height: calc(100% - 115px);
        overflow-y: auto;
      }
    }
  }
}
</style>
