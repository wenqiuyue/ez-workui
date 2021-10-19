<template>
  <div class="manual">
    <el-row>
      <el-col :span="9"
        ><div class="manual_l">
          <ul>
            <li
              v-for="(item, index) in roleType == 1
                ? manualManagerStepList
                : userList"
              :key="index"
              @click="selStep = item.step"
              :class="selStep == item.step ? 'active_step' : ''"
            >
              {{ `${numChange(item.step)}、${item.title}` }}
            </li>
          </ul>
        </div></el-col
      >
      <el-col :span="15"
        ><div class="manual_r">
          <ul>
            <li
              v-for="(con, cind) in roleType == 1
                ? manualManagerStepList[selStep - 1].content
                : userList[selStep - 1].content"
              :key="cind"
            >
              <p class="title">{{ con.text }}</p>
              <el-image
                v-if="con.img"
                :style="`${
                  roleType == 2 && (selStep == 7 || selStep == 8)
                    ? 'width: auto; height: 550px;'
                    : 'width: 100%; height: 252px;'
                } margin-bottom: 5px`"
                :src="require(`@/assets/img/manual/${con.img}`)"
                fit="fill"
                :preview-src-list="[require(`@/assets/img/manual/${con.img}`)]"
              ></el-image>
            </li>
          </ul></div
      ></el-col>
    </el-row>
  </div>
</template>
<script>
import { numChange } from "@/commons";
export default {
  components: {},
  props: {
    roleType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      selStep: 1,
      manualManagerStepList: [
        {
          step: 1,
          title: "管理员团队创建",
          content: [
            {
              text: "点击团队管理 》点击创建团队",
              img: "manager1-1.png",
            },
            {
              text: "打开创建团队弹窗",
              img: "manager1-2.png",
            },
          ],
        },
        {
          step: 2,
          title: "设置团队监测配置",
          content: [
            {
              text: "点击团队详情进入团队信息界面，然后点击应用设置（监测配置越详细，成员相关的数据分析越准确）",
              img: "manager2-1.png",
            },
            {
              text: "进入团队详情点击设置按钮进入配置界面",
              img: "manager2-2.png",
            },
          ],
        },
        {
          step: 3,
          title: "邀请成员加入团队",
          content: [
            {
              text: "点击团队管理 》点击邀请成员加入",
              img: "manager3-1.png",
            },
            {
              text: "生成邀请链接，然后复制链接发给团队成员",
              img: "manager3-2.png",
            },
          ],
        },
        {
          step: 4,
          title: "通过成员加入团队的申请",
          content: [
            {
              text: "点击团队详情进入团队信息界面",
              img: "manager2-1.png",
            },
            {
              text: "点击团队详情进入页面",
              img: "manager4-2.png",
            },
          ],
        },
        {
          step: 5,
          title: "给成员设置部门（必须步骤）",
          content: [
            {
              text: "点击团队详情进入团队信息界面",
              img: "manager2-1.png",
            },
            {
              text: "点击成员详情",
              img: "manager5-2.png",
            },
            {
              text: "在成员详情中设置成员部门",
              img: "manager5-3.png",
            },
          ],
        },
        {
          step: 6,
          title: "查看成员在客户端挂的任务记录",
          content: [
            {
              text: "在成员任务里选择团队、成员、日期查看该成员的任务记录",
              img: "manager6-1.png",
            },
          ],
        },
        {
          step: 7,
          title: "查看数据分析",
          content: [
            {
              text: "在数据分析里查看成员的监测数据，高级视图查看详情数据",
              img: "manager7-1.png",
            },
          ],
        },
        {
          step: 8,
          title: "查看成员实况",
          content: [
            {
              text: "实时查看成员工作情况，实时截图及实时拍照",
              img: "manager8-1.png",
            },
          ],
        },
        {
          step: 9,
          title: "查看考勤（我的考勤和成员考勤）",
          content: [
            {
              text: "考勤统计以日历形式查看考勤；点击某一天，查看当天考勤详情",
              img: "manager9-1.png",
            },
          ],
        },
      ],
      userList: [
        {
          step: 1,
          title: "加入团队(方式一)",
          content: [
            {
              text: "在浏览器访问管理员给你的团队邀请码地址，点击加入团队",
              img: "user1-1.png",
            },
          ],
        },
        {
          step: 2,
          title: "加入团队(方式二)",
          content: [
            {
              text: "直接在平台输入管理员提供的团队号加入团队",
              img: "user2-1.png",
            },
            {
              text: "打开弹窗输入团队号",
              img: "user2-2.png",
            },
          ],
        },
        {
          step: 3,
          title: "任务创建（该步骤可忽略）",
          content: [
            {
              text: "把你即将要开始做的事情创建为一个任务",
              img: "user3-1.png",
            },
          ],
        },
        {
          step: 4,
          title: "查看和补交任务记录（该步骤可忽略）",
          content: [
            {
              text: "任务执行记录查询操作步骤：成员任务-选择项目-选择成员-切换日期（绿色标签为你开始工作打卡的时间；蓝色标签为你执行任务的时间段，点击可以查看任务详情；红色标签为结束工作打卡的时间；黄色标签，则说明此时间段你没有在客户端挂任务，你可以点击这个卡片补交任务）",
              img: "user4-1.png",
            },
          ],
        },
        {
          step: 5,
          title: "客户端下载及安装",
          content: [
            {
              text: `下载后你将得到“EZTeam-Installer.exe”这个安装程序，点击开始安装。下载地址：http://admin.ezteams.cn/download.ashx`,
              img: "",
            },
          ],
        },
        {
          step: 6,
          title: "打开客户端",
          content: [
            {
              text: "在安装好的EZTeam文件夹中找到EZTeam.exe文件，点击打开",
              img: "user6-1.png",
            },
          ],
        },
        {
          step: 7,
          title: "登录",
          content: [
            {
              text: "登录",
              img: "user7-1.png",
            },
          ],
        },
        {
          step: 8,
          title: "打卡",
          content: [
            {
              text: "开始工作和结束工作打卡;打完上班卡时，你还可以选择你要执行的任务挂到工作平台，如果要进行下一个任务，则记得在客户端切换任务",
              img: "user8-1.png",
            },
          ],
        },
      ],
    };
  },
  methods: {
    numChange,
    initSelStep() {
      this.selStep = 1;
    },
  },
};
</script>
<style lang="less" scoped>
.manual {
  height: 100%;
  .el-row,
  .el-col {
    height: 100%;
  }
  .manual_l {
    height: 100%;
    border-right: 1px solid #dcdfe6;
    ul {
      li {
        line-height: 40px;
        font-size: 14px;
        cursor: pointer;
        color: #606266;
        &:hover {
          color: #409eff;
        }
      }
      .active_step {
        color: #409eff;
      }
    }
  }
  .manual_r {
    height: 100%;
    overflow-y: auto;
    padding-left: 10px;
    ul {
      li {
        margin-bottom: 6px;
        .title {
          line-height: 30px;
          font-size: 14px;
          font-weight: bold;
          color: #606266;
        }
        .el-image {
          border: 2px solid #dcdfe6;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
