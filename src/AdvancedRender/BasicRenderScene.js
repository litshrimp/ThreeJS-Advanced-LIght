import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setRendererEncoding, setTextureEncoding } from './utils.js';
import ErrorHandler from './ErrorHandler.js';
import LoadingManager from './LoadingManager.js';
// 从原生three中导入FontLoader和TextGeometry
// import { FontLoader } from '../../node_modules/three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from '../../node_modules/three/examples/jsm/geometries/TextGeometry.js';

export default class BasicRenderScene {
  constructor(canvas) {
    // 基本属性
    this.canvas = canvas;
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // 创建场景
    this.scene = new THREE.Scene();
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
    this.camera.position.set(4, 2, 4);
    this.scene.add(this.camera);
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    setRendererEncoding(this.renderer);
    
    // 创建控制器
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    
    // 创建加载管理器（传递scene用于错误处理）
    this.loadingManager = new LoadingManager();
    
    // 加载资源
    this.loadAssets();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => this.resize());
    
    // 启动动画循环
    this.animate();
  }
  
  // 加载模型和贴图
  loadAssets() {
    console.log('Starting asset loading...');
    
    // 使用加载管理器
    const manager = this.loadingManager.getManager();
    
    // 加载贴图
    const textureLoader = new THREE.TextureLoader(manager);
    this.bakedTexture = textureLoader.load(
      '../../static/advanced-render/textures/testAdvancedRender.png', 
      (texture) => {
        console.log('Baked texture loaded successfully');
        setTextureEncoding(texture);
      }
    );
    this.bakedTexture.flipY = false;
    setTextureEncoding(this.bakedTexture);
    
    // 创建材质
    this.material = new THREE.MeshBasicMaterial({ 
      map: this.bakedTexture 
    });
    
    // 加载模型
    console.log('Loading GLB model from:', '../../static/advanced-render/models/testAdvancedRender.glb');
    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.load(
      '../../static/advanced-render/models/testAdvancedRender.glb',
      (gltf) => {
        console.log('Model loaded');
        this.model = gltf.scene;
        
        // 应用材质
        this.model.traverse((child) => {
          if (child.isMesh) {
            child.material = this.material;
          }
        });
        
        // 添加到场景
        this.scene.add(this.model);
      }
    );
  }
  
  // 处理窗口大小变化
  resize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  // 动画循环
  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.animate());
  }
} 