<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="dataList">
        <span style="color: #409eff; font-size: 18px">
          <i class="el-icon-tickets"></i>
          数据列表
        </span>
        <el-button
          native-type="submit"
          type="primary"
          size="mini"
          style="margin-left: 10px"
          @click="refresh"
        >
          刷新
        </el-button>
        <el-button
          v-has="{ name: '护理类别', type: '2' }"
          type="primary"
          size="mini"
          plain
          @click="handle_add_btn()"
        >
          添加护理类别
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.Levels"
              style="width: 100%"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            >
              <el-table-column
                label="护理级别"
                prop="nurseLevel"
                align="center"
              ></el-table-column>
              <el-table-column
                label="日参考价"
                prop="refencePrice"
                align="center"
              ></el-table-column>
              <el-table-column
                label="时参考价"
                prop="refencePriceHour"
                align="center"
              ></el-table-column>
              <el-table-column label="操 作" align="center">
                <template slot-scope="propsLevel">
                  <el-button
                    v-has="{ name: '护理类别', type: '4' }"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="deleteNurseLevel(propsLevel.row.id)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="护理类别"
          prop="nuserType"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column label prop></el-table-column>
        <el-table-column label="操 作" width="250" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-has="{ name: '护理类别', type: '2' }"
              @click="addNurseLevel_btn(scope.row)"
              >添加级别</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '护理类别', type: '4' }"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>

      <el-dialog
        title="添加护理类别"
        :visible.sync="dialogNurseTypeVisible"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          size="mini"
          class="demo-ruleForm"
          :rules="rules"
          @submit.native.prevent
        >
          <el-form-item label="护理类别" label-width="100px" prop="nurseType">
            <el-input v-model="ruleForm.nurseType"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="updateNurseTypeList()"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <!-- 添加护理级别 -->
      <el-dialog
        title="添加护理级别"
        :visible.sync="dialogNurseLevelVisible"
        @close="closeNurseLevelDlg()"
      >
        <!-- <el-form :model="nurseLevelForm"> -->
        <el-form
          :model="nurseLevelForm"
          ref="nurseLevelForm"
          size="mini"
          :rules="nurseLevelFormRules"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <!-- <el-form-item label="护理类别" label-width="100px">
                        <el-input v-model="nurseLevelForm.name" auto-complete="off" ></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="护理级别" label-width="100px" prop="nurseLevel">
                        <el-input v-model="nurseLevelForm.nurseLevel"></el-input>
          </el-form-item>-->
          <el-form-item label="护理级别" label-width="100px" prop="nurseLevel">
            <el-select v-model="nurseLevelForm.nurseLevel" placeholder="请选择">
              <el-option
                v-for="item in nurseLevelsOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="日参考价"
            label-width="100px"
            prop="refencePrice"
          >
            <el-input
              v-model="nurseLevelForm.refencePrice"
              style="width: 200px"
            ></el-input>
            <span>/天</span>
          </el-form-item>
          <el-form-item
            label="时参考价"
            label-width="100px"
            prop="refencePriceHour"
          >
            <el-input
              v-model="nurseLevelForm.refencePriceHour"
              style="width: 200px"
            ></el-input>
            <span>/小时</span>
          </el-form-item>
          <!-- <el-form-item label="护理内容" label-width="100px">
                       <el-input :rows="10" type="textarea" v-model="nurseLevelForm.description" autocomplete="off"></el-input>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeNurseLevelDlg()">取 消</el-button>
          <el-button type="primary" @click="nurseLevelSubmit()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { baseUrl, baseImgPath } from "@/config/env";
import {
  addNurseLevel,
  deleteNurseTypeById,
  deleteNurseLevelByLevelId,
  getNurseTypeCount,
  getNurseLevel,
  getNurseType,
  updateNurseType,
  deleteNurseType,
  addNurseTypeList,
} from "@/api/getData";
export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      loading: false,
      city: {},
      offset: 0,
      limit: 20,
      count: 0,
      tableData: [],
      nurseData: [],
      currentPage: 1,
      ruleForm: {
        nurseType: "",
      },
      rules: {
        nurseType: [{ required: true, message: "请输入类型", trigger: "blur" }],
      },
      nurseLevelForm: {
        nurseType: "",
        nurseLevel: "",
        refencePrice: "",
        refencePriceHour: "",
      },
      nurseLevelFormRules: {
        nurseLevel: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        refencePrice: [
          { required: true, message: "请输入每天的参考价", trigger: "blur" },
        ],
        refencePriceHour: [
          {
            required: true,
            message: "请输入每个小时的参考价",
            trigger: "blur",
          },
        ],
      },

      dialogNurseTypeVisible: false, // 添加护理类别
      dialogNurseLevelVisible: false, // 添加护理级别
      categoryOptions: [],
      selectedCategory: [],
      address: {},
      nurseLevelsOption: [
        {
          value: "特级护工",
          label: "特级护工",
        },
        {
          value: "一级护工",
          label: "一级护工",
        },
        {
          value: "二级护工",
          label: "二级护工",
        },
        {
          value: "三级护工",
          label: "三级护工",
        },
        {
          value: "四级护工",
          label: "四级护工",
        },
      ],
    };
  },

  created() {
    this.getNurseTypeList();
  },

  methods: {
    refresh() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.getNurseTypeList();
      }, 1500);
    },
    //解决Input因嵌套太深无法输入问题
    change(e) {
      this.$forceUpdate();
    },
    async initData() {
      this.getNurseTypeList();
    },
    async getNurseTypeList() {
      const resCount = await getNurseTypeCount();
      if (resCount.code == 200) {
        this.count = resCount.data;
      }
      const res = await getNurseType({
        pageNum: this.currentPage,
        pageSize: 10,
      });
      console.log(res);
      if (res.code == 200) {
        console.log(res);
        this.tableData = res.data;
        if (this.tableData.length > 0) {
          for (let i in this.tableData) {
            const subRes = await getNurseLevel({
              typeId: this.tableData[i].id,
            });
            if (subRes.code == 200) {
              this.tableData[i].Levels = subRes.data;
            } else {
              this.tableData[i].Levels = {};
            }
          }
        }
      } else {
        console.log("获取分页数据失败");
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getNurseTypeList();
    },
    addNurseLevel_btn(row) {
      this.nurseLevelForm.nurseType = row.id;
      this.dialogNurseLevelVisible = true;
    },
    async handleDelete(row) {
      // 删除护理类型
      var ret = undefined;
      await this.$confirm("确认删除信息?", "删除提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          ret = true;
        })
        .catch(() => {
          ret = false;
        });

      if (!ret) {
        return;
      }

      const res = await deleteNurseTypeById(row.id);
      console.log(res);
      if (res.code == 200) {
        for (let i in row.Levels) {
          this.deleteNurseLevel(row.Levels[i].id);
          console.log(row.Levels[i].id);
        }

        this.getNurseTypeList();
      }
    },
    async deleteNurseLevel(LevelId) {
      var ret = undefined;
      await this.$confirm("确认删除信息?", "删除提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          ret = true;
        })
        .catch(() => {
          ret = false;
        });

      if (!ret) {
        return;
      }

      // 删除护理级别
      const res = await deleteNurseLevelByLevelId(LevelId);
      console.log(res);
      if (res.code == 200) {
        this.getNurseTypeList();
      }
    },
    // 对话框取消事件
    closeDialog(formName) {
      this.dialogNurseTypeVisible = false;
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    //打开新增护理类型弹出层
    handle_add_btn() {
      // 护理类别新增
      this.dialogNurseTypeVisible = true;
    },
    async updateNurseTypeList() {
      var ret = undefined;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          ret = true;
        } else {
          this.message("无法提交");
          ret = false;
        }
      });

      if (!ret) {
        this.AddManagerShow = false;
        if (this.$refs.ruleForm !== undefined) {
          this.$refs.ruleForm.resetFields();
        }
        return;
      }

      ret = undefined;
      await this.$confirm("确认需要保存信息?", "保存提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(() => {
          ret = true;
        })
        .catch(() => {
          ret = false;
        });

      if (!ret) {
        this.AddManagerShow = false;
        if (this.$refs.ruleForm !== undefined) {
          this.$refs.ruleForm.resetFields();
        }
        return;
      }

      let nurseTypeItem = {
        nurseType: this.ruleForm.nurseType,
      };

      console.log(nurseTypeItem);
      const res = await addNurseTypeList(nurseTypeItem);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "新增成功",
        });
        // 刷新数据
        //this.getSplitAccountsList();
      } else {
        throw new Error(res.message);
      }
      this.dialogNurseTypeVisible = false;
    },
    closeNurseLevelDlg() {
      if (this.$refs.nurseLevelForm !== undefined) {
        this.$refs.nurseLevelForm.resetFields();
      }
      this.dialogNurseLevelVisible = false;
    },
    async nurseLevelSubmit() {
      var ret = undefined;
      this.$refs["nurseLevelForm"].validate((valid) => {
        if (valid) {
          ret = true;
        } else {
          console.log("error submit!!");
          ret = false;
        }
      });

      if (!ret) {
        if (this.$refs.nurseLevelForm !== undefined) {
          this.$refs.nurseLevelForm.resetFields();
        }
        return;
      }

      ret = undefined;
      await this.$confirm("确认需要保存信息?", "保存提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(() => {
          ret = true;
        })
        .catch(() => {
          ret = false;
        });

      if (!ret) {
        if (this.$refs.nurseLevelForm !== undefined) {
          this.$refs.nurseLevelForm.resetFields();
        }
        return;
      }

      // 提交护理等级数据

      this.nurseLevelForm.refencePrice =
        this.nurseLevelForm.refencePrice + "/天";
      this.nurseLevelForm.refencePriceHour =
        this.nurseLevelForm.refencePriceHour + "/小时";
      console.log(this.nurseLevelForm);
      const res = await addNurseLevel(this.nurseLevelForm);
      console.log(res);
      if (res.code == 200) {
        this.getNurseTypeList();
      }

      this.dialogNurseLevelVisible = false;
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.nurseContent {
  height: 200px;
}
</style>
