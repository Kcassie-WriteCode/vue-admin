<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item label="一级分类">
          <!-- v-model的值为el-option的值 -->
          <el-select
            v-model="category.category1Id"
            @change="handleSelectChange1"
            :disabled="disabled"
          >
            <el-option
              v-for="c1 in category1List"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            @change="handleSelectChange2"
            :disabled="disabled"
          >
            <el-option
              v-for="c2 in category2List"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            @change="handleSelectChange3"
            :disabled="disabled"
          >
            <el-option
              v-for="c3 in category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Category",
  props: ["disabled"],
  data() {
    const { category } = this.$store.state.category;
    return {
      category: {
        category1List: category.category1Id,
        category2List: category.category2Id,
        category3List: category.category3Id,
      },
    };
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },
  methods: {
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    ...mapMutations(["category/SET_CATEGORY3_ID"]),
    //获得分类列表2
    handleSelectChange1(category1Id) {
      //处理change事件的input框的问题
      //重新选择，其他的都要清除
      this["category/getCategory2List"](category1Id);
      //this.$bus.$emit("clearList");
    },
    //获得分类列表3
    handleSelectChange2(category2Id) {
      this["category/getCategory3List"](category2Id);
      //清空父组件数据
      //this.$bus.$emit("clearList");
    },
    handleSelectChange3(category3Id) {
      this["category/SET_CATEGORY3_ID"](category3Id);
      //给attr父组件传递category
      //给兄弟spushowlist传递category
    },
  },
  //获得分类列表1
  mounted() {
    this["category/getCategory1List"]();
  },
};
</script>

<style>
</style>
