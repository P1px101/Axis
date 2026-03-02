// Scene setup
const container = document.getElementById('model-container');
const scene = new THREE.Scene();

// Camera - moved MUCH further back
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    5000  // Increased far plane
);
camera.position.z = 200;  // Much further back!

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
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(100, 100, 100);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight2.position.set(-100, 100, -100);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight3.position.set(0, -100, 0);
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
        
        // Get model size
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log('Original size:', size);
        
        // Center the model
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // Scale down to reasonable size (target size of ~3 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        const desiredSize = 3;
        const scale = desiredSize / maxDim;
        
        model.scale.set(scale, scale, scale);
        
        console.log('Scale applied:', scale);
        
        // Reset camera for scaled model
        camera.position.z = 8;
        
        // Force visible materials
        model.traverse(function (child) {
            if (child.isMesh) {
                console.log('Mesh found:', child.name);
                
                // Make sure materials are visible
                if (child.material) {
                    child.material.side = THREE.DoubleSide;
                    child.material.transparent = false;
                    child.material.opacity = 1;
                    child.material.needsUpdate = true;
                }
                
                // Uncomment below to force a bright material:
                /*
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x4488ff,
                    metalness: 0.3,
                    roughness: 0.6,
                    side: THREE.DoubleSide
                });
                */
            }
        });
        
        scene.add(model);
        loadingDiv.remove();
        
        console.log('Model added to scene!');
        console.log('Final model position:', model.position);
        console.log('Final model scale:', model.scale);
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
        baseRotationY += 0.005;
        
        // Mouse influence (subtle)
        const targetRotationX = mouseY * 0.3;
        const targetRotationY = baseRotationY + mouseX * 0.5;
        
        // Smooth easing
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

animate();