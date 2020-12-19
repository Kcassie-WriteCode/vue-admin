// export { default as login } from "./acl/login"; // {default: {}}
// export { default as user } from "./acl/user";
// export { default as role } from "./acl/role";
// export { default as permission } from "./acl/permission";
// export { default as category } from "./category";
// export { default as clientUser } from "./clientUser";
// export { default as order } from "./order";
// export { default as trademark } from "./product/trademark";
// export { default as attr } from "./product/attr";
// export { default as spu } from "./product/spu";
// export { default as sku } from "./product/sku";

//处理同目录下的文件
const context = require.context(".", true, /\.js$/);
//过滤掉自己
const api = context.keys().filter(item => item !== "./index.js");
export default api.reduce((p, apiPath) => {
  //  "./order/index.js" "./acl/login.js"
  // 提取模块名称
  let apiName;
  if (apiPath.lastIndexOf("index.js") > -1) {
    apiName = apiPath.split("/")[1];
  } else {
    apiName = apiPath.split("/")[2].split(".")[0];
  }
  p[apiName] = context(apiPath).default;
  return p;
}, {});
