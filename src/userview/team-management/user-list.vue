<template>
  <div class="user-list">
    <el-table :data="tableData" stripe>
      <el-table-column label="成员姓名" prop="Name" align="center" />
      <el-table-column
        label="加入时间"
        prop="CreatTime"
        show-overflow-tooltip
        align="center"
        ><template slot-scope="scope">
          {{ scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="MType" align="center"
        ><template slot-scope="scope">
          {{ scope.row.MType == 1 ? "成员" : "管理人" }}
        </template></el-table-column
      >
      <el-table-column label="状态" prop="Shape" align="center"
        ><template slot-scope="scope"> 正常 </template></el-table-column
      >
      <el-table-column label="可查看成员" prop="MemberCount" align="center"
        ><template slot-scope="scope">
          <el-popover trigger="hover" placement="top" width="350" v-if="true">
            <div slot="reference">
              <p class="mem_count">{{ scope.row.MemberCount }}人</p>
            </div>
            <ul class="member-style">
              <li v-for="(item, index) in 8" :key="index">
                <img
                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  alt=""
                />
                <span>陈一帆</span>
                <i
                  :style="
                    (index + 1) % 3 == 0 || index == 7 ? 'display:none' : ''
                  "
                ></i>
              </li>
            </ul>
          </el-popover>
          <span v-else>{{ scope.row.MemberCount }}人</span>
        </template></el-table-column
      >
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <c-btn>
            <span @click="handleUserDetail(scope.row)">详情</span>
          </c-btn>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
    </div>
    <UserInfo></UserInfo>
  </div>
</template>
<script>
export default {
  components: {
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
    UserInfo: () => import("./user-info"),
  },
  data() {
    return {
      loading: false,
      tableData: [
        {
          Name: "团队名称",
          CreatTime: "2021-02-02 12:21",
          MType: 1,
          MemberCount: 20,
          Shape: 1,
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
        {
          Name: "团队名称",
          UserName: "文秋月",
          CreatTime: "2021-02-02 12:21",
          AdminUserName: "文秋月",
          MemberCount: 20,
          Vsersion: {
            Name: 20,
          },
          ExpireTime: "2021-02-02 12:21",
        },
      ],
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
    };
  },
  methods: {
    /**
     * 查看成员详情
     */
    handleUserDetail(val) {
      this.$modal.show("userInfo");
    },
    /**
     * 分页
     */
    handlePaginationChange(val) {},
  },
};
</script>
<style lang="less" scoped>
.user-list {
  margin-top: 10px;
  height: calc(100% - 50px);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  .mem_count {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .page {
    position: relative;
    padding: 1rem 0 0.4rem;
    border-top: 1px solid #ebeef5;
    // total弄到最右边
    .el-pagination__total {
      position: absolute;
      right: 0;
      height: 28px;
      line-height: 28px;
      font-size: 13px;
      display: inline-block;
    }
  }
  /deep/.el-table {
    .el-table__body-wrapper {
      height: calc(100% - 47px);
      overflow-y: auto;
    }
  }
}
.member-style {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  li {
    display: flex;
    width: 33%;
    margin-bottom: 1rem;
    // margin-right: 1rem;
    align-items: center;
    // justify-content: space-between;
    position: relative;

    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    span {
      color: #333;
      margin-right: 2rem;
      max-width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i {
      width: 1px;
      height: 70%;
      background: #ddd;
      position: absolute;
      right: 20%;
      top: 3px;
    }
  }
}
</style>
