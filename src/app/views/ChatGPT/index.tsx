import { createSignal, onMount } from 'solid-js';
import { getContext } from '../../store';
import storage from '../../../utils/storage';
import { ask } from '../../../request/api';
import { ToastType } from '../../utils/toast';

enum DialogueOriginType {
  User = 'Uesr',
  ChatGPT = 'ChatGPT',
}

interface IProps {
  close: () => void;
}

interface Dialogue {
  origin: DialogueOriginType;
  content: string;
}

const ChatGPT = (props: IProps) => {
  const { showToast } = getContext();

  const [content, setContent] = createSignal('');

  const [dialogueList, setDialogueList] = createSignal<Dialogue[]>([]);

  const onGenerate = async () => {
    const openaiKey = await storage.get('openaiKey');

    if (openaiKey === undefined) {
      showToast({
        text: '请先设置OpenAI Key',
        type: ToastType.Error,
      });
      return;
    }

    setDialogueList(prev => {
      return prev.concat([
        {
          origin: DialogueOriginType.User,
          content: content(),
        },
      ]);
    });

    const res = await ask({ content: content() }, openaiKey).handle();

    setContent('');
    setDialogueList(list => {
      return list.concat([
        {
          origin: DialogueOriginType.ChatGPT,
          content: res.choices[0].message.content,
        },
      ]);
    });
  };

  onMount(() => {
    storage
      .get('openaiKey')
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  });

  return (
    <>
      <div class='chatgpt-layout'>
        <div class='dialogue-container'>
          {dialogueList().map(dialogue => {
            return (
              <div class='dialogue-item'>
                <div class='dialogue-origin'>{dialogue.origin}</div>
                <div class='dialogue-content'>{dialogue.content}</div>
              </div>
            );
          })}
        </div>
        <input
          class='input'
          type='text'
          value={content()}
          onInput={e => setContent(e.currentTarget.value)}
        />
        <button class='btn generate-btn actived' onClick={onGenerate}>
          生成
        </button>
      </div>
    </>
  );
};

export default ChatGPT;
