import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Popup from '@/components/Popup';
import Whether from '@/components/Whether';
import RadioTabs from '@/components/RadioTabs';
import Message from '@/components/Message';
import Icon from '@/components/Icon';
import { useSettingStore } from '@/store/setting';
import { getPrevDate, isMac } from '@/utils/utils';
import { dateFormat } from 'fe-gear';
import { getBillSubscription, getBillUsage } from '@/api';
import { BrowserOpenURL } from '@wails/runtime';
import { helpChangeTabs, hotKeysConfig } from '@/config/config';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import ChatLogoPNG from '@/assets/icons/chaty-logo.png';
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
const About: FC = () => {
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

interface AccountProps {
  accountName?: string;
  accountConsumed?: number;
  accountRemainLimit?: number;
  accountLimit?: number;
  accountExpired?: string;
}
const Account: FC<AccountProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div className="w-[54%] m-auto overflow-hidden">
      <div className="flex items-center p-2 odd:bg-[var(--content-bg)] relative">
        <p className="w-[40%]">{t('account.name')}</p>
        <p className="flex-1">{props.accountName}</p>
      </div>
      <div className="flex items-center p-2 odd:bg-[var(--content-bg)] relative">
        <p className="w-[40%]">{t('account.consumed')}</p>
        <p className="flex-1">{props.accountConsumed}</p>
      </div>
      <div className="flex items-center p-2 odd:bg-[var(--content-bg)] relative">
        <p className="w-[40%]">{t('account.remainLimit')}</p>
        <p className="flex-1">{props.accountRemainLimit}</p>
      </div>
      <div className="flex items-center p-2 odd:bg-[var(--content-bg)] relative">
        <p className="w-[40%]">{t('account.accountLimit')}</p>
        <p className="flex-1">{props.accountLimit}</p>
      </div>
      <div className="flex items-center p-2 odd:bg-[var(--content-bg)] relative">
        <p className="w-[40%]">{t('account.expired')}</p>
        <p className="flex-1">{props.accountExpired}</p>
      </div>
    </div>
  );
};
const HelpModal: FC<HelpModalProps> = (props) => {
  const { show, onCancel } = props;
  const { t } = useTranslation();
  const _helpChangeTabs = helpChangeTabs(t);
  const [activeKey, setActiveKey] = useState(_helpChangeTabs[0].value);
  const { apiKey } = useSettingStore((state) => state);
  const [accountInfo, setAccountInfo] = useState<AccountProps>({});
  const message = new Message();

  const fetchAccountInfo = async () => {
    try {
      const date = new Date();
      const start = dateFormat(getPrevDate(date, 1), 'yyyy-mm-dd');
      const end = dateFormat(date, 'yyyy-mm-dd');
      const subscription = await getBillSubscription(apiKey);
      const usage = await getBillUsage({ start, end, apiKey });
      console.log(subscription, usage);
      const usd = usage?.total_usage ? Math.round(usage.total_usage) / 100 : 0;
      const totalSub = subscription?.hard_limit_usd ? Math.round(subscription.hard_limit_usd * 100) / 100 : 0;
      setAccountInfo({
        accountName: subscription?.account_name,
        accountConsumed: usd,
        accountRemainLimit: totalSub - usd,
        accountLimit: totalSub,
        accountExpired: subscription?.access_until
          ? dateFormat(subscription?.access_until * 1000, 'yyyy-mm-dd HH:MM:SS')
          : '',
      });
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || t('error.serverError'));
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, [apiKey]);
  return (
    <Popup show={show} placement="center" maskClosable cancel={onCancel}>
      <div className={cn('help-modal')}>
        <div className="relative">
          <RadioTabs
            options={_helpChangeTabs}
            className="m-auto relative w-[40%]"
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
          <Whether condition={activeKey === 'account'}>
            <Account {...accountInfo} />
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
