import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  /*
  获取订单分页列表
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  /*
  修改品牌
  */
  updatePageList(data) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      data
    });
  },
  /*
  添加订品牌
  */
  addPageList(data) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data
    });
  },
  /*
  删除品牌
  */
  deletePageList(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "DELETE"
    });
  }
};
