import request from '@/utils/request'

// 获取员工的简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
// 获取员工综合列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
// 删除员工信息
export const deleteEmployeeList = (id) => {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

// 新增员工
export const addEmployeeList = (data) => {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}
