import { get, post } from './http'

const url = '/api/keywords'
/**
 * 添加关键字
 */
export const AddKeyword = (params) => {
    return post(url+'/add_keyword',params)
}

/**
 * 删除关键字
 */
export const DeleteKeyword = (params) => {
    return get(url+'/delete_keyword',params)
}

/**
 * 编辑关键字
 */
export const UpdateKeyword = (params) => {
    return post(url+'/update_keyword',params)
}

/**
 * 获取所有关键字
 */
export const GetAllKeywords = (params) => {
    return get(url+'/get_all_keywords',params)
}

/**
 * 视频关键字监控
 */
export const VideoKeywords = (params) => {
    return post(url+'/video_keywords',params)
}

/**
 * 文章关键字监控
 */
export const ArticleKeywords = (params) => {
    return post(url+'/article_keywords',params)
}