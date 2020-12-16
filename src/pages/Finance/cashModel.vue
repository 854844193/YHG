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
          v-has="{ name: '优惠券模板', type: '2' }"
          type="primary"
          size="mini"
          plain
          @click="handle_add_btn"
        >
          新增模板
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column label="名 称" prop="title" align="center">
          <template slot-scope="scope">
            {{ scope.row.title | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="优惠券类型" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 0" size="mini">现金券</el-tag>
            <el-tag v-if="scope.row.type == 1" size="mini" type="success">
              折扣券
            </el-tag>
          </template>
        </el-table-column>
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
        <!-- <el-table-column label="兑换码" align="center">
          <template slot-scope="scope">
            {{ scope.row.exchangeCode | formateProp }}
          </template>
        </el-table-column> -->
        <el-table-column label="生效时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.expireStartTime | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="过期时间" prop="expireEndTime" align="center">
          <template slot-scope="scope">
            {{ scope.row.expireEndTime | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="启用状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" size="mini">可用</el-tag>
            <el-tag v-if="scope.row.status == 1" size="mini" type="danger">
              禁用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            {{ scope.row.simpleDiscribe | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | formateProp }}
          </template></el-table-column
        >
        <el-table-column label="操 作" align="center" width="150">
          <template slot-scope="scope" align="center">
            <el-button
              size="mini"
              type="primary"
              v-has="{ name: '优惠券模板', type: '2' }"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '优惠券模板', type: '4' }"
              @click="handle_delete_btn(scope.$index, scope.row)"
              >删除</el-button
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

      <el-dialog
        :visible="dialogFormVisible"
        :title="dialogMed == 'add' ? '新增' : '编辑'"
        width="350px"
        center
        :before-close="handleCloseAdd"
        :close-on-click-modal="false"
      >
        <el-form
          :model="coupons"
          :rules="couponRules"
          ref="coupons"
          size="mini"
          label-width="98px"
          @submit.native.prevent
        >
          <el-form-item prop="title" label="名称">
            <el-input
              class="modelInput"
              v-model="coupons.title"
              auto-complete="off"
              placeholder="请填写优惠券名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="type" label="优惠券类型">
            <el-select
              class="modelInput"
              placeholder="请选择优惠券类型"
              v-model="coupons.type"
              clearable
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="coupons.type == '0'"
            label="金额"
            prop="favorNum"
            :rules="couponRules.cash"
          >
            <el-input
              class="modelInput"
              v-model="coupons.favorNum"
              auto-complete="off"
              placeholder="请输入金额"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="coupons.type == '1'"
            label="折扣"
            prop="favorNum"
            :rules="couponRules.discount"
          >
            <el-input
              class="modelInput"
              v-model="coupons.favorNum"
              auto-complete="off"
              placeholder="请输入折扣"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item prop="exchangeCode" label="兑换码">
            <el-input
              class="modelInput"
              v-model="coupons.exchangeCode"
              auto-complete="off"
              placeholder="请填写兑换码"
            ></el-input>
          </el-form-item> -->
          <el-form-item prop="expireStartTime" label="生效时间">
            <el-date-picker
              v-model="coupons.expireStartTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              align="center"
              placeholder="选择日期"
              default-time="00:00:00"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="expireEndTime" label="到期时间">
            <el-date-picker
              v-model="coupons.expireEndTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              align="center"
              placeholder="选择日期"
              default-time="23:59:59"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="status" label="优惠券状态">
            <el-select
              class="modelInput"
              v-model="coupons.status"
              placeholder="请选择优惠券状态"
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
          <el-form-item label="描述">
            <el-input
              class="modelInput"
              type="textarea"
              placeholder="请填写优惠券的描述"
              autosize
              v-model="coupons.simpleDiscribe"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="width: 100%; text-align: center">
          <el-button @click="closeDialog('coupons')" size="mini">
            关 闭
          </el-button>
          <el-button
            v-if="dialogMed == 'add'"
            type="primary"
            @click="addCoupons('coupons')"
            size="mini"
          >
            确 定
          </el-button>
          <el-button
            v-if="dialogMed == 'edit'"
            type="primary"
            @click="editCoupons('coupons')"
            size="mini"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getCouponModel,
  createModel,
  deleteModel,
  editCash,
} from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  title: "",
  type: "",
  status: "",
};
const defaultCoupons = {
  title: "",
  favorNum: "",
  expireStartTime: "",
  // exchangeCode: "",
  expireEndTime: "",
  simpleDiscribe: "",
  status: "",
  type: "",
};
export default {
  name: "cashModel",
  data() {
    return {
      tableData: [],
      listQuery: Object.assign({}, defaultListQuery),
      couponStatus: "",
      dialogMed: "add",
      dialogFormVisible: false,
      isPagination: true,
      refreshLoading: false,
      coupons: Object.assign({}, defaultCoupons),
      couponRules: {
        title: [
          { required: true, message: "请填写优惠券名称", trigger: "blur" },
        ],
        cash: [
          { required: true, message: "请填写优惠券金额", trigger: "blur" },
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "金额必须是正整数",
            trigger: "blur",
          },
        ],
        discount: [
          { required: true, message: "请填写优惠券折扣", trigger: "blur" },
          {
            // pattern: /^\d+(\.\d{1,1})?$/,
            pattern: /^([1-9]{1})(\.\d{1})?$/,
            message: "折扣只允许有一位小数,范围:1.0~9.9",
            trigger: "blur",
          },
        ],
        expireStartTime: [
          { required: true, message: "请选择优惠券有效时间", trigger: "blur" },
        ],
        expireEndTime: [
          { required: true, message: "请选择优惠券有效时间", trigger: "blur" },
        ],
        // exchangeCode: [
        //   { required: true, message: "请填写兑换码", trigger: "blur" },
        //   {
        //     required: true,
        //     pattern: /^[0-9]*$/,
        //     message: "兑换码必须是数字",
        //     trigger: "blur",
        //   },
        // ],
        status: [
          { required: true, message: "请选择优惠券状态", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择优惠券类型", trigger: "blur" },
        ],
      },
      offset: 0,
      limit: 100,
      count: 0,
      statusList: [
        { label: "可用", value: 0 },
        { label: "禁用", value: 1 },
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
      const res = await getCouponModel(parms);
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.count = res.data.total;
      } else {
        throw new Error("获取数据失败");
      }
    },

    //添加优惠券模板
    handle_add_btn() {
      // this.dialogId = +new Date();
      this.dialogMed = "add";
      this.coupons = Object.assign({}, defaultCoupons);
      this.dialogFormVisible = true;
    },
    async addCoupons(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.coupons);
          let parms = this.objReSet(this.coupons);
          const res = await createModel(parms);
          console.log(res);
          this.$message({
            type: "success",
            message: `${res.message}` + "！",
            center: true,
          });
          // 刷新数据
          this.dialogFormVisible = false;
          this.coupons = Object.assign({}, defaultCoupons);
          this.refresh();
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
    },
    handleCloseAdd() {
      this.closeDialog("coupons");
    },

    // 删除
    async handle_delete_btn(index, row) {
      this.$confirm("确认删除吗？", "提示", {
        type: "warning",
        center: true,
      })
        .then(async () => {
          const res = await deleteModel({ id: row.id });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功！",
              center: true,
            });
            // 更新数据
            this.refresh();
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

    //搜索
    async handleSearchList() {
      // 根据优惠券模板名称查询
      if (
        this.listQuery.title ||
        this.listQuery.type + "" ||
        this.listQuery.status + ""
      ) {
        this.isPagination = false;
        this.listQuery.pageNum = 1;
        let parms = this.objReSet(this.listQuery);
        const res = await getCouponModel(parms);
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
          message: "请输入查询条件！",
        });
      }
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
    },

    // 编辑
    handleEdit(index, row) {
      this.dialogMed = "edit";
      this.coupons = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    editCoupons(formName) {
      this.$confirm("是否确定修改该模板?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              console.log(this.coupons);
              let parms = this.objReSet(this.coupons);
              const res = await createModel(parms);
              console.log(res);
              this.$message({
                type: "success",
                message: "修改成功！",
                center: true,
              });
              // 刷新数据
              this.dialogFormVisible = false;
              this.coupons = Object.assign({}, defaultCoupons);
              this.refresh();
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消操作！",
            center: true,
          });
        });
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
.modelInput {
  width: 200px;
}
</style>
