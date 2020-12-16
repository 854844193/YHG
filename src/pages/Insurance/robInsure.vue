<template>
  <div class="fillcontain">
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
          plain
          style="margin-left: 10px"
          @click="refresh"
          >刷新</el-button
        >
        <el-button type="primary" size="mini" plain @click="exportData"
          >导出</el-button
        >
      </div>

      <el-table
        :data="tableData"
        id="out-table"
        ref="serveTable"
        style="width: 100%"
        v-loading="reFreshLoading"
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
        <el-table-column label="订单号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNo || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nurseName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工身份证" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.idcard || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="病人姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.patientName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="病人身份证" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.patientIdcard || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保险日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.insuranceDate || "--" }}</span>
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
import headTop from "components/headTop.vue";
import { baseUrl, baseImgPath } from "@/config/env";
import { getRobInsureList } from "@/api/getData";
import excel from "global/excel";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
};
export default {
  components: {
    headTop,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      selectedList: [],
      selectID: [],
      selectIndex: [],
      offset: 0,
      limit: 100,
      count: 0,
      reFreshLoading: false,
      dialogVisible: false,
      columnList: {
        orderNo: "订单号",
        nurseName: "护工姓名",
        idcard: "护工身份证",
        patientName: "病人姓名",
        patientIdcard: "病人身份证",
        insuranceDate: "保险日期",
        insuranceNo: "保单号",
        agent: "操作人",
        remark: "备注",
      },
    };
  },
  created() {
    this.initData();
  },

  methods: {
    //刷新
    refresh() {
      this.reFreshLoading = true;
      setTimeout(() => {
        this.reFreshLoading = false;
        this.initData();
      }, 1000);
    },

    async initData() {
      this.getInsureData();
    },
    // 获取保险数据
    async getInsureData() {
      let parms = this.listQuery;
      const res = await getRobInsureList(parms);
      console.log(res);
      this.count = res.data.total;
      let records = res.data.records;
      records.forEach((item) => {
        item.insuranceDate = this.getNowFormatDate();
      });
      this.tableData = records;
    },
    //获取当前日期
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      // var month = date.getMonth();
      var strDate = date.getDate() - 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    handleResetSearch() {
      //重置搜索条件
      this.time = "";
    },

    // 分页操作
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      console.log(this.listQuery.pageNum);
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
      let refsElTable = this.$refs.serveTable; // 获取表格对象
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
    handleClose() {
      this.dialogVisible = false;
    },
    exportExcel(excelData) {
      let tableData = excelData;
      tableData.forEach((item) => {
        item.insuranceDate = this.getNowFormatDate();
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "抢单保险",
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
        console.log("导出全部");
        const res = await getRobInsureList();
        console.log(res);
        if (res.data.length > 0) {
          let exportData = res.data;
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

<style scoped='less'>
.btnBox {
  margin: 10px;
}
.price {
  display: inline-block;
  margin-left: 80px;
}
.table-SelectedRow-bgcolor {
  background-color: #ff4a !important;
}
</style>