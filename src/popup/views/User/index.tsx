import { createSignal, onMount, createContext } from 'solid-js';
import storage, { IStorageData, IUser } from '../../../utils/storage';
import InfoPanel from './components/InfoPanel';
import SignPanel from './components/SignPanel';

const User = () => {
  const [storageData, setStorageData] = createSignal<IStorageData>();

  onMount(async () => {
    const data = await storage.get();
    setStorageData(data);
  });

  return (
    <>
      {storageData() ? (
        <InfoPanel info={storageData()?.user as IUser} />
      ) : (
        <SignPanel />
      )}
    </>
  );
};

export default User;
