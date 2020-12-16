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
      </div>
      <el-table
        :data="tableData"
        class="mainTable"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand" align="center" width="20">
          <template slot-scope="scope">
            <el-form
              ref="ruleForm"
              size="mini"
              class="demo-ruleForm"
              :inline="true"
              @submit.native.prevent
            >
              <el-card shadow="hover" class="certification">
                <el-row>
                  <el-col>
                    <el-form-item label-width="90px">
                      <h3>“{{ scope.row.realName || "某某" }}”的证件审核：</h3>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 资格认证、犯罪记录 -->
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="资格认证:"
                      label-width="90px"
                    ></el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="犯罪记录:"
                      label-width="90px"
                    ></el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item>
                      <el-image
                        style="
                          width: 350px;
                          height: 250px;
                          border-radius: 10px;
                          border: 1px solid gainsboro;
                        "
                        fit="fill"
                        :src="scope.row.nurseCard"
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
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-image
                        style="
                          width: 350px;
                          height: 250px;
                          border-radius: 10px;
                          border: 1px solid gainsboro;
                        "
                        fit="fill"
                        :src="scope.row.editImgBtn"
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
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 健康证、个人介绍 -->
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="健康证:"
                      label-width="90px"
                    ></el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="个人介绍:"
                      label-width="90px"
                    ></el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item class="identImg">
                      <el-image
                        style="
                          width: 350px;
                          height: 250px;
                          border-radius: 10px;
                          border: 1px solid gainsboro;
                        "
                        fit="fill"
                        :src="scope.row.healthCard"
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
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="identImg">
                      <el-image
                        style="
                          width: 350px;
                          height: 250px;
                          border-radius: 10px;
                          border: 1px solid gainsboro;
                        "
                        fit="fill"
                        :src="scope.row.healthCard"
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
                          <i class="el-icon-video-play"></i>
                        </div>
                      </el-image>
                    </el-form-item>
                  </el-col>
                </el-row>

                <div class="editBtn">
                  <!-- <el-button type="primary" @click="submitDeny(scope)">不合格</el-button> -->
                  <el-button
                    type="primary"
                    @click="submitPass(scope)"
                    v-has="{ name: '审核', type: '2' }"
                    >通 过</el-button
                  >
                </div>
              </el-card>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="序 号"
          type="index"
          width="60"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="客户ID" prop="id" align="center"></el-table-column> -->
        <el-table-column
          property="realName"
          label="护工姓名"
          align="center"
        ></el-table-column>
        <el-table-column
          property="real_name_certification"
          label="审核状态"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.state == 0" style="color: red">不合格</p>
            <p v-if="scope.row.state == 1" style="color: green">通 过</p>
          </template>
        </el-table-column>
        <el-table-column label="操 作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              circle
              v-has="{ name: '审核', type: '4' }"
              @click="deleted(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="Pagination" style="text-align: left; margin-top: 10px">
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
import { getUserList, updateInfo } from "@/api/getData";
export default {
  name: "certificate",
  components: {
    headTop,
  },
  data() {
    return {
      tableData: [],
      ajaxData: {},
      refreshLoading: false,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.getNurseData();
    },
    deleted() {
      console.log("删除");
    },
    //刷新
    refresh() {
      this.refreshLoading = true;
      setTimeout(() => {
        this.tableData = [];
        this.count = 0;
        this.initData();
        this.refreshLoading = false;
      }, 1000);
    },
    async getNurseData() {
      const res = await getUserList({
        page: this.currentPage,
        pageSize: 10,
        type: 1,
      });
      if (res.code == 200) {
        this.tableData = res.data.list;
        this.count = res.data.total;
      } else {
        throw new Error("获取数据失败");
      }
    },

    //  审核不合格
    async submitDeny(scope) {
      console.log(scope.row);
      // let nurseData = scope.row;
      // nurseData.state = 0;
      // nurseData.userId = scope.row.id;
      // nurseData.id = "";
      // const res = await updateInfo(nurseData);
      // console.log(res);
      // if (res.code == 200) {
      //   this.$message({
      //     type: "success",
      //     message: res.data,
      //     center: true,
      //   });
      // } else {
      //   console.log(res.message);
      // }
    },
    // 审核通过
    async submitPass(scope) {
      console.log(scope.row);
      let nurseData = scope.row;
      console.log(scope);
      nurseData.state = 1;
      nurseData.userId = scope.row.id;
      nurseData.id = "";
      const res = await updateInfo(nurseData);
      console.log(res);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: res.data,
          center: true,
        });
        this.refresh();
      } else {
        console.log(res.message);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.initData();
    },
    computeTableIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
.certification {
  width: 800px;
  padding-left: 20px;
}
.editBtn {
  float: right;
  margin: 20px 0 10px 0;
}
</style>
