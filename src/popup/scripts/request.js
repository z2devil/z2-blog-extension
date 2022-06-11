const service = axios.create({
    // baseURL: 'https://z2devil.cn/api',
    baseURL: 'http://localhost:8000/api',
    timeout: 30000,
});

service.interceptors.request.use(
    config => {
        chrome.storage.sync.get(['token'], ({ token }) => {
            if (token) config.headers['Authorization'] = token;
        });
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        // 对请求错误做些什么，自己定义
        return new Promise(function (resolve, reject) {
            reject(error);
        }).catch(function (reason) {
            console.error('catch:', reason);
        });
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
        Promise.reject(error.response);
    }
);

/**
 * get方法封装
 */
export function get(url, data) {
    return service.get(url, {
        params: data,
    });
}

/**
 * delete方法封装
 */
export function dele(url, data) {
    return service.delete(url, {
        params: data,
    });
}

/**
 * post方法封装
 */
export function post(url, param) {
    return service.post(url, param);
}

/**
 * put方法封装
 */
export function put(url, param) {
    return service.put(url, param);
}
