export const OPEN_AI_HOST = 'https://api.openai.com';
export const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.64';
export const OPEN_AI_MODELS = {
  GPT3: 'gpt-3.5-turbo',
};

export const MAX_LIMIT = 4096;

export const HTTP_STATUS = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  TooManyRequest: 429,
  InternetServerError: 500,
};
