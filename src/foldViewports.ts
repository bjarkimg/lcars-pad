/** Galaxy Z Fold 8 Ultra CSS viewports.
 *  Cover: 6.5" 1080×2520 (≈22:9) — tall PADD.
 *  Inner: 8.0" 2256×2504 (≈9:10) — nearly square command table.
 */
export interface FoldViewport {
  id: 'cover' | 'inner';
  label: string;
  width: number;
  height: number;
  ratio: string;
  note: string;
}

export const FOLD_VIEWPORTS: Record<'cover' | 'inner', FoldViewport> = {
  cover: {
    id: 'cover',
    label: 'COVER',
    width: 412,
    height: 960,
    ratio: '22:9',
    note: 'Fold 8 Ultra outer 6.5" 1080×2520, single-column PADD',
  },
  inner: {
    id: 'inner',
    label: 'INNER',
    width: 1080,
    height: 1200,
    ratio: '9:10',
    note: 'Fold 8 Ultra inner 8" 2256×2504, dual-column console',
  },
};

export const FOLD_TABS = ['sudoku', 'merge', 'harness'] as const;
export type FoldTab = (typeof FOLD_TABS)[number];

export function readFrameParam(search = window.location.search): 'cover' | 'inner' | null {
  const frame = new URLSearchParams(search).get('frame');
  if (frame === 'cover' || frame === 'inner') return frame;
  return null;
}

export function aspectMatches(width: number, height: number, vp: FoldViewport, slop = 0.03): boolean {
  if (height <= 0) return false;
  const actual = width / height;
  const target = vp.width / vp.height;
  return Math.abs(actual - target) / target <= slop;
}
