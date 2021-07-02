<template>
  <!-- 菜单 -->
  <div id="manager-label">
    <c-content v-loading="loading">
      <div slot="search" class="screen">
        <div class="screen_left" v-if="isShowTeam">
          <span class="lable">团队</span>
          <el-select
            v-model="teamValue"
            filterable
            placeholder="请选择团队"
            clearable
            @change="handleChange"
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
        <div class="screen_right">
          <el-button type="primary" @click="addClick" size="medium"
            >添加</el-button
          >
        </div>
      </div>
      <!-- 主体表格部分 -->
      <el-table
        slot="main"
        :data="tableData"
        ref="multipleTable"
        style="width: 100%"
        :cell-style="cellStyle"
        :header-cell-style="cellStyle"
      >
        <template slot="empty" style="font-size: 0">
          <!-- <p>暂无内容</p> -->
          <div style="height: 100%">
            <img
              src="@/assets/img/emptyData.png"
              style="display: inline-block; width: 50%; margin-top: 100px"
            />
          </div>
        </template>

        <el-table-column
          min-width="100"
          label="进程组名称"
          :show-overflow-tooltip="true"
          prop="Name"
        >
        </el-table-column>
        <el-table-column
          min-width="150"
          label="成员"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              width="350"
              v-if="scope.row.UserData.length"
            >
              <div slot="reference" class="name-wrapper">
                <p style="cursor: pointer">{{ scope.row.UserData.length }}</p>
              </div>
              <ul class="member-style">
                <li v-for="(item, index) in scope.row.UserData" :key="index">
                  <img :src="imgChange(item.Picture, true)" alt="" /><span>{{
                    item.Name
                  }}</span>
                  <i
                    :style="
                      (index + 1) % 3 == 0 ||
                      index == scope.row.UserData.length - 1
                        ? 'display:none'
                        : ''
                    "
                  ></i>
                </li>
              </ul>
            </el-popover>
            <span v-else>{{ scope.row.UserData.length }}人</span>
          </template>
        </el-table-column>
        <!--      <el-table-column min-width="150" label="标签状态" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span slot="reference" class='row-state'>
                        <i v-if="scope.row.Tag.Shape === 1" 
                            @click="stateToggle(scope.row, 0)" class="el-icon-check">
                        </i>
                        <i v-if="scope.row.Tag.Shape === 0" 
                            @click="stateToggle(scope.row, 1)" class="el-icon-close">
                        </i>
                    </span>
                </template>
            </el-table-column> -->
        <el-table-column label="操作" min-width="110">
          <!-- fixed  -->
          <template slot-scope="scope">
            <span v-if="scope.row.IsReadOnly">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handleDelt(scope.row)"
                >删除</el-button
              >
            </span>
            <el-tag type="info" v-else>无操作权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <c-pages
        slot="pages"
        v-model="pageData"
        @changeEvent="handlePage"
      ></c-pages>
    </c-content>

    <LabelW
      :indexData="indexData"
      ref="proGroupWindow"
      @eventComfirm="getDataList"
    ></LabelW>
  </div>
</template>
<script>
import { imgChange } from "@/commons";
export default {
  components: {
    CContent: () => import("@/components/CContent"),

    CPages: () => import("@/components/CPages"),
    LabelW: () => import("./proGroupW"),
  },
  data() {
    "#main";
    return {
      isShowTeam: true,
      teamValue: null, //选择的团队
      teamOptions: [],
      loading: false,
      pageData: {
        pageIndex: 1,
        pageSize: 10,
        totalNum: 0,
      },

      tableData: [],
      searchKW: "",
      multipleSelection: "",
      indexData: {
        type: "", // Add Edit
        name: "",
        departmentCode: "",
      },
      cellStyle: {
        textAlign: "center",
      },
    };
  },
  mounted() {
    const role = this.$xStorage.getItem("user-role");
    if (role.team) {
      this.teamValue = role.team;
      this.isShowTeam = false;
    } else {
      this.isShowTeam = true;
    }
    this.getDataList();
    this.$nextTick(() => {
      if (!this.teamValue) {
        this.getTeams();
      }
    });
  },
  methods: {
    imgChange,
    handleChange() {
      this.pageData.pageIndex = 1;
      this.getDataList();
    },
    /**
     * 分页
     */
    handlePage(val) {
      this.pageData = val;
      this.getDataList();
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
    // 删除某一行
    handleDelt(row) {
      this.$confirm("此操作将删除此进程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            id: [row.ID],
          };
          this.comDelete(params);
        })
        .catch(() => {});
    },
    comDelete(params) {
      this.$http
        .post("/ProgressGroup/DelProgressGroup.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success",
            });
            this.getDataList();
          }
        });
    },

    // 新增
    addClick() {
      this.openWin("ad");
    },
    // 编辑
    handleEdit(row) {
      this.openWin("ed", row.ID, row.Name);
    },
    // 打开窗口
    openWin(ty, code, proName) {
      this.indexData = {
        type: ty === "ad" ? "Add" : "Edit",
        name: ty === "ad" ? "添加进程组" : "编辑进程组",
        departmentCode: code,
        proName: proName,
        xModalName: "proGroupWindow",
      };
      this.$modal.show("proGroupWindow");
      this.$nextTick(() => {
        this.$refs.proGroupWindow.changeEditState();
      });
    },
    // 分页
    getDataList() {
      // if (!this.teamValue) {
      //   this.$message({
      //     showClose: true,
      //     message: "请选择团队",
      //     type: "warning",
      //   });
      //   return;
      // }
      let params = {
        name: this.searchKW,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        teamId: this.teamValue,
      };
      this.loading = true;
      this.$http
        .post("/ProgressGroup/QueryProgressGroupList.ashx", params)
        .then((result) => {
          if (result.res == 0) {
            console.log(result);
            this.tableData = result.data.Data;
            this.pageData.totalNum = result.data.TotalCount;
            this.loading = false;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
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
      overflow: hidden;
      white-space: nowrap;
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
#manager-label {
  height: 100%;
  box-sizing: border-box;
  .screen {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .screen_left {
      .lable {
        font-weight: 700;
        font-size: 1.4rem;
        margin-right: 5px;
      }
    }
  }
}
</style>
