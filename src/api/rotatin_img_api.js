import { get, post } from './http'

const url = '/rotationImg'
/**
 * 获取所有图片
 */
export const GetAllRotationImgList = () => {
    return get(url+'/get_all_rotation_img_list')
}

/**
 * 根据信息获取图片
 */
export const GetRotationImgListByInfo = (params) => {
    return get(url+'/get_rotation_img_list_by_info',params)
}

/**
 * 修改图片信息
 */
export const UpdateRotationImg = (params) => {
    return post(url+'/update_rotation_img',params)
}

/**
 * 删除图片
 */
export const DeleteRotationImg = (params) => {
    return post(url+'/delete_rotation_img',params)
}

/**
 * 添加图片
 */
export const AddRotationImg = (params) => {
    return post(url+'/add_rotation_img',params)
}
