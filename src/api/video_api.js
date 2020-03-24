import { get, post } from './http'

const url = '/video'
/**
 * 获取所有视频
 */
export const GetAllVideoList = () => {
    return get(url+'/get_all_video_list')
}

/**
 * 根据用户获取视频
 */
export const GetVideoListByUser = (params) => {
    return get(url+'/get_video_list_by_user',params)
}

/**
 * 修改视频信息
 */
export const UpdateVideo = (params) => {
    return post(url+'/update_video',params)
}

/**
 * 删除视频
 */
export const DeleteVideo = (params) => {
    return post(url+'/delete_video',params)
}

/**
 * 添加视频
 */
export const AddVideo = (params) => {
    return post(url+'/add_video',params)
}