import request from "@/utils/request";

// 登录接口的封装
export function login(data) {
  // 使用return的形式返回一个promise对象
  return request({
    method: "POST",
    url: "/sys/login",
    data,
  });
}

export function getInfo(token) {}

export function logout() {}
