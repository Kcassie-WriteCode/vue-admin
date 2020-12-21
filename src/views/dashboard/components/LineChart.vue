<template>
  <div ref="lineChart" class="line-chart">div</div>
</template>

<script>
import Echarts from "echarts";
import "echarts/theme/macarons";
import resize from "./mixins/resize";

export default {
  name: "LineChart",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    yTittle: {
      type: String,
      required: true,
    },
  },
  mixins: [resize],
  watch: {
    //监视chartDate的变化
    chartData({ expectedData, actualData }) {
      this.setOption({ expectedData, actualData });
    },
  },
  methods: {
    initChart() {
      //初始化echarts实例
      this.chart = Echarts.init(this.$refs.lineChart, "macarons");
    },
    setOption({ expectedData, actualData }) {
      const option = {
        /*  title: {
          text: "堆叠区域图",
        }, */
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "skyblue",
            },
          },
          textStyle: {
            color: " #fff",
          },
        },
        legend: {
          data: ["预期", "实际"],
        },
        /* toolbox: {
          feature: {
            saveAsImage: {},
          },
        }, */
        grid: {
          left: "2%",
          right: "2%",
          bottom: "1%",
          containLabel: true, //防止标签溢出
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            name: "交易金额（万元）",
            type: "value",
          },
        ],
        series: [
          {
            name: "预期",
            type: "line",
            // stack: "总量",
            areaStyle: {
              color: "#ccc",
            },
            data: expectedData,
            smooth: true,
            lineStyle: {
              color: "red",
            },
          },
          {
            name: "实际",
            type: "line",
            // stack: "总量",
            // areaStyle: {},
            data: actualData,
            smooth: true,
            lineStyle: {
              color: "blue",
            },
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
  mounted() {
    this.initChart();
  },
};
</script>

<style lang="sass" scoped>
.line-chart
  width: 100%
  height: 300px
</style>

