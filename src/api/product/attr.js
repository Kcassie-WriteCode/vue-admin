import request from "../../utils/request";
const api_name = "/admin/product";
export default {
  //获取一级分类列表
  getCategory1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  },
  //获取二级分类列表
  getCategory2(category2Id) {
    return request({
      url: `${api_name}/getCategory2/${category2Id}`,
      method: "GET"
    });
  },
  //获取三级分类列表
  getCategory3(category3Id) {
    return request({
      url: `${api_name}/getCategory3/${category3Id}`,
      method: "GET"
    });
  },
  //获取属性的属性值列表
  getAttrValueList(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    });
  },
  //获取属性列表
  getAttrInfoList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },
  //保存属性信息
  saveAttrInfo(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data: attr
    });
  },
  // 删除单个属性数据/admin/product/deleteAttr/{attrId}
  deleteAttr(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: "DELETE"
    });
  }
};
