import { createSignal } from 'solid-js';
import classNames from 'classnames';
import { NotificationType } from '../../../hooks/useNotification';
import storage, { IUser } from '../../../../utils/storage';
import Messager from '../../../../utils/messager';
import { getContext } from '../../../store';
import { sendCode, sign } from '../../../../request/api';

const EMAIL_REG = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const SignPanel = () => {
  const { onNotification } = getContext();

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
    const { code, msg } = await sendCode({ email }).handle();
    if (code === 0) {
      onNotification({
        message: '发送成功',
        type: NotificationType.Success,
        timer: 2000,
      });
    } else {
      onNotification({
        message: msg,
        type: NotificationType.Error,
        timer: 2000,
      });
    }
  };

  /**
   * 登录
   */
  const onSignin = async () => {
    const { data, code, msg } = await sign({
      email,
      verifyCode: input(),
    }).handle();
    if (code === 0) {
      await storage.set('token', data.token);
      await storage.set('user', data.user);
      location.reload();
    }
  };

  return (
    <div class='sign-panel'>
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
