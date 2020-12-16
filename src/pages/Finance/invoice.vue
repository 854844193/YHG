<template>
  <div class="invoice_container" v-if="isRouterAlive">
    <el-steps
      class="steps-title"
      :active="current"
      finish-status="finish"
      style="margin-top: 20px"
    >
      <el-step
        v-for="item in stepList"
        :title="item.title"
        :icon="item.icon"
        :key="item.title"
      ></el-step>
    </el-steps>
    <div class="steps-content">
      <InvoiceOrder
        v-show="stepList[current].content == 'order'"
        @change="isSelected"
      ></InvoiceOrder>
      <InvoiceEdit
        ref="editForm"
        v-if="stepList[current].content == 'edit'"
        :amount="allAmount"
        :orderList="invoiceList"
        @isInput="isForm"
      ></InvoiceEdit>
    </div>
    <div class="steps-action">
      <el-button
        v-if="current < stepList.length - 1"
        type="primary"
        size="small"
        :disabled="isNext"
        @click="next"
      >
        下一步
      </el-button>
      <el-button
        v-if="current == stepList.length - 1"
        type="primary"
        size="small"
        :disabled="isSub"
        @click="submitForm"
      >
        提交
      </el-button>
      <el-button
        v-if="current > 0"
        size="small"
        style="margin-left: 8px"
        @click="prev"
      >
        上一步
      </el-button>
    </div>
    <!-- 开具发票 -->
    <el-dialog :visible.sync="confirmVisible" center width="600px">
      <b slot="title" style="font-size: 18px">开具发票</b>
      <el-form
        size="mini"
        label-position="left"
        label-width="80px"
        inline
        class="demo-table-expand"
        style="width: 560px"
      >
        <el-form-item label="发票类型">
          <span>电子发票</span>
        </el-form-item>
        <el-form-item label="公司名称" label-width="80px">
          <span>{{ invoiceForm.billToName }}</span>
        </el-form-item>
        <el-form-item
          v-if="invoiceForm.InvoiceTitleType == 2"
          label="公司税号"
          label-width="80px"
        >
          <span>{{ invoiceForm.billToDutyParagraph }}</span>
        </el-form-item>
        <el-form-item label-width="80px">
          <span slot="label">{{ invoiceForm.deliveryType | checkType }}</span>
          <span v-if="invoiceForm.deliveryType != 5">
            {{ invoiceForm.delivery }}
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmSubmit">
          确定提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InvoiceOrder from "./components/invoiceOrder";
import InvoiceEdit from "./components/invoiceEdit";
import { invoiceCreat } from "@/api/getData";
import check from "global/check";
export default {
  components: { InvoiceOrder, InvoiceEdit },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      current: 0,
      allAmount: 0,
      confirmVisible: false,
      isRouterAlive: true,
      invoiceList: [],
      invoiceForm: {},
      stepList: [
        {
          title: "按订单开票",
          icon: "el-icon-folder-add",
          content: "order",
        },
        {
          title: "开具发票",
          icon: "el-icon-edit-outline",
          content: "edit",
        },
      ],
      isNext: true,
      isSub: true,
    };
  },
  filters: {
    checkType(value) {
      if (value == 1) return "电子邮箱";
      else if (value == 2) return "电话号码";
      else if (value == 3) return "微信账号";
      else if (value == 4) return "支付宝账户";
      else if (value == 5) return "不交付";
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
        this.current = 0;
      });
    },
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    },
    // 检查纳税识别号
    checkTaxNum(num) {
      console.log(num.length);
      if (num.length > 15 && num.length < 20) {
        return true;
      } else {
        this.$message({
          type: "error",
          message: "纳税人识别号必须为15~20位！",
          center: true,
        });
        return false;
      }
    },
    // 检查交付方式
    checkEmpower(obj) {
      console.log(obj.deliveryType);
      if (obj.deliveryType == 1) {
        let checkEmail = check.email(obj.delivery);
        if (checkEmail) {
          return true;
        } else {
          return false;
        }
      } else if (obj.deliveryType == 2) {
        let checkPhone = check.phone(obj.delivery);
        console.log(checkPhone);
        if (checkPhone) {
          return true;
        } else {
          return false;
        }
      } else if (obj.deliveryType == 3) {
        let checkWx = check.wxnum(obj.delivery);
        console.log(checkWx);
        if (checkWx) {
          return true;
        } else {
          return false;
        }
      } else if (obj.deliveryType == 4) {
        let checkPhone = check.phone(obj.delivery);
        console.log(checkPhone);
        if (checkPhone) {
          return true;
        } else {
          return false;
        }
      } else if (obj.deliveryType == 5) {
        console.log(5);
        return true;
      }
    },
    // 提交表单
    submitForm() {
      let form = this.invoiceForm;
      if (form.InvoiceTitleType == 2) {
        let taxNum = this.checkTaxNum(form.billToDutyParagraph);
        let empower = this.checkEmpower(form);
        console.log(taxNum, empower);
        if (taxNum && empower) {
          console.log(222);
          this.confirmVisible = true;
        }
      } else {
        let empower = this.checkEmpower(form);
        console.log(empower);
        if (empower) {
          console.log(111);
          this.confirmVisible = true;
        }
      }
    },
    // 判断是否选择过订单
    isSelected(list, amount) {
      if (list.length) {
        this.isNext = false;
        this.invoiceList = list;
        this.allAmount = amount;
        console.log(this.invoiceList);
        console.log(this.allAmount);
      } else {
        this.isNext = true;
        this.invoiceList = [];
        this.allAmount = 0;
      }
    },
    // 判断是否满足提交条件
    isForm(form) {
      console.log(form);
      if (form.InvoiceTitleType == 2) {
        if (form.deliveryType != 5) {
          if (form.billToName && form.billToDutyParagraph && form.delivery) {
            this.isSub = false;
            this.invoiceForm = form;
          } else {
            this.isSub = true;
            this.invoiceForm = {};
          }
        } else {
          if (form.billToName && form.billToDutyParagraph) {
            this.isSub = false;
            this.invoiceForm = form;
          } else {
            this.isSub = true;
            this.invoiceForm = {};
          }
        }
      } else {
        if (form.deliveryType != 5) {
          if (form.billToName && form.delivery) {
            this.isSub = false;
            this.invoiceForm = form;
          } else {
            this.isSub = true;
            this.invoiceForm = {};
          }
        } else {
          if (form.billToName) {
            this.isSub = false;
            this.invoiceForm = form;
          } else {
            this.isSub = true;
            this.invoiceForm = {};
          }
        }
      }
    },
    // 提交开票信息
    async confirmSubmit() {
      console.log(this.invoiceForm);
      this.invoiceList.forEach((item) => {
        this.invoiceForm.orderNo.push(item.orderNumber);
      });
      console.log(this.invoiceList);
      let parms = this.invoiceForm;
      const res = await invoiceCreat(parms);
      console.log(res);
      // if (res.code == 200) {
      //   this.confirmVisible = false;
      // }
      // this.$message({
      //   type: "success",
      //   message: "提交成功！",
      //   center: true,
      // });
      // this.reload();
      // this.confirmVisible = false;
    },
  },
};
</script>

<style lang="less" >
.invoice_container {
  width: 900px;
  height: 700px;
  margin: 20px 20px 0;
}
.steps-title {
  width: 100%;
  padding: 10px 10px;
  box-sizing: border-box;
  background-color: #fafafa;
}
.steps-content {
  margin-top: 10px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 600px;
  padding: 10px;
}

.steps-action {
  margin: 0 auto;
  margin-top: 20px;
}
.demo-table-expand .el-form-item__label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  width: 50%;
}
</style>