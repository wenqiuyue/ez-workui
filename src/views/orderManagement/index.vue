<template>
  <div id="orderManagement" v-loading="loading">
    <Header
      title="订单管理"
      titleEnglish="Order Management"
      class="baseHeader"
    />
    <CContent>
      <template #search>
        <CTitle :TInfo="titleInfo" @addClick="handleAdd" />
      </template>
      <template #main>
        <el-table :data="tableData" stripe>
          <el-table-column label="用户ID" />
          <el-table-column label="角色ID" />
          <el-table-column label="版本ID" />
          <el-table-column label="订单编码(支付宝交易号)" />
          <el-table-column label="付款账号(买家支付宝号)" />
          <el-table-column label="订单总交易金额" />
          <el-table-column label="收款账号" />
          <el-table-column label="支付状态" />
          <el-table-column label="创建时间" />
          <el-table-column label="支付时间时间" />
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope)">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @eventComfirm="handlePaginationChange" />
      </template>
    </CContent>
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
  },
  data: () => ({
    loading: false,
    tableData: [],
    titleInfo: {
      btnShow: [
        { type: "addBtn", ishow: true },
        { type: "startBtn", ishow: false, disabled: true },
        { type: "closeBtn", ishow: false, disabled: true },
        { type: "delBtn", ishow: false, disabled: true },
      ],
      dropDown: {
        searchInput: {
          placeholder: "请输入订单名称",
        },
      },
    },
    pageData: {
      pageIndex: 1,
      pageSize: 10,
      totalNum: 0,
    },
  }),
  methods: {
    async handleAdd() {
      console.log("handleAdd");
    },
    async handlePaginationChange(...a) {
      console.log(a);
    },
    handleView(...a) {
        console.log(a)
    }
  },
};
</script>

<style lang="less" scoped>
#orderManagement {
  height: 100%;
}
</style>