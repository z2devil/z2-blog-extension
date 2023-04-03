import { createSignal, useContext } from 'solid-js';
import Messager from '../../../utils/messager';
import { getContext } from '../../store';
import { ToastType } from '../../utils/toast';
import { sendNote } from '../../../request/api';

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
    <>
      <div class='popup-layout'>
        <textarea
          class='textarea'
          placeholder='写下你的灵感'
          spellcheck={false}
          value={text()}
          onInput={e => setText(e.currentTarget.value)}
        />
        <div class='bottom-bar'>
          <button class='btn send-btn actived' onClick={onSend}>
            发表
          </button>
        </div>
      </div>
    </>
  );
};

export default WriteNote;
