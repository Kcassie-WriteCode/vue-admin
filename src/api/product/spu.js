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
  //获取销售属性列表
  getSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
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
  }
};
