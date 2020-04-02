import {
    GetAllDanceSortList
} from '../api/dance_sort_api'
import {
    GetUserInfoById
} from '../api/user_api'
import {GetAllArticleList} from '../api/article_api'
import {GetAllVideoList} from '../api/video_api'
import {GetMessageListByUser} from '../api/message_api'
import {VideoGetCollectList} from '../api/video_info_api'
import {ArticleGetCollectList} from '../api/article_info_api'
import {GetAllRotationImgList} from '../api/rotatin_img_api'
import Vue from 'vue'
const actions = {
    //改变用户信息actions
    GetUserInfoById(context, params) {
        GetUserInfoById(params).then(res => {
            console.log(res)
            context.commit('changeUserInfo', res.data);
        }).catch(err => {
            console.log(err)
            
        })
    },

    //所有舞种
    GetAllDanceSortList(context, params) {
        GetAllDanceSortList(params).then(res => {
            console.log(res)
            context.commit('changeDanceSortList', res.data);
        }).catch(err => {
            console.log(err)
        })
    },

    //更新最新文章列表
    GetAllArticleList(context, params) {
        GetAllArticleList(params).then(res => {
            console.log(res)
            context.commit('changeNewArticleList', res.data);
        }).catch(err => {
            console.log(err)
            
        })
    },
    //更新最新视频列表
    GetAllVideoList(context, params) {
        GetAllVideoList(params).then(res => {
            console.log(res)
            context.commit('changeNewVideoList', res.data);
        }).catch(err => {
            console.log(err)
            
        })
    },
    //更新消息列表
    GetMessageListByUser(context, params) {
        GetMessageListByUser(params).then(res => {
            console.log(res)
            context.commit('changeMessageList', res.data);
        }).catch(err => {
            console.log(err)
            
        })
    },
    //更新收藏视频列表
    VideoGetCollectList(context, params) {
        VideoGetCollectList(params).then(res => {
            console.log(res)
            context.commit('changeVideoCollectList', res.data);
        }).catch(err => {
            console.log(err)
            
        })
    },
    //更新收藏文章列表
    ArticleGetCollectList(context, params) {
        ArticleGetCollectList(params).then(res => {
            console.log(res)
            context.commit('changeArticleCollectList', res.data);
        }).catch(err => {
            console.log(err)
            
        })
    },
    //更新轮播图列表
    GetAllRotationImgList(context, params) {
        GetAllRotationImgList(params).then(res => {
            console.log(res)
            context.commit('changeRotationImgList', res.data);
        }).catch(err => {
            console.log(err)
            
        })
    },
}

export default actions;