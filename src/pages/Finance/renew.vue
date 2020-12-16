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
            <el-form-item label="续费号：">
              <el-input
                v-model="listQuery.id"
                class="input-width"
                clearable
                placeholder="续费号"
              ></el-input>
            </el-form-item>
            <el-form-item label="订单号：">
              <el-input
                v-model="listQuery.orderNo"
                class="input-width"
                clearable
                placeholder="订单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="续费状态：">
              <el-select
                v-model="listQuery.status"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in statusList"
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
            size="mini"
            plain
            v-has="{ name: '抢单表', type: '1' }"
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
            <renewInfo :robOrder="scope.row"></renewInfo>
          </template>
        </el-table-column>
        <el-table-column
          label="续费号"
          prop="id"
          align="center"
        ></el-table-column>
        <el-table-column
          label="订单号"
          prop="orderNo"
          align="center"
        ></el-table-column>
        <el-table-column label="续费金额" align="center">
          <template slot-scope="scope">
            <span style="color: red">
              {{ "￥" + scope.row.renewAmout }}元
            </span>
          </template>
        </el-table-column>
        <el-table-column label="续费起止日期" align="center">
          <template slot-scope="scope">
            {{ scope.row.originalTime + "至" + scope.row.renewTime }}
          </template>
        </el-table-column>
        <el-table-column label="续费时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatTime }}
          </template>
        </el-table-column>
        <el-table-column label="续费状态" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="scope.row.status == 0 ? 'danger' : 'primary'"
            >
              {{ scope.row.status | checkStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单详情" prop="status" align="center">
          <template slot-scope="scope">
            <el-link @click.stop="readOrder(scope.row)" type="primary">
              查看<i class="el-icon-view el-icon--right"></i>
            </el-link>
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
    </div>

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

    <!-- 查看订单 -->
    <el-dialog
      :visible.sync="orderVisible"
      top="5vh"
      width="900px"
      center
      :before-close="closeOrderInfo"
    >
      <template slot="title">
        <span style="color: #409eff">{{ orderData.orderNumber }}</span>
        订单详情
      </template>
      <orderInfo :row="orderData"></orderInfo>
    </el-dialog>
  </div>
</template>

<script>
import excel from "global/excel";
import { getRenewOrder, getOrderList } from "@/api/getData";
import orderInfo from "components/orderInfo";
import renewInfo from "components/renewInfo";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  id: "",
  orderNo: "",
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
      orderData: {},
      selectedList: [],
      selectID: [],
      tableData: [],
      payTime: "",
      type: "",
      reFreshLoading: false,
      dialogVisible: false,
      orderVisible: false,
      isPagination: "main",
      otherInfo: {},
      offset: 0,
      limit: 100,
      count: 0,
      statusList: [
        {
          label: "未续费",
          value: 0,
        },
        {
          label: "已续费",
          value: 1,
        },
      ],
      columnList: {
        id: "续费号",
        orderNo: "订单号",
        renewAmout: "续费金额",
        originalTime: "续费起始日期",
        renewTime: "续费截止日期",
        createTime: "续费时间",
        Ostatus: "续费状态",
      },
    };
  },
  components: {
    renewInfo,
    orderInfo,
  },
  created() {
    this.initData(1);
    this.propList.hobby = this.orderPropList;
  },
  filters: {
    // 判断状态
    checkStatus(value) {
      if (value == 0) return "未续费";
      else if (value == 1) return "已续费";
      else return "--";
    },
    formatTime(value) {
      if (value) {
        return value;
      } else {
        return "--";
      }
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
          this.initData(this.listQuery.pageNum);
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
      this.listQuery.pageNum = cpage;
      this.getOrder();
    },
    async getOrder() {
      // this.listQuery.payStartTime =
      //   this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[0];
      // this.listQuery.payEndTime =
      //   this.addTime == null ? "" : this.addTime == "" ? "" : this.addTime[1];
      let parms = this.objReSet(this.listQuery);
      const res = await getRenewOrder(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.count = res.data.total;
      }
    },

    //搜索订单
    handleSearchList() {
      if (
        this.listQuery.id ||
        this.listQuery.orderNo ||
        this.listQuery.status + ""
      ) {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
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
    async readOrder(order) {
      console.log(order);
      const res = await getOrderList({
        page: 1,
        pageSize: 10,
        orderNumber: order.orderNo,
      });
      console.log(res);
      if (res.data.list) {
        this.orderData = res.data.list[0];
        this.orderVisible = true;
      } else {
        this.$message({
          type: "error",
          message: "没有该订单的信息！",
          center: ture,
        });
      }
    },
    closeOrderInfo() {
      this.orderVisible = false;
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
      if (value == 0) return "未续费";
      else if (value == 1) return "已续费";
      else return "--";
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
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "续费单",
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
          pageNum: 1,
          pageSize: 10000,
          orderNo: this.listQuery.orderNo,
          id: this.listQuery.id,
          status: this.listQuery.status,
        };
        console.log("导出全部");
        const res = await getRenewOrder(this.objReSet(params));
        if (res.data.records.length > 0 && res.data.records.length < 10000) {
          let exportData = res.data.records;
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
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.initData(this.listQuery.pageNum);
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>
