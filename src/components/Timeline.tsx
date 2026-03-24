import { useEffect, useState } from "react";
import { TIMELINE_EVENTS } from "@/data/workflow";

function chicagoNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

export function Timeline() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isInWindow, setIsInWindow] = useState(false);

  useEffect(() => {
    function update() {
      const now = chicagoNow();
      const day = now.getDay();
      const hour = now.getHours();
      const min = now.getMinutes();
      const nowMins = day * 24 * 60 + hour * 60 + min;

      // Broadcast week window: Thu through Sat 1:15 PM
      const windowStart = 4 * 24 * 60; // Thu midnight
      const windowEnd = 6 * 24 * 60 + 13 * 60 + 15; // Sat 1:15 PM
      const inWindow = nowMins >= windowStart && nowMins <= windowEnd;
      setIsInWindow(inWindow);

      if (!inWindow) {
        setActiveIndex(-1);
        return;
      }

      let lastMatch = -1;
      TIMELINE_EVENTS.forEach((evt, i) => {
        const evtMins = evt.day * 24 * 60 + evt.hour * 60 + evt.min;
        if (nowMins >= evtMins) {
          lastMatch = i;
        }
      });
      setActiveIndex(lastMatch);
    }

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const showNowAfter = isInWindow && activeIndex >= 0 && activeIndex < TIMELINE_EVENTS.length - 1;

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-secondary/60 border-b border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground flex items-center gap-2">
          🕐 Saturday Timeline
        </h3>
      </div>
      <div className="px-4 py-2">
        <ul className="divide-y divide-border">
          {TIMELINE_EVENTS.map((evt, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            return (
              <>
                <li
                  key={i}
                  className={`flex items-center gap-3 py-2.5 text-[12px] ${isActive ? "font-bold" : ""}`}
                >
                  <span
                    className={`font-mono font-extrabold min-w-[72px] ${
                      isActive ? "text-red-500" : isPast ? "text-muted-foreground/50" : "text-primary"
                    }`}
                  >
                    {evt.time}
                  </span>
                  <span
                    className={
                      isActive
                        ? "text-foreground"
                        : isPast
                        ? "text-muted-foreground/50 line-through"
                        : "text-muted-foreground"
                    }
                  >
                    {evt.event}
                  </span>
                </li>
                {showNowAfter && i === activeIndex && (
                  <li key="now-marker" className="flex items-center gap-3 py-1.5">
                    <span className="min-w-[72px]" />
                    <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-red-500 uppercase tracking-widest">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      You Are Here
                    </span>
                  </li>
                )}
              </>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
