<template>
  <div class="acc">
    <el-form
      :model="accRules"
      size="mini"
      label-width="96px"
      ref="accRules"
      label-position="left"
      :rules="rules"
      @submit.native.prevent
    >
      <el-row class="accItem">
        <el-form-item label="流量方:" prop="introducer">
          <el-input
            v-model="accRules.introducer"
            auto-complete="off"
            style="width: 80px"
            placeholder="请输入固定额/百分比"
          ></el-input>
        </el-form-item>
        <el-form-item class="accStyle">
          <el-radio-group v-model="accRules.introducerCompany">
            <el-radio label="0">固定额</el-radio>
            <el-radio label="1" class="per">百分比</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row class="accItem">
        <el-form-item label="服务方:" prop="nurse">
          <el-input
            v-model="accRules.nurse"
            auto-complete="off"
            style="width: 80px"
            placeholder="请输入固定额/百分比"
          ></el-input>
        </el-form-item>
        <el-form-item class="accStyle">
          <el-radio-group v-model="accRules.nurseCompany">
            <el-radio label="0">固定额</el-radio>
            <el-radio label="1" class="per">百分比</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row class="accItem">
        <el-form-item label="护工归属方:" prop="foreman">
          <el-input
            v-model="accRules.foreman"
            auto-complete="off"
            style="width: 80px"
            placeholder="请输入固定额/百分比"
          ></el-input>
        </el-form-item>
        <el-form-item class="accStyle">
          <el-radio-group v-model="accRules.foremanCompany">
            <el-radio label="0">固定额</el-radio>
            <el-radio label="1" class="per">百分比</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-form-item label="描 述:" prop="note">
        <el-input
          type="textarea"
          v-model="accRules.note"
          auto-complete="off"
          placeholder="请输入规则备注"
          style="width: 220px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="width: 130px; margin-left: 100px">
      <el-button size="mini" type="danger" plain @click="resetForm('accRules')"
        >重置</el-button
      >
      <el-button
        size="mini"
        type="primary"
        plain
        @click="addSplitAccList('accRules')"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
import { addRules } from "@/api/getData";
export default {
  props: {
    rule: {
      type: Object,
    },
    parentRule: {
      type: Object,
    },
    temp: {
      type: Number,
    },
  },
  data() {
    return {
      defaultRule: [
        { required: true, message: "请输入固定额", trigger: "blur" },
        {
          pattern: /0|^-?[1-9]\d*$/, //可以写正则表达式呦呦呦,
          message: "请输入整数或0",
          trigger: ["blur", "change"],
        },
      ],
      percentRule: [
        { required: true, message: "请输入百分比", trigger: "blur" },
        {
          pattern: /0|^[1-9]\d*$/, //可以写正则表达式呦呦呦,
          message: "请输入正整数或0",
          trigger: ["blur", "change"],
        },
      ],
      rules: {
        nurse: "",
        introducer: "",
        foreman: "",
      },
      accRules: {
        ruleNameId: "",
        note: "",
        template: "",
        introducer: "0",
        nurse: "0",
        foreman: "0",
        introducerCompany: "0",
        nurseCompany: "0",
        foremanCompany: "0",
      },
    };
  },
  watch: {
    "accRules.introducerCompany": {
      handler(newName, oldName) {
        if (newName == "1") {
          this.rules.introducer = this.percentRule;
        }
        if (newName == "0") {
          this.rules.introducer = this.defaultRule;
        }
      },
      immediate: true,
    },
    "accRules.nurseCompany": {
      handler(newName, oldName) {
        if (newName == "1") {
          this.rules.nurse = this.percentRule;
        }
        if (newName == "0") {
          this.rules.nurse = this.defaultRule;
        }
      },
      immediate: true,
    },
    "accRules.foremanCompany": {
      handler(newName, oldName) {
        if (newName == "1") {
          this.rules.foreman = this.percentRule;
        }
        if (newName == "0") {
          this.rules.foreman = this.defaultRule;
        }
      },
      immediate: true,
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.accRules.introducerCompany = "0";
      this.accRules.nurseCompany = "0";
      this.accRules.foremanCompany = "0";
    },
    async addSplitAccList(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.parentRule);
          this.accRules.ruleNameId = this.parentRule.id;
          this.accRules.template = this.temp;
          this.accRules.type = this.rule.type;
          console.log(this.accRules);
          // 弹出框-确定
          const res = await addRules(this.accRules);
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "新增成功",
              center: true,
            });
            // 刷新数据
            this.$emit("change");
            this.resetForm("accRules");
          } else {
            this.$message({
              type: "warning",
              message: res.message,
              center: true,
            });
            // throw new Error(res.message);
          }
        } else {
          this.$message({
            type: "error",
            message: "请填写正确的表单...",
            center: true,
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
.accItem {
  display: flex;
}
.accItem .accStyle {
  margin-left: -90px;
}
.accItem .accStyle .per {
  margin-left: -25px;
}
</style>