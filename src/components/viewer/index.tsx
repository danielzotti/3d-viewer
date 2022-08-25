import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  AmbientLight, Box3,
  Color, DirectionalLight, DoubleSide, Event, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  Object3D,
  PerspectiveCamera, PlaneGeometry,
  PointLight, Renderer,
  Scene, Texture, TextureLoader, Vector3,
  WebGLRenderer
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './index.scss';
import { createSignal } from 'solid-js';
import { Projector } from 'three/examples/jsm/renderers/Projector';

interface ViewerProps {
  title: string;
  modelUrl: string;
}

export const Viewer = ({ title, modelUrl }: ViewerProps) => {

    const [scene] = createSignal<Scene>(new Scene());
    const [camera] = createSignal<PerspectiveCamera>(new PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000));
    const [renderer] = createSignal<Renderer>(new WebGLRenderer({ antialias: true }));
    const [controls] = createSignal<OrbitControls>(new OrbitControls(camera(), renderer().domElement));
    const [model, setModel] = createSignal<Object3D>();

    const projector = new Projector();

    function animate() {
      renderer().render(scene(), camera());
      requestAnimationFrame(animate);
      // console.log(camera().position)
    }

    function onDocumentMouseDown(e: Event) {
      e.preventDefault();

      const vector = new Vector3(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );

      const { x, y } = vector;
      console.log({ x, y });
    }

    //
    // function onDocumentMouseUp(e: Event) {
    //   console.log({ mouseUp: e });
    // }
    //
    // function onDocumentMouseMove(e: Event) {
    //   console.log({ mouseMove: e });
    // }

    async function init() {
      // SCENE
      scene().background = new Color(0xdddddd);

      // PLANE
      const groundMaterial = new TextureLoader().load('/src/assets/textures/ground-material.png');
      const geometry = new PlaneGeometry(3, 3);
      geometry.rotateX(Math.PI / 2);
      geometry.rotateY(Math.PI / 2);
      const material = new MeshStandardMaterial({ map: groundMaterial, side: DoubleSide });
      const plane = new Mesh(geometry, material);
      plane.receiveShadow = true;
      scene().add(plane);

      // LOAD OBJECT
      let loader = new GLTFLoader();
      const gltf = await loader.loadAsync(modelUrl);
      setModel(gltf.scene.children[0].rotateZ(180 / 180 * Math.PI));
      scene().add(gltf.scene);

      // RENDERER
      renderer().setSize(parent.innerWidth, parent.innerHeight);

      // LIGHTS
      const ambientLight = new AmbientLight(0x404040, 0);
      scene().add(ambientLight);

      const directionalLight = new DirectionalLight(0xffffff, 5);
      directionalLight.position.set(0, 0, 0);
      directionalLight.castShadow = false;
      scene().add(directionalLight);

      const light = new PointLight(0xc4c4c4, 0);
      light.position.set(300, 200, 300);
      light.castShadow = true;
      scene().add(light);

      const light2 = new PointLight(0xc4c4c4, 3);
      light2.position.set(500, 500, 0);
      light2.castShadow = true;
      scene().add(light2);

      //CAMERA
      // camera().rotation.y = 45 / 180 * Math.PI;
      camera().position.set(1, 1, 10);
      // camera().position.set(3.4, 24.9, 23.8);
      fitCameraToObject();

      // ADD TO DOM
      document.querySelector('#viewer')!.appendChild(renderer().domElement);
      animate(); // renderer().render(scene(), camera());

      // LISTENERS
      controls().addEventListener('change', () => {
        renderer().render(scene(), camera());
        console.log({ post: camera().position });
      });

      document.addEventListener('mousedown', onDocumentMouseDown, false);
      // document.addEventListener('mousemove', onDocumentMouseMove, false);
      // document.addEventListener('mouseup', onDocumentMouseUp, false);

    }

    function fitCameraToObject(offset: number = 1.5) {
      const object = model();
      if(!object) {
        console.error('No model');
        return;
      }

      const boundingBox = new Box3();

      boundingBox.setFromObject(object);

      const center = boundingBox.getCenter(new Vector3());
      const size = boundingBox.getSize(new Vector3());

      const startDistance = center.distanceTo(camera().position);
      // here we must check if the screen is horizontal or vertical, because camera().fov is
      // based on the vertical direction.
      const endDistance = camera().aspect > 1 ?
        ((size.y / 2) + offset) / Math.abs(Math.tan(camera().fov / 2)) :
        ((size.y / 2) + offset) / Math.abs(Math.tan(camera().fov / 2)) / camera().aspect;

      const { x, y, z } = {
        x: camera().position.x * endDistance / startDistance,
        y: camera().position.y * endDistance / startDistance,
        z: camera().position.z * endDistance / startDistance
      };

      camera().position.set(x, y, z);
      camera().lookAt(camera().position);
      // console.log({ fit: camera().position });
    }

    void init();

    return <div id="viewer">
      <h1>{ title }</h1>
    </div>;
  }
;
