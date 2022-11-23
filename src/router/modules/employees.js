// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候 此时表示二级路由的默认路由
    path: '0',
    component: () => import('@/views/employees'),
    // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
    meta: {
      title: '员工管理', // 用title 是因为 左侧导航读取了这里的title属性
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // 动态路由参数
    component: () => import('@/views/employees/detail'),
    hidden: true, // 表示该内容不再左侧菜单显示
    meta: {
      title: '员工详情'
    }
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/components/print'),
    hidden: true,
    meta: {
      title: '打印',
      icon: 'people'
    }
  }
  ]
}
