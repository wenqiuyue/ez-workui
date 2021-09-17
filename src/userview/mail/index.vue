<template>
  <div class="mail">
    <Header title="邮件监控" titleEnglish="Mail Monitoring" class="baseHeader">
    </Header>
    <div class="mail_content">
      <div class="select-conditions">
        <div class="sel_inline">
          <div class="sel">
            <span>团队</span>
            <div class="team">
              <el-select
                v-model="teamValue"
                filterable
                placeholder="请选择团队"
                @change="handleTeamChange"
              >
                <el-option
                  v-for="item in teamOptions"
                  :key="item.Id"
                  :label="item.Name"
                  :value="item.Id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="sel" v-if="teamValue" style="margin-left: 8px">
            <span>员工</span>
            <selMember
              :teamId="teamValue"
              size="small"
              @Confirm="getSelMember"
              :selRange="1"
              :arrays="selMem"
              :showLength="5"
            >
              <span slot="button" class="btn-custom">
                <i class="el-icon-plus"></i>
              </span>
            </selMember>
          </div>
        </div>
        <el-button type="primary" class="search_btn" size="medium"
          >搜 索</el-button
        >
      </div>
      <div class="baseViewPage">
        <BaseView :title_name="'邮件列表'" :load="loading">
          <div slot="panes">
            <el-tabs v-model="activeName" @tab-click="tabClick">
              <!-- pane 1 -->
              <el-tab-pane name="1">
                <span slot="label"
                  ><i class="hiFont hi-shoujian"></i> 收件箱</span
                >
                <el-collapse accordion v-model="activeTab">
                  <el-collapse-item
                    v-for="(item, index) in 3"
                    :key="index"
                    title="王晓雅"
                    :name="item"
                  >
                    <ul class="mail-list">
                      <li
                        v-for="(citem, cind) in 4"
                        :key="cind"
                        :class="{ activeList: active === cind }"
                        @click="liClick(cind)"
                      >
                        <p class="user">
                          <span>YouTube</span>
                          <span>7-23</span>
                        </p>
                        <p class="title">
                          Chhorm Ratha订阅了您的 YouTube频道！
                        </p>
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>

              <!-- pane 2 -->
              <el-tab-pane name="2">
                <span slot="label"
                  ><i class="hiFont hi-fajian"></i> 发件箱</span
                >
                <el-collapse accordion v-model="activeTab">
                  <el-collapse-item
                    v-for="(item, index) in 3"
                    :key="index"
                    title="王晓雅"
                    :name="item"
                  >
                    <ul class="mail-list">
                      <li
                        v-for="(citem, cind) in 4"
                        :key="cind"
                        :class="{ activeList: active === cind }"
                        @click="liClick(cind)"
                      >
                        <p class="user">
                          <span>YouTube</span>
                          <span>7-23</span>
                        </p>
                        <p class="title">
                          Chhorm Ratha订阅了您的 YouTube频道！
                        </p>
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div slot="content">
            <p class="title">标题：Chhorm Ratha订阅了您的 YouTube频道！</p>
            <div class="mail_user_info">
              <p>发件人：YouTube < noreply@youtube.com ></p>
              <p>收件人：PVACreator < pvAareator-7464@pages.plusgoogle.com ></p>
              <p style="text-indent: 1rem">时间：2021年7月23日（周五）16:31</p>
              <p style="text-indent: 1rem">大小：29KB</p>
            </div>
            <div class="mail_con">内容</div>
          </div>
        </BaseView>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    Header: () => import("@/components/Header"),
    selMember: () => import("@/components/Selectors/MemberSelectCopy"),
    BaseView: () => import("@/components/BaseView"),
  },
  data() {
    return {
      activeName: "1", //收件和发件的切换
      activeTab: 1,
      active: null,
      loading: false,
      teamOptions: [], //团队选择器
      teamValue: null, //选择的团队
      selMem: [], //选择的成员
    };
  },
  mounted() {
    this.getTeams();
  },
  methods: {
    /**
     * 收件和发件的切换
     */
    tabClick() {},
    liClick(ind) {
      this.active = ind;
    },
    /**
     * 获取团队
     */
    getTeams() {
      this.$http
        .get("/Teams/GetAllTeams.ashx", {
          params: { searchText: null, type: 2 },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.teamOptions = resp.data;
          }
        });
    },
    /**
     * 选择成员
     */
    getSelMember(arr) {
      this.selMem = arr;
    },
    /**
     * 团队切换
     */
    handleTeamChange() {
      this.selMem = [];
    },
  },
};
</script>
<style lang="less" scoped>
.mail {
  height: 100%;

  .mail_content {
    height: 100%;
    .select-conditions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      background: #ffffff;
      padding: 5px 14px 0 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 5%);
      .search_btn {
      }
      .sel_inline {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .sel {
        display: flex;
        border-bottom: 1px solid #eee;
        align-items: center;
        height: 5rem;
        box-sizing: border-box;
        margin-right: 1rem;
        // height: 5rem;padding-left: 1rem;

        span {
          color: #333;
          font-size: 1.4rem;
          font-weight: bold;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        /deep/#mem-public {
          border: none !important;
          .location,
          .mem-imgs {
            flex-wrap: nowrap;
          }
          .mem-add {
            display: none;
          }

          .c_button {
            display: flex;
            align-items: center;
            // margin-left: 1rem;
          }

          .avatar_small {
            margin-left: 0;
            img {
              width: 2.3rem;
              height: 2.3rem;
            }
          }
        }
        .btn-custom {
          width: 35px;
          height: 20px;
          display: block;
          border: 1px solid #ccc;
          border-radius: 0.6rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s;
          // margin-left: 1rem;

          i {
            font-size: 1.4rem;
            color: #6d6d6d;
          }

          &:hover {
            border-color: #409eff;

            i {
              color: #409eff;
            }
          }
        }
        .btn {
          margin-left: 2rem;
        }
        .team {
          .el-select {
            border: 1px solid #dcdfe6;
            border-radius: 4px;
          }
        }
      }
    }
    .baseViewPage {
      height: calc(100% - 65px);
      /deep/#module_bv {
        padding: 0;
        .bv_left {
          > div {
            padding-top: 4rem;
          }
          .el-collapse-item__header {
            color: #303133;
          }
        }
        .bv_right {
          background: #ffffff;
          padding: 0.8rem;
          .title {
            font-weight: bold;
            font-size: 16px;
            color: #303133;
          }
          .mail_user_info {
            background: #f2f6fc;
            margin-top: 10px;
            padding: 10px 12px;
            border-radius: 2px;
            p {
              color: #606266;
              line-height: 20px;
            }
          }
          .mail_con {
            margin-top: 12px;
          }
        }
      }
    }
    .mail-list {
      li {
        padding: 0.4rem 6px;
        border-bottom: 1px solid #e4e7ed;
        display: flex;
        flex-direction: column;
        height: auto;
        margin: 0.5rem;
        .user {
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          align-items: center;
          color: #606266;
          span:first-child {
            font-weight: bold;
            font-size: 14px;
          }
          span:last-child {
            font-size: 13px;
          }
        }
        .title {
          width: 100%;
          font-size: 13px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          color: #606266;
        }
        &:hover {
          background: #ebeef5;
          .title {
            span:last-child {
              color: #606266;
              font-weight: normal;
            }
          }
          .user {
            color: #606266;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
