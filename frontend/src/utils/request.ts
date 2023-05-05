import { HTTP_STATUS } from '@/config/constant.config';

type METHOD = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
interface RequestConfig {
  method?: METHOD;
  headers?: HeadersInit;
  body?: BodyInit;
}

export const request = async <T>(url: string, config: RequestConfig = { method: 'GET' }): Promise<T | undefined> => {
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      switch (response.status) {
        case HTTP_STATUS.BadRequest:
          throw new Error('error.badRequest');
        case HTTP_STATUS.Unauthorized:
          throw new Error('error.unAuthorization');
        case HTTP_STATUS.InternetServerError:
          throw new Error('error.internetServerError');
      }
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(error);
    throw new Error((error as any).message);
  }
};
