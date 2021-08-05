<template>
  <div class="allbehavior">
    <XModal
      width="70%"
      height="80%"
      name="allbehavior"
      :showCrossBtn="true"
      title="全部行为分析"
      @opened="opened"
    >
      <div class="modal_content" v-if="tableData">
        <el-table
          :data="tableData.Behaviors"
          border
          style="width: 100%; margin-bottom: 5px"
          row-key="rid"
          :header-cell-style="attenceHeaderStyle"
          :tree-props="{ children: 'FormNames', hasChildren: 'hasChildren' }"
        >
          >
          <el-table-column
            prop="Behavoir"
            label="行为"
            width="170"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="window_key" @click="handleBehavior(scope.row)">{{
                scope.row.Behavoir
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="BehavoirType"
            label="行为状态"
            show-overflow-tooltip
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag
                :type="getTagType(scope.row.BehavoirType)"
                size="small"
                v-if="scope.row.BehavoirType"
                >{{ scope.row.BehavoirType }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="FocusFormName"
            label="窗口名称"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="window_key" @click="handleWindowKey(scope.row)">{{
                scope.row.FocusFormName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="DateSumNum" label="耗时">
            <template slot-scope="scope">
              {{ scope.row.DateSumNum }}分钟
            </template>
          </el-table-column>
          <el-table-column prop="ClickSumNum" label="鼠标点击次数">
            <template slot-scope="scope">
              <span>{{ scope.row.ClickSumNum }}次</span>
            </template>
          </el-table-column>
          <el-table-column prop="KeySumNum" label="键盘输入次数">
            <template slot-scope="scope">
              <span>{{ scope.row.KeySumNum }}次</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </XModal>
    <progresscom
      v-if="tableData"
      :name="'allbehaviorpic'"
      :activeBar="selRow"
      :stime="tableData.stime"
      :etime="tableData.etime"
      :uid="tableData.User.id"
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
    teamValue: {
      type: Number,
      default: null,
    },
    selUser: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      tableData: null,
      selRow: null, //选择的窗口
    };
  },
  methods: {
    /**
     * 行为分析标签颜色
     * 积极：绿  消极：红  无：白色
     */
    getTagType(val) {
      if (val == "积极") {
        return "success";
      } else if (val == "消极") {
        return "danger";
      } else {
        return "info";
      }
    },
    handleWindowKey(row) {
      this.selRow = {
        name: row.FocusFormName,
      };
      this.$nextTick(() => {
        this.$modal.show("allbehaviorpic");
      });
    },
    /**
     * 查看行为
     */
    handleBehavior(row) {
      this.$emit("handleBehavior", row, this.tableData);
    },
    /**
     * 打开弹窗回调
     */
    opened() {
      this.$nextTick(() => {
        this.tableData = this.selUser;
        //树形表格添加id
        if (
          this.tableData &&
          this.tableData.Behaviors &&
          this.tableData.Behaviors.length
        ) {
          this.tableData.Behaviors.forEach((e, index) => {
            e.haschil = true;
            e.rid = index + 1;
            if (e.FormNames && e.FormNames.length) {
              e.FormNames.forEach((s, ind) => {
                s.rid = `${index + 1}-${ind}`;
                s.DateSumNum = s.DateNum;
                s.ClickSumNum = s.ClickNum;
                s.KeySumNum = s.KeyNum;
              });
            }
          });
        }
      });
    },

    attenceHeaderStyle() {
      return {
        color: "#909399",
      };
    },
  },
};
</script>
<style lang="less" scoped>
.allbehavior {
  /deep/.ctn {
    overflow-y: auto;
    padding-bottom: 10px;
  }
  .modal_content {
    padding: 0 5px;
    height: 100%;
    /deep/.el-table {
      font-size: 13px;
      height: 100%;
      overflow: auto;
      th,
      td {
        padding: 8px 0;
      }
      .window_key {
        cursor: pointer;
      }
      &::before {
        background-color: transparent;
      }
    }
  }
}
</style>
