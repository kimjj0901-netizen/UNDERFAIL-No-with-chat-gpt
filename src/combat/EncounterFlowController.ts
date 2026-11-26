export type EncounterPhase =
  | "intro"
  | "command"
  | "act"
  | "item"
  | "fightTiming"
  | "response"
  | "telegraph"
  | "dodge"
  | "reaction"
  | "ending";

const TRANSITIONS: Record<EncounterPhase, readonly EncounterPhase[]> = {
  intro: ["command"],
  command: ["act", "item", "fightTiming", "response", "ending"],
  act: ["command", "response"],
  item: ["command", "response"],
  fightTiming: ["response"],
  response: ["command", "telegraph", "ending"],
  telegraph: ["dodge"],
  dodge: ["reaction"],
  reaction: ["command", "ending"],
  ending: [],
};

/**
 * Small encounter state guard.
 * It owns only phase transitions; encounter content and Phaser presentation
 * remain with the Scene that owns the encounter.
 */
export class EncounterFlowController {
  private current: EncounterPhase;

  constructor(initial: EncounterPhase = "intro") {
    this.current = initial;
  }

  get phase(): EncounterPhase {
    return this.current;
  }

  reset(initial: EncounterPhase = "intro"): void {
    this.current = initial;
  }

  transition(next: EncounterPhase): void {
    if (next === this.current) return;

    if (!TRANSITIONS[this.current].includes(next)) {
      throw new Error("Invalid encounter transition: " + this.current + " -> " + next);
    }

    this.current = next;
  }

  canTransition(next: EncounterPhase): boolean {
    return next === this.current || TRANSITIONS[this.current].includes(next);
  }
}
