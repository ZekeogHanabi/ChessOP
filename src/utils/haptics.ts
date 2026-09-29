/**
 * Mobile Haptic Feedback Manager using navigator.vibrate
 * Provides tactile sensations on compatible mobile devices (Android / iOS with webkit vibration).
 */

const STORAGE_KEY_HAPTICS = 'chessop_haptics_enabled';

class HapticsManager {
  private enabled: boolean;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY_HAPTICS);
    // Default to true if not set
    this.enabled = saved !== null ? saved === 'true' : true;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function';
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean): void {
    this.enabled = val;
    localStorage.setItem(STORAGE_KEY_HAPTICS, String(val));
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  private trigger(pattern: number | number[]): void {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors silently
    }
  }

  /**
   * Subtle tactile tick when moving a piece or clicking an interactive node
   */
  public lightTap(): void {
    this.trigger(12);
  }

  /**
   * Snappy pulse when capturing an opponent piece
   */
  public capture(): void {
    this.trigger(30);
  }

  /**
   * Distinct double pulse on check or critical tactical move
   */
  public check(): void {
    this.trigger([35, 25, 45]);
  }

  /**
   * Warning vibration pattern on mistakes or illegal moves
   */
  public error(): void {
    this.trigger([50, 30, 70]);
  }

  /**
   * Triumphant fanfare vibration when conquering a variation or earning 3 stars
   */
  public success(): void {
    this.trigger([30, 40, 30, 40, 80]);
  }
}

export const haptics = new HapticsManager();
