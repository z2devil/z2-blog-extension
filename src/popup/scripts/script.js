const placeholders = ['请输入邮箱', '请输入验证码'];
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const signPanel = document.querySelector('.sign-panel');
const infoPanel = document.querySelector('.info-panel');
const sendBtn = document.querySelector('.send-btn');
const signBtn = document.querySelector('.sign-btn');
const logoutBtn = document.querySelector('.logout-btn');
const input = document.querySelector('.input');
const resultArea = document.querySelector('.result-area');

let email = '';

/**
 * 展示结果
 */
const setResult = res => {
    resultArea && (resultArea.innerHTML = res ? `<span>${res}</span>` : '');
};

/**
 * 更新info-panel
 */
const updateInfoPanel = user => {
    const tag = ['普通用户', '管理员', '博主'];
    document.querySelector('.info-panel .tag').innerHTML = tag[user.lv];
    document.querySelector('.info-panel .name').innerHTML = user.nickname;
    document.querySelector('.info-panel .email').innerHTML = user.email;
    document.querySelector('.info-panel .signature').innerHTML = user.signature;
};

(async () => {
    const { get, post } = await import('./request.js');

    // 发送验证码
    const handleSendCode = () => {
        setResult();
        if (emailReg.test(input.value)) {
            setResult('发送中...');
            sendBtn.classList.remove('actived');
            email = input.value;
            get('/auth/verify-code', {
                email,
            })
                .then(() => {
                    setResult('发送成功');
                    input.value = '';
                    input.placeholder = placeholders[1];
                    sendBtn.classList.remove('actived');
                    signBtn.classList.add('actived');
                })
                .catch(err => {
                    setResult(
                        typeof err === 'object' ? JSON.stringify(err) : err
                    );
                })
                .finally(() => {
                    sendBtn.classList.add('actived');
                });
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
            post('/auth/sign', {
                email,
                verifyCode: input.value,
            })
                .then(({ token, user }) => {
                    setResult('登录成功');
                    chrome.storage.sync.set({ token, user }, () => {
                        setResult();
                        updateInfoPanel(user);
                        signPanel.classList.remove('show');
                        infoPanel.classList.add('show');
                    });
                })
                .catch(err => {
                    setResult(
                        typeof err === 'object' ? JSON.stringify(err) : err
                    );
                })
                .finally(() => {
                    signBtn.classList.add('actived');
                });
        } else {
            setResult('请输入验证码');
        }
    };

    // 登出
    const handleLogout = () => {
        setResult();
        chrome.storage.sync.remove(['token', 'user'], () => {
            setResult('登出成功');
            infoPanel.classList.remove('show');
            signPanel.classList.add('show');
        });
        chrome.runtime.sendMessage({ code: 'logout' });
    };

    input.placeholder = placeholders[0];

    sendBtn.addEventListener('click', handleSendCode);
    signBtn.addEventListener('click', handleLogin);

    logoutBtn.addEventListener('click', handleLogout);

    chrome.storage.sync.get(['token', 'user'], res => {
        if (JSON.stringify(res) === '{}') return;
        updateInfoPanel(res.user);
        signPanel.classList.remove('show');
        infoPanel.classList.add('show');
    });
})();
