<template>
  <div>
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="订单号：">
        <span>{{ orderDetails.orderNumber || "--" }}</span>
      </el-form-item>
      <el-form-item label="订单名称：">
        <span>{{ orderDetails.orderName || "--" }}</span>
      </el-form-item>
      <el-form-item label="护工ID：">
        <span>{{ orderDetails.nurseId || "--" }}</span>
      </el-form-item>
      <el-form-item label="患者ID：">
        <span>{{ orderDetails.benurseId || "--" }}</span>
      </el-form-item>
      <el-form-item label="护工姓名：">
        <span>{{ orderDetails.nurseName || "--" }}</span>
      </el-form-item>
      <el-form-item label="患者姓名：">
        <span>{{ orderDetails.benurseName || "--" }}</span>
      </el-form-item>
      <el-form-item label="护工电话：">
        <span>{{ orderDetails.nursePhone || "--" }}</span>
      </el-form-item>
      <el-form-item label="患者电话：">
        <span>{{ orderDetails.benurseMobile || "--" }}</span>
      </el-form-item>
      <el-form-item label="护工身份证：">
        <span>{{ orderDetails.nurseIdentId || "--" }}</span>
      </el-form-item>
      <el-form-item label="患者身份证：">
        <span>{{ orderDetails.beNuseIdentId || "--" }}</span>
      </el-form-item>
      <el-form-item label="基础价格：">
        <span style="color: #ff6a00">
          {{ "￥" + orderDetails.basePrice }}元
        </span>
      </el-form-item>
      <el-form-item label="总价：">
        <span style="color: #ff6a00">{{ "￥" + orderDetails.amount }}元</span>
      </el-form-item>
      <el-form-item label="优惠价格：">
        <span style="color: #409eff">
          {{ "￥" + (orderDetails.couponPrice || 0) }}元
        </span>
      </el-form-item>
      <el-form-item label="活动价格：">
        <span style="color: #409eff">
          {{ "￥" + (orderDetails.activityPrice || 0) }}元
        </span>
      </el-form-item>
      <el-form-item label="实际价格：">
        <span style="color: red">
          {{ "￥" + orderDetails.actualPrice }}元
        </span>
      </el-form-item>
      <el-form-item label="服务时间：">
        <span>{{ orderDetails.startTime + "至" + orderDetails.endTime }}</span>
      </el-form-item>
      <el-form-item label="创建时间：">
        <span>{{ orderDetails.createTime }}</span>
      </el-form-item>
      <!-- <el-form-item label="服务时段：">
        <span>{{ orderDetails.serverTime || "--" }}</span>
      </el-form-item> -->
      <el-form-item label="服务地址：">
        <span>{{ orderDetails.serverAddr || "--" }}</span>
      </el-form-item>
      <el-form-item label="备注：">
        <span>{{ orderDetails.remark || "--" }}</span>
      </el-form-item>
    </el-form>
    <el-divider>服务专项</el-divider>
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item v-for="(item, index) in serverParams" :key="index">
        <div v-if="item.typeName == 'service_item'">
          <span slot="label"> 单项服务： </span>
          <span>{{ item.serverValue || "--" }}</span>
          ——价格<span style="color: #ff6a00">{{ "￥" + item.price }}元</span>
        </div>
        <div v-else>
          <span slot="label">
            <span v-if="item.typeName == 'service_time'">照护时间：</span>
            <span v-if="item.typeName == 'service_unit'">护理套餐：</span>
            <span v-if="item.typeName == 'service_age'">护理对象：</span>
          </span>
          <span>{{ item.serverValue || "--" }}</span>
          ——价格<span style="color: #ff6a00">{{ "￥" + item.price }}元</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRobOrderInfo } from "@/api/getData";
export default {
  name: "robOrderInfo",
  props: {
    robOrder: {
      type: Object,
    },
  },
  data() {
    return {
      nurseId: "",
      serverParams: [],
      orderDetails: {},
    };
  },
  created() {
    this.orderNumber = this.robOrder.orderNumber;
    this.initData();
  },
  methods: {
    initData() {
      this.getDataInfo();
    },
    async getDataInfo() {
      console.log(this.orderNumber);
      const res = await getRobOrderInfo(this.orderNumber);
      console.log(res);
      this.orderDetails = res;
      this.serverParams = res.serverParamId;
    },
  },
};
</script>

<style lang="less" >
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand .el-form-item__label {
  width: 100px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>