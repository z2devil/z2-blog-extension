import axios from 'axios';
import storage from '../../utils/storage';

const service = axios.create({
  baseURL: process.env.API_URL,
  timeout: 30000,
});

service.interceptors.request.use(
  config => {
    return new Promise(async (resolve, reject) => {
      const storageData = await storage.get();
      storageData && (config.headers['Authorization'] = storageData.token);
      config.headers['Content-Type'] = 'application/json';
      resolve(config);
    });
  },
  error => {
    // 对请求错误做些什么，自己定义
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const http = response;
    if (http.status === 200) {
      const res = response.data;
      if (res.code === 200) {
        return Promise.resolve(res.data);
      } else {
        return Promise.reject(res.msg);
      }
    } else {
      const res = response.data;
      if (res) {
        return Promise.reject(res.msg);
      } else {
        return Promise.reject('服务器异常');
      }
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
