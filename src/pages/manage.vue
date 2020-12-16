<template>
  <div class="fillcontain">
    <el-container style="height: 100%">
      <el-container
        :style="isCollapse ? 'width:66px' : 'width:250px'"
        class="el-menu-vertical-demo"
        style="height: 100%; background-color: #456a9d; overflow: hidden"
      >
        <el-header style="margin: 0; padding: 0">
          <router-link key="expand" class="toManage" to="/manage">
            <img src="static/image/mini_logo.png" class="logo" />
            <h1 class="sidebarTitle" v-if="!isCollapse">云护工管理系统</h1>
          </router-link>
        </el-header>
        <el-main
          style="
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            overflow-x: hidden;
            overflow-y: auto;
          "
        >
          <el-menu
            style="width: 100%"
            :default-active="defaultActive"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            theme="dark"
            router
            background-color="#456a9d"
            text-color="#fff"
            active-text-color="#ffd04b"
            v-for="item in menuList"
            :key="item.name"
          >
            <el-submenu v-if="item.permission > 0" :index="item.menuIndex">
              <template slot="title">
                <i style="color: #fff" :class="item.className"></i>
                <span>{{ item.name }}</span>
              </template>
              <div v-for="subItem in item.child" :key="subItem.name">
                <el-menu-item
                  v-if="subItem.permission > 0"
                  :index="subItem.menuIndex"
                  >{{ subItem.name }}</el-menu-item
                >
              </div>
            </el-submenu>
          </el-menu>
        </el-main>
      </el-container>
      <el-container style="width: 100%; height: 100%; margin: 0; padding: 0">
        <el-header style="margin: 0; padding: 0">
          <head-top @change="listenIscoll"></head-top>
        </el-header>
        <el-main style="margin: 0; padding: 0">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import headTop from "components/headTop";
import { sysMenuList } from "@/global/index";
import { getPersonPermissionByUserId } from "@/api/getData";
export default {
  name: "daohang",
  computed: {
    defaultActive: function () {
      return this.$route.path.replace("/", "");
    },
  },
  data() {
    return {
      permissions: [],
      sysRoles: {},
      menuList: [],
      isCollapse: false,
    };
  },
  components: {
    headTop,
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      // 获取用户权限
      if (this.$store.getters.getLoginState) {
        // 处理菜单权限
        this.menuList = sysMenuList;
        this.menuList.forEach(function (item, index) {
          item.permission = 0;
          item.child.forEach(function (subItem, index) {
            subItem.permission = 0;
          });
        });

        // console.log("this.$store.getters.getIsAdmin" + this.$store.getters.getIsAdmin);
        if (this.$store.getters.getIsAdmin) {
          // console.log("超级管理员权限");
          // 超级管理员
          let index = 0;
          this.menuList.forEach(function (item, index) {
            item.permission = 1;
            item.child.forEach(function (subItem, index) {
              subItem.permission = 7;
            });
            index++;
            item.index = index;
          });

          return;
        } else {
          // console.log("其他管理员获取权限");
          let MangerPermList = {};
          let userId = this.$store.getters.getAdminInfo.id;
          const permRes = await getPersonPermissionByUserId(userId);
          if (permRes.code == 200) {
            MangerPermList = permRes.data;
            // 保存当前管理员权限
            this.$store.commit("saveManagerPermission", MangerPermList);
          } else if (userInfo.username != "admin") {
            // 没有获取权限，非admin不允许登录
            return;
          }
          let managerPermission = this.$store.getters.getManagerPermission;
          // 其他权限管理员
          let index = 0;
          this.menuList.forEach(function (item, index) {
            let findRet = managerPermission.find((v) => v.name === item.name);
            if (findRet != undefined) {
              item.permission = findRet.permission;
              if (item.permission > 0) {
                item.permission = 1;
              }
              item.child.forEach(function (subItem, index) {
                let findSubRet = managerPermission.find(
                  (v) => v.name === subItem.name
                );
                if (findSubRet != undefined) {
                  subItem.permission = findSubRet.permission;
                  if (subItem.permission > 0) {
                    item.permission = 1;
                  }
                }
              });
              index++;
              item.index = index;
            }
          });
        }
      }
    },

    // 点击按钮，切换菜单的折叠与展开
    listenIscoll(val) {
      this.isCollapse = val;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
.el-submenu .el-menu-item {
  line-height: 50px;
  text-align: center;
}
.toManage {
  display: block;
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.logo {
  width: 22px;
  height: 22px;
  vertical-align: middle;
}
.sidebarTitle {
  display: inline-block;
  color: #fff;
  font-weight: 600;
  line-height: 60px;
  font-size: 18px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
}
</style>
