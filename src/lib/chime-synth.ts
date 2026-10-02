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

export type SoundMode = "glockenspiel" | "haptic" | "marimba" | "vibraphone" | "celesta" | "kalimba" | "wood-tap" | "synth-rhythm" | "cyber-bass" | "retro-arcade" | "techno-zap" | "heavy-click"

export class ChimeSynthesizer {
  private ctx: AudioContext | null = null
  private compressor: DynamicsCompressorNode | null = null
  private masterGain: GainNode | null = null
  private wheelBus: GainNode | null = null
  private convolver: ConvolverNode | null = null
  private reverbGain: GainNode | null = null
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

  /**
   * Generates a lush, studio-grade stereo acoustic impulse response
   * Simulates an architectural gallery space with natural exponential air absorption
   */
  private createImpulseResponse(ctx: AudioContext, duration: number = 2.5, decay: number = 2.2): AudioBuffer {
    const sampleRate = ctx.sampleRate
    const length = Math.floor(sampleRate * duration)
    const impulse = ctx.createBuffer(2, length, sampleRate)
    const left = impulse.getChannelData(0)
    const right = impulse.getChannelData(1)

    // 12ms pre-delay before reflections bloom
    const preDelaySamples = Math.floor(sampleRate * 0.012)

    for (let i = 0; i < length; i++) {
      if (i < preDelaySamples) {
        left[i] = 0
        right[i] = 0
        continue
      }
      const t = (i - preDelaySamples) / (length - preDelaySamples)
      const env = Math.pow(1 - t, decay)
      const damp = Math.exp(-2.2 * t)

      // Decorrelated stereo diffuse reflections
      const noiseL = Math.random() * 2 - 1
      const noiseR = Math.random() * 2 - 1

      left[i] = noiseL * env * (0.6 + 0.4 * damp)
      right[i] = noiseR * env * (0.6 + 0.4 * damp)
    }

    return impulse
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

      // Dedicated studio-grade convolution reverb for 3D wheel strikes
      const wheelBus = ctx.createGain()
      wheelBus.gain.setValueAtTime(1.0, ctx.currentTime)

      // Direct dry path from wheelBus into compressor
      const dryWheelGain = ctx.createGain()
      dryWheelGain.gain.setValueAtTime(0.85, ctx.currentTime)
      wheelBus.connect(dryWheelGain)
      dryWheelGain.connect(comp)

      // Lush reverb wet path with warm lowpass absorption filter
      const convolver = ctx.createConvolver()
      convolver.buffer = this.createImpulseResponse(ctx, 2.5, 2.2)

      const reverbFilter = ctx.createBiquadFilter()
      reverbFilter.type = "lowpass"
      reverbFilter.frequency.setValueAtTime(5800, ctx.currentTime)

      const reverbGain = ctx.createGain()
      reverbGain.gain.setValueAtTime(0.5, ctx.currentTime) // Rich, atmospheric reverb presence

      wheelBus.connect(reverbFilter)
      reverbFilter.connect(convolver)
      convolver.connect(reverbGain)
      reverbGain.connect(comp)

      this.ctx = ctx
      this.compressor = comp
      this.masterGain = master
      this.wheelBus = wheelBus
      this.convolver = convolver
      this.reverbGain = reverbGain
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

    // Send through the spatial reverb bus for 3D wheel strikes
    const dest = this.wheelBus || this.compressor

    if (mode === "haptic") {
      this.playHapticTick(ctx, dest)
    } else if (mode === "marimba") {
      this.playMarimbaBar(ctx, dest, fundamental)
    } else if (mode === "vibraphone") {
      this.playVibraphoneBar(ctx, dest, fundamental)
    } else if (mode === "celesta") {
      this.playCelestaBar(ctx, dest, fundamental)
    } else if (mode === "kalimba") {
      this.playKalimbaBar(ctx, dest, fundamental)
    } else if (mode === "wood-tap") {
      this.playWoodTapSound(ctx, dest, 0.25)
    } else if (mode === "synth-rhythm") {
      this.playSynthRhythm(ctx, dest, fundamental)
    } else if (mode === "cyber-bass") {
      this.playCyberBass(ctx, dest, fundamental)
    } else if (mode === "retro-arcade") {
      this.playRetroArcade(ctx, dest, fundamental)
    } else if (mode === "techno-zap") {
      this.playTechnoZap(ctx, dest, fundamental)
    } else if (mode === "heavy-click") {
      this.playHeavyClick(ctx, dest)
    } else {
      this.playGlockenspielBar(ctx, dest, fundamental)
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
   * Rich acoustic physical model of a wooden marimba rosewood bar
   */
  private playMarimbaBar(ctx: AudioContext, destination: AudioNode, f0: number, volumeMult: number = 1.45): void {
    const now = ctx.currentTime
    const fundamental = f0 * 0.5 // Octave lower for rich woody body

    // 1. Warm hollow fundamental tone
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(fundamental, now)
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.68 * volumeMult, now + 0.003)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)

    osc1.connect(gain1)
    gain1.connect(destination)
    osc1.start(now)
    osc1.stop(now + 0.65)

    // 2. Undercut rosewood 4th harmonic overtone (2 octaves up, 4.0 * fundamental)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(fundamental * 4.0, now)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.20 * volumeMult, now + 0.002)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.14) // fast dissipation

    osc2.connect(gain2)
    gain2.connect(destination)
    osc2.start(now)
    osc2.stop(now + 0.16)

    // 3. Wooden yarn mallet impact transient
    const transientOsc = ctx.createOscillator()
    const transientGain = ctx.createGain()
    transientOsc.type = "sine"
    transientOsc.frequency.setValueAtTime(420, now)
    transientOsc.frequency.exponentialRampToValueAtTime(130, now + 0.012)
    transientGain.gain.setValueAtTime(0.14 * volumeMult, now)
    transientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012)

    transientOsc.connect(transientGain)
    transientGain.connect(destination)
    transientOsc.start(now)
    transientOsc.stop(now + 0.015)

    setTimeout(() => {
      osc1.disconnect()
      gain1.disconnect()
      osc2.disconnect()
      gain2.disconnect()
      transientOsc.disconnect()
      transientGain.disconnect()
    }, 650)
  }

  /**
   * Warm, velvety acoustic physical model of an aluminum Vibraphone bar
   */
  private playVibraphoneBar(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime

    // 1. Lush, warm fundamental with singing sustain
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(f0, now)

    // Gentle 4.8Hz tremolo (mimics rotating acoustic resonator discs)
    const tremoloOsc = ctx.createOscillator()
    const tremoloGain = ctx.createGain()
    tremoloOsc.type = "sine"
    tremoloOsc.frequency.setValueAtTime(4.8, now)
    tremoloGain.gain.setValueAtTime(0.035, now)
    tremoloOsc.connect(tremoloGain)
    tremoloGain.connect(gain1.gain)
    tremoloOsc.start(now)
    tremoloOsc.stop(now + 1.4)

    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.36, now + 0.006)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.35)

    osc1.connect(gain1)
    gain1.connect(destination)
    osc1.start(now)
    osc1.stop(now + 1.4)

    // 2. Soft double-octave overtone (tuned aluminum overtone: 3.98 * f0)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(f0 * 3.98, now)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.07, now + 0.002)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

    osc2.connect(gain2)
    gain2.connect(destination)
    osc2.start(now)
    osc2.stop(now + 0.38)

    // 3. Soft cord-wrapped felt mallet contact
    const transientOsc = ctx.createOscillator()
    const transientGain = ctx.createGain()
    transientOsc.type = "sine"
    transientOsc.frequency.setValueAtTime(650, now)
    transientOsc.frequency.exponentialRampToValueAtTime(220, now + 0.009)
    transientGain.gain.setValueAtTime(0.05, now)
    transientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.009)

    transientOsc.connect(transientGain)
    transientGain.connect(destination)
    transientOsc.start(now)
    transientOsc.stop(now + 0.01)

    setTimeout(() => {
      osc1.disconnect()
      gain1.disconnect()
      tremoloOsc.disconnect()
      tremoloGain.disconnect()
      osc2.disconnect()
      gain2.disconnect()
      transientOsc.disconnect()
      transientGain.disconnect()
    }, 1500)
  }

  /**
   * Delicate, crystalline Celesta fairy-bell chime
   */
  private playCelestaBar(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime
    const freq = f0 * 1.25 // Slightly higher, sweeter register

    // 1. Pure crystalline fundamental
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(freq, now)
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.28, now + 0.003)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.52)

    osc1.connect(gain1)
    gain1.connect(destination)
    osc1.start(now)
    osc1.stop(now + 0.55)

    // 2. High bell overtone (3.0 * freq)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(Math.min(freq * 3.0, 16000), now)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.06, now + 0.002)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    osc2.connect(gain2)
    gain2.connect(destination)
    osc2.start(now)
    osc2.stop(now + 0.25)

    // 3. Shimmer overtone (6.0 * freq)
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = "sine"
    osc3.frequency.setValueAtTime(Math.min(freq * 6.0, 18000), now)
    gain3.gain.setValueAtTime(0, now)
    gain3.gain.linearRampToValueAtTime(0.02, now + 0.001)
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

    osc3.connect(gain3)
    gain3.connect(destination)
    osc3.start(now)
    osc3.stop(now + 0.1)

    setTimeout(() => {
      osc1.disconnect()
      gain1.disconnect()
      osc2.disconnect()
      gain2.disconnect()
      osc3.disconnect()
      gain3.disconnect()
    }, 600)
  }

  /**
   * Tactile acoustic Kalimba / thumb piano metal tine on soundboard
   */
  private playKalimbaBar(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime

    // 1. Plucked metal tine fundamental with subtle release flex
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    // Starts slightly sharp (+25 cents) and settles to true pitch in 14ms
    osc1.frequency.setValueAtTime(f0 * 1.015, now)
    osc1.frequency.exponentialRampToValueAtTime(f0, now + 0.014)

    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(0.34, now + 0.002)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)

    osc1.connect(gain1)
    gain1.connect(destination)
    osc1.start(now)
    osc1.stop(now + 0.45)

    // 2. High inharmonic tine overtone (5.42 * f0)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(Math.min(f0 * 5.42, 17000), now)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.001)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

    osc2.connect(gain2)
    gain2.connect(destination)
    osc2.start(now)
    osc2.stop(now + 0.1)

    // 3. Wooden soundboard resonance thump (240Hz)
    const thump = ctx.createOscillator()
    const thumpGain = ctx.createGain()
    thump.type = "triangle"
    thump.frequency.setValueAtTime(240, now)
    thump.frequency.exponentialRampToValueAtTime(80, now + 0.012)
    thumpGain.gain.setValueAtTime(0.06, now)
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012)

    thump.connect(thumpGain)
    thumpGain.connect(destination)
    thump.start(now)
    thump.stop(now + 0.015)

    setTimeout(() => {
      osc1.disconnect()
      gain1.disconnect()
      osc2.disconnect()
      gain2.disconnect()
      thump.disconnect()
      thumpGain.disconnect()
    }, 500)
  }

  /**
   * Refined organic acoustic wooden tap / tactile physical micro-click
   */
  private playWoodTapSound(ctx: AudioContext, destination: AudioNode, volume: number = 0.2): void {
    const now = ctx.currentTime

    // 1. Resonant bandpassed acoustic tap
    const bufferSize = Math.floor(ctx.sampleRate * 0.015) // 15ms burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003))
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.setValueAtTime(820, now)
    filter.Q.setValueAtTime(5.5, now)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(Math.min(0.5, volume * 1.2), now)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(destination)

    // 2. Subtle low body impulse
    const bodyOsc = ctx.createOscillator()
    const bodyGain = ctx.createGain()
    bodyOsc.type = "sine"
    bodyOsc.frequency.setValueAtTime(280, now)
    bodyOsc.frequency.exponentialRampToValueAtTime(100, now + 0.01)
    bodyGain.gain.setValueAtTime(volume * 0.5, now)
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01)

    bodyOsc.connect(bodyGain)
    bodyGain.connect(destination)

    noise.start(now)
    bodyOsc.start(now)
    noise.stop(now + 0.015)
    bodyOsc.stop(now + 0.015)

    setTimeout(() => {
      noise.disconnect()
      filter.disconnect()
      noiseGain.disconnect()
      bodyOsc.disconnect()
      bodyGain.disconnect()
    }, 60)
  }

  /**
   * Serene 2-note harmonic acoustic chord for modal entrance
   */
  private playModalOpenSound(ctx: AudioContext, destination: AudioNode): void {
    const now = ctx.currentTime
    const notes = [293.66, 440.0] // D4 and A4 (Perfect Fifth)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, now + idx * 0.02)

      gain.gain.setValueAtTime(0, now + idx * 0.02)
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.02 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1)

      osc.connect(gain)
      gain.connect(destination)
      osc.start(now + idx * 0.02)
      osc.stop(now + 1.2)

      setTimeout(() => {
        osc.disconnect()
        gain.disconnect()
      }, 1300)
    })
  }

  /**
   * Uplifting 3-note ascending acoustic pentatonic resolution for form submission
   */
  private playSuccessChimeSound(ctx: AudioContext, destination: AudioNode): void {
    const now = ctx.currentTime
    const notes = [587.33, 739.99, 880.0] // D5, F#5, A5 (D Major Triad)

    notes.forEach((freq, idx) => {
      const time = now + idx * 0.065
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, time)

      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.24, time + 0.003)
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.0)

      // High sparkle overtone
      const spark = ctx.createOscillator()
      const sparkGain = ctx.createGain()
      spark.type = "sine"
      spark.frequency.setValueAtTime(freq * 2.756, time)
      sparkGain.gain.setValueAtTime(0, time)
      sparkGain.gain.linearRampToValueAtTime(0.05, time + 0.002)
      sparkGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28)

      osc.connect(gain)
      spark.connect(sparkGain)
      gain.connect(destination)
      sparkGain.connect(destination)

      osc.start(time)
      spark.start(time)
      osc.stop(time + 1.05)
      spark.stop(time + 0.3)

      setTimeout(() => {
        osc.disconnect()
        gain.disconnect()
        spark.disconnect()
        sparkGain.disconnect()
      }, 1200)
    })
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

  /**
   * Loud, punchy rhythmic synth triplet
   */
  private playSynthRhythm(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime

    const playNote = (timeOffset: number, freq: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = "sawtooth"
      // Keep it thick and loud by lowering an octave
      osc.frequency.setValueAtTime(freq * 0.5, now + timeOffset)

      filter.type = "lowpass"
      filter.frequency.setValueAtTime(8000, now + timeOffset)
      filter.frequency.exponentialRampToValueAtTime(100, now + timeOffset + 0.1)
      filter.Q.value = 8 // Add some resonant bite

      gain.gain.setValueAtTime(0, now + timeOffset)
      gain.gain.linearRampToValueAtTime(vol, now + timeOffset + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + duration)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(destination)

      osc.start(now + timeOffset)
      osc.stop(now + timeOffset + duration + 0.1)

      setTimeout(() => {
        osc.disconnect()
        filter.disconnect()
        gain.disconnect()
      }, (timeOffset + duration + 0.2) * 1000)
    }

    // Play a quick loud rhythmic burst: fundamental, octave, fifth
    playNote(0, f0, 0.1, 0.6)
    playNote(0.08, f0 * 2, 0.1, 0.4)
    playNote(0.16, f0 * 1.5, 0.15, 0.5)
  }

  /**
   * Heavy, deep, punchy FM synth bass
   */
  private playCyberBass(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const distortion = ctx.createWaveShaper()

    osc.type = "square"
    // Drop 2 octaves for deep bass
    osc.frequency.setValueAtTime(f0 * 0.25, now)
    
    // Quick pitch drop for punch (kick drum effect)
    osc.frequency.exponentialRampToValueAtTime(f0 * 0.125, now + 0.1)

    // Distortion curve for aggression
    const curve = new Float32Array(400)
    for (let i = 0; i < 400; ++i) {
      const x = (i * 2) / 400 - 1
      curve[i] = ((3 + 20) * x * 20 * (Math.PI / 180)) / (Math.PI + 20 * Math.abs(x))
    }
    distortion.curve = curve
    distortion.oversample = "4x"

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.7, now + 0.01) // Very loud attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

    osc.connect(distortion)
    distortion.connect(gain)
    gain.connect(destination)

    osc.start(now)
    osc.stop(now + 0.3)

    setTimeout(() => {
      osc.disconnect()
      distortion.disconnect()
      gain.disconnect()
    }, 400)
  }

  /**
   * 8-bit arcade arpeggio
   */
  private playRetroArcade(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "square"
    // Rapid arpeggio (fundamental -> major third -> perfect fifth -> octave)
    osc.frequency.setValueAtTime(f0, now)
    osc.frequency.setValueAtTime(f0 * 1.25, now + 0.05)
    osc.frequency.setValueAtTime(f0 * 1.5, now + 0.1)
    osc.frequency.setValueAtTime(f0 * 2, now + 0.15)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.4, now + 0.01)
    // Keep volume steady during arpeggio, then drop
    gain.gain.setValueAtTime(0.4, now + 0.15)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

    osc.connect(gain)
    gain.connect(destination)

    osc.start(now)
    osc.stop(now + 0.3)

    setTimeout(() => {
      osc.disconnect()
      gain.disconnect()
    }, 400)
  }

  /**
   * Loud, squelchy synth zap with high resonance
   */
  private playTechnoZap(ctx: AudioContext, destination: AudioNode, f0: number): void {
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(f0, now)

    filter.type = "bandpass"
    filter.frequency.setValueAtTime(5000, now)
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.15)
    filter.Q.value = 15 // Very resonant and squelchy

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(1.0, now + 0.01) // Very loud
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(destination)

    osc.start(now)
    osc.stop(now + 0.25)

    setTimeout(() => {
      osc.disconnect()
      filter.disconnect()
      gain.disconnect()
    }, 300)
  }

  /**
   * Aggressive, loud mechanical click/clank
   */
  private playHeavyClick(ctx: AudioContext, destination: AudioNode): void {
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const noise = ctx.createBufferSource()
    const gain = ctx.createGain()
    
    // Create a burst of white noise
    const bufferSize = ctx.sampleRate * 0.1 // 100ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    noise.buffer = buffer

    osc.type = "square"
    osc.frequency.setValueAtTime(100, now)
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.05)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.8, now + 0.002) // Extremely fast attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1) // Snappy decay

    osc.connect(gain)
    noise.connect(gain)
    gain.connect(destination)

    osc.start(now)
    noise.start(now)
    osc.stop(now + 0.15)
    noise.stop(now + 0.15)

    setTimeout(() => {
      osc.disconnect()
      noise.disconnect()
      gain.disconnect()
    }, 200)
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
  public playButtonHover(_volume: number = 0.35, index: number = 0): void {
    if (this.isHoverSuppressed()) return

    const nowMs = performance.now()
    if (nowMs - this.lastHoverSoundTime < 60) return
    this.lastHoverSoundTime = nowMs

    const ctx = this.initContext()
    if (!ctx || !this.compressor) return

    // Pick a pentatonic scale note based on index for variety
    const scaleLength = SCALE_FREQUENCIES.length
    const fundamental = SCALE_FREQUENCIES[Math.min(scaleLength - 1, index % scaleLength)] || 440

    // Temporarily boost master gain for this note to match volume requested
    this.playGlockenspielBar(ctx, this.compressor, fundamental)
  }

  /**
   * Plays a differentiated acoustic physical instrument tone for different sections
   * Keeps everything in the pristine acoustic percussion & chime category without repetition.
   */
  public playAcousticHover(
    type: 'glockenspiel' | 'vibraphone' | 'marimba' | 'celesta' | 'kalimba' | 'wood-tap' = 'glockenspiel',
    volume: number = 0.35,
    index: number = 0
  ): void {
    if (this.isHoverSuppressed()) return

    const nowMs = performance.now()
    if (nowMs - this.lastHoverSoundTime < 60) return
    this.lastHoverSoundTime = nowMs

    const ctx = this.initContext()
    if (!ctx || !this.compressor) return

    const scaleLength = SCALE_FREQUENCIES.length
    const fundamental = SCALE_FREQUENCIES[Math.min(scaleLength - 1, index % scaleLength)] || 440

    switch (type) {
      case 'vibraphone':
        this.playVibraphoneBar(ctx, this.compressor, fundamental)
        break
      case 'marimba':
        this.playMarimbaBar(ctx, this.compressor, fundamental)
        break
      case 'celesta':
        this.playCelestaBar(ctx, this.compressor, fundamental)
        break
      case 'kalimba':
        this.playKalimbaBar(ctx, this.compressor, fundamental)
        break
      case 'wood-tap':
        this.playWoodTapSound(ctx, this.compressor, volume)
        break
      case 'glockenspiel':
      default:
        this.playGlockenspielBar(ctx, this.compressor, fundamental)
        break
    }
  }

  /**
   * Velvety, lush acoustic vibraphone chime — ideal for Footer helix and action buttons
   */
  public playVibraphone(volume: number = 0.35, index: number = 0): void {
    this.playAcousticHover('vibraphone', volume, index)
  }

  /**
   * Warm, hollow wooden marimba strike — ideal for Services / Our Work section
   */
  public playMarimba(volume: number = 0.35, index: number = 0): void {
    this.playAcousticHover('marimba', volume, index)
  }

  /**
   * Crystalline, fairy-bell celesta micro-chime — ideal for fixed Navbar controls
   */
  public playCelesta(volume: number = 0.25, index: number = 0): void {
    this.playAcousticHover('celesta', volume, index)
  }

  /**
   * Tactile plucked kalimba metal tine — ideal for Carousel / Project card interactions
   */
  public playKalimba(volume: number = 0.3, index: number = 0): void {
    this.playAcousticHover('kalimba', volume, index)
  }

  /**
   * Refined organic acoustic wooden tap — ideal for links, credits, and UI toggles
   */
  public playWoodTap(volume: number = 0.2): void {
    const ctx = this.initContext()
    if (!ctx || !this.compressor) return
    this.playWoodTapSound(ctx, this.compressor, volume)
  }

  /**
   * Atmospheric harmonic chord chime — triggered when opening Contact or About modals
   */
  public playModalOpen(): void {
    const ctx = this.initContext()
    if (!ctx || !this.compressor) return
    this.playModalOpenSound(ctx, this.compressor)
  }

  /**
   * Uplifting harmonic resolution chord — triggered on form submission
   */
  public playSuccessChime(): void {
    const ctx = this.initContext()
    if (!ctx || !this.compressor) return
    this.playSuccessChimeSound(ctx, this.compressor)
  }

  /**
   * Crisp, tactile physical card click sound — triggered on card click in projects carousel
   */
  public playCardClick(volume: number = 0.28): void {
    const ctx = this.initContext()
    if (!ctx || !this.compressor) return
    const now = ctx.currentTime

    // 1. Crisp tactile snap transient
    const snapOsc = ctx.createOscillator()
    const snapGain = ctx.createGain()
    snapOsc.type = "triangle"
    snapOsc.frequency.setValueAtTime(1400, now)
    snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.007)

    snapGain.gain.setValueAtTime(0, now)
    snapGain.gain.linearRampToValueAtTime(Math.min(0.6, volume * 1.5), now + 0.001)
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.009)

    snapOsc.connect(snapGain)
    snapGain.connect(this.compressor)
    snapOsc.start(now)
    snapOsc.stop(now + 0.012)

    // 2. Subtle organic body tap
    const bodyOsc = ctx.createOscillator()
    const bodyGain = ctx.createGain()
    bodyOsc.type = "sine"
    bodyOsc.frequency.setValueAtTime(340, now)
    bodyOsc.frequency.exponentialRampToValueAtTime(110, now + 0.014)

    bodyGain.gain.setValueAtTime(volume * 0.7, now)
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016)

    bodyOsc.connect(bodyGain)
    bodyGain.connect(this.compressor)
    bodyOsc.start(now)
    bodyOsc.stop(now + 0.018)

    setTimeout(() => {
      snapOsc.disconnect()
      snapGain.disconnect()
      bodyOsc.disconnect()
      bodyGain.disconnect()
    }, 50)
  }

  /**
   * Signature single best warm rosewood marimba tone — used consistently for all service items
   */
  public playServiceSelect(volume: number = 1.0): void {
    const ctx = this.initContext()
    if (!ctx || !this.compressor) return
    // Constant signature frequency: E4 (329.63 Hz) for ideal rich hollow woody tone
    const signatureFreq = 329.63
    this.playMarimbaBar(ctx, this.compressor, signatureFreq, volume)
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

