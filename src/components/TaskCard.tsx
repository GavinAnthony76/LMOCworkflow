import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/data/workflow";
import { TagBadge } from "./TagBadge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  completed: boolean;
  onToggle: (completed: boolean) => void;
  hasNewGuest?: boolean;
}

export function TaskCard({ task, completed, onToggle, hasNewGuest }: TaskCardProps) {
  const highlight = false && hasNewGuest; // reserved for future guest-highlight feature

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 sm:p-3.5 rounded-lg transition-all duration-200 cursor-pointer",
        completed ? "opacity-50" : "hover:bg-card-foreground/[0.03]",
        highlight && !completed && "bg-red-500/5 border border-red-500/20"
      )}
      onClick={() => onToggle(!completed)}
    >
      <div className="pt-0.5 min-w-[44px] min-h-[44px] flex items-start justify-center -ml-1 sm:-ml-0">
        <Checkbox
          checked={completed}
          onCheckedChange={(checked) => onToggle(checked as boolean)}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "h-[18px] w-[18px] rounded border-2 transition-all duration-300 touch-manipulation cursor-pointer",
            completed ? "bg-green-500 border-green-500 text-white" : "border-border"
          )}
        />
      </div>

      <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
        <div
          className={cn(
            "text-[13.5px] leading-relaxed transition-colors",
            completed ? "line-through text-muted-foreground" : "text-foreground"
          )}
        >
          {task.title}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {task.tags.map((tag, i) => (
              <TagBadge key={i} tag={tag} />
            ))}
          </div>
        )}

        {task.note && (
          <div className="mt-2 text-[11.5px] text-muted-foreground py-1.5 px-3 bg-foreground/[0.03] border-l-2 border-foreground/10 rounded-r">
            {task.note}
          </div>
        )}
      </div>
    </div>
  );
}
