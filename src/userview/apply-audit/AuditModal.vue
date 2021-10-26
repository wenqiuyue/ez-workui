<template>
  <XM
    isFixed
    name="applyAudit"
    ref="xmodal"
    :title="isApply ? '申诉详情' : '申诉审批'"
    :confirmBtnText="isApply ? '' : '审批'"
    cancelBtnText="取消"
    @onConfirm="submit"
    @closed="closed"
    id="applyAudit"
  >
    <div v-if="auditInfo">
      <div class="audit_header">
        <div>
          <img :src="$url + auditInfo.ApplyPicture" />
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
          <el-checkbox-group v-model="auditInfo.AnomalyType" disabled>
            <el-checkbox :label="1">上班</el-checkbox>
            <el-checkbox :label="2">下班</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="上班时间："
          v-if="auditInfo.AnomalyType.includes(1)"
        >
          {{
            auditInfo.ClockInTime
              ? auditInfo.ClockInTime.timeFormat("yyyy-MM-dd")
              : ""
          }}
        </el-form-item>
        <el-form-item
          label="上班状态："
          v-if="auditInfo.AnomalyType.includes(1)"
        >
          {{ $D.ITEM("at_state", auditInfo.ClockInStatus).name }}
        </el-form-item>
        <el-form-item
          label="下班时间："
          v-if="auditInfo.AnomalyType.includes(2)"
        >
          {{
            auditInfo.ClockOutTime
              ? auditInfo.ClockOutTime.timeFormat("yyyy-MM-dd")
              : ""
          }}
        </el-form-item>
        <el-form-item
          label="下班状态："
          v-if="auditInfo.AnomalyType.includes(2)"
        >
          {{ $D.ITEM("at_state", auditInfo.ClockOutStatus).name }}
        </el-form-item>
        <el-form-item label="申诉原因：" prop="Reason">{{
          auditInfo.Reason
        }}</el-form-item>
        <el-form-item label="审批结果：" prop="AuditStatus" v-if="isApply">{{
          auditInfo.AuditStatus | auditResultFilters
        }}</el-form-item>
        <el-form-item
          label="审批备注："
          prop="AuditRemark"
          v-if="isApply && auditInfo.AuditStatus != 1"
          >{{
            auditInfo.AuditRemark ? auditInfo.AuditRemark : "无"
          }}</el-form-item
        >
      </el-form>
      <el-form
        v-if="!isApply"
        class="audit_bottom"
        :model="elForm"
        :rules="rules"
        ref="elForm"
        label-width="100px"
      >
        <el-form-item label="审核结果：" prop="Status">
          <el-select
            v-model="elForm.Status"
            @change="elForm.AuditRemark = null"
          >
            <el-option
              v-for="item in optiops"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="elForm.Status == 2 ? '我的留言：' : '驳回理由：'"
          :prop="elForm.Status == 2 ? '' : 'AuditRemark'"
        >
          <el-input
            ref="container"
            type="textarea"
            v-model="elForm.AuditRemark"
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
    //true为考勤申诉进来的页面  false为事务审批进来的页面
    isApply: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optiops: [
        {
          label: "通过",
          value: 2,
        },
        {
          label: "驳回",
          value: 1,
        },
      ],
      rules: {
        Status: [
          {
            required: true,
            message: "必选",
            trigger: "blur",
          },
        ],
        AuditRemark: [
          {
            required: true,
            message: "理由必填",
            trigger: "blur",
          },
        ],
      },
      elForm: {
        Status: 2,
        AuditRemark: "", //审批留言
      },
    };
  },
  filters: {
    auditResultFilters(value) {
      switch (value) {
        case 1:
          return "待审核";
        case 2:
          return "通过";
        case 3:
          return "驳回";
        default:
          break;
      }
    },
  },
  methods: {
    submit() {
      this.$refs.elForm.validate(async (vaild) => {
        if (vaild) {
          this.$refs.xmodal.loadBtn(true);
          this.elForm.Id = this.auditInfo.Id;
          this.elForm.teamId = this.auditInfo.TeamId;
          this.$http
            .post(
              "/Attendance/AnomalyAppeals/SubmitAnomalyAppeal.ashx",
              this.elForm
            )
            .then((resp) => {
              if (resp.res == 0) {
                this.$notify({
                  type: "success",
                  message: resp.msg,
                });
                this.$modal.hide("applyAudit");
                this.$emit("upData");
                this.$emit("successHandle");
              }
            })
            .finally(() => this.$refs.xmodal.loadBtn(false));
        } else {
          this.$refs.container.focus();
        }
      });
    },
    closed() {
      Object.assign(this.$data.elForm, this.$options.data().elForm);
    },
  },
  created() {},
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
