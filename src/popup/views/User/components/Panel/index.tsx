import { JSX } from 'solid-js/jsx-runtime';
import style from './style.module.scss';

interface IProps {
  title: string;
  subTitle: string;
  children: JSX.Element;
}

const Panel = (props: IProps) => {
  return (
    <div class={style.panel}>
      <div class={style.titleBox}>
        <span class={style.titleMain}>{props.title}</span>
        <span class={style.titleSub}>{props.subTitle}</span>
      </div>
      <div class={style.contentBox}>{props.children}</div>
    </div>
  );
};

export default Panel;
