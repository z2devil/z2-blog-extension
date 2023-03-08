import Messager, { MessageType } from '../utils/messager';
import { sendCode, sendNote, sign } from './request/api';
import service from './request/common';

const messager = new Messager();

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

let isPopupLayoutShow = false;

/**
 * 监听呼出弹出层快捷键
 */
chrome.commands.onCommand.addListener(async command => {
  if (command !== 'write_note') return;
  const tab = await getCurrentTab();
  chrome.scripting.executeScript({
    target: { tabId: tab.id ?? 0 },
    args: [isPopupLayoutShow],
    func: createPopupLayout,
  });
});

/**
 * 创建弹出层
 */
const createPopupLayout = (isShow: boolean) => {
  /**
   * 移植的Messager.send
   */
  function send<T = any>(message: MessageType) {
    return new Promise<T>(resolve => {
      chrome.runtime.sendMessage(
        process.env.EXTENSION_ID,
        message,
        response => {
          resolve(response);
        }
      );
    });
  }
  /**
   * 转化node
   */
  const createNode = (html: string, unuseFragment?: boolean): Node => {
    if (!unuseFragment)
      return document.createRange().createContextualFragment(html);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc?.querySelector('body')?.childNodes[0] ?? null) as Node;
  };
  // dom
  const body = document.querySelector('body') as HTMLBodyElement;
  const app = document.createElement('div');
  const shadow = app.attachShadow({ mode: 'closed' });
  // 样式
  let stylesheet = chrome.runtime.getURL('../styles/style.css');
  const styles = createNode(`
        <link rel="stylesheet" href="${stylesheet}"></link>
    `);
  shadow.appendChild(styles);
  // 遮罩
  const mask = createNode(`<div class="mask"></div>`, true);
  mask.addEventListener('click', event => {
    event.preventDefault();
    body.removeChild(app);
    isShow = false;
  });
  shadow.appendChild(mask);
  // 弹出层
  const popupLayout = createNode(`<div class="popup-layout"></div>`, true);
  // 输入区域
  const textarea = document.createElement('textarea');
  textarea.setAttribute('class', 'textarea');
  textarea.setAttribute('placeholder', '写下你的灵感');
  textarea.setAttribute('spellcheck', 'false');
  popupLayout.appendChild(textarea);
  // 底部按钮栏
  const bottomBar = createNode(`<div class="bottom-bar"></div>`, true);
  popupLayout.appendChild(bottomBar);
  // 发表按钮
  const sendBtn = createNode(
    `<button class="btn send-btn actived">发表</button>`,
    true
  );
  bottomBar.appendChild(sendBtn);
  sendBtn.addEventListener('click', () => {
    const text = textarea.value;
    if (!text) return;
    send({
      code: 'send-note',
      params: { content: text },
    }).then(res => {
      if (res.code === 200) {
        console.log('发表成功');
      }
    });
  });
  // 挂载
  shadow.appendChild(popupLayout);
  body.appendChild(app);
};
