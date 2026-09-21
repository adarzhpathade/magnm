/**
 * Physical Modeling Glockenspiel & Metallic Chime Synthesizer
 * 
 * Generates pristine acoustic metallic bar strikes using Web Audio API:
 * - Fundamental frequency with Euler-Bernoulli inharmonic beam overtones (2.756x, 5.404x)
 * - Calibrated pentatonic scale (D4 -> D7) mapped smoothly across the 3D wheel
 * - Natural exponential damping (high overtones dissipate quickly, fundamental lingers)
 * - Shared master compressor and gain bus to guarantee zero distortion during fast glissandos
 */

// Pentatonic scale semitone offsets from root (D Major Pentatonic: D, E, F#, A, B)
const PENTATONIC_INTERVALS = [0, 2, 4, 7, 9]

// Lowest note: D4 (MIDI 62 = 293.66 Hz), optimal glockenspiel register
const BASE_MIDI = 62

// Pre-calculate 18 notes across 3.5 octaves
const SCALE_FREQUENCIES: number[] = []
for (let octave = 0; octave < 4; octave++) {
  for (const interval of PENTATONIC_INTERVALS) {
    const midi = BASE_MIDI + octave * 12 + interval
    const freq = 440 * Math.pow(2, (midi - 69) / 12)
    SCALE_FREQUENCIES.push(freq)
  }
}

export type SoundMode = "glockenspiel" | "haptic" | "marimba"

export class ChimeSynthesizer {
  private ctx: AudioContext | null = null
  private compressor: DynamicsCompressorNode | null = null
  private masterGain: GainNode | null = null
  private lastStrikeTime = 0
  private lastNotePlayed = -1
  private minIntervalMs = 28 // throttle to prevent runaway oscillator buildup

  constructor() {
    // Lazily initialized on first interaction
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return null

      const ctx = new AudioContextClass()

      // Highpass filter to eliminate sub-bass rumble
      const hpf = ctx.createBiquadFilter()
      hpf.type = "highpass"
      hpf.frequency.setValueAtTime(180, ctx.currentTime)

      // Master compressor to ensure transparent, distortion-free glissandos
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.setValueAtTime(-14, ctx.currentTime)
      comp.knee.setValueAtTime(8, ctx.currentTime)
      comp.ratio.setValueAtTime(6, ctx.currentTime)
      comp.attack.setValueAtTime(0.002, ctx.currentTime)
      comp.release.setValueAtTime(0.2, ctx.currentTime)

      // Master output gain
      const master = ctx.createGain()
      master.gain.setValueAtTime(0.32, ctx.currentTime)

      hpf.connect(comp)
      comp.connect(master)
      master.connect(ctx.destination)

      this.ctx = ctx
      this.compressor = comp
      this.masterGain = master
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {})
    }

    return this.ctx
  }

  /**
   * Play a tuned metallic bar chime based on the bar index
   * @param barIndex Index of the struck bar (0 to totalBars - 1)
   * @param totalBars Total number of bars in the wheel (e.g. 44)
   * @param mode Sound mode ('glockenspiel', 'haptic', or 'marimba')
   */
  public strike(barIndex: number, totalBars: number = 44, mode: SoundMode = "glockenspiel"): void {
    const nowMs = performance.now()
    if (nowMs - this.lastStrikeTime < this.minIntervalMs && barIndex === this.lastNotePlayed) {
      return
    }
    this.lastStrikeTime = nowMs
    this.lastNotePlayed = barIndex

    const ctx = this.initContext()
    if (!ctx || !this.compressor) return

    // Map circular bar indices smoothly so adjacent bars flow melodically
    // Symmetrical map around circle ensures continuous glissando without octave leaps
    const half = Math.floor(totalBars / 2)
    const step = barIndex <= half ? barIndex : totalBars - barIndex
    const scaleIndex = Math.min(
      SCALE_FREQUENCIES.length - 1,
      Math.floor((step / half) * (SCALE_FREQUENCIES.length - 1))
    )
    const fundamental = SCALE_FREQUENCIES[scaleIndex] || 440

    if (mode === "haptic") {
      this.playHapticTick(ctx, this.compressor)
    } else if (mode === "marimba") {
      this.playMarimbaBar(ctx, this.compressor, fundamental)
    } else {
      this.playGlockenspielBar(ctx, this.compressor, fundamental)
    }
  }

  /**
   * Pure acoustic physical model of a glockenspiel metal bar
   */
  private playGlockenspielBar(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime

    // 1. Fundamental frequency (warm resonant tone)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(f0, now)
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.38, now + 0.002) // 2ms click-free attack
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.95) // natural bell decay

    osc1.connect(gain1)
    gain1.connect(destination)
    osc1.start(now)
    osc1.stop(now + 1.0)

    // 2. Inharmonic Overtone 1 (Euler-Bernoulli beam ratio: 2.756 * f0)
    // Produces the unmistakable metallic chime ring
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(f0 * 2.756, now)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.001)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.32) // faster decay for higher overtone

    osc2.connect(gain2)
    gain2.connect(destination)
    osc2.start(now)
    osc2.stop(now + 0.35)

    // 3. Inharmonic Overtone 2 (5.404 * f0) - high crystal shimmer
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = "sine"
    osc3.frequency.setValueAtTime(Math.min(f0 * 5.404, 18000), now)
    gain3.gain.setValueAtTime(0, now)
    gain3.gain.linearRampToValueAtTime(0.04, now + 0.001)
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.12) // quick silver sparkle

    osc3.connect(gain3)
    gain3.connect(destination)
    osc3.start(now)
    osc3.stop(now + 0.15)

    // 4. Subtle mallet impact transient (tactile acoustic click)
    const transientOsc = ctx.createOscillator()
    const transientGain = ctx.createGain()
    transientOsc.type = "triangle"
    transientOsc.frequency.setValueAtTime(1400, now)
    transientOsc.frequency.exponentialRampToValueAtTime(300, now + 0.006)
    transientGain.gain.setValueAtTime(0.06, now)
    transientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006)

    transientOsc.connect(transientGain)
    transientGain.connect(destination)
    transientOsc.start(now)
    transientOsc.stop(now + 0.007)

    // Node cleanup
    setTimeout(() => {
      osc1.disconnect()
      gain1.disconnect()
      osc2.disconnect()
      gain2.disconnect()
      osc3.disconnect()
      gain3.disconnect()
      transientOsc.disconnect()
      transientGain.disconnect()
    }, 1100)
  }

  /**
   * Warm wooden marimba tone with soft strike
   */
  private playMarimbaBar(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(f0 * 0.75, now)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.35, now + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)

    osc.connect(gain)
    gain.connect(destination)
    osc.start(now)
    osc.stop(now + 0.5)

    setTimeout(() => {
      osc.disconnect()
      gain.disconnect()
    }, 550)
  }

  /**
   * Ultra-minimal mechanical haptic tick
   */
  private playHapticTick(ctx: AudioContext, destination: AudioNode): void {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(2400, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.004)
    gain.gain.setValueAtTime(0.09, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.005)

    osc.connect(gain)
    gain.connect(destination)
    osc.start(now)
    osc.stop(now + 0.006)

    setTimeout(() => {
      osc.disconnect()
      gain.disconnect()
    }, 50)
  }

  public setVolume(volume: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.ctx.currentTime
      )
    }
  }

  public resume(): void {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {})
    }
  }
}

// Export singleton instance for seamless reuse across the application
export const chimeSynth = new ChimeSynthesizer()
