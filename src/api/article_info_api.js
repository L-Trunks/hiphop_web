import { get, post } from './http'

const url = '/articleInfo'
/**
 * 点赞文章
 */
export const ArticleAddGoods = (params) => {
    return post(url+'/add_goods',params)
}

/**
 * 取消点赞
 */
export const ArticleRemoveGoods = (params) => {
    return get(url+'/remove_goods',params)
}

/**
 * 获取点赞状态
 */
export const ArticleGetGoodsStatus = (params) => {
    return get(url+'/get_goods_status',params)
}

/**
 * 收藏文章
 */
export const ArticleAddCollect = (params) => {
    return get(url+'/add_collect',params)
}

/**
 * 取消收藏
 */
export const ArticleRemoveCollect = (params) => {
    return get(url+'/remove_collect',params)
}

/**
 * 获取收藏列表
 */
export const ArticleGetCollectList = (params) => {
    return get(url+'/get_collect_list',params)
}

/**
 * 添加评论
 */
export const ArticleAddComments = (params) => {
    return post(url+'/add_comments',params)
}

/**
 * 查询评论列表
 */
export const ArticleSelectComments = (params) => {
    return get(url+'/select_comments',params)
}