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
                v-model="listQuery.orderNo"
                class="input-width"
                clearable
                placeholder="订单编号"
              ></el-input>
            </el-form-item>
            <el-form-item label="业务状态：">
              <el-select
                v-model="listQuery.status"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in incomeStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收支类型：">
              <el-select
                v-model="listQuery.payType"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in incomePayType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="记账时间：">
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
            </el-form-item>
          </el-form>
        </div>
        <div class="searchBottom">
          <el-button type="primary" @click="handleSearchList" size="mini">
            搜索
          </el-button>
          <el-button @click="handleResetSearch" size="mini"> 重置 </el-button>
          <el-button type="primary" size="mini" plain @click="exportData"
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
          @click="refresh"
        >
          刷新
        </el-button>
      </div>
      <el-table
        id="out-table"
        ref="payedTable"
        :data="tableData"
        v-loading="Loading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        row-key="id"
        @row-click="rowClick"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="30"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          label="订单号"
          property="orderNo"
          align="center"
        ></el-table-column>
        <el-table-column label="收支类型" prop="orderType" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              v-if="scope.row.orderType == 0"
              style="color: #67c23a"
            >
              收入
            </el-tag>
            <el-tag
              size="mini"
              v-if="scope.row.orderType == 1"
              style="color: #67c23a"
            >
              收入
            </el-tag>
            <el-tag
              size="mini"
              v-if="scope.row.orderType == 6"
              style="color: #67c23a"
            >
              收入
            </el-tag>
            <el-tag
              size="mini"
              v-if="scope.row.orderType == 7"
              style="color: #67c23a"
            >
              收入
            </el-tag>
            <el-tag
              size="mini"
              v-if="scope.row.orderType == 2"
              style="color: #f56c6c"
            >
              支出
            </el-tag>
            <el-tag
              size="mini"
              v-if="scope.row.orderType == 4"
              style="color: #f56c6c"
            >
              支出
            </el-tag>
            <!-- <span v-if="!scope.row.orderType">暂无信息</span> -->
          </template>
        </el-table-column>
        <el-table-column label="交易类型" prop="orderType" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType == 0" style="color: #67c23a">
              小程序订单付款
            </span>
            <span v-if="scope.row.orderType == 1" style="color: #67c23a">
              充值
            </span>
            <span v-if="scope.row.orderType == 6" style="color: #67c23a">
              服务商订单付款
            </span>
            <span v-if="scope.row.orderType == 7" style="color: #67c23a">
              续费
            </span>
            <span v-if="scope.row.orderType == 2" style="color: #f56c6c">
              提现
            </span>
            <span v-if="scope.row.orderType == 4" style="color: #f56c6c">
              退款
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收支金额" align="center">
          <template slot-scope="scope">
            ￥
            <span style="color: red">{{ scope.row.amount || "0.00" }}</span
            >元
          </template>
        </el-table-column>
        <el-table-column label="记账时间" prop="addTime" align="center">
          <template slot-scope="scope">{{
            scope.row.addTime || scope.row.createTime
          }}</template>
        </el-table-column>
        <el-table-column label="业务状态" prop="status" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color: #409eff">
              未支付
            </span>
            <span v-if="scope.row.status == 1" style="color: #67c23a">
              支付成功
            </span>
            <span v-if="scope.row.status == 3" style="color: #f56c6c">
              支付失败
            </span>
          </template>
        </el-table-column>
        <el-table-column label="交易方式" prop="payway" align="center">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.payway || "未知" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="微信openID" property="buyerId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.buyerId | formateProp }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="微信交易流水号"
          property="tradeNo"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tradeNo | formateProp }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex">
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
        <p style="margin: 14px">
          共计
          <el-tag size="mini">{{ incomeCount }}</el-tag
          >单
        </p>
        <p style="margin: 14px">
          收入共计
          <el-tag size="mini" type="success">{{ incomeAmount }}</el-tag
          >元
        </p>
        <p style="margin: 14px">
          支出共计
          <el-tag size="mini" type="danger">{{ expendAmount }}</el-tag
          >元
        </p>
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
import { getIncomes, getAmount } from "@/api/getData";
import excel from "global/excel";
const defaultListQuery = {
  page: 1,
  pageSize: 10,
  orderNo: "",
  payType: "",
  status: "",
  payStartTime: "",
  payEndTime: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      addTime: "",
      selectedList: [],
      selectID: [],
      offset: 0,
      limit: 100,
      count: 0,
      incomeCount: 0,
      incomeAmount: 0,
      expendAmount: 0,
      isPagination: "main",
      Loading: false,
      dialogVisible: false,
      incomeStatus: [
        {
          label: "未支付",
          value: 0,
        },
        {
          label: "支付成功",
          value: 1,
        },
        {
          label: "支付失败",
          value: 3,
        },
      ],
      incomePayType: [
        {
          label: "收入",
          value: "0",
        },
        {
          label: "支出",
          value: "1",
        },
      ],
      columnList: {
        orderNo: "订单号",
        szType: "收支类型",
        amount: "收支金额",
        addTime: "记账时间",
        szStatus: "业务状态",
        payway: "业务类型",
        buyerId: "微信openID",
        tradeNo: "微信交易流水号",
      },
    };
  },
  mounted() {
    this.initData(this.listQuery.page);
  },
  filters: {
    formatOrderType(value) {
      if (item.orderType == 0 || item.orderType == 1 || item.orderType == 6) {
        return "收入";
      } else if (item.orderType == 2 || item.orderType == 4) {
        return "支出";
      } else {
        return "--";
      }
    },
    formatOrderStatus(value) {
      if (item.status == 0) {
        return "未支付";
      } else if (item.status == 1) {
        return "支付成功";
      } else if (item.status == 3) {
        return "支付失败";
      } else {
        return "--";
      }
    },
  },
  methods: {
    // 刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.addTime = "";
      this.selectedList = [];
      this.selectID = [];
      if (this.isPagination == "main") {
        this.Loading = true;
        setTimeout(() => {
          this.tableData = [];
          this.Loading = false;
          this.initData(this.listQuery.page);
        }, 1000);
      }
      if (this.isPagination == "search") {
        this.Loading = true;
        setTimeout(() => {
          this.tableData = [];
          this.Loading = false;
          this.isPagination = "main";
          this.initData(1);
        }, 1000);
      }
    },
    // 初始化数据
    async initData(cpage) {
      this.listQuery.page = cpage;
      this.getDataList();
      this.getAllIncomes();
    },
    // 获取数据
    async getDataList() {
      this.listQuery.payStartTime =
        this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[0];
      this.listQuery.payEndTime =
        this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[1];
      let parms = this.listQuery;
      const res = await getIncomes(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.excelList = res.data.list;
        this.count = res.data.total;
        this.incomeCount = this.count;
      }
    },
    // 获取单数和收支总计
    async getAllIncomes() {
      let params = {
        orderNo: this.listQuery.orderNo,
        payType: this.listQuery.payType,
        status: this.listQuery.status,
        payStartTime:
          this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[0],
        payEndTime:
          this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[1],
      };
      const res = await getAmount(params);
      if (res.code == 200) {
        this.incomeAmount = res.data.incomeAmount;
        this.expendAmount = res.data.expendAmount;
      }
    },
    // 搜索
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
      this.addTime = "";
    },
    handleSearchList() {
      if (
        this.listQuery.orderNo ||
        this.listQuery.payType ||
        this.status ||
        this.addTime
      ) {
        this.Loading = true;
        setTimeout(() => {
          this.listQuery.page = 1;
          this.getDataList();
          this.getAllIncomes();
          this.Loading = false;
        }, 1500);
      } else {
        this.$message({
          type: "warning",
          message: "请输入查询条件！",
          center: true,
        });
      }
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      this.getDataList();
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
        if (item.orderType == 0 || item.orderType == 1 || item.orderType == 6) {
          item.szType = "收入";
        }
        if (item.orderType == 2 || item.orderType == 4) {
          item.szType = "支出";
        }
        if (item.status == 0) {
          item.szStatus = "未支付";
        }
        if (item.status == 1) {
          item.szStatus = "支付成功";
        }
        if (item.status == 3) {
          item.szStatus = "支付失败";
        }
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "收支明细",
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
          orderNo: this.listQuery.orderNo,
          payType: this.listQuery.payType,
          status: this.listQuery.status,
          payStartTime:
            this.addTime == null
              ? ""
              : this.addTime == ""
              ? ""
              : this.addTime[0],
          payEndTime:
            this.addTime == null
              ? ""
              : this.addTime == ""
              ? ""
              : this.addTime[1],
        };
        console.log("导出全部");
        const res = await getIncomes(params);
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
      let refsElTable = this.$refs.payedTable; // 获取表格对象
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
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>