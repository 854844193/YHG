<template>
  <div ref="dom" class="charts-pie" />
</template>

<script>
import echarts from "echarts";
export default {
  name: "ChartsPie",
  props: {
    title: {
      type: String,
      default: "",
    },
    showName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "pie",
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dom: null,
      legendData: [],
    };
  },
  mounted() {
    this.drawing();
  },
  beforeDestroy() {
    // if (this.dom) {
    //   this.dom.clear();
    // }
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    drawing() {
      if (this.data) {
        this.legendData = this.data.map((item) => item.name);
      }
      const radius = this.type === "pie" ? "70%" : ["50%", "70%"];
      const options = {
        // 标题
        title: {
          text: this.title,
          left: "center",
          top: 5,
          textStyle: {
            fontSize: 16,
            fontWeight: "600",
          },
        },
        // 工具提示
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        // 图例说明
        legend: {
          show: true,
          // orient: "vertical",
          top: 25,
          itemWidth: 25,
          itemHeight: 15,
          itemGap: 5,
          data: this.legendData,
          textStyle: {
            color: "#aaa",
            fontSize: 12,
          },
        },
        // 颜色配置
        color: ["#2d8cf0", "#19be6b", "#ff9900", "#e46cbb", "#9a66e4"],
        // 类型配置
        series: [
          {
            itemStyle: {
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
            name: this.showName,
            // 类型配置
            type: "pie",
            radius: radius,
            center: ["52%", "55%"],
            // 数据配置
            data: this.data,
          },
        ],
      };
      this.dom = echarts.init(this.$refs.dom);
      this.dom.setOption(options);
      window.addEventListener("resize", this.resize);
    },
  },
  watch: {
    //观察data的变化
    data: {
      handler(newVal, oldVal) {
        if (Object.keys(newVal).length > 0) this.drawing();
        // if (newVal) {
        //   this.$nextTick(() => {
        //     this.drawing();
        //   });
        // }
      },
      // immediate: true,
      deep: true, //对象内部属性的监听，关键。
    },
  },
};
</script>