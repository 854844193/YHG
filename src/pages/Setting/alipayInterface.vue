<template>
  <div class="mainContain">
    <Error></Error>
    <!-- <ETable
      ref="exTable"
      :tableData="dataList"
      align="left"
      :border="true"
      operateColWidth="350"
      :operateList="operateList"
      :columnsList="columnsList"
      :headerStyle="hStyle"
    ></ETable> -->
    <!-- <NTable
      style="margin-top: 50px"
      :tableData="dataList"
      align="center"
      :border="true"
      operateColWidth="280"
      :operateList="operateList"
      :columnsList="columnsList"
      :headerStyle="hStyle"
    ></NTable> -->
  </div>
</template>

<script>
import Error from "components/ErrorPage/error";
import ETable from "components/Table/exportTable";
import NTable from "components/Table/normalTable";
export default {
  components: {
    Error,
    ETable,
    NTable,
  },
  data() {
    return {
      hStyle: { background: "#ECF5FF", color: "#606266" },
      columnsList: [
        {
          label: "序号",
          type: "index",
          width: "60",
          align: "center",
        },
        {
          prop: "code",
          width: "",
          label: "产品编号",
          align: "center",
        },
        {
          prop: "type",
          width: "",
          label: "产品类型",
          align: "center",
        },
        {
          prop: "name",
          width: "",
          label: "产品名称",
          align: "center",
        },
        {
          prop: "address",
          width: "",
          label: "地区",
          align: "center",
        },
        {
          prop: "status",
          width: "",
          label: "状态",
          align: "center",
        },
      ],
      // 操作按钮
      operateList: [
        {
          id: 0,
          label: "查看",
          type: "primary",
          isExpend: true,
          method: (index, row) => {
            this.handleRead(index, row);
          },
        },
        {
          id: 1,
          label: "管理",
          type: "info",
          method: (index, row) => {
            this.handleManage(index, row);
          },
        },
        {
          id: 1,
          label: "发布",
          type: "primary",
          method: (index, row) => {
            this.handleRelease(index, row);
          },
        },
        {
          id: 2,
          label: "编辑",
          type: "warning",
          method: (index, row) => {
            this.handleEdit(index, row);
          },
        },
        {
          id: 3,
          label: "删除",
          type: "danger",
          method: (index, row) => {
            this.handleDel(index, row);
          },
        },
      ],
      dataList: [
        {
          id: "001",
          name: "三房112901",
          address: "广东省",
          code: "zxj_3_f_n1129",
          type: "1",
          status: "0",
        },
        {
          id: "002",
          name: "三房112901",
          address: "广东省",
          code: "zxj_3_f_n1129",
          type: "1",
          status: "1",
        },
        {
          id: "003",
          name: "三房112901",
          address: "广东省",
          code: "zxj_3_f_n1129",
          type: "2",
          status: "2",
        },
        {
          id: "004",
          name: "三房112901",
          address: "广东省",
          code: "zxj_3_f_n1129",
          type: "1",
          status: "1",
        },
        {
          id: "005",
          name: "三房112901",
          address: "广东省",
          code: "zxj_3_f_n1129",
          type: "2",
          status: "2",
        },
      ],
      isExpend: false,
    };
  },
  created() {
    this.dataList.map((item) => {
      item.expansion = true;
    });
  },
  methods: {
    handleRead(index, row) {
      console.log("查看index:" + index, row);
      this.isExpend = !this.isExpend;
      row.expansion = !row.expansion;
      this.$refs.exTable.expendCol(row, this.isExpend);
    },
    handleManage(index, row) {
      console.log("管理index:" + index, row);
    },
    handleRelease(index, row) {
      console.log("发布index:" + index, row);
    },
    handleEdit(index, row) {
      console.log("编辑index:" + index, row);
    },
    handleDel(index, row) {
      console.log("删除index:" + index, row);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
.mainContain {
  height: 100%;
  padding: 1.25rem;
}
</style>