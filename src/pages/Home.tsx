import { useState, useRef } from "react";
import { WORKFLOW_ROLES } from "@/data/workflow";
import { useWorkflow } from "@/hooks/use-workflow";
import { useNotifications } from "@/hooks/use-notifications";
import { PhaseView } from "@/components/PhaseView";
import { SmartBanner } from "@/components/SmartBanner";
import { Countdown } from "@/components/Countdown";
import { Timeline } from "@/components/Timeline";
import { StatsWidget } from "@/components/StatsWidget";
import { SessionNotes } from "@/components/SessionNotes";
import { LiveClock } from "@/components/LiveClock";
import { SessionHeader } from "@/components/SessionHeader";
import { SessionRecap } from "@/components/SessionRecap";
import { BumperListWidget } from "@/components/BumperList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Bell, BellOff, RefreshCw, Download, Upload, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const {
    state,
    toggleTask,
    checkAllPhase,
    uncheckAllPhase,
    resetPhase,
    resetRole,
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
  } = useWorkflow();

  const importRef = useRef<HTMLInputElement>(null);
  const { enabled: notifsEnabled, toggleEnabled: toggleNotifs } = useNotifications();
  const [activeRole, setActiveRole] = useState(WORKFLOW_ROLES[0].id);

  const totalProgress = getTotalProgress();
  const phasesDone = getPhasesDoneCount();
  const totalPhases = getTotalPhaseCount();
  const nextAction = getNextIncompleteTask();

  return (
    <div className="min-h-screen pb-28 relative">
      <div className="max-w-[1380px] mx-auto px-3 sm:px-6 pt-6 sm:pt-8 relative z-10">
        <header className="mb-4 sm:mb-6 text-center space-y-1 sm:space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-primary to-amber-700 text-glow pb-1"
          >
            📡 LMOC Broadcast Team Workflow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-base"
          >
            LMOC Broadcast Production · Saturday Sabbath Service · 11:00 AM CST
          </motion.p>
          <div className="pt-1">
            <LiveClock />
          </div>
        </header>

        {isNewWeek && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel border-l-4 border-l-primary p-4 sm:p-5 rounded-xl shadow-lg mb-4 sm:mb-6"
          >
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-1">New Week Detected</h3>
                <p className="text-[13px] text-muted-foreground mb-1">
                  A new broadcast week has started. Before clearing, export last week's session as a backup.
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mb-3">
                  ⚠ Export first — once you Start Fresh, last week's data is gone.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={exportData} className="text-xs h-8 touch-manipulation border-amber-500/40 text-amber-700 hover:bg-amber-500/10">
                    <Download className="h-3 w-3 mr-1.5" />
                    Export Last Week
                  </Button>
                  <Button size="sm" onClick={startNewWeek} className="text-xs h-8 touch-manipulation">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Start Fresh
                  </Button>
                  <Button size="sm" variant="outline" onClick={dismissNewWeek} className="text-xs h-8 touch-manipulation">
                    Keep Last Week's Data
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <SessionHeader sessionInfo={sessionInfo} onUpdateInfo={setSessionInfo} />

        <SmartBanner />

        <div className="mb-4 sm:mb-6 glass-panel p-4 sm:p-5 rounded-xl">
          <div className="flex justify-between items-center mb-3 gap-3">
            <h3 className="font-semibold tracking-wide text-foreground uppercase text-xs sm:text-sm">
              Overall Progress
            </h3>
            <span className="font-display font-bold text-xl sm:text-2xl text-primary">
              {totalProgress.percentage}%
            </span>
          </div>
          <Progress value={totalProgress.percentage} className="h-2.5 sm:h-3 bg-secondary" />
          <div className="mt-3 flex justify-between items-center gap-2 flex-wrap">
            <button
              onClick={toggleNotifs}
              title={notifsEnabled ? "Disable broadcast notifications" : "Enable broadcast notifications"}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
            >
              {notifsEnabled ? (
                <><Bell className="h-3.5 w-3.5 text-primary" /> Notifications on</>
              ) : (
                <><BellOff className="h-3.5 w-3.5" /> Notifications off</>
              )}
            </button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs h-9 px-2.5 touch-manipulation"
                onClick={exportData}
                title="Export session data as JSON backup"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs h-9 px-2.5 touch-manipulation"
                onClick={() => importRef.current?.click()}
                title="Import a previously exported session"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Import
              </Button>
              <input
                ref={importRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) importData(f); e.target.value = ""; }}
              />
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-9 px-2.5 touch-manipulation"
                onClick={() => {
                  if (confirm("This will permanently clear all tasks, notes, and session data.\n\nTip: Use the Export button first to save a backup.\n\nContinue with Reset All?")) {
                    resetAll();
                  }
                }}
              >
                <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                Reset All
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5">
          <div>
            <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-secondary/50 rounded-xl mb-4 sm:mb-6">
                {WORKFLOW_ROLES.map((role) => {
                  const prog = getRoleProgress(role.id);
                  const isDone = prog.percentage === 100;

                  return (
                    <TabsTrigger
                      key={role.id}
                      value={role.id}
                      className="min-h-[52px] sm:min-h-[56px] px-1.5 sm:px-4 py-2 sm:py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all relative overflow-hidden touch-manipulation"
                    >
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1 relative z-10">
                        <span className="text-base sm:text-lg leading-none">{role.icon}</span>
                        <span className="font-semibold text-[10px] sm:text-xs leading-tight">
                          {role.shortTitle}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] opacity-80">
                          <span>{prog.completed}/{prog.total}</span>
                          {isDone && <span className="text-green-500 data-[state=active]:text-green-900">✓</span>}
                        </div>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {WORKFLOW_ROLES.map((role) => (
                <TabsContent key={role.id} value={role.id} className="focus-visible:outline-none space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 touch-manipulation"
                      onClick={() => {
                        if (confirm(`Reset all ${role.title} tasks?\n\nThis clears your role's sheet on every connected device.`)) {
                          resetRole(role.id);
                        }
                      }}
                    >
                      <RotateCcw className="h-3 w-3 mr-1.5" />
                      Reset {role.shortTitle} Sheet
                    </Button>
                  </div>
                  {role.phases.map((phase) => (
                    <PhaseView
                      key={phase.id}
                      phase={phase}
                      state={state}
                      progress={getPhaseProgress(phase.id)}
                      onToggleTask={toggleTask}
                      onReset={resetPhase}
                      onCheckAll={checkAllPhase}
                      onUncheckAll={uncheckAllPhase}
                      hasCelebrated={celebratedPhases.has(phase.id)}
                      onCelebrate={markCelebrated}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-5">
              <SessionNotes notes={sessionNotes} onChange={setSessionNotes} />
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <Countdown />
            <Timeline />
            <StatsWidget
              completed={totalProgress.completed}
              total={totalProgress.total}
              phasesDone={phasesDone}
              totalPhases={totalPhases}
              percentage={totalProgress.percentage}
              nextAction={nextAction}
            />
            <BumperListWidget
              bumperUsed={bumperUsed}
              onToggle={toggleBumper}
              onReset={resetBumpers}
              customBumpers={customBumpers}
              onAddCustom={addCustomBumper}
              onRemoveCustom={removeCustomBumper}
            />
            <SessionRecap
              state={state}
              sessionInfo={sessionInfo}
              sessionNotes={sessionNotes}
              percentage={totalProgress.percentage}
              phasesDone={phasesDone}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
