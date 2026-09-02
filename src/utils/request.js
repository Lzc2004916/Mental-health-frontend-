import axios from 'axios'
import { ElMessage } from 'element-plus'
const service = axios.create({
    baseURL: '/api',
    timeout: 5000
})
service.interceptors.request.use(
    config=>{
       const token = localStorage.getItem('token')
       if(token){
        config.headers['token'] = token
       }
        return config
    },
    error=>{
        return Promise.reject(error)
    }
)
service.interceptors.response.use(
    response=>{
        const {data,config} = response
        // 后端约定：code 为 '200'（宽松比较，兼容数字/字符串）表示成功
        if(data.code == 200){
            // token 失效信号：后端用 data === '-1' 表示
            if(data.data == '-1' && !config.url.includes('/login')){
                ElMessage.error('登录过期，请重新登录')
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                window.location.href = '/auth/login'
                return Promise.reject(data)
            }
            return data.data
        }
        // 业务/系统错误（如 BUSINESS_ERROR）：弹出后端 message，并 reject
        ElMessage.error(data.message || data.msg || '请求失败')
        return Promise.reject(data)
    },
    error=>{
        return Promise.reject(error)
    }
)
export default service