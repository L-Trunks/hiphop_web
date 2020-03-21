import { get, post } from './http'

const url = '/keywords'
/**
 * 添加关键字
 */
export const add_keyword = (params) => {
    return post(url+'/add_keyword',params)
}

/**
 * 删除关键字
 */
export const delete_keyword = (params) => {
    return get(url+'/delete_keyword',params)
}

/**
 * 编辑关键字
 */
export const update_keyword = (params) => {
    return post(url+'/update_keyword',params)
}

/**
 * 获取所有关键字
 */
export const get_all_keywords = (params) => {
    return get(url+'/get_all_keywords',params)
}

/**
 * 视频关键字监控
 */
export const video_keywords = (params) => {
    return post(url+'/video_keywords',params)
}

/**
 * 文章关键字监控
 */
export const article_keywords = (params) => {
    return post(url+'/article_keywords',params)
}