<!-- 进度条截图 -->
<template>
  <div v-if="activeBar" class="progressCom">
    <XModal
      width="60%"
      height="80%"
      :name="name"
      :showCrossBtn="true"
      :title="
        activeBar.name +
        `${name == 'memberDatatimeAxisPhoto' ? '类的' : '的'}截图`
      "
      class="work-timeAxis"
      @beforeOpen="dataInit"
      @opened="open()"
    >
      <div
        style="overflow: auto; height: 100%"
        :infinite-scroll-disabled="photoDis"
        v-infinite-scroll="loadMoreShot"
        v-loading="photoLoading"
        infinite-scroll-distance="10"
      >
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
                      v-if="value.FocusFormAlias && value.FocusFormAlias.length"
                      ><label
                        v-for="(nitem, index) in value.FocusFormAlias"
                        :key="index"
                        >{{ index == 0 ? nitem : `、${nitem}` }}</label
                      ></template
                    >
                    <label v-else>无</label>
                  </span>
                </span>
                <span
                  ><span>窗口名：{{ value.fname }}</span>
                  <span
                    >状态：
                    <template
                      v-if="
                        value.FocusFormStatus && value.FocusFormStatus.length
                      "
                      ><label
                        v-for="(nitem, index) in value.FocusFormStatus"
                        :key="index"
                        >{{ index == 0 ? nitem : `、${nitem}` }}</label
                      ></template
                    >
                    <label v-else>无</label>
                  </span></span
                >
              </h4>
              <img
                :src="cmurl + value.imgURL"
                alt=""
                style="max-width: 200px"
                :preview="index"
              />
            </el-card>
          </el-timeline-item>
          <!-- <p v-if="!morePhoto && progressPhotoArr.length" class="g-loaded">
            已加载全部
          </p> -->
        </el-timeline>
        <div class="empty-proccess-list" v-if="progressPhotoArr.length == 0">
          <img src="@/assets/img/emptyTask.png" alt="" />
          <p>暂无进程截图</p>
        </div>
        <div v-if="progressPhotoArr.length > 0" class="load-status">
          <div class="g-loading" v-if="loading">
            <i class="el-icon-loading"></i>
            加载中...
          </div>
          <div class="g-loaded" v-if="!morePhoto">已全部加载</div>
        </div>
      </div>
    </XModal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      photoDis: false,
      photoLoading: false,
      progressPhotoArr: [],
      last: "",
      morePhoto: true,
      loading: false,
    };
  },
  props: {
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
    XModal: () => import("@/components/XModal.vue"),
  },
  methods: {
    loadMoreShot() {
      //加载工作条截图
      if (this.morePhoto && this.name != "staffDataPic") {
        this.getBarData();
      }
    },
    dataInit() {
      Object.assign(this.$data, this.$options.data());
    },
    open() {
      this.$nextTick(() => {
        console.log(this.name);
        if (this.name == "staffDataPic") {
          this.progressPhotoArr = this.activeBar.fromList.map((m) => {
            return {
              fname: m.FocusFromName,
              imgURL: m.ImageName,
              pname: this.activeBar.name,
              time: m.ImageTime,
            };
          });
          console.log(this.activeBar);
        } else {
          this.photoLoading = true;
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
      } else if (this.name == "allfoftwarepic") {
        this.getProcessImgWithFormData([this.activeBar.name]);
      } else if (this.name == "keywordfrequency") {
        this.getProcessImgWithFormData(
          this.activeBar.pname.map((m) => m.FocusFormName)
        );
      }
    },
    getProcessImgData() {
      this.photoDis = true;
      this.loading = true;
      let params = {
        uid: this.uid,
        stime: this.stime,
        etime: this.etime,
        last: this.last,
        pageCount: 15,
        status: this.activeBar.name,
        teamId: this.teamValue,
      };
      this.$http
        .get("/General/GetProcessImg.ashx", { params: params })
        .then((res) => {
          if (res.res == 0) {
            this.photoLoading = false;
            if (res.data.length) {
              this.photoDis = false;
              this.progressPhotoArr = this.progressPhotoArr.concat(res.data);
              this.last = res.data[res.data.length - 1].time;
            } else {
              this.morePhoto = false;
              this.photoDis = true;
            }
            this.loading = false;
          }
        });
    },
    getProcessImgWithFormData(val) {
      this.photoDis = true;
      this.loading = true;
      let params = {
        uid: this.uid,
        stime: this.last ? this.last : this.stime,
        etime: this.etime,
        pageCount: 15,
        pname: val,
        teamId: this.teamValue,
      };
      this.$http
        .post("/General/GetProcessImgWithForm.ashx", params)
        .then((res) => {
          if (res.res == 0) {
            this.photoLoading = false;
            if (
              res.data.length > 1 ||
              (res.data.length == 1 && !this.progressPhotoArr.length)
            ) {
              this.photoDis = false;
              this.progressPhotoArr = this.progressPhotoArr.concat(res.data);
              this.last = res.data[0].time;
              this.morePhoto = true;
            } else {
              this.morePhoto = false;
              this.photoDis = true;
            }
            this.loading = false;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped="scoped">
.progressCom {
  /deep/.ctn {
    height: calc(100% - 6rem);
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
