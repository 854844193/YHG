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
      <el-button size="mini" type="primary" @click="bindNurse">
        绑定护工
      </el-button>
      <b style="float: right">
        护工数量：
        <span style="color: blue">{{ count }}</span>
      </b>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="600"
      v-loading="refreshLoading"
      ref="nurseTable"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <!-- <el-table-column type="expand" width="20" align="center">
        <template slot-scope="scope">
          <nurseInfo :row1="scope.row" :isShow="3"></nurseInfo>
        </template>
      </el-table-column> -->
      <el-table-column label="护工ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.id | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="姓 名" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="电 话" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone | formateProp }}
        </template>
      </el-table-column>
      <el-table-column label="等 级" align="center">
        <template slot-scope="scope">
          <span style="color: red">
            {{ scope.row.nurseLevel | formateProp }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操 作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-has="{ name: '服务商列表', type: '4' }"
            size="mini"
            type="danger"
            @click="relieveNurse(scope.row.id)"
            >解 绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 绑定护工 -->
    <el-dialog
      :visible.sync="isBindNurse"
      title="绑定护工"
      center
      width="470px"
      append-to-body
      :before-close="handleCloseBind"
    >
      <el-input
        v-model="bindNurseId"
        @submit.native.prevent
        style="width: 350px"
        size="small"
        clearable
        placeholder="请输入需要关联的护工ID"
      ></el-input>
      <el-button type="primary" size="small" @click="bindConfirm">
        绑 定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import nurseInfo from "./nurseInfo";
import { getNursesTable, relieveSecondNurse, BindNurse } from "@/api/getData";
const defaultListQuery = {
  page: 1,
  pageSize: 10000,
  realName: "",
  phone: "",
  identId: "",
  parentId: "",
};
export default {
  name: "nursesList", // 服务商的护工表
  props: {
    parent: {
      type: Object,
    },
  },
  data() {
    return {
      tableData: [],
      allData: [],
      listQuery: Object.assign({}, defaultListQuery),
      isBindNurse: false,
      refreshLoading: false,
      count: 0,
      bindNurseId: "",
    };
  },
  components: {
    nurseInfo,
  },
  mounted() {
    this.initData();
  },
  methods: {
    // refresh() {
    //   this.refreshLoading = true;
    //   setTimeout(() => {
    //     this.currentPage = 1;
    //     this.totalPage = 0;
    //     this.allData = [];
    //     this.refreshLoading = false;
    //     this.initData();
    //   }, 1000);
    // },
    initData() {
      this.getNurseList();
    },
    async getNurseList() {
      this.listQuery.parentId = this.parent.id;
      let parms = this.objReSet(this.listQuery);
      const res = await getNursesTable(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data;
        this.count = res.data.length;
      } else {
        this.tableData = [];
        this.count = 0;
      }
    },

    //关联护工
    bindNurse() {
      this.isBindNurse = true;
    },
    async bindConfirm() {
      console.log(this.bindNurseId);
      if (this.bindNurseId) {
        const res = await BindNurse(this.bindNurseId, this.parent.id);
        console.log(res);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "关联成功！",
            center: true,
          });
          this.refreshLoading = true;
          setTimeout(() => {
            this.tableData = [];
            this.refreshLoading = false;
            this.initData();
          }, 1000);
          this.isBindNurse = false;
          this.bindNurseId = "";
        } else {
          this.$message({
            type: "warning",
            message: res.message,
            center: true,
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入需要绑定的护工id",
          center: true,
        });
      }
    },

    //关闭绑定
    handleCloseBind() {
      this.isBindNurse = false;
      this.bindNurseId = "";
    },

    //移除护工
    relieveNurse(nurseId) {
      this.$confirm("此操作将永久移除该护工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          const res = await relieveSecondNurse(nurseId, this.parent.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "解绑成功！",
              center: true,
            });
            this.refreshLoading = true;
            setTimeout(() => {
              this.tableData = [];
              this.refreshLoading = false;
              this.initData();
            }, 1000);
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消操作！",
            center: true,
          });
        });
    },
  },
};
</script>

<style scoped="" type="text/css"></style>
