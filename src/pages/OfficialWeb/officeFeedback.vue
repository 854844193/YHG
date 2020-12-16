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
          <el-form :inline="true" size="small" label-width="140px">
            <el-form-item label="留言标题：">
              <el-input
                v-model="commentTitle"
                class="input-width"
                clearable
                placeholder="请输入留言标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户电话：">
              <el-input
                v-model="phone"
                class="input-width"
                clearable
                placeholder="请输入客户电话"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="searchBottom">
          <el-button type="primary" @click="searchByInput" size="mini">
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
      </div>
      <el-table
        :data="tableData"
        class="mainTable"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand" align="center" width="20">
          <template slot-scope="scope">
            <commentsInfo :row="scope.row"></commentsInfo>
          </template>
        </el-table-column>
        <el-table-column
          label="序 号"
          type="index"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          label="客户姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="客户电话"
          prop="phone"
          align="center"
        ></el-table-column>
        <el-table-column
          label="标 题"
          prop="title"
          align="center"
        ></el-table-column>
        <el-table-column label="回复状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.reply" style="color：green;">已回复</span>
            <span style="color：blue;">待回复</span>
          </template>
        </el-table-column>
        <el-table-column label="操 作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              v-has="{ name: '客户留言', type: '4' }"
              circle
              @click="deleted(scope.row.id)"
            ></el-button>
            <!-- <el-tooltip content="回 复" placement="top-start" > -->
            <!-- <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              circle
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>-->
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="Pagination" style="text-align: left; margin: 0 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import headTop from "components/headTop";
import commentsInfo from "components/commentsInfo";
import { baseUrl, baseImgPath } from "@/config/env";
import {
  uploadImg,
  getAllComments,
  getCommentsCount,
  searchComments,
  deletedComments,
} from "@/api/getData";
export default {
  name: "", // 广告页
  components: {
    headTop,
    commentsInfo,
  },
  data() {
    return {
      tableData: [],
      currentRow: null,
      showReply: false,
      refreshLoading: false,
      formLabelAlign: {},
      phone: "",
      commentTitle: "",
      dialogImageUrl: baseUrl + "/mgr-file-upload/upload",
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化数据
    async init() {
      let parms = {
        page: this.currentPage,
        pageSize: 10,
      };
      const res = await getAllComments(parms);
      console.log(res);
      if (res.code == 200) {
        // this.tableData=[];
        // for(let i=0;i<res.data.length;i++){
        //   if(res.data[i].deleted==0){
        //     this.tableData.push(res.data[i]);
        //   }
        // }
        this.tableData = res.data;
      }
      const resCount = await getCommentsCount();
      console.log(resCount);
      if (resCount.code == 200) {
        this.count = resCount.data;
      }
    },

    // 搜索
    async searchByInput() {
      if (this.commentTitle || this.phone) {
        const res = await searchComments({
          page: 1,
          pageSize: 10,
          title: this.commentTitle,
          phone: this.phone,
        });
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: `查询到${res.data.length}条服务单数据！`,
            center: true,
          });
          this.tableData = res.data;
          this.count = this.tableData.length;
          this.commentTitle = "";
          this.phone = "";
        } else {
          this.$alert("没有搜索到相关广告的数据！", {
            type: "warning",
            center: true,
            confirmButtonText: "确定",
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入查询条件",
          center: true,
        });
      }
    },
    handleResetSearch() {
      this.commentTitle = "";
      this.phone = "";
    },

    async deleted(rowId) {
      this.$confirm("确认删除吗？", "提示", {
        type: "waring",
        center: true,
      }).then(async () => {
        const res = await deletedComments(rowId);
        console.log(res);
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功",
            center: true,
          });
          // 更新数据
          this.init();
        } else {
          throw new Error(res.message);
        }
      });
    },

    // 上传图片成功
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      if (response.code == 200) {
        this.$message({
          type: "success",
          message: "图片上传成功",
          center: true,
        });
        this.formLabelAlign.url = response.data;
      }
    },
    //回复
    handleEdit(index, row) {
      this.formLabelAlign = row;
      this.showReply = true;
    },
    confirmEdit(valdata) {
      this.$confirm("确定提交回复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async (valdata) => {
          var editData = this.formLabelAlign;
          // const res = await updateNews(editData);
          // if (res.code == 200) {
          //   this.$message({
          //     type: "success",
          //     message: "修改成功！",
          //     center: true,
          //   });
          // } else {
          //   throw new Error(res.message);
          // }
          // // 刷新数据
          // this.initData();
          // this.editDialog = false;
          // this.formLabelAlign = {};
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "已取消操作！",
            center: true,
          });
        });
    },

    // 点击取消 数据与验证重置
    CancelEdit(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.init();
      this.showReply = false;
      this.formLabelAlign = {};
    },

    //刷新
    refresh() {
      this.refreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.refreshLoading = false;
        this.initData();
      }, 1000);
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.init();
    },
  },
};
</script>

<style scoped='' type='text/css'>
.table_container .mainTable {
  width: 100%;
}

.advertisingImg {
  width: 350px;
  height: 200px;
}
</style>