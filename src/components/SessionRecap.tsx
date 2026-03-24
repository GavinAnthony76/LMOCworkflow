import { useState } from "react";
import { WORKFLOW_ROLES, getAllPhases, getPhaseTaskIds } from "@/data/workflow";
import { WorkflowState, SessionInfo } from "@/hooks/use-workflow";
import { ClipboardCopy, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SessionRecapProps {
  state: WorkflowState;
  sessionInfo: SessionInfo;
  sessionNotes: string;
  percentage: number;
  phasesDone: number;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "Unknown date";
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function nowCST() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildPreShowRecap(props: SessionRecapProps): string {
  const { state, sessionInfo, sessionNotes } = props;
  const lines: string[] = [];

  lines.push("📡 LMOC Broadcast Team — Pre-Show Setup Complete");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`📅 Broadcast Date: ${formatDisplayDate(sessionInfo.broadcastDate)}`);
  lines.push(`🎤 Speaker: ${sessionInfo.speakerName || "Not specified"}`);
  lines.push(`🎬 Technical Director: ${sessionInfo.tdName || "Not specified"}`);
  lines.push(`⏱ Submitted: ${nowCST()} CST`);
  lines.push("");

  // TD Start + Pre-Production
  const tdRole = WORKFLOW_ROLES[0];
  lines.push("✅ TECHNICAL DIRECTOR — Pre-Production");
  [tdRole.phases[0], tdRole.phases[1]].forEach((phase) => {
    lines.push(`  ${phase.icon} ${phase.title}`);
    getPhaseTaskIds(phase).forEach((id) => {
      const task = phase.sections.flatMap((s) => s.tasks).find((t) => t.id === id);
      if (task) lines.push(`    ${state[id]?.completed ? "☑" : "☐"} ${task.title}`);
    });
  });

  lines.push("");

  // Comms Pre-Production
  const cbRole = WORKFLOW_ROLES[1];
  lines.push("✅ COMMS / BACKUP DIRECTOR — Pre-Production");
  const cbPhase = cbRole.phases[0];
  getPhaseTaskIds(cbPhase).forEach((id) => {
    const task = cbPhase.sections.flatMap((s) => s.tasks).find((t) => t.id === id);
    if (task) lines.push(`  ${state[id]?.completed ? "☑" : "☐"} ${task.title}`);
  });

  lines.push("");

  // Graphics Pre-Production
  const ghRole = WORKFLOW_ROLES[2];
  lines.push("✅ GRAPHICS HOST — Pre-Production");
  const ghPhase = ghRole.phases[0];
  getPhaseTaskIds(ghPhase).forEach((id) => {
    const task = ghPhase.sections.flatMap((s) => s.tasks).find((t) => t.id === id);
    if (task) lines.push(`  ${state[id]?.completed ? "☑" : "☐"} ${task.title}`);
  });

  lines.push("");
  lines.push("Team is set up and ready. Production phases will be completed during the Saturday service.");

  if (sessionNotes.trim()) {
    lines.push("");
    lines.push("📝 Notes:");
    lines.push(sessionNotes.trim());
  }

  return lines.join("\n");
}

function buildFinalRecap(props: SessionRecapProps): string {
  const { state, sessionInfo, sessionNotes } = props;
  const lines: string[] = [];

  lines.push("🔴 LMOC Broadcast Team — Broadcast Complete");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`📅 Broadcast Date: ${formatDisplayDate(sessionInfo.broadcastDate)}`);
  lines.push(`🎤 Speaker: ${sessionInfo.speakerName || "Not specified"}`);
  lines.push(`🎬 Technical Director: ${sessionInfo.tdName || "Not specified"}`);
  lines.push(`⏱ Submitted: ${nowCST()} CST`);
  lines.push("");

  WORKFLOW_ROLES.forEach((role) => {
    lines.push(`${role.icon} ${role.title.toUpperCase()}`);
    role.phases.forEach((phase) => {
      const ids = getPhaseTaskIds(phase);
      const done = ids.filter((id) => state[id]?.completed).length;
      const icon = done === ids.length ? "✅" : done === 0 ? "⬜" : "🔶";
      lines.push(`  ${icon} ${phase.title}: ${done}/${ids.length}`);
      const incomplete = phase.sections.flatMap((s) =>
        s.tasks.filter((t) => !state[t.id]?.completed).map((t) => `    • ${t.title}`)
      );
      incomplete.forEach((l) => lines.push(l));
    });
    lines.push("");
  });

  if (sessionNotes.trim()) {
    lines.push("📝 Session Notes:");
    lines.push(sessionNotes.trim());
  }

  return lines.join("\n");
}

function RecapBlock({
  label,
  sublabel,
  text,
  ready,
  accent,
}: {
  label: string;
  sublabel: string;
  text: string;
  ready: boolean;
  accent: "blue" | "red";
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const accentClasses = {
    blue: {
      badge: "bg-blue-500/10 text-blue-600",
      border: "border-l-blue-500",
      button: "border-blue-500/30 text-blue-700 hover:bg-blue-500/10",
    },
    red: {
      badge: "bg-red-500/10 text-red-600",
      border: "border-l-red-500",
      button: "border-red-500/30 text-red-700 hover:bg-red-500/10",
    },
  }[accent];

  return (
    <div className={cn("rounded-lg border border-border border-l-4 overflow-hidden", accentClasses.border, !ready && "opacity-50")}>
      <div className="px-3 py-2.5 flex items-center justify-between gap-2 bg-secondary/40">
        <div>
          <div className="text-[12px] font-bold text-foreground">{label}</div>
          <div className="text-[10px] text-muted-foreground">{sublabel}</div>
        </div>
        {ready ? (
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", accentClasses.badge)}>
            Ready
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground shrink-0">Pending</span>
        )}
      </div>

      <div className="px-3 py-2.5 space-y-2">
        {!ready && (
          <p className="text-[11px] text-muted-foreground italic">
            Complete the required phases to unlock this report.
          </p>
        )}

        <Button
          size="sm"
          variant="outline"
          disabled={!ready}
          onClick={() => setOpen((v) => !v)}
          className={cn("w-full text-xs h-8 touch-manipulation", ready && accentClasses.button)}
        >
          <Send className="h-3 w-3 mr-1.5" />
          {open ? "Hide" : "Preview & Copy"}
        </Button>

        {open && ready && (
          <div className="space-y-2">
            <pre className="text-[10.5px] leading-relaxed whitespace-pre-wrap bg-secondary/60 rounded-md p-2.5 font-mono text-foreground border border-border max-h-56 overflow-y-auto">
              {text}
            </pre>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className={cn("w-full text-xs h-8 touch-manipulation", accentClasses.button)}
            >
              {copied ? (
                <><Check className="h-3 w-3 mr-1.5 text-green-500" /> Copied!</>
              ) : (
                <><ClipboardCopy className="h-3 w-3 mr-1.5" /> Copy for Slack</>
              )}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Paste into your broadcast team Slack channel
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SessionRecap(props: SessionRecapProps) {
  const { state } = props;

  // Pre-show: TD Start + TD Pre-Prod + Comms Pre-Prod + Graphics Pre-Prod complete
  const preShowPhases = ["td-start", "td-preprod", "cb-preprod", "gh-preprod"];
  const preShowReady = preShowPhases.every((phaseId) => {
    const phase = getAllPhases().find((p) => p.id === phaseId);
    if (!phase) return false;
    return getPhaseTaskIds(phase).every((id) => state[id]?.completed);
  });

  // Final: all phases complete
  const finalReady = getAllPhases().every((phase) =>
    getPhaseTaskIds(phase).every((id) => state[id]?.completed)
  );

  const preShowText = buildPreShowRecap(props);
  const finalText = buildFinalRecap(props);

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-secondary/60 border-b border-border flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground flex items-center gap-2">
          <Send className="h-3.5 w-3.5" />
          Slack Reports
        </h3>
        {finalReady && (
          <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
            ✓ All Done
          </span>
        )}
      </div>

      <div className="p-3 space-y-2.5">
        <RecapBlock
          label="Pre-Show Setup"
          sublabel="Send after all pre-production phases are done"
          text={preShowText}
          ready={preShowReady}
          accent="blue"
        />
        <RecapBlock
          label="Broadcast Complete"
          sublabel="Send after all roles finish their post-production"
          text={finalText}
          ready={finalReady}
          accent="red"
        />
      </div>
    </div>
  );
}
