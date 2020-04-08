import { get, post } from './http'

const url= '/api/users'
/**
 * 登录
 */
export const Login = (params) => {
    return post(url+'/login', params)
}

/**
 * 注册
 */
export const Register = (params) => {
    return post(url+'/register', params)
}

/**
 * 根据token获取用户信息
 */
export const GetUserInfoByToken = (params) => {
    return post(url+'/get_user_info_by_token', params)
}

/**
 * 设置管理员
 */
export const SetManagement = (params) => {
    return post(url+'/set_management', params)
}

/**
 * 根据id获取用户信息
 */
export const GetUserInfoById = (params) => {
    return get(url+'/get_user_info_by_id', params)
}

/**
 * 封号
 */
export const BanUser = (params) => {
    return post(url+'/ban_user', params)
}

/**
 * 解禁
 */
export const UnBanUser = (params) => {
    return post(url+'/unban_user', params)
}

/**
 * 验证用户名
 */
export const VerifyUserName = (params) => {
    return post(url+'/verify_user_name', params)
}

/**
 * 验证昵称
 */
export const VerifyNickName = (params) => {
    return post(url+'/verify_nick_name', params)
}

/**
 * 修改密码
 */
export const UpdatePassword = (params) => {
    return post(url+'/update_password', params)
}

/**
 * 修改个人信息
 */
export const UpdateUserInfo = (params) => {
    return post(url+'/update_user_info', params)
}

/**
 * 获取所有用户列表
 */
export const GetAllUserList = (params) => {
    return get(url+'/get_all_user_list', params)
}

/**
 * 获取普通用户列表
 */
export const GetUserList = (params) => {
    return get(url+'/get_user_list', params)
}

/**
 * 获取管理员列表
 */
export const GetManagementUserList = (params) => {
    return get(url+'/get_management_user_list', params)
}

/**
 * 获取街舞大神列表
 */
export const GetGodUserList = (params) => {
    return get(url+'/get_god_user_list', params)
}
