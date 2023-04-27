import { FC } from 'react';
import Icon from '@/components/Icon';
import Avatar from '@/components/Avatar';
import Message from '@/components/Message';
import classNames from 'classnames';
import { useChatSessionStore } from '@/store/chat';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ClipboardSetText } from '@wails/runtime';
import { SaveFile } from '@wails/go/app/App';
import './style/index.scss';

interface QAProps {
  content: string;
  avatar?: string;
  className?: string;
}

interface FunctionBarProps {
  className?: string;
  content: string;
}

const message = new Message();
const FunctionBar: FC<FunctionBarProps> = (props) => {
  const { chatStatus } = useChatSessionStore((state) => state);
  const copyHandler = () => {
    ClipboardSetText(props.content).then(() => {
      message.success('已复制到剪贴板');
    });
  };
  const saveMDhandler = () => {
    SaveFile(props.content).catch((err) => {
      console.error(err);
    });
  };
  return (
    <div
      className={classNames(
        'cy-qa__function-bar',
        `${chatStatus !== 'idle' && chatStatus !== 'done' ? 'invisible' : 'visible'}`,
        props.className,
      )}>
      <Icon name="file-copy-line" size="16px" onClick={copyHandler} />
      <Icon name="markdown-line" size="16px" className="ml-2" onClick={saveMDhandler} />
    </div>
  );
};
export const Question: FC<QAProps> = (props) => {
  const { content, avatar, className } = props;
  return (
    <div className={classNames('cy-qa cy-question', className)}>
      <Avatar url={avatar} />
      <div className="cy-qa__content cy-question__content">{content}</div>
      <FunctionBar content={content} />
    </div>
  );
};

interface CodeTitleBarProps {
  codes: React.ReactNode & React.ReactNode[];
  language?: string;
}
const CodeTitleBar: FC<CodeTitleBarProps> = (props) => {
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
      <FunctionBar content={content} />
    </div>
  );
};
