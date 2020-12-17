<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu" ref="spuForm" :rules="rules">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌" prop="tmId">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            :key="tm.id"
            v-for="tm in trademarkList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌描述" prop="description">
        <el-input type="textarea" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="imageList">
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
      <el-form-item label="销售属性" prop="sale">
        <el-select
          v-model="spu.saleAttr"
          :placeholder="`还有${filterSaleAttrList.length}未选择`"
        >
          <!-- 给v-model传递id和name -->
          <el-option
            :label="saleAttr.name"
            :value="`${saleAttr.id}-${saleAttr.name}`"
            v-for="saleAttr in filterSaleAttrList"
            :key="saleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!spu.saleAttr"
          >添加销售属性</el-button
        >
        <el-table border style="width: 100%" :data="spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                closable
                @close="delSpuAttrValue(row, index)"
                style="margin-right: 5px"
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                >{{ spuSaleAttrValue.saleAttrValueName }}</el-tag
              >
              <el-input
                v-if="row.edit"
                v-model="saleAttrTest"
                ref="input"
                size="mini"
                @blur="editCompleted(row)"
                @keyup.enter.native="editCompleted(row)"
                style="width: 100px"
              ></el-input>
              <el-button
                v-else
                @click="edit(row)"
                size="mini"
                icon="el-icon-plus"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.saleAttrName}吗`"
                @onConfirm="delSpuAtrr($index)"
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('showList')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImgUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SpuUpdateList",
  props: ["item"],
  data() {
    return {
      spu: this.item, //spu要为响应式
      trademarkList: [], //品牌列表
      imageList: [], //图片列表
      previewImgUrl: "",
      visible: false, // 图片对话框显示&隐藏
      saleAttrList: [], //获取所有销售属性列表
      spuSaleAttrList: [], //获取销售属性列表
      saleAttrTest: "", //编辑的销售属性文本
      //prop校验
      rules: {
        spuName: [{ required: true, message: "SPU名称不能为空" }],
        tmId: [{ required: true, message: "选择品牌不能为空" }],
        description: [{ required: true, message: "品牌描述不能为空" }],
        imageList: [{ required: true, validator: this.imageListValidator }],
        sale: [{ required: true, validator: this.saleValidator }],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
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
    //自定义校验图片
    imageListValidator(rule, value, callback) {
      if (this.imageList.length === 0) {
        callback("至少上传一张图片");
        return;
      }
      callback();
    },
    //spu销售属性校验和属性值校验
    saleValidator(rule, value, callback) {
      // 判断至少选择一个销售属性
      if (this.spuSaleAttrList.length === 0) {
        callback("至少选择一个销售属性");
        return;
      }
      // 判断销售属性中至少添加一个销售属性值
      //查询只要有一个没有添加销售属性就不行
      //用some，用for也可以但语义化不好
      const isNo = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (isNo) {
        callback("至少添加一个销售属性值");
        return;
      }
      callback();
    },
    //在点保存的更新或添加函数
    save() {
      //校验prop
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          this.$message.success("表单校验通过");
          //收集spu数据
          /*
          category3Id": 0,
          "description": "string",
          "id": 0,
          "spuImageList":[],查看vue没有
          spuName": "string",
          "spuSaleAttrList":[],查看vue没有
          "tmId": 0 // updateSpuInfo
         */
          //通知showlist发请求
          const spu = {
            ...this.spu,
            category3Id: this.category.category3Id,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          let result;
          if (this.spu.id) {
            //更新数据必须有id，得找到要更新的是哪一个数据
            //发送请求跟新数据
            result = await this.$API.spu.updateSpuInfo(spu);
          } else {
            //添加数据不用id
            //注意添加时spu虽然为空，但是必须得传category3id
            //此时的spu只有category3id
            result = await this.$API.spu.saveSpuInfo(spu);
          }
          if (result.code === 200) {
            this.$message.success(
              `${this.spu.id ? "更新" : "添加"}spu数据成功`
            );
            //切换回到showlist组件并跟新页面数据，
            //触发在list父组件中的自定义事件
            //把数据保存在spu里了。通知showlist发请求
            this.$emit("showList");
          }
        }
      });
    },
    //删除单个spu属性
    delSpuAtrr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    //删除单个spu属性值
    delSpuAttrValue(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //修改数据
    /*
     "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
     */
    //编辑完成，往spuSaleAttrValueList添加spusaleattr
    editCompleted(row) {
      //row为销售属性列表spuSaleAttrList
      if (this.saleAttrTest) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrTest,
          spuId: row.spuId,
        });
        //添加完成要清空内容
        this.saleAttrTest = "";
      }
      //修改完成变为span
      row.edit = false;
    },
    //直接给对象添加新属性不是响应式数据,
    // 通过this.$set添加的属性才是响应式
    edit(row) {
      ///给row设置edit
      this.$set(row, "edit", true);
      //点击切换为输入框的时候获得焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //往这添加销售属性  //所有的销售属性列表会自动减少
    addSaleAttr() {
      /*
      //销售属性
      "baseSaleAttrId": 0,//number类型
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList":
      */
      const [baseSaleAttrId, saleAttrName] = this.spu.saleAttr.split("-");
      this.spuSaleAttrList.push({
        //切割完成为字符串，要转为number
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: this.spu.id,
        spuSaleAttrValueList: [],
      });
      this.spu.saleAttr = "";
    },
    //上传图片成功回调函数 //往图片列表里面push新添加的图片
    handleAvatarSuccess(res, file) {
      //console.log(res.data); //图片地址
      return this.imageList.push({
        imgName: file.name,
        imgUrl: res.data,
        id: this.spu.id,
        uid: file.uid, //解决多图片上传会闪现问题
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
    handleRemove(file) {
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
    //获取所有销售属性
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
    this.getSaleAttrList();
    //修改数据才需要imagelist和spusaleattrlist
    if (this.spu.id) {
      this.getSpuImageList();
      this.getsSpuSaleAttrList();
    }
  },
};
</script>

<style lang="less" scoped>
</style>

