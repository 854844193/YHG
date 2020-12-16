<template>
  <div id="container" class="mymap"></div>
</template>

<script>
import AMap from "AMap"; //在页面中引入高德地图

export default {
  data() {
    return {
      resData: "",
    };
  },
  mounted() {
    this.loadmap(); //加载地图和相关组件
  },
  methods: {
    loadmap() {
      var markerList = [
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
        [102.715, 25.037],
        [102.7432, 25.03987],
        [102.6923, 25.0],
        [102.6923, 24.957],
        [102.723, 24.947],
        [102.754436, 24.956603],
        [102.752136, 24.9549],
        [102.755298, 24.949134],
        [102.706574, 25.002196],
        [102.762125, 24.976257],
        [102.703125, 25.008156],
        [102.847428, 24.885232],
        [102.836792, 24.895721],
        [102.733883, 25.028588],
        [102.711461, 25.011561],
        [102.717785, 25.012085],
        [102.75458, 25.007894],
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

      markerList.forEach((item) => {
        marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
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



