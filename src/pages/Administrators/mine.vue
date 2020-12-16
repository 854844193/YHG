<template>
  <div class="fillcontain">
    <!-- <head-top></head-top> -->
    <div class="mainBox">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        size="mini"
        class="demo-ruleForm"
        :rules="rules"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="7">
            <el-form-item
              label-width="90px"
              label-position="left"
              label="账户:"
              prop="username"
            >
              <el-input
                disabled="disabled"
                v-model="ruleForm.username"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <el-form-item
              label-width="90px"
              label-position="left"
              label="邮箱:"
              prop="email"
            >
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="7">
            <el-form-item
              label-width="90px"
              label-position="left"
              label="电话:"
              prop="phone"
            >
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row>
        <el-col :span="3">
          <el-button class="btnBox" type="primary" @click="SubmitInfo()"
            >提交修改</el-button
          >
        </el-col>

        <el-col :span="3">
          <el-button class="btnBox" type="primary" @click="modifyPassword()"
            >修改密码</el-button
          >
        </el-col>
      </el-row>

      <el-dialog :visible.sync="showDialog" @close="dlgClose()">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          :rules="formrule"
          @submit.native.prevent
        >
          <el-form-item label="密码:" prop="password">
            <el-input v-model="form.password" show-password></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancleBtn()">取 消</el-button>
          <el-button type="primary" @click="modifyPassword1()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "components/headTop";
import { resetPassword, updateManager } from "@/api/getData";
export default {
  components: {
    headTop,
  },
  data() {
    return {
      showDialog: false,
      form: {
        password: "",
      },
      formrule: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      ruleForm: {
        username: "",
        email: "",
        phone: "",
        password: "",
      },
      rules: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          //   { type: 'number', message: '请输入数字', trigger: 'blur' },
          { min: 0, max: 11, message: "长度11个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      console.log("mine-----------------------");
      console.log(this.$store.getters.getAdminInfo);
      this.ruleForm = this.$store.getters.getAdminInfo;
    },
    async modifyPassword() {
      this.showDialog = true;
    },
    async modifyPassword1() {
      console.log(this.form.password);
      let info = {
        password: this.form.password,
        username: this.ruleForm.username,
      };
      const ret = await resetPassword(info);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: ret.data,
          center: true,
        });
      } else {
        throw new Error(ret.message);
      }

      // 提交密码
      this.showDialog = false;
    },
    async SubmitInfo() {
      // 提交表单
      let ManagerInfo = {
        id: this.ruleForm.id,
        password: this.ruleForm.password,
        email: this.ruleForm.email,
        phone: this.ruleForm.phone,
        username: this.ruleForm.username,
      };

      // 添加管理员的基础信息
      console.log(ManagerInfo);
      const res = await updateManager(ManagerInfo);
      if (res.code === 200) {
        console.log("基础信息修改成功");
      } else {
        throw new Error(res.message);
      }
    },
    dlgClose() {
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
    },
    cancleBtn() {
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }

      this.showDialog = false;
    },
  },
};
</script>

<style scoped='' type='text/css'>
.mainBox {
  margin-top: 20px;
}
.btnBox {
  margin: 20px 0 0 40px;
}
</style>