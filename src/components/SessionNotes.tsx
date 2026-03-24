interface SessionNotesProps {
  notes: string;
  onChange: (notes: string) => void;
}

export function SessionNotes({ notes, onChange }: SessionNotesProps) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-secondary/60 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Session Notes</h3>
            <span className="text-[10px] text-muted-foreground">Saved to your browser</span>
          </div>
        </div>
        {notes.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear all session notes?")) onChange("");
            }}
            className="text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
          >
            Clear
          </button>
        )}
      </div>
      <div className="p-4">
        <textarea
          className="w-full min-h-[100px] bg-secondary/40 border border-border rounded-lg text-[13px] text-foreground p-3 resize-y outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/60"
          placeholder="Enter session notes here — host name, special requests, guest info, bumper choice, anything you want to remember..."
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          style={{ fontSize: "16px" }}
        />
      </div>
    </div>
  );
}
