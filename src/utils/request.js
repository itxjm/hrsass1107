import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const Timeout = 7200 // 定义超时时间
// import '@/utils/get-page-title'
// import { config } from "@vue/test-utils";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api   npm run build => /prod-api
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
// config是请求的配置信息 必须要return回去
service.interceptors.request.use(
  (config) => {
    // 注入token Authorization
    if (store.getters.token) {
      // 只有在有token的情况下 才有必要去检查时间戳是否超时
      if (IsCheckTimeOut()) {
        // 如果为true 表示过期
        store.dispatch('user/logout') // 登出操作
        // 跳转到登录页
        router.push('/')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    // 要根据success的成功与否决定下面的 操作
    if (success) {
      return data
    } else {
      // 业务已经错误 不能进then 进catch
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误消息
    }
    return Promise.reject(error)
  }
)
// 是否超时
// 超时逻辑  当前时间 - 缓存中的时间  是否大于时间差
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > Timeout
}
export default service
