<template>
  <div class="userInfo">
    <XModal name="userInfo" width="40%" height="77%" @opened="opened">
      <CWinTmp
        ref="cwtinfo"
        :indexData="indexData"
        @editClick="editClick"
        @comfirmClick="comSubmit"
        v-model="editState"
      >
        <div slot="form" class="info_content" v-if="selUser">
          <el-row>
            <el-col :span="24"
              ><div class="user_pic">
                <el-avatar :src="imgChange(selUser.Picture, true)"></el-avatar>
                <span class="name">{{ selUser.Name }}</span>
              </div></el-col
            >
            <el-col :span="12" v-if="!editState"
              ><div class="info_list">
                <span class="info_lable">角色：</span>
                {{ selUser.MType == 1 ? "成员" : "管理人" }}
              </div></el-col
            >
            <el-col :span="12" v-if="!editState"
              ><div class="info_list">
                <span class="info_lable">邮箱：</span>
                {{ selUser.addres }}
              </div></el-col
            ><el-col :span="12" v-if="!editState"
              ><div class="info_list">
                <span class="info_lable">状态：</span>
                {{ selUser.Shape | getShape }}
              </div></el-col
            >
            <el-col :span="12" v-if="!editState"
              ><div class="info_list">
                <span class="info_lable">进程组：</span>
                {{
                  selUser.ProgressGroupName ? selUser.ProgressGroupName : "无"
                }}
              </div></el-col
            >
            <el-col :span="12" v-if="!editState"
              ><div class="info_list">
                <span class="info_lable">进程组状态：</span>
                {{ selUser.IsGNameStatus ? "可用" : "不可用" }}
              </div></el-col
            >
            <el-col :span="12" v-if="!editState"
              ><div class="info_list">
                <span class="info_lable">注册时间：</span>
                {{
                  selUser.CreatTime
                    ? selUser.CreatTime.timeFormat("yyyy-MM-dd HH:mm")
                    : "无"
                }}
              </div></el-col
            >
            <el-col :span="24" v-if="!editState"
              ><div class="info_list">
                <span class="info_lable">可见成员：</span>
                <span v-if="selUser.MType == 2 && !selUser.VisibleUser.length"
                  >全部成员</span
                >
                <div
                  v-else-if="selUser.VisibleUser && selUser.VisibleUser.length"
                >
                  <ul class="mem-imgs">
                    <li
                      v-for="(item, index) in selUser.VisibleUser"
                      :key="index"
                    >
                      <el-avatar
                        size="medium"
                        :src="imgChange(item.Picture, true)"
                      ></el-avatar>
                      <p>{{ item.Name }}</p>
                    </li>
                  </ul>
                </div>
                <span v-else>无</span>
              </div></el-col
            >
            <el-col :span="12" v-if="editState && !selUser.IsSystem"
              ><div class="info_list">
                <span class="info_lable">角色：</span>
                <el-radio-group v-model="formData.mType">
                  <el-radio :label="1">成员</el-radio>
                  <el-radio :label="2">管理人</el-radio>
                </el-radio-group>
              </div></el-col
            >
            <el-col :span="12" v-if="editState"
              ><div class="info_list">
                <span class="info_lable">进程组：</span>
                <el-select
                  v-model="formData.progroup"
                  placeholder="请选择进程组"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.Id"
                    :label="item.Name"
                    :value="item.Id"
                  >
                  </el-option>
                </el-select></div
            ></el-col>
            <el-col :span="24" v-if="editState"
              ><div class="info_list edit">
                <span class="info_lable">可见成员：</span>
                <mb
                  @Confirm="getUser"
                  :arrays="formData.visible"
                  :teamId="teamId"
                ></mb></div
            ></el-col>
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
    mb: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  props: {
    selUser: {
      type: Object,
      default: null,
    },
    teamId: {
      type: Number,
      default: null,
    },
    userMemberMType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      options: [],
      editState: false,
      indexData: {
        type: "",
        name: "成员详情",
        xModalName: "userInfo",
      },
      formData: {
        Id: null,
        visible: [],
        mType: null,
        progroup: null,
      },
    };
  },
  filters: {
    getShape(val) {
      if (val == 1) {
        return "正常";
      } else if (val == 0) {
        return "禁用";
      } else {
        return "删除";
      }
    },
  },
  methods: {
    imgChange,
    // 获取进程组
    getDataList() {
      let params = {
        teamId: this.teamId,
        configId: null,
      };
      this.$http
        .post("/User/GetProgressGroupSelected.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.options = result.data;
          }
        });
    },
    /**
     * 编辑
     */
    comSubmit() {
      this.$refs.cwtinfo.toggleComfirm();
      const data = {
        Id: this.formData.id,
        visibleUsId: this.formData.visible.map((m) => m.UsId),
        mType: this.formData.mType,
        progressgroupId: this.formData.progroup,
      };
      this.$http.post("/Teams/EditMember.ashx", data).then((resp) => {
        if (resp.res == 0) {
          this.$message({
            type: "success",
            message: "编辑成功!",
          });
          this.$modal.hide("userInfo");
          this.$emit("success");
        }
      });
    },
    /**
     * 弹窗打开回调
     */
    opened() {
      this.$nextTick(() => {
        if (this.userMemberMType == 2) {
          this.indexData.type = "Edit";
        } else {
          this.indexData.type = "";
        }
      });
      this.editState = false;
      this.getDataList();
    },
    editClick() {
      if (this.editState === true) this.changeEditState();
    },
    // 改变窗口状态的，搭配index页 添加和编辑按钮
    changeEditState() {
      if (this.selUser) {
        this.formData.id = this.selUser.Id;
        this.formData.visible = this.selUser.VisibleUser.map((m) => {
          return {
            UsId: m.UserId,
            Name: m.Name,
            Picture: m.Picture,
          };
        });
        this.formData.mType = this.selUser.MType;
        this.formData.progroup = this.selUser.ProgressGroupName;
      }
    },
    getUser(val) {
      this.formData.visible = val;
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
      display: flex;
      flex-direction: row;
      align-items: center;
      .info_lable {
        // width: 100px;
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
    /deep/.edit {
      .avatar_medium img {
        width: 3.3rem;
        height: 3.3rem;
      }
      .mem-add {
        display: flex !important;
      }
    }
  }
}
</style>
