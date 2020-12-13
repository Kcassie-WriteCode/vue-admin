<template>
  <div>
    <Category @change="getAttrList" />
    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加</el-button>
      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template>
            <el-button type="warning" icon="el-icon-edit" size="mini"
              >修改</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from "../../../components/Category";
export default {
  name: "AttrList",
  data() {
    return {
      attrList: [],
    };
  },
  methods: {
    //获取商品属性信息
    async getAttrList(category) {
      const result = await this.$API.attr.getAttrInfoList(category);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
  components: {
    Category,
  },
};
</script>
