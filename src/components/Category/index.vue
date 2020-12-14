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
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  props: ["disabled"],
  methods: {
    //获得分类列表2
    async handleSelectChange1(category1Id) {
      //处理change事件的input框的问题
      //重新选择，其他的都要清除
      this.category.category2Id = "";
      this.category.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      const result = await this.$API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
      this.$emit("clearList");
    },
    //获得分类列表3
    async handleSelectChange2(category2Id) {
      this.category.category3Id = "";
      this.category3List = [];
      const result = await this.$API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
      //清空父组件数据
      this.$emit("clearList");
    },
    //给父组件传递category
    handleSelectChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      this.$emit("change", category);
    },
  },
  //获得分类列表1
  async mounted() {
    const result = await this.$API.attr.getCategory1();
    if (result.code === 200) {
      this.category1List = result.data;
    }
  },
};
</script>

<style>
</style>
