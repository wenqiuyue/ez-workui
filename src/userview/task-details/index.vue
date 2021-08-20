<template>
  <div class="task-details">
    <Header title="任务详情" titleEnglish="Task Details" class="baseHeader">
    </Header>
    <div class="baseViewPage">
      <BaseView :title_name="'成员详情'">
        <div slot="panes">
          <el-select
            v-model="teamValue"
            filterable
            placeholder="请先选择团队"
            @change="selMem = []"
          >
            <el-option
              v-for="item in teamOptions"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            >
            </el-option>
          </el-select>
          <div class="left_title" v-if="teamValue">
            <p class="lable">
              <i class="hiFont hi-customer"></i>
              <span> 成员：</span>
            </p>
            <selMember
              :teamId="teamValue"
              size="small"
              @Confirm="getSelMember"
              :selRange="1"
              :arrays="selMem"
              :isSelection="false"
              :showActive="false"
            >
              <div slot="button" class="user_comp">
                <div v-if="selMem && selMem.length" class="user_list">
                  <img :src="imgChange(selMem[0].Picture, true)" />
                  <p>
                    {{ selMem[0].Name }}
                  </p>
                </div>
                <span class="btn-custom">
                  <i class="el-icon-plus"></i>
                </span>
              </div>
            </selMember>
          </div>

          <el-collapse accordion v-model="activeTime">
            <el-collapse-item
              v-for="obj in ulTimeArr"
              :key="obj.title"
              :title="obj.title"
              :name="obj.title"
            >
              <ul class="infinite-list">
                <li
                  v-for="item in obj.brr"
                  :key="item.time"
                  :class="{ activeList: expandId === item.time }"
                  @click="liClick(item.time, item)"
                >
                  <span
                    >{{ item.time.split("-")[1] }}月{{
                      item.time.split("-")[2]
                    }}日</span
                  >
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
        <TaskDetailRight slot="content"></TaskDetailRight>
      </BaseView>
    </div>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    Header: () => import("@/components/Header"),
    BaseView: () => import("@/components/BaseView"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    TaskDetailRight: () => import("./taskdetail-right"),
  },
  data() {
    return {
      teamValue: null, //选择的团队
      teamOptions: [],
      activeTime: "",
      ulTimeArr: [],
      expandId: null,
      selMem: [],
    };
  },
  mounted() {
    this.getTeams();
    this.initPage();
  },
  methods: {
    imgChange,
    /**
     * 获取成员
     */
    getSelMember(val) {
      this.selMem = val;
      console.log(val);
    },
    // 左侧li点击事件
    liClick(index) {
      this.expandId = index;
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
    // 初始化ul 时间列表
    initPage() {
      this.getCalendar3Y();
      this.expandId = this.ulTimeArr[0].brr[0].time;
    },
    getCalendar3Y(time = new Date()) {
      let nowy = time.getFullYear();
      let nowm = time.getMonth();
      let nowd = time.getDate();

      let y = time.getFullYear();
      let m = time.getMonth(); // 0~11
      let arr = [];
      // n = 123456789控制年数
      for (let n = 0; n < 2; n++) {
        for (let i = m + 1; i > 0; i--) {
          let item = {
            title: y + "年" + (i <= 9 ? "0" : "") + i + "月",
            brr: new Array(),
          };
          for (
            let j = 0, days = this.getMonthDays(y, i - 1).length;
            j < days;
            j++
          ) {
            if (nowy === y && nowm + 1 === i && nowd <= j) {
              //    这节不要 比如今天是2019年11月10号，那这一个月的11~30不展示
            } else {
              item.brr.push({
                time:
                  y +
                  "-" +
                  (i <= 9 ? "0" : "") +
                  i +
                  "-" +
                  (j < 9 ? "0" : "") +
                  (j + 1),
              });
            }
          }
          item.brr = item.brr.reverse();
          arr.push(item);
        }
        y--;
        m = 11;
      }
      this.ulTimeArr = arr;
      // console.log(arr)
    },
    // 判断平年闰年 [四年一闰，百年不闰，四百年再闰]
    isLeapYear(y) {
      return y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0);
    },
    // 获得每月各自的总天数组成的数组，特殊 month [0~11]
    getMonthDays(y, m) {
      let arr = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let count = arr[m] || (this.isLeapYear(y) ? 29 : 28);
      return Array.from(new Array(count), (item, value) => value + 1);
    },
  },
};
</script>
<style lang="less" scoped>
.task-details {
  height: 100%;
  .baseViewPage {
    .left_title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      .lable {
        font-weight: bold;
        font-size: 14px;
        color: #575757;
        display: flex;
        flex-direction: row;
        align-items: center;
        .hi-customer {
          margin-right: 5px;
          color: #409eff;
        }
      }
      /deep/#mem-public {
        border: none !important;

        .mem-add {
          display: none;
        }
      }
    }
    .user_comp {
      display: flex;
      flex-direction: row;
      align-items: center;
      .user_list {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0 8px 0 5px;
        img {
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 50%;
        }
        p {
          color: #303133;
        }
      }
      .btn-custom {
        width: 35px;
        height: 20px;
        display: block;
        border: 1px solid #ccc;
        border-radius: 0.6rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;
        // margin-left: 1rem;

        i {
          font-size: 1.4rem;
          color: #6d6d6d;
        }

        &:hover {
          border-color: #409eff;

          i {
            color: #409eff;
          }
        }
      }
    }

    /deep/#module_bv {
      padding: 0;
      .bv_left_ctn {
        overflow-y: auto;
      }
    }
  }
  /deep/.el-collapse {
    border-top: none;
  }
}
</style>
