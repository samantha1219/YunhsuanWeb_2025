// Three.js Scene Setup
let scene, camera, renderer, particles, projectSpheres = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let raycaster, mouse;
let currentSection = 0;
let isHeroSection = true;
let currentBackgroundImage = '';
let backgroundLayer, backgroundOverlay;

// Project data - 重新设计的美学位置布局
const projects = [
    {
        title: "Soundscape Mapping",
        description: " An immersive soundscape mapping project that transforms markets spaces into interactive audio-visual experiences, blending real-world sounds with digital projections.",
        position: { x: -400, y: 200, z: -120 },
        velocity: { x: 0.3, y: 1.8, z: 0.4 },
        // backgroundImage: "videos/東門聲景.mp4",\
        projectUrl: "Soundscape.html",
        videoPath: "videos/index_video/Soundscape_index.mp4", // 添加影片路徑
        size: 45, // 不同大小的球体
        glowColor: 0x75715e
    },
    {
        title: "Exisrtential Crisis",
        description: " A live audio performance that explores the intersection of generative art and sound, creating a dynamic auditory experience that evolves in real-time.",
        position: { x: 280, y: -120, z: -180 },
        velocity: { x: -0.4, y: 2.1, z: 0.3 },
        backgroundImage: "images/image1.jpg",
        videoPath: "videos/index_video/EC_intro.mp4",
        projectUrl: "EC.html",
        size: 75,
        glowColor: 0x75715e
    },
    {
        title: "A-life experiment",
        description: " It utilizes techno music as a medium, representing a form of technological spirituality. It explores the relationship between technology and spirituality, using techno music to create a unique auditory experience.",
        position: { x: -150, y: -180, z: 100 },
        velocity: { x: 0.5, y: 2.3, z: -0.3 },
        videoPath: "videos/index_video/A-life_index.mp4",
        projectUrl: "A-life.html", // 添加這行
        size: 50,
        glowColor: 0x75715e
    },
    {
        title: "Euphoria",
        description: "An interactive kinetic installation exploring the relationship between technology and human emotion.",
        position: { x: 200, y: 220, z: -100 },
        velocity: { x: -0.3, y: 1.9, z: 0.2 },
        backgroundImage: "images/Euphoria/euphoria01.jpg",
        // videoPath:"videos/index_video/Euphoria.mov", // 添加影片路徑
        size: 40,
        projectUrl: "Euphoria.html", // 添加這行
        glowColor:0x75715e
    },
    {
        title: "\"精神抖擻~!\"",
        description: "An audio-reactive installation that transforms space into an immersive concert experience, enveloping audiences in an electronic sound bath through rhythmic immersion to awaken desensitized spirits and encourage vigorous engagement with societal issues.",
        position: { x: 0, y: 180, z: -150 },
        velocity: { x: 0.2, y: 1.7, z: 0.5 },
        // backgroundImage: "images/quantum.jpg",
        videoPath: "videos/index_video/jing_index.mp4", // 添加影片路徑
        projectUrl: "Jing-SHIN.html", // 添加這行
        size: 60,
        glowColor: 0x75715e
    },
    {
        title: "The(樂)",
        description: "This audio-reactive animation is the result of interactive experimentation using TouchDesigner and Ableton. ",
        position: { x: -220, y: 20, z: 150 },
        velocity: { x: 0.6, y: 2.0, z: -0.4 },
        backgroundImage: "image1.jpg",
        videoPath: "videos/index_video/The_index.mp4", // 添加影片路徑
        projectUrl: "The.html",
        size: 52,
        glowColor: 0x75715e
    },
    {
        title: "CreaRapper",
        description: "The real-time interactive rap generator powered by Python connects physical devices to the digital realm.",
        position: { x: 300, y: -280, z: -10 },
        velocity: { x: -0.5, y: 2.4, z: 0.3 },
        // backgroundImage: "images/echo.jpg",
        videoPath: "videos/CreaRapper.mp4", // 添加影片路徑
        projectUrl: "CreaRapper.html", // 添加這行
        size: 38,
        glowColor: 0x75715e // 灰褐色发光
    },
    {
        title: "geneology",
        // description: "video installation that visualizes the evolution of digital art through generative algorithms, creating a living archive of artistic styles.",
        position: { x: 160, y: -280, z: -100 },
        velocity: { x: -0.5, y: 2.4, z: 0.3 },
        // backgroundImage: "images/echo.jpg",
        videoPath: "videos/geneology .mov",
        projectUrl: "geneology.html", // 添加這行
        size: 38,
        glowColor: 0x75715e // 灰褐色发光
    }
];

// 2. 創建簡單的影片播放器
let videoPlayer = null;
let currentVideoPath = '';
// 你的代碼中沒有定義這個變數
let backgroundVideo = null;

// 添加這個函數
function createBackgroundVideo() {
    if (!backgroundVideo) {
        backgroundVideo = document.createElement('video');
        backgroundVideo.style.position = 'fixed';
        backgroundVideo.style.top = '0';
        backgroundVideo.style.left = '0';
        backgroundVideo.style.width = '100%';
        backgroundVideo.style.height = '100%';
        backgroundVideo.style.objectFit = 'cover';
        backgroundVideo.style.opacity = '0';
        backgroundVideo.style.pointerEvents = 'none';
        backgroundVideo.style.zIndex = '-3';
        backgroundVideo.style.transition = 'opacity 0.8s ease';
        backgroundVideo.muted = true;
        backgroundVideo.loop = true;
        backgroundVideo.playsInline = true;
        
        document.body.appendChild(backgroundVideo);
    }
}
function createVideoPlayer() {
    if (!videoPlayer) {
        videoPlayer = document.createElement('video');
        videoPlayer.style.position = 'fixed';
        videoPlayer.style.top = '50%';
        videoPlayer.style.left = '50%';
        videoPlayer.style.transform = 'translate(-50%, -50%)';
        videoPlayer.style.width = '50vw';
        videoPlayer.style.height = 'auto';
        videoPlayer.style.maxHeight = '50vh';
        videoPlayer.style.borderRadius = '12px';
        videoPlayer.style.opacity = '0';
        videoPlayer.style.pointerEvents = 'none';
        videoPlayer.style.zIndex = '1500';
        videoPlayer.style.transition = 'opacity 0.3s ease';
        videoPlayer.muted = true;
        videoPlayer.loop = true;
        videoPlayer.playsInline = true;
        
        document.body.appendChild(videoPlayer);
    }
}

function showVideo(videoPath) {
    if (!videoPath) return;
    
    createVideoPlayer();
    
    // 只有當影片路徑改變時才重新載入
    if (currentVideoPath !== videoPath) {
        videoPlayer.src = videoPath;
        currentVideoPath = videoPath;
    }
    
    videoPlayer.style.opacity = '1';
    videoPlayer.play().catch(() => {
        // 如果自動播放失敗，忽略錯誤
    });
}

function hideVideo() {
    if (videoPlayer) {
        videoPlayer.style.opacity = '0';
        videoPlayer.pause();
    }
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Get background elements
    backgroundLayer = document.querySelector('.background-layer');
    backgroundOverlay = document.querySelector('.background-overlay');

    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Particle system
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 2000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
        
        const intensity = Math.random() * 0.3 + 0.4;
        colors.push(intensity, intensity, intensity);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create project spheres
    createProjectSpheres();

    // Mouse event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);

    // Scroll listener to detect section changes
    window.addEventListener('scroll', onScroll);

    animate();
}

function createProjectSpheres() {
    projects.forEach((project, index) => {
        let geometry;
        
        // 根据项目类型创建不同几何体
        switch(index % 7) {
            case 0: // Digital Meditation - 变形球体
                geometry = createMorphingSphere(project.size || 40);
                break;
            case 1: // Memory Palace - 复杂多面体
                geometry = new THREE.IcosahedronGeometry(project.size || 35, 2);
                break;
            case 2: // Code Symphony - 参数化螺旋
                geometry = createSpiralGeometry(project.size || 45);
                break;
            case 3: // Neural Garden - 有机形状
                geometry = createOrganicShape(project.size || 40);
                break;
            case 4: // Quantum Reflections - 量子几何
                geometry = createQuantumGeometry(project.size || 30);
                break;
            case 5: // Data Dreams - 数据可视化形状
                geometry = createDataVisualizationShape(project.size || 42);
                break;
            case 6: // Echo Chambers - 音波形状
                geometry = createSoundWaveGeometry(project.size || 38);
                break;
            default:
                geometry = new THREE.SphereGeometry(project.size || 40, 32, 32);
        }
        
        // 创建发光材质
        const material = new THREE.MeshBasicMaterial({
            color: project.glowColor || 0xffffff,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(project.position.x, project.position.y, project.position.z);
        // 同時需要在 createProjectSpheres 函數中初始化 isHovered 狀態
        // 在你現有的 sphere.userData 設定中添加：
        sphere.userData = { 
            projectIndex: index, 
            originalScale: 1,
            originalPosition: { ...project.position },
            velocity: { ...project.velocity },
            life: 1.0,
            active: true,
            isHovered: false, // 添加這行
            pulseSpeed: 0.5 + Math.random() * 0.5,
            rotationSpeed: { 
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            geometryType: index % 7
        };
        
        // 内发光球体
        const glowSize = (project.size || 40) * 0.9;
        const glowGeometry = new THREE.SphereGeometry(glowSize, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: project.glowColor || 0xffffff,
            transparent: true,
            opacity: 0.05
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        sphere.add(glowSphere);

        // 添加粒子效果
        addParticleSystem(sphere, project);

        projectSpheres.push(sphere);
        scene.add(sphere);
    });
}

// 变形球体 - 动态顶点变化
function createMorphingSphere(radius) {
    const geometry = new THREE.SphereGeometry(radius, 40, 40);
    const positions = geometry.attributes.position;
    
    // 添加噪声到顶点
    for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);
        
        const noise = Math.sin(vertex.x * 0.1) * Math.cos(vertex.y * 0.1) * 5;
        vertex.multiplyScalar(1 + noise * 0.1);
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geometry.attributes.position.needsUpdate = true;
    return geometry;
}

// 螺旋几何体
function createSpiralGeometry(radius) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    
    const rings = 20;
    const segments = 32;
    
    for (let ring = 0; ring < rings; ring++) {
        const y = (ring / rings - 0.5) * radius * 2;
        const currentRadius = radius * Math.sin((ring / rings) * Math.PI);
        const twist = ring * 0.5;
        
        for (let seg = 0; seg < segments; seg++) {
            const angle = (seg / segments) * Math.PI * 2 + twist;
            const x = Math.cos(angle) * currentRadius;
            const z = Math.sin(angle) * currentRadius;
            
            vertices.push(x, y, z);
        }
    }
    
    // 创建面
    for (let ring = 0; ring < rings - 1; ring++) {
        for (let seg = 0; seg < segments; seg++) {
            const current = ring * segments + seg;
            const next = ring * segments + ((seg + 1) % segments);
            const currentNext = (ring + 1) * segments + seg;
            const nextNext = (ring + 1) * segments + ((seg + 1) % segments);
            
            indices.push(current, next, currentNext);
            indices.push(next, nextNext, currentNext);
        }
    }
    
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    
    return geometry;
}

// 有机形状
function createOrganicShape(radius) {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);
        
        // 添加多层噪声创造有机感
        const noise1 = Math.sin(vertex.x * 0.05) * Math.cos(vertex.z * 0.05) * radius * 0.3;
        const noise2 = Math.sin(vertex.y * 0.1) * radius * 0.2;
        const noise3 = Math.random() * radius * 0.1;
        
        const length = vertex.length() + noise1 + noise2 + noise3;
        vertex.normalize().multiplyScalar(length);
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geometry.attributes.position.needsUpdate = true;
    return geometry;
}

// 量子几何体 - 多层嵌套
function createQuantumGeometry(radius) {
    const group = new THREE.Group();
    
    // 外层八面体
    const outerGeometry = new THREE.OctahedronGeometry(radius, 2);
    
    // 内层四面体
    const innerGeometry = new THREE.TetrahedronGeometry(radius * 0.6);
    
    // 合并几何体
    const finalGeometry = new THREE.BufferGeometry();
    const outerPositions = outerGeometry.attributes.position.array;
    const innerPositions = innerGeometry.attributes.position.array;
    
    const combinedVertices = new Float32Array(outerPositions.length + innerPositions.length);
    combinedVertices.set(outerPositions, 0);
    combinedVertices.set(innerPositions, outerPositions.length);
    
    finalGeometry.setAttribute('position', new THREE.BufferAttribute(combinedVertices, 3));
    return finalGeometry;
}

// 数据可视化形状
function createDataVisualizationShape(radius) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    // 创建数据点云
    for (let i = 0; i < 200; i++) {
        const x = (Math.random() - 0.5) * radius * 2;
        const y = (Math.random() - 0.5) * radius * 2;
        const z = (Math.random() - 0.5) * radius * 2;
        
        // 根据距离中心的远近调整位置 (数据聚类效果)
        const distance = Math.sqrt(x*x + y*y + z*z);
        const factor = distance < radius * 0.7 ? 1.2 : 0.8;
        
        vertices.push(x * factor, y * factor, z * factor);
        
        // 根据位置设置颜色
        colors.push(Math.random(), Math.random(), Math.random());
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
}

// 音波几何体
function createSoundWaveGeometry(radius) {
    const geometry = new THREE.RingGeometry(radius * 0.3, radius, 32, 8);
    const positions = geometry.attributes.position;
    
    // 创建波纹效果
    for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);
        
        const distance = vertex.length();
        const wave = Math.sin(distance * 0.1) * radius * 0.3;
        vertex.z += wave;
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geometry.attributes.position.needsUpdate = true;
    return geometry;
}

// 粒子系统
function addParticleSystem(parentSphere, project) {
    const particleCount = 15;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    
    for (let i = 0; i < particleCount; i++) {
        const radius = (project.size || 40) + 10 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
    }
    
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: project.glowColor || 0xffffff,
        size: 3,
        transparent: true,
        opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = { type: 'particles' };
    parentSphere.add(particles);
}

function onScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    const workSectionStart = windowHeight * 0.4;
    
    if (scrollY > workSectionStart && isHeroSection) {
        isHeroSection = false;
        projectSpheres.forEach(sphere => {
            sphere.userData.active = false;
        });
        // 停止背景影片
        changeBackground('', '');
    } else if (scrollY <= workSectionStart && !isHeroSection) {
        isHeroSection = true;
        resetSpheres();
    }
}

function resetSpheres() {
    projectSpheres.forEach((sphere, index) => {
        const project = projects[index];
        sphere.position.set(project.position.x, project.position.y, project.position.z);
        sphere.userData.life = 1.0;
        sphere.userData.active = true;
        sphere.material.opacity = 0.1;
        sphere.children[0].material.opacity = 0.05;
        sphere.scale.setScalar(1);
        sphere.visible = true;
    });
}

// 3. 修改 changeBackground 函數，加入影片支持
function changeBackground(imageUrl, videoUrl) {
    if (currentBackgroundImage === imageUrl && currentVideoPath === videoUrl) return;
    
    currentBackgroundImage = imageUrl;
    currentVideoPath = videoUrl || '';
    
    if (imageUrl || videoUrl) {
        // 如果有影片，優先顯示影片
        if (videoUrl) {
            createBackgroundVideo();
            backgroundVideo.src = videoUrl;
            backgroundVideo.style.opacity = '1';
            backgroundVideo.play().catch(() => {
                // 如果影片播放失敗，回退到背景圖片
                backgroundLayer.style.backgroundImage = `url('${imageUrl}')`;
                backgroundLayer.style.opacity = '1';
            });
            
            // 隱藏背景圖片
            backgroundLayer.style.opacity = '0';
        } else {
            // 只有背景圖片
            backgroundLayer.style.backgroundImage = `url('${imageUrl}')`;
            backgroundLayer.style.opacity = '1';
            
            // 隱藏背景影片
            if (backgroundVideo) {
                backgroundVideo.style.opacity = '0';
                backgroundVideo.pause();
            }
        }
        
        backgroundOverlay.classList.add('active');
    } else {
        // 淡出所有背景
        backgroundLayer.style.opacity = '0';
        if (backgroundVideo) {
            backgroundVideo.style.opacity = '0';
            backgroundVideo.pause();
        }
        backgroundOverlay.classList.remove('active');
        
        setTimeout(() => {
            if (backgroundLayer.style.opacity === '0') {
                backgroundLayer.style.backgroundImage = '';
            }
        }, 800);
    }
}


function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    // Only show tooltips in hero section
    if (!isHeroSection) {
        const tooltip = document.querySelector('.project-tooltip');
        tooltip.classList.remove('visible');
        changeBackground('', ''); // 清除背景圖片和影片
        return;
    }

    // Update mouse for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast for sphere hover
    raycaster.setFromCamera(mouse, camera);
    const activeSpheres = projectSpheres.filter(sphere => sphere.userData.active && sphere.visible);
    const intersects = raycaster.intersectObjects(activeSpheres);

    // Reset all spheres - 重置所有球體的狀態
    projectSpheres.forEach(sphere => {
        if (sphere.userData.active) {
            sphere.material.opacity = 0.1 * sphere.userData.life;
            sphere.scale.setScalar(1);
            sphere.children[0].material.opacity = 0.05 * sphere.userData.life;
            sphere.userData.isHovered = false; // 重置hover狀態
        }
    });

    const tooltip = document.querySelector('.project-tooltip');
    
    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const projectIndex = intersected.userData.projectIndex;
        const project = projects[projectIndex];

        // Highlight sphere
        intersected.material.opacity = 0.3 * intersected.userData.life;
        intersected.scale.setScalar(1.2);
        intersected.children[0].material.opacity = 0.15 * intersected.userData.life;
        intersected.userData.isHovered = true; // 標記為hover狀態

        // 修改：同時傳遞背景圖片和影片路徑
        changeBackground(project.backgroundImage, project.videoPath);

        // Show tooltip
        tooltip.querySelector('h3').textContent = project.title;
        tooltip.querySelector('p').textContent = project.description;
        tooltip.style.left = event.clientX + 20 + 'px';
        tooltip.style.top = event.clientY - 50 + 'px';
        tooltip.classList.add('visible');

        document.body.style.cursor = 'pointer';
    } else {
        // Reset background with fade effect
        changeBackground('', '');
        
        tooltip.classList.remove('visible');
        document.body.style.cursor = 'none';
    }
}
function onMouseClick(event) {
    if (!isHeroSection) return;

    raycaster.setFromCamera(mouse, camera);
    const activeSpheres = projectSpheres.filter(sphere => sphere.userData.active && sphere.visible);
    const intersects = raycaster.intersectObjects(activeSpheres);

    if (intersects.length > 0) {
        const projectIndex = intersects[0].object.userData.projectIndex;
        const project = projects[projectIndex];
        
        // Animate clicked sphere
        const sphere = intersects[0].object;
        sphere.scale.setScalar(1.5);
        setTimeout(() => {
            if (sphere.userData.active) sphere.scale.setScalar(1.2);
        }, 200);

        // 跳轉到項目指定的URL
        if (project.projectUrl) {
            window.location.href = project.projectUrl;
        } else {
            // 如果沒有指定URL，跳轉到projects頁面
            window.location.href = 'projects.html';
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particles based on mouse position
    particles.rotation.x += (mouseY * 0.00005);
    particles.rotation.y += (mouseX * 0.00005);

    // Gentle rotation
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0001;

    // Animate project spheres
    projectSpheres.forEach((sphere, index) => {
        const userData = sphere.userData;
        const time = Date.now() * 0.001;
        
        // 个性化旋转
        sphere.rotation.x += userData.rotationSpeed.x;
        sphere.rotation.y += userData.rotationSpeed.y;
        sphere.rotation.z += userData.rotationSpeed.z;
        
        if (userData.active) {
            // 檢查是否被hover - 如果被hover就不進行浮動動畫
            if (!userData.isHovered) {
                // 更有趣的浮动模式 - 8字形轨迹
                const floatRadius = 15;
                const speedOffset = index * 0.3;
                
                sphere.position.y += Math.sin((time + speedOffset) * userData.pulseSpeed) * 0.3;
                sphere.position.x += Math.cos((time + speedOffset) * userData.pulseSpeed * 0.7) * 0.2;
                sphere.position.z += Math.sin((time + speedOffset) * userData.pulseSpeed * 0.5) * 0.15;
                
                // 呼吸效果 - 球体大小变化（只在非hover時）
                const breathScale = 1 + Math.sin(time * userData.pulseSpeed * 2) * 0.05;
                sphere.scale.setScalar(breathScale);
                
                // 发光强度变化
                const glowIntensity = 0.1 + Math.sin(time * userData.pulseSpeed * 1.5) * 0.03;
                sphere.material.opacity = glowIntensity * userData.life;
            }
            // 如果被hover，保持當前位置和在onMouseMove中設定的縮放
            
            // 粒子环绕动画 - 無論是否hover都繼續
            const particleSystem = sphere.children.find(child => child.userData.type === 'particles');
            if (particleSystem) {
                particleSystem.rotation.y += 0.01;
                particleSystem.rotation.x += 0.005;
                
                // 粒子闪烁效果
                const particleOpacity = 0.4 + Math.sin(time * 3 + index) * 0.2;
                particleSystem.material.opacity = particleOpacity * userData.life;
            }
            
        } else {
            // Fade out animation - float upwards and disappear
            sphere.position.y += userData.velocity.y;
            sphere.position.x += userData.velocity.x;
            sphere.position.z += userData.velocity.z;
            
            // Decrease life (opacity)
            userData.life -= 0.008;
            
            if (userData.life <= 0) {
                sphere.visible = false;
                userData.life = 0;
            } else {
                sphere.material.opacity = 0.1 * userData.life;
                sphere.children[0].material.opacity = 0.05 * userData.life;
                
                // 粒子系统也跟着消失
                const particleSystem = sphere.children.find(child => child.userData.type === 'particles');
                if (particleSystem) {
                    particleSystem.material.opacity = 0.4 * userData.life;
                }
                
                // Add slight scaling effect as it fades
                const scale = 1 + (1 - userData.life) * 0.3;
                sphere.scale.setScalar(scale);
            }
        }
    });

    renderer.render(scene, camera);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Menu functionality
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const closeMenu = document.querySelector('.close-menu');

    menuButton.addEventListener('click', () => {
        menuOverlay.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });

    // Close menu when clicking outside
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    });

    // Close menu with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menuOverlay.classList.remove('active');
        }
    });

    // Handle menu navigation
    document.querySelectorAll('.menu-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's an internal anchor link
            if (href.startsWith('#')) {
                e.preventDefault();
                menuOverlay.classList.remove('active');
                
                if (href === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            } else {
                // External links (like projects.html) will navigate normally
                menuOverlay.classList.remove('active');
            }
        });
    });


    // Work items click handlers - 添加项目卡片点击功能
    document.querySelectorAll('.work-item').forEach(item => {
        item.addEventListener('click', function() {
            const projectNumber = this.getAttribute('data-project');
            const projectUrl = `project-${projectNumber}.html`;
            
            // 添加点击动画效果
            const card = this.querySelector('.work-item-card');
            card.style.transform = 'translateY(-8px) rotateX(1deg) rotateY(1deg) scale(0.98)';
            
            // 短暂延迟后跳转，让用户看到点击效果
            setTimeout(() => {
                window.location.href = projectUrl;
            }, 150);
        });
        
        // 添加键盘支持 (Enter键)
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
        
        // 让项目卡片可以通过Tab键聚焦
        item.setAttribute('tabindex', '0');
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('.work-item, .contact-link, h1, .menu-button');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Scroll animations
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
        
    // 只添加這個簡單的 CSS
    const videoCSS = `
        video {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
            video {
                width: 80vw !important;
                max-height: 40vh !important;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = videoCSS;
    document.head.appendChild(style);
    
    

    // Resize handler
    window.addEventListener('resize', () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Initialize Three.js scene
    init();
});