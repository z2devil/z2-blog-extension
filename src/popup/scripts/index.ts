import storage, { IUser } from '@/utils/storage';

const placeholders = ['请输入邮箱', '请输入验证码'];
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const signPanel = document.querySelector('.sign-panel') as HTMLDivElement;
const infoPanel = document.querySelector('.info-panel') as HTMLDivElement;
const sendBtn = document.querySelector('.send-btn') as HTMLButtonElement;
const signBtn = document.querySelector('.sign-btn') as HTMLButtonElement;
const logoutBtn = document.querySelector('.logout-btn') as HTMLButtonElement;
const input = document.querySelector('.input') as HTMLInputElement;
const resultArea = document.querySelector('.result-area') as HTMLSpanElement;

const userInfoTag = document.querySelector(
  '.info-panel .tag'
) as HTMLSpanElement;
const userInfoName = document.querySelector(
  '.info-panel .name'
) as HTMLSpanElement;
const userInfoEmail = document.querySelector(
  '.info-panel .email'
) as HTMLSpanElement;
const userInfoSignature = document.querySelector(
  '.info-panel .signature'
) as HTMLSpanElement;

let email = '';

/**
 * 展示结果
 */
const setResult = (res?: string) => {
  resultArea.innerText = res ?? '';
};

/**
 * 更新info-panel
 */
enum Tag {
  Normal = '普通用户',
  Admin = '管理员',
  Master = '博主',
}
const tag = [Tag.Normal, Tag.Admin, Tag.Master];
const updateInfoPanel = (user: IUser) => {
  userInfoTag.innerText = tag[user.lv];
  userInfoName.innerText = user.nickname;
  userInfoEmail.innerText = user.email;
  userInfoSignature.innerText = user.signature;
};

(async () => {
  // 检查登录状态
  const storageData = await storage.get();
  if (storageData) {
    updateInfoPanel(storageData.user);
    signPanel && signPanel.classList.remove('show');
    infoPanel && infoPanel.classList.add('show');
  }

  // 发送验证码
  const handleSendCode = () => {
    setResult();
    if (input && emailReg.test(input.value)) {
      setResult('发送中...');
      sendBtn.classList.remove('actived');
      email = input.value;
      // get('/auth/verify-code', {
      //   email,
      // })
      //   .then(() => {
      //     setResult('发送成功');
      //     input.value = '';
      //     input.placeholder = placeholders[1];
      //     sendBtn.classList.remove('actived');
      //     signBtn.classList.add('actived');
      //   })
      //   .catch(err => {
      //     setResult(typeof err === 'object' ? JSON.stringify(err) : err);
      //   })
      //   .finally(() => {
      //     sendBtn.classList.add('actived');
      //   });
    } else {
      setResult('请输入正确的邮箱');
    }
  };

  // 登录
  const handleLogin = () => {
    setResult();
    if (input.value.length > 0) {
      setResult('登录中...');
      signBtn.classList.remove('actived');
      // post('/auth/sign', {
      //   email,
      //   verifyCode: input.value,
      // })
      //   .then(({ token, user }) => {
      //     setResult();
      //     storage.set({ token, user }, () => {
      //       updateInfoPanel(user);
      //       signPanel.classList.remove('show');
      //       infoPanel.classList.add('show');
      //     });
      //   })
      //   .catch(err => {
      //     setResult(typeof err === 'object' ? JSON.stringify(err) : err);
      //   })
      //   .finally(() => {
      //     signBtn.classList.add('actived');
      //   });
    } else {
      setResult('请输入验证码');
    }
  };

  // 登出
  const handleLogout = async () => {
    setResult();
    await storage.remove();
    infoPanel.classList.remove('show');
    signPanel.classList.add('show');
    chrome.runtime.sendMessage({ code: 'logout' });
  };

  input.placeholder = placeholders[0];

  sendBtn.addEventListener('click', handleSendCode);
  signBtn.addEventListener('click', handleLogin);

  logoutBtn.addEventListener('click', handleLogout);
})();
