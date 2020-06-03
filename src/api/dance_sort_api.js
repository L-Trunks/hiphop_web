import { get, post } from './http'

const url = '/api/danceSort'
/**
 * 获取所有舞种
 */
export const GetAllDanceSortList = (params) => {
    return get(url+'/get_all_dance_sort_list',params)
}

/**
 * 根据信息获取舞种
 */
export const GetDanceSortListByInfo = (params) => {
    return get(url+'/get_dance_sort_list_by_info',params)
}

/**
 * 修改舞种信息
 */
export const UpdateDanceSort = (params) => {
    return post(url+'/update_dance_sort',params)
}

/**
 * 删除舞种
 */
export const DeleteDanceSort = (params) => {
    return post(url+'/delete_dance_sort',params)
}

/**
 * 添加舞种
 */
export const AddDanceSort = (params) => {
    return post(url+'/add_dance_sort',params)
}
