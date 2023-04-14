import { createSignal } from 'solid-js';
import classNames from 'classnames';
import { NotificationType } from '@/popup/hooks/useNotification';
import storage, { IUser } from '../../../../../utils/storage';
import { getContext } from '../../../../store';
import { sendCode, sign } from '../../../../../request/api';
import style from './style.module.scss';
import buttonStyle from '@/constant/styles/button.module.scss';
import Panel from '../Panel';

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
    if (code === 200) {
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
    if (code === 200) {
      try {
        await storage.set('token', data.token);
        await storage.set('user', data.user);
      } catch (error) {
        onNotification({
          message: JSON.stringify(error),
          type: NotificationType.Error,
          timer: 2000,
        });
      }
      location.reload();
    }
  };

  return (
    <Panel title='登入' subTitle='登录或注册'>
      <>
        <div class={style.inputBox}>
          <input
            class={style.input}
            type='text'
            maxlength='50'
            autofocus
            placeholder={isSendedCode() ? '请输入验证码' : '请输入邮箱'}
            value={input()}
            onInput={e => setInput(e.currentTarget.value)}
          />
        </div>
        <div class={style.buttonBox}>
          <button
            class={classNames(buttonStyle.btn, style.sendBtn)}
            onClick={onSendCode}>
            {isSendedCode() ? '重新发送验证码' : '发送验证码'}
          </button>
          <button
            class={classNames(
              buttonStyle.btn,
              !isSendedCode() ? buttonStyle.disabled : ''
            )}
            onClick={onSignin}>
            登录 / 注册
          </button>
        </div>
      </>
    </Panel>
  );
};

export default SignPanel;
