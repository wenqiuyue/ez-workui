<template>
  <XModal
    class="special_modal"
    ref="modal"
    name="special"
    :title="`${selSpecialDay}的排班`"
    width="70%"
    height="95%"
    showCrossBtn
  >
    <div class="specialSchedulingSet">
      <div class="set_card">
        <div class="tag_item_list">
          <div class="tag_item t_i_bg1" style="width: 18rem"></div>
          <div class="tag_item t_i_bg2" style="width: 17rem"></div>
          <div class="tag_item t_i_bg3" style="width: 16rem">
            <div>特殊排班设置</div>
          </div>
          <div class="save_btn">
            <el-button type="success" size="small">保 存</el-button>
            <el-button type="warning" size="small">清 除</el-button>
          </div>
        </div>
        <div class="set_form">
          <el-form ref="form" :model="specialForm" label-width="140px">
            <el-divider content-position="left">上班</el-divider>
            <el-form-item label="时区：">
              <el-select
                v-model="specialForm.work.timeZone"
                placeholder="请选择时区"
              >
                <el-option
                  v-for="item in timeZoneOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="一天内的时间区间：">
              <ul>
                <li
                  v-for="(interval, intervalInd) in specialForm.work
                    .timeInterval"
                  :key="intervalInd"
                >
                  <el-time-picker
                    v-model="interval.start"
                    placeholder="开始时间"
                  >
                  </el-time-picker>
                  -
                  <el-time-picker v-model="interval.end" placeholder="结束时间">
                  </el-time-picker>
                  <el-button type="text" @click="cancleInterval(1, intervalInd)"
                    >清除</el-button
                  >
                </li>
              </ul>
              <el-button type="text" @click="addTimeInterval(1)"
                >添加时间区间</el-button
              >
            </el-form-item>
            <el-divider content-position="left">假期</el-divider>
            <el-form-item label="时区：">
              <el-select
                v-model="specialForm.vacation.timeZone"
                placeholder="请选择时区"
              >
                <el-option
                  v-for="item in timeZoneOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="一天内的时间区间：">
              <ul>
                <li
                  v-for="(interval, intervalInd) in specialForm.vacation
                    .timeInterval"
                  :key="intervalInd"
                >
                  <el-time-picker
                    v-model="interval.start"
                    placeholder="开始时间"
                  >
                  </el-time-picker>
                  -
                  <el-time-picker v-model="interval.end" placeholder="结束时间">
                  </el-time-picker>
                  <el-button type="text" @click="cancleInterval(2, intervalInd)"
                    >清除</el-button
                  >
                </li>
              </ul>
              <el-button type="text" @click="addTimeInterval(2)"
                >添加时间区间</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </XModal>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
  },
  props: {
    //要设置的天
    selSpecialDay: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      timeZoneOptions: [
        {
          value: 1,
          name: "GMT+8",
        },
      ], //时区选项
      specialForm: {
        work: {
          timeZone: 1, //时区
          timeInterval: [],
        },
        vacation: {
          timeZone: 1, //时区
          timeInterval: [],
        },
      },
    };
  },
  methods: {
    /**
     * 清除时间区间
     */
    cancleInterval(type, ind) {
      if (type == 1) {
        this.specialForm.work.timeInterval =
          this.specialForm.work.timeInterval.filter((m, index) => ind != index);
      } else {
        this.specialForm.vacation.timeInterval =
          this.specialForm.vacation.timeInterval.filter(
            (m, index) => ind != index
          );
      }
    },
    /**
     * 添加时间区间
     */
    addTimeInterval(type) {
      if (type == 1) {
        this.specialForm.work.timeInterval.push({
          start: null,
          end: null,
        });
      } else {
        this.specialForm.vacation.timeInterval.push({
          start: null,
          end: null,
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.special_modal {
  /deep/.modal {
    .ctn {
      height: calc(100% - 60px);
    }
  }
}
.specialSchedulingSet {
  height: 100%;
  background: #ffffff;
  overflow: auto;
  .set_card {
    position: relative;

    // margin-bottom: 6px;
    .tag_item_list {
      border-bottom: 2px dashed rgb(83, 168, 255);
      height: 3.5rem;
      .save_btn {
        position: absolute;
        right: 0;
        .el-button {
          padding: 5px 15px;
          font-size: 20px;
        }
      }
      .tag_item {
        width: 11rem;
        height: 3.3rem;
        line-height: 3.4rem;
        transform: skew(25deg);
        -webkit-transform: skew(30deg);
        -moz-transform: skew(30deg);
        position: absolute;
        left: -3rem;
        div {
          transform: skew(-25deg);
          -webkit-transform: skew(-30deg);
          -moz-transform: skew(-30deg);
          width: calc(100% - 3rem);
          text-align: center;
          color: #ffffff;
          font-size: 1.4rem;
          float: right;
        }
      }
      .t_i_bg1 {
        background: rgb(198, 226, 255);
      }
      .t_i_bg2 {
        background: rgb(140, 197, 255);
      }
      .t_i_bg3 {
        background: rgb(83, 168, 255);
      }
    }
    .set_mem {
      padding: 18px 6px;
    }
    .set_form {
      padding: 3px 6px;
      .el-form-item {
        ul {
          li {
            margin-bottom: 10px;
            .el-button {
              margin-left: 10px;
            }
          }
          li:last-child {
            margin-bottom: 0px;
          }
        }
      }
      .el-form-item:last-child {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
