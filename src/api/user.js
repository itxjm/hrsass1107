import request from '@/utils/request'

// 登录接口的封装
export function login(data) {
  // 使用return的形式返回一个promise对象
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

// 获取用户资料接口
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

// 根据用户id获取用户的详情 读取
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {}
