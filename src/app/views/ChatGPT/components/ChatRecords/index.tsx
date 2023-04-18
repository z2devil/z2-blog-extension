import { For, Match, Show, Switch, createSignal, onMount } from 'solid-js';
import style from './style.module.scss';
import classNames from 'classnames';
import storage, { IUser } from '@/utils/storage';
import IChatGPT from '@/constant/icons/IChatGPT';
import { ChatCompletion, DialogueOriginType } from '@/request/chatgpt';

export interface Dialogue {
  id: string;
  origin: DialogueOriginType;
  content: string;
  metaData: ChatCompletion | null;
}

interface IProps {
  records: Dialogue[];
}

const ChatRecords = (props: IProps) => {
  const [userData, setUserData] = createSignal<IUser>();

  onMount(async () => {
    const data = await storage.get('user');
    setUserData(data);
  });

  return (
    <div class={style.chatRecords}>
      <Show when={userData()} fallback={<div>请登录...</div>}>
        <For each={props.records} fallback={<div>Loading...</div>}>
          {record => (
            <div
              class={classNames(
                style.dialogueItem,
                record.origin === DialogueOriginType.User ? style.right : ''
              )}>
              <div class={style.avatar}>
                <Switch>
                  <Match when={record.origin === DialogueOriginType.User}>
                    <img
                      class={style.avatar}
                      src={
                        process.env.FILE_URL +
                        (userData() as IUser).avatarPath +
                        '?x-oss-process=image/resize,s_72'
                      }
                    />
                  </Match>
                  <Match when={record.origin === DialogueOriginType.ChatGPT}>
                    <IChatGPT></IChatGPT>
                  </Match>
                </Switch>
              </div>
              <div class={style.rightBox}>
                <div class={style.dialogueOrigin}>
                  {record.origin === DialogueOriginType.User ? '我' : 'ChatGPT'}
                </div>
                <div class={style.dialogueContent}>{record.content}</div>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};

export default ChatRecords;
