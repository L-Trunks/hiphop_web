import { get, post } from './http'

const url = '/upload'
/**
 * 图片上传
 */
export const UploadImage = () => {
    return get(url+'/image')
}

/**
 * 视频上传
 */
export const UploadVideo = (params) => {
    return get(url+'/video',params)
}