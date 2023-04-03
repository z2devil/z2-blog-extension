export type MessageType = { code: string; params?: any };
export type HandlerType = {
  code: string;
  callback: (...args: any) => Promise<any>;
};

export interface MessagerResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

interface MessageerResponseWithHandle<
  T = any,
  R extends MessagerResponse<T> = MessagerResponse<T>
> extends Promise<R> {
  handle: () => Promise<T>;
}

class Messager {
  handlerQuene: HandlerType[];
  constructor() {
    this.handlerQuene = [];
    chrome.runtime.onMessage.addListener(
      (message: MessageType, sender, sendResponse) => {
        const { code: reqCode, params } = message;
        for (const { code, callback } of this.handlerQuene) {
          if (code === reqCode) {
            callback(params)
              .then(data => {
                sendResponse({ data, status: 0, statusText: 'OK' });
              })
              .catch(err => {
                sendResponse({
                  data: err,
                  status: -1,
                  statusText: 'Error',
                });
              });
          }
        }
        return true;
      }
    );
  }
  static send<T = any>(message: MessageType) {
    const result = new Promise<MessagerResponse<T>>((resolve, reject) => {
      chrome.runtime.sendMessage(
        process.env.EXTENSION_ID,
        message,
        response => {
          if (response === undefined) {
            reject(new Error('Response Error'));
          } else {
            resolve(response as R);
          }
        }
      );
    });
    // 统一处理返回值
    (result as MessageerResponseWithHandle<T>).handle = async () => {
      const { data, status, statusText } = await result;
      if (status === 0) {
        return data;
      } else {
        throw new Error(statusText);
      }
    };
    return result as MessageerResponseWithHandle<T>;
  }
  on(handlers: HandlerType | HandlerType[]) {
    this.handlerQuene.push(
      ...(Array.isArray(handlers) ? handlers : [handlers])
    );
  }
}

export default Messager;
