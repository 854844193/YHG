<template>
  <div>
    <el-form
      style="width: 400px"
      ref="form"
      :model="invoiceForm"
      label-width="90px"
      label-position="right"
      @submit.native.prevent
    >
      <el-form-item label="抬头类型" prop="TTLX">
        <el-radio-group v-model="invoiceForm.InvoiceTitleType">
          <el-radio
            v-for="item in typeList"
            :label="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司名称" prop="SPF_MC">
        <el-input v-model="invoiceForm.billToName" clearable></el-input>
      </el-form-item>
      <el-form-item
        v-if="invoiceForm.TTLX !== '1'"
        label="公司税号"
        prop="SPF_NSRSBH"
      >
        <el-input
          v-model="invoiceForm.billToDutyParagraph"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="更多内容">
        <el-link type="primary" @click="inputMore">去填写>></el-link>
      </el-form-item>
      <el-form-item label="总金额">
        ￥<span style="color: #ff6a00">
          {{ invoiceForm.total }}
        </span>
        元
      </el-form-item>
      <el-form-item label="交付方式" prop="TTLX">
        <el-select
          v-model="invoiceForm.deliveryType"
          placeholder="请选择交付方式"
        >
          <el-option
            v-for="item in interactTypeList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="deliveryType">
        <span
          slot="label"
          :style="
            invoiceForm.deliveryType == '5'
              ? 'color :#F56C6C;font-weight:bolder;font-size:18px'
              : 'color = '
          "
        >
          {{ invoiceForm.deliveryType | checkType }}
        </span>
        <el-input
          v-if="invoiceForm.deliveryType !== '5'"
          v-model="invoiceForm.delivery"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 更多内容 -->
    <el-dialog :visible.sync="moreVisible" width="500px" center>
      <b slot="title">更多内容</b>
      <el-form
        style="width: 400px"
        ref="form"
        :model="invoiceForm"
        label-width="90px"
        label-position="right"
        @submit.native.prevent
      >
        <el-form-item label="公司地址">
          <el-input
            type="textarea"
            autosize
            v-model="invoiceForm.billToPhone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="公司电话">
          <el-input v-model="invoiceForm.billToAddress" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司开户行">
          <el-input
            v-model="invoiceForm.billToBankAccountName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="开户行账号">
          <el-input
            v-model="invoiceForm.billToBankAccount"
            clearable
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注">
          <el-input
            type="textarea"
            autosize
            clearable
            v-model="invoiceForm.BZ"
          ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" size="small" @click="confirm">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const defaultForm = {
  InvoiceTitleType: "2",
  billToName: "",
  billToDutyParagraph: "",
  billToPhone: "",
  billToAddress: "",
  billToBankAccount: "",
  billToBankAccountName: "",
  total: 0,
  orderNo: [],
  // BZ: "",
  deliveryType: "1",
  delivery: "",
};
export default {
  props: {
    amount: {
      type: Number,
      default: 0,
    },
    orderList: {
      type: Array,
    },
  },
  data() {
    return {
      invoiceForm: Object.assign({}, defaultForm),
      typeList: [
        { label: "企业单位", value: "2" },
        { label: "个人/非企业单位", value: "1" },
      ],
      interactTypeList: [
        { label: "邮箱", value: "1" },
        { label: "短信", value: "2" },
        { label: "微信", value: "3" },
        { label: "支付宝", value: "4" },
        { label: "不交付", value: "5" },
      ],
      moreVisible: false,
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
  watch: {
    invoiceForm: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$emit("isInput", newVal);
        }
      },
      deep: true,
    },
  },
  created() {
    this.invoiceForm.total = this.amount;
  },
  methods: {
    inputMore() {
      this.moreVisible = true;
    },
    confirm() {
      this.moreVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
</style>