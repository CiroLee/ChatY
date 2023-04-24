import { FC, useState } from 'react';
import { useToggle } from 'react-use';
import { useChatSessionStore } from '@/store/chat';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames/bind';
import { getChatCompletionStream } from '@/api';
import { HotkeysEvent } from 'react-hotkeys-hook/dist/types';
import { isMac, nanoId, timestamp } from '@/utils/utils';
import style from './style/index.module.scss';
const cn = classNames.bind(style);
interface EditContainerProps {
  className?: string;
}
const EditContainer: FC<EditContainerProps> = (props) => {
  const { className } = props;
  const [max, toggleMax] = useToggle(false);
  const [height, setHeight] = useState(0);
  const [focus, setFocus] = useState(false);
  const { addQuestion, updateAnswerStream } = useChatSessionStore((state) => state);
  const ref = useHotkeys(
    ['enter', 'meta+j', 'ctrl+j'],
    (event: KeyboardEvent, handler: HotkeysEvent) => {
      event.preventDefault();
      if (event.key.toLowerCase() === 'enter') {
        const content = (event.target as HTMLDivElement).innerText.replace(/(\r|\r\n|↵)/g, '\n');
        addQuestion({
          id: nanoId(),
          role: 'user',
          content: `${content}`,
          createAt: timestamp(),
        });
        (event.target as HTMLDivElement).innerText = '';

        getChatCompletionStream(
          {
            messages: [
              {
                role: 'assistant',
                content,
              },
            ],
            maxTokens: 1024,
            temperature: 0.6,
          },
          (data) => {
            updateAnswerStream({
              id: data.id,
              role: 'assistant',
              content: data.content,
              createAt: timestamp(),
            });
          },
        );
      } else {
        toggleMaxInput(handler);
      }
    },
    { enableOnContentEditable: true },
  );

  const toggleMaxInput = (handler: HotkeysEvent) => {
    if (isMac() && handler?.keys?.[0] === 'j' && handler.meta) {
      toggleMaxHandler();
    } else if (!isMac() && handler?.keys?.[0] === 'j' && handler.ctrl) {
      toggleMaxHandler();
    }
  };

  const toggleMaxHandler = (max?: boolean) => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      setHeight(height);
      if (typeof max === 'boolean') {
        toggleMax(max);
      } else {
        toggleMax();
      }
    }
  };

  const onBlurHandler = () => {
    toggleMaxHandler(false);
    setFocus(false);
  };

  return (
    <div>
      <p className={cn('cy-editor-tip', { max })}>
        Enter 发送，Shift+Enter 换行，{isMac() ? '⌘' : 'Ctrl'} + J 半屏/原始输入
      </p>
      <div className={cn('cy-editor-wrapper', { focus })}>
        <div
          ref={ref as React.LegacyRef<HTMLDivElement>}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setFocus(true)}
          onBlur={onBlurHandler}
          style={{ '--height': `${height}px` } as React.CSSProperties}
          className={cn('cy-editor', className, `${max ? 'in-max' : 'out-max'}`)}></div>
      </div>
    </div>
  );
};

export default EditContainer;
