import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activityLogger";
import { isValidWONumber } from "@/lib/security";
import { format } from "date-fns";

export interface NoteEntry {
  timestamp: number;
  elapsedAtNote: number;
}

export interface WorkOrder {
  id: string;
  number: string;
  elapsedSeconds: number;
  limitSeconds: number;
  isRunning: boolean;
  hasFinished: boolean;
  hasWarned: boolean;
  showGuidance: boolean;
  startTime?: number;
  createdAt: number;
  images: string[];
  noteEntries: NoteEntry[];
}

interface WorkTimerContextType {
  workOrders: WorkOrder[];
  newWO: string;
  setNewWO: (val: string) => void;
  addWorkOrder: () => void;
  removeWorkOrder: (id: string) => void;
  completeWorkOrder: (id: string) => void;
  toggleTimer: (id: string) => void;
  silenceAlarm: (id: string) => void;
  addNotaReset: (id: string) => void;
  getElapsed: (wo: WorkOrder) => number;
  getTimeRemaining: (wo: WorkOrder) => number;
  getProgress: (wo: WorkOrder) => number;
  formatTime: (seconds: number) => string;
}

const WorkTimerContext = createContext<WorkTimerContextType | undefined>(undefined);

export const WorkTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    try {
      const saved = localStorage.getItem('activeWorkOrders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading activeWorkOrders:", e);
      return [];
    }
  });
  const [newWO, setNewWO] = useState("");
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist workOrders to localStorage
  useEffect(() => {
    localStorage.setItem('activeWorkOrders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setWorkOrders((orders) =>
        orders.map((wo) => {
          if (!wo.isRunning || wo.hasFinished || !wo.startTime) return wo;

          const currentElapsed = wo.elapsedSeconds + Math.floor((now - wo.startTime) / 1000);

          const warnAt = wo.limitSeconds - 300;
          if (currentElapsed >= warnAt && currentElapsed < warnAt + 5 && !wo.hasWarned) {
            toast.warning(`⏰ WO ${wo.number}: Faltam 5 minutos!`, {
              description: "Prepare-se para inserir uma nota no Remedy.",
              duration: 10000,
            });
            return { ...wo, hasWarned: true };
          }

          if (currentElapsed >= wo.limitSeconds && !wo.hasFinished) {
            startContinuousAlarm(wo.number);
            toast.error(`⏰ WO ${wo.number}: 40 minutos atingidos!`, {
              description: "Insira uma nota no Remedy agora!",
              duration: 30000,
            });
            sendBackgroundNotification(wo.number);
            return { ...wo, hasFinished: true };
          }

          return wo;
        })
      );
    }, 1000); // 1s is enough for background checks

    return () => clearInterval(interval);
  }, []);

  const sendBackgroundNotification = (woNumber: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification(`⏰ WO ${woNumber}: 40 minutos!`, {
          body: 'Insira uma nota no Remedy agora!',
          icon: '/icon-192.png',
          tag: `wo-alarm-${woNumber}`,
          requireInteraction: true,
        } as any);
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch {}
    }
  };

  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {}
  };

  const startContinuousAlarm = (woNumber: string) => {
    if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    playBeep();
    alarmIntervalRef.current = setInterval(playBeep, 2000);
  };

  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const addWorkOrder = () => {
    const woNumber = newWO.trim();
    if (!woNumber) {
      toast.error("Digite o número da WO");
      return;
    }

    if (!isValidWONumber(woNumber)) {
      toast.error("Número de WO inválido");
      return;
    }

    const playErrorBeep = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 400; osc.type = "square";
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
      } catch {}
    };

    if (workOrders.some(wo => wo.number === woNumber)) {
      playErrorBeep();
      toast.error("Esta WO já está na lista");
      return;
    }

    try {
      const historyData = localStorage.getItem('workOrderHistory');
      const history = historyData ? JSON.parse(historyData) : {};
      const inHistory = Object.values(history).some((orders: any) =>
        (orders as any[]).some((o: any) => o.wo_number === woNumber)
      );
      if (inHistory) {
        playErrorBeep();
        toast.error("Esta WO já existe no histórico de chamados concluídos!");
        return;
      }
    } catch {}

    const now = Date.now();
    const newOrder: WorkOrder = {
      id: now.toString(),
      number: woNumber,
      elapsedSeconds: 0,
      limitSeconds: 40 * 60,
      isRunning: true,
      hasFinished: false,
      hasWarned: false,
      showGuidance: false,
      startTime: now,
      createdAt: now,
      images: [],
      noteEntries: [],
    };

    setWorkOrders([...workOrders, newOrder]);
    setNewWO("");
    toast.success(`WO ${newOrder.number} adicionada!`);
    logActivity("create", "work_order", newOrder.number, { number: newOrder.number });
  };

  const saveCompletedWorkOrder = (wo: WorkOrder, woNotes?: string) => {
    try {
      const now = new Date();
      const dateKey = format(now, 'yyyy-MM-dd');
      const historyData = localStorage.getItem('workOrderHistory');
      const history = historyData ? JSON.parse(historyData) : {};
      
      if (!history[dateKey]) history[dateKey] = [];
      
      history[dateKey].push({
        id: crypto.randomUUID(),
        wo_number: wo.number,
        started_at: new Date(wo.createdAt).toISOString(),
        completed_at: now.toISOString(),
        total_duration: wo.elapsedSeconds,
        images: wo.images,
        notes: woNotes || null,
        note_entries: wo.noteEntries.length > 0 ? wo.noteEntries : undefined,
      });
      
      localStorage.setItem('workOrderHistory', JSON.stringify(history));
      window.dispatchEvent(new Event('historyUpdated'));
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  const removeWorkOrder = (id: string) => {
    setWorkOrders(prev => prev.filter(wo => wo.id !== id));
    toast.success("WO removida");
  };

  const completeWorkOrder = (id: string) => {
    const wo = workOrders.find(o => o.id === id);
    if (!wo) return;
    stopAlarm();
    const totalSeconds = getElapsed(wo);
    saveCompletedWorkOrder({ ...wo, elapsedSeconds: totalSeconds });
    setWorkOrders(prev => prev.filter(o => o.id !== id));
    toast.success(`WO ${wo.number} concluída!`);
  };

  const toggleTimer = (id: string) => {
    const now = Date.now();
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== id) return wo;
      if (wo.isRunning) {
        return {
          ...wo,
          isRunning: false,
          elapsedSeconds: getElapsed(wo),
          startTime: undefined,
        };
      } else {
        return { ...wo, isRunning: true, startTime: now };
      }
    }));
  };

  const silenceAlarm = (id: string) => {
    stopAlarm();
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== id) return wo;
      return {
        ...wo,
        limitSeconds: wo.limitSeconds + 40 * 60,
        hasFinished: false,
        hasWarned: false,
      };
    }));
  };

  const addNotaReset = (id: string) => {
    stopAlarm();
    const now = Date.now();
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== id) return wo;
      const currentElapsed = getElapsed(wo);
      const newNote: NoteEntry = { timestamp: now, elapsedAtNote: currentElapsed };
      return {
        ...wo,
        elapsedSeconds: 0,
        limitSeconds: 40 * 60,
        isRunning: true,
        hasFinished: false,
        hasWarned: false,
        startTime: now,
        noteEntries: [...wo.noteEntries, newNote],
      };
    }));
    toast.success("Nota registrada! Timer reiniciado.");
  };

  const getElapsed = (wo: WorkOrder): number => {
    if (!wo.isRunning || !wo.startTime) return wo.elapsedSeconds;
    return wo.elapsedSeconds + Math.floor((Date.now() - wo.startTime) / 1000);
  };

  const getTimeRemaining = (wo: WorkOrder): number => Math.max(0, wo.limitSeconds - getElapsed(wo));
  const getProgress = (wo: WorkOrder) => Math.min(100, (getElapsed(wo) / wo.limitSeconds) * 100);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <WorkTimerContext.Provider value={{
      workOrders, newWO, setNewWO, addWorkOrder, removeWorkOrder, completeWorkOrder,
      toggleTimer, silenceAlarm, addNotaReset, getElapsed, getTimeRemaining, getProgress, formatTime
    }}>
      {children}
    </WorkTimerContext.Provider>
  );
};

export const useWorkTimerContext = () => {
  const context = useContext(WorkTimerContext);
  if (!context) throw new Error("useWorkTimerContext must be used within WorkTimerProvider");
  return context;
};
