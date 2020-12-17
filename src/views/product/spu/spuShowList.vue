<template>
  <el-card style="margin-top: 20px" v-loading="loading">
    <!-- 添加数据完，返回showlist界面也需要category3id，得传进去 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="$emit('showUpdateList', category)"
      :disabled="!category.category3Id"
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
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="$emit('showSkuList', { ...row, ...category })"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$emit('showUpdateList', { ...row, ...category })"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-popconfirm
            :title="`确定删除${row.spuName}吗`"
            @onConfirm="delSpuAtrr(row.id)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </el-popconfirm>
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
import { mapState } from "vuex";
export default {
  name: "SpuShowList",
  data() {
    return {
      spuList: [], //获取spu分类列表
      total: 0, //总条数
      page: 1, //当前页码
      limit: 3, //每页显示的条数
      loading: false,
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id": {
      handler(category3Id) {
        //处理再次点击分类的时候发送请求的清空，
        //不然点击一二等级时，category3id是从有到没有，也会发请求
        //如果没有category3id就不发请求
        if (!category3Id) return;
        //category3id从没有到有就发请求
        this.getPageList(this.page, this.limit);
      },
      immediate: true,
    },
    //重新选择一级分类时清空数据
    "category.category1Id"() {
      this.clearList();
    },
    //重新选择一级分类时清空数据
    "category.category2Id"() {
      this.clearList();
    },
  },
  methods: {
    //删除整行 spuattr
    async delSpuAtrr(skuId) {
      const result = await this.$API.spu.deleteSpu(skuId);
      if (result.code === 200) {
        this.$message.success("删除spu成功");
        //更新页面
        this.getPageList(this.page, this.limit);
      } else {
        this.$message.error(error.message);
      }
    },
    //获取spulist数据
    async getPageList(page, limit) {
      //发送数据请求之前先加载
      this.loading = true;
      const result = await this.$API.spu.getSpuPageList({
        page,
        limit,
        category3Id: this.category.category3Id,
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
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
};
</script>

<style lang="sass" scoped>
.el-button+.el-button
  margin-left: 0px
</style>

