export interface IUser {
  id: number;
  avatarPath: string;
  email: string;
  lv: number;
  nickname: string;
  signature: string;
}

export interface IStorageData {
  token: string;
  user: IUser;
}

const STROAGE_KEY = 'z2-token';
const storage = {
  get: () => {
    return new Promise<IStorageData | undefined>((resolve, reject) => {
      chrome.storage.sync.get(STROAGE_KEY, res => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(res[STROAGE_KEY]);
        }
      });
    });
  },
  set: (data: IStorageData) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [STROAGE_KEY]: data }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(null);
        }
      });
    });
  },
  remove: () => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove(STROAGE_KEY, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(null);
        }
      });
    });
  },
};

export default storage;
