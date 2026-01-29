type TauriWindow = typeof window & {
  __TAURI__?: unknown;
  __TAURI_INTERNALS__?: unknown;
  __TAURI_METADATA__?: unknown;
};

export const isTauriEnvironment = () => {
  if (typeof window === "undefined") return false;

  const tauriWindow = window as TauriWindow;
  return (
    typeof tauriWindow.__TAURI__ !== "undefined" ||
    typeof tauriWindow.__TAURI_INTERNALS__ !== "undefined" ||
    typeof tauriWindow.__TAURI_METADATA__ !== "undefined"
  );
};

export const supportsVibration = () => {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  );
};
