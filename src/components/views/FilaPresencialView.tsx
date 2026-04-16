import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronDown } from "lucide-react";
import { Procedure, FILA_PRESENCIAL_CATEGORIES } from "@/types/procedure";

import { ConclusaoPresencialForm } from "./fila-presencial-forms/ConclusaoPresencialForm";
import { ConclusaoFormatacaoForm } from "./fila-presencial-forms/ConclusaoFormatacaoForm";
import { ConclusaoImpressoraPresencialForm } from "./fila-presencial-forms/ConclusaoImpressoraPresencialForm";
import { DiagnosticoGenericoForm } from "./fila-presencial-forms/DiagnosticoGenericoForm";
import { DiagnosticoSigesfForm } from "./fila-presencial-forms/DiagnosticoSigesfForm";
import { ImprodutivoPresencialForm } from "./fila-presencial-forms/ImprodutivoPresencialForm";
import { ImprodutivoOutrasPresencialForm } from "./fila-presencial-forms/ImprodutivoOutrasPresencialForm";
import { DevolucaoPresencialForm } from "./fila-presencial-forms/DevolucaoPresencialForm";

interface FilaPresencialViewProps {
  procedures: Procedure[];
  onSelectProcedure: (proc: Procedure) => void;
  touchProcedureDate: (id: string) => Procedure | null;
}

export const FilaPresencialView = ({ procedures, onSelectProcedure, touchProcedureDate }: FilaPresencialViewProps) => {
  const [expandedQueueProcs, setExpandedQueueProcs] = useState<Set<string>>(new Set());

  const toggleQueueProc = (key: string) => {
    const next = new Set(expandedQueueProcs);
    if (next.has(key)) next.delete(key); else next.add(key);
    setExpandedQueueProcs(next);
  };

  const renderAssignedProcedures = (catId: string) => {
    const assigned = procedures.filter(p => p.filaPresencialCategory === catId);
    if (assigned.length === 0) return <p className="text-xs text-muted-foreground mt-1">Nenhum procedimento atribuído</p>;
    const qKey = `presencial-${catId}-list`;
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
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Fila Presencial</h2>
        </div>
        <p className="text-muted-foreground">Procedimentos e orientações para atendimento presencial.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FILA_PRESENCIAL_CATEGORIES.map((cat) => {
            const assignedProcedures = procedures.filter(p => p.filaPresencialCategory === cat.id);
            return (
              <Card key={cat.id} className={`p-4 border-l-4 ${cat.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{cat.label}</h3>
                  <Badge variant="secondary" className="text-xs">{assignedProcedures.length}</Badge>
                </div>
                {renderAssignedProcedures(cat.id)}

                {cat.id === "conclusao-presencial" && <ConclusaoPresencialForm />}
                {cat.id === "conclusao-formatacao" && <ConclusaoFormatacaoForm />}
                {cat.id === "conclusao-impressora-p" && <ConclusaoImpressoraPresencialForm />}
                {cat.id === "diagnostico-generico" && <DiagnosticoGenericoForm />}
                {cat.id === "diagnostico-sigesf" && <DiagnosticoSigesfForm />}
                {cat.id === "improdutivo-presencial" && <ImprodutivoPresencialForm />}
                {cat.id === "improdutivo-outras-p" && <ImprodutivoOutrasPresencialForm />}
                {cat.id === "devolucao-presencial" && <DevolucaoPresencialForm />}
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
