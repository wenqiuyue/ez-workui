<template>
  <div class="member-task">
    <BaseView :title_name="'成员列表'">
      <div slot="panes" style="height: 100%">
        <el-select v-model="teamValue" filterable placeholder="请先选择团队">
          <el-option
            v-for="item in teamOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          >
          </el-option>
        </el-select>
        <!--XBB: 分组折叠的话直接照搬以下格式 -->
        <ul class="infinite-list" v-if="memberGroup && memberGroup.length">
          <li :class="{ activeList: generaId === null }" @click="liClick(null)">
            <span>所有成员</span>
          </li>
          <li
            v-for="(obj, index) in memberGroup"
            :key="index"
            :class="{ activeList: generaId === obj.UserId }"
            @click="liClick(obj.UserId)"
          >
            <img :src="imgChange(obj.Picture)" />
            <span>{{ obj.Name }}</span>
          </li>
        </ul>
      </div>
      <TaskList
        slot="content"
        :isMember="true"
        ref="tasklist"
        :teamId="teamValue"
        :userId="generaId"
        :teamOptions="teamOptions"
      >
      </TaskList>
    </BaseView>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    TaskList: () => import("./task-list"),
  },
  props: {
    teamOptions: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      memberGroup: [],
      teamValue: null, //选择的团队
      generaId: null, //人员Id
    };
  },
  watch: {
    //团队切换
    teamValue(val, oval) {
      if (val && val != oval) {
        this.getMember();
      }
    },
  },
  methods: {
    imgChange,
    // 左侧li点击事件
    liClick(index) {
      this.generaId = index;
    },
    /**
     * 获取成员
     */
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
  },
};
</script>
<style lang="less" scoped>
.member-task {
  height: 100%;
  #module_bv {
    padding: 0;
  }
  .infinite-list {
    margin-top: 5px;
    height: calc(100% - 40px);
    overflow-y: auto;
  }
}
</style>
