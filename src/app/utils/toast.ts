const PREFIX = 'z2-extension';
const DEFAULT_DURATION = '3s';

export enum ToastType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

const ICON_URL = {
  [ToastType.Success]: chrome.runtime.getURL('../static/images/success.svg'),
  [ToastType.Warning]: chrome.runtime.getURL('../static/images/warning.svg'),
  [ToastType.Error]: chrome.runtime.getURL('../static/images/error.svg'),
};

export interface ToastProps {
  text: string;
  type?: ToastType;
  duration?: string;
}

/**
 * 初始化（生成 toast 挂载节点 root）
 */
const init = (node: ShadowRoot) => {
  const root = document.createElement('section');
  root.classList.add(`${PREFIX}-toast-group`);

  node.appendChild(root);

  return root;
};

/**
 * 创建 toast
 */
const createToast = (props: ToastProps) => {
  const toast = document.createElement('output');

  toast.classList.add(`${PREFIX}-toast`);
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.style.setProperty('--duration', props.duration || DEFAULT_DURATION);

  const icon = document.createElement('object');

  icon.classList.add(`${PREFIX}-toast-icon`);
  icon.type = 'image/svg+xml';
  icon.data = ICON_URL[props.type || ToastType.Success];

  toast.appendChild(icon);

  const span = document.createElement('span');

  span.innerText = props.text;

  toast.appendChild(span);

  return toast;
};

const toastUtil = (node: ShadowRoot) => {
  const root = init(node);

  const flipToast = (toast: Element) => {
    const first = root.offsetHeight;
    root.insertBefore(toast, root.firstElementChild);
    const last = root.offsetHeight;
    const invert = last - first;
    const animation = root.animate(
      [
        { transform: `translateY(${-invert}px)` },
        { transform: 'translateY(0)' },
      ],
      {
        duration: 150,
        easing: 'ease-out',
      }
    );

    animation.startTime = document.timeline.currentTime;
  };

  const showToast = (props: ToastProps) => {
    const toast = createToast(props);

    const { matches } = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    );
    matches ? flipToast(toast) : root.appendChild(toast);

    return new Promise(async (resolve, reject) => {
      await Promise.allSettled(
        toast.getAnimations().map(animation => animation.finished)
      );
      root.removeChild(toast);
      resolve(null);
    });
  };

  return [showToast] as const;
};

export default toastUtil;
