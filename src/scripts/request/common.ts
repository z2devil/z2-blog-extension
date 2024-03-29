import axios from 'axios';
import storage from '../../utils/storage';

const TIME_OUT = 10000;

const enum Method {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

const enum ContentType {
  Json = 'application/json;charset=UTF-8',
  Form = 'application/x-www-form-urlencoded; charset=UTF-8',
  Download = 'application/octet-stream',
}

const baseFetch = (url: string, options: Record<string, any>) => {
  return Promise.race<any>([
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('requst timeout'));
      }, TIME_OUT);
    }),
    new Promise((resolve, reject) => {
      fetch(process.env.API_URL + url, options)
        .then(async res => {
          if (!/^(2|3)\d{2}$/.test(res.status.toString())) {
            switch (res.status) {
              case 401:
                break;
              case 403:
                break;
              case 404:
                break;
            }
            return Promise.reject(res);
          }
          const data =
            options.headers['Content-type'] === ContentType.Download
              ? res.blob()
              : res.json();
          console.log('fetch data', res, await data);
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    }),
  ]);
};

const baseOptions = {
  headers: {
    'Content-type': ContentType.Json,
  },
  /**
   * include:
   * 默认不论是不是跨域的请求
   * 总是发送请求资源域在本地的 cookies、HTTP Basic authentication 等验证信息
   * omit: 从不发送cookies
   * same-origin: 同源发送cookies
   */
  credentials: 'omit',
  mode: 'cors',
};

const service = {
  get: (
    url: string,
    options: {
      params?: Record<string, any>;
      [key: string]: any;
    }
  ) => {
    const { params, ...restOptions } = options;
    if (params) {
      const paramsArray: string[] = [];
      Object.keys(params).forEach(key =>
        paramsArray.push(key + '=' + encodeURIComponent(params[key]))
      );
      url += (url.search(/\?/) === -1 ? '?' : '&') + paramsArray.join('&');
    }
    return baseFetch(url, {
      method: Method.GET,
      ...Object.assign(baseOptions, restOptions),
    });
  },
  post: (
    url: string,
    options: {
      body?: Record<string, any>;
      [key: string]: any;
    }
  ) => {
    const { body, ...restOptions } = options;
    return baseFetch(url, {
      method: Method.POST,
      ...Object.assign(baseOptions, {
        body: JSON.stringify(body),
        ...restOptions,
      }),
    });
  },
};

export default service;
