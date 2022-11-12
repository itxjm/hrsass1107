// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/salarys',
  name: 'salarys',
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候 此时表示二级路由的默认路由
    path: '0',
    component: () => import('@/views/salarys'),
    // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
    meta: {
      title: '工资', // 用title 是因为 左侧导航读取了这里的title属性
      icon: 'money'
    }
  }]
}
