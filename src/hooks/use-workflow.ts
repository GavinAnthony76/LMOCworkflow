import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "/api";
const POLL_INTERVAL = 4000;

async function fetchSession(weekId: string) {
  try {
    const res = await fetch(`${API_BASE}/session?weekId=${weekId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function pushSession(weekId: string, payload: object) {
  try {
    await fetch(`${API_BASE}/session`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekId, ...payload }),
    });
  } catch {
    // silent — local state still works if offline
  }
}
import { WORKFLOW_ROLES, getAllPhases, getPhaseTaskIds, getAllTaskIds } from "@/data/workflow";

export type TaskState = {
  completed: boolean;
};

export type WorkflowState = Record<string, TaskState>;

export type SessionInfo = {
  broadcastDate: string; // ISO date string YYYY-MM-DD
  speakerName: string;
  tdName: string;
};

const STORAGE_KEY = "lmoc-broadcast-workflow-state";
const SESSION_NOTES_KEY = "lmoc-broadcast-session-notes";
const SESSION_INFO_KEY = "lmoc-broadcast-session-info";
const WEEK_KEY = "lmoc-broadcast-current-week";
const BUMPER_USED_KEY = "lmoc-broadcast-bumper-used";
const CUSTOM_BUMPERS_KEY = "lmoc-broadcast-custom-bumpers";

function chicagoNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

function nextSaturday(): string {
  const now = chicagoNow();
  const day = now.getDay(); // 0=Sun, 6=Sat
  let daysUntil = (6 - day + 7) % 7;
  // If today is Saturday and service is done (after 1:15 PM), next Saturday is 7 days away
  if (daysUntil === 0) {
    const hour = now.getHours();
    const min = now.getMinutes();
    if (hour > 16 || (hour === 16 && min > 15)) {
      daysUntil = 7;
    }
  }
  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntil);
  const y = sat.getFullYear();
  const m = String(sat.getMonth() + 1).padStart(2, "0");
  const d = String(sat.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCurrentWeekId(): string {
  return nextSaturday();
}

function checkAndHandleNewWeek(): boolean {
  try {
    const stored = window.localStorage.getItem(WEEK_KEY);
    const current = getCurrentWeekId();
    if (stored && stored !== current) {
      return true;
    }
    window.localStorage.setItem(WEEK_KEY, current);
    return false;
  } catch {
    return false;
  }
}

export function useWorkflow() {
  const [state, setState] = useState<WorkflowState>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : {};
    } catch {
      return {};
    }
  });

  const [sessionNotes, setSessionNotes] = useState(() => {
    try {
      return window.localStorage.getItem(SESSION_NOTES_KEY) || "";
    } catch {
      return "";
    }
  });

  const [sessionInfo, setSessionInfoState] = useState<SessionInfo>(() => {
    try {
      const item = window.localStorage.getItem(SESSION_INFO_KEY);
      return item ? JSON.parse(item) : { broadcastDate: nextSaturday(), speakerName: "", tdName: "" };
    } catch {
      return { broadcastDate: nextSaturday(), speakerName: "", tdName: "" };
    }
  });

  const [bumperUsed, setBumperUsed] = useState<Set<string>>(() => {
    try {
      const item = window.localStorage.getItem(BUMPER_USED_KEY);
      return item ? new Set(JSON.parse(item)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [customBumpers, setCustomBumpers] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem(CUSTOM_BUMPERS_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  const [celebratedPhases, setCelebratedPhases] = useState<Set<string>>(new Set());
  const [isNewWeek, setIsNewWeek] = useState(() => checkAndHandleNewWeek());
  const weekId = getCurrentWeekId();
  const skipPollUntil = useRef<number>(0);

  // Poll server for shared state every 4 seconds
  useEffect(() => {
    async function poll() {
      if (Date.now() < skipPollUntil.current) return;
      const data = await fetchSession(weekId);
      if (!data) return;
      if (data.state !== undefined) setState(data.state);
      if (typeof data.sessionNotes === "string") setSessionNotes(data.sessionNotes);
      if (data.sessionInfo) setSessionInfoState((prev) => ({ ...prev, ...data.sessionInfo }));
    }
    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [weekId]);

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible" && checkAndHandleNewWeek()) {
        setIsNewWeek(true);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Persist state locally + push to server; block polling for 3s to avoid race condition
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    skipPollUntil.current = Date.now() + 3000;
    pushSession(weekId, { state, sessionNotes, sessionInfo });
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { window.localStorage.setItem(SESSION_NOTES_KEY, sessionNotes); } catch {}
    skipPollUntil.current = Date.now() + 3000;
    pushSession(weekId, { state, sessionNotes, sessionInfo });
  }, [sessionNotes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { window.localStorage.setItem(SESSION_INFO_KEY, JSON.stringify(sessionInfo)); } catch {}
    skipPollUntil.current = Date.now() + 3000;
    pushSession(weekId, { state, sessionNotes, sessionInfo });
  }, [sessionInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { window.localStorage.setItem(BUMPER_USED_KEY, JSON.stringify([...bumperUsed])); } catch {}
  }, [bumperUsed]);

  useEffect(() => {
    try { window.localStorage.setItem(CUSTOM_BUMPERS_KEY, JSON.stringify(customBumpers)); } catch {}
  }, [customBumpers]);

  const toggleTask = useCallback((taskId: string, completed: boolean) => {
    setState((prev) => ({
      ...prev,
      [taskId]: { completed },
    }));
  }, []);

  const checkAllPhase = useCallback((phaseId: string) => {
    setState((prev) => {
      const newState = { ...prev };
      const phase = getAllPhases().find((p) => p.id === phaseId);
      if (phase) {
        getPhaseTaskIds(phase).forEach((id) => {
          newState[id] = { completed: true };
        });
      }
      return newState;
    });
  }, []);

  const uncheckAllPhase = useCallback((phaseId: string) => {
    setState((prev) => {
      const newState = { ...prev };
      const phase = getAllPhases().find((p) => p.id === phaseId);
      if (phase) {
        getPhaseTaskIds(phase).forEach((id) => {
          newState[id] = { completed: false };
        });
      }
      return newState;
    });
  }, []);

  const resetPhase = useCallback((phaseId: string) => {
    setState((prev) => {
      const newState = { ...prev };
      const phase = getAllPhases().find((p) => p.id === phaseId);
      if (phase) {
        getPhaseTaskIds(phase).forEach((id) => {
          if (newState[id]) newState[id] = { completed: false };
        });
      }
      return newState;
    });
    setCelebratedPhases((prev) => {
      const next = new Set(prev);
      next.delete(phaseId);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setState({});
    setCelebratedPhases(new Set());
    setBumperUsed(new Set());
    setCustomBumpers([]);
  }, []);

  const toggleBumper = useCallback((name: string, used: boolean) => {
    setBumperUsed((prev) => {
      const next = new Set(prev);
      if (used) next.add(name); else next.delete(name);
      return next;
    });
  }, []);

  const resetBumpers = useCallback(() => {
    setBumperUsed(new Set());
  }, []);

  const addCustomBumper = useCallback((name: string) => {
    setCustomBumpers((prev) => prev.includes(name) ? prev : [...prev, name]);
  }, []);

  const removeCustomBumper = useCallback((name: string) => {
    setCustomBumpers((prev) => prev.filter((b) => b !== name));
    setBumperUsed((prev) => { const next = new Set(prev); next.delete(name); return next; });
  }, []);

  const getPhaseProgress = useCallback(
    (phaseId: string) => {
      const phase = getAllPhases().find((p) => p.id === phaseId);
      if (!phase) return { total: 0, completed: 0, percentage: 0 };
      const ids = getPhaseTaskIds(phase);
      const total = ids.length;
      const completed = ids.filter((id) => state[id]?.completed).length;
      return { total, completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
    },
    [state]
  );

  const getRoleProgress = useCallback(
    (roleId: string) => {
      const role = WORKFLOW_ROLES.find((r) => r.id === roleId);
      if (!role) return { total: 0, completed: 0, percentage: 0 };
      const ids = role.phases.flatMap((p) => getPhaseTaskIds(p));
      const total = ids.length;
      const completed = ids.filter((id) => state[id]?.completed).length;
      return { total, completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
    },
    [state]
  );

  const getTotalProgress = useCallback(() => {
    const ids = getAllTaskIds();
    const total = ids.length;
    const completed = ids.filter((id) => state[id]?.completed).length;
    return { total, completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
  }, [state]);

  const getPhasesDoneCount = useCallback(() => {
    return getAllPhases().filter((p) => {
      const ids = getPhaseTaskIds(p);
      return ids.length > 0 && ids.every((id) => state[id]?.completed);
    }).length;
  }, [state]);

  const getTotalPhaseCount = useCallback(() => {
    return getAllPhases().length;
  }, []);

  const getNextIncompleteTask = useCallback(() => {
    for (const role of WORKFLOW_ROLES) {
      for (const phase of role.phases) {
        for (const section of phase.sections) {
          for (const task of section.tasks) {
            if (!state[task.id]?.completed) {
              return { role, phase, task };
            }
          }
        }
      }
    }
    return null;
  }, [state]);

  const setSessionInfo = useCallback((info: Partial<SessionInfo>) => {
    setSessionInfoState((prev) => ({ ...prev, ...info }));
  }, []);

  const markCelebrated = useCallback((phaseId: string) => {
    setCelebratedPhases((prev) => new Set(prev).add(phaseId));
  }, []);

  const exportData = useCallback(() => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      weekId: window.localStorage.getItem(WEEK_KEY) || "",
      state: (() => { try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; } })(),
      sessionNotes: window.localStorage.getItem(SESSION_NOTES_KEY) || "",
      sessionInfo: (() => { try { return JSON.parse(window.localStorage.getItem(SESSION_INFO_KEY) || "null"); } catch { return null; } })(),
      bumperUsed: (() => { try { return JSON.parse(window.localStorage.getItem(BUMPER_USED_KEY) || "[]"); } catch { return []; } })(),
      customBumpers: (() => { try { return JSON.parse(window.localStorage.getItem(CUSTOM_BUMPERS_KEY) || "[]"); } catch { return []; } })(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = (data.sessionInfo as { broadcastDate?: string } | null)?.broadcastDate || new Date().toISOString().split("T")[0];
    a.download = `lmoc-broadcast-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data.state));
        if (typeof data.sessionNotes === "string") window.localStorage.setItem(SESSION_NOTES_KEY, data.sessionNotes);
        if (data.sessionInfo) window.localStorage.setItem(SESSION_INFO_KEY, JSON.stringify(data.sessionInfo));
        if (data.weekId) window.localStorage.setItem(WEEK_KEY, data.weekId);
        if (Array.isArray(data.bumperUsed)) window.localStorage.setItem(BUMPER_USED_KEY, JSON.stringify(data.bumperUsed));
        if (Array.isArray(data.customBumpers)) window.localStorage.setItem(CUSTOM_BUMPERS_KEY, JSON.stringify(data.customBumpers));
        window.location.reload();
      } catch {
        alert("Invalid file. Please select a valid LMOC Broadcast export file.");
      }
    };
    reader.readAsText(file);
  }, []);

  const startNewWeek = useCallback(() => {
    setState({});
    setCelebratedPhases(new Set());
    setSessionNotes("");
    setSessionInfoState({ broadcastDate: nextSaturday(), speakerName: "", tdName: "" });
    setBumperUsed(new Set());
    setCustomBumpers([]);
    window.localStorage.setItem(WEEK_KEY, getCurrentWeekId());
    setIsNewWeek(false);
  }, []);

  const dismissNewWeek = useCallback(() => {
    window.localStorage.setItem(WEEK_KEY, getCurrentWeekId());
    setIsNewWeek(false);
  }, []);

  return {
    state,
    toggleTask,
    checkAllPhase,
    uncheckAllPhase,
    resetPhase,
    resetAll,
    getPhaseProgress,
    getRoleProgress,
    getTotalProgress,
    getPhasesDoneCount,
    getTotalPhaseCount,
    getNextIncompleteTask,
    celebratedPhases,
    markCelebrated,
    sessionNotes,
    setSessionNotes,
    sessionInfo,
    setSessionInfo,
    bumperUsed,
    toggleBumper,
    resetBumpers,
    customBumpers,
    addCustomBumper,
    removeCustomBumper,
    isNewWeek,
    startNewWeek,
    dismissNewWeek,
    exportData,
    importData,
  };
}
