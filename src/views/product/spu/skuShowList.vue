<template>
  <el-card>
    <el-form label-width="100px" :model="sku" ref="skuForm" :rules="rules">
      <el-form-item label="SPU名称">
        <span>111</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="skuName">
        <el-input-number
          controls-position="right"
          @change="handleChange"
          :min="0"
          :max="10"
          placeholder="SKU价格"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="skuName">
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
      <el-form-item label="平台属性" prop="spuTm">
        <div class="sku-select-list">
          <span>111</span>
          <el-select placeholder="请输入" v-model="a">
            <el-option value="a">333</el-option>
          </el-select>
        </div>
        <div class="sku-select-list">
          <span>222</span>
          <el-select placeholder="请输入" v-model="a">
            <el-option value="a">444</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuTm">
        <div class="sku-select-list">
          <span>111</span>
          <el-select placeholder="请输入" v-model="a">
            <el-option value="a">333</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item>
        <el-table
          border
          style="width: 100%"
          :data="[]"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" alt="" />
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template> </template>
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
      spu: this.spuItem,
      sku: {},
      rules: {},
    };
  },
  methods: {
    handleChange() {},
    handleSelectionChange() {},
  },
};
</script>

<style lang="sass" scoped>
.sku-select-list
  display: inline-block
  margin-left: 30px
</style>

