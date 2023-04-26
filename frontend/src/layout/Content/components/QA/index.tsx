import { FC } from 'react';
import Icon from '@/components/Icon';
import Avatar from '@/components/Avatar';
import Message from '@/components/Message';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ClipboardSetText } from '@wails/runtime';
import './style/index.scss';

interface QAProps {
  content: string;
  avatar?: string;
  className?: string;
}
export const Question: FC<QAProps> = (props) => {
  const { content, avatar, className } = props;
  return (
    <div className={classNames('cy-qa cy-question', className)}>
      <Avatar url={avatar} />
      <div className="cy-qa__content cy-question__content">{content}</div>
    </div>
  );
};

interface CodeTitleBarProps {
  codes: React.ReactNode & React.ReactNode[];
  language?: string;
}
const CodeTitleBar: FC<CodeTitleBarProps> = (props) => {
  const message = new Message();
  const copyCode = () => {
    if (typeof props.codes === 'string') {
      ClipboardSetText(props.codes).then(() => {
        message.success('已复制到剪贴板');
      });
    } else if (Array.isArray(props.codes)) {
      ClipboardSetText(props.codes[0] as string).then(() => {
        message.success('已复制到剪贴板');
      });
    }
  };
  return (
    <div className={classNames('cy-answer__titlebar')}>
      <span>{props.language}</span>
      <Icon name="file-copy-line" size="16px" onClick={copyCode} />
    </div>
  );
};

export const Answer: FC<QAProps> = (props) => {
  const { content, avatar, className } = props;
  return (
    <div className={classNames('cy-qa cy-answer', className)}>
      <Avatar url={avatar} />
      <div className="cy-qa__content cy-answer__content">
        <ReactMarkdown
          children={content}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <div className={classNames('cy-answer__codes')}>
                  <CodeTitleBar codes={children} language={match?.[1] || ''} />
                  <SyntaxHighlighter
                    {...props}
                    customStyle={{
                      borderBottomLeftRadius: 3,
                      borderBottomRightRadius: 3,
                      margin: 0,
                      background: 'var(--pre-bg)',
                    }}
                    showLineNumbers
                    children={String(children).replace(/\n$/, '')}
                    style={atomOneDark}
                    language={match?.[1] || 'text'}
                    PreTag="div"
                  />
                </div>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}></ReactMarkdown>
      </div>
    </div>
  );
};
