<!-- 进度条截图 -->
<template>
  <div class="progressCom">
    <XModal
      width="70%"
      height="90%"
      :name="name"
      :showCrossBtn="true"
      :title="`
        ${activeBar ? activeBar.name : ''}${
        name == 'memberDatatimeAxisPhoto' ? '状态的' : '的'
      }截图`"
      class="work-timeAxis"
      @beforeOpen="dataInit"
      @opened="open()"
    >
      <div slot="sel" class="header_sel" v-if="name != 'staffDataPic'">
        <el-date-picker
          v-model="timeStart"
          type="date"
          placeholder="开始日期"
          @change="handleChange"
        >
        </el-date-picker>
        <div style="background: #ffffff">至</div>
        <el-date-picker
          v-model="timeEnd"
          type="date"
          placeholder="结束日期"
          @change="handleChange"
        >
        </el-date-picker>
      </div>
      <div class="content_modal" v-loading="loading">
        <template v-if="progressPhotoArr && progressPhotoArr.length">
          <div class="time_line">
            <el-timeline>
              <el-timeline-item
                :timestamp="value.time.timeFormat('yyyy-MM-dd HH:mm:ss')"
                placement="top"
                v-for="(value, index) in progressPhotoArr"
                :key="index"
                color="#409eFF"
              >
                <el-card>
                  <h4>
                    <span>
                      <span>进程名：{{ value.pname }} </span>
                      <span
                        >别名：
                        <template
                          v-if="
                            value.FocusFormAlias && value.FocusFormAlias.length
                          "
                          ><label
                            v-for="(nitem, index) in value.FocusFormAlias"
                            :key="index"
                            >{{ index == 0 ? nitem : `、${nitem}` }}</label
                          ></template
                        >
                        <label v-else>无</label>
                      </span>
                      <span
                        >状态：
                        <template
                          v-if="
                            value.FocusFormStatus &&
                            value.FocusFormStatus.length
                          "
                          ><label
                            v-for="(nitem, index) in value.FocusFormStatus"
                            :key="index"
                            >{{ index == 0 ? nitem : `、${nitem}` }}</label
                          ></template
                        >
                        <label v-else>无</label>
                      </span>
                    </span>
                    <span
                      ><span>窗口名：{{ value.fname }}</span>
                    </span>
                    <span>
                      <span
                        >行为状态：{{
                          value.BehaviorStatus ? value.BehaviorStatus : "未知"
                        }}
                      </span>
                      <span
                        >鼠标点击速度：{{ value.MouseClickAverage }}次每分钟
                      </span>
                      <span>鼠标点击效率：{{ value.EfficiencyMStatus }}</span>
                      <span
                        >键盘输入速度：{{ value.KeysAverage }}次每分钟
                      </span>
                      <span>键盘输入效率：{{ value.EfficiencyKStatus }}</span>
                    </span>
                  </h4>
                  <el-image
                    style="max-width: 200px"
                    :src="cmurl + value.imgURL"
                    alt=""
                    :preview-src-list="[cmurl + value.imgURL]"
                  >
                  </el-image>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-if="name != 'staffDataPic'">
            <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
          </div>
        </template>
        <div class="empty-proccess-list" v-else>
          <img src="../../assets/img/emptyTask.png" alt="" />
          <p>暂无进程截图</p>
        </div>
      </div>
    </XModal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeStart: null,
      timeEnd: null,
      photoDis: false,
      progressPhotoArr: [],
      last: "",
      morePhoto: true,
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      }, //分页
    };
  },
  props: {
    selActiveTime: {
      type: String,
      default: null,
    },
    gid: {
      type: Number,
      default: null,
    },
    teamValue: {
      type: Number,
      default: null,
    },
    activeBar: {
      type: Object,
      default: function () {
        return {};
      },
    },
    stime: {
      type: Date | String,
      default: "",
    },
    etime: {
      type: Date | String,
      default: "",
    },
    uid: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: "memberDatatimeAxisPhoto",
    },
  },
  computed: {
    cmurl() {
      return process.env.VUE_APP_CMURL;
    },
  },
  components: {
    CPages: () => import("@/components/CPages"),
    XModal: () => import("@/components/XModal.vue"),
  },
  methods: {
    /**
     * 时间筛选
     */
    handleChange() {
      this.pageData.pageIndex = 1;
      this.getBarData();
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {
      this.pageData = val;
      this.getBarData();
    },
    dataInit() {
      Object.assign(this.$data, this.$options.data());
    },
    open() {
      this.$nextTick(() => {
        if (this.selActiveTime) {
          this.timeStart = this.selActiveTime;
          this.timeEnd = this.selActiveTime;
        } else {
          this.timeStart = this.stime;
          this.timeEnd = this.etime;
        }

        if (this.name == "staffDataPic") {
          this.progressPhotoArr = this.activeBar.fromList.map((m) => {
            return {
              fname: m.FocusFromName,
              imgURL: m.ImageName,
              pname: this.activeBar.name,
              time: m.ImageTime,
            };
          });
        } else {
          this.getBarData();
        }
      });
    },
    /**
     * 工作状态截图数据
     */
    getBarData() {
      if (this.name == "memberDatatimeAxisPhoto") {
        this.getProcessImgData();
      } else if (
        this.name == "allfoftwarepic" ||
        this.name == "allbehaviorpic"
      ) {
        this.getProcessImgWithFormData([this.activeBar.name]);
      } else if (this.name == "keywordfrequency") {
        this.getProcessImgWithFormData(
          this.activeBar.pname.map((m) => m.FocusFormName)
        );
      } else if (this.name == "behaviorPicList") {
        this.getUserBehaviorImg();
      }
    },
    getProcessImgData() {
      this.photoDis = true;
      this.loading = true;
      let params = {
        uid: this.uid,
        stime: this.timeStart.timeFormat("yyyy-MM-dd"),
        etime: this.timeEnd.timeFormat("yyyy-MM-dd"),
        // last: this.last,
        pageCount: this.pageData.pageSize,
        status: this.activeBar.name,
        teamId: this.teamValue,
        gid: this.gid,
        page: this.pageData.pageIndex,
      };
      this.$http
        .get("/General/GetProcessImg.ashx#", { params: params })
        .then((res) => {
          if (res.res == 0) {
            this.progressPhotoArr = res.data.data;
            this.pageData.totalNum = res.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
    getProcessImgWithFormData(val) {
      this.photoDis = true;
      this.loading = true;
      let params = {
        uid: this.uid,
        // stime: this.last ? this.last : this.stime,
        stime: this.selActiveTime
          ? this.selActiveTime.timeFormat("yyyy-MM-dd 00:00:01")
          : this.timeStart.timeFormat("yyyy-MM-dd"),
        etime: this.selActiveTime
          ? this.selActiveTime.timeFormat("yyyy-MM-dd 23:59:59")
          : this.timeEnd.timeFormat("yyyy-MM-dd"),
        pageCount: this.pageData.pageSize,
        pname: val,
        teamId: this.teamValue,
        page: this.pageData.pageIndex,
      };
      this.$http
        .post("/General/GetProcessImgWithForm.ashx#", params)
        .then((res) => {
          if (res.res == 0) {
            this.progressPhotoArr = res.data.data;
            this.pageData.totalNum = res.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
    getUserBehaviorImg() {
      this.loading = true;
      let params = {
        behavior: this.activeBar.name,
        stime: this.selActiveTime
          ? this.selActiveTime.timeFormat("yyyy-MM-dd 00:00:01")
          : this.timeStart.timeFormat("yyyy-MM-dd 00:00:01"),
        etime: this.selActiveTime
          ? this.selActiveTime.timeFormat("yyyy-MM-dd 23:59:59")
          : this.timeEnd.timeFormat("yyyy-MM-dd 23:59:59"),
        pageCount: this.pageData.pageSize,
        teamId: this.teamValue,
        page: this.pageData.pageIndex,
        uid: this.uid,
      };
      this.$http
        .post("/User/Work/GetUserBehaviorImg.ashx", params)
        .then((res) => {
          if (res.res == 0) {
            this.progressPhotoArr = res.data.data;
            this.pageData.totalNum = res.data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="less" scoped="scoped">
.progressCom {
  /deep/.ctn {
    height: calc(100% - 6rem);
    padding-bottom: 0px;
  }
  // /deep/.tit {
  //   display: flex;
  //   flex-direction: row;
  //   .sel {
  //     position: initial;
  //   }
  // }
  .content_modal {
    height: 100%;
    .time_line {
      overflow: auto;
      height: calc(100% - 35px);
    }
  }
}

.work-timeAxis {
  box-sizing: border-box;
  padding: 2rem;
  overflow: auto;

  /deep/.el-timeline-item__timestamp {
    font-size: 1.6rem;
    color: #333;
  }

  /deep/.el-collapse-item__wrap {
    border: none;
  }

  /deep/.el-timeline {
    padding: 2.5rem 2rem;

    img {
      cursor: pointer;
    }
  }

  /deep/.el-timeline-item__content {
    color: #999;
  }

  h4 {
    display: flex;
    font-size: 1.6rem;
    color: #303133;
    flex-direction: column;

    span {
      margin-right: 2rem;
      line-height: 1;
      margin-bottom: 1rem;
    }
  }
  .header_sel {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #606266;
    font-size: 1.4rem;
    .el-date-editor {
      width: 162px;
    }
  }
}

.empty-proccess-list {
  img {
    width: 245px;
    height: 245px;
    margin: 4rem auto;
    display: block;
  }

  p {
    font-size: 1.6rem;
    color: #6d6d6d;
    text-align: center;
  }
}

@media only screen and (max-width: 1024px) {
  .work-timeAxis {
    padding: 0;
  }
}
</style>
