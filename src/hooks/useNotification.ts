import {
  isPermissionGranted as tauriIsPermissionGranted,
  requestPermission as tauriRequestPermission,
  sendNotification as tauriSendNotification,
} from "@tauri-apps/plugin-notification";
import { isTauriEnvironment } from "@/lib/platform";
import { useCallback, useEffect, useState } from "react";

type NotificationOptions = {
  title: string;
  body: string;
};

type NotificationChannel = "tauri" | "web" | "none";

const detectChannel = (): NotificationChannel => {
  if (isTauriEnvironment()) {
    return "tauri";
  }

  if (typeof window !== "undefined" && "Notification" in window) {
    return "web";
  }

  return "none";
};

export const useNotification = () => {
  const [channel] = useState<NotificationChannel>(() => detectChannel());
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    () => {
      if (channel === "web" && typeof Notification !== "undefined") {
        return Notification.permission === "granted";
      }

      if (channel === "none") {
        return false;
      }

      return null;
    }
  );

  useEffect(() => {
    if (channel !== "tauri") return;

    const initialise = async () => {
      try {
        const granted = await tauriIsPermissionGranted();
        setPermissionGranted(granted);
      } catch (error) {
        console.warn("Notification permission check failed", error);
        setPermissionGranted(false);
      }
    };

    void initialise();
  }, [channel]);

  const requestPermissionInternal = useCallback(async () => {
    if (channel === "tauri") {
      try {
        const permission = await tauriRequestPermission();
        const granted = permission === "granted";
        setPermissionGranted(granted);
        return granted;
      } catch (error) {
        console.warn("Requesting Tauri notification permission failed", error);
        setPermissionGranted(false);
        return false;
      }
    }

    if (channel === "web" && typeof Notification !== "undefined") {
      if (Notification.permission === "granted") {
        setPermissionGranted(true);
        return true;
      }

      if (Notification.permission === "denied") {
        setPermissionGranted(false);
        return false;
      }

      try {
        const permission = await Notification.requestPermission();
        const granted = permission === "granted";
        setPermissionGranted(granted);
        return granted;
      } catch (error) {
        console.warn("Web notification permission request failed", error);
        setPermissionGranted(false);
        return false;
      }
    }

    setPermissionGranted(false);
    return false;
  }, [channel]);

  const sendNotificationMessage = useCallback(
    async ({ title, body }: NotificationOptions) => {
      if (channel === "none") return;

      const hasPermission =
        permissionGranted === true ? true : await requestPermissionInternal();

      if (!hasPermission) return;

      if (channel === "tauri") {
        await tauriSendNotification({ title, body });
      } else if (channel === "web" && typeof Notification !== "undefined") {
        new Notification(title, { body });
      }
    },
    [channel, permissionGranted, requestPermissionInternal]
  );

  return {
    sendNotificationMessage,
    requestNotificationPermission: requestPermissionInternal,
  };
};
