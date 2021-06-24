<template>
  <div id="editionManager" v-loading="loading">
    <Header
      title="版本管理"
      titleEnglish="Version  Management"
      class="baseHeader"
    />
    <CContent>
      <template #search>
        <CTitle
          :TInfo="titleInfo"
          @addClick="handleAdd"
          @searchClick="searchClick"
        />
      </template>
      <template #main>
        <el-table
          :data="tableData"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <el-table-column label="版本名称" prop="role" />
          <el-table-column label="创建时间" prop="date" sortable />
          <el-table-column label="时长" prop="time" sortable>
            <template slot-scope="scope"> {{ scope.row.time }}年 </template>
          </el-table-column>
          <el-table-column label="可加入人数" prop="num" sortable>
            <template slot-scope="scope"> {{ scope.row.num }}人 </template>
          </el-table-column>
          <el-table-column label="存储空间" prop="save" sortable
            ><template slot-scope="scope">
              {{ scope.row.save }}G
            </template></el-table-column
          >
          <el-table-column label="服务器地址" prop="m6"
            ><template slot-scope="scope">
              {{ scope.row.m6 }}
            </template></el-table-column
          >
          <el-table-column label="购买人数" prop="m7" sortable
            ><template slot-scope="scope">
              {{ scope.row.m7 }}人
            </template></el-table-column
          >
          <el-table-column label="价格" prop="m8" sortable
            ><template slot-scope="scope">
              {{ scope.row.m8 }}元
            </template></el-table-column
          >
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <c-btn>
                <span @click="handleView(scope.row)">编辑</span>
                <span @click="handleDel(scope.row)">删除</span>
              </c-btn>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @eventComfirm="handlePaginationChange" />
      </template>
    </CContent>
    <VersionModal
      :indexData="indexData"
      ref="versionModal"
      @eventComfirm="getDataList"
      :editObj="editObj"
    ></VersionModal>
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
    VersionModal: () => import("./versionModal"),
  },
  data: () => ({
    editObj: {},
    loading: false,
    cellStyle: {
      textAlign: "center",
    },
    indexData: {
      type: "", // Add Edit
      name: "",
      departmentCode: "",
    },
    tableData: [
      {
        date: "2016-05-03",
        role: "管理员",
        time: 2,
        num: 100,
        save: 500,
        m6: "192.168.1.20",
        m7: 128,
        m8: 999,
      },
      {
        date: "2016-05-03",
        role: "用户",
        time: 1,
        num: 100,
        save: 520,
        m6: "192.168.1.20",
        m7: 128,
        m8: 999,
      },
      {
        date: "2016-05-03",
        role: "用户",
        time: 2,
        num: 100,
        save: 500,
        m6: "192.168.1.20",
        m7: 128,
        m8: 919,
      },
      {
        date: "2016-05-04",
        role: "超级管理员",
        time: 23,
        num: 200,
        save: 500,
        m6: "192.168.1.20",
        m7: 128,
        m8: 999,
      },
    ],
    titleInfo: {
      btnShow: [
        { type: "addBtn", ishow: true },
        { type: "startBtn", ishow: false, disabled: true },
        { type: "closeBtn", ishow: false, disabled: true },
        { type: "delBtn", ishow: false, disabled: true },
      ],
      dropDown: {
        searchInput: {
          placeholder: "请输入版本名称",
        },
      },
    },
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
    isAdd: true, //是否是添加类型
  }),
  methods: {
    /**
     * 获取列表数据
     */
    getDataList() {},
    // 打开窗口
    openWin(ty, code, obj) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加版本" : "编辑版本",
        vacationCode: code,
        xModalName: "versionModal",
      };
      if (ty == "ed") {
        this.editObj = obj;
      } else {
        this.editObj = {};
      }
      this.$modal.show("versionModal");
      this.$nextTick(() => {
        this.$refs.versionModal.changeEditState();
      });
    },
    /**
     * 添加
     */
    handleAdd() {
      this.openWin("ad");
    },
    async handlePaginationChange(...a) {
      console.log(a);
    },
    /**
     * 删除
     */
    handleDel(row) {
      console.log(row);
      this.$confirm("此操作将删除该版本, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 搜索
     */
    searchClick(val) {
      console.log(val);
    },
    /**
     * 编辑
     */
    handleView(row) {
      this.openWin("ed", row.Id, row);
    },
  },
};
</script>

<style lang="less" scoped>
#editionManager {
  height: 100%;
}
</style>
