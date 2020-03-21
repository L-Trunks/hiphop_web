import { get, post } from './http'

const url = '/search'
/**
 * 获取视频结果
 */
export const GetVideoResultList = () => {
    return get(url+'/get_video_result_list')
}

/**
 * 获取文章结果
 */
export const GetArticleResultList = (params) => {
    return get(url+'/get_article_result_list',params)
}