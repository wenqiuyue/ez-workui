<template>
  <div class="allwords">
    <XModal
      name="allwords"
      width="1200px"
      height="700px"
      title="所有高频词"
      showCrossBtn
      class="high-table"
      ref="allwords"
    >
      <el-table
        v-if="selUser"
        :data="selUser.KeyWordFreqs"
        stripe
        style="width: 100%; height: 100%"
        :cell-style="{ textAlign: 'center', cursor: 'pointer' }"
        :header-cell-style="headerCellStyle"
        border
        @cell-click="cellClick"
      >
        <el-table-column prop="Key" label="词汇名" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                <p
                  v-for="(con, index) in scope.row.FocusFormName"
                  :key="index"
                  style="margin-bottom: 3px"
                >
                  {{ con.FocusFormName }}
                </p>
              </div>
              <span>{{ scope.row.Key }}</span>
            </el-tooltip> -->
            <span>{{ scope.row.Key }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="KeywordsStatus" label="状态">
          <template slot-scope="scope">
            {{ scope.row.KeywordsStatus ? scope.row.KeywordsStatus : "无" }}
          </template>
        </el-table-column>
        <el-table-column prop="DateNum" label="停留时长" sortable>
          <template slot-scope="scope"> {{ scope.row.DateNum }} min </template>
        </el-table-column>
        <el-table-column prop="ClickNum" label="点击次数" sortable>
          <template slot-scope="scope"> {{ scope.row.ClickNum }} 次 </template>
        </el-table-column>
        <el-table-column prop="Value" label="进程频率" sortable>
          <template slot-scope="scope"> {{ scope.row.Value }} 次 </template>
        </el-table-column>
      </el-table>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  props: {
    selUser: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
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
      console.log(row, this.selUser);
      this.$emit("handleKeyWord", row, this.selUser);
    },
  },
};
</script>
<style lang="less" scoped>
.allwords {
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
