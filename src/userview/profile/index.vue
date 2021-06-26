<template>
  <div id="profile">
    <Header
      title="个人信息"
      titleEnglish="Personal Inform"
      class="baseHeader"
    ></Header>
    <div class="container">
      <div class="warp-left" v-show="!isEdit">
        <div class="head"><img v-lazy="user.img" /></div>
        <div class="title">我的信息</div>
        <el-form label-width="80px" class="look">
          <el-form-item label="名字">{{ user.name }}</el-form-item>
          <el-form-item label="部门">
            <el-tag v-for="(item, i) in user.departments" :key="i">{{
              item.Name
            }}</el-tag>
          </el-form-item>
          <el-form-item label="职位">
            <el-tag v-for="(item, i) in user.positions" :key="i">{{
              item.Name
            }}</el-tag>
          </el-form-item>
          <el-form-item label="QQ号码">{{ user.qq }}</el-form-item>
          <el-form-item label="手机号码">{{ user.phone }}</el-form-item>
          <el-form-item label="邮箱地址">{{ user.email }}</el-form-item>
          <el-form-item label="WHB账号">{{ user.whb }}</el-form-item>
          <el-form-item
            ><el-button type="primary" @click="isEdit = true" class="update"
              >修改</el-button
            ></el-form-item
          >
        </el-form>
      </div>
      <div class="warp-left" v-show="isEdit">
        <div class="head">
          <img v-lazy="form.img" />
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
          <el-form-item label="名字" prop="name"
            ><el-input v-model="form.name"></el-input
          ></el-form-item>
          <el-form-item label="QQ号码" prop="qq"
            ><el-input v-model="form.qq"></el-input
          ></el-form-item>
          <el-form-item label="手机号码" prop="phone"
            ><el-input v-model="form.phone"></el-input
          ></el-form-item>
          <el-form-item label="邮箱地址" prop="email"
            ><el-input v-model="form.email"></el-input
          ></el-form-item>
          <el-form-item label="WHB账号"
            ><el-input v-model="form.whb"></el-input
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
        <div class="info-right-title">高级设置</div>
        <div class="right-form">
          <el-form label-width="70px" label-position="left">
            <el-form-item label="可见成员"
              ><MemberSelect
                :arrays="memberList"
                :selRange="1"
                @Confirm="getMember"
              ></MemberSelect
            ></el-form-item>
          </el-form>
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
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Header: () => import("@/components/Header"),
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
  methods: {
    ...mapActions(["user_setInfo"]),
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
          let resp = await this.$http.post("/Person/personInformation.ashx", {
            head: this.form.img,
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            qq: this.form.qq,
            custom1: this.form.whb,
          });
          if (resp.res == 0) {
            this.user_setInfo(this.form);
            this.$notify({
              type: "success",
              message: resp.msg,
            });
            this.isEdit = false;
          }
          this.btnLoading = false;
        }
      });
    },
    useDefalut() {
      this.getDefaultHead(this.form.name);
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
        this.form.img = data;
        this.dialogVisible = false;
      });
    },
    /* 设置默认头像 */
    getDefaultHead(name) {
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      if (pattern.test(name)) {
        this.form.img = this.$userHead(name.substr(name.length - 2, 2));
      }
      var pattern2 = new RegExp("[A-Za-z]+");
      if (pattern2.test(name)) {
        this.form.img = this.$userHead(name.substr(0, 2));
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
    //获取部门
    getDep(result) {
      let inTaskReachId = [];
      result.forEach((element) => {
        inTaskReachId.push(element.RId);
      });
      let inTaskUserId = this.filterId(this.memberList, "UId");
      this.inTaskAdd(inTaskReachId, inTaskUserId);
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
  created() {
    this.form = Object.assign({}, this.user);
    // this.inTaskLoad();
  },
  computed: {
    ...mapState(["user"]),
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
      background-color: #ffffff;
      overflow-y: auto;
      .info-right-title {
        font-size: 1.6rem;
        border-bottom: 1px #eeeeee solid;
        color: #409eff;
        font-weight: bold;
        text-align: center;
        line-height: 3.5rem;
      }
      .right-form {
        padding: 10px;
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
