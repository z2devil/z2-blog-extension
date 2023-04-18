import { onMount } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import storage from '../../../utils/storage';
import style from './style.module.scss';
import ChatRecords, { Dialogue } from './components/ChatRecords';
import ChatInput from './components/ChatInput';

const ChatGPT = () => {
  const [dialogueList, setDialogueList] = createStore<Dialogue[]>([]);

  const onAsk = (dialogue: Omit<Dialogue, 'id'>) => {
    setDialogueList(list => {
      return list.concat([{ id: dialogueList.length + '', ...dialogue }]);
    });
  };

  const onGenerate = (dialogue: Dialogue) => {
    const existIndex = dialogueList.findIndex(item => item.id === dialogue.id);

    if (~existIndex) {
      setDialogueList(
        produce(dialogueList => {
          dialogueList[existIndex].content += dialogue.content;
        })
      );
    } else {
      return setDialogueList(list => {
        return list.concat([dialogue]);
      });
    }
  };

  onMount(() => {
    storage
      .get('openaiKey')
      .then(data => {
        console.log('openaiKey', data);
      })
      .catch(err => {
        console.log(err);
      });
  });

  return (
    <div class={style.chatgptLayout}>
      <ChatRecords records={dialogueList} />
      <ChatInput onAsk={onAsk} onGenerate={onGenerate} />
    </div>
  );
};

export default ChatGPT;
