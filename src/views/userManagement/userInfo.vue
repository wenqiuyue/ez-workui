<template>
  <div class="userInfo">
    <XModal name="userInfo" width="40%" height="70%" @opened="opened">
      <CWinTmp :indexData="indexData" v-loading="loading">
        <div slot="form" class="info_content" v-if="userInfo">
          <el-row>
            <el-col :span="24"
              ><div class="user_pic">
                <el-avatar :src="imgChange(userInfo.Picture)"></el-avatar>
                <span class="name">{{ userInfo.Name }}</span>
              </div></el-col
            >

            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">用户账户：</span>
                {{ userInfo.UseName }}
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">用户昵称：</span>
                {{ userInfo.Name ? userInfo.Name : "无" }}
              </div></el-col
            >
            <!-- <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">用户密码：</span>
                {{ userInfo.Pwd }}
              </div></el-col
            > -->
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">性别：</span>
                {{ userInfo.Sex == 1 ? "男" : "女" }}
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">角色：</span>
                {{ userInfo.RoleName }}
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">邮箱：</span>
                {{ userInfo.addres }}
              </div></el-col
            ><el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">联系方式：</span>
                {{ userInfo.Phone ? userInfo.Phone : "无" }}
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">注册时间：</span>
                {{
                  userInfo.SignTime
                    ? userInfo.SignTime.timeFormat("yyyy-MM-dd HH:mm")
                    : ""
                }}
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">上次登录：</span>
                {{
                  userInfo.LastClientOnline
                    ? userInfo.LastClientOnline.timeFormat("yyyy-MM-dd HH:mm")
                    : "无"
                }}
              </div></el-col
            >
            <el-col :span="12"
              ><div class="info_list">
                <span class="info_lable">团队数量：</span>
                {{ userInfo.TeamCount }}
              </div></el-col
            >
          </el-row>
        </div>
      </CWinTmp>
    </XModal>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    CWinTmp: () => import("@/components/CWinTmp"),
  },
  props: {
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      indexData: {
        type: "",
        name: "成员详情",
        xModalName: "userInfo",
      },
      userInfo: null,
    };
  },
  methods: {
    imgChange,
    /**
     * 弹窗打开回调
     */
    opened() {
      this.$nextTick(() => {
        this.loading = true;
        this.$http
          .get("/Management/UserManagement/GetUserDetail.ashx", {
            params: { usId: this.selRow.UsId },
          })
          .then((resp) => {
            this.userInfo = resp.data;
          })
          .finally(() => (this.loading = false));
      });
    },
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
    }
  }
}
</style>
