import { useState } from "react";
import { SessionInfo } from "@/hooks/use-workflow";
import { Edit2 } from "lucide-react";

interface SessionHeaderProps {
  sessionInfo: SessionInfo;
  onUpdateInfo: (info: Partial<SessionInfo>) => void;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function SessionHeader({ sessionInfo, onUpdateInfo }: SessionHeaderProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="glass-panel rounded-xl p-4 sm:p-5 mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground">
          📋 Session Info
        </h3>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
          title={editing ? "Done editing" : "Edit session info"}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {editing ? (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                Broadcast Date
              </label>
              <input
                type="date"
                value={sessionInfo.broadcastDate}
                onChange={(e) => onUpdateInfo({ broadcastDate: e.target.value })}
                className="w-full text-[12px] border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                Speaker / Pastor
              </label>
              <input
                type="text"
                placeholder="Speaker name..."
                value={sessionInfo.speakerName}
                onChange={(e) => onUpdateInfo({ speakerName: e.target.value })}
                className="w-full text-[12px] border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">
                Technical Director
              </label>
              <input
                type="text"
                placeholder="TD name..."
                value={sessionInfo.tdName}
                onChange={(e) => onUpdateInfo({ tdName: e.target.value })}
                className="w-full text-[12px] border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>
          <button
            onClick={() => setEditing(false)}
            className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            ✓ Done
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[12px]">
          <span>
            <span className="text-muted-foreground font-semibold">Date: </span>
            <span className="text-foreground font-bold">{formatDisplayDate(sessionInfo.broadcastDate)}</span>
          </span>
          <span>
            <span className="text-muted-foreground font-semibold">Speaker: </span>
            <span className="text-foreground font-bold">{sessionInfo.speakerName || <span className="italic text-muted-foreground/60">not set</span>}</span>
          </span>
          <span>
            <span className="text-muted-foreground font-semibold">TD: </span>
            <span className="text-foreground font-bold">{sessionInfo.tdName || <span className="italic text-muted-foreground/60">not set</span>}</span>
          </span>
        </div>
      )}
    </div>
  );
}
