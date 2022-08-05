import type { Component } from 'solid-js';
import styles from './App.module.scss';
import { Viewer } from './components/viewer';

const App: Component = () => {
  return (
    <div class={ styles.App }>
      <Viewer title="Mr Meeseeks" modelUrl={ 'src/assets/3d-models/mr-meeseks/scene.gltf' }/>
    </div>
  );
};

export default App;
