import { FC, useState } from 'react';
import Popup from '@/components/Popup';
import RadioTabs from '@/components/RadioTabs';
import { helpChangeTabs, hotKeysConfig } from '@/config/config';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import Whether from '@/components/Whether';
import { isMac } from '@/utils/utils';
import { BrowserOpenURL } from '@wails/runtime';
import ChatLogoPNG from '@/assets/icons/chaty-logo.png';
import Icon from '@/components/Icon';
const cn = classNames.bind(style);

interface HelpModalProps {
  show: boolean;
  onCancel: () => void;
}
const HotKeysTable = () => {
  return (
    <div className="px-1">
      {Object.values(hotKeysConfig(isMac()))
        .flat()
        .map((item) => (
          <div className="flex items-center py-2 odd:bg-[var(--content-bg)]" key={item.keys}>
            <p className="flex-1 pl-3">{item.keys}</p>
            <p className="flex-1 pr-3">{item.text}</p>
          </div>
        ))}
    </div>
  );
};
const About = () => {
  return (
    <div className={cn('help-modal__about')}>
      <img src={ChatLogoPNG} className={cn('help-modal__logo')}></img>
      <p className="text-center mt-[20px]">
        ChatY是基于wails开发的开源GPT桌面客户端。它也许是你电脑中最漂亮的ChatGPT助手。
      </p>
      <div className="mt-[20px] flex justify-center items-center relative">
        <div className={cn('site-btn')} onClick={() => BrowserOpenURL('https://github.com/CiroLee/ChatY')}>
          <Icon name="github-fill" size="24px" />
          <span className="ml-1">Github</span>
        </div>
        <div className="w-[1px] h-[14px] mx-2 bg-[var(--assist-color)]"></div>
        <div className={cn('site-btn', '')} onClick={() => BrowserOpenURL('https://github.com/CiroLee/ChatY/issues')}>
          <Icon name="questionnaire-line" size="22px" className="mt-[3px]" />
          <span className="ml-1">建议反馈</span>
        </div>
      </div>
    </div>
  );
};
const HelpModal: FC<HelpModalProps> = (props) => {
  const { show, onCancel } = props;
  const [activeKey, setActiveKey] = useState(helpChangeTabs[0].value);
  return (
    <Popup show={show} placement="center" maskClosable cancel={onCancel}>
      <div className={cn('help-modal')}>
        <div className="relative">
          <RadioTabs
            options={helpChangeTabs}
            className="m-auto relative w-[30%]"
            activeKey={activeKey}
            tabChange={setActiveKey}
          />
          <Icon
            name="close-line"
            size="20px"
            className="absolute top-[46%] right-0 translate-y-[-50%]"
            onClick={onCancel}
          />
        </div>
        <div className="mt-8">
          <Whether condition={activeKey === 'hotkeys'}>
            <HotKeysTable />
          </Whether>
          <Whether condition={activeKey === 'about'}>
            <About />
          </Whether>
        </div>
      </div>
    </Popup>
  );
};

export default HelpModal;
