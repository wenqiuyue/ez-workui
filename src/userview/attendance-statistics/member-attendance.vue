<!--
* @author: CX
* @date: 2019-11-30
* @description:
-->
<template>
  <!--XBB：引用了BaseView的页面必须套一层baseViewPage样式的div-->
  <div class="baseViewPage">
    <BaseView :title_name="'考勤列表'" :load="loading">
      <div slot="panes">
        <el-select v-model="teamValue" filterable placeholder="请先选择团队">
          <el-option
            v-for="item in teamOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          >
          </el-option>
        </el-select>
        <el-tabs v-model="activeName" @tab-click="tabClick" v-loading="myload">
          <!-- pane 1 -->
          <el-tab-pane name="1">
            <span slot="label"><i class="hiFont hi-tag-cr"></i> 时间</span>
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
                    @click="liClick(item.time, 1, item)"
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
          </el-tab-pane>

          <!-- pane 2 -->
          <el-tab-pane name="2">
            <span slot="label"><i class="el-icon-user"></i> 成员</span>
            <div>
              <!--XBB: 分组折叠的话直接照搬以下格式 -->
              <ul class="infinite-list">
                <li
                  v-for="(obj, index) in memberGroup"
                  :key="index"
                  :class="{ activeList: generaId === obj.Id }"
                  @click="liClick(obj.Id, 2, obj)"
                >
                  <img :src="imgChange(obj.Picture)" />
                  <span>{{ obj.Name }}</span>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <item
        slot="content"
        :fatData="fatData"
        v-if="openItem"
        :childLoading="childLoading"
        ref="child"
        :changeTab="changeTab"
        activeItem="审核列表"
      >
      </item>
    </BaseView>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    item: () => import("./attendance-info"),
  },
  watch: {
    //团队切换
    teamValue(val, oval) {
      if (val && val != oval) {
        this.getMember();
      }
    },
    filterText(val) {
      this.filterNode(val);
    },
    $route: "routerchange",
  },
  data() {
    return {
      loading: false, //加载
      activeName: "1", //视图选项
      isactive: null, //自定义Index
      items: [0, 0, 0, 0, 0, 0, 0, 0], //状态数
      itemData: {}, //任务列表数据
      filterText: "", //搜索人员
      expandId: 2, //状态值|Index
      generaData: [], //人员
      searchGenera: [], //搜索后的人员
      generaId: null, //人员Index
      customs: [], //自定义列表
      myload: false,
      childLoading: false,
      eid: this.$route.params.eid,
      searchData: {
        text: "", //输入的查询关键字
        type: "0", //查询类型（默认综合）
      },
      selectName: "所有任务",
      woid: -1,
      isSearch: false, //是否在搜索
      index: 2, //点击的ID

      fatData: null, // 需要传给日历组件
      memoryTime: "",
      openItem: false, // 打开item组件
      ulTimeArr: [],

      memb: null, // 当前选中的成员
      memberGroup: [],
      activeTime: "",
      changeTab: false,
      teamValue: null, //选择的团队
      teamOptions: [],
    };
  },
  //初始化页面数据
  created() {
    // this.loading = true;

    this.initPage();

    // console.log(this.activeTime)
    this.activeTime = this.ulTimeArr[0].title;
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    imgChange,
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
      this.sendParams(this.ulTimeArr[0].brr[0].time, undefined); // 传时间2019-11-18，成员 ‘undefined’
      this.memoryTime = this.ulTimeArr[0].brr[0].time;
      this.expandId = this.ulTimeArr[0].brr[0].time;
    },
    //左侧tab切换
    tabClick(tab) {
      if (tab.index == 0) {
        //时间视图
        this.fatData.tabsNum = "1";
        this.changeTab = !this.changeTab;
        this.sendParams(this.memoryTime, undefined);
      } else if (tab.index == 1) {
        //成员视图
        this.fatData.tabsNum = "2";
        this.generaId = this.user.id;
        this.memb = {
          UsId: this.user.id,
          Name: this.user.Name,
        };
        this.sendParams(undefined, this.memb);
      }
    },
    // 左侧li点击事件
    liClick(index, item, obj) {
      this.index = index;
      //时间视图
      if (item === 1) {
        this.expandId = index;
        this.generaId = null;
        this.isactive = null;
        this.sendParams(obj.time, undefined); // 点击li日期触发get
        this.memoryTime = obj.time;
        this.changeTab = !this.changeTab;
      }
      //成员视图
      if (item === 2) {
        this.expandId = null;
        this.generaId = index;
        this.isactive = null;
        this.memb = JSON.parse(JSON.stringify(obj));
        this.sendParams(undefined, this.memb); // 点击li人员触发get
      }
      if (item === 3) {
        this.expandId = null;
        this.generaId = null;
        this.isactive = index;
      }
    },
    // 传参给子组件
    sendParams(time, obj) {
      if (!this.teamValue) {
        this.$message({
          message: "请先选择团队",
          type: "warning",
        });
      }
      // console.log(obj)
      this.fatData = {};
      if (time == undefined) {
        // 时，查询某一人的当月考勤
        console.log(obj);
        this.fatData.menuType = "publicAttendance";
        this.fatData.tabsNum = "2"; // 某单个成员某一月的考勤
        this.fatData.fatTimeYMD = undefined;
        this.fatData.fatUsId = obj.MembersId;
        this.fatData.memberName = obj.Name;
        this.fatData.teamValue = this.teamValue;
      } else {
        this.fatData.menuType = "publicAttendance";
        this.fatData.tabsNum = "1"; // 某一天，所有成员的考勤
        this.fatData.fatTimeYMD = time;
        this.fatData.fatUsId = undefined;
        this.fatData.teamValue = this.teamValue;
      }
      if (this.openItem) {
        this.$nextTick(() => {
          // 不$next?
          // 第一次时这不调 利用的子组件的create
          this.$refs.child.showData();
        });
      }
      this.openItem = true;
    },

    //搜索人员
    filterNode(keyword) {
      if (!keyword) {
        this.searchGenera = [];
        this.isSearch = false;
        return;
      }
      let targetData = []; // 只筛选出符合的那部分
      // console.log(this.generaData)
      this.generaData.forEach((item, index) => {
        let leftoverGenera = [];
        //人员
        item.Mem.forEach((o) => {
          if (o.Name.toLowerCase().indexOf(keyword) !== -1) {
            leftoverGenera.push(o);
          }
        });
        //部门
        if (leftoverGenera.length > 0) {
          let itm = Object.assign({}, item);
          itm.Mem = leftoverGenera;
          targetData.push(itm);
        }
      });
      this.isSearch = true;
      this.searchGenera = targetData;
      // console.log(this.searchGenera)
    },
    //路由参数改变
    routerchange() {
      if (this.eid != this.$route.params.eid) {
        //初始化数据
        this.activeName = "1";
        this.expandId = 2;
        this.generaData = [];
        this.customs = [];
        this.selectName = "所有任务";
        this.woid = -1;
        this.index = 2;
        this.eid = this.$route.params.eid;
      }
    },
    getMember() {
      const data = {
        teamId: this.teamValue,
      };
      this.$http
        .post("/Management/TeamManagement/MenberSelects.ashx", data)
        .then((res) => {
          if (res.res == 0) {
            this.memberGroup = res.data;
          }
        });
    },
    //选择的值改变
    handleChange(actionId) {
      this.woid = actionId;
    },
    //打开任务详情
    projectDetail() {
      this.$modal.show("projectDetail");
    },

    //cx 目前写死，只获取一年 n控制
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
.baseViewPage {
  /deep/#module_bv {
    padding: 0;
  }
}
/deep/.el-collapse {
  border-top: none;
}
</style>
