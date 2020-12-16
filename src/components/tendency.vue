<template>
  <div>
    <section>
      <!-- 总交易数据 -->
      <el-row :gutter="20" class="rowItem">
        <el-col>
          <el-card shadow="always">
            <div
              id="amount"
              style="width: 100%; height: 500px; padding: 5px"
            ></div
          ></el-card>
        </el-col>
      </el-row>
      <!-- 月交易数据 -->
      <!-- <el-row :gutter="20" class="rowItem">
        <el-col>
          <div
            id="monthAmount"
            style="
              width: 100%;
              height: 500px;
              padding: 5px;
            "
          ></div>
        </el-col>
      </el-row> -->
      <!-- 周交易数据 -->
      <el-row :gutter="20" class="rowItem">
        <el-col>
          <el-card shadow="always">
            <div
              id="weekAmount"
              style="width: 100%; height: 500px; padding: 5px"
            ></div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 人员数据 -->
      <el-row :gutter="20" class="rowItem">
        <el-col :span="12">
          <el-card shadow="always">
            <div
              id="member"
              style="width: 100%; height: 450px; padding: 5px"
            ></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="always">
            <div
              id="memberUser"
              style="width: 100%; height: 450px; padding: 5px"
            ></div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 护工比列 -->
      <el-row :gutter="20" class="rowItem">
        <el-col :span="12">
          <el-card shadow="always">
            <div
              id="nurseSex"
              style="width: 100%; height: 450px; padding: 5px"
            ></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="always">
            <div
              id="nurseAge"
              style="width: 100%; height: 450px; padding: 5px"
            ></div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
// 引入柱状图
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/tooltip";
// import "echarts/dist/extension/dataTool";
import "echarts/dist/echarts.min.js";
import {
  getAppUserCount,
  getNewOrderCount,
  getNeedsCount,
  getNurseCount,
  getIncome,
  getOrder,
} from "../api/getData";
const monthAmountData = {
  "2020-01": "",
  "2020-02": "",
  "2020-03": "",
  "2020-04": "",
  "2020-05": "",
  "2020-06": "",
  "2020-07": "",
  "2020-08": "",
  "2020-09": "",
  "2020-10": "",
  "2020-11": "",
  "2020-12": "",
};
const monthOrderData = {
  "2020-01": "",
  "2020-02": "",
  "2020-03": "",
  "2020-04": "",
  "2020-05": "",
  "2020-06": "",
  "2020-07": "",
  "2020-08": "",
  "2020-09": "",
  "2020-10": "",
  "2020-11": "",
  "2020-12": "",
};
export default {
  props: {
    sevenDate: {
      type: Array,
    },
    sevenDay: {
      type: Array,
    },
    Data: {
      type: Object,
    },

    change: {
      type: Function,
    },
  },
  data() {
    return {
      dateArray: [],
      monthAmount: [],
      monthOrder: [],
      newArr: [],
      valArr: [],
      keyArr: [],
      orderArr: [],
      nssNurse: "",
      ssNurse: "",
    };
  },
  methods: {
    async initData() {
      this.dateArray = this.GetDate.getWeek();
      await this.getAllData();
      this.mapCharts();
    },

    //获取数据
    async getAllData() {
      const res = await Promise.all([
        getIncome({
          status: 1,
          type: "month",
        }),
        getOrder({
          type: "month",
        }),
        // 近一周的数据
        getIncome({
          startTime: this.dateArray[0],
          endTime: this.dateArray[6],
          status: 1,
          type: "day",
        }),
        getOrder({
          startTime: this.dateArray[0],
          endTime: this.dateArray[6],
          type: "day",
        }),
      ]);
      this.monthAmount = [];
      this.monthOrder = [];
      this.newArr = [];
      this.valArr = [];
      this.orderArr = [];
      console.log(res);
      let monthAmount = Object.assign(monthAmountData, res[0].data);
      let monthOrder = Object.assign(monthOrderData, res[1].data);
      this.monthAmount = Object.values(monthAmount);
      this.monthOrder = Object.values(monthOrder);

      for (var k in res[2].data) {
        this.valArr.unshift(res[2].data[k]);
      }
      for (var k in res[3].data) {
        this.newArr.unshift(k);
        this.orderArr.unshift(res[3].data[k]);
      }
    },
    async mapCharts() {
      console.log("map");
      this.amountChart = echarts.init(document.getElementById("amount"));
      // this.monthAmountChart = echarts.init(
      //   document.getElementById("monthAmount")
      // );
      this.weekAmountChart = echarts.init(
        document.getElementById("weekAmount")
      );
      this.memberChart = echarts.init(document.getElementById("member"));
      this.userChart = echarts.init(document.getElementById("memberUser"));
      this.nursePie1Chart = echarts.init(document.getElementById("nurseSex"));
      this.nursePie2Chart = echarts.init(document.getElementById("nurseAge"));

      let amountOption = {
        title: {
          text: "年交易数据",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        legend: {
          data: ["成交额", "订单"],
        },
        xAxis: [
          {
            type: "category",
            data: Object.keys(monthAmountData),
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单数(单)",
            min: 0,
            max: 700,
            interval: 140,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "成交额(元)",
            min: 0,
            max: 600000,
            interval: 120000,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "成交额",
            type: "line",
            yAxisIndex: 1,
            data: this.monthAmount,
            itemStyle: { normal: { color: "#E5292C" } },
          },
          {
            name: "订单",
            type: "bar",
            data: this.monthOrder,
            itemStyle: { normal: { color: "#37A2DA" } },
          },
        ],
      };
      this.amountChart.setOption(amountOption);

      let weekOption = {
        title: {
          text: "最近一周交易数据",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        legend: {
          data: ["成交额", "订单"],
        },
        xAxis: [
          {
            type: "category",
            data: this.newArr,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "单数(单)",
            min: 0,
            max: 60,
            interval: 10,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "成交额(元)",
            min: 0,
            // max: 150000,
            // interval: 30000,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "成交额",
            type: "line",
            yAxisIndex: 1,
            // data: [
            //   "25603",
            //   "30526",
            //   "30025",
            //   "28900",
            //   "31002",
            //   "29960",
            //   "32065",
            // ],
            data: this.valArr,
            itemStyle: { normal: { color: "#E5292C" } },
          },
          {
            name: "订单",
            type: "bar",
            // data: ["126", "153", "148", "144", "162", "144", "166"],
            data: this.orderArr,
            itemStyle: { normal: { color: "#37A2DA" } },
          },
        ],
      };
      this.weekAmountChart.setOption(weekOption);

      let memberOption = {
        title: {
          text: "人员数据",
          left: "center",
          top: 15,
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        legend: {
          data: ["用户", "护工", "服务商"],
          show: true,
          orient: "vertical",
          left: 10,
          top: 20,
          itemWidth: 25,
          itemHeight: 15,
          itemGap: 5,
        },
        series: [
          {
            name: "人数占比",
            type: "pie",
            radius: ["40%", "55%"],
            data: [
              {
                value: this.Data.allUserCount,
                name: "用户",
                itemStyle: { normal: { color: "#20a0ff" } },
              },
              {
                value: this.Data.allNurseCount,
                name: "护工",
                itemStyle: { normal: { color: "#61A0A8" } },
              },
              {
                // value: that.Data.allForemanCount,
                value: 264,
                name: "服务商",
                itemStyle: { normal: { color: "#D48265" } },
              },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                label: {
                  show: true,
                  fontSize: 14,
                  formatter: "{c} ({d}%)",
                },
                labelLine: {
                  show: true,
                },
              },
            },
          },
        ],
      };
      this.memberChart.setOption(memberOption);

      let userOption = {
        title: {
          text: "用户",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {},
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line"] },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "用户(人)",
            min: 0,
            max: 2000,
            interval: 400,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "人数",
            type: "bar",
            data: [0, 0, 0, 0, 0, 0, 856, 1226, 1524, 686, 0, 0],
            itemStyle: {
              normal: { color: "#20a0ff" },
            },
          },
        ],
      };
      this.userChart.setOption(userOption);

      let nurseSexOption = {
        title: {
          text: "护工男女占比",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        legend: {
          data: ["男护工", "女护工"],
        },
        series: [
          {
            name: "性别占比",
            type: "pie",
            radius: "55%",
            // center: ["50%", "60%"],
            data: [
              {
                value: 553,
                name: "男护工",
                itemStyle: { normal: { color: "#67E0E3" } },
              },
              {
                value: 817,
                name: "女护工",
                itemStyle: { normal: { color: "#FBBFCC" } },
              },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.nursePie1Chart.setOption(nurseSexOption);

      let nurseAgeOption = {
        title: {
          text: "护工年龄占比",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        legend: {
          data: ["30岁以下", "30~45岁", "45岁以上"],
        },
        series: [
          {
            name: "年龄占比",
            type: "pie",
            radius: ["40%", "55%"],
            label: {
              formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
            },
            data: [
              {
                value: 448,
                name: "30岁以下",
                itemStyle: { normal: { color: "#37A2DA" } },
              },
              {
                value: 653,
                name: "30~45岁",
                itemStyle: { normal: { color: "#61A0A8" } },
              },
              {
                value: 399,
                name: "45岁以上",
                itemStyle: { normal: { color: "#FFDB5C" } },
              },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.nursePie2Chart.setOption(nurseAgeOption);
    },
  },

  watch: {
    sevenDate: function () {
      //   this.initData();
      this.$emit("change");
    },
    sevenDay: function () {
      //   this.initData();
      this.$emit("change");
    },
    Data: {
      handler(newValue, oldValue) {
        console.log(111);
        this.$nextTick(() => {
          if (this.$route.path == "/manage") {
            this.initData();
          } else {
            return;
          }
        });
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
.rowItem {
  margin-bottom: 10px;
}
</style>
