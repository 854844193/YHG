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
        <el-button
          v-has="{ name: '有奖问答', type: '2' }"
          native-type="submit"
          type="primary"
          size="mini"
          plain
          @click="addQue"
        >
          添加题目
        </el-button>
        <el-button
          v-has="{ name: '有奖问答', type: '1' }"
          native-type="submit"
          type="primary"
          size="mini"
          plain
          @click="readQue"
        >
          问答情况
        </el-button>
      </div>
      <el-table
        :data="tableData"
        class="mainTable"
        v-loading="refreshLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          label="序 号"
          type="index"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          label="题 目"
          prop="title"
          align="center"
        ></el-table-column>
        <el-table-column
          label="答 案"
          prop="answer"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column label="操 作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              circle
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              circle
              icon="el-icon-delete"
              size="mini"
              @click="deleted(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 添加 -->
    <el-dialog
      :visible.sync="showAddDialog"
      title="添加问答题"
      center
      :show-close="false"
    >
      <el-form
        label-position="right"
        label-width="80px"
        :model="formQue"
        ref="formQue"
        @submit.native.prevent
      >
        <el-form-item
          label="题 目:"
          label-width="90px"
          prop="title"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input
            type="textarea"
            :rows="1"
            v-model="formQue.title"
            auto-complete="off"
            placeholder="请输入问答题目"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="选项A:"
          label-width="90px"
          prop="optionA"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionA" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="选项B:"
          label-width="90px"
          prop="optionB"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionB" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="选项C:"
          label-width="90px"
          prop="optionC"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionC" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="选项D:"
          label-width="90px"
          prop="optionD"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionD" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="答 案:"
          label-width="90px"
          prop="answer"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.answer" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CancelEdit('add')" plain>取 消</el-button>
        <el-button
          v-has="{ name: '有奖问答', type: '2' }"
          type="primary"
          @click="addComfirm"
          >添 加</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      :visible.sync="showEditDialog"
      title="编辑问答题"
      center
      :show-close="false"
    >
      <el-form :model="formQue" @submit.native.prevent>
        <el-form-item
          label="题 目:"
          label-width="90px"
          prop="title"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input
            type="textarea"
            :rows="1"
            v-model="formQue.title"
            auto-complete="off"
            placeholder="请输入问答题目"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="选项A:"
          label-width="90px"
          prop="optionA"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionA" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="选项B:"
          label-width="90px"
          prop="optionB"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionB" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="选项C:"
          label-width="90px"
          prop="optionC"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionC" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="选项D:"
          label-width="90px"
          prop="optionD"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.optionD" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="答 案:"
          label-width="90px"
          prop="answer"
          :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
        >
          <el-input v-model="formQue.answer" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CancelEdit('edit')" plain>取 消</el-button>
        <el-button
          v-has="{ name: '新闻', type: '2' }"
          type="primary"
          @click="editConfirm"
          >修 改</el-button
        >
      </div>
    </el-dialog>

    <!-- 问答情况 -->
    <el-dialog :visible.sync="showQueList" title="问答情况" center>
      <el-table
        :data="queData"
        class="mainTable"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand" width="20" align="center">
          <template slot-scope>
            <el-card shadow="hover">
              <div
                v-for="(item, index) in tableData"
                :key="index"
                style="margin-bottom: 10px"
              >
                <div style="margin: 10px 0; font-weight: bold">
                  <span>{{ index + 1 }}、 {{ item.title }}</span>
                </div>
                <div style="margin: 10px 0; display: flex">
                  <el-radio-group>
                    <el-radio
                      v-model="selected"
                      label="1"
                      style="margin-bottom: 10px"
                      >A、{{ item.optionA }}</el-radio
                    >
                    <br />
                    <el-radio
                      v-model="selected"
                      label="2"
                      style="margin-bottom: 10px"
                      >B、{{ item.optionB }}</el-radio
                    >
                    <br />
                    <el-radio
                      v-model="selected"
                      label="3"
                      style="margin-bottom: 10px"
                      >C、{{ item.optionC }}</el-radio
                    >
                    <br />
                    <el-radio v-model="selected" label="4"
                      >D、{{ item.optionD }}</el-radio
                    >
                  </el-radio-group>
                </div>
                <div>
                  <span style="color: red">答 案：</span>
                  {{ item.answer }}
                </div>
              </div>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column
          property="userId"
          label="用户ID"
          align="center"
        ></el-table-column>
        <el-table-column
          property="grade"
          label="分 数"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column label="是否达标" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color: red">不达标</span>
            <span v-if="scope.row.status == 1" style="color: green">达标</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "components/headTop";
import { getAllFeekback, deletedFeedBack } from "@/api/getData";
export default {
  name: "questionnaire",
  components: {
    headTop,
  },
  data() {
    return {
      tableData: [
        {
          title: "这是问答的题目1",
          optionA: "选项1",
          optionB: "选项2",
          optionC: "选项3",
          optionD: "选项4",
          answer: "这是问题1的答案",
        },
        {
          title: "这是问答的题目2",
          optionA: "选项1",
          optionB: "选项2",
          optionC: "选项3",
          optionD: "选项4",
          answer: "这是问题2的答案",
        },
      ],
      queData: [
        {
          userId: "ddf5d442a4da2gagaf",
          grade: "60",
          status: 1,
        },
        {
          userId: "dhajalgjaf54f5fdad56",
          grade: "59",
          status: 0,
        },
      ],
      formQue: {
        title: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: "",
      },
      selected: "0",
      currentRow: null,
      refreshLoading: false,
      showQueList: false,
      showAddDialog: false,
      showEditDialog: false,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
    };
  },
  created() {
    // this.init();
    this.selected = "2";
    this.count = this.tableData.length;
  },
  methods: {
    //刷新
    refresh() {
      this.refreshLoading = true;
      setTimeout(() => {
        // this.tableData = [];
        this.refreshLoading = false;
        // this.init();
      }, 1000);
    },
    async init() {
      // let parms = {
      //   pageNum: this.currentPage,
      //   pageSize: 10,
      // };
      // console.log(parms);
      // const res = await getAllFeekback(parms);
      // if (res.code == 200) {
      //   this.tableData = res.data;
      // }
    },
    // 删除
    deleted(rowId) {
      this.$confirm("确认删除吗？", "提示", {
        type: "waring",
        center: true,
      }).then(async () => {
        const res = await deletedFeedBack(rowId);
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
    // 修改
    edit(que) {
      this.showEditDialog = true;
      this.formQue = que;
      console.log(this.formQue);
      console.log(this.showEditDialog);
      console.log("edit");
    },
    editConfirm() {
      console.log("editConfirm");
    },
    // 添加
    addQue() {
      console.log(this.showAddDialog);
      this.showAddDialog = true;
      console.log(this.showAddDialog);
      console.log("add");
    },
    addComfirm() {
      console.log("addComfirm");
    },
    // 查看问答情况
    readQue() {
      console.log("read");
      this.showQueList = true;
    },
    CancelEdit(med) {
      if (med == "add") {
        this.showAddDialog = false;
        this.formQue = {};
      } else {
        this.showEditDialog = false;
        this.formQue = {};
      }
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
.queDetails {
  width: 800px;
  padding-left: 20px;
}
</style>