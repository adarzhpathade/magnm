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

  // Hover sound suppression state to prevent accidental triggers on section entrance or scroll
  private hoverSuppressedUntil = 0
  private lastScrollTime = 0
  private lastMouseMoveTime = 0

  constructor() {
    if (typeof window !== "undefined") {
      // 1.5s grace period on initial page load so entrance animations never trigger hover sound
      this.hoverSuppressedUntil = performance.now() + 1500

      const onScroll = () => {
        this.lastScrollTime = performance.now()
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("wheel", onScroll, { passive: true })

      const onPointerMove = (e: MouseEvent | PointerEvent) => {
        // Only record actual movement, not synthetic events dispatched when elements move under mouse
        if (e.movementX !== 0 || e.movementY !== 0) {
          this.lastMouseMoveTime = performance.now()
        }
      }
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      window.addEventListener("mousemove", onPointerMove, { passive: true })
    }
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

  private hoverAudioBuffer: AudioBuffer | null = null
  private hoverAudioLoading = false
  private lastHoverSoundTime = 0

  /**
   * Preload hover sound buffer for instant, zero-latency trigger
   */
  public preloadHoverSound(url: string = "/audio/hover-sound.mp3"): void {
    if (typeof window === "undefined" || this.hoverAudioBuffer || this.hoverAudioLoading) return
    const ctx = this.initContext()
    if (!ctx) return
    this.hoverAudioLoading = true
    fetch(url)
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((buf) => (buf && this.ctx ? this.ctx.decodeAudioData(buf) : null))
      .then((decoded) => {
        if (decoded) this.hoverAudioBuffer = decoded
        this.hoverAudioLoading = false
      })
      .catch(() => {
        this.hoverAudioLoading = false
      })
  }

  /**
   * Temporarily suppress hover sounds for a specified duration (in milliseconds).
   * Call when sections transition, scroll triggers fire, or layers change visibility.
   */
  public suppressHover(durationMs: number = 700): void {
    if (typeof window === "undefined") return
    const until = performance.now() + durationMs
    if (until > this.hoverSuppressedUntil) {
      this.hoverSuppressedUntil = until
    }
  }

  /**
   * Notify the audio system that scrolling or animated section movement is active.
   */
  public notifyScroll(): void {
    if (typeof window === "undefined") return
    this.lastScrollTime = performance.now()
  }

  /**
   * Checks if hover sound is currently suppressed due to:
   * 1. Section entrance / transition suppression timer
   * 2. Active scroll (scroll / wheel within last 250ms)
   * 3. Stationary cursor (pointer hasn't moved in last 180ms, meaning element moved under mouse)
   */
  public isHoverSuppressed(): boolean {
    if (typeof window === "undefined") return true
    const now = performance.now()
    // Initial page load or section entrance suppression window
    if (now < this.hoverSuppressedUntil) return true
    // Active scrolling suppression
    if (now - this.lastScrollTime < 250) return true
    // Stationary mouse check: mouse must have actively moved within the last 180ms
    // Prevents accidental trigger when an element animates/renders/incomes under a still cursor
    if (this.lastMouseMoveTime === 0 || now - this.lastMouseMoveTime > 180) return true
    return false
  }

  /**
   * Plays a crisp, subtle hover sound for buttons and interactive controls.
   * Plays the preloaded acoustic audio sample through the master bus,
   * with fallback to an ultra-refined synthesized micro-chime.
   */
  public playButtonHover(volume: number = 0.35): void {
    if (this.isHoverSuppressed()) return

    const nowMs = performance.now()
    if (nowMs - this.lastHoverSoundTime < 60) return
    this.lastHoverSoundTime = nowMs

    const ctx = this.initContext()
    if (!ctx || !this.compressor) {
      // HTML Audio fallback
      try {
        const audio = new Audio('/audio/hover-sound.mp3')
        audio.volume = Math.max(0, Math.min(1, volume))
        audio.play().catch(() => {})
      } catch {}
      return
    }

    // If preloaded buffer is ready, play through dedicated gain
    if (this.hoverAudioBuffer) {
      try {
        const source = ctx.createBufferSource()
        source.buffer = this.hoverAudioBuffer
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime)
        source.connect(gain)
        gain.connect(this.compressor)
        source.start(0)
        return
      } catch {
        // Fallback to synthesis below
      }
    }

    // Try preloading for future hovers if not loaded yet
    if (!this.hoverAudioBuffer && !this.hoverAudioLoading) {
      this.preloadHoverSound()
    }

    // High-end synthesized acoustic micro-chime / metallic tick fallback
    try {
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      // Pure metallic glass-like tick at 1480Hz dropping to 880Hz
      osc.type = "sine"
      osc.frequency.setValueAtTime(1480, t)
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.035)

      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(volume * 0.28, t + 0.002)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)

      osc.connect(gain)
      gain.connect(this.compressor)
      osc.start(t)
      osc.stop(t + 0.085)

      setTimeout(() => {
        osc.disconnect()
        gain.disconnect()
      }, 100)
    } catch {}
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
    const ctx = this.initContext()
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {})
    }
  }
}

// Export singleton instance for seamless reuse across the application
export const chimeSynth = new ChimeSynthesizer()

// Auto-unlock Web Audio on first user interaction anywhere on the window
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    chimeSynth.resume()
    chimeSynth.preloadHoverSound()
  }
  window.addEventListener("pointerdown", unlockAudio, { capture: true, passive: true })
  window.addEventListener("click", unlockAudio, { capture: true, passive: true })
  window.addEventListener("keydown", unlockAudio, { capture: true, passive: true })
  window.addEventListener("touchstart", unlockAudio, { capture: true, passive: true })
  window.addEventListener("pointermove", unlockAudio, { once: true, capture: true, passive: true })
}

