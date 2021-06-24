<template>
  <Location
    :readonly="readonly"
    width="295"
    height="510"
    phoneFull
    @beforeOpen="beforeOpen"
    ref="location"
  >
    <transition slot="content">
      <div v-loading="loading" class="root">
        <div class="top">
          <el-input
            placeholder="请输入成员名称"
            prefix-icon="el-icon-search"
            v-model="name"
            @keydown.enter.native="queryData()"
          />
        </div>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
          v-if="multiple"
        >
          <el-checkbox
            v-for="{ Name, UsId, Picture, Name_Pinyin } of list"
            :label="sb({ Name, UsId, Picture, Name_Pinyin })"
            :key="UsId"
          >
            <el-avatar :src="Picture" :size="28">{{ Name[0] }}</el-avatar>
            <span>{{ Name }}</span>
          </el-checkbox>
        </el-checkbox-group>
        <el-radio-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
          v-else
        >
          <el-radio
            v-for="{ Name, UsId, Picture, Name_Pinyin } of list"
            :label="sb({ Name, UsId, Picture, Name_Pinyin })"
            :key="UsId"
          >
            <el-avatar :src="Picture" :size="28">{{ Name[0] }}</el-avatar>
            <span>{{ Name }}</span>
          </el-radio>
        </el-radio-group>
        <div class="btm">
          <el-button type="info" @click="closeLocation">取消</el-button>
          <el-button type="primary" @click="confirmLocation">确认</el-button>
        </div>
      </div>
    </transition>
    <template #LocationButton>
      <slot name="button" />
    </template>
  </Location>
</template>

<script>
import Location from "@/components/Location";

export default {
  components: {
    Location,
  },
  props: {
    defaultData: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    allCheckbox: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Object,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    list: null,
    name: null,
    loading: false,
    // 选中的成员
    checkedCities: [],
  }),
  beforeDestroy() {
    this.$refs.location.isShow(false);
  },
  methods: {
    async beforeOpen() {
      if (this.list === null) await this.queryData();
    },
    async queryData() {
      this.loading = true;
      try {
        const { res, data } = await this.$http.post(
          "/General/memberSelector.ashx",
          {
            name: this.name,
          }
        );

        if (res === 0) this.list = data;
      } catch {}
      this.loading = false;
    },
    handleCheckedCitiesChange() {},
    closeLocation() {
      this.$refs.location.isShow(false);
    },
    confirmLocation() {
      this.$refs.location.isShow(false);
      this.$emit(
        "confirm",
        this.multiple ? this.checkedCities : [this.checkedCities]
      );
    },
    sb(data) {
      return JSON.stringify(data);
    },
  },
};
</script>


<style lang="less" scoped>
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  > .top {
    padding: 18px;
    border-bottom: 1px solid #eee;
  }
  > .el-checkbox-group,
  .el-radio-group {
    flex: 1;
    overflow: auto;
    width: 100%;
    > .el-checkbox,
    .el-radio {
      display: flex;
      align-items: center;
      margin: 16px 24px;
      /deep/ .el-checkbox__label,
      /deep/ .el-radio__label {
        display: flex;
        align-items: center;
        width: 100%;

        > .el-avatar {
          + span {
            margin-left: 8px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 16px;
            flex: 1;
          }
        }
      }
    }
  }
  > .btm {
    padding: 26px 18px;
    display: flex;
    border-top: 1px solid #eee;

    > button {
      flex: 1;
    }
  }
}
</style>