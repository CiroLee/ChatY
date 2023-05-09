import Avatar from '@/components/Avatar';
import Icon from '@/components/Icon';
import Message from '@/components/Message';
import Radio from '@/components/Radio';
import Tooltip from '@/components/Tooltip';
import Whether from '@/components/Whether';
import { chatSessionDB } from '@/db';
import { useChatSessionStore } from '@/store/chat';
import { tokenNum } from '@/utils/chat';
import { copyToClipboard } from '@/utils/utils';
import { SaveFile } from '@wails/go/app/App';
import classNames from 'classnames';
import { omit } from 'fe-gear';
import 'katex/dist/katex.min.css';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import './style/index.scss';

interface QAProps {
  id: number;
  itemId: string;
  content: string;
  avatar?: string;
  className?: string;
  showToken?: boolean;
  selectMode?: boolean;
  onChange?: (checked: boolean) => void;
}

interface FunctionBarProps {
  id: number;
  itemId: string;
  selectedMode?: boolean;
  className?: string;
  content: string;
}

const message = new Message();

// 底部操作按钮
const FunctionBar: FC<FunctionBarProps> = (props) => {
  const { chatStatus, session, setSession } = useChatSessionStore((state) => state);
  const { t } = useTranslation();
  const copyHandler = () => {
    copyToClipboard(props.content).then(() => {
      message.success(t('message.copiedToClipboard'));
    });
  };
  const saveMDhandler = () => {
    SaveFile(props.content).catch((err) => {
      console.error(err);
    });
  };
  const deleteHandler = async () => {
    try {
      const list = session.list.filter((item) => item.id !== props.itemId);
      await chatSessionDB.update(props.id, omit({ ...session, list }, ['id']));
      setSession({ ...session, list });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className={classNames(
        'cy-qa__function-bar',
        `${chatStatus !== 'idle' && chatStatus !== 'done' ? 'invisible' : 'visible'}`,
        props.className,
      )}>
      <Tooltip text={t('dropdown.copy')} align="top" offsetX={1} offsetY={-12} open={!props.selectedMode}>
        <Icon name="file-copy-line" size="16px" onClick={copyHandler} />
      </Tooltip>
      <Tooltip text={t('tooltip.export')} align="top" offsetX={8} offsetY={-12} open={!props.selectedMode}>
        <Icon name="markdown-line" size="16px" className="ml-[8px]" onClick={saveMDhandler} />
      </Tooltip>
      <Tooltip text={t('dropdown.delete')} align="top" offsetX={8} offsetY={-12} open={!props.selectedMode}>
        <Icon name="delete-bin-line" size="16px" className="ml-[8px]" onClick={deleteHandler} />
      </Tooltip>
    </div>
  );
};

const QuestionInner: FC<QAProps> = (props) => {
  const { id, itemId, content, avatar, showToken, selectMode } = props;
  return (
    <>
      <div className="flex justify-end">
        <div className="flex flex-col justify-end">
          <Whether condition={!!showToken}>
            <div className="text-[var(--assist-color)] text-[12px]">token:{tokenNum(content)}</div>
          </Whether>
        </div>
        <Avatar url={avatar} />
      </div>
      <div className="cy-qa__content cy-question__content">{content}</div>
      <FunctionBar id={id} itemId={itemId} selectedMode={selectMode} content={content} />
    </>
  );
};
export const Question: FC<QAProps> = (props) => {
  const { className, selectMode, onChange, ...rest } = props;

  return (
    <div className={classNames('cy-qa cy-question', className)}>
      {selectMode ? (
        <Radio reverse onChange={onChange}>
          <div className="cy-qa__com mr-[12px] ml-auto">
            <QuestionInner selectMode {...rest} />
          </div>
        </Radio>
      ) : (
        <QuestionInner {...rest} />
      )}
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
      copyToClipboard(props.codes).then(() => {
        message.success(t('message.copiedToClipboard'));
      });
    } else if (Array.isArray(props.codes)) {
      copyToClipboard(props.codes[0] as string).then(() => {
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

const AnswerInner: FC<QAProps> = (props) => {
  const { id, itemId, content, avatar, showToken, selectMode } = props;
  return (
    <>
      <div className="flex">
        <Avatar url={avatar} />
        <div className="flex flex-col justify-end">
          <Whether condition={!!showToken}>
            <div className="text-[var(--assist-color)] text-[12px]">token:{tokenNum(content)}</div>
          </Whether>
        </div>
      </div>
      <div className="cy-qa__content cy-answer__content">
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
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
      <FunctionBar id={id} itemId={itemId} selectedMode={selectMode} content={content} />
    </>
  );
};
export const Answer: FC<QAProps> = (props) => {
  const { selectMode, className, onChange, ...rest } = props;
  return (
    <div className={classNames('cy-qa cy-answer', className)}>
      {selectMode ? (
        <Radio onChange={onChange}>
          <div className="cy-qa__com ml-[9px]">
            <AnswerInner selectMode {...rest} />
          </div>
        </Radio>
      ) : (
        <AnswerInner {...rest} />
      )}
    </div>
  );
};
