<template>
  <XM
    isFixed
    name="applyAudit"
    ref="xmodal"
    :title="readOnly ? '事务详情' : '提交类型'"
    :confirmBtnText="readOnly ? '' : '审批'"
    cancelBtnText="取消"
    @onConfirm="submit"
    @closed="closed"
    id="applyAudit"
  >
    <div v-if="auditInfo">
      <div class="audit_header">
        <div>
          <img v-lazy="$url + auditInfo.ApplyPicture" />
          <span>{{ auditInfo.ApplyName }}</span>
        </div>
        <p>申请时间:{{ auditInfo.CreateTime.timeFormat("yyyy-MM-dd") }}</p>
      </div>
      <el-form class="custom_content" label-width="90px">
        <el-form-item label="申诉日期：">{{
          auditInfo.AnomalyTime
            ? auditInfo.AnomalyTime.timeFormat("yyyy-MM-dd")
            : ""
        }}</el-form-item>
        <el-form-item label="申述类型：">
          <el-checkbox-group
            v-model="auditInfo.AnomalyType"
            :disabled="readOnly"
          >
            <el-checkbox :label="1">上班</el-checkbox>
            <el-checkbox :label="2">下班</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="上班时间："
          v-if="auditInfo.AnomalyType.includes(1)"
        >
          <el-date-picker
            v-model="auditInfo.ClockInTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 70%"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :disabled="readOnly"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="上班状态："
          v-if="auditInfo.AnomalyType.includes(1)"
        >
          <el-select
            v-model="auditInfo.ClockInStatus"
            style="width: 70%"
            :disabled="readOnly"
          >
            <el-option
              v-for="item in $D.LIST('at_state')"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :disabled="filterOption(item)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="下班时间："
          v-if="auditInfo.AnomalyType.includes(2)"
        >
          <el-date-picker
            v-model="auditInfo.ClockOutTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 70%"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :disabled="readOnly"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="下班状态："
          v-if="auditInfo.AnomalyType.includes(2)"
        >
          <el-select
            v-model="auditInfo.ClockOutStatus"
            style="width: 70%"
            :disabled="readOnly"
          >
            <el-option
              v-for="item in $D.LIST('at_state')"
              :key="item.value"
              :label="item.custom"
              :value="item.value"
              :disabled="filterOption(item)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申诉原因：" prop="Reason">{{
          auditInfo.Reason
        }}</el-form-item>
      </el-form>
      <el-form
        v-if="!readOnly"
        class="audit_bottom"
        :model="elForm"
        :rules="rules"
        ref="elForm"
        label-width="100px"
      >
        <el-form-item label="审核结果：" prop="isPass">
          <el-select v-model="elForm.isPass" @change="elForm.remark = null">
            <el-option
              v-for="item in optiops"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="elForm.isPass ? '我的留言：' : '驳回理由：'"
          :prop="elForm.isPass ? '' : 'remark'"
        >
          <el-input
            ref="container"
            type="textarea"
            v-model="elForm.remark"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </XM>
</template>
<script>
export default {
  components: {
    XM: () => import("@/components/XModal"),
  },
  props: {
    auditInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      optiops: [
        {
          label: "通过",
          value: true,
        },
        {
          label: "驳回",
          value: false,
        },
      ],
      rules: {
        isPass: [
          {
            required: true,
            message: "必选",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "理由必填",
            trigger: "blur",
          },
        ],
      },
      elForm: {
        isPass: true,
        auditID: null,
        stepID: null, //当下一步出现分支时,必传此项,选择下一步走向哪里
        remark: "", //审批留言
      },
      elFormData: {
        Message: "",
        Rule: null,
        TotalTimes: null,
        Pass: true,
      },

      pageData: {
        form: [],
        member: {
          applicantHead: "",
          applicantTime: "",
        },
        history: [],
      },

      readOnly: false,
    };
  },

  methods: {
    //时间
    showDetail(time, index) {
      if (time) {
        return time.timeFormat("yyyy-MM-dd HH:mm");
      } else {
        if (
          !this.pageData.history[0].AuditTime ||
          this.pageData.history[index - 1].AuditTime
        ) {
          return "当前";
        }
      }
    },
    //步骤颜色
    stepColor(sutaus) {
      if (sutaus == 4) {
        return "#67C23A";
      } else if (sutaus == 3) {
        return "#F56C6C";
      } else {
        return "";
      }
    },

    submit() {
      this.$refs.elForm.validate(async (vaild) => {
        if (vaild) {
          this.$refs.xmodal.loadBtn(true);
          let url = "";
          url = "/Work/TransactionAudit/AuditAttendanceComplaint.ashx";
          this.elForm.data = this.pageData.form;
          let resp = await this.$http.post(url, this.elForm);
          this.$refs.xmodal.loadBtn(false);
          if (resp.res == 0) {
            this.$notify({
              type: "success",
              message: resp.msg,
            });
            this.$modal.hide("applyAudit");
            this.$emit("upData");
            this.$emit("successHandle");
          }
        } else {
          this.$refs.container.focus();
        }
      });
    },
    closed() {
      Object.assign(this.$data.elForm, this.$options.data().elForm);
    },

    filterOption(item) {
      return item.value == -1 || item.value == 3;
    },
  },
  created() {
    this.getTypeList();
  },
};
</script>
<style lang="less" scoped>
#applyAudit {
  /deep/.tit {
    border-bottom: 1px solid #eee;
  }

  /deep/.ctn {
    padding: 1rem;
    .audit_content,
    .custom_content {
      margin: 1rem;
      padding: 0.8rem;
      // background: #eee;
      .el-form-item {
        margin-bottom: 0 !important;
      }
      .project {
        .el-tag {
          margin: 0 0.8rem 0.8rem 0;
        }
      }
    }
    .audit_content {
      .el-form-item__content,
      .el-form-item__label {
        line-height: 32px;
      }
      .partners {
        display: flex;
        align-items: center;
        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          img {
            width: 3.2rem;
            height: 3.2rem;
            border-radius: 50%;
            margin-right: 0.5rem;
          }
        }
      }
      .file_single {
        margin: 1rem 1.6rem;
        & > div {
          display: flex;
          align-items: center;
          position: relative;
          box-sizing: border-box;
          padding: 0.5rem 1.6rem;
          background: #f8f8f8;
          transition: background 0.3s ease;

          & > img {
            position: absolute;
            width: 3.2rem;
          }

          .file-info {
            width: 100%;
            padding-left: 4.2rem;
            padding-right: 6rem;
            box-sizing: border-box;

            & > h3 {
              color: #575757;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 80%;
              font-size: 14px;
              line-height: 20px;
            }

            & > div {
              color: #aaa;
              font-size: 1.2rem;
              line-height: 20px;

              & > s {
                margin-right: 0.3rem;
                color: #999;
                display: inline-block;
                min-width: 4rem;
              }

              & > u {
                padding-left: 0.5rem;
                margin-right: 0.3rem;
                border-left: 1px solid #ddd;
              }
            }
          }

          .file-btns {
            position: absolute;
            right: 1rem;

            & > a {
              cursor: pointer;
              display: inline-block;
              background: #ddd;
              color: #575757;
              width: 3rem;
              height: 3rem;
              line-height: 3rem;
              text-align: center;
              margin-right: 0.5rem;
              border-radius: 3rem;
              transition: all 0.3s ease;

              &:hover {
                color: #fff;
                background: #448ef5;
              }
            }
          }

          &:hover {
            background: #eee;
          }
        }
      }
    }
    .custom_content {
      .el-form-item {
        margin-bottom: 10px !important;
      }
    }
    .audit_history {
      padding: 1rem 1rem 0 1.5rem;
      border-bottom: 1px solid #eee;
      border-top: 1px solid #eee;
    }
    .audit_bottom {
      margin-top: 1rem;
    }
    .audit_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 1.5rem;
      padding-right: 1rem;
      font-size: 1.6rem;
      & > div {
        img {
          width: 3rem;
          height: 3rem;
          display: inline-block;
          vertical-align: middle;
          border-radius: 50%;
          margin-right: 0.2rem;
        }
        span {
          vertical-align: middle;
        }
      }
    }
  }
  .modal_lable {
    color: #333333;
    font-weight: 700;
  }
}
</style>
