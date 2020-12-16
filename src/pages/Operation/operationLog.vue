<template>
  <div class="fillcontain">
    <Error></Error>
  </div>
</template>

<script>
import Error from "components/ErrorPage/error";
export default {
  components: {
    Error,
  },
  methods: {
    // 导出数据
    exportOrder() {
      let that = this;
      that
        .$confirm("是否导出数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
        .then(() => {
          that.showOrderList = false;
          /* 转换成excel时，使用原始的格式，解决数字列自动转科学计数法问题 */
          let xlsxParam = { raw: true };
          /* out-table关联导出的dom节点  */
          let wb = XLSX.utils.table_to_book(
            document.querySelector("#out-table"),
            xlsxParam
          );
          /* get binary string as output */
          let wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array",
          });
          try {
            FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "护工已支付订单.xlsx"
            );
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
          return wbout;
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消导出",
            center: true,
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
</style>