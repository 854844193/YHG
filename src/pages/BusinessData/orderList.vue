<template>
  <div class="fillcontain">
    <el-collapse class="add_split" value="1">
      <el-collapse-item name="1">
        <template slot="title">
          <p style="color: #409eff; font-size: 18px">
            <i class="el-icon-search"></i>高级搜索
            <span style="color: #e6a23c">(点此收起搜索条件)</span>
          </p>
        </template>
        <template slot="icon">
          <i class="el-icon-caret-bottom"></i>点击展开
        </template>
        <div class="searchWarp">
          <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            label-width="140px"
          >
            <el-form-item label="订单号：">
              <el-input
                v-model="listQuery.orderNumber"
                class="input-width"
                clearable
                placeholder="订单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="订单类型：">
              <el-select
                v-model="listQuery.orderType"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in orderTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单状态：">
              <el-select
                v-model="listQuery.status"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in orderStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="支付时间：">
              <el-date-picker
                class="dateTime-width"
                v-model="addTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                type="datetimerange"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item> -->
          </el-form>
        </div>
        <div class="searchBottom">
          <el-button type="primary" @click="handleSearchList" size="mini">
            搜索
          </el-button>
          <el-button @click="handleResetSearch" size="mini"> 重置 </el-button>
          <el-button
            type="primary"
            v-has="{ name: '服务商端订单', type: '1' }"
            plain
            size="mini"
            @click="payOrder"
            >已支付订单</el-button
          >
          <el-button
            type="primary"
            size="mini"
            plain
            v-has="{ name: '服务商端订单', type: '1' }"
            @click="exportData"
            >导出</el-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="table_container">
      <div class="dataList">
        <span style="color: #409eff; font-size: 18px">
          <i class="el-icon-tickets"></i>
          数据列表
        </span>
        <el-button
          native-type="submit"
          type="primary"
          size="mini"
          style="margin-left: 10px"
          @click="refresh('main')"
        >
          刷新
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="reFreshLoading"
        row-key="id"
        ref="serveTable"
        @row-click="rowClickO"
        :row-style="tableRowStyleO"
        @selection-change="handleSelectionChangeO"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          type="selection"
          width="30px"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column type="expand" width="30px">
          <template slot-scope="scope">
            <orderInfo :row="scope.row"></orderInfo>
          </template>
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="orderNumber"
          align="center"
        ></el-table-column>
        <el-table-column label="护工姓名" prop="realName" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.realName == undefined ? "暂无信息" : scope.row.realName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工电话" prop="phone" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.phone == undefined ? "暂无信息" : scope.row.phone
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者姓名" prop="beNurseRealName" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.beNurseRealName == undefined
                ? "暂无信息"
                : scope.row.beNurseRealName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者电话" prop="beNursePhone" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.beNursePhone == undefined
                ? "暂无信息"
                : scope.row.beNursePhone
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务日期" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.startTime || scope.row.endTime">{{
              scope.row.startTime + "至" + scope.row.endTime
            }}</span>
            <span v-else>暂无信息</span>
          </template>
        </el-table-column>
        <el-table-column label="服务时间段" prop="serverTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serverTime || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务单价" prop="preferPrice" align="center">
          <template slot-scope="scope">
            ￥
            <span style="color: red">{{ scope.row.preferPrice || "0.00" }}</span
            >元
          </template>
        </el-table-column>
        <el-table-column label="预定金额" prop="amount" align="center">
          <template slot-scope="scope">
            ￥
            <span style="color: red">{{
              scope.row.amount || scope.row.buyerPayAmount || "0.00"
            }}</span
            >元
          </template>
        </el-table-column>
        <el-table-column
          label="支付时间"
          prop="createTime"
          align="center"
        ></el-table-column>
        <el-table-column label="支付金额" prop="amount" align="center">
          <template slot-scope="scope">
            ￥
            <span style="color: red">{{
              scope.row.buyerPayAmount || scope.row.amount || "0.00"
            }}</span
            >元
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="payWay" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.payWay == undefined ? "暂无信息" : scope.row.payWay
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付平台订单号" prop="payWayId" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.payWayId == undefined ? "暂无信息" : scope.row.payWayId
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.status | checkStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" prop="isSettlement" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" type="warning">
              {{ scope.row.isSettlement | checkIsSettlement }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" prop="isRefund" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" type="danger">
              {{ scope.row.isRefund | checkIsRefund }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" prop="orderType" align="center">
          <template slot-scope="scope">
            {{ scope.row.orderType | checkType }}
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="listQuery.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <!-- 已支付订单 -->
    <el-dialog
      width="90%"
      top="5vh"
      :visible="showOrderList"
      title="已支付订单"
      :before-close="handleClosePayOrder"
      center
    >
      <PayOrder :key="payId"></PayOrder>
    </el-dialog>

    <!-- 订单多种方式导出 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      center
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

    <!-- 栏位勾选 -->
    <el-dialog
      :visible.sync="isProps"
      center
      :before-close="handleCloseProp"
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="80px"
        :model="propList"
        ref="propList"
        @submit.native.prevent
      >
        <el-form-item label="字段：" prop="hobby">
          <el-checkbox-group v-model="propList.hobby">
            <el-checkbox
              v-for="item in orderPropList"
              :key="item"
              :label="item"
              name="hobby"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmProp">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import excel from "global/excel";
import { getOrderList, getOrderAccountCount } from "@/api/getData";
import orderInfo from "components/orderInfo";
import PayOrder from "components/payOrder";
const defaultListQuery = {
  page: 1,
  pageSize: 10,
  orderNumber: "",
  orderType: "",
  status: "",
  // payStartTime: "",
  // payEndTime: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      propList: {
        hobby: [],
      },
      orderPropList: [
        "订单号",
        "护工姓名",
        "护工电话",
        "患者姓名",
        "患者电话",
        "服务日期",
        "服务时间段",
        "服务单价",
        "预定金额",
        "支付时间",
        "支付金额",
        "支付方式",
        "支付平台订单号",
        "支付状态",
        "订单类型",
      ],
      selectedList: [],
      selectID: [],
      tableData: [],
      payTime: "",
      payId: +new Date(),
      type: "",
      showOrderList: false,
      reFreshLoading: false,
      isAddOther: false,
      isProps: false,
      dialogVisible: false,
      isPagination: "main",
      otherInfo: {},
      offset: 0,
      limit: 100,
      count: 0,
      orderTypeList: [
        {
          label: "未激活",
          value: 0,
        },
        {
          label: "定价单",
          value: 1,
        },
        {
          label: "抢单",
          value: 2,
        },
        {
          label: "快销产品",
          value: 3,
        },
        {
          label: "服务商派单",
          value: 4,
        },
        {
          label: "快速派单",
          value: 5,
        },
        {
          label: "快速生成订单",
          value: 6,
        },
      ],
      orderStatusList: [
        {
          label: "未付款",
          value: 1,
        },
        {
          label: "已付款",
          value: 2,
        },
        {
          label: "待评价",
          value: 4,
        },
        {
          label: "已评价",
          value: 5,
        },
        {
          label: "已取消",
          value: 6,
        },
        {
          label: "已过期",
          value: 7,
        },
        {
          label: "待执行",
          value: 20,
        },
        {
          label: "执行中",
          value: 21,
        },
      ],
      columnList: {
        orderNumber: "订单号",
        realName: "护工姓名",
        phone: "护工电话",
        beNurseRealName: "患者姓名",
        beNursePhone: "患者电话",
        startTime: "服务开始时间",
        endTime: "服务结束时间",
        serverTime: "服务时间段",
        preferPrice: "服务单价",
        amount: "预定金额",
        createTime: "支付时间",
        amount: "支付金额",
        payWay: "支付方式",
        payWayId: "支付平台订单号",
        Ostatus: "订单状态",
        OisSettlement: "结算状态",
        OisRefund: "退款状态",
        OorderType: "订单类型",
      },
    };
  },
  components: {
    orderInfo,
    PayOrder,
  },
  created() {
    this.initData(1);
    this.propList.hobby = this.orderPropList;
  },
  filters: {
    // 判断状态
    checkStatus(value) {
      if (value == 1) return "未付款";
      else if (value == 2) return "已付款";
      else if (value == 4) return "待评价";
      else if (value == 5) return "已评价";
      else if (value == 6) return "已取消";
      else if (value == 7) return "已过期";
      else if (value == 20) return "待执行";
      else if (value == 21) return "执行中";
      else return "--";
    },
    // 判断类型
    checkType(value) {
      if (value == 0) return "未激活";
      else if (value == 1) return "定价单";
      else if (value == 2) return "抢单";
      else if (value == 3) return "快销产品";
      else if (value == 4) return "服务商派单";
      else if (value == 5) return "快速派单";
      else if (value == 6) return "快速生成订单";
      else return "--";
    },
    // 判断结算
    checkIsSettlement(value) {
      if (value == 0) return "不可结算";
      else if (value == 1) return "未结算";
      else if (value == 2) return "已结算";
      else return "--";
    },
    // 判断退款
    checkIsRefund(value) {
      if (value == 0) return "未退款";
      else if (value == 1) return "已退款";
      else if (value == 2) return "不可退款";
      else return "--";
    },
  },
  methods: {
    //刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.selectedOrderList = [];
      this.selectOrderID = [];
      if (this.isPagination == "main") {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.reFreshLoading = false;
          this.initData(this.listQuery.page);
        }, 1000);
      }
      if (this.isPagination == "search") {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.reFreshLoading = false;
          this.isPagination = "main";
          this.initData(1);
        }, 1000);
      }
    },
    async initData(cpage) {
      this.listQuery.page = cpage;
      this.getOrder();
    },
    async getOrder() {
      // this.listQuery.payStartTime =
      //   this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[0];
      // this.listQuery.payEndTime =
      //   this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[1];
      let parms = this.listQuery;
      const res = await getOrderList(parms);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      }
    },

    //搜索订单
    handleSearchList() {
      this.selectedOrderList = [];
      this.selectOrderID = [];
      if (
        this.listQuery.orderNumber ||
        this.listQuery.orderType ||
        this.listQuery.status
      ) {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.page = 1;
          this.getOrder();
          this.reFreshLoading = false;
        }, 1500);
      } else {
        this.$message({
          type: "warning",
          message: "请输入查询条件！",
          center: true,
        });
      }
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
      // this.addTime = "";
    },

    // 已支付订单
    payOrder() {
      this.payId = +new Date();
      this.showOrderList = true;
    },
    handleClosePayOrder() {
      this.showOrderList = false;
    },

    confirmProp() {
      console.log(this.propList.hobby);
      this.isProps = false;
    },

    handleCloseProp() {
      this.isProps = false;
      this.propList.hobby = this.orderPropList;
    },

    // 选中背景色
    tableRowStyle({ row, rowIndex }) {
      let color = "";
      let arr = this.selectOrderID || [];
      if (this.selectOrderID.includes(row.id)) {
        color = { background: "#DCDFE6", color: "#606266" };
      } else {
        color = {};
      }
      return color;
    },
    //监听row-click事件，实现选中
    rowClick(row, column, event) {
      let refsElTable = this.$refs.payedTable; // 获取表格对象
      let findRow = this.selectedOrderList.find((c) => c.id == row.id); //找到选中的行
      if (findRow) {
        refsElTable.toggleRowSelection(row, false); //如过重复选中，则取消选中
      } else {
        refsElTable.toggleRowSelection(row, true); // 实现选中行中选中事件
      }
    },
    //选中数据
    handleSelectionChange(val) {
      this.selectedOrderList = val;
      this.selectOrderID = val.map((item) => {
        return item.id;
      });
    },

    // 选中背景色
    tableRowStyleO({ row, rowIndex }) {
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
    rowClickO(row, column, event) {
      let refsElTable = this.$refs.serveTable; // 获取表格对象
      let findRow = this.selectedList.find((c) => c.id == row.id); //找到选中的行
      if (findRow) {
        refsElTable.toggleRowSelection(row, false); //如过重复选中，则取消选中
      } else {
        refsElTable.toggleRowSelection(row, true); // 实现选中行中选中事件
      }
    },
    //选中数据
    handleSelectionChangeO(val) {
      this.selectedList = val;
      this.selectID = val.map((item) => {
        return item.id;
      });
    },

    // 判断状态
    checkStatus(value) {
      if (value == 1) return "未付款";
      else if (value == 2) return "已付款";
      else if (value == 4) return "待评价";
      else if (value == 5) return "已评价";
      else if (value == 6) return "已取消";
      else if (value == 7) return "已过期";
      else if (value == 20) return "待执行";
      else if (value == 21) return "执行中";
      else return "暂无信息";
    },
    // 判断类型
    checkType(value) {
      if (value == 0) return "未激活";
      else if (value == 1) return "定价单";
      else if (value == 2) return "抢单";
      else if (value == 3) return "快销产品";
      else if (value == 4) return "服务商派单";
      else if (value == 5) return "快速派单";
      else if (value == 6) return "快速生成订单";
      else return "暂无信息";
    },
    // 判断结算
    checkIsSettlement(value) {
      if (value == 0) return "不可结算";
      else if (value == 1) return "未结算";
      else if (value == 2) return "已结算";
      else return "暂无信息";
    },
    // 判断退款
    checkIsRefund(value) {
      if (value == 0) return "未退款";
      else if (value == 1) return "已退款";
      else if (value == 2) return "不可退款";
      else return "暂无信息";
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
      tableData.forEach((item) => {
        item.Ostatus = this.checkStatus(item.status);
        item.OisSettlement = this.checkIsSettlement(item.isSettlement);
        item.OisRefund = this.checkIsRefund(item.isRefund);
        item.OorderType = this.checkType(item.orderType);
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "服务商端订单",
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
        let params = {
          page: 1,
          pageSize: 10000,
          orderNo: this.listQuery.orderNo,
          payType: this.listQuery.payType,
          status: this.listQuery.status,
          // this.listQuery.payStartTime:
          //   this.addTime == null
          //     ? ""
          //     : this.addTime == ""
          //     ? ""
          //     : this.addTime[0],
          // payEndTime:
          //   this.addTime == null
          //     ? ""
          //     : this.addTime == ""
          //     ? ""
          //     : this.addTime[1],
        };
        console.log("导出全部");
        const res = await getOrderList(params);
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

    //添加其他信息
    addInfo(obj) {
      this.isAddOther = true;
      this.otherInfo = obj;
    },
    async addOther(obj) {
      const res = await addRemark({
        orderNumber: obj.orderNo,
        remark: obj.remark,
      });
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "信息添加成功！",
          center: true,
        });
        this.isAddOther = false;
        this.otherInfo = {};
      } else {
        this.$message({
          type: "error",
          message: res.message,
          center: true,
        });
      }
    },
    // 关闭其他信息
    CloseInfo(formName) {
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.otherInfo = {};
      this.isAddOther = false;
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      this.initData(this.listQuery.page);
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>
