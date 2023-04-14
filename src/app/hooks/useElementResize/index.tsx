import { createEffect, createSignal, onMount } from 'solid-js';
import style from './style.module.scss';
import classNames from 'classnames';

interface Options {
  target: HTMLElement | undefined;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const useElementResize = (options: Options) => {
  const {
    target,
    onResizeStart = () => {},
    onResizeEnd = () => {},
    minHeight = 0,
    maxHeight = Infinity,
  } = options;

  // 是否正在拖拽
  const [isResizing, setIsResizing] = createSignal(false);

  // 监听鼠标按下的状态，如果鼠标按下了，就改变页面body元素的cursor样式
  createEffect(() => {
    if (isResizing()) {
      document.body.style.cursor = 'ns-resize';
    } else {
      document.body.style.cursor = 'unset';
    }
  });

  // 记录上次的鼠标位置
  const [lastMousePosition, setLastMousePosition] = createSignal<{
    x: number;
    y: number;
  } | null>(null);

  // 拖拽元素的引用
  const resizeHandlerRef: HTMLDivElement | undefined = undefined;

  // 拖拽元素
  const ResizeHandler = (
    <div
      ref={resizeHandlerRef}
      class={classNames(
        style.resizeHandler,
        isResizing() ? style.active : ''
      )}></div>
  );

  const handleMouseDown = (event: MouseEvent) => {
    setLastMousePosition({ x: event.clientX, y: event.clientY });
    setIsResizing(true);
    onResizeStart();
  };

  function handleMouseMove(event: MouseEvent) {
    return requestAnimationFrame(() => {
      if (!isResizing() || !target) return;

      const lastPosition = lastMousePosition();

      if (!lastPosition) return;

      const dy = lastPosition.y - event.clientY;

      const newHeight = Math.min(
        Math.max(target.clientHeight + dy, minHeight),
        maxHeight
      );

      target.style.height = `${newHeight}px`;

      setLastMousePosition({ x: event.clientX, y: event.clientY });
    });
  }

  const handleMouseUp = () => {
    setIsResizing(false);
    onResizeEnd();
  };

  onMount(() => {
    if (!resizeHandlerRef) return;
    const handler = resizeHandlerRef as HTMLDivElement;

    handler.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      handler.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return [ResizeHandler];
};

export default useElementResize;
