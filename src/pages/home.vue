<template>
  <div class="fillcontain">
    <dataShow v-if="isRouterAlive"></dataShow>
  </div>
</template>

<script>
import dataShow from "components/dataShow";
export default {
  name: "home",
  data() {
    return {
      isRouterAlive: true,
    };
  },
  components: {
    dataShow,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },

  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
.fillcontain {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  z-index: -10;
  zoom: 1;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
</style>
