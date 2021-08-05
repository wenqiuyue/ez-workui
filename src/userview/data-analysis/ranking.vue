<template>
  <div class="ranking">
    <XModal
      name="ranking"
      width="1200px"
      height="700px"
      title="效率状态排名"
      showCrossBtn
      class="high-table"
      ref="ranking"
    >
      <CContent>
        <template #search>
          <div class="screen">
            <el-select v-model="typeVal">
              <el-option label="综合" :value="1"> </el-option>
              <el-option label="鼠标" :value="2"> </el-option>
              <el-option label="键盘" :value="3"> </el-option>
            </el-select>
            <el-select v-model="speedVal" placeholder="选择速度">
              <el-option label="平均速度" :value="1"> </el-option>
              <el-option label="最高速度" :value="2"> </el-option>
              <el-option label="最低速度" :value="3"> </el-option>
            </el-select>
            <el-button type="primary" @click="handleSearch" size="medium"
              >开始排名</el-button
            >
          </div>
        </template>
        <template #main>
          <el-table :data="tableData">
            <el-table-column align="center" prop="ranking" label="排名">
              <template slot-scope="scope">
                <span v-if="scope.row.ranking == 1" class="ranking">
                  <i class="hiFont hi-first" style="color: #f43f34"></i>
                </span>
                <span v-else-if="scope.row.ranking == 2" class="ranking">
                  <i class="hiFont hi-second" style="color: #f4be5e"></i>
                </span>
                <span v-else-if="scope.row.ranking == 3" class="ranking">
                  <i class="hiFont hi-third" style="color: #70e5dc"></i>
                </span>
                <span v-else>{{ scope.row.ranking }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="成员">
              <template slot-scope="scope">
                <div class="user">
                  <el-avatar
                    size="small"
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  ></el-avatar>
                  <span>{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="province" label="鼠标速度">
              <template slot-scope="scope"> 200次每分钟 </template>
            </el-table-column>
            <el-table-column align="center" prop="city" label="键盘速度">
              <template slot-scope="scope"> 120次每分钟 </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="效率状态">
              <template slot-scope="scope"> 积极 </template>
            </el-table-column>
            <el-table-column align="center" prop="zip" label="行为状态">
              <template slot-scope="scope"> 摸鱼 </template>
            </el-table-column>
          </el-table>
        </template>
      </CContent>
    </XModal>
  </div>
</template>
<script>
export default {
  components: {
    XModal: () => import("@/components/XModal"),
    CContent: () => import("@/components/CContent"),
  },
  data() {
    return {
      typeVal: 1,
      speedVal: 1,
      tableData: [
        {
          ranking: 1,
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          ranking: 2,
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          ranking: 3,
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          ranking: 4,
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          ranking: 5,
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          ranking: 6,
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          ranking: 7,
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
.ranking {
  .screen {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 5px 0 0;
    /deep/.el-select {
      margin-right: 8px;
      width: 18rem;
      .el-input {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        .el-input__inner {
          height: 34px;
          line-height: 34px;
          font-size: 1.3rem;
        }
        .el-input__icon {
          height: 34px;
          line-height: 34px;
        }
      }
    }
  }
  .high-table {
    /deep/.ranking {
      i {
        font-size: 2.6rem;
      }
    }
    /deep/.user {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      span {
        margin-left: 5px;
      }
    }
  }
}
</style>
