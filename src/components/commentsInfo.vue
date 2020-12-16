<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      size="mini"
      class="demo-ruleForm"
      :inline="true"
      @submit.native.prevent
    >
    <el-card shadow="hover" class="commentsCard">
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="90px" label="客户姓名:">
            <el-input v-model="row.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户电话:" label-width="90px">
            <el-input v-model="row.phone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户邮箱:" label-width="90px">
            <el-input v-model="row.email" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="留言时间:" label-width="90px">
            <el-input v-model="row.createTime" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
          <el-form-item label="留言标题:" label-width="90px">
            <el-input type="textarea" :rows="1" v-model="row.title" disabled style="width:500px"></el-input>
          </el-form-item>
      </el-row>

      <el-row>
        <el-col >
          <el-form-item label="留言内容:" label-width="90px">
            <el-input type="textarea" :rows="5" v-model="row.content" disabled style="width:500px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col >
          <el-form-item label="回复内容:" label-width="90px">
            <el-input type="textarea" :rows="5" v-model="row.reply" style="width:500px" placeholder="请输入回复内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row>
          <el-col :span="9">
            <el-form-item label="上传图片:" label-width="90px">
              <div class="advertisingImg">
                <el-image
                  style="width: 100%; height: 100%; border-radius: 10px;"
                  :src="formLabelAlign.url"
                  fit="contain"
                ></el-image>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-upload
          class="upload-demo"
          :action="dialogImageUrl"
          :on-success="handleSuccess"
          style="margin-left: 90px;"
        >
          <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>-->
      <el-button type="primary" native-type="submit" class="editBtn" v-has="{name:'客户留言', type:'3'}" @click="submitReply">回 复</el-button>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { uploadFile, updateInfo } from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
export default {
  baseUrl,
  props: {
    row: {
      type: Object,
    },
  },
  data() {
    return {
      ruleForm: {},
      form: {},
      dialogImageUrl: baseUrl + "/mgr-file-upload/upload", //上传图片接口
    };
  },
  created() {
    console.log(this.row);
  },
  methods: {
    // 上传图片成功
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      if (response.code == 200) {
        this.$message({
          type: "success",
          message: "图片上传成功",
        });
        this.formLabelAlign.url = response.data;
      }
    },
    // 提交回复
    submitReply() {
      this.$confirm("此操作将修改用户信息, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          let appUser = this.row;
          appUser.userId = this.row.id;
          this.updateUser(appUser);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
            center: true,
          });
        });
    },

    async updateUser(appUser) {
      const res = await updateInfo(appUser);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.data,
          center: true,
        });
      } else {
        this.$message({
          type: "error",
          message: res.message,
          center: true,
        });
      }
    },
  },
};
</script>

<style lang="less">
.testFile {
  position: absolute;
  cursor: pointer;
  opacity: 0;
  left: 0px;
  top: 0px;
}
.commentsCard {
  width: 734px;
  background-color: ghostwhite;
  padding-left: 20px;
}
.editBtn {
  float: right;
  margin: 20px 0 10px 0;
}
</style>
