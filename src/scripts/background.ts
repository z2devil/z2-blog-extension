import Messager from '../utils/messager';
import { sendCode, sendNote, sign } from '../request/api';

const messager = new Messager();

// const api = new ChatGPTAPI({
//   apiKey: process.env.OPENAI_API_KEY as string,
// });

messager.on([
  // TODO: 将请求合并成处理器
  // {
  //   code: 'request',
  //   callback: (props: {
  //     method: 'get' | 'post';
  //     url: string;
  //     options: Record<string, any>;
  //   }) => {
  //     const { method, url, options } = props;
  //     return new Promise((resolve, reject) => {
  //       service[method](url, options)
  //         .then(res => {
  //           resolve(res);
  //         })
  //         .catch(err => {
  //           reject(err);
  //         });
  //     });
  //   },
  // },
  {
    code: 'send-code',
    callback: async ({ email }) => {
      return await sendCode({ email });
    },
  },
  {
    code: 'sign',
    callback: async ({ email, verifyCode }) => {
      return await sign({ email, verifyCode });
    },
  },
  {
    code: 'send-note',
    callback: async ({ content }) => {
      return await sendNote({ content });
    },
  },
]);

/**
 * 获取当前tab页
 */
const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

/**
 * 监听呼出弹出层快捷键
 */
chrome.commands.onCommand.addListener(async command => {
  if (command !== 'write_note') return;
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id ?? 0, { code: 'toggle-popup' });
});
