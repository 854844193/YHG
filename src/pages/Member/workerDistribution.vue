<template>
  <div id="container" class="mymap"></div>
</template>

<script>
import AMap from "AMap"; //在页面中引入高德地图

export default {
  mounted() {
    this.loadmap(); //加载地图和相关组件
  },
  methods: {
    loadmap() {
      var markerList = [
        [102.70776, 25.03163],
        [102.70786, 25.03168],
        [102.70762, 25.03178],
        [102.70753, 25.0316],
        [102.7078, 25.03164],
        [102.70784, 25.03178],
        [102.75108, 25.012271],
        [102.68414, 25.03595],
        [102.713519, 25.048254],
        [102.681912, 25.05378],
        [102.719574, 25.027937],
        [102.667382, 25.042867],
        [102.711436, 25.031313],
      ];
      // const map = new AMap.Map('container', {
      //   zoom: 9
      // });

      var marker,
        map = new AMap.Map("container", {
          resizeEnable: true,
          center: [102.72, 25.05],
          zoom: 13,
        });
      if (marker) {
        return;
      }

      // 渲染每个护工的位置
      markerList.forEach((item) => {
        marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
          position: item,
        });
        marker.setMap(map);
      });
    },
  },
};
</script>
<style scoped>
.mymap {
  width: 100%;
  height: 100%;
}
</style>



