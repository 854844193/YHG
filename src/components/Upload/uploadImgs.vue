<template>
  <div>
    <!-- 其他照片上传 -->
    <div v-if="type == 'other'">
      <el-image
        style="
          width: 350px;
          height: 250px;
          border-radius: 10px;
          border: 1px solid gainsboro;
        "
        fit="fill"
        :src="url"
        v-loading="loading"
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
      <el-upload
        ref="upload"
        :show-file-list="false"
        :action="dialogImageUrl"
        :on-success="uploadImgs"
      >
        <el-button size="small" type="primary">
          {{ url ? "重新上传" : "上传照片" }}
        </el-button>
      </el-upload>
    </div>
    <!-- 上传头像 -->
    <div v-if="type == 'avatar'">
      <el-image
        fit="fill"
        :src="url"
        v-loading="loading"
        style="
          border: solid 1px #dadee5;
          width: 180px;
          height: 180px;
          border-radius: 10px;
          box-sizing: border-box;
        "
      >
        <div
          slot="error"
          class="image-slot"
          style="
            width: 100%;
            height: 100%;
            font-size: 70px;
            text-align: center;
            line-height: 178px;
          "
        >
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <el-upload
        ref="upload"
        :show-file-list="false"
        :action="dialogImageUrl"
        :on-success="uploadImgs"
      >
        <el-button size="small" type="primary" plain style="margin-left: 48px">
          {{ url ? "重新上传" : "上传头像" }}
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { baseUrl, baseImgPath } from "@/config/env";
import { uploadFile } from "@/api/getData";
export default {
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "other",
    },
  },
  data() {
    return {
      loading: false,
      url: this.imgUrl,
      dialogImageUrl: baseUrl + "/mgr-file-upload/upload", //上传图片接口
    };
  },
  methods: {
    //上传身份证正反面
    uploadImgs(res, file, fileList) {
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功",
          center: true,
        });
        this.loading = true;
        setTimeout(() => {
          this.url = res.data;
          this.loading = false;
        }, 1000);
        this.$emit("change", res.data);
      } else {
        this.$message({
          type: "error",
          message: "上传失败",
          center: true,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>