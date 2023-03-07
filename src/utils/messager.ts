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
      async (request: MessageType, sender, sendResponse) => {
        console.log('messager request', request);
        const { code: reqCode, params } = request;
        for (const { code, callback } of this.handlerQuene) {
          if (code === reqCode) {
            const data = await callback(params);
            console.log('messager callback', data);
            sendResponse(data);
          }
        }
      }
    );
  }
  send<T = any>(message: MessageType) {
    return new Promise<T>(resolve => {
      chrome.runtime.sendMessage(
        process.env.EXTENSION_ID,
        message,
        response => {
          alert(JSON.stringify(response));
          resolve(response);
        }
      );
    });
  }
  on(handler: HandlerType) {
    this.handlerQuene.push(handler);
  }
}

export default Messager;
