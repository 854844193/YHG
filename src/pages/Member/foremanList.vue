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
                placeholder="服务商姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="昵称：">
              <el-input
                v-model="listQuery.nickname"
                class="input-width"
                clearable
                placeholder="服务商昵称"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input
                v-model="listQuery.phone"
                class="input-width"
                clearable
                maxlength="11"
                placeholder="服务商电话号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="账号：">
              <el-input
                v-model="listQuery.username"
                class="input-width"
                clearable
                placeholder="服务商账号"
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
        <el-button
          v-has="{ name: '服务商列表', type: '2' }"
          type="primary"
          size="mini"
          plain
          @click="addForeman"
        >
          添加服务商
        </el-button>
      </div>
      <el-table
        :data="tableData"
        class="mainTable"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand" width="20" align="center">
          <template slot-scope="scope">
            <foremanInfo :row="scope.row" @callBack="editForeman"></foremanInfo>
          </template>
        </el-table-column>
        <el-table-column label="账 号" align="center">
          <template slot-scope="scope">
            {{ scope.row.username | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="姓 名" align="center">
          <template slot-scope="scope">
            {{ scope.row.realName | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="昵 称" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname | formateProp }}
          </template>
        </el-table-column>
        <el-table-column label="电 话" align="center">
          <template slot-scope="scope">
            {{ scope.row.phone | formateProp }}
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
              v-has="{ name: '服务商列表', type: '4' }"
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
            <el-row class="tableBtn">
              <el-button
                type="primary"
                size="mini"
                v-has="{ name: '服务商列表', type: '4' }"
                @click="setRole(scope.row)"
              >
                设置角色
              </el-button>
              <el-button
                type="danger"
                size="mini"
                v-has="{ name: '服务商列表', type: '4' }"
                @click="pwdSetting(scope.row)"
              >
                提现密码
              </el-button>
              <el-button
                v-has="{ name: '服务商列表', type: '1' }"
                size="mini"
                type="success"
                @click="orderTable(scope.row)"
              >
                已支付订单
              </el-button>
            </el-row>
            <el-row class="tableBtn">
              <el-button
                v-has="{ name: '服务商列表', type: '1' }"
                size="mini"
                type="primary"
                @click="nursesTable(scope.row)"
              >
                旗下护工
              </el-button>
              <el-button
                v-has="{ name: '服务商列表', type: '4' }"
                size="mini"
                type="warning"
                @click="bindAccount(scope.row.id)"
              >
                分账规则
              </el-button>
              <el-button
                v-has="{ name: '服务商列表', type: '4' }"
                size="mini"
                type="primary"
                @click="bindCollection(scope.row.id)"
              >
                绑收款人
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          v-if="isPagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="listQuery.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <!-- 服务商下的护工列表 -->
    <el-dialog
      top="5vh"
      width="90%"
      center
      :visible="showNursesList"
      :before-close="handleCloseNurse"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <span style="color: #409eff">
          {{ parent.realName }}
        </span>
        的护工
      </template>
      <nursesList :key="nureseListId" :parent="parent"></nursesList>
    </el-dialog>

    <!-- 服务商下护工的已支付订单 -->
    <el-dialog
      width="90%"
      top="6vh"
      title="服务商下所有护工的已支付订单"
      center
      :close-on-click-modal="false"
      :visible="showOrderList"
      :before-close="handleCloseOrder"
    >
      <PayOrder :key="payId" :foreman="foreman" :normal="false"></PayOrder>
    </el-dialog>

    <!-- 设置提现密码 -->
    <el-dialog
      :visible.sync="isPwd"
      width="480px"
      :close-on-click-modal="false"
      title="密码设置"
      center
      :before-close="closePwd"
    >
      <el-form
        :model="payParms"
        status-icon
        size="mini"
        :rules="pwdRules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item>
          <p style="color: #f56c6c" v-if="!payParms.userId">
            该服务商还未设置提现密码！
          </p>
        </el-form-item>
        <el-form-item label="密码" prop="payPassword">
          <el-input
            type="password"
            v-model="payParms.payPassword"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="payParms.checkPass"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!payParms.userId"
          type="primary"
          size="mini"
          @click="setPwd('add')"
        >
          设置
        </el-button>
        <el-button
          v-if="payParms.userId"
          type="primary"
          size="mini"
          @click="setPwd('edit')"
        >
          编辑
        </el-button>
        <el-button type="danger" size="mini" @click="resetPwd('ruleForm')">
          重置
        </el-button>
      </div>
    </el-dialog>

    <!-- 绑定分账规则 -->
    <el-dialog
      :visible.sync="isBindRule"
      title="绑定分账场景"
      center
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleCloseRule"
    >
      <div style="width: 450px; margin: auto">
        <el-select
          size="small"
          style="width: 350px"
          v-model="ruleName"
          filterable
          placeholder="请选择分账场景"
          @change="selectChanged"
        >
          <el-option
            v-for="(item, index) in tabList"
            :key="item + index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="bindConfirm('rule')">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 绑定收款 -->
    <el-dialog
      :visible.sync="isCollection"
      title="绑定收款人"
      center
      width="500px"
      :close-on-click-modal="false"
      :before-close="CloseCollection"
    >
      <div style="width: 450px; margin: auto">
        <el-input
          v-model="collectedId"
          style="width: 350px"
          size="small"
          clearable
          @submit.native.prevent
          placeholder="请输入需要绑定的收款人id"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          @click="bindConfirm('collection')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 设置角色 -->
    <el-dialog
      :visible.sync="isSetRole"
      title="设定角色"
      center
      width="500px"
      height="200px"
      :close-on-click-modal="false"
      :before-close="handleCloseRole"
    >
      <!-- <el-input v-model="bindNurseId" placeholder="请输入需要关联的护工ID"></el-input> -->
      <div style="width: 420px; margin: auto">
        <el-row style="width: 100%; margin-bottom: 10px">
          <b v-if="hasRole.length > 0"
            >当前绑定的角色：
            <el-tag
              style="margin: 0 3px"
              size="small"
              v-for="item in hasRole"
              :key="item.id"
              closable
              @close="handleDelete(item)"
              :type="
                item.name == '商务'
                  ? 'primary'
                  : item.name == '文员'
                  ? 'success'
                  : 'warning'
              "
              >{{ item.name }}</el-tag
            >
          </b>
        </el-row>
        <el-select
          size="small"
          style="width: 350px"
          v-model="roleName"
          filterable
          placeholder="请选择需要设定的角色"
          @change="selectRole"
        >
          <el-option
            v-for="(item, index) in roleList"
            :key="item + index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="bindConfirm('role')">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 添加服务商 -->
    <el-dialog
      :visible.sync="showAddDialog"
      title="添加服务商"
      center
      width="500px"
      height="360px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="80px"
        :model="newForeman"
        :rules="rules"
        size="mini"
        ref="newForeman"
        @submit.native.prevent
      >
        <el-form-item label="账 号:" label-width="90px" prop="username">
          <el-input
            v-model="newForeman.username"
            auto-complete="off"
            placeholder="请输入服务商账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密 码:" label-width="90px" prop="password">
          <el-input
            v-model="newForeman.password"
            auto-complete="off"
            placeholder="请输入密码"
            show-password
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="90px" prop="realName" label="姓 名:">
          <el-input
            v-model="newForeman.realName"
            placeholder="请输入服务商姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" label-width="90px" prop="phone">
          <el-input
            v-model="newForeman.phone"
            placeholder="请输入服务商手机号码"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号码:" label-width="100px" prop="identId">
          <el-input
            v-model="newForeman.identId"
            placeholder="请输入服务商身份证号码"
            maxlength="18"
            @input="getBirthday(newForeman.identId)"
          ></el-input>
        </el-form-item>
        <el-form-item label="生 日:" label-width="90px" prop="birthday">
          <el-date-picker
            v-model="newForeman.birthday"
            type="date"
            placeholder="选择生日"
            style="width=100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性 别:" label-width="90px">
          <template>
            <el-radio v-model="sex" label="1" disabled>男</el-radio>
            <el-radio v-model="sex" label="2" disabled>女</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="handleCloseAdd('newForeman')"
          type="danger"
          size="mini"
        >
          关 闭
        </el-button>
        <el-button
          v-has="{ name: '服务商列表', type: '1' }"
          type="primary"
          size="mini"
          @click="addComfirm('newForeman')"
        >
          添 加
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import foremanInfo from "./components/foremanInfo";
import nursesList from "./components/nursesList";
import PayOrder from "components/payOrder";
import excel from "global/excel";
import check from "global/check";
import {
  getUserList,
  deletedByUser,
  relieveSecondNurse,
  addNurse,
  BindNurse,
  getRuleList,
  getSplitAccounts,
  bindRule,
  addPwd,
  editPwd,
  readPwd,
  getRoleList,
  bindRole,
  findRole,
  deleteRole,
  setCollection,
} from "@/api/getData";
const defaultListQuery = {
  type: 3,
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
  name: "foremanList", // 服务商列表
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.payParms.payPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      nureseListId: +new Date(),
      dialogVisible: false,
      cTime: "",
      nurseIdentId: "",
      payId: +new Date(),
      foremanOrderList: [],
      selectedList: [],
      selectID: [],
      ruleList: [],
      tabList: [],
      payedOrdercount: 0,
      userName: "",
      userPhone: "",
      sex: "0",
      count: 0,
      nurseList: [],
      foremanList: [],
      orderProps: [],
      roleList: [],
      hasRole: "",
      roleId: "",
      parentId: "",
      parent: "",
      foreman: {},
      newForeman: {
        username: "",
        password: "",
        realName: "",
        sex: "",
        phone: "",
        identId: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入服务商账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码为6~18位", trigger: ["blur", "change"] },
        ],
        realName: [
          { required: true, message: "请输入服务商姓名", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请输入11位的电话号码",
            trigger: "blur",
          },
          {
            pattern: /^1[345789]\d{9}$/, //可以写正则表达式呦呦呦,
            message: "输入的号码格式不对",
            trigger: "blur",
          },
        ],
        identId: [
          { required: true, message: "请输入护工身份证ID", trigger: "blur" },
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
            trigger: "blur",
          },
        ],
      },
      timeValue: "",
      showNursesList: false,
      isPagination: "main",
      showOrderList: false,
      refreshLoading: false,
      reOrderLoading: false,
      showAddDialog: false,
      isPwd: false,
      isBindRule: false,
      isSetRole: false,
      isCollection: false,
      bindNurseId: "",
      ruleName: "",
      roleName: "",
      collectedId: "",
      ruleId: "",
      payParms: { payPassword: "", checkPass: "", userId: "", payPhone: "" },
      pwdRules: {
        payPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // { min: 6, message: "密码为6~18位", trigger: ["blur", "change"] },
        ],
        checkPass: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        payPhone: [
          {
            required: true,
            message: "请输入11位的电话号码",
            trigger: "blur",
          },
          {
            pattern: /^1[345789]\d{9}$/, //可以写正则表达式呦呦呦,
            message: "输入的号码格式不对",
            trigger: "blur",
          },
        ],
      },
      columnList: {
        orderNo: "订单号",
        FrealName: "服务商姓名",
        FidentId: "服务商身份证",
        Fphone: "服务商电话",
        realName: "护工姓名",
        identId: "护工身份证",
        phone: "护工电话",
        beRealName: "患者姓名",
        beIdentId: "患者身份证",
        bePhone: "患者电话",
        amount: "支付金额",
        preferPrice: "每日单价",
        notes: "详情",
        addTime: "支付时间",
        startTime: "服务开始时间",
        endTime: "服务结束时间",
        orderCreateTime: "订单创建时间",
        remark: "备注",
      },
    };
  },
  components: {
    foremanInfo,
    nursesList,
    PayOrder,
  },
  created() {
    this.initData(1);
  },
  methods: {
    async initData(cpage) {
      this.listQuery.page = cpage;
      this.getForemanData();
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
    //查询服务商信息
    async getForemanData() {
      this.listQuery.startCreateTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[0];
      this.listQuery.endCreateTime =
        this.cTime == null ? "" : this.cTime == "" ? "" : this.cTime[1];
      let parms = this.listQuery;
      const res = await getUserList(parms);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      } else {
        throw new Error("获取数据失败");
      }
    },
    //搜索服务商
    handleSearchList() {
      if (
        this.listQuery.phone ||
        this.listQuery.realName ||
        this.listQuery.nickname ||
        this.listQuery.username ||
        this.cTime.length
      ) {
        if (this.listQuery.phone) {
          var checkPhone = check.phone(this.listQuery.phone);
          if (!checkPhone) return false;
        }
        this.refreshLoading = true;
        setTimeout(() => {
          this.listQuery.page = 1;
          this.getForemanData();
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

    // 查看护工
    nursesTable(row) {
      this.showNursesList = true;
      this.parent = row;
      this.nureseListId = +new Date();
    },

    //确定操作
    async bindConfirm(med) {
      if (med == "rule") {
        let userId = JSON.parse(localStorage.getItem("uid"));
        console.log(this.ruleId, userId);
        if (this.ruleId) {
          const res = await bindRule({ id: userId, ruleId: this.ruleId });
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: res.data,
              center: true,
            });
            this.ruleName = "";
            this.isBindRule = false;
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请选择需要绑定的分账规则",
            center: true,
          });
        }
      }
      if (med == "role") {
        let userId = JSON.parse(localStorage.getItem("pid"));
        let roleArr = [];
        if (this.roleId) {
          roleArr.push(this.roleId);
          console.log(roleArr, userId);
          const res = await bindRole({ userId: userId, roleId: roleArr });
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: res.data,
              center: true,
            });
            this.roleName = "";
            this.isSetRole = false;
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请选择需要设置的角色",
            center: true,
          });
        }
      }
      if (med == "collection") {
        let foremanId = JSON.parse(localStorage.getItem("foremanId"));
        console.log(foremanId, this.collectedId);
        if (this.collectedId) {
          const res = await setCollection({
            id: foremanId,
            refundId: this.collectedId,
          });
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "绑定成功！",
              center: true,
            });
            this.isCollection = false;
            this.collectedId = "";
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请输入收款人的id",
            center: true,
          });
        }
      }
    },

    // 已支付订单
    orderTable(row) {
      this.foreman = row;
      this.payId = +new Date();
      this.showOrderList = true;
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      this.initData(this.listQuery.page);
    },

    // 关闭其他信息
    CloseInfo(formName) {
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },

    //根据身份证获取出生日期和性别
    getBirthday(idCard) {
      if (idCard != null && idCard != "") {
        this.newForeman.birthday = this.GetInfoByCard.getBirth(idCard);
        this.newForeman.sex = this.GetInfoByCard.getGender(idCard);
      } else {
        this.sex = "0";
      }
    },

    //添加服务商
    addForeman() {
      this.showAddDialog = true;
    },
    addComfirm(newForeman) {
      console.log(this.newForeman);
      this.$refs[newForeman].validate(async (valid) => {
        if (valid) {
          this.newForeman.type = 3;
          this.newForeman.realName = this.newForeman.realName.replace(
            /\s*/g,
            ""
          );
          console.log(this.newForeman);
          this.foremanList = [];
          this.foremanList.push(this.newForeman);
          const res = await addNurse(this.foremanList);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: res.data,
              center: true,
            });
            this.sex = "0";
            this.newForeman = {};
            this.showAddDialog = false;
            this.refresh();
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //关闭添加dialog
    handleCloseAdd(formName) {
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.newForeman = {};
      this.showAddDialog = false;
    },

    // 注销和启用用户
    async changeStatus(user) {
      let flag = user.deleted;
      user.deleted == 0 ? (user.deleted = 1) : (user.deleted = 0);
      let title =
        user.deleted == 0 ? "确定注销当前服务商？" : "确定重新启用当前服务商？";
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

    editForeman(code) {
      if (code == 200) {
        this.refresh();
      }
    },

    //密码设置
    async pwdSetting(p) {
      let foreman = p;
      this.isPwd = true;
      this.fid = foreman.id;
      const res = await readPwd({ id: this.fid });
      console.log(res);
      if (res.code == 200) {
        this.payParms.payPassword = res.data.payPassword;
        this.payParms.userId = res.data.userId;
        this.payParms.checkPass = res.data.payPassword;
      }
    },
    setPwd(med) {
      if (med == "add") {
        this.$confirm("确定要设置提现密码？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
          .then(async () => {
            if (this.payParms.payPassword && this.payParms.checkPass) {
              this.payParms.userId = this.fid;
              let parms = this.payParms;
              delete parms.checkPass;
              const res = await addPwd(parms);
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: res.message,
                  center: true,
                });
                this.isPwd = false;
                this.payParms = {
                  payPassword: "",
                  checkPass: "",
                  userId: "",
                  payPhone: "",
                };
              } else {
                this.$message({
                  type: "warning",
                  message: res.message,
                  center: true,
                });
              }
            } else {
              this.$message({
                type: "warning",
                message: "请输入提现密码",
                center: true,
              });
            }
          })
          .catch(() => {});
      }
      if (med == "edit") {
        this.$confirm("确定编辑提现密码？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
          .then(async () => {
            let parms = this.payParms;
            delete parms.checkPass;
            parms.id = parms.userId;
            const res = await editPwd(parms);
            console.log(res);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: res.message,
                center: true,
              });
              this.isPwd = false;
              this.payParms = {
                payPassword: "",
                checkPass: "",
                userId: "",
                payPhone: "",
              };
            } else {
              this.$message({
                type: "warning",
                message: res.message,
                center: true,
              });
            }
          })
          .catch(() => {});
      }
    },
    resetPwd(formName) {
      this.$refs[formName].resetFields();
    },
    closePwd() {
      this.resetPwd("ruleForm");
      this.isPwd = false;
      this.fid = "";
      this.payParms = {
        payPassword: "",
        checkPass: "",
        userId: "",
        payPhone: "",
      };
    },

    // 绑定分账规则
    bindAccount(foremanId) {
      localStorage.setItem("uid", JSON.stringify(foremanId));
      this.isBindRule = true;
      this.getNameList();
    },
    // 获取规则列表
    async getNameList() {
      const res1 = await getRuleList({
        pageNum: 1,
        pageSize: 10000,
      });
      if (res1.code == 200) {
        this.tabList = res1.data.list;
      } else {
        throw new Error(res.message);
      }
    },
    // 选中分账规则id
    selectChanged(val) {
      this.ruleId = val;
    },
    handleCloseRule() {
      this.isBindRule = false;
      this.ruleName = "";
      localStorage.removeItem("uid");
    },

    bindCollection(id) {
      this.isCollection = true;
      localStorage.setItem("foremanId", JSON.stringify(id));
    },
    CloseCollection() {
      this.isCollection = false;
      this.collectedId = "";
    },

    // 设定角色
    async setRole(person) {
      console.log(person);
      localStorage.setItem("pid", JSON.stringify(person.id));
      this.isSetRole = true;
      const res = await findRole({ userId: person.id });
      console.log(res);
      this.hasRole = res;
      const res1 = await getRoleList();
      if (res1.code == 200) {
        this.roleList = res1.data;
      } else {
        throw new Error(res.message);
      }
    },
    selectRole(val) {
      this.roleId = val;
    },
    handleDelete(tag) {
      this.$confirm(`是否解除<b>"${tag.name}"</b>角色?`, "温馨提示", {
        distinguishCancelAndClose: true,
        dangerouslyUseHTMLString: true,
        confirmButtonText: "解除",
        cancelButtonText: "保留",
        type: "warning",
        center: true,
      })
        .then(async () => {
          let userId = JSON.parse(localStorage.getItem("pid"));
          console.log(tag, userId);
          const res = await deleteRole({
            roleIds: tag.id,
            userId: userId,
          });
          if (res.code == 200) {
            this.hasRole.splice(this.hasRole.indexOf(tag), 1);
            this.$message({
              type: "success",
              message: "操作成功！",
              center: true,
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已为您继续保留当前角色！",
            center: true,
          });
        });
    },
    handleCloseRole() {
      this.isSetRole = false;
      this.roleList = [];
      this.hasRole = "";
      localStorage.removeItem("pid");
    },

    // 关闭护工列表
    handleCloseNurse() {
      this.showNursesList = false;
      this.nurseList = [];
    },
    //关闭订单
    handleCloseOrder() {
      this.showOrderList = false;
      this.foremanOrderList = [];
      this.payedOrdercount = 0;
      localStorage.removeItem("parent");
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
.table_container .mainTable {
  width: 100%;
}
</style>
