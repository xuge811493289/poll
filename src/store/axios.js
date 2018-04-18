/**
	axios的配置文件
	1、设置post数据格式为表单格式
	2、设置基路径
	3、序列化字符串
*/
import axios from 'axios'
import qs from 'qs'
//配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 阿里云
axios.defaults.baseURL = 'http://120.78.164.247:8080/poll/';
// axios.defaults.baseURL = 'http://127.0.0.1:8888/poll';
// axios.defaults.baseURL = 'http://10.0.7.216:8888/poll';

axios.interceptors.request.use((config) => {
    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axios;
