<template>
  <div>
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="续费号：">
        <span>{{ orderDetails.id || "--" }}</span>
      </el-form-item>
      <el-form-item label="订单号：">
        <span>{{ orderDetails.orderNo || "--" }}</span>
      </el-form-item>
      <el-form-item label="续费金额：">
        <span style="color: red"> {{ "￥" + orderDetails.renewAmout }}元 </span>
      </el-form-item>
      <el-form-item label="续费起止时间：">
        {{ orderDetails.originalTime + "至" + orderDetails.renewTime }}
      </el-form-item>
      <el-form-item label="续费时间：">
        <span>{{ orderDetails.createTime }}</span>
      </el-form-item>
      <el-form-item label="续费状态：">
        <el-tag
          size="mini"
          :type="orderDetails.status == 0 ? 'danger' : 'primary'"
        >
          {{ orderDetails.status | checkStatus }}
        </el-tag>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "robOrderInfo",
  props: {
    robOrder: {
      type: Object,
    },
  },
  data() {
    return {
      orderDetails: {},
    };
  },
  created() {
    this.orderDetails = this.robOrder;
  },
  filters: {
    checkStatus(value) {
      if (value == 0) return "未续费";
      else if (value == 1) return "已续费";
      else return "--";
    },
  },
  methods: {},
};
</script>

<style lang="less" >
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand .el-form-item__label {
  width: 110px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>