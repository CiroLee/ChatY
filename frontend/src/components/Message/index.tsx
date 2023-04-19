import React from 'react';
import Icon from '../Icon';
import classNames from 'classnames';
import './style/index.scss';
import ReactDOM from 'react-dom/client';
type MessageType = 'info' | 'success' | 'warn' | 'error';
interface MessageComProps {
  type: MessageType;
  text: string;
}
const typeMap: Record<MessageType, string> = {
  info: 'error-warning-fill',
  success: 'checkbox-circle-fill',
  warn: 'error-warning-fill',
  error: 'close-circle-fill',
};
const MessageCom = React.forwardRef<HTMLDivElement, MessageComProps>(function MessageComponent(
  props: MessageComProps,
  ref,
) {
  return (
    <div className={classNames('cy-message', `cy-message--${props.type}`)} ref={ref}>
      <Icon name={typeMap[props.type]} size="20px" />
      <div className="cy-message__text">{props.text}</div>
    </div>
  );
});

class Message {
  private dom: HTMLElement | null = null;
  private create(type: MessageType, text: string, delay = 3000) {
    // 单例模式
    if (this.dom) return;
    const msgRef = React.createRef<HTMLDivElement>();
    // 容器节点
    const node = document.createElement('div');
    document.body.appendChild(node);
    this.dom = node;
    // 渲染节点
    const vDOM = ReactDOM.createRoot(this.dom);
    vDOM.render(<MessageCom type={type} text={text} ref={msgRef} />);
    // delay时间后移除节点;
    setTimeout(() => {
      msgRef.current?.classList.add('out');
      // 动画完成后移除节点
      msgRef.current?.addEventListener('animationend', () => {
        vDOM.unmount();
        document.body.removeChild(node);
        this.dom = null;
      });
    }, delay);
  }

  info(text: string, delay?: number) {
    this.create('info', text, delay);
  }
  success(text: string, delay?: number) {
    this.create('success', text, delay);
  }
  warn(text: string, delay?: number) {
    this.create('warn', text, delay);
  }
  error(text: string, delay?: number) {
    this.create('error', text, delay);
  }
}

export default Message;
