<!-- 
	@Description:部门选择器 
	@Params: RId【 部门Id 】
			Name 【部门名称】
			Subs【部门子集】
	        defaultDep【默认勾选部门，传用户对象数组 如: [{RId:1,Name:xxx},] 】
	@Return: 获取选中的部门，父组件监听'getResult'事件;
    slot : button 自定义图片或按钮 弹出选择器
-->
<template>
  <div class="main-box">
    <div class="list">
      <div v-if="showLength">
        <el-tag
          :size="size"
          v-for="(item, index) in proData"
          :key="index"
          v-if="index < lengthNum"
          >{{ item.Name }}</el-tag
        >
        <el-tag
          v-if="lengthNum < proData.length && proData.length > 3"
          :size="size"
          >+{{ proData.length - lengthNum }}</el-tag
        >
      </div>
      <div v-else>
        <el-tag v-for="(item, index) in proData" :key="index" :size="size">{{
          item.Name
        }}</el-tag>
      </div>
      <div @click="show" ref="button" v-if="showButton">
        <slot name="button"><i class="hiFont hi-add"></i></slot>
      </div>
      <div @click="show" ref="button">
        <slot name="buttonCustom"></slot>
      </div>
    </div>
    <transition :name="animation">
      <div class="check-box" v-if="showCheck" ref="checkBox">
        <div class="title">部门选择器</div>
        <div class="search">
          <input type="text" v-model="search" placeholder="搜索部门" />
          <i class="el-icon-search"></i>
        </div>
        <el-tree
          v-loading="loading"
          class="tree"
          ref="tree"
          :props="props"
          :default-checked-keys="defaultDep | getRId"
          :default-expand-all="true"
          :data="data"
          :check-strictly="true"
          show-checkbox
          node-key="RId"
          @check-change="checkChange"
          :filter-node-method="filterNode"
        >
        </el-tree>
        <div class="footer">
          <div v-if="multiSelect">
            <el-checkbox v-model="all" @change="checkAll">一键全选</el-checkbox>
            <el-checkbox v-model="reverse" @change="reverseCheck"
              >反选全部</el-checkbox
            >
            <!-- <div class="check" @click="checkAll">一键全选</div>
            <div class="check" @click="reverseCheck">一键反选</div> -->
          </div>
          <div>
            <el-button type="info" @click="hide">取消</el-button>
            <el-button type="primary" @click="define">确定</el-button>
          </div>
        </div>
        <div class="point" ref="point"></div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    //标签大小
    size: {
      type: String,
      default: null,
    },
    //默认选中部门
    defaultDep: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // CX 新增，给部门选中父级时需要处理禁用的细节 2020 01 14
    disabledNodeId: {
      type: Number,
      default: 0,
    },
    //选择部门范围 0-所有部门，1-可管理部门
    range: {
      type: Number,
      default: 0,
    },
    //是否多选，默认多选
    multiSelect: {
      type: Boolean,
      default: true,
    },
    //是否显示按钮，默认显示
    showButton: {
      type: Boolean,
      default: true,
    },
    //是否默认勾选全部
    defaultCheckAll: {
      type: Boolean,
      default: false,
    },
    showButtonDef: {
      type: Boolean,
      default: false,
    },
    showLength: {
      //是否只展示部分标签
      type: Boolean,
      default: false,
    },
    lengthNum: {
      //在showlengt为true的情况下 展示的标签个数
      type: Number | String,
      default: 2,
    },
  },
  data() {
    return {
      depList: [],
      search: "",
      animation: null,
      allRId: [],
      props: {
        label: "Name",
        children: "Subs",
      },
      showCheck: false,
      data: null,
      loading: true,
      reverse: false, //反选
      all: false, //全选
      proData: [],
    };
  },
  watch: {
    search(val) {
      this.$refs["tree"].filter(val);
    },
  },
  filters: {
    getRId(val) {
      let list = [];
      val.forEach((element) => {
        if (element.RId) {
          list.push(element.RId);
        }
      });
      return list;
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.proData.push(...this.defaultDep);
      }, 1000);
    });
  },
  methods: {
    define() {
      this.defaultDep.length = 0;
      this.defaultDep.splice(0, 0, ...this.$refs["tree"].getCheckedNodes());
      this.$emit("getResult", this.defaultDep);
      this.proData = [];
      this.proData.push(...this.defaultDep);
      this.hide();
    },

    async show() {
      this.showCheck = true;
      this.$nextTick(this.location);
      let res = await this.getDep();
      this.initi();
      this.reverse = false;
      this.all = false;
    },
    hide() {
      this.showCheck = false;
    },
    //弹窗初始化
    initi() {
      if (this.defaultCheckAll) {
        this.checkAll();
      }
    },
    async getDep() {
      if (!this.data) {
        await this.$http
          .post("/General/reachSelector.ashx", {
            type: this.range,
          })
          .then((res) => {
            this.data = res.data;
            this.loading = false;
            this.extractRId(this.data);
            if (this.disabledNodeId !== 0) {
              this.recDisabled(this.data, this.disabledNodeId, false);
            }
          })
          .catch((err) => {
            console.log("部门选择器错误", err);
          });
      }
    },
    //提取所有节点的id
    extractRId(list) {
      list.forEach((element) => {
        if (element.RId) {
          this.allRId.push(element.RId);
          element.Subs.length && this.extractRId(element.Subs);
        }
      });
    },
    // CX 禁用
    recDisabled(json, id, isFinded) {
      for (let i = 0; i < json.length; i++) {
        if (isFinded || json[i].RId === id) {
          json[i].disabled = true;
          if (String(json[i].Subs) !== "")
            this.recDisabled(json[i].Subs, id, true);
        } else {
          if (String(json[i].Subs) !== "")
            this.recDisabled(json[i].Subs, id, false);
        }
      }
    },
    checkChange(item, node, self) {
      if (node == true && !this.multiSelect) {
        this.$refs["tree"].setCheckedKeys([item.RId]);
      }
    },
    filterNode(value, data, node) {
      if (data.Name.match(value)) {
        return true;
      } else {
        return false;
      }
    },
    checkAll(val) {
      this.reverse = false;
      if (this.defaultDep) {
        this.defaultDep.length = 0;
      }
      if (val) {
        this.$refs["tree"].setCheckedKeys(this.allRId);
      } else {
        // const list = this.$refs["tree"].getCheckedKeys();
        this.$refs["tree"].setCheckedKeys([]);
      }
    },
    reverseCheck() {
      this.all = false;
      if (this.defaultDep) {
        this.defaultDep.length = 0;
      }
      let list = this.$refs["tree"].getCheckedKeys();
      let cloneList = this.allRId.slice();
      // list.forEach((element) => {
      //   let index = cloneList.indexOf(element);
      //   index !== 1 && cloneList.splice(index, 1);
      // });
      cloneList = cloneList.filter((ele) => list.indexOf(ele) == -1);
      this.$refs["tree"].setCheckedKeys(cloneList);
    },
    // 弹窗定位
    location() {
      let button = this.$refs["button"],
        targer = this.$refs["checkBox"],
        point = this.$refs["point"],
        buttonWidth = button.clientWidth,
        buttonHeight = button.clientHeight,
        targerWidth = targer.clientWidth,
        targerHeight = targer.clientHeight,
        winWidth =
          document.body.clientWidth || document.documentElement.clientWidth,
        winHeight =
          document.body.clientHeight || document.documentElement.clientHeight,
        marginTop = button.getBoundingClientRect().top + buttonWidth / 2,
        marginLeft = button.getBoundingClientRect().left + buttonWidth / 2,
        marginRight = winWidth - marginLeft,
        marginBottom = winHeight - marginTop;
      //上边
      if (
        marginTop > targerHeight + buttonHeight / 2 + 14 &&
        marginLeft > targerWidth / 2 &&
        marginRight > targerWidth / 2
      ) {
        this.animation = "el-zoom-in-bottom";
        targer.style.top =
          marginTop - buttonHeight / 2 - targerHeight - 14 + "px";
        targer.style.left = marginLeft - targerWidth / 2 + "px";
        point.style.borderTop = "9px solid #ffffff";
        point.style.left = "50%";
        point.style.transform = "translate(-50%,0)";
        point.style.bottom = "-14px";
        //下边
      } else if (
        marginBottom > targerHeight + buttonHeight / 2 + 10 &&
        marginLeft > targerWidth / 2 &&
        marginRight > targerWidth / 2
      ) {
        targer.style.top = marginTop + buttonHeight / 2 + 10 + "px";
        targer.style.left = marginLeft - targerWidth / 2 + "px";
        point.style.borderBottom = "9px solid #ffffff";
        point.style.left = "50%";
        point.style.transform = "translate(-50%,0)";
        point.style.top = "-14px";
        this.animation = "el-zoom-in-top";
        //右边
      } else if (
        marginRight > targerWidth + buttonWidth / 2 &&
        marginTop > targerHeight / 2 &&
        marginBottom > targerHeight / 2
      ) {
        targer.style.top = marginTop - targerHeight / 2 + "px";
        targer.style.left = marginLeft + buttonWidth / 2 + 10 + "px";
        point.style.borderRight = "9px solid #ffffff";
        point.style.top = "50%";
        point.style.transform = "translate(0,-50%)";
        point.style.left = "-14px";
        this.animation = "el-zoom-in-center";
        // 左边
      } else if (
        marginLeft > targerWidth + buttonWidth / 2 + 10 &&
        marginTop > targerHeight / 2 &&
        marginBottom > targerHeight / 2
      ) {
        targer.style.top = marginTop - targerHeight / 2 + "px";
        targer.style.left =
          marginLeft - buttonWidth / 2 - targerWidth - 10 + "px";
        point.style.borderLeft = "9px solid #ffffff";
        point.style.top = "50%";
        point.style.transform = "translate(0,-50%)";
        point.style.right = "-14px";
        this.animation = "el-zoom-in-center";
      } else if (
        (marginTop < targerHeight / 2 || marginBottom < targerHeight / 2) &&
        winHeight > targerHeight &&
        (marginLeft > targerWidth + buttonWidth / 2 ||
          marginRight > targerWidth + buttonWidth / 2)
      ) {
        targer.style.top =
          marginTop < targerHeight / 2 ? 0 : winHeight - targerHeight + "px";
        point.style.top =
          marginTop < targerHeight / 2
            ? marginTop + "px"
            : targerHeight - marginBottom + "px";
        if (marginLeft > targerWidth + buttonWidth / 2) {
          targer.style.left =
            marginLeft - buttonWidth / 2 - targerWidth - 10 + "px";
          point.style.borderLeft = "9px solid #ffffff";
          point.style.right = "-14px";
          point.style.transform = "translate(0,-50%)";
          this.animation = "el-zoom-in-center";
        } else {
          targer.style.left = marginLeft + buttonWidth / 2 + 10 + "px";
          point.style.borderRight = "9px solid #ffffff";
          point.style.transform = "translate(0,-50%)";
          point.style.left = "-14px";
          this.animation = "el-zoom-in-center";
        }
        //全屏
      } else {
        targer.style.width = "100vw";
        targer.style.height = "100vh";
        targer.style.top = 0;
        targer.style.left = 0;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.hi-add {
  background-color: #c3c3c3;
  height: 2rem;
  width: 2rem;
  display: block;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 10%;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.hi-add:hover {
  background-color: #d7d7d7;
  color: #f8f8f8;
}

.main-box {
  position: relative;

  .list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .el-tag {
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }

  .check-box {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    border: 1px solid #ebeef5;
    background-color: white;
    position: fixed;
    display: flex;
    flex-direction: column;
    min-width: 26rem;
    z-index: 99999;

    .title {
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px #f3f3f3 solid;
      font-size: 1.5rem;
      font-weight: 500;
      color: #6d6d6d;
      font-weight: bolder;
    }

    .search {
      position: relative;
      width: 80%;
      margin: 1rem auto;
      display: flex;
      border: 1px lightgrey solid;
      border-radius: 6px;
      overflow: hidden;

      input {
        padding: 0.7rem 1rem 0.7rem 2.5rem;
        border: none;
        color: #757575;
        flex-grow: 1;
      }

      i {
        position: absolute;
        left: 1rem;
        top: 50%;
        color: #757575;
        transform: translate(0, -50%);
      }
    }

    .tree {
      padding: 1rem;
      padding-top: 0;
      height: 320px;
      overflow-y: auto;
      flex-grow: 1;
    }

    .footer {
      // display: flex;
      // justify-content: center;
      padding: 1rem 0;
      border-top: 1px #eeeeee solid;

      > div {
        display: flex;
        justify-content: center;
      }

      div:first-child {
        padding-bottom: 1rem;

        .check {
          color: #606266;
          font-weight: 500;
          font-size: 1.4rem;
          padding: 0 1rem;
          margin-right: 1rem;
          cursor: pointer;
        }

        .check:last-child {
          margin-right: 0;
        }

        .check:hover {
          color: #409eff;
        }
      }

      .el-button {
        width: 40%;
      }
    }

    .point {
      position: absolute;
      border: 7px solid transparent;
    }
  }
}
</style>
