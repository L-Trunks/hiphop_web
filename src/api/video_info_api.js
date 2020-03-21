import { get, post } from './http'

const url = '/video'
/**
 * 点赞视频
 */
export const VideoAddGoods = () => {
    return get(url+'/add_goods')
}

/**
 * 取消点赞
 */
export const VideoRemoveGoods = (params) => {
    return get(url+'/remove_goods',params)
}

/**
 * 获取点赞状态
 */
export const VideoGetGoodsStatus = (params) => {
    return get(url+'/get_goods_status',params)
}

/**
 * 收藏视频
 */
export const VideoAddCollect = (params) => {
    return get(url+'/add_collect',params)
}

/**
 * 取消收藏
 */
export const VideoRemoveCollect = (params) => {
    return get(url+'/remove_collect',params)
}

/**
 * 获取收藏列表
 */
export const VideoGetCollectList = (params) => {
    return get(url+'/get_collect_list',params)
}

/**
 * 添加评论
 */
export const VideoAddComments = (params) => {
    return post(url+'/add_comments',params)
}

/**
 * 查询评论列表
 */
export const VideoSelectComments = (params) => {
    return get(url+'/select_comments',params)
}