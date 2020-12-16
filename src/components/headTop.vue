<template>
  <div class="header_container">
    <el-breadcrumb separator="/" style="display: flex; align-items: center">
      <div
        class="toggle-button"
        @click="toggleCollapse"
        style="font-size: 22px; margin-right: 10px"
      >
        <i v-if="isMenu" class="el-icon-s-unfold"></i>
        <i v-else class="el-icon-s-fold"></i>
      </div>
      <!-- <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{
        item
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="display: flex; justify-content: flex-end; align-items: center">
      <el-tag
        type="warning"
        size="small"
        style="cursor: pointer; margin-right: 10px"
        @click="readWarning"
      >
        <b>警 告</b>
      </el-tag>
      <el-dropdown @command="handleCommand" menu-align="start">
        <div
          style="display: flex; justify-content: flex-end; align-items: center"
        >
          <h4 style="margin-right: 10px">
            {{ this.$store.state.adminInfo.username }}
          </h4>
          <img
            src="static/image/avatar.png"
            class="avator"
            @click="toMine"
            style="cursor: pointer"
          />
        </div>
        <!-- <img src="/manage/static/image/avatar.png" class="avator"> -->
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="signout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { signout } from "@/api/getData";
import { baseImgPath } from "@/config/env";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      baseImgPath,
      name: "",
      isMenu: false,
    };
  },
  created() {
    if (!this.adminInfo.id) {
      this.getAdminData();
    }
    // console.log(this.$store.state.adminInfo);
  },
  computed: {
    ...mapState(["adminInfo"]),
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async handleCommand(command) {
      console.log(command);
      if (command == "home") {
        this.$router.push("/manage");
      } else if (command == "signout") {
        this.$store.commit("setLoginState", false);
        this.$router.push("/");
      }
    },
    readWarning() {
      console.log("查看警告");
      const h = this.$createElement;
      this.$notify({
        title: "警 告",
        type: "warning",
        message: h("i", { style: "color: orange" }, "暂时还没有警告"),
        duration: 0,
      });
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isMenu = !this.isMenu;
      this.$emit("change", this.isMenu);
    },
    toMine() {
      this.$router.push("/mine");
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
.header_container {
  background-color: #eff2f7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}
.avator {
  .wh(36px, 36px);
  border-radius: 50%;
  margin-right: 37px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
