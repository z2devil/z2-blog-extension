// import { ask, sendCode, sendNote, sign } from '../request/api';
import { requestListenerInit } from '../request/api';

const messager = requestListenerInit();

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
  let code = null;

  switch (command) {
    case 'write_note':
      code = 'write_note';
      break;
    case 'ask_chatgpt':
      code = 'ask_chatgpt';
      break;
  }

  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id ?? 0, { code });
});
