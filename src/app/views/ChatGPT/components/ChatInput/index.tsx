import { JSX, createEffect, createSignal } from 'solid-js';
import style from './style.module.scss';
import textareaStyle from '@/constant/styles/textarea.module.scss';
import { getContext } from '@/app/store';
import { Dialogue } from '../ChatRecords';
import classNames from 'classnames';
import IArrowUp from '@/constant/icons/IArrowUp';
import { ToastType } from '@/app/utils/toast';
import useElementResize from '@/app/hooks/useElementResize';
import storage from '@/utils/storage';
import { DialogueOriginType, ask } from '@/request/chatgpt';

interface IProps {
  onAsk: (dialogue: Omit<Dialogue, 'id'>) => void;
  onGenerate: (dialogue: Dialogue) => void;
}

// 更新textarea的高度
const updateTextareaHeight = (textarea: HTMLTextAreaElement | undefined) => {
  if (!textarea) return;
  textarea.style.height = 'auto';
  const nextHeight = textarea.scrollHeight;
  textarea.style.height = nextHeight + 'px';
};

const ChatInput = (props: IProps) => {
  const textareaRef: HTMLTextAreaElement | undefined = undefined;
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

    updateTextareaHeight(textareaRef);
    setInput('');

    props.onAsk({
      origin: DialogueOriginType.User,
      content: inputTemp,
      metaData: null,
    });

    await ask(
      inputTemp,
      ({ role, content, detail }) => {
        console.log('onMessage', role, content, detail);
        props.onGenerate({
          id: detail.id,
          origin: DialogueOriginType.ChatGPT,
          content: content,
          metaData: detail,
        });
      },
      { openaiKey }
    );
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
