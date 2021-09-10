<template>
  <div class="notice">
    <el-dialog :visible.sync="dialogNotice" width="112rem">
      <div class="title" slot="title">
        <div class="hiFont hi-cebianlan-bijiao-xuanzhong"></div>
        <span>隐私政策</span>
      </div>
      <div class="header-panel">
        <div class="division">
          <span></span>
          <span></span>
        </div>
        <div class="content">
          <p>Dear users</p>
          <p>
            Welcome to be a user of this website. Please read the following
            terms of service carefully before logging in for the first time.
          </p>
          <p>
            1. Confirmation and acceptance of the terms of service of this
            websiteThe ownership and operation right of all services of this
            website belong to this website.
          </p>
          <p>
            2. Users must:Provide necessary equipment for Internet access,
            including personal computer, modem or other necessary Internet
            access devices.They shall bear the telephone and network charges
            related to this service paid by individuals on the Internet.
          </p>
          <p>
            3. Modification of service terms This website has the right to
            modify the terms of service when necessary. Once the terms of
            service of this website change, it will prompt to modify the content
            on the important page. If you don't agree with the content, you can
            cancel the information service of this website. If the user
            continues to enjoy the information service of this website, it is
            deemed to accept the change of service terms. The website reserves
            the right to modify the service at any time without notifying the
            user; if the service needs to be interrupted, the website will
            inform the user in advance as far as possible. This website
            exercises the right to modify or interrupt the service, and is not
            responsible to the user or the third party.
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogNotice: false,
    };
  },
  methods: {
    openDialog() {
      this.dialogNotice = true;
    },
  },
};
</script>
<style lang="less" scoped>
.notice {
  .title {
    display: flex;
    align-items: center;
    div {
      font-size: 20px;
    }
    span {
      margin-left: 8px;
      color: #606266;
      font-size: 14px;
      font-weight: bold;
    }
  }
  /deep/.el-dialog {
    margin-top: 10rem !important;
    height: 80%;
  }
  /deep/.el-dialog__header {
    padding-bottom: 5px;
  }
  /deep/.el-dialog__body {
    padding: 0;
  }
  .header-panel {
    border-radius: 5px;
    padding: 0 20px 20px 20px;
    // height: 490px;
    overflow-y: scroll;
    .division {
      margin-top: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        background: #797979;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        position: absolute;
      }
      span:first-child {
        left: -8px;
      }
      span:last-child {
        right: -8px;
      }
    }
    .content {
      padding-top: 10px;
      color: #666666;
      font-size: 14px;
      line-height: 30px;
      border-top: 3px dashed #2b7df2;
    }
  }
  .header-panel::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .header-panel::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #535353;
  }
  .header-panel::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: #ededed;
  }
}
</style>
