import Messager from '../utils/messager';
import storage, { IUser } from '../utils/storage';
import service from './common';

interface RequestParams {
  url: string;
  method: 'get' | 'post';
  params?: any;
  body?: any;
  headers?: Record<string, string>;
}

interface ResponseData<T = any> {
  data: T;
  code: number;
  msg: string;
}

const messager = new Messager();

export const requestListenerInit = () => {
  messager.on([
    {
      code: 'request',
      callback: async ({
        url,
        method,
        params,
        body,
        headers,
      }: RequestParams) => {
        console.log(url, method, params, body, headers);
        console.log(service[method]);

        try {
          const res = await service[method](url, { body, params }, headers);
          console.log(res);

          return res;
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
  ]);
  return messager;
};

/**
 * 发送验证码
 */
export const sendCode = (params: { email: string }) => {
  return Messager.send<ResponseData>({
    code: 'request',
    params: {
      url: '/auth/send-code',
      method: 'get',
      params,
    },
  });
};

/**
 * 登录
 */
export const sign = (body: { email: string; verifyCode: string }) => {
  return Messager.send<ResponseData<{ token: string; user: IUser }>>({
    code: 'request',
    params: {
      url: '/auth/sign',
      method: 'post',
      body,
    },
  });
};

/**
 * 发送动态
 */
export const sendNote = (body: { content: string }) => {
  return Messager.send<ResponseData>({
    code: 'request',
    params: {
      url: '/tweet',
      method: 'post',
      body: {
        ...body,
        resources: [],
      },
    },
  });
};

/**
 * 问 chatGPT
 */
interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}

export const ask = (body: { content: string }, openaiKey: string) => {
  return Messager.send<ChatCompletion>({
    code: 'request',
    params: {
      url: 'https://openai-proxy-bay.vercel.app/v1/chat/completions',
      method: 'post',
      body: {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: body.content,
          },
        ],
        temperature: 1,
        top_p: 1,
        stream: false,
        stop: '\n',
        // max_tokens: 'inf',
      },
      headers: {
        Authorization: `Bearer ${openaiKey}`,
      },
    },
  });
};
