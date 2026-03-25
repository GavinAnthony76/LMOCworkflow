import { useEffect, useState } from "react";
import { AlertCircle, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function chicagoNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

function formatCSTTime(date: Date): string {
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

type TimingState = {
  message: string;
  icon: React.ReactNode;
  variant: "default" | "warning" | "urgent" | "success";
};

export function SmartBanner() {
  const [timing, setTiming] = useState<TimingState | null>(null);
  const [timeLabel, setTimeLabel] = useState("");

  useEffect(() => {
    const checkTiming = () => {
      const now = chicagoNow();
      const day = now.getDay(); // 0=Sun, 4=Thu, 6=Sat
      const hour = now.getHours();
      const min = now.getMinutes();

      setTimeLabel(formatCSTTime(new Date()));

      if (day === 3) {
        // Wednesday
        if (hour < 21) {
          setTiming({
            message: "It's Wednesday — Graphics prep must be complete by 9:00 PM CST tonight.",
            icon: <Calendar className="h-5 w-5" />,
            variant: "warning",
          });
        } else {
          setTiming({
            message: "Graphics deadline has passed. Ensure all media is imported, ordered, and tested.",
            icon: <AlertCircle className="h-5 w-5" />,
            variant: "urgent",
          });
        }
      } else if (day === 4) {
        // Thursday
        setTiming({
          message: "Graphics prep should be done. Begin rehearsal planning ahead of Friday's 9:00 PM deadline.",
          icon: <Clock className="h-5 w-5" />,
          variant: "default",
        });
      } else if (day === 5) {
        // Friday
        if (hour < 21) {
          setTiming({
            message: "It's Friday — Rehearsal and testing must be complete by 9:00 PM CST tonight.",
            icon: <Calendar className="h-5 w-5" />,
            variant: "warning",
          });
        } else {
          setTiming({
            message: "Rehearsal deadline has passed. All systems should be tested and ready for Saturday.",
            icon: <AlertCircle className="h-5 w-5" />,
            variant: "urgent",
          });
        }
      } else if (day === 6) {
        // Saturday
        if (hour < 11) {
          setTiming({
            message: "Broadcast day! Team arrives at 11:00 AM CST. Prepare your workstation.",
            icon: <Calendar className="h-5 w-5" />,
            variant: "warning",
          });
        } else if (hour === 11) {
          setTiming({
            message: "Setup time — Complete all pre-production tasks before 12:00 PM go-live.",
            icon: <Clock className="h-5 w-5" />,
            variant: "default",
          });
        } else if (hour === 11 && min >= 45) {
          setTiming({
            message: `GO LIVE IN ${60 - min} MINUTES — Final checks: cameras, audio, Restream key.`,
            icon: <AlertCircle className="h-5 w-5 animate-pulse" />,
            variant: "urgent",
          });
        } else if (hour >= 12 && (hour < 16 || (hour === 16 && min <= 15))) {
          setTiming({
            message: "LIVE NOW — Service is on air. Record all cameras + LS6. Manage audio and switching.",
            icon: <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/30" />,
            variant: "urgent",
          });
        } else if (hour >= 16) {
          setTiming({
            message: "Broadcast complete. Great work! Stop all recordings and confirm files are saved.",
            icon: <CheckCircle2 className="h-5 w-5" />,
            variant: "success",
          });
        }
      } else {
        // Sun–Tue
        setTiming({
          message: "Rest and review. Next broadcast prep: Graphics by Wednesday 9 PM, Rehearsal by Friday 9 PM.",
          icon: <CheckCircle2 className="h-5 w-5" />,
          variant: "success",
        });
      }
    };

    checkTiming();
    const interval = setInterval(checkTiming, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!timing) return null;

  const bgColors = {
    default: "bg-secondary/80 border-secondary-border text-secondary-foreground",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
    urgent: "bg-destructive/10 border-destructive/30 text-destructive-foreground",
    success: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
  };

  const borderColors = {
    default: "border-l-secondary",
    warning: "border-l-amber-500",
    urgent: "border-l-destructive",
    success: "border-l-green-500",
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={timing.message}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`glass-panel border-l-4 p-3 sm:p-4 rounded-xl shadow-lg mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 ${bgColors[timing.variant]} ${borderColors[timing.variant]}`}
      >
        <div className="shrink-0">{timing.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[13px] sm:text-base leading-snug">{timing.message}</p>
        </div>
        <div className="text-[10px] sm:text-xs opacity-70 shrink-0 hidden sm:block">
          {timeLabel}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
