// 负责所有全局自定义组件的注册
import PageTools from '@/components/PageTools'
export default {
  install(Vue) {
    // 组件的注册
    Vue.component('PageTools', PageTools)
  }
}
