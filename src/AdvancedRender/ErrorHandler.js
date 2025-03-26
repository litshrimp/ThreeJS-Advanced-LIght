import * as THREE from 'three';

/**
 * 错误处理类，用于显示友好的错误信息
 */
export default class ErrorHandler {
  /**
   * 在场景中创建错误提示
   * @param {THREE.Scene} scene - Three.js场景
   * @param {string} message - 错误信息
   */
  static showErrorMessage(scene, message) {
    // 创建一个红色的矩形作为背景
    const geometry = new THREE.BoxGeometry(1, 0.5, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const errorMesh = new THREE.Mesh(geometry, material);
    errorMesh.position.set(0, 1, 0);
    scene.add(errorMesh);
    
    // 创建文本纹理
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '16px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    
    // 分行显示错误信息
    const lines = message.split('\n');
    const lineHeight = 20;
    const startY = canvas.height/2 - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      context.fillText(line, canvas.width/2, startY + index * lineHeight);
    });
    
    // 创建平面显示文本
    const texture = new THREE.CanvasTexture(canvas);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true
    });
    const planeGeometry = new THREE.PlaneGeometry(1, 0.5);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 1, 0.06);
    scene.add(plane);
    
    // 将错误显示在控制台
    console.error('Error:', message);
    
    // 如果在页面上存在info-box，也显示错误信息
    const infoBox = document.querySelector('.info-box');
    if (infoBox) {
      const errorElement = document.createElement('div');
      errorElement.style.color = '#ff4040';
      errorElement.style.marginTop = '10px';
      errorElement.style.fontWeight = 'bold';
      errorElement.innerHTML = `错误: ${message.replace(/\n/g, '<br>')}`;
      infoBox.appendChild(errorElement);
    }
    
    return { errorMesh, plane };
  }
} 