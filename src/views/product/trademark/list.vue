<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <el-table
      :data="trademarkList"
      border
      style="width: 100%; margin: 20px 0"
      v-loading="loading"
    >
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
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row)"
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
    <!-- 添加，修改品牌对话框   如果有id就为修改-->
    <el-dialog
      :title="`${trademark.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <el-form
        ref="trademarkForm"
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
      loading: false, //请求回来之前为loading
      trademark: {
        tmName: "",
        logoUrl: "",
      },
      //表单校验
      rules: {
        tmName: [
          {
            required: true,
            //  message: "请输入品牌名称",
            // 自定义表单校验规则
            validator: this.validator,
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    //自校验规则没有*,要自己加required为true
    validator(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入品牌名称"));
        return;
      } else if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称长度为2到10位"));
        return;
      }
      callback();
    },
    add() {
      //下次进来添加的时候，先清空表单验证
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      //显示对话框
      this.visible = true;
      //清空数据为空对象
      this.trademark = {
        //但是要保证数据为响应式数据
        tmName: "",
        logoUrl: "",
      };
    },
    //修改品牌数据
    async handleEdit(row) {
      //下次进来修改的时候，先清空表单验证
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;
      //赋值,在对话框中显示内容，但是要注意不要是引用类型
      this.trademark = { ...row };
    },
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
      this.loading = true;
      //注意数据结构,不要大意写错了~~~
      //获取订单分页列表
      const result = await this.$API.trademark.getPageList(page, limit);
      if (result.code === 200) {
        //console.log(result);
        this.$message.success("获取品牌分页列表成功");
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
        this.trademarkList = result.data.records;
      } else {
        this.$message.error("获取品牌分页列表失败");
      }
      //无论请求失败成功，loading都应该结束
      this.loading = false;
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
    //提交表单，添加,修改品牌
    //注意数据比较的对象和发送请求的数据对象this.trademark，
    onSubmit(trademarkForm) {
      this.$refs.trademarkForm.validate(async (valid) => {
        if (valid) {
          const { trademark } = this;
          //转换为布尔值，如果有id就发送修改请求，没有就发送添加请求
          const isUpdate = !!trademark.id;
          //修改不能和之前的数据一样
          if (isUpdate) {
            //找到修改之前的数据
            const tm = this.trademarkList.find((tm) => tm.id === trademark.id);
            //修改后的数据和之前的数据进行比较，如果一样就退出
            if (
              tm.tmName === trademark.tmName &&
              tm.logoUrl === trademark.logoUrl
            ) {
              this.$message.warning("不能提交与之前一样的数据");
              return;
            }
          }
          //判断是修改还是添加
          let result;
          if (isUpdate) {
            result = await this.$API.trademark.updatePageList(trademark);
          } else {
            result = await this.$API.trademark.addPageList(trademark);
          }
          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌数据成功~`);
            this.visible = false;
            this.getPageList(this.page, this.limit); // 请求加载新数据,不然不会自动刷新页面
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
