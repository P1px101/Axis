// ================================
// GSAP SPLIT TEXT ANIMATION
// ================================

gsap.registerPlugin(ScrollTrigger);

// Split text into characters or words
function splitTextIntoElements(element, type = 'chars') {
    const text = element.textContent.trim();
    element.innerHTML = '';
    
    if (type === 'chars') {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.className = 'char';
            
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            
            element.appendChild(span);
        }
        return element.querySelectorAll('.char');
        
    } else if (type === 'words') {
        const words = text.split(/\s+/);
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            element.appendChild(span);
        });
        return element.querySelectorAll('.word');
    }
}

// Initialize split text animations
function initSplitTextAnimations() {
    const splitElements = document.querySelectorAll('.split-text');
    
    splitElements.forEach((element, index) => {
        const animationType = element.dataset.animation || 'chars';
        const targets = splitTextIntoElements(element, animationType);
        
        // Set initial state
        gsap.set(targets, {
            opacity: 0,
            y: 50,
            rotateX: -40
        });
        
        // Check if element is in the first viewport
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight;
        
        if (isInView) {
            // Animate immediately with delay
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.04,
                delay: 0.3 + (index * 0.3)
            });
        } else {
            // Animate on scroll
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.04,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    once: true
                }
            });
        }
    });
    
    console.log('Split text animations initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplitTextAnimations);
} else {
    // Small delay to ensure everything is loaded
    setTimeout(initSplitTextAnimations, 100);
}


// ================================
// THREE.JS 3D MODEL
// ================================

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

// DIMMER Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight2.position.set(-500, 500, -500);
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight3.position.set(0, -500, 0);
scene.add(directionalLight3);

const rimLight = new THREE.DirectionalLight(0x4466ff, 0.3);
rimLight.position.set(-200, 0, -200);
scene.add(rimLight);

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let model = null;

// Loading indicator
const loadingDiv = document.createElement('div');
loadingDiv.className = 'loading';
loadingDiv.textContent = 'Loading model...';
container.appendChild(loadingDiv);

// Load FBX Model
const loader = new THREE.FBXLoader();

loader.load(
    'Models/Arrow V2.fbx',
    function (object) {
        model = object;
        
        console.log('Model loaded:', object);
        
        // Get model bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log('Model size:', size);
        
        // Center the model at origin
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // Position camera based on model size
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim * 1.0;
        
        // Update light positions based on model size
        directionalLight.position.set(maxDim, maxDim, maxDim);
        directionalLight2.position.set(-maxDim, maxDim, -maxDim);
        directionalLight3.position.set(0, -maxDim, 0);
        rimLight.position.set(-maxDim, 0, -maxDim);
        
        // Slightly darker material
        model.traverse(function (child) {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    metalness: 0.6,
                    roughness: 0.4,
                    side: THREE.DoubleSide
                });
            }
        });
        
        scene.add(model);
        loadingDiv.remove();
        
        console.log('Model added!');
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
        const targetRotationX = mouseY * 0.3;
        const targetRotationY = mouseX * 0.5;
        
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

animate();