import { createContext, createSignal, onMount, useContext } from 'solid-js';
import { render } from 'solid-js/web';
import Messager from '../utils/messager';
// import ChatGPT from './views/ChatGPT';
import WriteNote from './views/WriteNote';
import toastUtil, { ToastProps } from './utils/toast';

const messager = new Messager();

interface ContextType {
  showToast: (props: ToastProps) => Promise<unknown>;
}

const Context = createContext<ContextType>();

export const getContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('must be used within Context.Provider');
  return context;
};

const Main = () => {
  const [show, setShow] = createSignal(false);

  const onClose = () => {
    setShow(false);
  };

  onMount(() => {
    messager.on({
      code: 'toggle-popup',
      callback: () => {
        setShow(prev => !prev);
        return Promise.resolve();
      },
    });
    return () => {};
  });

  return (
    <>
      {show() ? (
        <>
          <div class='mask' onClick={onClose}></div>
          {/* <ChatGPT /> */}
          <WriteNote close={onClose} />
        </>
      ) : null}
    </>
  );
};

const mount = () => {
  const host = document.createElement('div');
  const shadowRoot = host.attachShadow({ mode: 'open' });

  let stylesheet = chrome.runtime.getURL('../styles/style.css');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = stylesheet;

  shadowRoot.appendChild(link);

  const [showToast] = toastUtil(shadowRoot);

  render(
    () => (
      <Context.Provider value={{ showToast }}>
        <Main />
      </Context.Provider>
    ),
    shadowRoot
  );

  document.body.appendChild(host);
};

mount();
