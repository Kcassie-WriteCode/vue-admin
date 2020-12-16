import request from "../../utils/request";
const api_name = "/admin/product";
export default {
  //获取spu分页列表
  getSpuPageList({ page, limit, category3Id }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  //删除spu
  deleteSpu(spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: "DELETE"
    });
  },
  //保存spu信息
  saveSpuInfo(spu) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST",
      data: spu
    });
  },
  //更新spu信息
  updateSpuInfo(spu) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      data: spu
    });
  },
  //获取品牌属性列表
  getTrademarkList() {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: "GET"
    });
  },
  //获取销售属性列表
  getsSpuSaleAttrList(spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET"
    });
  },
  //获取所有销售属性列表
  getSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },
  //获取spu图片列表
  getSpuImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },
  //更新sku /admin/product/updateSkuInfo
  updateSkuInfo(sku) {
    return request({
      url: `${api_name}/updateSkuInfo`,
      method: "POST",
      data: sku
    });
  }
};
