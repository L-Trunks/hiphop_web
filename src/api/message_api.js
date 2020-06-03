import { get, post } from './http'

const url = '/api/message'
/**
 * 新增消息
 */
export const AddMessage = (params) => {
    return post(url+'/add_message',params)
}

/**
 * 根据用户id获取消息列表
 */
export const GetMessageListByUser = (params) => {
    return get(url+'/get_message_list_by_user',params)
}

/**
 * 删除消息
 */
export const DeleteMessage = (params) => {
    return get(url+'/delete_message',params)
}

/**
 * 更新消息
 */
export const UpdateMessage = (params) => {
    return post(url+'/update_message',params)
}
