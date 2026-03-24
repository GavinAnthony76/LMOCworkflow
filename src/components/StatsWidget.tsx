import { Role, Phase, Task } from "@/data/workflow";

interface StatsWidgetProps {
  completed: number;
  total: number;
  phasesDone: number;
  totalPhases: number;
  percentage: number;
  nextAction: { role: Role; phase: Phase; task: Task } | null;
}

export function StatsWidget({ completed, total, phasesDone, totalPhases, percentage, nextAction }: StatsWidgetProps) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-secondary/60 border-b border-border">
        <h3 className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground flex items-center gap-2">
          📊 Progress Summary
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/60 rounded-lg p-3 text-center">
            <div className="text-xl font-extrabold text-primary">{completed}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Completed</div>
          </div>
          <div className="bg-secondary/60 rounded-lg p-3 text-center">
            <div className="text-xl font-extrabold text-primary">{total - completed}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Remaining</div>
          </div>
          <div className="bg-secondary/60 rounded-lg p-3 text-center">
            <div className="text-xl font-extrabold text-primary">{phasesDone}/{totalPhases}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Phases Done</div>
          </div>
          <div className="bg-secondary/60 rounded-lg p-3 text-center">
            <div className="text-xl font-extrabold text-primary">{percentage}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Overall</div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            ➤ Next Action
          </div>
          {nextAction ? (
            <>
              <div className="text-[11px] font-semibold text-primary mb-0.5">
                {nextAction.role.icon} {nextAction.role.shortTitle} — {nextAction.phase.shortTitle}
              </div>
              <div className="text-[12px] text-foreground leading-snug line-clamp-2">
                {nextAction.task.title}
              </div>
            </>
          ) : (
            <div className="text-[12px] text-green-600 font-semibold">
              ✓ All tasks complete!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
