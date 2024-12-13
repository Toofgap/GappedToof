import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import { WebGLRenderer } from "three";
import gsap from 'gsap'

// Add event listener for the fullscreen button
document.addEventListener('keydown', (event) => {
  // Check if the 'F' key is pressed
  if (event.key === 'f' || event.key === 'F') {
    if (document.fullscreenElement) {
      // Exit fullscreen if already in fullscreen mode
      document.exitFullscreen();
    } else {
      // Request fullscreen for the canvas or entire body
      document.body.requestFullscreen();
    }
  }
});

window.addEventListener('load', function () {
  console.log('Page just loaded (load event)!');
  overlay.style.display = 'block'; // Show the overlay

});


//set up scene

const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);
renderer.shadowMap.enabled = true;  // Enable shadow map


const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const scene = new THREE.Scene();
camera.position.set(5, 6.01, 18);
camera.lookAt(-0.29552020666133955, 6.01, -0.955336489125606)

//ground
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2)
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true; 
scene.add(groundMesh);

// object
const monitorGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5, 2.5)
const monitorMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,  // You can choose any color
  opacity: 0,       // Set opacity to 0 (fully transparent)
  transparent: true // Enable transparency

})


const monitor = new THREE.Mesh(monitorGeo, monitorMaterial);
monitor.position.set(-8.4, 6.5, -6)
monitor.lookAt(0, 5, 14)
scene.add(monitor)

const bulletineGeo = new THREE.BoxGeometry(4.8, 4.1, 2)
const bulletineMaterial = new THREE.MeshStandardMaterial({
  color: 0xff2,
  opacity: 0,       // Set opacity to 0 (fully transparent)
  transparent: true // Enable transparency
})

const bulletine = new THREE.Mesh(bulletineGeo, bulletineMaterial);
bulletine.position.set(-11.8, 6.5, -2)
bulletine.lookAt(0, 6.5, -2)
scene.add(bulletine)

const book1Geo = new THREE.BoxGeometry(.4, 1.6, 2)
const cabinetMaterial = new THREE.MeshStandardMaterial({
  color: 0xff2,
  opacity: 0,       // Set opacity to 0 (fully transparent)
  transparent: true // Enable transparency
})

const book1 = new THREE.Mesh(book1Geo, cabinetMaterial);
book1.position.set(12, 8.85, -4.43)
book1.lookAt(0, 8.85, -4.43)
scene.add(book1)

const book2Geo = new THREE.BoxGeometry(.4, 1.6, 2)

const book2 = new THREE.Mesh(book2Geo, cabinetMaterial);
book2.position.set(12, 4.9, -4.3)
book2.lookAt(0, 4.9, -4.3)
scene.add(book2)

const book3Geo = new THREE.BoxGeometry(.4, 1.6, 2)

const book3 = new THREE.Mesh(book3Geo, cabinetMaterial);
book3.position.set(12, 6.8, -0.67)
book3.lookAt(0, 6.8, -0.67)
scene.add(book3)

const shelfGeo = new THREE.BoxGeometry(3, 1.5, 3)

const shelf1 = new THREE.Mesh(shelfGeo, cabinetMaterial);
shelf1.position.set(-10, 5, 6.8)
shelf1.lookAt(0, 5, 6.8)
scene.add(shelf1)

const shelf2 = new THREE.Mesh(shelfGeo, cabinetMaterial);
shelf2.position.set(-10, 7, 6.8)
shelf2.lookAt(0, 7, 6.8)
scene.add(shelf2)

const shelf3 = new THREE.Mesh(shelfGeo, cabinetMaterial);
shelf3.position.set(-10, 9, 6.8)
shelf3.lookAt(0, 9, 6.8)
scene.add(shelf3)

//lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight(0x93B2CA, 5, 100, Math.PI / 6, 0.1, );
spotlight.decay = 0;
spotlight.angle = Math.PI / 6; // 45-degree cone angle
spotlight.position.set(7, 10, -13);
spotlight.target.position.set(5, 0, 0);
spotlight.castShadow = true;  // Enable shadows on the light

scene.add(spotlight);
scene.add(spotlight.target)


const directionalLight = new THREE.DirectionalLight(0x90B626, 2);
directionalLight.position.set(-8, 6.5, -5.2);
directionalLight.target.position.set(0, 5, 14);
directionalLight.castShadow = true;  // Enable shadows on the light

directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;


scene.add(directionalLight);
scene.add(directionalLight.target)

const pointLight = new THREE.PointLight(0xffffff, 5)
pointLight.position.set(-3, 16.5, 4.4)
scene.add(pointLight)

//responsive window
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//load model
const gltfLoader = new GLTFLoader();

gltfLoader.load('/night_office/scene.gltf', (gltf) => {
  const office = gltf.scene;
  scene.add(office);
  console.log(scene); // Log entire scene object to the console

  office.scale.set(5, 5, 5); 
  office.position.set(0, 0, 0);
  office.lookAt(0, 0, -5)


  office.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      // clickableObjects.push(child);

      if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
          material.side = THREE.DoubleSide; // or THREE.FrontSide
        });
      } else if (child.material) {
        child.material.side = THREE.DoubleSide; // or THREE.FrontSide
      }
  }
  });

});

function cameraPostion(x, y, z) {
  gsap.to(camera.position, {
    x,
    y,
    z,
    duration: 1

  });
}

function cameraRotation(x, y, z) {
  gsap.to(camera.rotation, {
    x,
    y,
    z,
    duration: 1
  });
}




let position = 0;

const overlay = document.getElementById("overlay");

// Function to check if position is 0 and show the overlay
function checkPosition() {
  if (position === 2) {
    overlay.style.display = 'block'; // Show the overlay
  } else {
    overlay.style.display = 'none'; // Hide the overlay
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    console.log('Left Arrow key pressed');
    checkPosition()
    // Call your function for the left arrow key
    yourLeftArrowFunction();
  } else if (event.key === 'ArrowRight') {
    console.log('Right Arrow key pressed');
    checkPosition()
    // Call your function for the right arrow key
    yourRightArrowFunction();
  }
});

function yourLeftArrowFunction() {
  console.log('Left Arrow function called');
  console.log('current',position)

  switch(position) {
    case 0:

    cameraRotation(0, -0.8, 0);
    cameraPostion(-7.63, 6.01, 4.34);
    console.log('current',position)
      position = 1;
      break;

     case 1:

     cameraRotation(0, 0.8, 0);
     cameraPostion(2.78, 6.01, 10.20);
     console.log('current',position)
      position = 2;
      break;

     case 2:
      cameraRotation(0, 0.3, 0);
      cameraPostion(5, 6.01, 18);
      console.log('current',position)
      position = 0;
      break;
  }
}

function yourRightArrowFunction() {
  console.log('Right Arrow function called');

  switch(position) {
    case 0:
      cameraRotation(0, 0.8, 0);
      cameraPostion(2.78, 6.01, 10.20);
      position = 1;

      break;
     case 1:
      cameraRotation(0, -0.8, 0);
      cameraPostion(-7.63, 6.01, 4.34);
      position = 2;
      break;
     case 2:
      cameraRotation(0, 0.3, 0);
      cameraPostion(5, 6.01, 18);
      position = 0;
      break;
  }
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle mouse click
window.addEventListener('click', (event) => {
  // Normalize mouse coordinates to -1 to 1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set up the ray from the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Cast the ray and check for intersections with both objects
  const intersects = raycaster.intersectObjects([monitor, bulletine, shelf3, shelf2, shelf1, book1, book3, book2]);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object; // The first intersected object

    if (clickedObject === monitor) {
      console.log("Monitor clicked!");
      document.getElementById('popup-container').style.display = 'flex';
    } else if (clickedObject === bulletine) {
      console.log("bulletine clicked!");
      // Add your code here for shelf interaction
    } else if (clickedObject === shelf3) {
      document.getElementById('folder1').style.display = 'flex';
    } else if (clickedObject === shelf2) {
      document.getElementById('folder2').style.display = 'flex';
    } else if (clickedObject === shelf1) {
      document.getElementById('folder3').style.display = 'flex';
    } else if (clickedObject === book1) {
      document.getElementById('folder4').style.display = 'flex';
    } else if (clickedObject === book3) {
      document.getElementById('folder5').style.display = 'flex';
    } else if (clickedObject === book2) {
      document.getElementById('folder6').style.display = 'flex';
    } 
  }
});

document.getElementById('close-popup').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('popup-container').style.display = 'none';
});

document.getElementById('exitbtn1').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder1').style.display = 'none';
});
// Exit folder3 logic (close button)
document.getElementById('exitbtn2').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder2').style.display = 'none';
});
// Exit folder1 logic (close button)
document.getElementById('exitbtn3').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder3').style.display = 'none';
});
// Exit folder1 logic (close button)
document.getElementById('exitbtn4').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder4').style.display = 'none';
});
// Exit folder1 logic (close button)
document.getElementById('exitbtn5').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder5').style.display = 'none';
});
// Exit folder1 logic (close button)
document.getElementById('exitbtn6').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder6').style.display = 'none';
});
// window.addEventListener('click', onMouseClick);

// Get the tooltip element
const tooltip = document.getElementById('tooltip');

// Raycasting for hover effect
window.addEventListener('mousemove', (event) => {
  // Normalize mouse coordinates to -1 to 1
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set up the ray from the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Objects to check for intersections (you can add other objects to this array)
  const intersects = raycaster.intersectObjects([monitor, bulletine, shelf3, shelf2, shelf1, book1, book3, book2]);

  // Hide the tooltip if nothing is hovered
  tooltip.style.display = 'none';

  // If an object is intersected, show the tooltip with the appropriate text
  if (intersects.length > 0) {
    const hoveredObject = intersects[0].object;
    let tooltipText = '';

    if (hoveredObject === monitor) {
      tooltipText = 'Monitor';
    } else if (hoveredObject === shelf3) {
      tooltipText = 'Portfolio 1';
    } else if (hoveredObject === shelf2) {
      tooltipText = 'Portfolio 2';
    } else if (hoveredObject === shelf1) {
      tooltipText = 'Portfolio 3';
    } else if (hoveredObject === book1) {
      tooltipText = 'Portfolio 4';
    } else if (hoveredObject === book3) {
      tooltipText = 'Portfolio 5';
    } else if (hoveredObject === book2) {
      tooltipText = 'Portfolio 6';
    } else if (hoveredObject === bulletine) {
      tooltipText = 'Bulletine';
    } 

    // Update and position the tooltip
    tooltip.textContent = tooltipText;
    tooltip.style.display = 'block';
    tooltip.style.left = `${event.clientX + 10}px`; // Position tooltip slightly offset
    tooltip.style.top = `${event.clientY + 10}px`;
  }
});
//animate
function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();