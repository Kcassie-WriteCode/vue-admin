<template>
  <div>
    <Category />
    <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
    <SpuShowList v-if="isShowList" />
    <SpuUpdateList v-else :item="item" @showList="showList" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {}, //收集当前行的信息//传给spuUpdatelist
    };
  },
  methods: {
    //点击edit按钮,传参为row
    showUpdateList(row) {
      //切换界面
      this.isShowList = false;
      this.item = { ...row };
    },
    //给updatelist绑定自定义事件
    showList(category3Id) {
      //点击保存或者取消 切换组件
      this.isShowList = true;
      //更新页面数据
      this.$nextTick(() => {
        this.$bus.$emit("change", category3Id);
      });
    },
  },
  mounted() {
    this.$bus.$on("showUpdateList", this.showUpdateList);
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
