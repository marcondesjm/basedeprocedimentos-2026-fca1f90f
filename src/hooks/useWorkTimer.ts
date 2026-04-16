import { useState, useEffect, useRef } from "react";
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

export const useWorkTimer = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [newWO, setNewWO] = useState("");
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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
    }, 100);

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
          vibrate: [300, 100, 300, 100, 300],
        } as any);
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch {}
    }
  };

  const playBeep = () => {
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
  };

  const startContinuousAlarm = (woNumber: string) => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
    }

    playBeep();

    const intervalId = setInterval(() => {
      playBeep();
    }, 2000);

    alarmIntervalRef.current = intervalId;
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
      toast.error("Número de WO inválido", {
        description: "Use apenas dígitos (máximo 20 caracteres).",
      });
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

    const exists = workOrders.some(wo => wo.number === woNumber);
    if (exists) {
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
      number: newWO.trim(),
      elapsedSeconds: 0,
      limitSeconds: 40 * 60,
      isRunning: true,
      hasFinished: false,
      hasWarned: false,
      showGuidance: false,
      startTime: now,
      createdAt: now,
      images: selectedImages,
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
      
      if (!history[dateKey]) {
        history[dateKey] = [];
      }
      
      const isDuplicate = Object.values(history).some((orders: any[]) =>
        orders.some((o: any) => o.wo_number === wo.number)
      );
      if (isDuplicate) {
        toast.warning(`WO ${wo.number} já existe no histórico. Registro ignorado.`);
        return;
      }

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
      toast.success(`WO ${wo.number} salva no histórico!`);
      logActivity("complete", "work_order", wo.number, { title: wo.number, duration: wo.elapsedSeconds });
    } catch (error) {
      toast.error("Erro ao salvar no histórico");
    }
  };

  const removeWorkOrder = (id: string) => {
    const woToRemove = workOrders.find(wo => wo.id === id);
    if (woToRemove?.hasFinished) {
      stopAlarm();
      saveCompletedWorkOrder(woToRemove);
    }
    setWorkOrders(workOrders.filter(wo => wo.id !== id));
    toast.success("WO removida");
  };

  const completeWorkOrder = (id: string) => {
    const woToComplete = workOrders.find(wo => wo.id === id);
    if (!woToComplete) return;

    stopAlarm();
    const totalSeconds = Math.floor((Date.now() - woToComplete.createdAt) / 1000);
    const woWithTime = { ...woToComplete, elapsedSeconds: totalSeconds };
    saveCompletedWorkOrder(woWithTime);

    setWorkOrders(prev => prev.filter(wo => wo.id !== id));
  };

  const toggleTimer = (id: string) => {
    const now = Date.now();
    setWorkOrders(
      workOrders.map((wo) => {
        if (wo.id !== id) return wo;
        
        if (wo.isRunning) {
          const sessionElapsed = wo.startTime ? Math.floor((now - wo.startTime) / 1000) : 0;
          return {
            ...wo,
            isRunning: false,
            elapsedSeconds: wo.elapsedSeconds + sessionElapsed,
            startTime: undefined,
          };
        } else {
          return {
            ...wo,
            isRunning: true,
            startTime: now,
          };
        }
      })
    );
  };

  const silenceAlarm = (id: string) => {
    stopAlarm();
    setWorkOrders(
      workOrders.map((wo) => {
        if (wo.id !== id) return wo;
        return {
          ...wo,
          limitSeconds: wo.limitSeconds + 40 * 60,
          hasFinished: false,
          hasWarned: false,
        };
      })
    );
    toast.success("Alarme silenciado. Próximo alarme em 40 minutos.");
  };

  const addNotaReset = (id: string) => {
    stopAlarm();
    const now = Date.now();
    setWorkOrders(
      workOrders.map((wo) => {
        if (wo.id !== id) return wo;
        const currentElapsed = getElapsed(wo);
        const newNote: NoteEntry = {
          timestamp: now,
          elapsedAtNote: currentElapsed,
        };
        return {
          ...wo,
          elapsedSeconds: 0,
          limitSeconds: 40 * 60,
          isRunning: true,
          hasFinished: false,
          hasWarned: false,
          showGuidance: false,
          startTime: now,
          noteEntries: [...wo.noteEntries, newNote],
        };
      })
    );
    toast.success("Nota adicionada! Timer reiniciado para 40 minutos.");
  };

  const getElapsed = (wo: WorkOrder): number => {
    if (!wo.isRunning || !wo.startTime) return wo.elapsedSeconds;
    const sessionElapsed = Math.floor((Date.now() - wo.startTime) / 1000);
    return wo.elapsedSeconds + sessionElapsed;
  };

  const getTimeRemaining = (wo: WorkOrder): number => {
    return Math.max(0, wo.limitSeconds - getElapsed(wo));
  };

  const getProgress = (wo: WorkOrder) => {
    const elapsed = getElapsed(wo);
    return Math.min(100, (elapsed / wo.limitSeconds) * 100);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    workOrders,
    newWO,
    setNewWO,
    addWorkOrder,
    removeWorkOrder,
    completeWorkOrder,
    toggleTimer,
    silenceAlarm,
    addNotaReset,
    getElapsed,
    getTimeRemaining,
    getProgress,
    formatTime,
  };
};
