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
        <!-- accept接收的文件类型 list-type图片列表类型为卡片 -->
        <el-upload
          accept="image/*"
          list-type="picture-card"
          :file-list="formatImageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          v-model="spu.saleAttrId"
          :placeholder="`还有${filterSaleAttrList.length}未选择`"
        >
          <el-option
            :label="saleAttr.name"
            :value="saleAttr.id"
            v-for="saleAttr in filterSaleAttrList"
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
  computed: {
    // 在所有的销售属性列表里面过滤掉
    //已经选择在table里面的数据  单个spu销售属性 //留下未选择的
    filterSaleAttrList() {
      return this.saleAttrList.filter((saleAttr) => {
        return !this.spuSaleAttrList.find(
          (spuSaleAttr) => spuSaleAttr.baseSaleAttrId === saleAttr.id
        );
      });
    },
    //处理图片资源进行动态展示 /因为element ul中使用的字段和请求回来的字段名不一样
    //但是后期还要上传图片，所以不能直接改data数据字段
    formatImageList() {
      return this.imageList.map((img) => {
        return {
          //解决element ui上传多图片时会闪现的bug
          //设置一个uid，原数据img刚请求回来是没有uid的，所有得设置为img.id
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
  },
  methods: {
    //上传图片成功回调函数 //往图片列表里面push新添加的图片
    handleAvatarSuccess(res, file) {
      //console.log(res.data); //图片地址
      return this.imageList.push({
        imgName: file.name,
        imgUrl: res.data,
        id: this.spu.id,
        uid: file.uid,//解决多图片上传会闪现问题
      });
    },
    //上传图片之前进行图片大小和格式校验
    beforeAvatarUpload(file) {
      //可以上传的图片类型
      const imgTypes = ["image/jpeg", "image/png", "image/jpg"];
      // 检测文件类型条件 // file.type为上传的图片类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      //图片大小条件
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传头像图片只能是 jpg/png格式!");
      }
      if (!isLt) {
        this.$message.error("上传头像图片大小不能超过50kb!");
      }
      return isValidType && isLt;
    },
    // 处理删除
    handleRemove(file, fileList) {
      //图片id的话，点击删除会删除全部
      //用地址唯一性
      this.imageList = this.imageList.filter((img) => img.imgUrl !== file.url);
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
        this.imageList = result.data;
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

