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
            <el-form-item label="护工姓名：">
              <el-input
                v-model="listQuery.nurseName"
                class="input-width"
                clearable
                placeholder="护工姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="患者姓名：">
              <el-input
                v-model="listQuery.benurseName"
                class="input-width"
                clearable
                placeholder="患者姓名"
              ></el-input>
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
            <el-form-item label="创建时间：">
              <el-date-picker
                class="dateTime-width"
                v-model="cTime"
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
          <el-button
            type="primary"
            size="mini"
            plain
            v-has="{ name: '小程序端订单', type: '1' }"
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
        @row-click="rowClick"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          type="selection"
          width="30px"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column type="expand" width="30px">
          <template slot-scope="scope">
            <robOrderInfo :id="infoId" :robOrder="scope.row"></robOrderInfo>
          </template>
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="orderNumber"
          align="center"
        ></el-table-column>
        <el-table-column label="护工姓名" align="center">
          <template slot-scope="scope">
            <span> {{ scope.row.nurseName | formateProp }}</span>
          </template>
        </el-table-column>
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
        <el-table-column label="基础价格" align="center">
          <template slot-scope="scope">
            <span style="color: #ff6a00">
              {{ "￥" + (scope.row.basePrice || 0) }}元
            </span>
          </template>
        </el-table-column>
        <el-table-column label="总价" align="center">
          <template slot-scope="scope">
            <span style="color: #ff6a00"
              >{{ "￥" + (scope.row.amount || 0) }}元</span
            >
          </template>
        </el-table-column>
        <el-table-column label="优惠价格" align="center">
          <template slot-scope="scope">
            <span style="color: #409eff">
              {{ "￥" + (scope.row.couponPrice || 0) }}元
            </span>
          </template>
        </el-table-column>
        <el-table-column label="活动价格" align="center">
          <template slot-scope="scope">
            <span style="color: #409eff">
              {{ "￥" + (scope.row.activityPrice || 0) }}元
            </span>
          </template>
        </el-table-column>
        <el-table-column label="实际价格" align="center">
          <template slot-scope="scope">
            <span style="color: red">
              {{ "￥" + (scope.row.actualPrice || 0) }}元
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
        ></el-table-column>
        <el-table-column label="订单状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.status | checkStatus }}
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
  </div>
</template>

<script>
import excel from "global/excel";
import { getRobOrderList } from "@/api/getData";
import robOrderInfo from "components/robOrderInfo";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderNumber: "",
  nurseName: "",
  benurseName: "",
  status: "",
  searchStartTime: "",
  searchEndTime: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      selectedList: [],
      selectID: [],
      tableData: [],
      cTime: "",
      type: "",
      infoId: +new Date(),
      reFreshLoading: false,
      dialogVisible: false,
      isPagination: "main",
      otherInfo: {},
      offset: 0,
      limit: 100,
      count: 0,
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
        nurseName: "护工姓名",
        benurseName: "患者姓名",
        benurseMobile: "患者电话",
        startTime: "服务开始时间",
        endTime: "服务结束时间",
        serverAddr: "服务地址",
        basePrice: "基础价格",
        amount: "总价",
        couponPrice: "优惠价格",
        activityPrice: "活动价格",
        actualPrice: "实际价格",
        createTime: "创建时间",
        Ostatus: "订单状态",
      },
    };
  },
  components: {
    robOrderInfo,
  },
  created() {
    this.initData(1);
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
      this.listQuery.searchStartTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[0];
      this.listQuery.searchEndTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[1];
      let parms = this.objReSet(this.listQuery);
      const res = await getRobOrderList(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.count = res.data.total;
      }
    },

    //搜索订单
    handleSearchList() {
      if (
        this.listQuery.orderNumber ||
        this.listQuery.nurseName ||
        this.listQuery.benurseName ||
        this.listQuery.status + "" ||
        this.cTime.length
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
      this.cTime = "";
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
        fileName: "小程序端订单",
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
          orderNumber: this.listQuery.orderNumber,
          status: this.listQuery.status,
          searchStartTime:
            this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[0],
          searchEndTime:
            this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[1],
        };
        console.log("导出全部");
        const res = await getRobOrderList(this.objReSet(params));
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
