<template>
  <Location
    :readonly="readonly"
    width="295"
    height="510"
    phoneFull
    @beforeOpen="beforeOpen"
  >
    <transition slot="content">
      <div v-loading="loading">
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="{ Name, UsId } of list"
            :label="UsId"
            :key="UsId"
            >{{ Name }}</el-checkbox
          >
        </el-checkbox-group>
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
  },
  data: () => ({
    list: null,
    name: null,
    loading: false,
    // 选中的成员
    checkedCities: [],
  }),
  methods: {
    async beforeOpen() {
      if (this.list === null) await this.queryData();
    },
    async queryData() {
      // this.loading = true;
      // try {
      //   const { res, data } = this.$http.post("/General/memberSelector.ashx", {
      //     name: this.name,
      //   });

      //   if (res === 0) this.list = data;
      // } catch(e) {console.warn(e)}
      // this.loading = false;
    },
    handleCheckedCitiesChange() {},
  },
};
</script>
