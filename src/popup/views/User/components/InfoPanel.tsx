import { createSignal, onMount } from 'solid-js';
import storage, { IUser } from '../../../../utils/storage';

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

  return (
    <div class='info-panel'>
      <div class='title-box'>
        <span class='main'>用户</span>
        <span class='sub'>个人中心</span>
      </div>
      <div class='content-box'>
        <div class='basic-info-box'>
          <div class='basic-info'>
            <img
              class='avatar'
              src={
                process.env.FILE_URL +
                info().avatarPath +
                '?x-oss-process=image/resize,s_72'
              }
            />
            <div class='info'>
              <div class='info-item'>
                <span class='tag'>{tag[info().lv]}</span>
                <span class='name'>{info().nickname}</span>
              </div>
              <div class='info-item'>
                <span class='email'>{info().email}</span>
              </div>
            </div>
          </div>
          <button class='btn logout-btn actived' onClick={onLogout}>
            {isLogoutConfirm() ? '请再次点击' : '登出'}
          </button>
        </div>
        <div class='signature'>
          <span>{info().signature}</span>
        </div>
      </div>
    </div>
  );
};
export default InfoPanel;
