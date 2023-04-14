import { createSignal, useContext } from 'solid-js';
import { getContext } from '../../store';
import { ToastType } from '../../utils/toast';
import { sendNote } from '../../../request/api';
import style from './style.module.scss';
import buttonStyle from '@/constant/styles/button.module.scss';
import classNames from 'classnames';

interface IProps {
  close: () => void;
}

const WriteNote = (props: IProps) => {
  const { showToast } = getContext();

  const [text, setText] = createSignal('');

  const onSend = async () => {
    if (text().length === 0) {
      showToast({
        text: '请填写内容',
        type: ToastType.Warning,
      });
      return;
    }

    const { code, msg } = await sendNote({ content: text() }).handle();

    if (code === 0) {
      showToast({
        text: '发表成功',
      });
      props.close();
    } else {
      showToast({
        type: ToastType.Error,
        text: msg,
      });
    }
  };
  return (
    <div class={style.popupLayout}>
      <textarea
        class={style.textarea}
        placeholder='写下你的灵感'
        spellcheck={false}
        value={text()}
        onInput={e => setText(e.currentTarget.value)}
      />
      <div class={style.bottomBar}>
        <button
          class={classNames(buttonStyle.btn, style.sendBtn)}
          onClick={onSend}>
          发表
        </button>
      </div>
    </div>
  );
};

export default WriteNote;
