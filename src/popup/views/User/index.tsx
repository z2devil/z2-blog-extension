import { createSignal, onMount, createContext, Switch, Match } from 'solid-js';
import storage, { IStorageData, IUser } from '../../../utils/storage';
import InfoPanel from './components/InfoPanel';
import SignPanel from './components/SignPanel';

const User = () => {
  const [userData, setUserData] = createSignal<IUser>();

  onMount(async () => {
    const data = await storage.get('user');
    setUserData(data);
  });

  return (
    <Switch>
      <Match when={userData()}>
        <InfoPanel info={userData() as IUser} />
      </Match>
      <Match when={!userData()}>
        <SignPanel />
      </Match>
    </Switch>
  );
};

export default User;
