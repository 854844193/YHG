<template>
  <div class="Pagination" style="text-align: left; margin-top: 10px">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="count"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    page: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      offset: 0,
      limit: 20,
      currentPage: 1,
    };
  },
  created() {
    this.currentPage = this.page;
  },

  methods: {
    backNumOne() {
      this.currentPage = 1;
    },
    // 分页操作
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.$emit("paging", this.currentPage);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
</style>