<template>
  <div class="mainBox">
    <el-form
      ref="ruleForm"
      size="mini"
      @submit.native.prevent
      label-position="left"
      inline
      class="demo-table-expand"
    >
      <!-- 订单信息 -->
      <el-form-item label="订单号:" label-width="60px">
        <span>{{ orderDetails.orderNumber || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="支付金额:" label-width="72px">
        <p>
          ￥
          <span style="color: red">{{ orderDetails.amount || "0.00" }}</span
          >元
        </p>
      </el-form-item>
      <el-form-item label="优惠价格:" label-width="72px">
        <p>
          ￥
          <span style="color: orange">{{
            orderDetails.activityPrice || "0.00"
          }}</span
          >元
        </p>
      </el-form-item>
      <el-form-item label="订单总价:" label-width="72px">
        <span>
          ￥
          <b style="color: orange">{{ orderDetails.price || "0.00" }}</b
          >元
        </span>
      </el-form-item>
      <el-form-item label="每日单价:" label-width="72px">
        <p>
          ￥
          <span style="color: orange">{{
            orderDetails.preferPrice || "0.00"
          }}</span
          >元/天
        </p>
      </el-form-item>
      <el-form-item label="服务天数:" label-width="72px">
        <span>{{ orderDetails.totalTime || "0" }}</span
        >天
      </el-form-item>
      <el-form-item label="参考价格:" label-width="72px">
        <p>
          ￥
          <span style="color: orange">{{
            orderDetails.preferPrice || "0.00"
          }}</span
          >元
        </p>
      </el-form-item>
      <el-form-item label="竞价金额:" label-width="72px">
        <p>
          ￥
          <span style="color: orange">{{ orderDetails.price || "0.00" }}</span
          >元
        </p>
      </el-form-item>
      <el-form-item label="等级价格:" label-width="72px">
        <p>
          ￥
          <span style="color: orange">{{
            orderDetails.levelPrice || "0.00"
          }}</span
          >元
        </p>
      </el-form-item>
      <el-form-item label="创建时间:" label-width="72px">
        <span>{{ orderDetails.createTime || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="订单类型:" label-width="72px" style="color: blue">
        <span v-if="orderDetails.orderType == 0">未激活</span>
        <span v-if="orderDetails.orderType == 1">定价单</span>
        <span v-if="orderDetails.orderType == 2">抢单</span>
        <span v-if="orderDetails.orderType == 3">快销产品</span>
        <span v-if="orderDetails.orderType == 4">服务商派单</span>
        <span v-if="orderDetails.orderType == 5">快速派单</span>
        <span v-if="orderDetails.orderType == 6">快速生成订单</span>
      </el-form-item>
      <el-form-item label="订单状态:" label-width="72px" style="color: red">
        <span v-if="orderDetails.status == 0">待执行</span>
        <span v-if="orderDetails.status == 1">待付款</span>
        <span v-if="orderDetails.status == 2">已付款</span>
        <span v-if="orderDetails.status == 3">待结算</span>
        <span v-if="orderDetails.status == 4">已结算</span>
        <span v-if="orderDetails.status == 5">已评价</span>
        <span v-if="orderDetails.status == 6">已取消</span>
        <span v-if="orderDetails.status == 7">已过期</span>
        <span v-if="orderDetails.status == 11">服务商待派单</span>
        <span v-if="orderDetails.status == 12">已派单</span>
        <span v-if="orderDetails.status == 20">待执行</span>
        <span v-if="orderDetails.status == 21">执行中</span>
      </el-form-item>
      <el-form-item label-width="60px" label-position="left" label="护工ID:">
        <span>{{ orderDetails.nurseId || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label-width="72px" label-position="left" label="护工姓名:">
        <span>{{ orderDetails.realName || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="护工身份证:" label-width="86px">
        <span>{{ orderDetails.nurseIdentId || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="护工电话:" label-width="72px">
        <span>{{ orderDetails.phone || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="患者ID:" label-width="60px">
        <span>{{ orderDetails.beNurseId || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label-width="72px" label-position="left" label="患者姓名:">
        <span>{{ orderDetails.beNurseRealName || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="患者身份证:" label-width="86px">
        <span>{{ orderDetails.beNurseIndentId || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="患者电话:" label-width="72px">
        <span>{{ orderDetails.beNursePhone || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="护理类型:" label-width="72px" style="color: green">
        <span>{{ orderDetails.demandName || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="患者自理能力:" label-width="100px">
        <span>{{ orderDetails.selfCare || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="服务日期:" label-width="72px">
        <span v-if="orderDetails.startTime || orderDetails.endTime">{{
          orderDetails.startTime + "至" + orderDetails.endTime
        }}</span>
        <span v-else>暂无信息</span>
      </el-form-item>
      <el-form-item label="服务时段:" label-width="72px">
        <span>{{ orderDetails.serverTime || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="护理位置:" label-width="72px">
        <span>{{ orderDetails.serverSite || "暂无信息" }}</span>
      </el-form-item>
      <el-form-item label="需求详情:" label-width="72px">
        <el-input
          v-if="orderDetails.notes"
          disabled
          type="textarea"
          :rows="1"
          v-model="orderDetails.notes"
        ></el-input>
        <span v-else>无详情</span>
      </el-form-item>

      <!-- <el-row>
                <el-form-item label="服务地址:" label-width="90px">
                  <span>{{orderDetails.area+orderDetails.address||''}}</span>
                </el-form-item>
        </el-row>-->
      <!-- <el-button v-has="{name:'订单表', type:'2'}" type="primary" class="editBtn">提交</el-button> -->
    </el-form>
  </div>
</template>

<script>
export default {
  name: "orderInfo", // 订单基本信息
  props: {
    row: {
      type: Object,
    },
    nurseName: {
      type: String,
    },
  },
  data() {
    return {
      radio: "1",
      orderDetails: {},
      value1: true,
      orderType: "",
      orderStatus: "",
      ruleForm: "",
    };
  },
  created() {
    console.log(this.row);
    this.orderDetails = this.row;
  },
  methods: {},
};
</script>

<style lang="less">
.editBtn {
  float: right;
  margin: 20px 10px 10px 0;
}
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
