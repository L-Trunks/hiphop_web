import { get, post } from './http'

const url = '/api/match'
/**
 * 获取所有活动
 */
export const GetAllMatchList = (params) => {
    return get(url + '/get_all_match_list',params)
}

/**
 * 根据信息获取活动
 */
export const GetMarchInfoByInfo = (params) => {
    return get(url + '/get_march_info_by_info', params)
}

/**
 * 修改活动信息
 */
export const UpdateMatch = (params) => {
    return post(url + '/update_match', params)
}

/**
 * 删除活动
 */
export const DeleteMatch = (params) => {
    return post(url + '/delete_match', params)
}

/**
 * 添加活动
 */
export const AddMatch = (params) => {
    return post(url + '/add_Match', params)
}
