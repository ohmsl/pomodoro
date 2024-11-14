import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { useCallback, useEffect, useState } from "react";

type NotificationOptions = {
  title: string;
  body: string;
};

export const useNotification = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );

  // Check and request notification permission
  const checkPermission = useCallback(async () => {
    if (!(await isPermissionGranted())) {
      const permission = await requestPermission();
      setPermissionGranted(permission === "granted");
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    // Run permission check on hook mount
    checkPermission();
  }, [checkPermission]);

  // Function to send a notification
  const sendNotificationMessage = useCallback(
    async ({ title, body }: NotificationOptions) => {
      if (permissionGranted === null) return; // Permission check is still pending
      if (!permissionGranted) {
        // If permission hasn't been granted, attempt to request it again
        await checkPermission();
        if (!permissionGranted) return;
      }
      sendNotification({ title, body });
    },
    [permissionGranted, checkPermission]
  );

  return { sendNotificationMessage };
};
