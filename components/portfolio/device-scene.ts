import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const loader = new GLTFLoader();
const models = new Map<string, Promise<THREE.Group>>();
const textures = new Map<string, Promise<THREE.Texture>>();
function model(name: string) {
  if (!models.has(name)) models.set(name, loader.loadAsync(`/assets/devices/${name}.glb`).then(gltf => gltf.scene).catch(error => { models.delete(name); throw error; }));
  return models.get(name)!;
}
function screenshot(name: string) {
  if (!textures.has(name)) textures.set(name, new THREE.TextureLoader().loadAsync(`/assets/devices/${name}.png`).then(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    return texture;
  }).catch(error => { textures.delete(name); throw error; }));
  return textures.get(name)!;
}

export async function mountDevices(host: HTMLDivElement, project: string) {
  const laptop = project === "35mm";
  const names = laptop ? ["macbook"] : ["pro", "duo"];
  // Load first so a failed request does not leave a WebGL context behind.
  const assets = await Promise.all(names.map(async name => ({
    source: await model(name),
    screen: !laptop && project !== "amharist" ? await screenshot(`${project}-${name}`) : null,
  })));
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0xffffff, 0);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  room.dispose(); pmrem.dispose();
  scene.environment = environment.texture;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x726d65, 2.5));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-3, 5, 7); scene.add(light);
  const group = new THREE.Group(); scene.add(group);
  const ownedMaterials: THREE.Material[] = [];
  assets.forEach(({ source, screen }, i) => {
    const object = source.clone(true);
    object.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      if (child.name === "DeviceScreen") {
        const original = Array.isArray(child.material) ? child.material[0] : child.material;
        const material = new THREE.MeshBasicMaterial({ map: screen || original.map || original.emissiveMap, side: THREE.DoubleSide, toneMapped: false });
        child.material = material;
        ownedMaterials.push(material);
      }
    });
    const bounds = new THREE.Box3().setFromObject(object);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = laptop ? 2.45 / size.x : (i === 0 ? 1.8 : 1.48) / size.y;
    object.position.copy(center).multiplyScalar(-scale);
    object.scale.setScalar(scale);
    const pivot = new THREE.Group(); pivot.add(object);
    if (laptop) { pivot.rotation.set(.10, -.22, 0); }
    else { pivot.position.set(i === 0 ? -.53 : .54, i === 0 ? .03 : -.13, 0); pivot.rotation.set(0, i === 0 ? -.20 : .18, i === 0 ? .025 : -.055); }
    group.add(pivot);
  });
  const camera = new THREE.OrthographicCamera(-2, 2, 1.15, -1.15, .01, 100);
  camera.position.set(0, laptop ? .25 : 0, 8); camera.lookAt(0, 0, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  let alive = true, frame = 0, yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0;
  let visible = true, dragging = false, lastX = 0, lastY = 0;
  const render = () => {
    frame = 0;
    if (!alive || !visible || document.hidden) return;
    yaw += (targetYaw - yaw) * .2; pitch += (targetPitch - pitch) * .2;
    group.rotation.set(pitch, yaw, 0);
    renderer.render(scene, camera);
    if (Math.abs(targetYaw - yaw) + Math.abs(targetPitch - pitch) > .001) frame = requestAnimationFrame(render);
  };
  const requestRender = () => { if (alive && !frame) frame = requestAnimationFrame(render); };
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    const halfWidth = 1.16 * width / height;
    camera.left = -halfWidth; camera.right = halfWidth; camera.updateProjectionMatrix(); requestRender();
  });
  resize.observe(host);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) requestRender(); }); observer.observe(host);
  const down = (event: PointerEvent) => {
    if (event.button !== 0) return;
    dragging = true; lastX = event.clientX; lastY = event.clientY;
    host.setPointerCapture(event.pointerId); host.classList.add("is-dragging");
  };
  const move = (event: PointerEvent) => {
    if (!dragging) return;
    targetYaw += (event.clientX - lastX) * .018;
    targetPitch = THREE.MathUtils.clamp(targetPitch + (event.clientY - lastY) * .008, -.35, .35);
    lastX = event.clientX; lastY = event.clientY; requestRender();
  };
  const up = () => { dragging = false; host.classList.remove("is-dragging"); };
  const reset = () => { targetYaw = targetPitch = 0; requestRender(); };
  const key = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") reset();
    else if (event.key === "ArrowLeft") targetYaw -= .25;
    else if (event.key === "ArrowRight") targetYaw += .25;
    else targetPitch = THREE.MathUtils.clamp(targetPitch + (event.key === "ArrowUp" ? -.12 : .12), -.35, .35);
    requestRender();
  };
  const visibility = () => { if (!document.hidden) requestRender(); };
  host.addEventListener("pointerdown", down); host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up); host.addEventListener("pointercancel", up); host.addEventListener("lostpointercapture", up);
  host.addEventListener("keydown", key); document.addEventListener("visibilitychange", visibility);
  requestRender();
  return { reset, dispose() {
    alive = false; cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
    host.removeEventListener("pointerdown", down); host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up); host.removeEventListener("pointercancel", up); host.removeEventListener("lostpointercapture", up);
    host.removeEventListener("keydown", key); document.removeEventListener("visibilitychange", visibility);
    ownedMaterials.forEach(material => material.dispose()); environment.dispose();
    renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    // Cached geometry and source textures are shared by homepage and dialog views.
  } };
}
