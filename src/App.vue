<template>
  <div id="app" class="fillcontain">
    <router-view></router-view>
  </div>
</template>

<script>
import { Toast } from "element-ui";
export default {
  mounted() {
    // console.log("store.state" + JSON.stringify(this.$store.state));
    window.addEventListener("unload", this.saveState);
  },
  methods: {
    saveState() {
      sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    },
  },
};
</script>

<style lang="less">
@import "./style/common";
</style>
