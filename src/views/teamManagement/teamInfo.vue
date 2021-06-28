<template>
  <div id="teamInfo">
    <!-- 列表页 -->
    <CContent v-if="selRow">
      <template #search>
        <div class="info_header">
          <div class="h_left">
            <span @click="$emit('viewChange')"
              ><i class="el-icon-d-arrow-left"></i>团队详情</span
            >
            <el-divider direction="vertical"></el-divider>
            <span>{{ selRow.Name }}</span>
          </div>
        </div>
      </template>
      <template #main>
        <el-table :data="tableData" v-loading="loading">
          <el-table-column label="成员姓名" prop="Name" align="center" />
          <el-table-column
            label="加入时间"
            prop="CreatTime"
            show-overflow-tooltip
            align="center"
            ><template slot-scope="scope">
              {{
                scope.row.CreatTime
                  ? scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:ss")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="角色" prop="MType" align="center"
            ><template slot-scope="scope">
              {{ scope.row.MType == 1 ? "成员" : "管理人" }}
            </template></el-table-column
          >
          <el-table-column label="状态" prop="Shape" align="center"
            ><template slot-scope="scope">
              {{ $D.ITEM("g_status", scope.row.Shape).name }}
            </template></el-table-column
          >
          <el-table-column label="可查看成员" prop="MemberCount" align="center"
            ><template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top"
                width="350"
                v-if="scope.row.VisibleUser.length"
              >
                <div slot="reference">
                  <p class="mem_count">{{ scope.row.VisibleUser.length }}人</p>
                </div>
                <ul class="member-style">
                  <li
                    v-for="(item, index) in scope.row.VisibleUser"
                    :key="index"
                  >
                    <img :src="item.Picture" alt="" />
                    <span>{{ item.Name }}</span>
                    <i
                      :style="
                        (index + 1) % 3 == 0 ||
                        index == scope.row.VisibleUser.length - 1
                          ? 'display:none'
                          : ''
                      "
                    ></i>
                  </li>
                </ul>
              </el-popover>
              <span v-else>{{ scope.row.VisibleUser.length }}人</span>
            </template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleUserDetail(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </CContent>
    <userTeamInfo :selUser="selUser"></userTeamInfo>
  </div>
</template>

<script>
export default {
  components: {
    CContent: () => import("@/components/CContent"),
    userTeamInfo: () => import("./userTeamInfo"),
  },
  props: {
    selRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selUser: null,
      loading: false,
      tableData: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getTeamList();
    });
  },
  methods: {
    /**
     * 获取团队成员列表
     */
    getTeamList() {
      this.loading = true;
      this.$http
        .post("/Teams/TeamManagementDetail.ashx", { teamId: this.selRow.Id })
        .then((resp) => {
          if (resp.res == 0) {
            this.tableData = resp.data.Membersdata;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 查看成员详情
     */
    handleUserDetail(val) {
      this.selUser = val;
      this.$modal.show("userTeamInfo");
    },
  },
};
</script>

<style lang="less" scoped>
#teamInfo {
  height: 100%;
  .info_header {
    background: #ffffff;
    line-height: 4rem;
    padding: 0 12px;
    .h_left {
      color: #303133;
      i {
        margin-right: 10px;
        font-size: 16px;
      }
      span {
        font-size: 16px;
        font-weight: bold;
      }
      span:first-child {
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .mem_count {
    cursor: pointer;
    &:hover {
      color: #409eff;
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
