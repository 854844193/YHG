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
                v-model="listQuery.name"
                class="input-width"
                clearable
                placeholder="姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话：">
              <el-input
                v-model="listQuery.phone"
                class="input-width"
                clearable
                maxlength="11"
                placeholder="电话号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input
                v-model="listQuery.cardId"
                class="input-width"
                clearable
                maxlength="18"
                placeholder="身份证号"
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
            v-has="{ name: '退款授权', type: '1' }"
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
          type="primary"
          size="mini"
          plain
          v-has="{ name: '退款授权', type: '4' }"
          @click="handleAdd()"
          >添加收款人</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="reFreshLoading"
        align="center"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        ref="warrantTable"
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
        <el-table-column label="姓名" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="phone" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号码" prop="cardId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cardId || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.note || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-has="{ name: '退款授权', type: '2' }"
              type="primary"
              @click.stop="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              v-has="{ name: '退款授权', type: '4' }"
              type="warning"
              @click.stop="handlePwd(scope.row)"
              >授权码设置</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '退款授权', type: '4' }"
              @click.stop="handleDelete(scope.row)"
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
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加、编辑信息 -->
    <el-dialog
      :title="isMed == 'add' ? '添加授权信息' : '编辑授权信息'"
      center
      width="460px"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      :before-close="closeDialog"
    >
      <el-form
        :model="person"
        size="mini"
        ref="ruleForm"
        label-width="96px"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="person.name"
            autocomplete="off"
            clearable
            placeholder="请输入授权人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            v-model="person.phone"
            autocomplete="off"
            clearable
            placeholder="请输入授权人电话号码"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="cardId">
          <el-input
            v-model="person.cardId"
            autocomplete="off"
            clearable
            placeholder="请输入授权人身份证号码"
            maxlength="18"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            v-model="person.note"
            autocomplete="off"
            clearable
            placeholder="请输入授权人备注信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="授权码" prop="code" v-if="isMed == 'add'">
          <el-input
            v-model="person.code"
            autocomplete="off"
            type="password"
            :show-password="isPwd"
            clearable
            placeholder="请输入至少6位的授权码（必须是英文和数字混合）"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
        <el-button
          v-if="isMed == 'add'"
          size="mini"
          type="primary"
          @click="submitForm('ruleForm')"
          >确定</el-button
        >
        <el-button
          v-if="isMed == 'edit'"
          size="mini"
          type="primary"
          @click="editForm('ruleForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 授权码修改 -->
    <el-dialog
      :visible.sync="pwdDialog"
      width="460px"
      :close-on-click-modal="false"
      title="授权码设置"
      center
      :before-close="closePwd"
    >
      <el-form
        :model="pwdForm"
        status-icon
        size="mini"
        :rules="pwdRules"
        ref="ruleForm"
        label-width="96px"
      >
        <el-form-item label="新授权码" prop="newPwd">
          <el-input
            type="password"
            v-model="pwdForm.newPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认授权码" prop="checkPwd">
          <el-input
            type="password"
            v-model="pwdForm.checkPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="danger" @click="resetPwd('ruleForm')"
          >重置</el-button
        >
        <el-button size="mini" type="primary" @click="setPwd('ruleForm')"
          >修改</el-button
        >
      </div>
    </el-dialog>

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
import headTop from "components/headTop";
import check from "global/check";
import excel from "global/excel";
import {
  insertEmpower,
  selectEmpower,
  editEmpower,
  deleteEmpower,
} from "@/api/getData";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: "",
  cardId: "",
  phone: "",
};
export default {
  components: {
    headTop,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      selectedList: [],
      selectID: [],
      person: {
        name: "",
        phone: "",
        cardId: "",
        code: "",
        note: "",
      },
      pwdForm: {
        newPwd: "",
        checkPwd: "",
      },
      pwdRules: {
        newPwd: [
          { required: true, message: "请输入授权码", trigger: "blur" },
          { min: 6, message: "密码为6~16位", trigger: ["blur", "change"] },
          {
            pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,16}$/,
            //可以写正则表达式呦呦呦,
            message: "授权码必须是同时包含大小写英文和数字且长度为6~16位",
            trigger: "blur",
          },
        ],
        checkPwd: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
      },
      pid: "",
      rules: {
        name: [
          { required: true, message: "请输入授权人姓名", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请输入授权人的电话号码",
            trigger: "blur",
          },
          {
            pattern: /^1[345789]\d{9}$/, //可以写正则表达式呦呦呦,
            message: "电话号码输入有误",
            trigger: "blur",
          },
        ],
        cardId: [
          {
            required: true,
            message: "请输入授权人的身份证号码",
            trigger: "blur",
          },
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "身份证号码输入有误",
            trigger: "blur",
          },
        ],
        note: [
          {
            required: true,
            message: "请输入授权人的备注信息",
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "请输入授权码", trigger: "blur" },
          { min: 6, message: "密码为6~16位", trigger: ["blur", "change"] },
          {
            pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,16}$/,
            //可以写正则表达式呦呦呦,
            message: "授权码必须是同时包含大小写英文和数字且长度为6~16位",
            trigger: "blur",
          },
        ],
      },
      offset: 0,
      limit: 20,
      count: 0,
      reFreshLoading: false,
      dialogFormVisible: false,
      dialogVisible: false,
      pwdDialog: false,
      isPwd: false,
      isMed: "add",
      columnList: {
        name: "姓名",
        phone: "电话",
        cardId: "身份证号码",
        note: "备注",
        createTime: "创建时间",
      },
    };
  },
  mounted() {
    this.initData(this.listQuery.pageNum);
  },
  methods: {
    // 刷新
    refresh() {
      this.reFreshLoading = true;
      this.listQuery.pageNum = 1;
      setTimeout(() => {
        this.tableData = [];
        this.count = 0;
        this.reFreshLoading = false;
        this.initData();
      }, 1000);
    },
    async initData(cpage) {
      this.listQuery.pageNum = cpage;
      this.getEmpower();
    },

    async getEmpower() {
      let parms = this.objReSet(this.listQuery);
      const res = await selectEmpower(parms);
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      }
    },

    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    async handleSearchList() {
      if (
        this.listQuery.name ||
        this.listQuery.phone ||
        this.listQuery.cardId
      ) {
        if (this.listQuery.phone) {
          var checkPhone = check.phone(this.listQuery.phone);
          if (!checkPhone) return false;
        }
        if (this.listQuery.cardId) {
          var checkIdent = check.ident(this.listQuery.cardId);
          if (!checkIdent) return false;
        }
        this.reFreshLoading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
          this.getEmpower();
          this.reFreshLoading = false;
        }, 1500);
      } else {
        this.$message({
          type: "warning",
          message: "请输入查询条件",
          center: true,
        });
      }
    },

    //添加授权收款人
    handleAdd() {
      this.dialogFormVisible = true;
      this.isMed = "add";
      this.isPwd = true;
      this.person = {
        name: "",
        phone: "",
        cardId: "",
        code: "",
        note: "",
      };
    },
    handlePwd(person) {
      this.pid = person.id;
      this.pwdDialog = true;
    },
    handleEdit(person) {
      this.dialogFormVisible = true;
      this.isMed = "edit";
      // this.isPwd = false;
      this.person.id = person.id;
      this.person.name = person.name;
      this.person.phone = person.phone;
      this.person.cardId = person.cardId;
      this.person.code = person.code;
      this.person.note = person.note;
    },
    handleDelete(person) {
      this.$confirm(
        `是否删除<b style="color:blue">"${person.name}"</b>的授权信息？`,
        "温馨提示",
        {
          distinguishCancelAndClose: true,
          dangerouslyUseHTMLString: true,
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(async () => {
          const res = await deleteEmpower({ id: person.id });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功！",
              center: true,
            });
            this.refresh();
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
            message: "取消操作！",
            center: true,
          });
        });
    },

    // 添加
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = this.person;
          const res = await insertEmpower(params);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: res.message,
              center: true,
            });
            this.dialogFormVisible = false;
            this.refresh();
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
        } else {
          return false;
        }
      });
    },
    // 编辑
    editForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否提交当前编辑的信息？", "温馨提示", {
            distinguishCancelAndClose: true,
            confirmButtonText: "提交",
            cancelButtonText: "保留",
            type: "warning",
            center: true,
          })
            .then(async () => {
              let params = this.person;
              const res = await editEmpower(params);
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: res.message,
                  center: true,
                });
                this.dialogFormVisible = false;
                this.refresh();
              } else {
                this.$message({
                  type: "error",
                  message: res.message,
                  center: true,
                });
              }
            })
            .catch(() => {
              this.dialogFormVisible = false;
            });
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      let id = this.person.id;
      this.person = {
        name: "",
        phone: "",
        cardId: "",
        code: "",
        note: "",
      };
      this.person.id = id;
    },
    // 关闭添加编辑对话框
    closeDialog() {
      this.dialogFormVisible = false;
      this.resetForm("ruleForm");
    },

    // 修改授权码
    setPwd(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.pid, this.pwdForm.newPwd);
          const res = await editEmpower({
            id: this.pid,
            code: this.pwdForm.newPwd,
          });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功！",
              center: true,
            });
            this.pwdDialog = false;
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
            message: "请正确填写授权码",
            center: true,
          });
          return false;
        }
      });
    },
    // 重置授权码
    resetPwd(formName) {
      this.$refs[formName].resetFields();
      this.pid = "";
      this.pwdForm = {};
    },
    // 关闭授权码
    closePwd() {
      this.pwdDialog = false;
      this.resetPwd("ruleForm");
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
        fileName: "退款授权信息",
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
          name: this.listQuery.name,
          phone: this.listQuery.phone,
          cardId: this.listQuery.cardId,
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
      this.initData(this.listQuery.pageNum);
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
      let refsElTable = this.$refs.warrantTable; // 获取表格对象
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
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>