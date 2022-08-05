import type { Component } from 'solid-js';

import styles from './App.module.scss';
import { Viewer } from './components/viewer';
import { createSignal } from 'solid-js';

const getFormattedDate = (date?: Date) => new Intl.DateTimeFormat('it-IT', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}).format(date ? date : new Date());

const App: Component = () => {

  const [date, setDate] = createSignal<string>(getFormattedDate());

  setInterval(() => setDate(getFormattedDate()), 1000);

  return (
    <div class={ styles.App }>
      <Viewer title="Mr Meeseeks" modelUrl={ 'src/assets/3d-models/mr-meeseks/scene.gltf' }/>
      {/*<div>{ date() }</div>*/ }
    </div>
  );
};

export default App;
