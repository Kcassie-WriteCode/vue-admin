<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            :key="tm.id"
            v-for="tm in trademarkList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌描述">
        <el-input type="textarea" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          list-type="picture-card"
          :file-list="imageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            :label="saleAttr.name"
            :value="saleAttr.id"
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      style="width: 100%; margin: 20px 0"
      :data="spuSaleAttrList"
    >
      <!--  v-loading="loading" -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <!--   -->
      <el-table-column prop="saleAttrName" label="属性名"> </el-table-column>
      <el-table-column label="属性值名称列表">
        <template slot-scope="{ row }">
          <el-tag
            style="margin-right: 5px"
            v-for="spuSaleAttrValue in row.spuSaleAttrValueList"
            :key="spuSaleAttrValue.id"
            >{{ spuSaleAttrValue.saleAttrValueName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>
    <el-button type="primary">保存</el-button>
    <el-button>取消</el-button>
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImgUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: ["item"],
  data() {
    return {
      a: 1,
      spu: this.item, //spu要为响应式
      trademarkList: [], //品牌列表
      imageList: [], //图片列表
      previewImgUrl: "",
      visible: false, // 图片对话框显示&隐藏
      saleAttrList: [], //获取所有销售属性列表
      spuSaleAttrList: [], //获取销售属性列表
    };
  },
  methods: {
    // 处理删除
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.imageList = this.imageList.filter((img) => img.id !== file.id);
    },
    // 处理图片预览
    handlePictureCardPreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    //获取品牌信息
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("品牌列表获取成功");
        this.trademarkList = result.data;
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
        this.imageList = result.data.map((img) => {
          return {
            name: img.imgName,
            url: img.imgUrl,
            id: img.id,
          };
        });
      } else {
        this.$message.error(error.message);
      }
    },
    //获取销售属性
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.$message.success("品牌列表获取成功");
        this.saleAttrList = result.data;
      } else {
        this.$message.error(error.message);
      }
    },
    //获取属性列表
    async getsSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getsSpuSaleAttrList(id);
      console.log(result);
      if (result.code === 200) {
        this.$message.success("品牌列表获取成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(error.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSaleAttrList();
    this.getsSpuSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>

