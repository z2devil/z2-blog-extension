export type MessageType = { code: string; params?: any };
export type HandlerType = {
  code: string;
  callback: (...args: any) => Promise<any>;
};

class Messager {
  handlerQuene: HandlerType[];
  constructor() {
    this.handlerQuene = [];
    chrome.runtime.onMessage.addListener(
      (request: MessageType, sender, sendResponse) => {
        const { code: reqCode, params } = request;
        for (const { code, callback } of this.handlerQuene) {
          if (code === reqCode) {
            callback(params)
              .then(data => {
                sendResponse(data);
              })
              .catch(err => {
                sendResponse(err);
              });
          }
        }
        return true;
      }
    );
  }
  send<T = any>(message: MessageType) {
    return new Promise<T>(resolve => {
      chrome.runtime.sendMessage(
        process.env.EXTENSION_ID,
        message,
        response => {
          resolve(response);
        }
      );
    });
  }
  on(handlers: HandlerType | HandlerType[]) {
    this.handlerQuene.push(
      ...(Array.isArray(handlers) ? handlers : [handlers])
    );
  }
}

export default Messager;
