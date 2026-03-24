import { useEffect } from "react";
import { Phase } from "@/data/workflow";
import { TaskCard } from "./TaskCard";
import { WorkflowState } from "@/hooks/use-workflow";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { toast } from "sonner";

interface PhaseViewProps {
  phase: Phase;
  state: WorkflowState;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onReset: (phaseId: string) => void;
  onCheckAll: (phaseId: string) => void;
  onUncheckAll: (phaseId: string) => void;
  progress: { total: number; completed: number; percentage: number };
  hasCelebrated: boolean;
  onCelebrate: (phaseId: string) => void;
}

export function PhaseView({
  phase,
  state,
  onToggleTask,
  onReset,
  onCheckAll,
  onUncheckAll,
  progress,
  hasCelebrated,
  onCelebrate,
}: PhaseViewProps) {
  const isComplete = progress.percentage === 100;

  useEffect(() => {
    if (isComplete && !hasCelebrated) {
      onCelebrate(phase.id);
    }
  }, [isComplete, hasCelebrated, phase.id, onCelebrate]);

  const phaseColors = {
    schedule: "border-l-blue-500",
    connect: "border-l-violet-500",
    prepare: "border-l-amber-500",
    produce: "border-l-red-500",
  };

  const miniBarColors = {
    schedule: "bg-blue-500",
    connect: "bg-violet-500",
    prepare: "bg-amber-500",
    produce: "bg-red-500",
  };

  function handleCheckAll() {
    onCheckAll(phase.id);
    toast("All tasks checked", {
      description: `${phase.title} marked complete.`,
      action: {
        label: "Undo",
        onClick: () => onUncheckAll(phase.id),
      },
      duration: 6000,
    });
  }

  function handleReset() {
    onReset(phase.id);
    toast("Phase reset", {
      description: `${phase.title} has been cleared.`,
      action: {
        label: "Undo",
        onClick: () => onCheckAll(phase.id),
      },
      duration: 6000,
    });
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isComplete && hasCelebrated && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
            colors={["#B8860B", "#DAA520", "#FFD700", "#CD853F", "#F5DEB3"]}
          />
        </div>
      )}

      <div className={`glass-panel rounded-xl overflow-hidden border-l-4 ${phaseColors[phase.color]} ${isComplete ? "opacity-80" : ""}`}>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-3">
              <span className="text-xl">{phase.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    {phase.title}
                  </h2>
                  {isComplete && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <span className="text-[10px] font-extrabold bg-green-500/15 text-green-600 px-2 py-0.5 rounded-full">
                        ✓ Complete
                      </span>
                    </motion.div>
                  )}
                </div>
                <div className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${
                  phase.color === "schedule" ? "bg-blue-500/15 text-blue-500" :
                  phase.color === "connect" ? "bg-violet-500/15 text-violet-500" :
                  phase.color === "prepare" ? "bg-amber-500/15 text-amber-600" :
                  "bg-red-500/15 text-red-500"
                }`}>
                  ⏰ {phase.deadline}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-muted-foreground">
                {progress.completed} / {progress.total}
              </span>
              <div className="w-[72px] h-[5px] bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-400 ${miniBarColors[phase.color]}`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {phase.sections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="px-5 sm:px-6 pt-3 pb-1.5 border-t border-border">
              <div className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-muted-foreground">
                {section.label}
              </div>
            </div>
            <div className="px-2 sm:px-3 pb-1">
              {section.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  completed={state[task.id]?.completed || false}
                  onToggle={(c) => onToggleTask(task.id, c)}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-2 px-5 py-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckAll}
            className="text-xs h-9 touch-manipulation"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
            Check All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs h-9 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 touch-manipulation"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
