<template>
  <div>
    <el-image
      v-if="type == 'show'"
      style="
        width: 250px;
        height: 250px;
        border-radius: 10px;
        border: 1px solid gainsboro;
      "
      fit="fill"
      :src="'data:image/png;base64,' + qrUrl"
    >
      <div
        slot="error"
        class="image-slot"
        style="
          width: 100%;
          height: 100%;
          font-size: 100px;
          text-align: center;
          line-height: 250px;
        "
      >
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    <el-image
      v-if="type == 'create'"
      style="
        width: 250px;
        height: 250px;
        border-radius: 10px;
        border: 1px solid gainsboro;
      "
      fit="fill"
      v-loading="loading"
      :src="'data:image/png;base64,' + qrUrl"
    >
      <div
        slot="error"
        class="image-slot"
        style="
          width: 100%;
          height: 100%;
          font-size: 100px;
          text-align: center;
          line-height: 250px;
        "
      >
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      qrUrl: "",
    };
  },
  methods: {
    fresh(url) {
      this.loading = true;
      if(this.type=="show"){
      setTimeout(() => {
        this.qrUrl = url;
        this.loading = false;
      }, 500);
      }else if(this.type=="create"){}
      setTimeout(() => {
        this.qrUrl = url;
        this.loading = false;
      }, 1500);
    },
  },
};
</script>

<style lang="less" scoped>
</style>