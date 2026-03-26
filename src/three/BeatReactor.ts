import * as THREE from "three";
import type { VisualEffect } from "@/types/three.types";

export class BeatReactor implements VisualEffect {
  private ring: THREE.Mesh;
  private inner: THREE.Mesh;
  private beatScale = 1;
  private glow = 0;

  constructor(scene: THREE.Scene, color: number) {
    const ringGeo = new THREE.RingGeometry(6, 6.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(this.ring);

    const innerGeo = new THREE.CircleGeometry(5.8, 64);
    const innerMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.02,
      side: THREE.DoubleSide,
    });
    this.inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(this.inner);
  }

  setColor(color: number): void {
    (this.ring.material as THREE.MeshBasicMaterial).color.set(color);
    (this.inner.material as THREE.MeshBasicMaterial).color.set(color);
  }

  triggerBeat(): void {
    this.beatScale = 1.12;
    this.glow = 1;
  }

  /** Can also receive a success wave from outside */
  setSuccessWave(wave: number): void {
    this.ring.scale.setScalar(this.beatScale + wave * 0.3);
    (this.ring.material as THREE.MeshBasicMaterial).opacity =
      0.2 + this.glow * 0.4 + wave * 0.25;
  }

  trigger(): void {
    this.triggerBeat();
  }

  update(_deltaTime?: number, _beatPhase?: number): void {
    this.beatScale += (1 - this.beatScale) * 0.12;
    this.glow *= 0.92;

    this.ring.scale.setScalar(this.beatScale);
    (this.ring.material as THREE.MeshBasicMaterial).opacity = 0.2 + this.glow * 0.4;
    this.ring.rotation.z += 0.001;

    this.inner.scale.setScalar(this.beatScale);
  }

  dispose(): void {
    this.ring.geometry.dispose();
    (this.ring.material as THREE.Material).dispose();
    this.inner.geometry.dispose();
    (this.inner.material as THREE.Material).dispose();
  }
}
