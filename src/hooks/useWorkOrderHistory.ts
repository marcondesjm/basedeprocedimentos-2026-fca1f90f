import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export interface NoteEntry {
  timestamp: number;
  elapsedAtNote: number;
}

export interface CompletedWO {
  id: string;
  wo_number: string;
  started_at?: string;
  completed_at: string;
  total_duration: number;
  images: string[];
  notes: string | null;
  note_entries?: NoteEntry[];
}

export interface HistoryByDate {
  [date: string]: CompletedWO[];
}

export const useWorkOrderHistory = () => {
  const [historyByDate, setHistoryByDate] = useState<HistoryByDate>({});
  const [archivedByDate, setArchivedByDate] = useState<HistoryByDate>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    loadArchive();

    const handleHistoryUpdate = () => {
      loadHistory();
    };

    const handleSessionCleared = () => {
      loadHistory();
      loadArchive();
    };

    window.addEventListener('historyUpdated', handleHistoryUpdate);
    window.addEventListener('session_data_cleared', handleSessionCleared);
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
      window.removeEventListener('session_data_cleared', handleSessionCleared);
    };
  }, []);

  const loadHistory = () => {
    try {
      const historyData = localStorage.getItem('workOrderHistory');
      const history = historyData ? JSON.parse(historyData) : {};
      setHistoryByDate(history);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  };

  const loadArchive = () => {
    try {
      const archiveData = localStorage.getItem('workOrderArchive');
      const archive = archiveData ? JSON.parse(archiveData) : {};
      setArchivedByDate(archive);
    } catch (error) {
      console.error("Error loading archive:", error);
    }
  };

  const toggleDayState = (storageKey: string, setFunc: any, parseFunc: any, dateKey: string) => {
    // Helper function if needed
  };

  const archiveOrder = (dateKey: string, orderId: string) => {
    try {
      const historyData = localStorage.getItem('workOrderHistory');
      const history = historyData ? JSON.parse(historyData) : {};
      const archiveData = localStorage.getItem('workOrderArchive');
      const archive = archiveData ? JSON.parse(archiveData) : {};

      const order = history[dateKey]?.find((wo: CompletedWO) => wo.id === orderId);
      if (!order) return;

      if (!archive[dateKey]) archive[dateKey] = [];
      archive[dateKey].push(order);

      history[dateKey] = history[dateKey].filter((wo: CompletedWO) => wo.id !== orderId);
      if (history[dateKey].length === 0) delete history[dateKey];

      localStorage.setItem('workOrderHistory', JSON.stringify(history));
      localStorage.setItem('workOrderArchive', JSON.stringify(archive));
      setHistoryByDate(history);
      setArchivedByDate(archive);
      toast.success("Chamado arquivado!");
    } catch (error) {
      toast.error("Erro ao arquivar chamado");
    }
  };

  const archiveDay = (dateKey: string) => {
    try {
      const historyData = localStorage.getItem('workOrderHistory');
      const history = historyData ? JSON.parse(historyData) : {};
      const archiveData = localStorage.getItem('workOrderArchive');
      const archive = archiveData ? JSON.parse(archiveData) : {};

      const orders = history[dateKey];
      if (!orders || orders.length === 0) return;

      if (!archive[dateKey]) archive[dateKey] = [];
      archive[dateKey].push(...orders);

      delete history[dateKey];

      localStorage.setItem('workOrderHistory', JSON.stringify(history));
      localStorage.setItem('workOrderArchive', JSON.stringify(archive));
      setHistoryByDate(history);
      setArchivedByDate(archive);
      toast.success(`Dia arquivado com ${orders.length} chamado(s)!`);
    } catch (error) {
      toast.error("Erro ao arquivar dia");
    }
  };

  const restoreDay = (dateKey: string) => {
    try {
      const historyData = localStorage.getItem('workOrderHistory');
      const history = historyData ? JSON.parse(historyData) : {};
      const archiveData = localStorage.getItem('workOrderArchive');
      const archive = archiveData ? JSON.parse(archiveData) : {};

      const orders = archive[dateKey];
      if (!orders || orders.length === 0) return;

      if (!history[dateKey]) history[dateKey] = [];
      history[dateKey].push(...orders);

      delete archive[dateKey];

      localStorage.setItem('workOrderHistory', JSON.stringify(history));
      localStorage.setItem('workOrderArchive', JSON.stringify(archive));
      setHistoryByDate(history);
      setArchivedByDate(archive);
      toast.success(`Dia restaurado com ${orders.length} chamado(s)!`);
    } catch (error) {
      toast.error("Erro ao restaurar dia");
    }
  };

  const restoreOrder = (dateKey: string, orderId: string) => {
    try {
      const historyData = localStorage.getItem('workOrderHistory');
      const history = historyData ? JSON.parse(historyData) : {};
      const archiveData = localStorage.getItem('workOrderArchive');
      const archive = archiveData ? JSON.parse(archiveData) : {};

      const order = archive[dateKey]?.find((wo: CompletedWO) => wo.id === orderId);
      if (!order) return;

      if (!history[dateKey]) history[dateKey] = [];
      history[dateKey].push(order);

      archive[dateKey] = archive[dateKey].filter((wo: CompletedWO) => wo.id !== orderId);
      if (archive[dateKey].length === 0) delete archive[dateKey];

      localStorage.setItem('workOrderHistory', JSON.stringify(history));
      localStorage.setItem('workOrderArchive', JSON.stringify(archive));
      setHistoryByDate(history);
      setArchivedByDate(archive);
      toast.success("Chamado restaurado ao histórico!");
    } catch (error) {
      toast.error("Erro ao restaurar chamado");
    }
  };

  const deleteOrder = (dateKey: string, orderId: string, fromArchive = false) => {
    try {
      const storageKey = fromArchive ? 'workOrderArchive' : 'workOrderHistory';
      const data = localStorage.getItem(storageKey);
      const parsed = data ? JSON.parse(data) : {};

      if (parsed[dateKey]) {
        parsed[dateKey] = parsed[dateKey].filter((wo: CompletedWO) => wo.id !== orderId);
        if (parsed[dateKey].length === 0) delete parsed[dateKey];
        localStorage.setItem(storageKey, JSON.stringify(parsed));

        if (fromArchive) {
          setArchivedByDate(parsed);
        } else {
          setHistoryByDate(parsed);
        }
        toast.success("Chamado removido");
      }
    } catch (error) {
      toast.error("Erro ao remover chamado");
    }
  };

  const exportBackup = () => {
    try {
      const dataStr = JSON.stringify({ history: historyByDate, archive: archivedByDate }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_historico_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Backup exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar backup");
    }
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        const importedHistory = importedData.history || importedData;
        const importedArchive = importedData.archive || {};

        const mergedHistory = { ...historyByDate };
        Object.keys(importedHistory).forEach(dateKey => {
          if (mergedHistory[dateKey]) {
            mergedHistory[dateKey] = [...mergedHistory[dateKey], ...importedHistory[dateKey]];
          } else {
            mergedHistory[dateKey] = importedHistory[dateKey];
          }
        });

        const mergedArchive = { ...archivedByDate };
        Object.keys(importedArchive).forEach(dateKey => {
          if (mergedArchive[dateKey]) {
            mergedArchive[dateKey] = [...mergedArchive[dateKey], ...importedArchive[dateKey]];
          } else {
            mergedArchive[dateKey] = importedArchive[dateKey];
          }
        });
        
        localStorage.setItem('workOrderHistory', JSON.stringify(mergedHistory));
        localStorage.setItem('workOrderArchive', JSON.stringify(mergedArchive));
        setHistoryByDate(mergedHistory);
        setArchivedByDate(mergedArchive);
        toast.success("Backup importado com sucesso!");
      } catch (error) {
        toast.error("Erro ao importar backup");
      }
    };
    reader.readAsText(file);
  };

  return {
    historyByDate,
    archivedByDate,
    loading,
    archiveOrder,
    archiveDay,
    restoreDay,
    restoreOrder,
    deleteOrder,
    exportBackup,
    importBackup
  };
};
