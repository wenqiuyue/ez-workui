<template>
  <div class="userInfo">
    <XModal name="userInfo" width="40%" height="77%">
      <CWinTmp :indexData="indexData">
        <div slot="form" class="info_content" v-if="selUser">
          <el-row>
            <el-col :span="24"
              ><div class="user_pic">
                <el-avatar :src="$url + selUser.Picture"></el-avatar>
                <span class="name">{{ selUser.Name }}</span>
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">角色：</span>
                {{ selUser.MType == 1 ? "成员" : "管理人" }}
              </div></el-col
            >

            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">邮箱：</span>
                {{ selUser.addres }}
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">状态：</span>
                {{ $D.ITEM("g_status", selUser.Shape).name }}
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">注册时间：</span>
                {{
                  selUser.CreatTime
                    ? selUser.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
                    : "无"
                }}
              </div></el-col
            >
            <el-col :span="24"
              ><div class="info_list">
                <span class="info_lable">可见成员：</span>
                <div v-if="selUser.VisibleUser && selUser.VisibleUser.length">
                  <ul class="mem-imgs">
                    <li
                      v-for="(item, index) in selUser.VisibleUser"
                      :key="index"
                    >
                      <el-avatar
                        size="medium"
                        :src="$url + item.Picture"
                      ></el-avatar>
                      <p>{{ item.Name }}</p>
                    </li>
                  </ul>
                </div>
                <span v-else>无</span>
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
  props: {
    selUser: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
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
.userInfo {
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
