import test from "node:test";
import assert from "node:assert/strict";

import { EncounterFlowController } from "../src/combat/EncounterFlowController.ts";
import { FixedStepRunner } from "../src/combat/FixedStepRunner.ts";
import {
  evaluateRhythmTiming,
  RHYTHM_TIMING_DURATION_MS,
  RHYTHM_DODGE_INTERVALS_MS,
} from "../src/combat/FightTiming.ts";
import { WELFARE_REGULAR_ENCOUNTERS } from "../src/data/welfareEncounterContent.ts";

test("encounter flow accepts the main gameplay path", () => {
  const flow = new EncounterFlowController();

  flow.transition("command");
  flow.transition("act");
  flow.transition("response");
  flow.transition("telegraph");
  flow.transition("dodge");
  flow.transition("reaction");
  flow.transition("command");
  flow.transition("item");
  flow.transition("response");
  flow.transition("command");
  flow.transition("fightTiming");
  flow.transition("response");
  flow.transition("telegraph");
  flow.transition("dodge");
  flow.transition("reaction");
  flow.transition("ending");

  assert.equal(flow.phase, "ending");
});

test("encounter flow rejects impossible transitions and can reset", () => {
  const flow = new EncounterFlowController("telegraph");

  assert.equal(flow.canTransition("dodge"), true);
  assert.equal(flow.canTransition("ending"), false);
  assert.throws(() => flow.transition("ending"), /Invalid encounter transition/);

  flow.reset("intro");
  assert.equal(flow.phase, "intro");
  flow.transition("command");
  assert.equal(flow.phase, "command");
});

test("fixed-step runner advances movement and clocks by the same stable steps", () => {
  const runner = new FixedStepRunner({ stepMs: 10, maxFrameMs: 50, maxStepsPerFrame: 5 });
  const seen = [];

  assert.equal(runner.advance(25, (step) => seen.push(step)), 2);
  assert.equal(seen.length, 2);
  assert.equal(seen[0], 10);
  assert.equal(seen[1], 10);
  assert.equal(runner.pendingMs, 5);

  assert.equal(runner.advance(5, (step) => seen.push(step)), 1);
  assert.equal(seen.length, 3);
  assert.equal(runner.pendingMs, 0);
});

test("fixed-step runner bounds stalled-frame catch-up and ignores invalid deltas", () => {
  const runner = new FixedStepRunner({ stepMs: 10, maxFrameMs: 50, maxStepsPerFrame: 5 });
  let count = 0;

  assert.equal(runner.advance(500, () => { count += 1; }), 5);
  assert.equal(count, 5);
  assert.equal(runner.advance(Number.NaN, () => { count += 1; }), 0);
  assert.equal(runner.advance(-20, () => { count += 1; }), 0);
  assert.equal(count, 5);
  assert.ok(runner.pendingMs < 10);
});

test("rhythm timing centres the judgement on the fourth, longer beat", () => {
  const result = evaluateRhythmTiming(RHYTHM_TIMING_DURATION_MS * 0.75, false);
  assert.equal(result.grade, "precise");
  assert.equal(result.progress, 0.75);
  assert.equal(result.distanceFromTarget, 0);
});

test("observing the beat gives a wider timing window without changing the target", () => {
  const elapsed = RHYTHM_TIMING_DURATION_MS * 0.86;
  const observed = evaluateRhythmTiming(elapsed, true);
  const unobserved = evaluateRhythmTiming(elapsed, false);

  assert.equal(observed.grade, "steady");
  assert.equal(unobserved.grade, "miss");
  assert.equal(observed.progress, unobserved.progress);
});

test("rhythm mote provides the observation clue used by its FIGHT timing", () => {
  const rhythmMote = WELFARE_REGULAR_ENCOUNTERS.rhythmMote;
  const watch = rhythmMote.actOptions.find((option) => option.id === "watch");

  assert.equal(rhythmMote.pattern, "rhythm");
  assert.ok(watch);
  assert.match(watch.response, /세 번의 짧은 빛과 한 번의 긴 빛/);
  assert.equal(rhythmMote.resolveAt, 2);
  assert.equal(new Set(rhythmMote.actOptions.map((option) => option.id)).size, rhythmMote.actOptions.length);
});

test("rhythm dodge uses three short intervals followed by one long interval", () => {
  assert.deepEqual(RHYTHM_DODGE_INTERVALS_MS, [300, 300, 300, 900]);
  assert.equal(RHYTHM_DODGE_INTERVALS_MS.reduce((sum, value) => sum + value, 0), RHYTHM_TIMING_DURATION_MS);
});
