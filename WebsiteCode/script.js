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

const directionalLight2 = new THREE.DirectionalLight(0x4488ff, 0.5);
directionalLight2.position.set(-5, -5, -5);
scene.add(directionalLight2);

// Mouse tracking variables
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// Model variable
let model = null;

// Base rotation (continuous spin)
let baseRotationY = 0;

// Loading indicator
const loadingDiv = document.createElement('div');
loadingDiv.className = 'loading';
loadingDiv.textContent = 'Loading model...';
container.appendChild(loadingDiv);

// Load FBX Model
const loader = new THREE.FBXLoader();

loader.load(
    'Models/A with arrows V3.fbx', // Change this to your model path
    function (object) {
        model = object;
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center the model
        model.position.sub(center);
        
        // Scale to fit
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);
        
        scene.add(model);
        
        // Remove loading indicator
        loadingDiv.remove();
        
        console.log('Model loaded successfully!');
    },
    function (xhr) {
        // Progress
        const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
        loadingDiv.textContent = `Loading... ${percent}%`;
    },
    function (error) {
        console.error('Error loading model:', error);
        loadingDiv.textContent = 'Error loading model';
    }
);

// Mouse move event
document.addEventListener('mousemove', (event) => {
    // Normalize mouse position to -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        // Continuous slow rotation
        baseRotationY += 0.005;
        
        // Target rotation based on mouse (subtle effect)
        targetRotationX = mouseY * 0.3; // Tilt up/down
        targetRotationY = mouseX * 0.5; // Tilt left/right
        
        // Smooth interpolation (easing)
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.y += (baseRotationY + targetRotationY - model.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

animate();