<template>
  <div id="profile">
    <Header
      title="个人信息"
      titleEnglish="Personal Information"
      class="baseHeader"
    ></Header>
    <div class="container">
      <div class="warp-left" v-loading="loading" v-show="!isEdit">
        <div class="head" v-if="user">
          <img :src="imgChange(user.Picture, true)" />
        </div>
        <div class="title">我的信息</div>
        <el-form label-width="100px" class="look" v-if="user">
          <el-form-item label="账户">{{ user.UseName }}</el-form-item>
          <el-form-item label="昵称">{{
            user.Name ? user.Name : "无"
          }}</el-form-item>
          <el-form-item
            label="角色"
            v-if="user.RoleName.filter((m) => m != '用户').length"
            ><span
              v-for="(role, index) in user.RoleName.filter((m) => m != '用户')"
              :key="index"
              >{{ index == 0 ? role : `、role` }}</span
            ></el-form-item
          >
          <el-form-item label="性别" v-if="user.Sex">{{
            user.Sex == 1 ? "男" : "女"
          }}</el-form-item>
          <el-form-item label="邮箱地址">{{ user.addres }}</el-form-item>
          <el-form-item label="联系方式">{{
            user.Phone ? user.Phone : "无"
          }}</el-form-item>
          <el-form-item label="当前团队" v-if="nowTeam && nowTeam.length"
            ><el-tag size="small">{{ nowTeam[0].Name }}</el-tag></el-form-item
          >
          <el-form-item label="团队数量">{{ user.TeamCount }}</el-form-item>
          <el-form-item label="注册时间">{{
            user.SignTime
              ? user.SignTime.timeFormat("yyyy-MM-dd HH:mm:ss")
              : "--"
          }}</el-form-item>
          <el-form-item label="上次登录时间">{{
            user.LastClientOnline
              ? user.LastClientOnline.timeFormat("yyyy-MM-dd HH:mm:ss")
              : "--"
          }}</el-form-item>
          <el-form-item
            ><el-button type="primary" @click="handleEdit" class="update"
              >修改</el-button
            ></el-form-item
          >
        </el-form>
      </div>
      <div class="warp-left" v-show="isEdit">
        <div class="head">
          <img :src="editImg(form.Picture)" />
          <div>
            <el-upload
              class="upload-demo"
              :show-file-list="false"
              action="#"
              :auto-upload="false"
              :on-change="changeUpload"
            >
              <span class="upload-btn">上传头像</span>
            </el-upload>
            <div class="default button" @click="useDefalut">
              <span class="default-btn">使用默认头像</span>
            </div>
          </div>
        </div>
        <div class="title">我的信息</div>
        <el-form
          label-width="80px"
          :model="form"
          :rules="RULES"
          ref="ruleForm"
          class="edit"
        >
          <el-form-item label="账号" prop="UseName"
            ><el-input v-model="form.UseName"></el-input
          ></el-form-item>
          <el-form-item label="昵称" prop="Name"
            ><el-input v-model="form.Name"></el-input
          ></el-form-item>
          <el-form-item label="性别" prop="Sex">
            <el-radio-group v-model="form.Sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group></el-form-item
          >
          <el-form-item label="联系方式" prop="Phone"
            ><el-input v-model="form.Phone"></el-input
          ></el-form-item>
          <el-form-item label="邮箱地址" prop="addres"
            ><el-input v-model="form.addres"></el-input
          ></el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btn"
              @click="comfir"
              :loading="btnLoading"
              >提交</el-button
            >
            <el-button class="btn" @click="cancelEdit">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="warp-right">
        <div class="warp-right-top">
          <div class="info-right-title"><span>团队列表</span></div>
          <div class="right-form" v-loading="tableLoading">
            <el-table :data="tableData">
              <el-table-column
                label="团队名称"
                prop="Name"
                show-overflow-tooltip
                align="center"
              />
              <el-table-column
                label="创建人"
                prop="UserName"
                show-overflow-tooltip
                align="center"
              />
              <!-- <el-table-column
                label="创建时间"
                prop="CreateTime"
                show-overflow-tooltip
                align="center"
                ><template slot-scope="scope">
                  {{ scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:mm") }}
                </template>
              </el-table-column> -->
              <el-table-column
                label="管理员"
                prop="AdminUserName"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    v-if="
                      scope.row.AdminUserName && scope.row.AdminUserName.length
                    "
                  >
                    <span
                      v-for="(admin, index) in scope.row.AdminUserName"
                      :key="index"
                      >{{ index == 0 ? admin : `、${admin}` }}</span
                    >
                  </div>
                  <div v-else>无</div>
                </template>
              </el-table-column>
              <el-table-column
                label="团队人数"
                prop="MemberCount"
                align="center"
                ><template slot-scope="scope">
                  {{ scope.row.MemberCount }}人
                </template></el-table-column
              >
              <!-- <el-table-column label="购买版本" align="center"
              ><template slot-scope="scope">
                {{ scope.row.Vsersion ? scope.row.Vsersion.Name : "无" }}
              </template></el-table-column
            > -->
              <!-- <el-table-column
                label="服务器"
                align="center"
                show-overflow-tooltip
                ><template slot-scope="scope">
                  {{ scope.row.Database ? scope.row.Database : "无" }}
                </template></el-table-column
              > -->
              <el-table-column label="我的部门" prop="gName" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.gName">{{ scope.row.gName }}</span>
                  <el-tag v-else size="medium" type="danger"> 暂无部门 </el-tag>
                </template></el-table-column
              >
              <el-table-column
                label="我的操作效率"
                prop="EfficiencyStatus"
                show-overflow-tooltip
                align="center"
                width="110"
              >
                <template slot-scope="scope"
                  ><span
                    :style="`color:${getEfficiencyColor(
                      scope.row.EfficiencyStatus
                    )}`"
                    >{{
                      scope.row.EfficiencyStatus
                        ? scope.row.EfficiencyStatus
                        : "无"
                    }}</span
                  ></template
                ></el-table-column
              >

              <el-table-column
                label="我的行为状态"
                prop="BehaviorStatus"
                show-overflow-tooltip
                align="center"
                width="110"
              >
                <template slot-scope="scope"
                  ><span
                    :style="`color:${getbehaviorColor(
                      scope.row.BehaviorStatus
                    )}`"
                    >{{
                      scope.row.BehaviorStatus ? scope.row.BehaviorStatus : "无"
                    }}</span
                  ></template
                ></el-table-column
              >
            </el-table>
            <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
          </div>
        </div>
        <div class="warp-right-bottom">
          <div class="info-right-title">
            <span>我的申请</span>
            <el-select
              v-model="selStatus"
              placeholder="结果筛选"
              @change="applyStatusChange"
            >
              <el-option label="所有结果" :value="null"> </el-option>
              <el-option
                v-for="item in $D.LIST('invited_status')"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="right-form" v-loading="applyLoading">
            <el-table :data="tableDataApply">
              <el-table-column
                label="团队名称"
                prop="TeamName"
                show-overflow-tooltip
                align="center"
              />
              <el-table-column
                label="邀请人"
                prop="Inviter"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.Inviter ? scope.row.Inviter : "无" }}
                </template>
              </el-table-column>
              <el-table-column
                label="处理人"
                prop="Handler"
                show-overflow-tooltip
                align="center"
              />
              <el-table-column
                label="邀请时间"
                prop="CreateTime"
                show-overflow-tooltip
                align="center"
                ><template slot-scope="scope">
                  {{
                    scope.row.CreateTime
                      ? scope.row.CreateTime.timeFormat("yyyy-MM-dd HH:mm")
                      : "无"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="结果"
                prop="InvitedStatus"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    size="medium"
                    :type="`${
                      $D.ITEM('invited_status', scope.row.InvitedStatus).color
                    }`"
                    >{{
                      $D.ITEM("invited_status", scope.row.InvitedStatus).name
                    }}</el-tag
                  >
                </template>
              </el-table-column>
            </el-table>
            <CPages
              v-model="pageDataApply"
              @changeEvent="handlePaginationApplyChange"
            />
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="上传头像" width="90%" :visible.sync="dialogVisible">
      <div class="cropper-content" style="width: 100%; height: 300px">
        <vueCropper
          ref="memberCropper"
          :img="cropperOption.img"
          :outputSize="cropperOption.size"
          :outputType="cropperOption.outputType"
          :info="true"
          :full="cropperOption.full"
          :canMove="cropperOption.canMove"
          :canMoveBox="cropperOption.canMoveBox"
          :original="cropperOption.original"
          :autoCrop="cropperOption.autoCrop"
          :fixed="cropperOption.fixed"
          :fixedNumber="cropperOption.fixedNumber"
          :centerBox="cropperOption.centerBox"
          :infoTrue="cropperOption.infoTrue"
          :fixedBox="cropperOption.fixedBox"
        ></vueCropper>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishCropper">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { imgChange, getEfficiencyColor, getbehaviorColor } from "@/commons";
export default {
  components: {
    Header: () => import("@/components/Header"),
    CPages: () => import("@/components/CPages"),
    MemberSelect: () => import("@/components/Selectors/MemberSelectCopy"),
  },
  data() {
    var validateQQ = (rule, value, callback) => {
      if (value && !/^\d{5,11}$/.test(value)) {
        return callback(new Error("请输入正确的QQ号码"));
      }
      callback();
    };
    var validateTel = (rule, value, callback) => {
      if (value && !/^1(3|4|5|7|8)\d{9}$/.test(value)) {
        return callback(new Error("请输入正确的手机号码"));
      }
      callback();
    };
    return {
      selStatus: null,
      nowTeam: null, //当前团队
      applyLoading: false,
      tableLoading: false,
      tableData: [], //团队列表
      tableDataApply: [], //申请列表
      pageData: {
        //团队分页
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      pageDataApply: {
        //团队分页
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      user: null,
      loading: false,
      isEdit: false,
      form: {},
      btnLoading: false,
      RULES: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        qq: [{ validator: validateQQ, trigger: "blur" }],
        phone: [{ validator: validateTel, trigger: "blur" }],
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
      },
      // 头像剪切参数
      dialogVisible: false,
      cropperOption: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [100, 100], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      depList: [],
      memberList: [],
    };
  },
  mounted() {
    this.getUserInfo();
    this.getTeamList();
    this.getApplyList();
  },
  methods: {
    imgChange,
    getEfficiencyColor,
    getbehaviorColor,
    editImg(val) {
      if (val && val.includes("/images/head/")) {
        return this.$url + val;
      } else {
        return val;
      }
    },
    /**
     * 申请记录结果切换
     */
    applyStatusChange() {
      this.pageDataApply.pageIndex = 1;
      this.getApplyList();
    },
    /**
     * 团队列表分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getTeamList();
    },
    /**
     * 申请记录分页
     */
    handlePaginationApplyChange(val) {
      this.pageDataApply = val;
      this.getApplyList();
    },
    /**
     * 获取团队列表
     */
    getTeamList() {
      this.tableLoading = true;
      const data = {
        searchText: null,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        type: 2,
      };
      this.$http
        .get("/Teams/TeamManagement.ashx", { params: data })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.data;
            this.pageData.totalNum = resp.data.total;
            //获取当前团队
            const role = this.$xStorage.getItem("user-role");
            this.nowTeam = this.tableData.filter((m) => m.Id == role.team);
          }
        })
        .finally(() => (this.tableLoading = false));
    },
    /**
     * 获取申请记录
     */
    getApplyList() {
      this.applyLoading = true;
      const data = {
        name: null,
        pageIndex: this.pageDataApply.pageIndex,
        pageSize: this.pageDataApply.pageSize,
        status: this.selStatus,
        sdate: null,
        edate: null,
      };
      this.$http
        .post("/Teams/InvitedOrApply/GetMyTeamApply.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.tableDataApply = resp.data.data;
            this.pageDataApply.totalNum = resp.data.total;
          }
        })
        .finally(() => (this.applyLoading = false));
    },
    /**
     * 修改
     */
    handleEdit() {
      this.form = JSON.parse(JSON.stringify(this.user));
      this.isEdit = true;
    },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      this.loading = true;
      this.$http
        .get("/Management/UserManagement/GetUserDetail.ashx", {
          params: { usId: null },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.user = resp.data;
          }
        })
        .finally(() => (this.loading = false));
    },

    //取消
    cancelEdit() {
      this.isEdit = false;
      this.form = Object.assign({}, this.user);
    },
    //提交
    comfir() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true;
          this.form.Id = this.form.UsId;
          if (this.form.Picture.includes("/images/head/")) {
            this.form.Picture = null;
          }
          let resp = await this.$http.post("/User/EditUser.ashx", this.form);
          if (resp.res == 0) {
            if (this.form.UseName != this.user.UseName) {
              this.$notify({
                type: "warning",
                message: "您的账户已过期，请重新登录！",
              });
              this.$xStorage.removeItem("token");
              this.$xStorage.removeItem("user-role");
              this.$router.push("/");
            } else {
              this.$notify({
                type: "success",
                message: resp.msg,
              });
              this.getUserInfo();
              this.isEdit = false;
            }
          }
          this.btnLoading = false;
        }
      });
    },
    useDefalut() {
      if (this.form.Name) {
        this.getDefaultHead(this.form.Name);
      } else {
        this.$message.warning("请先输入昵称！");
      }
    },
    // 上传按钮单机后上传头像 限制图片大小
    changeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!");
        return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = (e) => {
        this.cropperOption.img = e.target.result;
      };
      this.dialogVisible = true;
    },
    // 拿到裁剪后的图片
    finishCropper() {
      this.$refs.memberCropper.getCropData((data) => {
        this.cropperOption.img = data;
        this.form.Picture = data;
        this.dialogVisible = false;
      });
    },
    /* 设置默认头像 */
    getDefaultHead(name) {
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      if (pattern.test(name)) {
        this.form.Picture = this.$userHead(name.substr(name.length - 2, 2));
      }
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern2.test(name)) {
        this.form.Picture = this.$userHead(name.substr(0, 2));
      }
    },
    async inTaskLoad() {
      let resp = await this.$http.post("/Person/InTaskLoad.ashx");
      if (resp.res == 0) {
        this.memberList = resp.data.InTaskUserId.map((element) => {
          return {
            UId: element.UsId,
            UName: element.Name,
            Picture: element.Picture,
          };
        });
        this.depList = resp.data.InTaskReachId;
      }
    },
    //获取成员
    getMember(result) {
      let inTaskUserId = [];
      result.forEach((element) => {
        inTaskUserId.push(element.UId);
      });
      let inTaskReachId = this.filterId(this.depList, "RId");
      this.inTaskAdd(inTaskReachId, inTaskUserId);
    },
    //提取id
    filterId(list, id) {
      let idList = [];
      list.forEach((element) => {
        idList.push(element[id]);
      });
      return idList;
    },
    async inTaskAdd(inTaskReachId, inTaskUserId) {
      let params = {
        inTaskReachId,
        inTaskUserId,
      };
      let resp = await this.$http.post("/Person/InTaskAdd.ashx", params);
      if (resp.res == 0) {
        this.$notify({
          type: "success",
          message: resp.msg,
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
#profile {
  height: 100%;
  .container {
    height: 100%;
    display: flex;
    .warp-left {
      height: 100%;
      background-color: #ffffff;
      flex: 3.5;
      margin-right: 3px;
      padding: 0px 20px;
      overflow-y: auto;
      // 头像
      .head > img {
        margin: 20px 0;
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
      .head {
        display: flex;
        & > div {
          margin-left: 20px;
          .button,
          /deep/.el-upload {
            width: 120px;
          }
        }
        .upload-btn,
        .default-btn {
          cursor: pointer;
          border-radius: 2px;
          background: #448ef5;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          line-height: 3.6rem;
          text-align: center;
          display: block;
          margin-bottom: 10px;
          padding: 0 1.5rem;
          margin-top: 1.6rem;
        }
        .default-btn {
          color: rgb(109, 109, 109);
          background: rgb(248, 248, 248);
        }
      }
      //我的信息
      .title {
        width: 120px;
        font-size: 1.8rem;
        color: #575757;
        text-align: center;
        font-weight: 700;
        line-height: 30px;
      }
      .look {
        .el-form-item {
          margin-bottom: 0;
          .update {
            width: 60%;
          }
        }
      }
      .edit {
        margin-top: 10px;
        .btn {
          width: 45%;
        }
      }
    }
    .warp-right {
      flex: 6.5;
      height: 100%;
      .warp-right-top,
      .warp-right-bottom {
        background-color: #ffffff;
        height: 50%;
      }
      .warp-right-top {
        margin-bottom: 5px;
      }
      .info-right-title {
        font-size: 1.6rem;
        border-bottom: 1px #eeeeee solid;
        color: #409eff;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        line-height: 3.5rem;
        padding: 0 16px 0 10px;
        /deep/.el-select {
          .el-input__inner {
            height: 28px;
            line-height: 28px;
            width: 120px;
            background: #ffffff;
            border: 1px solid #dcdfe6;
            border-bottom: 1px solid #dcdfe6 !important;
            border-radius: 4px;
          }
        }
      }
      .right-form {
        padding: 0px 10px 5px;
        height: calc(100% - 3.5rem);
        .el-table {
          height: calc(100% - 33px);
          overflow-y: auto;
          &::before {
            height: 0;
          }
          /deep/td {
            padding: 8px 0;
          }
        }
      }
      /deep/.set-up {
        & > .el-form-item > .el-form-item__label {
          font-size: 1.6rem;
          color: black;
        }
        & > .el-form-item > .el-form-item__content {
          padding-top: 30px;
        }
      }
    }
  }
}
@media screen and (max-width: 1204px) {
  #profile {
    height: 100%;
    .container {
      height: auto;
      padding: 0;
      display: block;
      .warp-left {
        padding-left: 2rem;
        .look {
          .el-form-item {
            margin-bottom: 0;
          }
          &:last-child {
            margin-bottom: 22px;
          }
        }
      }
    }
  }
}
</style>
