import classNames from 'classnames';
import { createSignal, createEffect } from 'solid-js';

export enum NotificationType {
  Normal = 'normal',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

interface IProps {
  options: {
    type: NotificationType;
    message: string;
    timer: number;
  };
  onTimerEnd: () => void;
}

const NotificationHandler = (props: IProps) => {
  const options = () => props.options;

  createEffect(() => {
    let timerId: NodeJS.Timeout;

    if (options().timer > 0) {
      timerId = setTimeout(() => {
        props.onTimerEnd();
      }, options().timer);
    }

    return () => {
      clearTimeout(timerId);
    };
  });

  return (
    <>
      {options().timer > 0 ? (
        <div class={classNames('notification', options().type)}>
          <span>{options().message}</span>
        </div>
      ) : null}
    </>
  );
};

const useNotification = () => {
  const [options, setOptions] = createSignal({
    type: NotificationType.Normal,
    message: '',
    timer: 0,
  });

  const onTimerEnd = () => {
    setOptions({
      type: NotificationType.Normal,
      message: '',
      timer: 0,
    });
  };

  const onNotification = (props: {
    message: string;
    type?: NotificationType;
    timer?: number;
  }) => {
    setOptions({
      message: props.message,
      type: props.type ?? NotificationType.Normal,
      timer: props.timer ?? 2000,
    });
  };

  return [
    onNotification,
    <NotificationHandler options={options()} onTimerEnd={onTimerEnd} />,
  ] as const;
};

export default useNotification;
