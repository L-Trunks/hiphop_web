import { get, post } from './http'

const url = '/api/search'
/**
 * 获取视频结果
 */
export const GetVideoResultList = (params) => {
    return get(url+'/get_video_result_list',params)
}

/**
 * 获取文章结果
 */
export const GetArticleResultList = (params) => {
    return get(url+'/get_article_result_list',params)
}