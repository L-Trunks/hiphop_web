import QS from 'qs';
import axios from 'axios';
import store from '../store'
import router from '../router'
import Vue from 'vue'
import { Loading } from 'element-ui'

Vue.use(Loading);
axios.defaults.baseURL = '/api';//本地
axios.defaults.timeout = 5000 // 请求超时
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
axios.defaults.withCredentials = true

let loading;
function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(255,255,255,0)',
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}
//请求拦截
axios.interceptors.request.use(
    config => {
        startLoading();
        // 每次发送请求之前判断vuex中是否存在token        
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        const token = store.state.token;
        token && (config.headers.accessToken = token);
        return config;
    },
    error => {
        return Promise.error(error);
    })

//响应拦截
// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        endLoading();
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        endLoading();
        if (error.response.status) {
            console.log(response)
            switch (error.response.code) {              
                case 1002:
                    Vue.$message.error('请登录')
                    router.replace({
                        path: '/login'
                    });
                    break;
                case 1005:
                    Vue.$message.error('token失效,请重新登录')
                    router.replace({
                        path: '/login'
                    });
                    break;
                case 1001:
                    Vue.$message.error('连接数据库失败，请稍后再试')
                    break;

                case 1003:
                    Vue.$message.error('该用户已被使用')
                    break;
                case 1006:
                    Vue.$message.error('用户名或密码错误，请重新输入')
                    break;
                case 1007:
                    Vue.$message.error('未找到该用户')
                    break;
                case 1008:
                    Vue.$message.error('该昵称已被使用')
                    break;
                case 1009:
                    Vue.$message.error('原密码输入错误')
                    break;
                case 1010:
                    Vue.$message.error('该舞种已经存在')
                    break;
                case 1011:
                    Vue.$message.error('该图片已经存在')
                    break;
                case 1012:
                    Vue.$message.error('上传失败')
                    break;
                case 1013:
                    Vue.$message.error('该关键字已经存在')
                    break;
                default: Vue.$message.error('啊哦，服务器跑丢了')
            }
            return Promise.reject(error.response);
        }
    }
);
/**
 * get方法，对应get请求
 * @param {String} url [url地址]
 * @param {Object} params [参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        console.log(params)
        axios.get(url, {
            params: params
        }
        ).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [url地址] 
 * @param {Object} params [参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        console.log(params)
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}