import { Match, Switch, createSignal, onMount } from 'solid-js';
import { render } from 'solid-js/web';
import Messager from '../utils/messager';
// import ChatGPT from './views/ChatGPT';
import WriteNote from './views/WriteNote';
import toastUtil, { ToastProps } from './utils/toast';
import { Context } from './store';
import ChatGPT from './views/ChatGPT';
import style from './style.module.scss';

const messager = new Messager();

const Main = () => {
  const [show, setShow] = createSignal<null | 'note' | 'chat'>(null);

  const onClose = () => {
    setShow(null);
  };

  onMount(() => {
    messager.on({
      code: 'write_note',
      callback: () => {
        setShow(prev => (prev ? null : 'note'));
        return Promise.resolve();
      },
    });
    messager.on({
      code: 'ask_chatgpt',
      callback: () => {
        setShow(prev => (prev ? null : 'chat'));
        return Promise.resolve();
      },
    });
    return () => {};
  });

  return (
    <>
      {show() ? (
        <>
          <div class={style.mask} onClick={onClose}></div>
          <Switch>
            <Match when={show() === 'chat'}>
              <ChatGPT close={onClose} />
            </Match>
            <Match when={show() === 'note'}>
              <WriteNote close={onClose} />
            </Match>
          </Switch>
        </>
      ) : null}
    </>
  );
};

const mount = () => {
  const host = document.createElement('div');
  const shadowRoot = host.attachShadow({ mode: 'open' });

  let stylesheet = chrome.runtime.getURL('../styles/app.css');
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
