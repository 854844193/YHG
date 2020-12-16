<template>
  <div class="fillcontain">
    <!-- <dataShow></dataShow> -->
    <!-- <section class="data_section table_container">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="data_list turnover_head" style="margin-bottom: 10px">
            <span class="data_num head">总成交额：</span>
          </div>
        </el-col>
        <el-col :span="4">
            <div class="data_list">
              今日
              <count-to
                :start-val="0"
                :end-val="Data.userCount"
                :duration="3000"
                class="data_num flow"
              />
              <span class="data_num flow">{{ Data.nowAmount }}</span>
            </div>
          </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num flow">{{ "￥" + Data.allOrderAmount }}</span>
          </div>
        </el-col>
        <el-col :span="4">
            <div class="data_list">
              浏览量
              <span class="data_num flow">{{ clickNum }}</span>
            </div>
          </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="4">
          <div class="data_list today_head">
            <span class="data_num head">当日数据：</span>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="data_list">
            新增用户
            <span class="data_num new">{{ Data.userCount }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            新增护工
            <span class="data_num new">{{ Data.nurseCount }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            新增服务商
            <span class="data_num new">{{ Data.foremanCount }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            新增订单
            <span class="data_num new">{{ Data.orderCount }}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="4">
          <div class="data_list all_head">
            <span class="data_num head">总数据：</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            用户
            <span class="data_num all">{{ Data.allUserCount }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            护工
            <span class="data_num all">{{ Data.allNurseCount }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            服务商
            <span class="data_num all">{{ Data.allForemanCount }}</span>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="data_list">
            订单
            <span class="data_num all">{{ Data.allOrderCount }}</span>
          </div>
        </el-col>
      </el-row>

      <div class="mainData" v-if="isRouterAlive">
        <tendency
          :sevenDate="sevenDate"
          :sevenDay="sevenDay"
          :Data="Data"
          @change="getSevenData"
        ></tendency>
      </div>
    </section> -->
    <Error></Error>
  </div>
</template>

<script>
import Error from "components/ErrorPage/error";
import tendency from "components/tendency";
import dataShow from "components/dataShow";
import CountTo from "vue-count-to";
import dtime from "time-formater";
import {
  getAppUserCount,
  getNewOrderCount,
  getNeedCount,
  getAllOrderAmount,
  getClickNum,
  getIncome,
} from "@/api/getData";
export default {
  components: {
    dataShow,
    tendency,
    Error,
  },
  data() {
    return {
      Data: {
        userCount: 0,
        nurseCount: 0,
        foremanCount: 0,
        needsCount: 0,
        orderCount: 0,
        allNurseCount: 0,
        allUserCount: 0,
        allForemanCount: 0,
        allOrderCount: 0,
        allNeedsCount: 0,
        allOrderAmount: 0.0,
        nowAmount: 0.0,
      },
      sevenDay: [],
      sevenDate: [],
      clickNum: 0,
      isRouterAlive: true,
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  mounted() {
    // this.initData();
    // for (let i = 6; i > -1; i--) {
    //   const date = dtime(new Date().getTime() - 86400000 * i).format(
    //     "YYYY-MM-DD"
    //   );
    //   this.sevenDay.push(date);
    // }
    // if (this.$route.path == "/manage") {
    //   var setTime = setInterval(() => {
    //     this.getSevenData();
    //   }, 60000);
    // } else {
    //   return;
    // }
  },
  computed: {
    message() {
      return "当前页面暂未开放......";
    },
  },
  methods: {
    async initData() {},
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    async getSevenData() {
      let nowDate = this.GetDate.getCurrentDate();
      const res = await Promise.all([
        getAppUserCount({ type: 1 }),
        getAppUserCount({ type: 2 }),
        getAppUserCount({ type: 3 }),
        getAppUserCount({ create_time: nowDate, type: 1 }),
        getAppUserCount({ create_time: nowDate, type: 2 }),
        getAppUserCount({ create_time: nowDate, type: 3 }),
        getNewOrderCount(),
        getNewOrderCount({ create_time: nowDate }),
        getNeedCount(),
        getNeedCount({ create_time: nowDate }),
        getAllOrderAmount(),
        getClickNum(),
        getIncome({
          startTime: nowDate,
          endTime: nowDate,
          status: 1,
          type: "day",
        }),
      ]);
      // console.log(res);
      this.Data = {
        userCount: res[4].data,
        nurseCount: res[3].data,
        foremanCount: res[5].data,
        needsCount: res[9].data,
        orderCount: res[7].data,
        allNurseCount: res[0].data,
        allUserCount: res[1].data,
        allForemanCount: res[2].data,
        allOrderCount: res[6].data,
        allNeedsCount: res[8].data,
        allOrderAmount: res[10].data,
        // nowAmount: res[12].data,
      };
      this.clickNum = res[11].data;
    },
  },
};
</script>

<style lang="less">
@import "../../style/mixin";
.explain_text {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  color: #333;
}
.data_section {
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin: 20px 0;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      // color: #333;
      font-size: 26px;
    }
    .flow {
      color: #f56c6c;
    }
    .new {
      color: #ff9800;
    }
    .all {
      color: #20a0ff;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .turnover_head {
    background: #67c23a;
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  .sc(16px, #333);
}
</style>