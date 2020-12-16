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
            <el-form-item label="优惠券名称：">
              <el-input
                v-model="listQuery.title"
                class="input-width"
                clearable
                placeholder="优惠券名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="优惠券状态">
              <el-select
                v-model="listQuery.status"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优惠券类型">
              <el-select v-model="listQuery.type" placeholder="全部" clearable>
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
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
        <el-button
          v-has="{ name: '优惠券', type: '2' }"
          type="primary"
          size="mini"
          plain
          @click="handle_add_btn"
        >
          领取优惠券
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            {{ scope.row.userName | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="护工" align="center">
          <template slot-scope="scope">
            {{ scope.row.nurseName | formateProp }}
          </template>
        </el-table-column>
        <el-table-column
          label="名 称"
          prop="title"
          align="center"
        ></el-table-column>
        <el-table-column label="金额/折扣" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 0" size="mini">
              {{ "￥" + scope.row.favorNum }}
            </el-tag>
            <el-tag v-if="scope.row.type == 1" size="mini" type="success">
              {{ scope.row.favorNum + "折" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="兑换码" align="center">
          <template slot-scope="scope">
            {{ scope.row.exchangeCode | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="优惠券类型" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 0" size="mini">现金券</el-tag>
            <el-tag v-if="scope.row.type == 1" size="mini" type="success"
              >折扣券</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="生效时间"
          prop="expireStartTime"
          align="center"
        ></el-table-column>
        <el-table-column
          label="过期时间"
          prop="expireEndTime"
          align="center"
        ></el-table-column>
        <el-table-column label="优惠券状态" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" type="warning">
              {{ scope.row.status | formateStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="领取时间"
          prop="createTime"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="操 作" align="center" min-width="100">
          <template slot-scope="scope" align="center">
            <el-button
              size="mini"
              v-has="{ name: '优惠券', type: '2' }"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '优惠券', type: '4' }"
              @click="handle_delete_btn(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          v-if="isPagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>

      <el-dialog
        :visible.sync="dialogFormVisible"
        title="领取优惠券"
        center
        width="400px"
        :before-close="handleCloseAdd"
        :close-on-click-modal="false"
      >
        <el-form
          label-position="top"
          label-width="80px"
          :model="coupons"
          ref="coupons"
          @submit.native.prevent
          size="mini"
        >
          <el-form-item
            prop="userId"
            label="用户ID"
            :rules="[
              { required: true, message: '请填写用户ID', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="coupons.userId"
              auto-complete="off"
              clearable
              placeholder="请填写用户ID"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="优惠券模板"
            :rules="[
              { required: true, message: '请填写用户ID', trigger: 'blur' },
            ]"
          > -->
          <el-form-item label="优惠券模板：">
            <el-tag size="mini" type="success"> 5折券 </el-tag>
            <!-- <el-select
              v-model="coupons.template"
              placeholder="请选择优惠券模板"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in cashModel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="护工ID">
            <el-input
              v-model="coupons.nurseId"
              auto-complete="off"
              placeholder="请填写护工ID"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="width: 100%; text-align: center">
          <el-button size="mini" @click="closeDialog('coupons')">
            关 闭
          </el-button>
          <el-button size="mini" type="primary" @click="addCoupons('coupons')">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getCouponList,
  getCouponModel,
  addCouCash,
  deleteCouCash,
  editCash,
} from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  title: "",
  type: "",
  status: "",
};
const defaultCoupon = {
  userId: "",
  nurseId: "",
};
export default {
  name: "xianjinquan",
  data() {
    return {
      tableData: [],
      listQuery: Object.assign({}, defaultListQuery),
      dialogFormVisible: false,
      isPagination: true,
      dialogEditForm: false,
      refreshLoading: false,
      coupons: Object.assign({}, defaultCoupon),
      distributionTypeList: [],
      selectedArray: [],
      cashModel: [],
      value: "",
      offset: 0,
      limit: 100,
      count: 0,
      statusList: [
        { label: "未激活", value: 0 },
        { label: "已激活", value: 1 },
        { label: "未使用", value: 2 },
        { label: "已使用", value: 3 },
        { label: "已过期", value: 4 },
      ],
      typeList: [
        { label: "现金券", value: 0 },
        { label: "折扣券", value: 1 },
      ],
    };
  },
  created() {
    this.initData();
  },
  filters: {
    formateStatus(value) {
      if (value == 0) return "未激活";
      else if (value == 1) return "已激活";
      else if (value == 2) return "未使用";
      else if (value == 3) return "已使用";
      else if (value == 4) return "已过期";
      else return "其他";
    },
  },
  methods: {
    //刷新
    refresh() {
      this.refreshLoading = true;
      this.isPagination = true;
      setTimeout(() => {
        this.tableData = [];
        this.refreshLoading = false;
        this.initData();
      }, 1000);
    },
    async initData() {
      let parms = this.objReSet(this.listQuery);
      const res = await getCouponList(parms);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.count = res.data.total;
      } else {
        throw new Error("获取数据失败");
      }
    },
    async handle_add_btn() {
      this.dialogFormVisible = true;
      const res = await getCouponModel({
        pageNum: 1,
        pageSize: 10000,
      });
      console.log(res);
      let modelList = res.data.records;
      modelList.forEach((item) => {
        item.label = item.title;
        item.value = item.id;
      });
      this.cashModel = modelList;
    },

    //添加优惠券
    addCoupons(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var addData = this.objReSet(this.coupons);
          const res = await addCouCash(addData);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "新增优惠券成功！",
              center: true,
            });
            // 刷新数据
            this.dialogFormVisible = false;
            this.coupons = Object.assign({}, defaultCoupon);
            this.refresh();
          } else {
            throw new Error(res.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 对话框取消事件
    closeDialog(formName) {
      // 点击取消 数据与验证重置
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      this.coupons = Object.assign({}, defaultCoupon);
    },
    handleCloseAdd() {
      this.closeDialog("coupons");
    },

    //搜索
    async handleSearchList() {
      console.log(this.listQuery);
      // 根据优惠券名称查询
      if (
        this.listQuery.title ||
        this.listQuery.type + "" ||
        this.listQuery.status + ""
      ) {
        this.isPagination = false;
        this.listQuery.pageNum = 1;
        let parms = this.objReSet(this.listQuery);
        const res = await getCouponList(parms);
        console.log(res);
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = res.data.records;
          this.count = res.data.total;
          this.refreshLoading = false;
        }, 1000);
      } else {
        this.$message({
          type: "warning",
          center: true,
          message: "请输入查询条件",
        });
      }
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.initData();
    },

    // 编辑
    handleEdit(index, row) {
      this.coupons = row;
      this.dialogEditForm = true;
    },
    // 删除
    async handle_delete_btn(index, row) {
      this.$confirm("确认删除吗？", "提示", {
        type: "waring",
        center: true,
      })
        .then(async () => {
          const res = await deleteCouCash(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功！",
              center: true,
            });
            // 更新数据
            this.tableData.splice(index);
            this.refresh();
          } else {
            throw new Error(res.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作！",
            center: true,
          });
        });
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
</style>
