import Phaser from "phaser";

export type GameInputAction =
  | "UP" | "DOWN" | "LEFT" | "RIGHT"
  | "CONFIRM" | "CANCEL" | "MENU" | "INTERACT" | "PHONE_CALL";

/**
 * Scene-scoped input map shared by playable scenes.
 * Confirm: Z / Enter / Space. Cancel: X / Shift / Escape.
 * Movement: arrows / WASD. Interact keeps E as a legacy alias.
 * MENU is reserved for a future menu; C remains the existing phone shortcut.
 */
export class GameInput {
  private readonly bindings: Record<GameInputAction, Phaser.Input.Keyboard.Key[]>;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error(`Keyboard input unavailable in ${scene.scene.key}.`);

    const add = (code: number): Phaser.Input.Keyboard.Key => keyboard.addKey(code);
    const up = add(Phaser.Input.Keyboard.KeyCodes.UP);
    const down = add(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const left = add(Phaser.Input.Keyboard.KeyCodes.LEFT);
    const right = add(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    const w = add(Phaser.Input.Keyboard.KeyCodes.W);
    const a = add(Phaser.Input.Keyboard.KeyCodes.A);
    const s = add(Phaser.Input.Keyboard.KeyCodes.S);
    const d = add(Phaser.Input.Keyboard.KeyCodes.D);
    const z = add(Phaser.Input.Keyboard.KeyCodes.Z);
    const enter = add(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const space = add(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const x = add(Phaser.Input.Keyboard.KeyCodes.X);
    const shift = add(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    const escape = add(Phaser.Input.Keyboard.KeyCodes.ESC);
    const c = add(Phaser.Input.Keyboard.KeyCodes.C);
    const ctrl = add(Phaser.Input.Keyboard.KeyCodes.CTRL);
    const e = add(Phaser.Input.Keyboard.KeyCodes.E);
    const confirm = [z, enter, space];

    this.bindings = {
      UP: [up, w], DOWN: [down, s], LEFT: [left, a], RIGHT: [right, d],
      CONFIRM: confirm, CANCEL: [x, shift, escape], MENU: [c, ctrl],
      INTERACT: [e, ...confirm], PHONE_CALL: [c],
    };
  }

  isDown(action: GameInputAction): boolean {
    return this.bindings[action].some((key) => key.isDown);
  }

  /** Consumes every alias so simultaneous aliases cannot dispatch twice. */
  justPressed(action: GameInputAction): boolean {
    let pressed = false;
    for (const key of this.bindings[action]) {
      if (Phaser.Input.Keyboard.JustDown(key)) pressed = true;
    }
    return pressed;
  }
}
