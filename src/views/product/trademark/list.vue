<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="id" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LoGo">
        <template slot-scope="scope">
          <img
            :src="scope.row.logoImg"
            alt="logoImg"
            class="tradeMark-logoImg"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="1"
      :page-sizes="[3, 6, 9]"
      :page-size="3"
      layout="prev, pager, next, jumper,sizes,total"
      :total="15"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "phone",
          logoImg:
            "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg",
        },
      ],
    };
  },
};
</script>
<style lang='sass'>
.tradeMark-logoImg
  width: 100px
.el-pagination
  float: right
.el-pagination__sizes
  margin-left: 260px
</style>
