import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取订单分页列表
  */
  saveSkuInfo(sku) {
    return request({
      url: `${api_name}/saveSkuInfo`,
      method: "POST",
      data: sku
    });
  },
  //获取sku列表
  getSkuList(page, limit) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "GET"
    });
  },
  //更新skuInfo
  updateSkuInfo(skuInfo) {
    return request({
      url: `${api_name}/updateSkuInfo`,
      method: "POST",
      data: skuInfo
    });
  }
};
