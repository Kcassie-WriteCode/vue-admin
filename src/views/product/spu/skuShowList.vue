<template>
  <el-card>
    <el-form label-width="100px" :model="sku" ref="skuForm" :rules="rules">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          v-model="sku.price"
          controls-position="right"
          :min="0"
          :max="20000"
          placeholder="SKU价格"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          v-model="sku.weight"
          controls-position="right"
          :min="0"
          :max="20000"
          placeholder="SKU重量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          class="skulist-select-container"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <span class="spulist-span-container"> {{ attr.attrName }}</span>
          <!-- 用index会更新到指定下标下 -->
          <el-select
            placeholder="请输入"
            v-model="sku.skuAttrValueList[index]"
            @change="clearValidate('skuAttrValueList')"
          >
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}-${attrValue.id}`"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div
          class="skulist-select-container"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <span class="spulist-span-container">{{ sale.saleAttrName }}</span>
          <el-select
            placeholder="请输入"
            v-model="sku.skuSaleAttrValueList[index]"
            @change="clearValidate('skuSaleAttrValueList')"
          >
            <el-option
              :label="spuSaleAttrValue.saleAttrValueName"
              :value="`${sale.id}-${spuSaleAttrValue.id}`"
              v-for="spuSaleAttrValue in sale.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item prop="skuImageList">
        <el-table
          border
          style="width: 100%"
          :data="imageList"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column
            type="selection"
            width="80"
            align="center"
            reserve-selection
          >
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
            <template v-slot="{ row, $index }">
              <el-button
                v-if="!row.isDefault"
                size="mini"
                type="primary"
                @click="changeIsDefault($index)"
                >设为默认</el-button
              >
              <el-tag v-else>默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SkuShowList",
  props: ["spuItem"],
  data() {
    return {
      spu: this.spuItem, //标准化产品单元
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      }, //sku库存保有单位
      rules: {
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入sku价格", trigger: "change" },
        ],
        weight: [
          { required: true, message: "请输入sku重量", trigger: "change" },
        ],
        skuDesc: [
          { required: true, message: "请输入sku描述", trigger: "change" },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      }, //校验规则
      imageList: [], //图片列表
      spuSaleAttrList: [], //销售属性
      attrList: [], //平台属性
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    //清空校验
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop);
    },
    //校验全部
    //保存
    save() {
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          this.$message.succsee("校验通过");
        }
      });
    },
    //sku图片列表校验
    skuImageListValidator(rule, value, callback) {
      const {
        imageList,
        sku: { skuImageList },
      } = this;
      if (skuImageList.length === 0) {
        callback("至少选中一张图片");
        return;
      }
      if (!skuImageList.some((img) => img.isDefault)) {
        callback("请选择默认图片");
        return;
      }
      callback();
    },
    //sku销售属性列表校验
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback("sku销售属性列表必须全选中");
        return;
      }
      callback();
    },
    //sku属性列表校验
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;
      if (
        skuAttrValueList.length !== attrList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback("sku属性列表必须全选中");
        return;
      }
      callback();
    },
    //设置为默认
    changeIsDefault(i) {
      this.clearValidate("skuImageList");
      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: i === index ? true : false,
        };
      });
    },
    //多选选中处理函数
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList;
    },
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
      const result = await this.$API.attr.getAttrInfoList(this.category);
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
  margin: 0 30px 20px 0
.skulist-select-container .spulist-span-container
  display: inline-block
  width: 60px
  text-align: right
  color: black
</style>

