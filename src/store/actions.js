import {

} from '../api/dance_sort_api'
import {

} from '../api/user_api'
import Vue from 'vue'
const actions = {
    //改变用户信息actions
    selectUserById(context, params) {
        SelectUserById({ params: params }).then(res => {
            context.commit('changeUserInfo', res.data[0]);
        }).catch(err => {
            Vue.$message.error(err.message && err.message || '服务器跑丢了')
        })
    }


}

export default actions;