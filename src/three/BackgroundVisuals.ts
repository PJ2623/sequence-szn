import * as THREE from "three";
import type { VisualEffect } from "@/types/three.types";

export class BackgroundVisuals implements VisualEffect {
  private mesh: THREE.Points;
  private count: number;
  private successWave = 0;

  constructor(scene: THREE.Scene, color: number, count = 500) {
    this.count = count;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
      const brightness = 0.3 + Math.random() * 0.7;
      colors[i * 3] = c.r * brightness;
      colors[i * 3 + 1] = c.g * brightness;
      colors[i * 3 + 2] = c.b * brightness;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    });

    this.mesh = new THREE.Points(geo, mat);
    scene.add(this.mesh);
  }

  setColor(color: number): void {
    const c = new THREE.Color(color);
    const colors = this.mesh.geometry.attributes.color!.array as Float32Array;
    for (let i = 0; i < this.count; i++) {
      const brightness = 0.3 + Math.random() * 0.7;
      colors[i * 3] = c.r * brightness;
      colors[i * 3 + 1] = c.g * brightness;
      colors[i * 3 + 2] = c.b * brightness;
    }
    this.mesh.geometry.attributes.color!.needsUpdate = true;
  }

  setGlow(glow: number): void {
    (this.mesh.material as THREE.PointsMaterial).opacity = 0.35 + glow * 0.25;
  }

  trigger(): void {
    this.successWave = 1;
  }

  update(time: number, _beatPhase?: number): void {
    this.successWave *= 0.95;

    const pos = this.mesh.geometry.attributes.position!.array as Float32Array;
    for (let i = 0; i < this.count; i++) {
      pos[i * 3]! += Math.sin(time + i * 0.01) * 0.007;
      pos[i * 3 + 1]! += Math.cos(time + i * 0.013) * 0.005;

      if (this.successWave > 0.01) {
        const dx = pos[i * 3]!;
        const dy = pos[i * 3 + 1]!;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const push = this.successWave * 0.12 * Math.max(0, 1 - dist / 40);
        pos[i * 3]! += (dx / (dist || 1)) * push;
        pos[i * 3 + 1]! += (dy / (dist || 1)) * push;
      }
    }
    this.mesh.geometry.attributes.position!.needsUpdate = true;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
