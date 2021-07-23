<template>
  <div class="team-info">
    <el-row :gutter="20">
      <!-- 左边 -->
      <el-col :span="7"
        ><div class="info_left" v-loading="loading">
          <h3 class="info-title">
            <span>团队信息</span
            ><el-button
              type="text"
              @click="handleEditTeam"
              v-if="infoData && infoData.Teamdata.UserMemberMType == 2"
              >编辑团队基础信息</el-button
            >
          </h3>
          <!-- <div class="info_img">
            <el-avatar
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            ></el-avatar>
          </div> -->
          <div class="info_form" v-if="infoData">
            <ul>
              <li>
                <span class="lable">团队名称：</span>
                <span>{{ infoData.Teamdata.Name }}</span>
              </li>
              <li>
                <span class="lable">当前人数：</span>
                <span
                  >{{
                    infoData.Membersdata && infoData.Membersdata.length
                      ? infoData.Membersdata.length
                      : 0
                  }}人</span
                >
              </li>
              <li class="img_row">
                <span class="lable">创建人：</span>
                <span class="number">
                  <el-avatar
                    size="small"
                    :src="imgChange(infoData.Teamdata.UserPicture, true)"
                  ></el-avatar>
                  <span>{{ infoData.Teamdata.UserName }}</span>
                </span>
              </li>
              <li class="img_row_list">
                <span class="lable">管理员：</span>
                <div
                  class="number_list"
                  v-if="infoData.Membersdata && infoData.Membersdata.length"
                >
                  <span
                    v-for="(item, index) in infoData.Membersdata"
                    :key="index"
                  >
                    <span class="number" v-if="item.MType == 2">
                      <el-avatar
                        size="small"
                        :src="imgChange(item.Picture, true)"
                      ></el-avatar>
                      <span>{{ item.Name }}</span>
                    </span>
                  </span>
                </div>
                <div v-else>无</div>
              </li>
              <li>
                <span class="lable">创建时间：</span>
                <span>{{
                  infoData.Teamdata.CreateTime
                    ? infoData.Teamdata.CreateTime.timeFormat(
                        "yyyy-MM-dd HH:mm"
                      )
                    : "无"
                }}</span>
              </li>
              <li v-if="infoData.Teamdata.ExpireTime">
                <span class="lable">过期时间：</span>
                <span>{{
                  infoData.Teamdata.ExpireTime
                    ? infoData.Teamdata.ExpireTime.timeFormat("yyyy-MM-dd")
                    : "无"
                }}</span>
              </li>
              <li v-if="infoData.Teamdata.Describe">
                <span class="lable">团队描述：</span>
                <span>{{
                  infoData.Teamdata.Describe ? infoData.Teamdata.Describe : "无"
                }}</span>
              </li>
              <li>
                <span class="lable">成员是否可以添加成员：</span>
                <span>{{
                  infoData.Teamdata.IsAgree == 1 ? "允许" : "禁止"
                }}</span>
              </li>
              <li class="num_row">
                <p>
                  <span class="lable">团队号：</span>
                  <span>{{
                    infoData.Teamdata.Code ? infoData.Teamdata.Code : "无"
                  }}</span>
                </p>
                <p class="tips">用户可通过团队号加入团队</p>
                <p
                  style="margin-top: 5px"
                  v-if="
                    infoData.Teamdata.UserMemberMType == 1 &&
                    infoData.Teamdata.InvitationCode
                  "
                >
                  <span class="lable">邀请口令：</span>
                  <span>{{
                    infoData.Teamdata.InvitationCode
                      ? infoData.Teamdata.InvitationCode
                      : "无"
                  }}</span>
                </p>
              </li>
              <template v-if="infoData.Teamdata.UserMemberMType == 2">
                <li><span class="lable">设置：</span></li>
                <li class="set_row">
                  <span>可否通过团队号加入</span>
                  <el-switch v-model="setOne" @change="changeSet"> </el-switch>
                </li>
                <li class="set_row">
                  <span>成员可否邀请其他人加入</span>
                  <el-switch v-model="setTwo" @change="changeSet"> </el-switch>
                </li>
                <li>
                  <p class="set_row">
                    <span>是否设置邀请口令</span>
                    <el-switch v-model="setThree" @change="changeSetPass">
                    </el-switch>
                  </p>
                  <el-input
                    class="set_input"
                    v-if="setThree"
                    v-model="passwordVal"
                    placeholder="请输入邀请口令(按Enter键保存)"
                    @keyup.enter.native="changeSet"
                  ></el-input>
                </li>
              </template>
              <li style="margin-top: 32px">
                <el-button
                  type="primary"
                  style="width: 100%"
                  size="medium"
                  @click="handleInvit"
                  >邀请成员加入</el-button
                >
              </li>
            </ul>
          </div>
        </div></el-col
      >
      <!-- 右边 -->
      <el-col :span="17">
        <InvitationList
          :teamId="selRow.Id"
          :UserMemberMType="infoData ? infoData.Teamdata.UserMemberMType : null"
        ></InvitationList>
      </el-col>
    </el-row>
    <!-- 邀请成员 -->
    <InvitationUser :teamId="selRow.Id" :mName="'infoInvit'"></InvitationUser>
    <!-- 创建团队 -->
    <AddTeam
      @success="getData"
      :modalName="'editTeam'"
      :editData="infoData ? infoData.Teamdata : null"
    ></AddTeam>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    InvitationList: () => import("./invitation-list"),
    InvitationUser: () => import("./invitation-user"),
    AddTeam: () => import("./add-team"),
  },
  props: {
    //选择的团队
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      infoData: null, //详细信息

      loading: false,
      setOne: true,
      setTwo: true,
      setThree: false,
      passwordVal: null, //口令
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    imgChange,
    /**
     * 编辑团队信息
     */
    handleEditTeam() {
      this.$modal.show("editTeam");
    },
    /**
     * 邀请口令设置
     */
    changeSetPass() {
      if (!this.setThree) {
        this.passwordVal = null;
        this.changeSet();
      }
    },
    /**
     * 详情设置
     */
    changeSet() {
      const data = {
        teamId: this.selRow.Id,
        IsTeamCode: this.setOne ? 1 : 0,
        IsAgree: this.setTwo ? 1 : 0,
        IsInvitationCode: this.setThree ? 1 : 0,
        InvitationCode: this.passwordVal,
      };
      this.$http.post("/Teams/TeamSet.ashx", data).then((resp) => {
        if (resp.res == 0) {
          this.$message({
            message: "设置成功",
            type: "success",
          });
        }
      });
    },
    /**
     * 邀请成员
     */
    handleInvit() {
      this.$modal.show("infoInvit");
    },
    /**
     * 获取团队信息
     */
    getData() {
      this.loading = true;
      this.$http
        .get("/Teams/TeamManagementDetail.ashx", {
          params: { teamId: this.selRow.Id },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.infoData = resp.data;
            this.setOne = this.infoData.Teamdata.IsTeamCode == 1 ? true : false;
            this.setTwo = this.infoData.Teamdata.IsAgree == 1 ? true : false;
            this.setThree =
              this.infoData.Teamdata.IsInvitationCode == 1 ? true : false;
            this.passwordVal = this.infoData.Teamdata.InvitationCode;
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style lang="less" scoped>
.team-info {
  margin-top: 10px;
  height: calc(100% - 50px);
  .el-row {
    height: 100%;
  }
  .el-col-7,
  .el-col-17 {
    height: 100%;
    padding-bottom: 10px;
  }
  .info_left {
    height: 100%;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    .info-title {
      padding: 0 10px;
      line-height: 4rem;
      font-weight: bold;
      font-size: 14px;
      color: #606266;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .info_left {
    overflow-y: scroll;
    .info_img {
      text-align: center;
      .el-avatar {
        width: 120px;
        height: 120px;
      }
    }
    .info_form {
      margin-top: 12px;
      padding: 0 15px;
      ul {
        li {
          margin-bottom: 12px;
          font-size: 14px;
          color: #303133;
          .lable {
            // width: 80px;
            display: inline-block;
            color: #000000;
            margin-right: 5px;
          }
        }
        .img_row {
          display: flex;
          align-items: center;
          .number {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 10px;
            span {
              margin-top: 2px;
              font-size: 12px;
            }
          }
        }
        .img_row_list {
          display: flex;
          flex-direction: row;
          .number_list {
            width: calc(100% - 80px);
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .number {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-right: 10px;
              margin-bottom: 5px;
              span {
                margin-top: 2px;
                font-size: 12px;
              }
            }
          }
        }
        .num_row {
          .tips {
            font-size: 12px;
            color: #e6a23c;
          }
        }
        .set_row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .set_input {
          /deep/.el-input__inner {
            height: 34px;
            line-height: 34px;
          }
        }
      }
    }
  }
}
</style>
