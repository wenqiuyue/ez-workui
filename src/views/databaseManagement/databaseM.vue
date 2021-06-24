<template>
  <div class="databaseM">
    <XModal name="databaseM" width="40%" height="70%">
      <CWinTmp :indexData="indexData" v-loading="loading">
        <div slot="form" class="info_content">
          <el-row>
            <el-col :span="24"
              ><div class="info_list">
                <span class="info_lable">版本名称：</span>
                XXX版本
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">提交人：</span>
                文秋月
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">提交时间：</span>
                2021-05-21 12:21
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">已完成更新：</span>
                200人
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">未完成更新：</span>
                200人
              </div></el-col
            >
            <el-col :span="24"
              ><div class="info_list text">
                <span class="info_lable">更新内容：</span>
                <p>
                  我们建议使用 CDN 引入 Element
                  的用户在链接地址上锁定版本，以免将来 Element
                  升级时受到非兼容性更新的影响。锁定版本的方法请查看 unpkg.com。
                </p>
              </div></el-col
            >
          </el-row>
        </div>
      </CWinTmp>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    CWinTmp: () => import("@/components/CWinTmp"),
  },
  data() {
    return {
      loading: false,
      visible: false,
      data: null,
      indexData: {
        type: "",
        name: "数据库详情",
        xModalName: "databaseM",
      },
    };
  },
};
</script>
<style lang="less" scoped>
.databaseM {
  .info_content {
    .info_list {
      line-height: 46px;
      font-size: 14px;
      .info_lable {
        width: 100px;
      }
    }
    .text {
      line-height: 30px;
      p {
        text-indent: 2rem;
      }
    }
  }
}
</style>
