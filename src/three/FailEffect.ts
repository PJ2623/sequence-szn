import * as THREE from "three";
import type { VisualEffect } from "@/types/three.types";

export class FailEffect implements VisualEffect {
  private camera: THREE.PerspectiveCamera;
  private glitch = 0;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  trigger(): void {
    this.glitch = 1;
  }

  update(_deltaTime?: number, _beatPhase?: number): void {
    this.glitch *= 0.88;

    if (this.glitch > 0.05) {
      this.camera.position.x = (Math.random() - 0.5) * this.glitch * 1.5;
      this.camera.position.y = (Math.random() - 0.5) * this.glitch * 1.5;
    } else {
      this.camera.position.x *= 0.9;
      this.camera.position.y *= 0.9;
    }
  }

  dispose(): void {
    // Reset camera position
    this.camera.position.x = 0;
    this.camera.position.y = 0;
  }
}
