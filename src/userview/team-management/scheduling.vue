<template>
  <div class="scheduling">
    <BaseView :title_name="selRow.Name" :load="loading">
      <div slot="panes">
        <el-input v-model="userSearch" placeholder="请输入成员搜索"></el-input>
        <div>
          <!--XBB: 分组折叠的话直接照搬以下格式 -->
          <ul class="infinite-list">
            <li
              v-for="(obj, index) in memberGroup"
              :key="index"
              :class="{ activeList: generaId === obj.Id }"
              @click="liClick(obj)"
            >
              <img :src="imgChange(obj.Picture)" />
              <span>{{ obj.Name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="content" class="s_content">
        <div class="screen">
          <div class="s_item">
            <!-- <span class="title">月份：</span>
            <el-date-picker
              size="medium"
              v-model="screenMonth"
              type="month"
              placeholder="选择月"
              format="yyyy年MM月"
            >
            </el-date-picker> -->
          </div>
          <el-button type="primary" size="medium" @click="batchSettings"
            >批量设置</el-button
          >
        </div>
        <div class="set_con">
          <SchedulingSet :screenMonth="screenMonth"></SchedulingSet>
        </div>
      </div>
    </BaseView>
    <XModal
      class="batch_modal"
      ref="modal"
      name="batchSet"
      title="批量设置"
      width="70%"
      height="95%"
      showCrossBtn
    >
      <SchedulingSet
        :screenMonth="screenMonth"
        :typePage="'batch'"
        :teamValue="selRow.Id"
      ></SchedulingSet>
    </XModal>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    SchedulingSet: () => import("./schedulingSet"),
    XModal: () => import("@/components/XModal"),
  },
  props: {
    //团队信息
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      screenMonth: new Date(),
      userSearch: null, // 成员
      loading: false,
      memberGroup: [], //成员列表
      generaId: null, //人员Index
    };
  },
  mounted() {
    this.getMember();
  },
  methods: {
    imgChange,
    /**
     * 批量设置
     */
    batchSettings() {
      this.$modal.show("batchSet");
    },
    // 左侧li点击事件
    liClick(obj) {
      this.generaId = obj.Id;
      this.memb = JSON.parse(JSON.stringify(obj));
    },
    getMember() {
      const data = {
        teamId: this.selRow.Id,
      };
      this.$http
        .post("/Management/TeamManagement/MenberSelects.ashx", data)
        .then((res) => {
          if (res.res == 0) {
            this.memberGroup = res.data;
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.scheduling {
  height: calc(100% - 47px);
  /deep/#module_bv {
    border-top: 1px solid #e4e7ed;
    padding: 0;
  }
  .s_content {
    height: 100%;
    .screen {
      background: #ffffff;
      padding: 2px 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .s_item {
        margin-right: 6px;
        .title {
          font-size: 13px;
          font-weight: bold;
          color: #606266;
        }
        .el-date-editor {
          border: 1px solid #ebeef5;
          border-radius: 4px;
        }
      }
    }
    .set_con {
      margin-top: 3px;
      height: calc(100% - 45px);
    }
  }
  .batch_modal {
    /deep/.modal {
      .ctn {
        height: calc(100% - 60px);
      }
    }
  }
}
</style>
