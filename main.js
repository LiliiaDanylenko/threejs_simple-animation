import * as THREE from 'three';

const scene = new THREE.Scene();

// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
});

const group = new THREE.Group();
const meshs = [];

const colors = [0xb7e8d8, 0xe86344, 0xe8ab9c];

for (let x = -2; x <= 2; x += 2) {
  for (let y = -2; y <= 2; y += 2) {
    const material = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * 3)],
      wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    meshs.push(mesh);
  }
}

group.add(...meshs);
scene.add(group);

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
const MAX_SCALE = 1;
const MIN_SCALE = 0.5;
let grow = false;

const animate = () => {
  // group.rotation.x = elepsedTime;
  // group.rotation.y = elepsedTime;
  // group.position.x = Math.cos(elepsedTime);
  // group.position.y = Math.sin(elepsedTime);
  const delta = clock.getDelta();

  meshs.forEach((mesh, index) => {
    const mult = index % 2 === 0 ? 1 : -1;
    mesh.rotation.x += mult * delta;
    mesh.rotation.y += mult * delta * 0.4;
  });

  const elepsedTime = clock.getElapsedTime();
  camera.position.x = Math.cos(elepsedTime);
  camera.position.y = Math.sin(elepsedTime);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const mult = grow ? 1 : -1;
  group.scale.x += mult * delta * 0.2;
  group.scale.y += mult * delta * 0.2;
  group.scale.z += mult * delta * 0.2;

  if (grow && group.scale.x >= MAX_SCALE) {
    grow = false;
  } else if (group.scale.x <= MIN_SCALE) {
    grow = true;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
})