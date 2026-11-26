import Phaser from "phaser";

export type GameInputAction =
  | "UP" | "DOWN" | "LEFT" | "RIGHT"
  | "CONFIRM" | "CANCEL" | "MENU" | "INTERACT" | "PHONE_CALL";

/**
 * Scene-scoped action map shared by playable scenes.
 * Confirm: Z / Enter / Space. Cancel: X / Shift / Escape.
 * Movement: arrows / WASD. INTERACT is E-only; the active Scene may also route CONFIRM to interaction.
 * Ctrl is reserved for MENU; C remains the existing phone shortcut.
 *
 * Phaser 4.2.1 key captures are global and addKey() captures by default.
 * We therefore create Key objects without implicit capture and temporarily
 * capture only browser-scroll keys while this playable Scene is active.
 * NameEntryScene uses a DOM input and must receive Z / Space normally.
 */
export class GameInput {
  private readonly bindings: Record<GameInputAction, Phaser.Input.Keyboard.Key[]>;
  private readonly capturedKeys: number[];

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error(`Keyboard input unavailable in ${scene.scene.key}.`);

    const codes = Phaser.Input.Keyboard.KeyCodes;
    this.capturedKeys = [codes.UP, codes.DOWN, codes.LEFT, codes.RIGHT, codes.SPACE];
    keyboard.addCapture(this.capturedKeys);

    // Release global browser-key captures when the active play Scene shuts down.
    // Only one GameInput-enabled Scene is active at a time in the current flow.
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      keyboard.removeCapture(this.capturedKeys);
    });

    // Do not let addKey's default enableCapture=true create persistent global captures.
    const add = (code: number): Phaser.Input.Keyboard.Key => keyboard.addKey(code, false);
    const up = add(codes.UP);
    const down = add(codes.DOWN);
    const left = add(codes.LEFT);
    const right = add(codes.RIGHT);
    const w = add(codes.W);
    const a = add(codes.A);
    const s = add(codes.S);
    const d = add(codes.D);
    const z = add(codes.Z);
    const enter = add(codes.ENTER);
    const space = add(codes.SPACE);
    const x = add(codes.X);
    const shift = add(codes.SHIFT);
    const escape = add(codes.ESC);
    const c = add(codes.C);
    const ctrl = add(codes.CTRL);
    const e = add(codes.E);
    const confirm = [z, enter, space];

    this.bindings = {
      UP: [up, w], DOWN: [down, s], LEFT: [left, a], RIGHT: [right, d],
      CONFIRM: confirm, CANCEL: [x, shift, escape], MENU: [ctrl],
      INTERACT: [e], PHONE_CALL: [c],
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
