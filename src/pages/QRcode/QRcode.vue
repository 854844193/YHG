<template>
  <div class="table_container">
    <el-button
      size="mini"
      type="primary"
      style="margin-bottom: 10px"
      @click="createQR"
    >
      点击生成二维码
    </el-button>
    <QRImgs ref="createQR" type="create"></QRImgs>
    <!-- 参数配置 -->
    <el-dialog
      title="二维码配置项"
      center
      :visible.sync="dialogFormVisible"
      :before-close="closeQRprams"
      width="840px"
    >
      <el-form
        :model="QRprams"
        ref="QRprams"
        size="mini"
        label-width="110px"
        class="demo-dynamic"
      >
        <el-form-item
          label="二维码类型:"
          prop="type"
          :rules="[
            {
              required: true,
              message: '请选择生成二维码类型',
              trigger: 'blur',
            },
          ]"
        >
          <el-select
            v-model="QRprams.type"
            class="parmItem"
            placeholder="选择生成的二维码的类型"
            clearable
          >
            <el-option
              v-for="item in codeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span v-if="QRprams.type" style="color: #f56c6c; margin-left: 75px">
            *当前必传
            <b>key</b>：
            <b style="color: #409eff">{{ checkPrams(QRprams.type) }}</b>
          </span>
        </el-form-item>
        <el-row v-for="(item, index) in parmsList" :key="index">
          <el-col :span="10">
            <el-form-item label="key">
              <el-input
                class="parmItem"
                v-model="item.name"
                placeholder="请输入参数名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="value">
              <el-input
                class="parmItem"
                v-model="item.value"
                placeholder="请输入参数值"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              @click.prevent="removeParm(item)"
              type="danger"
              size="mini"
            >
              删除
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPrams('QRprams')" size="mini">
          重 置
        </el-button>
        <el-button @click="addPram" size="mini">新增参数 </el-button>
        <el-button type="primary" @click="submitParms('QRprams')" size="mini">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserQRcode, getWeiQRcode } from "@/api/getData";
import QRImgs from "components/Upload/qrCodeImg";
const defaultQRprams = {
  page: "",
  type: "",
};
export default {
  data() {
    return {
      detailPage: "pages/nurseDetail/index",
      couponPage: "pages/Index/Index",
      QRprams: Object.assign({}, defaultQRprams),
      parmsList: [{ name: "", value: "" }],
      dialogFormVisible: false,
      codeTypeVisible: false,
      codeType: [
        {
          label: "优惠券",
          value: "coupon",
        },
        {
          label: "用户详情",
          value: "detail",
        },
        {
          label: "服务商",
          value: "merchant",
        },
      ],
    };
  },
  components: { QRImgs },
  methods: {
    createQR() {
      this.dialogFormVisible = true;
    },
    // 检查参数主要类型的参数
    checkPrams(type) {
      if (type == "detail") return "id";
      if (type == "coupon") return "nurseId";
      if (type == "merchant") return "merchantId";
    },
    // 提交参数生成小程序二维码
    submitParms(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.QRprams.type == "detail")
            this.QRprams.page = this.detailPage;
          if (this.QRprams.type == "coupon")
            this.QRprams.page = this.couponPage;
          if (this.QRprams.type == "merchant")
            this.QRprams.page = this.couponPage;
          this.parmsList.forEach((item, index) => {
            this.QRprams[item.name] = item.value;
          });
          console.log(this.QRprams);
          let parms = this.objReSet(this.QRprams);
          const res = await getWeiQRcode(parms);
          this.$message({
            type: "success",
            message: res.message,
            center: true,
          });
          this.dialogFormVisible = false;
          this.$refs.createQR.fresh(res.data);
          this.QRprams = Object.assign({}, defaultQRprams);
          this.parmsList.forEach((item) => {
            item.name = "";
            item.value = "";
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetPrams(formName) {
      this.$refs[formName].resetFields();
      this.parmsList.forEach((item) => {
        item.name = "";
        item.value = "";
      });
    },
    removeParm(item) {
      var index = this.parmsList.indexOf(item);
      if (index !== -1) {
        this.parmsList.splice(index, 1);
      }
    },
    addPram() {
      this.parmsList.push({
        name: "",
        value: "",
        key: Date.now(),
      });
    },
    closeQRprams() {
      this.resetPrams("QRprams");
      this.dialogFormVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.parmItem {
  width: 200px;
}
</style>