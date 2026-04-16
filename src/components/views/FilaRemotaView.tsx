import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, ChevronDown } from "lucide-react";
import { Procedure, FILA_REMOTA_CATEGORIES } from "@/types/procedure";

import { ConclusaoRemotoForm } from "./fila-remota-forms/ConclusaoRemotoForm";
import { ConclusaoImpressoraForm } from "./fila-remota-forms/ConclusaoImpressoraForm";
import { ConclusaoCompartilhamentoForm } from "./fila-remota-forms/ConclusaoCompartilhamentoForm";
import { DiagnosticoRemotoForm } from "./fila-remota-forms/DiagnosticoRemotoForm";
import { DevolucaoRemotoForm } from "./fila-remota-forms/DevolucaoRemotoForm";
import { ImprodutivoRemotoForm } from "./fila-remota-forms/ImprodutivoRemotoForm";
import { ImprodutivoOutrasForm } from "./fila-remota-forms/ImprodutivoOutrasForm";

interface FilaRemotaViewProps {
  procedures: Procedure[];
  onSelectProcedure: (proc: Procedure) => void;
  touchProcedureDate: (id: string) => Procedure | null;
}

export const FilaRemotaView = ({ procedures, onSelectProcedure, touchProcedureDate }: FilaRemotaViewProps) => {
  const [expandedQueueProcs, setExpandedQueueProcs] = useState<Set<string>>(new Set());

  const toggleQueueProc = (key: string) => {
    const next = new Set(expandedQueueProcs);
    if (next.has(key)) next.delete(key); else next.add(key);
    setExpandedQueueProcs(next);
  };

  const renderAssignedProcedures = (catId: string) => {
    const assigned = procedures.filter(p => p.filaRemotaCategory === catId);
    if (assigned.length === 0) return <p className="text-xs text-muted-foreground mt-1">Nenhum procedimento atribuído</p>;
    const qKey = `remota-${catId}-list`;
    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors rounded text-sm" onClick={() => toggleQueueProc(qKey)}>
          <ChevronDown className={`w-3 h-3 text-muted-foreground shrink-0 transition-transform ${expandedQueueProcs.has(qKey) ? 'rotate-0' : '-rotate-90'}`} />
          <span className="text-xs font-medium text-foreground">Procedimentos</span>
        </div>
        {expandedQueueProcs.has(qKey) && (
          <div className="space-y-1 mt-1 pl-5">
            {assigned.map((proc) => (
              <div key={proc.id} className="px-2 py-1 rounded text-xs cursor-pointer hover:bg-muted/50 transition-colors border border-border/30"
                onClick={() => { const u = touchProcedureDate(proc.id); if (u) onSelectProcedure(u); }}>
                <p className="font-medium text-foreground">{proc.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };



  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Monitor className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Fila Remota</h2>
        </div>
        <p className="text-muted-foreground">Procedimentos e orientações para atendimento remoto.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FILA_REMOTA_CATEGORIES.map((cat) => {
            const assignedProcedures = procedures.filter(p => p.filaRemotaCategory === cat.id);
            return (
              <Card key={cat.id} className={`p-4 border-l-4 ${cat.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{cat.label}</h3>
                  <Badge variant="secondary" className="text-xs">{assignedProcedures.length}</Badge>
                </div>
                {renderAssignedProcedures(cat.id)}

                {cat.id === "conclusao-remoto" && <ConclusaoRemotoForm />}
                {cat.id === "conclusao-impressora" && <ConclusaoImpressoraForm />}
                {cat.id === "conclusao-compartilhamento" && <ConclusaoCompartilhamentoForm />}
                {cat.id === "diagnostico-remoto" && <DiagnosticoRemotoForm />}
                {cat.id === "devolucao-remoto-presencial" && <DevolucaoRemotoForm />}
                {cat.id === "improdutivo-remoto" && <ImprodutivoRemotoForm />}
                {cat.id === "improdutivo-outras" && <ImprodutivoOutrasForm />}
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
