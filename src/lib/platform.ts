export const isTauriEnvironment = () => {
  return (
    typeof window !== "undefined" &&
    typeof (window as typeof window & { __TAURI__?: unknown }).__TAURI__ !==
      "undefined"
  );
};

export const supportsVibration = () => {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  );
};
