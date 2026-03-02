// Scene setup
const container = document.getElementById('model-container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    10000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Strong Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight2.position.set(-500, 500, -500);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight3.position.set(0, -500, 0);
scene.add(directionalLight3);

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let model = null;
let baseRotationY = 0;

// Loading indicator
const loadingDiv = document.createElement('div');
loadingDiv.className = 'loading';
loadingDiv.textContent = 'Loading model...';
container.appendChild(loadingDiv);

// Load FBX Model
const loader = new THREE.FBXLoader();

loader.load(
    'Models/A with arrows V3.fbx', // <-- CHANGE THIS TO YOUR MODEL NAME
    function (object) {
        model = object;
        
        console.log('Model loaded:', object);
        
        // Get model bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log('Model size:', size);
        console.log('Model center:', center);
        
        // Center the model at origin
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // DON'T scale the model - instead move camera to fit
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Position camera based on model size
        camera.position.z = maxDim * 1.5;
        
        // Update light positions based on model size
        directionalLight.position.set(maxDim, maxDim, maxDim);
        directionalLight2.position.set(-maxDim, maxDim, -maxDim);
        directionalLight3.position.set(0, -maxDim, 0);
        
        console.log('Camera distance:', camera.position.z);
        
        // Force visible materials
        model.traverse(function (child) {
            if (child.isMesh) {
                console.log('Mesh found:', child.name);
                
                // Force bright visible material
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x6699ff,
                    metalness: 0.4,
                    roughness: 0.5,
                    side: THREE.DoubleSide
                });
            }
        });
        
        scene.add(model);
        loadingDiv.remove();
        
        console.log('Model added! Camera at z:', camera.position.z);
    },
    function (xhr) {
        if (xhr.total > 0) {
            const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
            loadingDiv.textContent = `Loading... ${percent}%`;
        }
    },
    function (error) {
        console.error('Error loading model:', error);
        loadingDiv.textContent = 'Error loading model';
    }
);

// Mouse move event
document.addEventListener('mousemove', (event) => {
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
        // Slow continuous rotation
        baseRotationY += 0.003;
        
        // Mouse influence (subtle)
        const targetRotationX = mouseY * 0.2;
        const targetRotationY = baseRotationY + mouseX * 0.3;
        
        // Smooth easing
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

animate();