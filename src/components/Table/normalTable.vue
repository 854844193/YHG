<template>
  <div>
    <el-table
      :height="height"
      :data="tableData"
      :stripe="stripe"
      :border="border"
      v-loading="loading"
      :header-cell-style="headerStyle"
    >
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
            @click.native.prevent="btn.method(index, scope.row)"
          >
            {{ btn.label }}
          </el-button>
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
      default: function () {
        return { background: "#eef1f6", color: "#606266" };
      },
    },
  },
  data() {
    return {
      loading: false,
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
      console.log(index);
      return index + 1;
    },
  },
};
</script>

<style lang="less" scoped>
</style>