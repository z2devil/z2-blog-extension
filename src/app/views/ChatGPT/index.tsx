import { createSignal, onMount } from 'solid-js';
import { getContext } from '../../store';
import storage from '../../../utils/storage';
import { ask } from '../../../request/api';
import { ToastType } from '../../utils/toast';
import style from './style.module.scss';
import classNames from 'classnames';
import ChatRecords, { Dialogue } from './components/ChatRecords';
import ChatInput from './components/ChatInput';

interface IProps {
  close: () => void;
}

const ChatGPT = (props: IProps) => {
  const { showToast } = getContext();

  const [dialogueList, setDialogueList] = createSignal<Dialogue[]>([]);

  const handleChangeDialueList = (dialogue: Dialogue) => {
    console.log('handleChangeDialueList', dialogue);

    setDialogueList(list => {
      return list.concat([dialogue]);
    });
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
      <ChatRecords records={dialogueList()} />
      <ChatInput
        onAsk={handleChangeDialueList}
        onGenerate={handleChangeDialueList}
      />
    </div>
  );
};

export default ChatGPT;
