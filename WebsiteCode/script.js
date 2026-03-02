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

// STRONGER Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight2.position.set(-5, 5, -5);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight3.position.set(0, -5, 0);
scene.add(directionalLight3);

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
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
        
        // Log model info for debugging
        console.log('Model loaded:', object);
        console.log('Children:', object.children);
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log('Model size:', size);
        console.log('Model center:', center);
        
        // Center the model
        model.position.sub(center);
        
        // Scale to fit
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim;
        model.scale.setScalar(scale);
        
        // ================================
        // FORCE VISIBLE MATERIALS
        // ================================
        model.traverse(function (child) {
            if (child.isMesh) {
                console.log('Found mesh:', child.name);
                
                // Option 1: Make existing material brighter
                if (child.material) {
                    child.material.transparent = false;
                    child.material.opacity = 1;
                    child.material.side = THREE.DoubleSide;
                    
                    // If material is too dark, brighten it
                    if (child.material.color) {
                        const color = child.material.color;
                        if (color.r < 0.1 && color.g < 0.1 && color.b < 0.1) {
                            child.material.color.setHex(0x888888);
                        }
                    }
                }
                
                // Option 2: Replace with visible material (uncomment if needed)
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
    },
    function (xhr) {
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
        baseRotationY += 0.005;
        
        targetRotationX = mouseY * 0.3;
        targetRotationY = mouseX * 0.5;
        
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.y += (baseRotationY + targetRotationY - model.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

animate();