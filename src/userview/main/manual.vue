<template>
  <div class="manual">
    <XModal
      ref="modal"
      name="manual"
      title="操作手册"
      width="80%"
      height="90%"
      showCrossBtn
    >
      <div class="content">
        <div class="radio">
          <el-radio-group v-model="radio">
            <el-radio :label="1">管理员操作手册</el-radio>
            <el-radio :label="2">员工操作手册</el-radio>
          </el-radio-group>
        </div>
        <el-carousel trigger="click" height="100%" :autoplay="false">
          <el-carousel-item
            v-for="(item, index) in radio == 1 ? managerList : userList"
            :key="index"
          >
            <div v-for="(step, sind) in item" :key="sind">
              <p class="title">{{ step.tltle }}</p>
              <p class="con">{{ step.con }}</p>
              <el-image
                style="width: 100%; height: 420px; margin-bottom: 5px"
                :src="require(`@/assets/img/manual/${step.img}`)"
                fit="contain"
                :preview-src-list="[require(`@/assets/img/manual/${step.img}`)]"
              ></el-image>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  data() {
    return {
      radio: 1,
      managerList: [
        [
          {
            tltle: "1、管理员团队创建",
            con: "",
            img: "manager1.png",
          },
          {
            tltle: "创建团队弹窗",
            con: "",
            img: "manager1-2.png",
          },
        ],
        [
          {
            tltle: "2、设置团队监测配置",
            con: "点击团队详情进入团队信息界面，然后点击应用设置（监测配置越详细，成员相关的数据分析越准确）",
            img: "manager2-1.png",
          },
          {
            tltle: "进入团队详情点击设置按钮进入配置界面",
            con: "",
            img: "manager2-2.png",
          },
        ],
        [
          {
            tltle: "3、邀请成员加入团队",
            con: "",
            img: "manager4.png",
          },
          {
            tltle: "生成邀请链接，然后复制链接发给团队成员",
            con: "",
            img: "manager3-2.png",
          },
        ],
        [
          {
            tltle: "4、通过成员加入团队的申请",
            con: "",
            img: "manager2-1.png",
          },
          {
            tltle: "点击团队详情进入页面",
            con: "",
            img: "manager5.png",
          },
        ],
        [
          {
            tltle: "5、给成员设置部门（必须步骤）",
            con: "",
            img: "manager2-1.png",
          },
          {
            tltle: "",
            con: "",
            img: "manager5-2.png",
          },
          {
            tltle: "",
            con: "",
            img: "manager5-3.png",
          },
        ],
        [
          {
            tltle: "6、查看成员在客户端挂的任务记录",
            con: "",
            img: "manager6.png",
          },
        ],
        [
          {
            tltle: "7、查看数据分析",
            con: "",
            img: "manager7.png",
          },
        ],
        [
          {
            tltle: "8、查看成员实况",
            con: "",
            img: "manager9.png",
          },
        ],
        [
          {
            tltle: "9、查看考勤（我的考勤和成员考勤）",
            con: "",
            img: "manager10.png",
          },
        ],
      ],
      userList: [
        [
          {
            tltle: "1、加入团队(方式一)",
            con: "在浏览器访问管理员给你的团队邀请码地址，点击加入团队",
            img: "user1.png",
          },
        ],
        [
          {
            tltle: "2、加入团队(方式二)",
            con: "直接在平台输入管理员提供的团队号加入团队",
            img: "user2.png",
          },
          {
            tltle: "",
            con: "",
            img: "user2-2.png",
          },
        ],
        [
          {
            tltle: "3、任务创建（如果公司不做要求，步骤3和步骤4 可以忽略）",
            con: "把你即将要开始做的事情创建为一个任务",
            img: "user3.png",
          },
        ],
        [
          {
            tltle: "4、查看每天在客户端执行的任务及任务补交",
            con: "任务执行记录查询操作步骤：成员任务-选择项目-选择成员-切换日期（绿色标签为你开始工作打卡的时间；蓝色标签为你执行任务的时间段，点击可以查看任务详情；红色标签为结束工作打卡的时间；黄色标签，则说明此时间段你没有在客户端挂任务，你可以点击这个卡片补交任务）",
            img: "user4.png",
          },
        ],
        [
          {
            tltle: "5、客户端下载及安装",
            con: "下载后你将得到这个安装程序，点击开始安装。下载地址：http://admin.ezteams.cn/download.ashx",
            img: "user6.png",
          },
        ],
        [
          {
            tltle: "6、打开客户端",
            con: "在安装好的EZTeam文件夹中找到EZTeam.exe文件，点击打开",
            img: "user7.png",
          },
        ],
        [
          {
            tltle: "7、登录",
            con: "",
            img: "user8.png",
          },
        ],
        [
          {
            tltle: "8、打卡",
            con: "开始工作和结束工作打卡;打完上班卡时，你还可以选择你要执行的任务挂到工作平台，如果要进行下一个任务，则记得在客户端切换任务",
            img: "user9.png",
          },
        ],
      ],
    };
  },
};
</script>
<style lang="less" scoped>
.manual {
  /deep/.ctn {
    padding-bottom: 23px;
  }
  .content {
    height: 100%;
    padding: 3px 10px 10px;
    .radio {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }
    .el-carousel {
      height: 100%;
      .el-carousel__item {
        overflow-y: auto;
      }
      .title {
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      .con {
        font-size: 13px;
        margin-bottom: 10px;
        color: #303133;
      }
    }
  }
}
</style>
