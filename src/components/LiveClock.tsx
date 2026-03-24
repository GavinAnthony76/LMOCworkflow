import { useEffect, useState } from "react";

export function LiveClock() {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const t = now.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const d = now.toLocaleDateString("en-US", {
        timeZone: "America/Chicago",
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setDisplay(d + " · " + t + " CST");
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[11px] font-mono text-muted-foreground tracking-tight">
      {display}
    </span>
  );
}
