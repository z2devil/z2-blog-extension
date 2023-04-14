import { JSX, createEffect, createSignal, onMount } from 'solid-js';
import style from './style.module.scss';
import textareaStyle from '@/constant/styles/textarea.module.scss';
import { getContext } from '@/app/store';
import { ChatCompletion, ask } from '@/request/api';
import { Dialogue, DialogueOriginType } from '../ChatRecords';
import classNames from 'classnames';
import IArrowUp from '@/constant/icons/IArrowUp';
import { ToastType } from '@/app/utils/toast';
import useElementResize from '@/app/hooks/useElementResize';
import storage from '@/utils/storage';

interface IProps {
  onAsk: (dialogue: Dialogue) => void;
  onGenerate: (dialogue: Dialogue) => void;
}

// 更新textarea的高度
const updateTextareaHeight = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  const nextHeight = textarea.scrollHeight;
  textarea.style.height = nextHeight + 'px';
};

const ChatInput = (props: IProps) => {
  let textareaRef: HTMLTextAreaElement | undefined = undefined;
  const [resizeHandler, setResizeHandler] = createSignal<JSX.Element | null>(
    null
  );
  createEffect(() => {
    if (textareaRef) {
      const handler = useElementResize({ target: textareaRef });
      setResizeHandler(handler);
    }
  });

  const { showToast } = getContext();

  const [input, setInput] = createSignal('');

  /**
   * 输入框内容变化
   */
  const onChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    updateTextareaHeight(target);
    setInput(target.value);
  };

  /**
   * 生成聊天内容
   */
  const handleGenerate = async () => {
    console.log('handleGenerate');

    const openaiKey = await storage.get('openaiKey');
    console.log(openaiKey);

    if (openaiKey === undefined) {
      showToast({
        text: '请先设置OpenAI Key',
        type: ToastType.Error,
      });
      return;
    }

    const inputTemp = input().trim();

    if (inputTemp === '') {
      showToast({
        text: '请输入内容',
        type: ToastType.Warning,
      });
      return;
    }

    updateTextareaHeight(textareaRef!);
    setInput('');

    props.onAsk({
      origin: DialogueOriginType.User,
      content: inputTemp,
      metaData: null,
    });

    const res = await ask({ content: inputTemp }, openaiKey).handle();

    console.log('res', res);

    props.onGenerate({
      origin: DialogueOriginType.ChatGPT,
      content: res.choices[0].message.content,
      metaData: res,
    });
  };

  return (
    <div class={style.chatInput}>
      <div class={style.textareaBox}>
        {resizeHandler()}
        <textarea
          ref={textareaRef}
          rows='1'
          cols='50'
          class={classNames(textareaStyle.textarea, style.textarea)}
          value={input()}
          onInput={onChange}
          placeholder='输入你想了解的...'
        />
      </div>
      <button class={style.sendBtn} onClick={handleGenerate}>
        <IArrowUp></IArrowUp>
      </button>
    </div>
  );
};

export default ChatInput;
