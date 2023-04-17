import { FC, useState } from 'react';
import Popup from '@/components/Popup';
import Input from '@/components/Input';
import Slider from '@/components/Slider';
import { useLayoutStore } from '@/store/layout';
import { themeChangeTabs } from '@/config/config';
import classNames from 'classnames/bind';
import style from './style/index.module.scss';
import { useThemeStore } from '@/store/theme';
import RadioTabs from '@/components/RadioTabs';
import { useSettingStore } from '@/store/setting';
const cn = classNames.bind(style);

interface SettingModalProps {
  show: boolean;
  onCancel: () => void;
}
const SettingModal: FC<SettingModalProps> = (props) => {
  const { titleBarHeight } = useLayoutStore((state) => state);
  const { theme, setTheme } = useThemeStore((state) => state);
  const { temperature, maxReplayLength, setTemperature, setMaxReplayLength } = useSettingStore((state) => state);
  const { show, onCancel } = props;
  return (
    <Popup show={show} cancel={onCancel} maskClosable placement="right">
      <div className={cn('setting-modal')} style={{ '--header-height': `${titleBarHeight}px` } as React.CSSProperties}>
        <h3 className="font-bold">设置</h3>
        <div className="mt-6">
          <div>
            <label className="mb-2 block">Open AI Key</label>
            <Input type="password" placeholder="请输入Open AI Key" value="" />
          </div>
          <div className="mt-4">
            <label className="mb-2 block">主题</label>
            <RadioTabs options={themeChangeTabs} activeKey={theme} className="w-[60%]" tabChange={setTheme} />
          </div>
          <div className="mt-4">
            <label className="mb-2 block">发散度</label>
            <div className="flex items-center">
              <Slider
                className="flex-1 ml-[4px]"
                max={2}
                min={0.1}
                value={temperature}
                step={0.1}
                onChange={setTemperature}
              />
              <Input value={temperature} className="inline-flex w-[60px] ml-3" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block">最大回文长度</label>
            <div className="flex items-center">
              <Slider
                className="flex-1 ml-[4px]"
                max={4096}
                min={100}
                value={maxReplayLength}
                step={1}
                offset={-8}
                onChange={setMaxReplayLength}
              />
              <Input value={maxReplayLength} className="inline-flex w-[60px] ml-3" />
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SettingModal;
