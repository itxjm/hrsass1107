import axios from "axios";
import { Message } from "element-ui";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, //npm run dev => /api   npm run build => /prod-api
  timeout: 5000, //设置超时时间
});
service.interceptors.request.use();
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    // 要根据success的成功与否决定下面的 操作
    if(success){
      return data
    }else{
      // 业务已经错误 不能进then 进catch
      Message.error(message) //提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    Message.error(error.message) //提示错误消息
    return Promise.reject(error)  //返回执行错误 让当前的执行链跳出成功 直接进入catch
  }
);
export default service;
