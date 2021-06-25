<template>
  <div id="dataDic">
    <XHeader
      title="数据字典"
      titleEnglish="data Dictionary"
      class="baseHeader"
    ></XHeader>
    <div class="dic-content">
      <div class="search">
        <div class="search-input">
          <el-input
            v-model="searchValue"
            placeholder="搜索"
            @keyup.enter.native="search"
          ></el-input>
        </div>
        <p @click="addMore()">新增</p>
      </div>
      <div class="chart">
        <el-table
          :data="tableData"
          border
          row-key="DataID"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :default-expand-all="false"
          :row-style="formStyle"
          height="610"
        >
          <el-table-column prop="Key" label="Key(Name-Key)"></el-table-column>
          <el-table-column
            prop="Value"
            label="参数名/枚举(Argument-Value)"
            min-width="100px"
          ></el-table-column>
          <el-table-column prop="Name" label="别名(Name)"></el-table-column>
          <el-table-column prop="Icon" label="图标(Icon)"></el-table-column>
          <el-table-column prop="Color" label="颜色(Color)"></el-table-column>
          <el-table-column
            prop="Custom"
            label="自定义值(Custom)"
          ></el-table-column>
          <el-table-column label="操作" min-width="150px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="addDicChild(scope.$index, scope.row)"
                v-if="scope.row.children"
                >增加</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog :visible.sync="edit">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="名称"
          ><el-input v-model="editObj.Key"></el-input
        ></el-form-item>
        <el-form-item label="参数名/枚举"
          ><el-input v-model="editObj.Value"></el-input
        ></el-form-item>
        <el-form-item label="别名" v-if="!AddFather"
          ><el-input v-model="editObj.Name"></el-input
        ></el-form-item>
        <el-form-item label="图标" v-if="!AddFather"
          ><el-input v-model="editObj.Icon"></el-input
        ></el-form-item>
        <el-form-item label="颜色" v-if="!AddFather"
          ><el-input v-model="editObj.Color"></el-input
        ></el-form-item>
        <el-form-item label="自定义值" v-if="!AddFather"
          ><el-input v-model="editObj.Custom"></el-input
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XHeader from "@/components/Header";
import xDictionary from "@/assets/xDictionary.js";
export default {
  name: "dataDictionary",
  components: {
    XHeader,
  },
  data() {
    return {
      searchValue: "",
      tableData: [],
      editObj: {},
      edit: false,
      add: false,
      AddFather: false,
    };
  },
  computed: {
    dic_url() {
      return process.env.VUE_APP_DIC;
    },
  },
  watch: {
    searchValue() {
      if (this.searchValue == "") {
        this.getDic();
      }
    },
  },
  methods: {
    addMore() {
      //新增一个父级
      this.editObj = {};
      this.edit = true;
      this.add = true;
      this.AddFather = true;
    },
    handleEdit(index, row) {
      //编辑
      this.edit = true;
      this.editObj = row;
      if (!row.DictionaryID) {
        this.AddFather = true;
      } else {
        this.AddFather = false;
      }
    },
    handleDelete(index, row) {
      //删除
      this.$confirm("是否删除该字段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let param = {};
        if (row.DictionaryID) {
          param = {
            ID: row.DictionaryID,
            FID: row.FDictionaryID,
          };
        } else {
          param = {
            ID: row.FDictionaryID,
          };
        }
        this.$http
          .post(
            this.dic_url +
              "/MGT/System/DataDictionary/DeleteDataDictionary.ashx",
            param
          )
          .then((res) => {
            if (res.res == 0) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.getDic();
            }
          });
      });
    },
    addDicChild(index, row) {
      //添加子级
      this.edit = true;
      this.add = true;
      this.AddFather = false;
      this.editObj = {};
      let arr = row.children.map((item) => {
        return item.Value;
      });
      if (arr.length) {
        this.editObj.Value = String(Math.max(...arr) + 1);
      }
      this.editObj.FDictionaryID = row.FDictionaryID;
      this.editObj = Object.assign({}, this.editObj);
      console.log(this.editObj);
    },
    getDic() {
      //获取数据字典
      this.edit = false;
      this.add = false;
      this.AddFather = false;
      this.editObj = {};
      this.$http
        .post(
          this.dic_url +
            "/MGT/System/DataDictionary/NewGetDataDictionaryList.ashx",
          {
            name: this.searchValue,
          }
        )
        .then((res) => {
          if (res.res == 0) {
            this.tableData = res.data;
            this.$D = new xDictionary();
          }
        });
    },
    addDic() {
      //添加父级
      let icon = "";
      let Color = "";
      let FID = "";
      if (this.editObj.Icon) {
        icon = this.editObj.Icon;
      }
      if (this.editObj.Color) {
        Color = this.editObj.Color;
      }
      if (this.editObj.FDictionaryID) {
        FID = "";
      }
      this.$http
        .post(
          this.dic_url + "/MGT/System/DataDictionary/AddDataDictionary.ashx",
          {
            key: this.editObj.Key,
            value: this.editObj.Value,
            FID,
            icon,
            Color,
          }
        )
        .then((res) => {
          if (res.res == 0) {
            this.$message({
              type: "success",
              message: res.msg,
            });
            this.getDic();
            this.AddFather = false;
          }
        });
    },
    submit() {
      let obj = JSON.stringify(this.editObj);
      let isEdit = obj == "{}" ? true : false; //判断是添加还是编辑
      if (isEdit) {
        this.$message({
          type: "error",
          message: "输入必填字段及其枚举值",
        });
        return;
      }
      if (this.add && !this.editObj.FDictionaryID) {
        //添加父级
        this.addDic();
        return;
      }
      if (this.add && this.editObj.FDictionaryID) {
        if (!this.editObj.Key && !this.editObj.Value) {
          this.$message({
            type: "error",
            message: "输入必填字段及其枚举值",
          });
          return;
        }
        this.$http
          .post(
            this.dic_url + "/MGT/System/DataDictionary/AddDataDictionary.ashx",
            {
              //添加子级
              key: this.editObj.Key,
              value: this.editObj.Value,
              FID: this.editObj.FDictionaryID,
              icon: this.editObj.Icon,
              Color: this.editObj.Color,
              custom: this.editObj.Custom,
              name: this.editObj.Name,
            }
          )
          .then((res) => {
            if (res.res == 0) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.getDic();
            }
          });

        return;
      }
      if (!this.add && !this.editObj.DictionaryID) {
        //修改父级
        this.$http
          .post(
            this.dic_url +
              "/MGT/System/DataDictionary/EditDataDictionaryList.ashx",
            {
              dictionaryID: this.editObj.FDictionaryID,
              key: this.editObj.Key,
              value: this.editObj.Value,
              icon: this.editObj.Icon,
              Color: this.editObj.Color,
              custom: this.editObj.Custom,
            }
          )
          .then((res) => {
            if (res.res == 0) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.getDic();
              return;
            }
          });
      }
      if (!this.add && this.editObj.DictionaryID) {
        //修改子级
        this.$http
          .post(
            this.dic_url +
              "/MGT/System/DataDictionary/EditDataDictionaryList.ashx",
            {
              dictionaryID: this.editObj.DictionaryID,
              fDictionaryID: this.editObj.FDictionaryID,
              key: this.editObj.Key,
              value: this.editObj.Value,
              icon: this.editObj.Icon,
              Color: this.editObj.Color,
              custom: this.editObj.Custom,
              name: this.editObj.Name,
            }
          )
          .then((res) => {
            if (res.res == 0) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.getDic();
              return;
            }
          });
      }
    },
    formStyle(row, index) {
      //父级样式
      if (!row.row.DictionaryID) {
        return {
          "font-weight": "bold",
        };
      }
    },
    cancel() {
      // this.AddFather = false
      this.add = false;
      this.edit = false;
    },
    search() {
      this.getDic();
    },
  },
  mounted() {
    this.getDic();
  },
};
</script>

<style lang="less" scoped="scoped">
#dataDic {
  position: relative;
  min-height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /deep/.el-table {
    .cell {
      white-space: nowrap !important;
    }
  }
  .dic-content {
    background: #fff;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .search {
      display: flex;
      font-size: 1.6rem;
      justify-content: space-between;
      // margin-top: 1.8rem;
      padding: 0 1.5rem;
      padding-top: 2rem;
      .search-input {
        display: flex;
        align-items: center;
        width: 30rem;
        height: 3.5rem;
        justify-content: space-between;
        border: 1px solid #448ef5;
        border-radius: 0.4rem;

        /deep/.el-input {
          .el-input__inner {
            background: #fff;
            border: none !important;
            height: 3.2rem;
            border-right: 0;
            color: #cccccc;
            font-size: 1.6rem;
          }
        }

        span {
          display: block;
          width: 9rem;
          line-height: 3.2rem;
          background: linear-gradient(
            134deg,
            rgba(97, 193, 254, 1) 0%,
            rgba(66, 139, 244, 1) 100%
          );
          border-radius: 0px 0.4rem 0.4rem 0px;
          text-align: center;
          color: #fff;
          font-size: 1.6rem;
          cursor: pointer;
        }
      }

      p {
        width: 9rem;
        line-height: 3.5rem;
        height: 3.5rem;
        border: 1px solid #448ef5;
        text-align: center;
        box-shadow: 0px 2px 4px 0px rgba(204, 204, 204, 1);
        border-radius: 0.4rem;
        font-size: 1.6rem;
        color: #448ef5;
        cursor: pointer;
      }
    }

    .chart {
      margin-top: 3rem;
      padding: 0 1.5rem;
      box-sizing: border-box;
      flex: 1;
      /deep/.el-table {
        tr {
          width: 80%;

          td:nth-of-type(2) {
            width: 20%;

            .cell {
              padding-left: 3rem;
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>
