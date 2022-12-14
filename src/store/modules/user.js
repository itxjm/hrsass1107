import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候 先从缓存中读取
  userInfo: {} // 定义一个空对象 (如果设为null 会引起getters异常和报错)
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    setToken(token) // 同步给缓存
  },
  removeToken(state) {
    state.token = null // 将vuex数据置空
    removeToken() // 同步到缓存
  },
  // 设置用户信息
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 是响应式
    // state.userInfo = {...result} //是响应式 属于浅拷贝
    // state.userInfo['username'] = result //不是响应式
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token(响应拦截器处理后的结构)
    // 拿到token说明登录成功
    setTimeStamp() // 设置当前时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详情 用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    // 合并
    // const obj = {...result, ...baseInfo}
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result // ? 给后期做权限的时候 留下的伏笔
  },
  // 登出操作 => 删除token 删除用户资料
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
