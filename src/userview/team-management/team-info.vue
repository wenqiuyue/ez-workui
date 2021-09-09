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
          <div class="info_form" v-if="infoData">
            <ul style="padding: 0 15px">
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
              <li>
                <span class="lable">存储量：</span>
                <span
                  >{{
                    infoData.Teamdata.OrderData.StorageLimits
                      ? infoData.Teamdata.OrderData.StorageLimits
                      : 0
                  }}M</span
                >
              </li>
              <li class="set_rule">
                <span class="lable"
                  >应用的设置：{{
                    infoData.Teamdata.TeamConfigName
                      ? infoData.Teamdata.TeamConfigName
                      : "无"
                  }}</span
                >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-setting"
                  v-if="infoData && infoData.Teamdata.UserMemberMType == 2"
                  @click="$emit('handleViewChange', 3)"
                  >设置</el-button
                >
              </li>
              <li class="num_row">
                <p>
                  <span class="lable">团队号：</span>
                  <span>{{
                    infoData.Teamdata.Code ? infoData.Teamdata.Code : "无"
                  }}</span>
                </p>
                <p class="tips" v-if="setOne">用户可通过团队号加入团队</p>
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
            </ul>
            <div v-if="infoData.Teamdata.UserMemberMType == 2" class="card_li">
              <ul>
                <li class="card_title"><span>设置</span></li>
                <li class="set_row">
                  <span>可否开启摄像头截图</span>
                  <el-switch v-model="setFour" @change="changeSet"> </el-switch>
                </li>
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
                <li>
                  <p class="set_row">
                    <span>是否开启预警</span>
                    <el-switch v-model="setFive" @change="changeSetAddress">
                    </el-switch>
                  </p>
                  <p v-if="setFive">
                    <el-input
                      v-for="(eitem, eind) in addressArray"
                      :key="eind"
                      class="set_input email_input"
                      v-model="eitem.inputVal"
                      :placeholder="`接收邮箱 ${numChange(eind + 1)}`"
                      ><el-button
                        slot="append"
                        icon="el-icon-delete"
                        @click="delAddress(eind)"
                      ></el-button
                    ></el-input>
                  </p>
                  <p class="email_input_btn" v-if="setFive">
                    <el-button
                      type="text"
                      icon="el-icon-success"
                      size="small"
                      @click="changeSet"
                      >保存</el-button
                    >
                    <el-button
                      type="text"
                      icon="el-icon-circle-plus"
                      @click="addAddress"
                      size="small"
                      >添加邮箱</el-button
                    >
                  </p>
                </li>
              </ul>
            </div>
            <div class="card_li" v-if="infoData.DataClearSeting">
              <ul>
                <li class="card_title">
                  <span>团队数据库清理</span
                  ><el-button
                    type="text"
                    v-if="infoData.Teamdata.UserMemberMType == 2"
                    @click="handleDataClearSeting"
                    >设置</el-button
                  >
                </li>
                <li class="set_row">
                  <span
                    >清除类型：{{
                      $D.ITEM("DBCS_Type", infoData.DataClearSeting.Type).key
                    }}</span
                  >
                </li>
                <li class="set_row" v-if="infoData.DataClearSeting.Type == 2">
                  <span
                    >执行时间：

                    <label v-if="infoData.DataClearSeting.TimeLoopType == 3">
                      每隔
                      {{
                        infoData.DataClearSeting.Time1
                          ? `${infoData.DataClearSeting.Time1}月`
                          : ""
                      }}的{{
                        infoData.DataClearSeting.Time2
                          ? `${infoData.DataClearSeting.Time2}号`
                          : ""
                      }}</label
                    ><label v-if="infoData.DataClearSeting.TimeLoopType == 2">
                      每隔
                      {{
                        infoData.DataClearSeting.Time1
                          ? `${infoData.DataClearSeting.Time1}周`
                          : ""
                      }}的
                      {{
                        infoData.DataClearSeting.Time2
                          ? `周${infoData.DataClearSeting.Time2}`
                          : ""
                      }}</label
                    ><label v-if="infoData.DataClearSeting.TimeLoopType == 1">{{
                      $D.ITEM(
                        "DBCS_TimeLoopType",
                        infoData.DataClearSeting.TimeLoopType
                      ).key
                    }}</label></span
                  >
                </li>
                <li class="set_row" v-if="infoData.DataClearSeting.Type == 3">
                  <span>存储量：{{ infoData.DataClearSeting.Storage }}M</span>
                </li>
                <li class="set_row" v-if="infoData.DataClearSeting.Type != 1">
                  <span
                    >清理模式：<label
                      v-if="infoData.DataClearSeting.ClearType == 1"
                      >删除{{
                        infoData.DataClearSeting.ClearTotalDay
                      }}天之前的数据</label
                    ><label v-else>{{
                      $D.ITEM(
                        "DBCS_ClearType",
                        infoData.DataClearSeting.ClearType
                      ).key
                    }}</label></span
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="invi_btn">
            <el-button
              type="primary"
              style="width: 100%"
              size="medium"
              @click="handleInvit"
              >邀请成员加入</el-button
            >
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
    <!-- 清除团队数据库数据 -->
    <InitdataModal
      :teamVal="selRow.Id"
      :dataClear="
        infoData && infoData.DataClearSeting ? infoData.DataClearSeting : null
      "
      @success="getData"
    ></InitdataModal>
  </div>
</template>
<script>
import { imgChange, numChange } from "@/commons";
export default {
  components: {
    InvitationList: () => import("./invitation-list"),
    InvitationUser: () => import("./invitation-user"),
    AddTeam: () => import("./add-team"),
    InitdataModal: () => import("./initdata-modal"),
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
      setFour: false,
      setFive: false,
      passwordVal: null, //口令
      addressArray: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    imgChange,
    numChange,
    /**
     * 删除某一个邮箱
     */
    delAddress(ind) {
      this.addressArray = this.addressArray.filter((m, index) => ind != index);
    },
    /**
     * 添加预警接收的邮箱
     */
    addAddress() {
      this.addressArray.push({
        inputVal: null,
      });
    },
    /**
     * 团队数据库清理设置
     */
    handleDataClearSeting() {
      this.$modal.show("initdata");
    },
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
     * 设置预警邮箱
     */
    changeSetAddress() {
      if (!this.setFive) {
        this.addressArray = [];
        this.changeSet();
      } else {
        this.addressArray.push({
          inputVal: null,
        });
      }
    },
    /**
     * 详情设置
     */
    changeSet() {
      const address = this.addressArray.filter((m) => m.inputVal);
      const data = {
        teamId: this.selRow.Id,
        IsTeamCode: this.setOne ? 1 : 0,
        IsAgree: this.setTwo ? 1 : 0,
        IsInvitationCode: this.setThree ? 1 : 0,
        InvitationCode: this.passwordVal,
        IsStartCamera: this.setFour ? 1 : 0,
        IsWarn: this.setFive,
        WarnEmail: address.map((m) => m.inputVal),
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
            this.setFour =
              this.infoData.Teamdata.IsStartCamera == 1 ? true : false;
            this.setFive = this.infoData.Teamdata.IsWarn;
            this.addressArray =
              this.infoData.Teamdata.WarnEmails &&
              this.infoData.Teamdata.WarnEmails.length
                ? this.infoData.Teamdata.WarnEmails.map((m) => {
                    return {
                      inputVal: m,
                    };
                  })
                : [];
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style lang="less" scoped>
.team-info {
  // margin-top: 10px;
  height: calc(100% - 80px);
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
    position: relative;
    .info_img {
      text-align: center;
      .el-avatar {
        width: 120px;
        height: 120px;
      }
    }
    .info_form {
      height: calc(100% - 98px);
      overflow-y: scroll;
      margin-top: 12px;

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
        .set_rule {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
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
        .email_input {
          margin-bottom: 8px;
          /deep/.el-input-group__append {
            .el-button {
              color: #f56c6c;
              background: #fef0f0;
              border-radius: 0 4px 4px 0;
              padding: 10px 20px;
            }
          }
        }
        .email_input_btn {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          .el-button {
            padding: 3px 0 8px 0;
          }
        }
      }
      .card_li {
        padding: 0 5px;
        margin-bottom: 10px;
        ul {
          border: 1px solid #e4e7ed;
          padding: 10px 10px 0;
          border-radius: 4px;
          .card_title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
              font-weight: bold;
              font-size: 13px;
            }
            button {
              padding: 0;
              font-size: 13px;
            }
          }
        }
      }
    }
    .invi_btn {
      padding: 0 10px;
      position: absolute;
      bottom: 10px;
      width: 100%;
    }
  }
}
</style>
