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
            size="small"
            label-width="140px"
            @submit.native.prevent
          >
            <el-form-item label="需求ID：">
              <el-input
                v-model="listQuery.id"
                class="input-width"
                clearable
                placeholder="订单需求ID"
              ></el-input>
            </el-form-item>
            <el-form-item label="护理类型：">
              <el-input
                v-model="listQuery.demandName"
                class="input-width"
                clearable
                placeholder="护理类型"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务时间：">
              <el-date-picker
                class="dateTime-width"
                v-model="timeValue"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="截至时间"
              ></el-date-picker>
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
            v-has="{ name: '订单需求表', type: '1' }"
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
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        ref="needsTable"
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
        <el-table-column type="expand" label="详 情" fixed="left" width="60">
          <template slot-scope="scope">
            <needsInfo :row="scope.row" @change="updateTime"></needsInfo>
          </template>
        </el-table-column>
        <el-table-column
          label="订单需求ID"
          prop="id"
          align="center"
        ></el-table-column>
        <el-table-column
          label="护理类型"
          prop="demandName"
          align="center"
        ></el-table-column>
        <el-table-column label="价 格" prop="price" align="center">
          <template slot-scope="scope">
            <p>
              ￥
              <span style="color: red">{{ scope.row.price || "0.00" }}</span
              >元
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="开始服务时间"
          prop="startTime"
          align="center"
        ></el-table-column>
        <el-table-column
          label="截至服务时间"
          prop="endTime"
          align="center"
        ></el-table-column>
        <el-table-column
          label="服务时段"
          prop="serverTime"
          align="center"
        ></el-table-column>
        <el-table-column label="护理位置" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.serverSite || "无" }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
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
import needsInfo from "components/needsInfo";
import excel from "global/excel";
import { getNeedsList, getNeedsCount, getNeedByCondition } from "@/api/getData";
const defaultListQuery = {
  page: 1,
  pageSize: 10,
  id: "",
  cardId: "",
  phone: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      timeValue: "",
      tableData: [],
      selectID: [],
      selectedList: [],
      allData: [],
      refreshLoading: false,
      dialogVisible: false,
      isPagination: "main",
      splitAccount: {},
      offset: 0,
      limit: 100,
      count: 0,
    };
  },
  created() {
    this.initData();
  },
  components: {
    needsInfo,
  },
  methods: {
    //刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.timeValue = "";
      if (this.isPagination == "main") {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.refreshLoading = false;
          this.getAllNeedList(this.listQuery.page);
        }, 1000);
      } else {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.refreshLoading = false;
          this.getAllNeedList(1);
        }, 1000);
      }
    },

    //初始化数据
    async initData() {
      this.getAllNeedList(1);
    },
    async getAllNeedList(page) {
      this.listQuery.page = page;
      this.listQuery.startTime =
        this.timeValue == null
          ? ""
          : this.timeValue == ""
          ? ""
          : this.timeValue[0];
      this.listQuery.endTime =
        this.timeValue == null
          ? ""
          : this.timeValue == ""
          ? ""
          : this.timeValue[1];
      let parms = this.listQuery;
      const res = await getNeedByCondition(parms);
      if (res.code == 200) {
        this.tableData = res.data;
        console.log(res);
      }
      const res1 = await getNeedsCount();
      console.log(res1);
      if (res1.code == 200) {
        this.count = res1.data;
      }
    },

    //搜索
    handleSearchList() {
      this.isPagination = "search";
      this.search();
    },
    async search(page) {
      if (this.listQuery.id || this.listQuery.demandName || this.timeValue) {
        this.listQuery.page = page == undefined ? 1 : page;
        this.listQuery.startTime =
          this.timeValue == null
            ? ""
            : this.timeValue == ""
            ? ""
            : this.timeValue[0];
        this.listQuery.endTime =
          this.timeValue == null
            ? ""
            : this.timeValue == ""
            ? ""
            : this.timeValue[1];
        const resData = await getNeedByCondition(this.listQuery);
        this.tableData = resData.data;
        this.isPa;
        const res = await getNeedByCondition({
          id: this.listQuery.id,
          demandName: this.listQuery.demandName,
          startTime:
            this.timeValue == null
              ? ""
              : this.timeValue == ""
              ? ""
              : this.timeValue[0],
          endTime:
            this.timeValue == null
              ? ""
              : this.timeValue == ""
              ? ""
              : this.timeValue[1],
        });
        this.count = res.data.length;
      } else {
        this.$alert("请输入查询条件", {
          type: "warning",
          center: true,
          confirmButtonText: "确定",
        });
      }
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
      this.timeValue = "";
    },
    updateTime() {
      this.refresh();
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
        fileName: "订单需求表",
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
          id: this.listQuery.id,
          demandName: this.listQuery.demandName,
          startTime:
            this.timeValue == null
              ? ""
              : this.timeValue == ""
              ? ""
              : this.timeValue[0],
          endTime:
            this.timeValue == null
              ? ""
              : this.timeValue == ""
              ? ""
              : this.timeValue[0],
        };
        console.log("导出全部");
        const res = await selectEmpower(params);
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
      let refsElTable = this.$refs.needsTable; // 获取表格对象
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

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      if (this.isPagination == "main") {
        this.getAllNeedList(this.listQuery.page);
      } else {
        this.search(this.listQuery.page);
      }
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
.datePicker {
  margin-left: 20px;
  margin-top: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
</style>
