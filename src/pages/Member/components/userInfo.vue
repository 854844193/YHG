<template>
  <div class="mainBox">
    <el-card shadow="hover" style="width: 900px">
      <el-form
        ref="ruleForm"
        size="mini"
        class="demo-ruleForm"
        :rules="rules"
        @submit.native.prevent
        style="margin-left: 20px"
      >
        <!-- 用户账号、用户ID -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户账号:" label-width="72px">
              <span>{{ nurseData.username }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户ID:" label-width="60px">
              <b>{{ nurseData.id }}</b>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 实名认证、用户性别 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="实名认证:" label-width="72px">
              <el-switch
                disabled
                v-model="isConfirm"
                @change="showState"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别:" label-width="72px">
              <el-radio v-model="sex" label="1">男</el-radio>
              <el-radio v-model="sex" label="2">女</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 账户余额、账户积分 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户余额:" label-width="72px">
              <span style="color: #ff6a00">
                {{ "￥" + nurseData.balance + "元" }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户积分:" label-width="72px">
              <b>{{ nurseData.grade }}</b>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 用户姓名、出生日期-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label-width="72px"
              label-position="left"
              label="用户姓名:"
            >
              <el-input
                v-model="form.realName"
                @input="inputEvent($event, 1)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期:" label-width="72px">
              <el-date-picker
                v-model="nurseData.birthday"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 手机号码、身份证号 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码:" label-width="72px" prop="phone">
              <el-input
                v-model="form.phone"
                maxlength="11"
                style="width: 300px"
                @input="inputEvent($event, 2)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号:" label-width="72px" prop="identId">
              <el-input
                v-model="form.identId"
                maxlength="18"
                style="width: 300px"
                @input="inputEvent($event, 3)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 联系地址 -->
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="联系地址:" label-width="72px">
              <el-input
                type="textarea"
                :rows="1"
                v-model="form.address"
                @input="inputEvent($event, 4)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 身份证正反面 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证正面:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="nurseData.identIdFront ? nurseData.identIdFront : ''"
                @change="saveImgs($event, 1)"
              ></UpImgs>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="nurseData.identIdFront ? nurseData.identIdFront : ''"
                @change="saveImgs($event, 1)"
              ></UpImgs>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          type="primary"
          plain
          class="editBtn"
          v-has="{ name: '用户列表', type: '2' }"
          @click="submitUpdate"
          >提交修改</el-button
        >
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updateInfo } from "@/api/getData";
import UpImgs from "components/Upload/uploadImgs";
export default {
  props: {
    row: {
      type: Object,
    },
  },
  components: { UpImgs },
  data() {
    return {
      names: "",
      radio: "1",
      isConfirm: false,
      sex: "0",
      value1: true,
      form: {
        realName: "",
        phone: "",
        address: "",
        identId: "",
      },
      nurseData: {},
      rules: {
        password: [
          { min: 6, message: "密码为6~18位", trigger: ["blur", "change"] },
        ],
        phone: [
          {
            pattern: /^1[345789]\d{9}$/, //可以写正则表达式呦呦呦,
            message: "输入的号码格式不对",
            trigger: "blur",
          },
        ],
        identId: [
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.nurseData = this.row;
    this.form.realName = this.row.realName;
    this.form.phone = this.row.phone;
    this.form.identId = this.row.identId;
    this.form.address = this.row.address;
    this.isConfirm = Boolean(this.nurseData.state);
    this.sex = this.nurseData.sex + "";
  },
  methods: {
    //修改字段内容
    inputEvent(e, n) {
      if (n == 1) this.nurseData.realName = e;
      if (n == 2) this.nurseData.phone = e;
      if (n == 3) this.nurseData.identId = e;
      if (n == 4) this.nurseData.address = e;
    },
    //上传身份证正反面
    uploadImgs(imgUrl, res, file, fileList) {
      if (res.code == 200) {
        imgUrl = res.data;
        console.log(imgUrl);
        console.log(this.nurseData.identIdFront);
        this.$message({
          type: "success",
          message: "上传成功",
        });
        this.$refs.upload.clearFiles();
        fileList--;
      } else {
        this.$message({
          type: "error",
          message: "上传失败",
        });
      }
    },
    saveImgs(url, num) {
      if (num == 1) this.nurseData.identIdFront = url;
      if (num == 2) this.nurseData.identIdBack = url;
    },

    //判断是否实名认证
    showState() {
      console.log(this.isConfirm);
      this.isConfirm == true
        ? (this.nurseData.state = 1)
        : (this.nurseData.state = 0);
      console.log(this.nurseData.state);
    },

    // 提交
    submitUpdate() {
      this.$confirm("此操作将修改用户信息, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.nurseData.sex = this.sex;
          let appUser = this.nurseData;
          appUser.userId = this.nurseData.id;
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
        this.$emit("callBack", res.code);
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

<style lang="less" >
.demo-ruleForm .el-form-item__label {
  width: 100px;
  text-align: left;
  color: #99a9bf;
}
.demo-ruleForm .el-form-item {
  width: 50%;
}

.demo-ruleForm .editBtn {
  float: right;
  margin: 20px 10px 10px 0;
}
.demo-ruleForm .el-input--mini .el-input__inner {
  width: 300px;
}
.demo-ruleForm .el-textarea {
  width: 720px;
}
</style>
