document.addEventListener('DOMContentLoaded', () => {

  fetch('header.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) headerPlaceholder.innerHTML = html;
    })
    .catch(err => {
      console.error('Failed to load header:', err);
    });

  const mobileMenuButton = document.querySelector('.md\\:hidden');
  const navMenu = document.querySelector('nav');

  if (mobileMenuButton && navMenu) {
    mobileMenuButton.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
      navMenu.classList.toggle('flex');
      navMenu.classList.toggle('flex-col');
      navMenu.classList.toggle('absolute');
      navMenu.classList.toggle('top-16');
      navMenu.classList.toggle('left-0');
      navMenu.classList.toggle('right-0');
      navMenu.classList.toggle('bg-white');
      navMenu.classList.toggle('p-4');
      navMenu.classList.toggle('shadow-lg');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth',
        });
        if (navMenu && !navMenu.classList.contains('hidden')) {
          navMenu.classList.add('hidden');
        }
      }
    });
  });

  // --- Three.js 3D Bottle initialization ---
  const container = document.getElementById('bottle-container');
  if (container) {
    // Nettoyer au cas où le renderer est déjà présent
    while (container.firstChild) container.removeChild(container.firstChild);

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lumière
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // Flacon géométrique : corps + bouchon
    const bottleMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
    });

    const bottleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 2, 32),
      bottleMaterial
    );
    scene.add(bottleBody);

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x222831 })
    );
    cap.position.y = 1.2;
    scene.add(cap);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      bottleBody.rotation.y += 0.01;
      cap.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    // Responsive
    window.addEventListener('resize', () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    });
  }
});

// --- Scroll header behavior (en dehors de DOMContentLoaded car scroll existe après) ---
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const logo = document.querySelector('.logo-font');
  const logo2 = document.querySelector('.logo-part');
  const langue = document.querySelector('.btn-langue');

  if (!header || !logo || !logo2 || !langue) return;

  if (window.scrollY > 50) {
    header.classList.add('bg-white', 'shadow-lg', 'translate-y-0');
    header.classList.remove('bg-transparent');

    logo.classList.remove('text-white');
    logo.classList.add('text-teal');

    logo2.classList.remove('text-white');
    logo2.classList.add('text-red');

    langue.classList.remove('text-white');
    langue.classList.add('text-gray-900');

    langue.classList.remove('border-white');
    langue.classList.add('border-gray-900');

    navLinks.forEach(link => {
      link.classList.remove('text-white');
      link.classList.add('text-gray-900');
    });
  } else {
    header.classList.add('bg-transparent');
    header.classList.remove('bg-white', 'shadow-lg', 'translate-y-0');

    logo.classList.remove('text-teal');
    logo.classList.add('text-white');

    logo2.classList.remove('text-red');
    logo2.classList.add('text-white');

    langue.classList.add('text-white');
    langue.classList.remove('text-gray-900');

    langue.classList.add('border-white');
    langue.classList.remove('border-gray-900');

    navLinks.forEach(link => {
      link.classList.remove('text-gray-900');
      link.classList.add('text-white');
    });
  }
});


// Only load when container exists
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bottle-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    const loader = new THREE.GLTFLoader();
    loader.load(
    'https://models.readyplayer.me/61e71a67d6dc88001c9f0377.glb',
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        scene.add(model);

        // Animation simple de rotation
        function animate() {
        requestAnimationFrame(animate);
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
        }
        animate();
    },
    undefined,
    function (error) {
        console.error('Erreur chargement 3D :', error);
    }
    );

    // Responsive
    window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    });
});


const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3f4f6); // couleur claire

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const container = document.getElementById('bottle-container');
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lumière
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 1).normalize();
  scene.add(light);

  // Forme du flacon - corps (cylindre) + tête (sphère)
  const bottleMaterial = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });

  // Corps du flacon
  const bottleBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.6, 2, 32),
    bottleMaterial
  );
  scene.add(bottleBody);

  // Bouchon
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x222831 })
  );
  cap.position.y = 1.2;
  scene.add(cap);

  // Animation
  function animate() {
    requestAnimationFrame(animate);
    bottleBody.rotation.y += 0.01;
    cap.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  // Responsive
  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  function toggleList(button) {
    const list = button.nextElementSibling;
    list.classList.toggle('hidden');
    
    if (list.classList.contains('hidden')) {
      button.textContent = 'Learn more';
    } else {
      button.textContent = 'Learn less';
    }
  }
  
