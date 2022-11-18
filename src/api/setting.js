import request from '@/utils/request'

// 获取角色列表
export function getRolesLsit(params) {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}

// 根据id查询企业信息
export function getCompanyInfo(companyId) {
  return request({
    method: 'GET',
    url: `/company/${companyId}`
  })
}

// 根据id删除企业信息
export function deleteRoule(id) {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

// 获取角色详情
export function getRoleDetail(id) {
  return request({
    method: 'GET',
    url: `/sys/role/${id}`
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

// 新增角色
export function addRole(data) {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}
