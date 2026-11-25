type Mood = "memory" | "sorrow" | "present" | "uneasy" | "rescue" | "warm";

type Tone = {
  frequencies: [number, number, number];
  gain: number;
};

const TONES: Record<Mood, Tone> = {
  memory: { frequencies: [146.83, 220, 293.66], gain: 0.035 },
  sorrow: { frequencies: [110, 164.81, 220], gain: 0.028 },
  present: { frequencies: [130.81, 196, 261.63], gain: 0.026 },
  uneasy: { frequencies: [103.83, 155.56, 207.65], gain: 0.024 },
  rescue: { frequencies: [174.61, 261.63, 349.23], gain: 0.04 },
  warm: { frequencies: [164.81, 246.94, 329.63], gain: 0.032 },
};

/**
 * Original synthesized ambience. Audio is created only after a player gesture,
 * respects browser autoplay restrictions, and stays deliberately quiet.
 */
export class Atmosphere {
  private static context?: AudioContext;
  private static master?: GainNode;
  private static oscillators: OscillatorNode[] = [];
  private static voiceGains: GainNode[] = [];
  private static muted = false;

  static unlock(): void {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;

    try {
      if (!this.context) {
        this.context = new AudioContextClass();
        this.master = this.context.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.context.destination);

        const initial = TONES.memory;
        initial.frequencies.forEach((frequency, index) => {
          const oscillator = this.context!.createOscillator();
          const voiceGain = this.context!.createGain();
          oscillator.type = index === 1 ? "triangle" : "sine";
          oscillator.frequency.value = frequency;
          voiceGain.gain.value = index === 0 ? 0.42 : index === 1 ? 0.2 : 0.09;
          oscillator.connect(voiceGain);
          voiceGain.connect(this.master!);
          oscillator.start();
          this.oscillators.push(oscillator);
          this.voiceGains.push(voiceGain);
        });
      }

      if (this.context.state === "suspended") void this.context.resume();
      this.setMood("memory");
    } catch {
      // Audio is decorative; gameplay must remain fully usable without it.
    }
  }

  static setMood(mood: Mood): void {
    if (!this.context || !this.master || this.muted) return;
    const tone = TONES[mood];
    const now = this.context.currentTime;
    tone.frequencies.forEach((frequency, index) => {
      this.oscillators[index]?.frequency.setTargetAtTime(frequency, now, 0.7);
    });
    this.master.gain.setTargetAtTime(tone.gain, now, 1.1);
  }

  static cue(kind: "confirm" | "paper" | "warning" | "barrier"): void {
    if (!this.context || !this.master || this.muted) return;
    const notes = {
      confirm: [523.25, 659.25],
      paper: [440, 392],
      warning: [233.08, 196],
      barrier: [392, 523.25, 783.99],
    }[kind];
    const context = this.context;
    const start = context.currentTime;
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const at = start + index * 0.075;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.045, at + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.24);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.26);
    });
  }

  static setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    this.master.gain.setTargetAtTime(muted ? 0 : TONES.memory.gain, now, 0.2);
  }

  static shutdown(): void {
    this.oscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* already stopped */ }
    });
    this.oscillators = [];
    this.voiceGains = [];
    void this.context?.close();
    this.context = undefined;
    this.master = undefined;
  }
}
