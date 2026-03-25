import { useEffect, useState } from "react";

function chicagoNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

function nextSatNoon(): Date {
  const now = chicagoNow();
  const day = now.getDay();
  let daysAway = (6 - day + 7) % 7;
  const target = new Date(now);
  target.setDate(now.getDate() + daysAway);
  target.setHours(12, 0, 0, 0);
  // If today is Saturday and service is done (after 2:15 PM), next Saturday
  if (daysAway === 0 && (now.getHours() > 16 || (now.getHours() === 16 && now.getMinutes() > 15))) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function Countdown() {
  const [display, setDisplay] = useState<{ time: string; label: string; urgency: "normal" | "soon" | "imminent" | "live" }>({ time: "--:--:--", label: "Calculating...", urgency: "normal" });

  useEffect(() => {
    function update() {
      const now = chicagoNow();
      const day = now.getDay();
      const hour = now.getHours();
      const nowMin = now.getMinutes();

      // LIVE during service: Sat 12:00 PM – 4:15 PM
      const isLive = day === 6 && hour >= 12 && (hour < 16 || (hour === 16 && nowMin <= 15));
      if (isLive) {
        setDisplay({ time: "", label: "Service is on air!", urgency: "live" });
        return;
      }

      const target = nextSatNoon();
      const diff = target.getTime() - now.getTime();
      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const totalHrs = days * 24 + hrs;

      let time: string;
      let label: string;
      let urgency: "normal" | "soon" | "imminent";

      const targetDay = target.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Chicago" });
      const todayDay = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Chicago" });
      const isToday = targetDay === todayDay;

      if (totalHrs < 1) {
        time = pad(mins) + ":" + pad(secs);
        label = "Less than 1 hour until Go Live!";
        urgency = "imminent";
      } else if (isToday) {
        time = pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
        label = "Today — Go Live at 12:00 PM CST";
        urgency = "soon";
      } else if (days < 2) {
        time = days + "d " + pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
        label = "Tomorrow — Go Live at 12:00 PM CST";
        urgency = days === 0 ? "soon" : "normal";
      } else {
        time = days + "d " + pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
        const dateLabel = target.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        label = "Next: " + dateLabel + " at 12:00 PM CST";
        urgency = "normal";
      }

      setDisplay({ time, label, urgency });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const urgencyStyles = {
    normal: "text-primary",
    soon: "text-amber-500 animate-pulse",
    imminent: "text-red-500 animate-pulse",
    live: "",
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-secondary/60 border-b border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground flex items-center gap-2">
          📡 Next Broadcast
        </h3>
      </div>
      <div className="p-4 text-center">
        <div className="text-[10px] uppercase tracking-[1px] text-muted-foreground mb-2">
          Time Until Go Live
        </div>

        {display.urgency === "live" ? (
          <div className="inline-flex items-center justify-center gap-2 bg-red-500/15 border border-red-500/40 text-red-500 px-4 py-2 rounded-full text-sm font-extrabold animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            LIVE NOW
          </div>
        ) : (
          <div className={`text-3xl font-extrabold font-mono tracking-wider tabular-nums ${urgencyStyles[display.urgency]}`}>
            {display.time}
          </div>
        )}

        <div className="text-[11px] text-muted-foreground mt-2">
          {display.label}
        </div>
      </div>
    </div>
  );
}
