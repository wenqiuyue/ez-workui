<template>
  <div class="team-info">
    <el-row :gutter="20">
      <!-- 左边 -->
      <el-col :span="7"
        ><div class="info_left">
          <h3 class="info-title">团队信息</h3>
          <div class="info_img">
            <el-avatar
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            ></el-avatar>
          </div>
          <div class="info_form">
            <ul>
              <li>
                <span class="lable">团队名称：</span>
                <span>XXX团队</span>
              </li>
              <li>
                <span class="lable">当前人数：</span>
                <span>200人</span>
              </li>
              <li class="img_row">
                <span class="lable">创建人：</span>
                <span class="number">
                  <el-avatar
                    size="small"
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  ></el-avatar>
                  <span>文秋月</span>
                </span>
              </li>
              <li class="img_row_list">
                <span class="lable">管理员：</span>
                <div class="number_list">
                  <span class="number" v-for="(item, index) in 5" :key="index">
                    <el-avatar
                      size="small"
                      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                    ></el-avatar>
                    <span>文秋月</span>
                  </span>
                </div>
              </li>
              <li class="num_row">
                <p><span class="lable">团队号：</span> <span>12345678</span></p>
                <p>用户可通过团队号加入团队</p>
              </li>
              <li><span class="lable">设置：</span></li>
              <li class="set_row">
                <span>可否通过团队号加入</span>
                <el-switch v-model="setOne"> </el-switch>
              </li>
              <li class="set_row">
                <span>成员可否邀请其他人加入</span>
                <el-switch v-model="setTwo"> </el-switch>
              </li>
              <li>
                <p class="set_row">
                  <span>是否设置邀请口令</span>
                  <el-switch v-model="setThree"> </el-switch>
                </p>
                <el-input
                  class="set_input"
                  v-if="setThree"
                  v-model="passwordVal"
                  placeholder="请输入邀请口令"
                ></el-input>
              </li>
              <li style="margin-top: 32px">
                <el-button type="primary" style="width: 100%" size="medium"
                  >邀请成员加入</el-button
                >
              </li>
            </ul>
          </div>
        </div></el-col
      >
      <!-- 右边 -->
      <el-col :span="17"
        ><div class="info_right">
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
              <CPages
                v-model="pageData"
                @changeEvent="handlePaginationChange"
              />
            </div>
          </div></div
      ></el-col>
    </el-row>
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
      loading: false,
      setOne: true,
      setTwo: true,
      setThree: false,
      passwordVal: null, //口令
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
.team-info {
  margin-top: 10px;
  height: calc(100% - 50px);
  .el-row {
    height: 100%;
  }
  .el-col-7,
  .el-col-17 {
    height: 100%;
    padding-bottom: 10px;
  }
  .info_left,
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
  }
  .info_left {
    overflow-y: scroll;
    .info_img {
      text-align: center;
      .el-avatar {
        width: 120px;
        height: 120px;
      }
    }
    .info_form {
      margin-top: 12px;
      padding: 0 15px;
      ul {
        li {
          margin-bottom: 12px;
          font-size: 14px;
          color: #303133;
          .lable {
            // width: 80px;
            display: inline-block;
            color: #000000;
            margin-right: 5px;
          }
        }
        .img_row {
          display: flex;
          align-items: center;
          .number {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 10px;
            span {
              margin-top: 2px;
              font-size: 12px;
            }
          }
        }
        .img_row_list {
          display: flex;
          flex-direction: row;
          .number_list {
            width: calc(100% - 80px);
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .number {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-right: 10px;
              margin-bottom: 5px;
              span {
                margin-top: 2px;
                font-size: 12px;
              }
            }
          }
        }
        .num_row {
          padding: 10px 0;
          p:last-child {
            font-size: 12px;
            color: #e6a23c;
          }
        }
        .set_row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .set_input {
          /deep/.el-input__inner {
            height: 34px;
            line-height: 34px;
          }
        }
      }
    }
  }
  .info_right {
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
}
</style>
