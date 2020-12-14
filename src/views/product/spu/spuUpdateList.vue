<template>
  <el-card style="margin-top: 20px">
    <el-form  label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="a"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="a" placeholder="请选择品牌">
          <el-option value="a">111</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌描述">
        <el-input type="textarea" v-model="a"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!--   :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"-->
        <el-upload
          list-type="picture-card"
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <img class="avatar" />
          <i class="el-icon-plus"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="a" placeholder="请选择品牌">
          <el-option value="a">111</el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      </el-form-item>
    </el-form>
    <!-- :data="spuList" -->
    <el-table border style="width: 100%; margin: 20px 0">
      <!--  v-loading="loading" -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="属性名"> </el-table-column>
      <el-table-column prop="des" label="属性值名称列表"> </el-table-column>
      <el-table-column label="操作">
        <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>
    <el-button type="primary">保存</el-button>
    <el-button>取消</el-button>
  </el-card>
</template>

<script>
export default {
  name: "SpuUpdateList",
  data() {
    return {
      a: 1,
    };
  },
};
</script>

<style lang="less" scoped>
</style>

