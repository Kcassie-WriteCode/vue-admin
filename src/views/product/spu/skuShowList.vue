<template>
  <el-card>
    <el-form label-width="100px" :model="sku" ref="skuForm" :rules="rules">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="skuPrice">
        <el-input-number
          controls-position="right"
          @change="handleChange"
          :min="0"
          :max="10"
          placeholder="SKU价格"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          controls-position="right"
          @change="handleChange"
          :min="0"
          :max="10"
          placeholder="SKU重量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDescription">
        <el-input type="textarea" placeholder="SKU规格描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          class="skulist-select-container"
          v-for="attr in attrList"
          :key="attr.id"
        >
          <span> {{ attr.attrName }}</span>
          <el-select placeholder="请输入" v-model="spu.attrId">
            <el-option
              :label="attrValue.valueName"
              :value="attrValue.id"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuTm">
        <div
          class="skulist-select-container"
          v-for="sale in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select placeholder="请输入" v-model="spu.description">
            <el-option
              :label="spuSaleAttrValue.saleAttrValueName"
              :value="spuSaleAttrValue.id"
              v-for="spuSaleAttrValue in sale.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <el-table
          border
          style="width: 100%"
          :data="imageList"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="图片">
            <template v-slot="{ row }">
              <img
                :src="row.imgUrl"
                :alt="row.imgName"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template v-slot="{ row }"
              ><span>{{ row.imgName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button size="mini" type="primary">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SkuShowList",
  props: ["spuItem"],
  data() {
    return {
      a: 1,
      spu: this.spuItem, //标准化产品单元
      sku: {}, //sku库存保有单位
      rules: {}, //校验规则
      imageList: [], //图片列表
      spuSaleAttrList: [], //销售属性
      attrList: [], //平台属性
    };
  },
  methods: {
    handleChange() {},
    handleSelectionChange() {},
    //获取单个spu销售属性
    async getsSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getsSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("品牌列表获取成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(error.message);
      }
    },
    //获取图片信息
    async getSpuImageList() {
      //spu的id
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("图片列表获取成功");
        this.imageList = result.data;
      } else {
        this.$message.error(error.message);
      }
    },
    //获取商品属性信息
    async getAttrList() {
      //保存起category,以便修改完成保存信息的时候要用
      const result = await this.$API.attr.getAttrInfoList({
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
  mounted() {
    this.getsSpuSaleAttrList();
    this.getSpuImageList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left
.skulist-select-container
  display: inline-block
  margin-right: 20px
</style>

