<!-- 
	@Description:成员选择器 
	@Author:zxg 
	@Params: eid【 项目id 】
			size 【头像大小 small medium 默认medium 】
			readonly 【是否只读  默认false（如果要设置只读属性，请同时设置为单选 isSelection=false）】
			isSelection【true为多选 默认true】
			showActive 【是否显示选中人 默认true】
			showActiveImg【是否显示选中人的头像 默认true】
			showActiveName【是否显示选中人的名字 默认true】
	        arrays【默认勾选的人，传用户对象数组 如: [{UsId:1,Name:xxx,Picture:xxx},] 用户的三个属性分别为 图片:Picture 名字:Name用户ID:UsId    】
			options【自定义弹出位置对象，基于窗口，对象的属性有offTop,offLeft,offRight,offBottom 】
			selRange 【可选人范围 见数据字典（sel_member_range） 默认全部 】
			selRangeStatu 【可选人的状态 见数据字典（sel_member_status） 默认仅可用的 】
			openAt 【开启@功能 默认 fasle 】
			showLength 【显示人数 默认 全部 】
	@Return: 选中的成员对象数组                           this.$emit('Confirm', this.result);
			 一个方法(传布尔值控制选择器的显示和隐藏)		 this.$emit('isColse', xxxx);   
	slot : button 自定义图片或按钮 弹出选择器
	@Date:2019-11-8
-->
<template>
  <div id="mem-public">
    <Location
      :readonly="readonly"
      width="295"
      height="510"
      :position="options"
      @beforeOpen="beforeOpen"
      phoneFull
      ref="child"
    >
      <template slot="other" v-if="showActive">
        <ul class="mem-imgs">
          <li
            v-for="(item, i) in ShowObj"
            :key="i"
            @click.stop="deluser(i, $event)"
            :class="{
              noDel: readonly,
              showDel: !readonly,
              avatar_small: size === 'small',
              avatar_medium: size === 'medium',
            }"
          >
            <img v-if="showActiveImg" :src="img(null)" />
            <p v-if="showActiveName" :title="item.Name">{{ item.Name }}</p>
          </li>
          <p v-if="showLength != null && showLength < result.length">
            等{{ result.length }}人
          </p>
          <div
            v-if="!readonly"
            class="mem-add"
            :class="{ 'mem-add-flex': result.length > 0 }"
            @click="childOpen($event)"
          >
            <i class="el-icon-plus"></i>
          </div>
        </ul>
      </template>
      <div slot="LocationButton">
        <!-- 自定义显示按钮 -->
        <slot name="button"></slot>
      </div>
      <transition slot="content">
        <div class="mem-select">
          <div class="mem-title">
            <ul>
              <li class="mem-active">成员选择</li>
            </ul>
          </div>
          <div class="mem-search">
            <input
              ref="input"
              type="text"
              v-model="searchText"
              placeholder="搜索人员"
              @keyup="search"
            />
            <i class="el-icon-search"></i>
          </div>
          <div class="mem-content" ref="scroll">
            <div class="mem-item">
              <el-checkbox-group v-model="checkedCities" @change="checkChange">
                <el-collapse
                  v-loading="loading"
                  accordion
                  v-show="!isSearch"
                  v-model="defalutId"
                >
                  <el-collapse-item
                    name="default"
                    v-if="this.defaultName != ''"
                  >
                    <div slot="title" class="item-title">
                      <p>默认选项</p>
                      <span></span>
                    </div>
                    <el-checkbox :label="0" class="item-data">
                      <img :src="img(null)" />
                      <em style="position: absolute; left: 40%">{{
                        defaultName
                      }}</em>
                    </el-checkbox>
                  </el-collapse-item>
                  <el-checkbox
                    :label="item.UsId"
                    class="item-data"
                    v-for="item in pageData"
                    :key="item.UsId"
                  >
                    <img :src="img(null)" />
                    <em :title="item.Name">{{ item.Name }}</em>
                    <span></span>
                  </el-checkbox>
                  <div
                    class="tip_text"
                    v-if="pageData == null || pageData.length == 0"
                  >
                    暂无数据
                  </div>
                </el-collapse>
                <!-- 搜索的数据 -->
                <el-collapse v-model="showCollapse" v-show="isSearch">
                  <el-checkbox
                    :label="item.UsId"
                    class="item-data"
                    v-for="item in searchData"
                    :key="item.UsId"
                  >
                    <img :src="img(null)" />
                    <em>{{ item.Name }}</em>
                    <span></span>
                  </el-checkbox>
                  <div class="tip_text" v-if="isSearching">搜索中...</div>
                  <div class="tip_text" v-if="searchData.length == 0">
                    未搜索到数据
                  </div>
                </el-collapse>
              </el-checkbox-group>
            </div>
          </div>
          <div class="mem-line"></div>
          <div class="mem-radio" v-if="isSelection">
            <el-checkbox
              v-model="all"
              @change="allchange"
              :disabled="pageData == null"
              >一键全选</el-checkbox
            >
            <el-checkbox
              v-model="reverse"
              @change="reversechange"
              :disabled="pageData == null"
              >反选全部</el-checkbox
            >
          </div>
          <div class="mem-button">
            <el-button type="info" @click="childColse(false)">取消</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
          </div>
        </div>
      </transition>
    </Location>
  </div>
</template>

<script>
import Location from "@/components/Location";
export default {
  components: {
    Location,
  },
  watch: {
    searchText: "noName",
    arrays: "arrMonitor",
    result(newVal, oldVal) {
      if (this.showLength != null && this.showLength < newVal.length) {
        this.ShowObj = newVal.filter((item, index) => {
          return index < this.showLength;
        });
      } else {
        this.ShowObj = newVal;
      }
    },
  },
  props: {
    //项目ID，如果不为空则显示项目内成员
    eid: {
      type: String | Number,
      default: null,
    },
    //是否显示选中人
    showActive: {
      type: Boolean,
      default: true,
    },
    //是否显示选中人的头像
    showActiveImg: {
      type: Boolean,
      default: true,
    },
    //是否显示选中人的名字
    showActiveName: {
      type: Boolean,
      default: true,
    },
    //是否多选
    isSelection: {
      type: Boolean,
      default: true,
    },
    //默认选中人
    arrays: {
      type: Array,
      default: function () {
        return [];
      },
    },
    //默认选项中名字
    defaultName: {
      type: String,
      default: "",
    },
    //是否只读
    readonly: {
      type: Boolean,
      default: false,
    },
    // 自定义弹出位置，基于窗口 例:{offLeft:'10%',offRight:'20px'} 这几个属性选填(offTop,offLeft,offRight,offBottom)
    options: {
      type: Object,
      default: null,
    },
    //头像大小
    size: {
      type: String,
      default: "medium",
      validator: function (value) {
        return ["medium", "small"].indexOf(value) !== -1;
      },
    },
    //选择范围
    selRange: {
      type: Number,
      default: 0,
    },
    selRangeStatu: {
      type: Number,
      default: 1,
    },
    //@功能
    openAt: {
      type: Boolean,
      default: false,
    },
    showLength: {
      type: Number,
      default: null,
      validator: function (value) {
        return value > 0 || value == null;
      },
    },
    userRoleItem: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      reverse: false, //反选
      all: false, //全选
      checkedCities: [], //选中的成员
      project: null, //项目
      position: null, //职位
      department: null, //部门
      pageData: null, //页数据
      loading: false, //加载
      searchText: "", //搜索成员
      isSearch: false, //标识是否在搜索
      isSearching: false, //标识是否在搜索中
      searchData: [], //搜索的数据
      showCollapse: [], //取消手风琴
      result: [], //返回数据
      defalutId: null, //默认展开的选项
      ShowObj: [], //需要显示的人员长度
    };
  },
  methods: {
    //部门全选
    selectGroup(index) {
      let flag = null;
      if (!flag) {
        this.pageData[index].UsersData.forEach((group) => {
          if (this.checkedCities.indexOf(group.UId) == -1) {
            this.checkedCities.push(group.UId);
          }
        });
      } else {
        this.pageData[index].UsersData.forEach((group) => {
          for (let i = 0; i < this.checkedCities.length; i++) {
            if (group.UId == this.checkedCities[i]) {
              this.checkedCities.splice(i, 1);
              break;
            }
          }
        });
      }
    },
    //组件的关闭方法
    childColse(val) {
      //取消前的方法
      this.$emit("Cancel");
      this.$refs.child.isShow(val);
    },
    //组件的打开方法
    childOpen(event) {
      this.$refs.child.open(event);
    },
    //加载数据
    beforeOpen() {
      if (this.pageData == null) {
        if (this.eid != null) {
          this.getData(this.project, 0);
        } else {
          this.getData(this.position, 1);
        }
        this.defalutId = 0;
        this.$nextTick(function () {
          this.$refs.input.focus();
        });
      }
    },
    //单选
    checkChange(val) {
      if (!this.isSelection) {
        this.checkedCities = [];
        this.checkedCities.push(val.pop());
      }
    },
    getData(pageData, type) {
      this.defalutId = 0;
      if (pageData == null) {
        this.loading = true;
        this.$http
          .get("/General/memberSelector.ashx", {
            params: {
              name: this.searchText,
            },
          })
          .then((resp) => {
            if (resp.res == 0) {
              this.pageData = resp.data;
              this.loading = false;
            }
          });
      }
      this.$refs.scroll.scrollTop = 0;
      this.isSearch = false;
      this.searchText = "";
    },
    //确认选择
    confirm() {
      this.$emit("getUser", this.userRoleItem);
      this.result = [];
      var temp = [];
      if (this.isSelection) {
        for (let i = 0; i < this.checkedCities.length; i++) {
          for (let j = 0; j < this.pageData.length; j++) {
            if (
              this.checkedCities[i] == this.pageData[j].UsId &&
              temp.indexOf(this.checkedCities[i]) === -1
            ) {
              temp.push(this.checkedCities[i]);
              this.result.push(this.pageData[j]);
              break;
            }
          }
        }
      } else {
        for (let j = 0; j < this.pageData.length; j++) {
          if (this.checkedCities[0] == this.pageData[j].UsId) {
            this.result.push(this.pageData[j]);
            break;
          }
        }
      }
      this.childColse(false);
      //返回数据给父组件
      this.$emit("Confirm", this.result);
      if (this.openAt) this.clearValue();
    },
    //格式化头像
    img(picture) {
      if (picture) {
        return this.$url + picture;
      }
      // return "../../assets/img/user.png";
      return "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
    },
    //反选
    reversechange(val) {
      this.all = false;
      let arr = [];
      for (let i = 0; i < this.pageData.length; i++) {
        arr.push(this.pageData[i].UsId);
      }
      for (let a = 0; a < this.checkedCities.length; a++) {
        for (let r = 0; r < arr.length; r++) {
          if (this.checkedCities[a] == arr[r]) {
            arr.splice(r, 1);
          }
        }
      }
      this.checkedCities = Array.from(new Set(arr));
    },
    //全选
    allchange(val) {
      this.reverse = false;
      if (val) {
        for (let i = 0; i < this.pageData.length; i++) {
          if (this.checkedCities.indexOf(this.pageData[i].UsId) === -1) {
            this.checkedCities.push(this.pageData[i].UsId);
          }
        }
      } else {
        this.checkedCities = [];
      }
    },
    //删除
    deluser(index, e) {
      this.$emit("getUser", this.userRoleItem);
      if (!this.readonly) {
        if (e.target.localName === "li") {
          this.checkedCities.splice(index, 1);
          this.result.splice(index, 1);
          //返回数据给父组件
          this.$emit("Confirm", this.result);
        }
      }
    },
    //搜索成员,自己查找
    search() {
      let text = _.trim(this.searchText);
      if (!text || this.pageData == null) {
        return;
      }
      this.isSearch = true;
      if (!this.isSearching) {
        this.searchData = [];
        this.showCollapse = [];
        this.isSearching = true;
        this.pageData.map((parent) => {
          let userData = [];
          if (
            parent.Name.indexOf(text) != -1 ||
            this.$checkPinyin(text, parent.Name_Pinyin)
          ) {
            userData.push(parent);
          }
          if (userData.length > 0) {
            let result = Object.assign({}, parent);
            this.searchData.push(result);
            // this.showCollapse.push(result.Id);
          }
        });
        this.isSearching = false;
      }
    },
    //删除搜索内容
    noName(val) {
      if (!val) {
        this.isSearch = false;
      }
    },
    //默认显示头像
    arrMonitor() {
      // 2020-01-21 CX 改
      this.checkedCities = [];
      this.result = [];
      //单选
      if (!this.isSelection) {
        if (this.checkedCities.length == 0) {
          this.arrays.forEach((item) => {
            if (item != null && this.checkedCities.indexOf(item.UsId) == -1) {
              this.checkedCities.push(item.UsId);
              this.result.push(item);
            }
          });
        }
      } else {
        this.arrays.forEach((item) => {
          if (item != null && this.checkedCities.indexOf(item.UsId) == -1) {
            this.checkedCities.push(item.UsId);
            this.result.push(item);
          }
        });
      }
    },
    isTask() {
      let a = window.location.href;
      const i = a.indexOf("task");
      if (i > -1) {
        let reg = /^task\/[0-9]*\/[0-9]*/;
        return reg.test(a.substring(i));
      } else {
        return false;
      }
    },
    //清除选择数据
    clearValue() {
      Object.assign(this.$data, this.$options.data());
    },
  },
  mounted() {
    this.arrMonitor();
  },
  beforeDestroy() {
    this.$refs.child.isShow(false);
  },
};
</script>

<style lang="less" scoped>
.avatar_small {
  img {
    width: 3.4rem;
    height: 3.4rem;
  }

  p {
    font-size: 1.2rem;
  }
}

.avatar_medium {
  img {
    width: 4rem;
    height: 4rem;
  }

  p {
    font-size: 1.4rem;
  }
}

.avatar_small + p,
.avatar_medium + p {
  margin: 0 5px;
  width: auto !important;
}
#mem-public {
  .mem-imgs {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: center;
    .showDel,
    .noDel {
      position: relative;
      margin-left: 0.6rem;
      transition: all 0.5s ease;
      display: flex;
      flex-direction: column;
      img {
        margin: 0.5rem auto 0 auto;
        border-radius: 50%;
        user-select: none;
      }

      p {
        line-height: 2.5rem;
        text-align: center;
        width: 5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    //头像右上角删除
    .showDel:before {
      content: "\e6db";
      position: absolute;
      margin-left: 65%;
      margin-top: 0.2rem;
      color: rgba(255, 255, 255, 1);
      background: rgba(252, 76, 77, 1);
      font-family: element-icons !important;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 1);
      opacity: 0;
      transition: all 0.3s linear;
    }

    //头像右上角删除
    .showDel:hover:before {
      opacity: 1;
    }
  }

  .mem-imgs li + .mem-add {
    margin-left: 1rem;
  }

  .mem-add-flex {
    margin-top: 0.7rem;
  }
}

.l-relative {
  .mem-select {
    flex: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    user-select: none;

    .mem-title {
      ul {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
        border-bottom: 1px solid rgba(238, 238, 238, 1);

        li {
          cursor: pointer;
          font-size: 1.8rem;
          font-weight: 500;
          color: rgba(109, 109, 109, 1);
        }

        .mem-active {
          font-weight: 540;
          color: rgba(68, 142, 245, 1);
        }

        .mem-active:after {
          content: "";
          display: block;
          width: 100%;
          height: 0.4rem;
          background: rgba(68, 142, 245, 1);
          border-radius: 0.2rem;
          margin-top: 0.8rem;
        }
      }
    }

    .mem-search {
      margin: 1.5rem auto 0 auto;
      width: 85%;
      height: 4.5rem;
      position: relative;
      display: flex;
      box-sizing: border-box;
      align-items: center;

      i {
        color: rgba(204, 204, 204, 1);
        font-size: 2.8rem;
        position: absolute;
        left: 0.3rem;
        width: 3rem;
        line-height: 4rem;
      }

      input {
        padding-left: 3rem;
        height: 3.9rem;
        width: 100%;
        background: rgba(255, 255, 255, 1);
        transition: box-shadow 0.2s ease;
        border-radius: 6px;
        font-size: 1.4rem;
        border: 1px solid rgba(204, 204, 204, 1);
      }

      input:hover,
      input:focus {
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
      }

      span {
        display: block;
        width: 7rem;
        height: 4.05rem;
        background: linear-gradient(
          134deg,
          rgba(97, 193, 254, 1) 0%,
          rgba(66, 139, 244, 1) 100%
        );
        border-radius: 0px 4px 4px 0px;
        font-size: 1.6rem;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 22px;
        line-height: 4rem;
        text-align: center;
        cursor: pointer;
      }
    }

    .mem-content {
      margin: 1rem auto 0 auto;
      width: 90%;
      overflow: auto;

      .item-title {
        display: flex;
        align-items: center;
        width: 100%;
        margin-left: 0.5rem;

        div {
          display: flex;
          align-items: center;
        }

        p {
          font-size: 1.2rem;
          font-weight: 500;
          color: rgba(155, 155, 155, 1);
        }

        span {
          flex: auto;
          background: rgba(238, 238, 238, 1);
          height: 0.1rem;
          margin: 0 5px;
        }

        label {
          margin-right: 0.4rem;

          .position_checkbox_span {
            box-sizing: border-box;
            display: inline-block;
            border: 1px solid #dcdfe6;
            width: 1.4rem;
            height: 1.4rem;
            border-radius: 2px;
            background-color: #ffffff;
            position: relative;
            z-index: 1;
            cursor: pointer;
            transition: border-color 0.5s ease;
          }

          .position_checkbox_span:hover {
            border-color: #409eff;
          }

          .position_checkbox_span:before {
            content: "";
            font-size: 0;
            width: 10px;
            height: 10px;
            background: rgb(143, 188, 238);
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -5px;
            margin-top: -5px;
            border-radius: 2px;
            display: none;
          }

          .position_checkbox {
            display: none;
          }

          .position_checkbox:checked ~ .position_checkbox_span:before {
            display: block;
          }
        }
      }

      .mem-item {
        //复写element样式
        .el-collapse {
          border: none;
          user-select: none;
          min-height: 21.18rem;
          max-height: 23rem;

          //分组头部
          /deep/ .el-collapse-item__header {
            border: none;
            height: 40px;
            line-height: 40px;

            /deep/ .el-icon-arrow-right:before {
              content: "\e6dc";
              color: rgba(155, 155, 155, 1);
            }
          }

          /deep/ .el-collapse-item__wrap {
            border-bottom: none;

            /deep/.el-collapse-item__content {
              padding-bottom: 0;
            }
          }
        }

        //单个成员
        .item-data {
          /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
            color: #000000;
          }

          width: 100%;
          box-sizing: border-box;
          padding-left: 0.8rem;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;

          /deep/.el-checkbox__inner {
            width: 1.6rem;
            height: 1.6rem;

            &::after {
              height: 1.1rem;
              left: 0.6rem;
            }
          }

          /deep/.el-checkbox__label {
            padding-left: 0px;
            display: flex;
            margin-left: 2rem;
            justify-content: space-between;
            width: 80%;
            align-items: center;

            img {
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
            }

            em {
              font-size: 1.6rem;
              font-weight: 500;
              color: rgba(74, 74, 74, 1);
              max-width: 67px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            p {
              border-radius: 2px;
              border: 1px solid rgba(151, 151, 151, 1);
              font-size: 1.2rem;
              font-weight: 400;
              color: rgba(155, 155, 155, 1);
              padding: 0.3rem;
            }
          }
        }

        .item-data-ait {
          /deep/.el-checkbox__label {
            margin-left: 1rem;
            em {
              max-width: 100%;
            }
          }
        }
      }
    }

    .mem-content::-webkit-scrollbar {
      background: #fff;
      width: 5px;
    }

    .mem-content::-webkit-scrollbar-thumb {
      background: #ddd;
      width: 5px;
    }

    .mem-content::-webkit-scrollbar-track {
      background: #fff;
      width: 5px;
    }

    .mem-line {
      background: rgba(238, 238, 238, 1);
      width: 100%;
      height: 1px;
    }

    .mem-radio {
      display: flex;
      margin-top: 0.5rem;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 500;
    }

    .mem-button {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      margin-top: 0.5rem;
      margin-bottom: 1rem;

      .el-button {
        width: 42%;

        &.el-button--info {
          color: #9b9b9b;
          background: #f2f2f2;
          border-color: #f2f2f2;

          &:hover {
            background: #e9e9e9;
            border-color: #e9e9e9;
          }
        }
      }
    }
  }
}

@media all and (max-width: 1024px) {
  /deep/.mem-content {
    height: 62%;
  }

  /deep/.mem-button {
    padding-top: 1.5rem;
    padding-bottom: 1rem;
  }
}
</style>
