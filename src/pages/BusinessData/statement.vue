<template>
  <div class="fillcontain">
    <!-- <el-collapse class="add_split" value="1">
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
                  v-for="item in TypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算状态：">
              <el-select
                v-model="listQuery.isSettlement"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in settlementList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="searchBottom">
          <el-button type="primary" @click="handleSearchList" size="mini">
            搜索
          </el-button>
          <el-button @click="handleResetSearch" size="mini"> 重置 </el-button>
          
        </div>
      </el-collapse-item>
    </el-collapse> -->
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
        <el-button
          type="primary"
          size="mini"
          plain
          v-has="{ name: '结算记录', type: '1' }"
          @click="exportData"
          >导出</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="reFreshLoading"
        align="center"
        ref="serveTable"
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
        <el-table-column type="expand" width="20" fixed="left">
          <template slot-scope="scope">
            <orderInfo :row="scope.row"></orderInfo>
          </template>
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="orderNumber"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column label="护工姓名" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.realName == undefined ? "暂无信息" : scope.row.realName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工电话" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.phone == undefined ? "暂无信息" : scope.row.phone
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者姓名" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.beNurseRealName == undefined
                ? "暂无信息"
                : scope.row.beNurseRealName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者电话" align="center">
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
        <el-table-column label="服务时间段" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serverTime || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.notes == "" ? "暂无信息" : scope.row.notes
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单创建时间" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.createTime == undefined
                ? "暂无信息"
                : scope.row.createTime
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务单价" align="center">
          <template slot-scope="scope">
            ￥
            <span style="color: red">{{ scope.row.price || "0.00" }}</span
            >元
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            ￥
            <span style="color: red">{{ scope.row.amount || "0.00" }}</span
            >元
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">
            <p v-if="tableData[scope.$index].orderType == 1">标品(小程序)</p>
            <p v-else-if="tableData[scope.$index].orderType == 5">点对点</p>
            <p v-else-if="tableData[scope.$index].orderType == 6">服务商下单</p>
            <p v-else>其他</p>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag size="mini">{{ scope.row.status | checkStatus }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="结算状态"
          align="center"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag size="mini" type="warning">
              {{ scope.row.isSettlement | checkIsSettlement }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>

      <!-- 多种方式导出 -->
      <el-dialog
        :visible.sync="dialogVisible"
        width="500px"
        center
        :before-close="handleClose"
      >
        <template slot="title">
          <i class="el-icon-warning" style="color: #e6a23c"></i>
          <b>温馨提示</b>
        </template>
        <p style="color: #303133; font-size: 20px; text-align: center">
          导出满足您需求的数据
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose" size="mini">取 消</el-button>
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
  </div>
</template>

<script>
import orderInfo from "components/orderInfo";
import excel from "global/excel";
import { getSetteleOrder, orderSettele } from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderNumber: "",
  isSettlement: "",
  orderType: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      selectedList: [],
      selectID: [],
      refundTime: "",
      offset: 0,
      limit: 100,
      count: 0,
      isPagination: "main",
      reFreshLoading: false,
      dialogVisible: false,
      settlementList: [
        {
          label: "不可结算",
          value: 0,
        },
        {
          label: "可结算",
          value: 1,
        },
        {
          label: "已结算",
          value: 2,
        },
      ],
      TypeList: [
        {
          label: "标品(小程序)",
          value: 1,
        },
        {
          label: "点对点",
          value: 5,
        },
        {
          label: "服务商下单",
          value: 6,
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
        notes: "备注",
        createTime: "订单创建时间",
        price: "服务单价",
        amount: "金额",
        OorderType: "订单类型",
        Ostatus: "订单状态",
        OisSettlement: "结算状态",
      },
    };
  },
  created() {
    this.initData(this.listQuery.pageNum);
  },
  components: {
    orderInfo,
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
    // 判断结算
    checkIsSettlement(value) {
      if (value == 0) return "不可结算";
      else if (value == 1) return "未结算";
      else if (value == 2) return "已结算";
      else return "--";
    },
  },
  methods: {
    refresh() {
      this.orderNumber = "";
      if (this.isPagination == "main") {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.reFreshLoading = false;
          this.initData(this.listQuery.pageNum);
        }, 1000);
      }
      if (this.isPagination == "search") {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.reFreshLoading = false;
          this.isPagination = "main";
          // this.$refs.pag.backNumOne();
          this.initData(1);
        }, 1000);
      }
    },
    initData(cpage) {
      this.listQuery.pageNum = cpage;
      this.getOrderList();
    },
    async getOrderList() {
      let parms = this.listQuery;
      const res = await getSetteleOrder(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      }
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
      this.addTime = "";
    },
    handleSearchList() {
      if (
        this.listQuery.orderNumber ||
        this.listQuery.orderType ||
        this.isSettlement
      ) {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
          this.getOrderList();
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

    // 结算
    settle(order) {
      this.$confirm("是否对当前订单进行结算？", "提示", {
        type: "waring",
        center: true,
      })
        .then(async () => {
          console.log(order);
          let orderId = order.id;
          const res = await orderSettele(orderId);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "结算成功！",
              center: true,
            });
            // 更新数据
            this.refresh();
          } else {
            this.$message({
              type: "warning",
              message: res.message,
              center: true,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "取消操作！",
            center: true,
          });
        });
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
      let refsElTable = this.$refs.serveTable; // 获取表格对象
      let findRow = this.selectedList.find((c) => c.id == row.id); //找到选中的行
      if (findRow) {
        refsElTable.toggleRowSelection(row, false); //如过重复选中，则取消选中
      } else {
        refsElTable.toggleRowSelection(row, true); // 实现选中行中选中事件
      }
    },
    //选中导出数据
    handleSelectionChange(val) {
      this.selectedList = val;
      this.selectID = val.map((item) => {
        return item.id;
      });
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.getOrderList();
    },

    checkStatus(value) {
      if (value == "1") return "待付款";
      else if (value == "2") return "已付款";
      else if (value == "3") return "待结算";
      else if (value == "4") return "待评价";
      else if (value == "6") return "已取消";
      else if (value == "7") return "已过期";
      else if (value == "20") return "待执行";
      else if (value == "21") return "执行中";
      else return "未知";
    },
    checkType(value) {
      if (value == "1") return "标品(小程序)";
      else if (value == "5") return "点对点";
      else if (value == "6") return "服务商下单";
      else return "未知";
    },
    checkSettlement(value) {
      if (value == "0") return "不可结算";
      else if (value == "1") return "可结算";
      else if (value == "2") return "已结算";
      else return "未知";
    },

    // 导出数据
    exportData() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    exportExcel(excelData) {
      let tableData = excelData;
      tableData.forEach((item) => {
        item.Ostatus = this.checkStatus(item.status);
        item.OorderType = this.checkType(item.orderType);
        item.OisSettlement = this.checkSettlement(item.isSettlement);
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "结算表",
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
        if (this.tableData) {
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
        console.log("导出全部");
        const res = await getSetteleOrder();
        if (res.data.total > 0) {
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
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>