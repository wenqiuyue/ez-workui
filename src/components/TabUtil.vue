<!-- 
 	@Description: 选项卡组件
 	@Author:zxg 
 	@Params:
 	@Return: emit('change') 点击的选项卡名称
 	@Date:2019-11-26
 -->
<template>
  <div class="tab_flex">
    <div
      v-for="(item, index) in Arrays"
      :key="index"
      v-if="Arrays.length !== 0"
    >
      <div
        class="el-select"
        @click="switchTab(index, item)"
        :class="{ tab_on: isTabOn === index }"
      >
        <span>{{ item.name }}</span
        ><i v-if="item.value || item.value == 0">{{ item.value }}</i>
      </div>
    </div>
    <div
      v-for="(item, index) in options"
      :key="index"
      v-if="options.length !== 0"
    >
      <div v-if="item instanceof Array">
        <el-select
          v-model="value"
          placeholder="筛选"
          @change="change_select($event, index)"
          :class="{ tab_on: isTabOn === index }"
        >
          <el-option
            v-for="(t, i) in item"
            :key="i"
            :value="t"
            :label="t"
            style="text-align: center"
          >
          </el-option>
        </el-select>
      </div>
      <div
        class="el-select"
        v-else
        @click="tab_click(index, item)"
        :class="{ tab_on: isTabOn === index }"
      >
        {{ item.name ? item.name : item }}
      </div>
    </div>

    <slot name="custom"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      isTabOn: 0,
      tab_title: "",
    };
  },
  props: {
    options: {
      type: Array,
      default: function () {
        return [];
      },
    },
    defShow: {
      type: String,
      default: "",
    },
    Arrays: {
      //JSON格式
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    tab_click(index, item) {
      this.isTabOn = index;
      if (item != this.tab_title) {
        this.tab_title = item;
        this.$emit("change", [item]);
      }
    },
    switchTab(index, item) {
      this.isTabOn = index;
      if (item != this.tab_title) {
        this.tab_title = item.name;
        this.$emit("change", item.name);
      }
    },
    change_select(item, index) {
      this.isTabOn = index;
      this.$emit("change", [item]);
    },
  },
  watch: {
    defShow: {
      handler(newv, oldv) {
        this.value = newv;
      },
      immediate: true,
    },
  },
};
</script>
<style lang="less" scoped>
.tab_flex {
  display: flex;
  height: 3.6rem;
  width: 100%;
  align-items: flex-end;
  padding-left: 1rem;
  box-sizing: border-box;
  position: relative;

  & > div > div {
    cursor: pointer;
    user-select: none;
  }
  .el-select {
    margin: 0 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 8rem;
    height: 2.7rem;
    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(87, 87, 87, 1);
    padding: 0 1rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px 0px 4px 0px;
    border: 1px solid rgba(238, 238, 238, 1);
    /deep/.el-input__inner {
      height: 2.7rem;
      line-height: 2.7rem;
      text-align: center;
      color: rgba(87, 87, 87, 1);
      background: rgba(255, 255, 255, 1);
      border-bottom: none !important;
    }
    /deep/.el-input__icon {
      height: 2.7rem !important;
      line-height: 2.7rem !important;
    }
    transition: all 0.3s ease;
    span {
      font-size: 1.3rem;
      margin-right: 0.5rem;
    }
  }

  .tab_on {
    transition: all 0.3s ease;
    background: rgba(87, 87, 87, 1);
    border-radius: 4px 4px 0px 0px;
    // width: 12rem;
    height: 3.6rem;
    padding: 0 1rem;
    // font-weight: 600;
    color: rgba(255, 255, 255, 1);
    /deep/.el-input__inner {
      height: 3.8rem;
      color: rgba(255, 255, 255, 1);
      background: rgba(87, 87, 87, 1);
      border-radius: 4px 4px 0px 0px;
      & > :focus {
        border-bottom: none !important;
      }
    }
    /deep/.el-input__icon {
      height: 3.8rem !important;
      line-height: 3.8rem !important;
    }
    /deep/.el-input > .el-input__inner:focus {
      border-bottom-color: transparent;
    }
  }
}
@media all and (max-width: 1024px) {
  .customClass {
    padding-left: 0 !important;
  }

  .tab_flex {
    padding-left: 0;
    & > div {
      flex: 1 !important;
    }
    .el-select {
      width: initial !important;
    }

    .tab_on {
      width: 12rem;
    }
  }
}
</style>
