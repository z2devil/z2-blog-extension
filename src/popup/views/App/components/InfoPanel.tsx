const InfoPanel = () => {
  return (
    <div class='panel info-panel'>
      <div class='title-box'>
        <span class='main'>用户</span>
        <span class='sub'>个人中心</span>
      </div>
      <div class='content-box'>
        <div class='basic-info-box'>
          <div class='basic-info'>
            {/* <async-img
            class="avatar"
            :url="userInfo.avatarPath"
            suffix="?x-oss-process=image/resize,s_72" /> */}
            <div class='info'>
              <div class='info-item'>
                <span class='tag'>{}</span>
                <span class='name'>{}</span>
              </div>
              <div class='info-item'>
                <span class='email'>{}</span>
              </div>
            </div>
          </div>
          <button class='btn logout-btn actived'>登出</button>
        </div>
        <div class='signature'>
          <span>{}</span>
        </div>
      </div>
    </div>
  );
};
export default InfoPanel;
