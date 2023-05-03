import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/Icon';
import Avatar from '@/components/Avatar';
import Message from '@/components/Message';
import classNames from 'classnames';
import { useChatSessionStore } from '@/store/chat';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tokenNum } from '@/utils/chat';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ClipboardSetText } from '@wails/runtime';
import { SaveFile } from '@wails/go/app/App';
import './style/index.scss';
import Whether from '@/components/Whether';

interface QAProps {
  content: string;
  avatar?: string;
  className?: string;
  showToken?: boolean;
}

interface FunctionBarProps {
  className?: string;
  content: string;
}

const message = new Message();

const FunctionBar: FC<FunctionBarProps> = (props) => {
  const { chatStatus } = useChatSessionStore((state) => state);
  const { t } = useTranslation();
  const copyHandler = () => {
    ClipboardSetText(props.content).then(() => {
      message.success(t('message.copiedToClipboard'));
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
  const { content, avatar, showToken, className } = props;
  return (
    <div className={classNames('cy-qa cy-question', className)}>
      <div className="flex">
        <div className="flex flex-col justify-end mr-3">
          <Whether condition={!!showToken}>
            <div className="text-[var(--assist-color)] text-[12px]">token:{tokenNum(content)}</div>
          </Whether>
        </div>
        <Avatar url={avatar} />
      </div>
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
  const { t } = useTranslation();
  const copyCode = () => {
    if (typeof props.codes === 'string') {
      ClipboardSetText(props.codes).then(() => {
        message.success(t('message.copiedToClipboard'));
      });
    } else if (Array.isArray(props.codes)) {
      ClipboardSetText(props.codes[0] as string).then(() => {
        message.success(t('message.copiedToClipboard'));
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
  const { content, avatar, showToken, className } = props;
  return (
    <div className={classNames('cy-qa cy-answer', className)}>
      <div className="flex">
        <Avatar url={avatar} />
        <div className="flex flex-col justify-end ml-3">
          <Whether condition={!!showToken}>
            <div className="text-[var(--assist-color)] text-[12px]">token:{tokenNum(content)}</div>
          </Whether>
        </div>
      </div>
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
