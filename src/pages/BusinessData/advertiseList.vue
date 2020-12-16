<template>
  <div class="fillcontain">
    <el-collapse class="add_split" value="1">
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
          >
            <el-form-item label="标题：">
              <el-input
                v-model="listQuery.title"
                class="input-width"
                clearable
                placeholder="广告标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="广告风格：">
              <el-select
                v-model="listQuery.style"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in styleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告类型：">
              <el-select
                v-model="listQuery.type"
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
          </el-form>
        </div>
        <div class="searchBottom">
          <el-button type="primary" @click="handleSearchList" size="mini">
            搜索
          </el-button>
          <el-button @click="handleResetSearch" size="mini"> 重置 </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

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
          v-has="{ name: '广告管理', type: '2' }"
          native-type="submit"
          type="primary"
          size="mini"
          plain
          @click="handle_add_btn()"
          >添加广告图</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="mainTable"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column label="标 题" align="center" width="100" fixed="left">
          <template slot-scope="scope">
            <p>
              {{ scope.row.title == undefined ? "暂无信息" : scope.row.title }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="风 格" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.style == 0">正常显示</p>
            <p v-if="scope.row.style == 1">弹出</p>
          </template>
        </el-table-column>
        <el-table-column label="类 型" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.type == 1">开屏页广告</p>
            <p v-if="scope.row.type == 2">banner</p>
            <p v-if="scope.row.type == 3">其他广告</p>
          </template>
        </el-table-column>
        <el-table-column label="图 片" align="center">
          <template slot-scope="scope">
            <el-image class="tableImg" :src="scope.row.url" fit="contain">
              <div
                slot="error"
                class="image-slot"
                style="
                  width: 100%;
                  height: 100%;
                  font-size: 40px;
                  text-align: center;
                  line-height: 60px;
                "
              >
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }} </template>
        </el-table-column>
        <el-table-column label="操 作" align="center" fixed="right" width="200">
          <template slot-scope="scope" align="center">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              v-has="{ name: '广告管理', type: '2' }"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '广告管理', type: '4' }"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="listQuery.pageSize"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      :visible.sync="showDialog"
      title="添加广告"
      center
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="80px"
        :model="formLabelAlign"
        ref="formLabelAlign"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="标题:"
              label-width="90px"
              prop="title"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="formLabelAlign.title"
                auto-complete="off"
                placeholder="请输入广告标题"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item
              label="风格:"
              label-width="90px"
              prop="style"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="formLabelAlign.style"
                auto-complete="off"
                placeholder="0：正常显示 ；1：弹出"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="类型:"
              label-width="90px"
              prop="type"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="formLabelAlign.type"
                auto-complete="off"
                placeholder="1：开屏页广告；2：banner；3:其他广告"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9">
            <el-form-item label="广告图片:" label-width="90px">
              <el-image
                style="
                  width: 370px;
                  height: 300px;
                  border-radius: 10px;
                  border: 1px solid gainsboro;
                  padding: 10px;
                "
                :src="formLabelAlign.url"
                fit="contain"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="
                    width: 100%;
                    height: 100%;
                    font-size: 100px;
                    text-align: center;
                    line-height: 280px;
                  "
                >
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="dialogImageUrl"
          :on-success="handleSuccess"
          style="margin-left: 90px"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('formLabelAlign')">关 闭</el-button>
        <el-button
          v-has="{ name: '新闻', type: '2' }"
          type="primary"
          @click="SubmitInfo"
          >确 定</el-button
        >
        <!-- <el-button type="primary" @click="SubmitInfo1()">确 定</el-button> -->
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editDialog"
      title="编辑广告"
      center
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="80px"
        :model="formLabelAlign"
        ref="formLabelAlign"
        @submit.native.prevent
      >
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="标题:"
              label-width="90px"
              prop="title"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="formLabelAlign.title"
                auto-complete="off"
                placeholder="请输入广告标题"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item
              label="风格:"
              label-width="90px"
              prop="style"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="formLabelAlign.style"
                auto-complete="off"
                placeholder="0：正常显示 ；1：弹出"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row>
          <el-col :span="18">
            <el-form-item
              label="类型:"
              label-width="90px"
              prop="type"
              :rules="[
                { required: true, message: '不能为空', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="formLabelAlign.type"
                auto-complete="off"
                placeholder="1：开屏页广告；2：banner；3:其他广告"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9">
            <el-form-item label="广告图片:" label-width="90px">
              <el-image
                style="
                  width: 370px;
                  height: 300px;
                  border-radius: 10px;
                  border: 1px solid gainsboro;
                  padding: 10px;
                "
                :src="formLabelAlign.url"
                fit="contain"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="
                    width: 100%;
                    height: 100%;
                    font-size: 100px;
                    text-align: center;
                    line-height: 280px;
                  "
                >
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="dialogImageUrl"
          :on-success="handleSuccess"
          style="margin-left: 90px"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CancelEdit('formLabelAlign')">取 消</el-button>
        <el-button
          type="primary"
          v-has="{ name: '新闻', type: '2' }"
          @click="confirmEdit('valdata')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "components/headTop";
import { baseUrl, baseImgPath } from "@/config/env";
import {
  uploadImg,
  getAdvertiseCount,
  searchAdvertise,
  addAdvertise,
  updateAdvertise,
  deletedAdvertise,
} from "@/api/getData";
const defaultListQuery = {
  page: 1,
  pageSize: 10,
  title: "",
  style: "",
  type: "",
};
export default {
  baseUrl,
  name: "", // 广告页
  components: {
    headTop,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      fileLists: "",
      dialogImageUrl: baseUrl + "/mgr-file-upload/upload",
      tableData: [],
      isPagination: "main",
      showDialog: false,
      editDialog: false,
      refreshLoading: false,
      dataForm: {},
      formLabelAlign: {
        title: "",
        style: "",
        type: "",
        url: "",
      },
      offset: 0,
      limit: 100,
      count: 0,
      styleList: [
        { label: "开屏页广告", value: 1 },
        { label: "banner", value: 2 },
        { label: "其他广告", value: 3 },
      ],
      typeList: [
        { label: "正常显示", value: 0 },
        { label: "弹出", value: 1 },
      ],
    };
  },
  created() {
    this.initData(this.listQuery.page);
  },
  methods: {
    //刷新
    refresh() {
      if (this.isPagination == "main") {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.refreshLoading = false;
          this.initData(this.listQuery.page);
        }, 1000);
      }
      if (this.isPagination == "search") {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.refreshLoading = false;
          this.initData(1);
        }, 1000);
      }
    },

    // 获取广告信息
    initData(page) {
      this.getAdCount();
      this.getAllAdvertise(page);
    },
    async getAdCount() {
      const resCount = await getAdvertiseCount();
      this.count = resCount.data;
    },
    async getAllAdvertise(page) {
      this.listQuery.page = page;
      let prams = this.listQuery;
      const res = await searchAdvertise(prams);
      if (res.code == 200) {
        console.log(res);
        this.tableData = res.data;
      } else {
        this.$message({
          type: "warning",
          message: res.message,
          center: true,
        });
      }
    },

    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 搜索
    async handleSearchList(page) {
      if (this.listQuery.title || this.listQuery.style || this.listQuery.type) {
        const res = await searchAdvertise({
          page: 1,
          pageSize: 10000,
          title: this.listQuery.title,
          style: this.listQuery.style,
          type: this.listQuery.type,
        });
        console.log(res);
        if (res.code == 200) {
          this.count = res.data.length;
          this.listQuery.page = 1;
          this.isPagination = "search";
          this.getAllAdvertise();
        }
      } else {
        this.$alert("请输入查询条件", {
          type: "warning",
          center: true,
          confirmButtonText: "确定",
        });
      }
    },

    // 添加广告信息
    handle_add_btn() {
      this.showDialog = true;
    },
    async SubmitInfo() {
      let formData = this.formLabelAlign;
      const res = await addAdvertise(formData);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "添加成功！",
          center: true,
        });
        this.showDialog = false;
        this.formLabelAlign = {};
        this.refresh();
      } else {
        throw new Error(res.message);
      }
    },
    // 对话框取消事件
    closeDialog(formName) {
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.formLabelAlign = {};
      this.showDialog = false;
    },

    // 上传图片成功
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      if (response.code == 200) {
        this.formLabelAlign.url = response.data;
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

    //编辑广告
    handleEdit(index, row) {
      this.formLabelAlign = row;
      this.editDialog = true;
    },

    confirmEdit(valdata) {
      this.$confirm("是否确定修改该广告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async (valdata) => {
          var editData = this.formLabelAlign;
          const res = await updateAdvertise(editData);
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功！",
              center: true,
            });
            // 刷新数据
            this.editDialog = false;
            this.formLabelAlign = {};
            this.refresh();
          } else {
            throw new Error(res.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作！",
            center: true,
          });
        });
    },
    CancelEdit(formName) {
      // 点击取消 数据与验证重置
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.editDialog = false;
      this.formLabelAlign = {};
    },

    //删除
    handleDelete(index, row) {
      this.$confirm("确定删除该广告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          console.log(row.id);
          const res = await deletedAdvertise(row.id);
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功！",
              center: true,
            });
            // 更新数据
            this.tableData.splice(index);
            this.refresh();
          } else {
            throw new Error(res.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作！",
            center: true,
          });
        });
    },

    // 分页操作
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.offset = (val - 1) * this.limit;
      if (this.isPagination == "main") {
        this.getOrderList();
      } else {
        this.handleSearchList(this.listQuery.page);
      }
    },
  },
};
</script>

<style  lang="less">
.adTop {
  width: 900px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.tableImg {
  margin: 0 auto;
  padding: 5px 0;
  width: 150px;
  height: 80px;
  border: solid 1px gainsboro;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
</style>