// Index file for Windows XP audio files
// Export sound files for system events and notifications

// System sounds
export const systemSounds = {
  startup: "/assets/audio/Windows XP Startup.mp3",
  shutdown: "/assets/audio/Windows XP Shutdown.mp3",
  logon: "/assets/audio/Windows XP Logon Sound.mp3",
  logoff: "/assets/audio/Windows XP Logoff Sound.mp3",
  error: "/assets/audio/Windows XP Error.mp3",
  exclamation: "/assets/audio/Windows XP Exclamation.mp3",
  critical: "/assets/audio/Windows XP Critical Stop.mp3",
  notification: "/assets/audio/Windows XP Balloon.mp3",
  default: "/assets/audio/Windows XP Default.mp3",
};

// UI sounds
export const uiSounds = {
  menuCommand: "/assets/audio/Windows XP Menu Command.mp3",
  minimize: "/assets/audio/Windows XP Minimize.mp3",
  restore: "/assets/audio/Windows XP Restore.mp3",
  start: "/assets/audio/Windows XP Start.mp3",
  navigationStart: "/assets/audio/Windows Navigation Start.mp3",
  popupBlocked: "/assets/audio/Windows XP Pop-up Blocked.mp3",
  informationBar: "/assets/audio/Windows XP Information Bar.mp3",
  notify: "/assets/audio/Windows XP Notify.mp3",
  ding: "/assets/audio/Windows XP Ding.mp3",
  recycle: "/assets/audio/Windows XP Recycle.mp3",
};

// Hardware sounds
export const hardwareSounds = {
  insert: "/assets/audio/Windows XP Hardware Insert.mp3",
  remove: "/assets/audio/Windows XP Hardware Remove.mp3",
  hardwareFail: "/assets/audio/Windows XP Hardware Fail.mp3",
  batteryCritical: "/assets/audio/Windows XP Battery Critical.mp3",
  batteryLow: "/assets/audio/Windows XP Battery Low.mp3",
  printComplete: "/assets/audio/Windows XP Print complete.mp3",
};

// Communication sounds
export const communicationSounds = {
  ringIn: "/assets/audio/Windows XP Ringin.mp3",
  ringOut: "/assets/audio/Windows XP Ringout.mp3",
  feedDiscovered: "/assets/audio/Windows Feed Discovered.mp3",
};

// Simple sounds for direct access
export const chimes = "/assets/audio/chimes.mp3";
export const chord = "/assets/audio/chord.mp3";
export const ding = "/assets/audio/ding.mp3";
export const notify = "/assets/audio/notify.mp3";
export const recycle = "/assets/audio/recycle.mp3";
export const ringin = "/assets/audio/ringin.mp3";
export const ringout = "/assets/audio/ringout.mp3";
export const start = "/assets/audio/start.mp3";
export const tada = "/assets/audio/tada.mp3";

// Export all sounds in a collection
export const allSounds = {
  ...systemSounds,
  ...uiSounds,
  ...hardwareSounds,
  ...communicationSounds,
};
