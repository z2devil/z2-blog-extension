// 默认等待时间
const DELAY = 400;

type Fn = (...params: any) => any;

/**
 *
 * @param fn 方法
 * @param delay 等待时间
 * @param preTrigger 是否前置执行（默认值 false）
 */
function debounce(
  fn: Fn,
  delay?: number,
  preTrigger?: boolean
): (...args: any) => void;

/**
 * 防抖
 * @param fn 方法
 * @param preTrigger 是否前置执行（默认值 false）
 */
function debounce(fn: Fn, preTrigger?: boolean): (...args: any) => void;

function debounce(fn: Fn, ...args: any) {
  let timer: NodeJS.Timeout | null;

  let delay: number, preTrigger: boolean;
  if (Array.from(args).length === 1) {
    [preTrigger = false] = args;
    delay = DELAY;
  } else {
    [delay = DELAY, preTrigger = false] = args;
  }

  if (preTrigger) {
    return (..._args: any) => {
      if (timer) return;
      fn(..._args);
      timer = setTimeout(() => {
        timer && clearTimeout(timer);
        timer = null;
      }, delay);
    };
  } else {
    return (..._args: any) => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn(..._args);
        timer && clearTimeout(timer);
        timer = null;
      }, delay);
    };
  }
}

export default debounce;
