<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LoGo">
        <template slot-scope="scope">
          <img
            :src="scope.row.logoUrl"
            alt="logoImg"
            class="tradeMark-logoImg"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
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
    <!-- 添加品牌对话框 -->
    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <el-form
        ref="trademark"
        :model="trademark"
        label-width="100px"
        :rules="rules"
      >
        <!-- 必须得写prop，data中数据才能有效 -->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademark.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 图片地址注意跨域问题 -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademark.logoUrl"
              :src="trademark.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('trademark')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//import { getPageList } from "@/api";
export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [], // 所有数据
      total: 0, // 总数
      page: 1, // 页码
      limit: 3, // 每页条数
      visible: false, //对话框是否显示
      trademark: {
        tmName: "",
        logoUrl: "",
      },
      //表单校验
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    /*
    {"code":200,
    "message":"成功",
    "data":{
      "records":[{"id":245,"tmName":"华为","logoUrl":"http://182.92.128.115:8080/group1/M00/00/91/rBFUDF_I2Z-AVKV0AAAPwDqQw8k323.jpg"},
                {"id":246,"tmName":"360","logoUrl":"http://182.92.128.115:8080/group1/M00/00/8F/rBFUDF_HU56AELUMAAAv7JPHEEQ517.jpg"},
                {"id":247,"tmName":"苹果","logoUrl":"http://182.92.128.115:8080/group1/M00/00/8F/rBFUDF_HU6-AdH_OAAAFgxjlyB8979.jpg"}],
      "total":24,
      "size":3,
      "current":1,
      "pages":8},"
      ok":true}
     */
    //封装函数可以进行优化
    //刚进来发送请求，改变分页器的limit和page都需要调用同样的函数发送请求，得到订单分页列表
    async getPageList(page, limit) {
      //注意数据结构,不要大意写错了~~~
      //获取订单分页列表
      const result = await this.$API.trademark.getPageList(page, limit);
      if (result.code === 200) {
        //console.log(result);
        this.$message.success("请求品牌数据成功");
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
        this.trademarkList = result.data.records;
      } else {
        this.$message.error("请求品牌数据失败");
      }
    },
    //上传图片成功回调函数
    handleAvatarSuccess(res) {
      //console.log(res.data); //图片地址
      this.trademark.logoUrl = res.data;
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
    //提交表单，添加品牌
    onSubmit(trademark) {
      this.$refs[trademark].validate(async (valid) => {
        if (valid) {
          const result = await this.$API.trademark.addPageList(this.trademark);
          if (result.code === 200) {
            this.$message.success("添加品牌成功");
            this.visible = false;
          } else {
            this.$message.error("添加品牌失败");
          }
        }
      });
    },
    //删除品牌数据
    async handleDelete(trademark) {
      if (window.confirm("您确定要删除该数据么")) {
        const result = await this.$API.trademark.deletePageList(trademark.id);
        if (result.code === 200) {
          this.$message.success("成功删除该数据");
          this.getPageList(this.page, this.limit);
        } else {
          this.$message.error("删除失败");
        }
      }
    },
    //修改品牌数据
    async handleEdit(trademark) {
      const result = await this.$API.trademark.updatePageList(trademark);
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};
</script>
<style lang='sass'>
.tradeMark-logoImg
  width: 100px
  height: 80px
.el-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 250px
.el-form-item__label
  width: 100px
.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  .avatar-uploader .el-upload:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

  .avatar
    width: 178px
    height: 178px
    display: block
</style>
