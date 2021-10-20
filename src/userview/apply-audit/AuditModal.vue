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
    <div v-loading="formLoading">
      <div class="audit_header" v-if="pageData.member.applicantTime">
        <div>
          <img v-lazy="$url + pageData.member.applicantHead" />
          <span>{{ pageData.member.applicantName }}</span>
        </div>
        <p>
          申请时间:{{ pageData.member.applicantTime.timeFormat("yyyy-MM-dd") }}
        </p>
      </div>
      <div class="audit_header" v-else-if="pageData.form.Name">
        <div>
          <img v-lazy="$url + pageData.form.Picture" />
          <span>{{ pageData.form.Name }}</span>
        </div>
        <p v-if="pageData.form.CreateTime">
          申请时间:{{ pageData.form.CreateTime.timeFormat("yyyy-MM-dd") }}
        </p>
      </div>
      <el-form
        class="custom_content"
        v-if="pageType == -1 && pageData.form.DateType"
        label-width="90px"
      >
        <el-form-item label="申诉日期：">{{
          pageData.form.Date.timeFormat("yyyy-MM-dd")
        }}</el-form-item>
        <el-form-item label="申述类型：">
          <el-checkbox-group
            v-model="pageData.form.DateType"
            :disabled="readOnly"
          >
            <el-checkbox :label="1">上班</el-checkbox>
            <el-checkbox :label="2">下班</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="上班时间："
          v-if="pageData.form.DateType.includes(1)"
        >
          <el-date-picker
            v-model="pageData.form.StartTime"
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
          v-if="pageData.form.DateType.includes(1)"
        >
          <el-select
            v-model="pageData.form.StartStatus"
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
          v-if="pageData.form.DateType.includes(2)"
        >
          <el-date-picker
            v-model="pageData.form.EndTime"
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
          v-if="pageData.form.DateType.includes(2)"
        >
          <el-select
            v-model="pageData.form.EndStatus"
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
          pageData.form.Reason
        }}</el-form-item>
      </el-form>
      <el-timeline class="audit_history">
        <el-timeline-item
          v-for="(h, index) in pageData.history"
          :color="stepColor(h.AuditResult)"
          :timestamp="showDetail(h.AuditTime, index)"
          placement="top"
          :key="index"
        >
          <el-card>
            <h4 v-if="h.AuditResult == 4">
              {{ h.Auditor && h.Auditor.AuditorName }}
              <label class="modal_lable">通过</label> (步骤名称:{{
                h.StepName
              }})
            </h4>
            <h4 v-else-if="h.AuditResult == 3">
              {{ h.Auditor && h.Auditor.AuditorName }}
              <label class="modal_lable">驳回</label> (步骤名称:{{
                h.StepName
              }})
            </h4>
            <h4 v-else>
              {{ h.Auditor && h.Auditor.AuditorName }} 待审核(步骤名称:{{
                h.StepName
              }})
            </h4>
            <p style="height: 0.5rem"></p>
            <p v-if="h.AuditResult == 4 && h.AuditRemark">
              <label class="modal_lable">留言：</label>{{ h.AuditRemark }}
            </p>
            <p v-else-if="h.AuditResult == 3">
              <label class="modal_lable">理由：</label>{{ h.AuditRemark }}
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
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
      formLoading: false,
      pageData: {
        form: [],
        member: {
          applicantHead: "",
          applicantTime: "",
        },
        history: [],
      },
      pageType: null,
      typeList: null,
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
    //获取数据
    showModal(audit) {
      this.$modal.show("applyAudit");
      this.formLoading = true;
      this.$http
        .get("/MGT/Process/LoadApplicationForm.ashx", {
          params: {
            auditID: audit.auditID,
          },
        })
        .then((resp) => {
          if (resp.res == 0) {
            this.pageData.form = JSON.parse(resp.data.content);
            if (this.pageData.form.DateType != undefined) {
              this.pageType = -1;
            } else if (this.pageData.form.LeaveType != undefined) {
              this.pageType = -2;
            } else if (resp.data.type == "加班申请") {
              this.pageType = -4;
              this.overTimeData.reach = resp.data.reach;
              this.overTimeData.overtime = resp.data.overtime;
            } else if (resp.data.type == "外出申请") {
              this.pageType = -5;
            } else {
              this.pageType = null;
            }
            this.readOnly = !resp.data.canAudit;
            this.pageData.member = audit;
            this.pageData.history = resp.data.history;
            this.elForm.auditID = audit.auditID;
            this.formLoading = false;
          }
        });
    },
    submit() {
      this.$refs.elForm.validate(async (vaild) => {
        if (vaild) {
          this.$refs.xmodal.loadBtn(true);
          let url = "";
          if (this.pageType == -1) {
            url = "/Work/TransactionAudit/AuditAttendanceComplaint.ashx";
            this.elForm.data = this.pageData.form;
          } else if (this.pageType == -2) {
            url = "/Work/Leave/AuditLeave.ashx";
            this.elForm.pass = this.elForm.isPass;
          } else if (this.pageType == -4) {
            url = "/Work/OverTimeAudit/AuditOverTimeComplaint.ashx";
            this.elFormData.Message = this.elForm.remark;
            this.elFormData.Pass = this.elForm.isPass;
            this.elForm.data = this.elFormData;
          } else if (this.pageType == -5) {
            url = "/Work/Outside/AuditOutsideComplaint.ashx";
            this.elForm.data = {
              Message: this.elForm.remark,
              Pass: this.elForm.isPass,
            };
          } else {
            url = "/MGT/Process/LoadApplicationForm.ashx";
          }
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
    //获取类型列表
    getTypeList() {
      this.$http.get("/Work/Leave/GetLeaveType.ashx").then((res) => {
        if (res.res == 0) {
          let obj = {};
          for (let item of res.data) {
            obj[item.value] = item.name;
          }
          this.typeList = obj;
        }
      });
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
