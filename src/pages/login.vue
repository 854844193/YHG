<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <img src="static/image/logo.png" width="64" height="64" />
          <p>云护工后台管理系统</p>
        </div>

        <div>
          <el-form
            :model="loginForm"
            :rules="rules"
            ref="loginForm"
            @submit.native.prevent
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="密码"
                v-model="loginForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                native-type="submit"
                @click="submitForm('loginForm')"
                class="submit_btn"
                >登 陆</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import { login } from "@/api/getData";
import { mapActions, mapState } from "vuex";

export default {
  name: "login", // 登陆页
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      showLogin: false,
    };
  },
  mounted() {
    this.showLogin = true;
  },
  computed: {},
  methods: {
    async submitForm(formName) {
      // 登陆
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          const res = await login({
            password: this.loginForm.password,
            username: this.loginForm.username,
          });
          loading.close();
          if (res.code == 200) {
            let userInfo = {};
            this.$message({
              type: "success",
              message: "登录成功",
              center: true,
            });
            userInfo = res.data;
            this.$store.commit("saveAdminInfo", userInfo);
            this.$store.commit("setLoginState", true);
            if (userInfo.username == "admin") {
              // 超级管理员
              console.log("超级管理员");
              this.$store.commit("setIsAdmin", true);
            } else {
              console.log("非超级管理员");
              this.$store.commit("setIsAdmin", false);
            }
            this.$router.push("manage");
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            // offset: 100,
          });
          return false;
        }
      });
    },
  },
  watch: {
    adminInfo: function (newValue) {
      if (newValue.id) {
        this.$message({
          type: "success",
          message: "检测到您之前登录过，将自动登录",
          center: true,
        });
        this.$router.push("manage");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  // position: relative;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  z-index: -10;
  zoom: 1;
  background-color: #fff;
  background: url("../../static/image/loginbackground0.png") no-repeat;
  // background: url("~/static/image/loginbackground0.png") no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
.manage_tip {
  // display: flex;
  // flex-direction: row;
  // flex-wrap: nowrap;
  // justify-content: flex-start;
  // align-items: center;
  // height: 50px;
  //width: 100%;
  vertical-align: center;
  margin-bottom: 20px;
  p {
    font-size: 20px;
    color: #adafb4;
    margin-left: 10px;
  }
}

.form_contianer {
  // .wh(280px, 220px);
  .wh(350px, 300px);
  // .ctp(320px, 210px);
  float: right;
  margin: 100px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  background-color: #fff;
  opacity: 0.8;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
