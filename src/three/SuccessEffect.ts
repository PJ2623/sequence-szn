import type { VisualEffect } from "@/types/three.types";
import type { BackgroundVisuals } from "./BackgroundVisuals";

export class SuccessEffect implements VisualEffect {
  private background: BackgroundVisuals;
  private wave = 0;

  constructor(background: BackgroundVisuals) {
    this.background = background;
  }

  trigger(): void {
    this.wave = 1;
    this.background.trigger();
  }

  update(_deltaTime?: number, _beatPhase?: number): void {
    this.wave *= 0.95;
    this.background.setGlow(this.wave * 0.25);
  }

  dispose(): void {
    // Nothing to dispose — background owns its resources
  }
}
