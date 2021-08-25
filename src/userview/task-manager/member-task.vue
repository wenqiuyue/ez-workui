<template>
  <div class="member-task">
    <BaseView :title_name="'考勤列表'" :load="loading">
      <div slot="panes">
        <el-select
          v-model="teamValue"
          filterable
          placeholder="请先选择团队"
          v-if="isShowTeam"
        >
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
      <TaskList slot="content"> </TaskList>
    </BaseView>
  </div>
</template>
<script>
export default {
  components: {
    BaseView: () => import("@/components/BaseView"),
    TaskList: () => import("./task-list"),
  },
};
</script>
<style lang="less" scoped>
.member-task {
}
</style>
