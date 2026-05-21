import { useEffect, useState, useCallback, useRef } from "react";

const NOTIF_PREF_KEY = "lmoc-broadcast-notifications-enabled";

function chicagoNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

type ScheduledNotif = {
  id: string;
  day: number;
  hour: number;
  min: number;
  title: string;
  body: string;
};

// day: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const NOTIFICATIONS: ScheduledNotif[] = [
  {
    id: "wed-graphics-deadline",
    day: 3, hour: 20, min: 30,
    title: "🎨 Graphics deadline in 30 min",
    body: "All media must be imported, ordered, and tested by 9:00 PM CST tonight.",
  },
  {
    id: "sat-setup",
    day: 6, hour: 10, min: 30,
    title: "📡 Broadcast day — team arrives in 30 min",
    body: "Team setup begins at 11:00 AM CST. Prepare your workstation.",
  },
  {
    id: "sat-sabbath-school-end",
    day: 6, hour: 10, min: 45,
    title: "📷 Readjust camera angles NOW",
    body: "Sabbath School has ended. Readjust cameras — service begins at 12:00 PM CST.",
  },
  {
    id: "sat-golive-soon",
    day: 6, hour: 11, min: 58,
    title: "⏱ 2 minutes to GO LIVE",
    body: "Final checks — cameras, audio, Restream key. Service starts at 12:00 PM CST.",
  },
  {
    id: "sat-golive",
    day: 6, hour: 12, min: 0,
    title: "🔴 GO LIVE — Service is ON AIR",
    body: "Start sermon recording on all cameras + LS6. You are broadcasting!",
  },
  {
    id: "sat-wrap",
    day: 6, hour: 15, min: 45,
    title: "⌛ Wrap-up coming — ~15 min to service end",
    body: "Service ends around 4:00 PM CST. Prepare to stop recording and wrap up.",
  },
];

export function useNotifications() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return window.localStorage.getItem(NOTIF_PREF_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const firedRef = useRef(new Set<string>());

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setEnabled(true);
      window.localStorage.setItem(NOTIF_PREF_KEY, "true");
    }
  }, []);

  const toggleEnabled = useCallback(async () => {
    if (!enabled && permission !== "granted") {
      await requestPermission();
      return;
    }
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(NOTIF_PREF_KEY, next ? "true" : "false");
  }, [enabled, permission, requestPermission]);

  useEffect(() => {
    if (!enabled || permission !== "granted") return;

    function check() {
      const now = chicagoNow();
      const day = now.getDay();
      const hour = now.getHours();
      const min = now.getMinutes();

      for (const notif of NOTIFICATIONS) {
        const key = `${notif.id}-${now.toDateString()}`;
        if (firedRef.current.has(key)) continue;
        if (notif.day === day && notif.hour === hour && notif.min === min) {
          firedRef.current.add(key);
          new Notification(notif.title, {
            body: notif.body,
            icon: "/icons/icon.svg",
            badge: "/icons/icon.svg",
          });
        }
      }
    }

    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [enabled, permission]);

  return { enabled, permission, toggleEnabled };
}
