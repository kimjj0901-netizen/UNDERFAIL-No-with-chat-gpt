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
  proggithubTutorialDone: boolean;
  secondRankFled: boolean;
  domitoriellFollowUpPending: boolean;
  welfareEncounterResults: Record<string, "peaceful" | "withdrew">;
  welfareHallPuzzleStep: number;
  welfareHallPuzzleSolved: boolean;
  welfareHallPuzzleMistakes: number;
  welfarePhoneCallCount: number;
  welfareIdleCallSeen: boolean;
  proggithubSkippedLines: number;
  proggithubGuideHidden: boolean;
  nerdstablookResolved: boolean;
  nerdstablookFriendly: boolean;
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
  proggithubTutorialDone: false,
  secondRankFled: false,
  domitoriellFollowUpPending: false,
  welfareEncounterResults: {},
  welfareHallPuzzleStep: 0,
  welfareHallPuzzleSolved: false,
  welfareHallPuzzleMistakes: 0,
  welfarePhoneCallCount: 0,
  welfareIdleCallSeen: false,
  proggithubSkippedLines: 0,
  proggithubGuideHidden: false,
  nerdstablookResolved: false,
  nerdstablookFriendly: false,
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

  markProggithubTutorialDone(): void {
    state.proggithubTutorialDone = true;
  },

  markSecondRankFled(): void {
    state.secondRankFled = true;
    state.domitoriellFollowUpPending = true;
  },

  consumeDomitoriellFollowUp(): boolean {
    if (!state.domitoriellFollowUpPending) return false;
    state.domitoriellFollowUpPending = false;
    return true;
  },

  recordWelfareEncounter(id: string, outcome: "peaceful" | "withdrew"): void {
    state.welfareEncounterResults[id] = outcome;
  },

  advanceWelfareHallPuzzle(): number {
    if (state.welfareHallPuzzleSolved) return state.welfareHallPuzzleStep;
    state.welfareHallPuzzleStep = Math.min(3, state.welfareHallPuzzleStep + 1);
    if (state.welfareHallPuzzleStep >= 3) state.welfareHallPuzzleSolved = true;
    return state.welfareHallPuzzleStep;
  },

  resetWelfareHallPuzzle(): void {
    state.welfareHallPuzzleStep = 0;
    state.welfareHallPuzzleMistakes += 1;
  },

  recordWelfarePhoneCall(): number {
    state.welfarePhoneCallCount += 1;
    return state.welfarePhoneCallCount;
  },

  markWelfareIdleCallSeen(): void {
    state.welfareIdleCallSeen = true;
  },

  recordProggithubDialogueSkip(remainingLines: number): boolean {
    // [제안/PROTOTYPE] The skip threshold is not a canon rule from the source index.
    if (remainingLines > 0) state.proggithubSkippedLines += remainingLines;
    if (state.proggithubSkippedLines >= 3) state.proggithubGuideHidden = true;
    return state.proggithubGuideHidden;
  },

  resolveNerdstablook(friendly: boolean): void {
    state.nerdstablookResolved = true;
    state.nerdstablookFriendly = friendly;
  },
};
