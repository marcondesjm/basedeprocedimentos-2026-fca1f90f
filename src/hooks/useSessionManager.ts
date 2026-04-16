import { useEffect } from "react";
import { toast } from "sonner";

export const useSessionManager = () => {
  useEffect(() => {
    const lastSessionTs = localStorage.getItem('app_session_ts');
    const now = Date.now();
    // Only treat as new session if more than 30 minutes have passed (or first ever visit)
    const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
    const isNewSession = !lastSessionTs || (now - Number(lastSessionTs)) > SESSION_TIMEOUT_MS;

    if (isNewSession) {
      const hadHistory = localStorage.getItem('workOrderHistory');
      const hadArchive = localStorage.getItem('workOrderArchive');
      const hadLogs = localStorage.getItem('activity_logs_local');
      
      if (hadHistory || hadArchive || hadLogs) {
        localStorage.removeItem('workOrderHistory');
        localStorage.removeItem('workOrderArchive');
        localStorage.removeItem('activity_logs_local');
        window.dispatchEvent(new CustomEvent('session_data_cleared'));
        window.dispatchEvent(new CustomEvent('activity_log_updated'));
        toast.warning('📋 Nova sessão detectada — históricos e logs foram limpos.', { 
          description: 'Lembre-se de importar seu backup e salvar logs antes de fechar.', 
          duration: 8000 
        });
      }
    }
    localStorage.setItem('app_session_ts', String(now));

    // Keep timestamp fresh while app is open
    const keepAlive = setInterval(() => {
      localStorage.setItem('app_session_ts', String(Date.now()));
    }, 60_000);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasHistory = localStorage.getItem('workOrderHistory');
      const hasLogs = localStorage.getItem('activity_logs_local');
      const hasArchive = localStorage.getItem('workOrderArchive');
      if (hasHistory || hasLogs || hasArchive) {
        e.preventDefault();
        e.returnValue = '⚠️ Você tem histórico e logs não salvos! Salve antes de sair.';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(keepAlive);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
