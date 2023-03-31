import { createContext, useContext } from 'solid-js';
import { NotificationType } from '../hooks/useNotification';

export interface ContextType {
  onNotification: (props: {
    message: string;
    type?: NotificationType;
    timer?: number;
  }) => void;
}

export const Context = createContext<ContextType>();

export const getContext = () => {
  const context = useContext(Context);
  if (!context)
    throw new Error(
      'useNotification must be used within NotificationContext.Provider'
    );
  return context;
};
