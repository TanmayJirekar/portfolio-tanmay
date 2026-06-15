/**
 * three-hero.js 
 * Cinematic 3D Character Background - Futuristic Green Aesthetic
 */

const canvas = document.getElementById('hero-3d-bg');
const scene = new THREE.Scene();

// Cinematic Dark Backdrop (Works perfectly with CSS screen blend mode to overlay existings)
scene.background = new THREE.Color(0x020608); // Very dark teal
scene.fog = new THREE.FogExp2(0x020608, 0.15); // Adds depth and "slight blur" look to background

// --- 1. THEATER & CAMERA SETUP --- //
// Narrow cinematic FoV (45)
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.2, 3.8); 

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true, 
    powerPreference: "high-performance" 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3; // Boosted slightly for neon effect

// --- 2. CINEMATIC LIGHTING (GREEN/CYAN NEON THEME) --- //
const ambientLight = new THREE.AmbientLight(0x112233, 1.5); 
scene.add(ambientLight);

// Laptop Glow (Cyan/Teal) reflecting on face
const laptopGlow = new THREE.PointLight(0x00ffff, 1.8, 4);
laptopGlow.position.set(1.4, 0.8, 0.2); // Positioned perfectly on right side
scene.add(laptopGlow);

// Neon Green Rim Light from Top Left/Back
const rimLightGreen = new THREE.DirectionalLight(0x00ff88, 3.5);
rimLightGreen.position.set(-3, 3, -1);
scene.add(rimLightGreen);

// Soft Cyan Fill Light from Right
const fillLightCyan = new THREE.DirectionalLight(0x00aaff, 1.2);
fillLightCyan.position.set(3, 1, 2);
scene.add(fillLightCyan);

// --- 3. BACKGROUND EFFECTS (PARTICLES & STREAKS) --- //
// Glowing Floating Particles
const particleGeo = new THREE.BufferGeometry();
const particleCount = 200;
const posArray = new Float32Array(particleCount * 3);
for(let i=0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15; // Wide spread
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x00ffaa,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Moving Data Streaks
const streakGroup = new THREE.Group();
const streakMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
for(let i=0; i<15; i++) {
    const streakGeo = new THREE.PlaneGeometry(Math.random() * 4 + 1, 0.02);
    const streak = new THREE.Mesh(streakGeo, streakMat);
    // Push streaks mostly behind the character
    streak.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.3) * 4, (Math.random() - 0.5) * -5 - 2);
    streak.userData.speed = Math.random() * 0.08 + 0.02;
    streakGroup.add(streak);
}
scene.add(streakGroup);

// --- 4. MODEL LOADING & FALLBACK --- //
let mixer; 
let clock = new THREE.Clock();
let characterModel;

const loadingManager = new THREE.LoadingManager();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
const gltfLoader = new THREE.GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

function loadCharacterModel() {
    gltfLoader.load(
        'public/professional_developer.glb',
        (gltf) => {
            characterModel = gltf.scene;
            // Force it to the RIGHT side so text on LEFT is clear
            characterModel.position.set(1.4, -0.8, -0.5); 
            characterModel.scale.set(1.1, 1.1, 1.1);
            characterModel.rotation.y = -Math.PI / 10; // angled towards the center
            scene.add(characterModel);

            if(gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(characterModel);
                gltf.animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    action.play();
                });
            }
        },
        undefined,
        (error) => {
            console.warn('Loading cinematic procedural fallback model...');
            createFallbackModel(); // Procedurally builds the developer if no .glb is found
        }
    );
}

// Cinematic Procedural Generator
function createFallbackModel() {
    characterModel = new THREE.Group();
    
    // High-End Materials mapping exactly to reference image
    const skinMat = new THREE.MeshStandardMaterial({color: 0xffd1b3, roughness: 0.4});
    const hairMat = new THREE.MeshStandardMaterial({color: 0x221111, roughness: 0.8}); // Dark modern hair
    const shirtMat = new THREE.MeshStandardMaterial({color: 0xf4f6f8, roughness: 0.6}); // Crisp white shirt
    const blazerMat = new THREE.MeshStandardMaterial({color: 0x1d3674, roughness: 0.8}); // Deep blue premium blazer
    const laptopMat = new THREE.MeshStandardMaterial({color: 0x050505, metalness: 0.5, roughness: 0.2}); 
    const screenMat = new THREE.MeshBasicMaterial({color: 0x00ffcc}); // Bright cyan screen glow
    const glassMat = new THREE.MeshStandardMaterial({color: 0x000000, roughness:0.1, metalness:0.9}); // Dark frames

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.3, 16), skinMat);
    neck.position.y = 1.05;
    characterModel.add(neck);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), skinMat);
    head.position.y = 1.35;
    characterModel.add(head);

    // Chin/Jaw
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.35), skinMat);
    jaw.position.set(0, 1.2, 0.12);
    characterModel.add(jaw);

    // Hair (Premium sweep styling)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.37, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7), hairMat);
    hair.position.y = 1.38;
    hair.position.z = -0.05;
    hair.rotation.x = -0.1;
    characterModel.add(hair);

    // Glasses Frames
    const glassesFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.02), glassMat);
    glassesFrameL.position.set(-0.16, 1.38, 0.36);
    characterModel.add(glassesFrameL);
    
    const glassesFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.02), glassMat);
    glassesFrameR.position.set(0.16, 1.38, 0.36);
    characterModel.add(glassesFrameR);
    
    // Connectors
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), glassMat);
    bridge.position.set(0, 1.38, 0.36);
    characterModel.add(bridge);

    // Torso (Blazer)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.42, 1.0, 32), blazerMat);
    torso.position.y = 0.5;
    characterModel.add(torso);
    
    // Shirt chest piece
    const shirtChest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.4), shirtMat);
    shirtChest.position.set(0, 0.5, 0.3);
    characterModel.add(shirtChest);

    // Shoulders
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), blazerMat);
    shoulderL.position.set(-0.46, 0.85, 0);
    characterModel.add(shoulderL);
    
    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), blazerMat);
    shoulderR.position.set(0.46, 0.85, 0);
    characterModel.add(shoulderR);

    // Arms
    const armL = new THREE.Group();
    armL.position.set(-0.48, 0.85, 0);
    const bicepL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.45, 16), blazerMat);
    bicepL.position.y = -0.22;
    armL.add(bicepL);
    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.45, 16), blazerMat);
    forearmL.position.set(0, -0.6, 0.2);
    forearmL.rotation.x = -Math.PI / 3;
    armL.add(forearmL);
    const handL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.1), skinMat);
    handL.position.set(0, -0.8, 0.45);
    handL.rotation.x = -Math.PI / 4;
    armL.add(handL);
    characterModel.add(armL);
    
    const armR = new THREE.Group();
    armR.position.set(0.48, 0.85, 0);
    const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.45, 16), blazerMat);
    bicepR.position.y = -0.22;
    armR.add(bicepR);
    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.45, 16), blazerMat);
    forearmR.position.set(0, -0.6, 0.2);
    forearmR.rotation.x = -Math.PI / 3;
    armR.add(forearmR);
    const handR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.1), skinMat);
    handR.position.set(0, -0.8, 0.45);
    handR.rotation.x = -Math.PI / 4;
    armR.add(handR);
    characterModel.add(armR);

    // High End Wooden Desk
    const deskMat = new THREE.MeshStandardMaterial({color: 0x2e1a10, roughness: 0.3});
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 1.2), deskMat);
    scene.add(desk);

    // Laptop
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.6), laptopMat);
    scene.add(laptopBase);
    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.03), laptopMat);
    laptopScreen.rotation.x = -Math.PI / 10;
    scene.add(laptopScreen);
    const screenInner = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.55), screenMat);
    screenInner.rotation.x = -Math.PI / 10;
    scene.add(screenInner);

    // IMPORTANT: POSITIONING ON RIGHT SIDE (Responsive)
    // Offset all items far to the right (+X) and back (-Z)
    characterModel.position.set(1.4, -0.8, -0.5); 
    characterModel.scale.set(1.15, 1.15, 1.15); // Match the powerful shoulder vibe
    characterModel.rotation.y = -Math.PI / 8; // angled gracefully left
    scene.add(characterModel);
    
    // Attach scene props to the model right offset
    desk.position.set(1.4, 0, 0.2);
    laptopBase.position.set(1.4, 0.03, 0.1);
    laptopScreen.position.set(1.4, 0.3, -0.18);
    screenInner.position.set(1.4, 0.3, -0.16);

    mixer = {
        update: (delta) => {
            const time = clock.getElapsedTime();
            // Typing
            armL.rotation.z = Math.sin(time * 15) * 0.02;
            forearmL.rotation.x = -Math.PI / 3 + Math.sin(time * 20) * 0.04;
            armR.rotation.z = Math.cos(time * 18) * 0.02;
            forearmR.rotation.x = -Math.PI / 3 + Math.cos(time * 25) * 0.04;
            
            // Posture Breathing
            torso.scale.y = 1 + Math.sin(time * 2) * 0.01;
            head.position.y = 1.35 + Math.sin(time * 2) * 0.01;
            jaw.position.y = 1.2 + Math.sin(time * 2) * 0.01;
            hair.position.y = 1.38 + Math.sin(time * 2) * 0.01;
            glassesFrameL.position.y = 1.38 + Math.sin(time * 2) * 0.01;
            glassesFrameR.position.y = 1.38 + Math.sin(time * 2) * 0.01;
            bridge.position.y = 1.38 + Math.sin(time * 2) * 0.01;
        }
    }
    
    // Store references for the resize handler so mobile pushes it down appropriately
    characterModel.userData.desk = desk;
    characterModel.userData.laptopBase = laptopBase;
    characterModel.userData.laptopScreen = laptopScreen;
    characterModel.userData.screenInner = screenInner;
}

// --- 5. INTERACTIVITY & RESPONSIVENESS --- //
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    // Very subtle mouse tracking
    mouseX = (event.clientX - windowHalfX) * 0.0003;
    mouseY = (event.clientY - windowHalfY) * 0.0003;
});

window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 768;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Responsive Placement
    if (characterModel) {
        if (isMobile) {
            // Mobile: Center, scale down slightly
            characterModel.position.set(0, -1.2, -1);
            if(characterModel.userData.desk) {
                characterModel.userData.desk.position.set(0, -0.4, -0.3);
                characterModel.userData.laptopBase.position.set(0, -0.37, -0.4);
                characterModel.userData.laptopScreen.position.set(0, -0.1, -0.68);
                characterModel.userData.screenInner.position.set(0, -0.1, -0.66);
            }
        } else {
            // Desktop: Strongly to the RIGHT (Leaves text on Left highly visible)
            characterModel.position.set(1.4, -0.8, -0.5);
            if(characterModel.userData.desk) {
                characterModel.userData.desk.position.set(1.4, 0, 0.2);
                characterModel.userData.laptopBase.position.set(1.4, 0.03, 0.1);
                characterModel.userData.laptopScreen.position.set(1.4, 0.3, -0.18);
                characterModel.userData.screenInner.position.set(1.4, 0.3, -0.16);
            }
        }
    }
});

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    
    if (mixer) mixer.update(delta);

    // Animate Particles
    const positions = particles.geometry.attributes.position.array;
    for(let i=1; i < particleCount*3; i+=3) {
        positions[i] += 0.003; // Smooth slow floating
        if(positions[i] > 6) positions[i] = -6; // Loop back exactly seamlessly
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Animate Data Streaks
    streakGroup.children.forEach(streak => {
        streak.position.x += streak.userData.speed;
        if(streak.position.x > 8) streak.position.x = -8;
    });

    // Cinematic Parallax on camera based on mouse
    targetX = mouseX;
    targetY = mouseY;
    camera.position.x += 0.05 * (targetX - camera.position.x);
    camera.position.y += 0.05 * (1.2 + targetY - camera.position.y);
    camera.lookAt(0, 0.6, 0);

    renderer.render(scene, camera);
}

// Lazy start to prevent lockups with text
window.addEventListener('load', () => {
    setTimeout(() => {
        loadCharacterModel();
        animate();
        window.dispatchEvent(new Event('resize')); 
    }, 500);
});
