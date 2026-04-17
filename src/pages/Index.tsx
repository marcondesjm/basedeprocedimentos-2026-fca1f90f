import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { ProcedureDetailDialog } from "@/components/ProcedureDetailDialog";
import { useProcedures } from "@/hooks/useProcedures";
import { useAppVersion } from "@/hooks/useAppVersion";
import { useSecurityGuard } from "@/hooks/useSecurityGuard";
import { useSessionManager } from "@/hooks/useSessionManager";
import { Procedure } from "@/types/procedure";

// Lazy load views for Code Splitting and Performance
const PainelView = lazy(() => import("@/components/views/PainelView").then(module => ({ default: module.PainelView })));
const ProcedimentosView = lazy(() => import("@/components/views/ProcedimentosView").then(module => ({ default: module.ProcedimentosView })));
const FilaRemotaView = lazy(() => import("@/components/views/FilaRemotaView").then(module => ({ default: module.FilaRemotaView })));
const FilaPresencialView = lazy(() => import("@/components/views/FilaPresencialView").then(module => ({ default: module.FilaPresencialView })));
const ChecklistsView = lazy(() => import("@/components/views/ChecklistsView").then(module => ({ default: module.ChecklistsView })));
const ManualView = lazy(() => import("@/components/views/ManualView").then(module => ({ default: module.ManualView })));
const SupervisorMessagesView = lazy(() => import("@/components/views/SupervisorMessagesView").then(module => ({ default: module.SupervisorMessagesView })));
const RobocopyView = lazy(() => import("@/components/views/RobocopyView").then(module => ({ default: module.RobocopyView })));
const FormatacaoView = lazy(() => import("@/components/views/FormatacaoView").then(module => ({ default: module.FormatacaoView })));
const DocumentationPage = lazy(() => import("@/components/DocumentationPage").then(module => ({ default: module.DocumentationPage })));


declare const __APP_VERSION__: string;

import { WorkTimerProvider } from "@/providers/WorkTimerProvider";

const Index = () => {
  const APP_VERSION = String(__APP_VERSION__).replace(/^v/i, '');
  const BUILD_TIMESTAMP = String(__BUILD_TIMESTAMP__);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [activeView, setActiveView] = useState("painel");
  const [viewHistory, setViewHistory] = useState<string[]>(["painel"]);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);

  // Wrap setActiveView to also push browser history
  const handleViewChange = useCallback((view: string) => {
    setActiveView(view);
    setViewHistory(prev => [...prev, view]);
    window.history.pushState({ view }, "", "/");
  }, []);

  // Intercept native back button
  useEffect(() => {
    // Push initial state
    window.history.replaceState({ view: "painel" }, "", "/");

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.view) {
        setActiveView(e.state.view);
        setViewHistory(prev => prev.slice(0, -1));
      } else {
        // If no more view history, push state again to prevent leaving the page
        setActiveView("painel");
        window.history.pushState({ view: "painel" }, "", "/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const {
    procedures, isLoading, showImportDialog, setShowImportDialog,
    createProcedure, updateProcedure, moveProcedure,
    importBackup, exportBackup, touchProcedureDate, lastBackupInfo,
  } = useProcedures();

  const { isAppUpToDate } = useAppVersion(APP_VERSION, BUILD_TIMESTAMP);

  // Security & Session via Custom Hooks to keep Index clean
  useSecurityGuard();
  useSessionManager();

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <WorkTimerProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar activeView={activeView} onViewChange={handleViewChange} />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader currentDateTime={currentDateTime} isAppUpToDate={isAppUpToDate} />

             <main className="flex-1 px-3 py-4 md:px-6 md:py-6 overflow-auto" role="main">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground">Carregando...</div>}>
                {activeView === "painel" && <PainelView />}

                {activeView === "procedimentos" && (
                  <ProcedimentosView
                    procedures={procedures}
                    isLoading={isLoading}
                    showImportDialog={showImportDialog}
                    setShowImportDialog={setShowImportDialog}
                    createProcedure={createProcedure}
                    exportBackup={exportBackup}
                    importBackup={importBackup}
                    moveProcedure={moveProcedure}
                    onSelectProcedure={setSelectedProcedure}
                    touchProcedureDate={touchProcedureDate}
                    lastBackupInfo={lastBackupInfo}
                  />
                )}

                {activeView === "fila-remota" && (
                  <FilaRemotaView procedures={procedures} onSelectProcedure={setSelectedProcedure} touchProcedureDate={touchProcedureDate} />
                )}

                {activeView === "fila-presencial" && (
                  <FilaPresencialView procedures={procedures} onSelectProcedure={setSelectedProcedure} touchProcedureDate={touchProcedureDate} />
                )}

                {activeView === "checklists" && <ChecklistsView />}

                {activeView === "manual" && <ManualView />}

                {activeView === "documentacao" && (
                  <section aria-label="Documentação do sistema"><DocumentationPage /></section>
                )}

                {activeView === "robocopy" && <RobocopyView />}

                {activeView === "formatacao" && <FormatacaoView />}

                {activeView === "mensagens-supervisores" && <SupervisorMessagesView />}
              </Suspense>
            </main>

            <ProcedureDetailDialog
              selectedProcedure={selectedProcedure}
              onClose={() => setSelectedProcedure(null)}
              onUpdate={(proc) => { updateProcedure(proc); setSelectedProcedure(proc); }}
            />
          </div>
        </div>
      </SidebarProvider>
    </WorkTimerProvider>
  );
};

export default Index;
