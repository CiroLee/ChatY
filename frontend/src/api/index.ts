import { fetchEventSource, type EventSourceMessage } from '@microsoft/fetch-event-source';
import { OPEN_AI_MODELS, OPEN_AI_HOST, HTTP_STATUS, userAgent } from '@/config/constant.config';
import { useChatSessionStore } from '@/store/chat';
import { useSettingStore } from '@/store/setting';
import { saveSessionDB } from '@/utils/chat';
import { request } from '@/utils/request';
import type { ChatMessage, ChatCompletionCbData, BillSubscriptionRes, BillUsageRes } from '@/types/openai';

const url = '/v1/chat/completions';
interface chatCompletionStreamReq {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

// gpt 对话流接口
export const getChatCompletionStream = async (
  req: chatCompletionStreamReq,
  callback: (data: ChatCompletionCbData, controller?: AbortController) => void,
) => {
  const { apiKey, temperature, maxReplayLength } = useSettingStore.getState();
  if (!apiKey) return;
  const abortController = new AbortController();
  const { description } = useChatSessionStore.getState().session;
  const { changeChatStatus } = useChatSessionStore.getState();
  changeChatStatus('fetching');

  await fetchEventSource(OPEN_AI_HOST + url, {
    method: 'POST',
    body: JSON.stringify({
      model: OPEN_AI_MODELS.GPT3,
      messages: [{ role: 'system', content: description }, ...req.messages],
      temperature: req.temperature ?? temperature,
      max_tokens: req.maxTokens ?? maxReplayLength,
      stream: true,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    signal: abortController.signal,
    async onopen(res) {
      // connect good
      if (res.ok) return;
      changeChatStatus('idle');
      if (res.status === HTTP_STATUS.Unauthorized) {
        throw new Error('error.unAuthorization');
      } else if (res.status === HTTP_STATUS.TooManyRequest) {
        throw new Error('error.tooManyRequest');
      }
      // ...others
    },
    async onmessage(msg: EventSourceMessage) {
      if (msg.data === '[DONE]') return;
      const jsonData = JSON.parse(msg.data);
      if (!jsonData.choices[0].delta.content) return;
      const cbData = {
        id: jsonData.id,
        created: jsonData.created,
        content: jsonData.choices[0].delta.content,
      };
      changeChatStatus('outputting');
      callback(cbData, abortController);
    },
    onclose() {
      // save to db and sync to store
      saveSessionDB();
    },
    onerror(err) {
      changeChatStatus('idle');
      throw new Error(err);
    },
  });
};

const headers = {
  'User-Agent': userAgent,
  Accept: '*/*',
  Host: 'api.openai.com',
  Connection: 'keep-alive',
};

// 查询余额相关
export const getBillSubscription = (apiKey: string) => {
  return request<BillSubscriptionRes>('https://api.openai.com/dashboard/billing/subscription', {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${apiKey}`,
    },
  });
};

// 查询用量
export const getBillUsage = ({ start, end, apiKey }: { start: string; end: string; apiKey: string }) => {
  return request<BillUsageRes>(`https://api.openai.com/dashboard/billing/usage?start_date=${start}&end_date=${end}`, {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${apiKey}`,
    },
  });
};
