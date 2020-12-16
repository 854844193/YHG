<template>
  <div class="fillcontain">
    <!-- <head-top></head-top> -->
    <div class="add_split">
      <el-button class="add_btn" @click="handle_add_btn()"
        >添加权限项</el-button
      >
    </div>

    <div class="table_container">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand">
          <template slot-scope="scope0">
            <el-table
              :data="scope0.row.sub"
              style="width: 100%"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            >
              <el-table-column
                label="权限子项"
                width="300"
                prop="name"
              ></el-table-column>
              <el-table-column
                label="权限值"
                width="200"
                prop
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="权限项"
          width="300"
          prop="name"
        ></el-table-column>
        <el-table-column label="操作" width="700">
          <!-- <template slot-scope="scope1"> -->
          <el-button>添加子项</el-button>
          <el-button>删除</el-button>
          <!-- </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import headTop from "components/headTop";
export default {
  components: {
    headTop,
  },
  data() {
    return {
      tableData: [
        {
          name: "test",
          sub: [
            {
              name: "sub",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handle_add_btn() {},
  },
};
</script>

<style scoped='less' type='text/css'>
.add_split {
  height: 40px;
}
.add_split .add_btn {
  margin-left: 20px;
  margin-top: 15px;
}
.table_container {
  padding: 20px;
}
</style>