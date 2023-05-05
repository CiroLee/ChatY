import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Popup from '@/components/Popup';
import Input from '@/components/Input';
import InputNumber from '@/components/InputNumber';
import Slider from '@/components/Slider';
import { useLayoutStore } from '@/store/layout';
import { useSettingStore } from '@/store/setting';
import { useThemeStore } from '@/store/theme';
import { themeChangeTabs, languageTabs } from '@/config/config';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';

import RadioTabs from '@/components/RadioTabs';
import Icon from '@/components/Icon';
import Switch from '@/components/Switch';

const cn = classNames.bind(style);

const temperatureMin = 0.1;
const temperatureMax = 2;
const temperatureStep = 0.1;
const replayLengthMin = 64;
const replayLengthMax = 4096;
const replayStep = 1;
const contextMin = 0;
const contextMax = 100;
const contextStep = 1;

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
    contextRange,
    setTemperature,
    setMaxReplayLength,
    setContextRange,
    setShowToken,
    setLanguage,
  } = useSettingStore((state) => state);
  const { show, onCancel } = props;
  const handleTempNumberBlur = (value: string) => {
    setTemperature(Number(value));
  };
  const handleReplayLengthNumberBlur = (value: string) => {
    setMaxReplayLength(Number(value));
  };
  const handleContextRangeBlur = (value: string) => {
    setContextRange(Number(value));
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
              <label className="block mr-4">{t('settings.tokenCount')}</label>
              <Switch checked={showToken} onChange={setShowToken} />
              <span className="ml-3">{showToken ? t('global.open') : t('global.close')}</span>
            </div>
          </div>
          <div className="mt-6">
            <label className="mb-1 block">{t('settings.temperature')}</label>
            <div className="flex items-center">
              <Slider
                className="flex-1 ml-[4px]"
                max={temperatureMax}
                min={temperatureMin}
                value={temperature}
                step={temperatureStep}
                onChange={setTemperature}
              />
              <InputNumber
                min={temperatureMin}
                max={temperatureMax}
                step={temperatureStep}
                value={temperature}
                onBlur={handleTempNumberBlur}
                className="inline-flex w-[60px] ml-3"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="mb-1 block">{t('settings.maxToken')}</label>
            <div className="flex items-center">
              <Slider
                className="flex-1 ml-[4px]"
                max={replayLengthMax}
                min={replayLengthMin}
                value={maxReplayLength}
                step={replayStep}
                offset={-12}
                onChange={setMaxReplayLength}
              />
              <InputNumber
                min={replayLengthMin}
                max={replayLengthMax}
                step={replayStep}
                value={maxReplayLength}
                size="large"
                onBlur={handleReplayLengthNumberBlur}
                className="inline-flex w-[60px] ml-3"
              />
            </div>
            <div className="mt-6">
              <label className="mb-1 block">{t('settings.contextRange')}</label>
              <div className="flex items-center">
                <Slider
                  className="flex-1 ml-[4px]"
                  min={contextMin}
                  max={contextMax}
                  value={contextRange}
                  step={contextStep}
                  onChange={setContextRange}
                  offset={-16}></Slider>
                <InputNumber
                  min={contextMin}
                  max={contextMax}
                  step={contextStep}
                  value={contextRange}
                  onBlur={handleContextRangeBlur}
                  className="inline-flex w-[60px] ml-3"
                  suffix="%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SettingModal;
