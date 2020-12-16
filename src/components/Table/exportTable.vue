<template>
  <div>
    <el-table
      :height="height"
      style="width: 100%"
      :stripe="stripe"
      :border="border"
      :data="tableData"
      v-loading="loading"
      ref="exportTable"
      :row-key="getRowKeys"
      @row-click="rowClick"
      :row-style="tableRowStyle"
      @selection-change="handleSelectionChange"
      :header-cell-style="headerStyle"
    >
      <el-table-column
        type="selection"
        width="42"
        align="center"
        :reserve-selection="true"
      ></el-table-column>

      <template v-for="(item, index) in columnsList">
        <el-table-column
          :key="index"
          v-if="item.type == 'index'"
          :type="item.type"
          :label="item.label"
          :align="item.align"
          :width="item.width"
          :index="computeTableIndex"
        >
        </el-table-column>
        <el-table-column
          v-else-if="item.prop == 'status'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width"
        >
          <template slot-scope="colItem">
            {{ colItem.row[item.prop] | formateStatus }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop == 'type'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width"
        >
          <template slot-scope="colItem">
            {{ colItem.row[item.prop] | formateType }}
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width"
        >
          <template slot-scope="colItem">
            {{ colItem.row[item.prop] | formateProp }}
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" :width="operateColWidth">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-for="(btn, index) in operateList"
            :type="btn.type"
            :key="index"
            @click.stop="btn.method(index, scope.row)"
          >
            <span v-if="btn.isExpend">
              {{ scope.row.expansion ? "查看" : "收起" }}
            </span>
            <span v-else>
              {{ btn.label }}
            </span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="colItem">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="产品编号">
              <span>{{ colItem.row.code }}</span>
            </el-form-item>
            <el-form-item label="产品类型">
              <span>{{ colItem.row.type | formateType }}</span>
            </el-form-item>
            <el-form-item label="产品名称">
              <span>{{ colItem.row.name }}</span>
            </el-form-item>
            <el-form-item label="地区">
              <span>{{ colItem.row.address }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ colItem.row.status | formateStatus }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    columnsList: {
      type: Array,
      default: () => [],
    },
    operateList: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: "100%",
    },
    operateColWidth: {
      type: String,
      default: "",
    },
    border: {
      type: Boolean,
      default: false,
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    headerStyle: {
      type: Object,
      default() {
        return { background: "#eef1f6", color: "#606266" };
      },
    },
  },
  data() {
    return {
      loading: false,
      selectedList: [],
      selectID: [],
    };
  },
  filters: {
    formateStatus(val) {
      if (val === "0") return "无效";
      if (val === "1") return "有效";
      if (val === "2") return "过期";
    },
    formateType(val) {
      if (val === "1") return "整装";
      if (val === "2") return "半装";
    },
  },
  methods: {
    computeTableIndex(index) {
      return index + 1;
    },
    expendCol(row, isExpend) {
      // 点击button展开
      // console.log(row);
      this.$refs.exportTable.toggleRowExpansion(row, isExpend);
    },
    getRowKeys(row) {
      return row.id;
    },
    // 选中背景色
    tableRowStyle({ row, rowIndex }) {
      let color = "";
      let arr = this.selectID || [];
      if (this.selectID.includes(row.id)) {
        color = { background: "#DCDFE6", color: "#606266" };
      } else {
        color = {};
      }
      return color;
    },
    //监听row-click事件，实现选中
    rowClick(row, column, event) {
      let excelTable = this.$refs.exportTable; // 获取表格对象
      let findRow = this.selectedList.find((c) => c.id == row.id); //找到选中的行
      if (findRow) {
        excelTable.toggleRowSelection(row, false); //如过重复选中，则取消选中
      } else {
        excelTable.toggleRowSelection(row, true); // 实现选中行中选中事件
      }
    },
    //选中导出数据
    handleSelectionChange(val) {
      this.selectedList = val;
      this.selectID = val.map((item) => {
        return item.id;
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>