import { FC, useEffect, useState } from 'react';
import { useToggle } from 'react-use';
import Message from '@/components/Message';
import Popup from '@/components/Popup';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import { chatSessionDB } from '@/db';
import classNames from 'classnames/bind';
import { avatars } from '@/config/config';
import { SETTINGS } from '@/config/constant.config';
import style from './style/index.module.scss';
import { nanoId, timestamp } from '@/utils/utils';
import { useChatSessionStore } from '@/store/chat';
import { useSettingStore } from '@/store/setting';
import { useModalStore } from '@/store/modal';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/Icon';
import Slider from '@/components/Slider';
import InputNumber from '@/components/InputNumber';
import Switch from '@/components/Switch';
import { isAnyTrue } from 'fe-gear';
import Radio, { RadioGroup } from '@/components/Radio';
import RadioTabs from '@/components/RadioTabs';
const cn = classNames.bind(style);

interface RoleModalProps {
  action: 'create' | 'edit';
  show: boolean;
  name?: string;
  temperature?: number;
  maxToken?: number;
  continuousChat?: boolean;
  description?: string;
  avatarName?: string;
  onCancel: () => void;
}
const defaultAvatarKey = avatars[0][0];
const RoleModal: FC<RoleModalProps> = (props) => {
  const {
    show,
    onCancel,
    action,
    name = '',
    avatarName,
    description = '',
    temperature,
    maxToken,
    continuousChat,
  } = props;
  const [roleName, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [chatTemperature, setChatTemperature] = useState<undefined | number>();
  const [chatMaxReplayLength, setChatMaxReplayLength] = useState<undefined | number>();
  const [chatContinuousChat, setChatContinuousChat] = useState<boolean | undefined>();
  const [useAdvanced, toggleUseAdvanced] = useToggle(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const { chatList, setChatList } = useChatSessionStore((state) => state);
  const { language } = useSettingStore((state) => state);
  const { roleModalInfo } = useModalStore((state) => state);
  const message = new Message();
  const { t } = useTranslation();
  const handleChooseAvatar = (name: string) => {
    setSelectedAvatar(name);
  };
  const createRole = async () => {
    try {
      const chatItem = {
        chatId: nanoId(),
        name: roleName,
        description: desc,
        avatarName: selectedAvatar,
        list: [],
        createAt: timestamp(),
        temperature: chatTemperature,
        maxToken: chatMaxReplayLength,
        continuousChat: chatContinuousChat,
      };

      const id = await chatSessionDB.create(chatItem);
      setChatList([...chatList, { ...chatItem, id: id as number }]);

      message.success(t('message.createSucceed'));
    } catch (error) {
      console.error(error);
    }
  };

  const editRole = async () => {
    try {
      const updatedData = {
        name: roleName,
        description: desc,
        avatarName: selectedAvatar,
        temperature: useAdvanced ? chatTemperature : undefined,
        maxToken: useAdvanced ? chatMaxReplayLength : undefined,
        continuousChat: useAdvanced ? chatContinuousChat : undefined,
      };
      const newChatList = chatList.map((item) => {
        if (item.id === roleModalInfo.id) {
          return { ...item, ...updatedData };
        }
        return item;
      });
      await chatSessionDB.update(roleModalInfo.id, updatedData);
      setChatList(newChatList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnCancel = () => {
    onCancel();
  };
  const handleOk = async () => {
    if (!roleName) {
      message.warn(t('message.warnOfEmptyName'));
      return;
    }
    if (action === 'create') {
      createRole();
    } else if (action === 'edit') {
      editRole();
    }
    handleOnCancel();
  };
  useEffect(() => {
    setName(name);
    setDesc(description);
    setChatTemperature(temperature);
    setChatMaxReplayLength(maxToken);
    setChatContinuousChat(continuousChat);
    setSelectedAvatar(avatarName || defaultAvatarKey);
    toggleUseAdvanced(isAnyTrue([continuousChat, temperature, maxToken], (i) => i !== undefined));
  }, [show]);

  return (
    <Popup show={show} placement="center" maskClosable={true} cancel={handleOnCancel}>
      <div className={cn('role-modal')}>
        <h3>{action === 'create' ? t('modal.createRole') : t('modal.modifyRole')}</h3>
        <div className="mt-6">
          <div className="flex items-center">
            <label className={cn({ 'w-[70px]': language === 'en' })}>{t('global.avatar')}</label>
            <div className="ml-3">
              {avatars.map((arr) => (
                <Avatar
                  key={arr[0]}
                  url={arr[1]}
                  checked={arr[0] === selectedAvatar}
                  size="small"
                  onClick={() => handleChooseAvatar(arr[0])}
                  className="mr-2 cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center">
            <label className={cn({ 'w-[70px]': language === 'en' })}>{t('global.name')}</label>
            <Input
              className="flex-1 ml-3"
              maxLength={20}
              clearable
              placeholder={t('modal.placeholderInputName') || ''}
              showCount
              value={roleName}
              onChange={setName}
            />
          </div>
          <div className="flex mt-4">
            <label className={cn('mt-1', { ' w-[70px]': language === 'en' })}>{t('global.description')}</label>
            <Textarea
              className="flex-1 ml-3"
              maxLength={2000}
              clearable
              showCount
              placeholder={t('modal.placeholderInputDescription') || ''}
              value={desc}
              onChange={setDesc}
            />
          </div>
          <div>
            <div className={cn('role-modal__advanced--divide')}>
              <div className={cn('role-modal__advanced--divide-box')} onClick={toggleUseAdvanced}>
                {/* <Icon
                  name="arrow-right-s-fill"
                  size="16px"
                  className={cn('role-modal__advanced--icon', { 'role-modal__advanced--show': useAdvanced })}
                /> */}
                <Radio type="checkbox" className="mt-1" checked={useAdvanced} />
                <span>{t('modal.advanced')}</span>
              </div>
            </div>
            <div
              className="overflow-hidden transition-all transition-duration-300"
              style={{ maxHeight: useAdvanced ? 240 : 0 }}>
              <p className="mt-2 ml-2 text-[13px] text-[var(--assist-color)]">{t('modal.advancedTip')}</p>
              <div className="mt-3 ml-2">
                <div className="flex items-center">
                  <label className="mb-1 block">{t('settings.temperature')}</label>
                  <span className="text-xs ml-1 text-[var(--assist-color)] mb-[0.1em]">
                    ({t('settings.temperatureDesc')})
                  </span>
                </div>
                <div className="flex items-center">
                  <Slider
                    className=" ml-[4px] w-[380px]"
                    max={SETTINGS.temperature.max}
                    min={SETTINGS.temperature.min}
                    value={chatTemperature}
                    offset={0}
                    step={SETTINGS.temperature.step}
                    onChange={setChatTemperature}
                  />
                  <InputNumber
                    className="inline-flex w-[60px] ml-3"
                    max={SETTINGS.temperature.max}
                    min={SETTINGS.temperature.min}
                    step={SETTINGS.temperature.step}
                    value={chatTemperature}
                    size="small"
                    onBlur={(val: string) => setChatTemperature(Number(val))}
                  />
                </div>
              </div>
              <div className="mt-3 ml-2">
                <div className="flex items-center">
                  <label className="mb-1 block">{t('settings.maxToken')}</label>
                  <span className="text-xs ml-1 text-[var(--assist-color)] mb-[0.1em]">
                    ({t('settings.maxTokenDesc')})
                  </span>
                </div>
                <div className="flex items-center">
                  <Slider
                    className="ml-[4px] w-[380px]"
                    max={SETTINGS.replayLength.max}
                    min={SETTINGS.replayLength.min}
                    value={chatMaxReplayLength}
                    step={SETTINGS.replayLength.step}
                    offset={-10}
                    onChange={setChatMaxReplayLength}
                  />
                  <InputNumber
                    className="inline-flex w-[60px] ml-3"
                    max={SETTINGS.replayLength.max}
                    min={SETTINGS.replayLength.min}
                    step={SETTINGS.replayLength.step}
                    value={chatMaxReplayLength}
                    size="small"
                    onBlur={(val: string) => setChatMaxReplayLength(Number(val))}
                  />
                </div>
              </div>
              <div className="mt-3 ml-2">
                <div className="flex items-center">
                  <label className={cn('block mr-4', `${language === 'zh-Hans' ? 'w-[72px]' : 'w-[100px'}`)}>
                    {t('settings.continuousChat')}
                  </label>
                  <RadioGroup
                    defaultKey={Number(chatContinuousChat)}
                    options={[
                      {
                        label: t('global.open'),
                        value: 1,
                      },
                      {
                        label: t('global.close'),
                        value: 0,
                      },
                    ]}
                    onChange={(val) => setChatContinuousChat(!!val.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-[40px]">
            <Button onClick={handleOnCancel}>{t('global.cancel')}</Button>
            <Button type="primary" className="ml-2" onClick={handleOk}>
              {t('global.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default RoleModal;
