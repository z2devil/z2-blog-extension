import { Match, Switch, createSignal, onMount } from 'solid-js';
import storage, { IUser } from '../../../../../utils/storage';
import style from './style.module.scss';
import buttonStyle from '@/constant/styles/button.module.scss';
import classNames from 'classnames';
import Panel from '../Panel';
import { getContext } from '@/popup/store';
import { NotificationType } from '@/popup/hooks/useNotification';

interface IProps {
  info: IUser;
}

enum Tag {
  Normal = '普通用户',
  Admin = '管理员',
  Master = '博主',
}
const tag = [Tag.Normal, Tag.Admin, Tag.Master];

const InfoPanel = (props: IProps) => {
  const { onNotification } = getContext();

  const info = () => props.info;

  const [isLogoutConfirm, setIsLogoutConfirm] = createSignal(false);

  const onLogout = async () => {
    if (isLogoutConfirm()) {
      await storage.remove();
      location.reload();
    } else {
      setIsLogoutConfirm(true);
    }
  };

  onMount(() => {
    setIsLogoutConfirm(false);
  });

  const [hasOpenaiKey, setHasOpenaiKey] = createSignal(false);

  onMount(async () => {
    const openaiKey = await storage.get('openaiKey');
    setHasOpenaiKey(openaiKey !== undefined);
  });

  const [isEditing, setIsEditing] = createSignal(false);

  const [openaiKey, setOpenaiKey] = createSignal('');

  const onSave = async () => {
    if (openaiKey() === '') {
      onNotification({
        message: '请输入正确的 openai key',
        type: NotificationType.Error,
        timer: 2000,
      });
      return;
    }
    await storage.set('openaiKey', openaiKey());
    setIsEditing(false);
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  return (
    <Panel title='用户' subTitle='个人中心'>
      <>
        <div class={style.basicInfoBox}>
          <div class={style.infoLeft}>
            <img
              class={style.avatar}
              src={
                process.env.FILE_URL +
                info().avatarPath +
                '?x-oss-process=image/resize,s_72'
              }
            />
            <div class={style.info}>
              <div class={style.infoItem}>
                <span class={style.tag}>{tag[info().lv]}</span>
                <span class={style.nickname}>{info().nickname}</span>
              </div>
              <div class={style.infoItem}>
                <span class={style.email}>{info().email}</span>
              </div>
            </div>
          </div>
          <button
            class={classNames(buttonStyle.btn, style.logoutBtn)}
            onClick={onLogout}>
            {isLogoutConfirm() ? '请再次点击' : '登出'}
          </button>
        </div>
        <div class={style.signature}>
          <span>{info().signature}</span>
        </div>
        <div class={style.otherInfo}>
          <span class={style.label}>Openai Key</span>
          <div class={style.content}>
            <Switch>
              <Match when={isEditing()}>
                <input
                  class={style.input}
                  type='text'
                  value={openaiKey()}
                  onInput={e => setOpenaiKey(e.currentTarget.value)}
                />
                <button
                  class={classNames(buttonStyle.btn, buttonStyle.samll)}
                  onClick={onSave}>
                  保存
                </button>
                <button
                  class={classNames(buttonStyle.btn, buttonStyle.samll)}
                  onClick={onCancel}>
                  取消
                </button>
              </Match>
              <Match when={!isEditing()}>
                <span class={style.value}>
                  {hasOpenaiKey() ? '*****' : '无'}
                </span>
                <button
                  class={classNames(buttonStyle.btn, buttonStyle.samll)}
                  onClick={() => setIsEditing(true)}>
                  {hasOpenaiKey() ? '修改' : '填写'}
                </button>
              </Match>
            </Switch>
          </div>
        </div>
      </>
    </Panel>
  );
};
export default InfoPanel;
