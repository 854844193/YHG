<template>
  <div>
    <el-card shadow="never" style="width: 900px">
      <el-form
        ref="ruleForm"
        size="mini"
        class="demo-ruleForm"
        :rules="rules"
        style="margin-left: 20px"
      >
        <!-- 头像 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item style="margin-left: 100px; margin-top: 20px">
              <UpImgs
                type="avatar"
                :imgUrl="dataList1.headImg ? dataList1.headImg : ''"
                @change="saveImgs($event, 1)"
              ></UpImgs>
            </el-form-item>
          </el-col>
          <!-- 右边信息 -->
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label-width="60px"
                  label-position="left"
                  label="护工ID:"
                >
                  <span>{{ dataList1.id }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="星 级:" label-width="50px">
                <el-rate
                  v-model="dataList1.starNum"
                  disabled
                  show-text
                  :texts="texts"
                  text-color="red"
                  style="margin-top: 5px"
                ></el-rate>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label-width="72px"
                  label-position="left"
                  label="护工姓名:"
                >
                  <el-input
                    v-model="form.realName"
                    @input="inputEvent($event, 1)"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item
                label-width="72px"
                label-position="left"
                label="护工年龄:"
              >
                <p>
                  <b style="color: blue">{{ dataList1.age || "？" }}</b
                  >岁
                </p>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="护工性别:" label-width="72px">
                <template style="display: flex">
                  <el-radio v-model="sex" label="1">男</el-radio>
                  <el-radio v-model="sex" label="2" style="margin-left: -10px"
                    >女</el-radio
                  >
                </template>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="优先抢单:" label-width="72px">
                  <el-switch v-model="value1" @change="priority"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实名认证:" label-width="72px">
                  <el-switch
                    v-model="isConfirm"
                    @change="showState"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 详细信息部分 -->
        <!-- 余额、积分 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户余额:" label-width="72px">
              <span style="color: #ff6a00">
                {{ "￥" + dataList1.balance + "元" }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户积分:" label-width="72px">
              <b>{{ dataList1.grade }}</b>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="账 号:" label-width="90px">
            <el-input  :value="dataList1.username"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="密 码:" label-width="90px" prop="password">
            <el-input  :value="dataList1.password" show-password maxlength="18"></el-input>
          </el-form-item>
        </el-col>
        </el-row>-->

        <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="籍 贯:" label-width="90px">
            <el-input v-model="dataList1.nativePlace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="民 族:" label-width="90px">
            <el-input v-model="dataList1.nation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="星 座:" label-width="90px">
            <el-input v-model="dataList1.constellation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="属 相:" label-width="90px">
            <el-input v-model="dataList1.zodiac"></el-input>
          </el-form-item>
        </el-col>
        </el-row>-->

        <!-- 手机号码、昵称 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码:" label-width="72px" prop="phone">
              <el-input
                v-model="form.phone"
                maxlength="11"
                @input="inputEvent($event, 2)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵 称:" label-width="50px">
              <el-input
                v-model="form.nickName"
                @input="inputEvent($event, 3)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 身份证、日期 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号码:" label-width="86px" prop="identId">
              <el-input
                v-model="form.identId"
                maxlength="18"
                @input="inputEvent($event, 4)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期:" label-width="72px">
              <el-date-picker
                v-model="dataList1.birthday"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 民族、空档期 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="民 族:" label-width="50px" prop="identId">
              <el-input
                v-model="dataList1.nation"
                disabled
                maxlength="18"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空档期:" label-width="60px">
              <el-date-picker
                v-model="dataList1.freeTime"
                disabled
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 护理等级、工作年限 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="护理等级:" label-width="72px">
              <el-input v-model="dataList1.nurseLevel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作年限:" label-width="72px">
              <el-input
                autosize
                disabled
                v-model="dataList1.workTime"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 护工类型、共享 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="护工类型:" label-width="72px">
              <el-select
                v-model="dataList1.selfSupport"
                placeholder="请选择护工类型"
              >
                <el-option label="非自营护工" value="0"></el-option>
                <el-option label="自营护工" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否共享:" label-width="72px">
              <el-select v-model="dataList1.share" placeholder="护工是否共享">
                <el-option label="是" value="0"></el-option>
                <el-option label="否" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="联系地址:" label-width="72px">
              <el-input
                type="textarea"
                :rows="1"
                v-model="form.address"
                @input="inputEvent($event, 5)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="自我介绍:" label-width="72px">
              <el-input
                type="textarea"
                disabled
                autosize
                v-model="dataList1.selfIntroduction"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="综合能力:" label-width="72px">
              <el-input
                type="textarea"
                disabled
                autosize
                v-model="dataList1.abilities"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="服务内容:" label-width="72px">
              <el-input
                type="textarea"
                disabled
                autosize
                v-model="dataList1.selfIntroduction"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工作经验:" label-width="72px">
              <el-input
                type="textarea"
                disabled
                autosize
                v-model="dataList1.abilities"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工作风采:" label-width="72px">
              <el-input
                type="textarea"
                disabled
                autosize
                v-model="dataList1.abilities"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 身份证正反面 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证正面:" label-position="top">
              <!-- <el-image
                style="
                  width: 350px;
                  height: 250px;
                  border-radius: 10px;
                  border: 1px solid gainsboro;
                "
                fit="fill"
                :src="dataList1.identIdFront"
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
                :action="dialogImageUrl"
                :on-success="uploadIdPositive"
              >
                <el-button size="small" type="primary">{{
                  dataList1.identIdFront == undefined ? "上传照片" : "重新上传"
                }}</el-button>
              </el-upload> -->
              <UpImgs
                type="other"
                :imgUrl="dataList1.identIdFront ? dataList1.identIdFront : ''"
                @change="saveImgs($event, 2)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证反面:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="dataList1.identIdBack ? dataList1.identIdBack : ''"
                @change="saveImgs($event, 3)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 资格认证 健康证 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资格认证:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="dataList1.nurseCard ? dataList1.nurseCard : ''"
                @change="saveImgs($event, 4)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康证:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="dataList1.healthCard ? dataList1.healthCard : ''"
                @change="saveImgs($event, 5)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
        </el-row>
        <!--  大健康协会认证  核酸检测证明-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="云南省生物医药和大健康产业协会认证书:"
              label-position="top"
            >
              <UpImgs
                type="other"
                :imgUrl="dataList1.nurseCard ? dataList1.nurseCard : ''"
                @change="saveImgs($event, 6)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核酸检测证明:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="dataList1.nurseCard ? dataList1.nurseCard : ''"
                @change="saveImgs($event, 7)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 上岗证 结业证 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="云护工上岗证:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="dataList1.nurseCard ? dataList1.nurseCard : ''"
                @change="saveImgs($event, 8)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医护通培训学校结业证:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="dataList1.nurseCard ? dataList1.nurseCard : ''"
                @change="saveImgs($event, 9)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 犯罪记录、护工二维码-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="无犯罪记录:" label-position="top">
              <UpImgs
                type="other"
                :imgUrl="dataList1.nurseCard ? dataList1.nurseCard : ''"
                @change="saveImgs($event, 10)"
              >
              </UpImgs>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二维码:" label-position="top">
              <QRImgs ref="createQR" type="show"></QRImgs>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 优惠券、护工信息小程序二维码 -->
        <el-row :gutter="20">
          <el-col
            :span="12"
            v-has="{
              name:
                isShow == '1'
                  ? '自营护工列表'
                  : isShow == '2'
                  ? '非自营护工列表'
                  : '服务商列表',
              type: '4',
            }"
          >
            <el-form-item label="优惠券:" label-width="60px">
              <el-select
                v-model="couponId"
                placeholder="请选择"
                @change="selectedCoupon"
              >
                <el-option
                  v-for="item in couponList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -10px">
              <QRImgs ref="createQRW" type="create"></QRImgs>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-has="{
              name:
                isShow == '1'
                  ? '自营护工列表'
                  : isShow == '2'
                  ? '非自营护工列表'
                  : '服务商列表',
              type: '4',
            }"
          >
            <el-form-item label="小程序护工信息二维码:" label-position="top">
              <QRImgs ref="createQRN" type="show"></QRImgs>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 提交 -->
        <el-button
          type="primary"
          plain
          class="editBtn"
          v-has="{
            name:
              isShow == '1'
                ? '自营护工列表'
                : isShow == '2'
                ? '非自营护工列表'
                : '服务商列表',
            type: '2',
          }"
          @click="submitUpdate"
        >
          提交修改
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  updateInfo,
  getUserQRcode,
  getWeiQRcode,
  getCouponModel,
} from "@/api/getData";
import UpImgs from "components/Upload/uploadImgs";
import QRImgs from "components/Upload/qrCodeImg";
import QRCode from "qrcodejs2";
export default {
  name: "nurseInfo", // 护工基本信息
  props: {
    row1: {
      type: Object,
    },
    row2: {
      type: Object,
    },
    isShow: {
      type: Number,
    },
  },
  components: { UpImgs, QRImgs },
  data() {
    return {
      isConfirm: false,
      sex: 0,
      texts: ["1星", "2星", "3星", "4星", "5星"],
      form: {
        realName: "",
        nickName: "",
        phone: "",
        address: "",
        identId: "",
      },
      dataList1: {},
      couponList: [],
      couponId: "",
      nurseId: "",
      rules: {
        password: [
          { min: 6, message: "密码为6~18位", trigger: ["blur", "change"] },
        ],
        phone: [
          {
            pattern: /^1[345789]\d{9}$/, //可以写正则表达式,
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
      value1: false,
      ruleForm: "",
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.getCouponList();
      if (this.row1 != undefined) {
        this.getQRcode(this.row1.id);
        this.nurseId = this.row1.id;
        this.isConfirm = Boolean(this.row1.state);
        this.value1 = Boolean(this.row1.commend);
        this.sex = this.row1.sex + "";
        this.row1.share += "";
        if (this.row1.identId) {
          this.row1.birthday = this.GetInfoByCard.getBirth(this.row1.identId);
          if (this.row1.birthday) {
            this.row1.age = this.GetInfoByCard.getAge(this.row1.birthday);
          }
        }
        this.dataList1 = this.row1;
        this.form.realName = this.row1.realName;
        this.form.nickName = this.row1.nickname;
        this.form.phone = this.row1.phone;
        this.form.identId = this.row1.identId;
        this.form.address = this.row1.address;
      } 
    },
    //修改字段内容
    inputEvent(e, n) {
      if (n == 1) this.dataList1.realName = e;
      if (n == 2) this.dataList1.phone = e;
      if (n == 3) this.dataList1.nickname = e;
      if (n == 4) this.dataList1.identId = e;
      if (n == 5) this.dataList1.address = e;
    },
    // 上传图片
    saveImgs(url, num) {
      if (num == 1) this.dataList1.headImg = url;
      if (num == 2) this.dataList1.identIdFront = url;
      if (num == 3) this.dataList1.identIdBack = url;
      if (num == 4) this.dataList1.nurseCard = url;
      if (num == 5) this.dataList1.healthCard = url;
      if (num == 6) this.dataList1.nurseCard = url;
      if (num == 7) this.dataList1.nurseCard = url;
      if (num == 8) this.dataList1.nurseCard = url;
      if (num == 9) this.dataList1.nurseCard = url;
      if (num == 10) this.dataList1.nurseCard = url;
    },
    //获取护工二维码
    async getQRcode(id) {
      const res = await getUserQRcode({
        height: 250,
        width: 250,
        id: id,
      });
      if (res.code == 200) {
        // this.qRcode = res.data;
        this.$refs.createQR.fresh(res.data);
      }
      const resN = await getWeiQRcode({
        page: "pages/nurseDetail/index",
        id: id,
      });
      if (resN.code == 200) {
        // this.qRcodeNurse = resN.data;
        this.$refs.createQRN.fresh(resN.data);
      }
    },
    // 查询优惠券模板
    async getCouponList() {
      const res = await getCouponModel({
        pageNum: 1,
        pageSize: 10000,
      });
      if (res.code == 200) {
        this.couponList = res.data.records;
      } else {
        console.log(res);
      }
    },
    // 生成优惠券
    async selectedCoupon() {
      const resW = await getWeiQRcode({
        page: "pages/Index/Index",
        type: "coupon",
        nurseId: this.nurseId,
        id: this.couponId,
      });
      if (resW.code == 200) {
        this.$refs.createQRW.fresh(resW.data);
      } else {
        console.log(resW);
      }
    },

    //判断是否实名认证
    showState() {
      this.isConfirm == true
        ? (this.dataList1.state = 1)
        : (this.dataList1.state = 0);
    },
    // 优先抢单
    priority() {
      this.value1 == true
        ? (this.dataList1.commend = 1)
        : (this.dataList1.commend = 0);
    },
    // 提交修改
    async submitUpdate() {
      let appUser = this.dataList1;
      appUser.userId = this.dataList1.id;
      appUser.sex = this.sex;
      console.log(appUser);
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
@import "../../../style/mixin";
.demo-ruleForm .el-form-item__label {
  width: 270px;
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
  width: 280px;
}
.demo-ruleForm .el-textarea {
  width: 720px;
}
</style>
