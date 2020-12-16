<template>
  <div>
    <el-card shadow="hover" style="width: 900px">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        size="mini"
        class="demo-ruleForm"
        :rules="rules"
        style="margin-left: 20px"
      >
        <!-- 服务商账号、id -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务商账号:" label-width="86px">
              <span>{{ row.username }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="74px"
              label-position="left"
              label="服务商ID:"
            >
              <span>{{ row.id }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 实名认证、性别 -->
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
            <el-form-item label="服务商性别:" label-width="86px">
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
                {{ "￥" + row.balance + "元" }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户积分:" label-width="72px">
              <b>{{ row.grade }}</b>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 姓名、身份证号码 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务商姓名:" label-width="86px">
              <el-input
                v-model="foreman.realName"
                @input="inputEvent($event, 1)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号:" label-width="72px" prop="identId">
              <el-input
                v-model="foreman.identId"
                maxlength="18"
                @input="inputEvent($event, 3)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 出生日期、手机号 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出生日期:" label-width="72px">
              <el-date-picker
                v-model="row.birthday"
                type="date"
                disabled
                placeholder="选择日期"
                @input="inputEvent($event, 5)"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码:" label-width="72px" prop="phone">
              <el-input
                v-model="foreman.phone"
                maxlength="11"
                @input="inputEvent($event, 2)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 昵称、地址 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务商昵称:" label-width="86px" prop="phone">
              <el-input
                v-model="foreman.nickname"
                @input="inputEvent($event, 6)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="联系地址:" label-width="72px">
              <el-input
                type="textarea"
                :rows="1"
                v-model="foreman.address"
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
                :imgUrl="
                  foremanData.identIdFront ? foremanData.identIdFront : ''
                "
                @change="saveImgs($event, 1)"
              ></UpImgs>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="foremanData.identIdBack ? foremanData.identIdBack : ''"
                @change="saveImgs($event, 2)"
              ></UpImgs>
            </el-form-item>
          </el-col>
        </el-row>

        <el-button
          v-has="{ name: '服务商列表', type: '2' }"
          type="primary"
          plain
          class="editBtn"
          @click="submitUpdate"
        >
          提交修改
        </el-button>
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
      radio: "1",
      sex: 0,
      isConfirm: false,
      ruleForm: {},
      foreman: {
        realName: "",
        phone: "",
        address: "",
        identId: "",
        birthday: "",
        nickname: "",
      },
      foremanData: {},
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
    console.log(this.row);
    this.foremanData = this.row;
    if (this.foremanData.identId) {
      this.foremanData.birthday = this.GetInfoByCard.getBirth(
        this.foremanData.identId
      );
      if (this.foremanData.birthday) {
        this.foremanData.age = this.GetInfoByCard.getAge(
          this.foremanData.birthday
        );
      }
    }
    this.isConfirm = Boolean(this.foremanData.state);
    this.sex = this.foremanData.sex + "";
    this.foreman.realName = this.row.realName;
    this.foreman.phone = this.row.phone;
    this.foreman.identId = this.row.identId;
    this.foreman.address = this.row.address;
  },
  methods: {
    //修改字段内容
    inputEvent(e, n) {
      if (n == 1) this.foremanData.realName = e;
      if (n == 2) this.foremanData.phone = e;
      if (n == 3) this.foremanData.identId = e;
      if (n == 4) this.foremanData.address = e;
      if (n == 5) this.foremanData.birthday = e;
      if (n == 6) this.foremanData.nickname = e;
    },

    //上传身份证正反面
    saveImgs(url, num) {
      if (num == 1) this.foremanData.identIdFront = url;
      if (num == 2) this.foremanData.identIdBack = url;
    },

    //判断是否实名认证
    showState() {
      this.isConfirm == true
        ? (this.foremanData.state = 1)
        : (this.foremanData.state = 0);
    },

    // 提交修改
    async submitUpdate() {
      this.foremanData.sex = this.sex;
      let appForeman = this.foremanData;
      appForeman.userId = this.foremanData.id;
      const res = await updateInfo(appForeman);
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

<style lang="less">
.editBtn {
  margin: 20px 20% 10px 0;
}
.demo-ruleForm .el-form-item__label {
  width: 100px;
  text-align: left;
  color: #99a9bf;
}
.demo-ruleForm .el-form-item {
  width: 50%;
}
.demo-ruleForm .el-input--mini .el-input__inner {
  width: 300px;
}
.demo-ruleForm .el-textarea {
  width: 720px;
}
</style>
