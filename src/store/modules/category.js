import API from "@/api";
import { Message } from "element-ui";
export default {
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  getters: {},
  actions: {
    //mounted就加载
    async getCategory1List({ commit }) {
      const result = await API.attr.getCategory1();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", { category1List: result.data });
      } else {
        Message.error(result.message);
      }
    },
    //点击一级分类 //category1Id是调用getCategory2list函数传进来的
    async getCategory2List({ commit }, category1Id) {
      const result = await API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        //要传category1id和category2list
        commit("GET_CATEGORY2_LIST", {
          category1Id,
          category2List: result.data
        });
      } else {
        Message.error(result.message);
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
      }
    },
    //点击二级分类 //category2Id是调用getCategory3list函数传进来的
    async getCategory3List({ commit }, category2Id) {
      const result = await API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        commit("GET_CATEGORY3_LIST", {
          category2Id,
          category3List: result.data
        });
      } else {
        Message.error(result.message);
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
      }
    }
  },
  mutations: {
    //一上来就获取一级分类列表
    GET_CATEGORY1_LIST(state, { category1List }) {
      state.category1List = category1List;
    },
    //点击一级分类的时候获取二级分类列表
    GET_CATEGORY2_LIST(state, { category2List, category1Id }) {
      //先重新设置category2list就不用再清空
      state.category2List = category2List;
      //同时要更新category1id
      state.category.category1Id = category1Id;
      //处理事件的input框的问题
      //重新选择，其他的都要清除
      state.category.category2Id = "";
      state.category.category3Id = "";
      state.category3List = [];
    },
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      state.category.category1Id = category1Id;
      state.category.category2Id = "";
      state.category.category3Id = "";
      state.category2List = [];
      state.category3List = [];
    },
    GET_CATEGORY3_LIST(state, { category3List, category2Id }) {
      state.category3List = category3List;
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
    },
    //点击二级分类获取三级分类的时候,要清空三级分类
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
      state.category3List = [];
    },
    SET_CATEGORY3_ID(state, category3Id) {
      state.category.category3Id = category3Id;
    }
  }
};
