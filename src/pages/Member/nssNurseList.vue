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
            @submit.native.prevent
          >
            <el-form-item label="姓名：">
              <el-input
                v-model="listQuery.realName"
                class="input-width"
                clearable
                placeholder="护工姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input
                v-model="listQuery.phone"
                class="input-width"
                clearable
                maxlength="11"
                placeholder="护工电话号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input
                v-model="listQuery.identId"
                class="input-width"
                clearable
                maxlength="18"
                placeholder="护工身份证号"
              ></el-input>
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
            v-has="{ name: '非自营护工列表', type: '1' }"
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
          @click="refresh"
        >
          刷新
        </el-button>
        <el-button
          v-has="{ name: '非自营护工列表', type: '2' }"
          type="primary"
          size="mini"
          plain
          @click="addNurseData()"
          >添加护工</el-button
        >
      </div>

      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        v-loading="refreshLoading"
        ref="serveTable"
        row-key="id"
        @row-click="rowClick"
        :row-style="tableRowStyle"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          type="selection"
          width="42"
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column type="expand" width="20" align="left">
          <template slot-scope="scope">
            <nurseInfo
              :row1="scope.row"
              :isShow="2"
              @callBack="editNurse"
            ></nurseInfo>
          </template>
        </el-table-column>
        <el-table-column label="护工ID" align="center">
          <template slot-scope="scope">
            {{ scope.row.id | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="姓 名" align="center" width="80px">
          <template slot-scope="scope">
            {{ scope.row.realName | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="身份证号" align="center">
          <template slot-scope="scope">
            {{ scope.row.identId | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="电 话" align="center" width="120px">
          <template slot-scope="scope">
            {{ scope.row.phone | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="余 额" align="center" width="80px">
          <template slot-scope="scope">
            ￥<b style="color: #f50">{{ scope.row.balance || "0.00" }}</b
            >元
          </template>
        </el-table-column>
        <el-table-column label="性 别" align="center" width="60px">
          <template slot-scope="scope">
            {{ scope.row.sex | formateSex }}
          </template>
        </el-table-column>
        <el-table-column label="等 级" align="center" width="80px">
          <template slot-scope="scope">
            <span style="color: red">
              {{ scope.row.nurseLevel | formateProp }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="类 型" align="center" width="70px">
          <template slot-scope="scope">
            <span style="color: blue">
              {{ scope.row.selfSupport | formateSs }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="注销/启用" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.deleted"
              v-has="{ name: '非自营护工列表', type: '4' }"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @click.stop.native
              @change="changeStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操 作" align="center" fixed="right" width="320">
          <template slot-scope="scope">
            <el-button
              v-has="{ name: '非自营护工列表', type: '1' }"
              size="mini"
              type="primary"
              @click.stop="readOrder(scope.row)"
            >
              查看订单
            </el-button>
            <el-button
              size="mini"
              type="warning"
              v-has="{ name: '非自营护工列表', type: '1' }"
              @click.stop="selectForeman(scope.row)"
            >
              查看工头
            </el-button>
            <el-button
              v-has="{ name: '非自营护工列表', type: '1' }"
              size="mini"
              type="success"
              @click.stop="orderTable(scope.row)"
            >
              已支付订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>

      <!-- 护工订单 -->
      <el-dialog
        width="90%"
        top="6vh"
        :visible="showNursesList"
        class="elDialog"
        center
        :before-close="handleClose"
      >
        <template slot="title">
          <span style="color: #409eff">
            {{ nurseInfoData.realName }}
          </span>
          的订单
        </template>
        <orderList :key="orderId" :nurse="nurseInfoData"></orderList>
      </el-dialog>

      <!-- 查看服务商 -->
      <el-dialog
        width="300px"
        top="6vh"
        :visible="showForeman"
        class="elDialog"
        center
        :before-close="handleCloseForeman"
      >
        <template slot="title">
          <span style="color: #409eff">
            {{ nurse.realName }}
          </span>
          的服务商
        </template>
        <el-form label-position="left">
          <el-form-item label="服务商姓名:">
            <span>{{ nursesForeman.realName || "--" }}</span>
          </el-form-item>
          <el-form-item label="服务商电话:">
            <span>{{ nursesForeman.phone || "--" }}</span>
          </el-form-item>
          <el-form-item label="余额:">
            <span>{{ nursesForeman.balance || "--" }}</span>
          </el-form-item>
          <el-form-item label="账号:">
            <span>{{ nursesForeman.username || "--" }}</span>
          </el-form-item>
          <el-form-item label="星级:">
            <el-rate
              style="margin-top: 10px"
              v-model="nursesForeman.starNum"
              disabled
              show-score
              :texts="texts"
              text-color="red"
            >
            </el-rate>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{ nursesForeman.createTime || "--" }}</span>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 已支付订单 -->
      <el-dialog
        width="90%"
        top="6vh"
        :visible="showOrderList"
        center
        :before-close="handleCloseOrder"
      >
        <template slot="title">
          <span style="color: #409eff">
            {{ nurse.realName }}
          </span>
          的已支付订单
        </template>
        <PayOrder :key="payId" :nurse="nurse"></PayOrder>
      </el-dialog>

      <!-- 添加护工 -->
      <el-dialog
        :visible.sync="showAddDialog"
        title="添加护工"
        center
        width="700px"
        height="500px"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <addNurseData
          :key="id"
          :selfSupport="0"
          @change="nurseData"
          @callback="addSuccess"
          @cancel="addClose"
        ></addNurseData>
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
import nurseInfo from "./components/nurseInfo";
import orderInfo from "components/orderInfo";
import orderList from "components/orderList";
import PayOrder from "components/payOrder";
import addNurseData from "./addNurseData";
import batchAdd from "./components/batchAdd";
import check from "global/check";
import excel from "global/excel";
import {
  getUserList,
  getOrderList,
  deletedByUser,
  addNurse,
  getOrderTable,
} from "@/api/getData";
const defaultListQuery = {
  type: 1,
  page: 1,
  pageSize: 10,
  realName: "",
  phone: "",
  identId: "",
  startCreateTime: "",
  endCreateTime: "",
  selfSupport: 0,
};
export default {
  data() {
    return {
      id: +new Date(),
      orderId: +new Date(),
      payId: +new Date(),
      nurseInfoData: "",
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      selectedList: [],
      selectID: [],
      count: 0,
      texts: ["1星", "2星", "3星", "4星", "5星"],
      ruleForm: "",
      showAddDialog: false,
      showImportDialog: false,
      showForeman: false,
      isPagination: "main",
      nurse: {},
      nursesForeman: {},
      cTime: "",
      showNursesList: false,
      showOrderList: false,
      refreshLoading: false,
      dialogVisible: false,
      nurseColList: {
        id: "护工ID",
        realName: "姓名",
        identId: "身份证号",
        phone: "电话",
        balance: "余额",
        Nsex: "性别",
        age: "年龄",
        nurseLevel: "等级",
        NselfSupport: "类型",
        createTime: "创建时间",
      },
    };
  },
  components: {
    nurseInfo,
    orderInfo,
    orderList,
    PayOrder,
    addNurseData,
    batchAdd,
  },
  created() {
    this.initData(1);
  },
  filters: {
    formateSex(value) {
      if (value === 1) {
        return "男";
      } else if (value === 2) {
        return "女";
      } else {
        return "未知";
      }
    },
    formateSs(value) {
      if (value === "0") {
        return "非自营";
      } else if (value === "1") {
        return "自营";
      } else {
        return "--";
      }
    },
  },
  methods: {
    async initData(cpage) {
      this.listQuery.page = cpage;
      this.getNurseData();
    },
    //刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.cTime = "";
      if (this.isPagination == "main") {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.refreshLoading = false;
          this.initData(this.listQuery.page);
        }, 1000);
      }
      if (this.isPagination == "search") {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.refreshLoading = false;
          this.isPagination = "main";
          this.initData(1);
        }, 1000);
      }
    },

    //查询护工信息
    async getNurseData() {
      this.listQuery.startCreateTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[0];
      this.listQuery.endCreateTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[1];
      let parms = this.listQuery;
      const res = await getUserList(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      } else {
        throw new Error("获取数据失败");
      }
    },

    //搜索护工
    handleSearchList() {
      if (
        this.listQuery.phone ||
        this.listQuery.realName ||
        this.listQuery.identId ||
        this.cTime
      ) {
        if (this.listQuery.phone) {
          var checkPhone = check.phone(this.listQuery.phone);
          if (!checkPhone) return false;
        }
        if (this.listQuery.identId) {
          var checkIdent = check.ident(this.listQuery.identId);
          if (!checkIdent) return false;
        }
        this.refreshLoading = true;
        setTimeout(() => {
          this.listQuery.page = 1;
          this.getNurseData();
          this.refreshLoading = false;
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

    // 注销和启用用户
    async changeStatus(user) {
      let flag = user.deleted;
      user.deleted == 0 ? (user.deleted = 1) : (user.deleted = 0);
      let title =
        user.deleted == 0 ? "确定注销当前护工？" : "确定重新启用当前护工？";
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          flag == 0 ? (user.deleted = 0) : (user.deleted = 1);
          const res = await deletedByUser(user);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功!",
              center: true,
            });
            this.refresh();
          }
        })
        .catch(() => {});
    },

    //更新数据
    editNurse(code) {
      if (code == 200) {
        this.refresh("main");
      }
    },
    bindAccount() {
      this.$message({
        type: "warning",
        message: "正在研发中...",
        center: true,
      });
    },

    //查看订单
    async readOrder(row) {
      console.log(row);
      this.showNursesList = true;
      this.orderId = +new Date();
      this.nurseInfoData = row;
    },
    handleClose() {
      this.showNursesList = false;
    },

    // 查看已支付订单
    async orderTable(row) {
      this.nurse = row;
      this.payId = +new Date();
      this.showOrderList = true;
    },
    handleCloseOrder() {
      this.showOrderList = false;
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

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      this.getNurseData(this.listQuery.page);
    },

    exportData() {
      this.dialogVisible = true;
    },
    CloseExport() {
      this.dialogVisible = false;
    },
    exportExcel(excelData) {
      let tableData = excelData;
      tableData.forEach((item) => {
        if (item.sex == 1) {
          item.Nsex = "男";
        } else if (item.sex == 2) {
          item.Nsex = "女";
        } else {
          item.Nsex = "未知";
        }
        if (item.selfSupport == 0) {
          item.NselfSupport = "非自营";
        } else if (item.selfSupport == 1) {
          item.NselfSupport = "自营";
        } else {
          item.NselfSupport = "";
        }
      });
      const params = {
        header: Object.values(this.nurseColList),
        key: Object.keys(this.nurseColList),
        data: tableData,
        autoWidth: true,
        fileName: "非自营护工表",
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
        let params = {
          type: 1,
          page: 1,
          pageSize: 10000,
          realName: "",
          phone: "",
          identId: "",
          startCreateTime:
            this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[0],
          endCreateTime:
            this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[1],
          selfSupport: 0,
        };
        console.log("导出全部");
        const res = await getUserList(params);
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

    // 添加护工
    nurseData(nurses) {
      console.log(nurses);
    },
    async addNurseData() {
      this.id = +new Date();
      this.showAddDialog = true;
    },
    importNurses() {
      // this.showImportDialog = true;
      this.$alert("程序猿正在努力开发中", "温馨提示", {
        confirmButtonText: "确定",
        type: "info",
        center: true,
      });
    },
    // 添加回调
    addSuccess(code) {
      if (code == 200) {
        this.showAddDialog = false;
        this.initData(1);
      }
    },
    // 取消回调
    addClose() {
      this.showAddDialog = false;
    },

    // 查看服务商
    async selectForeman(row) {
      if (row.foremanId) {
        this.showForeman = true;
        this.nurse = row;
        const res = await getUserList({
          id: row.foremanId,
          type: 3,
          page: 1,
          pageSize: 10,
        });
        this.nursesForeman = res.data.list[0];
        console.log(this.nursesForeman);
      } else {
        this.$message({
          type: "error",
          message: "该护工还未绑定服务商！",
          center: true,
        });
      }
    },
    handleCloseForeman() {
      this.showForeman = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
}
</style>
