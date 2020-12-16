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
            <el-form-item label="新闻标题：">
              <el-input
                v-model="listQuery.title"
                class="input-width"
                clearable
                placeholder="新闻标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="新闻类型：">
              <el-select
                v-model="listQuery.cmsType"
                class="input-width"
                placeholder="全部"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
          v-has="{ name: '新闻', type: '2' }"
          native-type="submit"
          type="primary"
          size="mini"
          plain
          @click="handle_add_btn()"
          >添加新闻</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="mainTable"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column label="标 题" prop="title" align="center">
          <template slot-scope="scope">
            <p class="newsContent">{{ scope.row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column label="内 容" prop="content" align="center">
          <template slot-scope="scope">
            <p class="newsContent">{{ scope.row.content }}</p>
          </template>
        </el-table-column>
        <el-table-column label="类 型" prop="cmsType" align="center">
          <template slot-scope="scope">
            <!-- 类型1：app新闻 2：官网新闻 3:关于我们 4：其它描述 5公司简介 6 用户协议 7:鉴定中心新闻 8:鉴定中心关于我们 9:协会宗旨 10:会员单位 11:发起人介绍 12:产品介绍 13:专家文献-->
            <p v-if="tableData[scope.$index].cmsType == 0">测试数据</p>
            <p v-if="tableData[scope.$index].cmsType == 1">app新闻</p>
            <p v-if="tableData[scope.$index].cmsType == 2">官网新闻</p>
            <p v-if="tableData[scope.$index].cmsType == 3">关于我们</p>
            <p v-if="tableData[scope.$index].cmsType == 4">其它描述</p>
            <p v-if="tableData[scope.$index].cmsType == 5">公司简介</p>
            <p v-if="tableData[scope.$index].cmsType == 6">用户协议</p>
            <p v-if="tableData[scope.$index].cmsType == 7">鉴定中心新闻</p>
            <p v-if="tableData[scope.$index].cmsType == 8">鉴定中心关于我们</p>
            <p v-if="tableData[scope.$index].cmsType == 9">协会宗旨</p>
            <p v-if="tableData[scope.$index].cmsType == 10">会员单位</p>
            <p v-if="tableData[scope.$index].cmsType == 11">发起人介绍</p>
            <p v-if="tableData[scope.$index].cmsType == 12">产品介绍</p>
            <p v-if="tableData[scope.$index].cmsType == 13">专家文献</p>
            <p v-if="tableData[scope.$index].cmsType == 15">鉴定中心通稿</p>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="操 作" align="center" fixed="right" width="200">
          <template slot-scope="scope" align="center">
            <el-button
              size="mini"
              type="primary"
              v-has="{ name: '新闻', type: '2' }"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              v-has="{ name: '新闻', type: '4' }"
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
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      :visible.sync="showDialog"
      top="5vh"
      title="添加新闻"
      center
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="80px"
        size="mini"
        :model="formLabelAlign"
        ref="formLabelAlign"
        @submit.native.prevent
      >
        <el-form-item
          label="标题:"
          label-width="90px"
          prop="title"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input
            v-model="formLabelAlign.title"
            auto-complete="off"
            placeholder="请输入新闻标题"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="类型:"
          label-width="90px"
          prop="cmsType"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <!-- <el-input
                v-model="formLabelAlign.cmsType"
                auto-complete="off"
                placeholder="1:app新闻 2:官网新闻 3:关于我们 4:其它 5:公司简介 6:用户协议 7:鉴定中心新闻 8:鉴定中心关于我们 9:协会宗旨 10:会员单位 11:发起人介绍 12:产品介绍 13:专家文献"
          ></el-input>-->
          <el-select
            v-model="formLabelAlign.cmsType"
            placeholder="请选择新闻类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="内容:"
          label-width="90px"
          prop="content"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-upload
            class="avatar-uploader"
            :action="editorImageUrl"
            name="file"
            :show-file-list="false"
            :on-success="uploadSuccess"
          >
          </el-upload>
          <!-- <el-input type="textarea" :rows="3" v-model="formLabelAlign.content" auto-complete="off"></el-input> -->

          <quill-editor
            v-model="formLabelAlign.content"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <!-- <button @click="getcont">获取啦啦啦</button> -->
        </el-form-item>

        <el-form-item label="作者:" label-width="90px" prop="newsAuthor">
          <el-input
            v-model="formLabelAlign.newsAuthor"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="来源:" label-width="90px" prop="newsSource">
          <el-input
            v-model="formLabelAlign.newsSource"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="描述:" label-width="90px" prop="simpleDesc">
          <el-input
            type="textarea"
            :rows="1"
            v-model="formLabelAlign.simpleDesc"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="相关图片:" label-width="90px">
          <div class="newsImg">
            <el-image
              style="width: 100%; height: 100%; border-radius: 10px"
              :src="formLabelAlign.pic"
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
                <i class="el-icon-picture-outline" style></i>
              </div>
            </el-image>
          </div>
        </el-form-item>

        <!-- <button @tap="getcont">获取</button> -->

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
          @click="SubmitInfo('formLabelAlign')"
          >确 定</el-button
        >
        <!-- <el-button type="primary" @click="SubmitInfo1()">确 定</el-button> -->
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="editDialog"
      title="编辑新闻"
      top="5vh"
      center
      :close-on-click-modal="false"
    >
      <el-form
        label-position="right"
        label-width="80px"
        size="mini"
        :model="formLabelAlign"
        ref="formLabelAlign"
      >
        <el-form-item
          label="标题:"
          label-width="90px"
          prop="title"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input
            v-model="formLabelAlign.title"
            auto-complete="off"
            placeholder="请输入新闻标题"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="类型:"
          label-width="90px"
          prop="cmsType"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-select
            v-model="formLabelAlign.cmsType"
            placeholder="请选择新闻类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="内容:"
          label-width="90px"
          prop="content"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <!-- <el-input type="textarea" :rows="3" v-model="formLabelAlign.content" auto-complete="off"></el-input> -->
          <!-- <el-upload
            class="avatar-uploader"
            :action="editorImageUrl"
            name="file"
            :show-file-list="false"
            :on-success="uploadSuccess"
          >
          </el-upload>         
          <quill-editor 
            v-model="formLabelAlign.content"
            ref="myQuillEditor" 
            :options="editorOption" 
          >
          </quill-editor> -->

          <el-upload
            class="edit-uploader"
            :action="editorImageUrl"
            name="file"
            :show-file-list="false"
            :on-success="editSuccess"
          >
          </el-upload>
          <quill-editor
            v-model="formLabelAlign.content"
            ref="editQuillEditor"
            :options="editOption"
          >
          </quill-editor>
        </el-form-item>

        <el-form-item label="作者:" label-width="90px" prop="newsAuthor">
          <el-input
            v-model="formLabelAlign.newsAuthor"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="来源:" label-width="90px" prop="newsSource">
          <el-input
            v-model="formLabelAlign.newsSource"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="描述:" label-width="90px" prop="simpleDesc">
          <el-input
            :rows="1"
            type="textarea"
            v-model="formLabelAlign.simpleDesc"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="相关图片:" label-width="90px">
          <div class="newsImg">
            <el-image
              style="width: 100%; height: 100%; border-radius: 10px"
              :src="formLabelAlign.pic"
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
          </div>
        </el-form-item>

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
          v-has="{ name: '新闻', type: '2' }"
          type="primary"
          @click="confirmEdit('valdata')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, baseImgPath } from "@/config/env";
import {
  uploadImg,
  getAllNews,
  getAllNewsCount,
  searchAdByCit,
  addNews,
  updateNews,
  deletedNews,
} from "@/api/getData";
import { quillEditor } from "vue-quill-editor";
const defaultListQuery = {
  page: 1,
  pageSize: 10,
  status: 1,
  title: "",
  cmsType: "",
};
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"],
];
export default {
  baseUrl,
  name: "news", // 新闻页
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      fileLists: "",
      noPic: "/manage/static/image/timg.jpg",
      editorImageUrl: baseUrl + "/mgr-file-upload/upload",
      dialogImageUrl: baseUrl + "/mgr-file-upload/upload",
      tableData: [],
      isPagination: "main",
      showDialog: false,
      editDialog: false,
      refreshLoading: false,
      dataForm: {},
      newsTitle: "",
      newsType: "",
      Type: "",
      formLabelAlign: {
        title: "",
        cmsType: "",
        content: "",
        pic: "",
        simpleDesc: "",
        newsAuthor: "",
        newsSource: "",
      },
      offset: 0,
      limit: 100,
      count: 0,
      content: "",
      editorOption: {
        placeholder: "请在这里输入",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector(".avatar-uploader input").click();
                  document.querySelector(".edit-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            },
          },
        },
      },
      editOption: {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector(".edit-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            },
          },
        },
      },
      typeList: [
        {
          label: "测试数据",
          value: "0",
        },
        {
          label: "app新闻",
          value: "1",
        },
        {
          label: "官网新闻",
          value: "2",
        },
        {
          label: "关于我们",
          value: "3",
        },
        {
          label: "其它描述",
          value: "4",
        },
        {
          label: "公司简介",
          value: "5",
        },
        {
          label: "用户协议",
          value: "6",
        },
        {
          label: "鉴定中心新闻",
          value: "7",
        },
        {
          label: "鉴定中心关于我们",
          value: "8",
        },
        {
          label: "协会宗旨",
          value: "9",
        },
        {
          label: "会员单位",
          value: "10",
        },
        {
          label: "发起人介绍",
          value: "11",
        },
        {
          label: "产品介绍",
          value: "12",
        },
        {
          label: "专家文献",
          value: "13",
        },
        {
          label: "鉴定中心通稿",
          value: "15",
        },
      ],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 富文本中上传图片成功
    uploadSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        console.log(res);
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.data为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    editSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.$refs.editQuillEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        console.log(res);
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.data为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    //刷新
    refresh() {
      this.listQuery = Object.assign({}, defaultListQuery);
      if (this.isPagination == "main") {
        this.refreshLoading = true;
        setTimeout(() => {
          this.tableData = [];
          this.refreshLoading = false;
          this.initData();
        }, 1000);
      } else {
        this.refreshLoading = true;
        setTimeout(() => {
          this.listQuery.page = 1;
          this.tableData = [];
          this.refreshLoading = false;
          this.initData();
        }, 1000);
      }
    },
    // 获取广告信息
    initData() {
      this.getAllNewsData();
    },
    async getAllNewsData() {
      let parms = this.listQuery;
      const resCount = await getAllNewsCount({ status: 1 });
      if (resCount.code == 200) {
        this.count = resCount.data;
      }
      const res = await getAllNews(parms);
      this.tableData = res.data;
    },

    // 搜索
    handleSearchList() {
      this.isPagination = "search";
      this.searchByInput();
    },
    handleResetSearch() {
      //重置搜索条件
      this.listQuery = Object.assign({}, defaultListQuery);
    },

    async searchByInput(page) {
      if (this.listQuery.title || this.listQuery.cmsType) {
        this.listQuery.page = page == undefined ? 1 : page;
        const resData = await getAllNews(this.listQuery);
        this.tableData = resData.data;
        const res = await getAllNews({
          title: this.listQuery.title,
          cmsType: this.listQuery.cmsType,
          status: 1,
        });
        this.count = res.data.length;
      } else {
        this.$alert("请输入查询条件", {
          type: "warning",
          center: true,
          confirmButtonText: "确定",
        });
      }
    },

    // 添加新闻信息
    handle_add_btn() {
      this.showDialog = true;
    },
    async SubmitInfo(formLabelAlign) {
      this.$refs[formLabelAlign].validate(async (valid) => {
        if (valid) {
          let formData = this.formLabelAlign;
          formData.status = 1;
          console.log(formData);
          const res = await addNews(formData);
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
        } else {
          this.$message({
            type: "error",
            message: "请输入正确的新闻内容！！！",
            center: true,
          });
        }
      });
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
      if (response.code == 200) {
        this.$message({
          type: "success",
          message: "上传成功",
        });
        this.formLabelAlign.pic = response.data;
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
      console.log(row);
      row.cmsType += "";
      this.formLabelAlign = row;
      console.log(this.formLabelAlign);
      this.editDialog = true;
    },

    confirmEdit(valdata) {
      this.$confirm("是否确定修改该新闻?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async (valdata) => {
          var editData = this.formLabelAlign;
          editData.status = 1;
          const res = await updateNews(editData);
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
      this.$confirm("确定删除该新闻?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          const res = await deletedNews(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功！",
              center: true,
            });
            // 更新数据
            this.tableData.splice(index);
            this.initData();
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
        this.initData();
      } else {
        this.searchByInput(this.listQuery.page);
      }
    },
  },
};
</script>

<style  lang="less">
.ql-blank {
  height: 300px;
}
.newsContent {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tableImg {
  margin: 0 auto;
  padding: 2px 0;
  width: 120px;
  height: 56px;
  border: solid 1px gainsboro;
}
.newsImg {
  width: 370px;
  height: 300px;
  border: 1px solid gainsboro;
  border-radius: 10px;
  padding: 0 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
</style>