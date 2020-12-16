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
            <el-form-item label="退款方式：">
              <el-select
                v-model="listQuery.type"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in refundList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="退款时间：">
              <el-date-picker
                class="dateTime-width"
                v-model="refundTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                type="daterange"
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
            v-has="{ name: '退款审核', type: '1' }"
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
        align="center"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        ref="refundTable"
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
        <el-table-column label="退款单号" prop="orderNo" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNo || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款人" prop="username" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.username || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" prop="orderAmout" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderAmout || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" prop="refundAmout" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.refundAmout || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款方式" prop="type" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0" style="color: orange"
              >退到余额</span
            >
            <span v-if="scope.row.type == 1" style="color: #409eff"
              >原路返回</span
            >
          </template>
        </el-table-column>
        <el-table-column label="退款备注" prop="refundNote" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.refundNote || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款天数" prop="refundDays" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.refundDays || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款平台" prop="refundPlatform" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.refundPlatform || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款发起时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" prop="refundStatus" align="center">
          <!-- 0审核中 1已退款 2拒绝 -->
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.refundStatus == 0"
              type="danger"
              plain
              size="mini"
              v-has="{ name: '退款审核', type: '4' }"
              @click.stop="confirm(scope.row)"
            >
              审核
            </el-button>
            <span v-if="scope.row.refundStatus == 1" style="color: #67c23a">
              已退款
            </span>
            <span v-if="scope.row.refundStatus == 2" style="color: #f56c6c">
              已拒绝
            </span>
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
</template>

<script>
import excel from "global/excel";
import { getRefundOrder, orderRefund } from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderNo: "",
  type: "",
  startBetweenTime: "",
  endBetweenTime: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      selectedList: [],
      selectID: [],
      count: 0,
      refundTime: "",
      isPagination: "main",
      reFreshLoading: false,
      dialogVisible: false,
      refundList: [
        {
          label: "退到余额",
          value: "0",
        },
        {
          label: "原路返回",
          value: "1",
        },
      ],
      columnList: {
        orderNo: "退款单号",
        username: "退款人",
        orderAmout: "订单金额",
        refundAmout: "退款金额",
        rType: "退款方式",
        refundNote: "退款备注",
        refundDays: "退款天数",
        refundPlatform: "退款平台",
        createTime: "退款发起时间",
        rStatus: "退款状态",
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    refresh() {
      this.reFreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.count = 0;
        this.reFreshLoading = false;
        this.initData(this.listQuery.pageNum);
      }, 1000);
    },
    initData(page) {
      this.listQuery.pageNum = page;
      this.getList();
    },
    async getList() {
      this.listQuery.startBetweenTime =
        this.refundTime == null
          ? ""
          : this.refundTime == ""
          ? ""
          : this.refundTime[0];
      this.listQuery.endBetweenTime =
        this.refundTime == null
          ? ""
          : this.refundTime == ""
          ? ""
          : this.refundTime[1];
      let parms = this.listQuery;
      const res = await getRefundOrder(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      }
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
      this.refundTime = "";
    },
    async handleSearchList() {
      if (this.listQuery.orderNo || this.listQuery.type || this.refundTime) {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
          this.getList();
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
    confirm(row) {
      let order = row;
      console.log(order);
      delete order.updateTime;
      delete order.createTime;
      console.log(order);
      this.$confirm("是否同意退款?", "温馨提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "同意",
        cancelButtonText: "拒绝",
        type: "warning",
        center: true,
      })
        .then(async () => {
          order.refundStatus = 1;
          const res = await orderRefund(order);
          console.log(res);
          if (res.code == 200) {
            this.$notify({
              title: "同意退款",
              message: res.data,
              type: "success",
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
          this.refresh();
        })
        .catch(async (action) => {
          console.log(action);
          if (action == "cancel") {
            order.refundStatus = 2;
            const res = await orderRefund(order);
            console.log(res);
            if (res.code == 200) {
              this.$notify({
                title: "拒绝退款",
                message: res.data,
                type: "error",
              });
            } else {
              this.$message({
                type: "error",
                message: res.message,
                center: true,
              });
            }
            this.refresh();
          } else {
            return false;
          }
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.initData(this.listQuery.pageNum);
    },

    // 判断状态
    checkStatus(value) {
      if (value == 0) return "审核中";
      else if (value == 1) return "已退款";
      else if (value == 2) return "已拒绝";
      else return "暂无信息";
    },
    // 判断类型
    checkType(value) {
      if (value == 0) return "退到余额";
      else if (value == 1) return "原路返回";
      else return "暂无信息";
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
        item.rType = this.checkType(item.type);
        item.rStatus = this.checkStatus(item.refundStatus);
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "退款记录",
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
          type: this.listQuery.type,
          startBetweenTime:
            this.refundTime == null
              ? ""
              : this.refundTime == ""
              ? ""
              : this.refundTime[0],
          endBetweenTime:
            this.refundTime == null
              ? ""
              : this.refundTime == ""
              ? ""
              : this.refundTime[1],
        };
        console.log("导出全部");
        const res = await getRefundOrder(params);
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
      let refsElTable = this.$refs.refundTable; // 获取表格对象
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
