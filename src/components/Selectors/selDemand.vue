<!--需求选择器-->
<template>
  <div class="selDemand">
    <div class="sel_data">
      <el-tag
        @click="$modal.show('selDemandModal')"
        class="tag"
        size="small"
        v-if="selDemand.demandL || selDemand.demandM || selDemand.demandR"
        >{{ selDemand.demandL ? selDemand.demandL.Name : ""
        }}<el-divider direction="vertical" v-if="selDemand.demandM"></el-divider
        >{{ selDemand.demandM ? selDemand.demandM.Name : ""
        }}<el-divider direction="vertical" v-if="selDemand.demandR"></el-divider
        >{{ selDemand.demandR ? selDemand.demandR.Name : "" }}</el-tag
      >
      <div class="dem_add" @click="openModal" v-else>
        <slot name="button"><i class="hiFont hi-add"></i></slot>
      </div>
    </div>
    <XModal
      name="selDemandModal"
      width="1100"
      height="600"
      title="选择需求"
      :showCrossBtn="true"
      confirmBtnText="确定"
      cancelBtnText="取消"
      @onConfirm="confirm"
    >
      <div class="content">
        <el-row>
          <el-col :span="8"
            ><div class="dem_left">
              <div class="title">
                <h2>需求分类</h2>
                <el-input
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="searchL"
                  @keyup.native.enter="onEnterPressL"
                >
                </el-input>
              </div>
              <div
                class="check_group"
                v-loading="loadingL"
                v-infinite-scroll="loadL"
                :infinite-scroll-disabled="busyL"
                infinite-scroll-distance="10"
              >
                <el-checkbox-group
                  v-if="demandL && demandL.length"
                  v-model="checkListL"
                  @change="handleChange($event, 1)"
                >
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in demandL"
                    :key="item.Id"
                    ><tooltip
                      :content="item.Name"
                      :ref="`demandL-${index}`"
                      width="300px"
                    ></tooltip
                  ></el-checkbox>
                </el-checkbox-group>
                <div class="empty" v-else>暂无数据</div>
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div class="dem_middle">
              <div class="title">
                <h2>需求选择</h2>
                <el-input
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="searchM"
                  @keyup.native.enter="onEnterPressM"
                >
                </el-input>
                <el-select
                  v-model="isProLeaderSelect"
                  class="task_select"
                  style="width:100px"
                  placeholder="换用户视图"
                  v-if="isProLeader"
                  @change="changeisProLeader"
                >
                  <el-option label="管理员视图" :value="false"></el-option>
                  <el-option label="个人视图" :value="true"></el-option>
                </el-select>
              </div>
              <div
                class="check_group"
                v-loading="loadingM"
                v-infinite-scroll="loadM"
                infinite-scroll-disabled="busyM"
                infinite-scroll-distance="30"
              >
                <el-checkbox-group
                  v-if="demandM && demandM.length"
                  v-model="checkListM"
                  @change="handleChange($event, 2)"
                >
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in demandM"
                    :key="item.Id"
                    ><tooltip
                      :content="item.Name"
                      :ref="`demandM-${index}`"
                      width="300px"
                    ></tooltip
                  ></el-checkbox>
                </el-checkbox-group>
                <div class="empty" v-else>暂无数据</div>
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div class="dem_right">
              <div class="title">
                <h2>阶段选择</h2>
                <!-- <el-input
                  placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="searchR"
                  @keyup.native.enter="onEnterPressR"
                >
                </el-input> -->
              </div>
              <div class="check_group" v-loading="loadingR">
                <el-checkbox-group
                  v-if="demandR && demandR.length"
                  v-model="checkListR"
                  @change="handleChange($event, 3)"
                >
                  <el-checkbox
                    :label="item"
                    v-for="(item, index) in demandR"
                    :key="index"
                    ><tooltip
                      :content="item.Name"
                      :ref="`demandR-${index}`"
                      width="300px"
                    ></tooltip
                  ></el-checkbox>
                </el-checkbox-group>
                <div class="empty" v-else>暂无数据</div>
              </div>
            </div></el-col
          >
        </el-row>
      </div>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    tooltip: () => import("@/components/textTooltip"),
  },
  props: {
    eid: null,
    // //需求分类
    // classification: {
    //   type: String | Number,
    //   default: null,
    // },
    // //需求
    // demand: {
    //   type: String | Number,
    //   default: null,
    // },
    // //步骤
    // step: {
    //   type: String | Number,
    //   default: null,
    // },
  },
  data() {
    return {
      searchL: null,
      searchM: null,
      searchR: null,
      checkListL: [],
      checkListM: [],
      checkListR: [],
      selDemand: {
        demandL: null,
        demandM: null,
        demandR: null,
      },
      pageDataL: {
        pageIndex: 1,
        pageSize: 20,
        pageNum: 0,
      }, //分页
      pageDataM: {
        pageIndex: 1,
        pageSize: 20,
        pageNum: 0,
      }, //分页
      busyL: true,
      busyM: true,
      loadingL: false,
      loadingM: false,
      loadingR: false,
      demandL: [],
      demandM: [],
      demandR: [],
      /*
       *切换视图
       */
      isProLeader: null,
      isProLeaderSelect: false,
    };
  },
  created() {
    this.isProLeader = this.$store.state.isProLeader;
    // this.isProLeaderSelect = this.isProLeader;
  },
  mounted() {},
  methods: {
    /*
     * 切换视图
     */
    changeisProLeader() {
      this.demandM = [];
      this.demandR = [];
      if (this.checkListL.length) {
        this.getDemand();
      }
    },
    /**
     * 搜索
     */
    onEnterPressL() {
      this.pageDataL.pageIndex = 1;
      this.demandL = [];
      this.getDemandClassify();
    },
    onEnterPressM() {
      this.pageDataM.pageIndex = 1;
      this.demandM = [];
      if (this.checkListL.length) {
        this.getDemand();
      }
    },
    /**
     * 打开弹窗
     */
    openModal() {
      this.pageDataL.pageIndex = 1;
      this.pageDataM.pageIndex = 1;
      this.demandL = [];
      this.demandR = [];
      this.demandM = [];
      this.isProLeaderSelect = false;
      this.searchL = null;
      this.searchM = null;
      this.searchR = null;
      this.getDemandClassify();
      this.$modal.show("selDemandModal");
    },
    /**
     * 分页滚动
     */
    loadL() {
      this.busyL = true;
      this.pageDataL.pageIndex++;
      this.getDemandClassify();
    },
    loadM() {
      this.busyM = true;
      this.pageDataM.pageIndex++;
      this.getDemand();
    },
    /**
     * 获取需求分类
     */
    getDemandClassify() {
      if (!this.eid) {
        return;
      }
      this.loadingL = true;
      const data = {
        eid: JSON.parse(this.eid),
        page: this.pageDataL.pageIndex,
        limit: this.pageDataL.pageSize,
        search: this.searchL,
      };
      this.$http
        .post("/Work/Project/ChooseDemand/DemandClassify.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.demandL.push(...resp.data.Datas);
            if (resp.data.PageCount == this.pageDataL.pageIndex) {
              this.busyL = true;
            } else {
              this.busyL = false;
            }
          }
        })
        .finally(() => (this.loadingL = false));
    },
    /**
     * 获取需求
     */
    getDemand() {
      this.loadingM = true;
      const data = {
        dcId: this.checkListL[0].Id,
        page: this.pageDataM.pageIndex,
        limit: this.pageDataM.pageSize,
        search: this.searchM,
        userView: this.isProLeaderSelect,
        eId: this.eid,
      };
      this.$http
        .post("/Work/Project/ChooseDemand/Demand.ashx", data)
        .then((resp) => {
          if (resp.res == 0) {
            this.demandM.push(...resp.data.Datas);
            if (resp.data.Datas.length < this.pageDataL.pageSize) {
              this.busyM = true;
            } else {
              this.busyM = false;
            }
          }
        })
        .finally(() => {
          this.loadingM = false;
        });
    },
    /**
     * 选择框选项改变
     */
    handleChange(val, type) {
      //控制单选
      if (type == 1) {
        this.checkListL = val.filter((m, index) => index == val.length - 1);
        this.demandR = [];
        if (this.checkListL.length) {
          this.pageDataM.pageIndex = 1;
          this.demandM = [];
          this.getDemand();
        } else {
          this.demandM = [];
        }
      } else if (type == 2) {
        this.checkListM = val.filter((m, index) => index == val.length - 1);
        if (this.checkListM.length) {
          this.demandR = [];
          this.demandR.push(...this.checkListM[0].Steps);
          console.log(this.demandR);
        } else {
          this.demandR = [];
        }
      } else if (type == 3) {
        this.checkListR = val.filter((m, index) => index == val.length - 1);
      }
    },
    /**
     * 确认
     */
    confirm() {
      this.selDemand.demandL = this.checkListL.length
        ? this.checkListL[0]
        : null;
      this.selDemand.demandM = this.checkListM.length
        ? this.checkListM[0]
        : null;
      this.selDemand.demandR = this.checkListR.length
        ? this.checkListR[0]
        : null;
      this.$modal.hide("selDemandModal");
      this.$emit("demandConfirm", this.selDemand);
    },
  },
};
</script>
<style lang="less" scoped>
.selDemand {
  .sel_data {
    display: flex;
    flex-direction: row;
    align-items: center;
    .tag {
      cursor: pointer;
      height: auto;
      white-space: pre-wrap;
    }
  }
  .dem_add {
    margin-left: 5px;
    .hi-add {
      background-color: #c3c3c3;
      height: 2rem;
      width: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      border-radius: 10%;
      cursor: pointer;
      margin-bottom: 0.5rem;
      padding: 0.1rem;
    }

    .hi-add:hover {
      background-color: #d7d7d7;
      color: #f8f8f8;
    }
  }
  /deep/.modal {
    .ctn {
      overflow-y: hidden;
      padding-bottom: 5px;
    }
    .tit {
      border-bottom: 2px solid #d7d7d7;
    }
  }
  .content,
  .el-row,
  .el-col,
  .dem_left,
  .dem_middle,
  .dem_right {
    height: 100%;
  }
  .content {
    .dem_left,
    .dem_middle,
    .dem_right {
      .title {
        padding: 5px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        h2 {
          font-weight: bold;
          margin-right: 14px;
          flex-shrink: 0;
        }
        /deep/.el-input {
          width: 220px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            border-radius: 34px;
            background: #f6f6f6;
          }
        }
      }
      .task_select {
        /deep/.el-input {
          width: 100px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            border-radius: 34px;
            background: #f6f6f6;
          }
        }
      }
      .check_group {
        margin-top: 3px;
        padding: 0 16px;
        height: calc(100% - 43px);
        overflow-y: scroll;
        .el-checkbox-group {
          display: flex;
          flex-direction: column;
          /deep/.el-checkbox {
            line-height: 32px;
            display: flex;
            margin-bottom: 10px;
            margin-right: 0;
            .el-checkbox__label {
              white-space: normal;
            }
          }
        }
        .empty {
          text-align: center;
          margin-top: 30px;
        }
      }
    }
    .dem_left {
      border-right: 2px solid #d7d7d7;
    }
    .dem_middle {
      border-right: 2px solid #d7d7d7;
    }
  }
}
</style>
