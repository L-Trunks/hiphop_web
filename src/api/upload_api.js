import { get, post } from './http'

const url = '/upload'
/**
 * 图片上传
 */
export const UploadImage = (params) => {
    return post(url+'/image',params)
}

/**
 * 视频上传
 */
export const UploadVideo = (params) => {
    return post(url+'/video',params)
}