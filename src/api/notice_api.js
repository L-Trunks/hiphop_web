import { get, post } from './http'

const url = '/api/notice'


/**
 * 根据用户获取文章
 */
export const GetNoticeListByUser = (params) => {
    return get(url + '/get_notice_list_by_user', params)
}


/**
 * 关注用户
 */
export const AddNotice = (params) => {
    return post(url + '/add_notice', params)
}


/**
 * 取消关注
 */
export const DeleteNotice = (params) => {
    return post(url + '/delete_notice', params)
}