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
          v-has="{ name: '管理员管理', type: '4' }"
          type="primary"
          size="mini"
          plain
          class="search_btn"
          @click="handle_add_btn()"
        >
          添加管理员
        </el-button>
      </div>
      <el-table
        :data="tableData"
        border
        v-loading="refreshLoading"
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          type="index"
          label="#"
          :index="computeTableIndex"
          width="50"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="头 像" align="center"></el-table-column> -->
        <el-table-column
          prop="username"
          label="账 户"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="电 话"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column label="操 作" align="center">
          <template slot-scope="userInfo">
            <el-button
              v-has="{ name: '管理员管理', type: '2' }"
              size="mini"
              type="primary"
              @click="rightListEdit(userInfo.row)"
              >编辑</el-button
            >
            <el-button
              v-has="{ name: '管理员管理', type: '4' }"
              size="mini"
              type="danger"
              @click="deleteUser(userInfo.row.id)"
              >删除</el-button
            >
            <el-button
              v-has="{ name: '管理员管理', type: '2' }"
              size="mini"
              type="danger"
              @click="resetPassword(userInfo.row)"
              >密码重置</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        fullscreen
        class="elDialog"
        :visible.sync="AddManagerShow"
        :title="dialogTitle === 'add' ? '新增管理员' : '信息和权限管理'"
        center
        @close="dlgClose()"
      >
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          size="mini"
          :rules="rules"
          @submit.native.prevent
        >
          <el-row>
            <el-col :span="9">
              <el-form-item
                label-width="90px"
                label-position="left"
                label="姓名:"
                prop="name"
              >
                <el-input
                  v-model="ruleForm.name"
                  clearable
                  :disabled="ruleForm.nameDisabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" v-if="AddManagerShowType == 0">
              <el-form-item
                label-width="90px"
                label-position="left"
                label="密码:"
                prop="password"
                show-password
              >
                <el-input
                  v-model="ruleForm.password"
                  show-password
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行 -->
          <el-row>
            <el-col :span="9">
              <el-form-item label="邮箱:" label-width="90px" prop="email">
                <el-input v-model="ruleForm.email" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="手机号码:" label-width="90px" prop="phone">
                <el-input v-model="ruleForm.phone" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第三行 权限信息 -->
          <el-row>
            <!-- 权限列表 -->
            <el-table
              :data="ruleForm.permLists"
              style="width: 100%"
              height="600"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            >
              <el-table-column type="expand">
                <template slot-scope="prop1">
                  <el-table :data="prop1.row.sub" style="width: 100%">
                    <el-table-column
                      label="权限子项"
                      prop="name"
                    ></el-table-column>
                    <el-table-column label="权限" prop="permission">
                      <template slot-scope="propsSub">
                        <el-checkbox
                          :value="propsSub.row.permission & 1 ? true : false"
                          @change="checkItemPerm1($event, propsSub.row)"
                          >查看</el-checkbox
                        >
                        <el-checkbox
                          :value="propsSub.row.permission & 2 ? true : false"
                          @change="checkItemPerm2($event, propsSub.row)"
                          >编辑</el-checkbox
                        >
                        <el-checkbox
                          :value="propsSub.row.permission & 4 ? true : false"
                          @change="checkItemPerm4($event, propsSub.row)"
                          >删除</el-checkbox
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="权限项" prop="name"></el-table-column>
              <el-table-column label="权限项操作">
                <template slot-scope="props2">
                  <el-checkbox
                    @change="checkAll($event, props2.row.sub)"
                    v-model="props2.row.permission"
                    >全选</el-checkbox
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="CancelEdit()">取 消</el-button>
          <el-button type="primary" @click="SubmitInfo()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "components/headTop";
import {
  getManagerList,
  addManager,
  deleteManager,
  updateManager,
  addPersonPermission,
  updatePersonPermission,
  getPersonPermissionByUserId,
  resetPassword,
} from "@/api/getData";
import { permLists } from "global/index";
export default {
  data() {
    const validateAcquaintance = (rule, value, callback) => {
      if (value === "admin") {
        callback(new Error("admin不允许被使用"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      AddManagerShow: false,
      refreshLoading: false,
      dialogTitle: "add",
      ruleForm: {
        name: "",
        email: "",
        phone: "",
        userId: "",
        password: "",
        nameDisabled: false,
        permLists: [],
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { validator: validateAcquaintance, trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { min: 0, max: 11, message: "长度11个字符", trigger: "blur" },
          // { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      AddManagerShowType: 0,
    };
  },
  components: {
    headTop,
  },
  created() {
    this.initData();
  },
  methods: {
    //刷新
    refresh() {
      this.refreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.count = 0;
        this.initData();
        this.refreshLoading = false;
      }, 1000);
    },
    async initData() {
      this.getManagerList();
    },
    async resetPassword(info) {
      console.log(info);
      let ret1 = undefined;
      await this.$confirm(
        `是否重置账户为<b>“${info.username}”</b>的密码<b>“123456”</b>?`,
        "重置密码",
        {
          distinguishCancelAndClose: true,
          dangerouslyUseHTMLString: true,
          confirmButtonText: "重置",
          cancelButtonText: "取消",
          center: true,
          type: "warning",
        }
      )
        .then(() => {
          ret1 = true;
        })
        .catch(() => {
          ret1 = false;
        });

      if (!ret1) {
        return;
      }

      const ret = await resetPassword({
        password: "123456",
        username: info.username,
      });
      console.log(ret);
      if (ret.code == 200) {
        this.$message({
          type: "success",
          message: "重置密码成功!",
          center: true,
        });
      } else {
        this.$message({
          showClose: true,
          message: ret.message,
          type: "error",
          center: true,
        });
      }
    },
    async getManagerList() {
      try {
        // 获取管理员的信息
        const res = await getManagerList();
        console.log(res);
        if (res.code == 200) {
          this.tableData = res.data;

          // 去除超级管理员
          this.tableData = this.tableData.filter((item, index, arr) => {
            return item.username != "admin";
          });
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {},
    computeTableIndex(index) {
      return index + 1;
    },

    // 添加管理员
    async handle_add_btn() {
      this.dialogTitle = "add";
      this.ruleForm.permLists = permLists;
      this.ruleForm.name = "";
      this.ruleForm.email = "";
      this.ruleForm.phone = "";
      this.ruleForm.userId = "";
      this.ruleForm.password = "";
      this.ruleForm.nameDisabled = false;

      // 初始化值
      this.ruleForm.permLists.forEach(function (item, index) {
        item.permission = false;
        item.id = 0;
        item.pid = 0;
        item.sub.forEach(function (subItem, index) {
          subItem.permission = 0;
          subItem.id = 0;
          subItem.pid = 0;
        });
      });

      // 添加管理员
      this.AddManagerShow = true;
      // 新增
      this.AddManagerShowType = 0;
    },

    //后台用户编辑
    async rightListEdit(userInfo) {
      this.dialogTitle = "edit";
      console.log(userInfo);
      // 获取当前用户的权限信息
      let CurrPermList = {};
      const res = await getPersonPermissionByUserId(userInfo.id);
      if (res.code == 200) {
        CurrPermList = res.data;
      }
      console.log(CurrPermList);
      //   // // 初始化form信息
      this.ruleForm.name = userInfo.username;
      this.ruleForm.email = userInfo.email;
      this.ruleForm.phone = userInfo.phone;
      this.ruleForm.permLists = permLists;
      this.ruleForm.userId = userInfo.id;
      this.ruleForm.password = userInfo.password;
      this.ruleForm.nameDisabled = true;

      // 初始化值
      this.ruleForm.permLists.forEach(function (item, index) {
        item.permission = false;
        item.id = 0;
        item.pid = 0;
        item.sub.forEach(function (subItem, index) {
          subItem.permission = 0;
          subItem.id = 0;
          subItem.pid = 0;
        });
      });

      if (CurrPermList.length > 0) {
        this.ruleForm.permLists.forEach(function (item, index) {
          // 根据数据库更新值
          let findRet = CurrPermList.find((v) => v.name === item.name);
          if (findRet != undefined) {
            // item.permission = Boolean(findRet.permission);
            item.id = findRet.id;
            item.pid = findRet.pid;
            item.sub.forEach(function (subItem, index) {
              // 根据数据库更新值
              let subFindRet = CurrPermList.find(
                (v) => v.name === subItem.name
              );
              if (subFindRet != undefined) {
                subItem.permission = subFindRet.permission;
                subItem.id = subFindRet.id;
                subItem.pid = subFindRet.pid;

                //判断是否是全选
                // if (subItem.permission == 7) {
                //   item.permission = Boolean(findRet.permission);
                // }else{
                //   item.permission = Boolean(findRet.permission);
                // }
              }
            });
          }
        });
      }

      // 某个角色的权限修改
      this.AddManagerShow = true;
      // 编辑
      this.AddManagerShowType = 1;
    },
    async SubmitInfo() {
      // 提交管理员的信息
      console.log(this.ruleForm);
      var ret = undefined;
      await this.$confirm("确认需要保存信息?", "保存提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          ret = true;
        })
        .catch(() => {
          ret = false;
        });

      if (!ret) {
        this.AddManagerShow = false;
        if (this.$refs.ruleForm !== undefined) {
          this.$refs.ruleForm.resetFields();
        }
        return;
      }

      if (this.AddManagerShowType == 0) {
        // 新增管理员及权限
        let ManagerInfo = {
          phone: this.ruleForm.phone,
          email: this.ruleForm.email,
          id: "",
          nickName: "",
          note: "",
          password: this.ruleForm.password,
          status: 1,
          username: this.ruleForm.name,
        };

        console.log("ManagerInfo" + ManagerInfo);
        // 添加管理员的基础信息
        const res = await addManager(ManagerInfo);
        if (res.code == 200) {
          console.log("基础信息提交成功");

          // 开始提交权限信息
          this.updatePerm(res.data);
        } else {
          throw new Error(res.message);
          this.$message({
            showClose: true,
            message: "提交管理员信息失败",
            type: "error",
            center: true,
          });
        }
      } else {
        console.log("更新权限");
        // 更新管理员及权限
        let ManagerInfo = {
          id: this.ruleForm.userId,
          password: this.ruleForm.password,
          email: this.ruleForm.email,
          phone: this.ruleForm.phone,
          username: this.ruleForm.name,
        };

        // 添加管理员的基础信息
        console.log(ManagerInfo);
        const res = await updateManager(ManagerInfo);
        if (res.code == 200) {
          console.log("基础信息提交成功");
          // 开始提交权限信息
          this.updatePerm(ManagerInfo.id);
        } else {
          console.log("提交管理员信息失败");
          this.$message({
            showClose: true,
            message: "提交管理员信息失败",
            type: "error",
            center: true,
          });
        }
      }

      this.getManagerList();
      this.AddManagerShow = false;

      this.$message({
        showClose: true,
        message: "提交管理员信息成功",
        type: "success",
        center: true,
      });
    },
    async updatePerm(userId) {
      console.log("原始数据表");
      console.log(this.ruleForm.permLists);

      let parentAddList = this.ruleForm.permLists.filter((ele) => ele.id == 0);
      let parentUpdateList = this.ruleForm.permLists.filter(
        (ele) => ele.id != 0
      );

      console.log("新增");
      console.log(parentAddList);

      console.log("更新");
      console.log(parentUpdateList);

      let addRet = {};
      let updateRet = {};

      if (parentAddList.length > 0) {
        // 新增部分
        parentAddList.forEach(function (item, index) {
          (item.permission = Number(item.permission)),
            (item.pid = 0),
            (item.status = 1),
            (item.type = 1),
            (item.uri = ""),
            (item.userId = userId),
            (item.id = 0);
        });

        console.log("父权限新增");
        console.log(parentAddList);
        const res = await addPersonPermission(parentAddList);
        if (res.code == 200) {
          console.log("父权限提交成功");
          addRet = res.data;
          console.log(addRet);
        } else {
          throw new Error(res.message);
          console.log("父权限提交失败");
          return;
        }
      }

      if (parentUpdateList.length > 0) {
        console.log("父权限更新");
        // 更新部分
        parentUpdateList.forEach(function (item, index) {
          (item.permission = Number(item.permission)),
            (item.pid = 0),
            (item.status = 1),
            (item.type = 1),
            (item.uri = ""),
            (item.userId = userId),
            (item.id = item.id);
        });

        console.log(parentUpdateList);

        console.log("发送权限到服务");
        if (parentUpdateList.length > 0) {
          const res = await updatePersonPermission(parentUpdateList);
          if (res.code == 200) {
            console.log("父权限更新成功");
            updateRet = res.data;
            console.log(updateRet);
          } else {
            throw new Error(res.message);
            console.log("父权限更新失败");
            return;
          }
        }
      }

      console.log("权限合并");
      var retArr = {};
      if (updateRet.length > 0 && addRet.length > 0) {
        retArr = addRet.concat(updateRet);
      } else if (updateRet.length > 0) {
        retArr = updateRet;
      } else if (addRet.length > 0) {
        retArr = addRet;
      } else {
        return;
      }

      console.log("父权限提交结果");
      console.log(retArr);

      // 提交子权限
      this.updateSubPerm(retArr, userId, this.ruleForm.permLists);
    },
    async updateSubPerm(parentPerm, userId, srcList) {
      let permList = [];

      console.log(userId);

      // 更新子权限
      for (var i in srcList) {
        let itemRet = parentPerm.find((v) => v.name === srcList[i].name);
        for (var j in srcList[i].sub) {
          srcList[i].sub[j].pid = itemRet.id;
          //     let permItem = {
          //       id: srcList[i].sub[j].id,
          //       name: srcList[i].sub[j].name,
          //       permission: srcList[i].sub[j].permission,
          //       pid: itemRet.id,
          //       status: 1,
          //       type: 1,
          //       uri: "",
          //       userId: userId,
          //     };
          // permList.push(permItem);
        }
      }

      let addList = [];
      let updateList = [];

      srcList.forEach(function (item, index) {
        item.sub.forEach(function (subItem, index) {
          let permItem = {
            id: subItem.id,
            name: subItem.name,
            permission: subItem.permission,
            pid: subItem.pid,
            status: 1,
            type: 1,
            uri: "",
            userId: userId,
          };
          if (permItem.id == 0) {
            addList.push(permItem);
          } else {
            updateList.push(permItem);
          }
        });
      });

      console.log("子权限新增");
      console.log(addList);
      if (addList.length > 0) {
        const res = await addPersonPermission(addList);
        if (res.code == 200) {
          console.log("子权限提交成功");
          console.log("res" + res.data);
        } else {
          throw new Error(res.message);
        }
      }

      console.log("子权限更新");
      console.log(updateList);
      if (updateList.length > 0) {
        const res = await updatePersonPermission(updateList);
        if (res.code == 200) {
          console.log("子权限提交成功");
          console.log("res" + res.data);
        } else {
          throw new Error(res.message);
        }
      }
    },
    async deleteUser(userId) {
      var ret = undefined;
      await this.$confirm("确认需要删除管理员?", "删除提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          ret = true;
        })
        .catch(() => {
          ret = false;
        });

      if (!ret) {
        return;
      }

      // 删除用户基本信息
      const res = await deleteManager(userId);
      if (res.code == 200) {
        console.log("删除用户成功");

        this.$message({
          showClose: true,
          message: res.message,
          type: "success",
          center: true,
        });

        this.getManagerList();
      } else {
        console.log("删除用户失败");

        this.$message({
          showClose: true,
          message: res.message,
          type: "error",
          center: true,
        });
      }
    },
    checkAll(permission, sub) {
      // 全选
      console.log(permission);
      console.log(sub);
      sub.forEach(function (subItem, index) {
        if (permission) subItem.permission = 7;
        else subItem.permission = 0;
      });
    },
    CancelEdit(formName) {
      this.AddManagerShow = false;

      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields();
      }
    },
    dlgClose() {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields();
      }
    },
    checkItemPerm1(permission, ItemPerm) {
      // 查看 选中切换
      if (permission) {
        ItemPerm.permission = ItemPerm.permission | 1;
      } else {
        ItemPerm.permission = ItemPerm.permission & ~1;
      }
    },
    checkItemPerm2(permission, ItemPerm) {
      // 编辑 选中切换
      if (permission) {
        ItemPerm.permission = ItemPerm.permission | 2;
      } else {
        ItemPerm.permission = ItemPerm.permission & ~2;
      }
    },
    checkItemPerm4(permission, ItemPerm) {
      // 删除 选中切换
      if (permission) {
        ItemPerm.permission = ItemPerm.permission | 4;
      } else {
        ItemPerm.permission = ItemPerm.permission & ~4;
      }
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";

.elDialog {
  margin: 20px;
}
</style>
