<template>
  <div>
    <!-- <el-form
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
    </el-form> -->
    <div style="margin-bottom: 10px">
      <!-- <el-button type="primary" @click="handleSearchList" size="mini">
        搜索
      </el-button>
      <el-button @click="handleResetSearch" size="mini"> 重置 </el-button> -->
      <!-- <el-button type="primary" size="mini" @click="refresh"> 刷新 </el-button> -->
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="refreshLoading"
      ref="nurseTable"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <!-- <el-table-column type="expand" width="20" align="center">
        <template slot-scope="scope">
          <nurseInfo :row1="scope.row" @callBack="editNurse"></nurseInfo>
        </template>
      </el-table-column> -->
      <el-table-column label="推广人ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.userId | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="推广人姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName | formateProp }}
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin-top: 10px">
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
</template>

<script language="">
import nurseInfo from "pages/Member/components/nurseInfo";
import { selectUsers } from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  merchantId: "",
};
export default {
  name: "scanUsers", // 服务商的护工表
  props: {
    parent: {
      type: Object,
    },
  },
  data() {
    return {
      tableData: [],
      listQuery: Object.assign({}, defaultListQuery),
      refreshLoading: false,
      count: 0,
    };
  },
  components: {
    nurseInfo,
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.getUserList();
    },
    async getUserList() {
      console.log(this.parent);
      this.listQuery.merchantId = this.parent.merchantId;
      let prams = this.objReSet(this.listQuery);
      const res = await selectUsers(prams);
      console.log(res);
      this.tableData = res.data.records;
      this.count = res.data.total;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.getUserList();
    },
  },
};
</script>

<style scoped="" type="text/css"></style>
