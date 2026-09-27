/* ================================================================
   3D SCENE — Mũ tốt nghiệp Three.js
   Chỉ load trên desktop, lazy load, tối ưu cho performance
================================================================ */
import * as THREE from 'three';

export function init3DCap() {
    const container = document.getElementById('hero-3d');
    if (!container) return;

    // ==== Check WebGL support ====
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
        console.log('❌ WebGL không hỗ trợ — bỏ qua 3D');
        return;
    }

    // ==== Scene ====
    const scene = new THREE.Scene();

    // ==== Camera ====
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );
    camera.position.set(0, 0.8, 6.5);
    camera.lookAt(0, 0, 0);

    // ==== Renderer ====
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2, // tắt AA trên màn retina để nhẹ
        powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Giới hạn pixel ratio <= 1.5 để nhẹ
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ==== Lights ====
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const light1 = new THREE.PointLight(0xff2d95, 8, 30);
    light1.position.set(4, 4, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x00e5ff, 6, 30);
    light2.position.set(-4, -2, 5);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xffd60a, 4, 30);
    light3.position.set(0, 5, -3);
    scene.add(light3);

    // ==== Group chứa mũ ====
    const capGroup = new THREE.Group();
    scene.add(capGroup);

    // ==== Mũ tốt nghiệp 3D (low-poly) ====

    // 1) Board (đỉnh mũ) — hình thoi dẹt
    const boardGeo = new THREE.BoxGeometry(2.6, 0.12, 2.6);
    const boardMat = new THREE.MeshStandardMaterial({
        color: 0x0a0524,
        metalness: 0.6,
        roughness: 0.3,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.rotation.y = Math.PI / 4;
    capGroup.add(board);

    // Viền vàng quanh board
    const edgeGeo = new THREE.EdgesGeometry(boardGeo);
    const edgeMat = new THREE.LineBasicMaterial({
        color: 0xffd60a,
        linewidth: 1,
    });
    const edge = new THREE.LineSegments(edgeGeo, edgeMat);
    edge.rotation.y = Math.PI / 4;
    edge.scale.set(1.02, 1.02, 1.02);
    capGroup.add(edge);

    // 2) Base (chân mũ) — cylinder
    const baseGeo = new THREE.CylinderGeometry(0.7, 0.78, 0.85, 32);
    const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0a0524,
        metalness: 0.6,
        roughness: 0.3,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.5;
    capGroup.add(base);

    // 3) Button on top
    const buttonGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const buttonMat = new THREE.MeshStandardMaterial({
        color: 0xffd60a,
        metalness: 0.9,
        roughness: 0.2,
    });
    const button = new THREE.Mesh(buttonGeo, buttonMat);
    button.position.set(0, 0.15, 0);
    capGroup.add(button);

    // 4) Tassel cord
    const cordGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8);
    const cordMat = new THREE.MeshStandardMaterial({
        color: 0xffd60a,
        metalness: 0.7,
        roughness: 0.3,
    });
    const cord = new THREE.Mesh(cordGeo, cordMat);
    cord.position.set(1.05, -0.15, 0);
    cord.rotation.z = 0.15;
    capGroup.add(cord);

    // 5) Tassel ball
    const ballGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
        color: 0xffd60a,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xffd60a,
        emissiveIntensity: 0.3,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(1.05, -1, 0);
    capGroup.add(ball);

    // 6) Vòng tròn ánh sáng quanh mũ (halo)
    const ringGeo = new THREE.TorusGeometry(2.4, 0.02, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.position.y = -0.3;
    capGroup.add(ring);

    // 7) Các hạt 3D bay quanh
    const particleCount = 30;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const palette = [
        [1, 0.18, 0.58],    // magenta
        [0.66, 0.33, 0.97], // purple
        [0, 0.9, 1],        // cyan
        [1, 0.84, 0.04],    // yellow
    ];

    for (let i = 0; i < particleCount; i++) {
        const radius = 2.5 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

        const c = palette[Math.floor(Math.random() * palette.length)];
        particleColors[i * 3] = c[0];
        particleColors[i * 3 + 1] = c[1];
        particleColors[i * 3 + 2] = c[2];
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    capGroup.add(particles);

    // ==== Interaction: chuột + cảm ứng ====
    let targetRotX = 0;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const updateMouse = (clientX, clientY) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
        targetRotY = mouseX * 0.6;
        targetRotX = mouseY * 0.3;
    };

    window.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // ==== Animation loop (chỉ chạy khi hero visible) ====
    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(container);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return; // tiết kiệm CPU khi cuộn xuống

        const t = clock.getElapsedTime();

        // Xoay mũ liên tục + nghiêng theo chuột
        capGroup.rotation.y += (targetRotY + t * 0.25 - capGroup.rotation.y) * 0.05;
        capGroup.rotation.x += (targetRotX + Math.sin(t * 0.6) * 0.08 - capGroup.rotation.x) * 0.05;

        // Nhấp nhô nhẹ
        capGroup.position.y = Math.sin(t * 1.2) * 0.12;

        // Xoay hạt + vòng
        particles.rotation.y = t * 0.15;
        particles.rotation.x = t * 0.08;
        ring.rotation.z = t * 0.4;

        renderer.render(scene, camera);
    }
    animate();

    // ==== Resize ====
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }, 200);
    });
}