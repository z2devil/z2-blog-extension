/**
 * 获取当前tab页
 */
const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

// 弹出层是否已经打开
let isOpen = false;

/**
 * 监听呼出弹出层快捷键
 */
chrome.commands.onCommand.addListener(async command => {
  if (command !== 'write_note' || isOpen) return;
  const tab = await getCurrentTab();
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id ?? 0 },
      func: createPopupLayout,
    },
    () => {
      isOpen = true;
    }
  );
});

/**
 * 监听关闭弹出层事件
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request?.code);
  const code = request?.code;
  if (!code) return;
  switch (code) {
    case 'close-popup':
      isOpen = false;
      sendResponse({ msg: 'success' });
      break;
    case 'send-note':
      console.log('发送！！');

      break;
    default:
      break;
  }
});

/**
 * 创建弹出层
 */
const createPopupLayout = () => {
  // 插件id
  const ID = 'ihidlmafkicdgplnabhallfbpfohojpo';
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
  mask.addEventListener('click', () => {
    body.removeChild(app);
    chrome.runtime.sendMessage(ID, {
      code: 'close-popup',
    });
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
    console.log('textarea', text);
    if (!text) return;
    chrome.runtime.sendMessage(ID, {
      code: 'send-note',
      content: text,
    });
  });
  // 挂载
  shadow.appendChild(popupLayout);
  body.appendChild(app);
};
