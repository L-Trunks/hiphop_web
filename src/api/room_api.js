import { get, post } from './http'

const url = '/api/room'
/**
 * 获取所有房间
 */
export const GetAllRoomList = (params) => {
    return get(url + '/get_all_room_list',params)
}

/**
 * 根据信息获取房间
 */
export const GetRoomInfoByInfo = (params) => {
    return get(url + '/get_room_info_by_info', params)
}

/**
 * 修改房间信息
 */
export const UpdateRoom = (params) => {
    return post(url + '/update_room', params)
}

/**
 * 删除房间
 */
export const DeleteRoom = (params) => {
    return post(url + '/delete_room', params)
}

/**
 * 添加房间
 */
export const AddRoom = (params) => {
    return post(url + '/add_Room', params)
}
