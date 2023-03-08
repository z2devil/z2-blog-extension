import { createSignal } from 'solid-js';
import classNames from 'classnames';
import { getContext } from '../..';
import { NotificationType } from '../hooks/useNotification';
import storage from '../../../../utils/storage';

const EMAIL_REG = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const SignPanel = () => {
  const { messager, onNotification } = getContext();

  let email = '';

  const [input, setInput] = createSignal('');
  const [isSendedCode, setIsSendedCode] = createSignal(false);

  /**
   * 发送验证码
   */
  const onSendCode = async () => {
    if (!isSendedCode()) {
      if (!EMAIL_REG.test(input())) {
        onNotification({
          message: '请输入正确的邮箱',
          type: NotificationType.Error,
          timer: 2000,
        });
        return;
      }
      email = input();
      setInput('');
      setIsSendedCode(true);
    }
    const res = await messager.send<{ code: number }>({
      code: 'send-code',
      params: { email },
    });
    if (res.code === 200) {
      onNotification({
        message: '发送成功',
        type: NotificationType.Success,
        timer: 2000,
      });
    }
  };

  /**
   * 登录
   */
  const onSignin = async () => {
    const res = await messager.send<{ code: number; data: any }>({
      code: 'sign',
      params: { email, verifyCode: input() },
    });
    if (res.code === 200) {
      onNotification({
        message: '登录成功',
        type: NotificationType.Success,
        timer: 2000,
      });
      await storage.set(res.data);
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  };

  return (
    <div class='panel sign-panel show'>
      <div class='title-box'>
        <span class='main'>登入</span>
        <span class='sub'>登录或注册</span>
      </div>
      <div class='content-box'>
        <div class='input-box'>
          <input
            class='input'
            type='text'
            maxlength='50'
            autofocus
            placeholder={isSendedCode() ? '请输入验证码' : '请输入邮箱'}
            value={input()}
            onInput={e => setInput(e.currentTarget.value)}
          />
        </div>
      </div>
      <div class='button-box'>
        <button class='btn send-btn actived' onClick={onSendCode}>
          {isSendedCode() ? '重新发送验证码' : '发送验证码'}
        </button>
        <button
          class={classNames('btn sign-btn', isSendedCode() ? 'actived' : '')}
          onClick={onSignin}>
          登录 / 注册
        </button>
      </div>
    </div>
  );
};

export default SignPanel;
