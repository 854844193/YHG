<template>
  <div class="mainBox">
    <el-card shadow="hover" class="needsCard">
      <el-form ref="ruleForm" size="mini" class="demo-ruleForm">
        <!-- 订单需求信息 -->
        <el-row>
          <el-form-item>
            <h2 style="text-align: center">订单需求信息</h2>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label-width="60px"
              label-position="left"
              label="需求ID:"
            >
              <span>{{ needsDetails.id || "" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户ID:" label-width="60px">
              <span>{{ needsDetails.userId || "" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="患者ID:" label-width="60px">
              <span>{{ needsDetails.beNursedId || "" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="72px"
              label-position="left"
              label="患者姓名:"
            >
              <span>{{ needsDetails.realName || "" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="患者身份证:" label-width="86px">
              <span>{{ needsDetails.identId || "" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="患者电话:" label-width="72px">
              <span>{{ needsDetails.phone || "" }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="患者自理能力:" label-width="100px">
              <span>{{ needsDetails.selfCare || "" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="护理类型:" label-width="72px">
              <span style="color: blue">{{
                needsDetails.demandName || ""
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="服务时段:" label-width="72px">
              <span>{{ needsDetails.serverTime || "" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务天数:" label-width="72px">
              <span>{{ needsDetails.totalTime || "0" }}</span
              >天
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="价格:" label-width="45px">
              <p>
                ￥
                <span style="color: orange">{{
                  needsDetails.price || "0.00"
                }}</span
                >元
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参考价:" label-width="58px">
              <p>
                ￥
                <span style="color: orange">{{
                  needsDetails.preferPrice || "0.00"
                }}</span
                >元
              </p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="护理位置:" label-width="72px">
              <!-- <el-input :value="needsDetails.area+needsDetails.address||'无'"></el-input> -->
              <span>{{ needsDetails.serverSite || "暂无信息" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="护理地址:" label-width="72px">
              <span>{{
                needsDetails.area + needsDetails.address || "暂无信息"
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始服务日期:" label-width="100px">
              <el-date-picker
                readonly
                v-model="needsDetails.startTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止服务日期:" label-width="100px">
              <el-date-picker
                v-model="needsDetails.endTime"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="checkTime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="需求详情:" label-width="72px">
            <el-input
              type="textarea"
              :rows="1"
              v-model="needsDetails.notes"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-button
          plain
          type="primary"
          class="editBtn"
          v-has="{ name: '订单需求表', type: '2' }"
          @click="submitUpdate"
          >提 交</el-button
        >
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updateNeeds } from "@/api/getData";
export default {
  name: "needsInfo", // 服务单基本信息
  props: {
    row: {
      type: Object,
    },
    nurseName: {
      type: String,
    },
  },
  data() {
    return {
      radio: "1",
      needsDetails: {},
      value1: true,
      orderType: "",
      orderStatus: "",
      ruleForm: "",
    };
  },
  created() {
    console.log(this.row);
    localStorage.setItem("endTime", JSON.stringify(this.row.endTime));
    this.needsDetails = this.row;
  },
  methods: {
    //判断修改的截止时间是否在开始时间之前
    checkTime() {
      var oDate1 = new Date(this.needsDetails.startTime);
      var oDate2 = new Date(this.needsDetails.endTime);
      if (oDate1.getTime() > oDate2.getTime()) {
        // console.log(JSON.parse(localStorage.getItem('endTime')))
        this.$alert("服务截止时间必须在服务开始时间之后", "注意", {
          type: "warning",
          center: true,
          confirmButtonText: "确定",
        });
        this.needsDetails.endTime = JSON.parse(localStorage.getItem("endTime"));
      }
    },
    // 提交
    submitUpdate() {
      this.$confirm("确定修改?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          console.log("11111");
          this.upd();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
            center: true,
          });
        });
    },
    async upd() {
      console.log(this.needsDetails);
      const res = await updateNeeds({
        endTime: this.needsDetails.endTime,
        id: this.needsDetails.id,
        notes: this.needsDetails.notes,
      });
      console.log(res);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.message,
          center: true,
        });
        this.$emit("change");
      }
    },
  },
};
</script>

<style lang="less">
.mainBox {
  width: 100%;
  height: 100%;
}

.needsCard {
  width: 800px;
  background-color: ghostwhite;
}
.needsCard .el-textarea {
  width: 656px;
}
.needsCard .el-input--mini .el-input__inner {
  width: 250px;
}

.editBtn {
  float: right;
  margin: 20px 10px 10px 0;
}
</style>
