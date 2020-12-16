<template>
  <div>
    <el-form
      :model="nursedata"
      ref="ruleForm"
      size="mini"
      :rules="rules"
      @submit.native.prevent
    >
      <div style="display: flex; width: 100%; margin: 0 auto">
        <div style="margin-right: 40px">
          <el-form-item label="账 号:" label-width="90px" prop="username">
            <el-input
              v-model="nursedata.username"
              clearable
              placeholder="请输入护工账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="密 码:" label-width="90px" prop="password">
            <el-input
              v-model="nursedata.password"
              placeholder="请输入密码"
              show-password
              clearable
              maxlength="18"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="90px" prop="realName" label="护工姓名:">
            <el-input
              v-model="nursedata.realName"
              clearable
              placeholder="请输入护工姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码:" label-width="90px" prop="phone">
            <el-input
              v-model="nursedata.phone"
              placeholder="请输入护工手机号码"
              clearable
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号码:" label-width="100px" prop="identId">
            <el-input
              v-model="nursedata.identId"
              placeholder="请输入护工身份证号码"
              maxlength="18"
              clearable
              @input="getBirthday(nursedata.identId)"
            ></el-input>
          </el-form-item>
          <el-form-item label="生 日:" label-width="90px" prop="birthday">
            <el-date-picker
              v-model="nursedata.birthday"
              type="date"
              placeholder="选择生日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="性 别:" label-width="90px">
            <el-radio-group v-model="nursedata.sex">
              <el-radio label="1" disabled>男</el-radio>
              <el-radio label="2" disabled>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="护工类型:" label-width="90px">
            <el-select
              v-model="nursedata.selfSupport"
              placeholder="请选择护工类型"
              disabled
            >
              <el-option label="非自营护工" value="0"></el-option>
              <el-option label="自营护工" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否共享:" label-width="90px">
            <el-select v-model="nursedata.share" placeholder="护工是否共享">
              <el-option label="是" value="0"></el-option>
              <el-option label="否" value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item>
          <UpImgs
            type="avatar"
            :imgUrl="nursedata.headImg ? nursedata.headImg : ''"
            @change="saveImgs($event, 1)"
          ></UpImgs>
        </el-form-item>
      </div>
    </el-form>
    <div class="addBtn">
      <el-button @click="handleCloseAdd('ruleForm')" type="danger" size="small"
        >关 闭</el-button
      >
      <el-button
        type="primary"
        size="small"
        native-type="submit"
        @click="submitAdd('ruleForm')"
        >添加护工</el-button
      >
    </div>
  </div>
</template>

<script>
import { addNurse } from "@/api/getData";
import UpImgs from "components/Upload/uploadImgs";
const defaultNurseQuery = {
  type: 1,
  headImg: "",
  username: "",
  password: "",
  realName: "",
  sex: "1",
  phone: "",
  identId: "",
  selfSupport: "",
  share: "1",
};
export default {
  name: "nurseInfo", // 护工基本信息
  props: {
    selfSupport: {
      type: Number,
    },
  },
  components: { UpImgs },
  data() {
    return {
      radio: "1",
      isConfirm: false,
      nurseList: [],
      nursedata: Object.assign({}, defaultNurseQuery),
      rules: {
        username: [
          { required: true, message: "请输入护工名称", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码为6~18位", trigger: ["blur", "change"] },
        ],
        realName: [
          { required: true, message: "请输入护工姓名", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请输入11位的电话号码",
            trigger: "blur",
          },
          {
            pattern: /^1[345789]\d{9}$/, //可以写正则表达式呦呦呦,
            message: "输入的号码格式不对",
            trigger: "blur",
          },
        ],
        identId: [
          { required: true, message: "请输入护工身份证ID", trigger: "blur" },
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
    this.nursedata.selfSupport = this.selfSupport + "";
  },
  methods: {
    // 上传头像
    saveImgs(url, num) {
      if (num == 1) this.nursedata.headImg = url;
    },
    // 添加护工
    async submitAdd(ruleForm) {
      console.log(this.nursedata);
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          // this.nursedata.realName = this.nursedata.realName.replace(/\s*/g, "");
          // this.nursedata.realName = this.nursedata.phone.replace(/\s*/g, "");
          // this.nursedata.realName = this.nursedata.identId.replace(/\s*/g, "");
          this.nurseList = [];
          this.nurseList.push(this.nursedata);
          const res = await addNurse(this.nurseList);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: res.data,
              center: true,
            });
            this.$emit("callback", res.code);
            this.nursedata = Object.assign({}, defaultNurseQuery);
          } else {
            this.$message({
              type: "error",
              message: res.message,
              center: true,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //根据身份证获取出生日期和性别
    getBirthday(idCard) {
      this.nursedata.birthday = this.GetInfoByCard.getBirth(idCard);
      this.nursedata.sex = this.GetInfoByCard.getGender(idCard);
    },

    //关闭添加dialog
    handleCloseAdd(formName) {
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.$emit("cancel");
      this.nursedata = Object.assign({}, defaultNurseQuery);
      this.showAddDialog = false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
.addBtn {
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin: 20px auto;
}
</style>
