import { createSignal, onMount, createContext } from 'solid-js';
import storage, { IStorageData } from '../../../utils/storage';
import InfoPanel from './components/InfoPanel';
import SignPanel from './components/SignPanel';

const App = () => {
  const [storageData, setStorageData] = createSignal<IStorageData>();

  onMount(async () => {
    const data = await storage.get();
    setStorageData(data);
  });

  return <>{storageData() ? <InfoPanel /> : <SignPanel />}</>;
};

export default App;
