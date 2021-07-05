<template>
  <div class="allsoftware">
    <XModal
      width="70%"
      height="80%"
      name="allsoftware"
      :showCrossBtn="true"
      title="全部使用软件"
      @opened="opened"
    >
      <div class="modal_content" v-loading="loading">
        <el-table
          :data="tableData"
          border
          style="width: 100%; margin-bottom: 5px"
          row-key="rid"
          :header-cell-style="attenceHeaderStyle"
          :tree-props="{ children: 'Form', hasChildren: 'hasChildren' }"
        >
          >
          <el-table-column
            prop="pname"
            label="程序名"
            width="170"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="Key" label="窗口名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="window_key" @click="handleWindowKey(scope.row)">{{
                scope.row.Key
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stay" label="停留时间">
            <template slot-scope="scope">
              {{ scope.row.stay.toFixed(1) }}分钟
            </template>
          </el-table-column>
          <el-table-column prop="mc" label="鼠标点击次数">
            <template slot-scope="scope">
              <span v-if="!scope.row.haschil">{{ scope.row.mc }}次</span>
            </template>
          </el-table-column>
          <el-table-column prop="mm" label="鼠标移动次数">
            <template slot-scope="scope">
              <span v-if="!scope.row.haschil">{{ scope.row.mm }}次</span>
            </template>
          </el-table-column>
          <el-table-column prop="kc" label="键盘输入次数">
            <template slot-scope="scope">
              <span v-if="!scope.row.haschil">{{ scope.row.kc }}次</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.pageIndex"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="pageData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.totalNum"
        >
        </el-pagination>
      </div>
    </XModal>
    <progresscom
      :name="'allfoftwarepic'"
      :activeBar="selRow"
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
    teamValue: {
      type: Number,
      default: null,
    },
    //开始的日期
    stime: {
      type: String,
      default: null,
    },
    //结束的日期
    etime: {
      type: String | Date,
      default: null,
    },
    //用户id
    uid: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      pageData: {
        pageIndex: 1,
        pageSize: 20,
        totalNum: 0,
      }, //分页
      loading: false,
      tableData: [], //软件表格数据
      selRow: null, //选择的窗口
    };
  },
  methods: {
    handleWindowKey(row) {
      this.selRow = {
        name: row.Key,
      };
      this.$modal.show("allfoftwarepic");
    },
    /**
     * 打开弹窗回调
     */
    opened() {
      this.$nextTick(() => {
        this.getAllData();
      });
    },
    /**
     * 获取全部软件数据
     */
    getAllData() {
      const data = {
        p: this.pageData.pageIndex,
        c: this.pageData.pageSize,
        stime: this.stime,
        etime: this.etime,
        u: this.uid,
        teamId: this.teamValue,
      };
      this.loading = true;
      this.$http
        .get("/Teams/MemberJob/AppDetails.ashx", {
          params: data,
        })
        .then((resp) => {
          if (resp.res == 0) {
            if (resp.data && resp.data.data.length) {
              //树形表格添加id
              resp.data.data.forEach((e, index) => {
                e.haschil = true;
                e.rid = index + 1;
                if (e.Form && e.Form.length) {
                  e.Form.forEach((s, ind) => {
                    s.rid = `${index + 1}-${ind}`;
                  });
                }
              });
            }
            this.tableData = resp.data.data;
            this.pageData.totalNum = resp.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
    /**
     * 每页条数改变
     */
    handleSizeChange(val) {
      this.pageData.pageSize = val;
      this.pageData.pageIndex = 1;
      this.getAllData();
    },
    /**
     * 页数改变
     */
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getAllData();
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
.allsoftware {
  /deep/.ctn {
    overflow-y: auto;
    padding-bottom: 10px;
  }
  .modal_content {
    padding: 0 5px;
    height: 100%;
    /deep/.el-table {
      font-size: 13px;
      height: calc(100% - 32px);
      overflow: auto;
      th,
      td {
        padding: 8px 0;
      }
      .window_key {
        cursor: pointer;
      }
    }
  }
}
</style>
