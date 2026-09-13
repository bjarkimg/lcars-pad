// Starfleet LCARS Official Audio Engine
// Preloads and plays official Star Trek audio recordings with zero-latency WebAudio buffers

export type TapGroup = 'stock' | 'lcars' | 'done' | 'chirp';

export interface TapSound {
  id: string;
  label: string;
  file: string;
  ms: number;
  group: TapGroup;
  note: string;
  /** Spoken computer line, if the clip has Majel / TNG voice. */
  says?: string;
}

/** Button caption: spoken line, or the catalog label. Caps at 25 chars if asked. */
export function tapCaption(tap: TapSound, maxChars = 0): string {
  const raw = (tap.says || tap.label).trim();
  if (maxChars > 0 && raw.length > maxChars) return raw.slice(0, maxChars);
  return raw;
}

export const TAP_SOUNDS: TapSound[] = [
  { id: 'padd_1', label: 'PADD 1 (MENU)', file: '/sounds/taps/padd_1.mp3', ms: 845, group: 'stock', note: 'Left nav only' },
  { id: 'padd_2', label: 'PADD 2', file: '/sounds/taps/padd_2.mp3', ms: 830, group: 'stock', note: 'Alt PADD, still long' },
  { id: 'padd_3', label: 'PADD 3 (BUTTONS)', file: '/sounds/taps/padd_3.mp3', ms: 186, group: 'stock', note: 'Default button tap' },
  { id: 'beep_1', label: 'BEEP 1', file: '/sounds/taps/beep_1.mp3', ms: 936, group: 'stock', note: 'Command beep' },
  { id: 'beep_2', label: 'BEEP 2', file: '/sounds/taps/beep_2.mp3', ms: 744, group: 'stock', note: 'Alert beep' },
  { id: 'beep_3', label: 'BEEP 3', file: '/sounds/taps/beep_3.mp3', ms: 888, group: 'stock', note: 'Console beep' },
  { id: 'beep_soft', label: 'BEEP SOFT', file: '/sounds/taps/beep_soft.mp3', ms: 312, group: 'stock', note: 'Softer console pip' },
  { id: 'ack_lcars_1', label: 'LCARS ACK 1', file: '/sounds/taps/ack_lcars_1.mp3', ms: 2532, group: 'lcars', note: 'Voice', says: 'Working.' },
  { id: 'ack_lcars_2', label: 'LCARS ACK 2', file: '/sounds/taps/ack_lcars_2.mp3', ms: 2278, group: 'lcars', note: 'Voice', says: 'Priority clearance recognition, Alpha 1.' },
  { id: 'ack_lcars_3', label: 'LCARS ACK 3', file: '/sounds/taps/ack_lcars_3.mp3', ms: 2084, group: 'lcars', note: 'Voice', says: 'That program is available.' },
  { id: 'ack_lcars_4', label: 'LCARS ACK 4', file: '/sounds/taps/ack_lcars_4.mp3', ms: 1995, group: 'lcars', note: 'Voice', says: 'Program in progress.' },
  { id: 'ack_lcars_5', label: 'LCARS ACK 5', file: '/sounds/taps/ack_lcars_5.mp3', ms: 1769, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_6', label: 'LCARS ACK 6', file: '/sounds/taps/ack_lcars_6.mp3', ms: 1174, group: 'lcars', note: 'Voice', says: 'Searching.' },
  { id: 'ack_lcars_7', label: 'LCARS ACK 7', file: '/sounds/taps/ack_lcars_7.mp3', ms: 1036, group: 'lcars', note: 'Voice', says: 'Working.' },
  { id: 'ack_lcars_8', label: 'LCARS ACK 8', file: '/sounds/taps/ack_lcars_8.mp3', ms: 959, group: 'lcars', note: 'Voice', says: 'Affirmative.' },
  { id: 'ack_lcars_9', label: 'LCARS ACK 9', file: '/sounds/taps/ack_lcars_9.mp3', ms: 785, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_10', label: 'LCARS ACK 10', file: '/sounds/taps/ack_lcars_10.mp3', ms: 772, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_11', label: 'LCARS ACK 11', file: '/sounds/taps/ack_lcars_11.mp3', ms: 720, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_12', label: 'LCARS ACK 12', file: '/sounds/taps/ack_lcars_12.mp3', ms: 768, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_13', label: 'LCARS ACK 13', file: '/sounds/taps/ack_lcars_13.mp3', ms: 936, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_14', label: 'LCARS ACK 14', file: '/sounds/taps/ack_lcars_14.mp3', ms: 552, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_15', label: 'LCARS ACK 15', file: '/sounds/taps/ack_lcars_15.mp3', ms: 528, group: 'lcars', note: 'Tone only' },
  { id: 'ack_lcars_16', label: 'LCARS ACK 16', file: '/sounds/taps/ack_lcars_16.mp3', ms: 888, group: 'lcars', note: 'Tone only' },
  { id: 'start_lcars_1', label: 'LCARS START 1', file: '/sounds/taps/start_lcars_1.mp3', ms: 2645, group: 'lcars', note: 'Voice', says: 'The program has been re-initiated.' },
  { id: 'start_lcars_2', label: 'LCARS START 2', file: '/sounds/taps/start_lcars_2.mp3', ms: 2016, group: 'lcars', note: 'Voice', says: 'Program loaded and ready.' },
  { id: 'start_lcars_3', label: 'LCARS START 3', file: '/sounds/taps/start_lcars_3.mp3', ms: 913, group: 'lcars', note: 'Voice', says: 'Enter when ready.' },
  { id: 'err_lcars_1', label: 'LCARS ERR 1', file: '/sounds/taps/err_lcars_1.mp3', ms: 1638, group: 'lcars', note: 'Voice', says: 'Unable to comply.' },
  { id: 'err_lcars_2', label: 'LCARS ERR 2', file: '/sounds/taps/err_lcars_2.mp3', ms: 2711, group: 'lcars', note: 'Voice', says: 'Your request does not fall within current guidelines.' },
  { id: 'err_lcars_3', label: 'LCARS ERR 3', file: '/sounds/taps/err_lcars_3.mp3', ms: 2231, group: 'lcars', note: 'Voice', says: 'Input algorithm not accepted.' },
  { id: 'err_lcars_4', label: 'LCARS ERR 4', file: '/sounds/taps/err_lcars_4.mp3', ms: 2040, group: 'lcars', note: 'Voice', says: 'That information is not available.' },
  { id: 'err_lcars_5', label: 'LCARS ERR 5', file: '/sounds/taps/err_lcars_5.mp3', ms: 2372, group: 'lcars', note: 'Voice', says: 'Command functions are offline.' },
  { id: 'err_lcars_6', label: 'LCARS ERR 6', file: '/sounds/taps/err_lcars_6.mp3', ms: 925, group: 'lcars', note: 'Voice', says: 'Negative.' },
  { id: 'input_lcars_5', label: 'LCARS INPUT 5', file: '/sounds/taps/input_lcars_5.mp3', ms: 718, group: 'lcars', note: 'Tone only' },
  { id: 'input_lcars_11', label: 'LCARS INPUT 11', file: '/sounds/taps/input_lcars_11.mp3', ms: 946, group: 'lcars', note: 'Voice', says: 'Select menu.' },
  { id: 'done_lcars_1', label: 'LCARS DONE 1', file: '/sounds/taps/done_lcars_1.mp3', ms: 2203, group: 'done', note: 'Voice', says: 'Command codes verified.' },
  { id: 'done_lcars_2', label: 'LCARS DONE 2', file: '/sounds/taps/done_lcars_2.mp3', ms: 2575, group: 'done', note: 'Voice', says: 'Program Alpha 1 is now complete.' },
  { id: 'done_lcars_3', label: 'LCARS DONE 3', file: '/sounds/taps/done_lcars_3.mp3', ms: 2191, group: 'done', note: 'Voice', says: 'Transfer complete.' },
  { id: 'done_lcars_4', label: 'LCARS DONE 4', file: '/sounds/taps/done_lcars_4.mp3', ms: 1213, group: 'done', note: 'Voice', says: 'Program complete.' },
  { id: 'done_lcars_5', label: 'LCARS DONE 5', file: '/sounds/taps/done_lcars_5.mp3', ms: 1997, group: 'done', note: 'Voice', says: 'Holodeck 3 program is ready.' },
  { id: 'done_lcars_6', label: 'LCARS DONE 6', file: '/sounds/taps/done_lcars_6.mp3', ms: 1371, group: 'done', note: 'Voice', says: 'Diagnostic complete.' },
  { id: 'done_lcars_7', label: 'LCARS DONE 7', file: '/sounds/taps/done_lcars_7.mp3', ms: 775, group: 'done', note: 'Voice', says: 'Executed.' },
  { id: 'chirp_hi', label: 'CHIRP HI', file: '/sounds/taps/chirp_hi.mp3', ms: 80, group: 'chirp', note: '80ms 2.1 kHz' },
  { id: 'chirp_mid', label: 'CHIRP MID', file: '/sounds/taps/chirp_mid.mp3', ms: 90, group: 'chirp', note: '90ms 1.6 kHz' },
  { id: 'chirp_lo', label: 'CHIRP LO', file: '/sounds/taps/chirp_lo.mp3', ms: 100, group: 'chirp', note: '100ms 1.2 kHz' },
  { id: 'chirp_drop', label: 'CHIRP DROP', file: '/sounds/taps/chirp_drop.mp3', ms: 120, group: 'chirp', note: '120ms falling' },
  { id: 'chirp_blip', label: 'CHIRP BLIP', file: '/sounds/taps/chirp_blip.mp3', ms: 95, group: 'chirp', note: 'Two-tone blip' },
];

const TAP_STORAGE_KEY = 'lcars_tap_sound';
const TAP_BY_ID = Object.fromEntries(TAP_SOUNDS.map((t) => [t.id, t]));
const DEFAULT_TAP_ID = 'padd_3';
const MENU_TAP_ID = 'padd_1';

class OfficialLcarsSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isHapticsEnabled: boolean = true;
  private masterGain: GainNode | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private isPreloading: boolean = false;
  private isPreloaded: boolean = false;

  // Ambient loop sources
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientActive: boolean = false;

  // Alert sound sources
  private redAlertSource: AudioBufferSourceNode | null = null;
  private redAlertGain: GainNode | null = null;
  private isRedAlertActive: boolean = false;

  private activeTapId: string = DEFAULT_TAP_ID;

  private soundUrls: Record<string, string> = {
    touch: '/sounds/taps/padd_3.mp3',
    command: '/sounds/beep_1.mp3',
    yellowAlert: '/sounds/beep_2.mp3',
    ack: '/sounds/input_ok.mp3',
    affirm: '/sounds/input_ok_2.mp3',
    error: '/sounds/input_failed.mp3',
    communicator: '/sounds/communicator.mp3',
    redAlert: '/sounds/red_alert.mp3',
    warpHum: '/sounds/warp_hum.mp3',
    bridgeAmbient: '/sounds/bridge_ambient.mp3',
    ...Object.fromEntries(TAP_SOUNDS.map((t) => [t.id, t.file])),
  };

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(TAP_STORAGE_KEY);
      // Old default was padd_1; that tap is now reserved for the left menu.
      if (saved && TAP_BY_ID[saved] && saved !== MENU_TAP_ID) {
        this.activeTapId = saved;
        this.soundUrls.touch = TAP_BY_ID[saved].file;
      } else {
        this.activeTapId = DEFAULT_TAP_ID;
        this.soundUrls.touch = TAP_BY_ID[DEFAULT_TAP_ID].file;
        localStorage.setItem(TAP_STORAGE_KEY, DEFAULT_TAP_ID);
      }
    }
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.isPreloaded && !this.isPreloading) {
      this.preloadAllSounds();
    }
  }

  // Preload and decode all audio files directly into memory buffers
  public async preloadAllSounds() {
    if (this.isPreloaded || this.isPreloading) return;
    this.isPreloading = true;
    this.init();

    if (!this.ctx) return;

    for (const [key, url] of Object.entries(this.soundUrls)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const decoded = await this.ctx.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(key, decoded);
      } catch (err) {
        console.warn(`Failed to preload audio: ${key}`, err);
      }
    }
    this.isPreloaded = true;
    this.isPreloading = false;
  }

  private triggerHaptic(pattern: number | number[] = 30) {
    if (!this.isHapticsEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptic errors
      }
    }
  }

  private playBuffer(key: string, gainMultiplier: number = 0.5) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const buffer = this.audioBuffers.get(key);
    if (!buffer) {
      this.loadAndPlay(key, gainMultiplier);
      return;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(gainMultiplier, this.ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);
  }

  private async loadAndPlay(key: string, gainMultiplier: number = 0.5) {
    const url = this.soundUrls[key];
    if (!url || !this.ctx || !this.masterGain) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(key, decoded);

      const source = this.ctx.createBufferSource();
      source.buffer = decoded;

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(gainMultiplier, this.ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(this.masterGain);

      source.start(0);
    } catch {
      // Fallback
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      if (this.isAmbientActive) {
        this.stopWarpHum();
      }
      if (this.isRedAlertActive) {
        this.stopRedAlert();
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setHaptics(enabled: boolean) {
    this.isHapticsEnabled = enabled;
  }

  public getHaptics(): boolean {
    return this.isHapticsEnabled;
  }

  public getTapId(): string {
    return this.activeTapId;
  }

  public setTapId(id: string) {
    if (!TAP_BY_ID[id]) return;
    this.activeTapId = id;
    this.soundUrls.touch = TAP_BY_ID[id].file;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TAP_STORAGE_KEY, id);
    }
  }

  // Button tap. Optional id previews a library entry without changing the default.
  public playTouch(tapId?: string | number) {
    if (this.isMuted) return;
    this.triggerHaptic(30);
    const id = typeof tapId === 'string' && TAP_BY_ID[tapId] ? tapId : this.activeTapId;
    this.playBuffer(id, 0.65);
  }

  public playSoftTap() {
    this.playTouch();
  }

  public playMenuTap() {
    this.playTouch(MENU_TAP_ID);
  }

  // 2. COMMAND / EXECUTION BEEP (beep_1.mp3)
  public playCommand() {
    if (this.isMuted) return;
    this.triggerHaptic(45);
    this.playBuffer('command', 0.7);
  }

  // 3. 2-TONE ACKNOWLEDGMENT (input_ok.mp3)
  public playAcknowledge() {
    if (this.isMuted) return;
    this.triggerHaptic([30, 40, 30]);
    this.playBuffer('ack', 0.75);
  }

  // 4. 3-TONE CONFIRMATION (input_ok_2.mp3)
  public playAffirmative() {
    if (this.isMuted) return;
    this.triggerHaptic([25, 30, 25, 30, 40]);
    this.playBuffer('affirm', 0.75);
  }

  // 5. ERROR / REJECT (input_failed.mp3)
  public playError() {
    if (this.isMuted) return;
    this.triggerHaptic([60, 40, 60]);
    this.playBuffer('error', 0.75);
  }

  // 6. COMMUNICATOR BADGE (communicator.mp3)
  public playCommunicator() {
    if (this.isMuted) return;
    this.triggerHaptic([40, 35, 50]);
    this.playBuffer('communicator', 0.85);
  }

  // 7. Official Console Error / Reject Buzz
  public playError() {
    if (this.isMuted) return;
    this.triggerHaptic([35, 25, 35]);
    this.playBuffer('error', 0.75);
  }

  // 8. Official TNG Red Alert Klaxon (Continuous loop with start/stop control)
  public playRedAlert() {
    if (this.isMuted) return;
    this.stopRedAlert();
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([90, 45, 90, 45, 90]);
    this.isRedAlertActive = true;

    const buffer = this.audioBuffers.get('redAlert');
    if (!buffer) {
      this.loadAndPlayRedAlert();
      return;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    source.connect(gain);
    gain.connect(this.masterGain);

    source.start(0);

    this.redAlertSource = source;
    this.redAlertGain = gain;
  }

  private async loadAndPlayRedAlert() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const response = await fetch(this.soundUrls.redAlert);
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(arrayBuffer);
      this.audioBuffers.set('redAlert', decoded);

      if (!this.isRedAlertActive) return;

      const source = this.ctx.createBufferSource();
      source.buffer = decoded;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      source.connect(gain);
      gain.connect(this.masterGain);

      source.start(0);

      this.redAlertSource = source;
      this.redAlertGain = gain;
    } catch {
      // Ignored
    }
  }

  public stopRedAlert() {
    this.isRedAlertActive = false;
    if (!this.redAlertSource || !this.ctx) {
      this.redAlertSource = null;
      this.redAlertGain = null;
      return;
    }

    try {
      if (this.redAlertGain) {
        const now = this.ctx.currentTime;
        this.redAlertGain.gain.setValueAtTime(this.redAlertGain.gain.value, now);
        this.redAlertGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      }
      const src = this.redAlertSource;
      setTimeout(() => {
        try {
          src.stop();
          src.disconnect();
        } catch {
          // Ignored
        }
      }, 120);
    } catch {
      // Ignored
    }

    this.redAlertSource = null;
    this.redAlertGain = null;
  }

  public isRedAlert(): boolean {
    return this.isRedAlertActive;
  }

  // 9. Official Yellow Alert Warning Pulse
  public playYellowAlert() {
    this.stopRedAlert();
    if (this.isMuted) return;
    this.triggerHaptic([40, 20, 40]);
    this.playBuffer('yellowAlert', 0.85);
  }

  // 9. Official Ambient Warp Core & Bridge Background Loop
  public toggleWarpHum(): boolean {
    if (this.isAmbientActive) {
      this.stopWarpHum();
      return false;
    } else {
      this.startWarpHum();
      return true;
    }
  }

  public startWarpHum() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain || this.isAmbientActive) return;

    const buffer = this.audioBuffers.get('warpHum') || this.audioBuffers.get('bridgeAmbient');
    if (!buffer) {
      this.loadAndPlayAmbient();
      return;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.5);

    source.connect(gain);
    gain.connect(this.masterGain);

    source.start(0);

    this.ambientSource = source;
    this.ambientGain = gain;
    this.isAmbientActive = true;
  }

  private async loadAndPlayAmbient() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const response = await fetch(this.soundUrls.warpHum);
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(arrayBuffer);
      this.audioBuffers.set('warpHum', decoded);

      const source = this.ctx.createBufferSource();
      source.buffer = decoded;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.5);

      source.connect(gain);
      gain.connect(this.masterGain);

      source.start(0);

      this.ambientSource = source;
      this.ambientGain = gain;
      this.isAmbientActive = true;
    } catch {
      // Ignored
    }
  }

  public stopWarpHum() {
    if (!this.ambientSource || !this.ambientGain || !this.ctx) {
      this.isAmbientActive = false;
      return;
    }

    const now = this.ctx.currentTime;
    this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 0.6);

    setTimeout(() => {
      try {
        this.ambientSource?.stop();
        this.ambientSource?.disconnect();
      } catch {
        // Ignored
      }
      this.ambientSource = null;
      this.ambientGain = null;
      this.isAmbientActive = false;
    }, 700);
  }

  public isWarpActive(): boolean {
    return this.isAmbientActive;
  }

  public speak(text: string) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const line = (text || '').trim();
    if (!line) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(line);
    utter.rate = 0.92;
    utter.pitch = 1.05;
    utter.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) =>
      /google uk english female|samantha|zira|female/i.test(voice.name) && /^en/i.test(voice.lang),
    ) || voices.find((voice) => /^en/i.test(voice.lang));
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }

  public playScanComplete() {
    this.playAffirmative();
    this.speak('Scanning complete');
  }
}

export const sounds = new OfficialLcarsSoundEngine();
