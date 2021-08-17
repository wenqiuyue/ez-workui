<template>
  <!-- 菜单 -->
  <div id="manager-label">
    <c-content v-loading="loading">
      <div slot="search" class="screen">
        <div class="screen_left"></div>
        <div class="screen_right">
          <el-button type="primary" @click="addClick" size="medium"
            >添加</el-button
          >
        </div>
      </div>
      <!-- 主体表格部分 -->
      <el-table
        slot="main"
        :data="tableData"
        ref="multipleTable"
        style="width: 100%"
        :cell-style="cellStyle"
        :header-cell-style="cellStyle"
      >
        <template slot="empty" style="font-size: 0">
          <!-- <p>暂无内容</p> -->
          <div style="height: 100%">
            <img
              src="@/assets/img/emptyData.png"
              style="display: inline-block; width: 50%; margin-top: 100px"
            />
          </div>
        </template>

        <el-table-column
          label="部门名称"
          :show-overflow-tooltip="true"
          prop="Name"
        >
        </el-table-column>
        <el-table-column label="创建时间" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{
              scope.row.CreatTime
                ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- fixed  -->
          <template slot-scope="scope">
            <span>
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleDelt(scope.row)"
                >删除</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <c-pages
        slot="pages"
        v-model="pageData"
        @changeEvent="handlePage"
      ></c-pages>
    </c-content>

    <LabelW
      :teamValue="teamValue"
      :selRow="selRow"
      :indexData="indexData"
      ref="proGroupWindow"
      @eventComfirm="getDataList"
    ></LabelW>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    CContent: () => import("@/components/CContent"),

    CPages: () => import("@/components/CPages"),
    LabelW: () => import("./proGroupW"),
  },
  props: {
    //规则版本信息
    selRow: {
      type: Object,
      default: null,
    },
    teamValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    "#main";
    return {
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },

      tableData: [],
      searchKW: "",
      multipleSelection: "",
      indexData: {
        type: "", // Add Edit
        name: "",
        departmentCode: "",
      },
      cellStyle: {
        textAlign: "center",
      },
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    imgChange,
    handleChange() {
      this.pageData.pageIndex = 1;
      this.getDataList();
    },
    /**
     * 分页
     */
    handlePage(val) {
      this.pageData = val;
      this.getDataList();
    },
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此进程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: [row.Id],
            teamId: this.teamValue,
          };
          this.comDelete(params);
        })
        .catch(() => {});
    },
    comDelete(params) {
      this.$http
        .post("/ProgressGroup/DelProgressGroup.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success",
            });
            this.getDataList();
          }
        });
    },

    // 新增
    addClick() {
      this.openWin("ad");
    },
    // 编辑
    handleEdit(row) {
      this.openWin("ed", row.Id, row.Name);
    },
    // 打开窗口
    openWin(ty, code, proName) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加部门" : "编辑部门",
        departmentCode: code,
        proName: proName,
        xModalName: "proGroupWindow",
      };
      this.$modal.show("proGroupWindow");
      this.$nextTick(() => {
        this.$refs.proGroupWindow.changeEditState();
      });
    },
    // 分页
    getDataList() {
      let params = {
        name: this.searchKW,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        teamId: this.teamValue,
        configId: this.selRow.Id,
      };
      this.loading = true;
      this.$http
        .post("/ProgressGroup/QueryProgressGroupList.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            console.log(result);
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
            this.loading = false;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.member-style {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  li {
    display: flex;
    width: 33%;
    margin-bottom: 1rem;
    // margin-right: 1rem;
    align-items: center;
    // justify-content: space-between;
    position: relative;

    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    span {
      color: #333;
      margin-right: 2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    i {
      width: 1px;
      height: 70%;
      background: #ddd;
      position: absolute;
      right: 20%;
      top: 3px;
    }
  }
}
#manager-label {
  height: 100%;
  box-sizing: border-box;
  .screen {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .screen_left {
      .lable {
        font-weight: 700;
        font-size: 1.4rem;
        margin-right: 5px;
      }
    }
  }
}
</style>
