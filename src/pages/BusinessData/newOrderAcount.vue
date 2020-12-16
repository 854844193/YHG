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
            <el-form-item label="分账场景：">
              <el-input
                v-model="listQuery.settlementName"
                class="input-width"
                clearable
                placeholder="分账场景"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间：">
              <el-date-picker
                class="dateTime-width"
                v-model="cTime"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                type="daterange"
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
            plain
            size="mini"
            v-has="{ name: '分账明细', type: '2' }"
            @click="exportData"
          >
            导出
          </el-button>
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
          class="search_btn"
          native-type="submit"
          type="primary"
          size="mini"
          @click="refresh"
          >刷新</el-button
        >
        <el-button
          class="search_btn"
          type="primary"
          plain
          size="mini"
          v-has="{ name: '新表分账明细', type: '2' }"
          @click="exportData"
          >导出</el-button
        >
      </div>

      <el-table
        :data="tableData"
        style="width: 100%"
        ref="serveTable"
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
        <el-table-column label="订单号" property="orderNo" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNo || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分账场景"
          property="settlementName"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.settlementName || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分账类型"
          property="settlementType"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.settlementType == '0'">
              {{ "点对点" + "-" + (scope.row.template == 3 ? "N" : "Y") }}
            </p>
            <p v-if="scope.row.settlementType == '1'">
              {{ "标品" + "-" + (scope.row.template == 3 ? "N" : "Y") }}
            </p>
            <p v-if="scope.row.settlementType == '2'">
              {{ "业务线" + "-" + (scope.row.template == 3 ? "N" : "Y") }}
            </p>
            <p v-if="scope.row.settlementType == undefined">暂无信息</p>
          </template>
        </el-table-column>
        <el-table-column
          label="是否分账完成"
          property="isSettlement"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isSettlement == "2" ? "完成" : "未完成" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工姓名" property="nursename" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nursename || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="护工身份证"
          property="nurseCardId"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.nurseCardId || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工电话" property="nursePhone" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nursePhone || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工分润金额" property="nurse" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nurse || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="护工归属方姓名"
          property="foremanName"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.foremanName || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="护工归属方身份证"
          property="foremanCardId"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.foremanCardId || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="护工归属方电话"
          property="foremanPhone"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.foremanPhone || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="护工归属方分润金额"
          property="nurse"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.foreman || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流量方姓名" property="flowname" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.flowname || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="流量方身份证"
          property="flowCardId"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.flowCardId || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流量方电话" property="flowPhone" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.flowPhone || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="流量方分润金额"
          property="introducer"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.introducer || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="患者姓名" property="beNurseName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.beNurseName || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="患者身份证"
          property="beNurseCardId"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.beNurseCardId || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="患者号码"
          property="beNursePhone"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.beNursePhone || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付金额" property="payAmount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payAmount || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="每日单价" property="preferPrice" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.preferPrice || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" property="note" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.note || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" property="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" property="payDate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.payDate || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务时间" property="serviceDate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.serviceDate || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="子项信息"
          align="center"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-link type="primary" @click.stop="readAccount(scope.row)"
              >查看子项</el-link
            >
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

      <!-- 分账明细子项 -->
      <el-dialog
        :visible.sync="isAccount"
        width="600px"
        height="200px"
        :close-on-click-modal="false"
        title="分账明细子项"
        center
        :before-close="closeAccount"
      >
        <table border="1" width="100%">
          <tr>
            <th>序号</th>
            <th>分润方</th>
            <th>分润方姓名</th>
            <th>分润方电话</th>
            <th>分润方式</th>
            <th>分润比例</th>
            <th>分润金额</th>
          </tr>
          <tr>
            <td>1</td>
            <td>流量方</td>
            <td>{{ everyAccount.flowname || "暂无信息" }}</td>
            <td>{{ everyAccount.flowPhone || "暂无信息" }}</td>
            <td>
              {{ everyAccount.introducerCompany == "1" ? "百分比" : "固定额" }}
            </td>
            <td>
              <span v-if="everyAccount.introducerCompany == '1'">
                {{ everyAccount.introducerAmout + "%" || "暂无信息" }}
              </span>
              <span v-else>{{
                everyAccount.introducerAmout || "暂无信息"
              }}</span>
            </td>
            <td>{{ everyAccount.introducer || "暂无信息" }}</td>
          </tr>
          <tr>
            <td>2</td>
            <td>服务方</td>
            <td>{{ everyAccount.nursename || "暂无信息" }}</td>
            <td>{{ everyAccount.nursePhone || "暂无信息" }}</td>
            <td>
              {{ everyAccount.nurseCompany == "1" ? "百分比" : "固定额" }}
            </td>
            <td>
              <span v-if="everyAccount.nurseCompany == '1'">
                {{ everyAccount.nurseAmout + "%" || "暂无信息" }}
              </span>
              <span v-else>{{ everyAccount.nurseAmout || "暂无信息" }}</span>
            </td>
            <td>{{ everyAccount.nurse || "暂无信息" }}</td>
          </tr>
          <tr>
            <td>3</td>
            <td>护工归属方</td>
            <td>{{ everyAccount.foremanname || "暂无信息" }}</td>
            <td>{{ everyAccount.foremanPhone || "暂无信息" }}</td>
            <td>
              {{ everyAccount.foremanCompany == "1" ? "百分比" : "固定额" }}
            </td>
            <td>
              <span v-if="everyAccount.foremanCompany == '1'">
                {{ everyAccount.foremanAmout + "%" || "暂无信息" }}
              </span>
              <span v-else>{{ everyAccount.foremanAmout || "暂无信息" }}</span>
            </td>
            <td>{{ everyAccount.foreman || "暂无信息" }}</td>
          </tr>
        </table>
      </el-dialog>

      <!-- 多种方式导出 -->
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
  </div>
</template>

<script>
import excel from "global/excel";
import { getNewAccountDetails } from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  settlementName: "",
  startBetweenTime: "",
  endBetweenTime: "",
};
export default {
  data() {
    return {
      reFreshLoading: false,
      isAccount: false,
      dialogVisible: false,
      tableData: [],
      everyAccount: [],
      selectedList: [],
      selectID: [],
      listQuery: Object.assign({}, defaultListQuery),
      cTime: "",
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      columnList: {
        orderNo: "订单号",
        settlementName: "分账场景",
        sType: "分账规则类型",
        sStatus: "分账状态",
        nursename: "护工姓名",
        nurseCardId: "护工身份证",
        nursePhone: "护工电话",
        sNurse: "护工分润比例",
        nurse: "护工分润金额",
        foremanName: "护工归属方姓名",
        foremanCardId: "护工归属方身份证",
        foremanPhone: "护工归属方电话",
        sForeman: "护工归属方分润比例",
        foreman: "护工归属方分润金额",
        flowname: "流量方姓名",
        flowCardId: "流量方身份证",
        flowPhone: "流量方电话",
        sIntroducer: "流量方分润比例",
        introducer: "流量方分润金额",
        beNurseName: "患者姓名",
        beNurseCardId: "患者身份证",
        beNursePhone: "患者电话",
        payAmount: "支付金额",
        preferPrice: "每日单价",
        note: "描述",
        createTime: "创建时间",
        payDate: "支付时间",
        serviceDate: "服务时间段",
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    refresh() {
      this.reFreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.reFreshLoading = false;
        this.initData();
      }, 1000);
    },

    async initData() {
      this.listQuery.startBetweenTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[0];
      this.listQuery.endBetweenTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[1];
      let parms = this.objReSet(this.listQuery);
      const res = await getNewAccountDetails(parms);
      console.log(res);
      if ((res.code = 200)) {
        res.data.list.forEach((item) => {
          let time = new Date(item.createTime);
          item.createTime = this.GetDate.formatDate(time);
        });
        this.tableData = res.data.list;
        this.count = res.data.total;
      }
    },
    //搜索分账信息
    handleSearchList() {
      this.selectedOrderList = [];
      this.selectOrderID = [];
      if (this.listQuery.settlementName || this.cTime.length) {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
          this.initData();
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

    // 百分比或者固定额
    checkComp(value, com) {
      if (com == "0") return value;
      if (com == "1") return value + "%";
    },
    // 百分比或者固定额
    checkStatus(value) {
      if (value == "2") return "完成";
      else return "未完成";
    },
    // 分账类型
    checkType(value, temp) {
      if (value == "0") return "点对点" + "-" + (temp == 3 ? "N" : "Y");
      if (value == "1") return "标品" + "-" + (temp == 3 ? "N" : "Y");
      if (value == "2") return "业务线" + "-" + (temp == 3 ? "N" : "Y");
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
        item.sStatus = this.checkStatus(item.isSettlement);
        item.sType = this.checkType(item.settlementType, item.template);
        item.sIntroducer = this.checkComp(
          item.introducerAmout,
          item.introducerCompany
        );
        item.sNurse = this.checkComp(item.nurseAmout, item.nurseCompany);
        item.sForeman = this.checkComp(item.foremanAmout, item.foremanCompany);
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "新表分账明细",
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
        const res = await getNewAccountDetails({
          settlementName: this.settlementName,
          startBetweenTime:
            this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[0],
          endBetweenTime:
            this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[1],
        });
        if (res.data.total > 0) {
          let exportData = res.data.list;
          exportData.forEach((item) => {
            let time = new Date(item.createTime);
            item.createTime = this.GetDate.formatDate(time);
          });
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

    readAccount(acc) {
      console.log(acc);
      this.everyAccount = acc;
      this.isAccount = true;
    },
    closeAccount() {
      this.isAccount = false;
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
      let findRow = this.selectedList.find((c) => c.orderNo == row.orderNo); //找到选中的行
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
        return item.orderNo;
      });
      console.log(this.selectedList, this.selectID);
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.initData();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>