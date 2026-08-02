<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { withBase } from 'vitepress';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type CampusFeature = {
  id: string;
  name: string;
  ownerTile: string;
  modelGrade: string;
  status: string;
  confidence: Record<'xy' | 'z' | 'roof', string>;
  verification: 'candidate' | 'named';
  centerLocalEN: [number, number];
};

type SemanticLayer = {
  id: string;
  nodeName: string;
  label: string;
  triangles: number;
  sourceWayCount: number;
};

type ReferenceMap = {
  uri: string;
  bytes: number;
  sha256: string;
  source: string;
  defaultVisible: boolean;
  imageSizePx: [number, number];
  fitRmsM: number;
  pixelToLocalAffine: {
    x: [number, number, number];
    y: [number, number, number];
  };
  campusBoundaryLocalEN: Array<[number, number]>;
};

type CampusManifest = {
  status: string;
  presentation: {
    style: string;
    renderedRoofCards: boolean;
  };
  model: {
    uri: string;
    bytes: number;
    triangles: number;
    featureCount: number;
  };
  referenceMap?: ReferenceMap;
  semanticLayers: SemanticLayer[];
  features: CampusFeature[];
  attribution: Array<{
    name: string;
    url: string;
    license: string;
  }>;
  limitations: string[];
};

const host = ref<HTMLElement>();
const shell = ref<HTMLElement>();
const manifest = ref<CampusManifest>();
const selectedId = ref('');
const loadingText = ref('正在加载地图…');
const errorMessage = ref('');
const isReady = ref(false);
const isFullscreen = ref(false);
const showGround = ref(true);
const showCampusRoads = ref(true);
const showOuterRoads = ref(true);
const showReferenceMap = ref(false);
const referenceLoading = ref(false);
const referenceError = ref('');

const features = computed(() =>
  [...(manifest.value?.features ?? [])].sort((left, right) =>
    left.name.localeCompare(right.name, 'zh-CN'),
  ),
);
const selectedFeature = computed(() =>
  manifest.value?.features.find((feature) => feature.id === selectedId.value),
);
const modelSize = computed(() => {
  const bytes = manifest.value?.model.bytes ?? 0;
  return bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : '—';
});

let renderer: THREE.WebGLRenderer | undefined;
let scene: THREE.Scene | undefined;
let camera: THREE.PerspectiveCamera | undefined;
let controls: OrbitControls | undefined;
let resizeObserver: ResizeObserver | undefined;
let animationFrame = 0;
let modelRoot: THREE.Object3D | undefined;
let campusBounds: THREE.Box3 | undefined;
let selectionHelper: THREE.Box3Helper | undefined;
let manifestAssetUrl: URL | undefined;
let referenceMapMesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> | undefined;
let referenceMapTexture: THREE.Texture | undefined;
const featureRoots = new Map<string, THREE.Object3D>();
const semanticNodes = new Map<string, THREE.Object3D>();
const selectableMeshes: THREE.Mesh[] = [];
const generatedOutlines: THREE.LineSegments[] = [];
const outlineMaterial = new THREE.LineBasicMaterial({
  color: 0x35322c,
  opacity: 0.72,
  transparent: true,
  depthWrite: false,
});
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerStart: { x: number; y: number } | undefined;

function disposeHelper(helper: THREE.Box3Helper) {
  helper.geometry.dispose();
  const materials = Array.isArray(helper.material) ? helper.material : [helper.material];
  for (const material of materials) material.dispose();
}

function featureIdFromObject(object: THREE.Object3D | null) {
  let current = object;
  while (current) {
    if (current.name.startsWith('feature__')) return current.name.slice('feature__'.length);
    current = current.parent;
  }
  return null;
}

function updateSelectionHelper() {
  if (!scene) return;
  if (selectionHelper) {
    scene.remove(selectionHelper);
    disposeHelper(selectionHelper);
    selectionHelper = undefined;
  }
  const root = featureRoots.get(selectedId.value);
  if (!root) return;
  const box = new THREE.Box3().setFromObject(root);
  selectionHelper = new THREE.Box3Helper(box, 0xa24736);
  selectionHelper.name = 'selected-building-outline';
  selectionHelper.renderOrder = 50;
  scene.add(selectionHelper);
}

function selectFeature(id: string, focus = false) {
  if (!featureRoots.has(id)) return;
  selectedId.value = id;
  updateSelectionHelper();
  if (focus) focusSelected();
}

function handleSelectChange(event: Event) {
  selectFeature((event.target as HTMLSelectElement).value);
}

function focusSelected() {
  const root = featureRoots.get(selectedId.value);
  if (!root || !camera || !controls) return;
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const distance = Math.max(42, size.length() * 2.25);
  controls.target.copy(center);
  camera.up.set(0, 1, 0);
  camera.position.set(center.x + distance, center.y + distance * 0.72, center.z + distance);
  camera.lookAt(center);
  controls.update();
}

function fitCampus(topView = true) {
  if (!campusBounds || !camera || !controls) return;
  const center = campusBounds.getCenter(new THREE.Vector3());
  const size = campusBounds.getSize(new THREE.Vector3());
  const span = Math.max(size.x, size.z);
  controls.target.copy(center);
  if (topView) {
    camera.up.set(0, 0, -1);
    camera.position.set(center.x, Math.max(720, span * 1.25), center.z);
  } else {
    camera.up.set(0, 1, 0);
    camera.position.set(center.x + span * 0.82, Math.max(300, span * 0.68), center.z + span * 0.82);
  }
  camera.lookAt(center);
  controls.update();
}

function applyLayerVisibility() {
  for (const id of ['campus-ground', 'grass', 'sports', 'water']) {
    const node = semanticNodes.get(id);
    if (node) node.visible = showGround.value;
  }
  for (const id of ['internal-roads', 'footpaths']) {
    const node = semanticNodes.get(id);
    if (node) node.visible = showCampusRoads.value;
  }
  const outerRoads = semanticNodes.get('external-roads');
  if (outerRoads) outerRoads.visible = showOuterRoads.value;
}

function pointInBoundary(point: [number, number], boundary: Array<[number, number]>) {
  let inside = false;
  for (let index = 0, previous = boundary.length - 1; index < boundary.length; previous = index++) {
    const [currentX, currentY] = boundary[index];
    const [previousX, previousY] = boundary[previous];
    const crosses =
      currentY > point[1] !== previousY > point[1] &&
      point[0] <
        ((previousX - currentX) * (point[1] - currentY)) / (previousY - currentY) + currentX;
    if (crosses) inside = !inside;
  }
  return inside;
}

async function createReferenceMap() {
  const reference = manifest.value?.referenceMap;
  if (!reference || !manifestAssetUrl || !renderer || !scene) return undefined;

  const textureUrl = new URL(reference.uri, manifestAssetUrl).href;
  const texture = await new THREE.TextureLoader().loadAsync(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  referenceMapTexture = texture;

  const positions: number[] = [];
  const uvs: number[] = [];
  const cells = 28;
  const [width, height] = reference.imageSizePx;
  const mapPixel = (pixelX: number, pixelY: number): [number, number] => [
    reference.pixelToLocalAffine.x[0] * pixelX +
      reference.pixelToLocalAffine.x[1] * pixelY +
      reference.pixelToLocalAffine.x[2],
    reference.pixelToLocalAffine.y[0] * pixelX +
      reference.pixelToLocalAffine.y[1] * pixelY +
      reference.pixelToLocalAffine.y[2],
  ];

  for (let row = 0; row < cells; row += 1) {
    for (let column = 0; column < cells; column += 1) {
      const x0 = (column / cells) * width;
      const x1 = ((column + 1) / cells) * width;
      const y0 = (row / cells) * height;
      const y1 = ((row + 1) / cells) * height;
      const center = mapPixel((x0 + x1) / 2, (y0 + y1) / 2);
      if (!pointInBoundary(center, reference.campusBoundaryLocalEN)) continue;

      const corners: Array<[number, number]> = [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ];
      const mapped = corners.map(([pixelX, pixelY]) => mapPixel(pixelX, pixelY));
      for (const cornerIndex of [0, 1, 2, 0, 2, 3]) {
        const [localX, localNorth] = mapped[cornerIndex];
        const [pixelX, pixelY] = corners[cornerIndex];
        positions.push(localX, 0.16, -localNorth);
        uvs.push(pixelX / width, 1 - pixelY / height);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 0.56,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'reference-campus-map';
  mesh.renderOrder = 12;
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
}

async function applyReferenceMapVisibility() {
  if (!showReferenceMap.value) {
    if (referenceMapMesh) referenceMapMesh.visible = false;
    return;
  }
  if (!manifest.value?.referenceMap || !scene) return;

  referenceLoading.value = true;
  referenceError.value = '';
  try {
    referenceMapMesh ??= await createReferenceMap();
    if (!referenceMapMesh) throw new Error('参考图配置不完整');
    referenceMapMesh.visible = true;
  } catch (error) {
    referenceError.value = error instanceof Error ? error.message : '参考图加载失败';
    showReferenceMap.value = false;
  } finally {
    referenceLoading.value = false;
  }
}

function resizeRenderer() {
  if (!host.value || !renderer || !camera) return;
  const width = Math.max(1, host.value.clientWidth);
  const height = Math.max(1, host.value.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function handlePointerDown(event: PointerEvent) {
  pointerStart = { x: event.clientX, y: event.clientY };
}

function handlePointerUp(event: PointerEvent) {
  if (!pointerStart || !renderer || !camera) return;
  const movement = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  pointerStart = undefined;
  if (movement > 5) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(selectableMeshes, false)[0];
  const featureId = hit ? featureIdFromObject(hit.object) : null;
  if (featureId) selectFeature(featureId);
}

async function toggleFullscreen() {
  if (!shell.value) return;
  if (document.fullscreenElement) await document.exitFullscreen();
  else await shell.value.requestFullscreen();
}

function handleFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === shell.value;
  nextTick(resizeRenderer);
}

function animate() {
  controls?.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
  animationFrame = requestAnimationFrame(animate);
}

async function initializeMap() {
  if (!host.value) return;
  try {
    const manifestUrl = new URL(withBase('/maps/xingshu-campus/manifest.json'), location.href);
    manifestAssetUrl = manifestUrl;
    const response = await fetch(manifestUrl);
    if (!response.ok) throw new Error(`地图清单加载失败（HTTP ${response.status}）`);
    manifest.value = (await response.json()) as CampusManifest;
    showReferenceMap.value = manifest.value.referenceMap?.defaultVisible ?? false;
    if (manifest.value.presentation.renderedRoofCards) {
      throw new Error('地图包意外包含屋顶字牌，已停止加载。');
    }

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.setClearColor(0xded5c1);
    renderer.domElement.setAttribute('aria-label', '行署校区三维地图画布');
    host.value.append(renderer.domElement);

    scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff8e8, 0x716c62, 2.55));
    const sun = new THREE.DirectionalLight(0xfff3d9, 2.05);
    sun.position.set(-220, 380, 160);
    scene.add(sun);

    camera = new THREE.PerspectiveCamera(44, 1, 1, 1800);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.minDistance = 35;
    controls.maxDistance = 1500;

    const modelUrl = new URL(manifest.value.model.uri, manifestUrl).href;
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl, (event) => {
      if (!event.total) return;
      loadingText.value = `正在加载地图… ${Math.round((event.loaded / event.total) * 100)}%`;
    });
    modelRoot = gltf.scene;
    modelRoot.name = 'xingshu-campus-model';
    scene.add(modelRoot);

    const boundsObjects: THREE.Object3D[] = [];
    for (const layer of manifest.value.semanticLayers) {
      const node = modelRoot.getObjectByName(layer.nodeName);
      if (node) {
        semanticNodes.set(layer.id, node);
        boundsObjects.push(node);
      }
    }
    for (const feature of manifest.value.features) {
      const root = modelRoot.getObjectByName(`feature__${feature.id}`);
      if (!root) continue;
      featureRoots.set(feature.id, root);
      boundsObjects.push(root);
      root.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        selectableMeshes.push(object);
        const outline = new THREE.LineSegments(
          new THREE.EdgesGeometry(object.geometry, 34),
          outlineMaterial,
        );
        outline.name = 'ink-outline';
        outline.renderOrder = 30;
        object.add(outline);
        generatedOutlines.push(outline);
      });
    }
    if (featureRoots.size !== manifest.value.model.featureCount) {
      throw new Error(
        `建筑节点不完整（${featureRoots.size}/${manifest.value.model.featureCount}）`,
      );
    }

    campusBounds = new THREE.Box3();
    for (const object of boundsObjects) campusBounds.expandByObject(object);
    applyLayerVisibility();
    selectedId.value = features.value[0]?.id ?? '';
    updateSelectionHelper();
    resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(host.value);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    resizeRenderer();
    fitCampus(true);
    isReady.value = true;
    loadingText.value = '地图已加载';
    animate();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '地图加载失败';
    loadingText.value = '加载失败';
  }
}

function disposeMap() {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  if (renderer) {
    renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
    renderer.domElement.removeEventListener('pointerup', handlePointerUp);
  }
  controls?.dispose();
  if (selectionHelper) disposeHelper(selectionHelper);
  if (referenceMapMesh) {
    scene?.remove(referenceMapMesh);
    referenceMapMesh.geometry.dispose();
    referenceMapMesh.material.dispose();
  }
  referenceMapTexture?.dispose();
  for (const outline of generatedOutlines) outline.geometry.dispose();
  outlineMaterial.dispose();
  modelRoot?.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) material.dispose();
  });
  renderer?.dispose();
}

watch([showGround, showCampusRoads, showOuterRoads], applyLayerVisibility);
watch(showReferenceMap, () => void applyReferenceMapVisibility());
onMounted(initializeMap);
onBeforeUnmount(disposeMap);
</script>

<template>
  <section ref="shell" class="xingshu-map-shell" aria-labelledby="xingshu-map-title">
    <header class="xingshu-map-header">
      <div>
        <p class="xingshu-map-kicker">新生专题 · 非官方学生白模</p>
        <h2 id="xingshu-map-title">行署校区三维地图</h2>
        <p>宣纸水墨风 · 点击建筑查看名称 · 不含屋顶字牌</p>
      </div>
      <span class="xingshu-map-status" :class="{ ready: isReady, error: errorMessage }">
        {{ loadingText }}
      </span>
    </header>

    <div class="xingshu-map-toolbar" aria-label="地图控制栏">
      <label class="xingshu-map-select">
        <span>选择建筑</span>
        <select :value="selectedId" :disabled="!isReady" @change="handleSelectChange">
          <option v-for="feature in features" :key="feature.id" :value="feature.id">
            {{ feature.name }} · {{ feature.id }}
          </option>
        </select>
      </label>
      <div class="xingshu-map-actions">
        <button type="button" :disabled="!isReady" @click="fitCampus(true)">顶视图</button>
        <button type="button" :disabled="!isReady" @click="fitCampus(false)">斜视图</button>
        <button type="button" :disabled="!isReady" @click="focusSelected">定位建筑</button>
        <button type="button" :disabled="!isReady" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏查看' }}
        </button>
      </div>
    </div>

    <div class="xingshu-map-stage-wrap">
      <div ref="host" class="xingshu-map-stage" aria-live="polite">
        <div v-if="!isReady" class="xingshu-map-loading">
          <strong>{{ loadingText }}</strong>
          <span v-if="errorMessage">{{ errorMessage }}</span>
        </div>
      </div>
      <div class="xingshu-map-hint">拖动旋转 · 滚轮或双指缩放 · 点击白模选择建筑</div>
    </div>

    <footer class="xingshu-map-footer">
      <div class="xingshu-map-details">
        <template v-if="selectedFeature">
          <strong>{{ selectedFeature.name }}</strong>
          <span>{{ selectedFeature.id }}</span>
          <span>{{ selectedFeature.ownerTile }}</span>
          <span>{{ selectedFeature.modelGrade }}</span>
          <em v-if="selectedFeature.verification === 'candidate'">名称或形态待核验</em>
        </template>
        <span v-else>请选择一栋建筑</span>
      </div>
      <fieldset class="xingshu-map-layers">
        <legend>图层</legend>
        <label><input v-model="showGround" type="checkbox" /> 地面与水体</label>
        <label><input v-model="showCampusRoads" type="checkbox" /> 校内道路</label>
        <label><input v-model="showOuterRoads" type="checkbox" /> 外围道路</label>
        <label title="默认关闭，仅供目视参考">
          <input
            v-model="showReferenceMap"
            type="checkbox"
            :disabled="!isReady || referenceLoading || !manifest?.referenceMap"
          />
          {{ referenceLoading ? '参考原图加载中' : '参考原图' }}
        </label>
      </fieldset>
      <span v-if="referenceError" class="xingshu-map-layer-error">{{ referenceError }}</span>
      <div class="xingshu-map-stats">
        <span>{{ manifest?.model.featureCount ?? 0 }} 栋</span>
        <span>{{ manifest?.model.triangles.toLocaleString() ?? '—' }} 三角面</span>
        <span>{{ modelSize }}</span>
        <a
          v-if="manifest?.attribution[0]"
          :href="manifest.attribution[0].url"
          target="_blank"
          rel="noreferrer"
        >
          © OpenStreetMap contributors
        </a>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.xingshu-map-shell {
  --map-ink: #302d27;
  --map-paper: #ded5c1;
  --map-paper-light: #f3eddf;
  --map-seal: #a24736;
  background: var(--map-paper-light);
  border: 1px solid color-mix(in srgb, var(--map-ink), transparent 74%);
  border-radius: 18px;
  box-shadow: 0 22px 60px rgba(58, 48, 35, 0.16);
  color: var(--map-ink);
  margin: 24px 0;
  overflow: hidden;
}

.xingshu-map-header,
.xingshu-map-toolbar,
.xingshu-map-footer {
  padding: 14px 16px;
}

.xingshu-map-header {
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
}

.xingshu-map-header h2,
.xingshu-map-header p {
  margin: 0;
}

.xingshu-map-header h2 {
  color: var(--map-ink);
  font-size: clamp(20px, 3vw, 28px);
  letter-spacing: 0.04em;
}

.xingshu-map-header p:not(.xingshu-map-kicker) {
  color: #6d665a;
  font-size: 12px;
  margin-top: 4px;
}

.xingshu-map-kicker {
  color: var(--map-seal);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin-bottom: 3px !important;
  text-transform: uppercase;
}

.xingshu-map-status {
  background: #e0d8c8;
  border-radius: 999px;
  color: #6b6255;
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 10px;
}

.xingshu-map-status.ready {
  background: #5c6c54;
  color: #fffdf6;
}

.xingshu-map-status.error {
  background: var(--map-seal);
  color: #fffdf6;
}

.xingshu-map-toolbar {
  align-items: end;
  background: rgba(255, 255, 255, 0.34);
  border-top: 1px solid rgba(58, 48, 35, 0.12);
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(220px, 1fr) auto;
}

.xingshu-map-select {
  display: grid;
  font-size: 11px;
  font-weight: 700;
  gap: 5px;
}

.xingshu-map-select select,
.xingshu-map-actions button {
  background: rgba(255, 253, 246, 0.88);
  border: 1px solid rgba(48, 45, 39, 0.24);
  border-radius: 9px;
  color: var(--map-ink);
  font: inherit;
  min-height: 36px;
}

.xingshu-map-select select {
  padding: 0 10px;
  width: 100%;
}

.xingshu-map-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.xingshu-map-actions button {
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  padding: 0 11px;
}

.xingshu-map-actions button:hover:not(:disabled) {
  border-color: var(--map-seal);
  color: var(--map-seal);
}

.xingshu-map-actions button:disabled,
.xingshu-map-select select:disabled {
  cursor: wait;
  opacity: 0.5;
}

.xingshu-map-stage-wrap {
  position: relative;
}

.xingshu-map-stage {
  background: var(--map-paper);
  height: clamp(480px, 68vh, 760px);
  overflow: hidden;
  position: relative;
  touch-action: none;
}

.xingshu-map-stage :deep(canvas) {
  display: block;
  height: 100%;
  outline: none;
  width: 100%;
}

.xingshu-map-loading {
  align-items: center;
  color: #5f574b;
  display: grid;
  gap: 6px;
  inset: 0;
  justify-items: center;
  padding: 28px;
  place-content: center;
  position: absolute;
  text-align: center;
}

.xingshu-map-loading span {
  font-size: 12px;
}

.xingshu-map-hint {
  background: rgba(48, 45, 39, 0.82);
  border-radius: 999px;
  bottom: 12px;
  color: #f7f0df;
  font-size: 10px;
  left: 50%;
  padding: 6px 10px;
  pointer-events: none;
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
}

.xingshu-map-footer {
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(170px, 1fr) auto;
}

.xingshu-map-details,
.xingshu-map-stats {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
}

.xingshu-map-details strong {
  color: var(--map-ink);
  font-size: 15px;
}

.xingshu-map-details span,
.xingshu-map-details em,
.xingshu-map-stats {
  color: #6b6357;
  font-size: 10px;
}

.xingshu-map-details em {
  background: rgba(162, 71, 54, 0.1);
  border-radius: 999px;
  color: var(--map-seal);
  font-style: normal;
  font-weight: 700;
  padding: 4px 7px;
}

.xingshu-map-layers {
  border: 0;
  display: flex;
  gap: 8px 12px;
  margin: 0;
  padding: 0;
}

.xingshu-map-layers legend {
  height: 0;
  overflow: hidden;
  position: absolute;
  width: 0;
}

.xingshu-map-layers label {
  align-items: center;
  color: #5f574b;
  display: flex;
  font-size: 10px;
  gap: 4px;
  white-space: nowrap;
}

.xingshu-map-layers input {
  accent-color: var(--map-seal);
}

.xingshu-map-layers input:disabled {
  cursor: wait;
  opacity: 0.55;
}

.xingshu-map-layer-error {
  color: var(--map-seal);
  font-size: 10px;
  font-weight: 700;
}

.xingshu-map-stats {
  grid-column: 1 / -1;
}

.xingshu-map-stats a {
  color: #5e6658;
  font-weight: 700;
}

.xingshu-map-shell:fullscreen {
  border: 0;
  border-radius: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  height: 100vh;
  margin: 0;
  width: 100vw;
}

.xingshu-map-shell:fullscreen .xingshu-map-stage {
  height: 100%;
}

@media (max-width: 720px) {
  .xingshu-map-header {
    align-items: start;
  }

  .xingshu-map-toolbar,
  .xingshu-map-footer {
    grid-template-columns: 1fr;
  }

  .xingshu-map-actions button {
    flex: 1 1 calc(50% - 7px);
  }

  .xingshu-map-stage {
    height: min(62vh, 580px);
    min-height: 430px;
  }

  .xingshu-map-layers {
    flex-wrap: wrap;
  }

  .xingshu-map-hint {
    max-width: calc(100% - 24px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (prefers-reduced-motion: reduce) {
  .xingshu-map-actions button {
    transition: none;
  }
}
</style>
