<template>
  <div id="teamManagement" v-loading="loading">
    <Header
      title="团队管理"
      titleEnglish="Team Management"
      class="baseHeader"
    />
    <CContent>
      <template #search>
        <CTitle
          :TInfo="titleInfo"
          @addClick="handleAdd"
          @searchClick="handleSearchByKeyWord"
        />
      </template>
      <template #main>
        <el-table :data="tableData" stripe>
          <el-table-column
            label="团队ID"
            prop="Id"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="创建人"
            prop="UserName"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="团队名称"
            prop="Name"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="团队描述"
            prop="Describe"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            label="所选团队版本过期时间"
            prop="ExpireTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{ row: { ExpireTime } }">{{
              typeof ExpireTime === "string"
                ? ExpireTime.timeFormat("yyyy-MM-dd HH:s")
                : null
            }}</template>
          </el-table-column>
          <el-table-column
            label="团队创建时间"
            prop="CreatTime"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="{ row: { CreatTime } }">{{
              typeof CreatTime === "string"
                ? CreatTime.timeFormat("yyyy-MM-dd HH:s")
                : null
            }}</template></el-table-column
          >
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template slot-scope="{ row: { Id } }">
              <el-button
                type="text"
                size="small"
                @click="queryTeamManagementDetail(Id)"
                data-danger-prev
                >详情</el-button
              >
              <el-popconfirm
                title="确定删除这条数据吗？"
                @confirm="handleDeleteRow(Id)"
              >
                <template #reference>
                  <el-button type="text" size="small" data-danger
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pages>
        <CPages v-model="pageData" @changeEvent="handlePaginationChange" />
      </template>
    </CContent>
    <XModal
      name="teamDialog"
      width="80%"
      height="80%"
      @beforeClose="teamXModalBeforeClose"
    >
      <CWinTmp
        ref="teamWinTmp"
        :indexData="detailDialog.indexData"
        @editClick="teamWinTmpEditClick"
        v-model="isEdit"
        @topSubmit="teamWinTmpSubmit"
        @comfirmClick="teamWinTmpSubmit"
      >
        <el-form
          class="detail-dialog-root"
          slot="form"
          :model="detailDialog.form.data"
        >
          <div class="detail-dialog-content">
            <div class="detail-dialog-content-title" v-if="!isEdit">团队</div>
            <el-row :gutter="8">
              <el-col :md="8" v-if="!isEdit">
                <Statistic>
                  <template #title>团队Id</template>
                  <template #value>{{
                    detailDialog.data.Teamdata.Id
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8" v-if="!isEdit">
                <Statistic>
                  <template #title>创建人名称</template>
                  <template #value>{{
                    detailDialog.data.Teamdata.UserName
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8" v-if="!isEdit">
                <Statistic>
                  <template #title>公司Id</template>
                  <template #value>{{
                    detailDialog.data.Teamdata.CompanyId | isEmpty
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8">
                <Statistic>
                  <template #title>团队版本订单Id</template>
                  <template #value v-if="isEdit">团队版本订单选择器</template>
                  <template #value v-else>{{
                    detailDialog.data.Teamdata.TeamOrderId | isEmpty
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8">
                <Statistic>
                  <template #title>团队名称</template>
                  <template #value v-if="isEdit">
                    <el-form-item>
                      <el-input v-model="detailDialog.form.data.Teamdata.Name" />
                    </el-form-item>
                  </template>
                  <template #value v-else>{{
                    detailDialog.data.Teamdata.Name
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8">
                <Statistic>
                  <template #title>团队描述</template>
                  <template #value v-if="isEdit">
                    <el-form-item>
                      <el-input v-model="detailDialog.form.data.Teamdata.Describe" />
                    </el-form-item>
                  </template>
                  <template #value v-else>{{
                    detailDialog.data.Teamdata.Describe | isEmpty
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8" v-if="!isEdit">
                <Statistic>
                  <template #title>过期时间</template>
                  <template #value>{{
                    detailDialog.data.Teamdata.ExpireTime | isEmptyByDateTime
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8" v-if="!isEdit">
                <Statistic>
                  <template #title>团队创建时间</template>
                  <template #value>{{
                    detailDialog.data.Teamdata.CreatTime | isEmptyByDateTime
                  }}</template>
                </Statistic>
              </el-col>
            </el-row>
          </div>
          <div class="detail-dialog-content">
            <div class="detail-dialog-content-title" v-if="!isEdit">公司</div>
            <el-row :gutter="8">
              <el-col :md="8">
                <Statistic>
                  <template #title>公司Id</template>
                  <template #value v-if="isEdit">公司选择器</template>
                  <template #value v-else>{{
                    !!detailDialog.data.Company
                      ? detailDialog.data.Company.Id
                      : "--"
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8" v-if="!isEdit">
                <Statistic>
                  <template #title>公司名称</template>
                  <template #value>{{
                    !!detailDialog.data.Company
                      ? detailDialog.data.Company.Name
                      : "--"
                  }}</template>
                </Statistic>
              </el-col>
            </el-row>
          </div>
          <div class="detail-dialog-content" v-if="!isEdit">
            <div class="detail-dialog-content-title">版本</div>
            <el-row :gutter="8">
              <el-col :md="8">
                <Statistic>
                  <template #title>公司Id</template>
                  <template #value>{{
                    !!detailDialog.data.Vsersion
                      ? detailDialog.data.Vsersion.Id
                      : "--"
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8">
                <Statistic>
                  <template #title>版本名称</template>
                  <template #value>{{
                    !!detailDialog.data.Vsersion
                      ? detailDialog.data.Vsersion.VsersionName
                      : "--"
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8">
                <Statistic>
                  <template #title>版本金额</template>
                  <template #value>{{
                    !!detailDialog.data.Vsersion
                      ? detailDialog.data.Vsersion.VersionPrice
                      : "--"
                  }}</template>
                </Statistic>
              </el-col>
              <el-col :md="8">
                <Statistic>
                  <template #title>版本期限(天)</template>
                  <template #value>{{
                    !!detailDialog.data.Vsersion
                      ? detailDialog.data.Vsersion.VersionPeriod
                      : "--"
                  }}</template>
                </Statistic>
              </el-col>
            </el-row>
          </div>
          <div class="detail-dialog-content">
            <div class="detail-dialog-content-title" v-if="!isEdit">成员列表</div>
            <Statistic v-if="isEdit">
              <template #title>成员列表</template>
              <template #value>
                <MemberSelect @Confirm="e => console.log(e)" :arrays="detailDialog.form.data.Membersdata">
                  <template #button><i class="el-icon-circle-plus-outline" /></template>
                </MemberSelect>
              </template>
            </Statistic>
            <el-table
              v-else
              :data="detailDialog.visible ? detailDialog.data.Membersdata : []"
              stripe
            >
              <el-table-column
                label="成员Id"
                prop="Id"
                show-overflow-tooltip
                align="center"
              />
              <el-table-column
                label="成员的用户Id"
                prop="MembersId"
                show-overflow-tooltip
                align="center"
              />
              <el-table-column
                label="成员名称"
                prop="MembersName"
                show-overflow-tooltip
                align="center"
              />
              <el-table-column
                label="成员电话"
                prop="MembersPhone"
                show-overflow-tooltip
                align="center"
              />
            </el-table>
          </div>
        </el-form>
      </CWinTmp>
    </XModal>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  components: {
    Header: () => import("@/components/Header"),
    CContent: () => import("@/components/CContent"),
    CTitle: () => import("@/components/CTitle"),
    CBtn: () => import("@/components/CBtn"),
    CPages: () => import("@/components/CPages"),
    Statistic: () => import("@/components/Statistic"),
    XModal: () => import("@/components/XModal"),
    CWinTmp: () => import("@/components/CWinTmp"),
    MemberSelect: () => import('@/components/Selectors/MemberSelect'),
  },
  data() {
    return {
      loading: false,
      tableData: [],
      titleInfo: {
        btnShow: [
          { type: "addBtn", ishow: true },
          { type: "startBtn", ishow: false, disabled: true },
          { type: "closeBtn", ishow: false, disabled: true },
          { type: "delBtn", ishow: false, disabled: true },
        ],
        dropDown: {
          searchInput: {
            placeholder: "请输入团队名称",
            value: this.$route.query.searchText ?? null,
          },
        },
      },
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },
      detailDialog: {
        visible: false,
        data: null,
        form: {
          data: null,
        },
        indexData: {
          type: "",
          name: "",
          xModalName: "teamDialog",
        },
      },
      isEdit: false,
    };
  },
  created() {
    const { pageIndex = 1, pageSize = 10, totalNum = 0 } = this.$route.query;
    this.pageData = {
      ...{
        pageIndex: Number.parseInt(pageIndex),
        pageSize: Number.parseInt(pageSize),
        totalNum: Number.parseInt(totalNum),
      },
    };
  },
  methods: {
    async queryData() {
      this.loading = true;
      try {
        const { res, data: { data, total } = {} } = await this.$http.get(
          `/Teams/TeamManagement.ashx${this.queryParams}`
        );
        if (res !== 0) return;

        this.tableData = data;
        this.pageData.totalNum = total;
      } catch {}
      this.loading = false;
    },
    async handleAdd() {
      this.isEdit = true
      this.detailDialog = {
        ...this.detailDialog,
        form: {
          ...this.detailDialog.form,
          data: {
            Company: {},
            Membersdata: [],
            Teamdata: {},
            Vsersion: null,
          },
        },
        indexData: {
          ...this.detailDialog.indexData,
          type: "Add",
          name: "添加团队",
        },
      };
      this.$modal.show("teamDialog");
    },
    async handlePaginationChange({ totalNum, ...data }) {
      this.pageData.totalNum = totalNum;
      this.$router.push({
        query: {
          ...this.$route.query,
          ...data,
        },
      });
    },
    handleView(...a) {
      console.log(a);
    },
    handleSearchByKeyWord(searchText) {
      this.$router.push({
        query: {
          ...this.$route.query,
          searchText,
        },
      });
    },
    async handleDeleteRow(teamId) {
      this.loading = true;
      try {
        const { res, msg } = await this.$http.post("/Teams/DelTeam.ashx", {
          teamId,
        });
        if (res === 0) {
          this.$message({
            message: msg,
            type: "success",
          });
          await this.queryData();
        }
      } catch {}
      this.loading = false;
    },
    async queryTeamManagementDetail(teamId) {
      this.loading = true;
      try {
        const { res, data } = await this.$http.get(
          "/Teams/TeamManagementDetail.ashx",
          {
            params: {
              teamId,
            },
          }
        );
        if (res === 0) {
          this.detailDialog = {
            ...this.detailDialog,
            data: _.cloneDeep(data),
            form: {
              ...this.detailDialog.form,
              data,
            },
            indexData: {
              ...this.detailDialog.indexData,
              type: "Edit",
              name: "编辑团队",
            },
          };
          this.$modal.show("teamDialog");
        }
      } catch {}
      this.loading = false;
    },
    teamXModalBeforeClose() {
      this.isEdit = false;
      this.detailDialog = {
        ...this.detailDialog,
        data: null,
        form: {
          data: null,
        },
      };
    },
    teamWinTmpEditClick() {
      // console.log(this.detailDialog.data, this.detailDialog.form.data)
      // if (!this.isEdit) this.isEdit = true;
    },
    async teamWinTmpSubmit() {
      console.log("teamWinTmpSubmit");
    },
  },
  computed: {
    queryParams() {
      const {
        query: { searchText, pageIndex, pageSize },
      } = this.$route;
      return `?searchText=${searchText ?? ""}&pageIndex=${
        pageIndex ?? 1
      }&pageSize=${pageSize ?? 10}`;
    },
  },
  watch: {
    queryParams: {
      deep: true,
      immediate: true,
      async handler(value, oldValue) {
        await this.queryData();
      },
    },
  },
  filters: {
    isEmpty(value, empty = "--") {
      if (value === void 0 || value === null) return empty;
      return value;
    },
    isEmptyByDateTime(value, empty = "--") {
      if (value === void 0 || value === null) return empty;
      return value.toString().timeFormat("yyyy年M月d日 HH:mm");
    },
  },
};
</script>

<style lang="less" scoped>
#teamManagement {
  height: 100%;

  /deep/.detail-dialog-root {
    > div {
      display: flex;
      flex-direction: column;

      > .el-dialog__body {
        flex: 1;
        overflow: auto;
        max-height: 65vh;
      }
    }
  }

  .detail-dialog-content {
    &-title {
      margin-bottom: 16px;
      color: #000000d9;
      font-size: 24px;
      font-weight: bold;
    }
    > .el-row {
      margin: -8px 0;

      > .el-col {
        margin: 8px 0;
      }
    }

    & + .detail-dialog-content {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px dashed #e4e4e4;
    }
  }
}
</style>