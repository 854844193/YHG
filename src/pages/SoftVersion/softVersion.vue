<template>
  <div class="fillcontain">
    <!-- <el-collapse class="add_split" value="1">
      <el-collapse-item name="1">
        <template slot="title">
          <p style="color: #409eff; font-size: 18px">
            <i class="el-icon-search"></i>高级搜索
            <span style="color: #e6a23c">(点此收起搜索条件)</span>
          </p>
        </template>
        <template slot="icon">
          <i class="el-icon-caret-bottom"></i>点击展开
        </template>
        <div class="searchWarp">
          <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            label-width="140px"
            @submit.native.prevent
          >
            <el-form-item label="软件类型：">
              <el-select
                v-model="listQuery.appType"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="更新时间：">
              <el-date-picker
                class="dateTime-width"
                v-model="uTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                type="datetimerange"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="searchBottom">
          <el-button type="primary" @click="handleSearchList" size="mini">
            搜索
          </el-button>
          <el-button @click="handleResetSearch" size="mini"> 重置 </el-button>
        </div>
      </el-collapse-item>
    </el-collapse> -->

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
          @click="refresh('main')"
        >
          刷新
        </el-button>
        <el-button
          v-has="{ name: '服务商列表', type: '2' }"
          type="primary"
          size="mini"
          plain
          @click="addVersion"
          >新增版本</el-button
        >
      </div>
      <el-table
        :data="tableData"
        v-loading="Loading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="软件类型" align="center" width="100">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.appType | checkType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="旧版本号" align="center" width="100">
          <template slot-scope="scope">
            <b>{{ scope.row.vesionStable }}</b>
          </template>
        </el-table-column>
        <el-table-column label="旧版下载地址" align="center">
          <template slot-scope="scope">
            {{ scope.row.versionStableUrl }}
          </template>
        </el-table-column>
        <el-table-column label="新版本号" align="center" width="100">
          <template slot-scope="scope">
            <b>{{ scope.row.vesionNew }}</b>
          </template>
        </el-table-column>
        <el-table-column label="新版下载地址" align="center">
          <template slot-scope="scope">
            {{ scope.row.versionNewUrl }}
          </template>
        </el-table-column>
        <el-table-column label="强制更新" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="scope.row.updateType == '0' ? 'success' : 'danger'"
            >
              {{ scope.row.updateType | checkUpdateType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新说明" align="center">
          <template slot-scope="scope">
            {{ scope.row.updateContent }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-has="{ name: '软件版本', type: '2' }"
              @click="editVersion(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              v-has="{ name: '软件版本', type: '4' }"
              @click="deleteById(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      :title="nowMed == true ? '新增版本' : '编辑版本'"
      :visible.sync="dialogVisible"
      width="540px"
      center
      :before-close="handleClose"
    >
      <el-form
        :model="versionForm"
        :rules="rules"
        ref="versionForm"
        label-width="100px"
        size="mini"
        class="demo-versionForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="versionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="软件类型" prop="appType">
          <el-select
            v-model="versionForm.appType"
            placeholder="请选择软件类型"
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="vesionNew">
          <el-input v-model="versionForm.vesionNew"></el-input>
        </el-form-item>
        <el-form-item label="版本说明" prop="updateContent">
          <el-input
            type="textarea"
            v-model="versionForm.updateContent"
          ></el-input>
        </el-form-item>
        <el-form-item label="强制更新">
          <el-switch
            v-model="versionForm.updateType"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="下载地址" prop="versionNewUrl">
          <el-input v-model="versionForm.versionNewUrl"></el-input>
          <!-- <el-input v-model="versionForm.versionNewUrl" readonly></el-input> -->
        </el-form-item>
        <el-form-item label="版本文件">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :show-file-list="false"
            :action="dialogFileUrl"
            :on-success="uploadVersion"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('versionForm')">
            {{ nowMed == true ? "新增" : "确定" }}
          </el-button>
          <el-button v-if="nowMed" @click="resetForm('versionForm')">
            重置
          </el-button>
          <el-button v-else @click="handleClose"> 取消 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAppVersion,
  submitVersion,
  uploadFile,
  deleteVersion,
} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  appType: "",
};
const defaultVersion = {
  name: "",
  appType: "",
  vesionNew: "",
  vesionStable: "",
  versionNewUrl: "",
  versionStableUrl: "",
  updateContent: "",
  updateType: "0",
};
export default {
  name: "", //
  components: {},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [
        {
          name: "云护工-服务商端App",
          appType: 1,
          vesionStable: "v2.0.1",
          versionStableUrl: "http://www.abc.com",
          vesionNew: "v2.0.2",
          versionNewUrl: "http://www.def.com",
          updateContent: "相对上一版本，新增了抢单、派单功能。",
          updateTime: "2020-11-16 17:25:56",
        },
      ],
      uTime: [],
      count: 0,
      dialogVisible: false,
      Loading: false,
      nowMed: true,
      isPagination: "main",
      dialogFileUrl: baseUrl + "/mgr-file-upload/upload",
      versionForm: Object.assign({}, defaultVersion),
      rules: {
        name: [{ required: true, message: "请输入版本名称", trigger: "blur" }],
        appType: [
          { required: true, message: "请选择软件类型", trigger: "change" },
        ],
        vesionNew: [
          { required: true, message: "请输入版本号", trigger: "blur" },
        ],
        updateContent: [
          { required: true, message: "请填写版本说明", trigger: "blur" },
        ],
        versionNewUrl: [
          { required: true, message: "下载地址不能为空", trigger: "blur" },
        ],
      },
      typeList: [
        {
          label: "App-服务商端",
          value: 3,
        },
        {
          label: "App-护工端",
          value: 4,
        },
      ],
    };
  },
  filters: {
    checkType(value) {
      if (!value) return "--";
      else if (value == 3) return "App-服务商端";
      else if (value == 4) return "App-护工端";
      else {
        return "未知";
      }
    },
    checkUpdateType(value) {
      if (value == 0) return "默认";
      else if (value == 1) return "强制";
      else {
        return "未知";
      }
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.uTime = "";
      if (this.isPagination == "main") {
        this.Loading = true;
        setTimeout(() => {
          this.tableData = [];
          this.Loading = false;
          this.initData();
        }, 1000);
      }
      if (this.isPagination == "search") {
        this.Loading = true;
        setTimeout(() => {
          this.tableData = [];
          this.Loading = false;
          this.isPagination = "main";
          this.listQuery.pageNum = 1;
          this.initData();
        }, 1000);
      }
    },
    // 初始化版本信息
    async initData() {
      let prams = this.objReSet(this.listQuery);
      const res = await getAppVersion(prams);
      if (res.code == 200) {
        // 获取版本信息
        this.tableData = res.data.records;
        this.count = res.data.total;
      }
    },
    // 添加版本
    addVersion() {
      this.nowMed = true;
      this.dialogVisible = true;
    },
    editVersion(version) {
      this.nowMed = false;
      this.dialogVisible = true;
      localStorage.setItem("oldversionNum", version.vesionNew);
      localStorage.setItem("oldversionUrl", version.versionNewUrl);
      this.versionForm = Object.assign(this.versionForm, version);
    },
    handleClose() {
      this.dialogVisible = false;
      this.resetForm("versionForm");
    },
    beforeUpload(file) {
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message.error("上传头像图片大小不能超过 100MB!");
      }
      return isLt100M;
    },
    // 上传版本文件
    uploadVersion(res, file, fileList) {
      if (res.code == 200) {
        this.versionForm.vesionStable = localStorage.getItem("oldversionNum");
        this.versionForm.versionStableUrl = localStorage.getItem(
          "oldversionUrl"
        );
        this.versionForm.versionNewUrl = res.data;
        this.$message({
          type: "success",
          message: "文件上传成功",
          center: true,
        });
        this.$refs.upload.clearFiles();
        fileList--;
      } else {
        this.$message({
          type: "error",
          message: "上传失败，请联系系统管理员!",
          center: true,
        });
      }
    },
    // 提交版本信息
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await submitVersion(this.versionForm);
          console.log(res);
          this.dialogVisible = false;
          this.Loading = true;
          setTimeout(() => {
            this.Loading = false;
            this.listQuery.pageNum = 1;
            this.initData();
          }, 1000);
        } else {
          console.log("error submit!!");
          this.$message({
            type: "error",
            message: "提交异常，请联系系统管理员!",
            center: true,
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.versionForm = Object.assign({}, defaultVersion);
    },
    deleteById(version) {
      this.$confirm("此操作将永久删除该软件版本, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          const res = await deleteVersion({ id: version.id });
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
              center: true,
            });
            this.refresh();
          }
        })
        .catch(() => {});
    },

    //重置搜索条件
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.uTime = "";
    },
    // 搜索
    handleSearchList() {
      if (this.listQuery.appType || this.uTime.length) {
        this.Loading = true;
        setTimeout(() => {
          this.listQuery.pageNum = 1;
          this.initData();
          this.Loading = false;
        }, 1500);
      } else {
        this.$message({
          type: "warning",
          message: "请输入查询条件！",
          center: true,
        });
      }
    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.offset = (val - 1) * this.limit;
      this.initData();
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>