import { FC, useState } from 'react';
import { useToggle } from 'react-use';
import Icon from '@/components/Icon';
import EditContainer from './components/EditContainer';
import SettingModal from './components/SettingModal';
import RoleModal from './components/RoleModal';
import { Question, Answer } from './components/QA';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import { useLayoutStore } from '@/store/layout';
const cn = classNames.bind(style);
const Content: FC = () => {
  const { titleBarHeight, collapse } = useLayoutStore((state) => state);
  const [showRoleModal, toggleRoleModal] = useToggle(false);
  const [showSettingModal, toggleSettingModal] = useToggle(false);
  const [roleAction, setRoleAction] = useState<'create' | 'edit'>('create');
  const [roleModalTitle, setRoleModalTitle] = useState('');
  const createRole = () => {
    toggleRoleModal(true);
    setRoleModalTitle('创建角色');
    setRoleAction('create');
  };

  const contentDemo = `Here is some JavaScript code:
  ~eqw~
  ~~~typescript
  console.log('Hello, world!');
  ~~~

  > adsadas        

  **bold**

  ~~~
  fmt.Println()
  ~~~
  `;
  return (
    <div className={cn('content')} style={{ '--header-height': `${titleBarHeight}px` } as React.CSSProperties}>
      <div className={cn('session-header')}>
        <h3 className="text-[18px]">chat1</h3>
        <div className="flex items-center h-full">
          <Icon name="add-line" size="18px" onClick={createRole} />
          <Icon name="settings-3-line" size="18px" className="ml-[12px]" onClick={() => toggleSettingModal(true)} />
        </div>
      </div>
      <div className={cn('content-list')}>
        <Question className="mr-[16px]" avatar="https://loremflickr.com/320/240/cat" content="你是谁？" />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Question className="mr-[16px]" avatar="https://loremflickr.com/320/240/cat" content="你是谁？" />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Question className="mr-[16px]" avatar="https://loremflickr.com/320/240/cat" content="你是谁？" />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Question className="mr-[16px]" avatar="https://loremflickr.com/320/240/cat" content="你是谁？" />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Question className="mr-[16px]" avatar="https://loremflickr.com/320/240/cat" content="你是谁？" />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
        <Answer className="ml-[16px]" avatar="https://loremflickr.com/320/240/cat" content={contentDemo} />
      </div>
      <div className={cn('editor-input', { collapse })}>
        <EditContainer />
      </div>
      <RoleModal
        title={roleModalTitle}
        action={roleAction}
        show={showRoleModal}
        onCancel={() => toggleRoleModal(false)}
      />
      <SettingModal show={showSettingModal} onCancel={() => toggleSettingModal(false)} />
    </div>
  );
};

export default Content;
