<template>
  <div class="fillcontain">
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
          >刷新</el-button
        >
        <el-button
          size="mini"
          v-has="{ name: '分账', type: '2' }"
          type="primary"
          plain
          @click="addAccRule"
          >添加分账规则</el-button
        >
        <el-button
          type="primary"
          size="mini"
          plain
          v-has="{ name: '分账', type: '2' }"
          @click="exportData"
          >导出</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
        ref="serveTable"
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
        <el-table-column label="分账规则名称" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分账规则类型" prop="type" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.type == '0'">
              {{ "点对点" + "-" + (scope.row.template == 3 ? "N" : "Y") }}
            </p>
            <p v-if="scope.row.type == '1'">
              {{ "标品" + "-" + (scope.row.template == 3 ? "N" : "Y") }}
            </p>
            <p v-if="scope.row.type == '2'">
              {{ "业务线" + "-" + (scope.row.template == 3 ? "N" : "Y") }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="流量方分成(金额/百分比)"
          prop="introducer"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.introducerCompany == '0'">
              {{ scope.row.introducer }}
            </p>
            <p v-if="scope.row.introducerCompany == '1'">
              {{ scope.row.introducer + "%" }}
            </p>
            <p v-if="scope.row.introducerCompany == undefined">暂无信息</p>
          </template>
        </el-table-column>
        <el-table-column
          label="服务方分成比例(金额/百分比)"
          prop="nurse"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.nurseCompany == '0'">{{ scope.row.nurse }}</p>
            <p v-if="scope.row.nurseCompany == '1'">
              {{ scope.row.nurse + "%" }}
            </p>
            <p v-if="scope.row.nurseCompany == undefined">暂无信息</p>
          </template>
        </el-table-column>
        <el-table-column
          label="护工归属方分成比列(金额/百分比)"
          prop="foreman"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.foremanCompany == '0'">
              {{ scope.row.foreman }}
            </p>
            <p v-if="scope.row.foremanCompany == '1'">
              {{ scope.row.foreman + "%" }}
            </p>
            <p v-if="scope.row.foremanCompany == undefined">暂无信息</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime || "暂无信息" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描 述" prop="note" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click.stop="readNote(scope.row)" :rows="1"
              >描述</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="操 作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-has="{ name: '分账', type: '2' }"
              type="primary"
              @click.stop="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '分账', type: '4' }"
              @click.stop="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <!-- 分账规则描述 -->
    <el-dialog
      :visible.sync="isNote"
      :close-on-click-modal="false"
      title="规则描述"
      center
      :before-close="closeNote"
    >
      <el-input type="textarea" v-model="ruleNote"></el-input>
    </el-dialog>

    <!-- 新增规则 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      title="新增"
      width="820px"
      height="500px"
      center
      :before-close="handleClose"
    >
      <div style="margin: 0 0 20px 20px">
        <b>新增分账场景:</b>
        <el-input
          size="mini"
          v-model="instuName"
          clearable
          style="width: 200px; margin-left: 10px"
          placeholder="请输入新的分账场景名称"
        ></el-input>

        <el-button
          type="primary"
          plain
          size="mini"
          @click="addConfirm"
          circle
          class="el-icon-plus"
        ></el-button>
      </div>
      <el-tabs
        v-model="tabsName"
        tab-position="left"
        style="height: 350px; box-sizing: border-box; overflow-y: scroll"
        height="100%"
        closable
        @tab-remove="removeTab"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index + item"
          :name="item.id"
          :label="item.name"
        >
          <b slot="label">{{ item.name }}</b>
          <el-tabs type="card" v-model="tabChildName" @tab-click="handleClick">
            <el-tab-pane
              v-for="(childItem, index) in tabChildList"
              :key="index + childItem"
              :name="childItem.type"
              :label="childItem.name"
            >
              <b slot="label">{{ childItem.name }}</b>
              <el-tabs
                tab-position="left"
                @tab-click="handleClick"
                style="margin-top: 20px"
              >
                <el-tab-pane>
                  <span slot="label">流量方与护工归属方不是同一人</span>
                  <addAccRule
                    ref="childTab"
                    :rule="childItem"
                    :parentRule="item"
                    :temp="3"
                    @change="newRule"
                  ></addAccRule>
                </el-tab-pane>
                <el-tab-pane>
                  <span slot="label">流量方与护工归属方是同一人</span>
                  <addAccRule
                    ref="childTab"
                    :rule="childItem"
                    :parentRule="item"
                    :temp="2"
                    @change="newRule"
                  ></addAccRule>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 分账规则编辑 -->
    <el-dialog
      :visible.sync="isEdit"
      :close-on-click-modal="false"
      title="编辑规则"
      center
      width="500px"
      :before-close="closeEdit"
    >
      <el-form
        :model="currentRule"
        size="mini"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="规则名称:">
          <b>{{ currentRule.name }}</b>
        </el-form-item>
        <el-form-item label="规则类型:">
          <b v-if="currentRule.type == '0'">
            {{ "点对点" + "-" + (currentRule.template == 3 ? "N" : "Y") }}
          </b>
          <b v-if="currentRule.type == '1'">
            {{ "标品" + "-" + (currentRule.template == 3 ? "N" : "Y") }}
          </b>
          <b v-if="currentRule.type == '2'">
            {{ "业务线" + "-" + (currentRule.template == 3 ? "N" : "Y") }}
          </b>
        </el-form-item>

        <el-row class="accItem">
          <el-form-item label="流量方:" prop="introducer">
            <el-input
              class="itemInput"
              v-model="currentRule.introducer"
              auto-complete="off"
              placeholder="请输入固定额/百分比"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="accStyle">
            <el-radio-group v-model="introducerCompany">
              <el-radio label="0">固定额</el-radio>
              <el-radio label="1" class="per">百分比</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row class="accItem">
          <el-form-item label="服务方:" prop="nurse">
            <el-input
              class="itemInput"
              v-model="currentRule.nurse"
              auto-complete="off"
              placeholder="请输入固定额/百分比"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="accStyle">
            <el-radio-group v-model="nurseCompany">
              <el-radio label="0">固定额</el-radio>
              <el-radio label="1" class="per">百分比</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>

        <el-row class="accItem">
          <el-form-item label="护工归属方:" prop="foreman">
            <el-input
              class="itemInput"
              v-model="currentRule.foreman"
              auto-complete="off"
              placeholder="请输入固定额/百分比"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="accStyle">
            <el-radio-group v-model="foremanCompany">
              <el-radio label="0">固定额</el-radio>
              <el-radio label="1" class="per">百分比</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item label="描 述:">
          <el-input
            type="textarea"
            style="width: 100%"
            v-model="currentRule.note"
            auto-complete="off"
            placeholder="请输入规则备注"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 100%; margin-left: 100px">
          <el-button type="primary" @click="submitForm">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 多种方式导出 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      center
      :before-close="CloseExport"
    >
      <template slot="title">
        <i class="el-icon-warning" style="color: #e6a23c"></i>
        <b>温馨提示</b>
      </template>
      <p style="color: #303133; font-size: 20px; text-align: center">
        导出满足您需求的数据
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CloseExport" size="mini">取 消</el-button>
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
import addAccRule from "./addAccRule";
import excel from "global/excel";
import {
  getSplitAccounts,
  getRuleList,
  addRuleName,
  deleteRule,
  deleteSimple,
  updateRule,
} from "@/api/getData";
export default {
  data() {
    return {
      isNote: false,
      isEdit: false,
      reFreshLoading: false,
      dialogVisible: false,
      currentRule: {},
      introducerCompany: "",
      nurseCompany: "",
      foremanCompany: "",
      ruleNote: "",
      instuName: "",
      tabsName: "",
      tabChildName: "",
      tabList: [],
      tabChildList: [
        { name: "点对点", type: "0" },
        { name: "标品", type: "1" },
        { name: "业务线", type: "2" },
      ],
      tableData: [],
      selectedList: [],
      selectID: [],
      dialogFormVisible: false,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      columnList: {
        name: "分账规则名称",
        sType: "分账规则类型",
        sIntroducer: "流量方分成(金额/百分比)",
        sNurse: "服务方分成(金额/百分比)",
        sForeman: "护工归属方分成(金额/百分比)",
        createTime: "创建时间",
        note: "描述",
      },
    };
  },
  components: {
    addAccRule,
  },
  created() {
    this.initData();
    this.tabChildName = this.tabChildList[0].type;
  },
  watch: {
    introducerCompany: {
      handler(newName, oldName) {
        console.log(newName, oldName);
        if (newName !== oldName) oldName = newName;
        console.log(newName, oldName);
      },
    },
    nurseCompany: {
      handler(newName, oldName) {
        console.log(newName, oldName);
        if (newName !== oldName) oldName = newName;
        console.log(newName, oldName);
      },
    },
    foremanCompany: {
      handler(newName, oldName) {
        console.log(newName, oldName);
        if (newName !== oldName) oldName = newName;
        console.log(newName, oldName);
      },
    },
  },
  methods: {
    refresh() {
      this.reFreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.selectedList = [];
        this.selectID = [];
        this.reFreshLoading = false;
        this.initData();
      }, 1000);
      // if (this.isPagination == "main") {
      //   this.refreshLoading = true;
      //   setTimeout(() => {
      //     this.tableData = [];
      //     this.refreshLoading = false;
      //     this.initData(this.currentPage);
      //   }, 1000);
      // }
      // if (this.isPagination == "search") {
      //   this.refreshLoading = true;
      //   setTimeout(() => {
      //     this.tableData = [];
      //     this.refreshLoading = false;
      //     this.isPagination = "main";
      //     this.$refs.pag.backNumOne();
      //     this.initData(1);
      //   }, 1000);
      // }
    },
    // 初始化数据
    async initData() {
      this.getNameList();
      this.getSplitAccountsList();
    },
    async getNameList() {
      const res = await getRuleList({
        pageNum: 1,
        pageSize: 10000,
      });
      if (res.code == 200) {
        this.tabList = res.data.list;
        this.tabsName = this.tabList[0].id;
      }
    },
    async getSplitAccountsList() {
      const res = await getSplitAccounts({
        pageNum: this.currentPage,
        pageSize: 10,
      });
      console.log(res);
      if (res.code === 200) {
        this.count = res.data.total;
        this.tableData = res.data.list;
        this.tableData.forEach((item, index) => {
          this.tabList.forEach((citem, ci) => {
            if (this.tableData[index].ruleNameId === this.tabList[ci].id) {
              this.tableData[index].name = this.tabList[ci].name;
            }
          });
        });
      } else {
        throw new Error(res.message);
      }
    },

    //添加规则名称
    async addConfirm() {
      console.log(this.instuName);
      if (this.instuName) {
        var result = this.tabList.some((item) => {
          if (item.name === this.instuName) {
            return true;
          }
        });
        if (!result) {
          const res = await addRuleName({ name: this.instuName });
          console.log(res);
          if (res.code == 200) {
            this.tabsName = res.data.id;
            this.$message({
              type: "success",
              message: "新增分账场景成功！",
              center: true,
            });
            this.instuName = "";
            this.getNameList();
          }
        } else {
          this.$message({
            type: "warning",
            message: "这种分账情景已经存在！",
            center: true,
          });
        }
      } else {
        this.$message({
          type: "error",
          center: true,
          message: "输入的内容不能为空！",
        });
      }
    },
    // 更新子组件新建的规则
    newRule() {
      this.refresh();
      this.dialogFormVisible = false;
      this.tabsName = this.tabList[0].id;
      this.tabChildName = this.tabChildList[0].type;
    },
    // 关闭弹窗
    handleClose() {
      this.dialogFormVisible = false;
      this.$refs.childTab[0].resetForm("accRules");
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },

    // 删除分账场景
    removeTab(targetName) {
      let id = targetName;
      let tabs = this.tabList;
      let activeName = this.tabsName;
      this.$confirm(
        "此操作将删除该场景下所有的分账规则，是否继续?",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(async () => {
          const res = await deleteRule(id);
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功！",
              center: true,
            });
            if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                    activeName = nextTab.name;
                  }
                }
              });
            }
            this.tabList = tabs.filter((tab) => tab.name !== targetName);
            this.refresh();
          } else {
            this.$message({
              type: "warning",
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

    // 规则描述
    readNote(obj) {
      let rule = obj;
      this.isNote = true;
      rule.note == ""
        ? (this.ruleNote = "暂无描述")
        : (this.ruleNote = rule.note);
    },
    closeNote() {
      this.isNote = false;
      this.ruleNote = "";
    },

    addAccRule() {
      //显示新增页
      this.dialogFormVisible = true;
    },

    // 编辑
    handleEdit(index, row) {
      this.isEdit = true;
      this.currentRule = {};
      this.nurseCompany = row.nurseCompany + "";
      this.foremanCompany = row.foremanCompany + "";
      this.introducerCompany = row.introducerCompany + "";
      // row.template += "";
      row.type += "";
      this.currentRule = row;
    },
    submitForm() {
      //提交修改
      this.currentRule.nurseCompany = this.nurseCompany;
      this.currentRule.foremanCompany = this.foremanCompany;
      this.currentRule.introducerCompany = this.introducerCompany;
      console.log(this.currentRule);
      this.$confirm("此操作将修改该条分账规则，是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          console.log(this.currentRule);
          const res = await updateRule(this.currentRule);
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功！",
              center: true,
            });
            this.isEdit = false;
            this.refresh();
          } else {
            this.$message({
              type: "warning",
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
    closeEdit() {
      this.isEdit = false;
      this.currentRule = {};
    },

    // 对话框取消事件
    closeDialog(formName) {
      this.dialogFormVisible = false;
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },

    // 删除一条分账规则
    handleDelete(index, row) {
      console.log(row);
      this.$confirm("此操作将删除该条分账规则，是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          console.log(row.id);
          let id = row.id;
          const res = await deleteSimple(id);
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: res.message,
              center: true,
            });
            // 更新数据
            this.refresh();
          } else {
            this.$message({
              type: "warning",
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
    //选中导出数据
    handleSelectionChange(val) {
      this.selectedList = val;
      console.log(this.selectedList);
      this.selectID = val.map((item) => {
        return item.id;
      });
    },

    // 百分比或者固定额
    checkComp(value, com) {
      if (com == "0") return value;
      if (com == "1") return value + "%";
    },
    // 分账类型
    checkType(value, temp) {
      if (value == "0") return "点对点" + "-" + (temp == 3 ? "N" : "Y");
      if (value == "1") return "标品" + "-" + (temp == 3 ? "N" : "Y");
      if (value == "2") return "业务线" + "-" + (temp == 3 ? "N" : "Y");
    },

    // 导出数据
    exportData() {
      this.dialogVisible = true;
    },
    CloseExport() {
      this.dialogVisible = false;
    },
    exportExcel(excelData) {
      let tableData = excelData;
      tableData.forEach((item) => {
        item.sType = this.checkType(item.type, item.template);
        item.sIntroducer = this.checkComp(
          item.introducer,
          item.introducerCompany
        );
        item.sNurse = this.checkComp(item.nurse, item.nurseCompany);
        item.sForeman = this.checkComp(item.foreman, item.foremanCompany);
      });
      const params = {
        header: Object.values(this.columnList),
        key: Object.keys(this.columnList),
        data: tableData,
        autoWidth: true,
        fileName: "分账规则",
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
        console.log("导出全部");
        const res = await getSplitAccounts();
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
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getSplitAccountsList();
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
.el-tabs--card > .el-tabs__header .el-tabs__item:active {
  background: #ecf5ff;
}
.demo-ruleForm .el-input--mini .el-input__inner {
  width: 150px !important;
}
.demo-ruleForm .accItem {
  display: flex;
}
.demo-ruleForm .accItem .accStyle {
  margin-left: -70px;
}
.demo-ruleForm .accItem .accStyle .per {
  margin-left: -20px;
}
</style>
