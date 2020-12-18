<template>
<div>
  <el-card>
     <el-table :data="skuList" border style="width: 100%; margin: 20px 0">
      <!--  v-loading="loading" -->
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template >
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-popconfirm
            :title="`确定删除${row.spuName}吗`"
            @onConfirm="delSpuAtrr(row.id)"
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
  </el-card>
</div>
</template>

<script>
export default {
  name: 'SKuList',
}
</script>
