import { get, post } from './http'

const url = '/article'
/**
 * 获取所有文章
 */
export const GetAllArticleList = () => {
    return get(url+'/get_all_article_list')
}

/**
 * 根据用户获取文章
 */
export const GetArticleListByUser = (params) => {
    return get(url+'/get_article_list_by_user',params)
}

/**
 * 根据id获取文章信息
 */
export const GetArticleInfoById = (params) => {
    return get(url+'/get_article_info_by_id',params)
}

/**
 * 修改文章信息
 */
export const UpdateArticle = (params) => {
    return post(url+'/update_article',params)
}

/**
 * 删除文章
 */
export const DeleteArticle = (params) => {
    return post(url+'/delete_article',params)
}

/**
 * 添加文章
 */
export const AddArticle = (params) => {
    return post(url+'/add_article',params)
}