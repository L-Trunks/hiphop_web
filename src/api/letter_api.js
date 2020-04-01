import { get, post } from './http'

const url = '/letter'


/**
 * 发送私信
 */
export const SendLetter = (params) => {
    return post(url+'/send_letter',params)
}


/**
 * 根据用户查询私信列表
 */
export const SelectLetterListByUser = (params) => {
    return post(url+'/select_letter_list_by_user',params)
}


/**
 * 删除会话
 */
export const DeleteLetterWithUser = (params) => {
    return post(url+'/delete_letter_with_user',params)
}