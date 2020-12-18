
<template>
  <el-card>
    <el-form label-width="100px" :model="sku" :rules="rules" ref="skuForm">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          align="left"
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          v-model="sku.price"
          :min="0"
          :max="200000000000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          v-model="sku.weight"
          :min="0"
          :max="200000000000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="请输入规格描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          v-for="(attr, index) in attrList"
          :key="attr.id"
          class="skulist-select-container"
        >
          <el-form-item :label="attr.attrName" style="display: inline-block">
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
              @change="clearValidate('skuAttrValueList')"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div
          class="skulist-select-container"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <el-form-item
            style="display: inline-block"
            :label="sale.saleAttrName"
          >
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
              @change="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="`${sale.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item prop="skuImageList">
        <!-- 多包一个form-item，重选不会时时触发校验 -->
        <el-form-item>
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
              <template v-slot="{ row }">
                <el-button
                  v-if="!row.isDefault"
                  size="mini"
                  type="primary"
                  @click="changeIsDefault(row.id)"
                  >设为默认</el-button
                >
                <el-tag v-else>默认</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('showList')">取消</el-button>
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
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          this.$message.success("校验通过");
          const { category3Id, id: spuId, tmId } = this.spu;
          const skuDefaultImg = this.sku.skuImageList.find(
            (skuImg) => skuImg.isDefault
          ).imgUrl;

          const skuAttrValueList = this.sku.skuAttrValueList.map((skuImg) => {
            const [attrId, valueId] = skuImg.split("-");
            return {
              attrId,
              valueId,
            };
          });
          const skuImageList = this.sku.skuImageList.map((img) => {
            return {
              ...img,
              spuImgId: spuId,
            };
          });
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (sale) => {
              const [id, saleAttrValueId] = sale.split("-");
              return {
                id,
                saleAttrValueId,
                spuId,
              };
            }
          );
          const result = await this.$API.sku.saveSkuInfo({
            ...this.sku,
            category3Id,
            spuId,
            tmId,
            skuDefaultImg,
            skuAttrValueList,
            skuImageList,
            skuSaleAttrValueList,
          });
          console.log(result);
          if (result.code === 200) {
            this.$message.success("sku保存成功");
            this.$emit("showList");
          } else {
            this.$message.error(result.message);
          }
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
    changeIsDefault(id) {
      this.clearValidate("skuImageList");
      this.imageList = this.imageList.map((img) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((skuImg) => {
        return {
          ...skuImg,
          isDefault: skuImg.id === id ? true : false,
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
  width: 30%
  margin-bottom: 10px
</style>

