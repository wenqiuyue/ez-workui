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
        <!-- <template #search>
          <div class="screen">
            <el-select
              v-model="teamValue"
              filterable
              placeholder="请选择团队"
              @change="handleSearch"
            >
              <el-option label="所有团队" :value="2"> </el-option>
              <el-option label="我创建的团队" :value="3"> </el-option>
              <el-option label="我管理的团队" :value="4"> </el-option>
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
        </template> -->
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
