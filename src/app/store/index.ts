import { createContext, useContext } from 'solid-js';
import { ToastProps } from '../utils/toast';

export interface ContextType {
  showToast: (props: ToastProps) => Promise<unknown>;
}

export const Context = createContext<ContextType>();

export const getContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('must be used within Context.Provider');
  return context;
};
