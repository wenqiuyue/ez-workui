<!--
* @ author: CX
* @ date:   2019-12-16
* @ description：分页器组件
-->
<template>
  <el-row>
    <!-- PC端分页 -->
    <el-col :span="24" class="hidden-sm-and-down">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="childData.pageIndex"
        :page-size="childData.pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :total="childData.totalNum"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-col>

    <!-- 移动端分页 -->
    <el-col :span="24" class="hidden-md-and-up">
      <el-button
        type="primary"
        size="small"
        :disabled="childData.pageIndex <= 1"
        @click="prePageClick"
      >
        上一页
      </el-button>
      <el-select
        v-model="childData.pageIndex"
        placeholder="跳页"
        @change="selectPageClick"
        style="width: 80px"
        size="small"
      >
        <el-option
          v-for="index in Math.ceil(childData.totalNum / childData.pageSize)"
          :key="index"
          :value="index"
          :label="'第' + index + '页'"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        size="small"
        :disabled="
          childData.pageIndex >=
          Math.ceil(childData.totalNum / childData.pageSize)
        "
        @click="nextPageClick"
      >
        下一页
      </el-button>
      <span class="el-pagination__total">共 {{ childData.totalNum }} 条</span>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: ["pageData"],
  // 除了v-model也有实现类似父子双向绑定的例子，当父层v-bind本身就是一个obj时
  // 子层直接用props接收obj后，obj.xx就能改变props的obj，且不会报警告
  // 同时这种情况下父层的obj也已经发生了改变

  // 但是当父层传过来的基础数据类型num，此时子层改num会报错，那没办法，把props的num赋给一个新的data变量
  // 咋们改那个新变量，之后通过this.$emit('xx', 新变量)响应给父层了
  // 父层拿到新变量又赋值给自己最先的num，这样搞就很麻烦，父层还需要写事件方法等
  // 此时用v-model搭配model，model的event把子层的value直接赋给父层num，就稍显简洁有优势一点
  // 但根本上还是不能直接改变子层的props，需要把props赋值给一个新的变量，修改那新变量才没得警告
  // 也可以搭配监听实现父子双向绑定，比如：watch:{'新data' (value) {this.$emit('changeEvent', value)}}
  model: { prop: "pageData", event: "changeEvent" },
  data() {
    return {
      childData: this.pageData,
    };
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.childData.pageIndex = 1;
      this.childData.pageSize = val;
      this.comfun();
    },
    handleCurrentChange(val) {
      this.childData.pageIndex = val;
      this.comfun();
    },
    prePageClick() {
      this.childData.pageIndex--;
      this.comfun();
    },
    selectPageClick(val) {
      this.childData.pageIndex = val;
      this.comfun();
    },
    nextPageClick() {
      this.childData.pageIndex++;
      this.comfun();
    },
    // 子层分页器有任何参数改变，都要同步给父层
    // 不用监听来调用comfun
    comfun() {
      this.$emit("changeEvent", this.childData); // 参数会自动绑给父层v-model指定的那个变量
      this.$emit("childEvent");
    },
  },
};
</script>
