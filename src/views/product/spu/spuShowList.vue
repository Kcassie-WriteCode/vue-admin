<template>
  <el-card style="margin-top: 20px" v-loading="loading">
    <!-- :disabled="!category.category3Id" -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      :disabled="category.category3Id > 0 ? false : true"
      @click="$bus.$emit('showUpdateList')"
      >添加SPU</el-button
    >
    <el-table :data="spuList" border style="width: 100%; margin: 20px 0">
      <!--  v-loading="loading" -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$bus.$emit('showUpdateList', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :current-page="page"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",
  data() {
    return {
      spuList: [], //获取spu分类列表
      total: 0, //总条数
      page: 1, //当前页码
      limit: 3, //每页显示的条数
      category: {
        //要改变category定义为响应式
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      loading: false,
    };
  },
  methods: {
    //获取spulist数据
    async getPageList(page, limit) {
      //发送数据请求之前先加载
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuPageList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取spuPageList数据成功");
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error("失败");
      }
      //请求之后，无论成功与否，都设置为false，加载完成
      this.loading = false;
    },
    //这里因为要卸载所以必须封装函数
    //因为分页器的函数已经封装好了，只能传两个参
    handleSpuPageList(category) {
      this.category = category; //点击三级分类获取category
      this.getPageList(this.page, this.limit);
    },
    //再次点击分类的时候要清空spushowlist页面
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
  mounted() {
    this.$bus.$on("change", this.handleSpuPageList);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.handleSpuPageList);
    this.$bus.$off("clearList", this.clearListt);
  },
};
</script>

<style lang="sass" scoped>
.el-button+.el-button
  margin-left: 0px
</style>

