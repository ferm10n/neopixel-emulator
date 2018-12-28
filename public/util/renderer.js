/* globals THREE, pixels */
/**
 * @typedef {import('three/src/Three')}
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#app').appendChild(renderer.domElement);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

camera.position.z = 15;

function animate () {
  requestAnimationFrame(animate);
  if (window.pixels) {
    for (let i = 0; i < pixels.length; i++) {
      const pixel = pixels[i];
      pixel.cube.rotation.x += 0.01;
      pixel.cube.rotation.y += 0.01;
    }
  }
  renderer.render(scene, camera);
}
animate();

class Pixel {
  constructor () {
    console.log(this);
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.cube);
  }

  get position () { return this.cube.position; }
}
window.Pixel = Pixel;

function createPixelsFromOutput (output) {
  const pixels = [];
  for (let i = 0; i < output.buffer.length / 3; i++) {
    const pixel = new Pixel();
    pixel.material.color.setRGB(output.buffer[i * 3], output.buffer[i * 3 + 1], output.buffer[i * 3 + 2]);

    pixels.push(pixel);
  }
  return pixels;
}
window.createPixelsFromOutput = createPixelsFromOutput;

function updatePixelsFromOutput (pixels, output) {
  let strings = '';
  const colors = [];
  console.log(output.buffer);
  for (let i = 0; i < pixels.length; i++) {
    const color = pixels[i].material.color;
    color.setRGB(
      output.buffer[i * 3] / 255,
      output.buffer[i * 3 + 1] / 255,
      output.buffer[i * 3 + 2] / 255
    );
    const rgbString = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
    strings += `%c${rgbString} `;
    colors.push(`color:${rgbString};`);
  }
  console.log.apply(null, [strings, ...colors]);
}
window.updatePixelsFromOutput = updatePixelsFromOutput;
