<template>
  <div class="scheduling">
    <BaseView :title_name="selRow.Name" :load="loading">
      <div slot="panes" @keyup.enter="getMember">
        <el-input v-model="userSearch" placeholder="请输入成员搜索"></el-input>
        <div>
          <!--XBB: 分组折叠的话直接照搬以下格式 -->
          <ul class="infinite-list" v-if="memberGroup && memberGroup.length">
            <li
              :class="{ activeList: generaId == null }"
              @click="liClick(null)"
            >
              <span>团队考勤</span>
            </li>
            <li
              v-for="(obj, index) in memberGroup"
              :key="index"
              :class="{ activeList: generaId === obj.UserId }"
              @click="liClick(obj)"
            >
              <img :src="imgChange(obj.Picture)" />
              <span>{{ obj.Name }}</span>
            </li>
          </ul>
          <ul v-else>
            <li>没有查到数据</li>
          </ul>
        </div>
      </div>
      <div slot="content" class="s_content">
        <div class="screen">
          <div class="s_item"></div>
          <el-button type="primary" size="medium" @click="batchSettings"
            >批量设置</el-button
          >
        </div>
        <div class="set_con">
          <SchedulingSet
            :timeZonesOptions="timeZonesOptions"
            :teamValue="selRow.Id"
            :generaId="generaId"
            :wageOptions="wageOptions"
          ></SchedulingSet>
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
        :typePage="'batch'"
        :teamValue="selRow.Id"
        :timeZonesOptions="timeZonesOptions"
        :generaId="generaId"
        :wageOptions="wageOptions"
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
      userSearch: null, // 成员
      loading: false,
      memberGroup: [], //成员列表
      generaId: null, //人员Index
      timeZonesOptions: [], //时区列表
      wageOptions: [], //时薪选项
    };
  },
  mounted() {
    this.getMember();
    this.getTimeZones();
    this.getWages();
  },
  methods: {
    imgChange,
    /**
     * 获取时区
     */
    getTimeZones() {
      this.$http
        .post("/Teams/GetSystemTimeZones.ashx", { searchText: null })
        .then((resp) => {
          if (resp.res == 0) {
            this.timeZonesOptions = resp.data;
          }
        });
    },
    /**
     * 获取时薪
     */
    getWages() {
      this.$http
        .post("/Teams/MemberWage/GetMemberWageType.ashx", {
          teamId: this.selRow.Id,
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.wageOptions = resp.data.Data;
          }
        });
    },
    /**
     * 批量设置
     */
    batchSettings() {
      this.$modal.show("batchSet");
    },
    // 左侧li点击事件
    liClick(obj) {
      if (obj) {
        this.generaId = obj.UserId;
      } else {
        this.generaId = null;
      }
    },
    getMember() {
      const data = {
        teamId: this.selRow.Id,
        searchText: this.userSearch,
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
