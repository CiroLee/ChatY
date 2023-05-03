import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import pkg from '../../../../package.json';
const cn = classNames.bind(style);

interface HelpModalProps {
  show: boolean;
  onCancel: () => void;
}
const HotKeysTable = () => {
  const { t } = useTranslation();
  const _hotKeysConfig = hotKeysConfig(isMac(), t);
  return (
    <div className="px-1">
      {Object.values(_hotKeysConfig)
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
  const { t } = useTranslation();
  return (
    <div className={cn('help-modal__about')}>
      <img src={ChatLogoPNG} className={cn('help-modal__logo')}></img>
      <p className="text-center mt-[16px]">{pkg.version}</p>
      <p className="text-center mt-[18px]">{t('about.softwareDesc')}</p>
      <div className="mt-[20px] flex justify-center items-center relative">
        <div className={cn('site-btn')} onClick={() => BrowserOpenURL('https://github.com/CiroLee/ChatY')}>
          <Icon name="github-fill" size="24px" />
          <span className="ml-1">Github</span>
        </div>
        <div className="w-[1px] h-[14px] mx-2 bg-[var(--assist-color)]"></div>
        <div className={cn('site-btn', '')} onClick={() => BrowserOpenURL('https://github.com/CiroLee/ChatY/issues')}>
          <Icon name="questionnaire-line" size="22px" className="mt-[3px]" />
          <span className="ml-1">{t('global.issue')}</span>
        </div>
      </div>
    </div>
  );
};
const HelpModal: FC<HelpModalProps> = (props) => {
  const { show, onCancel } = props;
  const { t } = useTranslation();
  const _helpChangeTabs = helpChangeTabs(t);
  const [activeKey, setActiveKey] = useState(_helpChangeTabs[0].value);
  return (
    <Popup show={show} placement="center" maskClosable cancel={onCancel}>
      <div className={cn('help-modal')}>
        <div className="relative">
          <RadioTabs
            options={_helpChangeTabs}
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
