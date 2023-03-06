import service from './common';

/**
 * 发送验证码
 */
export const sendCode = async (params: { email: string }) => {
  return await service.get('/auth/verify-code', { params });
};

/**
 * 登录
 */
export const sign = async (data: { email: string; verifyCode: string }) => {
  return await service.post('/auth/sign', data);
};

/**
 * 发送动态
 */
export const sendNote = async (data: { content: string }) => {
  return await service.post('/tweet', data);
};
