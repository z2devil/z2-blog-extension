export interface IUser {
  id: number;
  avatarPath: string;
  email: string;
  lv: number;
  nickname: string;
  signature: string;
}

export interface IStorageData {
  token?: string;
  user?: IUser;
  openaiKey?: string;
}

const STROAGE_KEY = process.env.APP_NAME;

const getStorageData = async () => {
  return new Promise<IStorageData>(async (resolve, reject) => {
    if (STROAGE_KEY === undefined)
      return reject(new Error('STROAGE_KEY is undefined'));

    const storage = await chrome.storage.sync.get(STROAGE_KEY);

    if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);

    const data = storage[STROAGE_KEY] as IStorageData | undefined;

    if (data === undefined) return resolve({});

    resolve(data);
  });
};

const setStorageData = async (data: IStorageData) => {
  return new Promise(async (resolve, reject) => {
    if (STROAGE_KEY === undefined)
      return reject(new Error('STROAGE_KEY is undefined'));

    chrome.storage.sync.set({ [STROAGE_KEY]: data }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(null);
      }
    });
  });
};

const removeStorageData = async () => {
  return new Promise(async (resolve, reject) => {
    if (STROAGE_KEY === undefined)
      return reject(new Error('STROAGE_KEY is undefined'));

    chrome.storage.sync.remove(STROAGE_KEY, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(null);
      }
    });
  });
};

const storage = {
  get: <Key extends keyof IStorageData>(key: Key) => {
    return new Promise<IStorageData[Key]>(async (resolve, reject) => {
      const storageData = await getStorageData();
      resolve(storageData[key]);
    });
  },
  set: <Key extends keyof IStorageData>(key: Key, data: IStorageData[Key]) => {
    return new Promise(async (resolve, reject) => {
      try {
        const storageData = await getStorageData();
        if (storageData === undefined) {
          const newData: IStorageData = {};
          newData[key] = data;
          await setStorageData(newData);
        } else {
          storageData[key] = data;
          await setStorageData(storageData);
        }
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  },
  remove: () => {
    removeStorageData();
  },
};

export default storage;
