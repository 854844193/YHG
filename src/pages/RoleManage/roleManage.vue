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
        >
          刷新
        </el-button>
        <el-button
          type="primary"
          plain
          size="mini"
          class="search_btn"
          v-has="{ name: '角色管理', type: '4' }"
          @click="addBtn()"
        >
          新增
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          type="index"
          label="#"
          :index="computeTableIndex"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="角色code"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="角色名"
          width="200"
        ></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="btnScope">
            <el-button
              size="mini"
              type="primary"
              v-has="{ name: '角色管理', type: '2' }"
              @click="editRole(btnScope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '角色管理', type: '4' }"
              @click="deleteItem(btnScope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="roleDialog"
      :title="isAdd == true ? '添加角色' : '编辑角色'"
      center
      width="700px"
      :show-close="false"
    >
      <el-form
        :model="roleInfo"
        ref="ruleForm"
        size="mini"
        class="demo-ruleForm"
        :rules="rules"
      >
        <!-- 第一行 基本信息 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="90px" prop="code" label="角色code:">
              <el-input v-model="roleInfo.code" :disabled="!isAdd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="86px" prop="roleName" label="角色名:">
              <el-input v-model="roleInfo.roleName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第一行 权限信息 -->
        <el-row style="width: 620px; margin: 20px auto">
          <p style="text-align: center; font-size: 16px; margin: 0 0 20px">
            <b>权限控制：</b>
          </p>
          <el-transfer
            :titles="['未设置权限', '已设置权限']"
            v-model="checkedPermId"
            :data="authorities"
            @change="handleChange"
            style="width: 600px; margin: 0 auto"
          ></el-transfer>
        </el-row>
        <el-row style="width: 136px; margin: 10px auto">
          <el-button size="mini" @click="closeDialog('ruleForm')"
            >取 消</el-button
          >
          <el-button
            v-if="isAdd"
            size="mini"
            type="primary"
            @click="confirm('ruleForm')"
            >确 定</el-button
          >
          <el-button
            v-else
            size="mini"
            type="primary"
            @click="updateInfo('ruleForm')"
            >确 定</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { login, updateInfo } from "@/api/getData";
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  getPermList,
  setPermList,
  getRolePerm,
} from "@/api/getData";
import headTop from "components/headTop";
export default {
  components: {
    headTop,
  },
  data() {
    return {
      roleDialog: false,
      permDialog: false,
      refreshLoading: false,
      isAdd: true,
      isUpd: false,
      tableData: [], // 角色表数据
      roleInfo: {
        code: "",
        roleName: "",
      },
      rules: {
        code: [
          { required: true, message: "请输入角色code", trigger: "blur" },
          // { pattern: '//', trigger: 'change' }
        ],
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      checkedAuthorities: [],
      checkedPermId: [],
      noChecked: [],
      authorities: [],
      isIndeterminate: false, // 表单对象
    };
  },
  created() {
    this.init();
  },
  watch: {
    checkedPermId: {
      handler(newName, oldName) {
        if (newName == oldName) {
          this.isUpd = false;
        }
        if (newName != oldName) {
          this.isUpd = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    refresh() {
      this.refreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.refreshLoading = false;
        this.init();
      }, 1000);
    },
    async init() {
      const res = await getRoleList();
      if (res.code == 200) {
        this.tableData = res.data;
        console.log(this.tableData);
      } else {
        throw new Error("获取数据失败");
      }
    },

    //添加角色
    async addBtn() {
      // 添加角色及权限
      this.roleDialog = true;
      this.isAdd = true;
      const res = await getPermList();
      console.log(res);
      res.list.forEach((item, index) => {
        item.key = item.id;
        item.label = item.name;
      });
      this.authorities = res.list;
    },
    async confirm(ruleForm) {
      console.log(this.roleInfo);
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          let code = this.roleInfo.code;
          let name = this.roleInfo.roleName;
          console.log(code, name);
          const res = await addRole(code, name);
          console.log(res);
          if (res.code == this.roleInfo.code) {
            this.permSetting(res.id);
          } else {
            this.$message({
              type: "warning",
              message: "添加出错",
              center: true,
            });
          }
        } else {
          this.$message({
            type: "error",
            message: "请输入正确的角色code和名称！！！",
            center: true,
          });
        }
      });
    },

    //编辑角色
    async editRole(role) {
      console.log(role);
      this.roleDialog = true;
      this.isAdd = false;
      // 初始化数据
      this.roleInfo.id = role.id;
      this.roleInfo.code = role.code;
      this.roleInfo.roleName = role.name;
      this.checkedPermId = [];
      const res = await getPermList();
      res.list.forEach((item, index) => {
        item.key = item.id;
        item.label = item.name;
      });
      this.authorities = res.list;
      //获取角色权限
      const res1 = await getRolePerm({ id: role.id });
      res1.forEach((item) => {
        this.checkedPermId.push(item.id);
      });
    },

    async updateInfo(ruleForm) {
      console.log(this.roleInfo);
      this.$confirm("是否编辑当前角色, 是否继续?", "温馨提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.$refs[ruleForm].validate(async (valid) => {
            if (valid) {
              const res = await updateRole({
                id: this.roleInfo.id,
                code: this.roleInfo.code,
                name: this.roleInfo.roleName,
              });
              console.log(res);
              if (res.code == this.roleInfo.code) {
                this.permSetting(this.roleInfo.id);
              } else {
                this.$message({
                  type: "warning",
                  message: "编辑出错！",
                  center: true,
                });
              }
            } else {
              this.$message({
                type: "error",
                message: "请输入正确的信息和选择相应的权限！！！",
                center: true,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "取消操作！",
            center: true,
          });
        });
    },

    closeDialog(formName) {
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.roleInfo = {};
      this.authorities = [];
      this.checkedPermId = [];
      this.roleDialog = false;
    },

    // 权限控制
    async permSetting(pid) {
      let userId = pid;
      this.checkedPermId.length == 0
        ? (this.checkedPermId = [])
        : this.checkedPermId;
      const res = await setPermList({
        id: userId,
        permissionIds: this.checkedPermId,
      });
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.message,
          center: true,
        });
        this.roleDialog = false;
        this.refresh();
      }
    },

    //删除角色
    deleteItem(role) {
      this.$confirm("此操作将删除当前角色，是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          console.log(1111);
          let id = role.id;
          const res = await deleteRole({ id: id });
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "角色删除成功！",
              center: true,
            });
          } else {
            console.log(2222);
            this.$message({
              type: "error",
              message: "操作失败！",
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

    //权限管理
    async editPerm() {
      this.permDialog = true;
      const res = await getPermList();
      console.log(res);
      this.authorities = res.list;
    },
    handleChange(value, direction, movedKeys) {
      console.log(value);
    },
    computeTableIndex(index) {
      return index + 1;
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
.demo-ruleForm .el-input--mini .el-input__inner {
  width: 200px !important;
}
</style>