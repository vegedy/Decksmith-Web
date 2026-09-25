import type { MotionPreset } from '../types/visualization'
/** Transform endpoints shared by every reveal; durations come from CSS tokens. */
export const motionFrom: Record<
  MotionPreset,
  { opacity: number; x: number; y: number; scale: number }
> = {
  fade: { opacity: 0, x: 0, y: 0, scale: 1 },
  'slide-up': { opacity: 0, x: 0, y: 20, scale: 1 },
  'slide-left': { opacity: 0, x: 24, y: 0, scale: 1 },
  'scale-in': { opacity: 0, x: 0, y: 0, scale: 0.94 },
  highlight: { opacity: 1, x: 0, y: 0, scale: 1 },
  'draw-path': { opacity: 1, x: 0, y: 0, scale: 1 },
  stagger: { opacity: 1, x: 0, y: 0, scale: 1 },
}
