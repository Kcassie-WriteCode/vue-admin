<template>
  <div>
    <Category />
    <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
    <SpuShowList v-if="isShowList" />
    <SpuUpdateList v-else :item="item" />
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
      item: [], //收集当前行的信息//传给spuUpdatelist
    };
  },
  methods: {
    //点击edit按钮,传参为row
    showUpdateList(row) {
      //切换界面
      this.isShowList = false;
      this.item = { ...row };
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
