import Icon from '@/components/Icon';
import Input from '@/components/Input';
import InputNumber from '@/components/InputNumber';
import Popup from '@/components/Popup';
import RadioTabs from '@/components/RadioTabs';
import Slider from '@/components/Slider';
import Switch from '@/components/Switch';
import { languageTabs, themeChangeTabs } from '@/config/config';
import { SETTINGS } from '@/config/constant.config';
import { useLayoutStore } from '@/store/layout';
import { useSettingStore } from '@/store/setting';
import { useThemeStore } from '@/store/theme';
import classNames from 'classnames/bind';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style/index.module.scss';

const cn = classNames.bind(style);

// const temperatureMin = 0.1;
// const temperatureMax = 2;
// const temperatureStep = 0.1;
// const replayLengthMin = 64;
// const replayLengthMax = 4096;
// const replayStep = 1;

interface SettingModalProps {
  show: boolean;
  onCancel: () => void;
}
const SettingModal: FC<SettingModalProps> = (props) => {
  const { titleBarHeight } = useLayoutStore((state) => state);
  const { theme, setTheme } = useThemeStore((state) => state);
  const { t } = useTranslation();
  const {
    apiKey,
    setApiKey,
    temperature,
    language,
    maxReplayLength,
    showToken,
    continuousChat,
    setTemperature,
    setMaxReplayLength,
    setShowToken,
    setLanguage,
    setContinuousChat,
  } = useSettingStore((state) => state);
  const { show, onCancel } = props;
  const handleTempNumberBlur = (value: string) => {
    setTemperature(Number(value));
  };
  const handleReplayLengthNumberBlur = (value: string) => {
    setMaxReplayLength(Number(value));
  };
  return (
    <Popup show={show} cancel={onCancel} maskClosable placement="right">
      <div className={cn('setting-modal')} style={{ '--header-height': `${titleBarHeight}px` } as React.CSSProperties}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold">{t('settings.title')}</h3>
          <Icon name="close-line" size="18px" onClick={onCancel} />
        </div>
        <div className="mt-6">
          <label className="mb-2 block">{t('settings.open-ai-key')}</label>
          <Input
            type="password"
            placeholder={t('settings.placeholderInputKey') || ''}
            value={apiKey}
            onBlur={setApiKey}
          />
          <div className="mt-6">
            <label className="mb-2 block">{t('settings.theme')}</label>
            <RadioTabs options={themeChangeTabs} activeKey={theme} className="w-[60%]" tabChange={setTheme} />
          </div>
          <div className="mt-6">
            <label className="mb-2 block">{t('global.language')}</label>
            <RadioTabs options={languageTabs} activeKey={language} className="w-[60%]" tabChange={setLanguage} />
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <label className={cn('block mr-4', `${language === 'zh-Hans' ? 'w-[72px]' : 'w-[100px'}`)}>
                {t('settings.continuousChat')}
              </label>
              <Switch checked={continuousChat} onChange={setContinuousChat} />
              <span className="ml-3">{continuousChat ? t('global.open') : t('global.close')}</span>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <label className={cn('block mr-4', `${language === 'zh-Hans' ? 'w-[72px]' : 'w-[104px]'}`)}>
                {t('settings.tokenCount')}
              </label>
              <Switch checked={showToken} onChange={setShowToken} />
              <span className="ml-3">{showToken ? t('global.open') : t('global.close')}</span>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <label className="mb-1 block">{t('settings.temperature')}</label>
              <span className="text-xs ml-1 text-[var(--assist-color)] mb-[0.1em]">
                ({t('settings.temperatureDesc')})
              </span>
            </div>
            <div className="flex items-center">
              <Slider
                className="flex-1 ml-[4px]"
                max={SETTINGS.temperature.max}
                min={SETTINGS.temperature.min}
                value={temperature}
                step={SETTINGS.temperature.step}
                onChange={setTemperature}
              />
              <InputNumber
                max={SETTINGS.temperature.max}
                min={SETTINGS.temperature.min}
                step={SETTINGS.temperature.step}
                value={temperature}
                onBlur={handleTempNumberBlur}
                className="inline-flex w-[60px] ml-3"
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <label className="mb-1 block">{t('settings.maxToken')}</label>
              <span className="text-xs ml-1 text-[var(--assist-color)] mb-[0.1em]">({t('settings.maxTokenDesc')})</span>
            </div>
            <div className="flex items-center">
              <Slider
                className="flex-1 ml-[4px]"
                max={SETTINGS.replayLength.max}
                min={SETTINGS.replayLength.min}
                value={maxReplayLength}
                step={SETTINGS.replayLength.step}
                offset={-12}
                onChange={setMaxReplayLength}
              />
              <InputNumber
                max={SETTINGS.replayLength.max}
                min={SETTINGS.replayLength.min}
                step={SETTINGS.replayLength.step}
                value={maxReplayLength}
                onBlur={handleReplayLengthNumberBlur}
                className="inline-flex w-[60px] ml-3"
              />
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SettingModal;
