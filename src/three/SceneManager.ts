import * as THREE from "three";
import type { SceneConfig } from "@/types/three.types";
import { BackgroundVisuals } from "./BackgroundVisuals";
import { BeatReactor } from "./BeatReactor";
import { SuccessEffect } from "./SuccessEffect";
import { FailEffect } from "./FailEffect";

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  private container: HTMLElement;
  private animId = 0;
  private background: BackgroundVisuals;
  private reactor: BeatReactor;
  private successEffect: SuccessEffect;
  private failEffect: FailEffect;
  private time = 0;

  private handleResize: () => void;

  constructor(config: SceneConfig) {
    this.container = config.container;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      config.container.clientWidth / config.container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(config.container.clientWidth, config.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(config.pixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    config.container.appendChild(this.renderer.domElement);

    this.background = new BackgroundVisuals(this.scene, 0x6c63ff);
    this.reactor = new BeatReactor(this.scene, 0x6c63ff);
    this.successEffect = new SuccessEffect(this.background);
    this.failEffect = new FailEffect(this.camera);

    this.handleResize = () => {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    };
    window.addEventListener("resize", this.handleResize);

    this.animate = this.animate.bind(this);
    this.animId = requestAnimationFrame(this.animate);
  }

  setThemeColor(color: number): void {
    this.background.setColor(color);
    this.reactor.setColor(color);
  }

  triggerBeat(): void {
    this.reactor.triggerBeat();
  }

  triggerSuccess(): void {
    this.successEffect.trigger();
  }

  triggerFail(): void {
    this.failEffect.trigger();
  }

  private animate(): void {
    this.time += 0.005;

    this.background.update(this.time);
    this.reactor.update();
    this.successEffect.update();
    this.failEffect.update();

    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(this.animate);
  }

  dispose(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.handleResize);
    this.renderer.dispose();
    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      const mat = (obj as THREE.Mesh).material;
      if (mat) {
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
