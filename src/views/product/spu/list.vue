<template>
  <div>
    <SkuShowList v-if="isShowSkuList" :spuItem="spuItem" />
    <div v-else>
      <Category />
      <!--
      v-show 组件虽然是隐藏的，但是组件被加载了~
     -->
      <SpuShowList v-if="isShowList" @showSkuList="showSkuList" />
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuShowList from "./skuShowList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {}, //收集当前行的信息//传给spuUpdatelist
      isShowSkuList: false,
      spuItem: {},
    };
  },
  methods: {
    //点击edit按钮,传参为row //给showlist写全局事件
    showUpdateList(row) {
      //切换界面
      this.isShowList = false;
      //修改时row为传过来的整行的数据，添加时row为传过来的category3id
      this.item = { ...row };
    },
    //给updatelist绑定自定义事件
    showList(category3Id) {
      //点击保存或者取消 切换组件
      this.isShowList = true;
      //要等到showlist组件dom元素渲染完，绑定了change事件才可以触发，更新页面数据
      //这里只发category3id，得用对象结构，不然传的是一个number
      //绑定事件的那一方必须接收的是一个对象，
      //不然，赋值会出现给数字创建一个category3id属性的错误
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
    showSkuList(row) {
      //切换到skushowlist组件
      this.isShowSkuList = true;
      this.spuItem = { ...row };
    },
  },
  mounted() {
    this.$bus.$on("showUpdateList", this.showUpdateList);
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuShowList,
  },
};
</script>
