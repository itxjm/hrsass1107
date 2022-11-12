import request from '@/utils/request'

// 获取阻止架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 删除组织架构部门
export function delDepartments(id) {
  return request({
    method: 'DELETE', // 接口满足restful接口规范
    url: `/company/department/${id}`
    // 同样的地址 不同的方法 执行不同的业务
  })
}
// 新增部门
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: '/company/department', // 遵循restful接口规范
    data: data // axios的body参数放到data上
  })
}
