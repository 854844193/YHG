<template>
  <div>
    <template>
      <div v-if="funType1" style="margin: 0px 10px 10px 0">
        <input type="file" id="excel-file" @change="importExcel($event)" />
        <el-button
          class="editImgBtn"
          size="mini"
          type="primary"
          native-type="submit"
        >
          <span>导入表格</span>
          <span>{{
            dataList1.nurseCard == undefined ? "上传照片" : "重新上传"
          }}</span>
          <input
            class="testFile"
            type="file"
            @change="importExcel($event)"
            accept="image/gif, image/jpeg, image/jp2, image/png"
          />
        </el-button>
        <span>没有导入数据</span>
        <span>{{
          dataList1.nurseCard == undefined ? "没有上传相关证件" : "已有相关证件"
        }}</span>
        <el-button
          type="primary"
          style="float: right; margin-bottom: 10px"
          @click="subtimData()"
          >导入列表</el-button
        >
      </div>
      {{ tableData }}
      <el-table
        style="width: 100%"
        :data="tableData"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column type="expand">
          <template slot-scope="scope" style="width: 900px">
            <nurseInfo :row2="scope.row"></nurseInfo>
          </template>
        </el-table-column>
        <el-table-column
          label="护工姓名"
          style="width: 12%"
          property="realName"
          align="center"
        ></el-table-column>
        <el-table-column
          property="username"
          label="账 号"
          align="center"
        ></el-table-column>
        <el-table-column
          property="password"
          label="密 码"
          align="center"
        ></el-table-column>
        <el-table-column label="操 作" style="width: 24%" align="center">
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="deleteNurse()"
          ></el-button>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import nurseInfo from "./nurseInfo";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { uploadFile, batchAddUser } from "@/api/getData";
// import cookies from 'js-cookie'
// import * as fs from "fs";

export default {
  name: "nursesList", // 服务商的护工表
  props: {
    nurseProps: {
      type: Array,
    },
    funType: {
      type: Number,
    },
  },
  data() {
    return {
      funType1: 0,
      tableData: [],
    };
  },
  components: {
    nurseInfo,
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      console.log(this.funType);
      this.funType1 = !this.funType;
      if (this.funType1 == 0) {
        // 服务商查看
        console.log("服务商查看");
        console.log(this.nurseProps);
        this.tableData = this.nurseProps;
      }
    },
    deleteNurse() {
      // alert("未处理!");
    },
    EditNurse() {
      // 编辑护工
    },
    upload() {},
    async importExcel(e) {
      console.log(e);
      let that = this;
      var fileReader = new FileReader();
      fileReader.onload = function (ev) {
        try {
          var data = ev.target.result;
          console.log(data);
          (workbook = XLSX.read(data, {
            type: "binary",
          })), // 以二进制流方式读取得到整份excel表格对象
            (persons = []); // 存储获取到的数据
        } catch (e) {
          console.log("文件类型不正确");
          return;
        }
        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = "";
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]["!ref"];
            let excelFileData = persons.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );
            for (var i in excelFileData) {
              let Item = {};
              // 地址
              Item.address = excelFileData[i].address;
              // 余额
              Item.balance = excelFileData[i].balance || 0;
              //出生日期
              Item.birthday = excelFileData[i].birthday;
              // 护服务商像
              Item.headImg = excelFileData[i].headImg;
              // Item.id	string  身份证号
              Item.identId = excelFileData[i].identId;
              // 身份证号反面
              Item.identIdBack = excelFileData[i].identIdBack;
              // 身份证号正面
              Item.identIdFront = excelFileData[i].identIdFront;
              // 护理等级名称
              Item.nurseLevel = "一级护理";
              // 护理等级 1-5
              Item.nurseLevelId = "1";
              // 护工工号
              // Item.nurseNum	string
              // 护理类型名称
              Item.nurseType = "临床护理";
              // 护理类型id
              Item.nurseTypeId = "2";
              // 密码
              Item.password = "Abc12345678";
              // 电话号码
              Item.phone = excelFileData[i].phone;
              // 真实姓名
              Item.realName = excelFileData[i].realName;
              // 性别
              if (excelFileData[i].sex == "男") {
                Item.sex = "2";
              } else {
                Item.sex = "1";
              }
              // 1:认证 0未认证
              Item.state = 1;
              // 1: 护工 2：普通用户
              Item.type = 1;
              // 账号
              Item.username = excelFileData[i].phone;
              that.tableData.push(Item);
            }
            console.log(that.tableData);
            break; // 如果只取第一张表，就取消注释这行
          }
        }
      };
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(e.target.files[0]);
    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      var dataURL = canvas.toDataURL("image/" + ext);
      return dataURL;
    },
    async uploadOneFile(reader) {
      // debugger;
      const ret = await uploadFile({ file: reader });
      console.log(ret);
      if (ret.code == 200) {
        console.log("上传文件成功");
      } else {
        console.log("上传文件失败");
      }
    },
    async subtimData() {
      console.log("批量添加");
      console.log(this.tableData);
      const ret = await batchAddUser(this.tableData);
      console.log(ret);
      if (ret.code == 200) {
        this.$message("提交成功");
        console.log("提交列表成功");
      } else {
        this.$message("提交失败");
        console.log("提交列表失败");
      }
    },
  },
};
</script>

<style scoped="" type="text/css"></style>
