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
                placeholder="用户姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="昵称：">
              <el-input
                v-model="listQuery.nickname"
                class="input-width"
                clearable
                placeholder="用户昵称"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input
                v-model="listQuery.phone"
                class="input-width"
                clearable
                maxlength="11"
                placeholder="用户电话号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="账号：">
              <el-input
                v-model="listQuery.username"
                class="input-width"
                clearable
                placeholder="用户账号"
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
        highlight-current-row
        style="width: 100%"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand" align="center" width="20">
          <template slot-scope="scope">
            <userInfo :row="scope.row" @callBack="editUser"></userInfo>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序 号"
          :index="computeTableIndex"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="用户姓名" align="center">
          <template slot-scope="scope">
            {{ scope.row.realName | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="账 号" align="center">
          <template slot-scope="scope">
            {{ scope.row.username | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="昵 称" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">
            {{ scope.row.phone | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="实名认证" align="center">
          <template slot-scope="scope">
            {{ scope.row.state | formateState }}
          </template>
        </el-table-column>
        <el-table-column label="余 额" align="center">
          <template slot-scope="scope">
            ￥<b style="color: #f50"> {{ scope.row.balance || "0.00" }} </b>元
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | formateProp }}
          </template>
        </el-table-column>
        <el-table-column
          label="注销/启用"
          align="center"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.deleted"
              v-has="{ name: '用户列表', type: '4' }"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @click.stop.native
              @change="changeStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
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
  </div>
</template>

<script>
import userInfo from "./components/userInfo";
import check from "global/check";
import excel from "global/excel";
import { getUserList, deletedByUser, uploadFile } from "@/api/getData";
import { parse } from "querystring";
const defaultListQuery = {
  type: 2,
  page: 1,
  pageSize: 10,
  realName: "",
  nickname: "",
  username: "",
  phone: "",
  startCreateTime: "",
  endCreateTime: "",
};
export default {
  name: "userList", // 用户列表
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      cTime: "",
      count: 0,
      ruleForm: "",
      Parameters: {},
      returnShow: false,
      isPagination: "main",
      refreshLoading: false,
      dialogVisible: false,
      rules: {
        phone: [
          {
            pattern: /^1[345789]\d{9}$/, //可以写正则表达式呦呦呦,
            message: "电话号码输入有误！",
            trigger: "blur",
          },
        ],
        identId: [
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "身份证号输入有误！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: { userInfo },
  created() {
    this.initData(1);
  },
  filters: {
    formateState(value) {
      if (value === 0) {
        return "未认证";
      } else if (value === 1) {
        return "已认证";
      } else {
        return "--";
      }
    },
  },
  methods: {
    //刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.cTime = "";
      this.refreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.refreshLoading = false;
        this.initData();
      }, 1000);
    },

    //初始化数据
    async initData() {
      this.getUserData();
    },

    //获取用户数据
    async getUserData() {
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

    //搜索用户
    async handleSearchList() {
      if (
        this.listQuery.realName ||
        this.listQuery.phone ||
        this.listQuery.nickname ||
        this.listQuery.username ||
        this.cTime.length
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
          this.getUserData();
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      this.getUserData(this.listQuery.page);
    },
    // 注销和启用用户
    changeStatus(user) {
      let flag = user.deleted;
      user.deleted == 0 ? (user.deleted = 1) : (user.deleted = 0);
      let title =
        user.deleted == 0 ? "确定注销当前用户？" : "确定重新启用当前用户？";
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

    editUser(code) {
      if (code == 200) {
        this.refresh();
      }
    },
    computeTableIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.pageSize + index + 1;
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
        if (item.orderType == 0 || item.orderType == 1 || item.orderType == 6) {
          item.szType = "收入";
        }
        if (item.orderType == 2 || item.orderType == 4) {
          item.szType = "支出";
        }
        if (item.status == 0) {
          item.szStatus = "未支付";
        }
        if (item.status == 1) {
          item.szStatus = "支付成功";
        }
        if (item.status == 3) {
          item.szStatus = "支付失败";
        }
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "收支明细",
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
          orderNo: this.listQuery.orderNo,
          payType: this.listQuery.payType,
          status: this.listQuery.status,
          payStartTime:
            this.addTime == null
              ? ""
              : this.addTime == ""
              ? ""
              : this.addTime[0],
          payEndTime:
            this.addTime == null
              ? ""
              : this.addTime == ""
              ? ""
              : this.addTime[1],
        };
        console.log("导出全部");
        const res = await getIncomes(params);
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
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>
