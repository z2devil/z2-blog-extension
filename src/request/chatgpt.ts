import { createParser } from 'eventsource-parser';
import service from './common';

export enum DialogueOriginType {
  User = 'Uesr',
  ChatGPT = 'ChatGPT',
}

class ChatGPTError extends Error {
  statusCode?: number;
  statusText?: string;
  isFinal?: boolean;
  accountId?: string;
}

export interface ChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string;
    index: number;
  }[];
}

interface Options {
  openaiKey: string;
  model?: string;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
}

export const ask = async (
  text: string,
  onProgress: (params: {
    role: string;
    content: string;
    detail: ChatCompletion;
  }) => void,
  options: Options
) => {
  const {
    openaiKey,
    model = 'gpt-3.5-turbo',
    temperature = 0.8,
    top_p = 1.0,
    presence_penalty = 1.0,
  } = options;

  const res = await service.stream(
    `${process.env.OPENAI_API_URL}/v1/chat/completions`,
    {
      body: {
        model,
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
        temperature,
        top_p,
        presence_penalty,
        stream: true,
      },
    },
    {
      Authorization: `Bearer ${openaiKey}`,
    }
  );

  if (!res.ok) {
    let reason: string;

    try {
      reason = await res.text();
    } catch (err) {
      reason = res.statusText;
    }

    const msg = `ChatGPT error ${res.status}: ${reason}`;
    const error = new ChatGPTError(msg);
    error.statusCode = res.status;
    error.statusText = res.statusText;
    throw error;
  }

  const parser = createParser(event => {
    if (event.type === 'event') {
      const { data } = event;
      if (data === '[DONE]') return;
      try {
        const response: ChatCompletion = JSON.parse(data);
        console.log(response);

        if (response?.choices?.length) {
          const delta = response.choices[0].delta;
          delta.content &&
            onProgress({
              role: delta.role || DialogueOriginType.ChatGPT,
              content: delta.content,
              detail: response,
            });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  if (!res.body || !res.body.getReader) {
    throw new Error('No stream available');
  } else {
    for await (const chunk of streamAsyncIterable(res.body)) {
      const str = new TextDecoder().decode(chunk);
      parser.feed(str);
    }
  }
};

/**
 * 将可读流转换为异步迭代器
 */
async function* streamAsyncIterable<T>(stream: ReadableStream<T>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    // 释放资源
    reader.releaseLock();
  }
}
