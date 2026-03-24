import { useState } from "react";
import { BUMPER_LIST } from "@/data/workflow";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface BumperListWidgetProps {
  bumperUsed: Set<string>;
  onToggle: (name: string, used: boolean) => void;
  onReset: () => void;
  customBumpers: string[];
  onAddCustom: (name: string) => void;
  onRemoveCustom: (name: string) => void;
}

export function BumperListWidget({
  bumperUsed,
  onToggle,
  onReset,
  customBumpers,
  onAddCustom,
  onRemoveCustom,
}: BumperListWidgetProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState(false);

  const allBumpers = [...BUMPER_LIST, ...customBumpers];

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) {
      setAddError(true);
      setTimeout(() => setAddError(false), 1500);
      return;
    }
    onAddCustom(trimmed);
    setNewName("");
    setAdding(false);
    setAddError(false);
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-secondary/60 border-b border-border flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground flex items-center gap-2">
          🎵 Bumper List
        </h3>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
          title="Add bumper"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {adding && (
        <div className="px-3 pt-2 pb-1 border-b border-border flex gap-1.5">
          <input
            autoFocus
            type="text"
            placeholder="Bumper title..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") { setAdding(false); setNewName(""); }
            }}
            className={cn(
              "flex-1 text-[12px] border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 transition-colors",
              addError ? "border-red-500 focus:ring-red-500/40" : "border-border focus:ring-primary/40"
            )}
          />
          <button
            onClick={handleAdd}
            className="text-[11px] font-semibold bg-primary text-primary-foreground px-2.5 py-1.5 rounded-md hover:bg-primary/90 transition-colors touch-manipulation"
          >
            Add
          </button>
        </div>
      )}

      <div className="px-3 py-2">
        <ul>
          {allBumpers.map((name, i) => {
            const used = bumperUsed.has(name);
            const isCustom = i >= BUMPER_LIST.length;
            return (
              <li
                key={`${name}-${i}`}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-card-foreground/[0.03] cursor-pointer transition-colors touch-manipulation group/item"
                onClick={() => onToggle(name, !used)}
              >
                <input
                  type="checkbox"
                  checked={used}
                  onChange={() => onToggle(name, !used)}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "appearance-none w-[14px] h-[14px] min-w-[14px] border-2 rounded cursor-pointer transition-all relative",
                    used
                      ? "bg-primary border-primary after:content-['✓'] after:absolute after:top-[-2px] after:left-[1px] after:text-[9px] after:text-white after:font-extrabold"
                      : "border-border bg-transparent"
                  )}
                />
                <span className="text-[10px] font-extrabold text-muted-foreground min-w-[18px]">
                  {i + 1}.
                </span>
                <span className={cn(
                  "text-[12px] flex-1",
                  used ? "line-through text-muted-foreground" : "text-foreground"
                )}>
                  {name}
                  {isCustom && (
                    <span className="ml-1 text-[9px] text-primary/50 font-bold">CUSTOM</span>
                  )}
                </span>
                {isCustom && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveCustom(name); }}
                    className="opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-destructive transition-all touch-manipulation"
                    title="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-2 px-1 pb-1">
          <button
            onClick={() => { if (confirm("Reset the bumper list?")) onReset(); }}
            className="w-full text-[11px] font-semibold text-muted-foreground hover:text-foreground border border-border rounded-md py-1.5 hover:bg-secondary/60 transition-colors touch-manipulation"
          >
            ↺ Reset Bumper List
          </button>
        </div>
      </div>
    </div>
  );
}
