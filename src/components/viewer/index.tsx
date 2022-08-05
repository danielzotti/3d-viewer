import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  AmbientLight, Box3,
  Color,
  DirectionalLight, Object3D,
  PerspectiveCamera,
  PointLight, Renderer,
  Scene, Vector3,
  WebGLRenderer
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './index.scss';

interface ViewerProps {
  title: string;
  modelUrl: string;
}

export const Viewer = ({ title, modelUrl }: ViewerProps) => {

  function fitCameraToObject(camera: PerspectiveCamera, object: Object3D, offset: number = 1.5) {

    const boundingBox = new Box3();

    boundingBox.setFromObject(object);

    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());

    const startDistance = center.distanceTo(camera.position);
    // here we must check if the screen is horizontal or vertical, because camera.fov is
    // based on the vertical direction.
    const endDistance = camera.aspect > 1 ?
      ((size.y / 2) + offset) / Math.abs(Math.tan(camera.fov / 2)) :
      ((size.y / 2) + offset) / Math.abs(Math.tan(camera.fov / 2)) / camera.aspect;


    camera.position.set(
      camera.position.x * endDistance / startDistance,
      camera.position.y * endDistance / startDistance,
      camera.position.z * endDistance / startDistance,
    );
    camera.lookAt(center);
  }

  function init() {
    const scene = new Scene();
    scene.background = new Color(0xdddddd);

    const camera = new PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
    // camera.rotation.y = 45 / 180 * Math.PI;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1000;

    const renderer: Renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(parent.innerWidth, parent.innerHeight);
    setTimeout(() => {
      document.querySelector('#viewer')!.appendChild(renderer.domElement);
    }, 0);

    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const controls = new OrbitControls(camera, renderer.domElement);
    const renderEventListener = () => {
      renderer.render(scene, camera);
    };
    controls.addEventListener('change', renderEventListener);

    const ambientLight = new AmbientLight(0x404040, 3);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    const light = new PointLight(0xc4c4c4, .2);
    light.position.set(0, 300, 500);
    scene.add(light);
    const light2 = new PointLight(0xc4c4c4, .2);
    light2.position.set(500, 100, 0);
    scene.add(light2);
    const light3 = new PointLight(0xc4c4c4, .2);
    light3.position.set(0, 100, -500);
    scene.add(light3);
    const light4 = new PointLight(0xc4c4c4, .2);
    light4.position.set(-500, 300, 500);
    scene.add(light4);


    let loader = new GLTFLoader();
    loader.load(modelUrl, function(gltf) {
      const myModel = gltf.scene.children[0];
      // myModel.scale.set(10, 10, 10);
      /*myModel.scale.set(10, 10, 10);
      let box3 = new Box3().setFromObject(myModel);
      let measure = new Vector3();
      box3.getSize(measure);
      console.log(measure);
      myModel.position.y = -(window.innerHeight / 2) + measure.y;
      */
      fitCameraToObject(camera, myModel, 0);
      scene.add(gltf.scene);
      animate();
    });
  }

  init();

  return <div id="viewer">
    <h1>{ title }</h1>
  </div>;
};
