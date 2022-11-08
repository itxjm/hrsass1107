import { getToken, setToken, removeToken } from "@/utils/auth";
import { login } from "@/api/user";
// 状态
const state = {
  token: getToken, //设置token为共享状态 初始化vuex的时候 先从缓存中读取
};
const mutations = {
  setToken(state, token) {
    state.token = token; //将数据设置给vuex
    setToken(token); // 同步给缓存
  },
  removeToken(state) {
    state.token = null; // 将vuex数据置空
    removeToken(); //同步到缓存
  },
};
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) //拿到token
    context.commit("setToken", result) //设置token(响应拦截器处理后的结构)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
