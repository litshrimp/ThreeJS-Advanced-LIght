import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setRendererEncoding, setTextureEncoding } from './utils.js';
import ErrorHandler from './ErrorHandler.js';
import LoadingManager from './LoadingManager.js';
// 从原生three中导入FontLoader和TextGeometry
// import { FontLoader } from '../../node_modules/three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from '../../node_modules/three/examples/jsm/geometries/TextGeometry.js';

export default class AdvancedRenderScene {
  constructor(canvas) {
    // 基本属性
    this.canvas = canvas;
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // 预设光照参数
    this.lightColor = new THREE.Color('#ff115e');
    this.lightStrength = 1.5;
    
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
    
    // 创建加载管理器
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
    console.log('Starting asset loading (Advanced Scene)...');
    
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
    
    // 创建光照贴图 (可选)
    const lightMapPath = '../../static/advanced-render/textures/testAdvancedRender_lightmap.png';
    console.log('Trying to load light map from:', lightMapPath);
    
    this.lightMapTexture = textureLoader.load(
      lightMapPath, 
      (texture) => {
        console.log('Light map loaded successfully');
        // 确保在光照贴图加载完成后再创建着色器材质
        this.createShaderMaterial(true); // 传入true表明光照贴图已加载
        
        // 如果模型已加载，应用材质
        if (this.model) {
          this.model.traverse((child) => {
            if (child.isMesh) {
              child.material = this.shaderMaterial;
            }
          });
        }
      },
      undefined,
      (error) => {
        console.warn('Light map failed to load:', error);
        console.log('Will proceed without light map');
        // 创建无光照贴图的简化版材质
        this.createShaderMaterial(false);
      }
    );
    this.lightMapTexture.flipY = false;
    
    // 创建基础材质
    this.material = new THREE.MeshBasicMaterial({ map: this.bakedTexture });
    
    // 加载模型
    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.load(
      '../../static/advanced-render/models/testAdvancedRender.glb',
      (gltf) => {
        console.log('Model loaded');
        this.model = gltf.scene;
        
        // 应用材质 - 如果着色器材质已创建则使用，否则使用基础材质
        this.model.traverse((child) => {
          if (child.isMesh) {
            // 如果着色器材质已经创建，则使用它
            if (this.shaderMaterial) {
              child.material = this.shaderMaterial;
            } else {
              // 否则先使用基础材质，等着色器材质创建好后会更新
              child.material = this.material;
            }
          }
        });
        
        // 添加到场景
        this.scene.add(this.model);
      }
    );
  }
  
  // 创建默认光照贴图
  createDefaultLightMap() {
    console.log('Creating default light map');
    // 创建一个1x1像素的纯黑色纹理作为默认光照贴图
    const data = new Uint8Array([0, 0, 0, 255]);  // r, g, b, a
    const defaultTexture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    defaultTexture.needsUpdate = true;
    return defaultTexture;
  }
  
  // 创建自定义着色器材质
  createShaderMaterial(hasLightMap) {
    if (!hasLightMap) {
      console.log('No light map available, using default');
      this.lightMapTexture = this.createDefaultLightMap();
    } else {
      console.log('Using loaded light map texture');
    }
    
    // 着色器代码
    let fragmentShader;
    if (hasLightMap) {
      console.log('Creating shader with light map support');
      // 有光照贴图的版本
      fragmentShader = `
        uniform sampler2D uBakedTexture;
        uniform sampler2D uLightMapTexture;
        uniform vec3 uLightColor;
        uniform float uLightStrength;
        
        varying vec2 vUv;
        
        // 简化的lighten混合模式
        vec3 lighten(vec3 base, vec3 blend, float opacity) {
          vec3 lightened = max(base, blend);
          return mix(base, lightened, opacity);
        }
        
        void main() {
          // 基础烘焙颜色
          vec3 bakedColor = texture2D(uBakedTexture, vUv).rgb;
          
          // 从光照贴图中获取光照信息 (R通道)
          float lightMask = texture2D(uLightMapTexture, vUv).r;
          
          // 应用光照效果
          vec3 finalColor = lighten(bakedColor, uLightColor, lightMask * uLightStrength);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;
    } else {
      console.log('No light map texture found, using simplified shader');
      // 没有光照贴图的简化版本
      fragmentShader = `
        uniform sampler2D uBakedTexture;
        uniform vec3 uLightColor;
        uniform float uLightStrength;
        
        varying vec2 vUv;
        
        void main() {
          // 基础烘焙颜色
          vec3 bakedColor = texture2D(uBakedTexture, vUv).rgb;
          
          // 直接输出烘焙贴图
          gl_FragColor = vec4(bakedColor, 1.0);
        }
      `;
    }
    
    // 创建材质
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uBakedTexture: { value: this.bakedTexture },
        uLightMapTexture: { value: this.lightMapTexture },
        uLightColor: { value: this.lightColor },
        uLightStrength: { value: this.lightStrength }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: fragmentShader
    });
    
    console.log('Shader material created with light color:', this.lightColor, 'and strength:', this.lightStrength);
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
  
  // 更新光照颜色
  updateLightColor(color) {
    console.log('Updating light color to:', color);
    
    // 无论着色器材质是否存在，都更新颜色值
    this.lightColor.set(color);
    
    // 如果着色器材质已创建，则更新uniform
    if (this.shaderMaterial) {
      this.shaderMaterial.uniforms.uLightColor.value = this.lightColor;
      this.shaderMaterial.uniformsNeedUpdate = true;
    } else {
      console.log('Stored light color for later use when shader is created');
    }
  }
  
  // 更新光照强度
  updateLightStrength(strength) {
    console.log('Updating light strength to:', strength);
    
    // 无论着色器材质是否存在，都更新强度值
    this.lightStrength = strength;
    
    // 如果着色器材质已创建，则更新uniform
    if (this.shaderMaterial) {
      this.shaderMaterial.uniforms.uLightStrength.value = this.lightStrength;
      this.shaderMaterial.uniformsNeedUpdate = true;
    } else {
      console.log('Stored light strength for later use when shader is created');
    }
  }
} 