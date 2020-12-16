<template>
  <div>
    <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
      <el-form-item label="订单号：">
        <el-input
          v-model="listQuery.orderNumber"
          class="input-width"
          clearable
          placeholder="订单号"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleSearchList" size="mini">
        搜索
      </el-button>
      <el-button @click="handleResetSearch" size="mini"> 重置 </el-button>
      <el-button
        native-type="submit"
        type="primary"
        size="mini"
        style="margin-left: 10px"
        @click="refresh"
      >
        刷新
      </el-button>
    </el-form>
    <el-table
      :data="tableData"
      height="500"
      ref="payedTable"
      row-key="id"
      v-loading="reFreshLoading"
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
        prop="orderNumber"
        align="center"
      ></el-table-column>
      <el-table-column label="患者姓名" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.benurseName | formateProp }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="患者电话" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.benurseMobile | formateProp }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="实际价格" align="center">
        <template slot-scope="scope">
          <span style="color: red"> {{ "￥" + scope.row.actualPrice }}元 </span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
      ></el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        layout="total, prev, pager, next"
        :total="count"
      ></el-pagination>
      <p style="margin: 4px">
        已选
        <el-tag size="mini">{{ selectedList.length }}</el-tag>
        单
      </p>
      <p style="margin: 4px">
        共
        <el-tag size="mini" type="warning">{{ amount }}</el-tag>
        元
      </p>
    </div>
  </div>
</template>

<script>
import { getRobOrderList } from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  title: "",
  type: "",
  status: "",
};
export default {
  name: "invoiceOrder",
  data() {
    return {
      count: 0,
      amount: 0,
      listQuery: Object.assign({}, defaultListQuery),
      selectedList: [],
      selectID: [],
      tableData: [],
      reFreshLoading: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.getOrder();
    },
    //刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.selectedOrderList = [];
      this.selectOrderID = [];
      this.reFreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.reFreshLoading = false;
        this.listQuery.pageNum = 1;
        this.initData();
      }, 1000);
    },
    async getOrder() {
      let prams = this.objReSet(this.listQuery);
      const res = await getRobOrderList(prams);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.count = res.data.total;
      }
    },

    //搜索订单
    handleSearchList() {
      if (this.listQuery.orderNumber || this.listQuery.status + "") {
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

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.initData();
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
      if (this.selectedList.length) {
        this.amount = 0;
        this.selectedList.forEach((item) => {
          this.amount += item.actualPrice;
        });
      } else {
        this.amount = 0;
      }
      this.$emit("change", this.selectedList, this.amount);
    },
  },
};
</script>

<style lang="less" scoped>
</style>