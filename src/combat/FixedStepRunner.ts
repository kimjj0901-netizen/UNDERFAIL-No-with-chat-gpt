export interface FixedStepOptions {
  stepMs?: number;
  maxFrameMs?: number;
  maxStepsPerFrame?: number;
}

/**
 * Runs gameplay simulation at a stable step size.
 * Large frame gaps are bounded rather than replayed as one giant movement update.
 * Clocks, movement, and collision checks must use the same fixed step.
 */
export class FixedStepRunner {
  readonly stepMs: number;
  readonly maxFrameMs: number;
  readonly maxStepsPerFrame: number;
  private accumulatorMs = 0;

  constructor(options: FixedStepOptions = {}) {
    this.stepMs = options.stepMs ?? 1000 / 60;
    this.maxFrameMs = options.maxFrameMs ?? 100;
    this.maxStepsPerFrame = options.maxStepsPerFrame ?? 6;

    if (!Number.isFinite(this.stepMs) || this.stepMs <= 0) {
      throw new RangeError("stepMs must be a finite positive number.");
    }
    if (!Number.isFinite(this.maxFrameMs) || this.maxFrameMs < this.stepMs) {
      throw new RangeError("maxFrameMs must be finite and at least one step.");
    }
    if (!Number.isInteger(this.maxStepsPerFrame) || this.maxStepsPerFrame < 1) {
      throw new RangeError("maxStepsPerFrame must be a positive integer.");
    }
  }

  get pendingMs(): number {
    return this.accumulatorMs;
  }

  reset(): void {
    this.accumulatorMs = 0;
  }

  advance(deltaMs: number, step: (stepMs: number) => void): number {
    if (!Number.isFinite(deltaMs) || deltaMs <= 0) return 0;

    this.accumulatorMs += Math.min(deltaMs, this.maxFrameMs);

    let steps = 0;
    while (
      this.accumulatorMs + 1e-7 >= this.stepMs &&
      steps < this.maxStepsPerFrame
    ) {
      this.accumulatorMs -= this.stepMs;
      step(this.stepMs);
      steps += 1;
    }

    // A stalled frame must not create an unbounded catch-up loop next frame.
    if (steps >= this.maxStepsPerFrame && this.accumulatorMs >= this.stepMs) {
      this.accumulatorMs %= this.stepMs;
    }

    return steps;
  }
}
