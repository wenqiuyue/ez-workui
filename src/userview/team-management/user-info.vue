<template>
  <div class="user-info">
    <XModal name="userInfo" width="40%" height="77%">
      <CWinTmp :indexData="indexData" v-loading="loading">
        <div slot="form" class="info_content">
          <el-row>
            <el-col :span="24"
              ><div class="user_pic">
                <el-avatar
                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                ></el-avatar>
                <span class="name">文秋月</span>
              </div></el-col
            >

            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">用户账户：</span>
                文秋月
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">用户昵称：</span>
                文秋月
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">用户密码：</span>
                123123
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">性别：</span>
                女
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">角色：</span>
                管理员
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">用户属性：</span>
                属性
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">邮箱：</span>
                1402472721@qq.com
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">联系方式：</span>
                15802120322
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">注册时间：</span>
                2021-6-24 16:49
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">上次登录：</span>
                2021-6-24 16:49
              </div></el-col
            >
            <el-col :span="24"
              ><div class="info_list">
                <span class="info_lable">可见成员：</span>
                <div>
                  <ul class="mem-imgs">
                    <li v-for="(item, index) in 10" :key="index">
                      <el-avatar
                        size="medium"
                        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                      ></el-avatar>
                      <p>文秋月</p>
                    </li>
                  </ul>
                </div>
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
        name: "成员详情",
        xModalName: "userInfo",
      },
    };
  },
};
</script>
<style lang="less" scoped>
.user-info {
  .info_content {
    .user_pic {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      .el-avatar {
        width: 100px;
        height: 100px;
      }
      .name {
        font-weight: bold;
        font-size: 28px;
        color: #303133;
        margin-left: 12px;
      }
    }
    .info_list {
      line-height: 46px;
      font-size: 14px;
      .info_lable {
        width: 100px;
      }
      .mem-imgs {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        align-items: center;
        line-height: 20px;
        li {
          margin: 0 2.3rem 1rem 0;
        }
      }
    }
  }
}
</style>
