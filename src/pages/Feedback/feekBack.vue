<template>
  <div class="fillcontain">
    <!-- <head-top></head-top> -->
    <div class="table_container">
      <el-table
        :data="tableData"
        class="mainTable"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          label="序 号"
          type="index"
          width="60"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          width="200"
          label="用户ID"
          prop="id">
        </el-table-column>-->
        <el-table-column
          label="反馈内容"
          prop="content"
          align="center"
        ></el-table-column>
        <el-table-column label="操 作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="deleted(scope.row.id)"
            ></el-button>
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
import { getAllFeekback, deletedFeedBack } from "@/api/getData";
export default {
  name: "", // 广告页
  components: {
    headTop,
  },
  data() {
    return {
      tableData: [],
      currentRow: null,
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
    async init() {
      let parms = {
        pageNum: this.currentPage,
        pageSize: 10,
      };
      const res = await getAllFeekback(parms);
      if (res.code == 200) {
        this.tableData = res.data;
        this.count = res.data.length;
      }
    },
    async deleted(rowId) {
      this.$confirm("确认删除吗？", "提示", {
        type: "waring",
        center: true,
      }).then(async () => {
        const res = await deletedFeedBack(rowId);
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
</style>