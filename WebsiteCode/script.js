// Scene setup
const container = document.getElementById('model-container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let baseRotationY = 0;

// ===========================================
// TEST CUBE (to verify Three.js is working)
// ===========================================
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x4488ff,
    metalness: 0.3,
    roughness: 0.4
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

console.log("Test cube added! If you see a blue cube, Three.js is working.");

// ===========================================
// Uncomment below to load your FBX model
// ===========================================

/*
const loader = new THREE.FBXLoader();

loader.load(
    'Models/your-model.fbx',  // <-- CHANGE THIS TO YOUR MODEL NAME
    function (object) {
        console.log('Model loaded!', object);
        
        // Remove test cube
        scene.remove(cube);
        
        // Add model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        object.position.sub(center);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        object.scale.setScalar(scale);
        
        scene.add(object);
        
        // Store reference for animation
        window.loadedModel = object;
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('ERROR loading model:', error);
    }
);
*/

// Mouse move event
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    baseRotationY += 0.005;
    
    // Animate cube OR loaded model
    const target = window.loadedModel || cube;
    
    if (target) {
        target.rotation.x += (mouseY * 0.3 - target.rotation.x) * 0.05;
        target.rotation.y += (baseRotationY + mouseX * 0.5 - target.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

animate();

console.log("Animation started!");