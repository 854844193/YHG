<template>
  <div class="home-wrapper">
    <!-- 成交额 -->
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, index) in amountData" :key="index">
          <el-card
            class="out-border"
            shadow="always"
            :body-style="{ padding: '0px' }"
          >
            <div class="layout-title">{{ item.title }}</div>
            <div class="date-block">
              <i
                :class="[item.icon]"
                :style="{ background: item.color }"
                class="icon-box"
              />
              <div class="date-cont">
                <CountTo
                  class="count"
                  prefix="￥"
                  style="color: #f56c6c"
                  :start-val="0"
                  :decimals="2"
                  :end-val="item.count"
                  :duration="3000"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 新增数据 -->
    <div class="date-row">
      <div v-for="(item, index) in currentData" :key="index" class="data-col">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="date-block">
            <i
              :class="[item.icon]"
              :style="{ background: item.color }"
              class="icon-box"
            />
            <div class="date-cont">
              <CountTo
                v-if="item.type"
                class="count"
                prefix="￥"
                style="color: #f56c6c"
                :start-val="0"
                :end-val="item.count"
                :duration="3000"
              />
              <CountTo
                v-else
                class="count current"
                :start-val="0"
                :end-val="item.count"
                :duration="3000"
              />
              <p class="title">{{ item.title }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 总数据 -->
    <div class="date-row">
      <div v-for="(item, index) in allData" :key="index" class="data-col">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="date-block">
            <i
              :class="[item.icon]"
              :style="{ background: item.color }"
              class="icon-box"
            />
            <div class="date-cont">
              <CountTo
                v-if="item.type"
                class="count"
                style="color: #f56c6c"
                prefix="￥"
                :start-val="0"
                :end-val="item.count"
                :duration="3000"
              />
              <CountTo
                v-else
                class="count all"
                :start-val="0"
                :end-val="item.count"
                :duration="3000"
              />
              <p class="title">{{ item.title }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 平台人员数据 -->
    <el-row class="date-box" :gutter="20">
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsPie
            :title="title[0]"
            type="ring"
            :showName="nameList[0]"
            :data="rememberData"
            class="data-desc"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsPie
            :title="title[1]"
            type="pie"
            :data="nurseSexData"
            class="data-desc"
          />
        </el-card>
        <!-- <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="data-desc data-lang-box">
            <div class="data-lang-title">项目语言构成</div>
            <div
              v-for="(item, index) in langsData"
              :key="index"
              class="data-lang-item"
            >
              <label>{{ item.name }}</label>
              <el-progress
                :percentage="item.value"
                :stroke-width="16"
                :color="item.color"
              />
            </div>
          </div>
        </el-card> -->
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsPie
            :title="title[2]"
            type="ring"
            :data="nurseAgeData"
            class="data-desc"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- 前七天数据 -->
    <el-row class="date-box" :gutter="20">
      <el-col :span="12">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsBar
            :title="title[3]"
            :colorName="colorList[2]"
            :showName="nameList[0]"
            :data="weekOrderData || {}"
            class="data-chart"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsLine
            :title="title[4]"
            :colorName="colorList[3]"
            :showName="nameList[1]"
            :data="weekAmountData"
            class="data-chart"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 月数据 -->
    <el-row class="date-box" :gutter="20">
      <el-col :span="24">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <el-button
            v-if="!isShow1"
            type="primary"
            size="mini"
            @click="changeShow('bar', 'last')"
            style="margin: 10px 20px -10px"
          >
            查看上月
          </el-button>
          <el-button
            v-if="isShow1"
            type="primary"
            size="mini"
            @click="changeShow('bar', 'current')"
            style="margin: 10px 20px -10px"
          >
            返回当月
          </el-button>
          <!-- 当月 -->
          <ChartsBar
            v-if="!isShow1"
            :title="title[7]"
            :colorName="colorList[1]"
            :showName="nameList[0]"
            :data="currentMonthData[1]"
            class="data-chart"
          />
          <!-- 上月 -->
          <ChartsBar
            v-if="isShow1"
            :title="title[9]"
            :colorName="colorList[1]"
            :showName="nameList[0]"
            :data="lastMonthData[1]"
            class="data-chart"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row class="date-box" :gutter="20">
      <el-col :span="24">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <el-button
            v-if="!isShow2"
            type="primary"
            size="mini"
            @click="changeShow('line', 'last')"
            style="margin: 10px 20px -10px"
          >
            查看上月
          </el-button>
          <el-button
            v-if="isShow2"
            type="primary"
            size="mini"
            @click="changeShow('line', 'current')"
            style="margin: 10px 20px -10px"
          >
            返回当月
          </el-button>
          <ChartsLine
            v-if="!isShow2"
            :title="title[8]"
            :colorName="colorList[0]"
            :showName="nameList[1]"
            :data="currentMonthData[0]"
            class="data-chart"
          />
          <ChartsLine
            v-if="isShow2"
            :title="title[10]"
            :colorName="colorList[0]"
            :showName="nameList[1]"
            :data="lastMonthData[0]"
            class="data-chart"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- 12个月数据 -->
    <el-row class="date-box" :gutter="20">
      <el-col :span="12">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsBar
            :title="title[5]"
            :colorName="colorList[4]"
            :showName="nameList[0]"
            :isReverse="false"
            :data="yearOrderData"
            class="data-chart"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsLine
            :title="title[6]"
            :colorName="colorList[5]"
            :showName="nameList[1]"
            :isReverse="false"
            :data="yearAmountData"
            class="data-chart"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import ChartsPie from "components/Charts/ChartsPie";
import ChartsBar from "components/Charts/ChartsBar";
import ChartsLine from "components/Charts/ChartsLine";
import {
  getAllOrderAmount,
  getAppUserCount,
  getNewOrderCount,
  getNurseCount,
  getIncome,
  getOrder,
} from "../api/getData";
const monthAData = {
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
const monthOData = {
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
  name: "Home",
  components: { CountTo, ChartsPie, ChartsBar, ChartsLine },
  data() {
    return {
      title: [
        "平台人员数据",
        "平台护工男女占比",
        "平台护工年龄段占比",
        "前七天订单",
        "前七天成交额",
        "12个月订单",
        "12个月成交额",
        "当月订单",
        "当月成交额",
        "上月订单",
        "上月成交额",
      ],
      nameList: ["订单", "成交额"],
      colorList: [
        "#F56C6C",
        "#19be6b",
        "#2d8cf0",
        "#ff9900",
        "#9a66e4",
        "#e46cbb",
      ],
      weekDate: [],
      lastMonthDate: [],
      currentMonthDate: [],
      lastMonthData: [],
      currentMonthData: [],
      // langsData: [
      //   { name: "VUE", value: 45, color: "#2d8cf0" },
      //   { name: "ES6", value: 32, color: "#19be6b" },
      //   { name: "TS", value: 4, color: "#ff9900" },
      //   { name: "LESS", value: 13, color: "#e46cbb" },
      //   { name: "HTML", value: 6, color: "#9a66e4" },
      // ],
      amountData: [
        {
          title: "今日成交额",
          type: "money",
          icon: "vue-dsn-iconincome-o",
          count: 0,
          color: "#19be6b",
        },
        {
          title: "总成交额",
          type: "money",
          icon: "vue-dsn-iconincome-o",
          count: 0,
          color: "#19be6b",
        },
      ],
      currentData: [
        {
          title: "新增用户",
          icon: "vue-dsn-icon-xinzeng",
          count: 0,
          color: "#2d8cf0",
        },
        {
          title: "新增护工",
          icon: "vue-dsn-iconchengyuan",
          count: 0,
          color: "#e46cbb",
        },
        {
          title: "新增服务商",
          icon: "vue-dsn-iconchengyuanguanli",
          count: 0,
          color: "#ff9900",
        },
        {
          title: "今日订单",
          icon: "vue-dsn-iconicon",
          count: 0,
          color: "#9a66e4",
        },
      ],
      allData: [
        {
          title: "所有用户",
          icon: "el-icon-user-solid",
          count: 0,
          color: "#2d8cf0",
        },
        {
          title: "所有护工",
          icon: "vue-dsn-iconchengyuan",
          count: 0,
          color: "#e46cbb",
        },
        {
          title: "所有服务商",
          icon: "vue-dsn-iconchengyuanguanli",
          count: 0,
          color: "#ff9900",
        },
        {
          title: "所有订单",
          icon: "vue-dsn-iconicon",
          count: 0,
          color: "#9a66e4",
        },
      ],
      rememberData: [
        { value: 0, name: "用户" },
        { value: 0, name: "护工" },
        { value: 0, name: "服务商" },
      ],
      nurseSexData: [
        { value: 780, name: "男性" },
        { value: 841, name: "女性" },
      ],
      nurseAgeData: [
        { value: 452, name: "<30岁" },
        { value: 805, name: "30~45岁" },
        { value: 364, name: ">45岁" },
      ],
      weekOrderData: {},
      weekAmountData: {},
      yearOrderData: {},
      yearAmountData: {},
      isShow1: false,
      isShow2: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 获取数据
    initData() {
      this.countData();
      var setTime = setInterval(() => {
        this.countData();
      }, 60000);
    },
    // 今日数据、全部数据
    async countData() {
      let nowDate = this.GetDate.getCurrentDate();
      this.weekDate = this.GetDate.getWeek();
      this.currentMonthDate = this.GetDate.getMonthDate();
      this.lastMonthDate = this.GetDate.getLastMonthDate();
      const res = await Promise.all([
        getAppUserCount({ type: 1 }),
        getAppUserCount({ type: 2 }),
        getAppUserCount({ type: 3 }),
        getAppUserCount({ create_time: nowDate, type: 1 }),
        getAppUserCount({ create_time: nowDate, type: 2 }),
        getAppUserCount({ create_time: nowDate, type: 3 }),
        getNewOrderCount(),
        getOrder({
          startTime: nowDate,
          endTime: nowDate,
          type: "day",
        }),
        getIncome({
          status: 1,
          type: "year",
        }),
        getIncome({
          startTime: nowDate,
          endTime: nowDate,
          status: 1,
          type: "day",
        }),
        // 每个月的数据
        getIncome({
          status: 1,
          type: "month",
        }),
        getOrder({
          type: "month",
        }),
        // 近一周的数据
        getIncome({
          startTime: this.weekDate[0],
          endTime: this.weekDate[6],
          status: 1,
          type: "day",
        }),
        getOrder({
          startTime: this.weekDate[0],
          endTime: this.weekDate[6],
          type: "day",
        }),
        // 当月的数据
        getIncome({
          startTime: this.currentMonthDate[0],
          endTime: this.currentMonthDate[1],
          status: 1,
          type: "day",
        }),
        getOrder({
          startTime: this.currentMonthDate[0],
          endTime: this.currentMonthDate[1],
          type: "day",
        }),
        // 上月的数据
        getIncome({
          startTime: this.lastMonthDate[0],
          endTime: this.lastMonthDate[1],
          status: 1,
          type: "day",
        }),
        getOrder({
          startTime: this.lastMonthDate[0],
          endTime: this.lastMonthDate[1],
          type: "day",
        }),
      ]);
      // console.log(res);
      //今日数据
      this.amountData[0].count = Object.values(res[9].data).length
        ? Object.values(res[9].data)[0]
        : 0;
      this.currentData[0].count = res[4].data;
      this.currentData[1].count = res[3].data;
      this.currentData[2].count = res[5].data;
      this.currentData[3].count = Object.values(res[7].data).length
        ? Object.values(res[7].data)[0]
        : 0;
      // 全部数据
      this.amountData[1].count = Object.values(res[8].data).length
        ? Object.values(res[8].data)[0]
        : 0;
      this.allData[0].count = res[1].data;
      this.allData[1].count = res[0].data;
      this.allData[2].count = res[2].data;
      this.allData[3].count = res[6].data;
      this.rememberData[0].value = res[1].data;
      this.rememberData[1].value = res[0].data;
      this.rememberData[2].value = res[2].data;
      this.weekAmountData = res[12].data;
      this.weekOrderData = res[13].data;
      this.currentMonthData[0] = res[14].data;
      this.currentMonthData[1] = res[15].data;
      this.lastMonthData[0] = res[16].data;
      this.lastMonthData[1] = res[17].data;
      this.yearAmountData = Object.assign(monthAData, res[10].data);
      this.yearOrderData = Object.assign(monthOData, res[11].data);
    },
    changeShow(type, med) {
      if (type == "bar" && med == "last") {
        if (Object.values(this.lastMonthData[1]).length) {
          this.isShow1 = !this.isShow1;
        } else {
          this.isShow1 = !this.isShow1;
          // this.$message({
          //   type: "error",
          //   message: "数据异常，请联系管理员！",
          //   center: true,
          // });
        }
      } else if (type == "bar" && med == "current") {
        if (Object.values(this.currentMonthData[1]).length) {
          this.isShow1 = !this.isShow1;
        } else {
          this.isShow1 = !this.isShow1;
          // this.$message({
          //   type: "error",
          //   message: "数据异常，请联系管理员！",
          //   center: true,
          // });
        }
      }
      if (type == "line" && med == "last") {
        if (Object.values(this.lastMonthData[0]).length) {
          this.isShow2 = !this.isShow2;
        } else {
          this.isShow2 = !this.isShow2;
          // this.$message({
          //   type: "error",
          //   message: "数据异常，请联系管理员！",
          //   center: true,
          // });
        }
      } else if (type == "line" && med == "current") {
        if (Object.values(this.currentMonthData[0]).length) {
          this.isShow2 = !this.isShow2;
        } else {
          this.isShow2 = !this.isShow2;
          // this.$message({
          //   type: "error",
          //   message: "数据异常，请联系管理员！",
          //   center: true,
          // });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home-wrapper {
  padding: 20px;
  .overview-layout {
    margin-bottom: 20px;
    .out-border {
      border: 1px solid #dcdfe6;
      .layout-title {
        color: #606266;
        padding: 15px 20px;
        background: #f2f6fc;
        font-size: 25px;
        font-weight: bold;
        text-align: center;
      }
      .date-block {
        display: flex;
        align-items: center;
        height: 120px;
        .icon-box {
          font-size: 40px;
          width: 120px;
          height: 120px;
          text-align: center;
          line-height: 120px;
          color: #fff;
        }
        .date-cont {
          flex: 1;
          text-align: center;
          .count {
            line-height: 60px;
            font-size: 40px;
          }
        }
      }
    }
  }

  .date-row {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    .data-col {
      flex: 1;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
      .date-block {
        display: flex;
        align-items: center;
        height: 120px;
        .icon-box {
          font-size: 40px;
          width: 120px;
          height: 120px;
          text-align: center;
          line-height: 120px;
          color: #fff;
        }
        .date-cont {
          flex: 1;
          text-align: center;
          color: #515a6e;
          .count {
            line-height: 60px;
            font-size: 30px;
          }
          .all {
            color: #20a0ff;
          }
          .current {
            color: #ff9800;
          }
          .title {
            font-size: 16px;
          }
        }
      }
    }
  }
  .date-box {
    margin-bottom: 20px;
  }
  .data-desc {
    width: 100%;
    height: 320px;
  }
  .data-chart {
    width: 100%;
    height: 400px;
  }
  .data-lang-box {
    padding: 10px 25px;
    box-sizing: border-box;
    .data-lang-title {
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      margin-bottom: 10px;
    }
    .data-lang-item {
      height: 48px;
      line-height: 20px;
    }
  }
}
</style>