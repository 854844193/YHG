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
            <el-form-item label="服务商姓名：">
              <el-input
                v-model="listQuery.merchantName"
                class="input-width"
                clearable
                placeholder="服务商姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="服务商ID：">
              <el-input
                v-model="listQuery.merchantId"
                class="input-width"
                clearable
                placeholder="服务商ID"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="searchBottom">
          <el-button type="primary" @click="handleSearchList" size="mini">
            搜索
          </el-button>
          <el-button @click="handleResetSearch" size="mini"> 重置 </el-button>
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
      >
        <el-table-column label="服务商姓名" align="center">
          <template slot-scope="scope">
            {{ scope.row.merchantName | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="服务商ID" align="center">
          <template slot-scope="scope">
            <el-link @click="readForeman(scope.row)" type="primary">
              <span>{{ scope.row.merchantId | formateProp }}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="推广人数" align="center">
          <template slot-scope="scope">
            {{ scope.row.countNum | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="查看推广人" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="readUsers(scope.row, timeType)"
              type="primary"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center">
          <template slot="header">
            <el-select
              v-model="timeType"
              placeholder="请选择时间类型"
              @change="filterBytime"
            >
              <el-option
                v-for="item in timeTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope">
            <el-tag size="mini">
              {{
                scope.row.type == "day"
                  ? "本月"
                  : scope.row.type == "month"
                  ? "本季度"
                  : scope.row.type == "year"
                  ? "本年度"
                  : "全部"
              }}
            </el-tag>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="Pagination">
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

    <!-- 推广用户列表 -->
    <el-dialog
      :visible.sync="usersVisible"
      top="5vh"
      width="90%"
      center
      :before-close="closeUserVisible"
    >
      <template slot="title">
        <span style="color: #409EFF">{{ parent.merchantId }}</span>
        的推广用户
      </template>
      <ScanUsers :parent="parent"></ScanUsers>
    </el-dialog>
    <!-- 查看服务商 -->
    <el-dialog
      width="300px"
      top="6vh"
      :visible="foremanVisible"
      class="elDialog"
      center
      :before-close="closeForemanVisible"
    >
      <template slot="title">
        <span style="color: #409eff">
          {{ merchant.realName }}
        </span>
        的信息
      </template>
      <el-form label-position="left">
        <el-form-item label="服务商姓名:">
          <span>{{ merchant.realName || "--" }}</span>
        </el-form-item>
        <el-form-item label="服务商电话:">
          <span>{{ merchant.phone || "--" }}</span>
        </el-form-item>
        <el-form-item label="余额:">
          <span>{{ merchant.balance || "--" }}</span>
        </el-form-item>
        <el-form-item label="账号:">
          <span>{{ merchant.username || "--" }}</span>
        </el-form-item>
        <el-form-item label="星级:">
          <el-rate
            style="margin-top: 10px"
            v-model="merchant.starNum"
            disabled
            show-score
            :texts="texts"
            text-color="red"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ merchant.createTime || "--" }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import excel from "global/excel";
import { getRecords, selectUsers, getUserList } from "@/api/getData";
import ScanUsers from "./components/scanUsers.vue";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  merchantId: "",
  merchantName: "",
  merchantPhone: "",
  userName: "",
};
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      parent: {},
      merchant: {},
      texts: ["1星", "2星", "3星", "4星", "5星"],
      refreshLoading: false,
      dialogVisible: false,
      usersVisible: false,
      foremanVisible: false,
      isPagination: "main",
      offset: 0,
      limit: 100,
      count: 0,
      timeType: "day",
      timeTypeList: [
        {
          label: "本月",
          value: "day",
        },
        {
          label: "本季度",
          value: "month",
        },
        {
          label: "本年度",
          value: "year",
        },
        {
          label: "全部",
          value: "all",
        },
      ],
    };
  },
  created() {
    this.initData();
  },
  components: {
    ScanUsers,
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
          this.getAllRecords(this.listQuery.page);
        }, 1000);
      } else {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.listQuery.pageNum = 1;
          this.refreshLoading = false;
          this.getAllRecords();
        }, 1000);
      }
    },

    //初始化数据
    async initData() {
      this.getAllRecords();
    },

    async getAllRecords() {
      let prams = this.objReSet(this.listQuery);
      const res = await getRecords(prams);
      console.log(res);
      this.tableData = res.data.records;
      this.count = res.data.total;
    },
    async readUsers(obj) {
      this.parent = obj;
      this.usersVisible = true;
    },
    closeUserVisible() {
      this.usersVisible = false;
    },
    async readForeman(obj) {
      const res = await getUserList({
        id: obj.merchantId,
        type: 3,
        page: 1,
        pageSize: 10,
      });
      console.log(res);
      if (res.data.total) {
        this.foremanVisible = true;
        this.merchant = res.data.list[0];
      } else {
        this.$message({
          type: "error",
          message: "没有该服务商的信息",
          center: true,
        });
      }
    },
    closeForemanVisible() {
      this.foremanVisible = false;
      this.merchant = {};
    },

    //搜索
    handleSearchList() {
      this.getAllRecords();
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
    },

    filterBytime(event) {
      console.log(event);
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
        fileName: "扫码情况",
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

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.getAllRecords();
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>
