import axios from "axios"
import uuid from 'uuid'
import {
    server
} from '../configs/index'
import { Toast } from "antd-mobile";

axios.defaults.withCredentials = true;
// 创建axios实例
const request = axios.create({
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// request拦截器
request.interceptors.request.use(
    config => {
        if (!config.params) {
            config.params = {}
        }
        config.baseURL = server()

        config.params = Object.assign({}, config.params, {
            // appType,
            requestId: `${uuid.v1().replace(/-/g, '')}`
        })
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// respone拦截器
request.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            // 50008:非法的token; 50012:其他客户端登录了;  410:Token 过期了;
            if (res.code === 401) {
                Toast.info('客户端未登录')
            }
            return Promise.reject(res)
        } else {
            return response.data
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default request