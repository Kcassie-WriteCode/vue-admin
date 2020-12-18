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
  }
};
