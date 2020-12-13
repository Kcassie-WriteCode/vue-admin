<template>
  <div>
    <!-- 如果为修改添加界面，分类列表为disabled -->
    <Category @change="getAttrList" :disabled="!isShowList" />
    <el-card style="margin-top: 20px" v-show="isShowList">
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
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
              >修改</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--修改，添加属性界面 -->
    <el-card v-show="!isShowList" style="margin-top: 20px">
      <!-- 某个属性attr:{} -->
      <el-form :model="attr" inline>
        <!-- 属性名 ,prop直接写-->
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-button>取消</el-button>
      <!-- 遍历属性值列表 -->
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <!-- 点击span时创建edit ，显示输入框-->
            <!-- 失去焦点和enter抬起时修改完成，native相当于绑定普通事件 -->
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              ref="input"
              size="mini"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            ></el-input>

            <span v-else @click="edit(row)" style="display: block; width: 100%">
              {{ row.valueName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确定删除${row.valueName}吗`"
              @onConfirm="delAttrValue($index)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
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
      isShowList: true, //是否展示属性列表
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    //发送请求保存
    async save() {
      const result = await this.$API.attr.saveAttrInfo(this.attr);
      if (result.code === 200) {
        //切换回显示属性列表界面
        this.isShowList = true;
        //获取属性列表，进行显示
        this.getAttrList(this.category);
      }
    },
    //删除属性值
    delAttrValue(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    //添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      //点击切换为输入框的时候获得焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //修改数据
    editCompleted(row, index) {
      //如果添加的一项属性值为空，要切掉
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
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
    //切换到修改，添加界面
    //row为当行的所以属性信息
    update(row) {
      this.isShowList = false;
      //深度赋值，为了防止对象上对象上的值改变影响原来的值
      this.attr = JSON.parse(JSON.stringify(row));
    },
    //获取商品属性信息
    async getAttrList(category) {
      this.category = category;
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
