import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Upload, Save, Shield, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Procedure, CATEGORIES } from "@/types/procedure";
import type { BackupInfo } from "@/hooks/useProcedures";

import { NewProcedureForm } from "./procedimentos/NewProcedureForm";
import { ProcedureCard } from "./procedimentos/ProcedureCard";
import { ProcedurePagination } from "./procedimentos/ProcedurePagination";

interface ProcedimentosViewProps {
  procedures: Procedure[];
  isLoading: boolean;
  showImportDialog: boolean;
  setShowImportDialog: (v: boolean) => void;
  createProcedure: (p: any) => boolean;
  exportBackup: () => void;
  importBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  moveProcedure: (id: string, cat: string) => void;
  onSelectProcedure: (proc: Procedure) => void;
  touchProcedureDate: (id: string) => Procedure | null;
  lastBackupInfo?: BackupInfo | null;
}

export const ProcedimentosView = ({
  procedures,
  isLoading,
  showImportDialog,
  setShowImportDialog,
  createProcedure,
  exportBackup,
  importBackup,
  moveProcedure,
  onSelectProcedure,
  touchProcedureDate,
  lastBackupInfo,
}: ProcedimentosViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedProcedures, setExpandedProcedures] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isSupervisor = userEmail === "supervisores.hepta@gmail.com";

  const ITEMS_PER_PAGE = 10;
  const ALPHABET = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

  const [newProcedure, setNewProcedure] = useState({
    title: "", description: "", category: "", tags: "", solution: "", createdBy: "",
    pibEquipamento: "", usuarioAtendido: "", workOrder: "", noteType: "procedimento" as any,
    setorDirecionado: "", justificativa: "", possuiProcedimentoBC: "" as any, nomeArquivoBC: "",
  });

  const baseFiltered = procedures.filter((proc) => {
    const matchesSearch =
      proc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      proc.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proc.pibEquipamento && proc.pibEquipamento.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (proc.usuarioAtendido && proc.usuarioAtendido.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || proc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }));

  const availableLetters = new Set(
    baseFiltered.map(p => (p.title.trim()[0] || "").toUpperCase()).filter(c => /[A-Z]/.test(c))
  );

  const filteredProcedures = letterFilter
    ? baseFiltered.filter(p => (p.title.trim()[0] || "").toUpperCase() === letterFilter)
    : baseFiltered;

  const totalPages = Math.max(1, Math.ceil(filteredProcedures.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProcedures = filteredProcedures.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const handleCreateProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    const success = createProcedure(newProcedure);
    if (success) {
      setIsDialogOpen(false);
      setNewProcedure({
        title: "", description: "", category: "", tags: "", solution: "", createdBy: "",
        pibEquipamento: "", usuarioAtendido: "", workOrder: "",
        noteType: "procedimento", setorDirecionado: "", justificativa: "",
        possuiProcedimentoBC: "", nomeArquivoBC: "",
      });
    }
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedProcedures);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedProcedures(next);
  };

  const handleOpenProcedure = (id: string) => {
    const updated = touchProcedureDate(id);
    if (updated) onSelectProcedure(updated);
  };

  return (
    <div className="space-y-6">
      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-5 w-5 text-primary" />
        <AlertDescription className="ml-2">
          <strong>LGPD:</strong> Dados armazenados localmente. Faça backups regulares.
        </AlertDescription>
      </Alert>

      {lastBackupInfo && (
        <Alert className="border-emerald-500/30 bg-emerald-500/5">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <AlertDescription className="ml-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span><strong>Último backup importado:</strong></span>
            <Badge variant="secondary" className="font-mono">v{lastBackupInfo.version}</Badge>
            <span className="text-muted-foreground">
              Gerado em: <strong className="text-foreground">{lastBackupInfo.exportDate !== "desconhecida" ? new Date(lastBackupInfo.exportDate).toLocaleString('pt-BR') : "—"}</strong>
            </span>
            <span className="text-muted-foreground">
              Importado em: <strong className="text-foreground">{new Date(lastBackupInfo.importedAt).toLocaleString('pt-BR')}</strong>
            </span>
            <span className="text-muted-foreground">
              {lastBackupInfo.count} procedimento(s) • <span className="font-mono text-xs">{lastBackupInfo.fileName}</span>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por título, descrição, solução, técnico, PIB, usuário..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0" onClick={() => { setSearchQuery(""); setCurrentPage(1); }}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="lg" onClick={exportBackup} title="Gravar Histórico">
              <Save className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Gravar Histórico</span>
            </Button>
            <Button variant="default" size="lg" onClick={() => document.getElementById('import-file')?.click()} title="Importar Backup">
              <Upload className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Importar Backup</span>
            </Button>
            <input id="import-file" type="file" accept=".json" onChange={importBackup} className="hidden" />
            
            {isSupervisor && (
              <Button title="Novo Procedimento" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Novo</span>
              </Button>
            )}
            
            <NewProcedureForm 
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              newProcedure={newProcedure}
              setNewProcedure={setNewProcedure}
              handleCreateProcedure={handleCreateProcedure}
            />
          </div>
        </div>

        {/* Import Dialog (omitted as it was in parent but not used, wait actually it's controlled from parent but its dialog logic was here) */}
        {/* We can just render the import dialog inline here similar to NewProcedureForm if it's simple, or leave out if `showImportDialog` handles it via `<Dialog>` tag */}
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando procedimentos...</p>
          </div>
        ) : (
          <>
            {/* Alphabet filter bar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 rounded-lg border">
              <button
                type="button"
                onClick={() => { setLetterFilter(null); setCurrentPage(1); }}
                className={`px-2 h-7 text-xs font-medium rounded transition-colors ${
                  letterFilter === null
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Todas
              </button>
              {ALPHABET.map((letter) => {
                const enabled = availableLetters.has(letter);
                const isActive = letterFilter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    disabled={!enabled}
                    onClick={() => { setLetterFilter(letter); setCurrentPage(1); }}
                    className={`w-7 h-7 text-xs font-semibold rounded transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : enabled
                          ? 'text-foreground hover:bg-muted'
                          : 'text-muted-foreground/40 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>{filteredProcedures.length} procedimento(s) • Página {safeCurrentPage} de {totalPages}</span>
              <span>{letterFilter ? `Letra: ${letterFilter}` : 'Ordenado A–Z'}</span>
            </div>
            
            <div className="space-y-1">
              {paginatedProcedures.map((procedure) => (
                <ProcedureCard 
                  key={procedure.id}
                  procedure={procedure}
                  isOpen={expandedProcedures.has(procedure.id)}
                  onToggle={toggleExpand}
                  onOpen={handleOpenProcedure}
                  onMove={moveProcedure}
                />
              ))}
            </div>

            <ProcedurePagination 
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {!isLoading && filteredProcedures.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum procedimento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};
