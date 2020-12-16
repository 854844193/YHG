<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-date-picker
        class="dateTime-width"
        v-model="payTime"
        size="mini"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="-"
        start-placeholder="支付开始时间"
        end-placeholder="支付结束时间"
        type="datetimerange"
        :default-time="['00:00:00', '23:59:59']"
      ></el-date-picker>
      <el-button
        size="mini"
        native-type="submit"
        type="primary"
        @click="searchByTime"
      >
        搜索
      </el-button>
      <el-button
        size="mini"
        native-type="submit"
        type="primary"
        plain
        @click="refresh"
      >
        刷新
      </el-button>
      <el-button size="mini" type="primary" plain @click="exportData">
        导出
      </el-button>
    </div>
    <el-table
      v-if="normal"
      id="out-table"
      ref="payTable"
      style="width: 100%"
      height="65vh"
      :data="tableData"
      v-loading="loading"
      row-key="id"
      @row-click="rowClick"
      :row-style="tableRowStyle"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        type="selection"
        width="30"
        :reserve-selection="true"
      ></el-table-column>
      <el-table-column label="订单号" property="orderNo" align="center">
      </el-table-column>
      <el-table-column label="护工姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="护工身份证" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.identId | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="护工电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.beRealName | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="患者身份证" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.beIdentId | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="患者电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.bePhone | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">
          ￥
          <span style="color: red">
            {{ scope.row.amount || scope.row.buyerPayAmount || "0.00" }}
          </span>
          元
        </template>
      </el-table-column>
      <el-table-column label="每日单价" align="center">
        <template slot-scope="scope">
          ￥
          <span style="color: red">
            {{ scope.row.preferPrice || "0.00" }}
          </span>
          元
        </template>
      </el-table-column>
      <el-table-column label="详 情" align="center">
        <template slot-scope="scope">
          {{ scope.row.notes | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.addTime | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="订单创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderCreateTime | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="服务时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.startTime || scope.row.endTime">
            {{ scope.row.startTime + "至" + scope.row.endTime }}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style="color: #67c23a">
            支付完成
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="备 注" align="center" prop="remark">
        <template slot-scope="scope">
          <p>{{ scope.row.remark }}</p>
          <el-tag
            size="mini"
            type="primary"
            @click="addInfo(scope.row.orderNo)"
            style="cursor: pointer"
          >
            <span v-if="scope.row.remark">编 辑</span>
            <span v-else>添 加</span>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-else
      id="out-table"
      ref="payTable"
      style="width: 100%"
      height="65vh"
      :data="tableData"
      v-loading="loading"
      row-key="id"
      @row-click="rowClick"
      :row-style="tableRowStyle"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column
        type="selection"
        width="30"
        :reserve-selection="true"
      ></el-table-column>
      <el-table-column label="订单号" property="orderNo" align="center">
      </el-table-column>
      <el-table-column label="服务商姓名" align="center" width="120">{{
        foreman.realName || "--"
      }}</el-table-column>
      <el-table-column label="服务商身份证" align="center" width="120">{{
        foreman.identId || "--"
      }}</el-table-column>
      <el-table-column label="服务商电话" align="center" width="120">{{
        foreman.phone || "--"
      }}</el-table-column>
      <el-table-column label="护工姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="护工身份证" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.identId | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="护工电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.beRealName | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="患者身份证" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.beIdentId | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="患者电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.bePhone | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">
          ￥
          <span style="color: red">
            {{ scope.row.amount || scope.row.buyerPayAmount || "0.00" }}
          </span>
          元
        </template>
      </el-table-column>
      <el-table-column label="每日单价" align="center">
        <template slot-scope="scope">
          ￥
          <span style="color: red">
            {{ scope.row.preferPrice || "0.00" }}
          </span>
          元
        </template>
      </el-table-column>
      <el-table-column label="详 情" align="center">
        <template slot-scope="scope">
          {{ scope.row.notes | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="支付时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.addTime | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="订单创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderCreateTime | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="服务时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.startTime || scope.row.endTime">
            {{ scope.row.startTime + "至" + scope.row.endTime }}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1" style="color: #67c23a">
            支付完成
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="备 注" align="center" prop="remark">
        <template slot-scope="scope">
          <p>{{ scope.row.remark }}</p>
          <el-tag
            size="mini"
            type="primary"
            @click="addInfo(scope.row.orderNo)"
            style="cursor: pointer"
          >
            <span v-if="scope.row.remark">编 辑</span>
            <span v-else>添 加</span>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex">
      <div style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="listQuery.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
      <p style="margin: 16px">
        共计
        <el-tag size="mini">{{ count }}</el-tag
        >单
      </p>
      <p style="margin: 16px">
        支付金额共计
        <el-tag size="mini" type="danger">{{ payedAmount }}</el-tag
        >元
      </p>
    </div>

    <!-- 其他信息 -->
    <el-dialog
      :visible.sync="isAddOther"
      title="其他信息"
      center
      width="500px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-input
        type="textarea"
        :rows="3"
        v-model="remark"
        controls-position="right"
        @submit.native.prevent
        @input="changeVal(scope.row)"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="CloseInfo">关 闭</el-button>
        <el-button size="mini" type="primary" @click="addOther"
          >提 交</el-button
        >
      </div>
    </el-dialog>

    <!-- 支付订单多条件导出 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      center
      append-to-body
      :before-close="CloseExport"
    >
      <template slot="title">
        <i class="el-icon-warning" style="color: #e6a23c"></i>
        <b>温馨提示</b>
      </template>
      <p style="color: #303133; font-size: 20px; text-align: center">
        导出满足您需求的数据
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CloseExport" size="mini">取 消</el-button>
        <el-button
          @click="exportList('selected')"
          size="mini"
          plain
          type="primary"
          >导出选中</el-button
        >
        <el-button
          @click="exportList('current')"
          size="mini"
          plain
          type="primary"
          >导出本页</el-button
        >
        <el-button type="primary" @click="exportList('all')" size="mini"
          >导出全部</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPayedOrder, getPayAmount, addRemark } from "@/api/getData";
import excel from "global/excel";
const defaultListQuery = {
  page: 1,
  pageSize: 10,
  parentId: "",
  nurseId: "",
  payStartTime: "",
  payEndTime: "",
};
const defaultAmountQuery = {
  page: 1,
  pageSize: 10000,
  parentId: "",
  nurseId: "",
  payStartTime: "",
  payEndTime: "",
};
export default {
  name: "payOrder",
  props: {
    normal: {
      type: Boolean,
      default: true,
    },
    foreman: {
      type: Object,
    },
    nurse: {
      type: Object,
    },
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      amountQuery: Object.assign({}, defaultAmountQuery),
      tableData: [],
      selectedList: [],
      selectID: [],
      loading: false,
      isAddOther: false,
      dialogVisible: false,
      payedAmount: 0,
      count: 0,
      payTime: "",
      remark: "",
      orderNo: "",
      payColList1: {
        orderNo: "订单号",
        realName: "护工姓名",
        identId: "护工身份证",
        phone: "护工电话",
        beRealName: "患者姓名",
        beIdentId: "患者身份证",
        bePhone: "患者电话",
        notes: "详情",
        amount: "支付金额",
        preferPrice: "每日单价",
        addTime: "支付时间",
        startTime: "服务开始时间",
        endTime: "服务结束时间",
        orderCreateTime: "订单创建时间",
        remark: "备注",
      },
      payColList2: {
        orderNo: "订单号",
        FrealName: "服务商姓名",
        FidentId: "服务商身份证",
        Fphone: "服务商电话",
        realName: "护工姓名",
        identId: "护工身份证",
        phone: "护工电话",
        beRealName: "患者姓名",
        beIdentId: "患者身份证",
        bePhone: "患者电话",
        amount: "支付金额",
        preferPrice: "每日单价",
        notes: "详情",
        addTime: "支付时间",
        startTime: "服务开始时间",
        endTime: "服务结束时间",
        orderCreateTime: "订单创建时间",
        remark: "备注",
      },
    };
  },
  mounted() {
    if (this.foreman) {
      console.log(111);
      this.listQuery.parentId = this.foreman.id;
      this.amountQuery.parentId = this.foreman.id;
    } else if (this.nurse) {
      console.log(222);
      console.log(this.nurse);
      this.listQuery.nurseId = this.nurse.id;
      this.amountQuery.nurseId = this.nurse.id;
    } else {
      console.log(333);
    }
    this.initData();
  },
  methods: {
    refresh() {
      this.payTime = "";
      this.listQuery = Object.assign({}, defaultListQuery);
      this.amountQuery = Object.assign({}, defaultAmountQuery);
      if (!this.normal) {
        this.listQuery.parentId = this.foreman.id;
        this.amountQuery.parentId = this.foreman.id;
      } else {
        if (this.nurse) {
          this.listQuery.nurseId = this.nurse.id;
          this.amountQuery.nurseId = this.nurse.id;
        }
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.initData();
      }, 1000);
    },

    initData() {
      this.payOrder();
      this.amount();
    },

    // 已支付订单
    async payOrder() {
      this.showOrderList = true;
      let parms = this.objReSet(this.listQuery);
      const res = await getPayedOrder(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      } else {
        this.$message({
          type: "warning",
          message: res.message,
          center: true,
        });
      }
    },
    async amount() {
      let parms = this.objReSet(this.amountQuery);
      const res = await getPayAmount(parms);
      this.payedAmount = res.data;
    },
    // 按时间搜索已支付订单
    async searchByTime() {
      if (this.payTime) {
        this.listQuery.payStartTime = this.payTime[0];
        this.listQuery.payEndTime = this.payTime[1];
        this.amountQuery.payStartTime = this.payTime[0];
        this.amountQuery.payEndTime = this.payTime[1];
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.listQuery.page = 1;
          this.initData();
        }, 1000);
      } else {
        this.$message({
          type: "warning",
          center: true,
          message: "请选择支付时间段",
        });
      }
    },
    //添加其他信息
    addInfo(orderNo) {
      this.isAddOther = true;
      this.orderNo = orderNo;
    },
    async addOther() {
      const res = await addRemark({
        orderNumber: orderNo,
        remark: this.remark,
      });
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "信息添加成功！",
          center: true,
        });
        this.isAddOther = false;
        this.orderNo = "";
      } else {
        this.$message({
          type: "error",
          message: res.message,
          center: true,
        });
      }
    },
    // 关闭其他信息
    CloseInfo() {
      this.orderNo = "";
      this.isAddOther = false;
    },

    // 选中背景色
    tableRowStyle({ row, rowIndex }) {
      let color = "";
      let arr = this.selectID || [];
      if (this.selectID.includes(row.id)) {
        color = { background: "#DCDFE6", color: "#606266" };
      } else {
        color = {};
      }
      return color;
    },
    //监听row-click事件，实现选中
    rowClick(row, column, event) {
      let refsElTable = this.$refs.payTable; // 获取表格对象
      let findRow = this.selectedList.find((c) => c.id == row.id); //找到选中的行
      if (findRow) {
        refsElTable.toggleRowSelection(row, false); //如过重复选中，则取消选中
      } else {
        refsElTable.toggleRowSelection(row, true); // 实现选中行中选中事件
      }
    },
    //选中数据
    handleSelectionChange(val) {
      this.selectedList = val;
      this.selectID = val.map((item) => {
        return item.id;
      });
    },

    // 导出数据
    exportData() {
      this.dialogVisible = true;
    },
    CloseExport() {
      this.dialogVisible = false;
    },
    exportExcel(excelData) {
      let tableData = excelData;
      let key, header;
      if (this.normal) {
        header = Object.values(this.payColList1);
        key = Object.keys(this.payColList1);
      } else {
        header = Object.values(this.payColList2);
        key = Object.keys(this.payColList2);
        tableData.forEach((item) => {
          item.FrealName = this.foreman.realName;
          item.FidentId = this.foreman.identId;
          item.Fphone = this.foreman.phone;
        });
      }
      const params = {
        header: header,
        key: key,
        data: tableData,
        autoWidth: true,
        fileName: "已支付订单表",
        bookType: "xlsx",
      };
      excel.exportDataToExcel(params);
      this.$message({
        type: "success",
        message: "导出成功！",
        center: true,
      });
    },
    async exportList(med) {
      if (med == "current") {
        if (this.tableData.length) {
          console.log("导出本页");
          let list = this.tableData;
          this.exportExcel(list);
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "warning",
            message: "没有可以导出的数据！",
            center: true,
          });
        }
      }
      if (med == "selected") {
        if (this.selectedList.length) {
          this.exportExcel(this.selectedList);
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "warning",
            message: "请选择您要导出的数据！",
            center: true,
          });
          this.dialogVisible = false;
        }
      }
      if (med == "all") {
        let parentId, nurseId;
        if (this.foreman) {
          parentId = this.foreman.id;
        } else {
          parentId = "";
        }
        if (this.nurse) {
          nurseId = this.nurse.id;
        } else {
          nurseId = "";
        }
        let params = {
          parentId: parentId,
          nurseId: nurseId,
          payStartTime: this.payTime[0],
          payEndTime: this.payTime[1],
        };
        let parms = this.objReSet(params);
        console.log("导出全部");
        const res = await getPayedOrder(parms);
        if (res.data.list.length > 0) {
          let exportData = res.data.list;
          this.exportExcel(exportData);
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "warning",
            message: "没有可以导出的数据！",
            center: true,
          });
        }
      }
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      this.payOrder();
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
</style>