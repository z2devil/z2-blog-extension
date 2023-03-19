import { render } from 'solid-js/web';
import { createContext, useContext } from 'solid-js';
import User from './views/User';
import useNotification, { NotificationType } from './hooks/useNotification';

interface ContextType {
  onNotification: (props: {
    message: string;
    type?: NotificationType;
    timer?: number;
  }) => void;
}

const Context = createContext<ContextType>();

export const getContext = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error(
      'useNotification must be used within NotificationContext.Provider'
    );
  return context;
};

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
