<template>
  <div class="info_right">
    <!-- 右边标题 -->
    <h3 class="info-title">
      <span>团队邀请管理</span>
      <div class="screen_left">
        <el-button type="success" size="small">全部同意</el-button>
        <el-button type="danger" size="small">全部拒绝</el-button>
        <el-button type="info" size="small">清空记录</el-button>
      </div>
    </h3>
    <!-- 右边搜索 -->
    <div class="r_screen">
      <div class="screen_right">
        <ul>
          <li>
            <span class="lable">时间范围</span>
            <el-date-picker
              v-model="timeScreen"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </li>
          <li>
            <span class="lable">状态</span>
            <el-select
              v-model="statusScreen"
              multiple
              collapse-tags
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li>
            <el-button type="primary" icon="el-icon-search" size="medium"
              >搜索</el-button
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- 右边表格 -->
    <div class="right_table">
      <el-table :data="tableData" stripe>
        <el-table-column label="被邀请人" prop="Name" align="center">
          <template slot-scope="scope"> 文秋月（15803675211） </template>
        </el-table-column>
        <el-table-column label="邀请人" prop="Name" align="center">
          <template slot-scope="scope"> 文秋月（15803675211） </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="CreatTime"
          show-overflow-tooltip
          align="center"
          ><template slot-scope="scope">
            {{ scope.row.CreatTime.timeFormat("yyyy-MM-dd HH:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <c-btn>
              <span>同意</span>
              <span>拒绝</span>
            </c-btn>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
  },
  data() {
    return {
      statusOptions: [
        {
          label: "已通过",
          value: 1,
        },
        {
          label: "未通过",
          value: 2,
        },
        {
          label: "未审核",
          value: 3,
        },
      ],
      timeScreen: null, //时间筛选
      statusScreen: null, //状态筛选
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
     * 分页
     */
    handlePaginationChange(val) {},
  },
};
</script>
<style lang="less" scoped>
.info_right {
  height: 100%;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  .info-title {
    padding: 0 10px;
    line-height: 4rem;
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .r_screen {
    line-height: 4.5rem;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .screen_right {
      ul {
        display: flex;
        flex-direction: row;
        li {
          margin-right: 14px;
          display: flex;
          align-items: center;
          .lable {
            margin-right: 3px;
            font-weight: bold;
            color: #606266;
          }
          /deep/.el-range-editor {
            width: 234px;
            height: 36px;
            line-height: 36px;
            .el-input__icon {
              height: auto;
            }
            .el-range-separator {
              width: 20px;
              height: auto;
            }
          }
          /deep/.el-select {
            .el-input__inner {
              border: 1px solid #e4e7ed !important;
              height: 36px;
              line-height: 36px;
            }
          }
        }
      }
    }
  }
  .right_table {
    height: calc(100% - 86px);
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
      padding: 0.4rem 0;
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
}
</style>
