<template>
  <div ref="dom" class="charts-bar" />
</template>

<script>
import echarts from "echarts";
export default {
  name: "ChartsBar",
  props: {
    title: {
      type: String,
      default: "",
    },
    showName: {
      type: String,
      default: "",
    },
    colorName: {
      type: String,
      default: "",
    },
    isReverse: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dom: null,
      xAxisData: {},
      seriesData: {},
    };
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
      if (Object.keys(this.data).length < 0) return;
      if (this.isReverse) {
        this.xAxisData = Object.keys(this.data).reverse();
        this.seriesData = Object.values(this.data).reverse();
      } else {
        this.xAxisData = Object.keys(this.data);
        this.seriesData = Object.values(this.data);
      }
      const options = {
        // 标题
        title: {
          text: this.title,
          left: "center",
          top: 15,
          textStyle: {
            fontSize: 16,
            fontWeight: "600",
          },
        },
        // 工具提示
        tooltip: {
          trigger: "axis",
          formatter: "{b} <br/>{a} : {c}",
          axisPointer: {
            type: "shadow",
          },
        },
        toolbox: {
          feature: {
            // dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line"] },
            saveAsImage: { show: true },
            restore: { show: true },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.xAxisData,
            axisTick: {
              alignWithLabel: true,
            },
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              interval: 0,
              rotate: 40,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: this.showName,
            max: (value) => {
              if (value.max < 100) {
                return Math.ceil(value.max / 10) * 10 + 10;
              } else {
                return Math.ceil(value.max / 100) * 100 + 50;
              }
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        // 颜色配置
        color: [this.colorName],
        // 类型配置
        series: [
          {
            // 类型配置
            name: this.showName,
            type: "bar",
            barWidth: "50%",
            // 数据配置
            data: this.seriesData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  fontSize: 14,
                  position: "top",
                  formatter: "{c}",
                },
              },
            },
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
        console.log("变化");
        if (Object.keys(newVal).length > 0) this.drawing();
      },
      // immediate: true,
      deep: true, //对象内部属性的监听，关键。
    },
  },
};
</script>