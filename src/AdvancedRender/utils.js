/**
 * 辅助工具函数，用于处理Three.js不同版本之间的兼容性问题
 */

import * as THREE from 'three';

/**
 * 根据THREE.js版本返回正确的sRGB编码常量
 * 在THREE.js r130中，使用THREE.sRGBEncoding
 */
export function getSRGBEncoding() {
  if (parseInt(THREE.REVISION) >= 152) {
    // THREE.js r152+
    return THREE.SRGBColorSpace || THREE.sRGBEncoding;
  } else {
    // THREE.js <= r151
    return THREE.sRGBEncoding;
  }
}

/**
 * 设置纹理的编码
 */
export function setTextureEncoding(texture) {
  if (!texture) return;
  
  if (parseInt(THREE.REVISION) >= 152) {
    // THREE.js r152+
    texture.colorSpace = THREE.SRGBColorSpace || 'srgb';
  } else {
    // THREE.js <= r151
    texture.encoding = THREE.sRGBEncoding;
  }
}

/**
 * 设置渲染器的输出编码
 */
export function setRendererEncoding(renderer) {
  if (!renderer) return;
  
  if (parseInt(THREE.REVISION) >= 152) {
    // THREE.js r152+
    renderer.outputColorSpace = THREE.SRGBColorSpace || 'srgb';
  } else {
    // THREE.js <= r151
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
} 