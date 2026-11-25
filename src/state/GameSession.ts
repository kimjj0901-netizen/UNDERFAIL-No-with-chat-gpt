export interface GameSessionState {
  playerName: string;
  hp: number;
  maxHp: number;
  hasWarmTea: boolean;
  warmTeaUsed: boolean;
  inspectedObjects: string[];
  domitoriellIntroduced: boolean;
  domitoriellPeaceResolved: boolean;
  determinationCount: number;
  bullyRescued: boolean;
  bullyHits: number;
  openingPrologueViewed: boolean;
  bullyEncountered: boolean;
  openingRescued: boolean;
}

const initialState = (): GameSessionState => ({
  playerName: "",
  hp: 12,
  maxHp: 12,
  hasWarmTea: false,
  warmTeaUsed: false,
  inspectedObjects: [],
  domitoriellIntroduced: false,
  domitoriellPeaceResolved: false,
  determinationCount: 0,
  bullyRescued: false,
  bullyHits: 0,
  openingPrologueViewed: false,
  bullyEncountered: false,
  openingRescued: false,
});

let state = initialState();

export const GameSession = {
  get(): GameSessionState {
    return state;
  },

  startNew(playerName: string): void {
    state = { ...initialState(), playerName: playerName.trim() };
  },

  inspect(id: string): boolean {
    if (state.inspectedObjects.includes(id)) return false;
    state.inspectedObjects.push(id);
    return true;
  },

  acquireWarmTea(): boolean {
    if (state.hasWarmTea || state.warmTeaUsed) return false;
    state.hasWarmTea = true;
    return true;
  },

  useWarmTea(): boolean {
    if (!state.hasWarmTea || state.warmTeaUsed) return false;
    state.warmTeaUsed = true;
    state.hasWarmTea = false;
    state.hp = Math.min(state.maxHp, state.hp + 5);
    return true;
  },

  expressDetermination(): number {
    state.determinationCount += 1;
    return state.determinationCount;
  },

  resolveDomitoriellPeacefully(): void {
    state.domitoriellPeaceResolved = true;
  },

  markPrologueViewed(): void {
    state.openingPrologueViewed = true;
  },

  markBullyEncountered(): void {
    state.bullyEncountered = true;
  },

  completeOpeningRescue(): void {
    state.bullyRescued = true;
    state.openingRescued = true;
  },
};
