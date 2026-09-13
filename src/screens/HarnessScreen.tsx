import React, { useState, useEffect } from 'react';
import { LcarsPanel } from '../components/lcars/LcarsPanel';
import { LcarsButton } from '../components/lcars/LcarsButton';
import { sounds, TAP_SOUNDS, tapCaption, TapGroup } from '../audio/soundEngine';
import { FOLD_VIEWPORTS, aspectMatches } from '../foldViewports';

export const HarnessScreen: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [haptics, setHaptics] = useState(sounds.getHaptics());
  const [isWarpHumming, setIsWarpHumming] = useState(sounds.isWarpActive());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(typeof document !== 'undefined' ? !!document.fullscreenElement : false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;
      const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;

      if (!isFs) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  const toggleHaptics = () => {
    const next = !haptics;
    setHaptics(next);
    sounds.setHaptics(next);
  };

  const toggleWarpHum = () => {
    const active = sounds.toggleWarpHum();
    setIsWarpHumming(active);
  };

  const [activeTap, setActiveTap] = useState(sounds.getTapId());
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openFoldWindow = (kind: 'cover' | 'inner') => {
    const spec = FOLD_VIEWPORTS[kind];
    const hash = window.location.hash || '#harness';
    const url = `${window.location.origin}/${hash}`;
    window.open(
      url,
      `lcars-fold-${kind}`,
      `width=${spec.width},height=${spec.height},menubar=no,toolbar=no,location=no,status=no,resizable=yes`,
    );
    sounds.playAcknowledge();
  };

  const enableFrame = (kind: 'cover' | 'inner') => {
    const hash = window.location.hash || '#harness';
    sounds.playCommand();
    window.location.href = `/?frame=${kind}${hash}`;
  };

  const previewTap = (id: string) => {
    sounds.playTouch(id);
  };

  const useTap = (id: string) => {
    sounds.setTapId(id);
    setActiveTap(id);
    sounds.playTouch(id);
  };

  const tapGroups: { id: TapGroup; title: string }[] = [
    { id: 'stock', title: 'STOCK PADD / BEEP' },
    { id: 'done', title: 'LCARS DONE / COMPLETE (LIKE DONE 7)' },
    { id: 'lcars', title: 'TNG LCARS ACK / START / ERR' },
    { id: 'chirp', title: 'SHORT CHIRPS (80–120 MS)' },
  ];

  const installPwa = async () => {
    if (deferredPrompt) {
      sounds.playAffirmative();
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      sounds.playCommand();
      setShowInstallGuide(true);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full min-h-full pb-28 sm:pb-32 p-1">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-900/80 border-l-4 border-[#CC99CC] rounded-r-md">
        <div>
          <span className="font-lcars text-xl font-bold text-[#CC99CC] tracking-wider block">
            STARFLEET ACOUSTIC & HARNESS CONTROL
          </span>
          <span className="font-mono-tech text-xs text-zinc-400">
            OFFICIAL TNG/VOYAGER SOUND EFFECTS & AUDIO ARCHIVES
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LcarsPanel title="PADD TAP LIBRARY // TEST & ASSIGN" code="TAP-01" color="gold" headerColor="gold">
          <p className="text-xs text-zinc-400 font-mono-tech mb-3">
            Button taps default to PADD 3. Left menu always uses PADD 1. USE assigns the in-page button tap.
            Active: <span className="text-[#FFCC00] font-bold">{activeTap.toUpperCase()}</span>
          </p>

          {tapGroups.map((group) => (
            <div key={group.id} className="mb-3">
              <span className="font-mono-tech text-[10px] text-zinc-500 block mb-1.5">{group.title}</span>
              <div className="grid grid-cols-1 gap-1.5">
                {TAP_SOUNDS.filter((t) => t.group === group.id).map((tap) => {
                  const isActive = activeTap === tap.id;
                  return (
                    <div key={tap.id} className="flex items-stretch gap-1.5">
                      <LcarsButton
                        color={isActive ? 'gold' : 'gray'}
                        pill="left"
                        code={`${tap.ms}MS`}
                        soundType="none"
                        wrap
                        className="flex-1 !min-h-[3.25rem] items-start sm:items-center"
                        onClick={() => previewTap(tap.id)}
                      >
                        {tapCaption(tap)}
                        <span className="block font-mono-tech text-[9px] opacity-70 normal-case tracking-normal">
                          {tap.says ? tap.label : tap.note}
                        </span>
                      </LcarsButton>
                      <LcarsButton
                        color={isActive ? 'ice' : 'amber'}
                        pill="right"
                        code={isActive ? 'ON' : 'USE'}
                        soundType="none"
                        onClick={() => useTap(tap.id)}
                      >
                        {isActive ? 'ACTIVE' : 'USE'}
                      </LcarsButton>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-2 pt-3 border-t border-zinc-800">
            <LcarsButton color="amber" pill="both" code="CMD-01" onClick={() => sounds.playCommand()}>
              COMMAND BEEP (NOT A TAP)
            </LcarsButton>
          </div>
        </LcarsPanel>

        {/* Command & Execution Audio */}
        <LcarsPanel title="STARFLEET CHIMES & ALARMS" code="CMD-02" color="lilac" headerColor="lilac">
          <p className="text-xs text-zinc-400 font-mono-tech mb-3">
            Distinct 1-to-1 audio cues for actions, acknowledgments, communicator, and klaxons:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <LcarsButton color="ice" pill="both" code="COMM" onClick={() => sounds.playCommunicator()}>
              COMMUNICATOR BADGE
            </LcarsButton>
            <LcarsButton color="ice" pill="both" code="ACK-2" onClick={() => sounds.playAcknowledge()}>
              2-TONE ACKNOWLEDGE
            </LcarsButton>
            <LcarsButton color="lilac" pill="both" code="AFF-3" onClick={() => sounds.playAffirmative()}>
              3-TONE CONFIRMATION
            </LcarsButton>
            <LcarsButton color="salmon" pill="both" code="ERR" onClick={() => sounds.playError()}>
              CONSOLE REJECT
            </LcarsButton>
            <LcarsButton color="red" pill="both" code="KLAXON" className="col-span-1 sm:col-span-2" onClick={() => sounds.playRedAlert()}>
              RED ALERT KLAXON
            </LcarsButton>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800">
            <LcarsButton 
              color={isWarpHumming ? 'ice' : 'gray'} 
              pill="both" 
              code="WARP-DRONE"
              className="w-full"
              onClick={toggleWarpHum}
            >
              {isWarpHumming ? 'WARP CORE AMBIENT DRONE: ACTIVE [STOP]' : 'WARP CORE AMBIENT DRONE: INACTIVE [START]'}
            </LcarsButton>
          </div>
        </LcarsPanel>
      </div>

      <LcarsPanel title="COMPUTER / CONSOLE ARCHIVE" code="VOC-03" color="ice" headerColor="ice">
        <p className="text-xs text-zinc-400 font-mono-tech mb-3">
          Real TNG/Voyager console clips only. No synthesized computer voice.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          <LcarsButton color="lilac" pill="both" className="!px-2 !py-2 text-[11px]" onClick={() => sounds.playAffirmative()}>
            3-TONE CONFIRM
          </LcarsButton>
          <LcarsButton color="ice" pill="both" className="!px-2 !py-2 text-[11px]" onClick={() => sounds.playAcknowledge()}>
            2-TONE ACK
          </LcarsButton>
          <LcarsButton color="gold" pill="both" className="!px-2 !py-2 text-[11px]" onClick={() => sounds.playCommand()}>
            COMMAND BEEP
          </LcarsButton>
          <LcarsButton color="ice" pill="both" className="!px-2 !py-2 text-[11px]" onClick={() => sounds.playCommunicator()}>
            COMMUNICATOR
          </LcarsButton>
          <LcarsButton color="salmon" pill="both" className="!px-2 !py-2 text-[11px]" onClick={() => sounds.playError()}>
            REJECT
          </LcarsButton>
          <LcarsButton color="red" pill="both" className="!px-2 !py-2 text-[11px]" onClick={() => sounds.playRedAlert()}>
            RED ALERT
          </LcarsButton>
        </div>
      </LcarsPanel>

      <LcarsPanel title="FOLD VIEWPORT HARNESS" code="FOLD-10" color="gold" headerColor="gold">
        <p className="text-xs text-zinc-400 font-mono-tech mb-3">
          Live preview at Galaxy Z Fold cover (22:9) and inner (10:9). CLI: <span className="text-[#FFCC00]">npm run shots</span>
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-zinc-950 rounded border border-zinc-800 font-mono-tech text-xs mb-3">
          <span className="text-zinc-400">
            THIS DISPLAY: <span className="text-[#FFCC00] font-bold">{vp.w}×{vp.h}</span>
          </span>
          <span className="text-zinc-400">
            MATCH:{' '}
            <span className="text-[#99CCFF] font-bold">
              {aspectMatches(vp.w, vp.h, FOLD_VIEWPORTS.cover)
                ? 'COVER 22:9'
                : aspectMatches(vp.w, vp.h, FOLD_VIEWPORTS.inner)
                  ? 'INNER 10:9'
                  : 'NOT A FOLD FRAME'}
            </span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(['cover', 'inner'] as const).map((kind) => {
            const spec = FOLD_VIEWPORTS[kind];
            return (
              <div key={kind} className="p-2.5 bg-zinc-950 rounded border border-zinc-800 space-y-2">
                <span className="font-lcars text-sm font-bold text-[#FF9900] block">
                  {spec.label} // {spec.ratio}
                </span>
                <span className="font-mono-tech text-[11px] text-zinc-400 block">
                  {spec.width}×{spec.height} // {spec.note}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <LcarsButton color="gold" pill="left" className="!px-2 !py-1.5 text-[11px]" onClick={() => openFoldWindow(kind)}>
                    POPUP
                  </LcarsButton>
                  <LcarsButton color="amber" pill="right" className="!px-2 !py-1.5 text-[11px]" onClick={() => enableFrame(kind)}>
                    FRAME
                  </LcarsButton>
                </div>
              </div>
            );
          })}
        </div>
      </LcarsPanel>

      {/* Haptic & Hardware Diagnostics */}
      <LcarsPanel title="TACTILE HAPTIC HARDWARE MATRIX" code="HAP-09" color="amber" headerColor="amber">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-zinc-950 rounded border border-zinc-800 font-mono-tech text-xs">
            <span className="text-zinc-400">
              VIBRATION API: <span className={typeof navigator !== 'undefined' && 'vibrate' in navigator ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{typeof navigator !== 'undefined' && 'vibrate' in navigator ? 'SUPPORTED' : 'UNAVAILABLE'}</span>
            </span>
            <span className="text-zinc-400">
              SECURE CONTEXT: <span className={typeof window !== 'undefined' && window.isSecureContext ? 'text-green-400 font-bold' : 'text-amber-400 font-bold'}>{typeof window !== 'undefined' && window.isSecureContext ? 'HTTPS / SECURE' : 'INSECURE'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <LcarsButton color="gold" pill="both" code="40MS" onPointerDown={() => navigator.vibrate?.(40)} onClick={() => navigator.vibrate?.(40)}>
              TAP PULSE (40MS)
            </LcarsButton>
            <LcarsButton color="amber" pill="both" code="DOUBLE" onPointerDown={() => navigator.vibrate?.([60, 40, 60])} onClick={() => navigator.vibrate?.([60, 40, 60])}>
              DOUBLE PULSE
            </LcarsButton>
            <LcarsButton color="salmon" pill="both" code="150MS" onPointerDown={() => navigator.vibrate?.(150)} onClick={() => navigator.vibrate?.(150)}>
              STRONG PULSE (150MS)
            </LcarsButton>
          </div>

          <p className="text-[11px] text-zinc-400 font-mono-tech">
            <span className="text-amber-400 font-bold">NOTE:</span> If your device doesn't vibrate when tapping above, check your Galaxy phone settings: <span className="text-zinc-200">Settings → Sounds and vibration → Vibration intensity / System vibration (Touch interaction)</span> must be turned ON.
          </p>
        </div>
      </LcarsPanel>

      {/* System Preferences */}
      <LcarsPanel title="APPLICATION & HARDWARE SETTINGS" code="CFG-99" color="ice" headerColor="ice">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
            <div>
              <span className="font-lcars text-sm font-bold text-[#FF9900] block">
                AUDIO CHIMES
              </span>
              <span className="font-mono-tech text-[11px] text-zinc-400">
                {isMuted ? 'MUTED' : 'ENABLED'}
              </span>
            </div>
            <LcarsButton color={isMuted ? 'red' : 'ice'} pill="both" code="MUTE" onClick={toggleMute}>
              {isMuted ? 'UNMUTE' : 'MUTE'}
            </LcarsButton>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
            <div>
              <span className="font-lcars text-sm font-bold text-[#FFCC00] block">
                HAPTIC FEEDBACK
              </span>
              <span className="font-mono-tech text-[11px] text-zinc-400">
                {haptics ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <LcarsButton color={haptics ? 'gold' : 'gray'} pill="both" code="HAP" onClick={toggleHaptics}>
              {haptics ? 'ENABLED' : 'DISABLED'}
            </LcarsButton>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
            <div>
              <span className="font-lcars text-sm font-bold text-[#99CCFF] block">
                IMMERSIVE DISPLAY
              </span>
              <span className="font-mono-tech text-[11px] text-zinc-400">
                {isFullscreen ? 'FULLSCREEN' : 'STANDARD'}
              </span>
            </div>
            <LcarsButton color={isFullscreen ? 'ice' : 'lilac'} pill="both" code="FULL" onClick={toggleFullscreen}>
              {isFullscreen ? 'WINDOW' : 'FULLSCREEN'}
            </LcarsButton>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
            <div>
              <span className="font-lcars text-sm font-bold text-[#CC99CC] block">
                PWA APP
              </span>
              <span className="font-mono-tech text-[11px] text-zinc-400">
                {isInstalled ? 'INSTALLED' : 'ADD TO HOME'}
              </span>
            </div>
            <LcarsButton color={isInstalled ? 'ice' : 'amber'} pill="both" code="PWA" onClick={installPwa}>
              {isInstalled ? 'INSTALLED' : 'INSTALL'}
            </LcarsButton>
          </div>
        </div>
      </LcarsPanel>

      {/* PWA Install Instructions Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-950 border-2 border-[#FFCC00] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-lcars text-lg font-bold text-[#FFCC00] tracking-wider">
                INSTALL TO GALAXY Z FOLD
              </span>
              <span className="font-mono-tech text-xs text-zinc-400">PWA-GUIDE</span>
            </div>

            <p className="text-xs text-zinc-300 font-mono-tech">
              To install LCARS as a permanent standalone app on Android:
            </p>

            <ol className="text-xs text-zinc-300 font-mono-tech space-y-2 list-decimal list-inside bg-zinc-900/60 p-3 rounded border border-zinc-800">
              <li>Tap Chrome's <span className="text-[#FF9900] font-bold">⋮ (3-dots menu)</span> in the top-right corner.</li>
              <li>Select <span className="text-[#99CCFF] font-bold">"Install app"</span> or <span className="text-[#99CCFF] font-bold">"Add to Home screen"</span>.</li>
              <li>Tap <span className="text-[#CC99CC] font-bold">Install</span>.</li>
            </ol>

            <p className="text-[11px] text-zinc-400 font-mono-tech">
              The LCARS Delta app icon will appear on your home screen and open in full immersive edge-to-edge mode.
            </p>

            <div className="pt-2">
              <LcarsButton
                color="gold"
                pill="both"
                code="CLOSE"
                className="w-full"
                onClick={() => {
                  setShowInstallGuide(false);
                }}
              >
                ACKNOWLEDGE // CLOSE
              </LcarsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
