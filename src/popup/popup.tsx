import { render } from 'solid-js/web';
import User from './views/User';
import useNotification from './hooks/useNotification';
import { Context, ContextType } from './store';
import './base.module.scss';

const Main = () => {
  const [onNotification, NotificationHandler] = useNotification();

  const contextValue: ContextType = {
    onNotification,
  };

  return (
    <Context.Provider value={contextValue}>
      {NotificationHandler}
      <User />
    </Context.Provider>
  );
};

render(() => <Main />, document.getElementById('app') as Element);
