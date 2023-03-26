import { createSignal } from 'solid-js';
import Messager from '../../../utils/messager';

enum DialogueOriginType {
  User = 'Uesr',
  ChatGPT = 'ChatGPT',
}

interface Dialogue {
  origin: DialogueOriginType;
  content: string;
}

const ChatGPT = () => {
  const [content, setContent] = createSignal('');

  const [dialogueList, setDialogueList] = createSignal<Dialogue[]>([]);

  const onGenerate = async () => {
    setDialogueList(prev => {
      return prev.concat([
        {
          origin: DialogueOriginType.User,
          content: content(),
        },
      ]);
    });
    const res = await Messager.send({
      code: 'chatgpt-generate',
      params: { content: content() },
    });
    console.log(res);

    setContent('');
    setDialogueList(list => {
      return list.concat([
        {
          origin: DialogueOriginType.ChatGPT,
          content: res.text,
        },
      ]);
    });
  };

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
          type='text'
          value={content()}
          onInput={e => setContent(e.currentTarget.value)}
        />
        <button class='generate-btn' onClick={onGenerate}>
          生成
        </button>
      </div>
    </>
  );
};

export default ChatGPT;
