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
                placeholder="订单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="保单号：">
              <el-input
                v-model="listQuery.insuranceNo"
                class="input-width"
                clearable
                placeholder="保单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="保险日期：">
              <el-date-picker
                v-model="listQuery.insuranceDate"
                type="date"
                class="input-width"
                placeholder="选择保险日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="操作人：">
              <el-input
                v-model="listQuery.agent"
                class="input-width"
                clearable
                placeholder="操作人姓名"
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
            <el-form-item label="护工身份证：">
              <el-input
                v-model="listQuery.idcard"
                class="input-width"
                clearable
                placeholder="护工身份证"
              ></el-input>
            </el-form-item>
            <el-form-item label="病人姓名：">
              <el-input
                v-model="listQuery.patientName"
                class="input-width"
                clearable
                placeholder="病人姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="病人身份证：">
              <el-input
                v-model="listQuery.patientIdcard"
                class="input-width"
                clearable
                placeholder="病人身份证"
              ></el-input>
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
            v-has="{ name: '保险接口数据', type: '1' }"
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
          plain
          style="margin-left: 10px"
          @click="refresh('main')"
          >刷新</el-button
        >
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="upload"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xlsx, .xls"
        >
          <el-button slot="trigger" size="mini" type="success"
            >导入Excel</el-button
          >
        </el-upload>
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
            <span>{{ scope.row.orderNo | formateProp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nurseName | formateProp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="护工身份证" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.idcard | formateProp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="病人姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.patientName | formateProp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="病人身份证" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.patientIdcard | formateProp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保险日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.insuranceDate | formateProp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保单号" align="center">
          <template slot-scope="scope">
            {{ scope.row.insuranceNo | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            {{ scope.row.agent | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{ scope.row.remark | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="导入时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | formateProp }}
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-size="10"
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
import { uploadFile, searchInsure, importInsure } from "@/api/getData";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import excel from "global/excel";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderNo: "",
  nurseName: "",
  idcard: "",
  patientName: "",
  patientIdcard: "",
  insuranceDate: "",
  insuranceNo: "",
  agent: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      readExcelData: [],
      importData: [],
      selectedList: [],
      selectID: [],
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
        createTime: "导入时间",
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    //刷新
    refresh(med) {
      if (med == "main") {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.reFreshLoading = false;
          this.initData();
        }, 1000);
      }
    },
    async initData() {
      this.getInsureData();
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      if (
        this.listQuery.orderNo ||
        this.listQuery.insuranceDate ||
        this.listQuery.nurseName ||
        this.listQuery.idcard ||
        this.listQuery.patientName ||
        this.listQuery.patientIdcard ||
        this.listQuery.insuranceNo ||
        this.listQuery.agent
      ) {
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
          this.getInsureData();
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
    // 获取保险数据
    async getInsureData() {
      let parms = this.listQuery;
      const res = await searchInsure(parms);
      this.count = res.data.total;
      this.tableData = res.data.records;
    },

    // 上传文件
    upload(file, fileList) {
      let files = { 0: file.raw };
      this.readExcel(files);
    },
    // 读表格
    readExcel(files) {
      var that = this;
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message({
          type: "error",
          message: "上传的文件格式不正确，请上传.xls或者.xlsx格式的文件！",
          center: true,
        });
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          that.readExcelData = excel.readDataFromExcel(data, "binary").results;
          try {
          } catch (err) {
            console.log(err);
          }
          that.$refs.upload.value = "";
          that.importInsureData();
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    //重写数据
    resetData(data) {
      let that = this;
      let keyMap = {
        备注: "remark",
        操作人: "agent",
        保单号: "insuranceNo",
        保险日期: "insuranceDate",
        护工姓名: "nurseName",
        护工身份证: "idcard",
        病人姓名: "patientName",
        病人身份证: "patientIdcard",
        订单号: "orderNo",
      };
      data.forEach((item) => {
        let objs = Object.keys(item).reduce((newData, key) => {
          let newKey = keyMap[key] || key;
          newData[newKey] = item[key];
          return newData;
        }, {});
        that.importData.push(objs);
      });
      return that.importData;
    },
    // 导入数据
    async importInsureData() {
      console.log("export");
      let dataList = this.resetData(this.readExcelData);
      const res = await importInsure(dataList);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功",
          center: true,
        });
        this.readExcelData = [];
        this.importData = [];
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
          this.initData();
          this.reFreshLoading = false;
        }, 1500);
      }
      if (res.code == 500) {
        this.$alert(
          `<span style="color:#F56C6C">${res.message}</span>`,
          "温馨提示",
          {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true,
            center: true,
            type: "error",
          }
        );
        this.readExcelData = [];
        this.importData = [];
      }
    },

    // 分页操作
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
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "保险记录",
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
        let parms = {
          orderNo: this.listQuery.orderNo,
          nurseName: this.listQuery.nurseName,
          idcard: this.listQuery.idcard,
          patientName: this.listQuery.patientName,
          patientIdcard: this.listQuery.patientIdcard,
          insuranceDate: this.listQuery.insuranceDate,
          insuranceNo: this.listQuery.insuranceNo,
          agent: this.listQuery.agent,
        };
        const res = await searchInsure(parms);
        if (res.data.total) {
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
.upload-demo {
  display: inline-block;
  margin-left: 10px;
}
.table-SelectedRow-bgcolor {
  background-color: #ff4a !important;
}
</style>