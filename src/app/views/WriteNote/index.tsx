import { createSignal, useContext } from 'solid-js';
import Messager from '../../../utils/messager';
import { getContext } from '../../main';
import { ToastType } from '../../utils/toast';

interface IProps {
  close: () => void;
}

const WriteNote = (props: IProps) => {
  const [text, setText] = createSignal('');

  const { showToast } = getContext();

  const onSend = async () => {
    showToast({
      text: '请填写内容',
      type: ToastType.Success,
    });
    setTimeout(() => {
      showToast({
        text: '请填写内容',
        type: ToastType.Warning,
      });
    }, 1000);
    setTimeout(() => {
      showToast({
        text: '请填写内容',
        type: ToastType.Error,
      });
    }, 2000);
    // if (text().length === 0) {
    //   showToast({
    //     text: '请填写内容',
    //     type: ToastType.Warning,
    //   });
    //   return;
    // }
    // const res = await Messager.send({
    //   code: 'send-note',
    //   params: { content: text() },
    // });
    // if (res.code === 200) {
    //   showToast({
    //     text: '发表成功',
    //   });
    //   props.close();
    // }
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
